---
title: 'SDK Feature Matrix'
description: 'Implementation status and feature support comparison between the Python and TypeScript SDKs for x402.'
---

# SDK Feature Matrix

This page tracks the implementation progress and feature support status of the x402 SDKs across supported languages (Python and TypeScript).

---

## Core Components

| Component | Python | TypeScript |
|------------|--------|------------|
| Server | ✅ | ⏳ |
| Client | ✅ | ✅ |
| Facilitator | ✅ | ⏳ |

### HTTP Framework Integration

| Role | Python | TypeScript |
|------|--------|------------|
| Server | FastAPI, Flask | - |
| Client | httpx | fetch |

---

## Networks

| Network | Python | TypeScript |
|-----------|--------|------------|
| tron:mainnet | ✅ | ✅ |
| tron:nile | ✅ | ✅ |
| tron:shasta | ✅ | ✅ |
| eip155:56 (BSC Mainnet) | ✅ | ✅ |
| eip155:97 (BSC Testnet) | ✅ | ✅ |

---

## Payment Mechanisms

| Mechanism | Python | TypeScript |
|-------------|--------|------------|
| exact_permit/tron | ✅ | ✅ |
| exact_permit/bsc | ✅ | ✅ |
| exact/tron | ✅ | ✅ |
| exact/bsc | ✅ | ✅ |
| exact_gasfree/tron | ✅ | ✅ |

> **Coinbase x402 v2 compatibility**: Since v0.5.9, the `payload` emitted by the `exact` mechanism (EVM and TRON) aligns with the x402 Foundation (formerly Coinbase) v2 wire format. Stock v2 clients can interoperate with this SDK's server and vice versa. See [Network & Token Support → `exact` Scheme](./core-concepts/network-and-token-support.md#exact-scheme) for details.

---

## Signers

| Signer | Python | TypeScript |
|----------|--------|------------|
| TronClientSigner | ✅ | ✅ |
| EvmClientSigner | ✅ | ✅ |
| TronFacilitatorSigner | ✅ | ⏳ |
| EvmFacilitatorSigner | ✅ | ⏳ |

---

## Client Features

| Feature | Python | TypeScript |
|------------|--------|------------|
| Automatic 402 handling | ✅ | ✅ |
| Automatic token approval | ✅ | ✅ |
| Allowance check | ✅ | ✅ |
| Signing (TRON) | ✅ | ✅ |
| Signing (EVM) | ✅ | ✅ |
| SufficientBalancePolicy | ✅ | ✅ |
| GasFree (zero-gas TRON payments) | ✅ | ✅ |

---

## Server Features

| Feature | Python | TypeScript |
|------------|--------|------------|
| `@x402_protected` decorator | ✅ | ⏳ |
| Payment verification | ✅ | ⏳ |
| Payment settlement | ✅ | ⏳ |
| Fee support | ✅ | ⏳ |

---

## Facilitator Features

| Feature | Python | TypeScript |
|------------|--------|------------|
| `/verify` endpoint | ✅ | ⏳ |
| `/settle` endpoint | ✅ | ⏳ |
| `/fee/quote` endpoint | ✅ | ⏳ |
| `/supported` endpoint | ✅ | ⏳ |
| Submit transaction | ✅ | ⏳ |
| Confirm transaction | ✅ | ⏳ |

---

## Supported Tokens

| Token | Python | TypeScript |
|--------|--------|------------|
| USDT (TRC-20) | ✅ | ✅ |
| USDD (TRC-20) | ✅ | ✅ |
| Custom TRC-20 | ✅ | ✅ |
| USDT (BEP-20) | ✅ | ✅ |
| USDC (BEP-20, mainnet & testnet) | ✅ | ✅ |
| DHLU (BSC testnet, for `exact` interop tests) | ✅ | ✅ |
| Custom BEP-20 | ✅ | ✅ |

---

## Legend

- ✅ = Implemented  
- ⏳ = Planned / In Progress  
- ❌ = Not Planned  
