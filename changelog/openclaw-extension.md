---
title: 'Openclaw Extension'
description: 'Release notes for the Openclaw Extension.'
---

# Openclaw Extension

Release notes for the Openclaw Extension.

<div className="changelog-entry">
<div className="changelog-date">Oct 27, 2026</div>
<div className="changelog-body">

### Installer details corrected

<div className="changelog-tags"><span className="changelog-tag">Docs</span><span className="changelog-tag">Fix</span></div>

- The skill configuration phase (API key prompt, `Next steps`) runs only for skills that were not already in the skill list before the run (on the default global install it covers `~/.openclaw/skills/`, `~/.agents/skills/` and other agents' skill folders), so re-installs print `No new skills were installed.` and skip it; the Quick Start now says so and points to the manual API key steps. The `Proceed with installation?` prompt and the `bankofai-recharge` remote URL are documented.
- The Node.js error text matches what the installer prints (on Windows without the `Error: ` prefix); the manual `bankofai-config.json` steps set `chmod 600` like the installer does; Windows is described as almost identical with the differences in the FAQ; deleting `~/.openclaw/skills/` removes skills only — MCP entries, the API key file, global npm packages and `~/.agent-wallet` stay; Clean mode clears the MCP entries, skills and config files and re-initialises agent-wallet, but never uninstalls the npm packages.

👉 [Quick Start](/Openclaw-extension/QuickStart/) · [FAQ](/Openclaw-extension/FAQ/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Oct 23, 2026</div>
<div className="changelog-body">

### Docs matched to the current installer

<div className="changelog-tags"><span className="changelog-tag">Docs</span><span className="changelog-tag">Fix</span></div>

- **Correction to the Sep 9 entry** — those installer changes never shipped. The installer on `main` still pins Skills `v1.5.15` (14 skills, no `wallet-cli`), `@bankofai/agent-wallet` 2.3.1 and `@bankofai/mcp-server-tron` 1.1.7, and writes `base_url: https://chat.ainft.com`. The Quick Start and FAQ now describe that installer, and a note at the top explains that its wallet steps follow agent-wallet 2.x.
- **What else the docs now say** — selecting `x402-payment` also runs `npm install --global @bankofai/x402-cli@1.0.1`; the TronScan API key is optional (without one the skill uses `ts.bankofai.io`); a project-level install goes to `<cwd>/skills/`; there is no TronGrid prompt; with an existing wallet, agent-wallet 2.3.1 first asks whether to add one or exit; and on Windows the installer exits if `~/.openclaw` is missing.
- **Node.js** — both installers check the full version against `^22.23.4 || ^24.22.1 || >=26.12.1` before installing anything.

👉 [Quick Start](/Openclaw-extension/QuickStart/) · [FAQ](/Openclaw-extension/FAQ/)

</div>
</div>

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
