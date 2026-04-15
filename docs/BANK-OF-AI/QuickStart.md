# Quick Start

**One sentence**, less than **1 minute**, and the entire BANK OF AI stack is installed on your machine — Agent-Wallet, MCP Servers, Skills, all in place, with 9 mainstream AI clients configured automatically.

:::tip Things You Don't Have to Do
- ❌ No manual `npm install` for a dozen packages
- ❌ No installing Agent-Wallet / Skills / MCP Servers separately
- ❌ No configuring Cursor / Claude Code / VS Code one by one
- ❌ No technical knowledge required
:::

---

## The Only Step: Say One Sentence to Your AI

Open whichever AI client you're using (OpenClaw / Claude Code / Cursor / Codex / any of them) and send it this sentence:

```
agent install everything
```

Press Enter. **That's it — your part is done.**

The AI takes over the entire installation flow from here. You just sit back and watch it set everything up.

When it finishes, the AI prints an "Installed Components" summary so you can confirm everything is in place:

```
🎉 Agent install complete!
✅ Components installed
```

| Component | Status | Location |
| :--- | :--- | :--- |
| BankOfAI Skills | ✅ Installed | `~/.agents/skills/` |
| Agent Wallet CLI | ✅ Installed | Global npm |
| TRON MCP Server | ✅ Installed | 9 Agents |
| SUN MCP Server | ✅ Installed | 9 Agents |

---

## What the AI Does Behind the Scenes

So you know what's happening, here's everything the AI completes for you in that one minute:

### Step 1: Install BANK OF AI Skills

```
✅ BankOfAI Skills installed successfully!
```

| Skill | Function |
| :--- | :--- |
| `agent-wallet` | Wallet management |
| `bankofai-guide` | Onboarding guide |
| `multi-sig-account-permissions` | TRON multi-sig |
| `recharge-skill` | BANK OF AI top-up |
| `sunperp-perpetual-futures-trading` | SunPerp futures |
| `sunswap-dex-trading` | SunSwap DEX |
| `trc20-token-toolkit` | TRC20 toolkit |
| `tronscan-data-lookup` | TronScan lookup |
| `trx-staking-sr-voting` | TRX staking & SR voting |
| `usdd-just-protocol` | USDD/JUST protocol |
| `x402-payment` | x402 payment |

### Step 2: Install Agent Wallet CLI and MCP Servers

```
Now installing Agent Wallet CLI and MCP Servers...
```

Agent Wallet CLI is installed globally via npm; TRON MCP Server and SUN MCP Server are wired into every available AI client.

### Step 3: Auto-Create the Local Encrypted Wallet

```
🧰 Wallet Information
```

| Field | Detail |
| :--- | :--- |
| Wallet ID | `default_local_secure` |
| Type | `local_secure` |
| Status | ✅ Active |

| Network | Address |
| :--- | :--- |
| EVM | `0x1339...8366` |
| TRON | `TBisAp...FLceY` |

Right after that, the AI displays your unique **master password** in the terminal — **only this one time**:

```
🔒 Wallet Password
<your unique master password is shown here>
⚠️ Password auto-saved to ~/.agent-wallet/runtime_secrets.json — please back it up!
```

:::caution The master password is critical — back it up immediately
The master password is the **only credential** that unlocks your private key. The installer does two things:
1. **Auto-saves it to a local file** `~/.agent-wallet/runtime_secrets.json` so subsequent tools can read it directly
2. **Displays it in plaintext once in your terminal** — copy it down right away

We strongly recommend **also saving it manually to a password manager** (1Password / Bitwarden / etc.). If the local file is ever lost or corrupted *and* you have no external backup, your wallet becomes **permanently unrecoverable** (no recovery mechanism, no support, no backdoors).

⚠️ **Never** paste this password into chat tools, emails, screenshots, or public repos.
:::

### Step 4: Configure MCP Servers

```
🔧 MCP Servers
```

| Server | URL | Status |
| :--- | :--- | :--- |
| TRON MCP | `https://tron-mcp-server.bankofai.io/mcp` | ✅ |
| SUN MCP | `https://sun-mcp-server.bankofai.io/mcp` | ✅ |

:::info Connected to the official cloud service by default
The two URLs above are the **official cloud endpoints** hosted by BANK OF AI — ready to use out of the box, no self-hosting required. If you need a local private deployment (e.g. for data-isolation requirements), see [TRON MCP — Local Private Deployment](../McpServer-Skills/MCP/TRONMCPServer/LocalPrivatizedDeployment.md) and [SUN MCP — Local Private Deployment](../McpServer-Skills/MCP/SUNMCPServer/LocalPrivatizedDeployment.md).
:::

### Step 5: Sync to All AI Clients

**Configured across 9 Agents:** Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot CLI, MCPorter, OpenCode, VS Code, Zed.

If any of these is installed on your machine, it's wired up automatically — just open it and go, no extra setup needed.

---

## Now What Can You Do?

With the full stack in place, your AI instantly gains these capabilities — just talk to it in plain English:

### 🔍 On-chain Data Lookup (Free)

> "Check the TRX and USDT balances of my wallet."

> "What happened in transaction abc123...?"

> "What's TRON's current network TPS?"

### 💸 TRC20 Token Transfer

> "Send 10 USDT to TRecipientAddress..."

### 🔁 SunSwap Swaps

> "On Nile testnet, swap 100 TRX for USDT with 1% slippage."

### 📈 SunPerp Futures Trading

> "Open a 5x long on BTC-USDT with a 5% stop-loss."

### 🗳️ TRX Staking & SR Voting

> "Stake my 1000 TRX with super representative SR XXX."

### 💰 Top Up BANK OF AI Account

> "Check my BANK OF AI balance and top up 5 USDT."

---

## Verify the Install

Open your AI chat and ask:

```
What BANK OF AI Skills do I have installed?
```

If the AI can list every skill name — **congrats, the whole stack is live and ready to use.**

---

## Three Rules for Beginners

:::warning On-chain transactions are irreversible — remember these three rules
1. **Always practice on testnet first.** Run 1-2 transactions on Nile testnet, confirm the AI behaves exactly as expected, *then* go to mainnet.
2. **Carefully review the bill before every spending action.**
3. **Start small.** Even for operations you've already tested, use a small amount the first time you run them on mainnet to verify behavior.
:::

---

## What's Next

| I want to… | Go here |
| :--- | :--- |
| Understand the full architecture | [BANK OF AI Introduction](./Intro.md) |
| Dive into a specific component | [Agent-Wallet](../Agent-Wallet/Intro.md) · [MCP Server](../McpServer-Skills/MCP/Intro.md) · [Skills](../McpServer-Skills/SKILLS/Intro.md) · [x402](../x402/index.md) · [8004](../8004/general.md) · [LLM Service](../llmservice/introduction.md) |
