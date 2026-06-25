# 完整能力清单

本页是 SUN CLI 所有命令的完整参考。命令按类别组织：钱包管理、价格、代币、兑换、池子、流动性、持仓、交易对、矿池、协议、交易、合约和 SunPump。

> 说明：`<arg>` = 必需参数，`[arg]` = 可选参数。
> 标注 **(必需)** 的选项必须提供，其余均为可选。

---

## 全局标志

所有命令都继承以下根级标志。**根级标志必须放在子命令之前。**

| 标志 | 描述 |
| :--- | :--- |
| `--output <format>` | 输出格式：`table`、`json`、`tsv` |
| `--json` | JSON 输出的快捷方式 |
| `--fields <list>` | 逗号分隔的输出字段过滤 |
| `--network <network>` | 覆盖 `TRON_NETWORK`（如 `mainnet`、`nile`、`shasta`） |
| `-k, --private-key <key>` | 仅为本次调用提供私钥 |
| `-m, --mnemonic <phrase>` | 仅为本次调用提供助记词 |
| `-i, --mnemonic-account-index <index>` | 仅为本次调用提供助记词账户索引 |
| `-p, --agent-wallet-password <password>` | 覆盖本次调用的 `AGENT_WALLET_PASSWORD` |
| `-d, --agent-wallet-dir <dir>` | 覆盖本次调用的 `AGENT_WALLET_DIR` |
| `-y, --yes` | 跳过确认提示 |
| `--dry-run` | 预览操作意图而不发送交易 |

:::caution 私钥安全
`-k` / `--private-key` 和 `-m` / `--mnemonic` 标志会将敏感信息作为命令行参数传递，
可能被记录在 shell 历史和进程列表中。请优先使用环境变量（`AGENT_WALLET_PRIVATE_KEY`、
`AGENT_WALLET_MNEMONIC`）或 [agent-wallet](https://github.com/BofAI/agent-wallet)
加密存储来管理所有非临时密钥。
:::

**示例：**

```bash
sun --json price TRX
```

```bash
sun --output tsv pool top-apy --page-size 10
```

```bash
sun --fields address,network wallet address
```

```bash
sun -p your_agent_wallet_password wallet address
```

```bash
sun -k your_private_key --network nile --yes swap TRX USDT 1000000
```

```bash
sun --dry-run contract send TContract transfer --args '["TRecipient","1000000"]'
```

---

## 钱包与持仓

### `wallet address`（读取）

显示已配置的钱包地址。

```bash
sun wallet address
```

### `wallet balances`（读取）

查询钱包代币余额。

```bash
sun wallet balances [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--owner <address>` | 要查询的钱包地址 | 当前钱包 |
| `--tokens <tokens>` | 逗号分隔的代币列表：`TRX,<TRC20地址>,...` | `TRX` |

---

## 价格

### `price [token]`（读取）

从 SUN.IO 获取代币价格。接受内置符号或地址。

```bash
sun price [token] [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--address <addresses>` | 逗号分隔的代币合约地址 | — |

```bash
sun price TRX
```

```bash
sun price USDT
```

```bash
sun price --address TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

---

## 代币

### `token list`（读取）

按地址或协议获取代币列表。

```bash
sun token list [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--address <tokenAddress>` | 按代币合约地址过滤 | — |
| `--protocol <protocol>` | 协议过滤（V2、V3、V4） | — |
| `--page <n>` | 页码 | `1` |
| `--page-size <n>` | 每页数量 | `20` |
| `--sort <field>` | 排序字段 | — |
| `--no-blacklist` | 包含黑名单代币 | `false` |

### `token search <keyword>`（读取）

按名称或符号模糊搜索代币。

```bash
sun token search <keyword> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--protocol <protocol>` | 协议过滤 | — |
| `--page <n>` | 页码 | `1` |
| `--page-size <n>` | 每页数量 | `20` |

---

## 兑换

:::caution 金额精度 —— `<amountIn>` 是按代币 `decimals` 整数缩放后的值
所有 `<amountIn>`（以及下面流动性命令里的 `--amount*` 参数）= 人类可读金额 × `10^decimals`，**不带小数点，也不会自动换算**。

- TRX、USDT（TRC20）、WTRX、USDCOLD、WIN —— **精度 6** → `1` 个代币 = `1000000`
- USDD、SUN、JST、BTT、USDDOLD —— **精度 18** → `1` 个代币 = `1000000000000000000`

所以 `sun swap TRX USDT 1000000` 是**用 1 个 TRX**（不是 100 万个）兑换 USDT。
:::

### `swap <tokenIn> <tokenOut> <amountIn>`（写入）

通过 SunSwap Universal Router 执行代币兑换。

```bash
sun swap <tokenIn> <tokenOut> <amountIn> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--slippage <n>` | 滑点容差，小数表示（如 0.005 = 0.5%） | `0.005` |

```bash
# 用 1 个 TRX 兑换 USDT
sun swap TRX USDT 1000000
```

```bash
# 同样的兑换，滑点容差 1%
sun swap TRX USDT 1000000 --slippage 0.01
```

### `swap:quote <tokenIn> <tokenOut> <amountIn>`（读取）

获取兑换报价，不执行交易。

```bash
sun swap:quote <tokenIn> <tokenOut> <amountIn> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--all` | 显示所有可用路径 | `false` |

```bash
# 报价：用 1 个 TRX 兑换 USDT
sun swap:quote TRX USDT 1000000
```

```bash
sun swap:quote TRX USDT 1000000 --all
```

### `swap:quote-raw`（读取）

低级路由报价调用。

```bash
sun swap:quote-raw [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--router <address>` | **（必需）** 智能路由合约地址 | — |
| `--fn <name>` | 报价函数名称 | `quoteExactInput` |
| `--args <json>` | **（必需）** JSON 数组格式的参数 | — |
| `--abi <json>` | 路由 ABI，JSON 数组格式 | — |

### `swap:exact-input`（写入）

低级路由兑换执行。

```bash
sun swap:exact-input [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--router <address>` | **（必需）** 智能路由合约地址 | — |
| `--fn <name>` | 兑换函数名称 | `swapExactInput` |
| `--args <json>` | **（必需）** JSON 数组格式的参数 | — |
| `--value <sun>` | TRX 调用值（Sun 为单位） | — |
| `--abi <json>` | 路由 ABI，JSON 数组格式 | — |

---

## 池子

### `pool list`（读取）

列出池子，支持多种过滤条件。

```bash
sun pool list [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--address <poolAddress>` | 按池子地址过滤 | — |
| `--token <tokenOrAddress>` | 按代币过滤（符号或地址） | — |
| `--protocol <protocol>` | 协议过滤（V2、V3、V4） | — |
| `--page <n>` | 页码 | `1` |
| `--page-size <n>` | 每页数量 | `20` |
| `--sort <field>` | 排序字段 | — |
| `--no-blacklist` | 包含黑名单池子 | `false` |

### `pool search <keyword>`（读取）

按关键词搜索池子。

```bash
sun pool search <keyword> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--protocol <protocol>` | 协议过滤 | — |
| `--page <n>` | 页码 | `1` |
| `--page-size <n>` | 每页数量 | `20` |

### `pool top-apy`（读取）

按 APY 排行列出池子。

```bash
sun pool top-apy [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--protocol <protocol>` | 协议过滤 | — |
| `--page <n>` | 页码 | `1` |
| `--page-size <n>` | 每页数量 | `20` |

### `pool hooks`（读取）

列出已注册的池子 hooks。

```bash
sun pool hooks
```

### `pool vol-history <poolAddress>`（读取）

查询池子在指定日期范围内的交易量历史。

```bash
sun pool vol-history <poolAddress> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--start <date>` | 开始日期（YYYY-MM-DD） | — |
| `--end <date>` | 结束日期（YYYY-MM-DD） | — |

### `pool liq-history <poolAddress>`（读取）

查询池子在指定日期范围内的流动性历史。

```bash
sun pool liq-history <poolAddress> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--start <date>` | 开始日期（YYYY-MM-DD） | — |
| `--end <date>` | 结束日期（YYYY-MM-DD） | — |

---

## 流动性

### `liquidity v2:add`（写入）

添加 V2 流动性。路由地址根据网络自动检测。

```bash
sun liquidity v2:add [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--token-a <tokenOrSymbol>` | **（必需）** 代币 A（符号或地址） | — |
| `--token-b <tokenOrSymbol>` | **（必需）** 代币 B（符号或地址） | — |
| `--amount-a <raw>` | 代币 A 数量（原始单位） | — |
| `--amount-b <raw>` | 代币 B 数量（原始单位） | — |
| `--min-a <raw>` | 代币 A 最小数量 | — |
| `--min-b <raw>` | 代币 B 最小数量 | — |
| `--router <address>` | V2 路由地址 | 根据网络自动检测 |
| `--to <address>` | LP 代币接收地址 | 当前钱包 |
| `--deadline <timestamp>` | 交易截止时间 | — |
| `--abi <json>` | 自定义路由 ABI | — |

> 至少提供 `--amount-a` 或 `--amount-b` 之一。只提供一个时，另一个会根据池子储备自动计算。

创建流动性池（需要输入两个代币数量）：

```bash
sun liquidity v2:add --token-a TRX --token-b USDT --amount-a 1000000 --amount-b 290000
```

向已有池子添加流动性（另一个代币数量会自动计算）：

```bash
sun liquidity v2:add --token-a TRX --token-b USDT --amount-a 1000000
```

### `liquidity v2:remove`（写入）

移除 V2 流动性。

```bash
sun liquidity v2:remove [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--token-a <tokenOrSymbol>` | **（必需）** 代币 A | — |
| `--token-b <tokenOrSymbol>` | **（必需）** 代币 B | — |
| `--liquidity <raw>` | **（必需）** 要移除的 LP 代币数量 | — |
| `--min-a <raw>` | 代币 A 最小数量 | — |
| `--min-b <raw>` | 代币 B 最小数量 | — |
| `--router <address>` | V2 路由地址 | 根据网络自动检测 |
| `--to <address>` | 代币接收地址 | 当前钱包 |
| `--deadline <timestamp>` | 交易截止时间 | — |
| `--abi <json>` | 自定义路由 ABI | — |

```bash
sun liquidity v2:remove --token-a TRX --token-b USDT --liquidity 500000
```

### `liquidity v3:mint`（写入）

创建 V3 集中流动性仓位。Position Manager 根据网络自动检测。

```bash
sun liquidity v3:mint [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--token0 <tokenOrSymbol>` | **（必需）** 代币 0（符号或地址） | — |
| `--token1 <tokenOrSymbol>` | **（必需）** 代币 1（符号或地址） | — |
| `--fee <n>` | 池子手续费等级 | `3000` |
| `--tick-lower <n>` | 下界 tick | 自动 |
| `--tick-upper <n>` | 上界 tick | 自动 |
| `--amount0 <raw>` | 代币 0 数量 | — |
| `--amount1 <raw>` | 代币 1 数量 | — |
| `--min0 <raw>` | 代币 0 最小数量 | — |
| `--min1 <raw>` | 代币 1 最小数量 | — |
| `--pm <address>` | Position Manager 地址 | 根据网络自动检测 |
| `--recipient <address>` | NFT 接收地址 | 当前钱包 |
| `--deadline <timestamp>` | 交易截止时间 | — |
| `--abi <json>` | 自定义 ABI | — |

> 至少提供 `--amount0` 或 `--amount1` 之一。只提供一个时，另一个会自动计算。TRX 在 V3 池子查找时会自动转换为 WTRX。

```bash
sun liquidity v3:mint --token0 TRX --token1 USDT --amount0 1000000
```

### `liquidity v3:increase`（写入）

增加已有 V3 仓位的流动性。

```bash
sun liquidity v3:increase [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--token-id <id>` | **（必需）** 仓位 NFT 代币 ID | — |
| `--amount0 <raw>` | 代币 0 数量 | — |
| `--amount1 <raw>` | 代币 1 数量 | — |
| `--min0 <raw>` | 代币 0 最小数量 | — |
| `--min1 <raw>` | 代币 1 最小数量 | — |
| `--token0 <tokenOrSymbol>` | 代币 0（单边自动计算时需要） | — |
| `--token1 <tokenOrSymbol>` | 代币 1（单边自动计算时需要） | — |
| `--fee <n>` | 池子手续费（单边自动计算时需要） | `3000` |
| `--pm <address>` | Position Manager 地址 | 根据网络自动检测 |
| `--deadline <timestamp>` | 交易截止时间 | — |
| `--abi <json>` | 自定义 ABI | — |

> 只提供一个数量时，需要同时指定 `--token0`、`--token1` 和 `--fee` 以进行自动计算。

```bash
sun liquidity v3:increase --token-id 123 --amount0 500000
```

### `liquidity v3:decrease`（写入）

减少已有 V3 仓位的流动性。

```bash
sun liquidity v3:decrease [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--token-id <id>` | **（必需）** 仓位 NFT 代币 ID | — |
| `--liquidity <raw>` | **（必需）** 要移除的流动性数量 | — |
| `--min0 <raw>` | 代币 0 最小数量 | — |
| `--min1 <raw>` | 代币 1 最小数量 | — |
| `--pm <address>` | Position Manager 地址 | 根据网络自动检测 |
| `--deadline <timestamp>` | 交易截止时间 | — |
| `--abi <json>` | 自定义 ABI | — |

```bash
sun liquidity v3:decrease --token-id 123 --liquidity 1000
```

### `liquidity v3:collect`（写入）

领取 V3 仓位累积的手续费。

```bash
sun liquidity v3:collect [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--token-id <id>` | **（必需）** 仓位 NFT 代币 ID | — |
| `--recipient <address>` | 手续费接收地址 | 当前钱包 |
| `--pm <address>` | Position Manager 地址 | 根据网络自动检测 |
| `--abi <json>` | 自定义 ABI | — |

```bash
sun liquidity v3:collect --token-id 123
```

### `liquidity v4:mint`（写入）

创建 V4 集中流动性仓位。

```bash
sun liquidity v4:mint [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--token0 <tokenOrSymbol>` | **（必需）** 代币 0 | — |
| `--token1 <tokenOrSymbol>` | **（必需）** 代币 1 | — |
| `--fee <n>` | 池子手续费等级 | — |
| `--tick-lower <n>` | 下界 tick | 自动 |
| `--tick-upper <n>` | 上界 tick | 自动 |
| `--amount0 <raw>` | 代币 0 数量 | — |
| `--amount1 <raw>` | 代币 1 数量 | — |
| `--slippage <n>` | 滑点容差 | — |
| `--sqrt-price <value>` | 初始 sqrtPriceX96（用于创建池子） | — |
| `--create-pool` | 如果池子不存在则创建 | `false` |
| `--recipient <address>` | NFT 接收地址 | 当前钱包 |
| `--deadline <timestamp>` | 交易截止时间 | — |

在已有池子中创建仓位：

```bash
sun liquidity v4:mint --token0 TRX --token1 USDT --amount0 1000000
```

池子不存在时先创建池子，再创建仓位：

```bash
sun liquidity v4:mint --token0 TRX --token1 USDT --amount0 1000000 --create-pool
```

### `liquidity v4:increase`（写入）

增加已有 V4 仓位的流动性。

```bash
sun liquidity v4:increase [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--token-id <id>` | **（必需）** 仓位 NFT 代币 ID | — |
| `--token0 <tokenOrSymbol>` | **（必需）** 代币 0 | — |
| `--token1 <tokenOrSymbol>` | **（必需）** 代币 1 | — |
| `--fee <n>` | 池子手续费等级 | — |
| `--amount0 <raw>` | 代币 0 数量 | — |
| `--amount1 <raw>` | 代币 1 数量 | — |
| `--slippage <n>` | 滑点容差 | — |
| `--deadline <timestamp>` | 交易截止时间 | — |

```bash
sun liquidity v4:increase --token-id 123 --token0 TRX --token1 USDT --amount0 500000
```

### `liquidity v4:decrease`（写入）

减少已有 V4 仓位的流动性。

```bash
sun liquidity v4:decrease [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--token-id <id>` | **（必需）** 仓位 NFT 代币 ID | — |
| `--liquidity <raw>` | **（必需）** 要移除的流动性数量 | — |
| `--token0 <tokenOrSymbol>` | **（必需）** 代币 0 | — |
| `--token1 <tokenOrSymbol>` | **（必需）** 代币 1 | — |
| `--fee <n>` | 池子手续费等级 | — |
| `--min0 <raw>` | 代币 0 最小数量 | — |
| `--min1 <raw>` | 代币 1 最小数量 | — |
| `--slippage <n>` | 滑点容差 | — |
| `--deadline <timestamp>` | 交易截止时间 | — |

```bash
sun liquidity v4:decrease --token-id 123 --liquidity 1000 --token0 TRX --token1 USDT
```

### `liquidity v4:collect`（写入）

领取 V4 仓位累积的手续费。

```bash
sun liquidity v4:collect [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--token-id <id>` | **（必需）** 仓位 NFT 代币 ID | — |
| `--token0 <tokenOrSymbol>` | 代币 0 | — |
| `--token1 <tokenOrSymbol>` | 代币 1 | — |
| `--fee <n>` | 池子手续费等级 | — |
| `--deadline <timestamp>` | 交易截止时间 | — |

```bash
sun liquidity v4:collect --token-id 123
```

### `liquidity v4:info`（读取）

查询 V4 仓位详情。

```bash
sun liquidity v4:info [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--pm <address>` | **（必需）** Position Manager 地址 | — |
| `--token-id <id>` | **（必需）** 仓位 NFT 代币 ID | — |

```bash
sun liquidity v4:info --pm <positionManager> --token-id 123
```

---

## 持仓

### `position list`（读取）

查看流动性仓位列表。

```bash
sun position list [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--owner <address>` | 所有者钱包地址 | — |
| `--pool <poolAddress>` | 按池子过滤 | — |
| `--protocol <protocol>` | 协议过滤（V2、V3、V4） | — |
| `--page <n>` | 页码 | `1` |
| `--page-size <n>` | 每页数量 | `20` |

### `position tick <poolAddress>`（读取）

查询指定池子的 tick 数据。

```bash
sun position tick <poolAddress> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--page <n>` | 页码 | `1` |
| `--page-size <n>` | 每页数量 | `20` |

---

## 交易对

### `pair info`（读取）

获取代币的交易对信息。

```bash
sun pair info [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--token <tokenAddress>` | 代币合约地址 | — |
| `--protocol <protocol>` | 协议过滤 | — |
| `--page <n>` | 页码 | `1` |
| `--page-size <n>` | 每页数量 | `20` |

---

## 矿池

### `farm list`（读取）

列出收益矿池。

```bash
sun farm list [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--farm <farmAddress>` | 按矿池地址过滤 | — |
| `--page <n>` | 页码 | `1` |
| `--page-size <n>` | 每页数量 | `20` |

### `farm tx`（读取）

查看矿池交易历史。

```bash
sun farm tx [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--owner <address>` | 所有者地址 | — |
| `--farm <farmAddress>` | 按矿池过滤 | — |
| `--type <farmTxType>` | 交易类型 | — |
| `--start <time>` | 开始时间（ISO 或 unix 毫秒） | — |
| `--end <time>` | 结束时间 | — |
| `--page <n>` | 页码 | `1` |
| `--page-size <n>` | 每页数量 | `20` |

### `farm positions`（读取）

查看矿池持仓。

```bash
sun farm positions [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--owner <address>` | 所有者地址 | — |
| `--farm <farmAddress>` | 按矿池过滤 | — |
| `--page <n>` | 页码 | `1` |
| `--page-size <n>` | 每页数量 | `20` |

---

## 协议

### `protocol info`（读取）

```bash
sun protocol info [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--protocol <protocol>` | 协议过滤 | — |

### `protocol vol-history`（读取）

```bash
sun protocol vol-history [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--protocol <protocol>` | 协议过滤 | — |
| `--start <date>` | 开始日期（YYYY-MM-DD） | — |
| `--end <date>` | 结束日期（YYYY-MM-DD） | — |

### `protocol users-history`（读取）

```bash
sun protocol users-history [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--protocol <protocol>` | 协议过滤 | — |
| `--start <date>` | 开始日期 | — |
| `--end <date>` | 结束日期 | — |

### `protocol tx-history`（读取）

```bash
sun protocol tx-history [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--protocol <protocol>` | 协议过滤 | — |
| `--start <date>` | 开始日期 | — |
| `--end <date>` | 结束日期 | — |

### `protocol pools-history`（读取）

```bash
sun protocol pools-history [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--protocol <protocol>` | 协议过滤 | — |
| `--start <date>` | 开始日期 | — |
| `--end <date>` | 结束日期 | — |

### `protocol liq-history`（读取）

```bash
sun protocol liq-history [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--protocol <protocol>` | 协议过滤 | — |
| `--start <date>` | 开始日期 | — |
| `--end <date>` | 结束日期 | — |

---

## 交易扫描

### `tx scan`（读取）

扫描链上交易历史。

```bash
sun tx scan [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--protocol <protocol>` | 协议过滤 | — |
| `--token <tokenAddress>` | 按代币地址过滤 | — |
| `--pool <poolAddress>` | 按池子地址过滤 | — |
| `--type <type>` | 交易类型：`swap`、`add`、`withdraw` | — |
| `--start <time>` | 开始时间（ISO 或 unix 毫秒） | — |
| `--end <time>` | 结束时间 | — |
| `--page-size <n>` | 每页数量 | `20` |
| `--offset <offset>` | 分页偏移量 | — |

---

## 合约

### `contract read <address> <functionName>`（读取）

读取任意 TRON 智能合约。

```bash
sun contract read <address> <functionName> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--args <json>` | JSON 数组格式的参数 | `[]` |
| `--abi <json>` | 合约 ABI，JSON 数组格式 | — |

```bash
sun contract read TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t balanceOf --args '["TYourAddress"]'
```

### `contract send <address> <functionName>`（写入）

向任意 TRON 智能合约发送交易。

```bash
sun contract send <address> <functionName> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--args <json>` | JSON 数组格式的参数 | `[]` |
| `--value <sun>` | TRX 调用值（Sun 为单位） | — |
| `--abi <json>` | 合约 ABI，JSON 数组格式 | — |

```bash
sun contract send TRecipient transfer --args '["TRecipient","1000000"]' --value 0
```

`contract send` 交易广播成功后会返回 `tronscanUrl` 链接。

---

## SunPump

SunPump 是 TRON 上的 meme 代币发射平台。本命令组覆盖代币发现（行情、排行、持有人、钱包持仓、交易历史）、一键发币（`launch`）以及发射前交易。

> **关于 Bonding Curve：** Bonding Curve 是代币的发射进度条——随着社区参与和买入增加，meme 币市值逐步增长，进度最高涨到 100%；满 100% 后会自动在 SunSwap V2 上创建交易对，代币就「发射」了。进度未满 100% 的「发射前」代币用 `sun sunpump buy/sell` 在 SunPump 上交易；发射后改用 [`sun swap`](#兑换)。

:::caution SunPump 仅支持 TRON 主网
所有 `sunpump` 子命令只在 TRON 主网可用。API 端点为 `https://api-v2.sunpump.meme/pump-api`，链上 Bonding Curve 合约为 `TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw`。传入 `--network nile`（或任何非 mainnet 值）会立即报错 `SunPump is only available on mainnet`。去掉 `--network` 或显式传 `--network mainnet` 即可。
:::

:::tip 发射前 vs 发射后 —— 选对交易命令
- **发射前（Bonding Curve 进度未满 100%、还没在 SunSwap V2 上创建交易对）：** `tokenLaunchedInstant` 为 `null`，链上 `state` 为 `1`（TRADING）或 `2`（READY_TO_LAUNCH）——用 `sun sunpump buy` / `sun sunpump sell` 交易。
- **发射后（已在 SunSwap V2 建好交易对）：** `state` 为 `3`（LAUNCHED），`swapPoolAddress` 非空——走普通兑换 [`sun swap`](#兑换)。

下单前先用 `sun sunpump state <addr>` 或 `sun sunpump token get <addr>` 判断走哪条路径。只读查询（行情、持有人、钱包持仓、交易历史）与一键发币（`launch`）无需钱包；发射前交易需要钱包。
:::

### `sunpump token get <contractAddress>`（读取）

按合约地址获取 SunPump 代币详情：价格、市值、24h 成交量、持有人数、总量、所有者、交易池地址、社交链接和发射状态。

```bash
sun sunpump token get <contractAddress>
```

### `sunpump token list`（读取）

列出 SunPump 代币，支持过滤和分页。

```bash
sun sunpump token list [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--contract <address>` | 按合约地址过滤 | — |
| `--owner <address>` | 按所有者地址过滤 | — |
| `--symbol <symbol>` | 按符号过滤 | — |
| `--name <name>` | 按名称过滤 | — |
| `--description <text>` | 按描述过滤 | — |
| `--page <n>` | 页码 | — |
| `--size <n>` | 每页数量 | — |
| `--sort <field>` | 排序字段（如 `marketCap,desc`） | — |

### `sunpump token search <query>`（读取）

按名称或符号模糊搜索代币。

```bash
sun sunpump token search <query> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--on-sunswap` | 仅显示已发射到 SunSwap 的代币 | `false` |
| `--page <n>` | 页码 | — |
| `--size <n>` | 每页数量 | — |
| `--sort <field>` | 排序字段 | — |

### `sunpump token search-v2 <query>`（读取）

模糊搜索的 v2 版本（调用 `/token/searchV2` 接口）。相比 `search`，额外支持 `--dlive`、`--ai-helper`、`--twitter-launch`、`--sun-agent-launch` 几个过滤维度。

```bash
sun sunpump token search-v2 <query> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--on-sunswap` | 仅显示已发射到 SunSwap 的代币 | — |
| `--dlive` | 过滤：DLive showing | — |
| `--ai-helper` | 过滤：AI helper | — |
| `--twitter-launch` | 过滤：Twitter launch | — |
| `--sun-agent-launch` | 过滤：Sun agent launch | — |
| `--page <n>` | 页码 | — |
| `--size <n>` | 每页数量 | — |
| `--sort <field>` | 排序字段 | — |

### `sunpump token by-owner <ownerAddress>`（读取）

列出某个钱包创建的代币。

```bash
sun sunpump token by-owner <ownerAddress> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--page <n>` | 页码 | — |
| `--size <n>` | 每页数量 | — |
| `--sort <field>` | 排序字段 | — |

### `sunpump token holders <tokenAddress>`（读取）

列出某个代币的持有人，含余额和占比。

```bash
sun sunpump token holders <tokenAddress> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--include-zero` | 包含零余额持有人 | — |
| `--page <n>` | 页码 | — |
| `--size <n>` | 每页数量 | — |
| `--sort <field>` | 排序字段（默认按余额降序） | — |

> `percent` 字段在 holders 端点返回的是百分值（如 `38.51` = 38.51%），而 token list 端点返回的是小数（如 `0.3851`）。CLI 会自动归一化，但直接读原始 JSON 时请注意量级。

### `sunpump token holders-v2 <tokenAddress>`（读取）

持有人列表的 v2 版本（调用较新的 `/token/holdersV2` 接口），输入参数同 `holders`，返回字段可能略有差异。

```bash
sun sunpump token holders-v2 <tokenAddress> [options]
```

### `sunpump token ranking`（读取）

按指定指标获取代币排行。**`--type` 为必需项。**

```bash
sun sunpump token ranking --type MARKET_CAP --size 10
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--type <rankingType>` | **（必需）** 排行类型：`MARKET_CAP`、`VOLUME_24H`、`PRICE_CHANGE_24H` | — |
| `--size <n>` | 返回条数 | — |

> `--type` 只接受 `MARKET_CAP`、`VOLUME_24H`、`PRICE_CHANGE_24H` 三个值（大小写敏感），其他值会被 API 拒绝。

### `sunpump token king-of-hill`（读取）

获取当前的 king-of-the-hill 代币。

```bash
sun sunpump token king-of-hill
```

### `sunpump token pump-list`（读取）

获取 SunPump 原始代币列表（直接返回接口响应，不拆除外层的 `{code, msg, data}` 包装）。

```bash
sun sunpump token pump-list
```

### `sunpump token favors`（读取，需签名）

列出用户收藏的代币。需要签名消息。

```bash
sun sunpump token favors --user-address <address> --signature <sig> --signed-message <msg> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--user-address <address>` | **（必需）** 用户钱包地址 | — |
| `--signature <sig>` | **（必需）** 签名消息的签名 | — |
| `--signed-message <msg>` | **（必需）** 被签名的消息 | — |
| `--token-address <address>` | 按代币地址过滤 | — |
| `--page <n>` | 页码 | — |
| `--size <n>` | 每页数量 | — |

### `sunpump tx token <contractAddress>`（读取）

查询某个代币的买卖交易历史。

```bash
sun sunpump tx token <contractAddress> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--swap-type <type>` | 方向过滤（`BUY` / `SELL`） | — |
| `--pool <address>` | 交易池地址 | — |
| `--tx-hash <hash>` | 指定交易哈希 | — |
| `--block <n>` | 区块号 | — |
| `--start-time <epoch>` | 开始时间（epoch **秒**） | — |
| `--end-time <epoch>` | 结束时间（epoch **秒**） | — |
| `--page <n>` | 页码 | — |
| `--size <n>` | 每页数量 | — |
| `--sort <field>` | 排序字段（如 `txDateTime,desc`） | — |

> `--start-time` / `--end-time` 是 epoch **秒**，不是毫秒。

### `sunpump tx user <ownerAddress>`（读取）

查询某个钱包的买卖交易历史，选项同 `tx token`。

```bash
sun sunpump tx user <ownerAddress> --size 20
sun sunpump tx user <ownerAddress> --swap-type BUY --size 20
```

### `sunpump portfolio <walletAddress>`（读取）

列出某个钱包持有的所有 SunPump 代币，含 TRX 计价价值和持仓占比。

```bash
sun sunpump portfolio <walletAddress> [options]
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--include-zero` | 包含零余额代币 | — |
| `--min-trx <amount>` | 最低 TRX 计价价值过滤 | — |
| `--page <n>` | 页码 | — |
| `--size <n>` | 每页数量 | — |
| `--sort <field>` | 排序字段（如 `valueInTrx,desc`） | — |

### `sunpump launch`（写入，无需钱包）

通过 SunPump agent 端点（`POST /ai/agentTokenLaunch`）创建新的 meme 代币。创建在**服务端**完成：由平台签名并广播创建交易，本地无需钱包。CLI 会先打印摘要并要求确认（`--yes` 跳过）；`--dry-run` 只预览请求不发送。成功后输出新代币的合约地址、创建交易哈希和 logo URL。

```bash
sun sunpump launch --name "<token name>" --symbol "<SYMBOL>" \
  --description "<one-line description>" --image ./logo.png \
  --twitter-url "https://x.com/<your-handle>" --website-url "https://<your-site>"
```

| 选项 | 说明 | 默认值 |
| :--- | :--- | :--- |
| `--name <name>` | **（必填）**代币名称 | — |
| `--symbol <symbol>` | **（必填）**代币符号 | — |
| `--description <text>` | **（必填）**代币描述 | — |
| `--image <path>` | logo 图片文件，读取后以 base64 发送 | — |
| `--image-base64 <data>` | logo 的 base64 原始字符串（优先于 `--image`） | — |
| `--twitter-url <url>` | Twitter 链接 | — |
| `--telegram-url <url>` | Telegram 链接 | — |
| `--website-url <url>` | 官网链接 | — |
| `--tweet-username <name>` | 关联的推文用户名 | — |

> 强烈建议通过 `--image` / `--image-base64` 提供 logo——缺少 logo 时 API 可能直接返回不带原因的 `500`（CLI 遇到时会给出提示）。

### `sunpump state <tokenAddress>`（读取）

查询 SunPump 代币的链上状态，用于判断该走 SunPump 发射前交易还是 SunSwap。

```bash
sun sunpump state <tokenAddress>
```

| 状态值 | 标签 | 能否用 `sunpump buy/sell` 交易 |
| :--- | :--- | :--- |
| `0` | `NOT_EXIST` | 否（SunPump 不认识该代币） |
| `1` | `TRADING` | 是 |
| `2` | `READY_TO_LAUNCH` | 是（Bonding Curve 进度已满 100%，即将在 SunSwap V2 上创建交易对） |
| `3` | `LAUNCHED` | 否——改用 `sun swap` |

> `sun-kit` 的 TypeScript 枚举只列了 0–2，但链上合约对已发射代币会返回 3。CLI 会把 3 映射为 `LAUNCHED`——请以打印出的标签为准，不要只看原始数字。

### `sunpump quote-buy <tokenAddress>`（读取）

预览一笔 SunPump 发射前买入，不发送交易。

```bash
sun sunpump quote-buy <tokenAddress> --trx 10
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--trx <amount>` | **（必需）** 要花费的 TRX，**小数**（如 `10` 或 `1.5`） | — |

### `sunpump quote-sell <tokenAddress>`（读取）

预览一笔 SunPump 发射前卖出，不发送交易。

```bash
sun sunpump quote-sell <tokenAddress> --amount 1000
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--amount <amount>` | **（必需）** 要卖出的代币数量，**小数** | — |
| `--decimals <n>` | 代币精度 | `18` |

### `sunpump buy <tokenAddress>`（写入）

在 SunPump 上用 TRX 买入 meme 代币（仅限还没在 SunSwap V2 上创建交易对的代币）。`--trx` 接受小数，CLI 内部按 TRX-Sun（1e6）缩放。

```bash
sun sunpump buy <tokenAddress> --trx 10
sun sunpump buy <tokenAddress> --trx 10 --slippage 0.1
sun sunpump buy <tokenAddress> --trx 10 --min-out 27955000000000000000000
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--trx <amount>` | **（必需）** 要花费的 TRX，**小数** | — |
| `--slippage <n>` | 滑点容差，小数表示（meme 代币波动大） | `0.05` |
| `--min-out <raw>` | 最少获得代币数（原始单位，覆盖滑点） | — |

### `sunpump sell <tokenAddress>`（写入）

在 SunPump 上把 meme 代币卖成 TRX（仅限还没在 SunSwap V2 上创建交易对的代币）。首次卖出某代币时，SDK 会自动先发一笔 TRC20 `approve` 交易。

```bash
sun sunpump sell <tokenAddress> --amount 1000
sun sunpump sell <tokenAddress> --amount 1000 --decimals 6
sun sunpump sell <tokenAddress> --amount 1000 --slippage 0.1
```

| 选项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `--amount <amount>` | **（必需）** 要卖出的代币数量，**小数** | — |
| `--decimals <n>` | 代币精度（不确定时用 `sunpump token get` 查） | `18` |
| `--slippage <n>` | 滑点容差，小数表示 | `0.05` |
| `--min-out <raw>` | 最少获得 TRX（Sun 为单位，覆盖滑点） | — |

> 用 `--dry-run` 可在不广播的情况下打印解析后的参数（TRX/Sun 缩放、计算出的 `minOut`、滑点、网络），方便先给用户看清将要发送的内容。

---

## 内置代币符号

很多命令同时接受代币符号和完整的 TRON 地址：

| 符号 | 地址 | 精度 |
| :--- | :--- | :--- |
| `TRX` | `T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb` | 6 |
| `WTRX` | `TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR` | 6 |
| `USDT` | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` | 6 |
| `USDCOLD` | `TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8` | 6 |
| `USDDOLD` | `TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn` | 18 |
| `USDD` | `TXDk8mbtRbXeYuMNS83CfKPaYYT8XWv9Hz` | 18 |
| `SUN` | `TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S` | 18 |
| `JST` | `TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9` | 18 |
| `BTT` | `TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4` | 18 |
| `WIN` | `TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7` | 6 |
| `NFT` | `TFczxzPhnThNSqr5by8tvxsdCFRRz6cPNq` | 6 |
| `TUSD` | `TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4` | 18 |

你可以使用符号或完整地址：

```bash
sun swap TRX USDT 1000000
```

```bash
sun swap T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t 1000000
```

你可以在 [tokenlist](https://sunlists.justnetwork.io/#/detail?uri=https://list.justswap.io/justswap.json) 查找其他代币。
