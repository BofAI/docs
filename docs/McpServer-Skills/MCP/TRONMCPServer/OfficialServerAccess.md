import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Official Server Access
For users who only need to read blockchain data (not involving transactions), you can connect directly to the officially hosted instance. **Note: The official service only provides a read-only interface and does not support operations such as transfers or contract writing.**

## Service Information
| Environment | URL |
| :--- | :--- |
| Production | [https://tron-mcp-server.bankofai.io/mcp](https://tron-mcp-server.bankofai.io/mcp)  |

- **Transport Protocol**: Streamable HTTP
- **Mode**: Read-only (write tools disabled)

## Environment Requirements
*   **Node.js**: v20.0.0 or higher.
*   Optional: **TronGrid API Key**: It is recommended to apply ([trongrid.io](https://www.trongrid.io/)) to avoid mainnet frequency limits.

## Key Configuration (Environment Variables)

**Important Security Note**: For your safety, **NEVER** save your private keys or mnemonics directly in MCP configuration files (such as `claude_desktop_config.json` or `mcp.json`). Instead, please set them as environment variables in your operating system or shell configuration.

To enable write operations (transfers, contract calls) and ensure reliable API access, you should configure the following variables.

### 1. Network Configuration

*   `TRONGRID_API_KEY`: (Optional) Your TronGrid API key.
    *   **Reason**: TRON mainnet RPC has strict rate limits. Using an API key from [TronGrid](https://www.trongrid.io/) ensures reliable performance and higher throughput.
    *   **Usage**:
        
        ```shell
        export TRONGRID_API_KEY="<YOUR_TRONGRID_API_KEY_HERE>"
        ```
        

### 2. Wallet Configuration (Using Environment Variables)

**Option 1: Private Key**

```shell
# Recommended: Add this to your ~/.zshrc or ~/.bashrc
export TRON_PRIVATE_KEY="<YOUR_PRIVATE_KEY_HERE>"
```

**Option 2: Mnemonic**

```shell
# Recommended: Add this to your ~/.zshrc or ~/.bashrc
export TRON_MNEMONIC="<WORD1> <WORD2> ... <WORD12>"
export TRON_ACCOUNT_INDEX="0" # Optional, default: 0
```

## Client Integration

<Tabs>
<TabItem value="Claude Desktop" label="Claude Desktop">

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

With TronGrid API Key:

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

</TabItem>
<TabItem value="Claude Code" label="Cluade Code">

CLI command:

```shell
claude mcp add --transport http mcp-server-tron https://tron-mcp-server.bankofai.io/mcp
```

Or add `.mcp.json` to the project root:

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

<TabItem value="Generic HTTP Call" label="Generic HTTP Call">

Initialize connection:

```shell
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

Call a tool (use the `mcp-session-id` from the initialize response):

```shell
curl -X POST https://tron-mcp-server.bankofai.io/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-session-id: <session-id>" \
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

</TabItem>

</Tabs>
