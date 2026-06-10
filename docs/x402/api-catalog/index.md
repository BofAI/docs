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

The catalog spans AI models, data, compute, web tools, messaging, DeFi, and more. Typical live services:

| Service | Category | What it does | Billing |
|---|---|---|---|
| LLM Aggregator | AI | OpenAI-compatible API across frontier models from Anthropic, OpenAI, Google, DeepSeek, and more | per token |
| SunPump · Create Token | DeFi | Launch a Meme token on SunPump — name, symbol, description, image | per launch (stay tuned) |
| SUN Swap | DeFi | Swap, liquidity, and farming on TRON via the SUN protocol | per call |
| Wolfram\|Alpha | Compute | Computational engine for math, science, and factual queries | per call |
| ScreenshotOne | Web Tools | Capture any webpage as a high-quality image | per shot |
| Textbelt SMS | Messaging | Send SMS to any phone number, no A2P registration | per message |
| 2Captcha | Web Tools | Solve image, reCAPTCHA, and hCaptcha challenges programmatically | per solve |

:::note
The live service list and statistics (service count, chain count, etc.) are **generated dynamically** from catalog data — treat `/api/catalog.json` as the source of truth; this page hard-codes no numbers.
:::

## Next steps

- Want your Agent to use these services → [Get Started](./get-started.md)
- Want to list and monetize your own API → [List Your Service](./list-your-service.md)
- Want the data structures and API details → [Data Format & API Reference](./reference.md)
