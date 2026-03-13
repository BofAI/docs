# API Reference

## Tools

### Wallet & Address

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `sunswap_get_wallet_address` | Get the active TRON wallet address (Base58) used for SUNSWAP operations. | `network?` | Read |
| `sunswap_list_wallets` | List all available wallets (agent-wallet mode only). | - | Read |
| `sunswap_select_wallet` | Switch the active wallet (agent-wallet mode only). | `walletId` | Write |

### Balances

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `sunswap_get_balances` | Get TRX and TRC20 balances for a wallet. | `tokens`, `network?`, `ownerAddress?` | Read |

### Pricing & Quoting

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `sunswap_get_token_price` | Get token prices from SUN.IO API by address/symbol. | `tokenAddress?`, `symbol?` | Read |
| `sunswap_quote_exact_input` | Get swap quote from the smart router. | `routerAddress`, `args`, `network?`, `functionName?`, `abi?` | Read |

### Smart Contracts (Read)

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `sunswap_read_contract` | Read data from a TRON smart contract (view/pure functions). | `address`, `functionName`, `network?`, `args?`, `abi?` | Read |

### Smart Contracts (Write)

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `sunswap_send_contract` | Execute a state-changing contract transaction. | `address`, `functionName`, `network?`, `args?`, `value?`, `abi?` | Write |

### Swaps

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `sunswap_swap` | Execute a token swap via Universal Router. Automatically finds best route and handles Permit2. | `tokenIn`, `tokenOut`, `amountIn`, `network?`, `slippage?` | Write |
| `sunswap_swap_exact_input` | Low-level router swap with full control. | `routerAddress`, `args`, `network?`, `functionName?`, `value?`, `abi?` | Write |

### V2 Liquidity

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `sunswap_v2_add_liquidity` | Add liquidity to a V2 pool. Automatically handles TRX via `addLiquidityETH`. | `routerAddress`, `tokenA`, `tokenB`, `amountADesired`, `amountBDesired`, `network?`, `amountAMin?`, `amountBMin?`, `to?`, `deadline?`, `abi?` | Write |
| `sunswap_v2_remove_liquidity` | Remove liquidity from a V2 pool. | `routerAddress`, `tokenA`, `tokenB`, `liquidity`, `network?`, `amountAMin?`, `amountBMin?`, `to?`, `deadline?`, `abi?` | Write |

### V3 Liquidity

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `sunswap_v3_mint_position` | Mint a new V3 concentrated liquidity position with auto-compute features. | `positionManagerAddress`, `token0`, `token1`, `network?`, `fee?`, `tickLower?`, `tickUpper?`, `amount0Desired?`, `amount1Desired?`, `amount0Min?`, `amount1Min?`, `recipient?`, `deadline?`, `abi?` | Write |
| `sunswap_v3_increase_liquidity` | Add liquidity to an existing V3 position. | `positionManagerAddress`, `tokenId`, `network?`, `token0?`, `token1?`, `fee?`, `amount0Desired?`, `amount1Desired?`, `amount0Min?`, `amount1Min?`, `deadline?` | Write |
| `sunswap_v3_decrease_liquidity` | Remove liquidity from an existing V3 position. | `positionManagerAddress`, `tokenId`, `liquidity`, `network?`, `token0?`, `token1?`, `fee?`, `amount0Min?`, `amount1Min?`, `deadline?` | Write |
| `sunswap_v3_collect` | Collect accrued fees from a V3 position. | `positionManagerAddress`, `tokenId`, `network?`, `recipient?` | Write |

### V4 Liquidity

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `sunswap_v4_mint_position` | Mint a new V4 concentrated liquidity position with Permit2 authorization. | `token0`, `token1`, `network?`, `fee?`, `tickLower?`, `tickUpper?`, `amount0Desired?`, `amount1Desired?`, `slippage?`, `recipient?`, `deadline?`, `sqrtPriceX96?`, `createPoolIfNeeded?` | Write |
| `sunswap_v4_increase_liquidity` | Increase liquidity of an existing V4 position. | `tokenId`, `token0`, `token1`, `network?`, `fee?`, `amount0Desired?`, `amount1Desired?`, `slippage?`, `deadline?` | Write |
| `sunswap_v4_decrease_liquidity` | Decrease liquidity of an existing V4 position. | `tokenId`, `liquidity`, `token0`, `token1`, `network?`, `fee?`, `amount0Min?`, `amount1Min?`, `slippage?`, `deadline?` | Write |
| `sunswap_v4_collect` | Collect accrued fees from a V4 position. | `tokenId`, `network?`, `token0?`, `token1?`, `fee?`, `deadline?` | Write |

---

## OpenAPI-Derived Tools (SUN.IO API)

Tools are generated from `specs/sunio-open-api.json`. Naming follows the spec; parameters map to the corresponding API.

### Transactions

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `scanTransactions` | Scan DEX transactions by protocol, token/pool, type, and time range. | `protocol?`, `token?`, `pool?`, `type?`, `timeRange?` | Read |

### Tokens

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `getTokens` | Fetch tokens by address and protocol. | `address?`, `protocol?` | Read |
| `searchTokens` | Fuzzy token search by keyword. | `keyword` | Read |

### Protocols

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `getProtocol` | Protocol snapshot data. | - | Read |
| `getVolHistory` | Protocol volume history. | - | Read |
| `getUsersCountHistory` | Protocol users history. | - | Read |
| `getTransactionsHistory` | Protocol transaction count history. | - | Read |
| `getPoolsCountHistory` | Protocol pool count history. | - | Read |
| `getLiqHistory` | Protocol liquidity history. | - | Read |

### Prices

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `getPrice` | Token price query. | `tokenAddress` | Read |

### Positions

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `getUserPositions` | User liquidity positions. | `userAddress` | Read |
| `getPoolUserPositionTick` | Pool tick-level position/liquidity details. | `poolAddress`, `userAddress` | Read |

### Pools

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `getPools` | Fetch pools by address, token, or protocol. | `address?`, `token?`, `protocol?` | Read |
| `getTopApyPoolList` | Paginated top APY pools. | `limit?`, `offset?` | Read |
| `searchPools` | Pool search endpoint. | `keyword` | Read |
| `searchCountPools` | Pool search count endpoint. | `keyword` | Read |
| `getPoolHooks` | Pool hooks list. | `poolAddress` | Read |
| `getPoolVolHistory` | Pool volume history. | `poolAddress` | Read |
| `getPoolLiqHistory` | Pool liquidity history. | `poolAddress` | Read |

### Pairs

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `getPairsFromEntity` | Token pair entity query. | `token0?`, `token1?` | Read |

### Farms

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `getFarms` | Farming pool list. | - | Read |
| `getFarmTransactions` | Farm transaction scanning. | `farmAddress` | Read |
| `getFarmPositions` | User farming positions. | `userAddress` | Read |

---

## Default Contract Addresses

Defined in `src/sunswap/constants.ts`:

- **V2 Mainnet**: Factory (`SUNSWAP_V2_MAINNET_FACTORY`), Router (`SUNSWAP_V2_MAINNET_ROUTER`)
- **V2 Nile**: Factory (`SUNSWAP_V2_NILE_FACTORY`), Router (`SUNSWAP_V2_NILE_ROUTER`)
- **V3 Mainnet**: Factory (`SUNSWAP_V3_MAINNET_FACTORY`), Position Manager (`SUNSWAP_V3_MAINNET_POSITION_MANAGER`)
- **V3 Nile**: Factory (`SUNSWAP_V3_NILE_FACTORY`), Position Manager (`SUNSWAP_V3_NILE_POSITION_MANAGER`)
- **TRX**: `T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb`
- **WTRX** (mainnet/Nile): Used internally for TRX-pair lookups

Tool callers can rely on these defaults by passing `network` and token addresses, or override router/position-manager addresses and ABIs via tool parameters.

---

## Network Parameter

Where applicable, tools accept:

- **network** (optional): `mainnet` (default), `nile`, or `shasta`.
