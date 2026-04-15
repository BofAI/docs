# 简介

## 一句话理解 BANK OF AI

**BANK OF AI 是一整套让 AI 真正在区块链上"动起来"的基础设施。**

把你的 AI 助手想象成一位刚毕业的实习生：聪明、勤快、随叫随到，但他既没有银行账户，也不懂 Web3 的"潜规则"，更没法替你为付费服务自动结账。BANK OF AI 做的事情，就是把这位实习生升级成一个**"持证上岗"的链上理财顾问**——给他配一套覆盖所有链上场景的"标准作业手册"（Skills），一个安全的钱包，还有让他能自动付费购买服务的协议底座。

你不需要懂代码，不需要写脚本，也不需要在多个 dApp 之间反复切换。你只需要把任务交给 AI，剩下的全都由 BANK OF AI 这一整套基础设施在后台自动完成。

---

## 一条指令是怎么到达链上的？

整个流程其实非常简单——**你在 AI 客户端里说一句话，这句话会按下面这张图走完全程：**

<div style={{ textAlign: 'center', margin: '1.5rem 0' }}>

![BANK OF AI 架构图：用户指令如何到达链上](./image/bankofai-architecture.svg)

</div>

**第 1 步：AI Agent 理解你的话**

你在 AI 客户端（OpenClaw / Cursor / Claude Code / Codex ……）里发出一句自然语言指令——比如"帮我把 100 TRX 换成 USDT"。AI Agent 由 **LLM Service** 驱动（背后是 GPT、Claude、Gemini、DeepSeek、Kimi 等顶级大模型中的某一个），负责理解你的意图，并决定后续的执行路径。

**第 2 步：选一条路径去执行**

理解完之后，AI Agent 面前有两条路：

- **🌟 走 Skills（业务编排层）**——覆盖绝大多数使用场景
  Skills 是预先编写好的"链上操作 SOP 手册"——AI Agent 从 Skills 中选择对应的技能（例如 SunSwap Skill），按照标准流程执行：**查余额 → 检查授权 → 报价 → 滑点保护 → 等你确认 → 调用 MCP Server 执行**。复杂的多步操作被压缩为"一句话完成"，不会漏步骤，也能规避常见陷阱。

- **⚙️ 跳过 Skills，AI Agent 直接调用 MCP Server**
  MCP Server 提供的是标准化的原子能力工具（链上 + 链下），AI Agent 可以不经过 Skills 直接调用。注意这里绕过的是 Skills 编排层，**不是 AI Agent 本身**——AI Agent 仍然是所有调用的发起方。直连适合简单查询或开发者自定义流程；涉及复杂交易、授权、风控时，建议走 Skills。

**第 3 步：签名、协议、上链**

无论走哪条路，最终的交易都会：**经过 Agent-Wallet 在你本机本地签名**（私钥永不出本机，统一支持 EVM + TRON 双生态）→ **提交到区块链**。

**第 4 步：执行结果返回到 AI Agent**

链上执行完成后，**结果会沿着原路径反向回到 AI Agent**——区块链返回的交易哈希、状态、事件日志先被 MCP Server 解析成结构化数据，再回传给 AI Agent。**AI Agent 基于这些结构化数据生成自然语言摘要**，并附上交易哈希（方便链上核查），通过正常对话告诉用户。

例如：

> ✅ 成功，用 100 TRX 换到了 350 USDT，手续费 1.2 TRX。
> 交易哈希：`0xabc123...def456`（[在 TronScan 查看](https://tronscan.org)）

整个流程形成闭环：**一句指令进去，一句可读的结果出来**。你始终只与 AI Agent 对话，无需自己解析链上原始数据；同时交易哈希始终可见，便于追溯和验证。

**🔀 横向能力：x402 + 8004 协议**

x402（付费协议）和 8004（身份 / 信誉协议）是**横向能力**（Cross-layer Capability），不局限于某一层——它们可以在以下任何环节介入：

- 当 MCP Server 调用链下付费 API 时，x402 完成"先付款、后响应"结算
- 当 AI Agent 或 Skills 需要验证对方 Agent 身份时，8004 提供链上征信报告
- 当 Skills 编排中需要检查服务提供方信誉时，同样查询 8004

---

## 核心模块（按"最常接触 → 越来越底层"排序）

### 🧠 1. AI Agent — 你的主要入口点

**这是你真正"对话"的对象。** 在 OpenClaw / Cursor / Claude Code 等任意 AI 客户端里，你说一句话，AI Agent 接收、理解、执行、回复——整套流程对你来说就是"和 AI 聊天"这么简单。

AI Agent 的智力由 **LLM Service** 提供，这是 BANK OF AI 的统一模型接入层：把 GPT、Claude、Gemini、DeepSeek、Kimi、GLM、MiniMax 等主流大模型聚合到一个 API 网关下——**一个 API Key 即可调用所有模型**，按用量计费，接入简单且成本可控。

不管你用 OpenClaw、Cursor、Claude Code 还是其他 AI 客户端，都能通过 LLM Service 直连这些顶级大脑。

👉 详见：[LLM Service 简介](../llmservice/introduction.md)

---

### 🌟 2. Skills — AI Agent 的"链上操作 SOP 手册"

**这是 AI Agent 完成绝大多数链上任务时遵循的标准流程。** 你感知不到 Skills 的存在，但你看到的"AI 干活又稳又快"，背后正是 Skills 在编排。

Skills 是一套预先编写好的"AI 链上操作 SOP 手册"，覆盖 TRON 生态常见的使用场景——SunSwap 兑换、SunPerp 合约、TronScan 查询、TRC20 转账、TRX 质押投票、USDD/JUST 协议、多签权限、x402 支付、BANK OF AI 充值……随着生态发展还会持续扩充。

举例说明：用户说"花 50 USDT 买点 TRX"。普通 AI 可能直接生成一段交易代码，由于未授权 SunSwap 而当场报错；装了 SunSwap Skill 的 AI 则会按 SOP 自动执行——**查余额 → 检查授权 → 报价 → 滑点保护 → 等你确认 → 执行交易**，每一步都不遗漏。

**你只需用自然语言告诉 AI Agent，Skills 会让它把复杂的多步链上操作压缩为"一句话完成"。** 背后涉及的 MCP 工具调用、钱包签名、合约参数计算，全部由 Skills 自动编排——你无需关心任何底层细节。

👉 详见：[Skills 简介](../McpServer-Skills/SKILLS/Intro.md)

---

### 🔐 3. Agent-Wallet — AI 专属的本地加密保险箱

有了大脑和手册还不够，AI 需要花钱、需要转账，必须拥有一个**属于自己的钱包**。但如果把私钥以明文形式写在配置文件里，就等于把银行卡密码公开放置——任何运行在你电脑上的程序（恶意插件、AI 编程助手、自动化脚本）都有可能在极短时间内读取并窃取。

Agent-Wallet 是专为 AI 设计的本地加密钱包——你的私钥被加密锁在本地的隐藏目录中，AI 只持有一个"解锁密码"。**即便密码泄漏，没有加密文件依然无法解密；即便文件被窃取，没有密码也只是一段无法解读的密文。** 双重保险，安全等级比明文私钥高出数个数量级。

围绕这套加密机制，Agent-Wallet 提供以下核心能力：

- **Local Secure（加密本地存储）**：私钥会被行业顶级的算法加密，存放在本机的隐藏目录（`~/.agent-wallet`），需主密码才能解锁
- **Local Signing（本地离线签名）**：所有签名操作完全在你本机完成，**100% 离线**，私钥永远不离开你的电脑
- **Multi-Wallet（多钱包管理）**：通过 CLI 或 SDK 可同时管理多个钱包，按需切换活跃钱包，互不干扰
- **Multi-Chain（多链统一接口）**：同一套接口同时覆盖 **EVM 系**（Ethereum / BSC / Polygon / Base / Arbitrum 等）和 **TRON 系**（Mainnet / Nile / Shasta），学一次即可在多条链上通用

每当 Skills（或 AI Agent 直连 MCP 时）需要发一笔交易，Agent-Wallet 在本地完成签名后只把签好的结果传出去——**私钥本身永远不出本机**。

👉 详见：[Agent-Wallet 简介](../Agent-Wallet/Intro.md)

---

### 💸 4. x402 — 让 AI 自己学会"付费上网"（横向能力）

当你的 AI 需要去调用某个**收费的在线服务**（比如付费 API、付费数据集），传统做法是你提前注册账号、绑定信用卡、配置 API Key——这套流程对 AI 来说根本走不通。

x402 是基于 HTTP `402 Payment Required` 状态码的开放支付协议，让 AI 在收到"需要付费"的回应后**自动在链上签一笔小额支付，然后立刻拿到内容**。整个过程不用注册账号，不用人工介入，也不用提前充值。

x402 是一种**横向能力（Cross-layer Capability）**——它不属于某一固定层，哪里需要"先付款、后响应"，哪里就可以触发 x402：MCP Server 调用付费 API 时可以触发，Skills 里的 x402-payment 技能可以显式触发，AI Agent 自己决定付费调用时也可以触发。

支持 TRON、BSC，未来还会扩展到更多链。

👉 详见：[x402 协议简介](../x402/index.md)

---

### 🪪 5. 8004 — Agent 的链上身份证 + 信誉系统（横向能力）

互联网世界里，AI Agent 越来越多，但你怎么知道某个 Agent 是真是假、值不值得信任？8004 协议是 Web3 上的"Agent 注册局"——任何 Agent 都可以在链上铸造一个身份 NFT，绑定自己的服务端点（Web、MCP、DID），并接受其他 Agent 和用户的反馈。

和 x402 一样，8004 也是**横向能力**，可以在整个流程的多个环节介入：AI Agent 调用陌生服务前查询对方信誉、Skills 编排中做前置风控校验、MCP Server 之间互相验证身份——都用的是这套协议。

**简单说，8004 是 Agent 的发现机制 + 信誉系统**——让你的 AI 在付费或授权之前，先去链上查一下对方的"征信报告"。

👉 详见：[8004 协议简介](../8004/general.md)

---

### ⚙️ 6. MCP Server — 能力提供层

:::info 一般用户可以跳过这一节
MCP Server 是 Skills 调用的底层能力接口，**大多数情况下你感受不到它的存在**——Skills 已在上层完成了封装。这一节主要写给希望深入了解架构的开发者。
:::

MCP Server（Model Context Protocol Server）基于 Anthropic 提出的 **Model Context Protocol** 标准，把各类外部能力封装成 AI 可调用的标准化工具。从协议设计上，MCP Server 既可以承载**链上能力**（链上查询、合约调用、转账签名等），也可以承载**链下能力**（价格源、数据查询、外部 API 等）——具体包含哪些工具完全取决于每个 MCP Server 的实现。

**Skills 与 MCP Server 的关系：**

| 层 | 角色 | 负责什么 |
|:---|:---|:---|
| **Skills** | 业务编排层（Orchestration） | 把多步操作按 SOP 串起来、处理前置检查和风控 |
| **MCP Server** | 能力提供层（Capability Provider） | 提供原子能力工具给上层调用 |

BANK OF AI 目前提供的三套核心 MCP Server **聚焦于链上原子操作**：

- **TRON MCP Server**：TRON 链上原子操作能力（查询、转账、合约、质押、治理）
- **SUN MCP Server**：SunSwap V2/V3/V4 兑换与流动性能力
- **BSC MCP Server**：BNB Chain 链上原子操作能力

未来我们会按需扩展更多 MCP Server，包括链下数据、第三方协议等场景。

高级开发者可以让 AI Agent 绕过 Skills 直接调用 MCP 工具，但这意味着你需要自行处理前置检查、授权、滑点、错误恢复等所有流程——而这些正是 Skills 已经为你自动化的环节。

👉 详见：[MCP Server 简介](../McpServer-Skills/MCP/Intro.md)

---

### 🖥️ 7. SUN CLI — Developer Tool（给开发者的命令行入口）

SUN CLI 不是一层独立的服务，而是 **SUN MCP Server 能力的命令行入口**（CLI interface to MCP Server）——专为开发者和自动化场景设计。

如果你习惯使用命令行操作 SunSwap，或者需要在 shell 脚本、CI/CD 流水线中调用 SUN MCP 的能力，SUN CLI 把查价、报价、兑换、加流动性、管理头寸等操作封装为一行命令即可完成，输出可直接 pipe 到其他工具。

👉 详见：[SUN CLI 简介](../McpServer-Skills/Tools/SUNCli/Intro.md)

---

## 我适合用 BANK OF AI 吗？

- **Web3 新手：** 完全没问题。在 AI 客户端里说一句"agent 一键安装"，剩下的全部自动完成；之后用自然语言对话即可，无需了解底层细节。
- **Web3 老手：** 可以告别"切钱包 + 复制地址 + 算滑点 + 等区块"的繁琐流程，让 AI 接管所有重复性工作，自己专注策略。
- **AI Agent 开发者：** 整套 BANK OF AI 提供完整的 SDK、CLI、API 和 MCP 标准接口——你可以基于它构建自己的 AI Agent，让 Agent 拥有完整的链上能力和自动支付能力。
- **API 服务提供方：** x402 协议让你的付费 API 可以被 AI Agent 自动调用并按次计费，不需要传统的账号注册、信用卡绑定流程，特别适合微支付、AI Agent 自动调用付费服务、以及 Agent 之间自动结算等场景。

---

## 准备好了吗？

整套 BANK OF AI 的安装和配置已经被压缩到**一句话**——你只需要对你的 AI 助手说："**agent 一键安装**"。

剩下的会全部自动完成：安装 Skills、配置钱包、同步到 9 个 AI 客户端，全程不到 1 分钟。

👉 **[前往快速开始，1 分钟激活你的 BANK OF AI](./QuickStart.md)**
