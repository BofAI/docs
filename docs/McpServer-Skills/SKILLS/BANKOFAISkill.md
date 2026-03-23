# Skill Catalog

You don't need to write code or understand the technical details. Just copy the sample prompts below into your AI chat, hit enter, and the AI takes care of the rest.

:::warning Three Golden Rules
BANK OF AI SKILLS can operate on **real on-chain assets**. Blockchain transactions are **irreversible** — there's no undo button, no customer service rollback.

1. **Never paste your private key into a chat window.** Use [Agent Wallet](../../Agent-Wallet/Intro.md) instead (think of it as opening a dedicated "payment account" for your AI — you don't hand over your bank password directly).
2. **Practice with play money first.** Every new operation should be tested on the Nile testnet — it uses free test tokens, so there's nothing to lose.
3. **Read the confirmation prompt carefully.** Before any on-chain transaction, the AI will show you the full bill and wait for your explicit "yes."
:::

---

## Skill Summary

| Skill | What It Does | What Key/Credential Do I Need? |
| :--- | :--- | :--- |
| **sunswap** | Check prices, get quotes, swap tokens, manage liquidity pools | Read-only: none. Trading: wallet credentials |
| **sunperp-skill** | Market data, open/close positions, withdrawals | Market data: none. Trading: SunPerp API keys |
| **tronscan-skill** | Look up accounts, transactions, tokens, blocks, network stats | Recommended: TronScan API key (may throttle without one) |
| **x402-payment** | Auto-pay for premium APIs and agents | Wallet credentials |
| **recharge-skill** | Balance, order history, account top-up | BANK OF AI API key |

### 🔑 Where Do I Get These Keys? How Do I Set Them Up?

If you just want the AI to look up public data (like token prices or block height), you don't need to configure anything — just start using it.

But if you want to unlock advanced features or trading, grab the keys you need below:

**1. Wallet Credentials (for spending money and trading)**

- **Where to get it:** You don't need to apply anywhere — this is simply your TRON wallet private key.
- **How to set it up:** We've prepared two options in [Quick Start](./QuickStart.md#-want-the-ai-to-trade-for-you) — pick whichever suits you:
  - **Option 1 (Recommended):** Use [Agent Wallet](../../Agent-Wallet/QuickStart.md) — visual interface, 2 minutes, private key encrypted and never exposed.
  - **Option 2:** Paste your private key directly into your system config file (the "notepad method") — great for power users or quick testing.

**2. TronScan API Key (your VIP pass for data queries)**

You can query data without this, but if you query too fast, the system may rate-limit you. With a key, you get the VIP fast lane.

- **Where to get it (completely free):** Go to [TronScan](https://tronscan.org/), register an account, and click to generate a key.
- **How to set it up:** Follow the same "notepad method" in [Quick Start — "Want the AI to Trade for You?"](./QuickStart.md#-want-the-ai-to-trade-for-you) and paste `TRONSCAN_API_KEY` in the same way.

**3. SunPerp API Keys (for perpetual contract trading)**

- **Where to get them:** Go to [SunPerp](https://sunperp.com/), connect your wallet, then generate an API Key and Secret in your account settings.
- **How to set them up:** Use the same "notepad method" to paste `SUNPERP_ACCESS_KEY` and `SUNPERP_SECRET_KEY` into your config file.

**4. BANK OF AI API Key (for balance checks and account top-ups)**

- **Where to get it:** Go to [chat.bankofai.io/key](https://chat.bankofai.io/key) and log in to get your key.
- **How to set it up:** Use the notepad method to paste `BANKOFAI_API_KEY`.

---

## Haven't Installed Yet?

Head over to **[Quick Start](./QuickStart.md)** — it takes about 1 minute. Come back here to pick your skills once you're set up.

---

## sunswap — Swap Tokens, Check Prices, Manage Pools

Want to swap tokens, check rates, or manage liquidity on SunSwap? Just tell the AI.

**Completely safe — looking only, no spending:**

> What's the current price of TRX?

> How much TRX can I get for 100 USDT on SunSwap?

> Show me the top 10 highest-APY pools on SunSwap.

> Show me all my current SunSwap V3 liquidity positions.

**Requires your confirmation (AI shows the bill first):**

> Swap 100 TRX for USDT on the SunSwap Nile testnet.

> Add 100 TRX and 15 USDT liquidity to the TRX/USDT pool on SunSwap V2.

> Collect fee rewards from V3 position #12345.

**Real-world scenarios:**

> Looking for arbitrage? Try: "Is it worth swapping 100 USDT to TRX on SunSwap right now?"

> Interested in yield farming? Try: "Which V3 pool on SunSwap has the highest APY? Give me an analysis."

> Looking to buy the dip? Try: "What's TRX's price trend over the last 7 days?"

---

## sunperp-skill — Perpetual Contract Trading

Want to trade contracts? This skill handles market data, opening/closing positions, stop-loss, and withdrawals. Built-in safety: max 20x leverage, mandatory stop-loss — if losses exceed 5%, the AI automatically closes your position to prevent liquidation.

**Completely safe — looking only, no spending:**

> What's the current price, 24h change, and funding rate for BTC-USDT perpetual?

> What's my SunPerp account balance and available margin?

> What open positions do I have? Show entry price, unrealized P&L, and liquidation price.

**Requires your confirmation:**

> Open 1 BTC-USDT long at market price on SunPerp with 10x leverage, 5% stop loss.

> Close all my BTC-USDT positions.

> Withdraw 10 USDT from SunPerp to my on-chain address.

**Real-world scenarios:**

> Stuck in a bad position? Try: "What's BTC's funding rate right now — should I go long or short?"

> Want to manage risk? Try: "Lower my BTC-USDT leverage to 5x and set stop-loss to 3%."

> Want the big picture? Try: "List all available perpetual contracts, sorted by 24h volume."

---

## tronscan-skill — On-Chain Data Detective

Want to know what's happening on-chain? This skill looks up accounts, transactions, tokens, blocks, and network stats. **Pure read-only, completely safe, costs nothing, needs no credentials.** The perfect first skill to get started.

> Look up the full account info and holdings for address TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf.

> Show me the details of this transaction: abc123...

> Show the top 10 TRC20 tokens by market cap.

> Give me a TRON network overview: current TPS, Super Representatives, total accounts.

> Show the last 20 USDT transfers from address TXX...

**Real-world scenarios:**

> Found a new token and want to check if it's legit? "Check the holder distribution and contract verification for token TXX..."

> Tracking a whale? "Show all transactions above 100,000 USDT from address TXX... in the last 24 hours."

> Verifying a transfer? "Did this transaction actually succeed: abc123...?"

---

## x402-payment — Auto-Pay for Premium Services

Some APIs and AI agents charge a small fee to use. This skill handles the payment flow automatically — the AI detects the charge, pays it, gets the result, and reports back. It always asks for your confirmation before paying.

**Requires your confirmation:**

> Use x402 protocol to call this paid agent endpoint: https://api.example.com （replace with the actual paid endpoint URL you want to call）

---

## recharge-skill — BANK OF AI Account Management

Check your balance, view order history, or top up your account.

**Completely safe — looking only, no spending:**

> How much balance does my BANK OF AI account have?

> Show my recent BANK OF AI order history.

**Requires your confirmation:**

> Recharge 1 USDT to my BANK OF AI account.


---

## Recommended Learning Path

**Start here — zero risk, zero config:** Use tronscan-skill to look up accounts and check transactions. Use sunswap to check prices and get quotes. Read-only, no credentials needed.

**Next — practice with play money:** Set up your wallet (see [Agent Wallet Quick Start](../../Agent-Wallet/QuickStart.md)), then test swaps and liquidity operations on the Nile testnet. Confirm the AI behaves exactly as expected.

**Then — mainnet with small amounts:** Run the full flow with a small amount of real funds to make sure everything works.

**Finally — daily use:** Run your regular operations, adjust parameters, and combine skills as needed.

---

## Next Steps

- Want to understand how skills work under the hood? → [What Are Skills?](./Intro.md)
- Running into issues? → [FAQ](./Faq.md)
- Using OpenClaw Extension? → [OpenClaw Extension Documentation](../../Openclaw-extension/Intro.md)
