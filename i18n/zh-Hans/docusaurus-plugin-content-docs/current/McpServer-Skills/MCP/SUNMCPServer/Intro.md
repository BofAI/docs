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

## MCP 服务器地址 

|Environment|url|
|:---|:---|
|Production|[sun-mcp-server.bankofai.io/mcp](sun-mcp-server.bankofai.io/mcp)|

## 安全说明

- **私钥与助记词**：仅通过环境变量配置 `TRON_PRIVATE_KEY` 或 `TRON_MNEMONIC`，不要写死在代码或可能被提交的配置文件中。
- **先用测试网**：在主网操作前请在 Nile 或 Shasta 上充分测试。
- **最小权限**：为智能体配置的钱包仅保留完成任务所需的最低资金。
- **审计**：生产使用前建议对服务端与集成方式做安全审计。

## 许可证

本项目采用 MIT 许可证发布。
