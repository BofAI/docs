---
title: 'Introduction'
slug: /
description: >-
  BANK OF AI is the infrastructure connecting AI and Web3. Install it, and your AI can pay, prove its identity, and execute on-chain — you describe the goal, the AI gets it done.
---

# Introduction

Today's AI can write code, analyze data, build presentations — it can even deliver an entire software project on its own.

But tell it this:

> Swap 100 USDT for TRX.

and it can't do a thing. The problem isn't that it doesn't know how. The problem is that — **it has no way into Web3**.

---

## What's missing?

To operate in Web3, AI is missing four essential capabilities:

- 💸 **Payment** — no way to pay when a service charges for access
- 🪪 **Identity** — no way to prove who it is on-chain
- ⚙️ **Execution** — no connection to the blockchain, so nothing actually lands
- 🔐 **Wallet** — can't hold assets, can't sign

A model solves "figuring it out." These four solve "getting it done." Supplying them is exactly why BANK OF AI exists.

---

## What is BANK OF AI?

> **BANK OF AI is the infrastructure connecting AI and Web3.**

It isn't a new model, a wallet app, or an exchange. It installs into the AI client you already use — OpenClaw, Claude Code, Cursor, Codex — and gives your AI what it needs to enter Web3, without changing how you work.

Once installed, your AI goes from "offering advice" to "getting things done." Here's what it gains.

---

## What your AI gains

<div className="intro-cards">

<div className="intro-card">

<div className="intro-card-title">💸 Payment</div>

Your AI can pay for APIs and Agent services automatically — always confirming with you before spending.

<div className="intro-card-links">

[x402](../x402/index.md)

</div>

</div>

<div className="intro-card">

<div className="intro-card-title">⚙️ Execution</div>

Your AI can run transfers, swaps, and staking through standard, checked workflows.

<div className="intro-card-links">

[Skills](../McpServer-Skills/SKILLS/Intro.md) · [MCP Server](../McpServer-Skills/MCP/Intro.md)

</div>

</div>

<div className="intro-card">

<div className="intro-card-title">🔐 Wallet</div>

Your AI can sign securely — your private key never leaves your device.

<div className="intro-card-links">

[Agent Wallet](../Agent-Wallet/Intro.md)

</div>

</div>

<div className="intro-card">

<div className="intro-card-title">🪪 Identity</div>

Your AI has a verifiable on-chain identity, so Agents can trust and work with each other.

<div className="intro-card-links">

[8004](../8004/general.md)

</div>

</div>

</div>

Reasoning, of course, your AI already has. BANK OF AI doesn't replace your model — it lets you switch freely between GPT, Claude, Gemini and others, and combine that reasoning with real Web3 capability ([LLM Service](../llmservice/introduction.md)).

You don't need to memorize these product names, and there are no new commands or tools to learn. Just tell your AI what you want, the same way you'd chat with it:

> **You describe the goal. The AI gets it done.**

Here's a real example of how these capabilities work together.

---

## A real execution

Once installed, you say:

> Swap 100 USDT for TRX, keep slippage under 1%.

The whole path, at a glance:

```text
User
 ↓
AI interprets the request
 ↓
Selects a Skill or calls an MCP Server
 ↓
Agent Wallet signs
 ↓
Transaction broadcast
 ↓
Blockchain
 ↓
Result
```

If anything goes wrong along the way — insufficient balance, a malformed address — the AI stops immediately and tells you why. And anything that spends money always needs your confirmation first.

---

## Architecture

Abstract that path into a diagram, and you have all of BANK OF AI:

```text
    AI
    │
BANK OF AI
    │
   Web3
```

Internally it's four layers, each with a single job:

| Layer | What it does |
| :-- | :-- |
| 🧠 Model | Provides reasoning — pick whichever model fits |
| 🛤️ Protocol | Sets the rules: how to pay, how to prove identity |
| 🔧 Tool | Handles execution: workflows, tools, signing |
| 🌐 Ecosystem | Connects third-party services across chains through one standard |

Each layer works on its own, or combines into the full platform. Later chapters cover the design and usage of each one — for now, a general picture is all you need.

---

## Want to go deeper?

| If you want to understand | Go here |
| :-- | :-- |
| How AI uses multiple models | [LLM Service](../llmservice/introduction.md) |
| How AI pays automatically | [x402 Payment Protocol](../x402/index.md) |
| On-chain identity and reputation | [8004 Protocol](../8004/general.md) |
| How keys are stored and signing works | [Agent Wallet](../Agent-Wallet/Intro.md) |
| The workflows AI follows | [Skills](../McpServer-Skills/SKILLS/Intro.md) |
| How AI calls on-chain tools | [MCP Server](../McpServer-Skills/MCP/Intro.md) |

---

## Your turn

You now know what BANK OF AI is, why it exists, and how it works. One step left: try it yourself.

Setup takes about a minute — paste an install command, then confirm wallet creation. After that, you can give your AI its first on-chain instruction:

> Check my wallet balance.

From that moment on, your AI has Web3 capability, and everything that follows happens in plain language.

Whether you're checking assets, executing trades, or calling on-chain services — describe the goal, and leave the rest to your AI.

👉 **[Go to Quick Start](./QuickStart.md)**
