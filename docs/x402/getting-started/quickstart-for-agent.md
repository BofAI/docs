import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart for AI Agents

x402 is purpose-built for the Agentic Web. By installing the `x402-payment` skill, AI agents can **autonomously handle the full payment flow — detect payment requirements, sign authorizations, settle on-chain, and retrieve the protected resource** — with no human intervention required.

This guide walks you through: setting up a dedicated agent wallet, configuring credentials, installing the x402-payment skill, and verifying that your agent can complete payments autonomously.

---

:::info SDK (TypeScript-only)
x402 is a **TypeScript-only** SDK published as `@bankofai/x402-*` npm packages. The `x402-payment` skill wraps those packages and uses [Agent Wallet](../../Agent-Wallet/QuickStart.md) for key custody — the wallet/private-key setup in this guide is unchanged. The runnable [MCP examples](https://github.com/BofAI/x402/tree/main/examples/typescript) (`servers/mcp` + `clients/mcp`) are reference implementations.
:::

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

For BSC testnet, the default viem RPC endpoint is frequently unreachable. Set a reliable RPC:

```bash
export EVM_RPC_URL="https://bsc-testnet-rpc.publicnode.com"
```

</TabItem>
</Tabs>

> ⚠️ **Security reminder:** Keep your private key only in local environment variables or a `.env` file. **Never commit files containing private keys to Git or share them with anyone.**

---

## Step 2: Install the x402-payment Skill

### Quick Auto-Install (Recommended)

Run the following command to install all BANK OF AI Skills (including x402-payment) at once:

```bash
npx skills add https://github.com/BofAI/skills -y
```

The `-y` flag skips all interactive prompts and installs all available Skills by default. The installer auto-detects AI tools on your computer (Cursor, Claude Code, Cline, OpenCode, etc.) and copies the skills into the correct directories.

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

### 3.1 Test with a Paid Endpoint

Point your agent at an x402-protected endpoint built with the published npm packages, for example a service created from [Quickstart for Sellers](./quickstart-for-sellers.md).

If you do not have a paid endpoint yet, you can run the repository examples as a local reference environment (requires **Node.js 22+** and **pnpm 11.1+**):

```bash
git clone https://github.com/BofAI/x402.git
cd x402/typescript            # the pnpm/turbo monorepo root (SDK packages)

# Install + link the SDK packages, then build their dist
pnpm install
pnpm build

# Examples live in a separate workspace at the repo root
cd ../examples/typescript
pnpm install                  # installs the reference example dependencies
cp .env-exact.example .env-exact   # fill AGENT_WALLET_PRIVATE_KEY + payout addresses
```

Then start the reference facilitator and resource server **in two separate terminals** (both from `examples/typescript`):

```bash
# Terminal 1 — facilitator (verifies + settles on-chain)
pnpm dev:facilitator          # http://localhost:4022

# Terminal 2 — resource server (sells GET /weather behind 402)
pnpm dev:server               # http://localhost:4021
```

Once both are running, instruct your agent to access `http://localhost:4021/weather`.

**The agent should automatically complete the following flow (no human intervention required):**

1. Send a GET request to the endpoint
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
| Agent accesses successfully but balance doesn't change | May have accessed a free endpoint | Confirm the URL path is `/weather` (the paid route), not another path |

---

## Next Steps

- [Build a Paid API](./quickstart-for-sellers.md) — Set up a paid API service that your AI agent can call
- [Understand HTTP 402](../core-concepts/http-402.md) — Deep dive into how x402 works
- [Supported Networks & Tokens](../core-concepts/network-and-token-support.md) — View supported chains and tokens

---

## References

- [x402 repository](https://github.com/BofAI/x402) — SDK source and runnable examples (`examples/typescript/`)
- [MCP examples](https://github.com/BofAI/x402/tree/main/examples/typescript/clients/mcp) — agent payments over MCP transport
- [OpenClaw Extension Repository](https://github.com/BofAI/openclaw-extension)
- [x402-payment on ClawHub](https://github.com/BofAI/skills/tree/main/x402-payment)
