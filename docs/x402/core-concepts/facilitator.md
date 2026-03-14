# Facilitator

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Facilitator is an **optional but highly recommended** service designed to simplify payment verification and settlement between clients (buyers) and servers (sellers) on blockchain networks.

## What is a Facilitator?

A Facilitator is a middleware service primarily responsible for:

- **Payload Verification**: Validating the payment payload submitted by the client.
- **Settlement Execution**: Submitting transactions to the blockchain on behalf of the server to complete settlement.
- **Protocol Optimization**: Automatically selecting the best transfer method (EIP-3009, EIP-2612, or Permit2) based on the token's capabilities.
- **Gas Abstraction**: Covering the transaction execution costs (TRX/BNB) so that neither the buyer nor the seller needs to worry about gas management for the payment itself.

By introducing a Facilitator, servers no longer need to maintain direct connections to blockchain nodes or implement complex signature verification logic themselves. This reduces operational complexity while ensuring accurate and real-time transaction validation.

## Responsibilities of the Facilitator

- **Payment Verification**: Ensures that the signed payload strictly complies with the server's declared payment requirements.
- **Payment Settlement**: Submits validated transactions to the blockchain and monitors their confirmation status.
- **Result Feedback**: Returns verification and settlement results to the server, enabling it to decide whether to deliver the requested resource.

> **Note**: The Facilitator **does not custody funds** and does not act as an escrow. It only executes verification and on-chain operations according to the client’s signed authorization.

## Why Use a Facilitator?

Integrating a Facilitator provides significant advantages:

- **Reduced Operational Overhead**: Servers do not need to directly manage blockchain nodes or RPC infrastructure.
- **Protocol Standardization**: Ensures consistent payment verification and settlement processes across services.
- **Fast Integration**: Servers can begin accepting payments with minimal blockchain development effort.
- **Resource Fee Management**: The Facilitator covers transaction execution costs such as TRX (Energy and Bandwidth) / BNB, reducing the operational burden on the server.

Although developers may implement verification and settlement logic locally, using a Facilitator significantly accelerates development and ensures protocol-compliant implementation.

### Facilitator Options

To use x402, you need access to a Facilitator service. There are currently two options:

1. **Run Your Own Facilitator (Self-Hosted):**  
   Deploy and manage your own Facilitator instance for full control over fee policies and energy management strategies.

2. **Use the [Official Facilitator](https://github.com/BofAI/x402-facilitator):**  
   An officially hosted Facilitator service is available. This option allows you to use the service without maintaining infrastructure.

### Facilitator API Endpoints

The Facilitator provides the following API endpoints:

| Endpoint     | Method | Description                           |
| :----------- | :----- | :------------------------------------ |
| `/`          | GET    | Retrieve basic service information    |
| `/supported` | GET    | Query supported feature configuration |
| `/verify`    | POST   | Verify payment payload validity       |
| `/settle`    | POST   | Execute on-chain settlement           |

For implementation details, please refer to the [Quickstart for Sellers](../getting-started/quickstart-for-sellers.md).

## Trust Model

The x402 protocol is designed around **minimal trust assumptions**:

- **Signature-Based Authorization**: The Facilitator can only transfer funds within the scope explicitly authorized by the client’s signature.
- **Direct Fund Flow**: Funds move directly from the client to the seller (and partially to the Facilitator if fees apply), without passing through a pooled account.
- **On-Chain Transparency**: All transactions are publicly verifiable on-chain.

Even a **malicious Facilitator** cannot:

- Transfer funds beyond the client’s authorized limit.
- Redirect funds to an address not specified in the signed payload.
- Modify any signed payment terms.

## Summary

Within the x402 protocol architecture, the **Facilitator** serves as an independent on-chain verification and settlement layer. It enables servers to securely confirm payments and complete blockchain settlements without deploying a full blockchain infrastructure.

## Next Steps

We recommend exploring:

- [Wallet](./wallet.md) — Learn how to manage wallets used for payments
- [Network and Token Support](./network-and-token-support.md) — Learn about supported networks and tokens
