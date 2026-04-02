# 命令指南

本页是 SUN CLI 所有命令的完整参考。命令按类别组织：钱包管理、行情数据、交易、流动性、协议分析和合约交互。

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
sun -k your_private_key --network nile --yes swap TRX USDT 1000000
```

```bash
sun --dry-run contract send TContract transfer --args '["TRecipient","1000000"]'
```

---

## 钱包与持仓

查看已配置的钱包信息和链上余额。

### `wallet address`

显示已配置的钱包地址和当前网络。

```bash
sun wallet address
```

### `wallet balances`

查询活跃钱包或任意地址的代币余额。

```bash
sun wallet balances
```

```bash
sun wallet balances --owner TYourAddress --tokens TRX,TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

### `position list`

查看某地址在 SunSwap 上的流动性仓位。

```bash
sun position list --owner TYourAddress
```

### `position tick`

查询指定池子的 tick 数据。

```bash
sun position tick <poolAddress>
```

### `farm positions`

查看收益矿池仓位。

```bash
sun farm positions --owner TYourAddress
```

---

## 价格与发现

### `price`

查询 SunSwap 上代币的实时价格。

```bash
sun price TRX
```

```bash
sun price USDT
```

```bash
sun price --address TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

### `token list`

按协议版本列出代币。

```bash
sun token list --protocol V3
```

### `token search`

按名称或符号搜索代币。

```bash
sun token search USDT
```

### `pool list`

按代币过滤池子列表。

```bash
sun pool list --token TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

### `pool search`

按交易对搜索池子。

```bash
sun pool search "TRX USDT"
```

### `pool top-apy`

按 APY 排行列出池子。

```bash
sun pool top-apy --page-size 10
```

### `pool hooks`

列出启用了 hooks 的池子。

```bash
sun pool hooks
```

### `pair info`

获取某代币的交易对信息。

```bash
sun pair info --token TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

### `farm list`

列出可用的收益矿池。

```bash
sun farm list
```

---

## 兑换

### `swap`

通过最优路径执行代币兑换。需要已配置的钱包。

```bash
sun swap TRX USDT 1000000 --slippage 0.005
```

```bash
sun -k your_private_key --network nile --yes swap TRX USDT 1000000
```

成功响应包含 `txid`、路径详情和 `tronscanUrl` 链接。

### `swap:quote`

获取只读兑换报价，不执行交易。无需钱包。

```bash
sun swap:quote TRX USDT 1000000
```

```bash
sun swap:quote TRX USDT 1000000 --all
```

### `swap:quote-raw`

使用原始参数的低级路由报价。

```bash
sun swap:quote-raw --router <routerAddress> --args '[...]'
```

### `swap:exact-input`

通过指定路由的低级精确输入兑换。

```bash
sun swap:exact-input --router <routerAddress> --args '[...]' --value 1000000
```

---

## 流动性

### V2

```bash
sun liquidity v2:add --token-a TRX --token-b USDT --amount-a 1000000 --amount-b 290000
```

```bash
sun liquidity v2:remove --token-a TRX --token-b USDT --liquidity 500000
```

### V3

```bash
sun liquidity v3:mint --token0 TRX --token1 USDT --amount0 1000000
```

```bash
sun liquidity v3:increase --token-id 123 --amount0 500000
```

```bash
sun liquidity v3:decrease --token-id 123 --liquidity 1000
```

```bash
sun liquidity v3:collect --token-id 123
```

### V4

```bash
sun liquidity v4:mint --token0 TRX --token1 USDT --amount0 1000000
```

```bash
sun liquidity v4:mint --token0 TRX --token1 USDT --amount0 1000000 --create-pool
```

```bash
sun liquidity v4:increase --token-id 123 --token0 TRX --token1 USDT --amount0 500000
```

```bash
sun liquidity v4:decrease --token-id 123 --liquidity 1000 --token0 TRX --token1 USDT
```

```bash
sun liquidity v4:collect --token-id 123
```

```bash
sun liquidity v4:info --pm <positionManager> --token-id 123
```

---

## 协议与历史

### 协议分析

```bash
sun protocol info
```

```bash
sun protocol vol-history --start 2026-01-01 --end 2026-03-01
```

```bash
sun protocol users-history --start 2026-01-01 --end 2026-03-01
```

```bash
sun protocol tx-history --start 2026-01-01 --end 2026-03-01
```

```bash
sun protocol pools-history --start 2026-01-01 --end 2026-03-01
```

```bash
sun protocol liq-history --start 2026-01-01 --end 2026-03-01
```

### 池子历史

```bash
sun pool vol-history <poolAddress> --start 2026-01-01 --end 2026-03-01
```

```bash
sun pool liq-history <poolAddress> --start 2026-01-01 --end 2026-03-01
```

### 交易扫描

```bash
sun tx scan --type swap --token TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t --start 2026-01-01
```

---

## 通用合约

读取或写入任意 TRON 智能合约。

### `contract read`

```bash
sun contract read <contractAddress> balanceOf --args '["TYourAddress"]'
```

### `contract send`

```bash
sun contract send <contractAddress> transfer --args '["TRecipient","1000000"]' --value 0
```

`contract send` 交易广播成功后也会返回 `tronscanUrl` 链接。

---

## 内置代币符号

很多命令同时接受代币符号和完整的 TRON 地址：

| 符号 | 地址 | 精度 |
| :--- | :--- | :--- |
| `TRX` | `T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb` | 6 |
| `WTRX` | `TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR` | 6 |
| `USDT` | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` | 6 |
| `USDCOLD` | `TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8` | 6 |
| `USDD` | `TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn` | 18 |
| `SUN` | `TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S` | 18 |
| `JST` | `TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9` | 18 |
| `BTT` | `TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4` | 18 |
| `WIN` | `TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7` | 6 |

你可以使用符号或完整地址：

```bash
sun swap TRX USDT 1000000
```

```bash
sun swap T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t 1000000
```
