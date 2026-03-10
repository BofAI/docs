import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 官方服务接入
对于仅需要读取区块链数据（不涉及交易）的用户，可以直接连接到官方托管的实例。**注意：官方服务仅提供只读接口，不支持转账或合约写入等操作。**

## 服务信息
| 环境 | URL |
| :--- | :--- |
| 生产环境 | [https://sun-mcp-server.bankofai.io/mcp](https://sun-mcp-server.bankofai.io/mcp)|

- **传输协议**：
  - **stdio**：默认；用于本地 MCP 客户端（如 Claude Desktop、Cursor）。
  - **streamable-http**：HTTP + 服务端推送事件，供远程客户端使用；可配置 host、port、path。
- **模式**：只读（写入工具已禁用）


**安全**：不要在 MCP 配置文件（如 `claude_desktop_config.json` 或 `mcp.json`）中保存私钥或助记词，应在系统或 shell 中通过环境变量设置。


## 客户端集成

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

带 TronGrid API Key：

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

CLI 命令：

```shell
claude mcp add --transport http sun-mcp-server https://sun-mcp-server.bankofai.io/mcp
```

或在项目根目录添加 `.mcp.json`：

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

<TabItem value="HTTP（streamable-http）" label="HTTP（streamable-http）">

使用 HTTP 传输时，请求 MCP 接口需携带：

- **Accept**：`application/json, text/event-stream`
- **Content-Type**：`application/json`

示例（tools/call）：

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







