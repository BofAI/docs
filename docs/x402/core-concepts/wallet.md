---
title: 'Wallet'
description: 'This page explains the role of the **wallet** in the x402-tron protocol.'
---

In x402-tron, a TRON wallet is both a payment mechanism and a form of unique identity for buyers and sellers. Wallet addresses are used to send, receive, and verify payments, while also serving as identifiers within the protocol.

### Role of the Wallet

#### For Buyers

Buyers use TRON wallets to:

- Store USDT/TRC-20 tokens
- Sign TIP-712 payment payloads
- Authorize onchain payments programmatically
- Manage token allowances for facilitators

Wallets enable buyers, including AI agents, to transact without account creation or credential management.

#### For Sellers

Sellers use TRON wallets to:

- Receive USDT/TRC-20 payments
- Define their payment destination within server configurations

A seller's TRON wallet address is included in the payment requirements provided to buyers.

### TRON Wallet Addresses

TRON uses base58-encoded addresses that start with 'T'. For example:

- Example: `TXxx...xxxX` (Base58 encoded, starts with `T`)

### TIP-712 Signing

x402-tron uses TIP-712 (TRON's implementation of EIP-712) for structured data signing. This provides:

- **Human-readable signing**: Users can see what they're authorizing
- **Domain separation**: Signatures are bound to specific contracts/domains
- **Replay protection**: Signatures include nonces and expiration

The signing flow:

1. Client receives payment requirements from server
2. Client constructs a TIP-712 typed data structure
3. Client signs the data with their private key
4. Signature is included in the `PAYMENT-SIGNATURE` header

### Token Allowances

For the `exact` payment scheme, clients must approve the PaymentPermit contract to transfer tokens from their wallet for payment settlement. This is done via the standard TRC-20 `approve` function.

The x402-tron client SDK handles this automatically.

### Network-Specific Endpoints

TRON full nodes / API endpoints for each network:

| Network          | Endpoint                         |
| ---------------- | -------------------------------- |
| Mainnet          | `https://api.trongrid.io`        |
| Nile (Testnet)   | `https://nile.trongrid.io`       |
| Shasta (Testnet) | `https://api.shasta.trongrid.io` |

### Security Best Practices

- **Never expose private keys**: Use environment variables for key storage
- **Use testnet for development**: Test on Nile or Shasta before mainnet
- **Limit allowances**: Only approve the amount needed for payments
- **Monitor transactions**: Track payments and allowances on TronScan

### Summary

- TRON wallets enable programmatic, permissionless payments in x402-tron.
- Buyers use wallets to pay for services via TIP-712 signed authorizations.
- Sellers use wallets to receive payments.
- Wallet addresses also act as unique identifiers within the protocol.
- The SDK handles token allowances automatically.

Next, explore:

- [Network and Token Support](./network-and-token-support.md) — supported networks and tokens
- [SDK Features](../sdk-features.md) — explore the full capabilities of x402-tron SDKs
