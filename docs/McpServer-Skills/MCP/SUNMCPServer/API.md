# API Reference

## Tools

### Wallet & Address

| Tool Name                  | Description                                                                 | Key Parameters |
|---------------------------|-----------------------------------------------------------------------------|----------------|
| sunswap_get_wallet_address | Get the active TRON wallet address (Base58) used for SUNSWAP operations.   | network        |

### Balances

| Tool Name           | Description                                      | Key Parameters                 |
|--------------------|--------------------------------------------------|--------------------------------|
| sunswap_get_balances | Get TRX and TRC20 balances for an address.      | network, ownerAddress, tokens  |

### Pricing & Quoting

| Tool Name                  | Description                                              | Key Parameters              |
|---------------------------|----------------------------------------------------------|-----------------------------|
| sunswap_get_token_price   | Get token prices from SUN.IO API by address/symbol.      | tokenAddress, symbol        |
| sunswap_quote_exact_input | Quote exact-input swap via a router’s view function.      | network, routerAddress, args, abi |

### Smart Contracts (Read)

| Tool Name             | Description                                           | Key Parameters                    |
|----------------------|-------------------------------------------------------|-----------------------------------|
| sunswap_read_contract | Call view/pure functions on a TRON contract.          | network, address, functionName, args, abi |

### Smart Contracts (Write)

| Tool Name              | Description                                           | Key Parameters                         |
|------------------------|-------------------------------------------------------|----------------------------------------|
| sunswap_send_contract  | Execute a state-changing contract function.           | network, address, functionName, args, value, abi |

### Swaps

| Tool Name                 | Description                                                                 | Key Parameters                                    |
|---------------------------|-----------------------------------------------------------------------------|---------------------------------------------------|
| sunswap_swap              | Execute a swap via Universal Router (tokenIn, tokenOut, amountIn).         | tokenIn, tokenOut, amountIn, network, slippage    |
| sunswap_swap_exact_input  | Execute router swapExactInput with explicit router and args.                | network, routerAddress, functionName, args, value, abi |

### V2 Liquidity

| Tool Name                     | Description                                                                 | Key Parameters                                                                 |
|------------------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| sunswap_v2_add_liquidity     | Add liquidity to a V2 pool; uses addLiquidityETH if one token is native TRX. | network, routerAddress, tokenA, tokenB, amountADesired, amountBDesired, to, deadline |
| sunswap_v2_remove_liquidity  | Remove V2 liquidity; uses removeLiquidityETH if one token is TRX.           | network, routerAddress, tokenA, tokenB, liquidity, to, deadline               |

### V3 Liquidity

| Tool Name                       | Description                                  | Key Parameters                                                                 |
|--------------------------------|----------------------------------------------|--------------------------------------------------------------------------------|
| sunswap_v3_mint_position       | Mint a new V3 concentrated liquidity position. | network, positionManagerAddress, token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, recipient, deadline |
| sunswap_v3_increase_liquidity  | Increase liquidity of an existing V3 position. | network, positionManagerAddress, tokenId, amount0Desired, amount1Desired, amount0Min, amount1Min, deadline |
| sunswap_v3_decrease_liquidity  | Decrease liquidity of an existing V3 position. | network, positionManagerAddress, tokenId, liquidity, amount0Min, amount1Min, deadline |

## OpenAPI-Derived Tools (SUN.IO API)

Tools are generated from `specs/sunio-open-api.json`. Naming follows the spec; parameters map to the corresponding API. Main groups:

- **Transactions**: scanTransactions
- **Tokens**: getTokens, searchTokens
- **Protocols**: getProtocol, getVolHistory, getUsersCountHistory, getTransactionsHistory, getPoolsCountHistory, getLiqHistory
- **Prices**: getPrice
- **Positions**: getUserPositions, getPoolUserPositionTick
- **Pools**: getPools, getTopApyPoolList, searchPools, searchCountPools, getPoolHooks, getPoolVolHistory, getPoolLiqHistory
- **Pairs**: getPairsFromEntity
- **Farms**: getFarms, getFarmTransactions, getFarmPositions

## Default Contract Addresses

Defined in `src/sunswap/constants.ts`:

- **V2 Mainnet**: Factory, Router
- **V2 Nile**: Factory, Router
- **V3 Mainnet**: Factory, NonfungiblePositionManager
- **V3 Nile**: Factory, NonfungiblePositionManager
- **TRX**: `T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb`
- **WTRX** (mainnet/Nile): Used internally for TRX-pair lookups

Tool callers can rely on these defaults by passing `network` and token addresses, or override router/position-manager addresses and ABIs via tool parameters.

## Network Parameter

Where applicable, tools accept:

- **network** (optional): `mainnet` (default), `nile`, or `shasta`.
