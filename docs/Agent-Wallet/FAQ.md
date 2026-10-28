# FAQ

Let's answer the things you're probably most worried about, then cover the day-to-day details.

---

## 💰 Will AI drain my entire wallet?

The best protection is to limit what's at stake: **create a dedicated wallet just for your AI agent**, topped up with only the small amount it actually needs (e.g., enough to cover gas fees). Your main wallet and large holdings never get touched. Worst case, the loss is limited to whatever was in that small agent wallet.

```bash
# Create a dedicated wallet-cli account for your agent, then link it
wallet-cli create --label agent-small -o json
agent-wallet add wallet_cli --wallet-id agent_small --account agent-small \
  --cli-password-exec /absolute/path/to/fetch-password.sh
```

With a `wallet_cli` wallet, the key itself sits in wallet-cli's encrypted keystore — Agent-wallet's config only holds the wallet-cli account ID and a password source.

---

## 🔌 Can my AI still sign if I go offline?

`raw_secret` wallets sign in-process with no network calls, and `wallet_cli` wallets sign in a local wallet-cli subprocess. The `privy` wallet type is different: the key is custodied by Privy and signing requests go to Privy's API, so it needs network by design.

Going offline mainly affects building and broadcasting transactions (the MCP server's or your own code's job).

---

## 🔑 Is there still a master password? What if I forget it?

### I used `local_secure` and `AGENT_WALLET_PASSWORD` in 2.x — what now? {#upgrade-from-2x}

Agent-wallet 3.0 removed the `local_secure` wallet type, the agent-wallet master password, `AGENT_WALLET_PASSWORD`, `runtime_secrets.json`, and the `init`, `change-password` and `sign msg` commands. 3.x does not read or convert `local_secure` wallets.

Before upgrading:

1. Back up `~/.agent-wallet`.
2. With 2.x still installed, make sure you can access the original private key or mnemonic.
3. Move the 2.x directory out of the way, for example `mv ~/.agent-wallet ~/.agent-wallet-2x`. 3.x rejects a `wallets_config.json` that still lists `local_secure` wallets (`Invalid wallet config`), so every command that loads the config — including `start` — fails until the old file is gone (`reset` still works). Alternatively, point 3.x at a new directory with `--dir` or `AGENT_WALLET_DIR`.
4. After upgrading, re-create the wallet with one of the 3.x types:
   - **Local production signing:** import the key into wallet-cli (`wallet-cli import private-key` or `wallet-cli import mnemonic`), then `agent-wallet start wallet_cli`.
   - **Hosted signing:** `agent-wallet start privy`.
   - **Development only:** `agent-wallet start raw_secret`.
5. Confirm the new wallet resolves the expected address (`agent-wallet resolve-address`) and can sign, then delete the old 2.x directory yourself.

Also update environment variables: `TRON_PRIVATE_KEY`, `TRON_MNEMONIC` and `TRON_ACCOUNT_INDEX` are no longer read — use `AGENT_WALLET_PRIVATE_KEY`, `AGENT_WALLET_MNEMONIC` and `AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX`. Network values must be canonical (`tron:728126428`, `tron:3448148188`, `eip155:1` …).

### What if I forget the wallet-cli password?

The password that protects a `wallet_cli` wallet belongs to wallet-cli's keystore, not to Agent-wallet. Agent-wallet cannot recover it. Restore the account in wallet-cli from your mnemonic or private-key backup (`wallet-cli import mnemonic` / `wallet-cli import private-key`), then link it to Agent-wallet again.

---

## Everyday Use

### What exactly is Agent-wallet?

A signing layer for AI agents. It gives your code one interface — `getAddress`, `signTransaction`, `signTypedData` — and routes each request to the key backend you configured (`wallet_cli`, `privy`, or `raw_secret`). It doesn't build or broadcast transactions, and it has no UI of its own.

### Agent-wallet or wallet-cli — which do I need?

- **wallet-cli** holds keys (encrypted keystore) and is the official setup entry for new users and BANK OF AI tools. See [wallet-cli](../wallet-cli/quickstart.md).
- **Agent-wallet** is for code that is built on the `@bankofai/agent-wallet` SDK. With the `wallet_cli` type it signs through your wallet-cli account, so both can share one key.

### CLI vs SDK — which do I need?

- **CLI** — command-line tool for configuring wallets and manually testing signatures
- **SDK** — TypeScript library for calling signing directly from your own code

The SDK reads the configuration the CLI creates.

### Can I sign a plain message?

No. 3.x signs transactions and EIP-712 / TIP-712 typed data only; `sign msg`, `signMessage()` and `signRaw()` were removed.

### How many wallets can I create on one machine?

No limit. You can configure separate wallets for different AI agents, different chains, or different purposes. Use `agent-wallet add` to add and `agent-wallet use` to switch between them.

---

## Wallet Types

### What's the difference between `wallet_cli`, `privy`, and `raw_secret`?

| | `wallet_cli` | `privy` | `raw_secret` |
| :--- | :---: | :---: | :---: |
| **Key storage** | ✅ wallet-cli encrypted keystore | ☁️ Privy cloud custody | ❌ Plaintext in `wallets_config.json` |
| **If an agent reads Agent-wallet's config** | ✅ No key inside (only a wallet-cli account ID and password source) | ✅ No key inside (API credentials; the app secret can be an exec script) | ❌ Key stolen instantly |
| **Network needed to sign** | No | Yes (Privy API) | No |
| **Use case** | ✅ Local production signing | ✅ Server-side agents with Privy | ⚠️ Fully isolated dev only |

:::danger `raw_secret` exposes your private key as plaintext
Any process that can read files in your home directory can read the key. Use `raw_secret` only with throwaway keys in a fully isolated test environment.
:::

:::tip Store wallet-cli and Privy secrets as exec scripts
Use `--cli-password-exec` / `--app-secret-exec` so the secret is fetched (for example from 1Password) when needed instead of being written into `wallets_config.json`. A password typed at the `direct` prompt is stored there in plaintext (file mode `0600`).
:::

### What values does the `network` parameter accept?

Exact canonical CAIP-2 identifiers only:

| Value | Description |
| :--- | :--- |
| `tron:728126428` | TRON Mainnet |
| `tron:3448148188` | TRON Nile Testnet |
| `tron:2494104990` | TRON Shasta Testnet |
| `eip155:1` | Ethereum Mainnet |
| `eip155:56` | BSC Mainnet |
| `eip155:97` | BSC Testnet |
| `eip155:137` | Polygon Mainnet |
| `eip155:8453` | Base Mainnet |
| `eip155:42161` | Arbitrum Mainnet |

> These are common examples, not a whitelist: any `eip155:<positive chainId>` or `tron:<positive chainId>` is accepted. Aliases (`tron:nile`, `tron:mainnet`, `evm:1`), bare `tron` / `eip155`, hex TRON ids such as `tron:0x2b6653dc`, and case or whitespace variants are rejected.
>
> For `wallet_cli` wallets the network must also be one wallet-cli itself knows — its built-ins (`eip155:1`, `eip155:11155111`, `eip155:56`, `eip155:97`, `eip155:8453`, `eip155:84532` (the two Base networks were added in wallet-cli 4.14.0) and the three TRON networks in the table) or a network added to wallet-cli's own config — otherwise signing fails with `network_mismatch`. `raw_secret` and `privy` wallets have no such limit.

---

## Security

### Does the private key ever leave my machine?

For `raw_secret` and `wallet_cli` wallets, signing happens locally — Agent-wallet makes no network request to sign. `privy` wallets are the exception: the key is custodied by Privy (it never sits on your disk), and signing requests go to Privy's API.

### How does a `wallet_cli` wallet handle the password?

Agent-wallet never reads or decrypts the wallet-cli keystore. For each signature it pins the configured account and network, obtains the password (running the exec script again each time, 10-second default timeout), writes it only to that one wallet-cli subprocess's stdin, and checks that the returned signer matches the account. The password is never passed on the command line.

### How should I store secrets securely?

- ✅ Use a password manager (1Password, Bitwarden) and reference it with an exec script
- ❌ Don't hardcode secrets in source code or pass them as command-line arguments
- ❌ Don't commit `~/.agent-wallet/wallets_config.json` or `.env` files to git

---

## Installation & Environment

### What operating systems are supported?

macOS, Linux, and Windows, with Node.js 22.23.4+ (22.x), 24.22.1+ (24.x), or 26.12.1+ (the same range applies when you use wallet-cli). File permission hardening (`chmod 600` on `wallets_config.json`, `700` on the directory) is skipped on platforms that don't support Unix-style permissions. On Windows, point `AGENT_WALLET_WALLET_CLI_PATH` at wallet-cli's JavaScript entrypoint rather than a `.cmd` / `.bat` shim.

### `npm install -g` gives a permission error?

This is common on macOS / Linux. Two solutions:

**Method 1 (Recommended): Use nvm to manage Node.js** — it installs global packages in your user directory, no `sudo` needed.

**Method 2: Fix npm global directory permissions:**
```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### My agent says "wallet not found" or "network is required"?

The most common causes:

1. **Wrong storage directory**: you used `--dir` when creating the wallet, but the agent looks at the default path. Set `AGENT_WALLET_DIR="/your/custom/path"` in the agent's environment and restart it.
2. **No active wallet (CLI)**: `agent-wallet sign` without `-w` fails when no wallet is active. Run `agent-wallet list`; if nothing is marked `*`, run `agent-wallet use <id>`. (The SDK's `resolveWallet()` / `getActiveWallet()` don't fail here — they fall back to the first configured wallet.)
3. **Missing or non-canonical network**: `raw_secret` and `wallet_cli` wallets need a network such as `tron:3448148188` or `eip155:56`.

### `wallet-cli not found` when adding a `wallet_cli` wallet?

Install a compatible version (`npm install -g '@tron-walletcli/wallet-cli@^4.13.0'`) and make sure `wallet-cli --version` works in the same shell, or set `AGENT_WALLET_WALLET_CLI_PATH`. wallet-cli 4.12.x and 5.x are not supported by Agent-wallet 3.x.

### `agent-wallet` command not found?

The global installation didn't take effect. Check:
```bash
# Confirm the npm global bin directory is in your PATH
npm prefix -g
# The global bin directory is: $(npm prefix -g)/bin
```
If the output path isn't in your `$PATH`, add it manually:
```bash
echo "export PATH=$(npm prefix -g)/bin:$PATH" >> ~/.zshrc
source ~/.zshrc
```

---

## OpenClaw Integration

### Is OpenClaw required?

No. Agent-wallet is a standalone signing tool that can be used independently via CLI or SDK.

### OpenClaw says "signing failed" or "wallet not connected"?

Troubleshoot in this order:

1. Confirm the tool you use actually signs through Agent-wallet 3.x — new BANK OF AI setups use [wallet-cli](../wallet-cli/quickstart.md) directly.
2. Confirm a wallet has been configured: `agent-wallet list` should show at least one wallet, with `*` on the active one.
3. Confirm the agent's environment uses the same wallet directory (`AGENT_WALLET_DIR`), and restart the agent after changing it.
4. Try signing manually: `agent-wallet sign typed-data '<json>' -n eip155:56`.

### Does signing cost gas fees?

Signing itself costs zero gas. Gas fees are only incurred when a signed transaction is broadcast to the blockchain.

---

## Next Steps

- Never written code? → [Quick Start](./QuickStart.md)
- Prefer the command line? → [CLI Reference](./Developer/CLI-Reference.md)
- Building your own agent? → [SDK Guide](./Developer/SDK-Guide.md)
- Looking for ready-made code? → [SDK Cookbook](./Developer/SDK-Cookbook.md)
- Learn about OpenClaw Extension → [OpenClaw Introduction](../Openclaw-extension/Intro.md)
