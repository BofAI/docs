# Full Capability List

SUN MCP Server provides **41 tools** (18 custom DeFi tools + 23 SUN.IO OpenAPI derived tools).

## Understanding Two Key Concepts

:::info Read vs Write
- **Read Tools**: Only query data, do not affect on-chain state. Can be used in both cloud service and local deployment.
- **Write Tools**: Modify on-chain state (swaps, liquidity operations, etc.). Only available in local deployment with configured wallet.
:::

:::tip network Parameter
Most tools have an optional `network` parameter to specify the network environment for interaction. Defaults to mainnet configuration, can also switch to testnet.
:::

---

## Custom Tools (18 total)

### Wallet and Balance

| Tool Name | Function Description | Tool Type | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|---------|
| `sunswap_get_wallet_address` | Get current active TRON wallet address | Read | - | `network` |
| `sunswap_get_balances` | Query TRX and TRC20 token balances | Read | `tokens` | `network`, `ownerAddress` |

**Try saying this:**
- "Query my TRON wallet address"
- "Show my balance for USDT and SUNFLARE"
- "Get my TRX balance on testnet"

---

### Price and Quotes

| Tool Name | Function Description | Tool Type | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|---------|
| `sunswap_get_token_price` | Get token price (via SUN.IO API) | Read | `tokenAddress` or `symbol` | `network` |
| `sunswap_quote_exact_input` | Swap quote for exact input amount (smart routing) | Read | `routerAddress`, `args` | `network`, `functionName`, `abi` |

**Try saying this:**
- "What is the current price of SUNFLARE?"
- "If I swap 1000 USDT for SUNFLARE, how much will I get?"
- "Query the current price of USDC on testnet"

---

### Swaps

| Tool Name | Function Description | Tool Type | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|---------|
| `sunswap_swap` | Execute generic router swap (supports auto-routing + Permit2) | Write | `tokenIn`, `tokenOut`, `amountIn` | `network`, `slippage` |
| `sunswap_swap_exact_input` | Exact input swap (smart router) | Write | `routerAddress`, `args` | `network`, `functionName`, `value`, `abi` |

**Try saying this:**
- "I want to swap 500 USDT for SUNFLARE with 1% slippage"
- "Execute a swap of 1000 USDC for TRX"
- "Help me swap SUNFLARE to USDT, completed in less than 2 seconds"

:::caution Wallet Required
Swap tools require local deployment of SUN MCP Server with configured wallet private key.
:::

---

### V2 Liquidity

| Tool Name | Function Description | Tool Type | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|---------|
| `sunswap_v2_add_liquidity` | Add V2 liquidity (automatic TRX/WTRX handling) | Write | `routerAddress`, `tokenA`, `tokenB`, `amountADesired`, `amountBDesired` | `network`, `amountAMin`, `amountBMin`, `to`, `deadline`, `abi` |
| `sunswap_v2_remove_liquidity` | Remove V2 liquidity | Write | `routerAddress`, `tokenA`, `tokenB`, `liquidity` | `network`, `amountAMin`, `amountBMin`, `to`, `deadline`, `abi` |

**Try saying this:**
- "I want to add 1000 USDT and equivalent SUNFLARE to V2 liquidity pool"
- "Remove 50% of my liquidity from the USDC-TRX pool"
- "Add V2 liquidity with minimum 950 USDT and 9500 SUNFLARE"

:::info Auto-handling
When the pair involves TRX, the tool automatically converts to WTRX.
:::

---

### V3 Liquidity

| Tool Name | Function Description | Tool Type | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|---------|
| `sunswap_v3_mint_position` | Create V3 concentrated liquidity position | Write | `positionManagerAddress`, `token0`, `token1` | `network`, `fee`, `tickLower`, `tickUpper`, `amount0Desired`, `amount1Desired`, `amount0Min`, `amount1Min`, `recipient`, `deadline`, `abi` |
| `sunswap_v3_increase_liquidity` | Increase V3 liquidity | Write | `positionManagerAddress`, `tokenId` | `network`, `token0`, `token1`, `fee`, `amount0Desired`, `amount1Desired`, `amount0Min`, `amount1Min`, `deadline` |
| `sunswap_v3_decrease_liquidity` | Decrease V3 liquidity | Write | `positionManagerAddress`, `tokenId`, `liquidity` | `network`, `token0`, `token1`, `fee`, `amount0Min`, `amount1Min`, `deadline` |
| `sunswap_v3_collect` | Collect V3 fees | Write | `positionManagerAddress`, `tokenId` | `network`, `recipient`, `abi` |

**Try saying this:**
- "Help me create liquidity in the USDT-SUNFLARE V3 0.3% fee pool with range ±50 ticks"
- "Increase my V3 position #12345 by adding 1000 USDT"
- "Collect fees from my V3 position"
- "Decrease V3 liquidity to 50%"

:::tip Auto-calculation
When creating a new position, the system automatically calculates tick range (±50×tickSpacing) and optimal single-sided input amounts.
:::

---

### V4 Liquidity

| Tool Name | Function Description | Tool Type | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|---------|
| `sunswap_v4_mint_position` | Create V4 position (Permit2 supported) | Write | `token0`, `token1` | `network`, `fee`, `tickLower`, `tickUpper`, `amount0Desired`, `amount1Desired`, `slippage`, `recipient`, `deadline`, `sqrtPriceX96`, `createPoolIfNeeded` |
| `sunswap_v4_increase_liquidity` | Increase V4 liquidity (Permit2 supported) | Write | `tokenId`, `token0`, `token1` | `network`, `fee`, `amount0Desired`, `amount1Desired`, `slippage`, `deadline` |
| `sunswap_v4_decrease_liquidity` | Decrease V4 liquidity | Write | `tokenId`, `liquidity`, `token0`, `token1` | `network`, `fee`, `amount0Min`, `amount1Min`, `slippage`, `deadline` |
| `sunswap_v4_collect` | Collect V4 fees | Write | `tokenId` | `network`, `token0`, `token1`, `fee`, `deadline` |

**Try saying this:**
- "Create a USDC-SUNFLARE liquidity position in V4 with 5% slippage"
- "Increase my V4 position #67890 by injecting 5000 USDC"
- "Collect all accumulated fees from V4 position"
- "Decrease V4 liquidity ensuring slippage stays within 3%"

:::info Permit2 Support
V4 tools natively support Permit2 signature authorization, improving user experience.
:::

---

### Contract Interaction

| Tool Name | Function Description | Tool Type | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|---------|
| `sunswap_read_contract` | Read data from TRON smart contract (view/pure) | Read | `address`, `functionName` | `network`, `args`, `abi` |
| `sunswap_send_contract` | Send state-changing contract transaction | Write | `address`, `functionName` | `network`, `args`, `value`, `abi` |

**Try saying this:**
- "Query the total supply of SUNFLARE contract"
- "Read my balance in the liquidity contract"
- "Call contract function to update pool parameters"
- "Send 0.1 TRX to contract and execute specific function"

:::caution ABI Requirement
If ABI is not provided, the system will attempt to retrieve contract ABI from TronScan.
:::

---

## SUN.IO OpenAPI Derived Tools (23 total)

### Transactions

| Tool Name | Function Description | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|
| `scanTransactions` | Scan DEX transactions | - | `protocol`, `token`, `pool`, `type`, `timeRange` |
| `getFarmTransactions` | Scan farm pool transactions | `farmAddress` | - |

**Try saying this:**
- "View SUN protocol transactions from the past 24 hours"
- "Query all transactions in the SUNFLARE-USDT pool"
- "Get transaction data from the last 7 days"

---

### Tokens

| Tool Name | Function Description | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|
| `getTokens` | Get tokens by address or protocol | - | `address`, `protocol` |
| `searchTokens` | Fuzzy search tokens | `keyword` | - |
| `getPrice` | Get token price by address | `tokenAddress` | - |

**Try saying this:**
- "Search for 'SUNFLARE' token"
- "Get token information for address `TR7NHqjeKQxGTCi8q282JHJC8YXQFg...`"
- "Query USDT price in SUN protocol"

---

### Protocol

| Tool Name | Function Description | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|
| `getProtocol` | Protocol snapshot data | - | - |
| `getVolHistory` | Protocol volume history | - | - |
| `getLiqHistory` | Protocol liquidity history | - | - |
| `getUsersCountHistory` | Protocol user count history | - | - |
| `getTransactionsHistory` | Protocol transaction count history | - | - |
| `getPoolsCountHistory` | Protocol pool count history | - | - |

**Try saying this:**
- "Get the latest snapshot of SUN protocol"
- "View volume trends over the past 30 days"
- "Get protocol user growth information"

---

### Price

| Tool Name | Function Description | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|
| `getPrice` | Token price query | `tokenAddress` | - |

**Try saying this:**
- "Get the real-time price of SUNFLARE token"

---

### Positions

| Tool Name | Function Description | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|
| `getUserPositions` | User liquidity positions | `userAddress` | - |
| `getPoolUserPositionTick` | Pool user tick-level position details | `poolAddress`, `userAddress` | - |
| `getFarmPositions` | User farm positions | `userAddress` | - |

**Try saying this:**
- "View all my liquidity positions"
- "Get my tick-level details in the USDT-SUNFLARE pool"
- "Query my farm yield positions"

---

### Pools

| Tool Name | Function Description | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|
| `getPools` | Get pools | - | `address`, `token`, `protocol` |
| `searchPools` | Search pools | `keyword` | - |
| `searchCountPools` | Pool search count | `keyword` | - |
| `getTopApyPoolList` | Get top APY pool list | - | `limit`, `offset` |
| `getPoolHooks` | Pool hooks | `poolAddress` | - |
| `getPoolVolHistory` | Pool volume history | `poolAddress` | - |
| `getPoolLiqHistory` | Pool liquidity history | `poolAddress` | - |

**Try saying this:**
- "Get detailed information about the SUNFLARE-USDT pool"
- "Find the top 10 pools with highest APY"
- "Get volume history of the USDC-TRX pool"
- "Query all hooks used by the pool"

---

### Trading Pairs

| Tool Name | Function Description | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|
| `getPairsFromEntity` | Token pair query | - | `token0`, `token1` |

**Try saying this:**
- "Get trading pair information between SUNFLARE and USDT"
- "Query all trading pairs containing USDC"

---

### Farm

| Tool Name | Function Description | Required Parameters | Optional Parameters |
|--------|---------|---------|---------|
| `getFarms` | Farm pool list | - | - |

**Try saying this:**
- "List all available farm pools"
- "Query current farm reward situation"

---

## Auto-Calculation Features

SUN MCP Server has multiple tools with built-in intelligent auto-calculation features designed to simplify user interaction:

### V3 Liquidity Auto-Calculation

**`sunswap_v3_mint_position` Auto Features:**

| Feature | Description | Use Case |
|------|------|---------|
| **Default Fee** | If `fee` not specified, system automatically uses `3000` (0.3%) | Quickly create standard liquidity position |
| **Tick Range Calculation** | Automatically set `tickLower` and `tickUpper` to `±50 × tickSpacing` | No need to manually calculate complex math, get reasonable range directly |
| **Single-Sided Input Handling** | Can specify only one token amount, system automatically calculates required amount of other token | Simplify multi-token liquidity deployment |

**Example:**
```
Request: Create V3 position in USDT-SUNFLARE pool, inject 1000 USDT
System automatically:
  - Set fee to 3000 (0.3%)
  - Calculate ±50 tick range
  - Based on current price, calculate required SUNFLARE amount
  - Submit multi-token authorization and transaction in one go
```

### V4 Liquidity Auto-Calculation

**`sunswap_v4_mint_position` Auto Features:**

| Feature | Description | Use Case |
|------|------|---------|
| **Tick Range Calculation** | Automatically set `tickLower` and `tickUpper` to `±100 × tickSpacing` | V4's more flexible range configuration |
| **Default Slippage** | If `slippage` not specified, system automatically uses `5%` | Protect users from price volatility |
| **Permit2 Authorization** | Native support for Permit2 signature process, no need for multiple approvals | Improve user experience, complete all authorizations with one signature |
| **Dynamic Pool Creation** | If pool doesn't exist, `createPoolIfNeeded` can automatically create new pool | Quickly establish liquidity for new trading pairs |

**Example:**
```
Request: Create USDC-SUNFLARE position in V4 with 3% slippage
System automatically:
  - Calculate ±100 tick range
  - Use Permit2 signature authorization
  - Create new pool if it doesn't exist
  - Based on current price, calculate optimal input ratio
```

### Smart Swap Routing

**`sunswap_swap` Auto Features:**

| Feature | Description | Use Case |
|------|------|---------|
| **Multi-Route Optimization** | Automatically find optimal swap path, support direct trading pairs and multi-hop routes | Get best price |
| **Permit2 Integration** | No need to pre-approve tokens, complete authorization and swap with one signature | Improve user flow |

**Example:**
```
Request: Swap 1000 USDT for SUNFLARE with 1% slippage
System automatically:
  - Evaluate direct USDT-SUNFLARE pool
  - Evaluate USDT → intermediate → SUNFLARE routes
  - Choose optimal path
  - Use Permit2 one-time signature to complete authorization and trade
  - Ensure slippage doesn't exceed 1%
```

### Key Parameter Reference

| Parameter | Default Value | When Auto-Calculated |
|------|--------|-----------|
| `fee` (V3) | 3000 | When not provided |
| `tickLower`, `tickUpper` (V3) | ±50×tickSpacing | When not provided |
| `tickLower`, `tickUpper` (V4) | ±100×tickSpacing | When not provided |
| `slippage` (V4) | 5% | When not provided |
| Counterparty token amount | Calculated by current price | When only one token amount specified |

:::tip Best Practice
Although most parameters are auto-calculated, for critical operations (such as adding large amounts of liquidity), it's recommended to actively specify parameters to get higher control precision.
:::

---

## Quick Reference

**Need to query data?** Use read tools: `get_*`, `search_*`, `scan*` series.

**Need to execute transactions?** Use write tools: `swap`, `mint`, `add`, `remove`, `collect`, `send_contract` series.

**Not sure about parameters?** Tools will auto-calculate reasonable defaults, or prompt you for additional info when necessary.

**Want to learn more?** Check [SUN MCP Server main documentation](../README.md) or [API Reference](../API-Reference.md).

