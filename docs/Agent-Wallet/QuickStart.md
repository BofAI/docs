# CLI Quick Start

Four steps, from zero to your first signature. The whole thing takes under a minute — just copy and paste.

:::tip Already a developer?
If you want to call signing directly from TypeScript or Python code, skip to [SDK Quick Start](./SDKQuickStart.md).
:::

---

## 🧰 Step 1: Set Up Your Environment

Agent-wallet CLI requires Node.js ≥ 18. Check what you have:

```bash
node -v
```

Output is `v18.x.x` or higher? Jump to Step 2. Nothing installed or version too old? Follow the steps below:

:::tip Install / upgrade Node.js

We recommend [nvm](https://github.com/nvm-sh/nvm) — one command handles everything:

**1 — Install nvm** (skip if already installed):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

**2 — Reload your shell config:**
```bash
source ~/.bashrc   # zsh users: source ~/.zshrc
```

**3 — Install Node.js 18:**
```bash
nvm install 18
```

**4 — Switch to Node.js 18:**
```bash
nvm use 18
```

Or download the LTS installer directly from [nodejs.org](https://nodejs.org).
:::

---

## 📦 Step 2: Install Agent-wallet

One command:

```bash
npm install -g @bankofai/agent-wallet
```

Python users can also install via pip:
```bash
pip install bankofai-agent-wallet
```

Verify the install worked:
```bash
agent-wallet --help
```

If you see the help output, you're good to go.

---

## 🔐 Step 3: Create Your Personal Encrypted Safe

Run:
```bash
agent-wallet start
```

This initializes your **Agent-wallet encrypted safe**. The process is interactive — just follow the prompts.

If you don't specify a password manually (the `-p` flag), the system auto-generates a strong one and shows it once:

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

:::caution ⚠️ Master password = the only key to all your assets
This password is the sole credential for decrypting all your private keys. **Lose it and it's gone forever — no backup, no backdoor, no recovery.**

Do this right now:
1. Open your password manager (1Password, Bitwarden, etc.)
2. Create a new entry and paste in the master password
3. Don't screenshot it, don't put it in a desktop sticky note, don't text it to yourself
:::

**Want to set your own password?**
```bash
agent-wallet start -p Abc12345!
```
Requirements: at least 8 characters, with uppercase, lowercase, numbers, and special characters.

**Already have a private key to import?**
```bash
agent-wallet start -p Abc12345! -k your-private-key-hex
```

**Have a mnemonic phrase?**
```bash
agent-wallet start -p Abc12345! -m "word1 word2 word3 ..."
```

---

## ✨ Step 4: Your First Test Signature

The exciting moment — run:

```bash
agent-wallet sign msg "Hello from my AI agent" -n tron
```

You'll be prompted for your master password, then see output like:

```text
Master password: ********
Signature: 4a9c8f...e71b
```

**When that hash string appears on screen — congratulations, your encrypted safe is live!** 🎉

Your private key is encrypted on disk. That signature just happened entirely on your local machine, with zero data sent over the network.

---

## 🚀 Quick Start Done! What's Next?

| I want to… | Do this |
| :--- | :--- |
| Connect my wallet to AI tools | Set `export AGENT_WALLET_PASSWORD='your-password'`, see [Introduction](./Intro.md) |
| Sign from my own code | Go to [SDK Quick Start](./SDKQuickStart.md) |
| See a complete transfer example | Go to [Full Examples](./FullExample.md) |
| Browse the full command reference | ↓ Keep reading |

---

## Command Reference

Everything you'll need day-to-day after the quick start. Look things up as needed.

### Password-free Signing

Typing your password interactively every time? That's a non-starter for automation. Three ways to skip it:

**Option A — Environment variable** (recommended for CI / agent pipelines):
```bash
export AGENT_WALLET_PASSWORD='Abc12345!'
```
Once set, all signing commands run silently:
```bash
agent-wallet sign msg "Hello" -n tron
agent-wallet sign tx '{"txID":"..."}' -n tron
```

:::caution Password contains special characters? Always use single quotes
```bash
# ✅ Correct — shell treats it literally
export AGENT_WALLET_PASSWORD='P@ss$w0rd!'

# ❌ Wrong — $ gets expanded by the shell, password silently breaks
export AGENT_WALLET_PASSWORD="P@ss$w0rd!"
```
:::

**Option B — Inline `-p`** (one-off use):
```bash
agent-wallet sign msg "Hello" -n tron -p "Abc12345!"
```

**Option C — `--save-runtime-secrets`** (saves password to `~/.agent-wallet/runtime_secrets.json` for auto-loading):
```bash
agent-wallet sign msg "Hello" -n tron -p "Abc12345!" --save-runtime-secrets
```

### Signature Types

Every `sign` subcommand requires `--network` / `-n` to specify the chain:

**Sign a message:**
```bash
agent-wallet sign msg "Hello" -n tron
```

**Sign a transaction** (build the unsigned tx via RPC first):
```bash
agent-wallet sign tx '{"txID":"abc123...","raw_data_hex":"0a02...","raw_data":{...}}' -n tron
```

**Sign EIP-712 typed data:**
```bash
agent-wallet sign typed-data '{
  "types": {
    "EIP712Domain": [{"name":"name","type":"string"},{"name":"chainId","type":"uint256"}],
    "Transfer": [{"name":"to","type":"address"},{"name":"amount","type":"uint256"}]
  },
  "primaryType": "Transfer",
  "domain": {"name":"MyDApp","chainId":1},
  "message": {"to":"0x7099...","amount":1000000}
}' -n eip155:1
```

### Managing Multiple Wallets

**Add a new wallet:**
```bash
agent-wallet add
```

**Switch the active wallet:**
```bash
agent-wallet use my-bsc-wallet
```

**Sign with a specific wallet** (without switching the active one):
```bash
agent-wallet sign msg "Hello" -n eip155:56 -w my-bsc-wallet -p "Abc12345!"
```

**Inspect a wallet:**
```bash
agent-wallet inspect my-bsc-wallet
```

**List all wallets:**
```bash
agent-wallet list
```

**Remove a wallet:**
```bash
agent-wallet remove my-bsc-wallet
```

### Change Master Password

All key files are re-encrypted with the new password:

```bash
agent-wallet change-password
```

### Reset Everything

Deletes all contents under `~/.agent-wallet/`. **Irreversible** — requires confirmation:

```bash
agent-wallet reset
```

### Custom Storage Directory

All commands support `--dir` to specify a custom key storage path (default: `~/.agent-wallet`):

```bash
agent-wallet start --dir ./my-secrets
agent-wallet sign msg "Hello" --dir ./my-secrets
```

---

## What's Next

- Connect AI tools to your wallet → [Introduction — casual user path](./Intro.md)
- Sign from code → [SDK Quick Start](./SDKQuickStart.md)
- Browse common questions → [FAQ](./FAQ.md)
