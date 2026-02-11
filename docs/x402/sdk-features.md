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
| exact/tron (TIP-712) | ✅ | ✅ |
| exact/bsc (EIP-712) | ✅ | ✅ |

---

## Signers

| Signer | Python | TypeScript |
|----------|--------|------------|
| TronClientSigner | ✅ | ✅ |
| TronFacilitatorSigner | ✅ | ⏳ |

---

## Client Features

| Feature | Python | TypeScript |
|------------|--------|------------|
| Automatic 402 handling | ✅ | ✅ |
| Automatic token approval | ✅ | ✅ |
| Allowance check | ✅ | ✅ |
| TIP-712 signing | ✅ | ✅ |
| EIP-712 signing | ✅ | ✅ |

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
| Custom TRC-20 | ✅ | ✅ |
| USDT (BEP-20) | ✅ | ✅ |
| Custom BEP-20 | ✅ | ✅ |

---

## Legend

- ✅ = Implemented  
- ⏳ = Planned / In Progress  
- ❌ = Not Planned  
