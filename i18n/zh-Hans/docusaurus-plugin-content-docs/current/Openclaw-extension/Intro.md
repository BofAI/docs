# 简介

## OpenClaw Extension 是什么？

OpenClaw Extension 是由 **BANK OF AI** 开发的一套扩展工具包，为 [OpenClaw](https://github.com/openclaw)（开源 AI 助手）赋予**区块链交互能力**。安装后，你的 AI 助手就能直接操作链上资产——查余额、发起转账、调用智能合约、在 DEX 上兑换代币——而这一切只需要用自然语言对话完成。

传统方式下，让 AI 操作区块链需要自己搭建 MCP Server、手动管理配置文件、逐个安装各种工具。OpenClaw Extension 把这些工作打包成了一个交互式安装程序——运行一条命令，按提示选择你需要的组件，几分钟内就能让 AI 助手具备多链操作能力。

---

## 核心愿景

OpenClaw Extension 的目标是为 AI 代理经济构建一套金融基础设施——让每个 AI 代理都具备独立的金融能力：

- **赚取收益**：通过 x402 协议等标准接口接受任务和服务的付款
- **自主消费**：独立支付计算、数据、存储等资源费用
- **代理互联**：促进代理之间（A2A）的直接金融活动和结算
- **DeFi 交互**：无缝地与去中心化金融协议和智能合约交互

---

## 它包含什么？

OpenClaw Extension 由两大类组件构成：**MCP Server** 和 **Skills**。你可以在安装时按需选择要启用哪些组件。

### MCP Server — 链上操作能力

MCP Server 是 AI 助手与区块链之间的桥梁，通过 [Model Context Protocol (MCP)](../McpServer-Skills/MCP/Intro.md) 标准接口提供链上操作能力。目前支持两条链的 MCP Server 和一个远程充值服务：

| MCP Server | 目标 | 核心能力 |
| :--- | :--- | :--- |
| **[mcp-server-tron](https://github.com/BofAI/mcp-server-tron)** | TRON | 95 个工具，覆盖钱包、转账、合约、质押、治理等全部操作 |
| **[bnbchain-mcp](https://github.com/bnb-chain/bnbchain-mcp)** | BSC / opBNB / 以太坊 | 多链 EVM 操作、钱包、合约、跨链 |
| **bankofai-recharge** | BANK OF AI（远程） | 远程充值 MCP——通过链上 USDT 为 BANK OF AI 账户充值。默认端点：`https://recharge.bankofai.io/mcp` |

### Skills — 预构建工作流

Skills 是封装好的业务流程模板。与 MCP Server 提供的单个工具不同，一个 Skill 可以串联多个操作完成完整的任务——比如"在 SunSwap 上兑换代币"涉及查价格、检查余额、执行兑换、确认结果等步骤，一个 Skill 就能搞定。

| Skill | 功能 |
| :--- | :--- |
| **sunswap** | SunSwap DEX 交易——余额查询、报价、兑换、V2/V3 流动性管理 |
| **sunperp-skill** | SunPerp 永续合约交易——行情、下单、仓位管理、杠杆设置、提现 |
| **tronscan-skill** | 通过 TronScan API 查询链上数据（账户、交易、代币、区块、全网统计） |
| **x402-payment** | x402 支付技能，调用付费智能体和付费 API，支持 Gasfree 免 Gas 交易 |
| **recharge-skill** | BANK OF AI 余额和订单查询，以及通过 MCP 充值 |


---

## 适合谁使用？

- **OpenClaw 用户**：想让 AI 助手直接操作区块链，而不想自己手动搭建 MCP Server
- **Web3 开发者**：需要一个快速搭建的链上开发环境，用自然语言调试合约和查询数据
- **AI Agent 构建者**：需要为自动化代理配备多链操作能力
- **DeFi 用户**：想通过 AI 助手在 SunSwap 上交易或管理流动性

---

## 下一步

- 想立刻体验？ → [快速开始](./QuickStart.md)
