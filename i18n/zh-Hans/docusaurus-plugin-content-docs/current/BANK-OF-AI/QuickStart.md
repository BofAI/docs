# 快速开始

想让你的 AI 客户端拥有 BANK OF AI 链上能力，只需**两步**，不到 **1 分钟**：

1. **粘贴安装指令** → AI 自动完成 Skills 安装 + 检查钱包状态，询问是否创建钱包
2. **回复 `A`** → AI 自动创建本地加密钱包

:::tip 本文只覆盖「工具层」这一条路径
**BANK OF AI 的完整产品矩阵不止 Skills**——如需独立使用其他产品或对底层做私有化部署，请分别参考：

- **LLM Service**（模型接入层）：直接使用 BANKOFAI APP 或接入统一 API Gateway → [LLM Service 简介](../llmservice/introduction.md)
- **x402 Payment**（支付协议）：让 AI 自动在链上完成小额付款 → [x402 协议简介](../x402/index.md)
- **8004 Protocol**（身份与信誉）：Agent 链上征信查询 → [8004 协议简介](../8004/general.md)
- **MCP Server 本地私有化部署**：Skills 默认通过 BANK OF AI 官方云端点调用 MCP Server，无需单独安装；若需本地部署，参考 [TRON MCP 本地私有化部署](../McpServer-Skills/MCP/TRONMCPServer/LocalPrivatizedDeployment.md) · [SUN MCP 本地私有化部署](../McpServer-Skills/MCP/SUNMCPServer/LocalPrivatizedDeployment.md) · [BSC MCP 安装](../McpServer-Skills/MCP/BSCMCPServer/Installation.md)
- **SUN CLI**：与 SUN MCP Server 能力对等的命令行工具，面向脚本/自动化/CI-CD 场景 → [SUN CLI 快速开始](../McpServer-Skills/Tools/SUNCli/QuickStart.md)
:::

---

## 第 1 步：粘贴安装指令

### 你输入

打开你正在用的 AI 客户端（OpenClaw / Claude Code / Cursor / Codex 等任意一个），把下面这段指令完整粘贴进去：

```
运行 npx skills add BofAI/skills 安装 BANK OF AI 全部技能，安装完成后使用 bankofai-guide 进行引导后续操作。
注意：请安装到当前 Agent 对应的 skill 目录
```

:::tip 也可以在 Telegram 里发送
如果你已经在 OpenClaw 中配置了 Telegram，同样可以直接在 Telegram 对话窗口中发送这段指令——效果与在桌面客户端中粘贴完全一致。
:::

### AI 的输出

AI 会自动接管整个流程，依次完成 Skills 安装、调用 `bankofai-guide` 检查环境、输出清单并询问是否创建钱包：

> 好的！我来按照你的要求安装。
>
> 命令进入交互模式，让我选择全部技能：让我使用 `-y` 参数但不使用 `-g`，这样应该能默认选择全部并安装到当前 Agent 目录：
>
> ✅ **11 个 Skills 安装完成！**（安装到当前 Agent skill 目录）
>
> 现在使用 `bankofai-guide` 进行引导...
>
> ───
>
> **📋 Section A — 安装后引导**
> - 步骤 1：安装 Agent Wallet CLI
> - 步骤 2：检查钱包状态
>
> ───
>
> ✅ **Skills 安装完成！**
> 安装位置：`~/.openclaw/workspace/.agents/skills/`（当前 Agent 目录）
>
> | # | Skill 名称 |
> | :-- | :-- |
> | 1 | `agent-wallet` |
> | 2 | `bankofai-guide` |
> | 3 | `multi-sig-account-permissions` |
> | 4 | `recharge-skill` |
> | 5 | `sunperp-perpetual-futures-trading` |
> | 6 | `sunswap-dex-trading` |
> | 7 | `trc20-token-toolkit` |
> | 8 | `tronscan-data-lookup` |
> | 9 | `trx-staking-sr-voting` |
> | 10 | `usdd-just-protocol` |
> | 11 | `x402-payment` |
>
> **📋 当前状态**
>
> | 组件 | 状态 |
> | :-- | :-- |
> | Agent Wallet CLI | ✅ 已安装 |
> | 钱包 | ⚠️ 未配置 |
>
> **💼 钱包设置**
>
> 提示：需要一个钱包来进行转账和交易（如代币兑换、转账、查询余额等）。
>
> **是否立即设置钱包？**
>
> **A. 立即创建（推荐，约 10 秒）**
> - 快速设置，自动生成安全密码
> - 创建后即可使用所有 BankOfAI 功能
>
> **B. 稍后再创建**
> - 可以稍后再次运行 `bankofai-guide` 继续设置
> - 目前只能使用只读查询功能
>
> 请回复 **A** 或 **B**。

---

## 第 2 步：回复 `A`

### 你输入

在 AI 对话框中直接输入：

```
A
```

:::info 如果你选择了 `B`
AI 会跳过钱包创建流程，本步骤到此结束。等你准备好时，随时可以在 AI 对话框里触发**对话式创建**——无需重新运行安装指令。详见 [Agent-Wallet 快速开始 · 方式一：对话式创建](../Agent-Wallet/QuickStart.md)。
:::

### AI 的输出

AI 会自动完成钱包创建的全部步骤，并一次性展示钱包信息、地址、主密码和后续可做的事情：

> 好的！执行快速设置创建钱包。
>
> - 步骤 1：生成安全密码
> - 步骤 2：创建钱包
> - 步骤 3：获取钱包地址
>
> ───
>
> **🎉 钱包创建成功！**
>
> **💼 钱包信息**
>
> | 项目 | 详情 |
> | :-- | :-- |
> | 钱包 ID | `default_local_secure` |
> | 类型 | `local_secure`（本地加密） |
> | 状态 | ✅ 已激活 |
>
> **📍 钱包地址**
>
> | 网络 | 地址 |
> | :-- | :-- |
> | EVM | `0x7858...4bCA` |
> | TRON | `TLwYeH...q8usz` |
>
> 💡 **提示**：EVM 地址可用于所有 EVM 兼容链（Ethereum、BSC、Base、Polygon、Arbitrum 等）。
>
> ───
>
> **🔐 钱包密码**
>
> ```
> <此处会显示你的专属主密码>
> ```
>
> **⚠️ 重要安全提示：**
> - 此密码用于加密本地存储的私钥
> - 进行任何交易、签名、查询地址等操作都需要此密码
> - 密码已自动保存到 `~/.agent-wallet/runtime_secrets.json` 方便使用
> - **请务必备份密码！** 如果 runtime secrets 文件被删除，密码是恢复钱包的唯一方式
>
> ───
>
> **🚀 下一步**
>
> 钱包已准备就绪！你现在可以：
>
> 1. **充值 USDT** → 向 TRON 地址 `TLwYeH...q8usz` 充值 USDT (TRC20)
> 2. **查询余额** → 使用 TronScan 查看 TRX 和代币余额
> 3. **转账/兑换** → 使用 SunSwap 进行代币兑换或转账
>
> **引导完成！🎉**
>
> 需要我帮你查询余额或进行其他操作吗？

:::caution 主密码非常重要，请立即备份
主密码**仅在此处展示一次**。虽然会自动保存到本地的 `~/.agent-wallet/runtime_secrets.json`，但强烈建议你**同时手动保存到密码管理器**（1Password / Bitwarden 等）——一旦本地文件丢失或损坏，且没有外部备份，你的钱包将**永久无法解锁**（没有备份找回机制，没有客服，没有后门）。

⚠️ **切勿**把这个密码发到聊天工具、邮件、截图或公开仓库中。
:::

---

## 验证安装

打开 AI 对话框，发送一句：

```
查一下我当前安装了哪些 BANK OF AI Skills？
```

如果 AI 能列出所有技能包的名称——**恭喜，所有组件已经就位，可以开始使用。**

---

## 典型使用场景

下面这个场景展示 AI 与链上基础设施**通过自然对话**完成复杂任务的完整流程——用户只说一句话，AI 自动调用 Skills 编排流程、Agent Wallet 本地签名、x402 协议结算，返回结构化结果。

### 给 BANK OF AI 充值（x402 自动结算）

**🧑 你：** Buy APIKEY Credits On BANK OF AI With USDT

**🤖 BANK OF AI Agent**（TRON Mainnet）：

> BANK OF AI 通过 **x402** 协议结算 APIKEY 充值。本次充值包为 **10 USDT（TRON 网络）**——我将从你的钱包扣款并写入额度。
>
> ✅ **x402 payment of 10 USDT confirmed on TRON**
>
> Done！你的 APIKEY 余额已更新：
>
> | 项 | 值 |
> | :-- | :-- |
> | Service | BANK OF AI API |
> | Protocol | x402 |
> | Paid | 10 USDT |
> | Credits added | **+500,000** |
> | APIKEY quota | **750,000 credits** |

**🧑 你：** Check My USDT Balance

**🤖：** Your Current Balance: **4,692 USDT**（Mainnet）

**涉及的产品链路**：`recharge-skill` + `x402-payment`（Skills）→ TRON MCP Server → Agent Wallet

:::tip 这个场景说明了什么？
- **自然语言即操作** —— 用户从头到尾没连过钱包、没做任何前端操作
- **Skills 负责编排** —— AI 按 SOP 自动完成付款、签名、额度写入
- **Agent Wallet 负责安全** —— 所有签名在本机离线完成，私钥永不出本机
- **x402 按需介入** —— 涉及付费时由 x402 自动完成"先付款、后响应"
:::

---

## 你还可以做什么？

直接用自然语言描述需求即可：

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
