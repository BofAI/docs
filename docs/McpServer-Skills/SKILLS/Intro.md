# Skills 仓库

AI 智能体技能库 - AI 智能体的可复用能力模块

## 什么是技能（Skill）？

**技能**是一份包含详细指令的文档，用于教会 AI 智能体如何完成特定任务。

**类比**：就像为 AI 提供一份"操作手册"，告诉它如何使用工具来完成工作。

```
用户："帮我把 USDT 兑换成 TRX"
  ↓
AI 智能体读取 SunSwap 技能
  ↓
AI 智能体遵循 SKILL.md 中的指令
  ↓
调用 mcp-server-tron 工具
  ↓
完成 DEX 交易
```

## 快速开始

### 1. 浏览可用技能

当前可用的技能：

* **sunswap/** - SunSwap DEX 交易技能，用于 TRON 代币兑换
* **tron-8004/** - TRC-8004 可信智能体 - AI 智能体的链上身份和信誉系统
* **x402_tron_payment/** - 在 TRON 网络上启用智能体支付功能（x402 协议）
* **x402_tron_payment_demo/** - x402 支付协议演示

### 2. 使用技能

告诉你的 AI 智能体：

```
请阅读 skills/sunswap/SKILL.md 并帮我查看 100 USDT 可以兑换多少 TRX
```

AI 智能体将会：

1. 读取 SKILL.md
2. 按照指令调用相应的工具
3. 返回结果

## 仓库结构

```
skills-tron/
├── README.md              # 本文件 - 概述
├── LICENSE                # MIT 许可证
├── CONTRIBUTING.md        # 贡献指南
├── AGENTS.md              # 开发者指南（如何创建新技能）
├── sunswap/               # SunSwap DEX 交易技能
│   ├── README.md          # 技能描述
│   ├── SKILL.md           # 主指令文件（AI 智能体读取此文件）
│   ├── examples/          # 使用示例
│   ├── resources/         # 配置文件（合约地址、代币列表等）
│   └── scripts/           # 辅助脚本
├── tron-8004/             # TRC-8004 可信智能体技能
│   ├── README.md          # 技能描述
│   ├── SKILL.md           # 主指令文件
│   ├── lib/               # 合约 ABI 和配置
│   ├── scripts/           # Node.js 脚本用于智能体操作
│   ├── templates/         # 注册模板
│   └── examples/          # 使用示例
└── x402_tron_payment/     # x402 支付协议技能
    ├── SKILL.md           # 主指令文件
    └── dist/              # 编译后的工具脚本
```

## 可用技能

* **SunSwap 技能**：DEX 交易（TRON 代币兑换）
* **TRC-8004 可信智能体**：AI 智能体的链上身份、信誉和验证
* **x402-tron-payment**：AI 智能体的 TRC20 支付（USDT/USDD）

