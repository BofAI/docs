# Wallet

In the x402 protocol, a wallet is more than just a container for funds — it serves as the **core identity** for both buyers (clients) and sellers (servers) in a decentralized network.

Wallet addresses are used to send, receive, and verify payments. They function as the unique credential for protocol interactions, eliminating the need for traditional account-password systems.

---

## Role of the Wallet

### For Buyers

Buyers use their wallet as the primary interaction anchor, responsible for:

- **Asset Custody**: Securely storing USDT or other TRC-20/BEP-20 tokens.
- **Signature Authorization**: Cryptographically signing payment payloads using their private key.
- **Programmatic Payments**: Authorizing on-chain fund transfers via code (especially suitable for autonomous AI agents).
- **Allowance Management**: Managing token allowances granted to the Facilitator contract.

> **Stateless Authentication**: With wallet-based identity, buyers can initiate transactions without account registration, API keys, or login sessions.

---

### For Sellers

Sellers use wallets as payment receiving endpoints:

- **Receiving Funds**: Acting as the final settlement address for USDT/TRC-20/BEP-20 payments.
- **Configuration Target**: Explicitly defining the receiving wallet address in server configuration.

The seller’s wallet address is included directly in the `HTTP 402` Payment Requirements, ensuring transparent fund routing.

---

## TRON Address Format

TRON uses **Base58**-encoded addresses that always start with the letter `T`.

- Example: `TXxx...xxxX` (Base58, starting with `T`)

---

## BSC Address Format

BSC uses **hexadecimal (0x-prefixed)** addresses, fully compatible with Ethereum.

- Example: `0x55d3...97955` (Hex, starting with `0x`)

---

## Payment Signatures

x402 uses typed data signing for secure payment authorization.

### Core Advantages

- **What You See Is What You Sign (Human-readable)**  
  Users can clearly review authorization details before signing, rather than approving opaque hash data.

- **Domain Separation**  
  Signatures are strictly bound to a specific contract and domain, preventing cross-application or cross-network misuse.

- **Replay Protection**  
  Embedded `nonce` values and expiration timestamps prevent malicious replay attacks.

---

### Signature Flow

1. The client receives the payment requirement from the server.
2. The client constructs a compliant TypedData structure.
3. The client signs the data using their private key.
4. The generated signature is sent in the `PAYMENT-SIGNATURE` request header.

---

## Token Approval

For the `exact_permit` payment scheme, the client must authorize the `PaymentPermit` contract to transfer tokens from their wallet for settlement.  

This is completed via the standard TRC-20/BEP-20 `approve` function.

The x402 client SDK automatically handles this process.

---

## Network RPC Endpoints

### TRON RPC Endpoints

| Network | RPC Endpoint |
| :------- | :------------ |
| **Mainnet** | `https://api.trongrid.io` |
| **Nile (Testnet)** | `https://nile.trongrid.io` |
| **Shasta (Testnet)** | `https://api.shasta.trongrid.io` |

---

### BSC RPC Endpoints

| Network | RPC Endpoint |
| :------- | :------------ |
| **Mainnet** | `https://bsc-dataseed.binance.org` |
| **Testnet** | `https://data-seed-prebsc-1-s1.binance.org:8545` |

---

## Security Best Practices

- **Never Expose Private Keys**  
  Do not hardcode private keys in source code. Store them securely using environment variables.

- **Use Testnets First**  
  Always complete development and validation on testnet before deploying to mainnet.

- **Approve Minimum Required Amounts**  
  Follow the principle of least privilege by approving only the necessary token amount.

- **Monitor Transactions in Real Time**  
  Use TronScan/BscScan to track payment status and allowance records for enhanced security.

---

## Summary

- **Core Foundation**: Wallets enable programmatic, permissionless payments in x402.
- **Buyer Action**: Buyers generate signatures to authorize and pay for services.
- **Seller Reception**: Sellers receive funds directly via wallet addresses.
- **Identity Layer**: Wallet addresses serve as the unique identity within protocol interactions.
- **Automation Support**: The SDK automatically manages token approval logic, simplifying development.

---

## Next Steps

Continue exploring:

- [Network & Token Support](./network-and-token-support.md) — View supported networks and token lists  
- [SDK Features](../sdk-features.md) — Explore the full capabilities of the x402 SDK  
