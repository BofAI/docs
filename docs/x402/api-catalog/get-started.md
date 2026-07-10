---
title: Get Started
sidebar_label: Get Started
description: Plug your Agent into the API Catalog in 3 minutes — install the Agent Wallet, then install the x402 CLI to discover and call every service in the catalog.
---

# Get Started

Two steps and under 3 minutes to plug your Agent into the whole catalog: install the wallet, then install the x402 CLI. After that, your Agent can discover and call any service in the catalog, paying per call on-chain.

**Prerequisite**: Node.js (for the wallet) and Python with `pip` (for the CLI).

## Step 1: Install the Agent Wallet

Run the command below to install a local wallet that manages stablecoins on TRON & BNB Chain. Every paid call your Agent makes from now on is signed locally by this wallet.

```bash
npm i @bankofai/agent-wallet
agent-wallet --help
```

## Step 2: Install the x402 CLI

One install connects your Agent to the catalog — it discovers and calls every service over x402, paying per call. No accounts, no API keys to manage.

```bash
pip install bankofai-x402-cli
x402-cli --version
```

When the version prints, you're done — that's both steps. Your Agent is now plugged into the catalog and ready to call.

## Calling services with the CLI

Once installed, your Agent can discover and call services through the CLI. Search by name or keyword to see what's in the catalog:

```bash
x402-cli catalog search <keyword> --catalog https://x402-catalog.bankofai.io/api/catalog.json --json
```

Inspect a service's details and available endpoints:

```bash
x402-cli catalog show <fqn> --catalog https://x402-catalog.bankofai.io/api/catalog.json --json
x402-cli catalog endpoints <fqn> --catalog https://x402-catalog.bankofai.io/api/catalog.json --json
```

**Free endpoints** (those the provider leaves unpriced) return their result to a plain `curl` — no CLI and no payment needed:

```bash
curl -sS 'https://x402-gateway.bankofai.io/providers/<fqn>/...'
```

For a **paid** endpoint, use `x402-cli pay` — it handles the quote, payment, and result retrieval in one step. A simple GET needs nothing more than the URL:

```bash
x402-cli pay 'https://x402-gateway.bankofai.io/providers/<fqn>/...'
```

For a paid POST endpoint, or to pin the payment chain, token, and scheme, pass them explicitly:

```bash
x402-cli pay 'https://x402-gateway.bankofai.io/providers/<fqn>/<path>' \
  --method POST \
  --network tron:mainnet \
  --token USDT \
  --scheme exact \
  --max-amount 0.000001 \
  --header 'Content-Type: application/json' \
  --body '{ ... }'
```

| Flag | Purpose |
|---|---|
| `--method` | HTTP method (defaults to `GET`) |
| `--network` | CAIP-2 payment chain, e.g. `tron:mainnet`, `eip155:56` |
| `--token` | Settlement token, e.g. `USDT` |
| `--scheme` | x402 payment scheme declared by the route, e.g. `exact` or `exact_gasfree` |
| `--max-amount` | Spend ceiling in USD; the call aborts if the quote exceeds it |
| `--header` / `--body` | Request headers and body for the upstream call |

A service that settles on multiple chains exposes one route per network (`x402Routes`); pick the route — and the matching `--network` / `--scheme` — for the chain you want to pay on.

:::tip
`--catalog` can point to the hosted URL above or to a locally built `dist/catalog.json` for offline debugging.
:::

## What happens during a paid call

Every call clears on-chain via x402 — the quoted price is exactly what you pay, always:

1. **Agent calls** — requests the target endpoint.
2. **Gateway quotes** — returns the price (HTTP `402`).
3. **Wallet pays** — the Agent pays on-chain.
4. **Verified & settled** — the gateway verifies payment and settles funds to the provider's wallet.
5. **Response returns** — the gateway returns the upstream result to the Agent.

Upstream credentials never leave the gateway — the calling Agent never touches any key.

:::tip Good to know
- **Free endpoints**: not every call costs money. Endpoints the provider leaves unpriced charge you nothing — there's no quote step, the result comes straight back, and your wallet is never debited.
- **No wallet yet?** Follow the [Agent Wallet Quick Start](../../Agent-Wallet/QuickStart.md) to create and fund a wallet (takes under a minute). The Catalog reuses the same wallet — no extra setup.
- **Risk isolation**: keep only a small amount of stablecoins in the wallet for per-call payments. Never store your main assets in an Agent wallet.
:::

## Next steps

- Browse every service, or learn the response structures → [Data Format & API Reference](./reference.md)
- Have an API you'd like to list and monetize? → [List Your Service](./list-your-service.md)
