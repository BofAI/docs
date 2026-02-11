# Supported Networks

## Currently Supported Networks

The SDK currently supports the following networks and default RPC/node endpoints.

| Ecosystem | Network | Network ID | Default Endpoint (SDK Default) |
| :--- | :--- | :--- | :--- |
| **EVM** | BSC Mainnet | `eip155:56` (`chainId=56`) | `https://bsc-dataseed.binance.org` |
| **EVM** | BSC Testnet | `eip155:97` (`chainId=97`) | `https://data-seed-prebsc-1-s1.binance.org:8545` |
| **TRON** | TRON Mainnet | `tron:mainnet` | `https://api.trongrid.io` |
| **TRON** | Nile Testnet | `tron:nile` | `https://nile.trongrid.io` |
| **TRON** | Shasta Testnet | `tron:shasta` | `https://api.shasta.trongrid.io` |

Notes:
- Explorer defaults are `bscscan.com` / `testnet.bscscan.com` for BSC and `tronscan.org` variants for TRON.
- Subgraph URL is currently optional and may be unavailable depending on deployment.
