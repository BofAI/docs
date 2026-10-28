---
title: "Wallet CLI Quick Start"
sidebar_label: "Quick Start"
description: "Install wallet-cli and preview an x402 payment."
---

# Wallet CLI Quick Start

Requires Node.js 22.23.4+ (22.x), 24.22.1+ (24.x), or 26.12.1+.

## Install and inspect

```bash
npm install -g @tron-walletcli/wallet-cli@4.15.1
wallet-cli --version
wallet-cli x402 pay --json-schema -o json
```

If you will use the wallet-cli Skill, install the version that Skill pins instead (currently 4.14.0) — see the [Skills quick start](/McpServer-Skills/SKILLS/QuickStart/).

:::tip Permission error on install?
If `npm install -g` fails with a permission error (such as `EACCES`) on macOS or Linux, see npm's official guide: [Resolving EACCES permissions errors when installing packages globally](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).
:::

Since 4.14.0, help, version, and schema discovery do not read wallet data. A first operational command may return `command: "migration"`: only the migration ran, so inspect its result before invoking the original command again.

## Prepare an account

Configure the account in your local terminal using wallet-cli. Inspect `wallet-cli create --help` or `wallet-cli import --help` for your account type. Import, backup, deletion, and password changes remain human-operated. Never paste wallet passwords, private keys, or mnemonics into chat.

```bash
wallet-cli list -o json
wallet-cli current -o json
```

## Browse the catalog

```bash
wallet-cli x402 provider-list -o json
wallet-cli x402 provider-show dia -o json
wallet-cli x402 endpoint-list dia -o json
```

Choose the network-specific `x402Routes[].url` and fill in its path placeholders. Do not construct a Gateway URL from the catalog FQN.

## Preview a payment

This reads DIA's payment requirements **without signing or paying**. A configured account is still required for payment previews.

```bash
wallet-cli x402 pay https://x402-gateway.bankofai.io/providers/dia-price-tron/v1/quotation/BTC \
  --method GET \
  --network tron:728126428 \
  --token USDT \
  --scheme exact \
  --max-amount 0.01 \
  --dry-run -o json
```

Before paying, confirm the network, recipient, amount, and fees. Remove `--dry-run` only for the authorized payment, and supply the master password through `--password-stdin` from an approved secure source, never a password argument. Cap GasFree fees separately with `--max-gasfree-fee`. On TRON, a first `exact` payment in a token may broadcast `approve(Permit2, MaxUint256)` from the account before paying, unless the endpoint sponsors the approval: it burns the account's Energy or TRX and leaves an unlimited Permit2 allowance on that token. The result reports it in `data.approval`.

After an uncertain result, reconcile the transaction and inspect `error.details.paymentStatus`. Do not pay again when `retryPayment: false` is returned.

[Command and result reference](/wallet-cli/command-reference/) · [FAQ](/wallet-cli/faq/)
