---
title: "Wallet CLI 与 x402"
description: "使用 wallet-cli 进行 x402 支付。"
---

# Wallet CLI 与 x402

新的命令行接入使用 **`@tron-walletcli/wallet-cli@4.16.0`**。

截至 2026-11-12，这是 npm `latest` 版本，精确依赖 **TronWeb 6.5.1**，不会自动安装 TronWeb 6.5.2。wallet-cli Skill 有自己的 CLI 版本锁定；通过该 Skill 使用时，请遵循 [Skills 快速入门](/zh-Hans/McpServer-Skills/SKILLS/QuickStart/)。

| 需求 | 新入口 |
| --- | --- |
| 支付受保护的 HTTP API | `wallet-cli x402 pay` |
| 本地测试收费服务 | `wallet-cli x402 serve`、`wallet-cli x402 roundtrip` |
| B.AI 充值及记录 | `wallet-cli bai recharge`、`recharge-orders` |

钱包由 wallet-cli 配置和选择，原有 agent-wallet 配置不会自动变成 wallet-cli 账户。CLI 网络参数使用十进制 CAIP-2 标识，例如 Nile `tron:3448148188`、TRON 主网 `tron:728126428`、BSC `eip155:56`、Base `eip155:8453`。不要将协议文档中的十六进制 TRON 标识直接替换到 CLI 示例中。

- [快速入门](/zh-Hans/wallet-cli/quickstart/)
- [命令参考](/zh-Hans/wallet-cli/command-reference/)
- [常见问题](/zh-Hans/wallet-cli/faq/)
- [为 AI Agent 配置支付](/zh-Hans/x402/getting-started/quickstart-for-agent/)
