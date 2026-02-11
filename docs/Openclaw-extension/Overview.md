# Introduction

The OpenClaw extension is a suite of tools developed by **BankofAI** designed to empower AI agents with financial sovereignty. It enables agents to hold wallets, execute transactions, and monetize services via the **x402 Protocol** (HTTP 402 Payment Required).

## Vision

To build a "central bank" for the agent economy, ensuring every AI agent can:

*   **Earn Revenue**: Accept payments for tasks and services through standard protocols.
*   **Autonomous Consumption**: Independently pay for resources (compute, data, storage).
*   **Connect and Interact**: Facilitate direct financial activities and settlements between agents (A2A).
*   **Seamless Transactions**: Interact seamlessly with DeFi and smart contracts.

## Core Components

This extension provides tools for blockchain interaction:

### MCP Server

**mcp-server**: A Model Context Protocol (MCP) server that provides AI agents with direct access to the blockchain.

*   **Functions**: Balance queries, transfers, smart contract interactions, resource estimation, token swaps.

### Skills

The installer automatically fetches skills from the [skills](https://github.com/bankofai/skills-tron) repository:

1.  **sunswap** - SunSwap DEX trading skill for token swaps.
    *   Multi-version pool routing (V1/V2/V3/PSM).
    *   Price quotes with slippage protection.
    *   Token authorization management.
2.  **x402_payment** - Enables agent payments (x402 protocol) on the network.
    *   Pay-per-request model for agent APIs.
    *   Payment verification before task execution.
3.  **x402_payment_demo** - A demonstration of the x402 payment protocol.
