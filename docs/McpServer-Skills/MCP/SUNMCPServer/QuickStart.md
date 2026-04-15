# Quick Start

The goal of this page is simple: **get you integrated and make your first DeFi query in just 1 minute.**

We'll use the [official cloud service](./OfficialServerAccess.md) for this quick experience. The cloud service is read-only, requires no wallet, and is ready to use immediately.

---

## Preparation

Before you get started, make sure you have:

1. **Node.js** >= 20.0.0 ([download link](https://nodejs.org/))
2. **MCP Client**: Any AI client that supports MCP.

---

## Install

The easiest way to install is by **simply chatting with your AI Agent** — no need to open a terminal yourself, no manual file copying. If you're already using an AI Agent that can run shell commands (OpenClaw, a Telegram bot, web chat, Claude Code, Cursor, etc.), you're set.

:::tip Prerequisite
**Node.js is required** on the machine where the AI Agent runs (the Agent uses `npx` under the hood). If Node.js isn't installed yet, grab the LTS installer from [nodejs.org](https://nodejs.org) — install once, double-click and follow the prompts.
:::

**How it works:**

1. Open your AI Agent chat
2. Copy and paste the following prompt:

   ```
   Run npx add-mcp https://sun-mcp-server.bankofai.io/mcp -y to install the SUN MCP Server.
   Note: Please install to the MCP config of the current Agent.
   ```

3. The AI handles the entire flow automatically:
   - Detects the remote MCP service URL
   - Auto-detects which AI client is currently running
   - Writes the `sun-mcp-server` entry into the right MCP config file (no manual JSON editing)
   - Reports back with a ✅ confirmation when done

Once the AI confirms the install, the SUN MCP Server is ready — you can start asking questions right away.

:::tip Prefer the command line?
If you'd rather run the install yourself or need finer control (e.g. selecting which AI tools to install to), see [Official Cloud Service Access](./OfficialServerAccess.md) for the command-line and interactive options.
:::

---

## Test It Out

Try the following query in a conversation:

```
Check the current prices of USDT and TRX on SunSwap
```

:::info About Cloud Service
The official cloud service we provide is **read-only**, suitable for querying data and analysis. If you need to execute on-chain transactions, deploy contracts, or other write operations, please see [Local Privatized Deployment](./LocalPrivatizedDeployment.md).
:::

---

## Continue Exploring

Here are some common DeFi query examples:

| Operation | Example Prompt |
|------|--------|
| **Price Query** | Query the real-time price of USDT/TRX |
| **Liquidity Pool Data** | Get pool information for the TRX-USDC trading pair on SunSwap |
| **Position Query** | View all liquidity positions of address TR... on SunSwap |
| **Trade Quote** | Get a quote for swapping 1000 USDT for TRX |
| **Protocol Stats** | Get SunSwap statistics including TVL and 24-hour trading volume |

---

## Next Steps

- **[Local Privatized Deployment](./LocalPrivatizedDeployment.md)** - Learn how to run SUN MCP Server locally and perform write operations
- **[Official Server Access](./OfficialServerAccess.md)** - Learn more about the official cloud service
- **[Full Capability List](./ToolList.md)** - View all available tools and features

---

Happy coding! If you have any questions, feel free to provide feedback.
