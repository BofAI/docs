---
title: "Wallet CLI 与 x402"
description: "使用 wallet-cli 4.14.0 进行支付和服务发现。"
---

# Wallet CLI 与 x402

新的命令行接入使用 **`@tron-walletcli/wallet-cli@4.14.0`**。

| 需求 | 新入口 |
| --- | --- |
| 支付受保护的 HTTP API | `wallet-cli x402 pay` |
| 本地测试收费服务 | `wallet-cli x402 serve`、`wallet-cli x402 roundtrip` |
| 浏览服务和接口 | `wallet-cli x402 provider-list`、`provider-show`、`endpoint-list` |
| 刷新目录缓存 | `wallet-cli x402 update-catalog` |
| B.AI 充值及记录 | `wallet-cli bai recharge`、`recharge-orders` |
| Gateway 部署、配置和目录构建 | [Gateway 文档](/zh-Hans/x402/core-concepts/gateway/)及 [Catalog 文档](/zh-Hans/x402/api-catalog/) |

钱包由 wallet-cli 配置和选择，原有 agent-wallet 配置不会自动变成 wallet-cli 账户。CLI 网络参数使用十进制 CAIP-2 标识，例如 Nile `tron:3448148188`、TRON 主网 `tron:728126428`、BSC `eip155:56`、Base `eip155:8453`。不要将协议文档中的十六进制 TRON 标识直接替换到 CLI 示例中。

- [快速入门](/zh-Hans/wallet-cli/quickstart/)
- [命令参考](/zh-Hans/wallet-cli/command-reference/)
- [常见问题](/zh-Hans/wallet-cli/faq/)
- [为 AI Agent 配置支付](/zh-Hans/x402/getting-started/quickstart-for-agent/)
