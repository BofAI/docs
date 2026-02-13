# 简介

OpenClaw 扩展是由 **BankofAI** 开发的一套工具，旨在通过 **x402 协议**（HTTP 402 Payment Required）赋能 AI 代理实现财务主权。它使代理能够持有钱包、执行交易并将其服务货币化。

## 愿景

为代理经济构建“中央银行”，确保每个 AI 代理都能：
- **赚取**: 通过标准协议接受任务和服务的付款。
- **消费**: 自主支付资源（计算、数据、存储）费用。
- **连接**: 促进代理间（A2A）的直接金融活动和结算。
- **交易**: 无缝地与 DeFi 和智能合约交互。

## 📦 核心组件

此扩展提供两个主要组件：

### MCP 服务器

通过模型上下文协议（MCP）为 AI 代理提供多链区块链访问：

- **[mcp-server-tron](https://github.com/bankofai/mcp-server-tron)** - TRON 区块链交互
  - 余额查询、转账、智能合约调用
  - 资源估算（能量/带宽）
  - 多网络支持（主网、Nile、Shasta）

- **[bnbchain-mcp](https://github.com/bnb-chain/mcp-server)** - BNB Chain 官方 MCP 服务器
  - 多链支持：BSC、opBNB、以太坊、Greenfield
  - 钱包操作、智能合约、代币转账
  - 跨链能力


### Skills

来自 **[技能仓库](https://github.com/bankofai/skills)** 的预构建工作流和工具：

有关可用技能及其文档的完整列表，请参阅 [技能仓库](https://github.com/bankofai/skills)。

安装程序将允许您在设置过程中选择要安装的技能。