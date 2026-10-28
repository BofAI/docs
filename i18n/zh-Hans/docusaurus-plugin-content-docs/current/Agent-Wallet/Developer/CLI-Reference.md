# CLI 命令行手册

`agent-wallet` 3.x 全部命令的完整参考。无论是查阅基础用法，还是配置自动化脚本，都能在这里找到答案。

:::tip 刚开始？
如果你还没有创建钱包，请先去 [快速开始](../QuickStart.md)。
:::

```
Usage: agent-wallet <command> [options]

Commands:
  start             Quick setup: init + configure wallet
  add               Add a wallet configuration
  list              List all configured wallets
  use [id]          Set the active wallet
  inspect <id>      Show wallet details
  resolve-address [id]  Resolve wallet addresses
  remove [id]       Remove a wallet
  sign              Sign transactions or typed data
  reset             Delete all wallet data
```

所有命令都支持 `--dir, -d <path>`（钱包目录，默认 `~/.agent-wallet`，设置了 `AGENT_WALLET_DIR` 时以它为准）和 `--help, -h`。在任意命令或子命令后加 `-h`——例如 `agent-wallet start wallet_cli -h`——即可查看它的确切参数。

:::caution 3.0 中已移除
`init`、`change-password`、`sign msg`、`local_secure` 钱包类型，以及 `-p/--password`、`--save-runtime-secrets` 参数都已不存在；`-g/--generate` 仍会被解析但被忽略——3.x 不生成私钥。Agent-wallet 3.x 没有主密码，也不生成私钥。
:::

---

## 基础命令

### `agent-wallet start`（创建钱包并设为激活）

```bash
agent-wallet start                       # 交互式：选择钱包类型
agent-wallet start <raw_secret|privy|wallet_cli> [options]
```

按需创建钱包目录，添加一个钱包，并把它设为**激活**钱包。如果已存在钱包，`start` 会先询问要 `add`（再加一个）还是 `exit`；传 `--override` 可跳过这个询问。

把钱包类型作为子命令写出来可以跳过类型选择。在 CI 或后台服务中，还要传 `-w` 以及所有凭据参数——缺少时 CLI 会弹出提示，而在非交互环境中提示会直接失败。如果可能已有钱包，还要传 `--override`；否则无法询问 add/exit，`start` 会以退出码 1 结束。

| 参数 | 适用于 | 说明 |
| :--- | :--- | :--- |
| `-w, --wallet-id <id>` | 全部 | 要创建的钱包 ID。提示中的默认值：`default_raw`、`default_privy`、`default_cli` |
| `--override` | 仅 `start` | 已有钱包时跳过"已初始化"提示 |
| `-k, --private-key <hex>` | `raw_secret` | 导入十六进制私钥 |
| `-m, --mnemonic <words>` | `raw_secret` | 导入 BIP-39 助记词 |
| `-mi, --mnemonic-index <n>` | `raw_secret` | 助记词账户索引（默认 `0`；需要同时传 `-m`） |
| `--derive-as <profile>` | `raw_secret` | `eip155` 或 `tron`；用于回答助记词派生方式的提示（3.0.0 会校验取值但不保存，因此不影响派生出的地址） |
| `--app-id <id>` | `privy` | Privy app ID |
| `--app-secret <secret>` | `privy` | Privy app secret（明文；建议改用 `--app-secret-exec`） |
| `--app-secret-exec <path>` | `privy` | 输出 Privy app secret 的可执行脚本 |
| `--privy-wallet-id <id>` | `privy` | 已有的 Privy 钱包 ID |
| `--account <label>` | `wallet_cli` | 已有的 wallet-cli 账户标签或 ID（省略时使用 wallet-cli 当前激活账户） |
| `--cli-password-exec <path>` | `wallet_cli` | 输出 wallet-cli keystore 密码的可执行脚本 |
| `-d, --dir <path>` | 全部 | 钱包目录 |

#### `wallet_cli` 钱包

把已有的 [wallet-cli](../../wallet-cli/quickstart.md) 账户连结为 TRON + EVM 签名器。**它不会创建或导入私钥**——请先用 wallet-cli 创建账户。

```bash
agent-wallet start wallet_cli \
  --wallet-id my_cli_wallet \
  --account main-1 \
  --cli-password-exec /absolute/path/to/fetch-password.sh
```

- 需要 `@tron-walletcli/wallet-cli` `>=4.13.0 <5.0.0`。Agent-wallet 按以下顺序查找：`AGENT_WALLET_WALLET_CLI_PATH`、与 Agent-wallet 一起作为本地包依赖安装的副本，最后是 `PATH` 中的 `wallet-cli`。找不到时命令会打印安装指引并以 1 退出。
- 在收集任何密码**之前**，会先向 wallet-cli 确认账户存在；保存的是规范账户 ID，之后 wallet-cli 切换激活账户也不会影响这个钱包。
- `--cli-password <明文>` 会被拒绝，避免密码进入 shell 历史或进程列表。不带 `--cli-password-exec` 时，交互提示会让你选择 `direct`（以明文保存在 `wallets_config.json`，权限 `0600`）或 `exec`。

#### Privy 钱包 {#privy-wallets}

连结已有的 [Privy](https://privy.io) 服务端钱包。你的磁盘上不保存私钥；签名会调用 Privy API，因此需要联网。

```bash
agent-wallet start privy -w default_privy \
  --app-id <privy-app-id> \
  --app-secret-exec /absolute/path/to/fetch-privy-secret.sh \
  --privy-wallet-id <privy-wallet-id>
```

#### `raw_secret` 钱包

:::danger 真实资金请勿使用 `raw_secret`
该类型把你的私钥或助记词**不加密**地保存在 `wallets_config.json` 中——任何有文件系统访问权限的程序都能直接读取。只在隔离的测试环境中配合一次性私钥使用。
:::

```bash
agent-wallet start raw_secret -w default_raw -k <private-key-hex>
agent-wallet start raw_secret -w default_raw -m "word1 word2 ..." --derive-as eip155
```

### `agent-wallet add`（再添加一个钱包）

```bash
agent-wallet add
agent-wallet add <raw_secret|privy|wallet_cli> [options]
```

子命令和参数与 `start` 相同（`--override` 除外）。只有在此前没有激活钱包时，新钱包才会成为激活钱包；切换请用 `use`。

### `agent-wallet sign`（核心签名操作）

```bash
agent-wallet sign tx '<json>' -n <network> [-w <wallet-id>]
agent-wallet sign typed-data '<json>' -n <network> [-w <wallet-id>]
```

| 参数 | 缩写 | 说明 |
| :--- | :--- | :--- |
| `--network` | `-n` | 规范 CAIP-2 网络：`eip155:<chainId>` 或 `tron:<chainId>`。**`raw_secret` 和 `wallet_cli` 必填。** `privy` 可省略（EVM 交易使用 payload 中的 `chainId`），但如果提供也必须是规范格式 |
| `--wallet-id` | `-w` | 用哪个钱包签名（默认为激活钱包） |
| `--dir` | `-d` | 钱包目录 |

只接受精确的规范标识——`tron`、`eip155`、`evm:1`、`tron:nile`、`tron:mainnet`、十六进制 TRON id，以及任何大小写或空白变体都会被拒绝。请使用 `tron:728126428`（主网）、`tron:3448148188`（Nile）、`tron:2494104990`（Shasta）、`eip155:1`、`eip155:56`、`eip155:97` 等。`wallet_cli` 钱包还要求该网络是 wallet-cli 自身认识的网络——即它的内置网络（`eip155:1`、`eip155:11155111`、`eip155:56`、`eip155:97`、`eip155:8453`、`eip155:84532`（Base 自 wallet-cli 4.14.0 起才内置）及三个 TRON 网络），或在 wallet-cli 自己的配置中添加的网络——否则签名会以 `wallet-cli network '<id>' is unavailable` 失败（SDK 中的 code 为 `network_mismatch`）。`raw_secret` 和 `privy` 钱包没有这一限制。

**签名 TRON 交易**（先通过 TronGrid 等构建未签名交易；必须包含 `raw_data_hex`，`wallet_cli` 钱包还需要 `raw_data` 和匹配的 `txID`）：
```bash
agent-wallet sign tx '{"txID":"...","raw_data_hex":"0a02...","raw_data":{}}' -n tron:3448148188
# 输出："Signed tx:" 后跟格式化的已签名交易 JSON
```

**签名 EVM 交易**（`chainId` 应与 `-n` 一致；`wallet_cli` 钱包会以 `SigningError` 拒绝不一致的情况，`raw_secret` 和 `privy` 则按 payload 中的 `chainId` 签名）：
```bash
agent-wallet sign tx '{"chainId":97,"nonce":0,"gas":"0x5208","gasPrice":"0x3b9aca00","to":"0x...","value":"0x0"}' -n eip155:97
# 输出：Signed tx: <原始交易 hex，不带 0x>
```

**签名 EIP-712 / TIP-712 结构化数据：**
```bash
agent-wallet sign typed-data '{
  "types": {
    "EIP712Domain": [{"name":"name","type":"string"},{"name":"chainId","type":"uint256"}],
    "Transfer": [{"name":"to","type":"address"},{"name":"amount","type":"uint256"}]
  },
  "primaryType": "Transfer",
  "domain": {"name":"MyDApp","chainId":1},
  "message": {"to":"0x7099...","amount":1000000}
}' -n eip155:1
# 输出：Signature: <hex，不带 0x>
```

:::note 不支持消息签名
`sign msg` 已在 3.0 中移除。Agent-wallet 只签名交易和结构化数据。
:::

---

## 钱包管理

管理多个钱包——添加、切换、查看、删除。

**列出所有钱包**（`*` 标记激活钱包）：
```bash
agent-wallet list
```

**切换激活钱包**（省略 ID 时从列表中选择）：
```bash
agent-wallet use my-bsc-wallet
```

**查看钱包详情**（敏感信息始终显示为 `[redacted]`）：
```bash
agent-wallet inspect my-bsc-wallet
```

**用指定钱包签名**（不切换激活钱包）：
```bash
agent-wallet sign typed-data '<json>' -n eip155:56 -w my-bsc-wallet
```

**删除钱包**（省略 ID 时从列表中选择）：
```bash
agent-wallet remove my-bsc-wallet
```

| 参数 | 缩写 | 说明 |
| :--- | :--- | :--- |
| `--yes` | `-y` | 跳过确认提示（**在非交互 / 代理环境中必须使用**） |

删除 `wallet_cli` 或 `privy` 钱包只会删除 Agent-wallet 中的配置条目——wallet-cli 账户或 Privy 钱包本身不受影响。

### `agent-wallet resolve-address`（解析钱包地址）

不签名，只显示钱包对应的链上地址：

- `raw_secret` 钱包显示由同一份密钥材料派生出的 EVM 和 TRON 两个地址。
- `wallet_cli` 钱包在 wallet-cli 账户同时拥有两条链地址时显示两个地址（否则显示一个），不会索要密码。
- `privy` 钱包显示 Privy 返回的单个地址。

```bash
agent-wallet resolve-address my-wallet
```

省略钱包 ID 时，CLI 会给出交互式列表供你选择。

输出示例：
```
Wallet  my-wallet
Type    raw_secret

Addresses
EVM   0x742D35CC6634C0532925a3B844Bc9E7595F2bD18
TRON  TJRyWwFs9wTFGZg3JbrVriFbNfCug5tDeC
```

---

## 非交互式执行（适用于自动化和后台服务）

3.x 没有需要提供的主密码。要做到全程无提示运行：

- **创建钱包：** 写出钱包类型，并用参数提供所有值（`-w`、`-k`/`-m` 加 `--derive-as`、`--app-id`/`--privy-wallet-id`、`--account`）。使用 `start` 时，如果可能已有钱包，再加 `--override`——否则会以退出码 1 结束。`privy` 要**同时**传 `--app-id` 和 `--app-secret-exec`（或 `--app-secret`）：已有 Privy 钱包、且 `--app-id` 和 `--app-secret` 都没传时（只传 `--app-secret-exec` 不算），CLI 会询问是否复用已有凭据；传了 `--app-id` 但没传 secret 时则询问 secret 的来源。非交互环境下这两种提示都会以退出码 1 结束。
- **密钥类凭据：** 使用 exec 脚本——wallet-cli 用 `--cli-password-exec`，Privy 用 `--app-secret-exec`。路径必须指向一个可执行文件（不是内联 shell 命令）。脚本继承进程环境变量，其 stdout 去除首尾空白后作为凭据，默认 10 秒超时。对于 `wallet_cli`，脚本会在**每次**签名时重新执行。
- **签名：** 始终传 `-n`；如果不想依赖激活钱包，再加 `-w`。
- **删除 / 重置：** 传 `-y`。
- **检查参数拼写：** CLI 会直接忽略无法识别的参数而不报错，拼错的参数（例如 `--walet-id`）会静默退回到提示或默认值。

`wallets_config.json` 包含 `active_wallet` 和以钱包 ID 为键的 `wallets`；每个条目有 `type` 和 `params`：`raw_secret` 为 `source`（`private_key`，或 `mnemonic` 加 `account_index`）；`privy` 为 `app_id`、`app_secret`、`wallet_id`；`wallet_cli` 为 `account`（可选）和 `password`。`app_secret` 和 `password` 可以是字符串，也可以是 exec 引用（`private_key` 和 `mnemonic` 只能是字符串）（`timeout` 以毫秒为单位，可选）：

```json
{ "exec": "/absolute/path/to/fetch-password.sh", "timeout": 10000 }
```

### 自定义存储目录

所有命令都支持 `--dir`，用来指定 `~/.agent-wallet` 以外的钱包目录。设置 `AGENT_WALLET_DIR` 可以让它成为 CLI 和 SDK 的默认目录：

```bash
agent-wallet start raw_secret --dir /Volumes/MyUSB/agent-wallet
agent-wallet list --dir /Volumes/MyUSB/agent-wallet
```

### 环境变量

| 变量 | 用途 |
| :--- | :--- |
| `AGENT_WALLET_DIR` | 默认钱包目录（CLI 和 SDK） |
| `AGENT_WALLET_WALLET_CLI_PATH` | wallet-cli 不在 `PATH` 中时，指定其可执行文件或 JavaScript 入口的路径 |
| `AGENT_WALLET_PRIVATE_KEY` / `AGENT_WALLET_MNEMONIC` / `AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX` | 仅用于 SDK 的环境变量回退（没有配置任何钱包时才使用）——参见 [SDK 接入指南](./SDK-Guide.md#environment-variable-fallback) |

---

## 危险操作

:::danger 以下操作不可逆，请务必谨慎！
:::

<a id="agent-wallet-reset"></a>

### `agent-wallet reset`（重置所有数据） {#agent-wallet-reset-reset-all-data}

删除钱包目录中的 `wallets_config.json`——所有钱包配置，包括其中保存的 `raw_secret` 私钥，都会被删除。目录中的其他文件保持不动。wallet-cli 账户和 Privy 钱包本身不受影响。CLI 会**两次**确认；在自动化中传 `-y/--yes` 跳过两次提示。

```bash
agent-wallet reset
```

---

## 实战示例：在 Shell 脚本中签名

下面的最小示例在 Bash 脚本中执行一次非交互式结构化数据签名，并把结果存进变量。CLI 输出 `Signature: <hex>`，脚本会去掉前缀，并检查剩下的是不是 130 位十六进制签名。这里特意不用管道接 `sed`：管道的退出状态取最后一个命令，签名失败也会被当成成功。

```bash
#!/bin/bash
# 严格模式：出错、使用未定义变量、管道中任一命令失败时都立即停止
set -euo pipefail

# 要签名的结构化数据（由你自己的逻辑构建）
TYPED_DATA='{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"chainId","type":"uint256"}],"Message":[{"name":"contents","type":"string"}]},"primaryType":"Message","domain":{"name":"MyScript","chainId":56},"message":{"contents":"Hello from my script"}}'

echo "正在调用本地 Agent-wallet 签名..."

# 签名失败时 CLI 以非零码退出，并输出原因（如 "Wallet 'my-bsc-wallet' not found"）
if ! OUTPUT=$(agent-wallet sign typed-data "$TYPED_DATA" -n eip155:56 -w my-bsc-wallet); then
  echo "❌ 签名失败：$OUTPUT" >&2
  exit 1
fi

SIGNATURE=${OUTPUT#Signature: }
if [[ ! "$SIGNATURE" =~ ^[0-9a-fA-F]{130}$ ]]; then
  echo "❌ 输出不符合预期：$OUTPUT" >&2
  exit 1
fi

echo "✅ 签名成功！"
echo "提取到的签名：$SIGNATURE"
```

---

## 下一步

- 刚接触？ → [快速开始](../QuickStart.md)
- 要自己写代理？ → [SDK 接入指南](./SDK-Guide.md)
- 想找现成代码？ → [完整代码示例](./SDK-Cookbook.md)
- 常见问题 → [常见问题](../FAQ.md)
