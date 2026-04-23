# Quick Start

Want your AI client to gain BANK OF AI's on-chain capabilities? Just **two steps**, under **1 minute**:

1. **Paste the install command** → AI installs every Skill, checks wallet status, and asks whether to create a wallet
2. **Confirm wallet creation** → AI automatically creates your local encrypted wallet

---

## Step 1: Paste the Install Command

Open whichever AI client you use (OpenClaw / Claude Code / Cursor / Codex / etc.) and paste this command in:

```
Run npx skills add BofAI/skills to install every BANK OF AI Skill. After the install completes, run bankofai-guide to walk me through the next steps.
Note: please install into this Agent's own skills directory.
```

The AI will install the Skills and then ask whether to create a wallet.

<details>
<summary>Show example AI output</summary>

> Got it — here we go.
>
> The command enters interactive mode to let me pick the Skills: I'll use the `-y` flag (without `-g`) so it selects everything by default and installs into this Agent's directory:
>
> ✅ **11 Skills installed.** (installed into this Agent's skills directory)
>
> Now running `bankofai-guide` to walk you through setup…
>
> ───
>
> **📋 Section A — Post-install Onboarding**
> - Step 1: Install Agent Wallet CLI
> - Step 2: Check wallet status
>
> ───
>
> ✅ **Skills installed.**
> Location: `~/.openclaw/workspace/.agents/skills/` (this Agent's directory)
>
> | # | Skill |
> | :-- | :-- |
> | 1 | `agent-wallet` |
> | 2 | `bankofai-guide` |
> | 3 | `multi-sig-account-permissions` |
> | 4 | `recharge-skill` |
> | 5 | `sunperp-perpetual-futures-trading` |
> | 6 | `sunswap-dex-trading` |
> | 7 | `trc20-token-toolkit` |
> | 8 | `tronscan-data-lookup` |
> | 9 | `trx-staking-sr-voting` |
> | 10 | `usdd-just-protocol` |
> | 11 | `x402-payment` |
>
> **📋 Current status**
>
> | Component | Status |
> | :-- | :-- |
> | Agent Wallet CLI | ✅ Installed |
> | Wallet | ⚠️ Not configured |
>
> **💼 Wallet setup**
>
> Note: you need a wallet for transfers and transactions (token swaps, transfers, balance checks, etc.).
>
> **Set up a wallet now?**
>
> **A. Create now (recommended, ~10 seconds)**
> - Quick setup, secure password auto-generated
> - Ready to use every BANK OF AI feature right after creation
>
> **B. Create later**
> - You can run `bankofai-guide` again any time to continue setup
> - Until then, only read-only query features are available
>
> Please reply **A** or **B**.

</details>

---

## Step 2: Confirm Wallet Creation

Confirm wallet creation however the AI prompts you (e.g. reply "create", "go ahead", or whichever option the AI offers). The AI will create your local encrypted wallet and, in one message, show your wallet info, addresses, master password, and suggested next steps.

<details>
<summary>Show example AI output</summary>

> Got it — running quick-setup wallet creation.
>
> - Step 1: Generate a secure password
> - Step 2: Create the wallet
> - Step 3: Fetch the wallet address
>
> ───
>
> **🎉 Wallet created.**
>
> **💼 Wallet info**
>
> | Field | Detail |
> | :-- | :-- |
> | Wallet ID | `default_local_secure` |
> | Type | `local_secure` (locally encrypted) |
> | Status | ✅ Active |
>
> **📍 Wallet addresses**
>
> | Network | Address |
> | :-- | :-- |
> | EVM | `0x7858...4bCA` |
> | TRON | `TLwYeH...q8usz` |
>
> 💡 **Tip**: the EVM address works across every EVM-compatible chain (Ethereum, BSC, Base, Polygon, Arbitrum, etc.).
>
> ───
>
> **🔐 Wallet password**
>
> ```
> <your unique master password is shown here>
> ```
>
> **⚠️ Important safety notes:**
> - This password encrypts the locally-stored private key
> - Every transaction, signature, or address query needs this password
> - It's auto-saved to `~/.agent-wallet/runtime_secrets.json` for convenience
> - **Please back it up!** If the runtime secrets file is deleted, this password is the only way to recover the wallet
>
> ───
>
> **🚀 Next steps**
>
> Your wallet is ready. You can now:
>
> 1. **Top up USDT** → send USDT (TRC20) to your TRON address `TLwYeH...q8usz`
> 2. **Check balance** → use TronScan to view TRX and token balances
> 3. **Transfer / swap** → use SunSwap for token swaps or transfers
>
> **Onboarding complete. 🎉**
>
> Want me to check a balance or do anything else?

</details>

---

## Verify the Install

Open your AI chat and send:

```
Check the TRX and USDT balances of the wallet address you just created.
```

If the AI returns the balance — **congrats, the full stack is live and ready to use.**

:::note What a brand-new wallet may show
A TRON address that has never received any transfer is considered **not activated**, so the query may report **balance 0 / account not activated**. This is completely normal for a fresh wallet and doesn't prevent you from using BANK OF AI.
:::

---

## What Else Can You Do?

Just describe what you want in plain language:

### 🔍 On-chain Data Lookup (Free)

> "What happened in transaction abc123…?"

> "What's TRON's current network TPS?"

### 💸 TRC20 Token Transfer

> "Send 10 USDT to TRecipientAddress…"

### 🔁 SunSwap Swaps

> "On Nile testnet, swap 100 TRX for USDT with 1% slippage."

### 📈 SunPerp Futures

> "Open a 5x long on BTC-USDT with a 5% stop-loss."

### 🗳️ TRX Staking & SR Voting

> "Stake my 1,000 TRX with super representative SR XXX."



---

## A Few Reminders

:::warning Three Rules for Beginners · On-chain transactions are irreversible
1. **Always practice on testnet first.** Run 1–2 transactions on Nile testnet, confirm the AI behaves exactly as expected, *then* switch to mainnet.
2. **Review the AI's bill before every spending action.**
3. **Start small.** Even for operations you've tested, use a small amount the first time you run them on mainnet.
:::

:::caution The master password is critical — back it up immediately
The master password is shown **exactly once in Step 2**. It's auto-saved to `~/.agent-wallet/runtime_secrets.json` locally, but we strongly recommend **also saving it manually in a password manager** (1Password / Bitwarden / etc.). If the local file is ever lost or corrupted *and* you have no external backup, your wallet becomes **permanently unrecoverable** (no recovery mechanism, no support, no backdoors).

⚠️ **Never** paste this password into chat tools, emails, screenshots, or public repos.
:::

:::info If you skip wallet creation in Step 2
The AI skips wallet creation. When you're ready, you can trigger **conversational wallet creation** right in the AI chat at any time — no need to re-run the install command. See [Agent-Wallet Quick Start · Option 1: Conversational Creation](../Agent-Wallet/QuickStart.md).
:::

:::tip Want to use the other products independently, or self-host?
**The full BANK OF AI product matrix is more than Skills.** To use the other products independently or to self-host the lower layers, see:

- **LLM Service** (model-access layer): use BANKOFAI APP directly, or connect to the unified API Gateway → [LLM Service Introduction](../llmservice/introduction.md)
- **x402 Payment** (payment protocol): let AI auto-settle micropayments on-chain → [x402 Protocol Introduction](../x402/index.md)
- **8004 Protocol** (identity + reputation): on-chain reputation lookup for Agents → [8004 Protocol Introduction](../8004/general.md)
- **MCP Server local private deployment**: Skills call MCP Server through BANK OF AI's official cloud endpoints by default — no separate install needed. For local deployment, see [TRON MCP — Local Private Deployment](../McpServer-Skills/MCP/TRONMCPServer/LocalPrivatizedDeployment.md) · [SUN MCP — Local Private Deployment](../McpServer-Skills/MCP/SUNMCPServer/LocalPrivatizedDeployment.md) · [BSC MCP — Installation](../McpServer-Skills/MCP/BSCMCPServer/Installation.md)
- **SUN CLI**: a command-line tool with capabilities equivalent to SUN MCP Server, for scripting / automation / CI-CD → [SUN CLI Quick Start](../McpServer-Skills/Tools/SUNCli/QuickStart.md)
:::

---

## What's Next

| I want to… | Go here |
| :--- | :--- |
| Understand the full architecture | [BANK OF AI Introduction](./Intro.md) |
| Dive into a specific component | [Agent-Wallet](../Agent-Wallet/Intro.md) · [MCP Server](../McpServer-Skills/MCP/Intro.md) · [Skills](../McpServer-Skills/SKILLS/Intro.md) · [x402](../x402/index.md) · [8004](../8004/general.md) · [LLM Service](../llmservice/introduction.md) |
