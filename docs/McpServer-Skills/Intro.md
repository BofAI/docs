# Introduction

Bank of AI provides a complete solution, from infrastructure to business logic, for building autonomous AI Agents based on blockchain networks through a dual-layer architecture of MCP (Model Context Protocol) and Skills (Skill Library).

**Infrastructure Layer**: The mcp-server acts as the AI agent's "hands and eyes." The MCP server seamlessly integrates blockchain capabilities into AI using standardized protocols. It provides a unified interaction interface for agents, enabling them to autonomously read block data, manage wallets (supporting Hex/Base58 formats), execute transfers, and interact with any smart contract for both reading and writing, comprehensively covering mainnet and testnet.

**Application Logic Layer**: The skills library serves as the AI agent's "brain and operation manual." It offers a series of reusable capability modules. Through structured instruction documents (SKILL.md), it teaches AI how to combine and call the underlying tools provided by MCP to complete complex business processes.

**DeFi Interaction**: Automated token swaps are achieved through the SunSwap skill library, with future plans to support JustLend, Pancake, and Lista.

**Identity and Reputation**: On-chain identity registration and reputation accumulation are managed using the ERC-8004 standard.

**Economic Payments**: The x402 protocol is integrated to empower agents with automated payment collection and disbursement capabilities.

## Summary

Developers only need to deploy the MCP server and load the corresponding Skills to evolve AI agents from "chatbots" into Web3 economic entities with asset management capabilities and on-chain interaction abilities.
