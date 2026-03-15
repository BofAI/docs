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

- **[mcp-server-tron](https://github.com/BofAI/mcp-server-tron)** - TRON 区块链交互
  - 钱包管理、消息签名、地址转换与验证
  - 余额查询、TRX/TRC20 转账、智能合约调用
  - 合约部署、批量调用（multicall）、ABI 获取、合约参数管理
  - 区块与交易查询（按高度、哈希、范围）
  - 资源估算（能量/带宽）、质押（Stake 2.0）、资源委托
  - 治理与提案、事件查询、内存池、节点信息
  - 账户管理、TronGrid 数据查询、交易广播
  - 全节点查询 API（能量/带宽历史价格、TRX 销毁统计、区块余额变动）
  - 多网络支持（主网、Nile、Shasta）
  - 只读模式，适用于安全的公开部署

- **[sun-mcp-server](https://github.com/BofAI/sun-mcp-server)** - SUN.IO (SUNSWAP) DeFi 交互
  - SUN.IO API 查询：代币、池子、价格、协议指标、交易、挖矿
  - 钱包管理、余额查询（TRX 与 TRC20）、多钱包切换
  - 代币价格与智能路由器兑换报价
  - 通过 Universal Router 智能兑换，自动寻找最佳路径
  - V2 流动性：添加/移除，自动处理原生 TRX
  - V3 集中流动性：铸造、增加、减少仓位及收取手续费
  - V4 集中流动性：铸造、增加、减少仓位，支持 Permit2
  - 智能合约交互：读写合约，自动处理 TRC20 授权
  - 多网络支持（主网、Nile、Shasta）
  - 支持私钥、BIP-39 助记词和 Agent Wallet

- **[bnbchain-mcp](https://github.com/bnb-chain/bnbchain-mcp)** - BNB Chain 官方 MCP Server
  - 多链支持：BSC、opBNB、以太坊、Greenfield
  - 钱包操作、智能合约、代币转账
  - 跨链能力


### Skills

来自 **[Skills 仓库](https://github.com/BofAI/skills)** 的预构建工作流和工具：

**可用 Skills ：**

| SKILL | 功能 |
| :--- | :--- |
| **x402-payment** | x402 支付技能，用于在受支持的链上调用付费智能体和付费 API。 |
| **sunswap** | SunSwap DEX 技能，用于余额查询、报价、兑换及流动性相关工作流。 |
| **tronscan-skill** | 通过 TronScan API 进行 TRON 区块链数据查询，支持账户、交易、代币、区块及全网统计。 |

有关完整的文档和使用说明，请参阅 [Skills 仓库](https://github.com/BofAI/skills)。

安装程序将允许您在设置过程中选择要安装的 Skill 。