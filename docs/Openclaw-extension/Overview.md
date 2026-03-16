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
  - Wallet management, message signing, address conversion & validation
  - Balance checks, TRX/TRC20 transfers, smart contract calls
  - Contract deployment, multicall, ABI fetching, contract settings management
  - Block & transaction queries (by height, hash, range)
  - Resource estimation (Energy/Bandwidth), staking (Stake 2.0), resource delegation
  - Governance & proposals, event queries, mempool, node info
  - Account management, TronGrid data queries, transaction broadcast
  - Full-node query API (energy/bandwidth price history, TRX burn stats, block balance changes)
  - Multi-network support (Mainnet, Nile, Shasta)
  - Read-only mode for safe public deployment

- **[sun-mcp-server](https://github.com/BofAI/sun-mcp-server)** - SUN.IO (SUNSWAP) DeFi interaction
  - SUN.IO API queries: tokens, pools, prices, protocol metrics, transactions, farming
  - Wallet management, balance queries (TRX & TRC20), multi-wallet switching
  - Token pricing & swap quoting via smart router
  - Smart swaps via Universal Router with automatic best-route finding
  - V2 liquidity: add/remove with automatic native TRX handling
  - V3 concentrated liquidity: mint, increase, decrease positions & collect fees
  - V4 concentrated liquidity: mint, increase, decrease positions with Permit2 support
  - Smart contract interaction: read/write with automatic TRC20 approval handling
  - Multi-network support (Mainnet, Nile, Shasta)
  - Supports private keys, BIP-39 mnemonics, and Agent Wallet

- **[bnbchain-mcp](https://github.com/bnb-chain/bnbchain-mcp)** - BNB Chain official MCP server
  - Multi-chain support: BSC, opBNB, Ethereum, Greenfield
  - Wallet operations, smart contracts, token transfers
  - Cross-chain capabilities

### Skills

Pre-built workflows and tools from the **[skills repository](https://github.com/BofAI/skills)**:

**Available Skills:**


| Skill | Function |
| :--- | :--- |
| **x402-payment** | x402 payment skill for invoking paid agents and paid APIs on supported chains. |
| **sunswap** | SunSwap DEX skill for balance queries, quotes, swaps, and liquidity workflows. |
| **tronscan-skill** | TRON blockchain data query via TronScan API, supporting accounts, transactions, tokens, blocks, and network statistics. |

For complete documentation and usage instructions, see the [skills repository](https://github.com/BofAI/skills).

The installer will let you select which skills to install during setup.