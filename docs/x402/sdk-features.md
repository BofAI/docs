---
title: 'SDK Feature Matrix'
description: 'Feature support matrix for the x402 TypeScript SDK: the @bankofai/x402-tron and @bankofai/x402-tron-extensions packages on official @x402/* Core.'
---

# SDK Feature Matrix

This page tracks the feature support of the x402 SDK.

> **SDK (TypeScript-only)**: x402 is a **TypeScript-only** SDK. It publishes the TRON mechanism and the TRON resource-sponsoring extension as the `@bankofai/x402-tron` and `@bankofai/x402-tron-extensions` npm packages and builds on the official x402 Foundation `@x402/*` packages for Core, EVM, the HTTP/MCP integrations and the generic extensions. The source is maintained in a pnpm/turbo monorepo, but applications should depend on the published packages. The previous-generation Python + TypeScript SDK archive (`legacy/`) was removed from the repository in 2.0.0, and the `typescript/packages/legacy/` compatibility packages in 2.1.0.
>
> **Current release: 2.1.0** (2026-10-23). The payment call chain now runs on official `@x402/core` `2.28.0`, which `@bankofai/x402-tron` `2.1.0` declares as an exact peer dependency; use the matching official HTTP/MCP integration (`@x402/fetch`, `@x402/axios`, `@x402/express`, `@x402/fastify`, `@x402/hono`, `@x402/next` or `@x402/mcp`, all `2.28.0`). TRON resource sponsoring moved to the separate `@bankofai/x402-tron-extensions` `2.1.0`, which pins the exact mechanism version — upgrade the two TRON packages together. EVM uses official `@x402/evm` `2.28.0` and the generic extensions official `@x402/extensions` `2.28.0`; the local EVM package and `@bankofai/x402-extensions` were removed. `@bankofai/x402-core` and the `@bankofai/x402-*` HTTP/MCP adapters built on it are not interchangeable with the 2.1 mechanism — new TRON integrations use official Core and adapters. Upgrading from 2.0 is a source migration; see the [TRON 2.1 migration guide](https://github.com/BofAI/x402/blob/main/docs/migrations/tron-2.1.md). The SDK requires **Node.js 24.22.1+**; the runnable examples use `@bankofai/agent-wallet` **3.0+**.

---

## Packages

| Package | Purpose |
|---------|---------|
| `@bankofai/x402-tron` | TRON mechanism: `exact`, `upto`, `batch-settlement`, `exact_gasfree`; TRON signer factories, `/rpc` and `/transactions` utilities, TRON logger |
| `@bankofai/x402-tron-extensions` | TRON approval resource sponsoring (`trc20ApprovalResourceSponsoring`): declaration, client pre-signing extension, facilitator runtime and coordinator — moved here in 2.1.0 |
| `@x402/core` (official) | Protocol types, client/facilitator/server engines, `HTTPFacilitatorClient` |
| `@x402/evm` (official) | EVM mechanism: `exact`, `upto`, `batch-settlement`, plus the `auth-capture` client (`@x402/evm/auth-capture/client` — no server or facilitator export) |
| `@x402/fetch` (official) | Wrapped-`fetch` client (`wrapFetchWithPayment`) |
| `@x402/express` (official) | Express server middleware |
| `@x402/hono` (official) | Hono server middleware |
| `@x402/fastify` (official) | Fastify server middleware |
| `@x402/next` (official) | Next.js server middleware |
| `@x402/axios` (official) | Axios client wrapper |
| `@x402/mcp` (official) | MCP transport (client + server) for AI agents |
| `@x402/extensions` (official) | Generic extensions: EVM gas-sponsoring (`eip2612GasSponsoring`, `erc20ApprovalGasSponsoring`), payment-identifier, bazaar, sign-in-with-x, offer-receipt, builder-code |

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
| `tron:728126428` | `TRON_MAINNET` | ✅ |
| `tron:3448148188` | `TRON_NILE` | ✅ |
| `tron:2494104990` | `TRON_SHASTA` | ✅ |
| `eip155:56` (BSC Mainnet) | - | ✅ (explicit asset only) |
| `eip155:97` (BSC Testnet) | - | ✅ (explicit asset only) |
| `eip155:8453` (Base Mainnet) | - | ✅ |
| `eip155:84532` (Base Sepolia) | - | ✅ (CLI/SDK testing) |

> **TRON ID format**: since `@bankofai/x402-tron` 2.0.0 the SDK constants use decimal CAIP-2 references. The older hexadecimal forms (`tron:0x2b6653dc`, `tron:0xcd8690dc`, `tron:0x94a9059e`) are still accepted as input aliases and are normalized to the decimal form. The official facilitator reports the decimal identifiers in `/supported`; the API Catalog still lists the hexadecimal forms.

> EVM support comes from the official `@x402/evm` 2.28.0. Its default-asset registry covers Base, Base Sepolia, Ethereum, Polygon, Arbitrum One/Sepolia, Avalanche, Celo, Sei, MegaETH, Monad, Stable, XDC, Flare, Mezo, Radius, ADI, HPP, Igra and others — but **not BSC**. On BSC, price a route with an explicit `{ asset, amount, extra }` object (a `$` price fails with `No default asset configured for network eip155:56`), and clients must allowlist the asset in `spendControls.allowedAssets`. The public API Catalog publishes Base Mainnet routes only; Base Sepolia remains available for CLI/SDK testing.

---

## Payment Schemes

x402 defines five named payment schemes. Four ship as a client + server + facilitator trio per chain family; `auth-capture` currently ships an EVM client implementation only.

| Scheme | EVM | TRON | Description |
|--------|-----|------|-------------|
| `exact` | ✅ | ✅ | Pay the exact amount. ERC-3009 `transferWithAuthorization` (gasless) or Permit2 (one-time `approve(Permit2)`) for plain ERC-20s. |
| `upto` | ✅ | ✅ | Usage-based billing — the client signs a Permit2 authorization for up to a maximum; the server settles only the real usage (≤ max). |
| `batch-settlement` | ✅ | ✅ | Payment-channel: deposit once on-chain, then pay many requests with off-chain vouchers; the facilitator claims a batch and settles in one tx. Includes a refund path. |
| `exact_gasfree` | ❌ | ✅ | TRON-only. Pay with USDT/USDD **without holding TRX for gas** — a relayer pays the on-chain energy via the GasFree API. |
| `auth-capture` | ⚠️ Client only | ❌ | Refundable Base Commerce Payments authorization/capture flow. The published package does not yet include its server or facilitator implementation. |

### Payment flows (new in 1.1.0)

A scheme/network server now declares which payment flows it supports per asset-transfer method. `upfront` and `escrow` travel on the wire as `extra.paymentFlow`; `authorization` is the default and is omitted from `extra` — its absence is the signal:

| Flow | What it means |
|------|---------------|
| `authorization` | The client signs an authorization and the facilitator pulls the funds at settlement — the classic `exact` / `upto` behavior, and the default. |
| `upfront` | The client moves the funds before the resource is served. |
| `escrow` | Funds are locked in escrow first, then captured, voided, or refunded later, instead of moving straight to the seller. |

Legacy v1.0 `SchemeNetworkServer` implementations may omit their payment-flow declaration; they continue to use the authorization flow.

The TRON server schemes (`exact`, `upto`, `batch-settlement`, `exact_gasfree`) and the EVM `upto` and `batch-settlement` schemes declare `authorization` only. The official EVM `exact` scheme (`@x402/evm`) also supports `upfront`, for both `eip3009` and `permit2`: a route opts in by setting `extra: { paymentFlow: "upfront" }` on that payment option, and only then does `extra.paymentFlow` appear on the wire. No shipped scheme declares `escrow`; it remains a hook for custom schemes.

> **x402 Foundation v2 compatibility**: The `exact` scheme (EVM and TRON) conforms to the v2 wire format published by the **x402 Foundation**. Stock v2 clients interoperate with this SDK's server and vice versa. See [Network & Token Support → `exact` Scheme](./core-concepts/network-and-token-support.md#exact-scheme) for details.

---

## Extensions {#extensions}

The generic protocol extensions — `bazaar`, `sign-in-with-x`, `offer-receipt`, `payment-identifier`, `eip2612-gas-sponsoring`, `erc20-approval-gas-sponsoring`, and `builder-code` — come from official `@x402/extensions` `2.28.0`: most through subpaths such as `@x402/extensions/bazaar`, the two EVM gas-sponsoring extensions from the package root. TRON `trc20-approval-resource-sponsoring` ships separately in `@bankofai/x402-tron-extensions`, exported from its root and from `/trc20-approval-resource-sponsoring` (with `/client`, `/facilitator` and `/resourceService` beneath it). A resource server declares an extension in `PaymentRequired.extensions`; the sponsoring extensions and `payment-identifier` act only on a declared extension, while `builder-code` attribution is attached by whichever party registered it.

### TRON approval resource sponsoring (new in 1.2.0, separate package since 2.1.0)

`trc20ApprovalResourceSponsoring` (wire-schema version `1`) lets a payer make their **first** TRON Permit2 payment or channel deposit without holding TRX. Instead of broadcasting the one-time `approve(Permit2, MaxUint256)` itself, the client signs that transaction and attaches the signed bytes to the payment payload; the facilitator strictly decodes and validates them against the selected payment, temporarily delegates the Stake 2.0 Energy — and, when needed, Bandwidth — that the payer lacks, broadcasts the transaction unchanged, and reclaims the delegation afterwards through a recoverable state machine.

| Party | What it does |
|-------|--------------|
| Resource server | **Opts in** — spread `declareTrc20ApprovalResourceSponsoringExtension()` into the route's `extensions`. The route must use `extra.assetTransferMethod: "permit2"`. |
| Client | **Opts in** (since 2.1.0) — register `client.registerExtension(createTrc20ApprovalResourceSponsoringClientExtension(signer))` after the payment schemes. It attaches the signed approval when the server declared version `1`, the selected path uses Permit2, and the current Permit2 allowance is insufficient. Without it, a sponsored payment fails with `trc20_approval_client_extension_not_registered`. |
| Facilitator | **Opts in** — register `createTrc20ApprovalResourceSponsoringExtension(runtime)` with a runtime built by `createTrc20ResourceSponsoringRuntime({ ... })`, both from `@bankofai/x402-tron-extensions`. A facilitator without the runtime returns `sponsor_runtime_unavailable`. |

It applies to TRON `exact` (with `assetTransferMethod: "permit2"`), TRON `upto`, and the Permit2 **deposit/top-up** path of `batch-settlement`. It is not used for EIP-3009 transfers, nor for batch vouchers, claims, settles, or refunds. It sponsors only that one `approve` transaction — the scheme payload still remains the sole authority over amount, recipient, nonce, and deadline, and no fee is charged inside the approval. There is no new endpoint: the flow stays `402 Payment Required` → `PAYMENT-SIGNATURE` → `/verify` → `/settle`.

```typescript
import type { RoutesConfig } from "@x402/core/http";
import { TRON_NILE } from "@bankofai/x402-tron";
import { declareTrc20ApprovalResourceSponsoringExtension } from "@bankofai/x402-tron-extensions";

const routes: RoutesConfig = {
  "GET /weather": {
    accepts: [
      {
        scheme: "exact",
        network: TRON_NILE,
        payTo: "T...",
        price: {
          amount: "1000000",
          asset: "T...",
          extra: { assetTransferMethod: "permit2" },
        },
      },
    ],
    extensions: {
      ...declareTrc20ApprovalResourceSponsoringExtension(),
    },
  },
};
```

:::caution Requirements and limits
- The payer must be an **activated, single-signature TRON EOA** using the default owner permission. Multisig and custom-permission accounts are not supported.
- Under the default `zero-first` approval strategy a **non-zero but insufficient** allowance is rejected with `approval_reset_required` — the SDK never inserts an implicit `approve(0)`. A token that is not a known Permit2 asset raises `approval_asset_unsupported` unless you configure a strategy for it with `createTrc20ApprovalPolicy`.
- A production facilitator must back the runtime with a durable operation coordinator and run reconciliation at startup and on a schedule. The exported `InMemoryTrc20SponsoringCoordinator` is for tests and single-process development only.
- The [official facilitator](./core-concepts/OfficialFacilitator.md) advertises this extension in `/supported`, but its production configuration sponsors **TRON Nile USDT only** and requires an API Key. Sponsoring on TRON Mainnet, or for other tokens, requires a self-hosted facilitator with a resource-owner wallet that has Stake 2.0 capacity.
:::

---

## Signers

The TRON signer factories in `@bankofai/x402-tron` adapt a wallet — such as one resolved by [`@bankofai/agent-wallet`](https://github.com/BofAI/agent-wallet) — so the SDK never sees a raw private key, and build TronWeb internally.

| Signer factory | Role |
|----------|------|
| `createClientTronSigner` | Client (TRON) |
| `createFacilitatorTronSigner` | Facilitator (TRON) |
| `createAuthorizerTronSigner` | Authorizer (TRON, batch-settlement) |

EVM signing uses the public signer adapters of official `@x402/evm` (for example `toClientEvmSigner` and `toFacilitatorEvmSigner`). The former `@bankofai/x402-evm` agent-wallet factories (`createClientEvmSigner`, `createFacilitatorEvmSigner`, `createAuthorizerEvmSigner`) were retired in 2.1.0; follow the [upstream EVM examples](https://github.com/x402-foundation/x402/tree/main/examples/typescript).

---

## Client Features

| Feature | Status |
|------------|--------|
| Automatic 402 handling (`wrapFetchWithPayment`) | ✅ |
| Automatic Permit2 / token approval | ✅ |
| Allowance check | ✅ |
| Signing (TRON, TIP-712) | ✅ |
| Signing (EVM, EIP-712) | ✅ |
| Balance-aware payment selection (`filterAffordableRequirements`) | ✅ TRON only |
| Cheapest-token selection strategy | ✅ TRON only |
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
| Gas-sponsoring extension, EVM (`eip2612GasSponsoring` / `erc20ApprovalGasSponsoring`) | ✅ |
| Resource-sponsoring extension, TRON (`trc20ApprovalResourceSponsoring`) | ✅ — new in 1.2.0; declare with `declareTrc20ApprovalResourceSponsoringExtension()` from `@bankofai/x402-tron-extensions` |
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
| Pending settlement (`settlement_pending`) | ✅ — new in 2.0.0. When a transaction was broadcast but its receipt is not yet known, settlement returns the non-terminal `settlement_pending` with the original transaction ID; reconcile that transaction instead of resubmitting. TRON receipt waiting defaults to 90 s (`confirmationTimeoutMs` on `createFacilitatorTronSigner`) |
| Pending-settlement recovery, TRON | ✅ — new in 2.1.0. The TRON facilitator schemes save the original transaction ID (or GasFree relayer trace) before waiting for the receipt, so a retry of the same payment resumes it instead of broadcasting again. The default `InMemoryTronPendingSettlementStore` covers one process only; for restarts or multiple replicas, inject a persistent, shared `TronPendingSettlementStore` through the `pendingSettlementStore` constructor option. A failed save after broadcast returns `settlement_store_unavailable` (keeping the known transaction ID); an unhandled settlement callback error returns `settlement_execution_failed` |
| `upto` preflight reads, TRON | ✅ — new in 2.1.0. A failed or malformed allowance/balance read returns `chain_read_failed` before any settlement is broadcast |

> The self-hosted example facilitator (`facilitator/basic`) exposes `/verify`, `/settle`, `/supported`. The official hosted facilitator additionally offers the settlement-record queries `GET /payments/tx/{tx_hash}` and `GET /payments`, plus `/health` — see [Official Facilitator](./core-concepts/OfficialFacilitator.md). Prometheus metrics are served on a separate monitoring port (`9001` in the shipped configs), not on the public API base. There is no `/fee/quote` endpoint: the SDK schemes carry no facilitator fee.
>
> Since 2.1.0, `HTTPFacilitatorClient` comes from official `@x402/core` `2.28.0`: it uses typed timeout errors and a 90-second default timeout, and the repository examples set `timeoutMs: 120_000` explicitly. After switching to the official HTTP/MCP packages, recheck your request timeouts. Its rate-limit retry (3 attempts) applies to `getSupported()` only — `verify()` and `settle()` surface a 429 to the caller rather than retrying.

---

## Supported Tokens

| Token | Network | Status |
|--------|---------|--------|
| USDT (TRC-20) | `tron:728126428`, `tron:3448148188`, `tron:2494104990` | ✅ |
| USDD (TRC-20) | `tron:728126428`, `tron:3448148188` | ✅ |
| USDT (BEP-20) | `eip155:56`, `eip155:97` | ✅ (explicit asset) |
| USDC (BEP-20) | `eip155:56`, `eip155:97` | ✅ (explicit asset; the `eip155:56` address is in no shipped token registry) |
| Official USDC (ERC-20, EIP-3009) | `eip155:8453`, `eip155:84532` | ✅ |
| Custom TRC-20 / BEP-20 | any | ✅ (via the TRON token registry / an explicit `{ asset, amount, extra }` price) |

> Only some of these are **default assets**: USDT on the three TRON networks and USDC on Base and Base Sepolia. Since 1.1.0 a client's spend controls reject every other asset — USDD, every BSC asset, custom tokens — unless it is allowlisted via `spendControls.allowedAssets`. See [Network & Token Support](./core-concepts/network-and-token-support.md#supported-tokens).

---

## Observability

The TRON mechanism writes through a process-global logger exported by `@bankofai/x402-tron` (since 2.1.0; previously from `@bankofai/x402-core`). Call `setLogger(...)` once at startup to redirect logs to a file, `pino`/`winston`, or `noopLogger` to silence. Official `@x402/core` and `@x402/extensions` do not use this logger — register lifecycle hooks where you need their events logged.

---

## Legend

- ✅ = Implemented
- ⚠️ = Partially implemented (see the notes column)
- ❌ = Not supported
