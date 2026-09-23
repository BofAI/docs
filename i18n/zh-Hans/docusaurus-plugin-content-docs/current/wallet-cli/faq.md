---
title: "Wallet CLI 常见问题"
description: "wallet-cli 4.14 的安装、钱包及支付迁移问题。"
---

# Wallet CLI 常见问题

## 还需要安装独立 x402-cli 吗？

不需要。新的接入使用 `@tron-walletcli/wallet-cli@4.14.0`，参见[快速入门](/zh-Hans/wallet-cli/quickstart/)。

## 可以复用 agent-wallet 的账户吗？

不要假定配置自动互通。使用 wallet-cli 的账户管理流程在本地配置，并核对付款地址。已有 SDK 或服务端使用的 agent-wallet 适配器不因 CLI 迁移而失效。

## 预览需要钱包吗？

`x402 pay --dry-run` 需要已配置的账户，但不签名；目录查询不需要钱包或密码。实际付款需要安全输入主密码。

## 支付失败可以重试吗？

先检查 `paymentStatus`、交易哈希和 `retryPayment`。状态为 `unknown` 或 `retryPayment: false` 时，不要重复付款。充值已经支付但入账未确认时，使用 `bai report-recharge` 核对原交易。

## 原 Gateway 和 Catalog 命令去哪了？

查看[迁移表](/zh-Hans/wallet-cli/command-reference/)。浏览服务可用 `x402 provider-list`、`provider-show`、`endpoint-list`；旧的部署、配置导出和构建命令不能直接机械替换。

## Skill 安装器会安装 CLI 吗？

`npx skills add` 只安装 Skill。CLI 需要单独安装，且应与所选 Skill 的依赖版本一致。参见 [Skills 快速入门](/zh-Hans/McpServer-Skills/SKILLS/QuickStart/)。
