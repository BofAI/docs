
# Introduction

SUN MCP Server is a Model Context Protocol (MCP) server for the **SUN.IO (SUNSWAP)** ecosystem on the TRON network. It allows AI agents to query SUN.IO API data (tokens, pools, prices, protocol metrics, transactions, farming, contracts) and perform DeFi operations such as swaps and V2/V3 liquidity management through a unified tool interface.

Based on the [Model Context Protocol](https://modelcontextprotocol.io/), this service provides on-chain and API capabilities to MCP-compatible clients (such as Claude Desktop, Cursor, Google Antigravity) and integrates:

- **OpenAPI-based tools**: From the SUN.IO public API specification (`specs/sunio-open-api.json`), used for read-only queries.
- **Custom SUNSWAP tools** (`sunswap_*`): Wallets, balances, quotes, swaps, and V2/V3 liquidity, supported by `tronweb` and on-chain contract calls.

## MCP Server URL
For the convenience of users with different needs, you can choose to connect directly to the [official cloud service](./OfficialServerAccess.md) or choose to perform [local deployment](./LocalPrivatizedDeployment.md) on your own computer. The official service only provides read-only services.

| Environment | URL |
| :--- | :--- |
| Production | [https://sun-mcp-server.bankofai.io/mcp](https://sun-mcp-server.bankofai.io/mcp) |


## Core Capabilities Overview

*   **SUN.IO API (Read-only)**: Query tokens, pools, prices, protocol history, positions, farms, and transactions.
*   **Wallet & Balance**: Get wallet address, list/switch wallets, query TRX and TRC20 balances.
*   **Pricing & Quoting**: Get token prices by address/symbol; get swap quotes via the smart router.
*   **Smart Contract Interaction**: Read and write TRON contracts; automatic TRC20 allowance checks during liquidity and swap processes.
*   **Swaps**: Smart swap via Universal Router or low-level swap with specified router.
*   **V2 Liquidity**: Add/remove V2 liquidity, with automatic native TRX handling.
*   **V3 Liquidity**: Mint, increase, decrease V3 concentrated liquidity positions and collect fees.
*   **V4 Liquidity**: Mint, increase, decrease V4 concentrated liquidity positions and collect fees, with Permit2 support.
*   **Wallet & Security**: Supports private keys or BIP-39 mnemonics; optional Agent Wallet; full coverage of Mainnet, Nile, and Shasta.


## Detailed Functional Features

A specific list of functions provided by SUN MCP Server, for reference by developers and advanced users:

### SUN.IO API (Read-only)
*   **Transactions**: Scan DEX transactions by protocol, token/pool, type, and time range.
*   **Tokens**: Get token information by address and protocol, with fuzzy keyword search support.
*   **Protocol**: Protocol snapshot data and historical KPIs (volume, users, transactions, pool count, liquidity).
*   **Prices**: Query token prices by address.
*   **Positions**: Query user liquidity positions and pool tick-level position/liquidity details.
*   **Pools**: List/search pools, top APY pools, hooks, volume and liquidity history.
*   **Trading Pairs**: Token pair entity queries.
*   **Farms**: Farm list, farm transaction scanning, user farm positions.

### Wallet & Balance
*   **Wallet Address**: Get the current TRON wallet address (Base58) used for SUNSWAP operations.
*   **Wallet List**: List all available wallets (agent-wallet mode only).
*   **Switch Wallet**: Switch the active wallet (agent-wallet mode only).
*   **Balance Query**: Query TRX and TRC20 balances for an address.

### Pricing & Quoting
*   **Token Price**: Get token prices by address/symbol via SUN.IO API.
*   **Swap Quote**: Get exact input swap quotes via the smart router.

### Smart Contract Interaction
*   **Read Contract**: Call view/pure functions on TRON contracts.
*   **Write Contract**: Execute state-changing contract function calls, with optional TRX value.

### Swaps
*   **Smart Swap**: Execute swaps via Universal Router, automatically finding the best route and handling Permit2 authorization.
*   **Low-level Swap**: Execute swaps with specified router and parameters, with full control over routing details.

### V2 Liquidity
*   **Add Liquidity**: Add liquidity to a V2 pool; automatically uses `addLiquidityETH` when one side is native TRX, with automatic TRC20 approval handling.
*   **Remove Liquidity**: Remove V2 liquidity; automatically uses `removeLiquidityETH` when one side is TRX.

### V3 Liquidity
*   **Mint Position**: Mint a new V3 concentrated liquidity position with auto-compute features.
*   **Increase Liquidity**: Increase liquidity for an existing V3 position.
*   **Decrease Liquidity**: Decrease liquidity for an existing V3 position.
*   **Collect Fees**: Collect accrued fees from a V3 position.

### V4 Liquidity
*   **Mint Position**: Mint a new V4 concentrated liquidity position with Permit2 authorization.
*   **Increase Liquidity**: Increase liquidity for an existing V4 position.
*   **Decrease Liquidity**: Decrease liquidity for an existing V4 position.
*   **Collect Fees**: Collect accrued fees from a V4 position.

### Wallet & Security
*   **Flexible Configuration**: Supports configuration via `TRON_PRIVATE_KEY` or `TRON_MNEMONIC`.
*   **Agent Wallet**: Optional Agent Wallet provider for remote signing.
*   **Multi-Network Support**: Full coverage of Mainnet, Nile, and Shasta, with configurable RPC and TronGrid API Key.

## Security Notes

- **Private Keys and Mnemonics**: Only configure `TRON_PRIVATE_KEY` or `TRON_MNEMONIC` through environment variables. Do not hardcode in code or configuration files that may be committed.
- **Use Testnet First**: Test thoroughly on Nile or Shasta before operating on mainnet.
- **Minimum Privilege**: The wallet configured for the agent should only hold the minimum funds required to complete the task.
- **Audit**: A security audit of the server and integration approach is recommended before production use.
