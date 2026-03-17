# 完整能力清单

SUN MCP Server 提供 **41 个工具**。

## 先了解两个概念

在浏览工具列表之前，有两件事需要知道：

:::info 读取 vs 写入
每个工具都标记了**模式**——"读取"或"写入"：

- **读取工具**：只查询链上数据，不影响任何状态。在云服务和本地部署中均可使用。
- **写入工具**：会修改区块链状态（转账、质押、合约调用等）。仅在本地部署且配置了钱包后才可使用。

如果你没有配置钱包，写入工具不会出现在 AI 的可用工具列表中——它们会被自动隐藏，不用担心误触。
:::

:::tip network 参数
大多数工具都有可选的 `network` 参数，用于指定交互的网络环境。默认使用主网配置，也可切换至测试网。
:::

---

## 自定义工具（共 18 个）

### 钱包与余额

| 工具名 | 功能描述 | 工具类型 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|---------|
| `sunswap_get_wallet_address` | 获取当前活跃的 TRON 钱包地址 | 读取 | - | `network` |
| `sunswap_get_balances` | 查询 TRX 和 TRC20 代币余额 | 读取 | `tokens` | `network`, `ownerAddress` |

**试试这样说：**
- "查询我的 TRON 钱包地址"
- "查看我 USDT 和 SUNFLARE 的余额"
- "获取我在测试网上的 TRX 余额"

---

### 价格与报价

| 工具名 | 功能描述 | 工具类型 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|---------|
| `sunswap_get_token_price` | 获取代币价格（通过 SUN.IO API） | 读取 | `tokenAddress` 或 `symbol` | `network` |
| `sunswap_quote_exact_input` | 精确输入金额的兑换报价（智能路由） | 读取 | `routerAddress`, `args` | `network`, `functionName`, `abi` |

**试试这样说：**
- "SUNFLARE 现在的价格是多少？"
- "我想兑换 1000 USDT 换 SUNFLARE，会得到多少？"
- "在测试网上查询 USDC 的当前价格"

---

### 兑换

| 工具名 | 功能描述 | 工具类型 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|---------|
| `sunswap_swap` | 执行通用路由器兑换（支持自动路由 + Permit2） | 写入 | `tokenIn`, `tokenOut`, `amountIn` | `network`, `slippage` |
| `sunswap_swap_exact_input` | 精确输入兑换（智能路由器） | 写入 | `routerAddress`, `args` | `network`, `functionName`, `value`, `abi` |

**试试这样说：**
- "我想用 500 USDT 兑换 SUNFLARE，滑点 1%"
- "执行 1000 USDC 换 TRX 的交易"
- "帮我兑换 SUNFLARE 到 USDT，尽量少于 2 秒内完成"

:::caution 钱包要求
兑换工具需要本地部署 SUN MCP Server 并配置钱包私钥。
:::

---

### V2 流动性

| 工具名 | 功能描述 | 工具类型 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|---------|
| `sunswap_v2_add_liquidity` | 添加 V2 流动性（自动 TRX/WTRX 处理） | 写入 | `routerAddress`, `tokenA`, `tokenB`, `amountADesired`, `amountBDesired` | `network`, `amountAMin`, `amountBMin`, `to`, `deadline`, `abi` |
| `sunswap_v2_remove_liquidity` | 移除 V2 流动性 | 写入 | `routerAddress`, `tokenA`, `tokenB`, `liquidity` | `network`, `amountAMin`, `amountBMin`, `to`, `deadline`, `abi` |

**试试这样说：**
- "我想添加 1000 USDT 和等量的 SUNFLARE 到 V2 流动性池"
- "移除我在 USDC-TRX 池中的 50% 流动性"
- "添加 V2 流动性，USDT 最少 950，SUNFLARE 最少 9500"

:::info 自动处理
当配对涉及 TRX 时，工具会自动转换为 WTRX。
:::

---

### V3 流动性

| 工具名 | 功能描述 | 工具类型 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|---------|
| `sunswap_v3_mint_position` | 创建 V3 集中流动性头寸 | 写入 | `positionManagerAddress`, `token0`, `token1` | `network`, `fee`, `tickLower`, `tickUpper`, `amount0Desired`, `amount1Desired`, `amount0Min`, `amount1Min`, `recipient`, `deadline`, `abi` |
| `sunswap_v3_increase_liquidity` | 增加 V3 流动性 | 写入 | `positionManagerAddress`, `tokenId` | `network`, `token0`, `token1`, `fee`, `amount0Desired`, `amount1Desired`, `amount0Min`, `amount1Min`, `deadline` |
| `sunswap_v3_decrease_liquidity` | 减少 V3 流动性 | 写入 | `positionManagerAddress`, `tokenId`, `liquidity` | `network`, `token0`, `token1`, `fee`, `amount0Min`, `amount1Min`, `deadline` |
| `sunswap_v3_collect` | 收取 V3 费用 | 写入 | `positionManagerAddress`, `tokenId` | `network`, `recipient`, `abi` |

**试试这样说：**
- "帮我在 USDT-SUNFLARE 的 V3 0.3% 费率池中创建流动性，范围 ±50 ticks"
- "增加我的 V3 头寸 #12345，再添加 1000 USDT"
- "从我的 V3 头寸中收取费用"
- "减少 V3 头寸的流动性至 50%"

:::tip 自动计算
创建新头寸时，系统自动计算 tick 范围（±50×tickSpacing）和单边输入最优量。
:::

---

### V4 流动性

| 工具名 | 功能描述 | 工具类型 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|---------|
| `sunswap_v4_mint_position` | 创建 V4 头寸（支持 Permit2） | 写入 | `token0`, `token1` | `network`, `fee`, `tickLower`, `tickUpper`, `amount0Desired`, `amount1Desired`, `slippage`, `recipient`, `deadline`, `sqrtPriceX96`, `createPoolIfNeeded` |
| `sunswap_v4_increase_liquidity` | 增加 V4 流动性（支持 Permit2） | 写入 | `tokenId`, `token0`, `token1` | `network`, `fee`, `amount0Desired`, `amount1Desired`, `slippage`, `deadline` |
| `sunswap_v4_decrease_liquidity` | 减少 V4 流动性 | 写入 | `tokenId`, `liquidity`, `token0`, `token1` | `network`, `fee`, `amount0Min`, `amount1Min`, `slippage`, `deadline` |
| `sunswap_v4_collect` | 收取 V4 费用 | 写入 | `tokenId` | `network`, `token0`, `token1`, `fee`, `deadline` |

**试试这样说：**
- "在 V4 中创建 USDC-SUNFLARE 的流动性头寸，滑点 5%"
- "增加我的 V4 头寸 #67890，再注入 5000 USDC"
- "从 V4 头寸中收取所有累积费用"
- "减少 V4 流动性，确保滑点在 3% 以内"

:::info Permit2 支持
V4 工具原生支持 Permit2 签名授权，提升用户体验。
:::

---

### 合约交互

| 工具名 | 功能描述 | 工具类型 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|---------|
| `sunswap_read_contract` | 从 TRON 智能合约读取数据（view/pure） | 读取 | `address`, `functionName` | `network`, `args`, `abi` |
| `sunswap_send_contract` | 发送状态改变的合约交易 | 写入 | `address`, `functionName` | `network`, `args`, `value`, `abi` |

**试试这样说：**
- "查询 SUNFLARE 合约的总供应量"
- "读取我在流动性合约中的余额"
- "调用合约函数更新矿池参数"
- "向合约发送 0.1 TRX 并执行特定函数"

:::caution ABI 要求
若不提供 ABI，系统将尝试从 TronScan 获取合约 ABI。
:::

---

## SUN.IO OpenAPI 衍生工具（共 23 个）

### 交易

| 工具名 | 功能描述 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|
| `scanTransactions` | 扫描 DEX 交易 | - | `protocol`, `token`, `pool`, `type`, `timeRange` |
| `getFarmTransactions` | 扫描挖矿池交易 | `farmAddress` | - |

**试试这样说：**
- "查看 SUN 协议过去 24 小时的交易"
- "查询 SUNFLARE-USDT 池的所有交易"
- "获取最近 7 天的交易数据"

---

### 代币

| 工具名 | 功能描述 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|
| `getTokens` | 按地址或协议获取代币 | - | `address`, `protocol` |
| `searchTokens` | 模糊搜索代币 | `keyword` | - |
| `getPrice` | 按地址获取代币价格 | `tokenAddress` | - |

**试试这样说：**
- "搜索 'SUNFLARE' 代币"
- "获取地址 `TR7NHqjeKQxGTCi8q282JHJC8YXQFg...` 的代币信息"
- "查询 USDT 在 SUN 协议中的价格"

---

### 协议

| 工具名 | 功能描述 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|
| `getProtocol` | 协议快照数据 | - | - |
| `getVolHistory` | 协议成交量历史 | - | - |
| `getLiqHistory` | 协议流动性历史 | - | - |
| `getUsersCountHistory` | 协议用户数历史 | - | - |
| `getTransactionsHistory` | 协议交易数历史 | - | - |
| `getPoolsCountHistory` | 协议矿池数历史 | - | - |

**试试这样说：**
- "获取 SUN 协议的最新快照"
- "查看过去 30 天的成交量趋势"
- "获取协议用户数增长情况"

---

### 价格

| 工具名 | 功能描述 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|
| `getPrice` | 代币价格查询 | `tokenAddress` | - |

**试试这样说：**
- "获取 SUNFLARE 代币的实时价格"

---

### 持仓

| 工具名 | 功能描述 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|
| `getUserPositions` | 用户流动性头寸 | `userAddress` | - |
| `getPoolUserPositionTick` | 矿池用户 Tick 级别头寸详情 | `poolAddress`, `userAddress` | - |
| `getFarmPositions` | 用户挖矿头寸 | `userAddress` | - |

**试试这样说：**
- "查看我所有的流动性头寸"
- "获取我在 USDT-SUNFLARE 池中的 Tick 详情"
- "查询我的挖矿收益头寸"

---

### 池子

| 工具名 | 功能描述 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|
| `getPools` | 获取矿池 | - | `address`, `token`, `protocol` |
| `searchPools` | 搜索矿池 | `keyword` | - |
| `searchCountPools` | 矿池搜索计数 | `keyword` | - |
| `getTopApyPoolList` | 获取最高 APY 矿池列表 | - | `limit`, `offset` |
| `getPoolHooks` | 矿池钩子（Hooks） | `poolAddress` | - |
| `getPoolVolHistory` | 矿池成交量历史 | `poolAddress` | - |
| `getPoolLiqHistory` | 矿池流动性历史 | `poolAddress` | - |

**试试这样说：**
- "获取 SUNFLARE-USDT 池的详细信息"
- "查找最高 APY 的前 10 个矿池"
- "获取 USDC-TRX 池的成交量历史"
- "查询矿池使用的所有 Hooks"

---

### 交易对

| 工具名 | 功能描述 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|
| `getPairsFromEntity` | 代币交易对查询 | - | `token0`, `token1` |

**试试这样说：**
- "获取 SUNFLARE 和 USDT 之间的交易对信息"
- "查询所有包含 USDC 的交易对"

---

### 矿池

| 工具名 | 功能描述 | 必需参数 | 可选参数 |
|--------|---------|---------|---------|
| `getFarms` | 挖矿池列表 | - | - |

**试试这样说：**
- "列出所有可用的挖矿池"
- "查询当前的挖矿奖励情况"

---

## 自动计算特性

SUN MCP Server 的多个工具内置了智能自动计算功能，旨在简化用户交互：

### V3 流动性自动计算

**`sunswap_v3_mint_position` 自动特性：**

| 特性 | 说明 | 使用场景 |
|------|------|---------|
| **默认费率** | 若未指定 `fee`，系统自动使用 `3000`（0.3%） | 快速创建标准流动性头寸 |
| **Tick 范围计算** | 自动设置 `tickLower` 和 `tickUpper` 为 `±50 × tickSpacing` | 无需手动计算复杂数学，直接获得合理范围 |
| **单边输入处理** | 可只指定一种代币金额，系统自动计算另一种代币所需金额 | 简化多币种流动性部署 |

**示例：**
```
请求：在 USDT-SUNFLARE 池中创建 V3 头寸，注入 1000 USDT
系统自动：
  - 设定费率为 3000（0.3%）
  - 计算 ±50 个 tick 范围
  - 根据当前价格，计算所需 SUNFLARE 数量
  - 一次性提交多币种授权和交易
```

### V4 流动性自动计算

**`sunswap_v4_mint_position` 自动特性：**

| 特性 | 说明 | 使用场景 |
|------|------|---------|
| **Tick 范围计算** | 自动设置 `tickLower` 和 `tickUpper` 为 `±100 × tickSpacing` | V4 更灵活的范围配置 |
| **默认滑点** | 若未指定 `slippage`，系统自动使用 `5%` | 保护用户免受价格波动影响 |
| **Permit2 授权** | 原生支持 Permit2 签名流程，无需多次批准 | 改善用户体验，一次签名完成所有授权 |
| **动态池创建** | 若池不存在，`createPoolIfNeeded` 可自动创建新池 | 为新交易对快速建立流动性 |

**示例：**
```
请求：在 V4 中创建 USDC-SUNFLARE 头寸，滑点 3%
系统自动：
  - 计算 ±100 个 tick 范围
  - 使用 Permit2 签名授权
  - 若池不存在，创建新池
  - 根据当前价格计算最优输入比例
```

### 智能兑换路由

**`sunswap_swap` 自动特性：**

| 特性 | 说明 | 使用场景 |
|------|------|---------|
| **多路由优化** | 自动查找最优兑换路径，支持直接交易对及多跳路由 | 获取最佳价格 |
| **Permit2 集成** | 无需预先批准代币，一次签名完成授权和兑换 | 改善用户流程 |

**示例：**
```
请求：1000 USDT 换 SUNFLARE，滑点 1%
系统自动：
  - 评估直接 USDT-SUNFLARE 池
  - 评估 USDT → 中间币 → SUNFLARE 路由
  - 选择最优路径
  - 使用 Permit2 一次签名完成授权和交易
  - 确保滑点不超过 1%
```

### 关键参数说明

| 参数 | 默认值 | 何时自动计算 |
|------|--------|-----------|
| `fee`（V3） | 3000 | 未提供时 |
| `tickLower`, `tickUpper`（V3） | ±50×tickSpacing | 未提供时 |
| `tickLower`, `tickUpper`（V4） | ±100×tickSpacing | 未提供时 |
| `slippage`（V4） | 5% | 未提供时 |
| 对方代币金额 | 根据当前价格计算 | 只指定一种代币时 |

:::tip 最佳实践
虽然大多数参数已自动计算，但在关键操作（如添加大额流动性）时，建议主动指定参数以获得更高的控制精度。
:::



