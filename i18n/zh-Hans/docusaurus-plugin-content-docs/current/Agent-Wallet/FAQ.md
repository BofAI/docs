# 常见问题

先回答你最担心的几件事，再聊日常使用的细节。

---

## 💰 AI 会不会把我的钱包掏空？

最好的保护是限制风险敞口：**专门给 AI 代理建一个钱包**，只充进它实际需要的少量资金（比如够付 Gas 就行）。你的主钱包和大额资产完全不碰。最坏情况下，损失也仅限于这个小额代理钱包里的钱。

```bash
# 为代理创建专用的 wallet-cli 账户，然后连结它
wallet-cli create --label agent-small -o json
agent-wallet add wallet_cli --wallet-id agent_small --account agent-small \
  --cli-password-exec /absolute/path/to/fetch-password.sh
```

使用 `wallet_cli` 钱包时，私钥本身保存在 wallet-cli 的加密 keystore 中——Agent-wallet 的配置里只有 wallet-cli 账户 ID 和密码来源。

---

## 🔌 断网了，AI 还能签名吗？

`raw_secret` 钱包在进程内签名，不发起任何网络请求；`wallet_cli` 钱包在本机的 wallet-cli 子进程中签名。`privy` 钱包类型不同：私钥由 Privy 托管，签名请求发往 Privy API，因此天然需要联网。

断网主要影响的是交易的构建和广播（这是 MCP Server 或你自己代码的工作）。

---

## 🔑 还有主密码吗？忘了怎么办？

### 我在 2.x 用的是 `local_secure` 和 `AGENT_WALLET_PASSWORD`，现在怎么办？ {#upgrade-from-2x}

Agent-wallet 3.0 移除了 `local_secure` 钱包类型、agent-wallet 主密码、`AGENT_WALLET_PASSWORD`、`runtime_secrets.json`，以及 `init`、`change-password` 和 `sign msg` 命令。3.x 不会读取或转换 `local_secure` 钱包。

升级前：

1. 备份 `~/.agent-wallet`。
2. 在仍安装着 2.x 时，确认你能拿到原始私钥或助记词。
3. 把 2.x 的目录挪开，例如 `mv ~/.agent-wallet ~/.agent-wallet-2x`。`wallets_config.json` 里只要还有 `local_secure` 钱包，3.x 就会拒绝它（`Invalid wallet config`），包括 `start` 在内、所有需要读取配置的命令都会失败，直到旧文件被移走（`reset` 仍可运行）。也可以用 `--dir` 或 `AGENT_WALLET_DIR` 让 3.x 使用一个新目录。
4. 升级后，用 3.x 的某种类型重建钱包：
   - **本机生产签名：** 把私钥导入 wallet-cli（`wallet-cli import private-key` 或 `wallet-cli import mnemonic`），然后执行 `agent-wallet start wallet_cli`。
   - **托管签名：** `agent-wallet start privy`。
   - **仅限开发：** `agent-wallet start raw_secret`。
5. 确认新钱包解析出预期的地址（`agent-wallet resolve-address`）并能正常签名后，再自行删除旧的 2.x 目录。

同时更新环境变量：`TRON_PRIVATE_KEY`、`TRON_MNEMONIC` 和 `TRON_ACCOUNT_INDEX` 已不再读取——请改用 `AGENT_WALLET_PRIVATE_KEY`、`AGENT_WALLET_MNEMONIC` 和 `AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX`。网络值必须是规范格式（`tron:728126428`、`tron:3448148188`、`eip155:1` 等）。

### 忘了 wallet-cli 密码怎么办？

保护 `wallet_cli` 钱包的密码属于 wallet-cli 的 keystore，而不是 Agent-wallet。Agent-wallet 无法找回它。请用你备份的助记词或私钥在 wallet-cli 中恢复账户（`wallet-cli import mnemonic` / `wallet-cli import private-key`），然后重新把它连结到 Agent-wallet。

---

## 日常使用

### Agent-wallet 到底是什么？

一个面向 AI 代理的签名层。它为你的代码提供统一的接口——`getAddress`、`signTransaction`、`signTypedData`——并把每个请求交给你配置的密钥后端（`wallet_cli`、`privy` 或 `raw_secret`）。它不构建、不广播交易，也没有自己的界面。

### Agent-wallet 和 wallet-cli，我该用哪个？

- **wallet-cli** 负责保管私钥（加密 keystore），是新用户和 BANK OF AI 工具的官方配置入口。参见 [wallet-cli](../wallet-cli/quickstart.md)。
- **Agent-wallet** 面向基于 `@bankofai/agent-wallet` SDK 构建的代码。使用 `wallet_cli` 类型时，它通过你的 wallet-cli 账户签名，两者可以共用同一把私钥。

### CLI 和 SDK，我该用哪个？

- **CLI** — 命令行工具，用于配置钱包和手动测试签名
- **SDK** — TypeScript 库，用于在你自己的代码里直接调用签名

SDK 读取的就是 CLI 创建的配置。

### 能签名一段普通消息吗？

不能。3.x 只签名交易和 EIP-712 / TIP-712 结构化数据；`sign msg`、`signMessage()` 和 `signRaw()` 都已移除。

### 一台电脑能建几个钱包？

不限。你可以为不同的 AI 代理、不同的链、不同的用途分别配置钱包。用 `agent-wallet add` 添加，用 `agent-wallet use` 切换。

---

## 钱包类型

### `wallet_cli`、`privy` 和 `raw_secret` 有什么区别？

| | `wallet_cli` | `privy` | `raw_secret` |
| :--- | :---: | :---: | :---: |
| **私钥存储** | ✅ wallet-cli 加密 keystore | ☁️ Privy 云端托管 | ❌ 明文保存在 `wallets_config.json` |
| **代理读到 Agent-wallet 的配置** | ✅ 里面没有私钥（只有 wallet-cli 账户 ID 和密码来源） | ✅ 里面没有私钥（API 凭据，其中 app secret 可用 exec 脚本） | ❌ 私钥瞬间被盗 |
| **签名是否需要联网** | 否 | 是（Privy API） | 否 |
| **适用场景** | ✅ 本机生产签名 | ✅ 使用 Privy 的服务端代理 | ⚠️ 仅限完全隔离的开发环境 |

:::danger `raw_secret` 会以明文暴露你的私钥
任何能读取你主目录文件的进程都能读到私钥。只在完全隔离的测试环境中配合一次性私钥使用 `raw_secret`。
:::

:::tip 用 exec 脚本保存 wallet-cli 和 Privy 的凭据
使用 `--cli-password-exec` / `--app-secret-exec`，让凭据在需要时（例如从 1Password）读取，而不是写进 `wallets_config.json`。在 `direct` 提示中输入的密码会以明文保存在那里（文件权限 `0600`）。
:::

### `network` 参数可以填哪些值？

只接受精确的规范 CAIP-2 标识：

| 值 | 说明 |
| :--- | :--- |
| `tron:728126428` | TRON 主网 |
| `tron:3448148188` | TRON Nile 测试网 |
| `tron:2494104990` | TRON Shasta 测试网 |
| `eip155:1` | Ethereum 主网 |
| `eip155:56` | BSC 主网 |
| `eip155:97` | BSC 测试网 |
| `eip155:137` | Polygon 主网 |
| `eip155:8453` | Base 主网 |
| `eip155:42161` | Arbitrum 主网 |

> 以上是常用示例，并非白名单：任何 `eip155:<正整数 chainId>` 或 `tron:<正整数 chainId>` 都可以。别名（`tron:nile`、`tron:mainnet`、`evm:1`）、裸 `tron` / `eip155`、`tron:0x2b6653dc` 这类十六进制 TRON id，以及大小写或空白变体都会被拒绝。
>
> `wallet_cli` 钱包还要求该网络是 wallet-cli 自身认识的网络——即它的内置网络（`eip155:1`、`eip155:11155111`、`eip155:56`、`eip155:97`、`eip155:8453`、`eip155:84532`（Base 自 wallet-cli 4.14.0 起才内置）及表中三个 TRON 网络），或在 wallet-cli 自己的配置中添加的网络——否则签名会以 `network_mismatch` 失败。`raw_secret` 和 `privy` 钱包没有这一限制。

---

## 安全

### 私钥会离开我的电脑吗？

`raw_secret` 和 `wallet_cli` 钱包都在本机签名——Agent-wallet 签名时不发起网络请求。`privy` 钱包是例外：私钥由 Privy 托管（从不出现在你的磁盘上），签名请求发往 Privy API。

### `wallet_cli` 钱包是如何处理密码的？

Agent-wallet 从不读取或解密 wallet-cli 的 keystore。每次签名时，它会固定所配置的账户和网络，获取密码（每次都重新执行 exec 脚本，默认 10 秒超时），只把密码写入这一次 wallet-cli 子进程的 stdin，并核对返回的签名者与账户一致。密码从不出现在命令行参数中。

### 怎样安全地保存凭据？

- ✅ 使用密码管理器（1Password、Bitwarden），并通过 exec 脚本引用
- ❌ 不要把凭据硬编码在源码里，也不要作为命令行参数传入
- ❌ 不要把 `~/.agent-wallet/wallets_config.json` 或 `.env` 文件提交到 git

---

## 安装与环境

### 支持哪些操作系统？

macOS、Linux 和 Windows，需要 Node.js 22.23.4+（22.x）、24.22.1+（24.x）或 26.12.1+（使用 wallet-cli 时也是同一范围）。在不支持 Unix 权限的平台上，会跳过文件权限加固（`wallets_config.json` 设为 `chmod 600`、目录设为 `700`）。在 Windows 上，请把 `AGENT_WALLET_WALLET_CLI_PATH` 指向 wallet-cli 的 JavaScript 入口，而不是 `.cmd` / `.bat` 包装脚本。

### `npm install -g` 报权限错误？

在 macOS / Linux 上很常见。两种解决方法：

**方法一（推荐）：用 nvm 管理 Node.js**——它把全局包装在你的用户目录下，不需要 `sudo`。

**方法二：修改 npm 全局目录权限：**
```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### 代理提示"wallet not found"或"network is required"？

最常见的原因：

1. **存储目录不对**：创建钱包时用了 `--dir`，但代理查找的是默认路径。在代理的运行环境中设置 `AGENT_WALLET_DIR="/your/custom/path"` 并重启代理。
2. **没有激活钱包（CLI）**：未设置激活钱包时，不带 `-w` 的 `agent-wallet sign` 会失败。运行 `agent-wallet list`；如果没有任何钱包标着 `*`，执行 `agent-wallet use <id>`。（SDK 的 `resolveWallet()` / `getActiveWallet()` 不会因此报错——它们会回退到第一个已配置的钱包。）
3. **缺少网络或网络不规范**：`raw_secret` 和 `wallet_cli` 钱包需要 `tron:3448148188`、`eip155:56` 这样的网络。

### 添加 `wallet_cli` 钱包时提示 `wallet-cli not found`？

安装兼容版本（`npm install -g '@tron-walletcli/wallet-cli@^4.13.0'`），并确认在同一个 shell 中 `wallet-cli --version` 能正常运行；或者设置 `AGENT_WALLET_WALLET_CLI_PATH`。Agent-wallet 3.x 不支持 wallet-cli 4.12.x 和 5.x。

### 找不到 `agent-wallet` 命令？

全局安装没有生效。检查一下：
```bash
# 确认 npm 全局 bin 目录在 PATH 中
npm prefix -g
# 全局 bin 目录为：$(npm prefix -g)/bin
```
如果输出的路径不在你的 `$PATH` 里，手动加上：
```bash
echo "export PATH=$(npm prefix -g)/bin:$PATH" >> ~/.zshrc
source ~/.zshrc
```

---

## OpenClaw 集成

### 必须用 OpenClaw 吗？

不是。Agent-wallet 是独立的签名工具，可以单独通过 CLI 或 SDK 使用。

### OpenClaw 提示"签名失败"或"钱包未连接"？

按以下顺序排查：

1. 确认你使用的工具确实是通过 Agent-wallet 3.x 签名的——新的 BANK OF AI 配置直接使用 [wallet-cli](../wallet-cli/quickstart.md)。
2. 确认已配置钱包：`agent-wallet list` 应至少显示一个钱包，并用 `*` 标出激活钱包。
3. 确认代理的运行环境使用同一个钱包目录（`AGENT_WALLET_DIR`），修改后重启代理。
4. 手动签名试试：`agent-wallet sign typed-data '<json>' -n eip155:56`。

### 签名需要付 Gas 吗？

签名本身不花 Gas。只有把签好的交易广播到区块链时才会产生 Gas 费。

---

## 下一步

- 没写过代码？ → [快速开始](./QuickStart.md)
- 喜欢敲命令？ → [CLI 命令行手册](./Developer/CLI-Reference.md)
- 要自己写代理？ → [SDK 接入指南](./Developer/SDK-Guide.md)
- 找现成代码？ → [完整代码示例](./Developer/SDK-Cookbook.md)
- 了解 OpenClaw Extension → [OpenClaw Extension 简介](../Openclaw-extension/Intro.md)
