---
title: "Wallet CLI Command Reference"
description: "Migrate from standalone x402-cli to wallet-cli 4.14.0."
---

# Wallet CLI Command Reference

This reference targets the published **4.14.0** package. Discover the schema before adapting old CLI commands.

```bash
wallet-cli --json-schema -o json
wallet-cli x402 pay --json-schema -o json
wallet-cli bai recharge --json-schema -o json
```

## Command migration

| Previous entry point | Replacement |
| --- | --- |
| `x402-cli pay` | `wallet-cli x402 pay` |
| `x402-cli serve` / `roundtrip` | `wallet-cli x402 serve` / `roundtrip` |
| `catalog search` | `wallet-cli x402 provider-list`; use supported category/capability filters, not the old keyword-search arguments |
| `catalog show` / `endpoints` | `wallet-cli x402 provider-show` / `endpoint-list` |
| `catalog update` | `wallet-cli x402 update-catalog` |
| `gateway ...` / `catalog export-gateway` / `catalog build` | No same-name replacement; use the [Gateway](/x402/core-concepts/gateway/) and [Catalog](/x402/api-catalog/list-your-service/) deployment/build workflows |

## Payment options

- `--network`: explicit payment network; use `tron:728126428` for TRON mainnet.
- `--account`: wallet-cli account selection, replacing old wallet-selection options.
- `--token` or `--asset` and `--decimals`: select an asset according to the schema.
- `--max-amount` / `--max-raw-amount`: mutually exclusive payment caps.
- `--dry-run`: read payment requirements without signing.
- `--method`, `--header`, `--body` / `--body-file`: HTTP request options.
- `--password-stdin`: secure master-password input for signing.
- `-o json`: machine output, replacing the old `--json` flag.

## GasFree payments {#gasfree-payments-tron}

Require `--scheme exact_gasfree` for a TRON GasFree route and cap `--max-gasfree-fee`. Version 4.14 uses `--gasfree-relay`, not the old `--gasfree-api-url`. The payment amount cap does not include the GasFree fee.

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
