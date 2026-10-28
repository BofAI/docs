# Quick Start

Our goal: **Spend a few minutes following the wizard, clicking a few buttons, and get your AI to successfully fetch its first piece of on-chain data.**

:::note Versions pinned by the installer
The one-click installer currently installs **agent-wallet 2.3.1** and **Skills v1.5.15**. The wallet steps on this page therefore follow agent-wallet 2.x (master password, `local_secure` wallets), not the 3.x behavior described in the [Agent-Wallet docs](../Agent-Wallet/Intro.md).
:::

---

## 🕹️ Prerequisites

Before you begin, make sure the following basic software is installed on your computer (if not, download and install them from their official websites just like any regular software):

1. **OpenClaw**: Your AI assistant software.
2. **Node.js** (22.23.4+ on 22.x, 24.22.1+ on 24.x, or 26.12.1+): both installers check the full version against `^22.23.4 || ^24.22.1 || >=26.12.1` and stop before installing anything if Node.js is missing or too old. *(Node.js 24 is the safest choice: it satisfies every component the wizard installs.)*
3. **Git**: A small tool used to download skill packs.

**Windows users, additional requirements:**
- **Windows 10** (build 1511+) or **Windows 11**
- **PowerShell 5.1+** (comes pre-installed with Win10/11, no extra setup needed)
- Run `$PSVersionTable.PSVersion` in PowerShell to confirm your version

---

## 🚀 Step 1: Run the Smart Installation Wizard

Open the "Terminal" on your computer (that black window).

- **Mac / Linux:** Press `Command + Space` (Mac) or search `Terminal` in the app menu, and hit Enter.
- **Windows:** Press `Win + X` and select **Windows PowerShell** or **Terminal**; or search `PowerShell` in the Start menu.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="mac" label="Linux / macOS" default>

**Copy the entire line below**, paste it into the terminal, and press Enter:

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

Or install from source:

```bash
git clone https://github.com/BofAI/openclaw-extension.git
cd openclaw-extension
./install.sh
```

</TabItem>
<TabItem value="win" label="Windows">

**Copy the entire line below**, paste it into PowerShell, and press Enter:

```powershell
irm https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.ps1 | iex
```

Or install from source:

```cmd
git clone https://github.com/BofAI/openclaw-extension.git
cd openclaw-extension
install.bat
```

> `install.bat` is a tiny 6-line launcher that automatically invokes `install.ps1` with the correct execution policy — no manual PowerShell configuration needed.

</TabItem>
</Tabs>

🚑 **First Aid: Got an error right after pressing Enter?** If the screen says `Error: Node.js ^22.23.4 || ^24.22.1 || >=26.12.1 is required` (possibly followed by `found vX.Y.Z`; on Windows a similar message without `Error: ` appears under `Installation failed with error:`), it means your computer is missing the prerequisites mentioned above. 👉 [Click here to see how to fix it](./FAQ.md#error-says-command-not-found-node-or-npm-install-failed)

If there are no errors, an English wizard will appear on screen. Think of it as a text-based mini-game with 4 levels:

```
🦞 OpenClaw Extension Installer (by BANK OF AI)
Smart contracts, smarter agent. No more manual ABI guessing.
```

### 🟢 Level 1: Choose Installation Mode

The screen will ask you which mode to use:

```
Installation Mode
  1) Normal install [Recommended]
  2) Clean install (full cleanup: MCP/skills/local config files)

? Enter choice (1-2, default: 1):
```

- **Normal install (1)**: Preserves your previous settings. Best for first-time installs or upgrades.
- **Clean install (2)**: Completely starts over — deletes all MCP configs, installed skills, API credentials, and wallet data.

:::tip First time installing? Which should I pick?
For a first-time install, both `1` and `2` produce the same result. Choose `2` only if you've installed before and want a fresh start.
:::

If you chose `2` (Clean install), the installer lists everything that will be deleted, then asks you to confirm twice:

```
The following data will be permanently deleted:
  • ALL MCP entries in: ~/.mcporter/mcporter.json
  • ALL installed skills (global and workspace)
  • legacy x402 config file: ~/.x402-config.json
  • BANK OF AI local config: ~/.mcporter/bankofai-config.json
  • AgentWallet config will be overwritten by: agent-wallet start --override --save-runtime-secrets

? Continue with CLEAN install? (y/N): y
? Type CLEAN to confirm permanent deletion: CLEAN
```

After confirming, the installer automatically removes old skills:

```
Running cleanup...

◇  Found 14 unique installed skill(s)
◇  Removal process complete
◆  Successfully removed 14 skill(s)

✓ Clean install cleanup completed.

Clean complete — proceeding with fresh setup...
```

Then runs `agent-wallet reset` to completely wipe old wallet data:

```
Step 0: AgentWallet Setup

Launching: agent-wallet reset
This will delete ALL wallet data in: /home/<you>/.agent-wallet
   4 file(s): master.json, wallets_config.json, runtime_secrets.json, secret_<id>.json

✔ Are you sure you want to reset? This cannot be undone. Yes
✔ Really delete everything? Last chance! Yes
  Deleted: master.json
  Deleted: wallets_config.json
  Deleted: runtime_secrets.json
  ...

Wallet data reset complete.
```

Once cleanup is done, the installer proceeds to the next step — wallet initialization.

If you chose `1` (Normal install), it skips straight to the next step.

### 🟢 Level 2: Configure AgentWallet (AI's Personal Wallet Vault)

The wizard will automatically install a tool called AgentWallet, which securely stores your AI's wallet keys — like a local encrypted bank vault that never sends your private keys anywhere.

```
Step 0: AgentWallet Setup

Launching: agent-wallet start --save-runtime-secrets
Please complete initialization in the CLI prompts.
```

(After a **CLEAN** install the line reads `agent-wallet start --override --save-runtime-secrets`; `--override` skips the "wallets already exist" confirmation and is used only on that path. A Normal install never passes it, which is why your existing wallets stay untouched.)

**① Choose wallet type** — Just press Enter to accept the default:

```
✔ Quick start type: local_secure — Encrypted key stored locally (recommended)
```

**② Set a master password** — You can type your own (must have uppercase + lowercase + digit + special character, 8+ chars), or just press Enter to auto-generate one:

```
✔ New Master Password (press Enter to auto-generate a strong password)

Wallet initialized!
```

**③ Name your wallet** — Enter a Wallet ID (e.g. `my_wallet_1`), or just press Enter to use the default name `default_secure`:

```
Wallet ID (e.g. my_wallet_1) (default_secure): my_wallet_1
```

**④ Generate a wallet** — Press Enter to create a brand new wallet:

```
✔ Import source: generate — Generate a new random private key
```

When you see the wallet table — your vault is ready!

```
Wallets:
┌─────────────┬──────────────┐
│ Wallet ID   │ Type         │
├─────────────┼──────────────┤
│ my_wallet_1 │ local_secure │
└─────────────┴──────────────┘

🔑 Your master password: 7#KQoc&%m4S7$Dhk
⚠️ Keep this password safe. You'll need it for signing and other operations.

Active wallet: my_wallet_1

✓ AgentWallet setup completed
```

If you chose auto-generate in step ②, the master password generated for you will be displayed here.

:::caution Write down this password!
This master password is the key to your AI's wallet. **Lose it and you lose access to the wallet.** Write it down on paper, save it in a password manager — anything but forgetting it.
:::

:::tip Already have wallets? (Normal install upgrade)
If AgentWallet already has wallets and you chose Normal install, the wizard first shows `Already initialized with N wallet(s), active: <id>` and asks **What would you like to do?**
- **exit** — keep everything as is; the installer continues to the next level.
- **add** — choose the wallet type, then unlock with your **existing** master password (`Master Password (enter your existing password to unlock)`; this prompt is skipped if the password was saved to `runtime_secrets.json` by an earlier install). After `Wallet already initialized.`, enter a new Wallet ID and generate a wallet as in steps ③–④; the new wallet becomes the active one. No new password is set.

Your previous master password and existing wallets are preserved either way.
:::

(🚑 Got stuck with an error? 👉 [Click here to see how to fix AgentWallet installation failures](./FAQ.md#agentwallet-installation-failed))

### 🟢 Level 3: Pick Your Toolbox (Give AI "Hands")

The screen will show a multi-select list of MCP servers. These are the "cables" that connect your AI to different blockchains:

```
? Select MCP Servers to install: (Space:toggle, Enter:confirm)
❯ [x] mcp-server-tron
      Interact with TRON blockchain (wallets, transactions, smart contracts).
  [x] bnbchain-mcp
      BNB Chain official MCP (BSC, opBNB, Ethereum, Greenfield).
  [x] bankofai-recharge
      BANK OF AI recharge MCP (remote recharge tools).
```

Use `↑` `↓` arrow keys to move, press **Space** to select (shows X) or deselect, and press **Enter** to confirm. All three are selected by default — we recommend keeping them all.

After confirming, the installer configures each server one by one. Here's what to expect:

#### mcp-server-tron (TRON Toolbox)

This one is fully automatic — no input needed! The installer adds the TRON MCP server directly:

```
Configuring mcp-server-tron...
Adding MCP server...
✓ Configuration saved for mcp-server-tron.
```

:::tip Want faster queries?
You can optionally configure a `TRONGRID_API_KEY` after installation for dedicated TronGrid access — without it, high-frequency queries may be throttled. See "[How to Add API Keys](#️-how-to-add-api-keys-vip-pass-after-installation)" below for setup instructions.
:::

#### bnbchain-mcp (BNB Chain Toolbox)

```
Configuring bnbchain-mcp...
bnbchain-mcp currently does not support AgentWallet.
This server still uses PRIVATE_KEY configuration.

⚠ Your PRIVATE_KEY will be stored in plaintext in: ~/.mcporter/mcporter.json

? Enter BNB Chain PRIVATE_KEY (optional):
? Enter LOG_LEVEL (optional):
```

:::caution BNB Chain Private Key
Unlike TRON (which uses the encrypted AgentWallet), BNB Chain currently stores your private key in **plaintext** in the config file. The file permissions are set to 600 (only you can read it), but we strongly recommend using a **dedicated wallet with minimal funds**.

**Don't have a BNB Chain key? No problem — press Enter to skip both prompts.** You can configure it later if needed.
:::

```
✓ Configuration saved for bnbchain-mcp.
```

#### bankofai-recharge (Recharge Assistant)

This one is fully automatic — no input needed! It registers the remote server `https://recharge.bankofai.io/mcp` (type `remote` in the add-mcp summary).

```
✓ Configuration saved for bankofai-recharge.
```

:::caution The recharge MCP service is offline
`https://recharge.bankofai.io/mcp` has been taken offline. The installer still selects and registers `bankofai-recharge` by default, but its tools no longer respond, so you can uncheck it in the MCP selection above. To top up your BANK OF AI account, use wallet-cli's [`bai recharge`](../wallet-cli/command-reference.md#bai-recharge) instead.
:::

### 🟢 Level 4: Pick Your Skill Packs (Give AI a "Brain")

First, choose where to install the skills:

```
Select skills installation scope:
  1) User-level (global) [Recommended]
     Available to all OpenClaw workspaces
  2) Workspace-level (project)
     Only available in current workspace

? Enter choice (1-2, default: 1):
```

Press Enter (or type `1`) to install globally — this way all your OpenClaw workspaces can use these skills.

:::note If you choose `2` (Workspace-level)
After you pick skills in the picker below, the skills tool asks **Installation scope** (`Project` / `Global`) once more. Choose `Project` to install into a `skills/` folder inside the directory you ran the installer from (`<current directory>/skills/<skill>`); choosing `Global` installs to `~/.openclaw/skills/` anyway, but the installer then compares only the workspace list, so it prints `No new skills were installed.`, skips the API key prompt and `Next steps`, and does not install the x402 CLI. Choose `1` above if you want global skills.
:::

Then the skill picker launches:

```
◇  Found 14 skills
│
◇  Select skills to install (space to toggle)
│  agent-wallet, bankofai-guide, Multi-Sig & Account Permissions, recharge-skill,
│  SunPerp Perpetual Futures Trading, SunPump Meme Token Toolkit, SunSwap DEX Trading,
│  TRC20 Token Toolkit, TronScan Data Lookup, TRX Staking & SR Voting, twitter-digest,
│  twitter-mcp, USDD / JUST Protocol, x402-payment
```

Here's what each skill does:

| Skill | What It Does |
| :--- | :--- |
| **agent-wallet** | AgentWallet management operations (view wallets, sign transactions) |
| **bankofai-guide** | Onboarding helper that walks the AI through next steps after installation |
| **Multi-Sig & Account Permissions** | Manage TRON multi-sig permissions — keys, thresholds, and co-signed proposals |
| **recharge-skill** | Check and top up your BANK OF AI balance |
| **SunPerp Perpetual Futures Trading** | Trade perpetual futures on SunPerp |
| **SunPump Meme Token Toolkit** | Create and trade meme tokens on SunPump; query token info, rankings, holders, and trade history |
| **SunSwap DEX Trading** | Swap tokens on SunSwap (TRON's biggest DEX) |
| **TRC20 Token Toolkit** | TRC20 transfers, approvals, balance queries, and token metadata |
| **TronScan Data Lookup** | Query blockchain data via TronScan |
| **TRX Staking & SR Voting** | Stake TRX, vote for Super Representatives, and claim voting rewards |
| **twitter-digest** | Generate an X/Twitter daily digest (mentions, home timeline, reply opportunities) |
| **twitter-mcp** | Install and authorize the `xurl` CLI for X/Twitter, or register the hosted X MCP bridge |
| **USDD / JUST Protocol** | Manage USDD stablecoin and JUST Protocol positions |
| **x402-payment** | Pay x402-protected HTTP APIs on TRON or BSC through the `x402-cli` command |

After selecting, the installer shows a security risk assessment:

```
◇  Security Risk Assessments
│                                     Gen               Socket            Snyk
│  agent-wallet                       Safe              1 alert           High Risk
│  bankofai-guide                     Safe              0 alerts          High Risk
│  Multi-Sig & Account Permissions    --                --                --
│  recharge-skill                     Safe              1 alert           Med Risk
│  SunPerp Perpetual Futures Trading  --                --                --
│  ...
│  x402-payment                       Safe              1 alert           Med Risk
```

Review the report, then answer the `Proceed with installation?` prompt with `Yes`. When installation completes:

```
◇  Proceed with installation?
│  Yes
│
◇  Installed 14 skills
│
│  ✓ agent-wallet (copied)
│    → ~/.openclaw/skills/agent-wallet
│  ✓ bankofai-guide (copied)
│    → ~/.openclaw/skills/bankofai-guide
│  ✓ Multi-Sig & Account Permissions (copied)
│    → ~/.openclaw/skills/multi-sig-account-permissions
│  ✓ recharge-skill (copied)
│    → ~/.openclaw/skills/recharge-skill
│  ✓ SunPerp Perpetual Futures Trading (copied)
│    → ~/.openclaw/skills/sunperp-perpetual-futures-trading
│  ✓ SunPump Meme Token Toolkit (copied)
│    → ~/.openclaw/skills/sunpump-meme-token-toolkit
│  ✓ SunSwap DEX Trading (copied)
│    → ~/.openclaw/skills/sunswap-dex-trading
│  ✓ TRC20 Token Toolkit (copied)
│    → ~/.openclaw/skills/trc20-token-toolkit
│  ✓ TronScan Data Lookup (copied)
│    → ~/.openclaw/skills/tronscan-data-lookup
│  ✓ TRX Staking & SR Voting (copied)
│    → ~/.openclaw/skills/trx-staking-sr-voting
│  ✓ twitter-digest (copied)
│    → ~/.openclaw/skills/twitter-digest
│  ✓ twitter-mcp (copied)
│    → ~/.openclaw/skills/twitter-mcp
│  ✓ USDD / JUST Protocol (copied)
│    → ~/.openclaw/skills/usdd-just-protocol
│  ✓ x402-payment (copied)
│    → ~/.openclaw/skills/x402-payment
```

#### x402 CLI (only if x402-payment is installed)

If `x402-payment` is among your installed skills, the installer then installs the pinned payment CLI globally (it skips this when `x402-cli` 1.0.1 is already present):

```
Installing @bankofai/x402-cli@1.0.1...
✓ Installed x402 CLI 1.0.1
```

This runs `npm install --global @bankofai/x402-cli@1.0.1`, so — like the AgentWallet CLI — it lands in your global npm directory rather than in an OpenClaw folder.

After skills are installed, the installer compares the skill list before and after and runs a configuration phase for each skill it considers new:

:::caution Only on a first install
"New" means not present in the skill list before this run. That list covers `~/.openclaw/skills/`, the shared `~/.agents/skills/` folder and the skill folders of any other agent on the machine, so where these skills are already in one of them (for example from an earlier install) the installer prints `No new skills were installed.` after the x402 CLI step (an already-installed CLI shows `✓ x402 CLI 1.0.1 is already installed`), skips the prompts below, and the final summary shows only the MCP config file. In that case create the API key file by hand — see [How to Add API Keys](#️-how-to-add-api-keys-vip-pass-after-installation) — and set `TRONSCAN_API_KEY` yourself if you want it.
:::

#### recharge-skill API Key Configuration

```
recharge-skill API Key Configuration
recharge-skill uses your local BANK OF AI API key for balance and order queries.
Recharge requests use the remote BANK OF AI recharge MCP endpoint.

? Enter BANKOFAI_API_KEY (optional, hidden):
```

:::caution Recharging through recharge-skill no longer works
The remote recharge MCP endpoint that recharge-skill uses for recharges has been taken offline, so recharge requests through this skill fail. To top up, use [`wallet-cli bai recharge`](../wallet-cli/command-reference.md#bai-recharge).
:::

**Don't have one? Just press Enter to skip.** You can always create the config file later — see "[How to Add API Keys](#️-how-to-add-api-keys-vip-pass-after-installation)" below.

When `Installation Complete!` lights up at the bottom of the screen — congratulations, you've passed all levels! The `Installed skills` list and `Next steps` below appear only when the installer detected new skills; otherwise the summary goes straight from the config-file lines to the closing `Repository:` / `Skills:` links.

```
═══════════════════════════════════════
  Installation Complete!
═══════════════════════════════════════

✓ MCP Server configured
  Config file: ~/.mcporter/mcporter.json
    File permissions: 600 (owner read/write only)

✓ Installed skills:
  • agent-wallet
  • bankofai-guide
  • Multi-Sig & Account Permissions
  • recharge-skill
  • SunPerp Perpetual Futures Trading
  • SunPump Meme Token Toolkit
  • SunSwap DEX Trading
  • TRC20 Token Toolkit
  • TronScan Data Lookup
  • TRX Staking & SR Voting
  • twitter-digest
  • twitter-mcp
  • USDD / JUST Protocol
  • x402-payment
  Verify with: npx skills list -g

Next steps:
  1. Restart OpenClaw and start a new session to load new skills
  2. Test the skills:
     "Read the recharge-skill and recharge my BANK OF AI account with 1 USDT"
     "Read the x402-payment skill and explain how it works"

Repository: https://github.com/BofAI/openclaw-extension
Skills: https://github.com/BofAI/skills
```

---

## 🎉 Step 2: Restart and Witness the Magic

After installation, there's one step you absolutely cannot skip: **Completely close your OpenClaw software, then reopen it.**

🚑 **First Aid: AI acting clueless?** If it says "I don't know what SunSwap is," 99% of the time it's because you didn't restart. On Mac press `Command+Q`, on Windows right-click the taskbar icon and quit or press `Alt+F4`. 👉 [Click here to see how to properly restart](./FAQ.md#ai-says-i-dont-have-blockchain-tools-or-i-dont-know-what-sunswap-is)

Open the chat window and send your AI its first command:

```
Check the current block height on the TRON mainnet.
```

If it thinks for a few seconds and then reports back a number — awesome! Your AI has successfully connected to the blockchain!

Try another one:

```
How much TRX can I get for 100 USDT on SunSwap right now?
```

---

*(That covers the beginner essentials. If you've got the hang of it, keep reading below 👇)*

---

## 🛠️ How to Add API Keys (VIP Pass) After Installation?

Totally get it! You were just browsing during installation and pressed Enter to skip everything. Now that you're comfortable, here's how to fill in your API Keys for the "VIP express lane":

### Step 1: Figure Out Which "Key" You Need

| Key Name | What's It For? | Where to Get It for Free? |
| :--- | :--- | :--- |
| `TRONGRID_API_KEY` | Express lane for the TRON toolbox — without it you'll be throttled | Register for free at [trongrid.io](https://www.trongrid.io/) |
| `TRONSCAN_API_KEY` | Optional for the TronScan Data Lookup skill — without it the skill goes through the BofAI proxy `ts.bankofai.io`; your own key gives higher rate limits | Apply for free at [tronscan.org](https://tronscan.org/#/myaccount/apiKeys) |
| `BANKOFAI_API_KEY` | Used for topping up or checking balance on BANK OF AI | Get it after logging in at [chat.bankofai.io/key](https://chat.bankofai.io/key) |


### Step 2: Enter Your Keys into the System

Once you have the corresponding key, choose the simple method below based on its type. **Don't forget to restart OpenClaw after filling it in!**

#### 🔧 Type A Keys: Add to "Hidden Notepad" (For TRONGRID and TRONSCAN)

<Tabs>
<TabItem value="mac" label="Linux / macOS" default>

1. Type `open -e ~/.zshrc` in the terminal and press Enter.
2. At the bottom of the text editor that opens, paste these lines (keep the double quotes `""`):
   ```
   export TRONGRID_API_KEY="paste_your_TronGrid_Key_here"
   export TRONSCAN_API_KEY="paste_your_TronScan_Key_here"
   ```
3. Press `Command + S` to save and close, then reopen the terminal or restart OpenClaw for changes to take effect.

</TabItem>
<TabItem value="win" label="Windows">

1. Press `Win + R`, type `sysdm.cpl`, and press Enter to open System Properties.
2. Click the **Advanced** tab → **Environment Variables**.
3. Under "User variables", click **New** and add each key:
   - Variable name: `TRONGRID_API_KEY`, Variable value: your TronGrid Key
   - Variable name: `TRONSCAN_API_KEY`, Variable value: your TronScan Key
4. Click OK to save, then restart OpenClaw for changes to take effect.

Or run this in PowerShell (permanently sets user environment variables):

```powershell
[Environment]::SetEnvironmentVariable("TRONGRID_API_KEY", "paste_your_TronGrid_Key_here", "User")
[Environment]::SetEnvironmentVariable("TRONSCAN_API_KEY", "paste_your_TronScan_Key_here", "User")
```

</TabItem>
</Tabs>

#### 🔧 Type B Keys: One-Click Config File (For BANK OF AI)

If you have this key, simply copy and run the following command in the terminal (remember to replace the placeholder with your actual key):

**Configure BANK OF AI:**

<Tabs>
<TabItem value="mac" label="Linux / macOS" default>

```bash
mkdir -p ~/.mcporter && echo '{"api_key": "paste_your_BANKOFAI_API_KEY_here", "base_url": "https://chat.ainft.com"}' > ~/.mcporter/bankofai-config.json
chmod 600 ~/.mcporter/bankofai-config.json   # the installer does this too; the file holds your API key
```

</TabItem>
<TabItem value="win" label="Windows">

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.mcporter" | Out-Null
'{"api_key": "paste_your_BANKOFAI_API_KEY_here", "base_url": "https://chat.ainft.com"}' | Out-File -Encoding utf8 "$env:USERPROFILE\.mcporter\bankofai-config.json"
```

</TabItem>
</Tabs>

---

## 📋 Configuration File Reference

After installation, the following files are created on your machine. All sensitive files are set to `600` permissions (Mac/Linux) or owner-only ACL via `icacls` (Windows):

<Tabs>
<TabItem value="mac" label="Linux / macOS" default>

| File | What It Stores |
| :--- | :--- |
| `~/.mcporter/mcporter.json` | MCP server configurations (including BNB Chain private key if provided) |
| `~/.mcporter/bankofai-config.json` | BANK OF AI API key |
| `~/.openclaw/skills/` | Globally installed skill packs |
| `skills/` (in the directory you ran the installer from) | Workspace-level skill packs (if you chose option 2, then `Project`) |
| `~/.agent-wallet/` | AgentWallet encrypted wallet data |

</TabItem>
<TabItem value="win" label="Windows">

| File | What It Stores |
| :--- | :--- |
| `%USERPROFILE%\.mcporter\mcporter.json` | MCP server configurations (including BNB Chain private key if provided) |
| `%USERPROFILE%\.mcporter\bankofai-config.json` | BANK OF AI API key |
| `%USERPROFILE%\.openclaw\skills\` | Globally installed skill packs |
| `skills\` (in the directory you ran the installer from) | Workspace-level skill packs (if you chose option 2, then `Project`) |
| `%USERPROFILE%\.agent-wallet\` | AgentWallet encrypted wallet data |

</TabItem>
</Tabs>

---

## 🔒 Security Tips

- **Use a dedicated agent wallet** with only small amounts of gas fees — never your personal main wallet.
- **BNB Chain private key is stored in plaintext** in `mcporter.json`. Use a wallet with minimal funds for this.
- **Test on testnets first** (Nile for TRON, BSC Testnet for BNB Chain) before using real money.
- **Your master password is everything** — lose it and you lose access to the wallet. Write it down somewhere safe.
- **Windows users**: The installer automatically sets owner-only ACL on sensitive config files via `icacls` (equivalent to `chmod 600` on Mac/Linux). No admin privileges are needed and no system files are modified.

---

## Still Stuck Somewhere?

That's totally normal! Everyone's computer environment is different.

Check out 👉 **[FAQ](./FAQ.md)** — we've already encountered and documented solutions for 99% of the headache-inducing issues out there.
