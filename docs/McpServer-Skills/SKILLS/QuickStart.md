# Quick Start

Get your AI up and running with BANK OF AI SKILLS in **2 steps** and less than **1 minute**. No private keys, no configuration — just install and start talking.

---

:::tip Prerequisite
**Node.js is required** on the machine where the AI Agent runs (the Agent uses `npx` under the hood). If Node.js isn't installed yet, grab the LTS installer from [nodejs.org](https://nodejs.org) — install once, double-click and follow the prompts.
:::

## Step 1: Install the Skills

We provide three installation methods. **Pick the one that matches your level of comfort** — the conversational install is the easiest; the interactive install gives you the most control.

### Method 1: Conversational Install (Easiest)

If you're already using a Skills-compatible AI Agent (OpenClaw, a Telegram bot, web chat, or any client that supports running shell commands), you can install everything by **simply chatting with the AI** — no need to open a terminal yourself, no manual file copying.

**How it works:**

1. Open your AI Agent chat
2. Copy and paste the following prompt:

   ```
   Run npx skills add BofAI/skills to install all BANK OF AI skills. After installation, use bankofai-guide to guide subsequent operations.
   Note: Please install to the skill directory corresponding to the current Agent.
   ```

3. The AI handles the entire flow automatically:
   - Pulls the `BofAI/skills` repository
   - Detects your current Agent's skills directory (e.g. `~/.agents/skills/`)
   - Installs all 14 BANK OF AI skills: the 13 core skills (`agent-wallet`, `sunswap-dex-trading`, `sunpump-meme-token-toolkit`, `sunperp-perpetual-futures-trading`, `tronscan-data-lookup`, `trc20-token-toolkit`, `usdd-just-protocol`, `trx-staking-sr-voting`, `multi-sig-account-permissions`, `x402-payment`, `recharge-skill`, `twitter-digest`, `twitter-mcp`) plus `bankofai-guide` (the onboarding helper)

:::tip Why this is the recommended path for beginners
You don't need to know what `npx`, `npm`, or "global install" mean. The AI handles every step including selecting the right skills directory for your platform, installing the wallet CLI, and onboarding you to your first wallet.
:::

---

### Method 2: Quick Auto-Install (Command Line)

If you have Node.js installed and prefer the command line, simply tell your AI Agent to execute the following command:

```bash
npx skills add https://github.com/BofAI/skills -y
```

The `-y` flag skips all interactive prompts and installs all available Skills by default. Once complete, it will show ✅ Installation complete! along with the full list of installed Skills.

---

### Method 3: Interactive Install (Most Control)

If you want to choose which Skills to install and the installation scope, remove the `-y` flag:

```bash
npx skills add https://github.com/BofAI/skills
```

:::tip
This guide demonstrates the installation process using terminal commands as an example.
:::

#### Interactive Installation Walkthrough

The installer will guide you through a few steps — just follow along:

**1️⃣ Select which Skills to install**

The installer automatically fetches all available Skills from the repo and lists them for selection. Press **Space** to toggle each one — we recommend selecting all:

```
◇  Found 14 skills
│
◇  Select skills to install (space to toggle)
│  agent-wallet, bankofai-guide, Multi-Sig & Account Permissions,
│  recharge-skill, SunPerp Perpetual Futures Trading, SunPump Meme Token Toolkit,
│  SunSwap DEX Trading, TRC20 Token Toolkit, TronScan Data Lookup,
│  TRX Staking & SR Voting, USDD / JUST Protocol, twitter-digest, twitter-mcp,
│  x402-payment
```

:::tip Select all
Unless you're sure you only need specific skills, install them all. Skills use an on-demand architecture — unused skills consume zero resources.
:::

**2️⃣ Choose which AI tools to install to**

The installer auto-detects AI tools on your computer (e.g., Cursor, Claude Code, Cline, etc.). Use Space to select the ones you want:

```
◇  71 agents
◇  Which agents do you want to install to?
│  Amp, Antigravity, Antigravity CLI, Cline, Codex, Cursor, Deep Agents,
│  Gemini CLI, GitHub Copilot, Kimi Code CLI, OpenCode, Warp, Zed,
│  Claude Code, OpenClaw … (71 in total — tick the ones you actually use)
```

**3️⃣ Choose installation scope**

Select `Project` (current project only) or `User` (globally available across all projects):

```
◇  Installation scope
│  Project
```

**4️⃣ Choose installation method**

Choose how skill files land in each tool — `Symlink` (recommended) or `Universal` (full copy). Just press Enter to use the recommended option:

```
◇  Installation method
│  Symlink (Recommended)
```

**5️⃣ Review the installation plan**

The installer shows a summary of where each Skill will land, whether it'll be a full copy (`universal`) or a symlink for each target tool, and which existing files it overwrites:

```
◇  Installation Summary ─────────────────────────────────────────────────────────╮
│                                                                                │
│  ~/.agents/skills/bankofai-guide                                               │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
│  ~/.agents/skills/multi-sig-account-permissions                                │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
│  ~/.agents/skills/recharge-skill                                               │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
│  ~/.agents/skills/sunperp-perpetual-futures-trading                            │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
│  ~/.agents/skills/sunpump-meme-token-toolkit                                   │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
│  ~/.agents/skills/sunswap-dex-trading                                          │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
│  ~/.agents/skills/trc20-token-toolkit                                          │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
│  ~/.agents/skills/tronscan-data-lookup                                         │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
│  ~/.agents/skills/trx-staking-sr-voting                                        │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
│  ~/.agents/skills/usdd-just-protocol                                           │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
│  ~/.agents/skills/x402-payment                                                 │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
│  ~/.agents/skills/agent-wallet                                                 │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
├────────────────────────────────────────────────────────────────────────────────╯
```

:::tip universal vs symlink
Tools that follow the generic skills layout get a **universal** copy under `~/.agents/skills/`. Claude Code, OpenClaw, and similar tools use their own conventions, so the installer creates **symlinks** pointing back to the universal copy — one source of truth, everything stays in sync. `overwrites` lists the existing same-name skill files this run will replace.
:::

**6️⃣ Review security assessment & confirm**

The installer runs a security scan on each Skill and shows the results. Review them and select `Yes` to proceed:

```
◇  Security Risk Assessments ────────────────────────────────────────────────────────╮
│                                                                                    │
│                                     Gen               Socket            Snyk       │
│  bankofai-guide                     Safe              0 alerts          High Risk  │
│  Multi-Sig & Account Permissions    --                --                --         │
│  recharge-skill                     Safe              1 alert           Med Risk   │
│  SunPerp Perpetual Futures Trading  --                --                --         │
│  SunPump Meme Token Toolkit         --                --                --         │
│  SunSwap DEX Trading                --                --                --         │
│  TRC20 Token Toolkit                --                --                --         │
│  TronScan Data Lookup               --                --                --         │
│  TRX Staking & SR Voting            --                --                --         │
│  USDD / JUST Protocol               --                --                --         │
│  x402-payment                       Safe              1 alert           Med Risk   │
│  agent-wallet                       Safe              1 alert           High Risk  │
│                                                                                    │
│  Details: https://skills.sh/BofAI/skills                                           │
│                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────╯

◇  Proceed with installation?
│  Yes
```

**7️⃣ Installation complete!**

When you see output like this, all Skills have been successfully installed to your selected AI tools:

```
◇  Installation complete

◇  Installed 14 skills ──────────────────────────────────────────────────╮
│                                                                        │
│  ✓ ~/.agents/skills/bankofai-guide                                     │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/multi-sig-account-permissions                      │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/recharge-skill                                     │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/sunperp-perpetual-futures-trading                  │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/sunpump-meme-token-toolkit                         │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/sunswap-dex-trading                                │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/trc20-token-toolkit                                │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/tronscan-data-lookup                               │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/trx-staking-sr-voting                              │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/usdd-just-protocol                                 │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/twitter-digest                                     │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/twitter-mcp                                        │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/x402-payment                                       │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/agent-wallet                                       │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│                                                                        │
├────────────────────────────────────────────────────────────────────────╯

└  Done!  Review skills before use; they run with full agent permissions.
```

### Verify Installation

Open your AI chat and type:

```
Read the sunswap skill and tell me what it can do.
```

If the AI accurately describes the skill's capabilities — congratulations, installation is complete!

---

## Step 2: Talk to Your AI

Open your AI chat and copy-paste any of these:

> Give me a TRON network overview: current TPS, number of Super Representatives, total accounts.

In seconds, the AI calls the tronscan-skill and returns a complete on-chain data report.

**This is completely safe — it's only "looking" at data. It doesn't touch your wallet or spend a single coin.**

Try a few more:

> How much TRX can I get for 100 USDT on SunSwap?

> Show me the top 10 TRC20 tokens by market cap.

> What's the current price, 24h change, and funding rate for BTC-USDT perpetual contract?

If the AI responds with real data — congratulations, your AI is up and running!

---

## 💰 Want the AI to Trade for You?

Everything above is "look but don't touch" — the AI can look up data and compare prices, but it doesn't have permission to spend a single coin of yours. That's by design: you stay in full control.

When you're ready to let the AI execute swaps, open positions, or manage liquidity, you need to give it a "wallet key."

We've prepared two ways to hand over the key — pick whichever suits you:

### Option 1: Open a Dedicated "Payment Account" for the AI (Strongly Recommended, Safest)

We recommend using **Agent Wallet**. Think of it as opening a dedicated payment account for your AI. You don't expose your bank password (plaintext private key) in a file on your computer — instead, you set an encryption password. Every time it wants to spend money, it shows you the full bill first and only proceeds after you say "yes."

👉 Head over to [Agent Wallet Quick Start](../../Agent-Wallet/QuickStart.md) to set it up (visual interface, about 2 minutes).

### Option 2: Paste Your Private Key Directly (For Power Users or Quick Testing)

If you don't want to install another tool and just want to start trading right away, you can paste your private key into a simple config file on your computer — like editing a notepad:

1. In Terminal (the black window), type `open -e ~/.zshrc` and press Enter.
2. A text editor window will pop up. Scroll to the very bottom, start a new line, and paste your TRON private key:
   ```bash
   export TRON_PRIVATE_KEY='your_real_or_testnet_private_key'
   ```
   ⚠️ Important: Don't forget the double quotes on both sides!
3. Press `Command + S` to save, then close the editor.

:::danger Critical Step
No matter which option you chose, you must **completely close and reopen your AI tool** for it to pick up the new key!
:::

---

## 🎮 Key Is Set — How Do I Start Trading?

Once you've configured your key and restarted your AI, you can start giving it trading commands right away!

:::caution Golden Rule for Beginners: Practice with Play Money First
Before running any real transaction, **always test on the Nile testnet first**. Testnet tokens have zero real-world value — you can experiment freely without risking anything.
:::

Open your AI chat and say your first trading command:

> Swap 100 TRX for USDT on the Nile testnet.

The AI will quickly calculate the price, estimate fees, then pause and ask: "Ready to execute?" Just reply "yes," and the on-chain transaction completes automatically!

Once you've practiced on testnet and confirmed the AI behaves exactly as expected, simply drop the words "Nile testnet" from your commands — and it will trade with real funds on mainnet.

---

## Next Steps

- See what each skill can do → [Skill Catalog](./BANKOFAISkill.md)
- Something not working? → [FAQ](./Faq.md)
