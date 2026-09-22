---
title: "Quickstart for AI Agents"
description: "Set up agent payments through wallet-cli 4.14."
---

# Quickstart for AI Agents

Use **wallet-cli 4.14.0** for new payment integrations; do not install the standalone x402-cli. wallet-cli manages the account and signing, while the agent selects commands, previews payments, and interprets results.

1. Follow the [Wallet CLI quick start](/x402/cli/quickstart/), configure an account locally, and verify its address.
2. If using a Skill, follow the [Skills quick start](/McpServer-Skills/SKILLS/QuickStart/) and match its dependency version to the CLI.
3. Discover an endpoint through the [API Catalog](/x402/api-catalog/get-started/), then preview it with `wallet-cli x402 pay --dry-run`.
4. Show the network, recipient, token, amount, and fees. Sign only within the user's authorization, using an approved secure password source.
5. Inspect structured results and retain the transaction hash. Submission or unconfirmed credit does not mean the entire operation completed.

Example agent request:

> Use wallet-cli 4.14 to inspect DIA's BTC quotation endpoint. Preview the TRON mainnet USDT payment with a 0.01 cap. Do not pay.

Never print private keys or master passwords into chat, logs, or command arguments. Do not use `echo` to reveal a private key as a setup check. Use a testnet endpoint you control for test payments; production catalog services may support mainnet only.

On `paymentStatus: "unknown"` or `retryPayment: false`, reconcile the original transaction rather than allowing an automatic repeat payment.

- [Command reference](/x402/cli/command-reference/)
- [Build an x402 service](/x402/getting-started/quickstart-for-sellers/)
- [x402 SDK](/x402/sdk-features/)

{/* Preserve bookmarks to sections replaced by the wallet-cli migration guidance. */}
<span id="prerequisites"></span>
<span id="1-create-a-dedicated-agent-wallet"></span>
<span id="step-1-configure-your-private-key"></span>
<span id="step-2-install-the-x402-payment-skill"></span>
<span id="quick-auto-install-recommended"></span>
<span id="interactive-installation"></span>
<span id="step-3-test-autonomous-payment"></span>
<span id="31-test-with-a-paid-endpoint"></span>
<span id="32-verify-the-payment-on-chain"></span>
<span id="security-best-practices"></span>
<span id="troubleshooting"></span>
<span id="next-steps"></span>
<span id="references"></span>
