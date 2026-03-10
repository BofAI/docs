# Official Server Access
For users who only need to read blockchain data (not involving transactions), you can connect directly to the officially hosted instance. **Note: The official service only provides a read-only interface and does not support operations such as transfers or contract writing.**

## Service Information
| Environment | URL |
| :--- | :--- |
| Production | [https://sun-mcp-server.bankofai.io/mcp](https://sun-mcp-server.bankofai.io/mcp)|

- **Transport Protocol**:
  - **stdio**: Default; used for local MCP clients (such as Claude Desktop, Cursor).
  - **streamable-http**: HTTP + server-side push events, for remote clients; configurable host, port, path.
- **Mode**: Read-only (write tools disabled)

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

### 3. Service and OpenAPI

- **OPENAPI_SPEC_PATH**: OpenAPI specification path (default from `config.json`, such as `./specs/sunio-open-api.json`).
- **TARGET_API_BASE_URL**: SUN.IO API base URL (default from config, such as `https://open.sun.io`).
- **MCP_TRANSPORT**: `stdio` or `streamable-http`.
- **MCP_SERVER_HOST**, **MCP_SERVER_PORT**, **MCP_SERVER_PATH**: Used when transport is `streamable-http`.
- **MCP_WHITELIST_OPERATIONS**, **MCP_BLACKLIST_OPERATIONS**: Control which OpenAPI operations are exposed as tools.
- **TARGET_API_TIMEOUT_MS**: SUN.IO API request timeout (milliseconds).

Configuration priority: command line parameters > environment variables > `config.json`.

## Client Integration

<Tabs>
<TabItem value="Claude Desktop" label="Claude Desktop">

```json
{
  "mcpServers": {
    "sun-mcp-server": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://sun-mcp-server.bankofai.io/mcp"
      ]
    }
  }
}
```

With TronGrid API Key:

```json
{
  "mcpServers": {
    "sun-mcp-server": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://sun-mcp-server.bankofai.io/mcp",
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
claude mcp add --transport http sun-mcp-server https://sun-mcp-server.bankofai.io/mcp
```

Or add `.mcp.json` to the project root:

```json
{
  "mcpServers": {
    "sun-mcp-server": {
      "type": "http",
      "url": "https://sun-mcp-server.bankofai.io/mcp"
    }
  }
}
```

</TabItem>

<TabItem value="HTTP (streamable-http)" label="HTTP (streamable-http)">

When using HTTP transport, requesting the MCP interface requires carrying:

- **Accept**: `application/json, text/event-stream`
- **Content-Type**: `application/json`

Example (tools/call):

```bash
curl -X POST "https://sun-mcp-server.bankofai.io/mcp" \
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