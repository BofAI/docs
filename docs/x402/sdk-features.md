---
title: 'SDK Feature Matrix'
description: 'Implementation status and feature support comparison between the Python and TypeScript SDKs for x402.'
---

# SDK Feature Matrix

This page tracks the implementation progress and feature support status of the x402 SDKs across supported languages (Python and TypeScript).

---

## Core Components

| Component   | Python | TypeScript |
| ----------- | ------ | ---------- |
| Server      | ✅     | ✅         |
| Client      | ✅     | ✅         |
| Facilitator | ✅     | ✅         |

### HTTP Framework Integration

| Role   | Python          | TypeScript    |
| ------ | --------------- | ------------- |
| Server | FastAPI, Flask  | Express, Hono |
| Client | httpx, requests | fetch, axios  |

---

## Networks

| Network                 | Python | TypeScript |
| ----------------------- | ------ | ---------- |
| tron:mainnet            | ✅     | ✅         |
| tron:nile               | ✅     | ✅         |
| tron:shasta             | ✅     | ✅         |
| eip155:56 (BSC Mainnet) | ✅     | ✅         |
| eip155:97 (BSC Testnet) | ✅     | ✅         |

---

## Payment Mechanisms

| Mechanism  | Python | TypeScript |
| ---------- | ------ | ---------- |
| exact/tron | ✅     | ✅         |
| exact/bsc  | ✅     | ✅         |

---

## Signers

| Signer                | Python | TypeScript |
| --------------------- | ------ | ---------- |
| TronClientSigner      | ✅     | ✅         |
| EvmClientSigner       | ✅     | ✅         |
| TronFacilitatorSigner | ✅     | ✅         |
| EvmFacilitatorSigner  | ✅     | ✅         |

---

## Client Features

| Feature                  | Python | TypeScript |
| ------------------------ | ------ | ---------- |
| Automatic 402 handling   | ✅     | ✅         |
| Automatic token approval | ⏳     | ✅         |
| Allowance check          | ⏳     | ✅         |
| Signing (TRON)           | ✅     | ✅         |
| Signing (EVM)            | ✅     | ✅         |

---

## Server Features

| Feature              | Python | TypeScript |
| -------------------- | ------ | ---------- |
| Payment Middleware   | ✅     | ✅         |
| Payment verification | ✅     | ✅         |
| Payment settlement   | ✅     | ✅         |
| Fee support          | ✅     | ✅         |

---

## Facilitator Features

| Feature               | Python | TypeScript |
| --------------------- | ------ | ---------- |
| `/verify` endpoint    | ✅     | ✅         |
| `/settle` endpoint    | ✅     | ✅         |
| `/supported` endpoint | ✅     | ✅         |
| Submit transaction    | ✅     | ✅         |
| Confirm transaction   | ✅     | ✅         |

---

## Supported Tokens

| Token         | Python | TypeScript |
| ------------- | ------ | ---------- |
| USDT (TRC-20) | ✅     | ✅         |
| Custom TRC-20 | ✅     | ✅         |
| USDT (BEP-20) | ✅     | ✅         |
| Custom BEP-20 | ✅     | ✅         |

---

## Legend

- ✅ = Implemented
- ⏳ = Planned / In Progress
- ❌ = Not Planned
