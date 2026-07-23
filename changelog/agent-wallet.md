---
title: 'Agent Wallet'
description: 'Release notes for Agent Wallet.'
---

# Agent Wallet

Release notes for Agent Wallet.

<div className="changelog-entry">
<div className="changelog-date">Apr 15, 2026</div>
<div className="changelog-body">

### Introduction and quick install

<div className="changelog-tags"><span className="changelog-tag">Docs</span></div>

- Added an **Introduction** covering how keys are stored and how signing works, plus a **Quick Start** for creating your first wallet.

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
