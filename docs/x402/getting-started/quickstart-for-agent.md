import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart for AI Agents

x402 is purpose-built for the Agentic Web. AI agents can autonomously negotiate and pay for protected resources using the `x402-payment` skill.

This skill enables agents to:

- Detect `402 Payment Required` responses
- Automatically sign payment authorizations
- Manage wallet balances and execute settlement flows programmatically

---

## Configuration

Configure your agent wallet credentials using environment variables.

<Tabs>
<TabItem value="TRON" label="TRON">

```bash
export TRON_PRIVATE_KEY="your_private_key_here"
export TRON_GRID_API_KEY="your_trongrid_api_key_here"  # Recommended to avoid RPC rate limits
```

</TabItem>
<TabItem value="BSC" label="BSC">

```bash
export BSC_PRIVATE_KEY="your_private_key_here"
```

</TabItem>
</Tabs>

## Installation

Add the [x402-payment](https://github.com/BofAI/skills/tree/main/x402-payment) skill to your Agent toolchain:

| Platform     | Installation Method                                        |
| ------------ | ---------------------------------------------------------- |
| **OpenClaw** | `npx clawhub install x402-payment`                         |
| **opencode** | Copy the skill files into the `.opencode/skill/` directory |

---

## Quick Test

Instruct your Agent to access: `https://x402-demo.bankofai.io/protected-nile`.
The Agent will automatically detect the payment requirement, sign the authorization payload, complete settlement, and retrieve the protected resource.

---

## Security Best Practices

- **Limit wallet balance** — Fund the Agent wallet only with the amount required for daily operations.
- **Test on Nile first** — Always validate your integration on testnet before deploying to mainnet.
- **Monitor transactions** — Track Agent spending via [TronScan](https://tronscan.org) or [BscScan](https://bscscan.com).
- **Protect credentials** — Store private keys securely using environment variables or a secret manager. Never hardcode them.

---

## Next Steps

- [Build a Paid API](./quickstart-for-sellers.md) for Agents to consume
- [Understand HTTP 402](../core-concepts/http-402.md) payment protocol

---

## References

- [OpenClaw Extension Repository](https://github.com/BofAI/openclaw-extension)
- [x402-payment on ClawHub](https://github.com/BofAI/skills/tree/main/x402-payment)
- [x402 Demo Project](https://github.com/BofAI/x402-demo)
