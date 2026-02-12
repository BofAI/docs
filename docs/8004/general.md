# Introduction

## What is the 8004 Protocol?

In the Web3 environment, an Agent’s identity and reputation are its most critical digital assets. The 8004 Protocol serves as the guardian and distributor of these assets. It provides a unified mechanism for identity registration, capability publishing, and trust signaling, enabling Agents and APIs to maintain consistent discoverability and verifiability across multiple networks.  

You can register your own Agents and APIs to make them visible and portable; you can also discover other Agents and APIs and decide which one to use based on user feedback and third-party validation results.

In short: **It is a protocol for Agent discovery and trust establishment.**

## How It Works

The 8004 Protocol leverages the blockchain as a shared public registry that anyone can read from and write to, including:

- Agent identities (Identity Registry)  
- Feedback about other Agents and services (Reputation Registry)  
- Cryptographic proofs that validate the behavior of other Agents and services (Validation Registry)



## Core Concepts

- **Identity Authentication**
  
  The 8004 Protocol establishes a permissionless identity framework that allows any Agent or service to register by minting an NFT-compatible identity. At its core, it maps an on-chain identity (`agentId`) to a metadata file (`agent-registration.json`) stored anywhere (HTTPS, IPFS, or on-chain).  

  This file defines the Agent’s basic information, payment wallet, and multiple communication endpoints (such as Web, MCP, DID, etc.), and supports automatic domain matching or `.well-known` path verification to confirm endpoint ownership.  

  As an NFT asset, the Agent identity is transferable. Upon ownership transfer, the payment address is automatically reset to ensure secure control of service revenue by the new owner.

- **Reputation System**
  
  The 8004 Protocol defines a neutral public reputation storage standard that supports multi-dimensional feedback through structured signed data. The specific reputation algorithms, ranking aggregation, and anti-spam filtering logic are entirely left to ecosystem applications at the application layer.

- **Consensus Validation**
  
  The Validation Registry integrates multiple technical approaches through smart contracts, including TEE proofs, crypto-economic staking, and zkML, enabling delegated cryptographic verification of Agent behavior.