---
title: 'HTTP 402'
description: 'For decades, HTTP 402 Payment Required has been reserved for future use. x402-tron unlocks it for TRON blockchain payments.'
---

### What is HTTP 402?

[HTTP 402](https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.2) is a standard, but rarely used, HTTP response status code indicating that payment is required to access a resource.

In x402-tron, this status code is activated to:

- Inform clients (buyers or agents) that payment is required.
- Communicate the details of the payment, such as amount, token, and destination TRON address.
- Provide the information necessary to complete the payment programmatically via TIP-712 signing.

### Why x402-tron Uses HTTP 402

The primary purpose of HTTP 402 is to enable frictionless, API-native payments for accessing web resources, especially for:

- Machine-to-machine (M2M) payments (e.g., AI agents).
- Pay-per-use models such as API calls or paywalled content.
- Micropayments without account creation or traditional payment rails.
- TRON-based stablecoin (USDT) payments for global accessibility.

Using the 402 status code keeps x402-tron protocol natively web-compatible and easy to integrate into any HTTP-based service.

### Payment Headers

x402-tron uses standardized headers for payment communication:

- **`PAYMENT-REQUIRED`**: Contains the Base64-encoded payment requirements from the server. This header is returned in the 402 response, telling the client what payment is required.
- **`PAYMENT-SIGNATURE`**: Contains the Base64-encoded payment payload from the client. This header is sent by the client when retrying a request after receiving a 402 response, proving they have authorized payment.
- **`PAYMENT-RESPONSE`**: Contains the Base64-encoded settlement response from the server. This header is returned by the server in the successful response, confirming the payment was verified and settled, including the TRON transaction hash.

Both headers must contain valid Base64-encoded JSON strings. This encoding ensures compatibility across different HTTP implementations and prevents issues with special characters in JSON payloads.

### Payment Requirements Structure

When a server returns a 402 response, the `PAYMENT-REQUIRED` header contains:

```json
{
  "x402Version": 2,
  "error": "Payment required",
  "resource": {
    "url": "http://example.com/protected",
    "description": null,
    "mimeType": null
  },
  "accepts": [
    {
      "scheme": "exact",
      "network": "tron:nile",
      "amount": "100",
      "asset": "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
      "payTo": "<SELLER_TRON_ADDRESS>",
      "maxTimeoutSeconds": 3600,
      "extra": {
        "name": "Tether USD",
        "version": "1",
        "fee": {
          "facilitatorId": "<FACILITATOR_URL>",
          "feeTo": "<FACILITATOR_FEE_RECEIVER_ADDRESS>",
          "feeAmount": "100"
        }
      }
    }
  ]
}
```

**Key fields:**

| Field               | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `x402Version`       | Protocol version (currently 2)                            |
| `error`             | Human-readable error message                              |
| `resource`          | Information about the requested resource                  |
| `accepts`           | Array of accepted payment options                         |
| `scheme`            | Payment scheme (`exact` for fixed amount)                 |
| `network`           | TRON network identifier (`tron:nile`, `tron:mainnet`)     |
| `amount`            | Payment amount in smallest unit (e.g., 100 = 0.0001 USDT) |
| `asset`             | TRC-20 token contract address                             |
| `payTo`             | Seller's TRON wallet address                              |
| `maxTimeoutSeconds` | Maximum time for payment validity                         |
| `extra.fee`         | Facilitator fee information                               |

### Payment Signature Structure

The client responds with a TIP-712 signed payload in the `PAYMENT-SIGNATURE` header:

```json
{
  "x402Version": 2,
  "scheme": "exact",
  "network": "tron:nile",
  "payload": {
    "signature": "0x...",
    "authorization": {
      "from": "<CLIENT_TRON_ADDRESS>",
      "to": "<SELLER_TRON_ADDRESS>",
      "value": "100",
      "validAfter": 1770364361,
      "validBefore": 1770367961,
      "nonce": "238244758379819673006209461499601971084"
    }
  }
}
```

### Summary

HTTP 402 is the foundation of the x402-tron protocol, enabling services to declare payment requirements directly within HTTP responses. It:

- Signals payment is required
- Communicates necessary payment details (amount, token, TRON addresses)
- Integrates seamlessly with standard HTTP workflows
- Enables programmatic payments on TRON blockchain

Next, explore:

- [Client / Server](./client-server.md) — understand the roles and responsibilities of clients and servers
- [Facilitator](./facilitator.md) — how servers verify and settle payments
