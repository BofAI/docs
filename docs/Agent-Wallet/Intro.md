# Introduction

AI agents are increasingly involved in on-chain operations: paying API fees, signing authorizations, executing transfers. But there's an unavoidable challenge — private keys.

Hardcoding private keys in source code is unsafe. Delegating them to a cloud service means losing control. Requiring manual confirmation for every operation defeats the purpose of "autonomous."

AI agents need a way to **keep keys securely local, sign locally, and expose only a clean interface to the outside world**.

That's the problem **Agent-wallet** is designed to solve.

---

## What is Agent-wallet

**Agent-wallet** is a **signing-only SDK** that enables AI agents (MCP servers, autonomous workflows, etc.) to securely manage and use blockchain keys.

:::tip It does two things

- **Key storage** — Encrypts and stores private keys locally using the Keystore V3 format
- **Local signing** — Signs messages, transactions, and EIP-712 typed data with zero network calls

:::

:::caution What it does NOT do

- Does not connect to any RPC or query on-chain data
- Does not build transactions (the caller is responsible)
- Does not broadcast transactions (the caller is responsible)
- Does not initiate transfers or payments autonomously

:::

This separation of concerns keeps Agent-wallet lightweight and free from any dependency on a specific RPC provider.

---

## Why Agent-wallet

### Built for AI Agents

Traditional wallets are designed for humans — they have interfaces, require manual confirmation, and assume a user is present. Agent-wallet's interface is designed for programs: configured via environment variables, called through an SDK, and naturally suited for embedding inside an MCP Server or automated workflow.

### Private Keys Never Leave the Machine

All signing happens locally with zero network requests. Private keys are never sent to any server, and there is no dependency on cloud HSMs or custodial services. You retain full control of your keys.

### Bank-Grade Key Encryption

Private keys are stored encrypted in **Keystore V3** format, using scrypt (with a computational cost orders of magnitude higher than standard bcrypt) + AES-128-CTR + keccak256 MAC. Even if the key file is stolen, the private key cannot be extracted without the master password. The master password itself is never stored to disk in any form.

### Not Tied to Any RPC Provider

Because Agent-wallet performs no on-chain operations, you can use any RPC provider — TronGrid, Infura, a self-hosted node — without affecting signing logic. Migrating or switching providers requires zero changes to signing code.

### Multi-chain, Dual-language, One Interface

EVM and TRON share the same `BaseWallet` interface. The Python and TypeScript implementations behave identically and share the same key file format. The same key, in a different language, produces the exact same signature.

---

## Two Ways to Use It

### CLI (Command-Line Tool)

Best for managing keys, manually testing signatures, and daily key management tasks.

```bash
npm install -g @bankofai/agent-wallet
agent-wallet start           # Initialize and create a default wallet
agent-wallet sign msg "Hello"  # Sign a message
```

→ See [CLI Quick Start](./QuickStart.md)

### SDK (Programmatic Interface)

Best for integrating signing capabilities in code, such as inside an MCP Server.

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";

const provider = resolveWalletProvider({ network: "tron:nile" });
const wallet = await provider.getActiveWallet();
const sig = await wallet.signMessage(new TextEncoder().encode("Hello"));
```

Available in both **Python** and **TypeScript**, with identical interfaces and fully compatible output.

→ See [SDK Quick Start](./SDKQuickStart.md)

---

## Supported Chains

| Chain Type | Network Identifier | Supported Networks |
| :--- | :--- | :--- |
| **EVM** | `eip155:*` | Ethereum, BSC, Polygon, Base, Arbitrum, and any EVM-compatible chain |
| **TRON** | `tron:*` | TRON Mainnet, Nile Testnet, Shasta Testnet |

---

## Where Agent-wallet Fits in the BANK OF AI Ecosystem

Agent-wallet is the signing layer of the entire ecosystem. Other components (such as MCP Server and x402 SDK) rely on Agent-wallet for private key operations when signing is required:

```
AI Agent
  └── Skills / x402 SDK          ← Decides "what to do"
        └── MCP Server           ← Builds transactions, queries on-chain data
              └── Agent-wallet   ← Signs (and only that)
```

Agent-wallet has no knowledge of business logic. Its only job is to securely hold keys and sign on demand.

---

## Where to Start

| Your Goal | Start Here |
| :--- | :--- |
| Initialize a wallet, manage keys and sign via command line | [CLI Quick Start](./QuickStart.md) |
| Integrate signing in Python or TypeScript code | [SDK Quick Start](./SDKQuickStart.md) |
| Browse common questions | [FAQ](./FAQ.md) |
