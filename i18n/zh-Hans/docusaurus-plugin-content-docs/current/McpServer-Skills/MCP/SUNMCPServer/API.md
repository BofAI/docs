# API 参考

## 工具

### 钱包与地址

| 工具名称                   | 说明                                       | 主要参数   | 模式 |
|---------------------------|--------------------------------------------|------------|------|
| sunswap_get_wallet_address | 获取当前用于 SUNSWAP 操作的 TRON 钱包地址（Base58）。 | `network?`    | 读取 |
| sunswap_list_wallets       | 列出所有可用钱包（仅 agent-wallet 模式）。             | -          | 读取 |
| sunswap_select_wallet      | 切换活跃钱包（仅 agent-wallet 模式）。                 | `walletId`   | 写入 |

### 余额

| 工具名称             | 说明                           | 主要参数                | 模式 |
|----------------------|--------------------------------|-------------------------|------|
| sunswap_get_balances | 查询某地址的 TRX 与 TRC20 余额。 | `tokens`, `network?`, `ownerAddress?` | 读取 |

### 价格与报价

| 工具名称                   | 说明                                   | 主要参数               | 模式 |
|---------------------------|----------------------------------------|------------------------|------|
| sunswap_get_token_price   | 通过 SUN.IO API 按地址/符号获取代币价格。 | `tokenAddress?`, `symbol?`   | 读取 |
| sunswap_quote_exact_input | 通过路由器的 view 函数进行精确输入兑换报价。 | `routerAddress`, `args`, `network?`, `functionName?`, `abi?` | 读取 |

### 智能合约（读）

| 工具名称              | 说明                           | 主要参数                         | 模式 |
|----------------------|--------------------------------|----------------------------------|------|
| sunswap_read_contract | 调用 TRON 合约的 view/pure 函数。 | `address`, `functionName`, `network?`, `args?`, `abi?` | 读取 |

### 智能合约（写）

| 工具名称               | 说明                         | 主要参数                              | 模式 |
|------------------------|------------------------------|---------------------------------------|------|
| sunswap_send_contract  | 执行会改变状态的合约函数调用。 | `address`, `functionName`, `network?`, `args?`, `value?`, `abi?` | 写入 |

### 兑换

| 工具名称                  | 说明                                               | 主要参数                             | 模式 |
|---------------------------|----------------------------------------------------|--------------------------------------|------|
| sunswap_swap              | 通过 Universal Router 执行兑换（tokenIn, tokenOut, amountIn）。 | `tokenIn`, `tokenOut`, `amountIn`, `network?`, `slippage?` | 写入 |
| sunswap_swap_exact_input  | 使用指定路由器与参数执行 swapExactInput。           | `routerAddress`, `args`, `network?`, `functionName?`, `value?`, `abi?` | 写入 |

### V2 流动性

| 工具名称                     | 说明                                                                 | 主要参数                                                                 | 模式 |
|-----------------------------|----------------------------------------------------------------------|--------------------------------------------------------------------------|------|
| sunswap_v2_add_liquidity    | 向 V2 池添加流动性；若其中一档为原生 TRX 则使用 addLiquidityETH。       | `routerAddress`, `tokenA`, `tokenB`, `amountADesired`, `amountBDesired`, `network?`, `amountAMin?`, `amountBMin?`, `to?`, `deadline?`, `abi?` | 写入 |
| sunswap_v2_remove_liquidity | 移除 V2 流动性；若其中一档为 TRX 则使用 removeLiquidityETH。           | `routerAddress`, `tokenA`, `tokenB`, `liquidity`, `network?`, `amountAMin?`, `amountBMin?`, `to?`, `deadline?`, `abi?` | 写入 |

### V3 流动性

| 工具名称                       | 说明                               | 主要参数                                                                 | 模式 |
|------------------------------|------------------------------------|--------------------------------------------------------------------------|------|
| sunswap_v3_mint_position      | 铸造新的 V3 集中流动性仓位。         | `positionManagerAddress`, `token0`, `token1`, `network?`, `fee?`, `tickLower?`, `tickUpper?`, `amount0Desired?`, `amount1Desired?`, `amount0Min?`, `amount1Min?`, `recipient?`, `deadline?`, `abi?` | 写入 |
| sunswap_v3_increase_liquidity | 为已有 V3 仓位增加流动性。           | `positionManagerAddress`, `tokenId`, `network?`, `token0?`, `token1?`, `fee?`, `amount0Desired?`, `amount1Desired?`, `amount0Min?`, `amount1Min?`, `deadline?` | 写入 |
| sunswap_v3_decrease_liquidity | 减少已有 V3 仓位的流动性。           | `positionManagerAddress`, `tokenId`, `liquidity`, `network?`, `token0?`, `token1?`, `fee?`, `amount0Min?`, `amount1Min?`, `deadline?` | 写入 |
| sunswap_v3_collect            | 收取 V3 仓位累积的手续费。           | `positionManagerAddress`, `tokenId`, `network?`, `recipient?` | 写入 |

### V4 流动性

| 工具名称                       | 说明                               | 主要参数                                                                 | 模式 |
|------------------------------|------------------------------------|--------------------------------------------------------------------------|------|
| sunswap_v4_mint_position      | 铸造新的 V4 集中流动性仓位，支持 Permit2 授权。 | `token0`, `token1`, `network?`, `fee?`, `tickLower?`, `tickUpper?`, `amount0Desired?`, `amount1Desired?`, `slippage?`, `recipient?`, `deadline?`, `sqrtPriceX96?`, `createPoolIfNeeded?` | 写入 |
| sunswap_v4_increase_liquidity | 增加已有 V4 仓位的流动性。           | `tokenId`, `token0`, `token1`, `network?`, `fee?`, `amount0Desired?`, `amount1Desired?`, `slippage?`, `deadline?` | 写入 |
| sunswap_v4_decrease_liquidity | 减少已有 V4 仓位的流动性。           | `tokenId`, `liquidity`, `token0`, `token1`, `network?`, `fee?`, `amount0Min?`, `amount1Min?`, `slippage?`, `deadline?` | 写入 |
| sunswap_v4_collect            | 收取 V4 仓位累积的手续费。           | `tokenId`, `network?`, `token0?`, `token1?`, `fee?`, `deadline?` | 写入 |

---

## OpenAPI 衍生工具（SUN.IO API）

工具由 `specs/sunio-open-api.json` 生成，命名与参数与规范一致。

### 交易

| 工具名称 | 说明 | 主要参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `scanTransactions` | 按协议、代币/池子、类型和时间范围扫描 DEX 交易。 | `protocol?`, `token?`, `pool?`, `type?`, `timeRange?` | 读取 |

### 代币

| 工具名称 | 说明 | 主要参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `getTokens` | 按地址和协议获取代币。 | `address?`, `protocol?` | 读取 |
| `searchTokens` | 按关键字模糊搜索代币。 | `keyword` | 读取 |

### 协议

| 工具名称 | 说明 | 主要参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `getProtocol` | 协议快照数据。 | - | 读取 |
| `getVolHistory` | 协议交易量历史。 | - | 读取 |
| `getUsersCountHistory` | 协议用户数历史。 | - | 读取 |
| `getTransactionsHistory` | 协议交易笔数历史。 | - | 读取 |
| `getPoolsCountHistory` | 协议池数量历史。 | - | 读取 |
| `getLiqHistory` | 协议流动性历史。 | - | 读取 |

### 价格

| 工具名称 | 说明 | 主要参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `getPrice` | 代币价格查询。 | `tokenAddress` | 读取 |

### 持仓

| 工具名称 | 说明 | 主要参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `getUserPositions` | 用户流动性持仓。 | `userAddress` | 读取 |
| `getPoolUserPositionTick` | 池子 tick 级别的持仓/流动性详情。 | `poolAddress`, `userAddress` | 读取 |

### 池子

| 工具名称 | 说明 | 主要参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `getPools` | 按地址、代币或协议获取池子。 | `address?`, `token?`, `protocol?` | 读取 |
| `getTopApyPoolList` | 分页获取 APY 最高的池子。 | `limit?`, `offset?` | 读取 |
| `searchPools` | 池子搜索。 | `keyword` | 读取 |
| `searchCountPools` | 池子搜索计数。 | `keyword` | 读取 |
| `getPoolHooks` | 池子 hooks 列表。 | `poolAddress` | 读取 |
| `getPoolVolHistory` | 池子交易量历史。 | `poolAddress` | 读取 |
| `getPoolLiqHistory` | 池子流动性历史。 | `poolAddress` | 读取 |

### 交易对

| 工具名称 | 说明 | 主要参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `getPairsFromEntity` | 代币交易对实体查询。 | `token0?`, `token1?` | 读取 |

### 矿池

| 工具名称 | 说明 | 主要参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `getFarms` | 矿池列表。 | - | 读取 |
| `getFarmTransactions` | 矿池交易扫描。 | `farmAddress` | 读取 |
| `getFarmPositions` | 用户矿池持仓。 | `userAddress` | 读取 |

## 默认合约地址

在 `src/sunswap/constants.ts` 中定义：

- **V2 主网**：Factory (`SUNSWAP_V2_MAINNET_FACTORY`)、Router (`SUNSWAP_V2_MAINNET_ROUTER`)
- **V2 Nile**：Factory (`SUNSWAP_V2_NILE_FACTORY`)、Router (`SUNSWAP_V2_NILE_ROUTER`)
- **V3 主网**：Factory (`SUNSWAP_V3_MAINNET_FACTORY`)、Position Manager (`SUNSWAP_V3_MAINNET_POSITION_MANAGER`)
- **V3 Nile**：Factory (`SUNSWAP_V3_NILE_FACTORY`)、Position Manager (`SUNSWAP_V3_NILE_POSITION_MANAGER`)
- **TRX**：`T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb`
- **WTRX**（主网/Nile）：内部用于 TRX 交易对查询

调用方可仅传 `network` 与代币地址使用上述默认地址，也可通过工具参数覆盖路由器/仓位管理器地址与 ABI。

## 网络参数

在支持的工具中可传入：

- **network**（可选）：`mainnet`（默认）、`nile` 或 `shasta`。
