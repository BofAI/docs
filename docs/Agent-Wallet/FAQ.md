# FAQ

Let's answer the three things you're probably most worried about, then cover the day-to-day details.

---

## 💰 Will AI drain my entire wallet?

This is the most common question, and the answer is: **even if your AI agent gets compromised, your core assets stay safe.**

We strongly recommend creating a dedicated wallet just for your AI agent, topped up with only the small amount it actually needs (e.g., enough to cover gas fees). Your main wallet and large holdings never get touched. Worst case, the loss is limited to whatever was in that small agent wallet.

```bash
# Create a dedicated small wallet for your AI agent
agent-wallet add
```

And your wallet file is protected by strong encryption. Even if someone gets hold of the file, without the master password it's just garbage — brute-forcing it is economically worthless.

---

## 🔌 Can my AI still sign if I go offline?

Yes. **All Agent-wallet signing operations complete 100% on your local machine.**

There's no network dependency by design — no RPC calls, no cloud services, no remote API requests. Your private key never touches the network.

Going offline only affects transaction building and broadcasting (that's the MCP Server's job). Signing itself is fully offline.

---

## 🔑 What if I forget my password?

**It's gone.**

The master password is the only credential for decrypting all private keys. There's no "forgot password" flow, no backdoor.

If you forget your password:
- Have another backup of your private key or mnemonic? Run `agent-wallet reset`, reinitialize, and reimport.
- No backup at all? Access to that wallet is lost.

**So do this right now**: open your password manager and store the master password. Seriously.

---

## Everyday Use

### What exactly is Agent-wallet?

A purely local encrypted signing tool. It does two things: 1) encrypts and stores your private keys; 2) signs locally. No internet, no cloud. It has no standalone UI of its own — instead, it operates as an invisible security hub that integrates seamlessly into AI frontends like OpenClaw.

### CLI vs SDK — which do I need?

- **CLI** — command-line tool for creating wallets, managing keys, and manually testing signatures
- **SDK** — TypeScript / Python library for calling signing directly from your own code

Most users don't need the SDK. If you're using OpenClaw and MCP Server, creating a wallet with the CLI and setting the environment variable is all you need. The SDK is for developers building their own agents.

### What's the difference between Agent-wallet and MetaMask?

MetaMask is a browser wallet designed for humans, with a graphical interface that requires you to manually click "Confirm" for every signature. Agent-wallet is a command-line wallet designed for AI agents, purpose-built for non-interactive use — AI can silently invoke signing in the background without anyone watching the screen. Both use similar encryption under the hood (Keystore V3), but they serve completely different use cases.

### How many wallets can I create on one machine?

No limit. You can create separate wallets for different AI agents, different chains, or different purposes. Use `agent-wallet add` to create and `agent-wallet use` to switch between them.

---

## Wallet Types

### What's the difference between `local_secure`, `raw_secret`, and `privy`?

| | `local_secure` | `raw_secret` | `privy` |
| :--- | :---: | :---: | :---: |
| **Key storage** | ✅ Encrypted locally | ❌ Plaintext locally | ☁️ Privy cloud custody |
| **If an agent reads the file** | ✅ Key is inaccessible | ❌ Stolen instantly | ✅ No local key file |
| **Requires master password** | ✅ Yes | ❌ No | ❌ No (uses API credentials) |
| **Use case** | ✅ All scenarios | ⚠️ Fully isolated dev only | ✅ Server-side agents with Privy |

:::danger `raw_secret` exposes your private key as plaintext
`raw_secret` stores your key unencrypted — the exact exposure `local_secure` mode is designed to prevent. If any other process on your machine can read files, your key can be stolen instantly. **Always use `local_secure`** unless you're 100% certain no other agent is running on that machine and it's a fully isolated, offline test environment.
:::

:::tip Privy wallets
The `privy` type delegates key custody to [Privy](https://privy.io)'s server-side wallet infrastructure. No private key is stored on your local disk — signing requests are sent to Privy's API. This is ideal for server-side AI agents that already use Privy for wallet management. You'll need a Privy App ID, App Secret, and Wallet ID to set it up.
:::

### What values does the `network` parameter accept?

| Value | Description |
| :--- | :--- |
| `tron:mainnet` | TRON Mainnet |
| `tron:nile` | TRON Nile Testnet |
| `tron:shasta` | TRON Shasta Testnet |
| `eip155:1` | Ethereum Mainnet |
| `eip155:56` | BSC Mainnet |
| `eip155:137` | Polygon Mainnet |
| `eip155:8453` | Base Mainnet |
| `eip155:42161` | Arbitrum Mainnet |

---

## Security

### The password is also stored in an environment variable — how is that different from a plaintext private key?

The difference is enormous! It's the difference between leaving cash on the table and locking it in a double-layered safe.

When you use a Web3 wallet like MetaMask, you never copy-paste your raw private key every time — you unlock it with a short password. Agent-wallet is essentially a command-line MetaMask built for AI agents.

* Traditional approach (plaintext private key): It's like leaving cash right on the table. Any malicious browser extension, one careless code commit, or a background log scan — one glance at your environment variables and the money is gone instantly. A classic single point of failure.
* Agent-wallet approach: It splits the risk into two locks.
   1. Physical safe: Your private key is encrypted with industry-grade algorithms and locked in a hidden folder deep in your system (`~/.agent-wallet`).
   2. Unlock password: What you put in your environment variable is merely the password to open this safe.

This means if a leak occurs:

* If a hacker only steals your password (e.g., by scanning environment variables), they don't have your encrypted wallet file — the password is just a useless string.
* If a hacker only steals your encrypted wallet file, they don't have your master password — the file is uncrackable gibberish that would take millennia to brute-force.

A hacker would need to simultaneously break into your computer, locate and steal the hidden wallet file, AND steal the password from your environment variables to touch your funds. The difficulty of this attack is orders of magnitude higher than simply scanning environment variables!

### Does the private key ever leave my machine?

Never. Agent-wallet makes zero network requests. Zero RPC calls, zero cloud services. Your private key never leaves your machine.

### How should I store the master password securely?

- ✅ Use a password manager (1Password, Bitwarden)
- ✅ Pass it via the `AGENT_WALLET_PASSWORD` environment variable
- ❌ Don't hardcode it in source code
- ❌ Don't commit environment variable files containing the password to git

### Is the encryption algorithm secure? Can it be brute-forced?

Agent-wallet uses the Keystore V3 standard encryption (scrypt + AES-128-CTR), the exact same encryption scheme used by official Ethereum wallets. The scrypt algorithm is specifically designed to make brute-force attacks extremely expensive in both computation and memory — even with dedicated hardware, cracking a strong password would take tens of thousands of years.

---

## Installation & Environment

### What operating systems are supported?

macOS, Linux, and Windows. As long as you can run Node.js >= 20 or Python >= 3.11, you're good to go. Windows support was added in v2.3.x — file permission features (like `chmod 600`) are gracefully skipped on Windows since it doesn't support Unix-style permissions.

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

### I configured the password but AI says "wallet not found" or "wrong password"?

The three most common causes:

1. **Password didn't take effect**: You ran `export` in Terminal A, but the AI runs in Terminal B. Solution: restart the AI backend service (see [Quick Start](./QuickStart.md) Step 2).
2. **Shell ate the password**: A password wrapped in double quotes contains `$` or `!`, which the shell expanded. Solution: switch to single quotes.
3. **Wrong storage directory**: You previously used `--dir` to specify a custom path, but the AI is looking at the default path. Solution: `export AGENT_WALLET_DIR="/your/custom/path"`.

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

## Cross-language

### Are key files compatible between Python and TypeScript?

Yes. Both implementations use exactly the same encryption format. A wallet created with the CLI works directly with the Python SDK, and vice versa.

### Do both languages produce the same signature?

Identical. Same private key + same data = same signature.

---

## OpenClaw Integration

### Is OpenClaw required?

No. Agent-wallet is a standalone signing tool that can be used independently via CLI or SDK. OpenClaw is simply the most convenient frontend — it lets you invoke signing using natural language, without writing any code.

### OpenClaw says "signing failed" or "wallet not connected"?

Troubleshoot in this order:

1. Confirm the `AGENT_WALLET_PASSWORD` environment variable is set (run `[[ -n "$AGENT_WALLET_PASSWORD" ]] && echo "Password is set" || echo "Password NOT set"` in the terminal where OpenClaw is running)
2. Confirm the MCP Server was started **after** the environment variable was set
3. Confirm a wallet has been initialized: `agent-wallet list` should show at least one wallet
4. If everything above checks out, try signing manually via CLI: `agent-wallet sign msg "test" -n tron`

### Does signing in OpenClaw cost gas fees?

Signing itself costs zero gas. Signing is purely a local cryptographic operation using your private key — it's completed entirely on your machine. Gas fees are only incurred when a signed transaction is broadcast to the blockchain. Operations like checking addresses or signing messages are always free.

---

## Next Steps

- Never written code? → [Quick Start](./QuickStart.md)
- Prefer the command line? → [CLI Reference](./Developer/CLI-Reference.md)
- Building your own agent? → [SDK Guide](./Developer/SDK-Guide.md)
- Looking for ready-made code? → [SDK Cookbook](./Developer/SDK-Cookbook.md)
- Learn about OpenClaw Extension → [OpenClaw Introduction](../Openclaw-extension/Intro.md)
