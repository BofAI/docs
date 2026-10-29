---
title: Gateway
sidebar_label: Gateway
description: The Gateway turns any API into a pay-per-call service for AI Agents — Agents discover, call, and pay on their own, with every call settled on-chain to your wallet.
---

import ThemedImage from '@theme/ThemedImage';

# Gateway

Turn any API into a pay-per-call service for AI Agents.

The Gateway sits in front of your API and handles payment: AI Agents discover, call, and pay for it on their own. Every call settles on-chain, with funds going straight to the wallet you designate. Your existing API stays exactly as it is — no code changes.

:::tip
Ready to dive in? Jump to [List your API](../api-catalog/list-your-service.md); want to see what's live first, go [browse the API Catalog](../api-catalog/index.md).
:::

## How it works

Think of the gateway as a **cashier + relay** standing in front of your API (technically, a reverse proxy):

- **Agents only ever hit the gateway address** (like `https://x402-gateway.bankofai.io/providers/<gateway-provider-id>/v1/...`, where the id comes from the catalog entry's `url` — it is not the catalog FQN) — they never reach your upstream API directly.
- **The gateway forwards requests.** Once payment is verified (or the endpoint is free), it proxies the request upstream and returns the upstream response body to the Agent unchanged — a fixed set of response headers is stripped — hop-by-hop headers plus `set-cookie`, `authorization`, `content-encoding`, `content-length` and every x402 payment header (so an upstream `PAYMENT-RESPONSE` never leaks through) — and a `PAYMENT-RESPONSE` header is added, and an operator can configure a response contract that turns an upstream `200` carrying a business error into a gateway error.
- **Never a wallet private key.** Settlement uses a wallet **address** only; callers pay on-chain from their own wallets. Neither side of the gateway ever touches a private key.
- **Upstream keys stay isolated.** If your upstream API needs auth, that API key lives only on the side running the gateway — in your local YAML / env for a self-hosted gateway, or held by us for the official gateway. Either way the caller never sees it, and it never enters the public catalog.
- **You decide pricing per endpoint.** Price an endpoint in the config and it takes the paid flow; leave it unpriced (price 0) and it's forwarded directly — free endpoints stay free.

<ThemedImage
  alt="Gateway topology: Agent to gateway to your upstream API"
  sources={{
    light: '/img/diagrams/x402-gateway-topology.light.svg',
    dark: '/img/diagrams/x402-gateway-topology.svg',
  }}
/>

## Anatomy of a call

### Paid endpoints: the HTTP 402 flow

Every paid call clears on-chain via x402 — the price in the response is always the single source of truth.

1. **Agent calls** — requests the target endpoint.
2. **Gateway quotes** — returns the price (HTTP `402`).
3. **Wallet authorizes** — the client signs the selected payment requirement and retries with a `PAYMENT-SIGNATURE` header.
4. **Verified & settled** — the facilitator verifies the signed payload and settles the payment on-chain to your payout wallet.
5. **Response returns** — the gateway forwards the request upstream and returns the result to the Agent.

### Free endpoints: straight pass-through

Unpriced endpoints skip the quote step entirely and trigger no on-chain transaction:

1. **Agent calls** — requests the target endpoint.
2. **Gateway forwards** — proxies upstream and returns the result.

That means one service can mix paid and free endpoints — say `/v1/current` billed per call while `/v1/ping` stays free. An Agent tells them apart from the endpoint's `metered` flag and `min_price_usd` in the catalog output (there is no separate free-endpoint marker). Every endpoint published in the catalog today is metered, so this is a gateway capability rather than something the current listings demonstrate.

:::note
Paid or free, the caller gets access by paying on-chain and needs no API key; any upstream credentials stay gateway-side and the calling Agent can never touch them.
:::

## Built for both sides

Providers turn calls into cash flow. Agents turn calls into capabilities. The gateway is the bridge.

### For API providers: list your API, earn on every call

- **Straight to your wallet** — payments settle to your payout wallet in real time; no platform escrow, no payout cycle.
- **Native multi-chain** — settle on TRON, BNB Chain, or Base Mainnet, according to the provider's published route.
- **Zero-touch onboarding** — your existing API stays exactly as it is, not one line changes.
- **You set the price** — flexible per-endpoint, per-tier pricing; free routes stay free.

→ [List your API](../api-catalog/list-your-service.md)

### For AI Agents: one catalog, many APIs, pay as you go

- **CLI discovery today** — `wallet-cli x402 provider-list` / `provider-show` / `endpoint-list` find the right API and its routes. Paying over MCP is supported via `@x402/mcp`; catalog-aware MCP discovery is not shipped yet.
- **Per-call pricing** — no subscriptions, no minimums.
- **Live price transparency** — the gateway returns the computed price in its `402` response, and the client's authorization binds the selected payment requirement. The quote itself is not a gateway cryptographic signature.
- **No accounts, no keys** — your wallet is your identity; nothing to register or manage.

→ [Browse the API Catalog](../api-catalog/index.md)

## How to plug your API in

Three steps to launch — your API stays untouched:

1. **Pick a gateway** — use BANK OF AI's hosted gateway, or run your own (differences below).
2. **Set your price list** — decide the endpoints, per-endpoint pricing, and the payout wallet; no SDK to install, no code to rewrite.
3. **Get listed** — submit two public files to the catalog repository (or start with the application form and we'll help you through). Once your service appears in the [API Catalog](../api-catalog/index.md), any Agent can discover it, call it, and pay automatically.

Full steps: [List Your Service](../api-catalog/list-your-service.md).

### Official gateway, or run your own?

- **Official gateway (hosted)**: BANK OF AI runs the gateway, proxies your API, and handles payment — you deploy nothing; the call addresses in your listing files use the official domain (like `x402-gateway.bankofai.io/providers/<gateway-provider-id>`).
- **Run your own**: deploy the gateway on your own machine; upstream credentials and payout config stay local; the call addresses in your listing files use your own domain. For providers who want full control over credentials and infrastructure. Setup steps: [Run your own gateway](#run-your-own-gateway).

Either way, the calling Agent's experience is identical: discovery, quoting, payment, and the call all follow the same x402 flow.

:::note Why list in the catalog if I run my own gateway?
The gateway and the catalog solve two different problems: **the gateway collects the money; the catalog gets you discovered.** The catalog is just a public list of services — it never touches calls or funds. What Agents call is always the gateway address registered in the catalog; with a self-hosted gateway that's your own domain, so traffic and funds go straight to you. The point of listing: every Agent, CLI user, and catalog visitor plugged into the BANK OF AI catalog can discover and call your service — not just the people who happen to know your domain.
:::

## Run your own gateway

These steps use gateway release **v1.0.4**, published as the Docker image `bankofai/x402-gateway:v1.0.4`. The npm package `@bankofai/x402-gateway` is still at 1.0.2, which predates the decimal TRON network IDs used in these docs, so run the image rather than the npm package. Full reference: [x402-gateway v1.0.4 README](https://github.com/BofAI/x402-gateway/blob/v1.0.4/README.md).

### 1. Write a provider file

Each provider lives in its own directory as `provider.yml` (or `provider.yaml`), for example `providers/example/provider.yml`:

```yaml
name: example-provider
forward_url: ${X402_PROVIDER_FORWARD_URL}

operator:
  network: tron:3448148188        # TRON Nile; mainnet is tron:728126428
  currencies:
    usd: ["USDT"]
  recipient: ${X402_PROVIDER_RECIPIENT}
  scheme: exact
  protocol: exact
  facilitator_url: ${X402_FACILITATOR_URL}
  facilitator_api_key_env: X402_FACILITATOR_API_KEY
  valid_for_seconds: 300

endpoints:
  - method: GET
    path: /v1/ping
    metering:
      dimensions:
        - tiers:
            - price_usd: 0.002
```

- `network` must be a decimal CAIP-2 ID. Aliases such as `tron:nile` are rejected.
- `recipient` is your payout **address**. The gateway never needs a private key.
- Endpoints without `metering` are forwarded for free.
- If your upstream needs an API key, add a `routing.auth` block that reads it from an environment variable. See the README's *Provider Config* section.

### 2. Set the environment

Put the values the YAML references in a `.env` file next to the `providers/` directory:

```bash
X402_PROVIDER_FORWARD_URL=https://api.example.com
X402_PROVIDER_RECIPIENT=<your-payout-address>
X402_FACILITATOR_URL=https://facilitator.bankofai.io
X402_FACILITATOR_API_KEY=<facilitator-api-key>
X402_GATEWAY_ADMIN_TOKEN=<admin-token>
X402_GATEWAY_PUBLIC_BASE_URL=https://gateway.example.com
```

`X402_GATEWAY_PUBLIC_BASE_URL` is the public origin Agents call. It is also the base of the addresses you publish in the catalog. Because `facilitator_api_key_env` is set, the gateway refuses to start without `X402_FACILITATOR_API_KEY`. For the facilitator's API key, see [Official Facilitator](./OfficialFacilitator.md).

### 3. Validate the configuration

```bash
docker run --rm --env-file .env \
  -v "$PWD/providers:/app/providers:ro" \
  bankofai/x402-gateway:v1.0.4 \
  x402-gateway check --providers /app/providers
```

`check` validates YAML syntax, required fields, environment expansion, network IDs and endpoint shape. It does not call your upstream, the facilitator or the chain.

### 4. Start the gateway

```bash
docker run -d --name x402-gateway --env-file .env \
  -p 4020:8080 \
  -v "$PWD/providers:/app/providers:ro" \
  bankofai/x402-gateway:v1.0.4
```

The image listens on `0.0.0.0:8080` inside the container. For production, pin the image by digest instead of tag, as the README recommends.

### 5. Check health and the payment challenge

```bash
curl http://127.0.0.1:4020/__402/health
curl -i http://127.0.0.1:4020/providers/example-provider/v1/ping
```

The `curl -i` request to the metered endpoint should return `402 Payment Required` with a `PAYMENT-REQUIRED` header. The provider path segment is the `name` field from the YAML. Once both checks pass and the public URL is reachable, continue with [List Your Service](../api-catalog/list-your-service.md).

## Next steps

- [List your API](../api-catalog/list-your-service.md) — submission flow, required info, and security red lines
- [Browse the API Catalog](../api-catalog/index.md) — see what's already live
- [API Catalog · Get Started](../api-catalog/get-started.md) — onboard from the caller's perspective
