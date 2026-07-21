import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# FAQ

### General

#### What is x402 in one sentence?

x402 revives the long-unused HTTP `402 Payment Required` status code and transforms it into a fully functional on-chain payment layer designed for APIs, websites, and autonomous AI agents. It is currently supported on TRON and BSC, with plans to expand to additional blockchain networks in the future.

#### Is x402 a commercial product?

**No.** x402 is an open-source blockchain implementation of the x402 protocol, released under the MIT license. You are free to use it without purchasing any commercial product.

#### Why replace traditional payment channels or API keys?

Traditional payment systems rely on credit card networks, user accounts, and complex UI flows. x402 removes these dependencies and leverages the speed and low cost of blockchain networks to enable programmatic, HTTP-native payments—particularly well-suited for AI agents.

#### Is x402 only for crypto-native projects?

Not at all. Any Web API or content provider—whether Web3-native or traditional Web2—can integrate x402 to enable low-cost, frictionless blockchain-based payments.

---

### Language & Framework Support

#### What languages and frameworks are supported?

x402 is a **TypeScript-only** SDK published as granular `@bankofai/x402-*` packages:

- **Server middleware**: Express, Fastify, Hono, Next.js
- **Client**: wrapped `fetch` (`@bankofai/x402-fetch`), Axios, MCP transport
- **Facilitator**: chain-agnostic engine with per-scheme verify + settle

The previous Python SDK lives under `legacy/` for reference.

---

### Facilitator

#### Who runs the Facilitator?

Typically, you run your own Facilitator service. x402 is designed for self-hosting, and the built-in Facilitator in the repository is production-ready.

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

x402 supports four payment schemes:

- **`exact`**: Pay the exact advertised amount. ERC-3009 tokens (e.g. BSC testnet DHLU) settle gaslessly via `transferWithAuthorization`; plain ERC-20/TRC-20 tokens (e.g. BSC USDC/USDT, TRON USDT/USDD) settle via the Permit2 path with a one-time `approve(Permit2)`. The `exact` wire payload conforms to the **x402 Foundation** v2 spec.
- **`upto`**: Usage-based billing — the client signs a Permit2 authorization for up to a **maximum**; the server settles only the **real usage** (≤ max). Ideal for **metered billing**, **LLM token usage**.
- **`batch-settlement`**: Payment-channel for high-frequency micro-payments — deposit once, pay many requests with off-chain vouchers, settle in one batch tx. Includes a refund path.
- **`exact_gasfree`** (TRON only): Allows buyers to pay with USDT/USDD without holding TRX for gas. A relayer pays the on-chain energy via the GasFree API — no API keys required on the client side.

#### Can this SDK interoperate with the x402 Foundation (formerly Coinbase) v2 reference implementation?

**Yes.** The `exact` payment scheme (EVM and TRON) conforms to the v2 specification published by the **x402 Foundation**:

- A stock v2 client can directly access this SDK's `exact` protected endpoints with no project-specific adapter layer.
- This SDK's client can pay v2-compatible servers directly.
- In the V2 structure, transfer authorization data is carried in the `payload.authorization` field (a structured object). As a migration fallback, the client also populates `extensions.transferAuthorization` so that servers still running older versions can parse the payload.
- BSC USDT/USDC are plain ERC-20s (no ERC-3009). They settle via the Permit2 path under the `exact` scheme — the client auto-broadcasts a one-time `approve(Permit2)` on first payment. ERC-3009 tokens like BSC testnet **DHLU** settle gaslessly with no approve.
- The `examples/bsc-testnet-smoke/` directory contains smoke tests for bidirectional interoperability (Coinbase official client → BANK OF AI server, BANK OF AI client → Coinbase official server) that you can use as a debugging and integration reference.

---

### Assets, Networks & Fees

#### What assets and networks are supported?

| Network                     | Token         | Status      |
| --------------------------- | ------------- | ----------- |
| TRON Mainnet (`tron:0x2b6653dc`) | USDT (TRC-20) | **Mainnet** |
| TRON Nile (`tron:0xcd8690dc`)       | USDT (TRC-20) | **Testnet** |
| TRON Shasta (`tron:0x94a9059e`)   | USDT (TRC-20) | **Testnet** |
| TRON Mainnet (`tron:0x2b6653dc`) | USDD (TRC-20) | **Mainnet** |
| TRON Nile (`tron:0xcd8690dc`)       | USDD (TRC-20) | **Testnet** |
| BSC Mainnet (`eip155:56`)     | USDT (BEP-20) | **Mainnet** |
| BSC Mainnet (`eip155:56`)     | USDC (BEP-20) | **Mainnet** |
| BSC Testnet (`eip155:97`)     | USDT (BEP-20) | **Testnet** |
| BSC Testnet (`eip155:97`)     | USDC (BEP-20) | **Testnet** |
| BSC Testnet (`eip155:97`)     | DHLU (BEP-20, for `exact` interop tests) | **Testnet** |

Custom TRC-20 tokens can be added via the TRON token registry (`registerToken` from `@bankofai/x402-tron`); custom BEP-20 tokens are advertised by adding an entry to the server's `EVM_TOKENS` config table.

#### What fees are involved?

- **Network Fees**:
  - TRON: TRX for Energy and Bandwidth (paid by the Facilitator)
  - BSC: BNB for gas (paid by the Facilitator)
- **Facilitator Service Fee**: Configurable by each Facilitator (can be set to zero)

---

### Security

#### Do I need to expose my private key to the backend?

**No.** Recommended security model:

1. **Buyer (client/agent)** signs locally (browser, serverless function, or agent VM).
2. **Seller** verifies signatures without accessing private keys.
3. **Facilitator** uses its own key to submit transactions on-chain.

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
pnpm add @bankofai/x402-fetch @bankofai/x402-tron @bankofai/x402-evm @bankofai/agent-wallet
pnpm add @bankofai/x402-core @bankofai/x402-express
```

Use the framework package that matches your server (`express`, `hono`, `fastify`, or `next`). The [`examples/typescript`](https://github.com/BofAI/x402/tree/main/examples/typescript) workspace is a runnable reference for client → server → facilitator flows, not a prerequisite for application development.

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
3. Insufficient token allowance granted to Facilitator.
4. Insufficient wallet balance.

Check the `error` field in the server’s JSON response for detailed diagnostics.

#### It works on Nile but fails on Mainnet — why?

- Network configuration not updated
- Using testnet tokens instead of real mainnet tokens
- Facilitator lacks sufficient gas tokens
- Token contract address differs between networks

### Still Have Questions?

• Submit a GitHub Issue in the [x402 repository](https://github.com/BofAI/x402)
• Refer to the [reference examples](https://github.com/BofAI/x402/tree/main/examples/typescript) in the x402 repository for a complete client → server → facilitator loop
