---
title: 'Changelogs'
description: 'Product updates and announcements for BANK OF AI — all products, newest first.'
---

# Changelogs

Product updates and announcements for BANK OF AI.

<div className="changelog-entry">
<div className="changelog-date">Jul 21, 2026</div>
<div className="changelog-body">

### Docs

<div className="changelog-tags"><span className="changelog-tag">Product Updates</span><span className="changelog-tag">Docs</span><span className="changelog-tag">x402</span></div>

- **TRON network IDs now use CAIP-2 format** across the x402 docs — `tron:0x2b6653dc` (Mainnet), `tron:0xcd8690dc` (Nile), `tron:0x94a9059e` (Shasta). In application code, prefer the SDK constants `TRON_MAINNET` / `TRON_NILE` / `TRON_SHASTA` over hard-coded hex strings. [Network & Token Support](../x402/core-concepts/network-and-token-support/)
- **`auth-capture` scheme removed** — x402 now documents four payment schemes: `exact`, `upto`, `batch-settlement`, and `exact_gasfree` (TRON). [SDK Features](../x402/sdk-features/)
- **x402 quickstarts simplified** for both buyers and sellers.
- **New model**: Kimi K3 pricing docs added to LLM Service.
- **Rewritten BANK OF AI introduction** — restructured around what your AI actually gains, with a capability overview and an end-to-end execution example.
- **New section — Best Practices**: hands-on walkthroughs and habits worth keeping, alongside the product docs. [Read the first one](../devnotes/first-onchain-swap/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Jul 17, 2026</div>
<div className="changelog-body">

### Docs

<div className="changelog-tags"><span className="changelog-tag">Product Updates</span><span className="changelog-tag">Docs</span></div>

- **New x402 CLI documentation set**: overview, quick start, full command reference, and FAQ — in English and 中文. [Read the docs](../x402/cli/)
- **Docs site refresh**: offline full-text search (⌘K), a Changelogs tab, section icons, and a cleaner sidebar layout.

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Jul 15, 2026</div>
<div className="changelog-body">

### x402 CLI

<div className="changelog-tags"><span className="changelog-tag">New Release</span><span className="changelog-tag">x402</span><span className="changelog-tag">CLI</span></div>

- **`v1.0.0` — first stable release** of `@bankofai/x402-cli`, a TypeScript command-line client for x402 payments: `pay` any x402-protected URL, `serve` a local paywall endpoint, `roundtrip` for end-to-end smoke tests, plus `gateway` and `catalog` for provider files and the service catalog.
- Built on the published `@bankofai/x402-core` / `x402-evm` / `x402-tron` SDK 1.0 packages; `scheme=exact` with Permit2.
- Networks: TRON (`tron:mainnet` / `tron:nile` / `tron:shasta`) and BSC (`eip155:56` / `eip155:97`). [Quick Start](../x402/cli/quickstart/)

</div>
</div>
<div className="changelog-entry">
<div className="changelog-date">Jul 10, 2026</div>
<div className="changelog-body">

### SKILLS · LLM Service

<div className="changelog-tags"><span className="changelog-tag">Update</span><span className="changelog-tag">New Model</span><span className="changelog-tag">x402</span></div>

- **SKILLS** — added guidance for the **`exact_gasfree` scheme** on TRON, and moved the API catalog to a new endpoint. Re-install if you pinned an older version. [Details](./skills/)
- **LLM Service** — added the **GPT-5.6** family: `sol`, `terra`, and `luna`. [Details](./llm-service/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Jul 2, 2026</div>
<div className="changelog-body">

### LLM Service

<div className="changelog-tags"><span className="changelog-tag">New Model</span></div>

- **Claude Fable 5** and **Claude Sonnet 5** added with full pricing. [Details](./llm-service/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Jun 19, 2026</div>
<div className="changelog-body">

### LLM Service

<div className="changelog-tags"><span className="changelog-tag">New Model</span><span className="changelog-tag">Pricing</span></div>

- Added **GLM-5.2**.
- Corrected the **Qwen cache-read price** — re-check any cost estimates based on the old figure. [Details](./llm-service/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Jun 13, 2026</div>
<div className="changelog-body">

### LLM Service

<div className="changelog-tags"><span className="changelog-tag">Removed</span></div>

- Deprecated models removed from the model list and pricing page. Requests naming them will now fail. [Details](./llm-service/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Jun 1, 2026</div>
<div className="changelog-body">

### LLM Service

<div className="changelog-tags"><span className="changelog-tag">New Model</span></div>

- Added **MiniMax M3** and **Claude Opus 4.8**, and regrouped the model sidebar by family. [Details](./llm-service/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Apr 15, 2026</div>
<div className="changelog-body">

### SKILLS · Agent Wallet

<div className="changelog-tags"><span className="changelog-tag">Docs</span></div>

- **SKILLS** — new Introduction and a Quick Start that installs in one command. [Details](./skills/)
- **Agent Wallet** — new Introduction covering key storage and signing, plus a Quick Start for your first wallet. [Details](./agent-wallet/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Apr 1, 2026</div>
<div className="changelog-body">

### Openclaw Extension

<div className="changelog-tags"><span className="changelog-tag">Privacy</span></div>

- Wallet addresses now display **masked** in the extension UI — safer for screen-sharing and recordings. [Details](./openclaw-extension/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Mar 31, 2026</div>
<div className="changelog-body">

### Openclaw Extension

<div className="changelog-tags"><span className="changelog-tag">New</span></div>

- Added a **Windows installation guide** alongside macOS and Linux. [Details](./openclaw-extension/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Mar 22, 2026</div>
<div className="changelog-body">

### Agent Wallet

<div className="changelog-tags"><span className="changelog-tag">New</span><span className="changelog-tag">Security</span></div>

- Published the developer set: **CLI Reference**, **SDK Guide**, and **SDK Cookbook**.
- **Security fix** — setup docs no longer use `echo $AGENT_WALLET_PASSWORD`, which printed your wallet password to the terminal and left it in shell history. If you followed the old instructions, clear your shell history and consider rotating the password. [Details](./agent-wallet/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Mar 17, 2026</div>
<div className="changelog-body">

### MCP Server · Openclaw Extension

<div className="changelog-tags"><span className="changelog-tag">New</span><span className="changelog-tag">Docs</span></div>

- **MCP Server** — added a full **Tool List** for the TRON MCP Server, with parameters. [Details](./mcp-server/)
- **Openclaw Extension** — first release: Introduction and Quick Start for connecting the browser extension to your Agent Wallet. [Details](./openclaw-extension/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Mar 13, 2026</div>
<div className="changelog-body">

### SKILLS

<div className="changelog-tags"><span className="changelog-tag">New</span></div>

- Published the **BANK OF AI Skill** reference — the bundle that teaches your AI client to read balances, quote swaps, and execute transactions through Agent Wallet. [Details](./skills/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Mar 10, 2026</div>
<div className="changelog-body">

### MCP Server

<div className="changelog-tags"><span className="changelog-tag">New</span><span className="changelog-tag">TRON</span></div>

- Two ways to connect: **Official Server Access** for the hosted endpoint, and **Local Private Deployment** when keys and traffic must stay in your own environment. [Details](./mcp-server/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Mar 2, 2026</div>
<div className="changelog-body">

### 8004 Protocol

<div className="changelog-tags"><span className="changelog-tag">Update</span></div>

- Repository links moved from `bankofai` to **`BofAI`**. Old URLs redirect, but update any pinned clone or dependency reference. [Details](./8004/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Feb 12, 2026</div>
<div className="changelog-body">

### 8004 Protocol

<div className="changelog-tags"><span className="changelog-tag">New Release</span></div>

- **v1.1.0** — added Supported Networks and Contract Addresses, published the Usage set (Install, Configure Agents, HTTP Registration), and rewrote the Quick Start around registering your first agent end to end. [Details](./8004/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Feb 11, 2026</div>
<div className="changelog-body">

### MCP Server · 8004 Protocol

<div className="changelog-tags"><span className="changelog-tag">New</span></div>

- **MCP Server** — first documentation for the **TRON MCP Server** and **BSC MCP Server**: installation, features, and API surface. [Details](./mcp-server/)
- **8004 Protocol** — initial docs on what on-chain agent identity is for and how to get started. [Details](./8004/)

</div>
</div>
