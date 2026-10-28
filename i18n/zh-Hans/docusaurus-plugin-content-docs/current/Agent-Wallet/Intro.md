# 简介

:::note
Agent Wallet 文档介绍现有 SDK、服务端和社区集成所使用的 `@bankofai/agent-wallet` 3.x SDK 与 CLI。官方新用户的钱包配置入口是 [wallet-cli](../wallet-cli/quickstart.md)。从 3.0 起，Agent-wallet 可以通过 `wallet_cli` 钱包类型**连结**已有的 wallet-cli 账户，但绝不会导入、复制或解密 wallet-cli 的密钥。
:::

## 享受 AI Agent 便利，告别私钥泄露焦虑

### 你的私钥，距离被盗可能只差一次文件读取

你想让 AI 代理帮你自动完成链上操作——刷空投、做兑换、付 Gas 费、定时转账。要做这些事，AI 代理需要一把"钥匙"（私钥）来替你签名。

于是你把私钥以明文的方式保存在了电脑的一个配置文件里——谁能读到这个文件，谁就拿到了你的私钥。

**这就好比把银行卡和密码贴在脑门上，走进了一间挤满陌生人的办公室。**

那间办公室就是你的电脑。那些"陌生人"就是你机器上同时运行的一切——MCP Server、浏览器插件、AI 编程助手、自动化脚本。它们每一个，都能读到这个文件。你的私钥没有密码保护，没有加密，没有任何门槛——就是一段明文，随时可以被任何一个 APP 拿走。

---

### 这不是吓你，它正在发生

- **依赖链投毒。** 你装了一个好用的 MCP Server。三个月后，它 200 个 npm 依赖中的某一个被注入了恶意代码——悄悄扫描所有文件，找到长得像私钥的字符串就发走。你完全不知道发生了什么，等你发现的时候，钱包已经空了。

- **"好心"代理的意外泄露。** AI 助手为了理解你的项目，读了整个工作目录。你的配置文件也在里面。助手把文件内容发给远端 API 做分析。你的私钥现在安静地躺在别人的服务器日志里——不是被偷的，是被"顺便"上传的。

- **Git 的"完美记忆"。** 你在开发时把私钥写进了代码，后来删了。但三周前你 commit 过一次。`git log -p` 里还有。仓库只要上过一次 GitHub，哪怕就 30 秒，自动化爬虫已经找到了。

这些方式的共同点：**你的私钥总是在某个地方裸奔**——磁盘上、日志里、git 历史里。

---

## 思路：统一的签名接口，密钥放在别处

你平时用 Web3 钱包（比如 TronLink/MetaMask）时，会把明文私钥贴进每个应用吗？当然不会。钱包保管私钥，替你签名。

**Agent-wallet 给 AI 代理提供同样的东西：一个统一的签名接口（`getAddress`、`signTransaction`、`signTypedData`），背后接你选定的密钥后端。** 你的代理代码——或者它所使用的 MCP Server / Skill——只需请 Agent-wallet 签名，自己从不接触私钥。

Agent-wallet 3.x 支持三种钱包类型：

| 钱包类型 | 私钥在哪里 | 适用场景 |
| :--- | :--- | :--- |
| `wallet_cli` | 在 [wallet-cli](../wallet-cli/quickstart.md) 的加密 keystore 里。Agent-wallet 从不读取或解密该 keystore；每次签名都在受限的 wallet-cli 子进程中完成，keystore 密码只交给这一次签名的子进程。 | 本机生产签名 |
| `privy` | 由 [Privy](https://privy.io) 托管——你的磁盘上没有私钥。签名请求发往 Privy API。 | 已在使用 Privy 的服务端代理 |
| `raw_secret` | **以明文**保存在 `~/.agent-wallet/wallets_config.json` 中。 | 仅限开发和一次性测试密钥 |

在 CI 等一次性环境中，SDK 也可以直接从环境变量（`AGENT_WALLET_PRIVATE_KEY` 或 `AGENT_WALLET_MNEMONIC`）读取私钥。这同样是明文——参见 [SDK 接入指南](./Developer/SDK-Guide.md)。

:::caution 从 2.x 升级
3.0 移除了 `local_secure` 加密钱包类型、agent-wallet 主密码、`AGENT_WALLET_PASSWORD` 和 `runtime_secrets.json`。已有的 2.x `local_secure` 钱包**不会**被自动转换。请先备份 `~/.agent-wallet`，在 2.x 下确认你仍能拿到原始私钥或助记词，再把钱包重建为 `wallet_cli`（推荐）、`privy` 或 `raw_secret`。参见 [常见问题](./FAQ.md#upgrade-from-2x)。
:::

---

## 方案对比

| | :x: 传统方案（私钥明文写在配置文件里） | :white_check_mark: Agent-wallet + `wallet_cli` |
| :--- | :--- | :--- |
| **代理的配置里存的是什么** | :x: 私钥本身 | :white_check_mark: wallet-cli 账户 ID 和密码来源（最好是 `exec` 脚本） |
| **密钥文件被其他程序读到** | :rotating_light: **全军覆没** | :shield: keystore 由 wallet-cli 加密 |
| **TRON 与 EVM 用同一套签名 API** | :warning: 看你的代码 | :white_check_mark: 所有后端都是同一个 `Wallet` 接口 |
| **能离线运行吗？** | :warning: 看情况 | :white_check_mark: `wallet_cli` 和 `raw_secret` 在本机签名；`privy` 通过 Privy API 签名，需要联网 |

---

## 三步完成第一次签名

不需要先搞懂所有概念，先跑起来再说。这条路径使用最快的 `raw_secret` 类型，配合一把**一次性测试私钥**（绝不要用于真实资金）：

**第一步——安装 Agent-wallet：**
```bash
npm install -g @bankofai/agent-wallet
```

**第二步——导入测试私钥：**
```bash
agent-wallet start raw_secret
```
按提示选择 `private_key` 并粘贴测试私钥。CLI 会警告原始密钥将以明文保存在 `wallets_config.json` 中。

**第三步——完成第一次签名：**
```bash
agent-wallet sign typed-data '{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"chainId","type":"uint256"}],"Message":[{"name":"contents","type":"string"}]},"primaryType":"Message","domain":{"name":"AgentWallet","chainId":1},"message":{"contents":"Hello from my AI agent"}}' -n eip155:1
```

看到以 `Signature:` 开头的一行输出——恭喜，你的 Agent-wallet 已经上线了。

> 涉及真实资金时，请改为连结 wallet-cli 账户。完整步骤见 **[快速开始](./QuickStart.md)**。

---

## 下一步：接入你的 AI 代理

Agent-wallet 配好了，签名也通了。接下来的问题是：**怎么让我的 AI 代理用上这个钱包？**

根据你的角色，走不同的路：

### 🎮 我是普通玩家——用现成的工具

你完全不需要懂代码！可以直接使用配套的工具：**[OpenClaw Extension](../Openclaw-extension/Intro.md) + [MCP Server](../McpServer-Skills/MCP/Intro.md) + [Skills](../McpServer-Skills/SKILLS/Intro.md)**。请以各工具自己的配置页为准确认它使用哪种钱包——新的配置直接使用 [wallet-cli](../wallet-cli/quickstart.md)。

#### 🤝 它们是怎么配合干活的？

为了让你用得绝对放心，我们把你的 AI 助理设计成了一家分工明确的"小公司"：

- 🧠 **业务团队（OpenClaw + Skills + MCP）：** 负责在外头跑腿。它们脑子转得快、工具多，知道怎么查行情、算滑点、找最优报价。但最重要的是：它们没有任何动用你资金的权限。
- 🏦 **财务总监（Agent Wallet）：** 守在金库门口。使用 `wallet_cli` 类型时，金库就是 wallet-cli 的加密 keystore；使用 `privy` 时，金库是 Privy 的基础设施。

一条安全的流水线是这样的：

1. 你坐在老板椅上发话："帮我买 100 U 的 TRX"。
2. 业务团队马上跑去查价格、算手续费，并老老实实写好一张"交易申请单"。
3. 它们把单子递给 **财务总监（Agent Wallet）**。
4. 财务总监让金库在申请单上盖个"同意印章"（技术上叫签名），私钥始终不离开金库，然后只把盖好章的单子递出去。
5. 业务团队拿着盖好章的单子，去区块链上把事办妥。

✨ **核心亮点：** 跑腿的 AI 工具自始至终只拿到"盖好章的纸"——签好名的交易或签名。

> 迫不及待想试试？去 👉 **[快速开始](./QuickStart.md)** 跟着做一遍。

### ⌨️ 我是进阶用户——想用 CLI 管理钱包

需要管理多个钱包、使用 exec 脚本凭据、自定义存储目录？去 **[CLI 命令行手册](./Developer/CLI-Reference.md)**。

### 👨‍💻 我是开发者——自己写代理

<details>
<summary>展开开发者路线 — TypeScript SDK</summary>

Agent-wallet 3.x 提供 TypeScript SDK；SDK 读取的就是 CLI 写入的同一份配置：

```typescript
import { resolveWallet } from "@bankofai/agent-wallet";

const wallet = await resolveWallet({ network: "tron:3448148188" }); // TRON Nile
const address = await wallet.getAddress();
const signed = await wallet.signTransaction(unsignedTx); // { family: "tron", transaction }
```

> **[SDK 接入指南](./Developer/SDK-Guide.md)** — 手把手集成教程。
> **[完整代码示例](./Developer/SDK-Cookbook.md)** — 端到端真实交易：TRON 转账、BSC 转账、x402 支付签名。

</details>

---

## 支持的链

所有网络都使用规范的 CAIP-2 标识：

| 链类型 | 网络 |
| :--- | :--- |
| **EVM** | `eip155:<chainId>` — Ethereum（`eip155:1`）、BSC（`eip155:56`）、Base（`eip155:8453`）及任何 EVM 兼容链，主网和测试网均支持 |
| **TRON** | `tron:<chainId>` — 主网（`tron:728126428`）、Nile 测试网（`tron:3448148188`）、Shasta 测试网（`tron:2494104990`） |

`wallet_cli` 钱包还要求该网络是 wallet-cli 自身认识的网络——即它的内置网络（`eip155:1`、`eip155:11155111`、`eip155:56`、`eip155:97`、`eip155:8453`、`eip155:84532`（Base 自 wallet-cli 4.14.0 起才内置）及上面三个 TRON 网络），或在 wallet-cli 自己的配置中添加的网络——否则签名会以 `network_mismatch` 失败。`raw_secret` 和 `privy` 钱包没有这一限制。

两种链类型共享同一套接口——学一次，到处用。

---

## 还有疑问？

| 我想知道… | 去这里 |
| :--- | :--- |
| AI 会不会把我钱包掏空？ | [常见问题](./FAQ.md) — 给代理单独开一个小额钱包 |
| 从来没写过代码？ | [快速开始](./QuickStart.md) |
| 更喜欢命令行？ | [CLI 命令行手册](./Developer/CLI-Reference.md) |
| 要自己写代理？ | [SDK 接入指南](./Developer/SDK-Guide.md) |
| 想找现成的代码？ | [完整代码示例](./Developer/SDK-Cookbook.md) |
