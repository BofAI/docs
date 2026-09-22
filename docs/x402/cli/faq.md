---
title: "Wallet CLI FAQ"
description: "Installation, wallet, and payment migration questions for wallet-cli 4.14."
---

# Wallet CLI FAQ

## Do I still install standalone x402-cli?

No. Use `@tron-walletcli/wallet-cli@4.14.0` for new integrations; follow the [quick start](/x402/cli/quickstart/). Old page URLs remain available as migration guidance.

## Can I reuse an agent-wallet configuration?

Do not assume the account stores are interchangeable. Configure wallet-cli locally and verify its payer address. Existing SDK and server integrations using the agent-wallet adapter remain separate from this CLI migration.

## Does a preview need a wallet?

`x402 pay --dry-run` requires a configured account but does not sign. Catalog queries need neither a wallet nor a password. Actual payments need the master password through a secure input source.

## Should I retry a failed payment?

Inspect `paymentStatus`, the transaction hash, and `retryPayment` first. Do not repeat payment when its status is `unknown` or `retryPayment: false`. For a paid recharge with unconfirmed credit, reconcile the original transaction with `bai report-recharge`.

## What replaces Gateway and Catalog commands?

Use the [migration table](/x402/cli/command-reference/). Provider discovery uses `x402 provider-list`, `provider-show`, and `endpoint-list`; old deployment, export, and build commands are not direct substitutions.

## Does the Skill installer install the CLI?

`npx skills add` installs Skill definitions only. Install the CLI separately and match the selected Skill's dependency version. See the [Skills quick start](/McpServer-Skills/SKILLS/QuickStart/).

{/* Preserve bookmarks to sections replaced by the wallet-cli migration guidance. */}
<span id="installation--setup"></span>
<span id="what-are-the-system-requirements"></span>
<span id="how-do-i-update-the-cli"></span>
<span id="can-i-run-it-without-installing-globally"></span>
<span id="wallets--payments"></span>
<span id="do-i-need-a-wallet-to-use-the-cli"></span>
<span id="how-does-the-cli-choose-which-wallet-to-sign-with"></span>
<span id="can-i-still-use-a-raw-private-key"></span>
<span id="will-a-payment-ever-spend-more-than-i-expect"></span>
<span id="which-networks-and-tokens-are-supported"></span>
<span id="how-is-paying-on-base-different"></span>
<span id="can-i-pay-without-holding-trx"></span>
<span id="understanding-errors"></span>
<span id="402-response-missing-payment-required-header"></span>
<span id="no-matching-payment-requirement"></span>
<span id="the-gateway"></span>
<span id="gateway-start-says-the-runtime-isnt-found"></span>
<span id="how-do-i-validate-my-provider-files-before-deploying"></span>
<span id="the-catalog"></span>
<span id="where-does-catalog-read-from-by-default"></span>
<span id="how-do-i-make-search-faster-or-work-offline"></span>
<span id="output--scripting"></span>
<span id="how-do-i-get-machine-readable-output"></span>
<span id="what-do-the-exit-codes-mean"></span>
<span id="still-stuck"></span>
