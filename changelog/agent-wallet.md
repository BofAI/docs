---
title: 'Agent Wallet'
description: 'Release notes for Agent Wallet.'
---

# Agent Wallet

Release notes for Agent Wallet.

<div className="changelog-entry">
<div className="changelog-date">Sep 9, 2026</div>
<div className="changelog-body">

### SDK surface documented, CLI examples corrected

<div className="changelog-tags"><span className="changelog-tag">Docs</span><span className="changelog-tag">Fix</span></div>

- **`resolveWallet()` documented** — the one-call shortcut (`resolve_wallet()` in Python) that replaces `resolveWalletProvider()` + `getActiveWallet()`, including the `walletId` and `dir` options.
- **`SignOptions.authorizationSignature` documented** — every signing method takes it as an optional second argument; it becomes the `privy-authorization-signature` header required by Privy authorization-key policies. The field is `authorizationSignature` in TypeScript and `authorization_signature` in Python.
- **Python error imports** — only six error classes are exported from the top-level `agent_wallet`; the other five must be imported from `agent_wallet.core.errors`.
- **CLI quick start** — the custom-password example now names the wallet type (`start local_secure -p …`), because `-p` is rejected when the interactive prompt selects `raw_secret` or `privy`.
- **Cookbook** — the x402 signing walkthrough is retitled to EIP-3009 and now distinguishes itself from the repository's `PaymentPermit` typed-data struct, which uses a different domain and fields.

👉 [SDK Guide](/Agent-Wallet/Developer/SDK-Guide/) · [CLI Reference](/Agent-Wallet/Developer/CLI-Reference/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Sep 8, 2026</div>
<div className="changelog-body">

### CLI signing documentation corrected

<div className="changelog-tags"><span className="changelog-tag">Docs</span><span className="changelog-tag">Fix</span></div>

- Clarified that `local_secure` and `raw_secret` signing require `--network`, while Privy wallets derive the chain type from the Privy wallet and use the payload's `chainId` for EVM transactions.

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Apr 15, 2026</div>
<div className="changelog-body">

### Introduction and quick install

<div className="changelog-tags"><span className="changelog-tag">Docs</span></div>

- Added an **Introduction** covering how keys are stored and how signing works, plus a **Quick Start** for creating your first wallet.

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Apr 1, 2026</div>
<div className="changelog-body">

### Agent Wallet v2.4.0

<div className="changelog-tags"><span className="changelog-tag">New Release</span></div>

- **Privy wallet type** — delegate key custody to [Privy](https://privy.io)'s server-side wallets; configure with a Privy App ID, App Secret, and Wallet ID. No key ever sits on your disk (signing requests go to Privy's API).
- **New `resolve-address` command** — display a wallet's derived EVM and TRON addresses (a single address for `privy` wallets).
- **Non-interactive `change-password`** — `change-password -p '<old>' --new-password '<new>'` works without prompts, for scripted rotation.
- **Reworked `start` / `add <type>` subcommands** — pick the wallet type (`local_secure` / `raw_secret` / `privy`) directly on the command line.

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Mar 22, 2026</div>
<div className="changelog-body">

### Developer docs — and a password-handling fix

<div className="changelog-tags"><span className="changelog-tag">New</span><span className="changelog-tag">Security</span></div>

- Published the developer set: **CLI Reference**, **SDK Guide**, and **SDK Cookbook**.
- **Security fix**: the setup docs previously used `echo $AGENT_WALLET_PASSWORD`, which prints your wallet password to the terminal and leaves it in shell history. Those examples have been removed. If you followed the old instructions, clear your shell history and consider rotating the password.

</div>
</div>
