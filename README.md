# 🚀 BANK OF AI  

**Building a Decentralized Financial Sovereignty and Commercial Interconnection Layer for AI Agents**

[![Standard](https://img.shields.io/badge/Protocol-bankofai-blue.svg)](https://github.com/BofAI)

BANK OF AI is designed to empower AI Agents with **financial sovereignty, identity authentication, skill extensibility, and automated payment capabilities**. Through standardized protocols, we enable AI to autonomously earn income, pay for resources, and build credit on the blockchain—just like humans.

Currently supports **TRON** and **BSC**, with more blockchain networks coming in the future.

---

## 🏛️ Core Components

### 1. 💳 x402 Payment Protocol: A Programmatic Payment Standard

x402 is an open blockchain payment protocol based on the HTTP `402 Payment Required` status code. It removes payment friction in M2M (machine-to-machine) interactions for AI agents.

- **Payment-as-Response**: Enables a “pay-before-response” mechanism without complex account registration or session management.  
- **Multi-Chain Support**: Currently supports **TRON** (Mainnet/Shasta/Nile) and **BSC** (Mainnet/Testnet); More blockchain networks will be supported in the future.  
- **AI-Friendly**: Supports signed payloads, allowing agents to complete settlements automatically.  
- **Use Cases**: Pay-per-request APIs, paywalls, and automated settlement between agents.

---

### 2. 🛠️ MCP Server & Skills: The “Hands and Brain” of Agents

Built on the Model Context Protocol (MCP) architecture, providing full on-chain execution capabilities for agents.

- **Infrastructure Layer (MCP Server)**: The agent’s **“hands and eyes.”** Provides a unified interface to read blocks, manage wallets, execute transfers, and interact with any contract.  
- **Application Logic Layer (Skills)**: The agent’s **“brain.”** Uses structured instructions (`SKILL.md`) to guide AI in orchestrating underlying tools.  
  - **sunswap**: Enables automated DEX swaps.  
  - **x402-payment**: Allows agents to detect payment requirements and execute payments automatically.

---

### 3. 🧩 OpenClaw Extension: Financial Assistant for AI Agents

OpenClaw is a financial extension plugin developed by BANK OF AI for AI agents, aiming to become the “central bank” of the agent economy.

- **Wallet Ownership**: Enables agents to truly control and manage on-chain assets.  
- **Autonomous Spending**: Agents can independently pay for computation, storage, and data resources.  
- **Seamless Integration**: Built-in MCP server and automatic skill installer for plug-and-play setup.

---

## 📊 Why Choose BANK OF AI?

| Feature | Traditional AI Agents | **BANK OF AI–Empowered Agents** |
| :--- | :--- | :--- |
| **Payment System** | Credit card / centralized API keys | **x402 native on-chain instant settlement** |
| **Financial Capability** | Limited, requires human pre-authorization | **Autonomous DeFi interaction (Swap/Lending)** |
| **Interaction Model** | Primarily human–machine | **A2A (Agent-to-Agent) direct settlement** |
| **Trust Mechanism** | Vendor-backed (black box) | **Public reputation & cryptographic verification (transparent)** |

---

## 🚦 Quick Start

### 🚀 For Sellers  
*Want to monetize your API, content, or services?*

1. **Integrate x402**: Deploy server-side logic to detect payment requirements and return a `402` status code with payment instructions.  
2. **Publish Skills**: Write a `SKILL.md` for your service so other AI agents can understand how to interact with it.

---

### 🤖 For Agents/Buyers  
*Want your agent to have autonomous payment and on-chain interaction capabilities?*

1. **Install OpenClaw**: Configure your environment and connect to the [mcp-server-tron](https://github.com/BofAI/mcp-server-tron).  
2. **Sync Skills**: Load `sunswap` or `x402-payment` from the [skills](https://github.com/BofAI/skills) repository.  
3. **Start Transacting**: Your agent can now automatically process payment requests from sellers and execute settlements.

---

## 🏗️ Developer Resources

- **Documentation Center**: [docs.bankofai.io](https://docs.bankofai.io)  
- **Live Demo**: [x402-demo Repository](https://github.com/BofAI/x402-demo)  
- **Technical Support**: Submit issues or join discussions on GitHub.

---

**BANK OF AI** — *Empowering AI Agents with Financial Sovereignty.*
