# Introduction

:::note
Agent Wallet documentation covers the `@bankofai/agent-wallet` 3.x SDK and CLI used by existing SDK, server, and community integrations. The official setup entry for new users is [wallet-cli](../wallet-cli/quickstart.md). Since 3.0, Agent-wallet can **link** an existing wallet-cli account through the `wallet_cli` wallet type, but it never imports, copies, or decrypts wallet-cli keys.
:::

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

## The Approach: One Signing Interface, Keys Kept Elsewhere

When you use a Web3 wallet like TronLink/MetaMask, do you paste your raw private key into every app? Of course not. The wallet holds the key and signs on your behalf.

**Agent-wallet gives your AI agent the same thing: a single signing interface (`getAddress`, `signTransaction`, `signTypedData`) in front of a key backend you choose.** Your agent code — or the MCP server / skill it uses — asks Agent-wallet to sign; it never needs to handle the key itself.

Agent-wallet 3.x supports three wallet types:

| Wallet type | Where the key lives | Recommended for |
| :--- | :--- | :--- |
| `wallet_cli` | In the encrypted keystore of [wallet-cli](../wallet-cli/quickstart.md). Agent-wallet never reads or decrypts that keystore; each signature runs in a restricted wallet-cli subprocess, and the keystore password is handed to that subprocess only for that one signature. | Local production signing |
| `privy` | Custodied by [Privy](https://privy.io) — no private key on your disk. Signing requests go to Privy's API. | Server-side agents that already use Privy |
| `raw_secret` | Stored **in plaintext** in `~/.agent-wallet/wallets_config.json`. | Development and throwaway test keys only |

For CI and other disposable environments, the SDK can also read a key straight from environment variables (`AGENT_WALLET_PRIVATE_KEY` or `AGENT_WALLET_MNEMONIC`). That is plaintext too — see the [SDK Guide](./Developer/SDK-Guide.md).

:::caution Upgrading from 2.x
3.0 removed the `local_secure` encrypted wallet type, the agent-wallet master password, `AGENT_WALLET_PASSWORD`, and `runtime_secrets.json`. Existing 2.x `local_secure` wallets are **not** converted automatically. Back up `~/.agent-wallet`, confirm you can still access the original key material with 2.x, then re-create the wallet as `wallet_cli` (recommended), `privy`, or `raw_secret`. See the [FAQ](./FAQ.md#upgrade-from-2x).
:::

---

## How It Compares

| | :x: Traditional (plaintext key in configuration files) | :white_check_mark: Agent-wallet with `wallet_cli` |
| :--- | :--- | :--- |
| **What the agent's config holds** | :x: The private key itself | :white_check_mark: A wallet-cli account ID and a password source (ideally an `exec` script) |
| **Key file read by another program** | :rotating_light: **Total loss** | :shield: The keystore is encrypted by wallet-cli |
| **One signing API for TRON and EVM** | :warning: Depends on your code | :white_check_mark: Same `Wallet` interface for every backend |
| **Works offline?** | :warning: Depends | :white_check_mark: `wallet_cli` and `raw_secret` sign on your machine; `privy` signs via Privy's API and needs network |

---

## Three Steps to a First Signature

No need to understand everything first — get it running, then explore. This path uses the quickest wallet type, `raw_secret`, with a **throwaway test key** (never real funds):

**Step 1 — Install Agent-wallet:**
```bash
npm install -g @bankofai/agent-wallet
```

**Step 2 — Import a test key:**
```bash
agent-wallet start raw_secret
```
Choose `private_key` and paste a test key when prompted. The CLI warns that raw secret material is stored in plaintext in `wallets_config.json`.

**Step 3 — Your first signature:**
```bash
agent-wallet sign typed-data '{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"chainId","type":"uint256"}],"Message":[{"name":"contents","type":"string"}]},"primaryType":"Message","domain":{"name":"AgentWallet","chainId":1},"message":{"contents":"Hello from my AI agent"}}' -n eip155:1
```

When a line starting with `Signature:` appears — congratulations, your Agent-wallet is live.

> For real funds, link a wallet-cli account instead. The full walkthrough is in **[Quick Start](./QuickStart.md)**.

---

## Next: Connect Your AI Agent

Agent-wallet is set up and signing works. Now the question is: **how do I get my AI agent to actually use this wallet?**

Pick the path that fits you:

### 🎮 I'm a casual user — using existing tools

You don't need to know any code! You can use the ready-made suite: **[OpenClaw Extension](../Openclaw-extension/Intro.md) + [MCP Server](../McpServer-Skills/MCP/Intro.md) + [Skills](../McpServer-Skills/SKILLS/Intro.md)**. Check each tool's own setup page for the wallet it expects — new setups use [wallet-cli](../wallet-cli/quickstart.md) directly.

#### 🤝 How do they work together?

To give you total peace of mind, we designed your AI assistant as a well-organized little "company" with clear division of labor:

- 🧠 **The Business Team (OpenClaw + Skills + MCP):** They do the legwork out in the field — quick-thinking and well-equipped, they know how to check prices, calculate slippage, and find the best quotes. But most importantly: they have zero authority to touch your funds.
- 🏦 **The CFO (Agent Wallet):** The one in front of the vault. With the `wallet_cli` type, the vault itself is wallet-cli's encrypted keystore; with `privy`, it's Privy's infrastructure.

Here's how a secure pipeline works:

1. You sit back in the boss's chair and say: "Buy 100 USDT worth of TRX."
2. The Business Team rushes off to check prices, calculate fees, and dutifully drafts a "transaction request form."
3. They hand the form to the **CFO (Agent Wallet)**.
4. The CFO has the vault stamp the form with an "approved" seal (technically called "signing") without ever taking the private key out, then passes only the stamped form back.
5. The Business Team takes the stamped form and gets it done on the blockchain.

✨ **The key takeaway:** the AI tools doing the legwork only ever receive the "stamped paper" — the signed transaction or signature.

> Can't wait to try it? Head to 👉 **[Quick Start](./QuickStart.md)** and follow along.

### ⌨️ I'm an advanced user — managing wallets via CLI

Managing multiple wallets, exec-script credentials, or custom storage directories? Head to **[CLI Reference](./Developer/CLI-Reference.md)**.

### 👨‍💻 I'm a developer — building my own agent

<details>
<summary>Expand developer path — TypeScript SDK</summary>

Agent-wallet 3.x ships a TypeScript SDK; the same configuration the CLI writes is what the SDK reads:

```typescript
import { resolveWallet } from "@bankofai/agent-wallet";

const wallet = await resolveWallet({ network: "tron:3448148188" }); // TRON Nile
const address = await wallet.getAddress();
const signed = await wallet.signTransaction(unsignedTx); // { family: "tron", transaction }
```

> **[SDK Guide](./Developer/SDK-Guide.md)** — step-by-step integration guide.
> **[SDK Cookbook](./Developer/SDK-Cookbook.md)** — end-to-end real transactions: TRON transfers, BSC transfers, x402 payment signing.

</details>

---

## Supported Chains

Every network is given as a canonical CAIP-2 identifier:

| Chain Type | Networks |
| :--- | :--- |
| **EVM** | `eip155:<chainId>` — Ethereum (`eip155:1`), BSC (`eip155:56`), Base (`eip155:8453`), and any other EVM-compatible chain, mainnet or testnet |
| **TRON** | `tron:<chainId>` — Mainnet (`tron:728126428`), Nile Testnet (`tron:3448148188`), Shasta Testnet (`tron:2494104990`) |

For `wallet_cli` wallets the network must also be one wallet-cli itself knows — its built-ins (`eip155:1`, `eip155:11155111`, `eip155:56`, `eip155:97`, `eip155:8453`, `eip155:84532` (the two Base networks were added in wallet-cli 4.14.0) and the three TRON networks) or a network added to wallet-cli's own config — otherwise signing fails with `network_mismatch`. `raw_secret` and `privy` wallets have no such limit.

Both chain types share the same interface — learn it once, use it everywhere.

---

## Still Have Questions?

| I'm wondering… | Go here |
| :--- | :--- |
| Will AI drain my wallet? | [FAQ](./FAQ.md) — keep a dedicated, small agent wallet |
| Never written code? | [Quick Start](./QuickStart.md) |
| Prefer the command line? | [CLI Reference](./Developer/CLI-Reference.md) |
| Building your own agent? | [SDK Guide](./Developer/SDK-Guide.md) |
| Looking for ready-made code? | [SDK Cookbook](./Developer/SDK-Cookbook.md) |
