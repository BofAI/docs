# Official Cloud Service Access

## What is the Official Cloud Service?

The official cloud service is a SUN MCP Server instance hosted by **BANK OF AI**, providing AI clients with **read-only query capabilities for SunSwap on-chain data**.

If you want your AI assistant to query token prices, pool APYs, or protocol trading volume on SunSwap, or analyze a specific address's liquidity positions — these are all read-only operations that can be completed via the official cloud service, with no local installation required and no wallet credentials needed.

**The core purpose of the official cloud service is to handle all infrastructure for you.** You only need to add a single service URL to your AI client's configuration to start interacting with SunSwap.

### Key Advantages

**1. No local installation required** — No Node.js, no repository clone, no build commands. Just add a JSON snippet to your config file, restart your AI client, and you're ready in under 2 minutes.

**2. No private key exposure risk** — Since the cloud service is read-only, you never need to provide a wallet private key or mnemonic. This eliminates key leakage risks and makes team sharing straightforward.

**3. Official maintenance and continuous updates** — The service always runs the latest stable version, including SunSwap protocol updates and SUN.IO API synchronization. No manual rebuilds needed.

**4. Covers a large number of practical use cases** — Querying token prices and swap quotes, analyzing pool data and APYs, getting protocol statistics and historical metrics, viewing user liquidity positions — all the most commonly used DeFi data queries are fully supported. Only when you need to actually execute swaps or manage liquidity do you need to switch to [Local Private Deployment](./LocalPrivatizedDeployment.md).

> In short: **The official cloud service acts as a "read-only data gateway" for SunSwap** — AI clients only need the service URL to query all public data on SunSwap.

:::warning Important
The official cloud service only provides **read-only access**. It does **not support** token swaps, adding/removing liquidity, or any other on-chain write operations. For full functionality, please use [Local Private Deployment](./LocalPrivatizedDeployment.md).
:::

---

## How to Connect

Add the following MCP service endpoint to your AI client configuration:

**`https://sun-mcp-server.bankofai.io/mcp`**

> Note: This is an MCP protocol endpoint, not a webpage. Opening it directly in a browser will not display anything.

---

## Client Configuration

If you want to integrate SUN MCP Server into your own application, you can call it via standard HTTP requests.

**Step 1: Initialize Connection**

```bash
curl -X POST https://sun-mcp-server.bankofai.io/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-03-26",
      "capabilities": {},
      "clientInfo": {"name": "my-client", "version": "1.0"}
    },
    "id": 1
  }'
```

The response will include an `mcp-session-id` header — you will need it for subsequent requests.

**Step 2: Call a Tool**

Use the `mcp-session-id` from Step 1:

```bash
curl -X POST https://sun-mcp-server.bankofai.io/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-session-id: <your-session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "getPrice",
      "arguments": {"tokenAddress": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}
    },
    "id": 2
  }'
```

**Step 3: Discover Available Tools**

```bash
curl -X POST https://sun-mcp-server.bankofai.io/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-session-id: <your-session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "params": {},
    "id": 3
  }'
```

:::info Session Management
- Each `initialize` creates a new session
- Sessions automatically expire after 30 minutes of inactivity
- Use `DELETE /mcp` (with `mcp-session-id` header) to explicitly close a session
:::

---

## Verify Connection

After configuration, **fully quit and restart** your AI client, then enter the following test query:

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
