import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart for AI Agents

x402 is purpose-built for the Agentic Web. By installing the `x402-payment` skill, AI agents can **autonomously handle the full payment flow — detect payment requirements, sign authorizations, settle on-chain, and retrieve the protected resource** — with no human intervention required.

This guide walks you through: setting up a dedicated agent wallet, configuring credentials, installing the x402-payment skill, and verifying that your agent can complete payments autonomously.

---

## Prerequisites

### 1. Create a Dedicated Agent Wallet

> ⚠️ **Important: Create a separate, dedicated wallet for your AI agent — do not use your personal main wallet.**
>
> Why: The agent wallet's private key must be stored in environment variables. Using a dedicated wallet limits the funds the agent can access, reducing potential risk.

<Tabs>
<TabItem value="TRON" label="TRON">

1. Install [TronLink wallet](https://www.tronlink.org/) (browser extension or mobile app)
2. Create a new wallet (choose "Create New Account") — **write down your mnemonic phrase on paper and keep it safe**
3. Copy your wallet address (starts with `T`)
4. Go to the [Nile Testnet Faucet](https://nileex.io/join/getJoinPage) to claim free test TRX and test USDT/USDD
5. Export your private key in TronLink: **Settings → Account Management → Export Private Key**, enter your password to confirm, then copy the key string

</TabItem>
<TabItem value="BSC" label="BSC">

1. Install [MetaMask wallet](https://metamask.io/) (browser extension)
2. Create a new account — **write down your mnemonic phrase on paper and keep it safe**
3. Copy your wallet address (starts with `0x`)
4. Go to the [BSC Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet) to claim free test BNB and test USDT
5. Export your private key in MetaMask: **Account Details → Export Private Key**, enter your password to confirm, then copy the key string

</TabItem>
</Tabs>

---

:::info Wallet Management
x402 SDK uses [Agent Wallet](../../Agent-Wallet/QuickStart.md) to resolve and manage wallet credentials. Agent Wallet is automatically installed as a dependency of x402. Private key resolution priority:
1. Encrypted wallet file (imported via the Agent Wallet CLI)
2. Environment variable `AGENT_WALLET_PRIVATE_KEY`

This guide uses the environment variable method.
:::

## Step 1: Configure Your Private Key

Configure your private key as an environment variable so the x402-payment skill can sign payments. Replace `your_agent_wallet_private_key_here` with the private key you exported in the Prerequisites step.

```bash
export AGENT_WALLET_PRIVATE_KEY="your_agent_wallet_private_key_here"
```

> 💡 **Tip:** To make this permanent across terminal sessions, add the line to your shell profile:
> ```bash
> echo 'export AGENT_WALLET_PRIVATE_KEY=your_key' >> ~/.zshrc   # for zsh (macOS default)
> echo 'export AGENT_WALLET_PRIVATE_KEY=your_key' >> ~/.bashrc  # for bash (Linux default)
> source ~/.zshrc   # or source ~/.bashrc — apply immediately without restarting the terminal
> ```

Verify the environment variable is set correctly:

```bash
echo $AGENT_WALLET_PRIVATE_KEY
```

> ✅ **Success indicator:** The terminal prints your private key string (not blank)

<Tabs>
<TabItem value="TRON" label="TRON">

**Optional:** For production TRON workloads, configure a TronGrid API Key:

```bash
export TRON_GRID_API_KEY="your_trongrid_api_key_here"
```

> 💡 **How to get a TronGrid API Key:** Register for free at [TronGrid](https://www.trongrid.io/), create an API Key, and paste it above.

:::note
When `TRON_GRID_API_KEY` is not set, requests may be rate-limited under heavy workloads. For production, set your own `TRON_GRID_API_KEY` to ensure reliability.
:::

</TabItem>
<TabItem value="BSC" label="BSC">

No additional configuration needed for BSC.

</TabItem>
</Tabs>

> ⚠️ **Security reminder:** Keep your private key only in local environment variables or a `.env` file. **Never commit files containing private keys to Git or share them with anyone.**

---

## Step 2: Install the x402-payment Skill

### Quick Auto-Install (Recommended)

Run the following command to install all BANK OF AI Skills (including x402-payment) at once:

```bash
npx skills add https://github.com/BofAI/skills -y -g
```

The `-y` flag skips all interactive prompts and installs all available Skills by default. The `-g` flag enables global installation (available across all projects). The installer auto-detects AI tools on your computer (Cursor, Claude Code, Cline, OpenCode, etc.) and copies the skills into the correct directories.

> ✅ **Success indicator:** Terminal shows `✓ x402-payment (copied)` along with other installed skills

### Interactive Installation

If you prefer to select specific skills or choose the installation scope:

```bash
npx skills add https://github.com/BofAI/skills
```

For a detailed walkthrough of the interactive installation process, see the [Skills Quick Start](../../McpServer-Skills/SKILLS/QuickStart.md).

---

## Step 3: Test Autonomous Payment

After completing the setup, follow these steps to verify your agent can complete payments autonomously:

### 3.1 Test with the Demo Endpoint

Instruct your AI agent to access the following demo URL (this is a test endpoint that requires payment):

```
https://x402-demo.bankofai.io/protected-nile
```

**The agent should automatically complete the following flow (no human intervention required):**

1. Send a GET request to the demo URL
2. Receive an HTTP 402 (Payment Required) response from the server
3. Read the payment requirements from the response headers (amount, network, recipient address)
4. Sign a payment authorization using the configured private key
5. Retry the request with the payment credential attached
6. Successfully retrieve the content and return it to you

### 3.2 Verify the Payment On-Chain

Confirm the transaction on a block explorer:

<Tabs>
<TabItem value="TRON" label="TRON (Nile Testnet)">

Go to the [Nile Testnet Explorer](https://nile.tronscan.org/), search for your agent wallet address, and check the recent transaction history. If you see a USDT or USDD transfer, the payment was successful.

</TabItem>
<TabItem value="BSC" label="BSC (Testnet)">

Go to the [BSC Testnet Explorer](https://testnet.bscscan.com/), search for your agent wallet address, and check the recent transaction history.

</TabItem>
</Tabs>

> ✅ **Success indicator:** The agent returns content in `{"data": "..."}` format, and the corresponding transaction appears on the block explorer

---

## Security Best Practices

Before deploying your agent to production, make sure to review the following:

- **Limit agent wallet balance** — Only deposit the amount needed for daily operations into the agent wallet. Set a cap to prevent large losses from unexpected or malicious calls.
- **Test on testnet first** — After every configuration change, do a full test on the Nile testnet (TRON) or BSC testnet before switching to mainnet.
- **Monitor transactions** — Regularly check the agent's spending on a block explorer ([TronScan](https://tronscan.org) / [BscScan](https://bscscan.com)) and respond quickly to any anomalies.
- **Protect private keys** — Use environment variables or a secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault) to store private keys. Never hardcode them in source code or config files.
- **Limit agent permissions** — The agent should only access the APIs it needs. Avoid granting excessive token approval amounts.

---

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Agent doesn't initiate payment, errors immediately | Skill not installed correctly | Re-run the installation command in Step 2 |
| `Private key not found` or signing fails | Environment variable not set or misconfigured | Re-run Step 1, and make sure you run the agent **in the same terminal session** |
| Insufficient balance error | No test tokens in the agent wallet | Go back to Prerequisites and claim test tokens from the faucet |
| Request times out | Network issue or RPC rate limiting | Configure `TRON_GRID_API_KEY` for better performance |
| Agent accesses successfully but balance doesn't change | May have accessed a free endpoint | Confirm the URL path is `/protected-nile`, not another path |

---

## Next Steps

- [Build a Paid API](./quickstart-for-sellers.md) — Set up a paid API service that your AI agent can call
- [Understand HTTP 402](../core-concepts/http-402.md) — Deep dive into how x402 works
- [Supported Networks & Tokens](../core-concepts/network-and-token-support.md) — View supported chains and tokens

---

## References

- [OpenClaw Extension Repository](https://github.com/BofAI/openclaw-extension)
- [x402-payment on ClawHub](https://github.com/BofAI/skills/tree/main/x402-payment)
- [x402 Demo Project](https://github.com/BofAI/x402-demo)
