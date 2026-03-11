import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 本地私有化部署

如果您需要执行转账、合约调用等写操作，必须在本地部署服务器。本地部署允许您安全地配置私钥，从而启用完整的交易功能。

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

## 安装
1.  **克隆并进入目录**：
    ```shell
    git clone https://github.com/BofAI/sun-mcp-server.git
    cd sun-mcp-server
    ```
2.  **安装与构建**：
    ```shell
    npm install && npm run build
    ```


## 验证
默认 stdio 模式：
```bash
# 运行测试
npm test

# 启动服务（stdio）
npm start
```

使用 HTTP（streamable-http）模式时：

```bash
npm start -- --transport streamable-http --host 127.0.0.1 --port 8080 --mcpPath /mcp
```


## 客户端集成
要将此服务器与 Claude Desktop、Cursor 等 MCP 客户端一起使用，您需要将其添加到您的配置文件中。
<Tabs>
<TabItem value="Claude Desktop" label="Claude Desktop">

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json` （macOS）或您系统下的等效路径：

```json
{
  "mcpServers": {
    "sun-mcp-server": {
      "command": "node",
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

若已在 shell 中配置钱包相关环境变量，可省略 `env` 中的私钥/助记词。



</TabItem>
<TabItem value="Cursor" label="Cursor">

在项目根目录的 `.cursor/mcp.json` 中配置：

```json
{
  "servers": [
    {
      "name": "sun-mcp-server",
      "command": "node",
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

<TabItem value="HTTP（streamable-http）" label="HTTP（streamable-http）">

使用 HTTP 传输时，请求 MCP 接口需携带：

- **Accept**：`application/json, text/event-stream`
- **Content-Type**：`application/json`

示例（tools/call）：

```bash
curl -X POST "您本地的 MCP URL" \
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