# API 参考

## 工具

### 钱包与地址

| 工具名称                   | 说明                                       | 主要参数   |
|---------------------------|--------------------------------------------|------------|
| sunswap_get_wallet_address | 获取当前用于 SUNSWAP 操作的 TRON 钱包地址（Base58）。 | network    |

### 余额

| 工具名称             | 说明                           | 主要参数                |
|----------------------|--------------------------------|-------------------------|
| sunswap_get_balances | 查询某地址的 TRX 与 TRC20 余额。 | network, ownerAddress, tokens |

### 价格与报价

| 工具名称                   | 说明                                   | 主要参数               |
|---------------------------|----------------------------------------|------------------------|
| sunswap_get_token_price   | 通过 SUN.IO API 按地址/符号获取代币价格。 | tokenAddress, symbol   |
| sunswap_quote_exact_input | 通过路由器的 view 函数进行精确输入兑换报价。 | network, routerAddress, args, abi |

### 智能合约（读）

| 工具名称              | 说明                           | 主要参数                         |
|----------------------|--------------------------------|----------------------------------|
| sunswap_read_contract | 调用 TRON 合约的 view/pure 函数。 | network, address, functionName, args, abi |

### 智能合约（写）

| 工具名称               | 说明                         | 主要参数                              |
|------------------------|------------------------------|---------------------------------------|
| sunswap_send_contract  | 执行会改变状态的合约函数调用。 | network, address, functionName, args, value, abi |

### 兑换

| 工具名称                  | 说明                                               | 主要参数                             |
|---------------------------|----------------------------------------------------|--------------------------------------|
| sunswap_swap              | 通过 Universal Router 执行兑换（tokenIn, tokenOut, amountIn）。 | tokenIn, tokenOut, amountIn, network, slippage |
| sunswap_swap_exact_input  | 使用指定路由器与参数执行 swapExactInput。           | network, routerAddress, functionName, args, value, abi |

### V2 流动性

| 工具名称                     | 说明                                                                 | 主要参数                                                                 |
|-----------------------------|----------------------------------------------------------------------|--------------------------------------------------------------------------|
| sunswap_v2_add_liquidity    | 向 V2 池添加流动性；若其中一档为原生 TRX 则使用 addLiquidityETH。       | network, routerAddress, tokenA, tokenB, amountADesired, amountBDesired, to, deadline |
| sunswap_v2_remove_liquidity | 移除 V2 流动性；若其中一档为 TRX 则使用 removeLiquidityETH。           | network, routerAddress, tokenA, tokenB, liquidity, to, deadline         |

### V3 流动性

| 工具名称                       | 说明                               | 主要参数                                                                 |
|------------------------------|------------------------------------|--------------------------------------------------------------------------|
| sunswap_v3_mint_position      | 铸造新的 V3 集中流动性仓位。         | network, positionManagerAddress, token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, recipient, deadline |
| sunswap_v3_increase_liquidity | 为已有 V3 仓位增加流动性。           | network, positionManagerAddress, tokenId, amount0Desired, amount1Desired, amount0Min, amount1Min, deadline |
| sunswap_v3_decrease_liquidity | 减少已有 V3 仓位的流动性。           | network, positionManagerAddress, tokenId, liquidity, amount0Min, amount1Min, deadline |

## OpenAPI 衍生工具（SUN.IO API）

工具由 `specs/sunio-open-api.json` 生成，命名与参数与规范一致。主要分组：

- **交易**：scanTransactions
- **代币**：getTokens, searchTokens
- **协议**：getProtocol, getVolHistory, getUsersCountHistory, getTransactionsHistory, getPoolsCountHistory, getLiqHistory
- **价格**：getPrice
- **持仓**：getUserPositions, getPoolUserPositionTick
- **池子**：getPools, getTopApyPoolList, searchPools, searchCountPools, getPoolHooks, getPoolVolHistory, getPoolLiqHistory
- **交易对**：getPairsFromEntity
- **农场**：getFarms, getFarmTransactions, getFarmPositions

## 默认合约地址

在 `src/sunswap/constants.ts` 中定义：

- **V2 主网**：Factory、Router
- **V2 Nile**：Factory、Router
- **V3 主网**：Factory、NonfungiblePositionManager
- **V3 Nile**：Factory、NonfungiblePositionManager
- **TRX**：`T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb`
- **WTRX**（主网/Nile）：内部用于 TRX 交易对查询

调用方可仅传 `network` 与代币地址使用上述默认地址，也可通过工具参数覆盖路由器/仓位管理器地址与 ABI。

## 网络参数

在支持的工具中可传入：

- **network**（可选）：`mainnet`（默认）、`nile` 或 `shasta`。
