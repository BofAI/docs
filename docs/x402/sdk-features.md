---
title: 'SDK Feature Matrix'
description: 'Feature support matrix for the x402 TypeScript SDK (1.0.0), published as granular @bankofai/x402-* packages.'
---

# SDK Feature Matrix

This page tracks the feature support of the x402 SDK.

> **SDK 1.0.0 (TypeScript-only)**: x402 is a **TypeScript-only** pnpm/turbo monorepo published as granular `@bankofai/x402-*` packages. The `core` and EVM mechanism fork the [`x402-foundation/x402`](https://github.com/x402-foundation/x402) upstream; the TRON mechanism is in-house. The previous-generation Python + TypeScript SDK lives under `legacy/` for reference.

---

## Packages

| Package | Purpose |
|---------|---------|
| `@bankofai/x402-core` | Protocol types, client/facilitator/server engines, `HTTPFacilitatorClient`, observability |
| `@bankofai/x402-evm` | EVM mechanism: `exact`, `upto`, `batch-settlement`, `auth-capture` |
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

| Network | Status |
|-----------|--------|
| `tron:mainnet` | ✅ |
| `tron:nile` | ✅ |
| `tron:shasta` | ✅ |
| `eip155:56` (BSC Mainnet) | ✅ |
| `eip155:97` (BSC Testnet) | ✅ |

> Upstream EVM chains (Base, Base Sepolia, MegaETH, Monad, Hyperliquid) are also wired in the EVM default-asset registry. Adding a chain is a config-table edit in the examples — no SDK changes.

---

## Payment Schemes

x402 1.0.0 supports five payment schemes. Each is implemented as a client + server + facilitator trio per chain family.

| Scheme | EVM | TRON | Description |
|--------|-----|------|-------------|
| `exact` | ✅ | ✅ | Pay the exact amount. ERC-3009 `transferWithAuthorization` (gasless) or Permit2 (one-time `approve(Permit2)`) for plain ERC-20s. |
| `upto` | ✅ | ✅ | Usage-based billing — the client signs a Permit2 authorization for up to a maximum; the server settles only the real usage (≤ max). |
| `batch-settlement` | ✅ | ✅ | Payment-channel: deposit once on-chain, then pay many requests with off-chain vouchers; the facilitator claims a batch and settles in one tx. Includes a refund path. |
| `auth-capture` | ✅ | ❌ | Escrow-style authorization capture (EVM only). |
| `exact_gasfree` | ❌ | ✅ | TRON-only. Pay with USDT/USDD **without holding TRX for gas** — a relayer pays the on-chain energy via the GasFree API. |

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

---

## Server Features

| Feature | Status |
|------------|--------|
| Protected-route integration | ✅ (`paymentMiddlewareFromHTTPServer`, `x402HTTPResourceServer`) |
| Multi-chain `accepts` advertisement | ✅ |
| Gas-sponsoring extension (Permit2 approve) | ✅ |
| Payment verification (via facilitator) | ✅ |
| Payment settlement (via facilitator) | ✅ |
| Fee support | ✅ |

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

> The self-hosted example facilitator (`facilitator/basic`) exposes `/verify`, `/settle`, `/supported`. The official hosted facilitator additionally offers `/fee/quote` and `/payments/{id}` query endpoints — see [Official Facilitator](./core-concepts/OfficialFacilitator.md).

---

## Supported Tokens

| Token | Network | Status |
|--------|---------|--------|
| USDT (TRC-20) | `tron:mainnet`, `tron:nile` | ✅ |
| USDD (TRC-20) | `tron:mainnet`, `tron:nile` | ✅ |
| USDT (BEP-20) | `eip155:56`, `eip155:97` | ✅ |
| USDC (BEP-20) | `eip155:56`, `eip155:97` | ✅ |
| DHLU (BSC testnet, ERC-3009) | `eip155:97` | ✅ |
| Custom TRC-20 / BEP-20 | any | ✅ (via token registry / `EVM_TOKENS` config) |

---

## Observability

All `@bankofai/x402-*` packages write through one process-global logger from `@bankofai/x402-core`. Call `setLogger(...)` once at startup to redirect logs to a file, `pino`/`winston`, or `noopLogger` to silence.

---

## Legend

- ✅ = Implemented
- ⏳ = Planned / In Progress
- ❌ = Not Planned
