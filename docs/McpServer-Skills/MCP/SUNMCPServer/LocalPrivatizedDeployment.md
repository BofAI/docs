import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Local Privatized Deployment

If you need to perform write operations such as transfers and contract calls, you must deploy the server locally. Local deployment allows you to securely configure private keys, thereby enabling full transaction functions.

## Environment Requirements
- **Node.js** 20.0.0 or higher.
- **npm** (or compatible package manager).
- Optional: **TronGrid API Key**, used for higher rate limiting and stability on the mainnet.


## Key Configuration (Environment Variables)

**Security**: Do not save private keys or mnemonics in MCP configuration files (such as `claude_desktop_config.json` or `mcp.json`), they should be set through environment variables in the system or shell.

### 1. Network and API

- **TRONGRID_API_KEY** (Optional): TronGrid API Key used by mainnet RPC, which can reduce rate limiting and improve stability.
- **TRON_RPC_URL** (Optional): Overwrite the TRON RPC base address; after setting, it replaces the default fullNode/solidityNode/eventServer of the current network.

### 2. Wallet (Write Operations)

**Method 1: Private Key**

```bash
export TRON_PRIVATE_KEY="<your private key hex>"
```

**Method 2: Mnemonic**

```bash
export TRON_MNEMONIC="word1 word2 ... word12"
export TRON_ACCOUNT_INDEX="0"   # Optional, default 0
```

If neither is set and no Agent Wallet provider is provided, write-type tools (transfer, swap, liquidity) will report a "no wallet available" error.


## Installation
1.  **Clone and enter the directory**:
    ```shell
    git clone https://github.com/BofAI/sun-mcp-server.git
    cd sun-mcp-server
    ```
2.  **Install and build**:
    ```shell
    npm install && npm run build
    ```


## Verification
Default stdio mode:
```bash
# Run tests
npm test

# Start service (stdio)
npm start
```

When using HTTP (streamable-http) mode:

```bash
npm start -- --transport streamable-http --host 127.0.0.1 --port 8080 --mcpPath /mcp
```


## Client Integration
To use this server with MCP clients such as Claude Desktop, Cursor, etc., you need to add it to your configuration file.
<Tabs>
<TabItem value="Claude Desktop" label="Claude Desktop">

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or the equivalent path under your system:

```json
{
  "mcpServers": {
    "sun-mcp-server": {
      "command": "npx",
      "args": ["tsx", "/ABSOLUTE/PATH/TO/sun-mcp-server/src/index.ts"],
      "env": {
        "TRON_PRIVATE_KEY": "YOUR_KEY_HERE (Or set in system env)",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE (Or set in system env)"
      },
      "enabled": true
    }
  }
}
```

If wallet-related environment variables have been configured in the shell, the private key/mnemonic in `env` can be omitted.



</TabItem>
<TabItem value="Cursor" label="Cursor">

Configure in `.cursor/mcp.json` at the project root:

```json
{
  "servers": [
    {
      "name": "sun-mcp-server",
      "command": "npx",
      "args": ["tsx", "/ABSOLUTE/PATH/TO/sun-mcp-server/src/index.ts"],
      "env": {
        "TRON_PRIVATE_KEY": "YOUR_KEY_HERE (Or set in system env)",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE (Or set in system env)"
      }
    }
  ]
}
```

</TabItem>

<TabItem value="HTTP (streamable-http)" label="HTTP (streamable-http)">

When using HTTP transport, requesting the MCP interface requires carrying:

- **Accept**: `application/json, text/event-stream`
- **Content-Type**: `application/json`

Example (tools/call):

```bash
curl -X POST "Your local MCP URL" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tools/call",
    "params": {
      "name": "sunswap_v2_add_liquidity",
      "arguments": {
        "network": "nile",
        "routerAddress": "TMn1qrmYUMSTXo9babrJLzepKZoPC7M6Sy",
        "tokenA": "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
        "tokenB": "TWMCMCoJPqCGw5RR7eChF2HoY3a9B8eYA3",
        "amountADesired": "1000000",
        "amountBDesired": "1500000"
      }
    }
  }'
```


</TabItem>
</Tabs>