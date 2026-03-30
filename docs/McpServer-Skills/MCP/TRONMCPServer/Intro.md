# Introduction

## What is TRON MCP Server?

TRON MCP Server is a bridge that connects AI assistants with the TRON blockchain. Built on the [Model Context Protocol (MCP)](../Intro.md) standard, it lets you interact with the blockchain using natural language — checking balances, initiating transfers, calling smart contracts — without writing any code.

For example: just tell Claude "Check how much USDT this address has", and the AI will automatically call the on-chain query tool, organize the results, and return them to you. No need to open a block explorer, no need to construct API requests, no need to understand the underlying JSON-RPC protocol.

This means different things to different people:

- If you are an **AI application user**, it lets you operate blockchain directly in MCP-compatible AI tools — as easy as everyday chat.
- If you are a **Web3 developer**, it's your rapid on-chain prototyping tool — debug contracts and query state in natural language, saving vast amounts of boilerplate code.
- If you are an **AI Agent builder**, it provides 95 standardized on-chain tools that can be orchestrated directly into your automation workflows.
- If you are a **data analyst**, it turns on-chain data queries into conversation — no more writing scripts to scrape and parse.

---

## What Can It Do?

TRON MCP Server covers almost all common TRON blockchain operations, from read-only queries to asset management, providing **95 tools**, **6 prompt templates**, and **1 resource definition**.

Here is an overview of core capabilities — each one can be triggered via natural language:

| Capability | Description | You can say |
| :--- | :--- | :--- |
| **Balance Queries** | Query TRX or any TRC20 token balance | "How much USDT does this address have?" |
| **Transfer Operations** | Send TRX or TRC20 tokens to specified addresses | "Transfer 100 TRX to TXyz..." |
| **Smart Contracts** | Read, write, deploy, and debug smart contracts | "Call the balanceOf method of this contract" |
| **Transaction Queries** | Look up transaction details, status, and resource consumption | "Check the status of this transaction hash" |
| **Account Management** | View account resources, permissions, staking status | "Show the Energy and Bandwidth of this address" |
| **Staking & Delegation** | Stake TRX for resources, delegate Energy/Bandwidth | "Stake 1000 TRX for Energy" |
| **Governance Participation** | View Super Representatives, vote, manage proposals | "List all current Super Representative candidates" |
| **On-Chain Events** | Query contract events and transaction logs | "Get the recent Transfer events of this contract" |
| **Network Status** | Block production, resource prices, chain health | "What is the current TRON block height?" |
| **Wallet Management** | Multi-wallet switching, message signing, address conversion | "Convert this address to Base58 format" |

For the Full Capability List and parameter descriptions, see the [Full Capability List](./ToolList.md).

---

## Two Access Methods

Once you understand what TRON MCP Server can do, you need to choose an access method. There are two paths depending on your use case:

**[Official Cloud Service](./OfficialServerAccess.md)** — Ideal for quick experimentation and data queries. No installation needed — just add one line in your AI client configuration to get started. However, the cloud service only provides **read-only** capabilities; it does not support transfers, contract writes, or other operations.

**[Local Private Deployment](./LocalPrivatizedDeployment.md)** — For users who need full functionality. Run TRON MCP Server on your own machine, and once your wallet is configured, all read and write capabilities are unlocked. Private keys are managed entirely locally and are never uploaded to any remote service.

The core distinction comes down to one point: **whether you need to sign transactions**.

| Comparison Item | Official Cloud Service | Local Private Deployment |
| :--- | :--- | :--- |
| **Feature Scope** | Read-only (queries only) | Full features (read + write) |
| **Setup Difficulty** | Just add one config line | Requires local installation and build |
| **Private Key Required** | No | Yes (for write operations) |
| **Transfer/Contract Writing** | Not supported | Supported |
| **Suitable For** | Quick queries, getting started | Development, debugging, automated trading |
| **Security** | High (no private key exposure) | Depends on your key management |

:::tip Not Sure Which to Choose?
If you just want to try it out, or only need to query on-chain data in your daily use, start with the [Official Cloud Service](./OfficialServerAccess.md) — connect in 1 minute. When you need to transfer funds or write to contracts, switch to [Local Private Deployment](./LocalPrivatizedDeployment.md).
:::

---

## Supported Networks

Regardless of which access method you choose, TRON MCP Server supports the following three networks (defaulting to Mainnet):

| Network | Identifier | Purpose | Explorer |
| :--- | :--- | :--- | :--- |
| **Mainnet** | `mainnet` | Production environment, real assets | [tronscan.org](https://tronscan.org) |
| **Nile Testnet** | `nile` | Development testing (recommended) | [nile.tronscan.org](https://nile.tronscan.org) |
| **Shasta Testnet** | `shasta` | Development testing | [shasta.tronscan.org](https://shasta.tronscan.org) |

Specify the target network via the `network` parameter when calling tools, e.g., "Check the balance of this address on the Nile testnet."

---

## Security Considerations

:::warning
Before getting started, keep these security principles in mind — especially for operations involving real assets:

- **Never hardcode private keys**: Do not write private keys or mnemonic phrases directly in configuration files. Use system environment variables or an encrypted wallet instead.
- **Test on testnet first**: Always run through and verify on Nile or Shasta testnets before performing any operation on Mainnet.
- **Minimum funds principle**: The wallet configured for AI agents should only hold the minimum funds required for the task.
- **Pay attention to authorization risks**: Be especially cautious with token approval (`approve`) operations — avoid granting unlimited authorization.
:::

---

## Next Steps

- Want the fastest way to get started? → [Quick Start](./QuickStart.md)
- Only need to query on-chain data? → [Official Cloud Service Access](./OfficialServerAccess.md)
- Need transfers, contract calls, and full functionality? → [Local Private Deployment](./LocalPrivatizedDeployment.md)
- Want to see all 95 tools? → [Full Capability List](./ToolList.md)
