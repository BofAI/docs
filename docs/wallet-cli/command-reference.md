---
title: "Wallet CLI Command Reference"
description: "Commands and payment options for wallet-cli 4.14.0."
---

# Wallet CLI Command Reference

This reference targets the published **4.14.0** package. Use schema discovery to inspect command parameters.

```bash
wallet-cli --json-schema -o json
wallet-cli x402 pay --json-schema -o json
wallet-cli bai recharge --json-schema -o json
```

## Payment options

- `--network`: explicit payment network; use `tron:728126428` for TRON mainnet.
- `--account`: wallet-cli account selection.
- `--token` or `--asset` and `--decimals`: select an asset according to the schema.
- `--max-amount` / `--max-raw-amount`: mutually exclusive payment caps.
- `--dry-run`: read payment requirements without signing.
- `--method`, `--header`, `--body` / `--body-file`: HTTP request options.
- `--password-stdin`: secure master-password input for signing.
- `-o json`: machine output.

## GasFree payments {#gasfree-payments-tron}

Require `--scheme exact_gasfree` for a TRON GasFree route and cap `--max-gasfree-fee`. Use `--gasfree-relay` to select the relay service. The payment amount cap does not include the GasFree fee.

## Result handling

Operations return `wallet-cli.result.v1` with `success`, `command`, and `data` or `error`. Exit `0` means command success, `1` execution failure, and `2` invalid invocation. Schema discovery returns a command catalog or input schema rather than an operation envelope.

The paid response is in `data.response`. On failure inspect `error.details.paymentStatus` and `retryPayment`. `not_sent` means no payment was sent; `unknown` means the outcome cannot be established. Reconcile the existing transaction rather than paying again when `retryPayment: false` is returned.

## B.AI recharge

```bash
wallet-cli bai recharge 1 --network tron:728126428 --token USDT --dry-run -o json
wallet-cli bai recharge-orders --json-schema -o json
```

Requires a wallet-cli account and a stored B.AI API key. Recharge supports the configured mainnet routes only. A preview creates no order, binds no wallet, and makes no payment. A real recharge may first bind the paying address, which must be within the authorized operation. `creditStatus: "unconfirmed"` is not a failed payment: use `bai report-recharge` for the original transaction instead of paying again.

[Quick start](/wallet-cli/quickstart/) · [FAQ](/wallet-cli/faq/)
