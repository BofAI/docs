import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 官方云服务接入

## 什么是官方云服务？

官方云服务是由 **BANK OF AI** 托管的 TRON MCP Server 实例，用于为 AI 客户端提供 **TRON 区块链的只读查询能力**。

在传统方式下，如果你想让 AI 助手读取链上数据，通常需要：

- 在本地安装 Node.js 和相关依赖
- 克隆代码仓库并完成构建
- 配置环境变量和网络参数
- 自行维护服务器版本更新

这些准备工作对于"只是想查个余额"的用户来说过于繁重。

**官方云服务的核心作用，就是将这些基础设施工作全部托管。** 你只需要在 AI 客户端的配置中添加一行服务地址，即可开始与 TRON 区块链对话。

### 使用官方云服务的主要优点

**1. 无需任何本地安装**

不用安装 Node.js、不用克隆仓库、不用运行构建命令。只需在配置文件中添加一段 JSON，重启 AI 客户端，即可使用。整个过程通常不超过 2 分钟。

**2. 无私钥暴露风险**

由于云服务是只读的，你完全不需要提供任何钱包私钥或助记词。这从根本上消除了密钥泄露、配置文件被误提交到 Git 等安全隐患。在团队协作场景中尤为方便——任何成员都可以直接接入，不存在密钥分发和管理的问题。

**3. 官方维护与持续升级**

云服务由官方统一维护，始终运行最新稳定版本的 TRON MCP Server。包括：

- 新工具和功能的更新
- 底层 TRON 网络升级的适配
- 性能和稳定性的持续优化

你无需关心版本号，也不需要手动执行 `npm install` 或重新构建。

**4. 覆盖绝大部分真实场景**

日常中最常用的操作——查地址余额、分析交易详情、读取合约状态、查看超级代表列表、监控链上事件——全部属于只读查询，通过云服务就能完整覆盖。只有当你需要实际转移资产（转账、质押、合约写入等）时，才需要切换到[本地私有化部署](./LocalPrivatizedDeployment.md)。

> 简单来说：**官方云服务就像 TRON 区块链的"只读 API 网关"**，AI 客户端只需要知道服务地址，就可以查询链上的一切公开数据。

:::warning 重要说明
官方云服务仅提供**只读访问**。**不支持**转账、合约写入、质押以及任何其他写操作。如需完整功能，请使用[本地私有化部署](./LocalPrivatizedDeployment.md)。
:::

---

## 如何接入官方云服务？

要接入官方云服务，只需要在 AI 客户端配置中添加官方提供的 **MCP 服务地址**：[https://tron-mcp-server.bankofai.io/mcp](https://tron-mcp-server.bankofai.io/mcp)


> 注意：这是一个 MCP 协议端点，不是网页地址。在浏览器中直接打开不会显示任何内容。

官方云服务支持 **两种使用模式**：

| 模式 | 限速 | 说明 |
| :--- |--- |:--- |
| **无 TronGrid API Key（默认）** | 100,000 Requests / Day |即开即用，适合入门体验和低频查询 |
| **带 TronGrid API Key** | 500,000 Requests / Day |更高的请求频率上限，适合频繁查询和生产级使用 |

两种模式的接入方式完全相同，区别仅在于请求频率限制。

---

### 无 TronGrid API Key 模式（默认）

不配置任何 API Key 即可直接使用。适用于：

- 首次体验 TRON MCP Server
- 偶尔查询链上数据
- 教学演示和功能验证

在这种模式下，所有工具均可正常调用，但主网查询在高频场景下可能触发 TronGrid 公共 RPC 的速率限制。

---

### 带 TronGrid API Key 模式（推荐）

如果你需要频繁查询主网数据，建议申请一个免费的 TronGrid API Key 以获得更高的请求频率上限。

**申请步骤：**

1. 访问 [trongrid.io](https://www.trongrid.io/)
2. 注册账号并创建项目
3. 复制生成的 API Key
4. 在配置中添加 API Key 请求头（见下方客户端配置示例）

配置 API Key 后，你的请求会通过 TronGrid 的认证通道，享受更稳定的性能和更高的吞吐量。

---

## 客户端配置

<Tabs>
<TabItem value="Claude Desktop" label="Claude Desktop">

配置文件路径：
- **macOS**：`~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**：`%APPDATA%\Claude\claude_desktop_config.json`

**基础配置（不含 API Key）**：

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

**含 TronGrid API Key 的配置**：

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

将 `<your-api-key>` 替换为你的实际 TronGrid API Key。

</TabItem>
<TabItem value="Claude Code" label="Claude Code">

**命令行添加**：

```bash
claude mcp add --transport http mcp-server-tron https://tron-mcp-server.bankofai.io/mcp
```

**或在项目根目录添加 `.mcp.json`**：

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
<TabItem value="Cursor" label="Cursor">

在项目根目录添加 `.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "url": "https://tron-mcp-server.bankofai.io/mcp"
    }
  }
}
```

</TabItem>
<TabItem value="通用 HTTP 调用" label="通用 HTTP 调用">

如果你想将 TRON MCP Server 集成到自己的应用中，可以通过标准 HTTP 请求调用。

**第一步：初始化连接**

```bash
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

响应中会包含 `mcp-session-id` 请求头，后续请求需要用到它。

**第二步：调用工具**

使用第一步获得的 `mcp-session-id`：

```bash
curl -X POST https://tron-mcp-server.bankofai.io/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-session-id: <your-session-id>" \
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

**第三步：查看可用工具列表**

```bash
curl -X POST https://tron-mcp-server.bankofai.io/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-session-id: <your-session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "params": {},
    "id": 3
  }'
```

:::info Session 管理
- 每次 `initialize` 会创建一个新 Session
- Session 在 30 分钟无活动后自动过期
- 可用 `DELETE /mcp`（携带 `mcp-session-id` 请求头）显式关闭 Session
:::

</TabItem>
</Tabs>

---

## 验证接入是否成功

配置完成后，**完全退出并重启** AI 客户端，然后输入以下测试问法：

```
查询 TRON 主网当前的区块高度
```

如果收到正常响应（例如显示当前区块高度），说明接入成功。

如遇到问题，请查阅[常见问题](./FAQ.md)进行排查。

---

## 可用能力一览

通过官方云服务连接时，可以使用全部**只读**工具，包括但不限于：

| 分类 | 示例能力 |
| :--- | :--- |
| 余额查询 | 查询 TRX 余额、TRC20 代币余额、持仓汇总 |
| 交易查询 | 查询交易详情、收据、资源消耗 |
| 区块数据 | 按区块号、按哈希查询，最新区块，批量查询 |
| 账户信息 | 账户详情、资源情况、委托信息、带宽/能量 |
| 智能合约读取 | 调用 view/pure 函数、获取 ABI、合约元数据 |
| 事件查询 | 按交易、按合约地址、按区块号查询事件 |
| 网络状态 | 链信息、资源价格、支持的网络列表 |
| 治理 | 超级代表列表、提案、奖励查询 |
| 地址工具 | 格式转换、地址验证 |

完整能力清单请参阅 [完整能力清单](./ToolList.md)。

---

## 下一步

- 需要转账、质押或合约写入？ → [本地私有化部署](./LocalPrivatizedDeployment.md)
- 想看所有 95 个工具的详细说明？ → [完整能力清单](./ToolList.md)

