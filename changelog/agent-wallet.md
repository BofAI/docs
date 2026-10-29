---
title: 'Agent Wallet'
description: 'Release notes for Agent Wallet.'
---

# Agent Wallet

Release notes for Agent Wallet.

<div className="changelog-entry">
<div className="changelog-date">Oct 27, 2026</div>
<div className="changelog-body">

### Error codes, Privy automation and config schema

<div className="changelog-tags"><span className="changelog-tag">Docs</span><span className="changelog-tag">Fix</span></div>

- **SDK Guide** — lists the `code` values of `WalletCliExecutionError` / `WalletCliUsageError` (`capability_missing`, `network_mismatch`, `timeout`, …) and that wallet-cli's own failure codes pass through; a `wallet_cli` chainId mismatch throws `SigningError`; `signAndBroadcast()` returns `{ txId, stage: 'timeout' }` when a broadcast times out or the `wait` deadline passes, and throws `WalletCliSubmittedTransactionError` only when a status query fails after broadcast; the `/advanced` export list is complete.
- **CLI Reference** — `privy` automation needs both `--app-id` and `--app-secret-exec`, otherwise a reuse or secret prompt exits 1; `-g/--generate` is parsed but ignored; the `wallets_config.json` layout is described.

👉 [SDK Guide](/Agent-Wallet/Developer/SDK-Guide/) · [CLI Reference](/Agent-Wallet/Developer/CLI-Reference/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Oct 21, 2026</div>
<div className="changelog-body">

### Docs rewritten for Agent Wallet 3.0

<div className="changelog-tags"><span className="changelog-tag">Docs</span><span className="changelog-tag">Breaking</span></div>

- **Rewritten for 3.0.0** — every page now follows `@bankofai/agent-wallet` 3.0.0. The wallet types are `wallet_cli` (recommended), `privy` and `raw_secret`. `local_secure`, the master password, `AGENT_WALLET_PASSWORD`, `runtime_secrets.json`, and the `init`, `change-password` and `sign msg` commands no longer exist. See [Upgrading from 2.x](/Agent-Wallet/FAQ/#upgrade-from-2x).
- **Credentials** — wallet-cli and Privy secrets should come from exec scripts (`--cli-password-exec`, `--app-secret-exec`; a direct `--app-secret` value is also accepted but stored in plaintext); 3.x has no password environment variable. The env fallback reads only `AGENT_WALLET_PRIVATE_KEY` / `AGENT_WALLET_MNEMONIC`; the 2.x aliases such as `TRON_PRIVATE_KEY` are no longer read.
- **Exact network IDs** — `-n` / `network` accept only canonical CAIP-2 strings such as `tron:728126428`, `tron:3448148188` or `eip155:56`. Aliases like `tron:nile` and hex TRON IDs are rejected.
- **Signed transactions** — `signTransaction()` returns a `SignedTransactionArtifact` with a `family` field instead of a string, and the cookbook branches on it. `signMessage` was removed.
- **TypeScript only** — the Python tabs were removed. The PyPI package `bankofai-agent-wallet` stopped at 2.4.0 and follows the 2.x model.
- **Reference fixes** — `reset` removes only `wallets_config.json`; the error list now includes the `ExternalSigner*` and `WalletCli*` classes; the `/advanced` and `/integrations/wallet-cli` entry points and `AGENT_WALLET_WALLET_CLI_PATH` are documented.

👉 [Quick Start](/Agent-Wallet/QuickStart/) · [CLI Reference](/Agent-Wallet/Developer/CLI-Reference/) · [SDK Guide](/Agent-Wallet/Developer/SDK-Guide/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Sep 10, 2026</div>
<div className="changelog-body">

### Agent Wallet v3.0.0

<div className="changelog-tags"><span className="changelog-tag">New Release</span><span className="changelog-tag">Breaking</span></div>

- **Wallet types** — new `wallet_cli` type delegates TRON and EVM transaction and typed-data signing to a local wallet-cli account (compatible range `>=4.13.0 <5.0.0`). `local_secure`, the master password, `AGENT_WALLET_PASSWORD` and `runtime_secrets.json` are removed; existing `local_secure` wallets are not converted.
- **Signing API** — `signTransaction()` returns a `SignedTransactionArtifact` with a `family` field (`rawTransaction` for EVM, `transaction` for TRON) instead of a string. `signRaw()`, `signMessage()` and the CLI `sign msg` command are removed; only transaction and typed-data signing remain.
- **Package surface** — low-level adapters, clients and config resolvers move to `@bankofai/agent-wallet/advanced`; wallet-cli helpers are under `@bankofai/agent-wallet/integrations/wallet-cli`. `ConfigWalletProvider` is now `new ConfigWalletProvider(dir, options)`.
- **Credentials and environment** — Privy and wallet-cli secrets accept `{ "exec": "/absolute/script" }` references (`--app-secret-exec`, `--cli-password-exec`). The 2.x aliases `TRON_PRIVATE_KEY`, `TRON_MNEMONIC` and `TRON_ACCOUNT_INDEX` are no longer read; use `AGENT_WALLET_PRIVATE_KEY`, `AGENT_WALLET_MNEMONIC` and `AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX`.
- Published to npm on September 10, 2026. The Python package stays at 2.4.0 on PyPI. Upgrade steps: [Upgrading from 2.x](/Agent-Wallet/FAQ/#upgrade-from-2x).

👉 [Introduction](/Agent-Wallet/Intro/) · [CLI Reference](/Agent-Wallet/Developer/CLI-Reference/) · [SDK Guide](/Agent-Wallet/Developer/SDK-Guide/)

</div>
</div>

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
