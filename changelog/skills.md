---
title: 'SKILLS'
description: 'Release notes for SKILLS.'
---

# SKILLS

Release notes for SKILLS.

<div className="changelog-entry">
<div className="changelog-date">Jul 21, 2026</div>
<div className="changelog-body">

### x402-payment now runs on the x402 CLI

<div className="changelog-tags"><span className="changelog-tag">Update</span><span className="changelog-tag">x402</span></div>

- **Payments go through `x402-cli`** (1.0.1 or newer) instead of bundled local TypeScript scripts. The skill checks your installed version and tells you how to install the CLI when it is missing.
- **Every payment is previewed and capped** — a `--dry-run --json` preview before the first payment to an unfamiliar endpoint, and `--max-amount` on the real request. GasFree payments must also cap the relayer fee with `--max-gasfree-fee`, which the payment cap does not cover.
- **Canonical CAIP-2 TRON identifiers only** — `tron:0x2b6653dc`, `tron:0xcd8690dc`, `tron:0x94a9059e`. Shorthand aliases such as `tron:mainnet` are rejected. The `agent-wallet` skill uses the same identifiers.
- The retired `--gasfree-info` / `--gasfree-activate` script flags are gone, and uninstall now handles custom skill directories.

👉 [Skill Catalog](/McpServer-Skills/SKILLS/BANKOFAISkill/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Jul 10, 2026</div>
<div className="changelog-body">

### GasFree guidance and a new catalog URL

<div className="changelog-tags"><span className="changelog-tag">Update</span><span className="changelog-tag">x402</span></div>

- Skills now document the **`exact_gasfree` payment scheme** on TRON — pay for an x402 service without keeping TRX around for energy.
- The **API catalog endpoint moved to a new URL**. Skills and the facilitator config were updated together; re-install if you pinned an older version.

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Apr 15, 2026</div>
<div className="changelog-body">

### Introduction and one-line install

<div className="changelog-tags"><span className="changelog-tag">Docs</span></div>

- Added an **Introduction** page explaining what Skills give your AI, plus a **Quick Start** that gets you installed in a single command.

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Mar 13, 2026</div>
<div className="changelog-body">

### BANK OF AI Skill

<div className="changelog-tags"><span className="changelog-tag">New</span></div>

- Published the **BANK OF AI Skill** reference — the bundle that teaches your AI client to read balances, quote swaps, and execute on-chain transactions through Agent Wallet.

</div>
</div>
