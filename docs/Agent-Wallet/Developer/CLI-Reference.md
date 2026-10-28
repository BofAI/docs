# CLI Reference

A complete reference for every `agent-wallet` 3.x command. Whether you're reviewing the basics or configuring automation scripts, you'll find the answer here.

:::tip Just getting started?
If you haven't created a wallet yet, head to [Quick Start](../QuickStart.md) first.
:::

```
Usage: agent-wallet <command> [options]

Commands:
  start             Quick setup: init + configure wallet
  add               Add a wallet configuration
  list              List all configured wallets
  use [id]          Set the active wallet
  inspect <id>      Show wallet details
  resolve-address [id]  Resolve wallet addresses
  remove [id]       Remove a wallet
  sign              Sign transactions or typed data
  reset             Delete all wallet data
```

Every command accepts `--dir, -d <path>` (wallet directory, default `~/.agent-wallet`, or `AGENT_WALLET_DIR` when set) and `--help, -h`. Add `-h` after any command or subcommand — for example `agent-wallet start wallet_cli -h` — to see its exact options.

:::caution Removed in 3.0
`init`, `change-password`, `sign msg`, the `local_secure` wallet type, and the `-p/--password` and `--save-runtime-secrets` flags no longer exist; `-g/--generate` is still parsed but ignored — 3.x does not generate keys. Agent-wallet 3.x has no master password and does not generate keys.
:::

---

## Basic Commands

### `agent-wallet start` (Create a Wallet and Make It Active)

```bash
agent-wallet start                       # interactive: choose a wallet type
agent-wallet start <raw_secret|privy|wallet_cli> [options]
```

Creates the wallet directory if needed, adds one wallet, and makes it the **active** wallet. If wallets already exist, `start` first asks whether to `add` another or `exit`; pass `--override` to skip that question.

Naming the wallet type as a subcommand skips the type prompt. For CI or a background service, also pass `-w` and every credential flag — without them the CLI prompts, and prompts fail in a non-interactive environment. If wallets may already exist, pass `--override` too; otherwise the add/exit question can't be asked and `start` exits 1.

| Option | Applies to | Description |
| :--- | :--- | :--- |
| `-w, --wallet-id <id>` | all | Wallet ID to create. Prompt defaults: `default_raw`, `default_privy`, `default_cli` |
| `--override` | `start` only | Skip the "already initialized" prompt when wallets already exist |
| `-k, --private-key <hex>` | `raw_secret` | Import a hex private key |
| `-m, --mnemonic <words>` | `raw_secret` | Import a BIP-39 mnemonic |
| `-mi, --mnemonic-index <n>` | `raw_secret` | Account index for the mnemonic (default `0`; requires `-m`) |
| `--derive-as <profile>` | `raw_secret` | `eip155` or `tron`; answers the mnemonic derivation prompt (3.0.0 checks the value but does not store it, so it does not change the derived addresses) |
| `--app-id <id>` | `privy` | Privy app ID |
| `--app-secret <secret>` | `privy` | Privy app secret (plaintext; prefer `--app-secret-exec`) |
| `--app-secret-exec <path>` | `privy` | Executable that prints the Privy app secret |
| `--privy-wallet-id <id>` | `privy` | Existing Privy wallet ID |
| `--account <label>` | `wallet_cli` | Existing wallet-cli account label or ID (the wallet-cli active account if omitted) |
| `--cli-password-exec <path>` | `wallet_cli` | Executable that prints the wallet-cli keystore password |
| `-d, --dir <path>` | all | Wallet directory |

#### `wallet_cli` wallets

Links an existing [wallet-cli](../../wallet-cli/quickstart.md) account as a TRON + EVM signer. **It does not create or import keys** — create the account with wallet-cli first.

```bash
agent-wallet start wallet_cli \
  --wallet-id my_cli_wallet \
  --account main-1 \
  --cli-password-exec /absolute/path/to/fetch-password.sh
```

- Requires `@tron-walletcli/wallet-cli` `>=4.13.0 <5.0.0`. Agent-wallet looks for it in this order: `AGENT_WALLET_WALLET_CLI_PATH`, a copy installed as a local package dependency alongside Agent-wallet, then `wallet-cli` on your `PATH`. If it is missing, the command prints install guidance and exits 1.
- The account is checked with wallet-cli **before** any password is collected; the canonical account ID is saved, so later changes to wallet-cli's active account don't affect this wallet.
- `--cli-password <plaintext>` is rejected so the password never lands in shell history or the process list. Without `--cli-password-exec`, an interactive prompt offers `direct` (stored as plaintext in `wallets_config.json`, mode `0600`) or `exec`.

#### Privy wallets {#privy-wallets}

Links an existing [Privy](https://privy.io) server wallet. No private key is stored on your disk; signing calls Privy's API, so it needs network access.

```bash
agent-wallet start privy -w default_privy \
  --app-id <privy-app-id> \
  --app-secret-exec /absolute/path/to/fetch-privy-secret.sh \
  --privy-wallet-id <privy-wallet-id>
```

#### `raw_secret` wallets

:::danger Avoid `raw_secret` for real funds
This type stores your private key or mnemonic **unencrypted** in `wallets_config.json` — any program with file system access can read it. Only use it with throwaway keys in isolated test environments.
:::

```bash
agent-wallet start raw_secret -w default_raw -k <private-key-hex>
agent-wallet start raw_secret -w default_raw -m "word1 word2 ..." --derive-as eip155
```

### `agent-wallet add` (Add Another Wallet)

```bash
agent-wallet add
agent-wallet add <raw_secret|privy|wallet_cli> [options]
```

Same subcommands and options as `start` (except `--override`). The new wallet becomes active only if no wallet was active before; switch with `use`.

### `agent-wallet sign` (Core Signing Operations)

```bash
agent-wallet sign tx '<json>' -n <network> [-w <wallet-id>]
agent-wallet sign typed-data '<json>' -n <network> [-w <wallet-id>]
```

| Option | Short | Description |
| :--- | :--- | :--- |
| `--network` | `-n` | Canonical CAIP-2 network: `eip155:<chainId>` or `tron:<chainId>`. **Required for `raw_secret` and `wallet_cli`.** Optional for `privy` (EVM transactions use the payload's `chainId`), but must be canonical if given |
| `--wallet-id` | `-w` | Wallet to sign with (defaults to the active wallet) |
| `--dir` | `-d` | Wallet directory |

Only exact canonical identifiers are accepted — `tron`, `eip155`, `evm:1`, `tron:nile`, `tron:mainnet`, hex TRON ids, and any case or whitespace variants are rejected. Use `tron:728126428` (mainnet), `tron:3448148188` (Nile), `tron:2494104990` (Shasta), `eip155:1`, `eip155:56`, `eip155:97`, and so on. For `wallet_cli` wallets the network must also be one wallet-cli itself knows — its built-ins (`eip155:1`, `eip155:11155111`, `eip155:56`, `eip155:97`, `eip155:8453`, `eip155:84532` (the two Base networks were added in wallet-cli 4.14.0) and the three TRON networks) or a network added to wallet-cli's own config — otherwise signing fails with `wallet-cli network '<id>' is unavailable` (code `network_mismatch` in the SDK). `raw_secret` and `privy` wallets have no such limit.

**Sign a TRON transaction** (build the unsigned transaction first, e.g. via TronGrid; `raw_data_hex` is required, and `wallet_cli` wallets also need `raw_data` and a matching `txID`):
```bash
agent-wallet sign tx '{"txID":"...","raw_data_hex":"0a02...","raw_data":{}}' -n tron:3448148188
# Output: "Signed tx:" followed by the signed transaction as pretty-printed JSON
```

**Sign an EVM transaction** (`chainId` should match `-n`; `wallet_cli` wallets reject a mismatch with a `SigningError`, `raw_secret` and `privy` sign with the payload's `chainId`):
```bash
agent-wallet sign tx '{"chainId":97,"nonce":0,"gas":"0x5208","gasPrice":"0x3b9aca00","to":"0x...","value":"0x0"}' -n eip155:97
# Output: Signed tx: <raw transaction hex, without 0x>
```

**Sign EIP-712 / TIP-712 typed data:**
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
# Output: Signature: <hex, without 0x>
```

:::note No message signing
`sign msg` was removed in 3.0. Agent-wallet only signs transactions and typed data.
:::

---

## Wallet Management

Manage multiple wallets — add, switch, inspect, remove.

**List all wallets** (`*` marks the active one):
```bash
agent-wallet list
```

**Switch the active wallet** (omit the ID to pick from a list):
```bash
agent-wallet use my-bsc-wallet
```

**Inspect a wallet** (secrets are always shown as `[redacted]`):
```bash
agent-wallet inspect my-bsc-wallet
```

**Sign with a specific wallet** (without switching the active one):
```bash
agent-wallet sign typed-data '<json>' -n eip155:56 -w my-bsc-wallet
```

**Remove a wallet** (omit the ID to pick from a list):
```bash
agent-wallet remove my-bsc-wallet
```

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--yes` | `-y` | Skip confirmation prompt (**required in non-interactive / agent contexts**) |

Removing a `wallet_cli` or `privy` wallet only deletes Agent-wallet's configuration entry — the wallet-cli account or Privy wallet itself is untouched.

### `agent-wallet resolve-address` (Resolve Wallet Addresses)

Display the on-chain addresses associated with a wallet, without signing:

- `raw_secret` wallets show both an EVM and a TRON address derived from the same secret material.
- `wallet_cli` wallets show both addresses when the wallet-cli account has both families (one address otherwise). No password is requested.
- `privy` wallets show the single address reported by Privy.

```bash
agent-wallet resolve-address my-wallet
```

If you omit the wallet ID, the CLI will present an interactive list to choose from.

Example output:
```
Wallet  my-wallet
Type    raw_secret

Addresses
EVM   0x742D35CC6634C0532925a3B844Bc9E7595F2bD18
TRON  TJRyWwFs9wTFGZg3JbrVriFbNfCug5tDeC
```

---

## Non-Interactive Execution (For Automation & Background Services)

There is no master password to supply in 3.x. To run without prompts:

- **Creating wallets:** name the type and pass every value as a flag (`-w`, `-k`/`-m` plus `--derive-as`, `--app-id`/`--privy-wallet-id`, `--account`). With `start`, add `--override` when wallets may already exist — otherwise it exits 1. For `privy`, pass **both** `--app-id` and `--app-secret-exec` (or `--app-secret`): when a Privy wallet already exists and neither `--app-id` nor `--app-secret` is passed (`--app-secret-exec` alone does not count), the CLI asks whether to reuse its credentials; with `--app-id` but no secret it asks where the secret comes from. Either prompt exits 1 non-interactively.
- **Secrets:** use exec scripts — `--cli-password-exec` for wallet-cli, `--app-secret-exec` for Privy. The path must point to an executable file (not an inline shell command). It inherits the process environment, its trimmed stdout is used as the secret, and it times out after 10 seconds by default. For `wallet_cli` the script runs again for **every** signature.
- **Signing:** always pass `-n`, and `-w` if you don't want to depend on the active wallet.
- **Removing / resetting:** pass `-y`.
- **Check flag spelling:** the CLI ignores flags it does not recognise instead of failing, so a misspelled flag (for example `--walet-id`) silently falls back to a prompt or a default.

`wallets_config.json` holds `active_wallet` and a `wallets` map keyed by wallet ID; each entry has a `type` and `params`: `raw_secret` → `source` with `private_key`, or `mnemonic` plus `account_index`; `privy` → `app_id`, `app_secret`, `wallet_id`; `wallet_cli` → `account` (optional) and `password`. `app_secret` and `password` are either a string or an exec reference (`private_key` and `mnemonic` are plain strings) (`timeout` in milliseconds is optional):

```json
{ "exec": "/absolute/path/to/fetch-password.sh", "timeout": 10000 }
```

### Custom Storage Directory

All commands support `--dir` to use a wallet directory other than `~/.agent-wallet`. Set `AGENT_WALLET_DIR` to make it the default for both the CLI and the SDK:

```bash
agent-wallet start raw_secret --dir /Volumes/MyUSB/agent-wallet
agent-wallet list --dir /Volumes/MyUSB/agent-wallet
```

### Environment Variables

| Variable | Purpose |
| :--- | :--- |
| `AGENT_WALLET_DIR` | Default wallet directory (CLI and SDK) |
| `AGENT_WALLET_WALLET_CLI_PATH` | Path to the wallet-cli executable or its JavaScript entrypoint, when it is not on `PATH` |
| `AGENT_WALLET_PRIVATE_KEY` / `AGENT_WALLET_MNEMONIC` / `AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX` | SDK environment fallback only (used when no wallet is configured) — see [SDK Guide](./SDK-Guide.md#environment-variable-fallback) |

---

## Dangerous Operations

:::danger The following operations are irreversible — use with extreme caution!
:::

### `agent-wallet reset` (Reset All Data) {#agent-wallet-reset-reset-all-data}

Deletes `wallets_config.json` from the wallet directory — every wallet configuration, including any `raw_secret` keys stored in it. Other files in the directory are left in place. wallet-cli accounts and Privy wallets themselves are not affected. The CLI asks for confirmation **twice**; pass `-y/--yes` to skip both prompts in automation.

```bash
agent-wallet reset
```

---

## Real-World Example: Signing in a Shell Script

This minimal example performs a non-interactive typed-data signature in a Bash script and captures the result into a variable. The CLI prints `Signature: <hex>`, so the script strips the prefix and checks that what remains is a 130-character hex signature. It deliberately avoids piping into `sed`: in a pipeline the exit status is the last command's, so a failed signature would still look successful.

```bash
#!/bin/bash
# Strict mode: stop on errors, unset variables, and failures inside pipelines
set -euo pipefail

# Typed data to sign (built by your own logic)
TYPED_DATA='{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"chainId","type":"uint256"}],"Message":[{"name":"contents","type":"string"}]},"primaryType":"Message","domain":{"name":"MyScript","chainId":56},"message":{"contents":"Hello from my script"}}'

echo "Calling local Agent-wallet for signing..."

# On failure the CLI exits non-zero and prints the reason (e.g. "Wallet 'my-bsc-wallet' not found")
if ! OUTPUT=$(agent-wallet sign typed-data "$TYPED_DATA" -n eip155:56 -w my-bsc-wallet); then
  echo "❌ Signing failed: $OUTPUT" >&2
  exit 1
fi

SIGNATURE=${OUTPUT#Signature: }
if [[ ! "$SIGNATURE" =~ ^[0-9a-fA-F]{130}$ ]]; then
  echo "❌ Unexpected output: $OUTPUT" >&2
  exit 1
fi

echo "✅ Signing successful!"
echo "Extracted signature: $SIGNATURE"
```

---

## Next Steps

- New to this? → [Quick Start](../QuickStart.md)
- Building your own agent? → [SDK Guide](./SDK-Guide.md)
- Looking for ready-made code? → [SDK Cookbook](./SDK-Cookbook.md)
- Common questions → [FAQ](../FAQ.md)
