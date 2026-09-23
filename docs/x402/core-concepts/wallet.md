# Wallet

In the x402 protocol, a wallet is more than just a container for funds — it serves as the **core identity** for both buyers (clients) and sellers (servers) in a decentralized network.

Wallet addresses are used to send, receive, and verify payments. They function as the unique credential for protocol interactions, eliminating the need for traditional account-password systems.

---

## Role of the Wallet

### For Buyers

Buyers use their wallet as the primary interaction anchor, responsible for:

- **Asset Custody**: Securely storing USDT, USDC or other TRC-20 / BEP-20 / ERC-20 tokens.
- **Signature Authorization**: Cryptographically signing payment payloads using their private key.
- **Programmatic Payments**: Authorizing on-chain fund transfers via code (especially suitable for autonomous AI agents).
- **Allowance Management**: Managing the one-time `approve(Permit2, max)` allowance granted to the Permit2 contract — the facilitator then pulls the funds through the x402 Permit2 proxy.

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

For the `exact` payment scheme, plain ERC-20/TRC-20 tokens (e.g. BSC USDC/USDT, TRON USDT/USDD) settle via the Permit2 path. The client must authorize the Permit2 contract to transfer tokens — a one-time `approve(Permit2, max)`. On TRON the client SDK auto-broadcasts this approve on the first payment; on EVM it never broadcasts — it attaches a signed, unbroadcast approve for the facilitator to relay when the server advertises a gas-sponsoring extension, and otherwise the allowance must be granted once out of band or verification fails with `permit2_allowance_required`. On TRON, when the resource server advertises `trc20ApprovalResourceSponsoring` (SDK 1.2.0+), the client signs the `approve(Permit2, MaxUint256)` transaction but does not broadcast it — the facilitator temporarily delegates the Energy — and, when needed, Bandwidth — that the payer lacks and broadcasts it, so the payer needs no TRX for that first approve. This requires an activated, single-signature TRON EOA. ERC-3009 tokens (e.g. BSC testnet DHLU) need no approve — they settle gaslessly via `transferWithAuthorization`.

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

### Base RPC Endpoints

| Network | RPC Endpoint |
| :------- | :------------ |
| **Mainnet** (`eip155:8453`) | `https://mainnet.base.org` |
| **Sepolia (Testnet)** (`eip155:84532`) | `https://sepolia.base.org` |

These are public RPC examples. Configure production RPCs through your chosen client's documented configuration; SDK applications pass them explicitly to their signer/client factories. Base USDC settles with EIP-3009, so it needs no Permit2 approval.

---

## Security Best Practices

- **Never Expose Private Keys**
  Use [wallet-cli](/wallet-cli/quickstart/) for the official CLI account and signing flow. Existing SDK integrations may use [Agent Wallet](/Agent-Wallet/Intro/) or another supported signer. Do not expose private keys in source code, command arguments, or chat.

- **Use Testnets First**
  Always complete development and validation on testnet before deploying to mainnet.

- **Understand the Permit2 Approval**
  The one-time Permit2 approval the SDK sends is always `MaxUint256` — it offers no smaller amount, and the TRON sponsoring extension rejects a sponsored approval that is not `MaxUint256`. An allowance you set yourself out of band is honoured as long as it covers the payment. Least privilege applies at the next layer instead: each payment is a separate signed authorization bound to a specific amount, recipient and deadline, so the standing approval alone cannot move funds.

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

- [Network and Token Support](./network-and-token-support.md) — View supported networks and token lists
- [SDK Features](../sdk-features.md) — Explore the full capabilities of the x402 SDK
