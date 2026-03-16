import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Facilitator

The Facilitator is an **optional but highly recommended** service designed to simplify payment verification and settlement between clients (buyers) and servers (sellers) on blockchain networks.

## What is a Facilitator?

A Facilitator is a middleware service primarily responsible for:

- **Payload Verification**: Validating the payment payload submitted by the client.
- **Settlement Execution**: Submitting transactions to the blockchain on behalf of the server to complete settlement.
- **Token Transfer**: Executing token transfers by calling the `permitTransferFrom` method of the `PaymentPermit` contract.

By introducing a Facilitator, servers no longer need to maintain direct connections to blockchain nodes or implement complex signature verification logic themselves. This reduces operational complexity while ensuring accurate and real-time transaction validation.

## Responsibilities of the Facilitator

- **Payment Verification**: Ensures that the signed payload strictly complies with the server's declared payment requirements.
- **Payment Settlement**: Submits validated transactions to the blockchain and monitors their confirmation status.
- **Fee Management**: Supports configurable service fees (optional) for facilitating payments.
- **Result Feedback**: Returns verification and settlement results to the server, enabling it to decide whether to deliver the requested resource.

> **Note**: The Facilitator **does not custody funds** and does not act as an escrow. It only executes verification and on-chain operations according to the client's signed authorization.

## Why Use a Facilitator?

Integrating a Facilitator provides significant advantages:

- **Reduced Operational Overhead**: Servers do not need to directly manage blockchain nodes or RPC infrastructure.
- **Protocol Standardization**: Ensures consistent payment verification and settlement processes across services.
- **Fast Integration**: Servers can begin accepting payments with minimal blockchain development effort.
- **Resource Fee Management**: The Facilitator covers transaction execution costs such as TRX (Energy and Bandwidth) / BNB, reducing the operational burden on the server.

Although developers may implement verification and settlement logic locally, using a Facilitator significantly accelerates development and ensures protocol-compliant implementation.

---

## Facilitator Options: Which Should You Use?

To use x402, you need access to a Facilitator service. There are currently two options:

| | Official Facilitator | Self-Hosted Facilitator |
|---|---|---|
| **Best for** | Most sellers, especially those new to x402 | Advanced users who need full control over fee policies and energy management |
| **Requires server maintenance** | No | Yes |
| **Requires wallet private key** | No | Yes (for paying transaction fees) |
| **Setup difficulty** | Low (just obtain an API Key) | Medium (requires deployment and configuration) |
| **Fee control** | Fixed policy | Fully customizable |
| **Recommended for** | Testing, quick launch, small to medium-scale apps | Large-scale production, custom fee structures |

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

If you need full control over fee policies and energy management, or have specific privacy or compliance requirements, you can deploy your own Facilitator service.

> ⚠️ **Self-hosting security notes:**
> - A self-hosted Facilitator requires a **dedicated wallet** private key to pay blockchain transaction fees
> - **This Facilitator wallet should be separate from your payment recipient wallet** — create a new wallet specifically for this purpose
> - Only deposit a small amount of tokens into the Facilitator wallet (enough for fees); do not store large amounts
> - Keep the private key only in your `.env` file — **never upload it to GitHub or share it with anyone**

Quick usage examples can be found in [quickstart-for-sellers](../getting-started/quickstart-for-sellers.md)

---

## Facilitator API Endpoints

Whether using the official service or a self-hosted instance, the Facilitator provides the following standard API endpoints:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/supported` | Supported payment capabilities and configuration |
| POST | `/fee/quote` | Get fee quote for payment requirements |
| POST | `/verify` | Verify payment payload validity |
| POST | `/settle` | Execute on-chain settlement (**rate-limited** on the Official Facilitator) |
| GET | `/payments/{payment_id}` | Query payment records by payment ID |
| GET | `/payments/tx/{tx_hash}` | Query payment records by transaction hash |

---

## Fee Structure

The Facilitator supports flexible service fee configurations:

- **Base Fee**: A fixed service fee per transaction (e.g., `1 USDT`).
- **Percentage Fee**: A percentage-based fee calculated from the transaction amount.
- **No Fee Mode**: Supports zero-fee operation.

Detailed fee information is returned via the `/fee/quote` endpoint and included in the Payment Requirements sent from the server to the client.

---

## Trust Model

The x402 protocol is designed around **minimal trust assumptions**:

- **Signature-Based Authorization**: The Facilitator can only transfer funds within the scope explicitly authorized by the client's signature.
- **Direct Fund Flow**: Funds move directly from the client to the seller (and partially to the Facilitator if fees apply), without passing through a pooled account.
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
