---
title: 'Networks & Token Support'
description: 'This page explains which blockchain networks and tokens are supported by x402-tron, and how to extend support to additional networks.'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## TRON Network Identifiers

x402-tron uses a simple network identifier format: `tron:<network_name>` where network_name is one of `mainnet`, `shasta`, or `nile`.

### Network Identifier Reference

| Network Name | x402-tron ID   | Description         |
| ------------ | -------------- | ------------------- |
| TRON Mainnet | `tron:mainnet` | TRON mainnet        |
| TRON Shasta  | `tron:shasta`  | TRON Shasta testnet |
| TRON Nile    | `tron:nile`    | TRON Nile testnet   |

## Overview

x402-tron is specifically designed for the TRON blockchain, with payment verification and settlement implemented natively for TRON networks. The protocol leverages TRON's TIP-712 for secure message signing.

### Supported Networks

| Network      | Status      | Notes                                   |
| ------------ | ----------- | --------------------------------------- |
| TRON Mainnet | **Mainnet** | Production network                      |
| TRON Nile    | **Testnet** | Recommended for development and testing |
| TRON Shasta  | **Testnet** | Alternative testnet for testing         |

### Token Support

x402-tron supports TRC-20 tokens on TRON networks. The primary supported tokens are USDT and USDD.

#### Supported Tokens

| Token | Network      | Contract Address                   |
| ----- | ------------ | ---------------------------------- |
| USDT  | tron:mainnet | TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t |
| USDT  | tron:nile    | TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf |
| USDD  | tron:mainnet | TXDk8mbtRbXeYuMNS83CfKPaYYT8XWv9Hz |
| USDD  | tron:nile    | TGjgvdTWWrybVLaVeFqSyVqJQWjxqRYbaK |

**Note**: Custom TRC-20 tokens can be supported by registering them in the TokenRegistry.

#### TIP-712 for Secure Signing

x402-tron uses TIP-712 (TRON's implementation of EIP-712) for structured data signing. This enables:

- **Secure authorization**: Buyers sign transfer authorizations off-chain
- **Trust-minimizing**: Facilitators cannot move funds outside client intentions
- **Verifiable**: All signatures can be verified on-chain

### Token Configuration

When configuring payment requirements, you specify:

1. **Network**: The TRON network identifier (e.g., `tron:nile`)
2. **Asset**: The TRC-20 token contract address
3. **Amount**: The payment amount in the token's smallest unit (e.g., 1 USDT = 1000000 with 6 decimals)

### Payment Schemes

#### Exact Scheme

The `exact` scheme allows payments of a specified amount, useful for:

- Pay-per-use APIs (LLM token generation, data processing)
- Metered resources (compute time, bandwidth)
- Dynamic pricing based on actual usage

The exact scheme in x402-tron works by:

1. Client signs an authorization allowing up to a maximum amount
2. Server performs work and determines actual cost
3. Facilitator settles the actual amount (up to the authorized maximum)

### Running Your Own Facilitator

You can run your own facilitator to verify and settle payments on TRON. The facilitator:

1. Verifies payment payloads (TIP-712 signatures)
2. Submits transactions to TRON blockchain
3. Monitors transaction confirmation

**Prerequisites**

1. Access to a TRON node (e.g., TronGrid)
2. A wallet with TRX for gas/energy fees
3. The x402-tron facilitator code

See the [Facilitator](./facilitator.md) documentation for more details.

### Quick Reference

| Component | TRON Support                                     |
| --------- | ------------------------------------------------ |
| Networks  | `tron:mainnet`, `tron:shasta`, `tron:nile`       |
| Tokens    | TRC-20 tokens (USDT & USDD supported by default) |
| Signing   | TIP-712 structured data signing                  |
| Schemes   | `exact`                                          |

### Adding Custom Tokens

Custom TRC-20 tokens can be supported by registering them in the TokenRegistry. See the [Quickstart for Sellers](../getting-started/quickstart-for-sellers.md) for implementation details.

### Summary

x402-tron's network support is designed specifically for TRON blockchain with native TRC-20 token support and TIP-712 signing. Key takeaways:

- TRON Nile testnet is recommended for development
- USDT is the primary supported token with pre-configured addresses
- TIP-712 provides secure, trust-minimizing payment authorization
- Custom TRC-20 tokens can be added via TokenRegistry
