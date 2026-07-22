---
title: '简介'
description: >-
  BANK OF AI 是连接 AI 与 Web3 的基础设施。装上它，你的 AI 就能付款、验证身份、执行链上操作——你负责说想做什么，AI 负责做成。
---

# 简介

今天的 AI 已经会写代码、分析数据、制作演示文稿，甚至能独立完成一个完整的软件项目。

但如果你告诉它：

> 帮我把 100 USDT 换成 TRX。

它却什么也做不了。问题不在于它不知道怎么做，而在于——**它没有进入 Web3**。

---

## 它缺了什么？

要进入 Web3，AI 缺少四种关键能力：

- 💸 **支付能力** —— 调用付费服务时，无法付款
- 🪪 **身份能力** —— 链上无法证明自己是谁
- ⚙️ **执行能力** —— 连不上区块链，操作落不了地
- 🔐 **钱包能力** —— 拿不住资产，签不了名

模型解决的是"想清楚"，而这四种能力解决的是"干得成"。补齐它们，正是 BANK OF AI 存在的意义。

---

## BANK OF AI 是什么？

> **BANK OF AI 是连接 AI 与 Web3 的基础设施。**

它不是新的大模型，不是钱包应用，也不是交易所。它安装在你已经在使用的 AI 客户端中（如 OpenClaw、Claude Code、Cursor、Codex 等），为 AI 补齐进入 Web3 所需的能力，而无需改变你原本的使用方式。

装完之后，AI 就从"只会给建议"变成了"能把事办成"。具体多了哪些本事，往下看。

---

## 装上之后，AI 多了四项能力

<div className="intro-cards">

<div className="intro-card">

<div className="intro-card-title">💸 支付</div>

AI 能自动支付 API 与 Agent 服务费用——花钱前先经你确认。

<div className="intro-card-links">

[x402](../x402/index.md)

</div>

</div>

<div className="intro-card">

<div className="intro-card-title">⚙️ 执行</div>

AI 能按标准流程完成转账、Swap、Stake 等链上任务。

<div className="intro-card-links">

[Skills](../McpServer-Skills/SKILLS/Intro.md) · [MCP Server](../McpServer-Skills/MCP/Intro.md)

</div>

</div>

<div className="intro-card">

<div className="intro-card-title">🔐 钱包</div>

AI 能安全完成签名——私钥永不离开你的设备。

<div className="intro-card-links">

[Agent Wallet](../Agent-Wallet/Intro.md)

</div>

</div>

<div className="intro-card">

<div className="intro-card-title">🪪 身份</div>

AI 拥有可验证的链上身份，Agent 之间可以互信协作。

<div className="intro-card-links">

[8004](../8004/general.md)

</div>

</div>

</div>

至于推理能力，AI 本来就已经具备。BANK OF AI 不会替换你的模型，而是让你可以在 GPT、Claude、Gemini 等模型之间自由切换，并结合 Web3 能力完成实际任务（[LLM Service](../llmservice/introduction.md)）。

这些产品名现在不用记，也不需要学习任何新的命令或工具。你只需要像聊天一样，告诉 AI 你想完成什么：

> **你负责说想做什么，AI 负责做成。**

下面通过一个真实示例，看看这套能力是如何协同工作的。

---

## 一次真实的执行

假设装好之后，你对 AI 说：

> 把 100 USDT 换成 TRX，滑点不超过 1%。

整条链路一目了然：

```text
用户
 ↓
AI 理解需求
 ↓
选择 Skill 或调用 MCP Server
 ↓
Agent Wallet 签名
 ↓
广播交易
 ↓
区块链
 ↓
返回结果
```

执行过程中，任何一步出现问题（余额不足、地址有误），AI 都会立即停下并说明原因；任何涉及资金支出的动作，都必须先经过你的确认。

---

## 整体架构

把上面那条链路抽象成一张图，就是 BANK OF AI 的全部：

```text
    AI
    │
BANK OF AI
    │
   Web3
```

内部分为四层，每层只负责一件事：

| 层 | 一句话职责 |
| :-- | :-- |
| 🧠 模型层 | 给 AI 提供推理能力，模型随选 |
| 🛤️ 协议层 | 定好规矩：怎么付钱、怎么证明身份 |
| 🔧 工具层 | 负责执行：流程、工具、签名 |
| 🌐 生态层 | 用同一套标准接入各链的第三方服务 |

每一层都可以独立使用，也可以组合成完整的平台。后续章节会分别介绍每一层的设计理念和使用方式，现在只需要建立整体认知即可。

---

## 想深入某个部分？

| 你想了解 | 去这里 |
| :-- | :-- |
| AI 怎么用多个大模型 | [LLM Service](../llmservice/introduction.md) |
| AI 怎么自动付款 | [x402 支付协议](../x402/index.md) |
| AI 的链上身份和信誉 | [8004 协议](../8004/general.md) |
| 私钥怎么保管、签名怎么完成 | [Agent Wallet](../Agent-Wallet/Intro.md) |
| AI 按什么流程执行操作 | [Skills](../McpServer-Skills/SKILLS/Intro.md) |
| AI 怎么调用链上工具 | [MCP Server](../McpServer-Skills/MCP/Intro.md) |

---

## 现在，轮到你了

到这里，你已经清楚 BANK OF AI 是什么、为什么存在、以及它如何工作。剩下的只有一步：亲手试一次。

安装只需大约一分钟：粘贴一段安装指令，然后确认创建钱包。完成后，你就可以对 AI 说出第一句链上指令：

> 帮我查一下钱包余额。

从这一刻起，你的 AI 就拥有了 Web3 能力——之后的所有操作，都可以直接用自然语言完成。

无论是查询资产、执行交易，还是调用链上服务，你都只需要描述目标，剩下的交给 AI。

👉 **[前往快速开始](./QuickStart.md)**
