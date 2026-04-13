# Introduction

Welcome to BANK OF AI SKILLS!

In the past, exploring Web3 was a grind full of barriers: watching charts, calculating slippage, switching wallets, checking contracts... one wrong step and you'd hit an error. We decided to put an end to that hassle.

In a nutshell, BANK OF AI SKILLS is a set of **"AI skill packs"** purpose-built for the TRON ecosystem. Ordinary AI tends to fumble complex Web3 trades — blindly copying steps and riddled with errors. Our Skills provide the AI Agent with a set of **"standardized workflows"** — like having a personal trader who already comes with hands-on experience in DEX trading, contract lookup, and perpetual swaps. Just chat naturally, and from pre-flight checks and parameter calculations to transaction bundling — all the error-prone grunt work — Skills automatically orchestrate everything flawlessly behind the scenes.

---

## 🌟 Why You Need Professional Skills

Today's AI chatbots are smart — if you push them to write a transfer script or hook them up to an API to try their luck on-chain, they can pull it off. But if you actually let them loose on your real money without guardrails, it often turns into a disaster.

In the high-stakes reality of Web3 trading, an AI needs more than "smart and capable" — it must "know the business" and be "absolutely reliable." The core edge of BANK OF AI SKILLS is that we took a regular copy-paste AI and upgraded it into a **Web3 personal assistant** with built-in error prevention, deep business workflow expertise, and strict risk control guardrails.

With Skills, your AI gains decisive advantages:

| Real Trading Pain Point | ❌ Regular AI Chatbot | 🦸‍♂️ With BANK OF AI SKILLS (personal assistant) |
| :--- | :--- | :--- |
| **Complex trade execution** (error prevention & SOP) | Guesses its way through, easily gets stuck. It can handle single-step commands, but for complex swaps, it often doesn't know you need to Approve first — leading to blind operations and error crashes. | Built-in "veteran driver navigation." Enforces the perfect sequence: check balance → verify approval → get quote → confirm → execute. Never misses a step. |
| **Fund safety & risk control** (blow-up prevention) | Blindly obedient, no guardrails. It doesn't understand financial common sense — if you casually say "open 100x leverage," it will generate that dangerous command without hesitation. | Built-in "business-level safety locks." Hard-coded risk limits (e.g., max 20x leverage, mandatory stop-loss) — dangerous operations get blocked on the spot. |

**In one sentence:** A regular AI is a straight-A "top student" on paper, but full of holes the moment it hits real operations. An AI with BANK OF AI SKILLS is like a seasoned pro who already comes with DEX trading, contract lookup, and perpetual swap skills — never makes rookie mistakes, and proactively steers you away from pitfalls. You just order in plain language, and it handles everything.

### 🎬 Real Scenario: You Want to "Buy Some TRX with 50 USDT"

Let's say you give the AI the simplest possible command: "Buy some TRX with 50 USDT."

**❌ With a regular AI:**

It hears the command and might generate a chunk of buggy code, or blindly try its luck on-chain. The result is usually **BOOM — transaction failed.** Then it throws a wall of incomprehensible error messages at you (something like `transfer amount exceeds allowance`).

Why? Because in the Web3 world, you must **"Approve"** a token before spending it. A regular AI has plenty of IQ but zero "industry common sense" — it skips the prerequisite step, crashes, and leaves you staring at gibberish.

**✅ With BANK OF AI SKILLS installed:**

After receiving your command, it doesn't just execute — it automatically runs through a standard operating procedure behind the scenes. Here's what your experience looks like:

1. **Auto balance check:** "Boss, I checked — you have 100 USDT in your wallet. Plenty of funds."
2. **Preemptive troubleshooting:** "I noticed you haven't approved USDT for SunSwap yet. I've prepared the Approve request — please confirm."
3. **Precise quote:** "Approval successful! At the latest price, 50 USDT gets you roughly 350 TRX. I've automatically set 1% slippage protection. Ready to buy?"

In this scenario, you said one sentence, and the Skill quietly handled 5 high-barrier steps behind the scenes: check balance → detect missing approval → submit approval → calculate slippage → fetch quote. That's the difference between a **"regular chatbot AI"** and a **"professional Web3 butler."**

---

## 🛡️ Your Assets Are Absolutely Safe with Skills

**"Can Skills spend my money without permission?"**
No. Every operation that involves spending money has a built-in **intercept-confirm mechanism** — the AI pauses first and shows you the full "bill": how much, where to, which chain, estimated fees. **Nothing happens until you explicitly say "yes."** Think of it as a diligent assistant who needs your signature on every expense report.

**"Will installing lots of Skills slow things down?"**
No. Skills use an **on-demand, lightweight architecture** — the AI only loads a "table of contents" at startup (like glancing at labels on a bookshelf). It reads the full skill content only when you actually use it. Hundreds of Skills? Still lightning fast.

---

## What Can Skills Do for You?

Eight core skills covering the most common scenarios in the TRON ecosystem. Each one comes with a ready-to-use sample prompt — copy it into your AI chat and hit enter to try it out.

### 🔑 Secure Wallet Management

Create encrypted wallets, sign transactions and messages, manage multiple wallets — all without exposing your private key. This is the foundation that other trading and payment skills rely on. Supports both EVM (BSC, Ethereum, Polygon, etc.) and TRON networks.

> 🗣️ "Create a new agent wallet for me" or "List all my wallets and show their addresses."

💡 For setup and advanced usage, see: [**agent-wallet**](./BANKOFAISkill.md#agent-wallet)

### 💱 Execute DEX Trades

Check prices, compare rates, even swap tokens in one go.

> 🗣️ "How much TRX can I get for 100 USDT on SunSwap right now?"

💡 For more advanced features, see: [**sunswap**](./BANKOFAISkill.md#sunswap)

### 📈 Trade Perpetual Contracts

View market data, open and close positions on SunPerp. Built-in safety lock: max 20x leverage, mandatory stop-loss on every position — keeps you from blowing up your account.

> 🗣️ "What's BTC's funding rate right now? Open a 5x long position with a 5% stop-loss."

💡 For more parameter settings, see: [**sunperp-skill**](./BANKOFAISkill.md#sunperp-skill)

### 🕵️ Query On-Chain Data

Look up accounts, transactions, and check if a new token is legit. Pure read-only, completely safe, costs nothing.

> 🗣️ "Check the holder distribution for that new token — is it controlled by a whale?"

💡 For more query dimensions, see: [**tronscan-skill**](./BANKOFAISkill.md#tronscan-skill)

### 💸 Transfer & Manage TRC20 Tokens

Check balances, transfer tokens, manage approvals for any TRC20 token — USDT, USDD, SUN, and more. Supports batch balance checks and symbol-based lookups.

> 🗣️ "Check my USDT, USDD, and SUN balances. Then transfer 10 USDT to TRecipientAddress."

💡 For more token operations, see: [**trc20-toolkit-skill**](./BANKOFAISkill.md#trc20-toolkit-skill)

### 🔐 Multi-Sig & Account Permissions

Set up multi-signature security for your TRON account — configure keys, thresholds, and co-sign transactions. Perfect for teams or for restricting your AI agent to DeFi-only operations.

> 🗣️ "Check my account's current permission setup. Then set up a 2-of-3 multi-sig on owner permission."

💡 For permission templates and multi-sig workflows, see: [**multisig-permissions**](./BANKOFAISkill.md#multisig-permissions)

### ☕ Auto-Settle On-Chain Paid Services

When the AI needs to call a paid on-chain service or data API, it uses the x402 protocol to automatically complete "pay first, then receive" on-chain settlement — no manual QR scanning or wallet switching needed.

> 🗣️ "Use the x402 protocol to call this paid agent endpoint: https://api.example.com" (replace with the actual paid endpoint URL you want to call)

💡 For payment and authorization details, see: [**x402-payment**](./BANKOFAISkill.md#x402-payment)

### 🏦 Manage BANK OF AI Account

Check your BANK OF AI balance and top up with a single sentence.

> 🗣️ "How much balance do I have? Go ahead and recharge 5 USDT."

💡 For top-up and withdrawal rules, see: [**recharge-skill**](./BANKOFAISkill.md#recharge-skill)

---

## 🎯 Are These Skills Right for Me?

- **👶 I'm a total beginner:** Perfect! No more wrestling with candlestick charts, slippage settings, or gas fee calculations. Just tell the AI what you want in plain language — it does the hard work and feeds you the results.
- **🕴️ I'm an experienced trader:** Tired of staring at screens all day? Let the AI batch-monitor data and calculate yields, freeing up your time and energy. You focus on strategy — let the AI handle the tedious execution.
- **🍉 I just want to explore:** Absolutely fine! Read-only skills like "On-Chain Data Detective" are 100% free — no wallet needed, zero risk, full access to the Web3 magic.

---

<div style={{textAlign: 'center', margin: '3rem 0'}}>

**Ready? Just 2 steps, less than 1 minute.**

<a href="../QuickStart" style={{display: 'inline-block', padding: '1rem 2.5rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', backgroundColor: '#25c2a0', borderRadius: '8px', textDecoration: 'none'}}>
Go to Quick Start
</a>

</div>
