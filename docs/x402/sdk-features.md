---
title: SDK Features
description: Feature parity across Python and TypeScript SDKs for x402-tron
---

# SDK Features

This page tracks which features are implemented in each SDK (Python, TypeScript) for x402-tron.

## Core

| Component | Python | TypeScript |
|-----------|--------|------------|
| Server | ✅ | ⏳ |
| Client | ✅ | ✅ |
| Facilitator | ✅ | ⏳ |

### HTTP Framework Integrations

| Role | Python | TypeScript |
|------|--------|------------|
| Server | FastAPI, Flask | - |
| Client | httpx | fetch |

## Networks

| Network | Python | TypeScript |
|---------|--------|------------|
| tron:mainnet | ✅ | ✅ |
| tron:nile | ✅ | ✅ |
| tron:shasta | ✅ | ✅ |

## Mechanisms

| Mechanism | Python | TypeScript |
|-----------|--------|------------|
| exact/tron (TIP-712) | ✅ | ✅ |

## Signers

| Signer | Python | TypeScript |
|--------|--------|------------|
| TronClientSigner | ✅ | ✅ |
| TronFacilitatorSigner | ✅ | ⏳ |

## Client Features

| Feature | Python | TypeScript |
|---------|--------|------------|
| Auto 402 handling | ✅ | ✅ |
| Auto token approval | ✅ | ✅ |
| Allowance checking | ✅ | ✅ |
| TIP-712 signing | ✅ | ✅ |

## Server Features

| Feature | Python | TypeScript |
|---------|--------|------------|
| @x402_protected decorator | ✅ | ⏳ |
| Payment verification | ✅ | ⏳ |
| Payment settlement | ✅ | ⏳ |
| Fee support | ✅ | ⏳ |

## Facilitator Features

| Feature | Python | TypeScript |
|---------|--------|------------|
| /verify endpoint | ✅ | ⏳ |
| /settle endpoint | ✅ | ⏳ |
| /fee/quote endpoint | ✅ | ⏳ |
| /supported endpoint | ✅ | ⏳ |
| Transaction submission | ✅ | ⏳ |
| Transaction confirmation | ✅ | ⏳ |

## Token Support

| Token | Python | TypeScript |
|-------|--------|------------|
| USDT (TRC-20) | ✅ | ✅ |
| Custom TRC-20 | ✅ | ✅ |

## Legend

- ✅ = Implemented
- ⏳ = Planned / In Development
- ❌ = Not Planned
