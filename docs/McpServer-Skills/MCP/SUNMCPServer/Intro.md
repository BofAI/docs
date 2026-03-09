# Introduction

A Model Context Protocol (MCP) server focused on the **SUN.IO (SUNSWAP)** ecosystem on the TRON network. It enables AI agents to query SUN.IO API data (tokens, pools, prices, protocol metrics, transactions, farming, contracts) and to execute DeFi operations such as swaps and V2/V3 liquidity management through a unified tool interface.

The SUN MCP Server uses the [Model Context Protocol](https://modelcontextprotocol.io/) to expose blockchain and API services to MCP-compatible clients (e.g. Claude Desktop, Cursor, Google Antigravity). It combines:

- **OpenAPI-derived tools** from the SUN.IO public API spec (`specs/sunio-open-api.json`) for read-only queries.
- **Custom SUNSWAP tools** (`sunswap_*`) for wallet, balances, quoting, swaps, and V2/V3 liquidity, backed by `tronweb` and on-chain contract calls.

## Key Features

- **SUN.IO API**: Query tokens, pools, prices, protocol history, positions, farms, and transactions.
- **Smart contracts**: Read and write TRON contracts; automatic TRC20 approval checks for liquidity and swap flows.
- **Tokens & swaps**: Get TRX/TRC20 balances; quote and execute swaps via Universal Router or custom router.
- **Liquidity**: Add/remove V2 liquidity (including native TRX via addLiquidityETH/removeLiquidityETH); mint, increase, and decrease V3 positions with automatic amount and slippage handling.
- **Wallet**: Private key or BIP-39 mnemonic; optional Agent Wallet provider for remote signing.
- **Multi-network**: Mainnet, Nile, and Shasta with configurable RPC and TronGrid API key.

## MCP Server URL

|Environment|url|
|:---|:---|
|Production|[sun-mcp-server.bankofai.io/mcp](sun-mcp-server.bankofai.io/mcp)|

## Security Considerations

- **Private key management**: Configure `TRON_PRIVATE_KEY` or `TRON_MNEMONIC` via environment variables only. Do not hardcode them or store them in config files that may be committed.
- **Testnet first**: Test on Nile or Shasta before performing mainnet operations.
- **Least privilege**: Use wallets with only the minimum funds needed for the agent’s tasks.
- **Audit**: Consider a security review of the server and integration before production use.

## License

This project is released under the MIT License.
