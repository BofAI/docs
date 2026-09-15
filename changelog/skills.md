---
title: 'SKILLS'
description: 'Release notes for SKILLS.'
---

# SKILLS

Release notes for SKILLS.

<div className="changelog-entry">
<div className="changelog-date">Sep 9, 2026</div>
<div className="changelog-body">

### Skill catalog details corrected

<div className="changelog-tags"><span className="changelog-tag">Docs</span><span className="changelog-tag">Fix</span></div>

- **SunPerp withdrawals** — the credential column now notes that withdrawals need `TRON_PRIVATE_KEY` to sign the confirmation, in addition to SunPerp API keys.
- **Client support** — the installer targets a broad set of coding agents and assistants (Claude Code, Cursor, Codex, Cline, Gemini CLI, Amp, Zed and more), by symlink where the tool has its own skill directory and by copy where it does not. The FAQ previously listed OpenClaw alone.
- **Recharge base URL** — `BANKOFAI_API_KEY` is issued at `chat.bankofai.io/key`; the recharge skill's leftover `chat.ainft.com` default was corrected in the skills repository.

👉 [Skill Catalog](/McpServer-Skills/SKILLS/BANKOFAISkill/) · [FAQ](/McpServer-Skills/SKILLS/Faq/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Sep 8, 2026</div>
<div className="changelog-body">

### x402-payment CLI requirement corrected

<div className="changelog-tags"><span className="changelog-tag">Docs</span><span className="changelog-tag">Fix</span></div>

- Corrected the `x402-payment` requirement: the skill accepts exactly `x402-cli` version `1.0.1`, not `1.0.1 or newer`. Transaction-ID placeholders were also escaped so the page compiles as valid MDX.

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Sep 7, 2026</div>
<div className="changelog-body">

### Skills 2.0.0 — a leaner, wallet-cli-centered catalog

<div className="changelog-tags"><span className="changelog-tag">New Release</span><span className="changelog-tag">Breaking</span></div>

- **Five skills removed**: `multisig-permissions`, `trc20-toolkit-skill`, `trx-staking-skill`, `twitter-digest`, and `twitter-mcp`. Generic TRON workflows — TRC20 transfers and token queries, staking and SR voting, account-permission management — are now handled by **`wallet-cli`**; X/Twitter workflows no longer belong to this DeFi-focused collection. The catalog now holds **10 skills**.
- **`wallet-cli` 2.0.0** — the pinned CLI moves to `@tron-walletcli/wallet-cli@4.13.0`, and the canonical network identifiers become decimal CAIP-2 ids (`tron:728126428` Mainnet, `tron:3448148188` Nile, `tron:2494104990` Shasta); `tron:mainnet`-style names remain input aliases only.
- **Skill versions unified** — every retained skill now carries the repository release version (2.0.0), enforced by a CI consistency check.

👉 [Skill Catalog](/McpServer-Skills/SKILLS/BANKOFAISkill/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Aug 29, 2026</div>
<div className="changelog-body">

### Install from the stable main branch

<div className="changelog-tags"><span className="changelog-tag">Update</span></div>

- The recommended install source is now pinned to the stable **`main`** branch: `npx skills add https://github.com/BofAI/skills/tree/main`. Other development branches may contain unreleased changes — use them only for intentional testing.

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Aug 26, 2026</div>
<div className="changelog-body">

### New skill: wallet-cli

<div className="changelog-tags"><span className="changelog-tag">New</span><span className="changelog-tag">TRON</span></div>

- Added **`wallet-cli`** — standalone TRON wallet operations (accounts, transfers, staking, governance, contracts, signing, chain queries) through the pinned `@tron-walletcli/wallet-cli@4.12.0`, driven entirely over the CLI's machine-readable JSON contract (`-o json`, exit-code first).
- Hard safety boundaries built in: in agent-driven runs wallet passwords are accepted only via `--password-stdin` (never argv, environment variables, or chat), and the root wallet-administration commands (`import` / `backup` / `delete` / `change-password`) stay **human-only** — the agent will not run them even with confirmation.

👉 [Skill Catalog](/McpServer-Skills/SKILLS/BANKOFAISkill/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Jul 21, 2026</div>
<div className="changelog-body">

### x402-payment now runs on the x402 CLI

<div className="changelog-tags"><span className="changelog-tag">Update</span><span className="changelog-tag">x402</span></div>

- **Payments go through `x402-cli`** (exactly version 1.0.1) instead of bundled local TypeScript scripts. The skill checks your installed version and tells you how to install the CLI when it is missing or mismatched.
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
