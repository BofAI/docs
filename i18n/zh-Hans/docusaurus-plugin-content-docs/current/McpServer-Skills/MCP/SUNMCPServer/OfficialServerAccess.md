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

## 环境要求
- **Node.js** 20.0.0 或更高。
- **npm**（或兼容的包管理器）。
- 可选：**TronGrid API Key**，用于主网更高限流与稳定性。

## 关键配置（环境变量）

**安全**：不要在 MCP 配置文件（如 `claude_desktop_config.json` 或 `mcp.json`）中保存私钥或助记词，应在系统或 shell 中通过环境变量设置。

### 1. 网络与 API

- **TRONGRID_API_KEY**（可选）：主网 RPC 使用的 TronGrid API Key，可降低限流、提高稳定性。
- **TRON_RPC_URL**（可选）：覆盖 TRON RPC 基础地址；设置后替代当前网络的默认 fullNode/solidityNode/eventServer。

### 2. 钱包（写操作）

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

### 3. 服务与 OpenAPI

- **OPENAPI_SPEC_PATH**：OpenAPI 规范路径（默认来自 `config.json`，如 `./specs/sunio-open-api.json`）。
- **TARGET_API_BASE_URL**：SUN.IO API 基础 URL（默认来自 config，如 `https://open.sun.io`）。
- **MCP_TRANSPORT**：`stdio` 或 `streamable-http`。
- **MCP_SERVER_HOST**、**MCP_SERVER_PORT**、**MCP_SERVER_PATH**：在 transport 为 `streamable-http` 时使用。
- **MCP_WHITELIST_OPERATIONS**、**MCP_BLACKLIST_OPERATIONS**：控制将哪些 OpenAPI 操作暴露为工具。
- **TARGET_API_TIMEOUT_MS**：SUN.IO API 请求超时（毫秒）。

配置优先级：命令行参数 &gt; 环境变量 &gt; `config.json`。

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







