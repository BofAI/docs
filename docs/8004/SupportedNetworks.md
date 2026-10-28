# Supported Networks

## Currently Supported Networks

The SDK currently supports the following networks and default RPC/node endpoints.

| Ecosystem | Network | Network ID | Default Endpoint (SDK Default) |
| :--- | :--- | :--- | :--- |
| **EVM** | BSC Mainnet | `eip155:56` (`chainId=56`) | `https://bsc-dataseed.binance.org` |
| **EVM** | BSC Testnet | `eip155:97` (`chainId=97`) | `https://data-seed-prebsc-1-s1.binance.org:8545` |
| **EVM** | Base Mainnet | `eip155:8453` (`chainId=8453`) | `https://mainnet.base.org` |
| **EVM** | Base Sepolia | `eip155:84532` (`chainId=84532`) | `https://sepolia.base.org` |
| **TRON** | TRON Mainnet | `mainnet` | `https://api.trongrid.io` |
| **TRON** | Nile Testnet | `nile` | `https://nile.trongrid.io` |
| **TRON** | Shasta Testnet | `shasta` | `https://api.shasta.trongrid.io` |

Notes:
- Explorer defaults are `bscscan.com` / `testnet.bscscan.com` for BSC, `basescan.org` / `sepolia.basescan.org` for Base, and `tronscan.org` variants for TRON.
- Base was added to the TypeScript SDK in 1.2.0; it also accepts the aliases `base` and `base:sepolia`. The Python SDK has no Base aliases and no Base Validation Registry entry; it only knows the Identity and Reputation Registry addresses for `chainId` 8453 / 84532, so pass `network="eip155:8453"` / `"eip155:84532"`. A bare `network="base"` is not rejected in Python: it falls back to chainId 97 (BSC Testnet).
- The default endpoints apply to the TypeScript SDK. The Python SDK has no default endpoint: `rpcUrl` is required, and `SDK(...)` raises `rpcUrl is required` without it.
- Subgraph is optional. The Python SDK has built-in subgraph URLs for Base Mainnet and Base Sepolia; the TypeScript SDK has none, so pass `subgraphUrl`. BSC has no built-in subgraph in either SDK.
