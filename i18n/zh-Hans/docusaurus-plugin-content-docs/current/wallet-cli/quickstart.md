---
title: "Wallet CLI 快速入门"
sidebar_label: "快速入门"
description: "安装 wallet-cli 并预览 x402 支付。"
---

# Wallet CLI 快速入门

需要 Node.js 22.23.4+（22.x）、24.22.1+（24.x）或 26.12.1+。

## 安装和检查

```bash
npm install -g @tron-walletcli/wallet-cli@4.15.1
wallet-cli --version
wallet-cli x402 pay --json-schema -o json
```

如果要配合 wallet-cli Skill 使用，请改装该 Skill 锁定的版本（目前是 4.14.0），见 [Skills 快速入门](/zh-Hans/McpServer-Skills/SKILLS/QuickStart/)。

:::tip 安装时报权限错误？
在 macOS 或 Linux 上，如果 `npm install -g` 报权限错误（如 `EACCES`），请参考 npm 官方文档：[Resolving EACCES permissions errors when installing packages globally](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)。
:::

从 4.14.0 起，帮助、版本和 schema 查询不读取钱包数据。首次执行其他命令可能返回 `command: "migration"`；这表示只完成了迁移，原命令尚未执行，需检查结果后再运行。

## 准备钱包

在本地终端使用 wallet-cli 配置账户。先查看 `wallet-cli create --help` 或 `wallet-cli import --help`，再按实际账户类型操作。导入、备份、删除和改密码由用户本人完成；不要把密码、助记词或私钥粘贴到聊天中。

```bash
wallet-cli list -o json
wallet-cli current -o json
```

## 查询目录

```bash
wallet-cli x402 provider-list -o json
wallet-cli x402 provider-show dia -o json
wallet-cli x402 endpoint-list dia -o json
```

从结果中选择网络对应的 `x402Routes[].url`，替换路径占位符。不要根据目录 FQN 猜测 Gateway URL。

## 预览支付

以下命令访问 DIA 的报价接口，**不签名、不付款**。支付预览仍需要已配置账户。

```bash
wallet-cli x402 pay https://x402-gateway.bankofai.io/providers/dia-price-tron/v1/quotation/BTC \
  --method GET \
  --network tron:728126428 \
  --token USDT \
  --scheme exact \
  --max-amount 0.01 \
  --dry-run -o json
```

确认网络、收款地址、金额和费用后才能付款。实际付款去掉 `--dry-run`，使用 `--password-stdin` 从已授权的安全来源输入主密码；不要把密码放到命令行参数中。GasFree 需要单独限制 `--max-gasfree-fee`。在 TRON 上，某个代币的首次 `exact` 付款可能会先从账户广播 `approve(Permit2, MaxUint256)`（端点代付授权时除外）：这会消耗账户自己的 Energy 或 TRX，并给 Permit2 留下该代币的无限额度授权。结果会在 `data.approval` 中说明。

支付结果不确定时先检查交易和 `error.details.paymentStatus`；出现 `retryPayment: false` 时不要重新付款。

[完整命令与结果说明](/zh-Hans/wallet-cli/command-reference/) · [常见问题](/zh-Hans/wallet-cli/faq/)
