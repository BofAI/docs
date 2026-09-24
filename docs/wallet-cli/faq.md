---
title: "Wallet CLI FAQ"
description: "Installation, wallet, and payment questions for wallet-cli 4.14."
---

# Wallet CLI FAQ

## Does a preview need a wallet?

`x402 pay --dry-run` requires a configured account but does not sign. Catalog queries need neither a wallet nor a password. Actual payments need the master password through a secure input source.

## Should I retry a failed payment?

Inspect `paymentStatus`, the transaction hash, and `retryPayment` first. Do not repeat payment when its status is `unknown` or `retryPayment: false`. For a paid recharge with unconfirmed credit, reconcile the original transaction with `bai report-recharge`.

## Does the Skill installer install the CLI?

`npx skills add` installs Skill definitions only. Install the CLI separately and match the selected Skill's dependency version. See the [Skills quick start](/McpServer-Skills/SKILLS/QuickStart/).
