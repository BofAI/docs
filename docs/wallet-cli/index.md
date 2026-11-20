---
title: "Wallet CLI and x402"
description: "Use wallet-cli for x402 payments."
---

# Wallet CLI and x402

Use **`@tron-walletcli/wallet-cli@4.16.0`** for new command-line integrations.

As of 2026-11-12, this is the npm `latest` release and declares **TronWeb 6.5.1** as an exact dependency. It does not automatically install TronWeb 6.5.2. The wallet-cli Skill has its own CLI version pin; follow the [Skills quick start](/McpServer-Skills/SKILLS/QuickStart/) when using that Skill.

| Task | Entry point |
| --- | --- |
| Pay a protected HTTP API | `wallet-cli x402 pay` |
| Test a local paywall | `wallet-cli x402 serve`, `wallet-cli x402 roundtrip` |
| B.AI recharge and records | `wallet-cli bai recharge`, `recharge-orders` |

Configure and select accounts through wallet-cli. An agent-wallet configuration does not automatically become a wallet-cli account. Use decimal CAIP-2 network IDs for the CLI: Nile `tron:3448148188`, TRON mainnet `tron:728126428`, BSC `eip155:56`, and Base `eip155:8453`. Protocol documentation can use hexadecimal TRON IDs; do not substitute those into CLI examples.

- [Quick start](/wallet-cli/quickstart/)
- [Command reference](/wallet-cli/command-reference/)
- [FAQ](/wallet-cli/faq/)
- [Agent payment setup](/x402/getting-started/quickstart-for-agent/)
