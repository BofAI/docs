# 快速开始

只需 **1 句话**，不到 **1 分钟**，整套 BANK OF AI 自动安装到你的电脑上——Agent-Wallet、MCP Server、Skills 全部就位，9 个主流 AI 客户端同步配置完成。

:::tip 你不需要做的事情
- ❌ 无需手动 `npm install` 多个依赖
- ❌ 无需分别安装 Agent-Wallet / Skills / MCP Server
- ❌ 无需逐个配置 Cursor / Claude Code / VS Code
- ❌ 无需了解任何技术细节
:::

---

## 唯一的一步：对你的 AI 说一句话

打开你正在用的 AI 客户端（OpenClaw / Claude Code / Cursor / Codex 等任意一个），把下面这句话发给它：

```
agent 一键安装
```

按下回车，**你的操作到此为止。**

接下来 AI 会自动接管整个安装流程，全程无需你介入——你只需要观察整个过程逐步完成。

安装完成后，AI 会输出一份"已安装组件"清单，确认全部就位：

```
🎉 Agent 一键安装完成！
✅ 已安装组件
```

| 组件 | 状态 | 位置 |
| :--- | :--- | :--- |
| BankOfAI Skills | ✅ 已安装 | `~/.agents/skills/` |
| Agent Wallet CLI | ✅ 已安装 | 全局 npm |
| TRON MCP Server | ✅ 已安装 | 9 个 Agents |
| SUN MCP Server | ✅ 已安装 | 9 个 Agents |

---

## AI 在背后完成了什么？

为了让你对整个过程有清晰的了解，下面是 AI 在这 1 分钟内替你完成的所有工作：

### 第 1 步：安装 BANK OF AI Skills

```
✅ BankOfAI Skills 安装成功！
```

| Skill | 功能 |
| :--- | :--- |
| `agent-wallet` | 钱包管理 |
| `bankofai-guide` | 引导指南 |
| `multi-sig-account-permissions` | TRON 多签 |
| `recharge-skill` | BANK OF AI 充值 |
| `sunperp-perpetual-futures-trading` | SunPerp 期货 |
| `sunswap-dex-trading` | SunSwap DEX |
| `trc20-token-toolkit` | TRC20 工具 |
| `tronscan-data-lookup` | TronScan 查询 |
| `trx-staking-sr-voting` | TRX 质押投票 |
| `usdd-just-protocol` | USDD/JUST 协议 |
| `x402-payment` | x402 支付 |

### 第 2 步：安装 Agent Wallet CLI 和 MCP Servers

```
现在安装 Agent Wallet CLI 和 MCP Servers...
```

Agent Wallet CLI 全局安装到 npm，TRON MCP Server 和 SUN MCP Server 接入到所有可用的 AI 客户端。

### 第 3 步：自动创建本地加密钱包

```
🧰 钱包信息
```

| 项目 | 详情 |
| :--- | :--- |
| 钱包 ID | `default_local_secure` |
| 类型 | `local_secure` |
| 状态 | ✅ 已激活 |

| 网络 | 地址 |
| :--- | :--- |
| EVM | `0x1339...8366` |
| TRON | `TBisAp...FLceY` |

紧接着，AI 会在终端**仅这一次**展示你的专属**主密码**：

```
🔒 钱包密码
<此处会显示你的专属主密码>
⚠️ 密码已自动保存到 ~/.agent-wallet/runtime_secrets.json，请妥善备份！
```

:::caution 主密码非常重要，请立即妥善备份
主密码是解锁你私钥的**唯一凭证**。安装器会做两件事：
1. **自动保存到本地文件** `~/.agent-wallet/runtime_secrets.json`，方便后续工具直接读取
2. **在终端明文展示一次**——你需要立即把它复制下来

强烈建议你**同时手动保存到密码管理器**（1Password / Bitwarden 等）——一旦本地文件丢失或损坏，且没有外部备份，你的钱包将**永久无法解锁**（没有备份找回机制，没有客服，没有后门）。

⚠️ **切勿**把这个密码发到聊天工具、邮件、截图或公开仓库中。
:::

### 第 4 步：配置 MCP Servers

```
🔧 MCP Servers
```

| Server | URL | 状态 |
| :--- | :--- | :--- |
| TRON MCP | `https://tron-mcp-server.bankofai.io/mcp` | ✅ |
| SUN MCP | `https://sun-mcp-server.bankofai.io/mcp` | ✅ |

:::info 默认接入官方云服务
上面两个 URL 是 BANK OF AI 提供的**官方云服务端点**，开箱即用，无需自行部署。如果你需要本地私有化部署（例如对数据隔离有更高要求），请参考 [TRON MCP 本地私有化部署](../McpServer-Skills/MCP/TRONMCPServer/LocalPrivatizedDeployment.md) 和 [SUN MCP 本地私有化部署](../McpServer-Skills/MCP/SUNMCPServer/LocalPrivatizedDeployment.md)。
:::

### 第 5 步：批量同步到所有 AI 客户端

**已配置到 9 个 Agents：** Claude Code、Codex、Cursor、Gemini CLI、GitHub Copilot CLI、MCPorter、OpenCode、VS Code、Zed

只要其中任何一个已安装在你的电脑上，都会被自动完成配置——打开即可使用，无需再单独设置。

---

## 安装完成后，你可以做什么？

所有组件就位后，你的 AI 立刻获得了以下能力——直接用自然语言描述需求即可：

### 🔍 链上数据查询（完全免费）

> "查一下我钱包地址的 TRX 和 USDT 余额。"

> "查看这笔交易 abc123... 的执行结果。"

> "当前 TRON 全网 TPS 是多少？"

### 💸 TRC20 代币转账

> "帮我转 10 USDT 到 TRecipientAddress... 这个地址。"

### 🔁 SunSwap 兑换

> "在 Nile 测试网上把 100 TRX 换成 USDT，滑点 1%。"

### 📈 SunPerp 期货交易

> "用 5 倍杠杆开一张 BTC-USDT 的多单，亏损 5% 自动止损。"

### 🗳️ TRX 质押投票

> "把我的 1000 TRX 质押给超级代表 SR XXX。"

### 💰 给 BANK OF AI 充值

> "查看我的 BANK OF AI 账户余额，并充值 5 USDT。"

---

## 验证安装

打开 AI 对话框，发送一句：

```
查一下我当前安装了哪些 BANK OF AI Skills？
```

如果 AI 能列出所有技能包的名称——**恭喜，所有组件已经就位，可以开始使用。**

---

## 新手三条铁律

:::warning 链上交易不可逆，请牢记以下三条
1. **务必先在测试网验证。** 在 Nile 测试网上先执行 1-2 笔测试交易，确认 AI 行为完全符合预期后，再切换到主网。
2. **每一笔花费操作前，请仔细核对 AI 给出的账单。**
3. **从小额开始。** 即便是已经测试过的操作，首次在主网执行时也建议使用小额资金验证。
:::

---

## 下一步

| 我想… | 去这里 |
| :--- | :--- |
| 了解整体架构 | [BANK OF AI 简介](./Intro.md) |
| 深入了解某个组件 | [Agent-Wallet](../Agent-Wallet/Intro.md) · [MCP Server](../McpServer-Skills/MCP/Intro.md) · [Skills](../McpServer-Skills/SKILLS/Intro.md) · [x402](../x402/index.md) · [8004](../8004/general.md) · [LLM Service](../llmservice/introduction.md) |
