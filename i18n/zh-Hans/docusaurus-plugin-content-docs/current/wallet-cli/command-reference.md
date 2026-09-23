---
title: "Wallet CLI 命令参考"
description: "从独立 x402-cli 迁移到 wallet-cli 4.14.0。"
---

# Wallet CLI 命令参考

以 **4.14.0** 发布包为准。先查询命令 schema，不要直接沿用旧 CLI 的参数。

```bash
wallet-cli --json-schema -o json
wallet-cli x402 pay --json-schema -o json
wallet-cli bai recharge --json-schema -o json
```

## 旧命令迁移

| 原入口 | 新入口 |
| --- | --- |
| `x402-cli pay` | `wallet-cli x402 pay` |
| `x402-cli serve` / `roundtrip` | `wallet-cli x402 serve` / `roundtrip` |
| `catalog search` | `wallet-cli x402 provider-list`；使用支持的 category/capability 过滤，不支持原关键词搜索参数 |
| `catalog show` / `endpoints` | `wallet-cli x402 provider-show` / `endpoint-list` |
| `catalog update` | `wallet-cli x402 update-catalog` |
| `gateway ...` / `catalog export-gateway` / `catalog build` | 不提供同名替换；使用 [Gateway](/zh-Hans/x402/core-concepts/gateway/) 和 [Catalog](/zh-Hans/x402/api-catalog/list-your-service/) 的部署与构建流程 |

## 支付参数

- `--network`：指定支付网络；TRON 主网使用 `tron:728126428`。
- `--account`：选择 wallet-cli 账户，替代旧钱包选择参数。
- `--token` 或 `--asset`、`--decimals`：按 schema 指定支付资产。
- `--max-amount` / `--max-raw-amount`：二选一，限制支付数量。
- `--dry-run`：读取支付要求，不签名。
- `--method`、`--header`、`--body` / `--body-file`：HTTP 请求配置。
- `--password-stdin`：实际签名所需主密码的安全输入通道。
- `-o json`：机器输出；不是旧 CLI 的 `--json`。

## GasFree 支付 {#gasfree-payments-tron}

TRON 路线需要 GasFree 时显式指定 `--scheme exact_gasfree`，并限制 `--max-gasfree-fee`。4.14 使用 `--gasfree-relay` 选择服务，不沿用旧 `--gasfree-api-url`。支付金额上限不包含 GasFree 手续费。

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
