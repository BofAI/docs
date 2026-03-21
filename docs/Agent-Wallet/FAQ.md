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
- No backup at all? Access to that wallet is permanently lost.

**So do this right now**: open your password manager and store the master password. Seriously.

---

## Everyday Use

### What exactly is Agent-wallet?

A purely local encrypted signing tool. It does two things: 1) encrypts and stores your private keys; 2) signs locally. No internet, no cloud. It has no standalone UI of its own — instead, it operates as an invisible security hub that integrates seamlessly into AI frontends like OpenClaw.

### CLI vs SDK — which do I need?

- **CLI** — command-line tool for creating wallets, managing keys, and manually testing signatures
- **SDK** — TypeScript / Python library for calling signing directly from your own code

Most users don't need the SDK. If you're using OpenClaw and MCP Server, creating a wallet with the CLI and setting the environment variable is all you need. The SDK is for developers building their own agents.

---

## Wallet Types

### What's the difference between `local_secure` and `raw_secret`?

| | `local_secure` | `raw_secret` |
| :--- | :---: | :---: |
| **Key encryption** | ✅ Strong encryption | ❌ Plaintext |
| **If an agent reads the file** | ✅ Key is inaccessible | ❌ Stolen instantly |
| **Use case** | ✅ All scenarios | ⚠️ Fully isolated dev environments only |

**Always use `local_secure`** unless you're 100% certain no other agent is running on that machine.

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

* Traditional approach (plaintext private key): It's like leaving cash right on the table. Any malicious browser extension, one careless code commit, or a background log scan — one glance at your `.env` file and the money is gone instantly. A classic single point of failure.
* Agent-wallet approach: It splits the risk into two locks.
   1. Physical safe: Your private key is encrypted with industry-grade algorithms and locked in a hidden folder deep in your system (`~/.agent-wallet`).
   2. Unlock password: What you put in your environment variable (`.env`) is merely the password to open this safe.

This means if a leak occurs:

* If a hacker only steals your password (e.g., by scanning environment variables), they don't have your encrypted wallet file — the password is just a useless string.
* If a hacker only steals your encrypted wallet file, they don't have your master password — the file is uncrackable gibberish that would take millennia to brute-force.

A hacker would need to simultaneously break into your computer, locate and steal the hidden wallet file, AND steal the password from your environment variables to touch your funds. The difficulty of this attack is orders of magnitude higher than simply scanning a `.env` file!

### Does the private key ever leave my machine?

Never. Agent-wallet makes zero network requests. Zero RPC calls, zero cloud services. Your private key never leaves your machine.

### How should I store the master password securely?

- ✅ Use a password manager (1Password, Bitwarden)
- ✅ Pass it via the `AGENT_WALLET_PASSWORD` environment variable
- ❌ Don't hardcode it in source code
- ❌ Don't commit a `.env` containing the password to git

---

## Cross-language

### Are key files compatible between Python and TypeScript?

Yes. Both implementations use exactly the same encryption format. A wallet created with the CLI works directly with the Python SDK, and vice versa.

### Do both languages produce the same signature?

Identical. Same private key + same data = same signature.

---

## What's Next

- Set up your full environment → [CLI Quick Start](./QuickStart.md)
- Sign from code → [SDK Quick Start](./SDKQuickStart.md)
- See real transfer examples → [Full Examples](./FullExample.md)
- Learn about OpenClaw Extension → [OpenClaw Introduction](../Openclaw-extension/Intro.md)
