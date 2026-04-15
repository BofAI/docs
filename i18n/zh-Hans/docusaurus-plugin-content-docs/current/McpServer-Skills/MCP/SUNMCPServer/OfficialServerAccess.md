# 官方云服务接入

## 什么是官方云服务？

官方云服务是由 **BANK OF AI** 托管的 SUN MCP Server 实例，用于为 AI 客户端提供 **SunSwap 链上数据的只读查询能力**。

如果你想让 AI 助手查询 SunSwap 上的代币价格、池子 APY、协议交易量，或者分析某个地址的流动性持仓——这些都是只读操作，通过官方云服务即可完成，不需要提供任何钱包凭证。

**官方云服务的核心作用，就是将基础设施工作全部托管。** 你只需要在 AI 客户端的配置中添加一行服务地址，即可开始与 SunSwap 对话。

### 使用官方云服务的主要优点

**1. 无私钥暴露风险**

由于云服务是只读的，你完全不需要提供任何钱包私钥或助记词。这从根本上消除了密钥泄露的风险。在团队协作场景中尤为方便——任何成员都可以直接接入，不存在密钥分发和管理的问题。

**2. 官方维护与持续升级**

云服务始终运行最新稳定版本，包括 SunSwap 协议更新的适配和 SUN.IO API 的同步。你无需关心版本号，也不需要手动重新构建。

**3. 覆盖大量实用场景**

查询代币价格和兑换报价、分析池子数据和 APY、获取协议统计和历史指标、查看用户流动性持仓——这些日常最常用的 DeFi 数据查询，通过云服务全部可以完成。只有当你需要实际执行兑换或管理流动性时，才需要切换到[本地私有化部署](./LocalPrivatizedDeployment.md)。

> 简单来说：**官方云服务就像 SunSwap 的"只读数据网关"**，AI 客户端只需要知道服务地址，就可以查询 SunSwap 上的一切公开数据。

:::warning 重要说明
官方云服务仅提供**只读访问**。**不支持**代币兑换、添加/移除流动性以及任何其他链上写操作。如需完整功能，请使用[本地私有化部署](./LocalPrivatizedDeployment.md)。
:::

---

## 如何接入官方云服务？

我们提供了三种安装方式。**根据你的使用习惯选一种即可**——对话式安装最简单；交互式安装控制最精细。

### 方式一：对话式安装（最简单）

如果你已经在使用支持 shell 命令的 AI Agent（OpenClaw、Telegram Bot、Web 聊天页面、Claude Code、Cursor 等），你可以**直接在对话框里让 AI 完成安装**——不用自己打开终端，不用手动复制文件。

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

:::tip 这是新手最推荐的路径
你不需要懂 `npx`、`npm` 是什么，也不用关心 MCP 配置文件在哪里。AI 会处理每一步，包括为你的客户端选对配置文件路径。
:::

### 方式二：一键自动安装（命令行）

如果你已经装好 Node.js 并习惯使用命令行，直接在终端运行以下命令：

```bash
npx add-mcp https://sun-mcp-server.bankofai.io/mcp -y
```

`-y` 参数会跳过所有交互选择，自动安装到你电脑上检测到的所有 AI 工具中。安装完成后会显示 ✅ 安装完成！以及安装到了哪些 Agent。

安装完成后，即可使用 SUN MCP Server 开始与 SunSwap 交互。

### 方式三：交互式安装（最精细控制）

如果你想手动选择安装到哪些 AI 工具，去掉 `-y` 参数即可：

```bash
npx add-mcp https://sun-mcp-server.bankofai.io/mcp
```

:::tip 提示
本文档以在终端中运行命令为例展示安装过程。
:::

#### 安装过程详解

安装器会引导你完成以下几步，照着做就行：

**1️⃣ 识别服务来源**

安装器会自动识别远程 MCP 服务地址，并为其生成服务名称：

```
◇  Source: https://sun-mcp-server.bankofai.io/mcp (remote)
│
●  Server name: sun-mcp-server
```

**2️⃣ 选择要安装到哪些 AI 工具**

安装器会自动检测你电脑上装了哪些 AI 工具（如 Claude Code、Cursor、Cline 等），用空格键勾选你要用的：

```
◇  Detected 1 agent
│
◇  Select agents to install to
│  Claude Code
```

**3️⃣ 确认安装信息**

安装器会展示安装摘要，确认无误后选择 `Yes` 开始安装：

```
◇  Installation Summary ───╮
│                          │
│  Server: sun-mcp-server  │
│  Type: remote            │
│  Scope: Project          │
│  Agents: Claude Code     │
│                          │
├──────────────────────────╯
│
◇  Proceed with installation?
│  Yes
```

**4️⃣ 安装完成！**

看到类似以下输出，说明 SUN MCP Server 已经成功安装到你选择的 AI 工具中：

```
◇  Installation complete
│
◇  Installed to 1 agent ───────╮
│                              │
│  ✓ Claude Code: ~/.mcp.json  │
│                              │
├──────────────────────────────╯
│
└  Done!
```

安装完成后，即可使用 SUN MCP Server 开始与 SunSwap 交互。

---

## 验证接入是否成功

接入完成后，你可以直接向 AI Agent 提出以下问题来测试：

```
查一下 SunSwap 上 USDT 和 TRX 的当前价格
```

如果收到正常响应，说明接入成功。

如遇到问题，请先确认：
1. Node.js 版本 >= 20.0.0（运行 `node --version` 检查）
2. 网络能正常访问 `sun-mcp-server.bankofai.io`

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
