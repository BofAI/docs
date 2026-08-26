---
title: 'SDK Feature Matrix'
description: 'Feature support matrix for the x402 TypeScript SDK, published as granular @bankofai/x402-* packages.'
---

# SDK Feature Matrix

This page tracks the feature support of the x402 SDK.

> **SDK (TypeScript-only)**: x402 is a **TypeScript-only** SDK published as granular `@bankofai/x402-*` npm packages. The source is maintained in a pnpm/turbo monorepo, but applications should depend on the published packages. The previous-generation Python + TypeScript SDK lives under `legacy/` for reference.
>
> **Current release: 1.1.0** (2026-08-25). All 11 `@bankofai/x402-*` packages ship together and pin their internal dependencies to `~1.1.0`, so upgrade them as a set. The SDK requires **Node.js 22+**.

---

## Packages

| Package | Purpose |
|---------|---------|
| `@bankofai/x402-core` | Protocol types, client/facilitator/server engines, `HTTPFacilitatorClient`, observability |
| `@bankofai/x402-evm` | EVM mechanism: `exact`, `upto`, `batch-settlement` |
| `@bankofai/x402-tron` | TRON mechanism: `exact`, `upto`, `batch-settlement`, `exact_gasfree` |
| `@bankofai/x402-fetch` | Wrapped-`fetch` client (`wrapFetchWithPayment`) |
| `@bankofai/x402-express` | Express server middleware |
| `@bankofai/x402-hono` | Hono server middleware |
| `@bankofai/x402-fastify` | Fastify server middleware |
| `@bankofai/x402-next` | Next.js server middleware |
| `@bankofai/x402-axios` | Axios client wrapper |
| `@bankofai/x402-mcp` | MCP transport (client + server) for AI agents |
| `@bankofai/x402-extensions` | Extensions: gas-sponsoring, payment-identifier, bazaar, sign-in-with-x, offer-receipt, builder-code |

---

## Core Components

| Component | Status |
|------------|--------|
| Resource Server | ✅ |
| Client | ✅ |
| Facilitator | ✅ |

### HTTP Framework Integration

| Role | Frameworks |
|------|------------|
| Server | Express, Fastify, Hono, Next.js |
| Client | `fetch` (wrapped), Axios, MCP |

---

## Networks

| Network | SDK Constant | Status |
|-----------|--------------|--------|
| `tron:0x2b6653dc` | `TRON_MAINNET` | ✅ |
| `tron:0xcd8690dc` | `TRON_NILE` | ✅ |
| `tron:0x94a9059e` | `TRON_SHASTA` | ✅ |
| `eip155:56` (BSC Mainnet) | - | ✅ |
| `eip155:97` (BSC Testnet) | - | ✅ |
| `eip155:8453` (Base Mainnet) | - | ✅ |
| `eip155:84532` (Base Sepolia) | - | ✅ (CLI/SDK testing) |

> Around 20 further upstream EVM chains (MegaETH, Monad, Polygon, Arbitrum One/Sepolia, Celo, XDC, Flare, Mezo, Radius, Stable, ADI, HPP, Igra, …) are also wired into the EVM default-asset registry. The public API Catalog publishes Base Mainnet routes only; Base Sepolia remains available for CLI/SDK testing.

---

## Payment Schemes

x402 supports four payment schemes. Each is implemented as a client + server + facilitator trio per chain family.

| Scheme | EVM | TRON | Description |
|--------|-----|------|-------------|
| `exact` | ✅ | ✅ | Pay the exact amount. ERC-3009 `transferWithAuthorization` (gasless) or Permit2 (one-time `approve(Permit2)`) for plain ERC-20s. |
| `upto` | ✅ | ✅ | Usage-based billing — the client signs a Permit2 authorization for up to a maximum; the server settles only the real usage (≤ max). |
| `batch-settlement` | ✅ | ✅ | Payment-channel: deposit once on-chain, then pay many requests with off-chain vouchers; the facilitator claims a batch and settles in one tx. Includes a refund path. |
| `exact_gasfree` | ❌ | ✅ | TRON-only. Pay with USDT/USDD **without holding TRX for gas** — a relayer pays the on-chain energy via the GasFree API. |

### Payment flows (new in 1.1.0)

A scheme/network server now declares which payment flows it supports per asset-transfer method. `upfront` and `escrow` travel on the wire as `extra.paymentFlow`; `authorization` is the default and is omitted from `extra` — its absence is the signal:

| Flow | What it means |
|------|---------------|
| `authorization` | The client signs an authorization and the facilitator pulls the funds at settlement — the classic `exact` / `upto` behavior, and the default. |
| `upfront` | The client moves the funds before the resource is served. |
| `escrow` | Funds are locked in escrow first, then captured, voided, or refunded later, instead of moving straight to the seller. |

Legacy v1.0 `SchemeNetworkServer` implementations may omit their payment-flow declaration; they continue to use the authorization flow.

`upfront` and `escrow` are orchestration hooks for custom schemes. As of 1.1.0 every built-in server scheme (`exact`, `upto`, `batch-settlement`, `exact_gasfree`) declares `authorization` only, so `extra.paymentFlow` does not appear on the wire with the shipped schemes.

> **x402 Foundation v2 compatibility**: The `exact` scheme (EVM and TRON) conforms to the v2 wire format published by the **x402 Foundation**. Stock v2 clients interoperate with this SDK's server and vice versa. See [Network & Token Support → `exact` Scheme](./core-concepts/network-and-token-support.md#exact-scheme) for details.

---

## Signers

Key custody is in [`@bankofai/agent-wallet`](https://github.com/BofAI/agent-wallet); the SDK never sees a raw private key. The signer factories build the chain client (viem / TronWeb) internally.

| Signer factory | Role |
|----------|------|
| `createClientTronSigner` | Client (TRON) |
| `createClientEvmSigner` | Client (EVM) |
| `createFacilitatorTronSigner` | Facilitator (TRON) |
| `createFacilitatorEvmSigner` | Facilitator (EVM) |
| `createAuthorizerTronSigner` | Authorizer (TRON, batch-settlement) |
| `createAuthorizerEvmSigner` | Authorizer (EVM, batch-settlement) |

---

## Client Features

| Feature | Status |
|------------|--------|
| Automatic 402 handling (`wrapFetchWithPayment`) | ✅ |
| Automatic Permit2 / token approval | ✅ |
| Allowance check | ✅ |
| Signing (TRON, TIP-712) | ✅ |
| Signing (EVM, EIP-712) | ✅ |
| Balance-aware payment selection (`filterAffordableRequirements`) | ✅ |
| Cheapest-token selection strategy | ✅ |
| GasFree (zero-gas TRON payments) | ✅ |
| Spend controls (default-asset allowlist + per-payment cap) | ✅ — **on by default since 1.1.0** |
| Per-asset atomic caps (`allowedAssets[].maxAmountPerPayment`) | ✅ |
| Payment-selection policies (`PaymentPolicy`) | ✅ |
| Lifecycle hooks (`onBeforePaymentCreation`, `onAfterPaymentCreation`, `onPaymentCreationFailure`, `onPaymentResponse`) | ✅ |

:::caution Spend controls are on by default
Since 1.1.0 a client will only pay assets it recognizes from the default-asset registry, and caps each payment at `DEFAULT_MAX_AMOUNT_PER_PAYMENT` (`$1` worth). To pay more than that, raise the cap with `spendControls.maxAmountPerPayment` (a `Money` value, or `false` to remove it). To pay a custom token, list it under `spendControls.allowedAssets` — optionally with its own `maxAmountPerPayment`, which must be an integer atomic amount rather than a dollar value — or set `allowedAssets: true` to allow any asset. `spendControls: false` turns the guard off entirely.
:::

---

## Server Features

| Feature | Status |
|------------|--------|
| Protected-route integration | ✅ (`paymentMiddlewareFromHTTPServer`, `x402HTTPResourceServer`) |
| Multi-chain `accepts` advertisement | ✅ |
| Gas-sponsoring extension (Permit2 approve) | ✅ |
| Payment verification (via facilitator) | ✅ |
| Payment settlement (via facilitator) | ✅ |

---

## Facilitator Features

| Feature | Status |
|------------|--------|
| `POST /verify` endpoint | ✅ |
| `POST /settle` endpoint | ✅ |
| `GET /supported` endpoint | ✅ |
| Submit on-chain transaction | ✅ |
| Confirm transaction (receipt polling) | ✅ |
| Extension hooks (`onBeforeSettle` / `onAfterSettle` / `onSettleFailure`) | ✅ |
| EVM smart accounts — deployed accounts, ERC-7702 delegation, ERC-6492 counterfactual wallets | ✅ — signature verification is facilitator-side; ERC-6492 requires an explicit `eip6492AllowedFactories` allowlist |

> The self-hosted example facilitator (`facilitator/basic`) exposes `/verify`, `/settle`, `/supported`. The official hosted facilitator additionally offers the settlement-record queries `GET /payments/tx/{tx_hash}` and `GET /payments`, plus `/health` — see [Official Facilitator](./core-concepts/OfficialFacilitator.md). Prometheus metrics are served on a separate monitoring port (`9001` in the shipped configs), not on the public API base. There is no `/fee/quote` endpoint: the SDK schemes carry no facilitator fee.
>
> `HTTPFacilitatorClient` uses typed timeout errors, rate-limit retries, and a 90-second default timeout since 1.1.0.

---

## Supported Tokens

| Token | Network | Status |
|--------|---------|--------|
| USDT (TRC-20) | `tron:0x2b6653dc`, `tron:0xcd8690dc`, `tron:0x94a9059e` | ✅ |
| USDD (TRC-20) | `tron:0x2b6653dc`, `tron:0xcd8690dc` | ✅ |
| USDT (BEP-20) | `eip155:56`, `eip155:97` | ✅ |
| USDC (BEP-20) | `eip155:56`, `eip155:97` | ✅ |
| DHLU (BSC testnet, ERC-3009) | `eip155:97` | ✅ |
| Official USDC (ERC-20, EIP-3009) | `eip155:8453`, `eip155:84532` | ✅ |
| Custom TRC-20 / BEP-20 | any | ✅ (via token registry / `EVM_TOKENS` config) |

> Only some of these are **default assets**: USDT on TRON and BSC Mainnet, USDC on BSC Testnet and Base. Since 1.1.0 a client's spend controls reject every other asset — USDD, BSC Mainnet USDC, BSC Testnet USDT, DHLU, custom tokens — unless it is allowlisted via `spendControls.allowedAssets`. See [Network & Token Support](./core-concepts/network-and-token-support.md#supported-tokens).

---

## Observability

All `@bankofai/x402-*` packages write through one process-global logger from `@bankofai/x402-core`. Call `setLogger(...)` once at startup to redirect logs to a file, `pino`/`winston`, or `noopLogger` to silence.

---

## Legend

- ✅ = Implemented
- ⏳ = Planned / In Progress
- ❌ = Not Planned
