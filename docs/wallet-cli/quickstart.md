---
title: "Wallet CLI Quick Start"
description: "Install wallet-cli 4.14.0 and preview an x402 payment."
---

# Wallet CLI Quick Start

Requires Node.js 20 or newer.

## Install and inspect

```bash
npm install -g @tron-walletcli/wallet-cli@4.14.0
wallet-cli --version
wallet-cli x402 pay --json-schema -o json
```

In 4.14.0, help, version, and schema discovery do not read wallet data. A first operational command may return `command: "migration"`: only the migration ran, so inspect its result before invoking the original command again.

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
  --network tron:728126428 --token USDT --max-amount 0.01 --dry-run -o json
```

Before paying, confirm the network, recipient, amount, and fees. Remove `--dry-run` only for the authorized payment, and supply the master password through `--password-stdin` from an approved secure source, never a password argument. Cap GasFree fees separately with `--max-gasfree-fee`.

After an uncertain result, reconcile the transaction and inspect `error.details.paymentStatus`. Do not pay again when `retryPayment: false` is returned.

[Command and result reference](/wallet-cli/command-reference/) · [FAQ](/wallet-cli/faq/)
