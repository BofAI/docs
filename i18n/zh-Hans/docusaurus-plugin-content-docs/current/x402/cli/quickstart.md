---
title: "Wallet CLI 快速入门"
description: "安装 wallet-cli 4.14.0 并预览 x402 支付。"
---

# Wallet CLI 快速入门

需要 Node.js 20 或更新版本。

## 安装和检查

```bash
npm install -g @tron-walletcli/wallet-cli@4.14.0
wallet-cli --version
wallet-cli x402 pay --json-schema -o json
```

4.14.0 的帮助、版本和 schema 查询不读取钱包数据。首次执行其他命令可能返回 `command: "migration"`；这表示只完成了迁移，原命令尚未执行，需检查结果后再运行。

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
  --network tron:728126428 --token USDT --max-amount 0.01 --dry-run -o json
```

确认网络、收款地址、金额和费用后才能付款。实际付款去掉 `--dry-run`，使用 `--password-stdin` 从已授权的安全来源输入主密码；不要把密码放到命令行参数中。GasFree 需要单独限制 `--max-gasfree-fee`。

支付结果不确定时先检查交易和 `error.details.paymentStatus`；出现 `retryPayment: false` 时不要重新付款。

[完整命令与结果说明](/zh-Hans/x402/cli/command-reference/) · [常见问题](/zh-Hans/x402/cli/faq/)

{/* Preserve bookmarks to sections replaced by the wallet-cli migration guidance. */}
<span id="准备工作"></span>
<span id="第-1-步安装"></span>
<span id="第-2-步先不花钱试一试"></span>
<span id="第-3-步在测试网跑一次完整回路"></span>
<span id="第-4-步支付真实的-x402-接口"></span>
<span id="可选运行你自己的付费端点"></span>
<span id="下一步"></span>
