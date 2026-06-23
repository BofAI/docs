---
title: Gateway
sidebar_label: Gateway
description: The Gateway turns any API into a pay-per-call service for AI Agents — Agents discover, call, and pay on their own, with every call settled on-chain to your wallet.
---

# Gateway

Turn any API into a pay-per-call service for AI Agents.

The Gateway sits in front of your API and handles payment: AI Agents discover, call, and pay for it on their own. Every call settles on-chain, with funds going straight to the wallet you designate. Your existing API stays exactly as it is — no code changes.

:::tip
Ready to dive in? Jump to [List your API](../api-catalog/list-your-service.md); want to see what's live first, go [browse the API Catalog](../api-catalog/index.md).
:::

## How it works

Think of the gateway as a **cashier + relay** standing in front of your API (technically, a reverse proxy):

- **Agents only ever hit the gateway address** (like `https://gateway.../providers/<fqn>/v1/...`) — they never reach your upstream API directly.
- **The gateway forwards requests.** Once payment is verified (or the endpoint is free), it proxies the request upstream and returns the upstream result to the Agent untouched.
- **Credential isolation.** Upstream API keys and other sensitive config live only in the gateway-side `provider.yml` or environment variables — callers never touch them.
- **You decide pricing per endpoint.** Price an endpoint in the config and it takes the paid flow; leave it unpriced (price 0) and it's forwarded directly — free endpoints stay free.

```text
Agent ──► Gateway ──► your upstream API
          │ quote / verify / settle (paid endpoints only)
          └ forwards requests, holds upstream keys for you
```

## Anatomy of a call

### Paid endpoints: the HTTP 402 flow

Every paid call clears on-chain via x402 — the price in the response is always the single source of truth.

1. **Agent calls** — requests the target endpoint.
2. **Gateway quotes** — returns the price (HTTP `402`).
3. **Wallet pays** — the Agent pays on-chain.
4. **Verified & settled** — funds settle to your payout wallet.
5. **Response returns** — the gateway forwards the request upstream and returns the result to the Agent.

### Free endpoints: straight pass-through

Unpriced endpoints skip the quote step entirely and trigger no on-chain transaction:

1. **Agent calls** — requests the target endpoint.
2. **Gateway forwards** — proxies upstream and returns the result.

That means one service can mix paid and free endpoints — say `/v1/current` billed per call while `/v1/ping` stays free. Free endpoints are flagged in the catalog, so Agents can see at a glance which capabilities cost nothing.

:::note
Paid or free, upstream credentials never leave the gateway — the calling Agent can't touch a single key.
:::

## Built for both sides

Providers turn calls into cash flow. Agents turn calls into capabilities. The gateway is the bridge.

### For API providers: list your API, earn on every call

- **Straight to your wallet** — payments settle to your payout wallet in real time; no platform escrow, no payout cycle.
- **Native multi-chain** — settle on TRON or BNB Chain, the provider's choice.
- **Zero-touch onboarding** — your existing API stays exactly as it is, not one line changes.
- **You set the price** — flexible per-endpoint, per-tier pricing; free routes stay free.

→ [List your API](../api-catalog/list-your-service.md)

### For AI Agents: one catalog, many APIs, pay as you go

- **MCP-native discovery** — find the right API and call it by name.
- **Per-call pricing** — no subscriptions, no minimums.
- **Live price transparency** — every call's price is signed by the gateway in real time; the quote is what you pay.
- **No accounts, no keys** — your wallet is your identity; nothing to register or manage.

→ [Browse the API Catalog](../api-catalog/index.md)

## How to plug your API in

Three steps to launch — your API stays untouched:

1. **Pick a gateway** — use BANK OF AI's hosted gateway, or run your own (differences below).
2. **Set your price list** — decide the endpoints, per-endpoint pricing, and the payout wallet; no SDK to install, no code to rewrite.
3. **Get listed** — submit two public files to the catalog repository (or start with the application form and we'll help you through). Once your service appears in the [API Catalog](../api-catalog/index.md), any Agent can discover it, call it, and pay automatically.

Full steps: [List Your Service](../api-catalog/list-your-service.md).

### Official gateway, or run your own?

- **Official gateway (hosted)**: BANK OF AI runs the gateway, proxies your API, and handles payment — you deploy nothing; the call addresses in your listing files use the official domain (like `gateway.bankofai.io/providers/<fqn>`).
- **Run your own**: deploy the gateway on your own machine; upstream credentials and payout config stay local; the call addresses in your listing files use your own domain. For providers who want full control over credentials and infrastructure.

Either way, the calling Agent's experience is identical: discovery, quoting, payment, and the call all follow the same x402 flow.

:::note Why list in the catalog if I run my own gateway?
The gateway and the catalog solve two different problems: **the gateway collects the money; the catalog gets you discovered.** The catalog is just a public list of services — it never touches calls or funds. What Agents call is always the gateway address registered in the catalog; with a self-hosted gateway that's your own domain, so traffic and funds go straight to you. The point of listing: every Agent, CLI user, and catalog visitor plugged into the BANK OF AI catalog can discover and call your service — not just the people who happen to know your domain.
:::

## Next steps

- [List your API](../api-catalog/list-your-service.md) — submission flow, required info, and security red lines
- [Browse the API Catalog](../api-catalog/index.md) — see what's already live
- [API Catalog · Get Started](../api-catalog/get-started.md) — onboard from the caller's perspective
