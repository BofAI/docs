---
title: 'Client / Server'
description: 'This page explains the roles and responsibilities of the **client** and **server** in the x402-tron protocol.'
---

Understanding these roles is essential to designing, building, or integrating services that use x402-tron for programmatic payments on TRON blockchain.

**Note**

Client refers to the technical component making an HTTP request. In practice, this is often the _buyer_ of the resource.

Server refers to the technical component responding to the request. In practice, this is typically the _seller_ of the resource.

### Client Role

The client is the entity that initiates a request to access a paid resource.

Clients can include:

- Human-operated applications
- Autonomous agents
- Programmatic services acting on behalf of users or systems

#### Responsibilities

- **Initiate requests:** Send an HTTP request to the resource server.
- **Handle payment requirements:** Read the `402 Payment Required` response and extract payment details.
- **Manage token allowances:** Approve the PaymentPermit contract to transfer tokens from the client's wallet for payment settlement.
- **Prepare payment payload:** Use the provided payment requirements to construct a TIP-712 signed payment payload.
- **Resubmit request with payment:** Retry the request with the `PAYMENT-SIGNATURE` header containing the signed payment payload.

Clients do not need to manage accounts, credentials, or session tokens beyond their TRON wallet. All interactions are stateless and occur over standard HTTP requests.

### Server Role

The server is the resource provider enforcing payment for access to its services.

Servers can include:

- API services
- Content providers
- Any HTTP-accessible resource requiring monetization

#### Responsibilities

- **Define payment requirements:** Respond to unauthenticated requests with an HTTP `402 Payment Required`, including all necessary payment details in the response body.
- **Verify payment payloads:** Validate incoming TIP-712 signed payment payloads using a facilitator service.
- **Settle transactions:** Upon successful verification, submit the payment for settlement via the facilitator.
- **Provide the resource:** Once payment is confirmed, return the requested resource to the client.

Servers do not need to manage client identities or maintain session state. Verification and settlement are handled per request through the facilitator.

### Communication Flow

The typical flow between a client and a server in the x402-tron protocol is as follows:

1. **Client initiates request** to the server for a paid resource.
2. **Server responds with `402 Payment Required`**, including the payment requirements in the `PAYMENT-REQUIRED` header (Base64-encoded).
3. **Client prepares and submits a payment payload** based on the provided requirements, signing with TIP-712 and including it in the `PAYMENT-SIGNATURE` header (Base64-encoded).
4. **Server verifies the payment payload** through the facilitator service.
5. **Server settles the payment** via the facilitator which submits the transaction to TRON blockchain.
6. **Server responds with the requested resource**, including a `PAYMENT-RESPONSE` header (Base64-encoded) with settlement confirmation including the TRON transaction hash.

### Summary

In the x402-tron protocol:

- The **client** requests resources and supplies the TIP-712 signed payment payload.
- The **server** enforces payment requirements, verifies transactions, and provides the resource upon successful payment.

This interaction is stateless, HTTP-native, and compatible with both human applications and automated agents.

Next, explore:

- [Facilitator](./facilitator.md) — how servers verify and settle payments
- [Wallet](./wallet.md) — how to manage TRON wallets for payments
