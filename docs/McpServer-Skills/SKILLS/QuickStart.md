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
   Run npx skills add https://github.com/BofAI/skills/tree/main -y -g to install all BANK OF AI skills. After installation, use bankofai-guide to guide subsequent operations.
   Note: Please install to the skill directory corresponding to the current Agent.
   ```

3. The AI handles the entire flow automatically:
   - Pulls the `BofAI/skills` repository
   - Detects your current Agent's skills directory (e.g. `~/.agents/skills/`)
   - Installs all 10 BANK OF AI skills: the 9 core skills (`agent-wallet`, `wallet-cli`, `sunswap-dex-trading`, `sunpump-meme-token-toolkit`, `sunperp-perpetual-futures-trading`, `tronscan-data-lookup`, `usdd-just-protocol`, `x402-payment`, `recharge-skill`) plus `bankofai-guide` (the onboarding helper)

:::tip Why this is the recommended path for beginners
You don't need to know what `npx`, `npm`, or "global install" mean. The AI handles every step including selecting the right skills directory for your platform, installing the wallet CLI, and onboarding you to your first wallet.
:::

---

### Method 2: Quick Auto-Install (Command Line)

If you have Node.js installed and prefer the command line, simply tell your AI Agent to execute the following command:

```bash
npx skills add https://github.com/BofAI/skills/tree/main -y -g
```

The `/tree/main` suffix pins the **stable `main` branch** — other development branches may contain unreleased changes. The `-y` flag skips all interactive prompts and installs all available Skills by default. The `-g` flag installs them **globally** (user-level, under `~/.agents/skills/`) so every project can use them — keep it, otherwise the installer only installs into the directory you happen to be in. Once complete, it will show ✅ Installation complete! along with the full list of installed Skills.

---

### Method 3: Interactive Install (Most Control)

If you want to choose which Skills to install and which AI tools to install them to, drop the `-y` flag but keep `-g`:

```bash
npx skills add https://github.com/BofAI/skills/tree/main -g
```

:::tip
This guide demonstrates the installation process using terminal commands as an example.
:::

#### Interactive Installation Walkthrough

The installer will guide you through a few steps — just follow along:

**1️⃣ Select which Skills to install**

The installer automatically fetches all available Skills from the repo and lists them for selection. Press **Space** to toggle each one — we recommend selecting all:

```
◇  Found 10 skills
│
◇  Select skills to install (space to toggle)
│  agent-wallet, bankofai-guide, recharge-skill, SunPerp Perpetual Futures Trading,
│  SunPump Meme Token Toolkit, SunSwap DEX Trading, TronScan Data Lookup,
│  USDD / JUST Protocol, wallet-cli, x402-payment
```

:::tip Select all
Unless you're sure you only need specific skills, install them all. Skills use an on-demand architecture — unused skills consume zero resources.
:::

**2️⃣ Choose which AI tools to install to**

The installer auto-detects AI tools on your computer (e.g., Cursor, Claude Code, Cline, etc.). Use Space to select the ones you want:

```
◇  77 agents
◇  Which agents do you want to install to?
│  Amp, Antigravity, Antigravity CLI, Cline, Codex, Cursor, Deep Agents,
│  Gemini CLI, GitHub Copilot, Kimi Code CLI, OpenCode, Warp, Zed,
│  Claude Code, OpenClaw … (77 in total — tick the ones you actually use)
```

**3️⃣ Installation scope**

Because you passed `-g`, the installer skips this question and installs at user level, under `~/.agents/skills/`. Passing `-y` alone also skips it. Otherwise it asks you to choose between `Project` (install in the current directory, committed with your project) and `Global` (install in your home directory, available across all projects):

```
◇  Installation scope
│  Project
```

**4️⃣ Choose installation method**

Choose how skill files land in each tool — `Symlink (Recommended)` or `Copy to all agents` (full copy). Just press Enter to use the recommended option. ("universal" in the summary lines is not this setting — it labels the agents that share the `.agents/skills` directory.)

```
◇  Installation method
│  Symlink (Recommended)
```

**5️⃣ Review the installation plan**

The installer shows a summary of where each Skill will land and which existing files it overwrites. In symlink mode the summary splits targets into a `universal:` line and a `symlink →` line; in copy mode it prints a single `copy →` line covering every agent:

```
◇  Installation Summary ─────────────────────────────────────────────────────────╮
│                                                                                │
│  ~/.agents/skills/bankofai-guide                                               │
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
│  ~/.agents/skills/tronscan-data-lookup                                         │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
│  ~/.agents/skills/usdd-just-protocol                                           │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more          │
│    symlink → AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob +42 more  │
│    overwrites: Amp, Antigravity, Antigravity CLI, Cline, Codex +10 more        │
│                                                                                │
│  ~/.agents/skills/wallet-cli                                                   │
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

:::tip What `universal` means here
`universal` labels the tools that read the shared `~/.agents/skills/` layout — the skill files live there directly. Claude Code, OpenClaw and similar tools use their own directories, so in symlink mode the installer points **symlinks** back at that shared copy: one source of truth, everything stays in sync. It is a category of tool, not the copy-vs-symlink setting you chose in the previous step. `overwrites` lists the existing same-name skill files this run will replace.
:::

**6️⃣ Review security assessment & confirm**

The installer runs a security scan on each Skill and shows the results. Review them and select `Yes` to proceed:

```
◇  Security Risk Assessments ────────────────────────────────────────────────────────╮
│                                                                                    │
│                                     Gen               Socket            Snyk       │
│  bankofai-guide                     Safe              0 alerts          High Risk  │
│  recharge-skill                     Safe              1 alert           Med Risk   │
│  SunPerp Perpetual Futures Trading  --                --                --         │
│  SunPump Meme Token Toolkit         --                --                --         │
│  SunSwap DEX Trading                --                --                --         │
│  TronScan Data Lookup               --                --                --         │
│  USDD / JUST Protocol               --                --                --         │
│  wallet-cli                         --                --                --         │
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

◇  Installed 10 skills ──────────────────────────────────────────────────╮
│                                                                        │
│  ✓ ~/.agents/skills/bankofai-guide                                     │
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
│  ✓ ~/.agents/skills/tronscan-data-lookup                               │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/usdd-just-protocol                                 │
│    universal: Amp, Antigravity, Antigravity CLI, Cline, Codex +8 more  │
│    symlinked: Claude Code, OpenClaw                                    │
│  ✓ ~/.agents/skills/wallet-cli                                         │
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

:::info A "Failed to install" list at the end is normal
A global install sometimes ends with `■  Failed to install 10` and one line per skill saying `PromptScript: PromptScript does not support global skill installation`. That is a single client — PromptScript — which has no global install location. It does not affect anything else: the `✓ Installed 10 skills` list printed just above it is the real result, and Claude Code, OpenClaw, Codex and the rest are installed.
:::

### Verify Installation

Open your AI chat and type:

```
Read the sunswap-dex-trading skill and tell me what it can do.
```

If the AI accurately describes the skill's capabilities — congratulations, installation is complete!

---

## Step 2: Talk to Your AI

Open your AI chat and copy-paste any of these:

> Give me a TRON network overview: current TPS, number of Super Representatives, total accounts.

In seconds, the AI calls the tronscan-data-lookup skill and returns a complete on-chain data report.

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

1. In Terminal, open your shell profile. On macOS with zsh that is `open -e ~/.zshrc`; on Linux use `nano ~/.bashrc` (or `~/.zshrc` if you use zsh); on Windows set the variable through **System Properties → Environment Variables** instead.
2. Scroll to the very bottom, start a new line, and paste your TRON private key:
   ```bash
   export TRON_PRIVATE_KEY='your_real_or_testnet_private_key'
   ```
   ⚠️ Important: keep the quotes on both sides — single quotes as shown are safest, since they stop the shell from interpreting characters in the key.
3. Save the file (`Command + S` in TextEdit, `Ctrl + O` then `Ctrl + X` in nano) and close the editor.

:::danger Critical Step
No matter which option you chose, you must **completely close and reopen your AI tool** for it to pick up the new key. On macOS, an app launched from Finder or the Dock does not read `~/.zshrc` — quit it fully and relaunch it from a terminal, or set the variable where the GUI app can see it.
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
