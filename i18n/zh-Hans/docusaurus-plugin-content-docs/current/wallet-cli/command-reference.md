---
title: "Wallet CLI 命令参考"
sidebar_label: "命令参考"
description: "wallet-cli 命令与支付参数。"
---

# Wallet CLI 命令参考

以 **4.15.1** 发布包为准。通过命令 schema 查询可用参数。

```bash
wallet-cli --json-schema -o json
wallet-cli x402 pay --json-schema -o json
wallet-cli bai recharge --json-schema -o json
```

## 支付参数

- `--network`：指定支付网络；TRON 主网使用 `tron:728126428`。
- `--account`：选择 wallet-cli 账户。
- `--token` 或 `--asset`、`--decimals`：按 schema 指定支付资产。
- `--max-amount` / `--max-raw-amount`：二选一，限制支付数量。`--max-raw-amount` 以最小单位计，必须同时指定 `--token` 或 `--asset`，因为原始数量本身没有单位。`--max-amount` 和 `--max-raw-amount` 都不指定时，已知稳定币默认每笔上限 1 美元；超过该价格的路线会在签名前被排除；所有路线都超过时，命令以 `amount_exceeds_limit` 失败。`--dry-run` 预览不应用这个内置上限，所以预览能通过，实际付款仍可能以 `amount_exceeds_limit` 失败。
- `--dry-run`：读取支付要求，不签名。
- `--method`、`--header`、`--body` / `--body-file`：HTTP 请求配置。
- `--out <path>`：把响应体按原始字节写入新文件，而不是放在 `data.response`；文件已存在时在发出任何请求前即拒绝。二进制媒体类型（如 `application/octet-stream`、图片、音视频、PDF、压缩包）必须使用 `--out`。
- `--password-stdin`：实际签名所需主密码的安全输入通道。
- `-o json`：机器输出。

## GasFree 支付 {#gasfree-payments-tron}

要通过 GasFree 支付 TRON 路线，请指定 `--scheme exact_gasfree`，并用 `--max-gasfree-fee`（或以最小单位计的 `--max-gasfree-fee-raw`）限制手续费。不指定 `--scheme` 时，会使用服务端给出的第一条匹配路线，这条路线可能就是 GasFree；如需排除，请指定 `--scheme exact`。使用 `--gasfree-relay` 选择服务。支付金额上限不包含 GasFree 手续费。

## 结果处理

操作返回 `wallet-cli.result.v1`，包含 `success`、`command`、`data` 或 `error`。退出码 `0` 表示命令成功，`1` 为执行错误，`2` 为调用错误。schema 查询返回命令目录或输入 schema，不是操作结果对象。

支付读取 `data.response`；失败时查看 `error.details.paymentStatus` 和 `retryPayment`。`not_sent` 表示未发送支付，`unknown` 表示不能确定；`retryPayment: false` 时应核对已有交易，不能再次支付。响应格式错误也可能发生在付款已结算之后，此时 `error.details` 仍保留 `paymentStatus: "settled"`、交易哈希和 `retryPayment: false`，应凭交易哈希与服务方核对，不要再次付款。付款成功时，`data.payment` 会给出实际支付的资产与数量。

### 常见错误码

| 错误码 | 退出码 | 出现场景 |
| --- | --- | --- |
| `missing_wallet_address` | 1 | 没有配置 wallet-cli 账户（`--dry-run` 也需要） |
| `auth_required` | 1 | 实际付款时没有传 `--password-stdin` |
| `invalid_option` | 2 | `--max-raw-amount` 没带 `--token` / `--asset`、二进制响应没带 `--out`，或同时传了互斥参数 |
| `output_exists` | 2 | `--out` 指定的文件已存在；未发出任何请求 |
| `no_matching_requirement` | 1 | 没有路线匹配 `--network` / `--token` / `--asset` / `--scheme`，或在未传 `--max-amount` / `--max-raw-amount` 时，没有路线使用内置支出控制允许的资产；`paymentStatus: "not_sent"` |
| `amount_exceeds_limit` | 1 | 路线价格高于 `--max-amount`、`--max-raw-amount` 或内置的 1 美元上限；`not_sent` |
| `permit2_allowance_required` | 1 | 未代付的路线上缺少 Permit2 授权额度 |
| `gasfree_insufficient_balance` / `fee_cap_exceeded` | 1 | GasFree 余额不足或 `--max-gasfree-fee` 过低 |
| `provider_error` / `provider_rate_limited` | 1 | 端点或 facilitator 出错或返回 429（有则带 `error.details.retryAfterSeconds`） |
| `invalid_x402_response` | 1 | 付费响应无法解码；可能带 `paymentStatus: "settled"` |

只有实际付款时 `error.details` 里才会带 `paymentStatus`；`--dry-run` 失败时没有 `error.details`。

## B.AI 充值

```bash
wallet-cli bai recharge 1 --network tron:728126428 --token USDT --dry-run -o json
wallet-cli bai recharge-orders --json-schema -o json
```

需要 wallet-cli 账户及已存储的 B.AI API Key；没有 Key 时所有 `bai` 命令（包括预览）都会以退出码 `2` 返回 `bai_credentials_missing`（金额和网络检查之后）。充值只支持配置中允许的主网路线：TRON USDT / USDD、BSC USDT、Base USDC。`--to` 可填 B.AI 账户邮箱或 EVM / TRON / Solana 地址，省略则给自己充值；`--token` 在 Base 上默认 USDC，其他网络默认 USDT；最低金额为 1 USDT / USDC（USDD 无下限），低于下限返回 `invalid_amount`。预览不创建订单、不绑定钱包、不付款。实际充值可能先绑定付款地址，需在授权范围内执行。`creditStatus: "unconfirmed"` 不代表付款失败，应使用 `bai report-recharge` 报告原交易，不要重新充值。

[快速入门](/zh-Hans/wallet-cli/quickstart/) · [常见问题](/zh-Hans/wallet-cli/faq/)
