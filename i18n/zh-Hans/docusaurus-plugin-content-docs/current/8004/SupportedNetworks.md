# 支持的网络 


## 当前支持的网络

SDK 当前支持以下网络及默认 RPC/节点端点：

| 生态系统 | 网络 | 网络 ID | 默认端点（SDK 默认） |
| :--- | :--- | :--- | :--- |
| **EVM** | BSC 主网 | `eip155:56` (`chainId=56`) | `https://bsc-dataseed.binance.org` |
| **EVM** | BSC 测试网 | `eip155:97` (`chainId=97`) | `https://data-seed-prebsc-1-s1.binance.org:8545` |
| **TRON** | TRON 主网 | `tron:mainnet` | `https://api.trongrid.io` |
| **TRON** | Nile 测试网 | `tron:nile` | `https://nile.trongrid.io` |
| **TRON** | Shasta 测试网 | `tron:shasta` | `https://api.shasta.trongrid.io` |

**说明：**

- BSC 默认区块浏览器为 `bscscan.com` / `testnet.bscscan.com`，TRON 默认浏览器为 `tronscan.org` 及其对应测试网版本。
- Subgraph URL 当前为可选配置，具体是否可用取决于部署情况。
