import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start

Three steps, from zero to invoking your encrypted safe in the OpenClaw chat box. No coding required, no gas fees — just copy and paste.

:::tip Want CLI command details?
This page only walks you through the shortest path. For password-free configuration, managing multiple wallets, signature types, and other advanced topics, see the [CLI Reference](./Developer/CLI-Reference.md).
:::

---

## Step 1: Install and Initialize Your Wallet

### 1.1 Prepare Your Environment: Install Node.js

Agent-wallet requires Node.js (a runtime environment, version >= 18) on your computer.

Open a terminal (Mac users press `Command + Space` and search for "Terminal"; Windows users search for "cmd" or "PowerShell"), then type:

```bash
node -v
```

- **If the output shows `v18.x.x` or higher:** Great, skip straight to 1.2!
- **If there's no output or an error:** Don't panic — go to the **[Node.js official website](https://nodejs.org)** and download the latest **LTS** installer. Install it like any regular software — double-click and follow the prompts. After installation, close and reopen your terminal, then run `node -v` again to confirm.

<details>
<summary>Developer preferred: Install via nvm (beginners can skip this)</summary>

```bash
# 1. Install nvm (skip if already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. Reload your terminal config
source ~/.bashrc   # zsh users: source ~/.zshrc

# 3. Install and switch to Node.js 18
nvm install 18 && nvm use 18
```

</details>

### 1.2 Install Agent-wallet

```bash
npm install -g @bankofai/agent-wallet
```

Verify the installation:
```bash
agent-wallet --help
```

If you see the help output, you're good to go.

### 1.3 Create Your Encrypted Safe

Run:
```bash
agent-wallet start
```

The system will guide you through initializing your **Agent-wallet encrypted safe**. The process is interactive — just follow the prompts:

```
? Quick start type: local_secure  — Encrypted key stored locally (recommended)
Wallet ID (e.g. my_wallet_1) (default):

Wallet initialized!
? Import source: generate  — Generate a new random private key

Wallets:
┌───────────┬──────────────┐
│ Wallet ID │ Type         │
├───────────┼──────────────┤
│ default   │ local_secure │
└───────────┴──────────────┘

Your master password: WiJxcI#t6@73K#OE
   Save this password! You'll need it for signing and other operations.

Active wallet: default
```

:::caution Master password = the only key to all your assets
This password is the sole credential for decrypting all your private keys. **Lose it and it's gone forever — no backup, no backdoor, no recovery.**

Do this right now:
1. Open your password manager (1Password, Bitwarden, etc.)
2. Create a new entry and paste in the master password
3. Don't screenshot it, don't put it in a desktop sticky note, don't text it to yourself
:::

---

## Step 2: Feed the Password to Your AI (Critical!)

For OpenClaw to automatically use your wallet, you must configure the password in its runtime environment. Select the tab matching your operating system and **just copy-paste**:

### 2.1 Permanently Save and Activate the Password

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

</TabItem>
<TabItem value="win-linux" label="Windows / Linux Users (Bash)">

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

:::tip Why not use the echo command?
While `echo "export ..." >> ~/.zshrc` is quicker, your actual password gets recorded verbatim in the shell's history file (`.zsh_history` / `.bash_history`). These history files are commonly scanned by security tools, backup utilities, and AI coding assistants — exactly the kind of exposure Agent-wallet is designed to prevent. Editing the config file directly in an editor keeps the password out of any command history.
:::

:::caution Password has special characters? Don't touch the single quotes!
Auto-generated passwords often contain `$`, `!`, and other special characters. The commands above already use single quotes to wrap the password — **just replace the text inside the quotes, never switch to double quotes**, or the shell will silently mangle the value:

```bash
# ✅ Correct — single quotes, password saved as-is
echo "export AGENT_WALLET_PASSWORD='P@ss$w0rd!'" >> ~/.zshrc

# ❌ Wrong — double quotes around password, $ gets expanded by shell, password silently breaks
echo "export AGENT_WALLET_PASSWORD=\"P@ss$w0rd!\"" >> ~/.zshrc
```
:::

### 2.2 Restart Your AI Backend Service

:::danger Many people forget this step, then wonder why AI can't find the password!
You just saved a new password, but the AI assistant running in the background hasn't refreshed yet — it's still blind to the change! You need to shut it down and restart it for the new password to take effect.
:::

Whether or not you currently have the OpenClaw backend service running, make sure to **shut it down**, then **restart it** from the same terminal window where you ran the commands above.

---

## Step 3: Wake Up Your Encrypted Safe in OpenClaw

Your safe is ready, the password is configured. Now open **OpenClaw** and test whether it can successfully invoke your local encrypted safe — just like chatting with a real person.

:::info Haven't installed OpenClaw Extension yet?
Head to [OpenClaw Extension Quick Start](../Openclaw-extension/QuickStart.md) first, then come back here.
:::

### Zero-Risk Test 1: Check Your Address

Type in the chat box:

> Show me the wallet address currently bound to my local wallet (TRON network).

The AI will automatically read your encrypted safe and report back the wallet address you just created. **This proves the password configuration is working correctly!**

### Zero-Risk Test 2: Let AI Sign for You

Then say:

> Sign this message with my wallet: "Hello Agent-wallet!"

The AI will complete the signing locally and offline, returning a hash string.

**Congratulations!** You didn't spend a single cent on gas fees, you never touched your private key, but you've successfully given your AI secure cryptographic signing capability.

---

## You've Completed the Full Flow

| I want to… | Go here |
| :--- | :--- |
| Use CLI for advanced operations | [CLI Reference](./Developer/CLI-Reference.md) |
| Build my own agent with code | [SDK Guide](./Developer/SDK-Guide.md) |
| Find ready-made code examples | [SDK Cookbook](./Developer/SDK-Cookbook.md) |
| Understand the security design | [Introduction](./Intro.md) |
| Check common questions | [FAQ](./FAQ.md) |
