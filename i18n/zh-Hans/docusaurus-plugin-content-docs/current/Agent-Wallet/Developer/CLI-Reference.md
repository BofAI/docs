# CLI 命令行手册

包含了 Agent-wallet 所有命令的完整参考。无论你是想复习基础操作，还是想配置自动化脚本，这里都有答案。

:::tip 刚刚入门？
如果你还没创建过钱包，先去 [快速开始](../QuickStart.md) 走一遍——三步搞定，不到一分钟。
:::

---

## 基础命令

高频使用的核心操作——创建钱包和签名。

### `agent-wallet start`（初始化 / 创建钱包）

**交互式创建（推荐）：**
```bash
agent-wallet start
```
系统会一步步引导你选择钱包类型、生成密钥、设置主密码。跟着提示走就行。

:::danger 切勿对真实资金使用 `raw_secret` 钱包类型
交互式向导可能会提供 `raw_secret` 选项。该类型将私钥**以明文形式**存储在磁盘上——任何有文件系统访问权限的程序都能直接读取。`raw_secret` 仅适用于完全隔离的测试环境。持有真实资金的钱包请始终选择 `local_secure`。
:::

:::tip Privy 钱包类型
向导还提供 `privy` 选项，用于 Privy 托管的服务器钱包。该类型将密钥托管交给 Privy 的基础设施——本地磁盘上不存储私钥。配置时需要 Privy App ID、App Secret 和 Wallet ID：

```bash
agent-wallet start   # 然后在提示时选择 "privy"
```

Privy 钱包的默认 ID 是 `default_privy`。
:::

**自定义密码：**
```bash
agent-wallet start -p Abc12345!
```
密码要求：至少 8 位，包含大写、小写、数字和特殊字符。如果密码不满足要求，CLI 会持续提示你重新输入更强的密码，直到通过验证。

交互式创建新密码时，需要输入两次进行确认。如果两次输入不一致，系统会要求你重新输入。

**默认钱包 ID：** 如果不指定钱包 ID，系统默认为 `local_secure` 钱包使用 `default_secure`，为 `raw_secret` 钱包使用 `default_raw`。

:::caution Shell 历史记录风险
使用 `-p` 内联传递密码会将密码记录在终端的历史文件中。生产钱包建议使用交互式模式（不带 `-p` 的 `agent-wallet start`）或通过环境变量设置 `AGENT_WALLET_PASSWORD`——详见[非交互式执行](#非交互式执行专为自动化与后台设计)。
:::

**导入已有私钥：**
```bash
agent-wallet start -p Abc12345! -k 你的私钥十六进制
```

**导入助记词：**
```bash
agent-wallet start -p Abc12345! -m "word1 word2 word3 ..."
```

### `agent-wallet sign`（核心签名操作）

每条 `sign` 子命令都需要 `--network` / `-n` 来指定链。

:::info 密码重试机制
使用 `local_secure` 钱包签名时，如果未通过 `-p` 或 `AGENT_WALLET_PASSWORD` 提供密码，CLI 会交互式提示输入主密码。如果密码输入错误，你有 **2 次重试机会**（共 3 次），超过后命令将以"密码错误，已失败 3 次。"（`Wrong password. 3 attempts failed.`）失败退出。
:::

**签名消息：**
```bash
agent-wallet sign msg "Hello" -n tron
# 输出: Signature: d220de880cbc1c3f...
```

**签名交易**（需要先通过 RPC 构建未签名交易）：
```bash
agent-wallet sign tx '{"txID":"abc123...","raw_data_hex":"0a02...","raw_data":{...}}' -n tron
# 输出: Signed tx: { "txID": "abc123...", "signature": ["..."], ... }
```

**签名 EIP-712 结构化数据：**
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
```

---

### `agent-wallet init`（初始化密钥目录）

初始化密钥目录并设置主密码------但此时不会创建钱包。这在一些高级场景中很有用，比如你希望在添加钱包之前先准备好目录结构。

``` bash
agent-wallet init
```

**非交互模式：**

``` bash
agent-wallet init -p 'Abc12345!'
```

| 参数 | 说明 |
| :--- | :--- |
| `--password, -p <pw>` | 主密码（跳过交互输入） |
| `--save-runtime-secrets` | 将密码持久化保存到  `runtime_secrets.json` |

:::tip 什么时候使用 `init` 和 `start` `start` = `init` +
创建钱包（一步完成）。如果你只需要先设置目录和密码（例如用于 CI
流程，或稍后再导入私钥），可以单独使用 `init`。 
:::


---

## 钱包管理

管理多个钱包——添加、切换、查看、删除。

**添加新钱包：**
```bash
agent-wallet add
```

**列出所有钱包：**
```bash
agent-wallet list
```

**切换活跃钱包：**
```bash
agent-wallet use my-bsc-wallet
```

**查看钱包详情：**
```bash
agent-wallet inspect my-bsc-wallet
```

**用指定钱包签名**（不切换活跃钱包）：
```bash
agent-wallet sign msg "Hello" -n eip155:56 -w my-bsc-wallet -p 'Abc12345!'
```

**删除钱包：**
```bash
agent-wallet remove my-bsc-wallet
```

### `agent-wallet resolve-address`（解析钱包地址）

显示某个钱包关联的链上地址。对于助记词派生的钱包，会显示所有支持网络（EVM 和 TRON）的地址。对于私钥钱包，只显示对应网络的单个地址。

```bash
agent-wallet resolve-address my-wallet
```

如果省略钱包 ID，CLI 会弹出交互式列表让你选择：

```bash
agent-wallet resolve-address
```

示例输出：
```
  Wallet │ my-wallet
    Type │ local_secure

Addresses
     EVM │ 0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18
    TRON │ TJRyWwFs9wTFGZg3JbrVriFbNfCug5tDeC
```

---

## 非交互式执行（专为自动化与后台设计）

默认情况下，执行签名命令时，终端会停下来并出现一行提示，等待你手动敲击键盘输入密码。但如果是 AI 代理在后台运行，或者你在跑自动化脚本，这种"中途停下来等人输入"的机制会导致程序直接卡死报错。

为了让程序能一口气静默跑完（非交互模式），你需要提前把密码"喂"给命令。根据你的使用场景，有以下三种方式：

### 方式 A：环境变量注入（推荐用于 AI 代理 / CI 流水线）

将密码提前存在当前系统环境里，程序运行需要密码时会自动去环境里拿，全程静默：

```bash
export AGENT_WALLET_PASSWORD='Abc12345!'
```

设置后，当前窗口的所有签名命令直接秒出结果，不再停顿等待：

```bash
agent-wallet sign msg "Hello" -n tron
agent-wallet sign tx '{"txID":"..."}' -n tron
```

:::tip 防止此命令被记录到 Shell 历史
建议直接用文本编辑器编辑 `~/.zshrc` / `~/.bashrc`，从根本上避免历史记录泄露。如果选择在命令前加空格来阻止记录，请先确认你的 Shell 已启用相应设置：Bash 中运行 `echo $HISTCONTROL` 确认包含 `ignorespace`，Zsh 中运行 `setopt | grep HIST_IGNORE_SPACE` 确认已开启。这些设置在大多数系统上**并非**默认启用，需要手动配置。
:::

:::caution 密码有特殊字符？务必用单引号
```bash
# 正确 — shell 按字面意思处理
export AGENT_WALLET_PASSWORD='P@ss$w0rd!'

# 错误 — $ 被 shell 展开，导致密码在后台静默报错
export AGENT_WALLET_PASSWORD="P@ss$w0rd!"
```
:::

<details>
<summary>GitHub Actions / CI 示例</summary>

在 CI/CD 环境中，切勿将密码硬编码在工作流文件里。请使用仓库密钥（Secrets）：

```yaml
# .github/workflows/sign.yml
jobs:
  sign:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: agent-wallet sign msg "Hello" -n tron
        env:
          AGENT_WALLET_PASSWORD: ${{ secrets.AGENT_WALLET_PASSWORD }}
```

</details>

### 方式 B：密码本地缓存（便利性与安全性的取舍）

执行一次带 `--save-runtime-secrets` 参数的命令后，密码会被缓存在本地文件（`~/.agent-wallet/runtime_secrets.json`）中。下次再运行任何签名命令时，系统会自动读取该缓存。你既不需要在命令行写密码，也不需要配环境变量：

```bash
agent-wallet sign msg "Hello" -n tron -p 'Abc12345!' --save-runtime-secrets
```

:::danger 此操作会使双重锁保护失效
将密码缓存在钱包文件旁边，意味着一次文件系统入侵就能获取全部资金——彻底击溃 Agent-wallet 的核心"物理文件 + 密码分离"安全模型。**请仅对一次性测试钱包使用此功能。**

`runtime_secrets.json` 以**明文**存储你的主密码。任何能访问你文件系统的程序（恶意插件、AI 代理、自动化脚本）都可以直接读取。务必确保该文件不会被提交到 git 或同步到云端。

工具在创建该文件时会自动设置严格的文件权限（`600`——仅所有者可读）。如果你手动移动或复制过该文件，请验证权限：`chmod 600 ~/.agent-wallet/runtime_secrets.json`。

要删除已缓存的密码并恢复完整的双重锁保护：

```bash
rm ~/.agent-wallet/runtime_secrets.json
```

删除后，签名命令将再次以交互方式提示输入密码（或从 `AGENT_WALLET_PASSWORD` 环境变量读取）。
:::

### 方式 C：命令行内联 `-p`（适合临时跑单次指令）

直接把密码写在命令的结尾。程序拿到密码就直接干活，不会再停下来问你：

```bash
agent-wallet sign msg "Hello" -n tron -p 'Abc12345!'
```

:::danger 安全提示
直接用 `-p` 传递密码时，明文密码会被留在你电脑的终端 `history`（历史记录）中。强烈建议仅在完全隔离的测试环境中使用此方法！
:::

### 自定义存储目录

所有命令都支持 `--dir` 参数来指定 Agent-wallet 的存储路径（默认在 `~/.agent-wallet`）。比如，你可以把 Agent-wallet 直接建在加密 U 盘里，即插即用，拔下即走：

```bash
agent-wallet start --dir /Volumes/MyUSB/agent-wallet
agent-wallet sign msg "Hello" -n tron --dir /Volumes/MyUSB/agent-wallet
```

---

## 危险操作

:::danger 以下操作不可逆，请谨慎使用！
:::

### `agent-wallet change-password`（修改主密码）

修改后，**所有密钥文件会用新密码重新加密**。旧密码立即失效，请确保已在密码管理器中更新。

**交互式（默认）：**
```bash
agent-wallet change-password
```

**非交互式**（用于自动化脚本）：
```bash
agent-wallet change-password -p 'OldPassword123!' --new-password 'NewPassword456!'
```

| 参数 | 说明 |
| :--- | :--- |
| `--password, -p <pw>` | 当前主密码（跳过提示） |
| `--new-password <pw>` | 新主密码（跳过提示） |
| `--save-runtime-secrets` | 同步更新 `runtime_secrets.json` 中的缓存密码 |

:::caution
`-p` 和 `--new-password` 都会被记录在 Shell 历史中。生产环境请优先使用交互式模式，或通过密钥管理器传入密码。
:::

<a id="agent-wallet-reset-reset-all-data"></a>

### `agent-wallet reset`（重置所有数据）

删除 `~/.agent-wallet/` 下的所有内容。**这是核弹级操作——一旦执行，所有钱包、密钥、配置全部消失，无法恢复。** 系统会要求二次确认。

```bash
agent-wallet reset
```

---

## 实战：在 Shell 脚本中调用签名

CLI 不只是拿来手敲的——它可以完美嵌入你的自动化脚本。

下面这个极简示例展示了如何在 Bash 脚本中完成一次非交互式签名，并把签名结果干净地存入变量，供后续业务使用（不涉及复杂的网络请求代码）：

```bash
#!/bin/bash
# 开启严格模式：遇到报错立刻停止
set -e

# 1. 密码应在运行此脚本之前已在环境中设置好。
#    例如通过 ~/.zshrc / ~/.bashrc — 详见快速开始中的"保存并使密码生效"。
#    切勿在脚本文件中硬编码真实密码（密码会随脚本进入 git 历史记录）。
if [[ -z "$AGENT_WALLET_PASSWORD" ]]; then
  echo "错误：AGENT_WALLET_PASSWORD 未设置" >&2
  exit 1
fi

echo "正在调用本地 Agent-wallet 签名..."

# 2. 核心操作：执行签名，并将终端打印出的哈希结果直接存入 SIGNATURE 变量
SIGNATURE=$(agent-wallet sign msg "Hello from my script" -n tron)

# 3. 拿到干净的签名结果，继续后续流程
echo "✅ 签名成功！"
echo "提取到的签名内容是: $SIGNATURE"

# 接下来，你可以拿这个 $SIGNATURE 去发请求、拼 JSON，或者传给其他流水线任务...
```

---

## 下一步

- 没写过代码？ → [快速上手](../QuickStart.md)
- 要开发应用？ → [SDK 接入指南](./SDK-Guide.md)
- 找现成代码？ → [完整代码示例](./SDK-Cookbook.md)
- 查看常见问题 → [FAQ](../FAQ.md)
