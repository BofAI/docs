# Official Cloud Service Access

## What is the Official Cloud Service?

The official cloud service is a SUN MCP Server instance hosted by **BANK OF AI**, providing AI clients with **read-only query capabilities for SunSwap on-chain data**.

If you want your AI assistant to query token prices, pool APYs, or protocol trading volume on SunSwap, or analyze a specific address's liquidity positions — these are all read-only operations that can be completed via the official cloud service, with no wallet credentials needed.

**The core purpose of the official cloud service is to handle all infrastructure for you.** You only need to add a single service URL to your AI client's configuration to start interacting with SunSwap.

### Key Advantages

**1. No private key exposure risk** — Since the cloud service is read-only, you never need to provide a wallet private key or mnemonic. This eliminates key leakage risks and makes team sharing straightforward.

**2. Official maintenance and continuous updates** — The service always runs the latest stable version, including SunSwap protocol updates and SUN.IO API synchronization. No manual rebuilds needed.

**3. Covers a large number of practical use cases** — Querying token prices and swap quotes, analyzing pool data and APYs, getting protocol statistics and historical metrics, viewing user liquidity positions — all the most commonly used DeFi data queries are fully supported. Only when you need to actually execute swaps or manage liquidity do you need to switch to [Local Private Deployment](./LocalPrivatizedDeployment.md).

> In short: **The official cloud service acts as a "read-only data gateway" for SunSwap** — AI clients only need the service URL to query all public data on SunSwap.

:::warning Important
The official cloud service only provides **read-only access**. It does **not support** token swaps, adding/removing liquidity, or any other on-chain write operations. For full functionality, please use [Local Private Deployment](./LocalPrivatizedDeployment.md).
:::

---

## How to Connect

Simply tell your AI Agent to execute the following command:

```bash
npx add-mcp https://sun-mcp-server.bankofai.io/mcp
```

Once the command completes, restart your AI Agent, and the MCP Server is ready to use — you can start interacting with SunSwap.

---

## Verify Connection

Once connected, you can test by asking your AI Agent the following question:

```
Check the current prices of USDT and TRX on SunSwap
```

If you receive a normal response, the connection is working.

If you encounter issues, first confirm:
1. Node.js version >= 20.0.0 (run `node --version` to check)
2. Network can reach `sun-mcp-server.bankofai.io`
3. AI client has been fully quit and restarted (not just refreshed)

---

## Available Capabilities Overview

When connected via the official cloud service, you can use all **read-only** tools, including:

| Category | Example Capabilities |
| :--- | :--- |
| **Token Prices** | Query real-time token prices by address or symbol |
| **Swap Quotes** | Get the optimal swap quote for an exact input via smart routing |
| **Token Info** | Search token information by address, protocol, or keyword |
| **Pool Data** | Pool lists, APY rankings, trading volume history, liquidity history |
| **Position Queries** | User liquidity positions, tick-level position details |
| **Protocol Stats** | Trading volume, user counts, transaction counts, pool count history |
| **Farm Info** | Farm lists, farm transactions, user farm positions |
| **Contract Reading** | Call view/pure functions on any TRON contract |

For the Full Capability List, see [Full Capability List](./ToolList.md).

---

## Next Steps

- Need token swaps or liquidity management? → [Local Private Deployment](./LocalPrivatizedDeployment.md)
- Want the detailed description of all available tools? → [Full Capability List](./ToolList.md)
