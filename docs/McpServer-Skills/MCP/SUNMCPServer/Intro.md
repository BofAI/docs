# Introduction

## What is SUN MCP Server?

SUN MCP Server is the bridge connecting AI assistants to [SUN.IO (SunSwap)](https://sun.io), the largest decentralized exchange on the TRON blockchain. Built on the [Model Context Protocol (MCP)](../Intro.md) standard, it lets you query DeFi data, execute token swaps, and manage liquidity positions using natural language—without directly interacting with contracts or handling complex on-chain parameters.

For example: just tell Claude "swap 100 USDT to TRX using SunSwap's best route," and the AI will automatically find the optimal path, estimate slippage, ask you to confirm, then execute the trade. No need to open a frontend, manually approve contracts, or understand the routing contract internals.

What this means for different people:

- If you're a **DeFi user**, it lets you operate SunSwap conversationally—swapping, adding liquidity, collecting fees, as naturally as sending a message.
- If you're a **Web3 developer**, it's your tool for quickly querying SunSwap on-chain state and protocol metrics, saving significant API integration work.
- If you're an **AI Agent builder**, it provides a standardized DeFi toolkit you can directly orchestrate into automated trading or market-making strategies.
- If you're a **data analyst**, SunSwap's trading volume, pool APYs, and position data are all within reach—no API documentation required.

---

## What can it do?

SUN MCP Server covers the full range of SunSwap DEX interactions, from on-chain data queries to token swaps and liquidity management, providing **41 tools** (18 custom tools + 23 SUN.IO OpenAPI tools).

Here's a capability overview—each item can be triggered through natural language:

**Data Queries (read-only, no private key needed):**

| Capability | Description | Try saying |
| :--- | :--- | :--- |
| **Token Prices** | Query real-time prices for any token on SunSwap | "What's the current USDT/TRX price?" |
| **Swap Quotes** | Get the optimal route and expected output for a given input | "How much TRX can I get for 100 USDT?" |
| **Pool Data** | Query pool lists, APY, trading volume, liquidity history | "What's the current APY for the USDT-TRX pool?" |
| **Position Query** | View liquidity positions for any address on SunSwap | "Check my SunSwap positions" |
| **Protocol Stats** | Overall SunSwap trading volume, user counts, pool count history | "What was SunSwap's trading volume in the past 7 days?" |
| **Farm Info** | Query farm lists and user mining positions | "What yield farms are available on SunSwap?" |

**DeFi Operations (write, requires private key):**

| Capability | Description | Try saying |
| :--- | :--- | :--- |
| **Token Swap** | Execute optimal-route swaps via the Universal Router | "Swap 100 USDT to TRX for me" |
| **V2 Liquidity** | Add/remove V2 pool liquidity, auto-handles TRX/WTRX conversion | "Add 100 USDT of liquidity to the USDT-TRX V2 pool" |
| **V3 Liquidity** | Mint and manage concentrated liquidity positions, collect fees | "Collect the accrued fees from my V3 position" |
| **V4 Liquidity** | V4 concentrated liquidity operations with Permit2 authorization | "Mint a V4 USDT-TRX position" |
| **Contract Interaction** | Directly read or call any TRON smart contract function | "Query the current slot0 state of this contract" |

For the Full Capability List and parameter details, see [Full Capability List](./ToolList.md).

---

## Two Access Modes

Now that you understand SUN MCP Server's capabilities, you need to choose an access mode. There are two paths depending on your use case:

**[Official Cloud Service](./OfficialServerAccess.md)** — Best for quick exploration and data queries. No installation required—just add a service address to your AI client config and you're ready. The cloud service is **read-only**: it supports querying token prices, pool data, protocol stats, but does not support executing swaps or adding liquidity.

**[Local Private Deployment](./LocalPrivatizedDeployment.md)** — For users who need full DeFi functionality. Run SUN MCP Server on your own machine, configure a wallet, and unlock swaps, liquidity management, and all other operations. Private keys stay entirely local and are never uploaded to any remote service.

The core difference comes down to one thing: **whether you need to sign transactions**.

| Comparison | Official Cloud Service | Local Private Deployment |
| :--- | :--- | :--- |
| **Feature scope** | Read-only (data queries) | Full (queries + swaps + liquidity) |
| **Setup difficulty** | Add one line of config | Requires local install and build |
| **Private key required** | No | Yes (required for write operations) |
| **Token swaps / liquidity** | Not supported | Supported |
| **Best for** | Data queries, getting started | DeFi operations, automated strategies |
| **Security** | High (no private key exposure risk) | Depends on your key management |

:::tip Not sure which to choose?
If you just want to check SunSwap prices and pool data, start with the [Official Cloud Service](./OfficialServerAccess.md)—it takes 1 minute to connect. When you need to execute swaps or manage liquidity, switch to [Local Private Deployment](./LocalPrivatizedDeployment.md).
:::

---

## Supported Networks

Both access modes support the following three networks (mainnet by default):

| Network | Identifier | Purpose | Block Explorer |
| :--- | :--- | :--- | :--- |
| **Mainnet** | `mainnet` | Production, real assets | [tronscan.org](https://tronscan.org) |
| **Nile Testnet** | `nile` | Development and testing (recommended) | [nile.tronscan.org](https://nile.tronscan.org) |
| **Shasta Testnet** | `shasta` | Development and testing | [shasta.tronscan.org](https://shasta.tronscan.org) |

Specify the target network via the `network` parameter when calling tools. **We strongly recommend validating any new operation on the Nile testnet first**—mainnet operations involve real assets and cannot be undone.

---

## Security Notes

:::warning
Before you start, keep these security principles in mind—DeFi operations directly involve on-chain assets and mistakes cannot be reversed:

- **Never hardcode private keys**: Do not write private keys or mnemonics directly into config files. Use system environment variables or encrypted wallet management.
- **Test on testnet first**: Before executing any swap or liquidity operation on mainnet, verify it on the Nile testnet.
- **Minimum funds principle**: Only keep the funds needed for the current task in the AI Agent's wallet.
- **Watch authorization risk**: Token `approve` operations require extra care—avoid granting unlimited allowances.
- **Confirm every transaction**: Before executing any on-chain write operation, the AI will present transaction details and ask for confirmation. Don't skip this step.
:::

---

## Next Steps

- Want the fastest way to try it out? → [Quick Start](./QuickStart.md)
- Only need to query on-chain data? → [Official Cloud Service](./OfficialServerAccess.md)
- Need token swaps or liquidity management? → [Local Private Deployment](./LocalPrivatizedDeployment.md)
- Want to explore all 41 tools? → [Full Capability List](./ToolList.md)
