import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start

From zero to invoking your Agent-wallet in your AI agent chat. We provide two ways to create your wallet — **conversational setup is the easiest**, done entirely from your AI chat; **command-line setup** gives you the most precise control.

:::tip Want CLI command details?
This page only walks you through the shortest path. For password-free configuration, managing multiple wallets, signature types, and other advanced topics, see the [CLI Reference](./Developer/CLI-Reference.md).
:::

---

## Method 1: Conversational Setup (Easiest)

If you've already installed [the BANK OF AI skill suite](../McpServer-Skills/SKILLS/QuickStart.md) (which includes `agent-wallet` and `bankofai-guide`), creating a wallet takes just one prompt in your AI chat — the AI generates the password, creates the wallet, and saves the config for you, with no manual file editing.

:::tip Prerequisites
- BANK OF AI skills installed (see [SKILLS Quick Start](../McpServer-Skills/SKILLS/QuickStart.md))
- Your AI Agent supports shell command execution (OpenClaw, a Telegram bot, web chat, Claude Code, Cursor, etc.)
:::

**How it works:**

1. Open your AI Agent chat
2. Copy and paste the following prompt:

   ```
   Create an AgentWallet
   ```

3. The AI handles the entire flow automatically:
   - **Checks current wallet status** — tells you whether one is already configured
   - **Asks how to create it** — offers two options:
     - **A. Quick setup (highly recommended)**: fully automated, ~10 seconds; auto-generates a secure password; encrypted wallet stored locally
     - **B. Detailed setup**: manually pick wallet type; custom password; more configuration options
4. Reply `A` and the AI runs the three setup steps automatically:
   - **Step 1**: Generate a secure password
   - **Step 2**: Create the wallet
   - **Step 3**: Retrieve the wallet addresses

**When done, you'll see output like this:**

```text
🎉 Agent Wallet created successfully!

| Field    | Detail                     |
| -------- | -------------------------- |
| Wallet ID| default_local_secure       |
| Type     | local_secure (encrypted)   |
| Status   | ✅ Active                   |

Wallet addresses

| Network | Address                                             |
| ------- | --------------------------------------------------- |
| EVM     | 0x1339Df9ac21E494b39Be47d012A3f33fb9188366          |
| TRON    | TBisApdFay75x3FXNWiG8UE75KzhnFLceY                  |

💡 The EVM address works on every EVM-compatible chain (Ethereum, BSC, Base, Polygon, Arbitrum, etc.)

🔐 Wallet password

$mU80m9fLYB5

⚠️ Important:
• This password encrypts the private key stored locally
• Signing transactions, resolving addresses, and every other operation requires this password
• The password is auto-saved to ~/.agent-wallet/runtime_secrets.json
• Back up the password yourself! If runtime_secrets is ever deleted, the password is the only way to recover the wallet
```

:::caution Back up your wallet password!
Even though the password is auto-saved to `~/.agent-wallet/runtime_secrets.json`, **you still must copy it separately** into a password manager (1Password, Bitwarden, etc.). If that file is ever accidentally deleted, your disk fails, or you reinstall your OS, the password is gone — and so is access to your wallet's assets, permanently.
:::

:::tip Done — no env-var configuration needed
Conversational setup auto-saves the password to `~/.agent-wallet/runtime_secrets.json`, and your AI Agent reads it automatically when calling wallet functions. **You don't need to manually export `AGENT_WALLET_PASSWORD`.** If you'd rather use the env-var approach, see Method 2 below.
:::

---

## Method 2: Command-Line Setup (Most Control)

If you want to control every step yourself, or your environment doesn't support conversational install, follow the command-line flow below.

### Step 1: Install and Initialize Your Wallet

#### 1.1 Prepare Your Environment: Install Node.js

Agent-wallet requires Node.js (a runtime environment, version >= 20) on your computer.

Open a terminal (Mac users press `Command + Space` and search for "Terminal"), then type:

```bash
node -v
```

- **If the output shows `v20.x.x` or higher:** Great, skip straight to 1.2!
- **If there's no output or an error:** Don't panic — go to the **[Node.js official website](https://nodejs.org)** and download the latest **LTS** installer. Install it like any regular software — double-click and follow the prompts. After installation, close and reopen your terminal, then run `node -v` again to confirm.

<details>
<summary>Developer preferred: Install via nvm (beginners can skip this)</summary>

```bash
# 1. Install nvm (skip if already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. Reload your terminal config
source ~/.bashrc   # zsh users: source ~/.zshrc

# 3. Install and switch to Node.js 20
nvm install 20 && nvm use 20
```

</details>

#### 1.2 Install Agent-wallet

```bash
npm install -g @bankofai/agent-wallet
```

Verify the installation:
```bash
agent-wallet --help
```

If you see the help output, you're good to go.

#### 1.3 Create Your Agent-wallet Wallet

Run:
```bash
agent-wallet start
```

The system will guide you through initializing your **Agent-wallet wallet**. The process is interactive — just follow the prompts:

```
? Quick start type: local_secure  — Encrypted key stored locally (recommended)
Wallet ID (e.g. my_wallet_1) (default_secure):

Wallet initialized!
? Import source: generate  — Generate a new random private key

Wallets:
┌────────────────┬──────────────┐
│ Wallet ID      │ Type         │
├────────────────┼──────────────┤
│ default_secure │ local_secure │
└────────────────┴──────────────┘

Your master password: <your-unique-password-will-appear-here>
   Save this password! You'll need it for signing and other operations.

Active wallet: default_secure
```

:::caution Master password = the only key to all your assets
This password is the sole credential for decrypting all your private keys. **Lose it and it's gone forever — no backup, no backdoor, no recovery.**

Do this right now:
1. Open your password manager (1Password, Bitwarden, etc.)
2. Create a new entry and paste in the master password
3. Don't screenshot it, don't put it in a desktop sticky note, don't text it to yourself
:::

---

### Step 2: Feed the Password to Your AI (Critical!)

For your AI agent to automatically use your wallet, you must configure the password in its runtime environment. Select the tab matching your operating system and **just copy-paste**:

#### 2.1 Save and Activate the Password

<Tabs>
<TabItem value="mac" label="Mac Users (Zsh)" default>

**Step 1:** Open `~/.zshrc` in an editor. Add the following line at the end of the file (replace the content inside the single quotes with your actual password):

```bash
open -e ~/.zshrc
```

Add this line at the very end, then save and close:

```bash
export AGENT_WALLET_PASSWORD='your-master-password'
```

**Step 2:** Back in the terminal, copy this command, paste and press Enter to apply the config immediately:

```bash
source ~/.zshrc
```

:::tip Why not use the echo command?
While `echo "export ..." >> ~/.zshrc` is quicker, your actual password gets recorded verbatim in the shell's history file (`.zsh_history` / `.bash_history`). These history files are commonly scanned by security tools, backup utilities, and AI coding assistants — exactly the kind of exposure Agent-wallet is designed to prevent. Editing the config file directly in an editor keeps the password out of any command history.
:::

</TabItem>
<TabItem value="linux" label="Linux Users">

**Step 1:** Open `~/.bashrc` in an editor. Add the following line at the end of the file (replace the content inside the single quotes with your actual password):

```bash
nano ~/.bashrc
```

Add this line at the very end, then save and close (in nano, press `Ctrl + O` to save, `Ctrl + X` to exit):

```bash
export AGENT_WALLET_PASSWORD='your-master-password'
```

**Step 2:** Back in the terminal, copy this command, paste and press Enter to apply the config immediately:

```bash
source ~/.bashrc
```


</TabItem>
</Tabs>





:::caution Password has special characters? Don't touch the single quotes!
Auto-generated passwords often contain `$`, `!`, and other special characters. The commands above already use single quotes to wrap the password — **just replace the text inside the quotes, never switch to double quotes**, or the shell will silently mangle the value:

```bash
# ✅ Correct — single quotes, password saved as-is
export AGENT_WALLET_PASSWORD='P@ss$w0rd!'

# ❌ Wrong — double quotes, $w0rd gets shell-expanded to empty string, password silently breaks
export AGENT_WALLET_PASSWORD="P@ss$w0rd!"  # actual value becomes "P@ss!"
```
:::

#### 2.2 Restart Your AI Backend Service

:::danger Many people forget this step, then wonder why AI can't find the password!
You just saved a new password, but the AI assistant running in the background hasn't refreshed yet — it's still blind to the change! You need to shut it down and restart it for the new password to take effect.
:::

Whether or not you currently have your AI agent backend service running, make sure to **shut it down**, then **restart it** from the same terminal window where you ran the commands above.

---

## You've Completed the Full Flow

| I want to… | Go here |
| :--- | :--- |
| Prefer the command line? | [CLI Reference](./Developer/CLI-Reference.md) |
| Building your own agent? | [SDK Guide](./Developer/SDK-Guide.md) |
| Looking for ready-made code? | [SDK Cookbook](./Developer/SDK-Cookbook.md) |
| Understand the security design | [Introduction](./Intro.md) |
| Check common questions | [FAQ](./FAQ.md) |
