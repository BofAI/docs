# Quick Start

Want your AI client to gain BANK OF AI's on-chain capabilities? Just **two steps**, under **1 minute**:

1. **Paste the install command** → AI installs every Skill, checks wallet status, and asks whether to create a wallet
2. **Reply with `A`** → AI automatically creates your local encrypted wallet

:::tip This doc only covers the "Tool Layer" path
**The full BANK OF AI product matrix is more than Skills.** To use the other products independently or to self-host the lower layers, see:

- **LLM Service** (model-access layer): use BANKOFAI APP directly, or connect to the unified API Gateway → [LLM Service Introduction](../llmservice/introduction.md)
- **x402 Payment** (payment protocol): let AI auto-settle micropayments on-chain → [x402 Protocol Introduction](../x402/index.md)
- **8004 Protocol** (identity + reputation): on-chain reputation lookup for Agents → [8004 Protocol Introduction](../8004/general.md)
- **MCP Server local private deployment**: Skills call MCP Server through BANK OF AI's official cloud endpoints by default — no separate install needed. For local deployment, see [TRON MCP — Local Private Deployment](../McpServer-Skills/MCP/TRONMCPServer/LocalPrivatizedDeployment.md) · [SUN MCP — Local Private Deployment](../McpServer-Skills/MCP/SUNMCPServer/LocalPrivatizedDeployment.md) · [BSC MCP — Installation](../McpServer-Skills/MCP/BSCMCPServer/Installation.md)
- **SUN CLI**: a command-line tool with capabilities equivalent to SUN MCP Server, for scripting / automation / CI-CD → [SUN CLI Quick Start](../McpServer-Skills/Tools/SUNCli/QuickStart.md)
:::

---

## Step 1: Paste the Install Command

### What You Type

Open whichever AI client you use (OpenClaw / Claude Code / Cursor / Codex / any of them) and paste this command in:

```
Run npx skills add BofAI/skills to install every BANK OF AI Skill. After the install completes, run bankofai-guide to walk me through the next steps.
Note: please install into this Agent's own skills directory.
```

:::tip You can also send this via Telegram
If you've already wired Telegram into OpenClaw, send the same command in your Telegram chat — the result is identical to pasting it into the desktop client.
:::

### What the AI Outputs

The AI takes over the whole flow — installs the Skills, runs `bankofai-guide` to check your environment, prints a summary, and asks whether to create a wallet:

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
> - Ready to use every BankOfAI feature right after creation
>
> **B. Create later**
> - You can run `bankofai-guide` again any time to continue setup
> - Until then, only read-only query features are available
>
> Please reply **A** or **B**.

---

## Step 2: Reply with `A`

### What You Type

In the AI chat, type:

```
A
```

:::info If you chose `B`
The AI skips wallet creation and this step ends. When you're ready, you can trigger **conversational wallet creation** right in the AI chat at any time — no need to re-run the install command. See [Agent-Wallet Quick Start · Option 1: Conversational Creation](../Agent-Wallet/QuickStart.md).
:::

### What the AI Outputs

The AI walks through the full wallet-creation flow and, at the end, shows your wallet info, addresses, master password, and suggested next steps — all in one message:

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

:::caution The master password is critical — back it up immediately
The master password is shown **exactly once** here. It's auto-saved to `~/.agent-wallet/runtime_secrets.json` locally, but we strongly recommend **also saving it manually in a password manager** (1Password / Bitwarden / etc.). If the local file is ever lost or corrupted *and* you have no external backup, your wallet becomes **permanently unrecoverable** (no recovery mechanism, no support, no backdoors).

⚠️ **Never** paste this password into chat tools, emails, screenshots, or public repos.
:::

---

## Verify the Install

Open your AI chat and send:

```
Which BANK OF AI Skills do I have installed right now?
```

If the AI can list every Skill by name — **congrats, the full stack is live and ready to use.**

---

## Typical Scenarios

Here's one scenario showing AI and on-chain infrastructure collaborating **through natural conversation** to complete a complex task — the user says one sentence, the AI orchestrates via Skills, Agent Wallet signs locally, x402 settles the payment, and a structured result comes back.

### Top Up BANK OF AI Account (x402 auto-settlement)

**🧑 You:** Buy APIKEY Credits On BANK OF AI With USDT

**🤖 BANK OF AI Agent** (TRON Mainnet):

> BANK OF AI settles APIKEY top-ups via the **x402** protocol. This top-up package is **10 USDT (TRON network)** — I'll debit your wallet and credit the quota.
>
> ✅ **x402 payment of 10 USDT confirmed on TRON**
>
> Done! Your APIKEY balance is updated:
>
> | Item | Value |
> | :-- | :-- |
> | Service | BANK OF AI API |
> | Protocol | x402 |
> | Paid | 10 USDT |
> | Credits added | **+500,000** |
> | APIKEY quota | **750,000 credits** |

**🧑 You:** Check My USDT Balance

**🤖:** Your Current Balance: **4,692 USDT** (Mainnet)

**Products involved**: `recharge-skill` + `x402-payment` (Skills) → TRON MCP Server → Agent Wallet

:::tip What does this scenario illustrate?
- **Natural language is the operation** — from start to finish the user connected no wallet and touched no frontend
- **Skills handle orchestration** — the AI walks the SOP automatically: pay, sign, credit the quota
- **Agent Wallet handles security** — every signature happens locally and offline; the private key never leaves your machine
- **x402 engages on demand** — whenever payment is involved, x402 handles "pay-before-response" automatically
:::

---

## What Else Can You Do?

Just describe what you want in plain language:

### 🔍 On-chain Data Lookup (Free)

> "Check the TRX and USDT balances of my wallet."

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

## Three Rules for Beginners

:::warning On-chain transactions are irreversible — remember these three rules
1. **Always practice on testnet first.** Run 1–2 transactions on Nile testnet, confirm the AI behaves exactly as expected, *then* switch to mainnet.
2. **Review the AI's bill before every spending action.**
3. **Start small.** Even for operations you've tested, use a small amount the first time you run them on mainnet.
:::

---

## What's Next

| I want to… | Go here |
| :--- | :--- |
| Understand the full architecture | [BANK OF AI Introduction](./Intro.md) |
| Dive into a specific component | [Agent-Wallet](../Agent-Wallet/Intro.md) · [MCP Server](../McpServer-Skills/MCP/Intro.md) · [Skills](../McpServer-Skills/SKILLS/Intro.md) · [x402](../x402/index.md) · [8004](../8004/general.md) · [LLM Service](../llmservice/introduction.md) |
