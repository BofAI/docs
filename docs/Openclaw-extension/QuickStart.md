# Quick Start

Our goal: **Spend a few minutes following the wizard, clicking a few buttons, and get your AI to successfully fetch its first piece of on-chain data.**

---

## 🕹️ Prerequisites

Before you begin, make sure the following basic software is installed on your computer (if not, download and install them from their official websites just like any regular software):

1. **OpenClaw**: Your AI assistant software.
2. **Node.js** (must be v18 or above): The runtime environment for skill packs and configuration. *(Extremely important — older versions will definitely cause errors!)*
3. **Git**: A small tool used to download skill packs.

**Windows users, additional requirements:**
- **Windows 10** (build 1511+) or **Windows 11**
- **PowerShell 5.1+** (comes pre-installed with Win10/11, no extra setup needed)
- Run `$PSVersionTable.PSVersion` in PowerShell to confirm your version

---

## 🚀 Step 1: One-Click Installation

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

🚑 **First Aid: Got an error right after pressing Enter?** If the screen says `command not found: node` (Mac/Linux) or `node is not recognized` (Windows), it means your computer is missing the prerequisites mentioned above. 👉 [Click here to see how to fix it](./FAQ.md#error-says-command-not-found-node-or-npm-install-failed)

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

  • BANK OF AI local config: ~/.mcporter/bankofai-config.json
  • AgentWallet config will be overwritten by: agent-wallet start --override --save-runtime-secrets

? Continue with CLEAN install? (y/N): y
? Type CLEAN to confirm permanent deletion: CLEAN
```

After confirming, the installer automatically removes old skills:

```
Running cleanup...

◇  Found 11 unique installed skill(s)
◇  Removal process complete
◆  Successfully removed 11 skill(s)

✓ Clean install cleanup completed.

Clean complete — proceeding with fresh setup...
```

Then runs `agent-wallet reset` to completely wipe old wallet data:

```
Step 0: AgentWallet Setup

Launching: agent-wallet reset
This will delete ALL wallet data in: ~/.agent-wallet

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

Launching: agent-wallet start --override --save-runtime-secrets
Please complete initialization in the CLI prompts.
```

**① Choose wallet type** — Just press Enter to accept the default:

```
✔ Quick start type: local_secure — Encrypted key stored locally (recommended)
```

**② Set a master password** — You can type your own (must have uppercase + lowercase + digit + special character, 8+ chars), or just press Enter to auto-generate one:

```
✔ New Master Password (press Enter to auto-generate a strong password)

Wallet initialized!
```

If you auto-generated, you'll see something like:

```
🔑 Your master password: 7#KQoc&%m4S7$Dhk
⚠️ Keep this password safe. You'll need it for signing and other operations.
```

:::caution Write down this password!
This master password is the key to your AI's wallet. **Lose it and you lose access to the wallet.** Write it down on paper, save it in a password manager — anything but forgetting it.
:::

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

:::tip See "Wallet already initialized." during a Normal install upgrade?
If you've previously installed AgentWallet and chose Normal install, the wizard skips the password setup and lets you enter a Wallet ID and generate a wallet directly. Your previous master password and existing wallets are preserved.
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

Use `↑` `↓` arrow keys to move, press **Space** to toggle checkboxes, and press **Enter** to confirm. All three are checked by default — we recommend keeping them all.

After confirming, the installer configures each server one by one. Here's what to expect:

#### mcp-server-tron

```
Configuring mcp-server-tron...
This step configures network access for TRON MCP.
? Enter TRONGRID_API_KEY (optional):
```

⚠️ **The installer is asking for your `TRONGRID_API_KEY`.** This is your dedicated TronGrid access key — having one means data queries won't be throttled. **Don't have one? Just press Enter to skip!** It won't affect your installation at all. You can always add it later.

When it succeeds, you'll see the `add-mcp` banner and:

```
✓ Configuration saved for mcp-server-tron.
```

#### bnbchain-mcp

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

#### bankofai-recharge

This one is fully automatic — no input needed! It connects to BANK OF AI's remote recharge service.

```
✓ Configuration saved for bankofai-recharge.
```

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

Then the skill picker launches:

```
◇  Found 7 skills
│
◇  Select skills to install (space to toggle)
│  Multi-Sig & Account Permissions, recharge-skill, SunPerp Perpetual Futures Trading,
│  SunSwap DEX Trading, TRC20 Token Toolkit, TronScan Data Lookup, x402-payment
```

Here's what each skill does:

| Skill | What It Does |
| :--- | :--- |
| **SunSwap DEX Trading** | Swap tokens on SunSwap (TRON's biggest DEX) |
| **SunPerp Perpetual Futures** | Trade perpetual futures on SunPerp |
| **TronScan Data Lookup** | Query blockchain data via TronScan |
| **Multi-Sig & Account Permissions** | Multi-signature wallet and account permission management |
| **TRC20 Token Toolkit** | Common TRC20 token operations like sending tokens |
| **x402-payment** | x402 protocol payments (agent-to-agent) |
| **recharge-skill** | Check and top up your BANK OF AI balance |

After selecting, the installer shows a security risk assessment:

```
◇  Security Risk Assessments
│                                     Gen        Socket        Snyk
│  Multi-Sig & Account Permissions    --         --            --
│  recharge-skill                     Safe       1 alert       Med Risk
│  SunPerp Perpetual Futures Trading  --         --            --
│  SunSwap DEX Trading                --         --            --
│  TRC20 Token Toolkit                --         --            --
│  TronScan Data Lookup               --         --            --
│  x402-payment                       Safe       0 alerts      Med Risk
```

Review the report, then confirm to proceed. When installation completes:

```
◇  Installed 7 skills
│
│  ✓ Multi-Sig & Account Permissions → ~/.openclaw/skills/multi-sig-account-permissions
│  ✓ recharge-skill → ~/.openclaw/skills/recharge-skill
│  ✓ SunPerp Perpetual Futures Trading → ~/.openclaw/skills/sunperp-perpetual-futures-trading
│  ✓ SunSwap DEX Trading → ~/.openclaw/skills/sunswap-dex-trading
│  ✓ TRC20 Token Toolkit → ~/.openclaw/skills/trc20-token-toolkit
│  ✓ TronScan Data Lookup → ~/.openclaw/skills/tronscan-data-lookup
│  ✓ x402-payment → ~/.openclaw/skills/x402-payment
```

After skills are installed, the installer enters a configuration phase, asking for one API Key:

#### recharge-skill API Key Configuration

```
recharge-skill API Key Configuration
recharge-skill uses your local BANK OF AI API key for balance and order queries.

? Enter BANKOFAI_API_KEY (optional, hidden):
```

**Don't have one? Just press Enter to skip.** You can always create the config file later — see "[How to Add API Keys](#️-how-to-add-api-keys-vip-pass-after-installation)" below.

When `Installation Complete!` lights up at the bottom of the screen — congratulations, you've passed all levels!

```
═══════════════════════════════════════
  Installation Complete!
═══════════════════════════════════════

✓ MCP Server configured
  Config file: ~/.mcporter/mcporter.json
    File permissions: 600 (owner read/write only)

✓ Installed skills:
  • Multi-Sig & Account Permissions
  • recharge-skill
  • TRC20 Token Toolkit
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
| `TRONSCAN_API_KEY` | Required for the TronScan data lookup skill | Apply for free at [tronscan.org](https://tronscan.org/#/myaccount/apiKeys) |
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
mkdir -p ~/.mcporter && echo '{"api_key": "paste_your_BANKOFAI_API_KEY_here", "base_url": "https://chat.bankofai.io/"}' > ~/.mcporter/bankofai-config.json
```

</TabItem>
<TabItem value="win" label="Windows">

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.mcporter" | Out-Null
'{"api_key": "paste_your_BANKOFAI_API_KEY_here", "base_url": "https://chat.bankofai.io/"}' | Out-File -Encoding utf8 "$env:USERPROFILE\.mcporter\bankofai-config.json"
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
| `.openclaw/skills/` | Workspace-level skill packs (if you chose option 2) |
| `~/.agent-wallet/` | AgentWallet encrypted wallet data |

</TabItem>
<TabItem value="win" label="Windows">

| File | What It Stores |
| :--- | :--- |
| `%USERPROFILE%\.mcporter\mcporter.json` | MCP server configurations (including BNB Chain private key if provided) |
| `%USERPROFILE%\.mcporter\bankofai-config.json` | BANK OF AI API key |
| `%USERPROFILE%\.openclaw\skills\` | Globally installed skill packs |
| `.openclaw\skills\` | Workspace-level skill packs (if you chose option 2) |
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
