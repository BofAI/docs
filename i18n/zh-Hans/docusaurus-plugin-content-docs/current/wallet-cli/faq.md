---
title: "Wallet CLI 常见问题"
description: "wallet-cli 4.14 的安装、钱包及支付问题。"
---

# Wallet CLI 常见问题

## 预览需要钱包吗？

`x402 pay --dry-run` 需要已配置的账户，但不签名；目录查询不需要钱包或密码。实际付款需要安全输入主密码。

## 支付失败可以重试吗？

先检查 `paymentStatus`、交易哈希和 `retryPayment`。状态为 `unknown` 或 `retryPayment: false` 时，不要重复付款。充值已经支付但入账未确认时，使用 `bai report-recharge` 核对原交易。

## Skill 安装器会安装 CLI 吗？

`npx skills add` 只安装 Skill。CLI 需要单独安装，且应与所选 Skill 的依赖版本一致。参见 [Skills 快速入门](/zh-Hans/McpServer-Skills/SKILLS/QuickStart/)。
