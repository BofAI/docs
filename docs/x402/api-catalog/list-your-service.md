---
title: List Your Service
sidebar_label: List Your Service
description: List your API in the API Catalog — apply via the form or open a PR directly; two public files; official or self-hosted gateway both work. Once live, every AI Agent can discover it and pay per call.
---

# List Your Service

List once — every AI Agent call after that is revenue in.

Put your API behind the Gateway and it appears in the catalog: any Agent can discover it, call it, and pay for it. Payments settle to the wallet you specify in real time — **no platform escrow, no payout cycle**; settle on TRON or BNB Chain; your existing API stays exactly as it is, **not one line of code changes**, and you set the prices.

## The big picture: what listing actually means

Listing comes down to one action: opening a PR against the [catalog repository](https://github.com/BofAI/x402-catelog) with just two **public** files:

| File | Purpose |
|---|---|
| `providers/<fqn>/catalog.json` | Public service info used by the frontend, CLI, and Agents |
| `providers/<fqn>/pay.md` | Human- and Agent-readable call & payment instructions |

`<fqn>` is your service's globally unique identifier (lowercase letters, digits, hyphens) and must match the directory name.

The catalog repository **stores public discovery data only**: it keeps no database and never accepts upstream API keys, tokens, passwords, `provider.yml`, or `.env`. With a self-hosted gateway your secrets stay on your machine; with the official gateway your credentials are held on the gateway side — either way, secrets **never enter the catalog repository**.

Before you start, make two decisions.

## Decision 1: whose gateway?

This determines what goes into the call addresses (`serviceUrl` and each endpoint's `url`) in your two files:

| | Official gateway (hosted) | Self-hosted gateway |
|---|---|---|
| Call address in your files | Official domain (`gateway.bankofai.io/...`) | Your own gateway domain |
| Who runs the gateway | BANK OF AI | You |
| Funds & traffic | Proxied through the official gateway, settled to your wallet | Straight to your gateway and wallet, never passing through BANK OF AI |
| Where upstream credentials live | Held by the official gateway | Your machine only |
| Best for | Fastest launch, nothing to deploy | Full control over credentials and infrastructure |

Either way, the catalog handles **discovery** only: what Agents actually call is always the gateway address registered in your files.

## Decision 2: pick a submission route

Two routes, one destination — that PR.

**Route 1: apply first, we'll contact you** (recommended for first-time providers)

1. **Submit the application form** — via the **Apply to list your service** entry at the bottom of the [catalog page](https://bankofai.io/catalog): service name, short description, API URL, preferred settlement network(s), and contact info. If you've registered an ERC-8004 identity address, include it — verified applicants are **prioritized**.
2. **We get in touch** — within **1–2 business days** by email or Telegram, to confirm endpoints, pricing, payout wallet, and whether you'll use the official or a self-hosted gateway.
3. **Open the PR** — once everything is confirmed, follow the steps below; your service goes live when it merges.

**Route 2: open a PR directly** (for providers familiar with the flow)

Skip the form and follow the steps below to prepare the files and open the PR.

## Step 1: Prepare the two public files

**Self-hosted gateway**: run your gateway on your own machine first, then export with the CLI. The command below produces only `catalog.json` and `pay.md` — it never exports secrets:

```bash
x402-cli catalog export-gateway https://gateway.example.com \
  --provider <fqn> \
  --output-dir providers/<fqn>
```

**Official gateway**: once onboarding is confirmed, fill in the two files using the official address assigned to you (like `https://gateway.bankofai.io/providers/<fqn>`), following the examples below.

### What catalog.json looks like

A minimal working example (taken from the demo service `acme-weather`):

```json
{
  "version": 1,
  "fqn": "acme-weather",
  "title": "Acme Weather API",
  "subtitle": "City-level weather lookup",
  "description": "Current weather data for city-level applications.",
  "useCase": "Use for current weather lookup by city.",
  "i18n": {
    "zh-CN": {
      "title": "<zh-CN title>",
      "subtitle": "<zh-CN subtitle>",
      "description": "<zh-CN description>",
      "useCase": "<zh-CN useCase>"
    }
  },
  "logo": "https://catalog.bankofai.io/assets/providers/acme-weather/logo.png",
  "category": "data",
  "chains": ["tron:mainnet", "eip155:56"],
  "isFirstParty": false,
  "isFeatured": false,
  "featuredTags": [],
  "serviceUrl": "https://gateway.bankofai.io/providers/acme-weather",
  "endpoints": [
    {
      "method": "GET",
      "path": "/v1/current",
      "url": "https://gateway.bankofai.io/providers/acme-weather/v1/current",
      "title": "Current Weather",
      "subtitle": "Lookup by city",
      "description": "Current weather for a city.",
      "useCase": "Use when an app needs real-time city weather.",
      "i18n": { "zh-CN": { "title": "<zh-CN title>", "subtitle": "<zh-CN subtitle>", "description": "<zh-CN description>", "useCase": "<zh-CN useCase>" } },
      "metered": true,
      "minPriceUsd": 0.002,
      "maxPriceUsd": 0.002
    }
  ]
}
```

The `<zh-CN ...>` placeholders stand for the Simplified-Chinese translations of the four fields — they are required and must be filled in with actual Chinese text. Full field definitions: [Data Format & API Reference](./reference.md).

### How to write pay.md

`pay.md` is read by humans and Agents alike. Three parts are recommended: basic service info, endpoint addresses and prices, and one copy-paste call example:

````markdown
# Acme Weather API

## Service

- FQN: `acme-weather`
- Service URL: `https://gateway.bankofai.io/providers/acme-weather`
- Category: `data`
- Chains: `tron:mainnet`, `eip155:56`

## Endpoints

### GET /v1/current

Current weather for a city.

- URL: `https://gateway.bankofai.io/providers/acme-weather/v1/current`
- Price: `$0.002`

```bash
x402-cli pay 'https://gateway.bankofai.io/providers/acme-weather/v1/current?city=Shanghai'
```
````

### Pre-submission checklist

CI enforces the following rules — go through them before submitting:

- `version` must be `1`.
- `fqn` is lowercase letters/digits/hyphens and must match the directory name.
- `category` must be one of the allowed values (see [reference](./reference.md#allowed-categories)).
- `chains` needs at least one entry, using CAIP-2 style chain IDs (e.g. `tron:mainnet`, `eip155:56`).
- `isFirstParty`, `isFeatured` (booleans) and `featuredTags` (string array, may be empty `[]`) are **required** — missing any of them fails validation.
- For every endpoint: `method` must be uppercase, `path` must start with `/`, and `maxPriceUsd` must not be less than `minPriceUsd`.
- The service and every endpoint must provide `i18n.zh-CN` translations for `title`, `subtitle`, `description`, and `useCase`.
- `pay.md` must be submitted together with `catalog.json`; both files are scanned for sensitive data.
- No keys, private keys, or private network addresses anywhere.

## Step 2: Validate locally

Before submitting, run validation and build locally to make sure all fields are valid and nothing sensitive slipped in:

```bash
python3 scripts/validate.py
python3 scripts/build.py
```

Expected output:

```text
validated 1 provider(s)
built 1 provider(s) into dist
```

## Step 3: Open the Pull Request

Add the two files to the [catalog repository](https://github.com/BofAI/x402-catelog) under the matching directory:

```text
providers/<fqn>/catalog.json
providers/<fqn>/pay.md
```

:::caution Security red line: these two files are public
**Never** include upstream API keys, bearer tokens, wallet private keys, passwords, `provider.yml`, `.env`, or any internal/local addresses (such as `localhost`, `127.0.0.1`, `10.x`, `192.168.x`). CI scans for these patterns and rejects the merge on any hit.
:::

## Step 4: Merge = go live

After your PR merges, the release process refreshes the freshly built `dist/` to the Catalog Server / CDN. Your service is live in the catalog and starts taking Agent calls.

## Next steps

- All fields, categories, and API structures → [Data Format & API Reference](./reference.md)
- Want to try the caller side first? → [Get Started](./get-started.md)
