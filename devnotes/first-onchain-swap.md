---
title: 'Your First On-Chain Swap, Step by Step'
description: 'A practical walkthrough: from installing Skills to completing a real swap on the Nile testnet — including what to check at each step and what to do when it fails.'
---

# Your First On-Chain Swap, Step by Step

The [Quick Start](/BANK-OF-AI/QuickStart/) gets you installed in a minute. This note picks up where it ends: a complete, realistic walkthrough of one on-chain task — with the checks worth making at each step, and what to do when something breaks.

We'll swap **TRX for USDT on the Nile testnet**. Testnet tokens are free, so nothing here costs real money.

---

## Before you start

You need three things:

1. Skills installed and a wallet created — see [Quick Start](/BANK-OF-AI/QuickStart/)
2. A TRON **Nile testnet** address with some test TRX
3. Your AI client open (OpenClaw, Claude Code, Cursor, Codex — whichever you use)

Get test TRX from the [Nile faucet](https://nileex.io/join/getJoinPage). You'll need TRX both as the asset to swap and to pay for energy.

---

## Step 1: Confirm what you're working with

Before any transaction, check the state you're starting from:

> Show my wallet address and my TRX balance on the Nile testnet.

The AI returns your address and balance. Two things to verify:

- **The address is the one you funded.** If you created multiple wallets, the AI uses the active one — easy to mix up.
- **The balance is non-zero.** A brand-new TRON address stays "inactive" until it receives its first transfer, and an inactive account can't sign contract calls.

If the balance is zero or the account shows as inactive, fund it from the faucet and check again before continuing.

---

## Step 2: Get a quote before you commit

Never let the first on-chain action be the transaction itself. Ask for a quote:

> On the Nile testnet, how much USDT would I get for 100 TRX on SunSwap?

The AI queries SunSwap and returns the expected output. This is a read-only call — nothing is signed and nothing is spent.

Take a moment on the number it gives you. If the rate looks far off from what you expect, stop and investigate rather than proceeding. A quote that seems wrong usually means low liquidity in the pool, or the wrong token being resolved — both are much cheaper to catch now than after signing.

---

## Step 3: Run the swap

Now the real thing:

> Swap 100 TRX for USDT on the Nile testnet, with 1% max slippage.

Two details in that sentence matter:

- **State the network explicitly.** Otherwise the AI may default to mainnet, where the same command spends real money.
- **State the slippage.** It caps how much worse than the quote you'll accept. Without it you're agreeing to whatever the pool gives you at execution time.

The AI now works through a standard sequence: check balance → check token approval → fetch a fresh quote → calculate slippage → **show you the bill** → wait.

It stops there. Nothing is signed until you confirm.

Read the bill before you approve it — the amount out, the recipient, and the network. This is the last point where a mistake is free.

---

## Step 4: Verify on-chain

After you confirm, the AI signs locally, broadcasts, and returns a transaction hash. That hash is the proof, not the AI's summary — check it:

> Look up that transaction on TronScan and show me the result.

Or paste the hash into [Nile TronScan](https://nile.tronscan.org) yourself. Confirm the status is success and the token amount matches what you approved.

---

## When it doesn't work

Four failures cover almost everything you'll hit early on:

**"Account not activated"** — the address has never received anything on-chain. Send it a small amount of TRX first; activation is a one-time thing per address.

**"Insufficient energy" / the transaction fails at broadcast** — TRON charges energy for contract calls. Keep some TRX beyond the amount you're swapping, or stake TRX for energy.

**"Insufficient allowance" or an approval error** — spending a TRC-20 token requires a one-time approval of the DEX contract. The AI normally handles this automatically; if it errors here, ask it directly: *"Approve SunSwap to spend my USDT, then retry the swap."*

**The quote and the result differ noticeably** — this is slippage doing its job. On thin testnet pools it's common. Lower the amount, or state a tighter slippage and let the transaction revert rather than fill badly.

---

## What to do next

Once the swap works, the same pattern extends to everything else — check state, preview, execute, verify:

> Check the holder distribution of this token: `<address>`

> Transfer 10 USDT to `<address>` on the Nile testnet.

> Stake 100 TRX and show me my current TRON Power.

Two habits worth keeping past the testnet stage: **always run a read-only query before a write**, and **always state the network explicitly**. Both take a second and both prevent the expensive kind of mistake.

When you move to mainnet, run the same task once with a small amount before doing it at full size.

---

## Related

- [Quick Start](/BANK-OF-AI/QuickStart/) — install and create your wallet
- [Skills](/McpServer-Skills/SKILLS/Intro/) — the full list of what your AI can do
- [Agent Wallet](/Agent-Wallet/Intro/) — how keys are stored and signing works
