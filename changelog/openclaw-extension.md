---
title: 'Openclaw Extension'
description: 'Release notes for the Openclaw Extension.'
---

# Openclaw Extension

Release notes for the Openclaw Extension.

<div className="changelog-entry">
<div className="changelog-date">Sep 9, 2026</div>
<div className="changelog-body">

### Installer tracks the current skill set

<div className="changelog-tags"><span className="changelog-tag">Fix</span><span className="changelog-tag">SKILLS</span></div>

- The installer was pinned to the `v1.5.14` skills tag, so it delivered 14 skills — including several retired in 2.0.0 — and never installed `wallet-cli`. It now tracks the skills repository's `main` branch and installs the current set of 10.
- The generated BANK OF AI config wrote `base_url: https://chat.ainft.com`. It now writes `https://chat.bankofai.io`, the host that issues `BANKOFAI_API_KEY`.
- The TronScan prompt claimed the skill **requires** `TRONSCAN_API_KEY`. It does not: without a key the skill falls back to the BofAI proxy (`ts.bankofai.io`), and a key only raises the rate limit. Both installers now say so.
- Documentation updates: the wizard requires Node.js 20+ (the TRON MCP server declares it), and only the macOS/Linux script skips the version check — the Windows script enforces `>=18` only, which is below the `>=20` the TRON MCP server declares. The admin-privileges answer now explains that the pinned global `agent-wallet` install is the one step that writes outside your user directory.

👉 [Quick Start](/Openclaw-extension/QuickStart/) · [FAQ](/Openclaw-extension/FAQ/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Apr 1, 2026</div>
<div className="changelog-body">

### TRON addresses are masked by default

<div className="changelog-tags"><span className="changelog-tag">Privacy</span></div>

- Wallet addresses now display masked in the extension UI — useful when you're screen-sharing or recording.

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Mar 31, 2026</div>
<div className="changelog-body">

### Windows setup

<div className="changelog-tags"><span className="changelog-tag">New</span></div>

- Added a **Windows installation guide** alongside the existing macOS and Linux steps, and expanded the general setup walkthrough.

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Mar 17, 2026</div>
<div className="changelog-body">

### First release

<div className="changelog-tags"><span className="changelog-tag">New</span></div>

- Published the **Introduction** and **Quick Start** for the Openclaw Extension — connect the browser extension to your Agent Wallet and start acting on-chain from the page you're already on.

</div>
</div>
