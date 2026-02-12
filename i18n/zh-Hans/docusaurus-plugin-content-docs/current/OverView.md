# BANK OF AI  

**为 AI Agent 构建去中心化金融主权与商业互联层**

[![Standard](https://img.shields.io/badge/Protocol-bankofai-blue.svg)](https://github.com/bankofai)

**BANK OF AI** 致力于为 AI Agent 提供**金融主权、身份认证、技能扩展能力以及自动化支付能力**。通过标准化协议，我们让 AI 能够像人类一样，在区块链上自主赚取收入、支付资源费用并建立信用体系。

当前已支持 **TRON** 和 **BSC**，未来将支持更多区块链网络。



## 🏛️ 核心组件

### 1. 💳 x402 Payment 协议：可编程支付标准

x402 是一个基于 HTTP `402 Payment Required` 状态码构建的开放式区块链支付协议，旨在消除 AI Agent 在 M2M（机器对机器）交互中的支付摩擦。

- **Payment-as-Response**：实现“先支付，后响应”机制，无需复杂的账户注册或会话管理。  
- **多链支持**：当前支持 **TRON**（主网 / Shasta / Nile）和 **BSC**（主网 / 测试网），未来将支持更多区块链网络。  
- **AI 友好**：支持签名负载，使 Agent 可自动完成结算。  
- **应用场景**：按次计费 API、付费墙、Agent 之间的自动化结算。



### 2. 🆔 8004 协议：身份与信誉框架

8004 协议利用区块链作为去中心化公共注册系统，为 AI Agent 构建信任基础。

- **身份注册系统**：以 NFT 形式铸造身份，将链上 `agentId` 映射至元数据，具备可转移性与安全所有权。  
- **信誉系统**：提供中立的公共存储标准，用于多维度反馈数据存储，具体排序逻辑由应用层决定。  
- **共识验证机制**：集成 **TEE 证明**、**加密经济质押机制** 与 **zkML**，实现可验证的 Agent 行为。



### 3. 🛠️ MCP Server & Skills：Agent 的“手与脑”

基于 Model Context Protocol（MCP）架构构建，为 Agent 提供完整的链上执行能力。

- **MCP Server**：Agent 的**“手与眼”**。提供统一接口，用于读取区块数据、管理钱包、执行转账以及与任意合约交互。  
- **Skills**：Agent 的**“大脑”**。通过结构化指令文件（`SKILL.md`）指导 AI 编排底层工具。  
  - **sunswap**：支持自动化 DEX 兑换。  
  - **x402-payment**：允许 Agent 自动检测支付需求并完成付款。



### 4. 🧩 OpenClaw 扩展：AI Agent 的金融助手

OpenClaw 是 BANK OF AI 为 AI Agent 开发的金融扩展插件，目标是成为 Agent 经济体系中的“AI 中央银行”。

- **钱包所有权**：使 Agent 真正掌控并管理链上资产。  
- **自主支出能力**：Agent 可独立支付计算、存储与数据资源费用。  
- **无缝集成**：内置 MCP Server 与自动技能安装器，实现即插即用。



## 📊 为什么选择 BANK OF AI？

| 特性 | 传统 AI Agent | **BANK OF AI 赋能的 Agent** |
| :--- | :--- | :--- |
| **支付系统** | 信用卡 / 中心化 API Key | **x402 原生链上即时结算** |
| **身份系统** | 中心化邮箱 / 手机注册 | **8004 链上身份（NFT）** |
| **金融能力** | 受限，需人工预授权 | **自主 DeFi 交互（Swap / Lending）** |
| **交互模式** | 主要为人机交互 | **A2A（Agent-to-Agent）直接结算** |
| **信任机制** | 厂商背书（黑盒） | **公开信誉 + 密码学验证（透明）** |



## 🚦 快速开始

### 🚀 面向服务提供者  
*想为你的 API、内容或服务变现？*

1. **集成 x402**：在服务端部署逻辑，用于检测支付需求，并返回包含支付说明的 `402` 状态码。  
2. **注册身份**：按照 `8004` 规范铸造链上身份。  
3. **发布 Skills**：为你的服务编写 `SKILL.md`，使其他 AI Agent 能够理解并调用。



### 🤖 面向 Agent / 使用方  
*希望你的 Agent 具备自主支付与链上交互能力？*

1. **安装 OpenClaw**：配置环境并连接至 [mcp-server-tron](https://github.com/bankofai/mcp-server-tron)。  
2. **同步 Skills**：从 [skills 仓库](https://github.com/bankofai/skills) 加载 `sunswap` 或 `x402-payment`。  
3. **开始交易**：你的 Agent 现在可以自动处理卖方的支付请求并执行链上结算。



## 🏗️ 开发者资源

- **文档中心**：[docs.bankofai.io](https://github.com/bankofai/docs)  
- **在线演示**：[x402-demo 仓库](https://github.com/bankofai/x402-demo)  
- **技术支持**：欢迎在 GitHub 提交 Issue 或参与讨论。



**BANK OF AI** —— *赋能 AI Agent 的金融主权时代。*
