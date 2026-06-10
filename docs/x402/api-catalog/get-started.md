---
title: Get Started
sidebar_label: Get Started
description: Plug your Agent into the API Catalog in 3 minutes — install the Agent Wallet, then one MCP install to discover and call every service in the catalog.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Started

Two steps and under 3 minutes to plug your Agent into the whole catalog: install the wallet, then do one MCP install. After that, your Agent can discover and call any service in the catalog by name, paying per call on-chain.

**Prerequisite**: an MCP-compatible Agent (Claude Code, OpenAI Codex, Cursor, Continue, etc.).

## Step 1: Install the Agent Wallet

Run the command below to install a local wallet that manages stablecoins on TRON & BNB Chain. Every paid call your Agent makes from now on is signed locally by this wallet.

```bash
npm i @bankofai/agent-wallet
```

:::tip No wallet yet?
Follow the [Agent Wallet Quick Start](../../Agent-Wallet/QuickStart.md) to create and fund a wallet (takes under a minute). The Catalog reuses the same wallet — no extra setup.
:::

:::caution Risk isolation
Keep only a small amount of stablecoins in the wallet for per-call payments. Never store your main assets in an Agent wallet.
:::

## Step 2: Connect the Catalog to your Agent

One MCP install and your Agent immediately sees every service in the catalog and can call them by name — no accounts, no API keys to manage.

<Tabs>
  <TabItem value="claude" label="Claude Code" default>

```bash
claude mcp add bankofai -s user -- npx @bankofai/mcp-catalog
```

  </TabItem>
  <TabItem value="other" label="Other MCP Agents">

Also works with OpenAI Codex, Cursor, Continue, and any MCP-compatible Agent: add a server named `bankofai` to its MCP configuration, with the startup command:

```bash
npx @bankofai/mcp-catalog
```

  </TabItem>
</Tabs>

Once installed, just tell your Agent what you want in plain language — for example, "find a weather API and look up the current weather in Shanghai." The Agent finds the service in the catalog, gets a quote, pays on-chain with the wallet, and brings back the result — discovery, payment, and the call all happen automatically.

## Calling from the command line (optional)

If you prefer the terminal, `x402-cli` offers the same capabilities: search, inspect, and make paid calls directly.

Search by name or keyword to see what's in the catalog:

```bash
x402-cli catalog search weather --catalog https://catalog.bankofai.io/api/catalog.json --json
```

Inspect a service's details and available endpoints:

```bash
x402-cli catalog show acme-weather --catalog https://catalog.bankofai.io/api/catalog.json --json
x402-cli catalog endpoints acme-weather --catalog https://catalog.bankofai.io/api/catalog.json --json
```

Then make a paid call against the target endpoint — quote, payment, and result retrieval in one step:

```bash
x402-cli pay 'https://gateway.bankofai.io/providers/acme-weather/v1/current?city=Shanghai'
```

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

:::tip Free endpoints
Not every call costs money: endpoints the provider leaves unpriced charge you nothing — there's no quote step, the result comes straight back, and your wallet is never debited.
:::

## Next steps

- Browse every service, or learn the response structures → [Data Format & API Reference](./reference.md)
- Have an API you'd like to list and monetize? → [List Your Service](./list-your-service.md)
