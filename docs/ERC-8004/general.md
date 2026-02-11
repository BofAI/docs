# Introduction

## What is ERC-8004?

ERC-8004 is an open protocol. It allows you to register your own Agents and APIs, making them visible and portable; it enables you to discover other Agents and APIs; and it helps you decide which one to use based on past customer feedback and third-party validation results.

In short: **it is a protocol for Agent discovery and trust establishment.**

## How It Works

ERC-8004 leverages blockchain as a shared public registry that anyone can read from and write to, including:

- Agent identities (Identity Registry)
- Feedback about other Agents and services (Reputation Registry)
- Cryptographic proofs validating the behavior of other Agents and services (Validation Registry)

## Core Concepts

- **Identity Authentication**
  
  ERC-8004 establishes a permissionless identity framework that allows any Agent or service to register by minting an NFT compatible with the ERC-721 standard. At its core, it maps an on-chain identity (agentId) to a metadata file (agent-registration.json) stored anywhere (HTTPS, IPFS, or on-chain). This file defines the Agent’s basic information, payment wallet, and various communication endpoints (such as Web, MCP, DID, etc.), and supports endpoint ownership verification via automatic domain matching or the `.well-known` path. As an NFT asset, the Agent identity is fully transferable. Upon ownership transfer, the payment address is automatically reset, ensuring secure control of service revenue by the new owner.
  
- **Reputation System**
  
  ERC-8004 defines a neutral public reputation storage standard that supports multidimensional feedback on Agents through structured signed data, while leaving the specific reputation algorithms, ranking aggregation, and anti-spam filtering logic entirely to the application layer of the ecosystem.
  
- **Consensus Validation**
  
  The Validation Registry integrates multiple technical approaches through smart contracts—such as TEE proofs, crypto-economic staking, and zkML—to enable delegated cryptographic verification of Agent behavior.
