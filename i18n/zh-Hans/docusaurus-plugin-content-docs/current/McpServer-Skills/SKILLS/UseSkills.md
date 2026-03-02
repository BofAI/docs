# 使用 SKILLS

Skills 支持集成至 OpenClaw、ClawdCode、OpenCode 等多种 AI Agents。本文以 OpenClaw 为例说明如何使用 skills。
在开始前，请确保您已完成 OpenClaw 的安装，并下载 [OpenClaw 扩展](https://github.com/BofAI/openclaw-extension)，按其文档完成了 MCP Server 的基础配置。

## 快速开始

### 1. 浏览可用技能

当前可用的技能：

- **sunswap/** - SunSwap DEX 交易技能，用于代币兑换
- **8004/** - 8004 可信智能体 - AI 智能体的链上身份和信誉系统
- **x402-payment/** - 在区块链网络上启用智能体支付功能（x402 协议）
- **x402-payment-demo/** - x402 支付协议演示

### 2. 使用技能

告诉你的 AI 智能体：

```
请阅读 skills/sunswap/SKILL.md 并帮我查看 100 USDT 可以兑换多少 TRX
```

AI 智能体将会：

1. 读取 SKILL.md
2. 按照指令调用相应的工具
3. 返回结果
