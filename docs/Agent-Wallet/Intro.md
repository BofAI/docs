# Introduction

## Enjoy the Convenience of AI Agents Without the Private Key Risk

### Your Private Key Is One File Read Away from Being Stolen

You want your AI agent to handle on-chain work automatically — airdrop farming, token swaps, paying gas fees, scheduled transfers. To do any of that, the agent needs a "key" (your private key) to sign transactions on your behalf.

So you save your private key as plaintext in a configuration file on your computer — anyone who can read that file has your key.

**That's like writing your bank card number and PIN on a sticky note and walking into a room full of strangers.**

That room is your computer. Those strangers are everything else running on your machine — MCP servers, browser extensions, AI coding assistants, automation scripts. Every single one of them can read that file. Your private key has no password protection, no encryption, no access control — it's just plaintext, one app away from being gone.

---

### This Isn't Hypothetical — It's Already Happening

- **Dependency chain poisoning.** You install a useful MCP server. Three months later, one of its 200 npm dependencies gets a malicious update — quietly scanning all files for anything that looks like a private key, then sending it out. You never see it happen. By the time you notice, your wallet is empty.

- **The "helpful" agent that leaks too much.** Your AI assistant reads your project directory to understand context. Your configuration file is in there. The assistant sends file contents to a remote API for analysis. Your private key is now sitting quietly in someone else's server logs — not stolen, just "accidentally" uploaded.

- **Git's perfect memory.** You hardcoded a key during development and deleted it later. But you committed it once, three weeks ago. It's still in `git log -p`. If that repo ever touched GitHub, even for 30 seconds, automated scrapers already found it.

The common thread: **your private key is always exposed somewhere** — on disk, in logs, or in git history.

---

## The Breakthrough: Agent-wallet — The Web3 Wallet Designed Exclusively for AI

When you use a Web3 wallet like TronLink/MetaMask, do you paste your raw private key in every time? Of course not. You unlock it with a password, and let it sign on your behalf.

**Agent-wallet is a local TronLink/MetaMask purpose-built for AI agents.**

It minimizes your risk through a **"physical + password separation"** dual-lock mechanism:

1. **Lock #1 (Physical file):** Your private key is encrypted with industry-grade algorithms and stored in a hidden folder deep in your system (`~/.agent-wallet`).
2. **Lock #2 (Authorization password):** Your AI agent only needs the "unlock password" (which you can set in an environment variable) to operate.

**🤔 You might ask: "What if the AI leaks my unlock password?"**

This is the most elegant part of Agent-wallet: **a leaked password ≠ stolen assets.**

If a hacker steals only your password through a malicious plugin, they can't do anything — because they don't have your encrypted wallet file. If they steal only the wallet file without the password, it's just uncrackable gibberish.

**A hacker would need to simultaneously break into your system, locate the hidden wallet file, AND steal the password from your environment variables to touch your funds.** The difficulty and cost of this kind of attack is orders of magnitude higher than simply scanning a plaintext private key in environment variables!

**Bottom line: steal the file — it's useless without the password. Leak the password — it's useless without the file.**

---

## How It Compares

| | :x: Traditional (plaintext key in configuration files) | :white_check_mark: Agent-wallet |
| :--- | :--- | :--- |
| **How it works** | :x: Hand your card and PIN directly to the AI | :white_check_mark: **Give AI the password, file stays locked locally** |
| **Log / env variable leak** | :rotating_light: **Total loss** | :shield: **Only the password leaks — no file, hacker gets nothing** |
| **Encrypted file stolen** | :x: Plaintext key, stolen instantly | :shield: **No password, hacker can't open the file** |
| **Works offline?** | :warning: Depends | :white_check_mark: **100% offline signing** |

---

## Three Commands, Under a Minute

No need to understand everything first — get it running, then explore:

**Step 1 — Install Agent-wallet:**
```bash
npm install -g @bankofai/agent-wallet
```

**Step 2 — Create your Agent-wallet wallet:**
```bash
agent-wallet start
```
The wizard will initialize your Agent-wallet wallet and generate a **master password**. This password is your only "unlock key": every time your AI agent needs to sign, it uses this password to unlock the wallet. **Save it immediately in a password manager (e.g. 1Password, Bitwarden)** — it won't be shown again, and if lost, there's no way to recover it or access your assets.

**Step 3 — Your first signature:**
```bash
agent-wallet sign msg "Hello from my AI agent" -n tron
```

When a hash string appears on screen — congratulations, your Agent-wallet is live.

> Want the full step-by-step walkthrough? Head to **[Quick Start](./QuickStart.md)**.

---

## Next: Connect Your AI Agent

Agent-wallet is set up and signing works. Now the question is: **how do I get my AI agent to actually use this wallet?**

Pick the path that fits you:

### 🎮 I'm a casual user — using existing tools

You don't need to know any code! You can directly use our ready-made "all-in-one" suite: **[OpenClaw Extension](../Openclaw-extension/Intro.md) + [MCP Server](../McpServer-Skills/MCP/Intro.md) + [Skills](../McpServer-Skills/SKILLS/Intro.md)**.

#### 🤝 How do they work together?

To give you total peace of mind, we designed your AI assistant as a well-organized little "company" with clear division of labor:

- 🧠 **The Business Team (OpenClaw + Skills + MCP):** They do the legwork out in the field — quick-thinking and well-equipped, they know how to check prices, calculate slippage, and find the best quotes. But most importantly: they have zero authority to touch your funds.
- 🏦 **The CFO (Agent Wallet):** The one guarding the vault. Your private key (think: bank card PIN) is locked tight inside their local safe, completely invisible to the Business Team outside.

Here's how a perfect secure pipeline works:

1. You sit back in the boss's chair and say: "Buy 100 USDT worth of TRX."
2. The Business Team rushes off to check prices, calculate fees, and dutifully drafts a "transaction request form."
3. They hand the form to the **CFO (Agent Wallet)**, who sits right next to the safe.
4. The CFO verifies everything and never takes the private key out of the safe — instead, they stamp the form right there with an "approved" seal (technically called "signing"), then pass only the stamped form back out.
5. The Business Team takes the stamped form and gets it done on the blockchain.

✨ **The key takeaway:** Throughout the entire process, the AI tools doing the legwork only ever receive the "stamped paper" — they never even catch a glimpse of the private key! This ensures AI agent can handle extremely complex tasks for you while keeping your assets absolutely secure.

#### ⚙️ Sounds great — how do I connect them?

Dead simple! No complex programming needed — just one thing: give the Business Team an internal passphrase to wake up the CFO.

Just tell the tools the "master password" you generated when creating your Agent Wallet, like this:

```bash
export AGENT_WALLET_PASSWORD='your-master-password'
```

That's it — one line of config! Once the passphrase is set, the entire system works seamlessly and automatically. Your AI agent will transform into a top-tier Web3 personal assistant that's both brilliantly capable and absolutely secure!

> Can't wait to try it? Head to 👉 **[Quick Start](./QuickStart.md)** and follow along.

### ⌨️ I'm an advanced user — managing wallets via CLI

Need password-free signing, managing multiple wallets, or custom storage directories? Head to **[CLI Reference](./Developer/CLI-Reference.md)**.

### 👨‍💻 I'm a developer — building my own agent

<details>
<summary>Expand developer path — TypeScript / Python SDK</summary>

Agent-wallet ships a complete SDK with TypeScript and Python support — both sharing the same interface:

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";

const provider = resolveWalletProvider({ network: "tron:nile" });
const wallet   = await provider.getActiveWallet();
const sig      = await wallet.signMessage(new TextEncoder().encode("Hello!"));
```

Same key file, same data, same signature — across both languages.

> **[SDK Guide](./Developer/SDK-Guide.md)** — step-by-step integration guide.
> **[SDK Cookbook](./Developer/SDK-Cookbook.md)** — end-to-end real transactions: TRON transfers, BSC transfers, x402 payment signing.

</details>

---

## Supported Chains

| Chain Type | Networks |
| :--- | :--- |
| **EVM** | Ethereum, BSC, Polygon, Base, Arbitrum, and any EVM-compatible chain (mainnet & testnet supported) |
| **TRON** | TRON Mainnet, Nile Testnet, Shasta Testnet |

Both chain types share the same interface — learn it once, use it everywhere.

---

## Still Have Questions?

| I'm wondering… | Go here |
| :--- | :--- |
| Will AI drain my wallet? | [FAQ](./FAQ.md) — we have a dedicated risk isolation solution |
| Never written code? | [Quick Start](./QuickStart.md) |
| Prefer the command line? | [CLI Reference](./Developer/CLI-Reference.md) |
| Building your own agent? | [SDK Guide](./Developer/SDK-Guide.md) |
| Looking for ready-made code? | [SDK Cookbook](./Developer/SDK-Cookbook.md) |
