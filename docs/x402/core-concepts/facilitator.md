import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Facilitator

The Facilitator is an **optional but highly recommended** service designed to simplify payment verification and settlement between clients (buyers) and servers (sellers) on blockchain networks.

## What is a Facilitator?

A Facilitator is a middleware service primarily responsible for:

- **Payload Verification**: Validating the payment payload submitted by the client.
- **Settlement Execution**: Submitting transactions to the blockchain on behalf of the server to complete settlement.
- **Token Transfer**: Executing the on-chain settlement for the scheme — ERC-3009 `transferWithAuthorization`, a Permit2 transfer via the `x402ExactPermit2Proxy` (`exact`) or `x402UptoPermit2Proxy` (`upto`), a batch-settlement claim, or a GasFree relay.

By introducing a Facilitator, servers no longer need to maintain direct connections to blockchain nodes or implement complex signature verification logic themselves. This reduces operational complexity while ensuring accurate and real-time transaction validation.

## Responsibilities of the Facilitator

- **Payment Verification**: Ensures that the signed payload strictly complies with the server's declared payment requirements.
- **Payment Settlement**: Submits validated transactions to the blockchain and monitors their confirmation status.
- **Settlement Records**: Persists one row per settle attempt — the store applies no de-duplication and holds no unique constraint, so failures and retries accumulate. At most one *successful* row exists per authorization identity in practice, because on-chain replay protection lets a given authorization settle only once. It also answers record queries, seller-scoped when the caller authenticates. A save failure is logged but never changes the `/settle` response.
- **Result Feedback**: Returns verification and settlement results to the server, enabling it to decide whether to deliver the requested resource.

> **Note**: The Facilitator **does not custody funds** and does not act as an escrow. It only executes verification and on-chain operations according to the client's signed authorization.

## Why Use a Facilitator?

Integrating a Facilitator provides significant advantages:

- **Reduced Operational Overhead**: Servers do not need to directly manage blockchain nodes or RPC infrastructure.
- **Protocol Standardization**: Ensures consistent payment verification and settlement processes across services.
- **Fast Integration**: Servers can begin accepting payments with minimal blockchain development effort.
- **Resource Fee Management**: The Facilitator covers transaction execution costs such as TRX (Energy and Bandwidth) / BNB, reducing the operational burden on the server. Since SDK 1.2.0 a TRON Facilitator may additionally opt into the `trc20ApprovalResourceSponsoring` extension, temporarily delegating its own Stake 2.0 Energy — and, when needed, Bandwidth — to the payer so the payer's first `approve(Permit2)` costs them no TRX. This is opt-in: the Facilitator must register the sponsoring runtime together with a bounded sponsorship policy and a durable operation coordinator. Either way the resource server must also declare the extension on the route — that declaration is what makes an SDK client attach the sponsoring payload (the Facilitator itself does not check it, so a non-SDK client could skip that step). EVM networks have an equivalent capability — sponsoring the payer's ERC-20 `approve` gas — but the SDK does not wire it up for you: a self-hosted Facilitator must register the extension itself. The official Facilitator registers it for the EVM networks it serves; see [Official Facilitator](./OfficialFacilitator.md).

Although developers may implement verification and settlement logic locally, using a Facilitator significantly accelerates development and ensures protocol-compliant implementation.

---

## Facilitator Options: Which Should You Use?

To use x402, you need access to a Facilitator service. There are currently two options:

| | Official Facilitator | Self-Hosted Facilitator |
|---|---|---|
| **Best for** | Most sellers, especially those new to x402 | Advanced users who need full control over the settlement wallet, RPC endpoints, and which networks/schemes are registered |
| **Requires server maintenance** | No | Yes |
| **Requires a settlement wallet** | No | Yes — a funded wallet resolved through `@bankofai/agent-wallet` (pays network fees) |
| **Setup difficulty** | Low (just obtain an API Key) | Medium (requires deployment and configuration) |
| **Network & scheme control** | Fixed set | Fully customizable |
| **Recommended for** | Testing, quick launch, small to medium-scale apps | Large-scale production, private or compliance-bound deployments |

---

## Option 1: Use the Official Facilitator (Recommended)

The officially hosted Facilitator service is available and ready to use — no infrastructure to maintain on your side.

**Workflow:** Obtain an API Key → Add it to your project → Point `FACILITATOR_URL` at the official service endpoint.

**The official service involves two distinct URLs — please note the difference:**

| Address | Purpose |
|---------|---------|
| [https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io) | **Admin Portal** — Register, create, and manage your Facilitator API Key (open in browser) |
| [https://facilitator.bankofai.io](https://facilitator.bankofai.io) | **Service Endpoint** — Set as `FACILITATOR_URL` in your code; handles payment verification and settlement (API calls only, not for browser access) |

Quick usage examples can be found in [OfficialFacilitator](./OfficialFacilitator.md)

---

## Option 2: Self-Hosted Facilitator

If you need full control over the settlement wallet, RPC endpoints, energy management, or which networks and schemes are registered — or you have specific privacy or compliance requirements — you can deploy your own Facilitator service.

> ⚠️ **Self-hosting security notes:**
> - A self-hosted Facilitator needs a **dedicated funded wallet** to pay blockchain transaction fees. It is resolved through `@bankofai/agent-wallet` and unlocked out-of-band (for example `AGENT_WALLET_PASSWORD`) — the raw private key never enters the service process
> - **This Facilitator wallet should be separate from your payment recipient wallet** — create a new wallet specifically for this purpose
> - Only deposit a small amount of tokens into the Facilitator wallet (enough for fees); do not store large amounts
> - Never place a raw private key in `.env`, a config file, or a shell command — **and never upload wallet material to GitHub or share it with anyone**

Quick usage examples can be found in [Quickstart for Sellers](../getting-started/quickstart-for-sellers.md)

---

## Facilitator API Endpoints

Whether using the official service or a self-hosted instance, the Facilitator provides the following standard API endpoints:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/supported` | Supported payment capabilities and configuration |
| POST | `/verify` | Verify payment payload validity |
| POST | `/settle` | Execute on-chain settlement (**rate-limited**, see below); persists a settlement record |
| GET | `/payments/tx/{tx_hash}` | Query payment records by settlement transaction hash (seller-scoped when authenticated) |
| GET | `/payments?network=&nonce=[&asset=&payer=]` | Query payment records by the on-chain authorization identity (seller-scoped when authenticated) |
| GET | `/payments` | Authenticated seller's settlement feed (`?limit=&offset=`; `limit` defaults to `50` and is capped at `200`, `offset` defaults to `0`) |
| GET | `/metrics` | Prometheus metrics (operational; exposed on the main port only when monitoring shares it) |
| ALL | `/mainnet/*` · `/nile/*` | GasFree Open API transparent proxy (HMAC-signed) — used internally by the TRON `exact_gasfree` scheme |

Record-query failures use these codes: `404 not_found` when no record matches, `400 invalid_identity_query` for a partial identity query (any of `network`/`nonce`/`asset`/`payer` without the required `network`+`nonce` pair), and `400 missing_identity_or_auth` when `/payments` is called with neither identity parameters nor an API Key.

> There is **no** `/fee/quote` endpoint, and the schemes carry no facilitator fee at all. Payment records are keyed on the on-chain authorization identity (`network` + `scheme` + `asset` + `payer` + `nonce`), not a client-supplied payment ID.

---

## Rate Limiting

The `/settle` endpoint enforces dynamic rate limits based on the caller's authentication status:

| Mode | Rate Limit | How to Authenticate |
|------|------------|---------------------|
| **Authenticated** | Official service: 1000 requests per API Key per minute. Self-hosted deployments use the same default when `rate_limit.authenticated` is omitted (configurable). | Include `X-API-KEY: <your_key>` header |
| **Anonymous** | Official service: 1 request per IP per minute. Self-hosted deployments default to 10 requests per IP per minute when `rate_limit.anonymous` is omitted (configurable). | No API Key provided |

Other endpoints (`/verify`, `/supported`, `/payments/*`) are not individually rate-limited.

> **Tip**: For any production workload, apply for an API Key via the [Admin Portal](https://admin-facilitator.bankofai.io) to unlock the higher rate limit.

---

## Payment Record Queries

The `/payments/tx/{tx_hash}` and `/payments?network=&nonce=[&asset=&payer=]` endpoints support querying historical payment records; `/payments` alone returns the authenticated seller's settlement feed. Records are keyed on the on-chain authorization identity (`network` + `scheme` + `asset` + `payer` + `nonce`) rather than a client-supplied payment ID.

When the request includes a valid `X-API-KEY` header, the results are **automatically scoped to the seller** associated with that API Key — you will only see your own payment records.

:::danger Anonymous identifier lookups are not seller-scoped
How access currently behaves:

- **With a valid `X-API-KEY`** — results are filtered to the seller that key belongs to.
- **Anonymous `tx_hash` or `network` + `nonce` lookup** — the current implementation adds **no seller filter**, so the response may include records that are bound to a seller.
- **The `/payments` list endpoint** — still requires authentication: with no identity parameters and no API Key it returns `400`, and a partial identity query returns `400` rather than degrading into a feed.
- **No rate limit on these lookups** — the official service's 1-request-per-IP-per-minute anonymous limit applies to `/settle` only; the record-query endpoints are not individually rate-limited.

Settlement tx hashes are public on-chain data, and the `network` + `nonce` lookup additionally resolves **failed** settlements — including pre-broadcast failures, which carry no tx hash at all and so cannot be reached any other way. The practical consequence is that **settlement metadata should be treated as effectively public**, even though no unauthenticated listing endpoint exists. The response body never includes the seller id, so what a lookup exposes is the payment metadata of a seller-bound record, not seller attribution.

**This describes the current implementation, not a recommended access-control policy.** Do not design around it: never treat a settlement tx hash or its authorization nonce as a secret, and send an API Key whenever a query should be scoped to your own account. The behavior may be tightened in a future release.
:::

---

## Fees

The current schemes carry **no facilitator fee**: there is no `base_fee` configuration, no fee object in the payment requirements, and no `/fee/quote` endpoint — all removed in SDK 1.0.1. A settlement transfers the signed amount to the seller — never less than the advertised amount, and exactly that amount when paying with the official SDK or CLI clients.

The costs that do exist:

- **Network fees** (TRX energy/bandwidth, BNB or ETH gas) are paid by the Facilitator's settlement wallet.
- **The GasFree relayer fee** on TRON `exact_gasfree` — the relayer's service charge for fronting the network energy (a per-payment transfer fee, plus a one-time activation fee for a new GasFree account) — is set by the relayer and deducted from the payment token on top of the payment amount. Clients should cap it explicitly.

---

## Trust Model

The x402 protocol is designed around **minimal trust assumptions**:

- **Signature-Based Authorization**: The Facilitator can only transfer funds within the scope explicitly authorized by the client's signature.
- **Direct Fund Flow**: Under `exact` and `upto`, funds move directly from the client to the seller without passing through a pooled account. `batch-settlement` is the deliberate exception — the payer deposits into an on-chain escrow that holds channel balances until a settle operation sweeps many claims into one transfer. No scheme takes a facilitator fee.
- **On-Chain Transparency**: All transactions are publicly verifiable on-chain.

Even a **malicious Facilitator** cannot:

- Transfer funds beyond the client's authorized limit.
- Redirect funds to an address not specified in the signed payload.
- Modify any signed payment terms.

---

## Summary

Within the x402 protocol architecture, the **Facilitator** serves as an independent on-chain verification and settlement layer. It enables servers to securely confirm payments and complete blockchain settlements without deploying a full blockchain infrastructure.

---

## Next Steps

- [Official Facilitator](./OfficialFacilitator.md) — How to apply for and configure an API Key for the official Facilitator (step-by-step with screenshots)
- [Quickstart for Sellers](../getting-started/quickstart-for-sellers.md) — Complete server-side integration walkthrough
- [Wallet](./wallet.md) — Learn how to manage wallets used for payments
- [Network and Token Support](./network-and-token-support.md) — Learn about supported networks and tokens
