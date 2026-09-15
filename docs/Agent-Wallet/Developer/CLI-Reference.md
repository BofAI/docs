# CLI Reference

A complete reference for every Agent-wallet command. Whether you're reviewing the basics or configuring automation scripts, you'll find the answer here.

:::tip Just getting started?
If you haven't created a wallet yet, head to [Quick Start](../QuickStart.md) first — three steps, under a minute.
:::

---

## Basic Commands

The core operations you'll use most often — creating wallets and signing.

### `agent-wallet start` (Initialize / Create Wallet)

**Interactive creation (recommended):**
```bash
agent-wallet start
```
The system walks you through choosing a wallet type, generating keys, and setting a master password. Just follow the prompts.

:::danger Avoid the `raw_secret` wallet type for real funds
The interactive wizard may offer a `raw_secret` option. This type stores your private key **unencrypted** on disk — any program with file system access can read it directly. Only use `raw_secret` in fully isolated test environments. For any wallet holding real funds, always choose `local_secure`.
:::

:::tip Privy wallet type
The wizard also offers a `privy` option for Privy-managed server wallets. This type delegates key custody to Privy's infrastructure — no local private key is stored on disk. You'll need a Privy App ID, App Secret, and Wallet ID to configure it:

```bash
agent-wallet start   # then choose "privy" when prompted
```

The default wallet ID for Privy wallets is `default_privy`.
:::

**Custom password:**
```bash
agent-wallet start local_secure -p Abc12345!
```
`-p` applies to `local_secure` only. Passing it to a bare `start` works when you then pick `local_secure` at the type prompt, but choosing `raw_secret` or `privy` there exits with `--password is only valid for local_secure quick start.` — naming the type on the command line, as above, avoids that.

Password requirements: at least 8 characters, including uppercase, lowercase, numbers, and special characters. A password typed at the interactive prompt is re-prompted until it passes; one supplied through `-p`, `AGENT_WALLET_PASSWORD`, or `runtime_secrets.json` is not — a weak value there prints the validation errors and exits 1.

When creating a new password interactively, you must enter it twice for confirmation. If the two entries don't match, the CLI will ask you to try again.

**Default wallet IDs:** If you don't specify a wallet ID, the system defaults to `default_secure` for `local_secure` wallets and `default_raw` for `raw_secret` wallets.

:::caution Shell history risk
Passing `-p` inline records the password in your terminal's history file. For production wallets, prefer interactive mode (`agent-wallet start` without `-p`) or set `AGENT_WALLET_PASSWORD` as an environment variable — see [Non-Interactive Execution](#non-interactive-execution-for-automation--background-services).
:::

**Import an existing private key:**
```bash
agent-wallet start -p Abc12345! -k your-private-key-hex
```

**Import a mnemonic:**
```bash
agent-wallet start -p Abc12345! -m "word1 word2 word3 ..."
```

#### Skip the prompts: name the wallet type directly

`start` and `add` also take the wallet type as a subcommand, which skips the type prompt. For CI or a background service you must also pass `-w` — without it the CLI still prompts for a wallet ID, and in a non-interactive environment that prompt fails with `Cannot prompt for wallet id in a non-interactive environment. Pass the required flags explicitly.` and exits 1:

```bash
agent-wallet start local_secure -w default_secure -p Abc12345! -g   # encrypted, generate a new key
agent-wallet start raw_secret -w default_raw -k your-private-key    # plaintext, dev only
agent-wallet start privy -w default_privy --app-id <id> --app-secret <secret> --privy-wallet-id <wallet>
```

`add` works the same way (`add local_secure` / `add raw_secret` / `add privy`) for a second wallet.

| Option | Applies to | Description |
| :--- | :--- | :--- |
| `-w, --wallet-id <id>` | all | Wallet ID to create |
| `-g, --generate` | `local_secure` | Generate a new random key |
| `-k, --private-key <hex>` | `local_secure`, `raw_secret` | Import a private key |
| `-m, --mnemonic <words>` | `local_secure`, `raw_secret` | Import a mnemonic |
| `-mi, --mnemonic-index <n>` | `local_secure`, `raw_secret` | Account index when deriving from the mnemonic |
| `--derive-as <profile>` | `local_secure`, `raw_secret` | Mnemonic derivation profile: `eip155` or `tron` |
| `-p, --password <pass>` | `local_secure` | Master password |
| `--app-id` / `--app-secret` / `--privy-wallet-id` | `privy` | Privy app credentials and wallet ID |
| `-d, --dir <path>` | all | Secrets directory (default `~/.agent-wallet`) |
| `--save-runtime-secrets` | `local_secure` | Persist the password to `runtime_secrets.json`. The `raw_secret` and `privy` paths never read it — they collect no password |
| `--override` | `start` only | Skip the confirmation prompt when wallets already exist |

Run `agent-wallet start local_secure --help` or `agent-wallet add privy --help` for the exact options of one mode.

### `agent-wallet sign` (Core Signing Operations)

For `local_secure` and `raw_secret` wallets, every `sign` subcommand requires `--network` / `-n` to specify the chain. Privy wallets are the exception: their chain type comes from Privy, and EVM transaction payloads carry their own `chainId`, so `--network` is optional for Privy signing.

:::info Password retry behavior
When signing with a `local_secure` wallet, the CLI will prompt for the master password if it's not provided via `-p`, `~/.agent-wallet/runtime_secrets.json`, or `AGENT_WALLET_PASSWORD` (in that order of precedence). If the password is wrong, the sign command fails immediately with exit code 1 ("Wrong password. Please try again."). The 3-attempt interactive retry loop applies to the `start`, `add`, `change-password`, and `resolve-address` prompts, not to `sign`.
:::

**Sign a message:**
```bash
agent-wallet sign msg "Hello" -n tron
# Output: Signature: d220de880cbc1c3f...
```

**Sign a transaction** (build the unsigned tx via RPC first):
```bash
agent-wallet sign tx '{"txID":"abc123...","raw_data_hex":"0a02...","raw_data":{...}}' -n tron
# Output: a line reading `Signed tx:` followed by the signed transaction as pretty-printed JSON
# (a single line is used only when the result is not valid JSON)
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

---

### `agent-wallet init` (Initialize Secrets Directory)

Initialize the secrets directory and set the master password — without creating a wallet yet. This is useful for advanced scenarios where you want to prepare the directory before adding wallets.

```bash
agent-wallet init
```

**Non-interactive mode:**
```bash
agent-wallet init -p 'Abc12345!'
```

| Flag | Description |
| :--- | :--- |
| `--password, -p <pw>` | Master password (skip prompt) |
| `--save-runtime-secrets` | Persist password to `runtime_secrets.json` |

:::tip When to use `init` vs `start`
`start` = `init` + create a wallet in one step. If you just need to set up the directory and password first (e.g., for a CI pipeline or when importing keys later), use `init` alone.
:::

---

## Wallet Management

Manage multiple wallets — add, switch, inspect, remove.

**Add a new wallet:**
```bash
agent-wallet add
```

**List all wallets:**
```bash
agent-wallet list
```

**Switch the active wallet:**
```bash
agent-wallet use my-bsc-wallet
```

**Inspect a wallet:**
```bash
agent-wallet inspect my-bsc-wallet
```

To see the wallet's derived addresses, use the separate `resolve-address` command:
```bash
agent-wallet resolve-address my-bsc-wallet
```

**Sign with a specific wallet** (without switching the active one):
```bash
agent-wallet sign msg "Hello" -n eip155:56 -w my-bsc-wallet -p 'Abc12345!'
```

**Remove a wallet:**
```bash
agent-wallet remove my-bsc-wallet
```

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--yes` | `-y` | Skip confirmation prompt (**required in non-interactive / agent contexts**) |

### `agent-wallet resolve-address` (Resolve Wallet Addresses)

Display the on-chain addresses associated with a wallet. Local wallets (`local_secure`, `raw_secret`) always show both an EVM and a TRON address. `local_secure` wallets (however created — a mnemonic import stores the single key derived under the chosen `--derive-as` profile) and private-key `raw_secret` wallets derive both addresses from the same stored key; only `raw_secret` **mnemonic** wallets derive each chain's address from the mnemonic via its own derivation path. Privy wallets show the single address reported by Privy.

```bash
agent-wallet resolve-address my-wallet
```

If you omit the wallet ID, the CLI will present an interactive list to choose from:

```bash
agent-wallet resolve-address
```

Example output:
```
Wallet  my-wallet
Type    local_secure

Addresses
EVM   0x742D35CC6634C0532925a3B844Bc9E7595F2bD18
TRON  TJRyWwFs9wTFGZg3JbrVriFbNfCug5tDeC
```

---

## Non-Interactive Execution (For Automation & Background Services)

By default, signing commands pause and prompt you to type your password interactively. But if an AI agent is running in the background, or you're running an automation script, this "stop and wait for input" behavior will cause the program to hang or error out.

To let the program run silently from start to finish (non-interactive mode), you need to pre-supply the password. Depending on your use case, there are three approaches:

### Method A: Environment Variable Injection (Recommended for AI Agents / CI Pipelines)

Store the password in the current system environment. When the program needs the password, it automatically retrieves it — fully silent:

```bash
export AGENT_WALLET_PASSWORD='Abc12345!'
```

Once set, all signing commands in the current window return results instantly, no more pausing:

```bash
agent-wallet sign msg "Hello" -n tron
agent-wallet sign tx '{"txID":"..."}' -n tron
```

:::tip Prevent this command from being recorded in shell history
To prevent the command from being recorded in shell history, edit `~/.zshrc` / `~/.bashrc` directly in a text editor rather than running the command in the terminal. Alternatively, prefix the command with a space — but only if you have verified that `HISTCONTROL=ignorespace` is active in Bash (`echo $HISTCONTROL`) or `HIST_IGNORE_SPACE` is active in Zsh (`setopt | grep HIST_IGNORE_SPACE`). These settings are **not** enabled by default on most systems and must be configured explicitly.
:::

:::caution Password contains special characters? Always use single quotes
```bash
# ✅ Correct — shell treats it literally
export AGENT_WALLET_PASSWORD='P@ss$w0rd!'

# ❌ Wrong — $ gets expanded by the shell, password silently breaks
export AGENT_WALLET_PASSWORD="P@ss$w0rd!"
```
:::

<details>
<summary>GitHub Actions / CI example</summary>

In CI/CD environments, never hardcode the password in workflow files. Use repository secrets instead:

```yaml
# .github/workflows/sign.yml
jobs:
  sign:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: agent-wallet sign msg "Hello" -n tron
        env:
          AGENT_WALLET_PASSWORD: ${{ secrets.AGENT_WALLET_PASSWORD }}
```

</details>

### Method B: Local Password Cache (Convenience vs. Security Trade-off)

After running a command once with the `--save-runtime-secrets` flag, the password is cached in a local file (`~/.agent-wallet/runtime_secrets.json`). The next time you run any signing command, the system automatically reads from the cache. No need for inline passwords or environment variables:

```bash
agent-wallet sign msg "Hello" -n tron -p 'Abc12345!' --save-runtime-secrets
```

:::danger This disables the dual-lock protection
Caching the password next to the wallet file means a single file system compromise grants full access to your funds — defeating Agent-wallet's core "physical file + password separation" security model. **Only use this for throwaway test wallets.**

`runtime_secrets.json` stores your master password in **plaintext**. Any program with access to your file system (malicious plugins, AI agents, automation scripts) can read it directly. Make sure this file is never committed to git or synced to the cloud.

The tool automatically sets restrictive file permissions (`600` — owner-read-only) on creation. If you've manually moved or copied the file, verify the permissions: `chmod 600 ~/.agent-wallet/runtime_secrets.json`.

To remove the cached password and restore full dual-lock protection:

```bash
rm ~/.agent-wallet/runtime_secrets.json
```

After deletion, signing commands will prompt for the password interactively again (or read from `AGENT_WALLET_PASSWORD` if set).
:::

### Method C: Inline `-p` Flag (For One-Off Commands)

Pass the password directly at the end of the command. The program takes the password and runs immediately — no prompts:

```bash
agent-wallet sign msg "Hello" -n tron -p 'Abc12345!'
```

:::danger Security Warning
When using `-p` to pass the password inline, the plaintext password is recorded in your terminal's `history`. Only use this method in fully isolated test environments!
:::

### Custom Storage Directory

All commands support the `--dir` flag to specify a custom Agent-wallet storage path (default: `~/.agent-wallet`). For example, you can store your Agent-wallet directly on an encrypted USB drive — plug and play, unplug and go:

```bash
agent-wallet start --dir /Volumes/MyUSB/agent-wallet
agent-wallet sign msg "Hello" -n tron --dir /Volumes/MyUSB/agent-wallet
```

---

## Dangerous Operations

:::danger The following operations are irreversible — use with extreme caution!
:::

### `agent-wallet change-password` (Change Master Password)

After changing, **all key files are re-encrypted with the new password**. The old password becomes invalid immediately — make sure to update your password manager.

**Interactive mode (default):**
```bash
agent-wallet change-password
```

**Non-interactive mode** (for automation scripts):
```bash
agent-wallet change-password -p 'OldPassword123!' --new-password 'NewPassword456!'
```

| Flag | Description |
| :--- | :--- |
| `--password, -p <pw>` | Current master password (skip prompt) |
| `--new-password <pw>` | New master password (skip prompt) |
| `--save-runtime-secrets` | Update cached password in `runtime_secrets.json` |

:::caution
Both `-p` and `--new-password` will be recorded in shell history. For production use, prefer interactive mode or pipe passwords from a secrets manager.
:::

### `agent-wallet reset` (Reset All Data)

Deletes the files the CLI manages inside `~/.agent-wallet/` — `master.json`, `wallets_config.json`, `runtime_secrets.json`, and every `secret_*.json`. **This is a nuclear option — once executed, all wallets, keys, and configuration are gone, with no recovery.** The directory itself and anything else in it (including `cred_*.json`) are left in place. The CLI asks for confirmation **twice**; pass `-y/--yes` to skip both prompts in automation.

```bash
agent-wallet reset
```

---

## Real-World Example: Signing in a Shell Script

The CLI isn't just for manual typing — it integrates perfectly into your automation scripts.

This minimal example demonstrates how to perform a non-interactive signing operation in a Bash script and capture the signature into a variable (the CLI prints `Signature: <hex>`, so the prefix is stripped with `sed`):

```bash
#!/bin/bash
# Enable strict mode: stop immediately on any error
set -e

# 1. Password should already be set in the environment before running this script.
#    e.g. via ~/.zshrc / ~/.bashrc — see "Save and Activate the Password" in QuickStart.
#    NEVER hardcode a real password in a script file (it will end up in git history).
if [[ -z "$AGENT_WALLET_PASSWORD" ]]; then
  echo "Error: AGENT_WALLET_PASSWORD not set" >&2
  exit 1
fi

echo "Calling local Agent-wallet for signing..."

# 2. Core operation: execute signing, capture the hash output into the SIGNATURE variable
SIGNATURE=$(agent-wallet sign msg "Hello from my script" -n tron | sed 's/^Signature: //')

# 3. Got the clean signature value — continue with downstream logic
echo "✅ Signing successful!"
echo "Extracted signature: $SIGNATURE"

# From here, you can use $SIGNATURE to build requests, construct JSON, or pass it to other pipeline tasks...
```

---

## Next Steps

- New to this? → [Quick Start](../QuickStart.md)
- Building your own agent? → [SDK Guide](./SDK-Guide.md)
- Looking for ready-made code? → [SDK Cookbook](./SDK-Cookbook.md)
- Common questions → [FAQ](../FAQ.md)
