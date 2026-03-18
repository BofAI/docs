import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 官方云服务接入

## 什么是官方云服务？

官方云服务是由 **BANK OF AI** 托管的 SUN MCP Server 实例，用于为 AI 客户端提供 **SunSwap 链上数据的只读查询能力**。

如果你想让 AI 助手查询 SunSwap 上的代币价格、池子 APY、协议交易量，或者分析某个地址的流动性持仓——这些都是只读操作，通过官方云服务即可完成，不需要在本地安装任何东西，也不需要提供任何钱包凭证。

**官方云服务的核心作用，就是将基础设施工作全部托管。** 你只需要在 AI 客户端的配置中添加一行服务地址，即可开始与 SunSwap 对话。

### 使用官方云服务的主要优点

**1. 无需任何本地安装**

不用安装 Node.js、不用克隆仓库、不用运行构建命令。只需在配置文件中添加一段 JSON，重启 AI 客户端，即可使用。整个过程通常不超过 2 分钟。

**2. 无私钥暴露风险**

由于云服务是只读的，你完全不需要提供任何钱包私钥或助记词。这从根本上消除了密钥泄露的风险。在团队协作场景中尤为方便——任何成员都可以直接接入，不存在密钥分发和管理的问题。

**3. 官方维护与持续升级**

云服务始终运行最新稳定版本，包括 SunSwap 协议更新的适配和 SUN.IO API 的同步。你无需关心版本号，也不需要手动重新构建。

**4. 覆盖大量实用场景**

查询代币价格和兑换报价、分析池子数据和 APY、获取协议统计和历史指标、查看用户流动性持仓——这些日常最常用的 DeFi 数据查询，通过云服务全部可以完成。只有当你需要实际执行兑换或管理流动性时，才需要切换到[本地私有化部署](./LocalPrivatizedDeployment.md)。

> 简单来说：**官方云服务就像 SunSwap 的"只读数据网关"**，AI 客户端只需要知道服务地址，就可以查询 SunSwap 上的一切公开数据。

:::warning 重要说明
官方云服务仅提供**只读访问**。**不支持**代币兑换、添加/移除流动性以及任何其他链上写操作。如需完整功能，请使用[本地私有化部署](./LocalPrivatizedDeployment.md)。
:::

---

## 如何接入官方云服务？

要接入官方云服务，只需在 AI 客户端配置中添加以下 MCP 服务地址：

**`https://sun-mcp-server.bankofai.io/mcp`**

> 注意：这是一个 MCP 协议端点，不是网页地址。在浏览器中直接打开不会显示任何内容。

---

## 客户端配置

<Tabs>
<TabItem value="Claude Desktop" label="Claude Desktop">

配置文件路径：
- **macOS**：`~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**：`%APPDATA%\Claude\claude_desktop_config.json`

**基础配置**：

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

</TabItem>
<TabItem value="Claude Code" label="Claude Code">

**命令行添加**：

```bash
claude mcp add --transport http sun-mcp-server https://sun-mcp-server.bankofai.io/mcp
```

**或在项目根目录添加 `.mcp.json`**：

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
<TabItem value="Cursor" label="Cursor">

在项目根目录添加 `.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "sun-mcp-server": {
      "url": "https://sun-mcp-server.bankofai.io/mcp"
    }
  }
}
```

</TabItem>
<TabItem value="通用 HTTP 调用" label="通用 HTTP 调用">

如果你想将 SUN MCP Server 集成到自己的应用中，可以通过标准 HTTP 请求调用。

**第一步：初始化连接**

```bash
curl -X POST https://sun-mcp-server.bankofai.io/mcp \
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
curl -X POST https://sun-mcp-server.bankofai.io/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-session-id: <your-session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "getPrice",
      "arguments": {"tokenAddress": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}
    },
    "id": 2
  }'
```

**第三步：查看可用工具列表**

```bash
curl -X POST https://sun-mcp-server.bankofai.io/mcp \
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
查一下 SunSwap 上 USDT 和 TRX 的当前价格
```

如果收到正常响应，说明接入成功。

如遇到问题，请先确认：
1. Node.js 版本 >= 20.0.0（运行 `node --version` 检查）
2. 网络能正常访问 `sun-mcp-server.bankofai.io`
3. AI 客户端已完全退出重启（不是刷新）

---

## 可用能力一览

通过官方云服务连接时，可以使用全部**只读**工具，包括：

| 分类 | 示例能力 |
| :--- | :--- |
| **代币价格** | 按地址或符号查询代币实时价格 |
| **兑换报价** | 通过智能路由获取精确输入的最优兑换报价 |
| **代币信息** | 按地址、协议或关键字搜索代币信息 |
| **池子数据** | 池子列表、APY 排行、交易量历史、流动性历史 |
| **持仓查询** | 用户流动性持仓、tick 级别持仓详情 |
| **协议统计** | 交易量、用户数、交易笔数、池子数量历史 |
| **矿池信息** | 矿池列表、矿池交易记录、用户矿池持仓 |
| **合约读取** | 调用任意 TRON 合约的 view/pure 函数 |

完整能力清单请参阅 [完整能力清单](./ToolList.md)。

---

## 下一步

- 需要代币兑换或流动性管理？ → [本地私有化部署](./LocalPrivatizedDeployment.md)
- 想看所有可用工具的详细说明？ → [完整能力清单](./ToolList.md)
