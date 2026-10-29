---
title: "Skills Quick Start"
sidebar_label: "Quick Start"
description: "Install selected Skills and use wallet-cli as the official wallet entry point."
---

# Skills Quick Start

Requires Node.js 22.23.4+ (22.x), 24.22.1+ (24.x), or 26.12.1+. Select the Skills you need instead of installing every legacy wallet and onboarding helper by default.

## Install wallet-cli

```bash
npm install -g @tron-walletcli/wallet-cli@4.14.0
wallet-cli --version
```

:::tip Permission error on install?
If `npm install -g` fails with a permission error (such as `EACCES`) on macOS or Linux, see npm's official guide: [Resolving EACCES permissions errors when installing packages globally](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).
:::

## Select the Skill

```bash
npx skills add https://github.com/BofAI/skills/tree/main --skill wallet-cli -g
```

`npx skills add` installs definitions, not external CLI dependencies. Since Skills 3.0.0, the `wallet-cli` Skill is pinned to `@tron-walletcli/wallet-cli@4.14.0`, the same version installed above. Keep the `/tree/main` suffix: the repository's default branch is `develop`, which can carry unreleased Skills pinned to a different CLI version.

For DeFi and data workflows (SunSwap, SunPump, SunPerp, TronScan, USDD), select additional Skills interactively:

```bash
npx skills add https://github.com/BofAI/skills/tree/main -g
```

Install only what you need and read each Skill's dependency and credential requirements. Do not assume SunSwap, SunPump, SunPerp, and USDD implementations have all moved to wallet-cli.

Two setup steps that `npx skills add` does not perform:

- **sun-cli** for the SunSwap and SunPump Skills — they require exactly 1.2.2 (`sun --version`): `npm install -g @sun-protocol/sun-cli@1.2.2`.
- **Node dependencies** for the SunPerp, TronScan and USDD Skills — run `npm install` inside each installed Skill folder, for example `cd ~/.agents/skills/tronscan-data-lookup && npm install`.

## Configure and use

Configure and select an account locally using the [Wallet CLI quick start](/wallet-cli/quickstart/). Never paste passwords, mnemonics, or private keys into chat.

- Wallet and general TRON operations: use the `wallet-cli` Skill. The Skill itself covers TRON wallet workflows; `x402`, `bai` and `8004` are wallet-cli command families outside the Skill's scope, so use their own references below.
- x402 payments: use [wallet-cli x402](/wallet-cli/command-reference/).
- B.AI recharge and records: list the `bai` commands with `wallet-cli bai --help` (a single command's input schema: `wallet-cli bai recharge --json-schema`; `wallet-cli bai --json-schema` returns the whole command catalog, not just `bai`) and configure a B.AI API key.
- DeFi and data workflows: follow each Skill's own requirements.

Skills 3.0.0 removed `bankofai-guide`, `agent-wallet`, `x402-payment`, and `recharge-skill`; see the [Skill catalog](/McpServer-Skills/SKILLS/BANKOFAISkill/) for the current list. The OpenClaw one-click installer is paused and is not the recommended entry point for new users.

[Skill catalog](/McpServer-Skills/SKILLS/BANKOFAISkill/) · [FAQ](/McpServer-Skills/SKILLS/Faq/)
