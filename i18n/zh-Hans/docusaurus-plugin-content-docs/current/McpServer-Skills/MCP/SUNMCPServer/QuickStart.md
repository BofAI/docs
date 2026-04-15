# 快速开始

这个页面的目标很简单：**让你在 1 分钟内完成接入，发起第一次 DeFi 查询。**

我们会使用[官方云服务](./OfficialServerAccess.md)来完成这次快速体验。云服务是只读的，无需钱包，立即可用。

---

## 准备工作

在开始之前，请确保你已经有：

1. **Node.js** >= 20.0.0（[下载链接](https://nodejs.org/)）
2. **MCP 客户端**：所有支持 MCP 的 AI 客户端。

---

## 安装

最简单的安装方式是**直接在 AI Agent 对话框里让 AI 完成**——不用自己打开终端，不用手动复制文件。如果你已经在使用支持 shell 命令的 AI Agent（OpenClaw、Telegram Bot、Web 聊天页面、Claude Code、Cursor 等），这一步即可搞定。

:::tip 前置依赖
**需要在 AI Agent 运行的机器上安装 Node.js**（Agent 内部会调用 `npx`）。如果还没装，去 [nodejs.org](https://nodejs.org) 下载 LTS 安装包，双击按提示装一次即可，后续无需再操作。
:::

**操作步骤：**

1. 打开你的 AI Agent 对话框
2. 复制下面这段 prompt 发送给 AI：

   ```
   运行 npx add-mcp https://sun-mcp-server.bankofai.io/mcp -y 安装 SUN MCP Server。
   注意：请安装到当前 Agent 对应的 MCP 配置中。
   ```

3. AI 会自动完成以下流程（无需人工干预）：
   - 识别远程 MCP 服务地址
   - 自动检测当前正在使用的 AI 客户端
   - 把 `sun-mcp-server` 配置写入对应的 MCP 配置文件（无需手动改 JSON）
   - 完成后给出 ✅ 确认信息

AI 给出 ✅ 确认后，SUN MCP Server 就已就位，可以直接开始提问。

:::tip 想用命令行？
如果你更习惯自己跑命令或需要更精细的控制（比如手动选择要安装到哪些 AI 工具），请参阅[官方云服务接入](./OfficialServerAccess.md)里的命令行和交互式安装方式。
:::

---

## 试用一下

在对话中尝试以下查询：

```
查一下 SunSwap 上 USDT 和 TRX 的当前价格
```

:::info 关于云服务
我们提供的官方云服务是**只读的**，适合查询数据和分析。如果你需要执行链上交易、部署合约等写操作，请查看[本地私有化部署](./LocalPrivatizedDeployment.md)。
:::

---

## 继续探索

以下是一些常见的 DeFi 查询示例：

| 操作 | 示例提示 |
|------|--------|
| **价格查询** | 查询 USDT/TRX 的实时价格 |
| **流动性池数据** | 获取 SunSwap 中 TRX-USDC 交易对的池信息 |
| **头寸查询** | 查看地址 TR... 在 SunSwap 中的所有流动性头寸 |
| **交易报价** | 获取交换 1000 USDT 为 TRX 的报价 |
| **协议统计** | 获取 SunSwap 的 TVL、24 小时交易量等统计数据 |

---

## 下一步

- **[本地私有化部署](./LocalPrivatizedDeployment.md)** - 学习如何在本地运行 SUN MCP Server 并进行写操作
- **[官方服务器访问](./OfficialServerAccess.md)** - 了解官方云服务的详细信息
- **[完成能力清单](./ToolList.md)** - 查看所有可用的工具和功能

---

祝你使用愉快！如有问题，欢迎反馈。
