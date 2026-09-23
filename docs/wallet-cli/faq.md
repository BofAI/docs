---
title: "Wallet CLI FAQ"
description: "Installation, wallet, and payment migration questions for wallet-cli 4.14."
---

# Wallet CLI FAQ

## Do I still install standalone x402-cli?

No. Use `@tron-walletcli/wallet-cli@4.14.0` for new integrations; follow the [quick start](/wallet-cli/quickstart/).

## Can I reuse an agent-wallet configuration?

Do not assume the account stores are interchangeable. Configure wallet-cli locally and verify its payer address. Existing SDK and server integrations using the agent-wallet adapter remain separate from this CLI migration.

## Does a preview need a wallet?

`x402 pay --dry-run` requires a configured account but does not sign. Catalog queries need neither a wallet nor a password. Actual payments need the master password through a secure input source.

## Should I retry a failed payment?

Inspect `paymentStatus`, the transaction hash, and `retryPayment` first. Do not repeat payment when its status is `unknown` or `retryPayment: false`. For a paid recharge with unconfirmed credit, reconcile the original transaction with `bai report-recharge`.

## What replaces Gateway and Catalog commands?

Use the [migration table](/wallet-cli/command-reference/). Provider discovery uses `x402 provider-list`, `provider-show`, and `endpoint-list`; old deployment, export, and build commands are not direct substitutions.

## Does the Skill installer install the CLI?

`npx skills add` installs Skill definitions only. Install the CLI separately and match the selected Skill's dependency version. See the [Skills quick start](/McpServer-Skills/SKILLS/QuickStart/).
