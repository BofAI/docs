# 简介

OpenClaw 扩展是由 **BANK OF AI** 开发的一套工具，旨在通过 **x402 协议**（HTTP 402 Payment Required）赋能 AI 代理实现财务主权。它使代理能够持有钱包、执行交易并将其服务货币化。

## 愿景

为代理经济构建“中央银行”，确保每个 AI 代理都能：
- **赚取收益**: 通过标准协议接受任务和服务的付款。
- **自主消费**: 自主支付资源（计算、数据、存储）费用。
- **连接交互**: 促进代理间（A2A）的直接金融活动和结算。
- **无缝交易**: 无缝地与 DeFi 和智能合约交互。

## 📦 核心组件

此扩展提供两个主要组件：

### MCP Server

通过模型上下文协议（MCP）为 AI 代理提供多链区块链访问：

- **[mcp-server-tron](https://github.com/bankofai/mcp-server-tron)** - TRON 区块链交互
  - 余额查询、转账、智能合约调用
  - 资源估算（能量/带宽）
  - 多网络支持（主网、Nile、Shasta）

- **[bnbchain-mcp](https://github.com/bnb-chain/bnbchain-mcp)** - BNB Chain 官方 MCP Server
  - 多链支持：BSC、opBNB、以太坊、Greenfield
  - 钱包操作、智能合约、代币转账
  - 跨链能力


### Skills

来自 **[Skills 仓库](https://github.com/bankofai/skills)** 的预构建工作流和工具：

**可用 Skills ：**
- **sunswap** - 用于 TRON 代币兑换的 SunSwap DEX 交易 Skill
- **8004-skill** - 8004 无信任代理（TRON 和 BSC 上 AI 代理的链上身份、声誉和验证）
- **x402-payment** - 在 TRON 网络上启用代理支付（x402 协议）
- **x402-payment-demo** - x402 支付协议演示

有关完整的文档和使用说明，请参阅 [Skills 仓库](https://github.com/bankofai/skills)。

安装程序将允许您在设置过程中选择要安装的 Skill 。