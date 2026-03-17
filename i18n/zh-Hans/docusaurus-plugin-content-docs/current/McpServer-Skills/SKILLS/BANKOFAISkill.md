# BANK OF AI Skills

BANK OF AI Skills 是一组为 AI 智能体设计的现成技能包，覆盖 TRON 生态的核心 DeFi 场景——DEX 交易、永续合约、链上数据查询、支付协议。每个技能封装了完整的业务工作流：从如何调用 API、按什么顺序执行步骤，到如何处理授权、怎样保护用户资产，全部内置在 `SKILL.md` 和配套脚本中。

你无需编写代码，只需用自然语言告诉 AI 你想做什么，AI 会自动找到对应的技能并执行。

:::warning 使用任何 Skill 之前，请先阅读
BANK OF AI Skills 可以操作**真实的链上资产**。区块链交易一旦上链**不可撤销**——没有"撤销"按钮，没有客服回滚，转错地址的资金无法追回。使用前请牢记三条规则：

1. **私钥永远不要出现在聊天窗口或配置文件中。** 只通过环境变量传递（如 `TRON_PRIVATE_KEY`）。私钥一旦泄露，请立即将资产转移到新钱包。
2. **先测试网，后主网。** 每一个新操作都必须先在 Nile 或 Shasta 测试网上验证，再切换到主网执行。
3. **写操作必须人工确认。** AI 在执行任何链上交易前，应向你展示完整的操作详情并等待你的明确确认。
:::

---

## 可用技能一览

| Skill | 版本 | 功能概述 | 可选凭证 |
| :--- | :--- | :--- | :--- |
| **sunswap** | v2.0.0 | SunSwap DEX 交易——余额、报价、兑换、V2/V3 流动性 | `TRON_PRIVATE_KEY` |
| **sunperp-skill** | v1.0.0 | SunPerp 永续合约——行情、下单、仓位、提现 | `SUNPERP_ACCESS_KEY` + `SUNPERP_SECRET_KEY` |
| **tronscan-skill** | v1.0.0 | TronScan 链上数据查询——账户、交易、代币、区块 | `TRONSCAN_API_KEY` |
| **x402-payment** | v1.4.0 | x402 协议支付——调用付费 API 和付费智能体 | `TRON_PRIVATE_KEY` 或 `EVM_PRIVATE_KEY` |
| **recharge-skill** | v1.1.1 | BANK OF AI 余额查询、订单记录、通过 MCP 充值 | `BANKOFAI_API_KEY` |

---

## 安装

最简单的安装方式是使用 **OpenClaw Extension**——一键安装所有组件，自动配置技能目录，AI 开箱即用：

```bash
# 方式一：直接运行（适合信任来源）
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash

# 方式二：先检查脚本再运行（推荐）
git clone https://github.com/BofAI/openclaw-extension.git
cd openclaw-extension
./install.sh
```

安装完成后，技能会被放置到 `~/.openclaw/skills/` 目录，OpenClaw 自动发现并加载。

安装后验证技能是否就绪：

```bash
ls ~/.openclaw/skills
```

你应该能看到 `sunswap`、`sunperp-skill`、`tronscan-skill`、`x402-payment`、`recharge-skill` 等目录。

### 其他平台安装

如果你使用 Claude Code、Cursor 或其他支持 Skills 的 AI 工具，也可以手动安装：

**Claude Code：**

```bash
git clone https://github.com/BofAI/skills.git /tmp/bofai-skills
mkdir -p ~/.config/claude-code/skills
cp -r /tmp/bofai-skills/* ~/.config/claude-code/skills/
```

Claude Code 启动时会自动加载这些技能。

**Cursor：**

```bash
# 克隆到项目根目录
git clone https://github.com/BofAI/skills.git .cursor/skills
```

在 Cursor Chat 中，使用 `@` 符号引用特定 `SKILL.md` 文件提供上下文，或将技能路径添加到 `.cursorrules`。

**通用方式（任何 AI 工具）：**

```bash
git clone https://github.com/BofAI/skills.git ~/bofai-skills
```

然后在对话中显式告诉 AI 读取某个技能文件：

```
请阅读 ~/bofai-skills/sunswap/SKILL.md，帮我查询 TRX 当前价格。
```

---

## 验证安装结果

安装完成后，从只读操作开始是最好的起点——不需要私钥，零风险，适合熟悉技能的工作方式。

在客户端输入：

```
100 USDT 在 SunSwap 上能换多少 TRX？
```

```
帮我查一下 BTC-USDT 永续合约的当前行情。
```

---

## 各技能使用示例

每个示例标注了操作类型：
- 🟢 **只读** — 不产生链上交易，不需要私钥
- ⚠️ **写操作** — 会发起链上交易，执行前需要用户确认

### sunswap

```
# 🟢 查询余额
帮我查看我的 TRX 和 USDT 余额。

# 🟢 查询价格
TRX 现在的价格是多少？

# 🟢 兑换报价
100 USDT 在 SunSwap 上能兑换多少 TRX？

# ⚠️ 执行兑换
在 SunSwap Nile 测试网上把 100 TRX 兑换成 USDT。

# ⚠️ 添加流动性
在 SunSwap V2 的 TRX/USDT 池中添加 100 TRX 和 15 USDT 的流动性。

# 🟢 查看 V3 仓位
帮我查看我当前所有的 SunSwap V3 流动性仓位。

# ⚠️ 收取手续费
帮我收取 V3 仓位 #12345 的手续费奖励。
```

### sunperp-skill

```
# 🟢 查看行情
BTC-USDT 永续合约的当前价格、24h 涨跌幅和资金费率是多少？

# 🟢 查看账户
我的 SunPerp 账户余额和可用保证金是多少？

# 🟢 查看持仓
我当前有哪些未平仓位？显示开仓均价、未实现盈亏和强平价。

# ⚠️ 开仓
以市价在 SunPerp 开 1 张 BTC-USDT 多单，10 倍杠杆，设置 5% 止损。

# ⚠️ 平仓
平掉我所有的 BTC-USDT 仓位。

# ⚠️ 提现
从 SunPerp 提现 10 USDT 到我的链上地址。
```

### tronscan-skill

```
# 🟢 账户查询
帮我查询地址 TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf 的完整账户信息和持仓。

# 🟢 交易查询
查询这笔交易哈希的详情：abc123...

# 🟢 代币信息
显示市值排名前 10 的 TRC20 代币。

# 🟢 全网概览
给我一份 TRON 全网概览：当前 TPS、超级代表数量、账户总数。

# 🟢 转账记录
查询地址 TXX... 最近 20 笔 USDT 转账记录。
```

### x402-payment

```
# ⚠️ 调用付费端点
使用 x402 协议调用这个付费智能体端点：https://api.example.com

# 🟢 查询 Gasfree 状态
帮我查看当前 Gasfree 钱包的状态和可用余额。
```

### recharge-skill

```
# 🟢 查询余额
我的 BANK OF AI 账户还有多少余额？

# 🟢 查询订单
显示我最近的 BANK OF AI 订单记录。

# ⚠️ 充值
给 BANK OF AI 充值 1 USDT。

# ⚠️ 充值（英文）
Recharge 1 USDT to my BANK OF AI account.
```

---

## 推荐学习路径

如果你刚开始使用 BANK OF AI Skills，按这个顺序来会更顺畅：

第一步：只读查询
  → 先用 tronscan-skill 查账户、看交易，熟悉技能的交互方式
  → 用 sunswap 查价格和报价，不执行真实交易

第二步：测试网写操作
  → 在 Nile 测试网执行 swap、添加流动性、开合约
  → 确认 AI 的行为符合预期，确认参数传递正确

第三步：主网小额操作
  → 用少量资金验证完整流程

第四步：主网正式使用
  → 日常操作，根据需要调整参数和技能组合


---

## 下一步

- 想深入了解 Skill 的工作原理？ → [Skills 是什么？](./Intro.md)
- 遇到问题？ → [常见问题](./Faq.md)
- 使用 OpenClaw Extension 安装？ → [OpenClaw Extension 文档](../../Openclaw-extension/Intro.md)
