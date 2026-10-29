import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start

:::note
Agent Wallet documentation covers the `@bankofai/agent-wallet` 3.x SDK and CLI used by existing SDK, server, and community integrations. The official setup entry for new users is [wallet-cli](../wallet-cli/quickstart.md). Agent-wallet can link a wallet-cli account (Path A below), but never imports or decrypts wallet-cli keys.
:::

From zero to a working Agent-wallet that your AI agent or your own code can sign with. Pick one path:

- **Path A — Link a wallet-cli account (recommended for real funds).** Keys stay in wallet-cli's encrypted keystore.
- **Path B — Import a raw secret (development only).** The private key or mnemonic is stored **in plaintext** in `~/.agent-wallet/wallets_config.json`.

Privy users: see [CLI Reference → Privy](./Developer/CLI-Reference.md#privy-wallets).

:::tip Prerequisites & CLI command details
- Your AI Agent supports shell command execution (OpenClaw, a Telegram bot, web chat, Claude Code, Cursor, etc.), or you are integrating the SDK into your own code.
- This page only walks you through the shortest path. For every command and flag, see the [CLI Reference](./Developer/CLI-Reference.md).
:::

:::caution Upgrading from 2.x?
3.0 removed `local_secure`, the master password, `AGENT_WALLET_PASSWORD`, and `runtime_secrets.json`, and the bundled `agent-wallet` / `bankofai-guide` conversational Skills were removed in Skills 3.0.0. Existing `local_secure` wallets are not converted. See the [FAQ](./FAQ.md#upgrade-from-2x) before upgrading.
:::

---

## Step 1: Install

### 1.1 Prepare Your Environment: Install Node.js

Agent-wallet and wallet-cli (Path A) both require **Node.js 22.23.4+ (22.x), 24.22.1+ (24.x), or 26.12.1+** — the October 2026 security releases (the published agent-wallet `3.0.0` still declares `>=18`; wallet-cli `4.15.1` and the next agent-wallet release declare this range). An up-to-date LTS install satisfies this.

Open a terminal (Mac users press `Command + Space` and search for "Terminal"), then type:

```bash
node -v
```

- **If the output is `v22.23.4`+ (22.x), `v24.22.1`+ (24.x), or `v26.12.1`+:** Great, skip straight to 1.2!
- **If there's no output, an error, or an older version:** go to the **[Node.js official website](https://nodejs.org)** and download the latest **LTS** installer. After installation, close and reopen your terminal, then run `node -v` again to confirm.

<details>
<summary>Developer preferred: Install via nvm (beginners can skip this)</summary>

```bash
# 1. Install nvm (skip if already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. Reload your terminal config
source ~/.bashrc   # zsh users: source ~/.zshrc

# 3. Install and switch to the current Node.js LTS
nvm install --lts && nvm use --lts
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

If you see `Usage: agent-wallet <command> [options]` followed by the command list, you're good to go.

---

## Step 2: Create Your Wallet

<Tabs>
<TabItem value="wallet-cli" label="Path A: wallet-cli (recommended)" default>

**2.1 Install a compatible wallet-cli** (Agent-wallet 3.x supports `>=4.13.0 <5.0.0`):

```bash
npm install -g '@tron-walletcli/wallet-cli@^4.13.0'
wallet-cli --version
```

**2.2 Create (or import) a wallet-cli account.** On first use wallet-cli sets up `~/.wallet-cli` and asks you to set its master password in the terminal:

```bash
wallet-cli create --label main-1 -o json
```

To restore an existing wallet instead, run `wallet-cli import mnemonic --label main-1 -o json` or `wallet-cli import private-key --label main-1 -o json`. Mnemonics, private keys and the password are entered at hidden prompts — never put them in command arguments, environment variables, logs, or chats. See the [wallet-cli Quick Start](../wallet-cli/quickstart.md) for backup.

**2.3 Create a password script** so the wallet-cli password is never stored in Agent-wallet's config. The script just prints the password to stdout — for example with the 1Password CLI:

```bash
#!/bin/sh
op read 'op://Private/wallet-cli-password/password'
```

Save it (for example as `~/bin/fetch-wallet-cli-password.sh`) and make it executable with `chmod +x`.

**2.4 Link the account to Agent-wallet:**

```bash
agent-wallet start wallet_cli \
  --wallet-id my_cli_wallet \
  --account main-1 \
  --cli-password-exec /absolute/path/to/fetch-wallet-cli-password.sh
```

Agent-wallet first checks that wallet-cli is compatible and that the account exists (without asking for the password), then saves the canonical account ID. Expected output ends with:

```
Wallet 'my_cli_wallet' created:
...
Active wallet: my_cli_wallet

Quick guide:
...
```

:::tip Typing the password instead of using a script
Run `agent-wallet start wallet_cli` without `--cli-password-exec` and pick `direct` at the password-source prompt. The password is then stored as a plaintext string in `wallets_config.json` (file mode `0600`). `inspect` always shows it as `[redacted]`, but any program that can read the file can read the password. Passing `--cli-password <password>` on the command line is rejected.
:::

</TabItem>
<TabItem value="raw-secret" label="Path B: raw_secret (dev only)">

:::danger Plaintext storage
`raw_secret` writes your private key or mnemonic **unencrypted** to `~/.agent-wallet/wallets_config.json`. Any program that can read files in your home directory can read it. Use only throwaway test keys.
:::

Agent-wallet 3.x does not generate keys — import an existing test key:

```bash
agent-wallet start raw_secret --wallet-id dev_wallet
```

At the prompts, choose `private_key` (or `mnemonic`) and paste the value. Expected output:

```
Warning: Raw secret material will be stored in plaintext in wallets_config.json.
...
Wallet 'dev_wallet' created:
...
Active wallet: dev_wallet

Quick guide:
...
```

</TabItem>
</Tabs>

---

## Step 3: Check the Wallet

**Show the addresses** (no signing, no password needed):

```bash
agent-wallet resolve-address
```

Pick your wallet from the list. A `raw_secret` wallet, or a wallet-cli account that has both chain families, prints an EVM and a TRON address:

```
Wallet  my_cli_wallet
Type    wallet_cli

Addresses
EVM   0x...
TRON  T...
```

**Make a test signature** on a testnet. Every signing command needs a canonical network with `-n`:

```bash
agent-wallet sign typed-data '{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"chainId","type":"uint256"}],"Message":[{"name":"contents","type":"string"}]},"primaryType":"Message","domain":{"name":"AgentWallet","chainId":97},"message":{"contents":"hello"}}' -n eip155:97
```

Success prints `Signature: <hex>`.

---

## Step 4: Point Your Agent at the Wallet

There is **no password environment variable** to set in 3.x. Any tool or code that uses the Agent-wallet SDK resolves the active wallet from `~/.agent-wallet/wallets_config.json` automatically.

- If you stored the wallet somewhere else with `--dir`, set `AGENT_WALLET_DIR` to that directory in the environment your agent runs in.
- If you used `--cli-password-exec`, make sure the script works in that environment too (for example, the 1Password CLI must be signed in for the user the agent runs as).
- After changing environment variables, restart your AI agent backend so it picks them up.

---

## You've Completed the Full Flow

| I want to… | Go here |
| :--- | :--- |
| Prefer the command line? | [CLI Reference](./Developer/CLI-Reference.md) |
| Building your own agent? | [SDK Guide](./Developer/SDK-Guide.md) |
| Looking for ready-made code? | [SDK Cookbook](./Developer/SDK-Cookbook.md) |
| Understand the security design | [Introduction](./Intro.md) |
| Check common questions | [FAQ](./FAQ.md) |
