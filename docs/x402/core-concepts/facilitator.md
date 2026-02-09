---
title: 'Facilitator'
description: 'This page explains the role of the **facilitator** in the x402-tron protocol.'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The facilitator is an optional but recommended service that simplifies the process of verifying and settling payments between clients (buyers) and servers (sellers) on TRON blockchain.

### What is a Facilitator?

The facilitator is a service that:

- Verifies payment payloads (TIP-712 signatures) submitted by clients.
- Settles payments on the TRON blockchain on behalf of servers.
- Executes token transfers by calling the `permitTransferFrom` method of the PaymentPermit contract.

By using a facilitator, servers do not need to maintain direct TRON blockchain connectivity or implement payment verification logic themselves. This reduces operational complexity and ensures accurate, real-time validation of transactions.

### Facilitator Responsibilities

- **Verify payments:** Confirm that the client's TIP-712 signed payment payload meets the server's declared payment requirements.
- **Settle payments:** Submit validated payments to the TRON blockchain and monitor for confirmation.
- **Fee management:** Optionally charge a fee for facilitating payments.
- **Provide responses:** Return verification and settlement results to the server, allowing the server to decide whether to fulfill the client's request.

The facilitator does not hold funds or act as a custodian - it performs verification and execution of onchain transactions based on signed payloads provided by clients.

### Why Use a Facilitator?

Using a facilitator provides:

- **Reduced operational complexity:** Servers do not need to interact directly with TRON nodes.
- **Protocol consistency:** Standardized verification and settlement flows across services.
- **Faster integration:** Services can start accepting payments with minimal TRON-specific development.
- **Energy/Bandwidth management:** Facilitator handles TRX costs for transaction execution.

While it is possible to implement verification and settlement locally, using a facilitator accelerates adoption and ensures correct protocol behavior.

### Facilitator Options

To use x402-tron, you need access to a facilitator service. You have two options:

1. **Run Your Own Facilitator (Self-Hosted):** You can deploy and manage your own facilitator instance. This gives you full control over fees and energy management.
2. **Use Official Facilitator (Coming Soon):** We are working on a hosted, official facilitator service that you can use without managing infrastructure. Stay tuned for updates!

### Facilitator Endpoints

A facilitator exposes the following API endpoints:

| Endpoint     | Method | Description                 |
| ------------ | ------ | --------------------------- |
| `/supported` | GET    | Supported capabilities      |
| `/fee/quote` | POST   | Get fee quote for a payment |
| `/verify`    | POST   | Verify a payment payload    |
| `/settle`    | POST   | Settle payment on-chain     |

For implementation details, see [Quickstart for Sellers](../getting-started/quickstart-for-sellers.md).

### Fee Structure

Facilitators can charge fees for their services:

- **Base fee**: Fixed fee per transaction (e.g., 1 USDT)
- **Percentage fee**: Percentage of transaction amount
- **No fee**: Some facilitators operate without fees

The fee is specified in the `/fee/quote` response and included in the payment requirements sent to clients.

### Trust Model

The x402-tron protocol is designed to be trust-minimizing:

- **Client signs the authorization**: The facilitator can only transfer up to the authorized amount.
- **Payment goes directly to seller**: Funds are transferred from client to seller (and optionally fee to facilitator).
- **On-chain verification**: All transactions are verifiable on TRON blockchain.

A malicious facilitator cannot:

- Transfer more than the client authorized
- Transfer to a different recipient than specified
- Modify the signed payment terms

### Summary

The facilitator acts as an independent verification and settlement layer within the x402-tron protocol on TRON blockchain. It helps servers confirm payments and submit transactions without requiring direct TRON infrastructure.

Next, explore:

- [Wallet](./wallet.md) — how to manage TRON wallets for payments
- [Network and Token Support](./network-and-token-support.md) — supported networks and tokens
