---
title: API Catalog Introduction
sidebar_label: Introduction
description: BANK OF AI's wallet-native service catalog — where AI Agents discover, call, and pay for any API, settled on-chain via x402.
---

# API Catalog

Traditional API onboarding is designed for humans: create an account, request an API key, link a credit card, subscribe monthly. When an AI Agent wants to call an API on its own, it fails at the very first step — it has no email, no credit card, and it shouldn't be holding a pile of secret keys for you anyway.

The **API Catalog** is BANK OF AI's wallet-native service catalog. AI Agents discover services here, call them by name, and pay per call — every call settles on-chain via x402. No accounts, no API keys: **your wallet is your identity**. The catalog covers both TRON and BNB Chain.

## What it solves

- **For Agents / developers**: discover every callable service in one catalog and pay per call — no separate sign-ups or key management for each service.
- **For service providers**: list your existing API so Agents can discover, call, and pay for it directly, with payments settled straight to your own wallet — without changing a single line of code.

## How it works

The catalog itself is just a public list of services: it keeps no database and accepts no upstream secrets — it makes services discoverable, and never touches calls or funds.

To get listed, a provider submits two **public** files to the catalog repository (you can start with the application form and we'll help you through); the call addresses inside the files point to the gateway of your choice — BANK OF AI hosted or self-hosted. The platform validates, scans for sensitive data, then publishes:

```text
Provider                     Catalog repo (CI)                Distribution
────────                     ─────────────────                ────────────
catalog.json  ──open PR──►   field checks + secret scan  ──►  /api/catalog.json
pay.md                       build static snapshot dist/      /api/providers/<fqn>.json
                                                              /api/pay/<fqn>.json · .md
                                                                        │
                                                ┌───────────────────────┼───────────────────────┐
                                                ▼                       ▼                        ▼
                                          Catalog website           x402-cli              MCP (Agent access)
```

Three consumers share the same data:

- **[Catalog website](https://bankofai.io/catalog)**: for humans to browse and compare services.
- **x402-cli**: search, inspect, and make paid calls from the command line.
- **MCP**: one install and your Agent can "see" and call every service in the catalog by name.

## What's in the catalog

The first live services cover token creation plus DeFi market data and on-chain security — all settling across TRON and BNB Chain, with more being added over time:

| Service | What it does | Billing |
|---|---|---|
| SunPump Agent Token Launch | Pay with x402, then submit token-launch metadata (name, symbol, description, image) to SunPump — the gateway forwards your request after settlement | From $0.001 / call |
| DefiLlama Token Price | Current and historical USD price for one or many tokens, price charts, and percent change | Free |
| DefiLlama DeFi Data | Protocol TVL, fees/revenue, and stablecoin metrics for research and risk screening | Free |
| DefiLlama Yields / APY | List and compare DeFi pool yields (APY/TVL), plus a pool's historical series | Free |
| DexScreener DEX Data | Token DEX pairs, price and liquidity; token search; latest new-listing profiles | Free |
| DIA Token Price | Real-time, multi-source aggregated USD price by symbol or by chain + contract address | Free |
| GoPlus Token & Address Security | Honeypot/scam checks, malicious-address screening, and risky-approval detection | Free |

All of the above are in the **Finance** category and available on both TRON and BNB Chain.

:::note
The live service list and statistics (service count, chain count, etc.) are **generated dynamically** from catalog data — treat `/api/catalog.json` as the source of truth; this page hard-codes no numbers, and the catalog grows as new services are listed.
:::

## Next steps

- Want your Agent to use these services → [Get Started](./get-started.md)
- Want to list and monetize your own API → [List Your Service](./list-your-service.md)
- Want the data structures and API details → [Data Format & API Reference](./reference.md)
