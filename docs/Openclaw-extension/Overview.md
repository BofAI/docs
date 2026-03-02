# Introduction

The OpenClaw extension is a suite of tools developed by **BANK OF AI** designed to empower AI agents with financial sovereignty. It enables agents to hold wallets, execute transactions, and monetize services via the **x402 Protocol** (HTTP 402 Payment Required).

## Vision

To build a "central bank" for the agent economy, ensuring every AI agent can:

- **Earn Revenue**: Accept payments for tasks and services through standard protocols.
- **Autonomous Consumption**: Independently pay for resources (compute, data, storage).
- **Connect and Interact**: Facilitate direct financial activities and settlements between agents (A2A).
- **Seamless Transactions**: Interact seamlessly with DeFi and smart contracts.

## Core Components

This extension provides tools for blockchain interaction:

### MCP Server

Multi-chain blockchain access for AI agents via Model Context Protocol (MCP):

- **[mcp-server-tron](https://github.com/BofAI/mcp-server-tron)** - TRON blockchain interaction
  - Balance checks, transfers, smart contract calls
  - Resource estimation (Energy/Bandwidth)
  - Multi-network support (Mainnet, Nile, Shasta)

- **[bnbchain-mcp](https://github.com/bnb-chain/bnbchain-mcp)** - BNB Chain official MCP server
  - Multi-chain support: BSC, opBNB, Ethereum, Greenfield
  - Wallet operations, smart contracts, token transfers
  - Cross-chain capabilities

### Skills

Pre-built workflows and tools from the **[skills repository](https://github.com/BofAI/skills)**:

**Available Skills:**
- **sunswap** - SunSwap DEX trading skill for TRON token swaps
- **8004-skill** - 8004 Trustless Agents (on-chain identity, reputation, and validation for AI agents on TRON & BSC)
- **x402-payment** - Enables agent payments on TRON network (x402 protocol)
- **x402-payment-demo** - Demo of x402 payment protocol

For complete documentation and usage instructions, see the [skills repository](https://github.com/BofAI/skills).

The installer will let you select which skills to install during setup.