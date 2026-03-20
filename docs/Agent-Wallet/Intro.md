# Introduction

## Profit from AI Agents Without the Private Key Risk

### Your Private Key Is One File Read Away from Being Stolen

You want your AI agent to handle on-chain work automatically — airdrop farming, token swaps, paying gas fees, scheduled transfers. To do any of that, the agent needs a "key" (your private key) to sign transactions on your behalf.

So you drop it into a `.env` file.

**That's like writing your bank card number and PIN on a sticky note and walking into a room full of strangers.**

That room is your computer. Those strangers are everything else running on your machine — MCP servers, browser extensions, AI coding assistants, automation scripts. Every single one of them can read your `.env` file. Your private key has no password protection, no encryption, no access control — it's just plaintext, one file read away from being gone.

---

### This Isn't Hypothetical — It's Already Happening

- **Dependency chain poisoning.** You install a useful MCP server. Three months later, one of its 200 npm dependencies gets a malicious update — quietly scanning all `.env` and `*.json` files for anything that looks like a private key, then sending it out. You never see it happen. By the time you notice, your wallet is empty.

- **The "helpful" agent that leaks too much.** Your AI assistant reads your project directory to understand context. Your `.env` is in there. The assistant sends file contents to a remote API for analysis. Your private key is now sitting quietly in someone else's server logs — not stolen, just "accidentally" uploaded.

- **Git's perfect memory.** You hardcoded a key during development and deleted it later. But you committed it once, three weeks ago. It's still in `git log -p`. If that repo ever touched GitHub, even for 30 seconds, automated scrapers already found it.

- **Cloud wallets: trading one exposure for another.** "Just use a cloud wallet service" — your key is off your machine, but now it's on someone else's server. Their breach is your breach. Their downtime is your agent's downtime. You've just moved the risk from one hand to the other.

The common thread: **your private key is always exposed somewhere** — on disk, in logs, in git history, or on someone else's infrastructure.

---

## The Fix: Agent-wallet

Agent-wallet is a **local encrypted safe** that works even when you're offline.

It does exactly one thing: **use industry-grade encryption to lock your vulnerable plaintext private key on your own machine, and sign locally.**

Even if someone gets hold of your wallet file, without the master password it's pure garbage data. Brute-forcing it would take longer than the age of the universe — economically pointless. At the same time, all signing operations complete on your machine — no network calls, no third-party APIs, no cloud intermediaries.

**Bottom line: steal the file all you want — it's unreadable. Sign locally — nothing to intercept.**

---

## How It Compares

| | Plaintext key / `.env` | Cloud wallet | Agent-wallet |
| :--- | :---: | :---: | :---: |
| **Agent reads your key file** | ❌ Stolen instantly | — Key is remote | ✅ Encrypted — useless without password |
| **Who owns the key** | ⚠️ Whoever can read the file | ❌ The provider | ✅ Only you (master password) |
| **Works offline** | ⚠️ Depends | ❌ Must be online | ✅ 100% offline signing |
| **Designed for AI agents** | ❌ Manual integration | ⚠️ REST API, latency | ✅ CLI + SDK, local, instant |
| **Multi-chain support** | ❌ Build it yourself | ⚠️ Provider-dependent | ✅ EVM + TRON, one interface |
| **Production-ready** | ❌ Dangerous | ⚠️ Trust a third party | ✅ Self-hosted, auditable |

---

## Three Commands, Under a Minute

No need to understand everything first — get it running, then explore:

**Step 1 — Install:**
```bash
npm install -g @bankofai/agent-wallet
```

**Step 2 — Create your encrypted safe:**
```bash
agent-wallet start
```
The wizard will initialize your Agent-wallet encrypted safe and generate a **master password**. This is the only key to all your assets — if you lose it, there's no recovery. Save it in a password manager now.

**Step 3 — Your first signature:**
```bash
agent-wallet sign msg "Hello from my AI agent" -n tron
```

When a hash string appears on screen — congratulations, your encrypted safe is live.

> Want the full step-by-step walkthrough? Head to **[Quick Setup — CLI Quick Start](./QuickStart.md)**.

---

## Next: Connect Your AI Agent

Your safe is set up and signing works. Now the question is: **how do I get my AI agent to actually use this wallet?**

Pick the path that fits you:

### 🎮 I'm a casual user — using existing tools

No code required. Many AI tools natively support Agent-wallet (we **strongly recommend our [OpenClaw Extension](../Openclaw-extension/Intro.md) + [MCP Server](../McpServer-Skills/MCP/Intro.md) + [Skills](../McpServer-Skills/SKILLS/Intro.md)** — one-click install, works out of the box). All you need to do is tell the tool your master password:

```bash
export AGENT_WALLET_PASSWORD='your-master-password'
```

:::caution Password contains special characters? Always use single quotes
Auto-generated passwords often include `$`, `!`, and other shell-special characters. **Wrap in single quotes** or the shell will silently mangle the value:

```bash
# ✅ Correct
export AGENT_WALLET_PASSWORD='P@ss$w0rd!'

# ❌ Wrong
export AGENT_WALLET_PASSWORD="P@ss$w0rd!"
```
:::

Once set, your tools automatically call your Agent-wallet encrypted safe to sign. The tool only ever receives the signature result — never the private key itself.

> Want to see supported tools? Go to **[OpenClaw Extension](../Openclaw-extension/Intro.md)**.

### 🛠️ I'm a developer — building my own agent

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

> **[SDK Quick Start](./SDKQuickStart.md)** — step-by-step integration guide.
> **[Full Examples](./FullExample.md)** — end-to-end real transactions: TRON transfers, BSC transfers, x402 payment signing.

</details>

---

## Supported Chains

| Chain Type | Networks |
| :--- | :--- |
| **EVM** | Ethereum, BSC, Polygon, Base, Arbitrum, and any EVM-compatible chain |
| **TRON** | TRON Mainnet, Nile Testnet, Shasta Testnet |

Both chain types share the same interface — learn it once, use it everywhere.

---

## Still Have Questions?

| I'm wondering… | Go here |
| :--- | :--- |
| Will AI drain my wallet? | [FAQ](./FAQ.md) — we have a dedicated risk isolation solution |
| Ready to set it up now | [Quick Setup — CLI Quick Start](./QuickStart.md) |
| Want to use it in code | [SDK Quick Start](./SDKQuickStart.md) |
| Want to see real transaction examples | [Full Examples](./FullExample.md) |
