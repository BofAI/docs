import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 快速开始

:::note
Agent Wallet 文档介绍现有 SDK、服务端和社区集成所使用的 `@bankofai/agent-wallet` 3.x SDK 与 CLI。官方新用户的钱包配置入口是 [wallet-cli](../wallet-cli/quickstart.md)。Agent-wallet 可以连结 wallet-cli 账户（下文路径 A），但绝不会导入或解密 wallet-cli 的密钥。
:::

从零开始，配好一个能让 AI 代理或你自己的代码签名的 Agent-wallet。二选一：

- **路径 A —— 连结 wallet-cli 账户（真实资金推荐）。** 私钥留在 wallet-cli 的加密 keystore 中。
- **路径 B —— 导入原始私钥（仅限开发）。** 私钥或助记词会**以明文**保存在 `~/.agent-wallet/wallets_config.json` 中。

Privy 用户：参见 [CLI 命令行手册 → Privy](./Developer/CLI-Reference.md#privy-wallets)。

:::tip 前置条件 & CLI 命令详解
- 你的 AI 代理支持执行 Shell 命令（OpenClaw、Telegram 机器人、网页聊天、Claude Code、Cursor 等），或者你要在自己的代码里集成 SDK。
- 本页只带你走最短路径。所有命令与参数请查阅 [CLI 命令行手册](./Developer/CLI-Reference.md)。
:::

:::caution 从 2.x 升级？
3.0 移除了 `local_secure`、主密码、`AGENT_WALLET_PASSWORD` 和 `runtime_secrets.json`；配套的 `agent-wallet` / `bankofai-guide` 对话式 Skill 也已在 Skills 3.0.0 中移除。已有的 `local_secure` 钱包不会被转换。升级前请先阅读 [常见问题](./FAQ.md#upgrade-from-2x)。
:::

---

## 第一步：安装

### 1.1 准备环境：安装 Node.js

Agent-wallet 和 wallet-cli（路径 A）都要求 **Node.js 22.23.4+（22.x）、24.22.1+（24.x）或 26.12.1+**，即 2026 年 10 月的安全更新版本（已发布的 agent-wallet `3.0.0` 仍声明 `>=18`；wallet-cli `4.15.1` 及下一版 agent-wallet 声明了此范围）。安装最新的 LTS 即可满足。

打开终端（Mac 用户按 `Command + 空格` 搜索"终端"），输入：

```bash
node -v
```

- **如果显示 `v22.23.4`+（22.x）、`v24.22.1`+（24.x）或 `v26.12.1`+：** 很好，直接跳到 1.2！
- **如果没有输出、报错或版本较旧：** 前往 **[Node.js 官网](https://nodejs.org)** 下载最新的 **LTS** 安装包。装完后关闭并重新打开终端，再执行一次 `node -v` 确认。

<details>
<summary>开发者推荐：通过 nvm 安装（新手可跳过）</summary>

```bash
# 1. 安装 nvm（已有可跳过）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. 重新加载终端配置
source ~/.bashrc   # zsh 用户：source ~/.zshrc

# 3. 安装并切换到当前的 Node.js LTS
nvm install --lts && nvm use --lts
```

</details>

### 1.2 安装 Agent-wallet

```bash
npm install -g @bankofai/agent-wallet
```

验证安装：
```bash
agent-wallet --help
```

看到 `Usage: agent-wallet <command> [options]` 以及后面的命令列表，就说明装好了。

---

## 第二步：创建钱包

<Tabs>
<TabItem value="wallet-cli" label="路径 A：wallet-cli（推荐）" default>

**2.1 安装兼容版本的 wallet-cli**（Agent-wallet 3.x 支持 `>=4.13.0 <5.0.0`）：

```bash
npm install -g '@tron-walletcli/wallet-cli@^4.13.0'
wallet-cli --version
```

**2.2 创建（或导入）wallet-cli 账户。** 首次使用时 wallet-cli 会初始化 `~/.wallet-cli`，并在终端中让你设置它的主密码：

```bash
wallet-cli create --label main-1 -o json
```

如果要恢复已有钱包，改为执行 `wallet-cli import mnemonic --label main-1 -o json` 或 `wallet-cli import private-key --label main-1 -o json`。助记词、私钥和密码都通过隐藏提示输入——绝不要放进命令参数、环境变量、日志或聊天里。备份方法见 [wallet-cli 快速开始](../wallet-cli/quickstart.md)。

**2.3 写一个密码脚本**，这样 wallet-cli 密码不会落到 Agent-wallet 的配置里。脚本只负责把密码打印到 stdout——例如使用 1Password CLI：

```bash
#!/bin/sh
op read 'op://Private/wallet-cli-password/password'
```

保存（例如保存为 `~/bin/fetch-wallet-cli-password.sh`），并用 `chmod +x` 赋予可执行权限。

**2.4 把账户连结到 Agent-wallet：**

```bash
agent-wallet start wallet_cli \
  --wallet-id my_cli_wallet \
  --account main-1 \
  --cli-password-exec /absolute/path/to/fetch-wallet-cli-password.sh
```

Agent-wallet 会先确认 wallet-cli 版本兼容、账户存在（这一步不索要密码），然后保存规范的账户 ID。输出结尾应为：

```
Wallet 'my_cli_wallet' created:
...
Active wallet: my_cli_wallet

Quick guide:
...
```

:::tip 不用脚本、直接输入密码
运行 `agent-wallet start wallet_cli` 时不带 `--cli-password-exec`，在密码来源提示中选择 `direct`。密码会以明文字符串保存在 `wallets_config.json`（文件权限 `0600`）中。`inspect` 始终显示为 `[redacted]`，但任何能读取该文件的程序都能读到密码。在命令行中传 `--cli-password <密码>` 会被拒绝。
:::

</TabItem>
<TabItem value="raw-secret" label="路径 B：raw_secret（仅限开发）">

:::danger 明文存储
`raw_secret` 会把你的私钥或助记词**不加密**地写入 `~/.agent-wallet/wallets_config.json`。任何能读取你主目录文件的程序都能读到它。只能使用一次性测试私钥。
:::

Agent-wallet 3.x 不生成私钥——请导入一把已有的测试私钥：

```bash
agent-wallet start raw_secret --wallet-id dev_wallet
```

按提示选择 `private_key`（或 `mnemonic`）并粘贴。预期输出：

```
Warning: Raw secret material will be stored in plaintext in wallets_config.json.
...
Wallet 'dev_wallet' created:
...
Active wallet: dev_wallet

Quick guide:
...
```

</TabItem>
</Tabs>

---

## 第三步：检查钱包

**查看地址**（不签名，也不需要密码）：

```bash
agent-wallet resolve-address
```

从列表中选择你的钱包。`raw_secret` 钱包，或同时拥有两条链地址的 wallet-cli 账户，会打印 EVM 和 TRON 两个地址：

```
Wallet  my_cli_wallet
Type    wallet_cli

Addresses
EVM   0x...
TRON  T...
```

**在测试网上签一次名。** 每条签名命令都需要用 `-n` 指定规范网络：

```bash
agent-wallet sign typed-data '{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"chainId","type":"uint256"}],"Message":[{"name":"contents","type":"string"}]},"primaryType":"Message","domain":{"name":"AgentWallet","chainId":97},"message":{"contents":"hello"}}' -n eip155:97
```

成功时会打印 `Signature: <hex>`。

---

## 第四步：让代理用上这个钱包

3.x **没有需要设置的密码环境变量**。任何使用 Agent-wallet SDK 的工具或代码，都会自动从 `~/.agent-wallet/wallets_config.json` 解析当前激活的钱包。

- 如果你用 `--dir` 把钱包放在了别处，请在代理运行的环境中把 `AGENT_WALLET_DIR` 设为该目录。
- 如果你使用了 `--cli-password-exec`，请确保脚本在那个环境里同样能运行（例如代理运行所用的用户也已登录 1Password CLI）。
- 修改环境变量后，重启你的 AI 代理后台服务使其生效。

---

## 你已经跑通了全流程

| 我想… | 去这里 |
| :--- | :--- |
| 更喜欢命令行？ | [CLI 命令行手册](./Developer/CLI-Reference.md) |
| 要自己写代理？ | [SDK 接入指南](./Developer/SDK-Guide.md) |
| 想找现成的代码？ | [完整代码示例](./Developer/SDK-Cookbook.md) |
| 了解安全设计 | [简介](./Intro.md) |
| 查看常见问题 | [常见问题](./FAQ.md) |
