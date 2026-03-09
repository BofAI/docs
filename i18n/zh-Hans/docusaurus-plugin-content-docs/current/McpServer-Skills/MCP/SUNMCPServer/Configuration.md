# 配置

## 环境变量

**安全**：不要在 MCP 配置文件（如 `claude_desktop_config.json` 或 `mcp.json`）中保存私钥或助记词，应在系统或 shell 中通过环境变量设置。

### 网络与 API

- **TRONGRID_API_KEY**（可选）：主网 RPC 使用的 TronGrid API Key，可降低限流、提高稳定性。
- **TRON_RPC_URL**（可选）：覆盖 TRON RPC 基础地址；设置后替代当前网络的默认 fullNode/solidityNode/eventServer。

### 钱包（写操作）

**方式一：私钥**

```bash
export TRON_PRIVATE_KEY="<你的私钥十六进制>"
```

**方式二：助记词**

```bash
export TRON_MNEMONIC="词1 词2 ... 词12"
export TRON_ACCOUNT_INDEX="0"   # 可选，默认 0
```

若两者都未设置且未提供 Agent Wallet 提供方，写类工具（转账、兑换、流动性）将报“无可用钱包”错误。

### 服务与 OpenAPI

- **OPENAPI_SPEC_PATH**：OpenAPI 规范路径（默认来自 `config.json`，如 `./specs/sunio-open-api.json`）。
- **TARGET_API_BASE_URL**：SUN.IO API 基础 URL（默认来自 config，如 `https://open.sun.io`）。
- **MCP_TRANSPORT**：`stdio` 或 `streamable-http`。
- **MCP_SERVER_HOST**、**MCP_SERVER_PORT**、**MCP_SERVER_PATH**：在 transport 为 `streamable-http` 时使用。
- **MCP_WHITELIST_OPERATIONS**、**MCP_BLACKLIST_OPERATIONS**：控制将哪些 OpenAPI 操作暴露为工具。
- **TARGET_API_TIMEOUT_MS**：SUN.IO API 请求超时（毫秒）。

配置优先级：命令行参数 &gt; 环境变量 &gt; `config.json`。

## 服务模式

- **stdio**（默认）：供本地 MCP 客户端使用。使用 `npm start` 启动。
- **streamable-http**：供 HTTP/SSE 客户端使用。启动示例：

  ```bash
  npm start -- --transport streamable-http --host 127.0.0.1 --port 8080 --mcpPath /mcp
  ```

## 客户端配置

### Claude Desktop

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）或您系统下的等效路径：

```json
{
  "mcpServers": {
    "sun-mcp-server": {
      "command": "node",
      "args": ["/sun-mcp-server 的绝对路径/dist/src/server.js"],
      "env": {
        "OPENAPI_SPEC_PATH": "/sun-mcp-server 的绝对路径/specs/sunio-open-api.json",
        "TARGET_API_BASE_URL": "https://open.sun.io"
      },
      "enabled": true
    }
  }
}
```

若已在 shell 中配置钱包相关环境变量，可省略 `env` 中的私钥/助记词。

### Cursor

在项目根目录的 `.cursor/mcp.json` 中配置：

```json
{
  "servers": [
    {
      "name": "sun-mcp-server",
      "command": "node",
      "args": ["/sun-mcp-server 的绝对路径/dist/src/server.js"],
      "env": {
        "OPENAPI_SPEC_PATH": "/sun-mcp-server 的绝对路径/specs/sunio-open-api.json",
        "TARGET_API_BASE_URL": "https://open.sun.io"
      }
    }
  ]
}
```

### HTTP（streamable-http）

使用 HTTP 传输时，请求 MCP 接口需携带：

- **Accept**：`application/json, text/event-stream`
- **Content-Type**：`application/json`

示例（tools/call）：

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
