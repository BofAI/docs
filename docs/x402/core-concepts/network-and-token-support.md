# Network & Token Support

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## TRON Network Identifiers

x402 adopts a standardized network identifier format: `tron:<network_name>`.  
The `<network_name>` can be `mainnet`, `shasta`, or `nile`.

### Identifier Reference

| Network Name | Network        | Description                     |
| :----------- | :------------- | :------------------------------ |
| **TRON Mainnet** | `tron:mainnet` | TRON Mainnet (Production)      |
| **TRON Shasta**  | `tron:shasta`  | TRON Shasta Testnet            |
| **TRON Nile**    | `tron:nile`    | TRON Nile Testnet              |

---

## BSC Network Identifiers

For BSC, x402 uses the EIP-155 chain ID format:

| Network Name     | Network       | Description                    |
| :--------------- | :------------ | :----------------------------- |
| **BSC Mainnet**  | `eip155:56`   | BSC Mainnet (Production)      |
| **BSC Testnet**  | `eip155:97`   | BSC Testnet (Chapel)          |

---

## Overview

x402 is purpose-built for blockchain ecosystems, enabling native on-chain payment verification and settlement.  
The protocol uses secure signing mechanisms to ensure tamper-resistant message authorization.

### Supported Networks

| Network Environment | Status     | Notes |
| :------------------ | :--------- | :---- |
| **TRON Mainnet**    | **Mainnet** | **Production network** for real-value assets |
| **TRON Nile**       | **Testnet** | **Recommended testnet** for development and debugging |
| **TRON Shasta**     | **Testnet** | Long-running alternative testnet |
| **BSC Mainnet**     | **Mainnet** | **Production network** for real-value assets |
| **BSC Testnet**     | **Testnet** | **Recommended testnet** for BSC development |

---

## Supported Tokens

x402 fully supports **TRC-20 and BEP-20** standard tokens.  
By default, **USDT** and **USDD** are used as primary settlement currencies.

### Supported Token List

| Symbol | Network        | Contract Address |
| :------ | :------------- | :--------------- |
| **USDT** | `tron:mainnet` | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` |
| **USDT** | `tron:nile`    | `TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf` |
| **USDD** | `tron:mainnet` | `TXDk8mbtRbXeYuMNS83CfKPaYYT8XWv9Hz` |
| **USDD** | `tron:nile`    | `TGjgvdTWWrybVLaVeFqSyVqJQWjxqRYbaK` |
| **USDT** | `eip155:56`    | `0x55d398326f99059fF775485246999027B3197955` |
| **USDT** | `eip155:97`    | `0x337610d27c682E347C9cD60BD4b3b107C9d34dDd` |

> **Extensibility**: The protocol is highly extensible. By registering tokens in the `TokenRegistry`, you can easily support any custom TRC-20 or BEP-20 token.

---

## Secure Signing

x402 uses typed data signing for all payment-related signatures.

### Key Benefits

- **Off-chain Authorization**  
  Buyers sign transfer intent locally (off-chain) without locking funds in advance.

- **Trust-Minimized**  
  Signatures include strict constraints (amount, recipient, expiration), preventing the Facilitator from moving funds beyond the explicitly authorized scope.

- **On-chain Verifiability**  
  All signatures can be cryptographically verified at the smart contract level, ensuring immutability and integrity.

---

## Token Configuration Parameters

When configuring an `HTTP 402` payment request on the server side, you must explicitly define:

1. **Network** – The unique network identifier (e.g., `tron:nile`)  
2. **Asset** – The TRC-20/BEP-20 token **contract address**  
3. **Amount** – The integer value in the token’s **smallest unit (raw amount)**  

> **Precision Example**  
> USDT on TRON uses **6 decimals**.  
> To charge **1.0 USDT**, you must configure the amount as:  
> `1000000`

---

## Payment Scheme

x402 supports three payment schemes: `exact_permit`, `exact`, and `exact_gasfree`.

### `exact_permit` Scheme

The `exact_permit` scheme transfers tokens via the `PaymentPermit` contract, suitable for:

- **Pay-per-use APIs** (e.g., LLM token generation, image generation services)
- **Metered resources** (cloud compute time, storage usage, bandwidth consumption)
- **Dynamic pricing services** based on actual usage

### `exact` Scheme

The `exact` scheme is for tokens that natively support `transferWithAuthorization`. It does not require the `PaymentPermit` contract.

### `exact_gasfree` Scheme

The `exact_gasfree` scheme is a TRON-specific payment mechanism that allows users to pay with USDT/USDD **without holding TRX for gas fees**. Settlement is handled via the official GasFree Proxy through the BankOfAI facilitator endpoint.

Key characteristics:

- **Zero gas cost for buyers**: Buyers do not need to hold TRX — gas is covered by the GasFree infrastructure
- **No API keys required**: All GasFree API calls route through the BankOfAI proxy at `https://facilitator.bankofai.io/{mainnet,nile}`, so clients do not need to configure `GASFREE_API_KEY` or `GASFREE_API_SECRET`
- **TRON only**: Available on `tron:mainnet` and `tron:nile`

### How Payment Schemes Work

1. **Authorize**
   The client signs a message authorizing a **maximum amount**.

2. **Execute**
   The server performs the requested task and calculates the **actual cost**.

3. **Settle**
   The Facilitator submits the on-chain transaction based on the actual cost.

---

## Deploying a Private Facilitator

You may deploy your own Facilitator node to gain full control over payment verification and settlement.

### Core Responsibilities

1. **Verify** – Validate signatures and payload integrity  
2. **Submit** – Construct and broadcast the `transferFrom` transaction  
3. **Monitor** – Track on-chain confirmations to ensure final settlement  

### Deployment Requirements

- **Node Access** – Reliable full-node RPC access (e.g., TronGrid or self-hosted node)  
- **Gas Funding** – A wallet with sufficient **TRX/BNB** to cover transaction gas fees  
- **Service Deployment** – Clone and configure the x402 Facilitator service  

> For detailed configuration and API references, see the [Facilitator](./facilitator.md) documentation.

---

## Quick Reference

| Core Component | TRON/BSC Implementation |
| :------------- | :---------------------- |
| **Networks**   | `tron:mainnet`, `tron:shasta`, `tron:nile`, `eip155:56`, `eip155:97` |
| **Token Standard** | TRC-20 (built-in USDT & USDD support), BEP-20 |
| **Signing Mechanism** | Typed data signing |
| **Payment Scheme** | `exact_permit`, `exact`, `exact_gasfree` (TRON only) |

---

## Adding Custom Tokens

You can support custom TRC-20/BEP-20 tokens by registering them in the `TokenRegistry`:

```python
from bankofai.x402.tokens import TokenRegistry, TokenInfo

TokenRegistry.register_token(
    "tron:nile",
    TokenInfo(
        address="<YOUR_TOKEN_CONTRACT_ADDRESS>",
        decimals=6,
        name="My Token",
        symbol="MYT",
    ),
)
```

Once registered, you can use the custom token symbol in `prices` (e.g., `"0.01 MYT"`).

---

## Summary

x402 is deeply tailored for blockchain-native architectures, providing seamless TRC-20/BEP-20 integration and secure signature support.

### Key Takeaways

- **Development Environment**: Use testnets for development and debugging.  
- **Default Settlement Asset**: **USDT** is the primary default token with preconfigured SDK support.  
- **Security Model**: Typed data signing ensures secure, trust-minimized payment authorization.  
- **Extensibility**: Expand support for any custom TRC-20/BEP-20 token via the `TokenRegistry`.  
