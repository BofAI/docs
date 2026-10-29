import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# FAQ

### General

#### What is x402 in one sentence?

x402 revives the long-unused HTTP `402 Payment Required` status code and transforms it into a fully functional on-chain payment layer designed for APIs, websites, and autonomous AI agents. It currently supports TRON, BSC, and Base, with plans to expand to additional blockchain networks in the future.

#### Is x402 a commercial product?

**No.** x402 is an open-source blockchain implementation of the x402 protocol. The [repository](https://github.com/BofAI/x402) is MIT-licensed, while the published npm packages `@bankofai/x402-tron` and `@bankofai/x402-tron-extensions` declare `Apache-2.0` in their `package.json` (as do the official `@x402/*` packages). You are free to use it without purchasing any commercial product.

#### Why replace traditional payment channels or API keys?

Traditional payment systems rely on credit card networks, user accounts, and complex UI flows. x402 removes these dependencies and leverages the speed and low cost of blockchain networks to enable programmatic, HTTP-native payments—particularly well-suited for AI agents.

#### Is x402 only for crypto-native projects?

Not at all. Any Web API or content provider—whether Web3-native or traditional Web2—can integrate x402 to enable low-cost, frictionless blockchain-based payments.

---

### Language & Framework Support

#### What languages and frameworks are supported?

x402 is a **TypeScript-only** SDK: the TRON packages are published as `@bankofai/x402-tron` and `@bankofai/x402-tron-extensions`, and Core, EVM and the framework integrations are the official `@x402/*` packages:

- **Server middleware**: Express, Fastify, Hono, Next.js
- **Client**: wrapped `fetch` (`@x402/fetch`), Axios, MCP transport
- **Facilitator**: chain-agnostic engine with per-scheme verify + settle

The retired Python SDK and the old root `legacy/` archive were removed in x402 v2.0.0, and the compatibility npm packages under `typescript/packages/legacy/` in v2.1.0.

---

### Facilitator

#### Who runs the Facilitator?

Typically, you run your own Facilitator service. x402 is designed for self-hosting: the repository ships a runnable reference implementation at `examples/typescript/facilitator/basic` that you harden for your own production use.

An [officially hosted Facilitator](https://github.com/BofAI/x402-facilitator) service is also available, allowing you to use x402 without deploying infrastructure yourself.

#### How do you prevent a malicious Facilitator from stealing funds or forging settlements?

All payment payloads are **signed by the buyer**, and settlement is executed **directly on-chain**. Any attempt to tamper with transaction data will fail signature verification.

A Facilitator can only:

- Transfer the exact amount authorized by the buyer
- Send funds to the specific recipient address defined in the signed payload

---

### Pricing Strategies & Plans

#### How should I price an endpoint?

Common pricing models include:

- **Flat rate per call**: e.g., `1 USDT` per request
- **Tiered pricing**: Different prices for endpoints like `/basic` and `/pro`
- **`exact` scheme**: Pay the exact amount advertised per call

#### What payment schemes does x402 support?

x402 defines five named payment schemes. Four are available end to end; `auth-capture` currently ships client-side support only:

- **`exact`**: Pay the exact advertised amount. EIP-3009 tokens (e.g. official Base USDC) settle gaslessly via `transferWithAuthorization`; plain ERC-20/TRC-20 tokens (e.g. BSC USDC/USDT, TRON USDT/USDD) settle via the Permit2 path with a one-time `approve(Permit2)`. The `exact` wire payload conforms to the **x402 Foundation** v2 spec.
- **`upto`**: Usage-based billing — the client signs a Permit2 authorization for up to a **maximum**; the server settles only the **real usage** (≤ max). Ideal for **metered billing**, **LLM token usage**.
- **`batch-settlement`**: Payment-channel for high-frequency micro-payments — deposit once, pay many requests with off-chain vouchers, settle in one batch tx. Includes a refund path.
- **`exact_gasfree`** (TRON only): Allows buyers to pay with USDT/USDD without holding TRX for gas. A relayer pays the on-chain energy via the GasFree API — no API keys required on the client side. The relayer deducts its own fee from the payment token, on top of the payment amount.
- **`auth-capture`** (EVM client only): Supports refundable Base Commerce Payments authorization/capture flows. Server and facilitator implementations are not yet included in the published package.

#### Can this SDK interoperate with the x402 Foundation (formerly Coinbase) v2 reference implementation?

**Yes.** The `exact` payment scheme (EVM and TRON) conforms to the v2 specification published by the **x402 Foundation**:

- A stock v2 client can directly access this SDK's `exact` protected endpoints with no project-specific adapter layer.
- This SDK's client can pay v2-compatible servers directly.
- In the V2 structure, transfer authorization data is a structured object: `payload.authorization` on the EIP-3009 path, `payload.permit2Authorization` on the Permit2 path.
- BSC USDT/USDC are plain ERC-20s (no ERC-3009). They settle via the Permit2 path under the `exact` scheme and need a one-time `approve(Permit2)`. On EVM the client never broadcasts it: it must already be in place, or be relayed by the facilitator through a gas-sponsoring extension the server advertises — otherwise the request fails with `permit2_allowance_required`.
- Base Mainnet official USDC uses EIP-3009 under `exact`: the payer signs `transferWithAuthorization`, so no Permit2 approval is required.
- The former `legacy/examples/bsc-testnet-smoke/` interoperability smoke tests were removed together with the root `legacy/` archive in x402 v2.0.0. Use the runnable [`examples/typescript`](https://github.com/BofAI/x402/tree/main/examples/typescript) workspace as the current client → server → facilitator reference; since v2.1.0 it covers TRON only, so for EVM use the [upstream examples](https://github.com/x402-foundation/x402/tree/main/examples/typescript).

---

### Assets, Networks & Fees

#### What assets and networks are supported?

| Network                     | Token         | Status      |
| --------------------------- | ------------- | ----------- |
| TRON Mainnet (`tron:728126428`) | USDT (TRC-20) | **Mainnet** |
| TRON Nile (`tron:3448148188`)       | USDT (TRC-20) | **Testnet** |
| TRON Shasta (`tron:2494104990`)   | USDT (TRC-20) | **Testnet** (SDK/CLI only — the official facilitator does not settle Shasta; use Nile or self-host) |
| TRON Mainnet (`tron:728126428`) | USDD (TRC-20) | **Mainnet** |
| TRON Nile (`tron:3448148188`)       | USDD (TRC-20) | **Testnet** |
| BSC Mainnet (`eip155:56`)     | USDT (BEP-20) | **Mainnet** |
| BSC Mainnet (`eip155:56`)     | USDC (BEP-20; `0x8AC76a…`, not in any shipped token registry — explicit asset only) | **Mainnet** |
| BSC Testnet (`eip155:97`)     | USDT (BEP-20) | **Testnet** |
| BSC Testnet (`eip155:97`)     | USDC (BEP-20) | **Testnet** |
| Base Mainnet (`eip155:8453`) | Official USDC (ERC-20, EIP-3009) | **Mainnet** |
| Base Sepolia (`eip155:84532`) | USDC (ERC-20, EIP-3009) | **Testnet** |

TRON identifiers use decimal chain IDs since x402 v2.0.0 (`@bankofai/x402-tron` 2.0.0); the older hex forms (`tron:0x2b6653dc`, `tron:0xcd8690dc`, `tron:0x94a9059e`) are still accepted as input aliases.

Only some of these are **default assets** (USDT on the three TRON networks, USDC on Base and Base Sepolia). Since SDK 1.1.0 a client's spend controls reject any other asset — including TRON USDD and every BSC asset — unless it is allowlisted via `spendControls.allowedAssets`.

Custom TRC-20 tokens can be added via the TRON token registry (`registerToken` from `@bankofai/x402-tron`); custom BEP-20 tokens are advertised with an explicit `{ asset, amount, extra }` price on the server route.

#### What fees are involved?

- **Network Fees**:
  - TRON: TRX for Energy and Bandwidth (paid by the Facilitator). Since SDK 1.2.0, a Facilitator that enables `trc20ApprovalResourceSponsoring` can also cover the payer's first Permit2 `approve` by temporarily delegating its own staked Energy — and, when needed, Bandwidth — to the payer and reclaiming it after the approve is broadcast.
  - BSC: BNB for gas (paid by the Facilitator). The payer's one-time ERC-20 `approve` can also be sponsored when the Facilitator has registered the approval gas-sponsoring extension — the official Facilitator registers it for BSC and Base; a self-hosted one must opt in. SDK clients attach the sponsoring payload only when the resource server declares the extension on the route.
  - Base: ETH for gas (paid by the Facilitator). Sponsoring applies to Base's Permit2 paths; Base USDC under `exact` settles with EIP-3009 and needs no `approve` in the first place.
- **Facilitator service fee**: none. The current schemes carry no fee field — `base_fee` config and the `/fee/quote` endpoint were removed in SDK 1.0.1. On TRON `exact_gasfree`, the GasFree relayer charges its own fee in the payment token; cap it with the client's GasFree fee limit.

---

### Security

#### Do I need to expose my private key to the backend?

**No.** Recommended security model:

1. **Buyer (client/agent)** signs locally (browser, serverless function, or agent VM).
2. **Seller** verifies signatures without accessing private keys.
3. **Facilitator** submits transactions with its own settlement wallet, resolved through `@bankofai/agent-wallet` — with the `privy` or `wallet_cli` provider the key stays outside the facilitator process (`raw_secret` keeps a plaintext key in config and is for development only).

#### How does refunds work?

The `exact` scheme uses a **push payment** model — once settled on-chain, it is irreversible. The `batch-settlement` scheme, by contrast, supports an on-chain **refund** path for the unused channel balance.

Refund options:

1. **Business-layer refund**: Seller manually sends a new USDT transfer back to the buyer.
2. **Preventative settlement**: Server settles only the actual usage amount under the payment scheme.

---

### AI Agent Integration

#### How does an agent know how much to pay?

The flow mirrors a human user:

1. Send initial request.
2. Parse `PAYMENT-REQUIRED` header in the response.
3. Sign the payment payload using the x402 client SDK.
4. Retry request with `PAYMENT-SIGNATURE` header attached.

#### Does an agent need a wallet?

**Yes.** A programmatic wallet (via x402 signer classes) enables signing payment payloads without exposing mnemonic phrases.

---

### Development Guide

#### How do I develop with x402 locally?

Install the published packages in your TypeScript app and build against npm, for example:

```bash
pnpm add @x402/core@2.28.0 @x402/fetch@2.28.0 @bankofai/x402-tron@2.1.0 @x402/evm@2.28.0 @bankofai/agent-wallet
pnpm add @x402/express@2.28.0
```

Use the framework package that matches your server (`@x402/express`, `@x402/hono`, `@x402/fastify`, or `@x402/next`), at the same `2.28.0` as `@x402/core` — `@bankofai/x402-tron` 2.1.0 requires exactly `@x402/core@2.28.0`. Add `@bankofai/x402-tron-extensions@2.1.0` only if you use TRON resource sponsoring. The [`examples/typescript`](https://github.com/BofAI/x402/tree/main/examples/typescript) workspace is a runnable reference for client → server → facilitator flows, not a prerequisite for application development.

#### Which testnet is recommended?

**TRON Nile** is recommended for TRON testing:

- Faucet: https://nileex.io/join/getJoinPage
- Explorer: https://nile.tronscan.org

**BSC Testnet** is recommended for BSC testing:

- Faucet: https://www.bnbchain.org/en/testnet-faucet
- Explorer: https://testnet.bscscan.com

---

### Troubleshooting

#### Why do I still receive `402 Payment Required` even after sending `PAYMENT-SIGNATURE`?

Common causes:

1. Invalid signature (incorrect domain or payload).
2. Insufficient payment amount.
3. Insufficient wallet balance.

The response body is `{}` by default. The reason is the `error` field of the payment requirements carried, Base64-encoded, in the `PAYMENT-REQUIRED` response header — decode it (for example with `decodePaymentRequiredHeader` from `@x402/core/http`) for diagnostics.

An insufficient Permit2 allowance on the `exact` / `upto` Permit2 path does not return 402: the server answers HTTP `412 Precondition Failed` with `error: "permit2_allowance_required"` in the same header. (The `batch-settlement` deposit path reports it as a 402 with its own scheme-specific code.)

#### It works on Nile but fails on Mainnet — why?

- Network configuration not updated
- Using testnet tokens instead of real mainnet tokens
- Facilitator lacks sufficient gas tokens
- Token contract address differs between networks

### Still Have Questions?

• Submit a GitHub Issue in the [x402 repository](https://github.com/BofAI/x402)
• Refer to the [reference examples](https://github.com/BofAI/x402/tree/main/examples/typescript) in the x402 repository for a complete client → server → facilitator loop
