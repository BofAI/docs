# Features

## SUN.IO API (Read-Only)

Tools are generated from `specs/sunio-open-api.json` and target the SUN.IO public API. Supported domains include:

- **Transactions**: Scan swap/add/withdraw activity with pagination.
- **Tokens**: Fetch token metadata and search tokens.
- **Protocols**: Protocol snapshots and historical KPI (volume, users, transactions, pools, liquidity).
- **Prices**: Token price by address.
- **Positions**: User liquidity positions and pool tick-level data.
- **Pools**: List/search pools, top APY, hooks, volume and liquidity history.
- **Pairs**: Token pair information.
- **Farms**: Farm list, farm transactions, user farm positions.

## SUNSWAP Custom Tools

### Wallet & Balances

- **sunswap_get_wallet_address**: Resolve the active TRON wallet (local key/mnemonic or Agent Wallet).
- **sunswap_get_balances**: TRX and TRC20 balances for an address (default: active wallet).

### Pricing & Quoting

- **sunswap_get_token_price**: Token prices from SUN.IO API by address and/or symbol.
- **sunswap_quote_exact_input**: Quote exact-input swap via a given router’s view function.

### Smart Contract Interaction

- **sunswap_read_contract**: Call view/pure functions on any TRON contract (uses solidity-node read path where applicable).
- **sunswap_send_contract**: Execute state-changing contract calls with optional TRX value.

### Swaps

- **sunswap_swap**: High-level swap via Universal Router; only needs tokenIn, tokenOut, amountIn (optional network/slippage).
- **sunswap_swap_exact_input**: Low-level router swap by router address, function name, and ABI-ordered args.

### V2 Liquidity

- **sunswap_v2_add_liquidity**: Add liquidity to a V2 pool. If one token is native TRX (`T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb`), uses addLiquidityETH; otherwise addLiquidity. Optimal amounts are computed from pool reserves to match ratio; TRC20 approvals are handled automatically.
- **sunswap_v2_remove_liquidity**: Remove V2 liquidity. Uses removeLiquidityETH when one side is TRX. LP allowance and amountMin/amountBMin (from reserves + slippage) are handled automatically.

### V3 Liquidity

- **sunswap_v3_mint_position**: Mint a new V3 concentrated liquidity position (NonfungiblePositionManager). Auto-approval for token0/token1; optional amountMin and deadline defaults.
- **sunswap_v3_increase_liquidity**: Add liquidity to an existing V3 position.
- **sunswap_v3_decrease_liquidity**: Decrease liquidity of an existing V3 position.

## Supported Networks

| Network   | Identifier   | Notes                    |
|----------|--------------|--------------------------|
| Mainnet  | `mainnet`    | Default                  |
| Nile     | `nile`       | Testnet                  |
| Shasta   | `shasta`     | Testnet                  |

## Transport

- **stdio**: Default; for local MCP clients (e.g. Claude Desktop, Cursor).
- **streamable-http**: HTTP + Server-Sent Events for remote clients; configurable host, port, and path.
