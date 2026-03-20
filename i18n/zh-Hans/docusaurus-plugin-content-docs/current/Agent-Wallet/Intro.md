# 简介 
## 享受 AI Agent 红利，告别私钥泄露焦虑

### 你的私钥，距离被盗可能只差一次文件读取

你想让 AI 代理帮你自动完成链上操作——刷空投、做兑换、付 Gas 费、定时转账。要做这些事，AI 需要一把"钥匙"（私钥）来替你签名。

于是你把私钥放进了 `.env` 文件里。

**这就好比把银行卡和密码贴在脑门上，走进了一间挤满陌生人的办公室。**

那间办公室就是你的电脑。那些"陌生人"就是你机器上同时运行的一切——MCP Server、浏览器插件、AI 编程助手、自动化脚本。它们每一个，都能读你的 `.env` 文件。你的私钥没有密码保护，没有加密，没有任何门槛——就是一段明文，随时可以被任何一个进程拿走。

---

### 这不是吓你，它正在发生

- **依赖链投毒。** 你装了一个好用的 MCP Server。三个月后，它 200 个 npm 依赖中的某一个被注入了恶意代码——悄悄扫描所有 `.env` 和 `*.json` 文件，找到长得像私钥的字符串就发走。你完全不知道发生了什么，等你发现的时候，钱包已经空了。

- **"好心"代理的意外泄露。** AI 助手为了理解你的项目，读了整个工作目录。`.env` 在目录里。助手把文件内容发给远端 API 做分析。你的私钥现在安静地躺在别人的服务器日志里——不是被偷的，是被"顺便"上传的。

- **Git 的"完美记忆"。** 你在开发时把私钥写进了代码，后来删了。但三周前你 commit 过一次。`git log -p` 里还有。仓库只要上过一次 GitHub，哪怕就 30 秒，自动化爬虫已经找到了。

- **云钱包：换了个地方暴露。** "用云钱包服务不就安全了吗？" ——你的密钥确实不在本地了，但现在在别人的服务器上。他们被黑 = 你被黑，他们宕机 = 你的代理停摆。你只是把风险从左手换到了右手。

这些方式的共同点：**你的私钥总是在某个地方裸奔**——磁盘上、日志里、git 历史里、或者别人的基础设施上。

---

## 破局之道：Agent-wallet 

Agent-wallet 是一个"断网也安全"的**本地加密保险箱**。

它只做一件事：**用行业顶级的加密算法把你脆弱的明文私钥锁死在你的电脑里，并在本地完成授权。**

就算有人拿到了你的钱包文件，没有主密码，它就是一堆垃圾数据。暴力破解需要的时间比宇宙年龄还长——经济上毫无意义。同时，所有签名操作在你本地完成，不联网、不调 API、不经过任何第三方。

**一句话：文件随便偷，偷了打不开；签名纯本地，网络抓不到。**

---

## 和"老办法"对比一下

| | 明文密钥 / `.env` | 云钱包 | Agent-wallet |
| :--- | :---: | :---: | :---: |
| **代理读了你的密钥文件** | ❌ 直接被盗 | — 密钥在远端 | ✅ 加密文件——没密码打不开 |
| **密钥归谁** | ⚠️ 谁能读文件谁就能拿走 | ❌ 服务商持有 | ✅ 只有你（凭主密码） |
| **断网能签名吗** | ⚠️ 看情况 | ❌ 必须联网 | ✅ 100% 离线签名 |
| **为 AI 代理设计** | ❌ 需要手动集成 | ⚠️ REST API，有延迟 | ✅ CLI + SDK，本地即时响应 |
| **多链支持** | ❌ 自己搭 | ⚠️ 取决于服务商 | ✅ EVM + TRON，统一接口 |
| **生产环境就绪** | ❌ 非常危险 | ⚠️ 需要信任第三方 | ✅ 自托管，可审计 |

---

## 三条命令，一分钟上手

不需要先搞懂所有东西，先跑通再说：

**第一步 — 安装：**
```bash
npm install -g @bankofai/agent-wallet
```

**第二步 — 创建你的加密保险箱：**
```bash
agent-wallet start
```
系统会引导你初始化 Agent-wallet 加密保险箱，并生成一个**主密码**。这是解开所有资产的唯一凭证——忘了神仙难救，请用密码管理器保存。

**第三步 — 第一次签名：**
```bash
agent-wallet sign msg "Hello from my AI agent" -n tron
```

当屏幕上吐出一串哈希字符时——恭喜，你的加密保险箱配置成功了。

> 想看每一步的详细说明？去 **[极简部署 — CLI 快速开始](./QuickStart.md)**。

---

## 接下来，让 AI 真正跑起来

保险箱建好了，签名也测试通过了。现在的问题是：**怎么让我的 AI 代理用上这个钱包？**

根据你的角色，走不同的路：

### 🎮 我是普通玩家——用现成的工具

你不需要写代码。很多 AI 工具已经原生支持 Agent-wallet（**推荐使用我们的 [OpenClaw Extension](../Openclaw-extension/Intro.md) + [MCP Server](../McpServer-Skills/MCP/Intro.md) + [Skills](../McpServer-Skills/SKILLS/Intro.md)**）。你只需要做一件事——把主密码告诉工具：

```bash
export AGENT_WALLET_PASSWORD='你的主密码'
```

:::caution 密码有特殊字符？务必用单引号
自动生成的密码经常含有 `$`、`!` 等特殊字符。**用单引号**包裹，否则 shell 会把它"消化"掉：

```bash
# ✅ 正确
export AGENT_WALLET_PASSWORD='P@ss$w0rd!'

# ❌ 错误
export AGENT_WALLET_PASSWORD="P@ss$w0rd!"
```
:::

设置好后，工具就能自动调用你的 Agent-wallet 加密保险箱来签名了。你的私钥全程加密，工具拿到的只是签名结果，不是密钥本身。

> 想看支持的工具列表？去 **[Openclaw 扩展](../Openclaw-extension/Intro.md)**。

### 🛠️ 我是开发者——自己写代理

<details>
<summary>展开开发者路径 — TypeScript / Python SDK</summary>

Agent-wallet 提供了完整的 SDK，TypeScript 和 Python 双语言支持，共享同一套接口：

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";

const provider = resolveWalletProvider({ network: "tron:nile" });
const wallet   = await provider.getActiveWallet();
const sig      = await wallet.signMessage(new TextEncoder().encode("Hello!"));
```

同一个密钥文件、同一份数据、同一个签名结果。

> **[SDK 快速开始](./SDKQuickStart.md)** 手把手教你接入。
> **[完整示例](./FullExample.md)** 展示端到端的真实交易：TRON 转账、BSC 转账、x402 支付签名。

</details>

---

## 支持的链

| 链类型 | 网络 |
| :--- | :--- |
| **EVM** | Ethereum、BSC、Polygon、Base、Arbitrum，以及任何 EVM 兼容链 |
| **TRON** | TRON 主网、Nile 测试网、Shasta 测试网 |

两类链共用同一套接口——学一次，到处用。

---

## 还有疑问？

| 我在想… | 去这里 |
| :--- | :--- |
| AI 会不会把我的钱全转走？ | [常见问题](./FAQ.md) — 我们有专门的风险隔离方案 |
| 想马上动手试试 | [极简部署 — CLI 快速开始](./QuickStart.md) |
| 想在代码里用 | [SDK 快速开始](./SDKQuickStart.md) |
| 想看真实交易的完整流程 | [完整示例](./FullExample.md) |
