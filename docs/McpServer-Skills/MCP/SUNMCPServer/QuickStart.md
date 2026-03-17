import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start

The goal of this page is simple: **get you integrated and make your first DeFi query in just 1 minute.**

We'll use the [official cloud service](./OfficialServerAccess.md) for this quick experience. The cloud service is read-only, requires no wallet, and is ready to use immediately.

---

## Preparation

Before you get started, make sure you have:

1. **Node.js** >= 20.0.0 ([download link](https://nodejs.org/))
2. **MCP Client**: Any AI client that supports MCP. For example [Claude Desktop](https://claude.ai/download), [Claude Code](https://docs.anthropic.com/en/docs/claude-code), or [Cursor](https://cursor.sh).

---

## Add Configuration

Choose the configuration method that matches the tool you're using:

<Tabs>
<TabItem value="claude-desktop" label="Claude Desktop">

1. Open the Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the following configuration in the `mcpServers` section:

```json
{
  "mcpServers": {
    "sun-mcp-server": {
      "command": "npx",
      "args": ["mcp-remote", "https://sun-mcp-server.bankofai.io/mcp"]
    }
  }
}
```

3. Save the file and restart Claude Desktop.

</TabItem>

<TabItem value="claude-code" label="Claude Code">

Run the following command in the terminal to add SUN MCP Server:

```bash
claude mcp add --transport http sun-mcp-server https://sun-mcp-server.bankofai.io/mcp
```

</TabItem>

<TabItem value="cursor" label="Cursor">

1. Open the Cursor configuration file: `.cursor/mcp.json`

2. Add the following in the configuration:

```json
{
  "mcpServers": {
    "sun-mcp-server": {
      "command": "npx",
      "args": ["mcp-remote", "https://sun-mcp-server.bankofai.io/mcp"]
    }
  }
}
```

3. Save the file and restart Cursor.

</TabItem>
</Tabs>

---

## Restart and Test

After completing the configuration, restart your MCP client. Then try the following query in a conversation:

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
