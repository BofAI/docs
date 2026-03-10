# OverView

SUN MCP Server is a Model Context Protocol (MCP) server for the **SUN.IO (SUNSWAP)** ecosystem on the TRON network. It allows AI agents to query SUN.IO API data (tokens, pools, prices, protocol metrics, transactions, farming, contracts) and perform DeFi operations such as swaps and V2/V3 liquidity management through a unified tool interface.

Based on the [Model Context Protocol](https://modelcontextprotocol.io/), this service provides on-chain and API capabilities to MCP-compatible clients (such as Claude Desktop, Cursor, Google Antigravity) and integrates:

- **OpenAPI-based tools**: From the SUN.IO public API specification (`specs/sunio-open-api.json`), used for read-only queries.
- **Custom SUNSWAP tools** (`sunswap_*`): Wallets, balances, quotes, swaps, and V2/V3 liquidity, supported by `tronweb` and on-chain contract calls.

## Key Features

- **SUN.IO API**: Query tokens, pools, prices, protocol history, positions, farms, and transactions.
- **Smart Contracts**: Read and write TRON contracts; automatic TRC20 allowance checks during liquidity and swap processes.
- **Tokens & Swaps**: Query TRX/TRC20 balances; quote and execute swaps via Universal Router or custom routing.
- **Liquidity**: Add/remove V2 liquidity (including `addLiquidityETH`/`removeLiquidityETH` for native TRX); mint, increase, and decrease V3 positions, with automatic handling of amounts and slippage.
- **Wallet**: Supports private keys or BIP-39 mnemonics; optional Agent Wallet provider for remote signing.
- **Multi-Network**: Supports Mainnet, Nile, Shasta, with configurable RPC and TronGrid API Key.

## MCP Server URL
For the convenience of users with different needs, you can choose to connect directly to the [official cloud service](./UsingOfficialService.md) or choose to perform [local deployment](./UsingLocalService.md) on your own computer. Among them, the official service only provides reading services.

| Environment | url |
| :--- | :--- |
| Production | [https://sun-mcp-server.bankofai.io/mcp](https://sun-mcp-server.bankofai.io/mcp) |


## Core Capabilities Overview

- **SUN.IO API**: Query tokens, pools, prices, protocol history, positions, farms, and transactions.
- **Smart Contracts**: Read and write TRON contracts; automatic TRC20 allowance checks during liquidity and swap processes.
- **Tokens & Swaps**: Query TRX/TRC20 balances; quote and execute swaps via Universal Router or custom routing.
- **Liquidity**: Add/remove V2 liquidity (including `addLiquidityETH`/`removeLiquidityETH` for native TRX); mint, increase, and decrease V3 positions, with automatic handling of amounts and slippage.
- **Wallet**: Supports private keys or BIP-39 mnemonics; optional Agent Wallet provider for remote signing.
- **Multi-Network**: Supports Mainnet, Nile, Shasta, with configurable RPC and TronGrid API Key.


## Detailed Functional Features

A specific list of functions provided by SUN MCP Server for the reference of developers and advanced users:

### SUN.IO API (Read-only)

Tools are generated from `specs/sunio-open-api.json`, requesting the SUN.IO public API. Supported areas include:

- **Transactions**: Paginated scanning of activities such as swap/add/extract.
- **Tokens**: Get token metadata, search for tokens.
- **Protocol**: Protocol snapshots and historical KPIs (volume, number of users, number of transactions, number of pools, liquidity).
- **Price**: Query token price by address.
- **Positions**: User liquidity positions and pool tick-level data.
- **Pools**: List/search pools, highest APY, hooks, volume and liquidity history.
- **Trading Pairs**: Token pair information.
- **Farming**: Farm list, farm transactions, user farm positions.

### SUNSWAP Custom Tools

#### Wallet and Balance

- **sunswap_get_wallet_address**: Resolve the current TRON wallet (local private key/mnemonic or Agent Wallet).
- **sunswap_get_balances**: Query the TRX and TRC20 balance of an address (default current wallet).

#### Price and Quote

- **sunswap_get_token_price**: Get token price by address and/or symbol via SUN.IO API.
- **sunswap_quote_exact_input**: Perform exact input swap quotation through the view function of the specified router.

#### Smart Contract Interaction

- **sunswap_read_contract**: Call the view/pure function of any TRON contract (use the solidity node read-only path where applicable).
- **sunswap_send_contract**: Execute contract calls that change state, can be accompanied by a TRX amount.

#### Swap

- **sunswap_swap**: High-level swap through Universal Router; only tokenIn, tokenOut, amountIn (optional network/slippage) are required.
- **sunswap_swap_exact_input**: Low-level routing swap according to router address, function name and ABI parameter order.

#### V2 Liquidity

- **sunswap_v2_add_liquidity**: Add liquidity to V2 pool. If one side is native TRX (`T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb`), use addLiquidityETH, otherwise use addLiquidity. Automatically calculate the optimal quantity according to the pool reserve to match the proportion; TRC20 authorization is automatically handled.
- **sunswap_v2_remove_liquidity**: Remove V2 liquidity. Use removeLiquidityETH when one side is TRX. LP authorization and amountMin/amountBMin (calculated by reserve and slippage) are automatically handled.

#### V3 Liquidity

- **sunswap_v3_mint_position**: Mint new V3 concentrated liquidity position (NonfungiblePositionManager). Automatically authorize token0/token1; optional amountMin and deadline default values.
- **sunswap_v3_increase_liquidity**: Increase liquidity for existing V3 positions.
- **sunswap_v3_decrease_liquidity**: Decrease liquidity for existing V3 positions.

### Supported Networks

| Network | Identifier | Description |
|----------|-------------|------------|
| Mainnet | `mainnet` | Default |
| Nile | `nile` | Testnet |
| Shasta | `shasta` | Testnet |

### Transport Methods

- **stdio**: Default; used for local MCP clients (such as Claude Desktop, Cursor).
- **streamable-http**: HTTP + server-side push events, for remote clients; configurable host, port, path.

## Security Instructions

- **Private Keys and Mnemonics**: Only configure `TRON_PRIVATE_KEY` or `TRON_MNEMONIC` through environment variables, do not hardcode in code or configuration files that may be submitted.
- **Use Testnet First**: Please test fully on Nile or Shasta before operating on the mainnet.
- **Minimum Privilege**: The wallet configured for the agent only keeps the minimum funds required to complete the task.
- **Audit**: It is recommended to do a security audit of the server side and integration method before production use.
