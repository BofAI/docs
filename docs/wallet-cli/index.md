---
title: "Wallet CLI and x402"
description: "Use wallet-cli 4.14.0 for payments and service discovery."
---

# Wallet CLI and x402

The standalone `@bankofai/x402-cli` is being retired. Use **`@tron-walletcli/wallet-cli@4.14.0`** for new command-line integrations.

| Task | Entry point |
| --- | --- |
| Pay a protected HTTP API | `wallet-cli x402 pay` |
| Test a local paywall | `wallet-cli x402 serve`, `wallet-cli x402 roundtrip` |
| Browse providers and endpoints | `wallet-cli x402 provider-list`, `provider-show`, `endpoint-list` |
| Refresh the catalog cache | `wallet-cli x402 update-catalog` |
| B.AI recharge and records | `wallet-cli bai recharge`, `recharge-orders` |
| Gateway deployment, configuration and catalog builds | [Gateway guide](/x402/core-concepts/gateway/) and [Catalog guide](/x402/api-catalog/) |

Configure and select accounts through wallet-cli. An agent-wallet configuration does not automatically become a wallet-cli account. Use decimal CAIP-2 network IDs for the CLI: Nile `tron:3448148188`, TRON mainnet `tron:728126428`, BSC `eip155:56`, and Base `eip155:8453`. Protocol documentation can use hexadecimal TRON IDs; do not substitute those into CLI examples.

- [Quick start](/wallet-cli/quickstart/)
- [Command reference and migration](/wallet-cli/command-reference/)
- [FAQ](/wallet-cli/faq/)
- [Agent payment setup](/x402/getting-started/quickstart-for-agent/)
