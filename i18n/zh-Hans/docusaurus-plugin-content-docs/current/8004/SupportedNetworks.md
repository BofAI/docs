# 支持的网络 


## 当前支持的网络

SDK 当前支持以下网络及默认 RPC/节点端点：

| 生态系统 | 网络 | 网络 ID | 默认端点（SDK 默认） |
| :--- | :--- | :--- | :--- |
| **EVM** | BSC 主网 | `eip155:56` (`chainId=56`) | `https://bsc-dataseed.binance.org` |
| **EVM** | BSC 测试网 | `eip155:97` (`chainId=97`) | `https://data-seed-prebsc-1-s1.binance.org:8545` |
| **EVM** | Base 主网 | `eip155:8453` (`chainId=8453`) | `https://mainnet.base.org` |
| **EVM** | Base Sepolia 测试网 | `eip155:84532` (`chainId=84532`) | `https://sepolia.base.org` |
| **TRON** | TRON 主网 | `mainnet` | `https://api.trongrid.io` |
| **TRON** | Nile 测试网 | `nile` | `https://nile.trongrid.io` |
| **TRON** | Shasta 测试网 | `shasta` | `https://api.shasta.trongrid.io` |

**说明：**

- BSC 默认区块浏览器为 `bscscan.com` / `testnet.bscscan.com`，Base 为 `basescan.org` / `sepolia.basescan.org`，TRON 默认浏览器为 `tronscan.org` 及其对应测试网版本。
- Base 自 1.2.0 起加入 TypeScript SDK，也可使用别名 `base` 与 `base:sepolia`。Python SDK 没有 Base 别名，也没有 Base 的验证注册表条目；它只内置了 `chainId` 8453 / 84532 上身份注册表与信誉注册表的地址，请传 `network="eip155:8453"` / `"eip155:84532"`。在 Python 中单写 `network="base"` 不会报错，而是回落到 chainId 97（BSC 测试网）。
- 上表的默认端点适用于 TypeScript SDK。Python SDK 没有默认端点：必须传入 `rpcUrl`，否则 `SDK(...)` 会报 `rpcUrl is required`。
- Subgraph 为可选。Python SDK 内置了 Base 主网与 Base Sepolia 的 subgraph 地址；TypeScript SDK 没有内置，需自行传 `subgraphUrl`。两个 SDK 都没有 BSC 的内置 subgraph。
