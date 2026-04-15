# Introduction

## BANK OF AI in One Sentence

**BANK OF AI is a complete infrastructure stack that lets your AI actually *do things* on the blockchain.**

Think of your AI assistant as a brilliant new intern: smart, tireless, always available — but with no bank account, no understanding of Web3's "unwritten rules," and no way to pay for online services on its own. BANK OF AI's job is to upgrade that intern into a **licensed on-chain operator** — equipped with a complete playbook covering every on-chain scenario (Skills), a secure wallet, and a protocol layer that lets it autonomously buy services as needed.

You don't need to write code, run scripts, or hop between dApps connecting wallets. You just give your AI the task — BANK OF AI handles everything underneath.

---

## How Does a Single Sentence Reach the Blockchain?

The flow is simpler than it looks — **you type one sentence into your AI client, and the diagram below is everything that happens next:**

<div style={{ textAlign: 'center', margin: '1.5rem 0' }}>

![BANK OF AI Architecture: How a user command reaches the blockchain](./image/bankofai-architecture.svg)

</div>

**Step 1: The AI Agent understands what you said**

You type a plain-language instruction into your AI client (OpenClaw / Cursor / Claude Code / Codex / ...) — something like *"swap 100 TRX for USDT."* The AI Agent is powered by **LLM Service** (one of GPT, Claude, Gemini, DeepSeek, Kimi, etc.), parses your intent, then decides which execution path to take.

**Step 2: Choose one of two execution paths**

Once the intent is clear, the AI Agent has two options:

- **🌟 Via Skills (Business Orchestration Layer)** — covers the vast majority of use cases
  Skills are pre-written "on-chain operation SOPs." The AI Agent picks the matching skill (e.g., the SunSwap Skill) and follows its standard flow: **check balance → verify approval → fetch quote → apply slippage protection → wait for your confirmation → call MCP Server to execute.** Complex multi-step operations collapse into "one sentence does it all" — no missed steps, no hidden pitfalls.

- **⚙️ Bypass Skills, call MCP Server directly**
  MCP Server provides standardized atomic-capability tools (both on-chain and off-chain). The AI Agent can call them without going through Skills. Note this path bypasses the Skills **orchestration layer** — **not the AI Agent itself**. The AI Agent is always the one initiating calls. Direct-call is fine for simple queries or custom developer flows; for complex transactions, approvals, or risk-sensitive operations, Skills are strongly recommended.

**Step 3: Sign, settle, commit to chain**

Whichever path is taken, the resulting transaction: **is signed locally by Agent-Wallet on your machine** (private key never leaves your computer; unified support for both EVM and TRON ecosystems) → **submitted to the blockchain**.

**Step 4: The result flows back to the AI Agent**

Once on-chain execution completes, **the result travels back up the same path to the AI Agent** — the blockchain returns a tx hash, status, and event logs; MCP Server parses them into structured data and passes them back to the AI Agent. **The AI Agent then generates a natural-language summary** from that structured data and attaches the transaction hash (for on-chain verification), all delivered through normal chat.

For example:

> ✅ Done — swapped 100 TRX for 350 USDT, fee 1.2 TRX.
> Tx hash: `0xabc123...def456` ([view on TronScan](https://tronscan.org))

The loop closes: **one sentence out, one readable sentence back**. You only ever talk to the AI Agent — no need to parse raw chain data yourself; meanwhile the tx hash is always visible for traceability and verification.

**🔀 Cross-layer Capability: x402 + 8004**

x402 (payment protocol) and 8004 (identity / reputation protocol) are **cross-layer capabilities** — they don't belong to any single layer but can be invoked at multiple points in the flow:

- When MCP Server calls a paid off-chain API, x402 handles "pay-before-response" settlement
- When the AI Agent or a Skill needs to verify a counterparty Agent's identity, 8004 provides an on-chain reputation report
- When Skills orchestration needs to run a pre-check against a service provider's credit, 8004 is queried again

---

## Core Modules (ordered from "most user-facing" → "deeper infrastructure")

### 🧠 1. AI Agent — Your Primary Entry Point

**This is what you actually "talk to."** In any AI client (OpenClaw / Cursor / Claude Code / etc.), you type a sentence and the AI Agent receives, understands, executes, and replies — to you the whole experience is just "chatting with AI."

The AI Agent's intelligence comes from **LLM Service**, BANK OF AI's unified model gateway that aggregates GPT, Claude, Gemini, DeepSeek, Kimi, GLM, MiniMax, and other leading models behind a single API — **one API key for every top-tier model**, billed by usage.

Whether you use OpenClaw, Cursor, Claude Code, or any other AI client, LLM Service connects you to all these brains.

👉 Learn more: [LLM Service Introduction](../llmservice/introduction.md)

---

### 🌟 2. Skills — The AI Agent's "On-chain Operation SOP Playbook"

**This is the standard flow the AI Agent follows when handling most on-chain tasks.** You don't notice Skills directly, but every time you see the AI work fast and reliably, it's Skills doing the orchestration in the background.

Skills are pre-written "on-chain operation SOPs for AI," covering common scenarios across the TRON ecosystem — SunSwap swaps, SunPerp perpetual futures, TronScan queries, TRC20 transfers, TRX staking & SR voting, USDD/JUST protocol, multi-sig permissions, x402 payments, BANK OF AI top-ups, and more. The skill set will keep expanding as the ecosystem grows.

Example: a user says *"use 50 USDT to buy some TRX."* A vanilla AI might generate a transaction that fails immediately because USDT was never approved on SunSwap. An AI loaded with the SunSwap Skill walks the full SOP automatically — **check balance → check approval → quote → slippage protection → wait for confirmation → execute** — no step skipped.

**You just talk to the AI Agent in plain language; Skills lets it compress complex multi-step on-chain operations into "one sentence done."** All the underlying MCP tool calls, wallet signatures, and contract parameter calculations are orchestrated automatically — you never need to know any of it.

👉 Learn more: [Skills Introduction](../McpServer-Skills/SKILLS/Intro.md)

---

### 🔐 3. Agent-Wallet — A Local Encrypted Vault Built for AI

A brain and a playbook still aren't enough. To spend money or send transactions, your AI needs **its own wallet**. But pasting a private key into a plaintext config file is like writing your bank PIN on a sticky note — every program on your machine (malicious plugins, AI coding assistants, automation scripts) can read it in a heartbeat.

Agent-Wallet is a local encrypted wallet purpose-built for AI agents. Your private key is encrypted and locked in a hidden directory; the AI only ever holds an unlock password. **Even if the password leaks, the encrypted file alone is useless. Even if the file is stolen, without the password it's just gibberish.** Two locks, orders of magnitude safer than plaintext keys.

Around this encryption mechanism, Agent-Wallet ships the following core capabilities:

- **Local Secure**: your private key is encrypted with industry-leading algorithms and stored in a hidden local directory (`~/.agent-wallet`); only the master password can unlock it
- **Local Signing**: all signing happens entirely on your machine — **100% offline** — your private key never leaves your computer
- **Multi-Wallet**: manage multiple wallets via CLI or SDK, switch the active wallet on demand, with full isolation between them
- **Multi-Chain**: a single unified interface covering both **EVM-compatible chains** (Ethereum / BSC / Polygon / Base / Arbitrum, etc.) and **TRON** (Mainnet / Nile / Shasta) — learn it once, use it across every supported chain

Whenever Skills (or the AI Agent calling MCP directly) needs to send a transaction, Agent-Wallet signs it locally and passes only the signed payload outward — **the private key itself never leaves your machine**.

👉 Learn more: [Agent-Wallet Introduction](../Agent-Wallet/Intro.md)

---

### 💸 4. x402 — Teaching Your AI to "Pay for the Internet" (Cross-layer Capability)

When your AI needs to call a **paid online service** (paid APIs, paid datasets), the traditional approach — register an account, link a credit card, configure an API key — simply doesn't work for an AI.

x402 is an open payment protocol built on the HTTP `402 Payment Required` status code. When the AI sees a 402 response, it **automatically signs a small on-chain payment and instantly receives the content**. No account registration, no human in the loop, no pre-funding.

x402 is a **cross-layer capability** — it doesn't belong to any single layer. Wherever "pay-before-response" is needed, x402 can be invoked: MCP Server calling a paid API can trigger it, the `x402-payment` Skill can trigger it explicitly, and the AI Agent itself can decide to trigger it.

Currently supports TRON and BSC, with more chains on the roadmap.

👉 Learn more: [x402 Protocol Introduction](../x402/index.md)

---

### 🪪 5. 8004 — On-chain Identity + Reputation for Agents (Cross-layer Capability)

As AI agents proliferate online, how do you know which ones are real, which are fake, and which can be trusted? The 8004 Protocol is Web3's "Agent Registry" — any agent can mint an identity NFT on-chain, bind its service endpoints (Web, MCP, DID), and accept feedback from other agents and users.

Like x402, 8004 is a **cross-layer capability** that can be invoked at several points in the flow: the AI Agent can check reputation before calling an unknown service, Skills orchestration can run pre-flight risk checks, and MCP Servers can verify each other's identities — all using the same protocol.

**In short, 8004 is the discovery + reputation layer for agents** — letting your AI pull a stranger's "credit report" on-chain before paying or granting authorization.

👉 Learn more: [8004 Protocol Introduction](../8004/general.md)

---

### ⚙️ 6. MCP Server — The Capability Provider Layer

:::info Regular users can skip this section
MCP Server is the low-level capability interface that Skills calls under the hood. **In most cases you won't notice it's there** — Skills has already wrapped it cleanly. This section is mainly for developers who want to understand the architecture.
:::

MCP Server (Model Context Protocol Server) is built on Anthropic's **Model Context Protocol** standard. It wraps various external capabilities into AI-callable standardized tools. By protocol design, MCP Server can carry both **on-chain capabilities** (queries, contract calls, transfer signing, etc.) and **off-chain capabilities** (price feeds, data queries, external APIs, etc.) — what each MCP Server actually exposes is entirely determined by its own implementation.

**Relationship between Skills and MCP Server:**

| Layer | Role | Responsibility |
|:---|:---|:---|
| **Skills** | Business Orchestration Layer | Stringing multi-step operations into SOPs, handling pre-checks and risk control |
| **MCP Server** | Capability Provider Layer | Exposing atomic capability tools to upper layers |

BANK OF AI currently ships three core MCP Servers, all **focused on atomic on-chain operations**:

- **TRON MCP Server**: atomic on-chain operations on TRON (query, transfer, contracts, staking, governance)
- **SUN MCP Server**: SunSwap V2/V3/V4 swap and liquidity capabilities
- **BSC MCP Server**: atomic on-chain operations on BNB Chain

We plan to extend more MCP Servers as needed, covering off-chain data, third-party protocols, and other scenarios.

Advanced developers can have the AI Agent bypass Skills and call MCP tools directly, but that means handling pre-checks, approvals, slippage, error recovery, and everything else yourself — exactly the things Skills automates for you.

👉 Learn more: [MCP Server Introduction](../McpServer-Skills/MCP/Intro.md)

---

### 🖥️ 7. SUN CLI — Developer Tool (CLI Interface to SUN MCP)

SUN CLI isn't a standalone layer — it's the **command-line interface to SUN MCP Server's capabilities** (CLI interface to MCP Server), built for developers and automation scenarios.

Prefer driving SunSwap from a terminal? Want to invoke SUN MCP from shell scripts or CI/CD pipelines? SUN CLI wraps quotes, swaps, liquidity, and position management into one-line commands with output that pipes cleanly into other tools.

👉 Learn more: [SUN CLI Introduction](../McpServer-Skills/Tools/SUNCli/Intro.md)

---

## Is BANK OF AI for Me?

- **Web3 beginner:** Absolutely. Just say "agent install everything" in your AI client — everything else is configured automatically. After that, talk to your AI in plain English; no underlying details needed.
- **Web3 veteran:** Skip the "switch wallet → copy address → calculate slippage → wait for blocks" grind. Let the AI handle the repetitive work; you focus on strategy.
- **AI Agent developer:** BANK OF AI ships full SDKs, CLIs, APIs, and MCP-standard interfaces. Build your own AI agents on top, with complete on-chain capability and autonomous payment built in.
- **API service provider:** With x402, your paid APIs can be called and metered automatically by AI agents — no traditional account registration or credit-card binding required. Especially well-suited for micropayments, AI agents auto-calling paid services, and agent-to-agent settlement scenarios.

---

## Ready?

The entire BANK OF AI installation has been compressed into **one sentence** — just say to your AI: "**agent install everything**"

That's it. The AI handles the rest: Skills, wallet setup, configuration across 9 AI clients — all in under a minute.

👉 **[Go to Quick Start and activate your full BANK OF AI stack in 1 minute](./QuickStart.md)**
