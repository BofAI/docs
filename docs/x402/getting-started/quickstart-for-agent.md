---
title: 'Quickstart for Agent'
description: 'Enable AI agents to make autonomous payments on TRON blockchain using the x402-payment-tron skill.'
---

x402-tron is designed for the Agentic Web. AI agents can autonomously negotiate and pay for resources using the `x402-payment-tron` skill.

This skill enables agents to:

- Detect `402 Payment Required` responses
- Sign TIP-712 payment authorizations automatically
- Manage wallet balances and handle the payment flow

---

## Configuration

Configure your agent's wallet credentials via environment variables:

```bash
export TRON_PRIVATE_KEY="your_private_key_here"
export TRON_GRID_API_KEY="your_trongrid_api_key_here"  # Recommended to avoid RPC rate limits
```

## Installation

Add the [x402-payment-tron](https://github.com/bankofai/skills-tron/tree/main/x402_tron_payment) skill to your agentic tools:

| Tool         | Installation                                   |
| ------------ | ---------------------------------------------- |
| **OpenClaw** | `npx clawhub install x402-payment-tron`        |
| **opencode** | Copy the skill to `.opencode/skill/` directory |

## Try It Out

Instruct your agent to access `https://x402-tron-demo.bankofai.io/protected-nile`. The agent will automatically detect the payment requirement, sign the authorization, and retrieve the protected resource.

## Security Best Practices

- **Limit wallet balance** — Only fund the agent wallet with what it needs for operations
- **Test on Nile first** — Validate your integration on testnet before mainnet deployment
- **Monitor transactions** — Track agent spending on [TronScan](https://tronscan.org)
- **Secure credentials** — Store private keys using secure environment management

---

## Next Steps

- [Set up a paid API](./quickstart-for-sellers.md) for agents to consume
- [Learn about HTTP 402](../core-concepts/http-402.md) payment protocol

## References

- [OpenClaw Extension](https://github.com/bankofai/openclaw-extension)
- [x402-payment-tron on ClawHub](https://github.com/bankofai/skills-tron/tree/main/x402_tron_payment)
- [x402-tron Demo](https://github.com/open-bankofai/x402-tron-demo)
