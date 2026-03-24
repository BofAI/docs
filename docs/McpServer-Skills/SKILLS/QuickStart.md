# Quick Start

Get your AI up and running with BANK OF AI SKILLS in **2 steps** and less than **1 minute**. No private keys, no configuration — just install and start talking.

---

## Step 1: Install the Skills

Simply tell your AI Agent to execute the following command:

```bash
npx skills add https://github.com/BofAI/skills
```

:::tip
This guide demonstrates the installation process using terminal commands as an example. If you prefer to install manually, open the Terminal on your computer (press `Command + Space`, type `Terminal`, hit Enter), paste the command above, and press Enter.
:::

### Installation Walkthrough

The installer will guide you through a few steps — just follow along:

**1️⃣ Confirm tool installation**

Terminal will ask you to install the `skills` package. Type `y` and press Enter:

```
Need to install the following packages:
  skills@1.4.6
Ok to proceed? (y) y
```

**2️⃣ Select which Skills to install**

The installer automatically fetches all available Skills from the repo and lists them for selection. Press **Space** to toggle each one — we recommend selecting all:

```
◇  Found 6 skills
│
◇  Select skills to install (space to toggle)
│  Multi-Sig & Account Permissions, recharge-skill,
│  SunPerp Perpetual Futures Trading, SunSwap DEX Trading,
│  TronScan Data Lookup, x402-payment
```

:::tip Select all
Unless you're sure you only need specific skills, install them all. Skills use an on-demand architecture — unused skills consume zero resources.
:::

**3️⃣ Choose which AI tools to install to**

The installer auto-detects AI tools on your computer (e.g., Cursor, Claude Code, Cline, etc.). Use Space to select the ones you want:

```
◇  43 agents
◇  Which agents do you want to install to?
│  Amp, Antigravity, Cline, Codex, Cursor, Deep Agents,
│  Gemini CLI, GitHub Copilot, Kimi Code CLI, OpenCode, Warp
```

**4️⃣ Choose installation scope**

Select `Project` (current project only) or `User` (globally available across all projects):

```
◇  Installation scope
│  Project
```

**5️⃣ Review security assessment & confirm**

The installer runs a security scan on each Skill and shows the results. Review them and select `Yes` to proceed:

```
◇  Security Risk Assessments ──────────────────────────────╮
│                                                          │
│                                    Gen    Socket   Snyk  │
│  Multi-Sig & Account Permissions   --     --       --    │
│  recharge-skill                    --     --       --    │
│  SunPerp Perpetual Futures Trading --     --       --    │
│  SunSwap DEX Trading               --     --       --    │
│  TronScan Data Lookup              --     --       --    │
│  x402-payment                      Med    1 alert  Med   │
│                                                          │
├──────────────────────────────────────────────────────────╯

◇  Proceed with installation?
│  Yes
```

**6️⃣ Installation complete!**

When you see output like this, all Skills have been successfully installed to your selected AI tools:

```
◇  Installed 6 skills ────────────────────────╮
│                                             │
│  ✓ Multi-Sig & Account Permissions (copied) │
│  ✓ recharge-skill (copied)                  │
│  ✓ SunPerp Perpetual Futures Trading (copied)│
│  ✓ SunSwap DEX Trading (copied)             │
│  ✓ TronScan Data Lookup (copied)            │
│  ✓ x402-payment (copied)                    │
│                                             │
├─────────────────────────────────────────────╯

└  Done!
```

:::tip Optional: Install find-skills
After installation, you may be prompted to install `find-skills` — a helper that lets your AI automatically discover and suggest new skills. We recommend selecting `Yes`.
:::

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
