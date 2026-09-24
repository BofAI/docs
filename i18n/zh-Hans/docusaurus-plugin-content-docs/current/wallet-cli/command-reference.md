---
title: "Wallet CLI 命令参考"
description: "wallet-cli 4.14.0 命令与支付参数。"
---

# Wallet CLI 命令参考

以 **4.14.0** 发布包为准。通过命令 schema 查询可用参数。

```bash
wallet-cli --json-schema -o json
wallet-cli x402 pay --json-schema -o json
wallet-cli bai recharge --json-schema -o json
```

## 支付参数

- `--network`：指定支付网络；TRON 主网使用 `tron:728126428`。
- `--account`：选择 wallet-cli 账户。
- `--token` 或 `--asset`、`--decimals`：按 schema 指定支付资产。
- `--max-amount` / `--max-raw-amount`：二选一，限制支付数量。
- `--dry-run`：读取支付要求，不签名。
- `--method`、`--header`、`--body` / `--body-file`：HTTP 请求配置。
- `--password-stdin`：实际签名所需主密码的安全输入通道。
- `-o json`：机器输出。

## GasFree 支付 {#gasfree-payments-tron}

TRON 路线需要 GasFree 时显式指定 `--scheme exact_gasfree`，并限制 `--max-gasfree-fee`。使用 `--gasfree-relay` 选择服务。支付金额上限不包含 GasFree 手续费。

## 结果处理

操作返回 `wallet-cli.result.v1`，包含 `success`、`command`、`data` 或 `error`。退出码 `0` 表示命令成功，`1` 为执行错误，`2` 为调用错误。schema 查询返回命令目录或输入 schema，不是操作结果对象。

支付读取 `data.response`；失败时查看 `error.details.paymentStatus` 和 `retryPayment`。`not_sent` 表示未发送支付，`unknown` 表示不能确定；`retryPayment: false` 时应核对已有交易，不能再次支付。

## B.AI 充值

```bash
wallet-cli bai recharge 1 --network tron:728126428 --token USDT --dry-run -o json
wallet-cli bai recharge-orders --json-schema -o json
```

需要 wallet-cli 账户及已存储的 B.AI API Key。充值只支持配置中允许的主网；预览不创建订单、不绑定钱包、不付款。实际充值可能先绑定付款地址，需在授权范围内执行。`creditStatus: "unconfirmed"` 不代表付款失败，应使用 `bai report-recharge` 报告原交易，不要重新充值。

[快速入门](/zh-Hans/wallet-cli/quickstart/) · [常见问题](/zh-Hans/wallet-cli/faq/)
