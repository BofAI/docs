# CLI Quick Start

This guide walks you through installing Agent-wallet, initializing a wallet, and signing your first message or transaction from the command line. After completing these four steps, you'll have a locally encrypted wallet and be ready to sign messages and transactions via CLI.

The second half of this page is a full command reference — come back to it whenever you need it.

If you're a developer looking to call the signing interface directly from Python or TypeScript code, see [SDK Quick Start](./SDKQuickStart.md).

---

## Step 1: Install

### Check Your Node.js Version

Agent-wallet CLI requires Node.js ≥ 18. First check your current version:

```bash
node -v
```

If the output is `v18.0.0` or higher, you can jump straight to installation. Otherwise, follow the instructions below.

:::tip Install / Upgrade Node.js

We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions:

```bash
# Install nvm (skip if already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell config
source ~/.bashrc   # or source ~/.zshrc

# Install Node.js 18 LTS
nvm install 18

# Switch to Node.js 18
nvm use 18
```

You can also download the **LTS** installer directly from [nodejs.org](https://nodejs.org).

:::

### Install Agent-wallet CLI

```bash
npm install -g @bankofai/agent-wallet
```

Verify the installation:

```bash
agent-wallet --help
```

---

## Step 2: Initialize a Wallet

The `start` command handles initialization and wallet creation in one step. There are three options:

### Option A: Fully Automatic (Recommended for Beginners)

```bash
agent-wallet start
```

The system auto-generates a strong password and creates one TRON wallet and one EVM wallet:

```
🔐 Wallet initialized!

🪙 Wallets:
┌──────────────────────┬─────────────────┬──────────────────────────────────────────────┐
│ Wallet ID            │ Type            │ Address                                      │
├──────────────────────┼─────────────────┼──────────────────────────────────────────────┤
│ default_tron         │ tron_local      │ TB37...                                      │
│ default_evm          │ evm_local       │ 0xd679B...                                   │
└──────────────────────┴─────────────────┴──────────────────────────────────────────────┘

⭐ Active wallet: default_tron

🔑 Your master password: E&LCi*KL1Sp4mg4!
   ⚠️  Save this password! You'll need it for signing and other operations.
```

:::caution Security Tips
- **Keep your master password safe** — It's the only credential that decrypts all your private keys. If lost, it cannot be recovered. Use a password manager.
- **Never hardcode it in source code** — For non-interactive use, pass it via the `AGENT_WALLET_PASSWORD` environment variable instead.
- **Don't commit `.env` files** — Add `.env` to `.gitignore` to prevent passwords or keys from leaking into version control.
- **Use a dedicated wallet for agents** — Don't give an AI agent your personal wallet's private key. Create a separate wallet and fund it with only the amount the agent needs.
:::

### Option B: Custom Password

```bash
agent-wallet start -p Abc12345!
```

Password requirements: at least 8 characters, including uppercase, lowercase, numbers, and special characters.

### Option C: Import an Existing Private Key

If you already have a private key you'd like to import:

```bash
agent-wallet start -p Abc12345! -i tron
```

You'll be prompted to paste the private key (input is hidden):

```
🔐 Wallet initialized!
✔ Paste private key (hex)

🪙 Imported wallet:
┌──────────────────────┬─────────────────┬──────────────────────────────────────────────┐
│ Wallet ID            │ Type            │ Address                                      │
├──────────────────────┼─────────────────┼──────────────────────────────────────────────┤
│ default_tron         │ tron_local      │ TNmo...                                      │
└──────────────────────┴─────────────────┴──────────────────────────────────────────────┘

⭐ Active wallet: default_tron
```

The `-i` flag accepts `tron`, `evm`, `tron_local`, or `evm_local`.

---

## Step 3: View Your Wallets

List all wallets:

```bash
agent-wallet list
```

```
Wallets:
┌──────────────────────┬─────────────────┬──────────────────────────────────────────────┐
│ Wallet ID            │ Type            │ Address                                      │
├──────────────────────┼─────────────────┼──────────────────────────────────────────────┤
│* default_tron        │ tron_local      │ TB37...                                      │
│  default_evm         │ evm_local       │ 0xd679B...                                   │
└──────────────────────┴─────────────────┴──────────────────────────────────────────────┘
```

The `*` marks the currently active wallet, which is used by default for all signing operations.

---

## Step 4: Sign

### Sign a Message

```bash title="Input"
agent-wallet sign msg "Hello"
```

```text title="Output"
Master password: ********
Signature: 4a9c8f...e71b
```

### Sign a Transaction

Pass the transaction as a JSON string (you must build the unsigned transaction via RPC first):

```bash title="Input"
agent-wallet sign tx '{"txID":"abc123...","raw_data_hex":"0a02...","raw_data":{...}}'
```

```text title="Output"
Master password: ********
Signed tx:
{
  "txID": "abc123...",
  "signature": ["..."]
}
```

### Sign EIP-712 Typed Data

```bash title="Input"
agent-wallet sign typed-data '{
  "types": {
    "EIP712Domain": [{"name":"name","type":"string"},{"name":"chainId","type":"uint256"}],
    "Transfer": [{"name":"to","type":"address"},{"name":"amount","type":"uint256"}]
  },
  "primaryType": "Transfer",
  "domain": {"name":"MyDApp","chainId":1},
  "message": {"to":"0x7099...","amount":1000000}
}'
```

```text title="Output"
Master password: ********
Signature: 22008ffd...0e1c
```

---

## Command Reference

Once you've completed the quick start, refer to this section as needed.

### Skip the Password Prompt

Typing the password on every signing command gets tedious. Set an environment variable to skip the interactive prompt:

```bash
export AGENT_WALLET_PASSWORD="Abc12345!"
```

After this, all signing commands run without prompting:

```bash
agent-wallet sign msg "Hello"
agent-wallet sign tx '{"txID":"..."}'
```

You can also pass the password inline with `-p`:

```bash
agent-wallet sign msg "Hello" -p "Abc12345!"
```

### Manage Multiple Wallets

#### 1. Add a New Wallet

An interactive prompt lets you choose the wallet type (`tron_local` or `evm_local`) and generate or import a key:

```bash title="Input"
agent-wallet add
```

```text title="Output"
Master password: ********
Wallet name: my-bsc-wallet
> Wallet type: evm_local
> Private key: generate
Generated new private key.
  Address: 0x8c714fe3...
  Saved: id_my-bsc-wallet.json
Wallet 'my-bsc-wallet' added.
```

#### 2. Switch the Active Wallet

```bash title="Input"
agent-wallet use my-bsc-wallet
```

```text title="Output"
Active wallet: my-bsc-wallet (evm_local)
```

#### 3. Sign with a Specific Wallet

Use `-w` to sign with a specific wallet regardless of the active wallet setting:

```bash
agent-wallet sign msg "Hello" -w my-bsc-wallet -p "Abc12345!"
```

#### 4. Inspect a Wallet

```bash title="Input"
agent-wallet inspect my-bsc-wallet
```

```text title="Output"
Wallet      my-bsc-wallet
Type        evm_local
Address     0x8c714fe3...
Identity    id_my-bsc-wallet.json ✓
Credential  —
```

#### 5. Remove a Wallet

```bash title="Input"
agent-wallet remove my-bsc-wallet
```

```text title="Output"
Remove wallet 'my-bsc-wallet'? (y/N): y
  Deleted: id_my-bsc-wallet.json
Wallet 'my-bsc-wallet' removed.
```

### Other Operations

#### 1. Change Master Password

The master password is the only credential used to encrypt all local private keys. Agent-wallet never stores the master password itself — it uses the password to encrypt each key file. When you change it, all key files are re-encrypted with the new password.

```bash title="Input"
agent-wallet change-password
```

```text title="Output"
Current password: ********
New password: ********
Confirm new password: ********
Password changed. Re-encrypted 3 files.
```

#### 2. Reset All Data

```bash title="Input"
agent-wallet reset
```

```text title="Output"
⚠️  This will delete ALL wallet data in: /home/you/.agent-wallet
Are you sure you want to reset? This cannot be undone. (y/N): y
Really delete everything? Last chance! (y/N): y
✅ Wallet data reset complete.
```

Deletes everything in `~/.agent-wallet/`. This action is irreversible and requires double confirmation.

#### 3. Custom Storage Directory

All commands support `--dir` to specify a custom key storage directory (default: `~/.agent-wallet`):

```bash
agent-wallet start --dir ./my-secrets
agent-wallet sign msg "Hello" --dir ./my-secrets
```

---

## Next Steps

- Use signing in your code → [SDK Quick Start](./SDKQuickStart.md)
- Understand the design → [Introduction](./Intro.md)
- Browse common questions → [FAQ](./FAQ.md)
