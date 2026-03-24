# Quick Start

The goal of this page is simple: **get you connected in 1 minute and make your first blockchain query.**

We'll use the [official cloud service](./OfficialServerAccess.md) for this quick start. The cloud service is read-only — no dependencies to install, no wallet to configure, no API Key required. Just copy a config snippet into your AI client, restart, and start asking questions.

---

## Prerequisites

Before you begin, make sure you have the following installed:

- Any AI client that supports MCP
- **Node.js v20.0.0 or higher** (needed for `npx` command execution) ([Node.js Download](https://nodejs.org/))

Verify your Node.js version:

```bash
node --version  # should output v20.x.x or higher
```

---

## Add Configuration

Simply tell your AI Agent to execute the following command:

```bash
npx add-mcp https://tron-mcp-server.bankofai.io/mcp -y
```

The `-y` flag skips all interactive prompts and automatically installs to every AI tool detected on your computer. Once complete, it will show ✅ Installation complete! along with the list of agents it was installed to.

After the command completes, restart your MCP client.

:::tip Want to choose which AI tools to install to?
Remove the `-y` flag to enter interactive installation mode. See [Official Cloud Service Access](./OfficialServerAccess.md) for details.
:::

---

## Restart and Test

After saving the configuration, **completely quit and restart** your AI client. After restarting, the client will automatically connect to TRON MCP Server.

Then enter your first query in the chat:

```
Check the TRX balance of TRON address TXyz...
```

If everything is working, the AI will automatically call the `get_balance` tool and return the TRX balance of that address. Seeing a result means you've successfully connected.

:::info About the Cloud Service's Capabilities
The configuration above connects to the **official cloud read-only service**, which supports all query operations (checking balances, looking up transactions, reading contract state, etc.) but does not support write operations (transfers, contract calls, etc.). For full read/write capabilities, please refer to [Local Private Deployment](./LocalPrivatizedDeployment.md).
:::

---

## Continue Exploring

Once connected, try a few more prompts to get a feel for what TRON MCP Server can do:

| Try saying | What it does |
| :--- | :--- |
| "Check the USDT balance of address TXyz..." | Query the TRC20 token balance of a specified address |
| "Look up the details of transaction hash abc123..." | Get transaction details, resource consumption, and status |
| "What is the current latest block number on TRON mainnet?" | Query the latest block height and chain info |
| "Query the current Energy and Bandwidth prices on TRON mainnet" | Get real-time resource prices |
| "Convert address 41abc... to Base58 format" | Address format conversion |
| "Show the resource usage of account TXyz..." | Get account energy, bandwidth, and staking details |
| "Get the ABI of contract TXyz..." | Read a smart contract interface definition |
| "Query the latest events triggered by contract TXyz..." | Get contract event logs |

These are just the tip of the iceberg. For the full list of 95 tools and 6 prompt templates, see [Full Capability List](./ToolList.md).

---

## Next Steps

You've completed your first on-chain interaction. What you do next depends on what you want to do:

- Need transfers, contract calls, or other write operations? → [Local Private Deployment](./LocalPrivatizedDeployment.md)
- Want to explore cloud service configuration options (such as TronGrid API Key)? → [Official Cloud Service Access](./OfficialServerAccess.md)
- Want to see the detailed description of all available tools? → [Full Capability List](./ToolList.md)
