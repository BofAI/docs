import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Official Cloud Service Access

## What is the Official Cloud Service?

The official cloud service is a TRON MCP Server instance hosted by **BANK OF AI**, providing AI clients with **read-only query capabilities for the TRON blockchain**.

In the traditional approach, if you want an AI assistant to read on-chain data, you typically need to:

- Install Node.js and related dependencies locally
- Clone the repository and complete the build
- Configure environment variables and network parameters
- Maintain server version updates yourself

This is far too much overhead for users who simply want to check a balance.

**The core purpose of the official cloud service is to handle all of this infrastructure for you.** You only need to add a single service URL to your AI client's configuration to start interacting with the TRON blockchain.

### Key Advantages

**1. No local installation required**

No Node.js, no repository clone, no build commands. Just add a JSON snippet to your config file, restart your AI client, and you're ready to use. The entire process usually takes no more than 2 minutes.

**2. No private key exposure risk**

Since the cloud service is read-only, you never need to provide a wallet private key or mnemonic. This fundamentally eliminates risks like key leakage and config files accidentally committed to Git. It's especially convenient for team collaboration — any member can connect directly without key distribution or management concerns.

**3. Official maintenance and continuous updates**

The cloud service is maintained by the official team and always runs the latest stable version of TRON MCP Server. This includes:

- Updates with new tools and features
- Adaptations for underlying TRON network upgrades
- Continuous performance and stability improvements

You don't need to worry about version numbers or manually run `npm install` or rebuild.

**4. Covers the vast majority of real-world use cases**

The most common daily operations — checking address balances, analyzing transaction details, reading contract state, viewing the Super Representative list, monitoring on-chain events — are all read-only queries, fully supported through the cloud service. Only when you need to actually move assets (transfers, staking, contract writes) do you need to switch to [Local Private Deployment](./LocalPrivatizedDeployment.md).

> In short: **The official cloud service acts as a "read-only API gateway" for the TRON blockchain** — AI clients only need the service URL to query all public on-chain data.

:::warning Important
The official cloud service only provides **read-only access**. It does **not support** transfers, contract writes, staking, or any other write operations. For full functionality, please use [Local Private Deployment](./LocalPrivatizedDeployment.md).
:::

---

## How to Connect

To connect to the official cloud service, simply add the official **MCP service URL** to your AI client configuration: [https://tron-mcp-server.bankofai.io/mcp](https://tron-mcp-server.bankofai.io/mcp)

> Note: This is an MCP protocol endpoint, not a webpage. Opening it directly in a browser will not display anything.

The official cloud service supports **two usage modes**:

| Mode | Rate Limit | Description |
| :--- | :--- | :--- |
| **Without API Key (default)** | 100,000 requests / day | Ready to use immediately, suitable for getting started and low-frequency queries |
| **With TronGrid API Key** | 500,000 requests / day | Higher request limit, suitable for frequent queries and production use |

Both modes use the same connection method — the only difference is the request rate limit.

---

### Without API Key Mode (Default)

No API Key configuration needed to get started. Best for:

- First-time experience with TRON MCP Server
- Occasional on-chain data queries
- Teaching, demos, and feature verification

In this mode, all tools are available, but mainnet queries under high-frequency usage may trigger TronGrid's public RPC rate limits.

---

### With TronGrid API Key Mode (Recommended)

For frequent mainnet queries, apply for a free TronGrid API Key to get a higher request rate limit.

**How to apply:**

1. Visit [trongrid.io](https://www.trongrid.io/)
2. Register an account and create a project
3. Copy the generated API Key
4. Add the API Key header in your configuration (see client configuration examples below)

After configuring the API Key, your requests will go through TronGrid's authenticated channel, with more stable performance and higher throughput.

---

## Client Configuration

<Tabs>
<TabItem value="Claude Desktop" label="Claude Desktop">

Configuration file path:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Basic Config (No API Key)**:

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://tron-mcp-server.bankofai.io/mcp"
      ]
    }
  }
}
```

**Config with TronGrid API Key**:

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://tron-mcp-server.bankofai.io/mcp",
        "--header",
        "TRONGRID-API-KEY:<your-api-key>"
      ]
    }
  }
}
```

Replace `<your-api-key>` with your actual TronGrid API Key.

</TabItem>
<TabItem value="Claude Code" label="Claude Code">

**Command line:**

```bash
claude mcp add --transport http mcp-server-tron https://tron-mcp-server.bankofai.io/mcp
```

**Or add `.mcp.json` to your project root**:

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "type": "http",
      "url": "https://tron-mcp-server.bankofai.io/mcp"
    }
  }
}
```

</TabItem>
<TabItem value="Cursor" label="Cursor">

Add the following to your project root `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "url": "https://tron-mcp-server.bankofai.io/mcp"
    }
  }
}
```

</TabItem>
<TabItem value="通用 HTTP 调用" label="Generic HTTP Call">

If you want to integrate TRON MCP Server into your own application, you can call it via standard HTTP requests.

**Step 1: Initialize Connection**

```bash
curl -X POST https://tron-mcp-server.bankofai.io/mcp \
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

The response will include a `mcp-session-id` header — you'll need it for subsequent requests.

**Step 2: Call a Tool**

Use the `mcp-session-id` from Step 1:

```bash
curl -X POST https://tron-mcp-server.bankofai.io/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-session-id: <your-session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "get_chain_info",
      "arguments": {"network": "mainnet"}
    },
    "id": 2
  }'
```

**Step 3: Discover Available Tools**

```bash
curl -X POST https://tron-mcp-server.bankofai.io/mcp \
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

</TabItem>
</Tabs>

---

## Verify Connection

After completing configuration, **fully exit and restart** your AI client, then enter the following test prompt:

```
Query the current block height of TRON mainnet
```

If you receive a normal response (e.g., showing the current block height), the connection is working.

If you encounter issues, please check [FAQ](./FAQ.md) for troubleshooting.

---

## Available Capabilities

When connected via the official cloud service, you can use all **read-only** tools, including but not limited to:

| Category | Example Capabilities |
| :--- | :--- |
| Balance Queries | Query TRX balance, TRC20 token balance, all token holdings |
| Transaction Queries | Look up transaction details, receipts, resource consumption |
| Block Data | Query by block number, by hash, latest block, batch queries |
| Account Info | Account details, resources, delegation info, bandwidth/energy |
| Smart Contract Reading | Call view/pure functions, get ABI, contract metadata |
| Event Queries | Query events by transaction, contract, block number |
| Network Status | Chain info, resource prices, supported networks |
| Governance | List Super Representatives, proposals, reward queries |
| Address Utilities | Format conversion, address validation |

For the Full Capability List, please refer to [Full Capability List](./ToolList.md).

---

## Next Steps

- Need transfers, staking, or contract writes? → [Local Private Deployment](./LocalPrivatizedDeployment.md)
- Want the detailed description of all 95 tools? → [Full Capability List](./ToolList.md)
