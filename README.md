# 🚀 Bank of AI 

**为 AI Agent 构建去中心化金融主权与商业互联层**

[![Standard](https://img.shields.io/badge/Protocol-bankofai-blue.svg)](https://github.com/bankofai)


Bank of AI 旨在赋予 AI 智能体（AI Agents）**金融主权、身份认证、技能扩展及自动化支付能力**。通过标准化协议，我们让 AI 能够像人类一样在区块链上自主赚取收入、支付资源并建立信用。

当前仅支持 TRON 和 BSC 链，未来将支持更多区块链网络。


## 🏛️ 核心组件 (Core Components)

### 1. 💳 x402 协议：程序化支付标准
x402 是一种基于 HTTP `402 Payment Required` 状态码的区块链开放支付协议。它解决了 AI 代理在 M2M（机器对机器）交互中的支付门槛。

* **支付即响应**：实现“先付费后响应”机制，无需繁琐的账户注册或会话维护。
* **多链覆盖**：目前已支持 **TRON** (Mainnet/Shasta/Nile) 和 **BSC** (Mainnet/Testnet)。
* **AI 友好**：支持基于 TIP-712/EIP-712 的签名负载，允许 Agent 自动完成结算。
* **适用场景**：按请求计费的 API、付费墙、Agent 间自动结算。

### 2. 🆔 ERC-8004：身份与信誉协议
ERC-8004 利用区块链作为去中心化的公共注册表，是 AI 代理建立信任的基石。

* **身份注册表 (Identity)**：通过 ERC-721 NFT 铸造身份，将链上 `agentId` 映射至元数据，确保所有权可转移且安全。
* **信誉系统 (Reputation)**：提供中立的公共存储标准，记录多维度反馈，交由应用层进行算法排名。
* **共识验证 (Validation)**：集成 **TEE 证明**、**加密经济质押**及 **zkML**，实现对 Agent 行为的可验证性。

### 3. 🛠️ MCP Server & Skills：智能体的“手与脑”
通过模型上下文协议 (MCP) 架构，为 Agent 提供完整的链上业务执行能力。

* **基础设施层 (MCP Server)**：智能体的 **“手和眼”**。提供统一的标准化界面，使其能够读取区块、管理钱包、执行转账及与任意合约交互。
* **应用逻辑层 (Skills)**：智能体的 **“大脑”**。通过结构化指令 (`SKILL.md`) 指引 AI 组合调用底层工具。
    * **SunSwap Skill**：实现 DEX 自动兑换功能。
    * **x402_payment**：赋予 Agent 自动识别支付要求并执行付款的逻辑。

### 4. 🧩 OpenClaw Extension：AI 代理金融助手
OpenClaw 是 Bank of AI 专门为 AI 代理开发的金融扩展插件，致力于成为代理经济的“中央银行”。

* **持有钱包**：让 Agent 真正拥有链上资产的管理权。
* **自主消费**：代理可自主支付所需的计算、存储及数据资源费用。
* **无缝集成**：内置 MCP 服务器与技能自动安装程序，开箱即用。



## 📊 为什么选择 Bank of AI？

| 特性 | 传统 AI 代理 | **赋能后的 Bank of AI Agent** |
| :--- | :--- | :--- |
| **支付体系** | 绑定信用卡/中心化 API Key | **x402 原生链上即时结算** |
| **身份体系** | 中心化邮箱/手机号注册 | **ERC-8004 链上身份 (NFT)** |
| **金融能力** | 受限，需人类预授权 | **自主 DeFi 交互 (Swap/Lending)** |
| **交互模式** | 人机交互为主 | **A2A (Agent-to-Agent) 直接结算** |
| **信任机制** | 厂商背书 (黑盒) | **公开信誉与加密验证 (透明)** |

---

## 🚦 快速开始 (Quick Start)

### 🚀 对于卖家 (Sellers)
*想要变现你的 API、内容或服务？*
1. **集成 x402**：在服务端部署逻辑，识别付费需求并返回 `402` 状态码及支付指引。
2. **注册身份**：参考 `ERC-8004` 规范完成链上身份铸造。
3. **发布 Skills**：为你的服务编写 `SKILL.md`，让其他 AI 能够理解如何调用你。

### 🤖 对于买家/代理 (Agents/Buyers)
*想要让你的 Agent 具备自主支付与链上交互能力？*
1. **安装 OpenClaw**：配置环境并连接到 [mcp-server](https://github.com/bankofai/mcp-server)。
2. **同步技能**：从 [skills](https://github.com/bankofai/skills) 仓库加载 `sunswap` 或 `x402_payment`。
3. **开始交易**：Agent 现在可以自动处理来自卖家的支付请求并执行结算。

---

## 🏗️ 开发者资源

* **文档中心**：[docs.bankofai.io](https://github.com/bankofai/x402-docs)
* **实战演示**：[x402-demo 仓库](https://github.com/bankofai/x402-demo)
* **技术支持**：欢迎在 GitHub 提交 Issue 或参与讨论。

---

**Bank of AI** - *Empowering AI Agents with Financial Sovereignty.*