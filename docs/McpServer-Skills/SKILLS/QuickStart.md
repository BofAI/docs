---
title: "Skills Quick Start"
description: "Install selected Skills and use wallet-cli as the official wallet entry point."
---

# Skills Quick Start

Requires Node.js 20 or newer. Select the Skills you need instead of installing every legacy wallet and onboarding helper by default.

## Install wallet-cli

```bash
npm install -g @tron-walletcli/wallet-cli@4.14.0
wallet-cli --version
```

## Select the Skill

```bash
npx skills add https://github.com/BofAI/skills/tree/main --skill wallet-cli -g
```

`npx skills add` installs definitions, not external CLI dependencies. Inspect the dependency version in the installed `wallet-cli/SKILL.md`. The 4.14.0 Skill update is tracked in [Skills PR #81](https://github.com/BofAI/skills/pull/81). If the stable branch still requires 4.13.0, do not bypass its version check or automatically downgrade: use 4.14.0 directly through the [CLI quick start](/wallet-cli/quickstart/) until the matching Skill is released.

For community workflows, select additional Skills interactively:

```bash
npx skills add https://github.com/BofAI/skills/tree/main -g
```

Install only what you need and read each Skill's dependency and credential requirements. Do not assume SunSwap, SunPump, SunPerp, and USDD implementations have all moved to wallet-cli.

## Configure and use

Configure and select an account locally using the [Wallet CLI quick start](/wallet-cli/quickstart/). Never paste passwords, mnemonics, or private keys into chat.

- Wallet and general TRON operations: use the `wallet-cli` Skill.
- x402 payments: use [wallet-cli x402](/wallet-cli/command-reference/).
- B.AI recharge and records: inspect `wallet-cli bai --json-schema -o json` and configure a B.AI API key.
- Community workflows: follow their actual Skill requirements; do not universally require an agent-wallet account.

`bankofai-guide` is no longer the default post-install step. The OpenClaw one-click installer is paused and is not the recommended entry point for new users.

[Skill catalog](/McpServer-Skills/SKILLS/BANKOFAISkill/) · [FAQ](/McpServer-Skills/SKILLS/Faq/)

{/* Preserve bookmarks to sections replaced by the wallet-cli migration guidance. */}
<span id="step-1-install-the-skills"></span>
<span id="method-1-conversational-install-easiest"></span>
<span id="method-2-quick-auto-install-command-line"></span>
<span id="method-3-interactive-install-most-control"></span>
<span id="interactive-installation-walkthrough"></span>
<span id="verify-installation"></span>
<span id="step-2-talk-to-your-ai"></span>
<span id="-want-the-ai-to-trade-for-you"></span>
<span id="option-1-open-a-dedicated-payment-account-for-the-ai-strongly-recommended-safest"></span>
<span id="option-2-paste-your-private-key-directly-for-power-users-or-quick-testing"></span>
<span id="-key-is-set--how-do-i-start-trading"></span>
<span id="next-steps"></span>
