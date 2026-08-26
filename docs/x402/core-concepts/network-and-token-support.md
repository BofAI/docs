import ThemedImage from '@theme/ThemedImage';

# Network & Token Support

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## TRON Network Identifiers

x402 adopts the CAIP-2 network identifier format `tron:<hex_chain_id>`.
Use the exported constants from `@bankofai/x402-tron` (`TRON_MAINNET`, `TRON_NILE`, `TRON_SHASTA`) in application code instead of copying opaque hex strings.

### Identifier Reference

| Network Name | CAIP-2 ID | SDK Constant | Description |
| :----------- | :-------- | :----------- | :---------- |
| **TRON Mainnet** | `tron:0x2b6653dc` | `TRON_MAINNET` | TRON Mainnet (Production) |
| **TRON Shasta**  | `tron:0x94a9059e`  | `TRON_SHASTA`  | TRON Shasta Testnet |
| **TRON Nile**    | `tron:0xcd8690dc`  | `TRON_NILE`    | TRON Nile Testnet |

---

## BSC Network Identifiers

In the x402 protocol (on-the-wire), BSC uses the EIP-155 chain ID format:

| Network Name     | Protocol ID   | Description                    |
| :--------------- | :------------ | :----------------------------- |
| **BSC Mainnet**  | `eip155:56`   | BSC Mainnet (Production)      |
| **BSC Testnet**  | `eip155:97`   | BSC Testnet (Chapel)          |

> **Note**: A self-hosted Facilitator's YAML config takes **canonical CAIP-2 identifiers only** — `eip155:56`, `eip155:97`, `eip155:8453`, `eip155:84532`, `tron:0x2b6653dc`, `tron:0xcd8690dc`, `tron:0x94a9059e`. Friendly aliases such as `bsc:mainnet` or `tron:nile` are not resolved and are rejected at startup.

---

## Base Network Identifiers

Base uses canonical EIP-155 identifiers on the x402 wire:

| Network Name | Protocol ID | Description |
| :----------- | :---------- | :---------- |
| **Base Mainnet** | `eip155:8453` | Production network; published by the API Catalog |
| **Base Sepolia** | `eip155:84532` | CLI/SDK test network |

Base Mainnet uses official USDC and the `exact` scheme with EIP-3009 authorization. The payer signs a `transferWithAuthorization` message off-chain; no Permit2 approval is required.

---

## Overview

x402 is purpose-built for blockchain ecosystems, enabling native on-chain payment verification and settlement.
The protocol uses secure signing mechanisms to ensure tamper-resistant message authorization.

### Supported Networks

| Network Environment | Status     | Notes |
| :------------------ | :--------- | :---- |
| **TRON Mainnet**    | **Mainnet** | **Production network** for real-value assets |
| **TRON Nile**       | **Testnet** | **Recommended testnet** for development and debugging |
| **TRON Shasta**     | **Testnet** | Alternative testnet — SDK/CLI only; the official facilitator does not settle Shasta, so use Nile or self-host |
| **BSC Mainnet**     | **Mainnet** | **Production network** for real-value assets |
| **BSC Testnet**     | **Testnet** | **Recommended testnet** for BSC development |
| **Base Mainnet**    | **Mainnet** | **Production network** using official USDC |
| **Base Sepolia**    | **Testnet** | CLI/SDK testing; not published in the API Catalog |

---

## Supported Tokens

x402 supports **TRC-20, BEP-20, and ERC-20** tokens. TRON/BSC routes use their configured stablecoins; Base uses official USDC.

### Supported Token List

| Symbol | Network        | Contract Address |
| :------ | :------------- | :--------------- |
| **USDT** | `tron:0x2b6653dc` | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` |
| **USDT** | `tron:0xcd8690dc`    | `TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf` |
| **USDT** | `tron:0x94a9059e` | `TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs` |
| **USDD** | `tron:0x2b6653dc` | `TXDk8mbtRbXeYuMNS83CfKPaYYT8XWv9Hz` |
| **USDD** | `tron:0xcd8690dc`    | `TGjgvdTWWrybVLaVeFqSyVqJQWjxqRYbaK` |
| **USDT** | `eip155:56`    | `0x55d398326f99059fF775485246999027B3197955` |
| **USDC** | `eip155:56`    | `0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d` |
| **USDT** | `eip155:97`    | `0x337610d27c682E347C9cD60BD4b3b107C9d34dDd` |
| **USDC** | `eip155:97`    | `0x64544969ed7EBf5f083679233325356EbE738930` |
| **DHLU** | `eip155:97`    | `0x375cADdd2cB68cE82e3D9B075D551067a7b4B816` |
| **USDC** | `eip155:8453`  | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| **USDC** | `eip155:84532` | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |

> **Default assets vs. opt-in assets (SDK 1.1.0+)**: the default-asset registry resolves **USDT** on TRON (`tron:0x2b6653dc`, `tron:0xcd8690dc`, `tron:0x94a9059e`) and BSC Mainnet (`eip155:56`), and **USDC** on BSC Testnet (`eip155:97`) and Base (`eip155:8453`, `eip155:84532`). Everything else in the table above — TRON USDD, BSC Mainnet USDC, BSC Testnet USDT, DHLU, and any custom token — is server-advertised only: with the 1.1.0 client spend controls on by default, a client refuses to pay it unless you allowlist it via `spendControls.allowedAssets`, and `x402-cli` pays registry tokens by default — an unregistered asset requires explicit `--asset` plus `--decimals`, and is rejected outright on Base.

> **Extensibility**: The protocol is highly extensible. By registering tokens in the `TokenRegistry`, you can easily support any custom TRC-20 or BEP-20 token.

> **Token selection for the `exact` scheme**: EIP-3009 tokens (for example official Base USDC and BSC testnet DHLU) settle gaslessly via `transferWithAuthorization`. Plain ERC-20 tokens (for example BSC USDC/USDT and TRON USDT/USDD) settle via the Permit2 path — the client auto-broadcasts a one-time `approve(Permit2)` on first payment. You set the per-token method on the server under `accepts[].price.extra`; the SDK surfaces it on the wire as `accepts[].extra`: EIP-3009 → `{ name, version }`; plain ERC-20 → `{ assetTransferMethod: "permit2" }`.

---

## Secure Signing

x402 uses typed data signing for all payment-related signatures.

### Key Benefits

- **Off-chain Authorization**
  Buyers sign transfer intent locally (off-chain) without locking funds in advance.

- **Trust-Minimized**
  Signatures include strict constraints (amount, recipient, expiration), preventing the Facilitator from moving funds beyond the explicitly authorized scope.

- **On-chain Verifiability**
  All signatures can be cryptographically verified at the smart contract level, ensuring immutability and integrity.

---

## Token Configuration Parameters

When configuring an `HTTP 402` payment request on the server side, you must explicitly define:

1. **Network** – The unique network identifier (e.g., `tron:0xcd8690dc` or `eip155:8453`)
2. **Asset** – The TRC-20/BEP-20/ERC-20 token **contract address**
3. **Amount** – The integer value in the token’s **smallest unit (raw amount)**

> **Precision Example**
> USDT on TRON uses **6 decimals**.
> To charge **1.0 USDT**, you must configure the amount as:
> `1000000`

---

## Payment Schemes

x402 supports four payment schemes. Each is implemented as a client + server + facilitator trio per chain family.

### `exact` Scheme

The `exact` scheme pays the exact amount advertised. It covers two token transfer paths:

- **EIP-3009 `transferWithAuthorization`** — for tokens that natively support it (e.g. official Base USDC and BSC testnet DHLU). Gasless: no `approve` needed; the client signs a typed-data authorization and the facilitator calls `transferWithAuthorization` on-chain.
- **Permit2** — for plain ERC-20 / TRC-20 tokens that do not implement ERC-3009 (e.g. BSC USDC/USDT, TRON USDT/USDD). The client signs a Permit2 witness and the facilitator settles via the `x402ExactPermit2Proxy` contract. A one-time `approve(Permit2)` is required; the client auto-broadcasts it on first payment.

The `exact` scheme conforms to the **v2 wire format** published by the **x402 Foundation**: a stock v2 client can pay a protected endpoint on this SDK's server directly, and this SDK's client can pay any v2-compliant server — no project-specific translation required. Transfer authorization data is carried in `payload.authorization`.

### `upto` Scheme

Usage-based billing. The client signs a Permit2 authorization for up to a **maximum** amount; the server decides the **real usage** per request and settles only that (≤ max). One signature shape, a different charge each request — ideal for **metered billing** (LLM token usage, compute time, bandwidth). Available on EVM and TRON (both Permit2).

### `batch-settlement` Scheme

A payment-channel scheme for high-frequency micro-payments (e.g. AI agent per-token billing). The payer **deposits once** on-chain, then pays many requests with off-chain **vouchers**; the facilitator **claims** a batch and **settles** to `payTo` in a single tx — so N requests cost ~one deposit's worth of gas. Includes a **refund** path for the unused balance. Available on EVM and TRON.

### `exact_gasfree` Scheme

TRON-specific. Allows buyers to pay with USDT/USDD **without holding TRX for gas fees**. The payer signs a TIP-712 GasFree permit and a relayer pays the on-chain energy via the official GasFree Proxy — no TRX for the payer, no one-time `approve`. Funds come from the payer's GasFree custodial wallet (not the main wallet). The SDK registers GasFree on `tron:0x2b6653dc`, `tron:0xcd8690dc`, and `tron:0x94a9059e`, but the official facilitator only proxies the relayer for TRON Mainnet and Nile — the built-in Shasta relayer URL has no upstream behind it, so Shasta GasFree needs your own relayer.

The relayer charges its own fee in the payment token, **on top of** the payment amount, so the GasFree account must hold enough to cover both.

:::info What the relayer fee is
**The relayer fee is the service charge of the GasFree relayer**: instead of burning your own TRX, the relayer fronts the on-chain energy/bandwidth, and in exchange deducts a fee from your GasFree account, denominated in the payment token (e.g. USDT). It is composed of a fixed **transfer fee** per payment, plus a one-time **activation fee** on the first payment if the GasFree account is not yet activated. The rates are quoted per token by the relayer's API; the client queries and estimates them before signing (when the relayer reports no rate for the token, the client signs a default ceiling of one whole token instead), and the signed permit carries a `maxFee` ceiling the relayer cannot exceed. It is counted **separately** from the payment amount (the money the seller receives) — `--max-amount` does not cover it, so cap it with `--max-gasfree-fee`.
:::

#### Paying with GasFree from the CLI

```bash
x402-cli pay <url> \
  --scheme exact_gasfree \
  --max-amount 0.01 \
  --max-gasfree-fee 0.5 \
  --json
```

The CLI takes the first requirement in the server's `accepts` list that matches your filters — it does not prefer GasFree — so pass `--scheme exact_gasfree` whenever the endpoint also advertises plain `exact`. `--max-amount` does not cover the relayer fee — cap that separately with `--max-gasfree-fee` (or `--max-gasfree-fee-raw`). See the [CLI command reference](../cli/command-reference.md#gasfree-payments-tron).

### How Payment Schemes Work

1. **Authorize**
   The client signs a typed-data message authorizing the payment (exact amount, or a maximum for `upto`/`batch-settlement`).

2. **Execute**
   The server performs the requested task and (for usage-based schemes) calculates the **actual cost**.

3. **Settle**
   The Facilitator submits the on-chain transaction — `transferWithAuthorization`, Permit2 `permitTransferFrom`, a batch claim, or a GasFree relay — based on the scheme.

<ThemedImage
  alt="How payment schemes work: authorize, execute, settle"
  sources={{
    light: '/img/diagrams/x402-payment-scheme-flow.light.svg',
    dark: '/img/diagrams/x402-payment-scheme-flow.svg',
  }}
/>

---

## Deploying a Private Facilitator

You may deploy your own Facilitator to gain full control over payment verification and settlement. The self-hosted example (`examples/typescript/facilitator/basic`) is an Express service exposing `/verify`, `/settle`, `/supported` — no database required.

### Core Responsibilities

1. **Verify** – Validate typed-data signatures and payload integrity
2. **Submit** – Construct and broadcast the on-chain settlement transaction
3. **Monitor** – Track on-chain confirmations to ensure final settlement

### Deployment Requirements

- **Node Access** – Reliable RPC access (e.g. TronGrid or an EVM JSON-RPC endpoint for BSC/Base)
- **Gas Funding** – A wallet with sufficient **TRX/BNB/ETH** to cover settlement gas fees
- **Service Deployment** – Run the example facilitator from `examples/typescript/facilitator/basic`

> For detailed configuration and API references, see the [Facilitator](./facilitator.md) documentation and the [Quickstart for Sellers](../getting-started/quickstart-for-sellers.md).

---

## Quick Reference

| Core Component | TRON/BSC/Base Implementation |
| :------------- | :---------------------- |
| **Networks**   | `tron:0x2b6653dc`, `tron:0x94a9059e`, `tron:0xcd8690dc`, `eip155:56`, `eip155:97`, `eip155:8453`, `eip155:84532` |
| **Token Standard** | TRC-20 (built-in USDT & USDD support), BEP-20, ERC-20 (Base official USDC) |
| **Signing Mechanism** | TIP-712 / EIP-712 typed data signing |
| **Payment Schemes** | `exact`, `upto`, `batch-settlement`, `exact_gasfree` (TRON) |

---

## Adding Custom Tokens

On the **client / facilitator** side, register a custom TRC-20 token via the TRON token registry (`@bankofai/x402-tron`):

```typescript
import { registerToken, TRON_NILE } from "@bankofai/x402-tron";

registerToken(TRON_NILE, {
  address: "<YOUR_TOKEN_CONTRACT_ADDRESS>",
  decimals: 6,
  name: "My Token",
  symbol: "MYT",
});
```

On the **resource server** side, custom EVM tokens are advertised by adding an entry to the server's `EVM_TOKENS` table in `src/chains/evm.ts` — an explicit `{ asset, amount, extra }` object. Adding a chain is one table entry; no SDK changes are needed.

Once registered, you can use the custom token symbol in TRON prices (e.g., `"0.001 MYT"`).

---

## Summary

x402 is deeply tailored for blockchain-native architectures, providing seamless TRC-20/BEP-20/ERC-20 integration and secure signature support.

### Key Takeaways

- **Development Environment**: Use testnets for development and debugging.
- **Default Settlement Asset**: TRON/BSC routes use their configured stablecoins; Base uses official **USDC**.
- **Security Model**: TIP-712 / EIP-712 typed data signing ensures secure, trust-minimized payment authorization.
- **Extensibility**: Expand support for any custom TRC-20/BEP-20 token via the TRON token registry (`registerToken`) or the server's `EVM_TOKENS` config table.
