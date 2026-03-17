# Introduction

## What is OpenClaw Extension?

OpenClaw Extension is a toolkit developed by **BANK OF AI** that equips [OpenClaw](https://github.com/openclaw) (an open-source AI assistant) with **blockchain interaction capabilities**. Once installed, your AI assistant can directly manage on-chain assets — check balances, initiate transfers, invoke smart contracts, and swap tokens on DEXs — all through natural language conversation.

Traditionally, enabling an AI to interact with blockchain requires you to manually set up MCP Servers, manage configuration files, and install various tools individually. OpenClaw Extension packages all of this into an interactive installer — run one command, follow the prompts to select the components you need, and within minutes your AI assistant will have multi-chain operation capabilities.

---

## Core Vision

OpenClaw Extension aims to build a financial infrastructure for the AI agent economy — enabling every AI agent with independent financial capabilities:

- **Earn Revenue**: Receive payments for tasks and services through standard interfaces like the x402 protocol
- **Autonomous Spending**: Independently pay for compute, data, and storage resources
- **Agent Interconnection**: Facilitate direct financial transactions and settlements between agents (A2A)
- **DeFi Interaction**: Seamlessly interact with decentralized finance protocols and smart contracts

---

## What Does It Include?

OpenClaw Extension consists of two main categories of components: **MCP Servers** and **Skills**. You can choose which components to enable at installation time.

### MCP Server — On-Chain Operation Capabilities

MCP Servers are bridges between your AI assistant and the blockchain, providing on-chain operation capabilities through the [Model Context Protocol (MCP)](../McpServer-Skills/MCP/Intro.md) standard interface. Currently supports MCP Servers for two blockchain chains plus one remote recharge service:

| MCP Server | Target | Core Capabilities |
| :--- | :--- | :--- |
| **[mcp-server-tron](https://github.com/BofAI/mcp-server-tron)** | TRON | 95 tools covering wallets, transfers, contracts, staking, governance, and all operations |
| **[bnbchain-mcp](https://github.com/bnb-chain/bnbchain-mcp)** | BSC / opBNB / Ethereum | Multi-chain EVM operations, wallets, contracts, cross-chain |
| **bankofai-recharge** | BANK OF AI (Remote) | Remote recharge MCP — top up your BANK OF AI account via on-chain USDT. Default endpoint: `https://recharge.bankofai.io/mcp` |

### Skills — Pre-built Workflows

Skills are encapsulated business process templates. Unlike individual tools provided by MCP Servers, a single Skill can chain multiple operations together to complete complex tasks — for example, "swap tokens on SunSwap" involves checking prices, verifying balances, executing the swap, and confirming results, all handled by one Skill.

| Skill | Functionality |
| :--- | :--- |
| **sunswap** | SunSwap DEX trading including balance queries, quotes, swaps, and liquidity management |
| **sunperp-skill** | SunPerp perpetual futures trading — market data, orders, positions, leverage, withdrawals |
| **tronscan-skill** | Query on-chain data via TronScan API (accounts, transactions, tokens, blocks, network statistics) |
| **x402-payment** | x402 payment skill for calling paid agents and APIs, supporting Gasfree zero-gas transactions |
| **recharge-skill** | BANK OF AI balance and order queries, plus TRC20 recharge via MCP |


---

## Who Should Use This?

- **OpenClaw Users**: Want your AI assistant to interact directly with blockchain without manually setting up MCP Servers
- **Web3 Developers**: Need a quick on-chain development environment to debug contracts and query data using natural language
- **AI Agent Builders**: Need to equip automation agents with multi-chain operation capabilities
- **DeFi Users**: Want to use your AI assistant to trade on SunSwap or manage liquidity

---

## Next Steps

- Want to get started immediately? → [Quick Start](./QuickStart.md)
