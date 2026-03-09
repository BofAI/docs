# 配置

### 环境变量

**重要安全提示**：为了您的安全，**切勿**将您的私钥或助记词直接保存在 MCP 配置文件（如 `claude_desktop_config.json` 或 `mcp.json`）中。相反，请将它们设置为您操作系统或 shell 配置中的环境变量。

要启用写入操作（转账、合约调用）并确保可靠的 API 访问，您应该配置以下变量。

#### 网络配置

*   `TRONGRID_API_KEY`：(可选) 您的 TronGrid API 密钥。
    *   **原因**：TRON 主网 RPC 具有严格的速率限制。使用 [TronGrid](https://www.trongrid.io/) 的 API 密钥可确保可靠的性能和更高的吞吐量。
    *   **用法**：
        
        ```shell
        export TRONGRID_API_KEY="<YOUR_TRONGRID_API_KEY_HERE>"
        ```
        

#### 钱包配置（使用环境变量）

**选项 1：私钥**

```shell
# 推荐：将其添加到您的 ~/.zshrc 或 ~/.bashrc
export TRON_PRIVATE_KEY="<YOUR_PRIVATE_KEY_HERE>"
```

**选项 2：助记词**

```shell
# 推荐：将其添加到您的 ~/.zshrc 或 ~/.bashrc
export TRON_MNEMONIC="<WORD1> <WORD2> ... <WORD12>"
export TRON_ACCOUNT_INDEX="0" # 可选，默认值：0
```

### 服务器配置

服务器默认以 HTTP 模式在端口 **3001** 上运行。

## 使用

### 本地运行

```shell
# 以 stdio 模式启动（适用于 Claude Desktop/Cursor 等 MCP 客户端）
npm start

# 以 HTTP 模式启动（Streamable HTTP）
npm run start:http

# 以只读模式启动（禁用写入工具）
npm start -- --readonly
```

### 测试

项目包含一个全面的测试套件，包括单元测试和集成测试（使用 Nile 网络）。

```shell
# Lint 检查
npm run lint

# 运行所有测试
npm test

# 运行特定的测试套件
npx vitest tests/core/tools.test.ts              # 工具的单元测试
npx vitest tests/core/services/services.test.ts   # 服务集成（Nile）
npx vitest tests/core/services/agent-wallet.test.ts # Agent-wallet 单元测试
```

### 生产部署

```shell
# 编译并使用 PM2 启动（只读模式）
bash start.sh
```

### 客户端配置

要将此服务器与 Claude Desktop、Cursor 或 Google Antigravity 等 MCP 客户端一起使用，您需要将其添加到您的配置文件中。

#### 1. 找到您的配置文件

| 应用程序 | 操作系统 | 配置路径 |
| :-- | :-- | :-- |
| **Claude Desktop** | macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| | Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Cursor** | 所有 | 项目根目录：`.cursor/mcp.json` |
| **Google Antigravity** | 所有 | `~/.config/antigravity/mcp.json` |
| **Opencode** | 所有 | `~/.config/opencode/mcp.json` |

#### 2. 添加服务器定义

选择以下方法之一将其添加到您的 `mcpServers` 对象中。

**选项 A：快速开始（推荐）** 直接从 npm 运行最新版本。

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": ["-y", "@bankofai/mcp-server-tron"],
      "env": {
        "TRON_PRIVATE_KEY": "YOUR_KEY_HERE (Or set in system env)",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE (Or set in system env)"
      }
    }
  }
}
```

**选项 B：本地开发** 适用于从克隆仓库运行的开发者。

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": ["tsx", "/ABSOLUTE/PATH/TO/mcp-server-tron/src/index.ts"],
      "env": {
        "TRON_PRIVATE_KEY": "YOUR_KEY_HERE (Or set in system env)",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE (Or set in system env)"
      }
    }
  }
}
```

**重要提示**：如果您已在系统环境中设置了这些变量，我们建议省略 `env` 部分。如果您的 MCP 客户端不继承系统变量，请使用占位符或确保配置文件未共享或提交到版本控制。

**选项 C：托管服务（只读）** 直接连接到公共托管实例——无需安装。

**服务地址**：`https://tron-mcp-server.bankofai.io/mcp`
- **传输协议**：Streamable HTTP
- **模式**：只读（写入工具已禁用）

**Claude Desktop**

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

**Claude Code**

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

**通用 HTTP 调用**

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
