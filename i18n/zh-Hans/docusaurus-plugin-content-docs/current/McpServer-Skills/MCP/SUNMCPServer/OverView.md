
# 简介

SUN MCP Server 是面向 **TRON 网络上 SUN.IO（SUNSWAP）** 生态的 Model Context Protocol (MCP) 服务端。它让 AI 智能体通过统一工具接口查询 SUN.IO API 数据（代币、池子、价格、协议指标、交易、挖矿、合约），并执行兑换、V2/V3 流动性管理等 DeFi 操作。

本服务基于 [Model Context Protocol](https://modelcontextprotocol.io/)，向兼容 MCP 的客户端（如 Claude Desktop、Cursor、Google Antigravity）提供链上与 API 能力，并整合：

- **基于 OpenAPI 的工具**：来自 SUN.IO 公开 API 规范（`specs/sunio-open-api.json`），用于只读查询。
- **自定义 SUNSWAP 工具**（`sunswap_*`）：钱包、余额、报价、兑换及 V2/V3 流动性，由 `tronweb` 与链上合约调用支持。

## 主要特性

- **SUN.IO API**：查询代币、池子、价格、协议历史、持仓、农场与交易。
- **智能合约**：读写 TRON 合约；流动性与兑换流程中自动进行 TRC20 授权检查。
- **代币与兑换**：查询 TRX/TRC20 余额；通过 Universal Router 或自定义路由进行报价与执行兑换。
- **流动性**：添加/移除 V2 流动性（含原生 TRX 的 addLiquidityETH/removeLiquidityETH）；铸造、增加与减少 V3 仓位，并自动处理数量与滑点。
- **钱包**：支持私钥或 BIP-39 助记词；可选 Agent Wallet 提供方以支持远程签名。
- **多网络**：支持 Mainnet、Nile、Shasta，可配置 RPC 与 TronGrid API Key。

## MCP 服务器 URL
为了方便不同需求的用户，你可以选择直接连接[官方云服务](./UsingOfficialService.md)，也可以选择在自己的电脑上进行[本地化部署](./UsingLocalService.md)。其中官方服务只提供读取服务。

|环境|url|
|:---|:---|
|生产环境|[https://sun-mcp-server.bankofai.io/mcp](https://sun-mcp-server.bankofai.io/mcp)|


## 核心能力概览

- **SUN.IO API**：查询代币、池子、价格、协议历史、持仓、农场与交易。
- **智能合约**：读写 TRON 合约；流动性与兑换流程中自动进行 TRC20 授权检查。
- **代币与兑换**：查询 TRX/TRC20 余额；通过 Universal Router 或自定义路由进行报价与执行兑换。
- **流动性**：添加/移除 V2 流动性（含原生 TRX 的 addLiquidityETH/removeLiquidityETH）；铸造、增加与减少 V3 仓位，并自动处理数量与滑点。
- **钱包**：支持私钥或 BIP-39 助记词；可选 Agent Wallet 提供方以支持远程签名。
- **多网络**：支持 Mainnet、Nile、Shasta，可配置 RPC 与 TronGrid API Key。


## 详细功能特性

SUN MCP Server 提供的具体功能列表，供开发者和高级用户参考：

### SUN.IO API（只读）

工具由 `specs/sunio-open-api.json` 生成，请求 SUN.IO 公开 API。支持的领域包括：

- **交易**：分页扫描兑换/添加/提取等活动。
- **代币**：获取代币元数据、搜索代币。
- **协议**：协议快照与历史 KPI（成交量、用户数、交易数、池数、流动性）。
- **价格**：按地址查询代币价格。
- **持仓**：用户流动性持仓与池子 tick 级数据。
- **池子**：列表/搜索池子、最高 APY、hooks、成交量与流动性历史。
- **交易对**：代币对信息。
- **农场**：农场列表、农场交易、用户农场持仓。

### SUNSWAP 自定义工具

#### 钱包与余额

- **sunswap_get_wallet_address**：解析当前 TRON 钱包（本地私钥/助记词或 Agent Wallet）。
- **sunswap_get_balances**：查询某地址的 TRX 与 TRC20 余额（默认当前钱包）。

#### 价格与报价

- **sunswap_get_token_price**：通过 SUN.IO API 按地址和/或符号获取代币价格。
- **sunswap_quote_exact_input**：通过指定路由器的 view 函数进行精确输入兑换报价。

#### 智能合约交互

- **sunswap_read_contract**：调用任意 TRON 合约的 view/pure 函数（在适用处使用 solidity 节点只读路径）。
- **sunswap_send_contract**：执行会改变状态的合约调用，可附带 TRX 金额。

#### 兑换

- **sunswap_swap**：通过 Universal Router 的高层兑换；只需 tokenIn、tokenOut、amountIn（可选 network/slippage）。
- **sunswap_swap_exact_input**：按路由器地址、函数名与 ABI 参数顺序的低层路由兑换。

#### V2 流动性

- **sunswap_v2_add_liquidity**：向 V2 池添加流动性。若其中一档为原生 TRX（`T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb`），则使用 addLiquidityETH，否则使用 addLiquidity。根据池子储备自动计算最优数量以匹配比例；TRC20 授权自动处理。
- **sunswap_v2_remove_liquidity**：移除 V2 流动性。当一侧为 TRX 时使用 removeLiquidityETH。LP 授权与 amountMin/amountBMin（由储备与滑点计算）自动处理。

#### V3 流动性

- **sunswap_v3_mint_position**：铸造新的 V3 集中流动性仓位（NonfungiblePositionManager）。自动对 token0/token1 授权；可选 amountMin 与 deadline 默认值。
- **sunswap_v3_increase_liquidity**：为已有 V3 仓位增加流动性。
- **sunswap_v3_decrease_liquidity**：减少已有 V3 仓位的流动性。

### 支持的网络

| 网络     | 标识符      | 说明       |
|----------|-------------|------------|
| 主网     | `mainnet`   | 默认       |
| Nile     | `nile`      | 测试网     |
| Shasta   | `shasta`    | 测试网     |

### 传输方式

- **stdio**：默认；用于本地 MCP 客户端（如 Claude Desktop、Cursor）。
- **streamable-http**：HTTP + 服务端推送事件，供远程客户端使用；可配置 host、port、path。

## 安全说明

- **私钥与助记词**：仅通过环境变量配置 `TRON_PRIVATE_KEY` 或 `TRON_MNEMONIC`，不要写死在代码或可能被提交的配置文件中。
- **先用测试网**：在主网操作前请在 Nile 或 Shasta 上充分测试。
- **最小权限**：为智能体配置的钱包仅保留完成任务所需的最低资金。
- **审计**：生产使用前建议对服务端与集成方式做安全审计。

## 许可证

本项目采用 MIT 许可证发布。