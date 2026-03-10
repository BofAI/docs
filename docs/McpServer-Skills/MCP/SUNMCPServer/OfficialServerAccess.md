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

**Security**: Do not save private keys or mnemonics in MCP configuration files (such as `claude_desktop_config.json` or `mcp.json`), they should be set through environment variables in the system or shell.


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