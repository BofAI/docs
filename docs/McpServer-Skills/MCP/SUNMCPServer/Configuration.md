# Configuration

## Environment Variables

**Security**: Do not store private keys or mnemonics in MCP config files (e.g. `claude_desktop_config.json` or `mcp.json`). Set them as environment variables in your OS or shell.

### Network & API

- **TRONGRID_API_KEY** (optional): TronGrid API key for mainnet RPC. Reduces rate limits and improves reliability.
- **TRON_RPC_URL** (optional): Override TRON RPC base URL; replaces default fullNode/solidityNode/eventServer for the chosen network.

### Wallet (for write operations)

**Option 1: Private key**

```bash
export TRON_PRIVATE_KEY="<YOUR_PRIVATE_KEY_HEX>"
```

**Option 2: Mnemonic**

```bash
export TRON_MNEMONIC="word1 word2 ... word12"
export TRON_ACCOUNT_INDEX="0"   # Optional; default 0
```

If neither is set and no Agent Wallet provider is supplied, write tools (transfers, swaps, liquidity) will fail with a “no wallet” error.

### Server & OpenAPI

- **OPENAPI_SPEC_PATH**: Path to OpenAPI spec (default from `config.json`, e.g. `./specs/sunio-open-api.json`).
- **TARGET_API_BASE_URL**: SUN.IO API base URL (default from config, e.g. `https://open.sun.io`).
- **MCP_TRANSPORT**: `stdio` or `streamable-http`.
- **MCP_SERVER_HOST**, **MCP_SERVER_PORT**, **MCP_SERVER_PATH**: Used when transport is `streamable-http`.
- **MCP_WHITELIST_OPERATIONS**, **MCP_BLACKLIST_OPERATIONS**: Filter which OpenAPI operations are exposed as tools.
- **TARGET_API_TIMEOUT_MS**: Request timeout for SUN.IO API calls.

Configuration priority: CLI arguments &gt; environment variables &gt; `config.json`.

## Server Modes

- **stdio** (default): For local MCP clients. Start with `npm start`.
- **streamable-http**: For HTTP/SSE clients. Start with:

  ```bash
  npm start -- --transport streamable-http --host 127.0.0.1 --port 8080 --mcpPath /mcp
  ```

## Client Configuration

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or the equivalent path on your OS:

```json
{
  "mcpServers": {
    "sun-mcp-server": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/sun-mcp-server/dist/src/server.js"],
      "env": {
        "OPENAPI_SPEC_PATH": "/ABSOLUTE/PATH/TO/sun-mcp-server/specs/sunio-open-api.json",
        "TARGET_API_BASE_URL": "https://open.sun.io"
      },
      "enabled": true
    }
  }
}
```

Omit `env` for wallet keys if they are already set in your shell.

### Cursor

Project root `.cursor/mcp.json`:

```json
{
  "servers": [
    {
      "name": "sun-mcp-server",
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/sun-mcp-server/dist/src/server.js"],
      "env": {
        "OPENAPI_SPEC_PATH": "/ABSOLUTE/PATH/TO/sun-mcp-server/specs/sunio-open-api.json",
        "TARGET_API_BASE_URL": "https://open.sun.io"
      }
    }
  ]
}
```

### HTTP (streamable-http)

When using HTTP transport, call the MCP endpoint with:

- **Accept**: `application/json, text/event-stream`
- **Content-Type**: `application/json`

Example (tools/call):

```bash
curl -X POST "http://127.0.0.1:8080/mcp" \
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
