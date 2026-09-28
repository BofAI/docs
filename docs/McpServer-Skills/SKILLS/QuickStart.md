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

:::tip Permission error on install?
If `npm install -g` fails with a permission error (such as `EACCES`) on macOS or Linux, either prefix the command with `sudo`, or drop `-g` to install into the current directory and run the CLI as `npx wallet-cli`.
:::

## Select the Skill

```bash
npx skills add https://github.com/BofAI/skills --skill wallet-cli -g
```

`npx skills add` installs definitions, not external CLI dependencies. Since Skills 3.0.0, the `wallet-cli` Skill is pinned to `@tron-walletcli/wallet-cli@4.14.0`, the same version installed above.

For DeFi and data workflows (SunSwap, SunPump, SunPerp, TronScan, USDD), select additional Skills interactively:

```bash
npx skills add https://github.com/BofAI/skills -g
```

Install only what you need and read each Skill's dependency and credential requirements. Do not assume SunSwap, SunPump, SunPerp, and USDD implementations have all moved to wallet-cli.

## Configure and use

Configure and select an account locally using the [Wallet CLI quick start](/wallet-cli/quickstart/). Never paste passwords, mnemonics, or private keys into chat.

- Wallet and general TRON operations: use the `wallet-cli` Skill.
- x402 payments: use [wallet-cli x402](/wallet-cli/command-reference/).
- B.AI recharge and records: inspect `wallet-cli bai --json-schema -o json` and configure a B.AI API key.
- DeFi and data workflows: follow each Skill's own requirements.

Skills 3.0.0 removed `bankofai-guide`, `agent-wallet`, `x402-payment`, and `recharge-skill`; see the [Skill catalog](/McpServer-Skills/SKILLS/BANKOFAISkill/) for the current list. The OpenClaw one-click installer is paused and is not the recommended entry point for new users.

[Skill catalog](/McpServer-Skills/SKILLS/BANKOFAISkill/) · [FAQ](/McpServer-Skills/SKILLS/Faq/)
