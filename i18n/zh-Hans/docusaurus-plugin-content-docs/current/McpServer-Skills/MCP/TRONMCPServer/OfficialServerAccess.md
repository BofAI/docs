import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 官方服务接入
对于仅需要读取区块链数据（不涉及交易）的用户，可以直接连接到官方托管的实例。**注意：官方服务仅提供只读接口，不支持转账或合约写入等操作。**

## 服务信息
| 环境 | URL |
| :--- | :--- |
| 生产环境 | [https://tron-mcp-server.bankofai.io/mcp](https://tron-mcp-server.bankofai.io/mcp)  |

- **传输协议**：Streamable HTTP
- **模式**：只读（写入工具已禁用）

**重要安全提示**：为了您的安全，**切勿**将您的私钥或助记词直接保存在 MCP 配置文件（如 `claude_desktop_config.json` 或 `mcp.json`）中。相反，请将它们设置为您操作系统或 shell 配置中的环境变量。    

## 客户端集成

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

带 TronGrid API Key：

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
<TabItem value="Claude Code" label="Claude Code">

CLI 命令：

```shell
claude mcp add --transport http mcp-server-tron https://tron-mcp-server.bankofai.io/mcp
```

或在项目根目录添加 `.mcp.json`：

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

<TabItem value="通用 HTTP 调用" label="通用 HTTP 调用">

初始化连接：

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

调用工具（使用初始化响应中的 `mcp-session-id`）：

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

