---
title: "Wallet CLI Command Reference"
sidebar_label: "Command Reference"
description: "Commands and payment options for wallet-cli."
---

# Wallet CLI Command Reference

This reference targets the published **4.15.1** package. Use schema discovery to inspect command parameters.

```bash
wallet-cli --json-schema -o json
wallet-cli x402 pay --json-schema -o json
wallet-cli bai recharge --json-schema -o json
```

## Payment options

- `--network`: explicit payment network; use `tron:728126428` for TRON mainnet.
- `--account`: wallet-cli account selection.
- `--token` or `--asset` and `--decimals`: select an asset according to the schema.
- `--max-amount` / `--max-raw-amount`: mutually exclusive payment caps. `--max-raw-amount` is in smallest units and requires `--token` or `--asset`, because a raw amount has no unit. Without `--max-amount` or `--max-raw-amount`, a built-in ceiling of $1 per payment applies to known stablecoins; routes priced above it are dropped before signing, and the command fails with `amount_exceeds_limit` when every offered route is above it. A `--dry-run` preview does not apply this built-in cap, so a preview can pass while the real payment still fails with `amount_exceeds_limit`.
- `--dry-run`: read payment requirements without signing.
- `--method`, `--header`, `--body` / `--body-file`: HTTP request options.
- `--out <path>`: write the response body byte-for-byte to a new file instead of `data.response`; an existing file is refused before any request is sent. Binary media types (such as `application/octet-stream`, images, audio, video, PDF, and archives) require `--out`.
- `--password-stdin`: secure master-password input for signing.
- `-o json`: machine output.

## GasFree payments {#gasfree-payments-tron}

To pay a TRON route through GasFree, pass `--scheme exact_gasfree` and cap the fee with `--max-gasfree-fee` (or `--max-gasfree-fee-raw` in smallest units). Without `--scheme`, the first matching route the server offers is used, which can be a GasFree route; pass `--scheme exact` to rule that out. Use `--gasfree-relay` to select the relay service. The payment amount cap does not include the GasFree fee.

## Result handling

Operations return `wallet-cli.result.v1` with `success`, `command`, and `data` or `error`. Exit `0` means command success, `1` execution failure, and `2` invalid invocation. Schema discovery returns a command catalog or input schema rather than an operation envelope.

The paid response is in `data.response`. On failure inspect `error.details.paymentStatus` and `retryPayment`. `not_sent` means no payment was sent; `unknown` means the outcome cannot be established. Reconcile the existing transaction rather than paying again when `retryPayment: false` is returned. A response format error can also occur after the payment has settled; `error.details` then keeps `paymentStatus: "settled"`, the transaction hash, and `retryPayment: false`, so reconcile with the provider instead of paying again. A successful paid result reports what was paid in `data.payment`.

### Common error codes

| Code | Exit | When |
| --- | --- | --- |
| `missing_wallet_address` | 1 | No wallet-cli account is configured (also for `--dry-run`) |
| `auth_required` | 1 | A real payment was attempted without `--password-stdin` |
| `invalid_option` | 2 | `--max-raw-amount` without `--token` / `--asset`, a binary response without `--out`, or mutually exclusive flags |
| `output_exists` | 2 | The `--out` file already exists; nothing was sent |
| `no_matching_requirement` | 1 | No route matched `--network` / `--token` / `--asset` / `--scheme`, or, without `--max-amount` / `--max-raw-amount`, no route uses an asset the built-in spend control allows; `paymentStatus: "not_sent"` |
| `amount_exceeds_limit` | 1 | The route's price is above `--max-amount`, `--max-raw-amount` or the built-in $1 cap; `not_sent` |
| `permit2_allowance_required` | 1 | Permit2 allowance missing on an unsponsored route |
| `gasfree_insufficient_balance` / `fee_cap_exceeded` | 1 | GasFree balance or `--max-gasfree-fee` too low |
| `provider_error` / `provider_rate_limited` | 1 | The endpoint or facilitator failed or returned 429 (`error.details.retryAfterSeconds` when sent) |
| `invalid_x402_response` | 1 | The paid response could not be decoded; may carry `paymentStatus: "settled"` |

`paymentStatus` appears in `error.details` only for real payments; a `--dry-run` failure carries no `error.details`.

## B.AI recharge

```bash
wallet-cli bai recharge 1 --network tron:728126428 --token USDT --dry-run -o json
wallet-cli bai recharge-orders --json-schema -o json
```

Requires a wallet-cli account and a stored B.AI API key; without the key every `bai` command, including a preview, exits `2` with `bai_credentials_missing` (after the amount and network checks). Recharge supports the configured mainnet routes only: TRON USDT / USDD, BSC USDT and Base USDC. `--to` takes a B.AI account email or an EVM / TRON / Solana address; omit it to recharge your own account. `--token` defaults to USDC on Base and USDT elsewhere. The minimum is 1 USDT / USDC (USDD has none) — below that the command fails with `invalid_amount`. A preview creates no order, binds no wallet, and makes no payment. A real recharge may first bind the paying address, which must be within the authorized operation. `creditStatus: "unconfirmed"` is not a failed payment: use `bai report-recharge` for the original transaction instead of paying again.

[Quick start](/wallet-cli/quickstart/) · [FAQ](/wallet-cli/faq/)
