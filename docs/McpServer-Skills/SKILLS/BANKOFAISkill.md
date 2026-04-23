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
| **agent-wallet** | Create wallets, sign transactions/messages, manage multiple wallets — supports EVM and TRON | `AGENT_WALLET_PASSWORD` (encrypted mode) or none (interactive) |
| **sunswap** | Check prices, get quotes, swap tokens, manage V2/V3/V4 liquidity pools | Read-only: none. Trading: wallet credentials |
| **sunperp-skill** | Market data, open/close positions, withdrawals | Market data: none. Trading: SunPerp API keys |
| **tronscan-skill** | Look up accounts, transactions, tokens, blocks, network stats | Recommended: TronScan API key (may throttle without one) |
| **trc20-toolkit-skill** | Transfer tokens, check balances, manage approvals for any TRC20 token | Read-only: none. Transfers/approvals: wallet credentials |
| **usdd-skill** | USDD stablecoin — PSM swaps (1:1 USDT ↔ USDD), vault queries, balance checks | Read-only: none. PSM swaps: wallet credentials |
| **trx-staking-skill** | Stake TRX, vote for Super Representatives, claim voting rewards | Wallet credentials |
| **multisig-permissions** | Multi-sig permission setup, key management, co-signed proposals | Wallet credentials (owner key for permission changes) |
| **x402-payment** | On-chain "pay-first" auto-settlement on TRON (TRC20) & BSC (ERC20), with GasFree support | Wallet credentials (via agent-wallet) |
| **recharge-skill** | Balance, order history, account top-up | BANK OF AI API key |
| **bankofai-guide** | Onboarding helper — post-install setup, first AgentWallet creation, wallet guard for other skills | None (runs automatically when needed) |

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

## agent-wallet {#agent-wallet}

Your AI's secure signing engine. This skill creates and manages encrypted wallets for your AI agent, letting it sign transactions and messages on both EVM (BSC, Ethereum, Polygon, Arbitrum, Base, etc.) and TRON networks — without ever exposing your private key. Think of it as the "keychain" that all other trading and payment skills rely on. Requires Node.js 20+.

**Completely safe — looking only, no spending:**

> List all my agent wallets.

> Show the EVM and TRON addresses for my wallet.

> What wallet is currently active?

**Requires your confirmation:**

> Create a new encrypted wallet for me.

> Switch to my BSC wallet.

> Sign this message: "Hello World" on TRON mainnet.

**Real-world scenarios:**

> Setting up for the first time? Try: "Create a new agent wallet" — the AI walks you through choosing a wallet type (`local_secure` for an encrypted local key, or `privy` for a hosted wallet via API credentials), generating keys, and saving your master password.

> Managing multiple chains? Try: "Show me all my wallets and their addresses" — one wallet derives both EVM and TRON addresses from the same key. Use `eip155:<chainId>` for EVM networks (e.g. `eip155:1` Ethereum, `eip155:56` BSC, `eip155:137` Polygon, `eip155:42161` Arbitrum, `eip155:8453` Base) and `tron:mainnet` / `tron:nile` for TRON.

> Need to sign something? Try: "Sign this transaction on BSC" — the AI handles the signing locally without broadcasting. Supports raw transactions, EIP-191 messages, and EIP-712 typed data (EVM only).

:::tip Why use Agent Wallet instead of raw private keys?
Agent Wallet encrypts your private key with a master password. Even if someone accesses your files, they can't use the key without the master password. This is the recommended way to configure wallet credentials for all other skills (sunswap, x402-payment, etc.).
:::

:::caution Dangerous operations are agent-restricted
`remove`, `reset`, and `change-password` cannot be executed by the AI — you must run these commands yourself in the terminal. This protects against accidental or irreversible loss of wallet access. The AI will explain the command and ask you to run it yourself.
:::

For detailed setup instructions, see [Agent Wallet Quick Start](../../Agent-Wallet/QuickStart.md).

---

## sunswap {#sunswap}

Want to swap tokens, check rates, or manage liquidity on SunSwap? Just tell the AI. This skill is powered by `@bankofai/sun-cli` and supports swaps plus V2 AMM, V3 concentrated liquidity, and V4 hooks-enabled pools.

**Completely safe — looking only, no spending:**

> What's the current price of TRX?

> How much TRX can I get for 100 USDT on SunSwap?

> Show me the top 10 highest-APY pools on SunSwap.

> Show me all my current SunSwap V3 liquidity positions.

**Requires your confirmation (AI shows the bill first):**

> Swap 100 TRX for USDT on the SunSwap Nile testnet.

> Add 100 TRX and 15 USDT liquidity to the TRX/USDT pool on SunSwap V2.

> Mint a V3 position: TRX/USDT, fee tier 0.3%, full-range.

> Mint a V4 position with `--create-pool` if the pool doesn't exist yet.

> Collect fee rewards from V3 position #12345.

**Real-world scenarios:**

> Looking for arbitrage? Try: "Is it worth swapping 100 USDT to TRX on SunSwap right now?"

> Interested in yield farming? Try: "Which V3 pool on SunSwap has the highest APY? Give me an analysis."

> Looking to buy the dip? Try: "What's TRX's price trend over the last 7 days?"

:::tip V3 fee tiers & tick alignment
V3 only accepts fee tiers `100`, `500`, `3000`, or `10000` (0.01% / 0.05% / 0.3% / 1%). `--tick-lower` and `--tick-upper` must be multiples of the fee's tick spacing (1 / 10 / 60 / 200). The AI validates these before minting — misaligned ticks would otherwise fail on-chain.
:::

---

## sunperp-skill {#sunperp-skill}

Want to trade contracts? This skill handles market data, opening positions, closing positions, and setting stop-loss on SunPerp. Built-in safety locks enforced at the script level: max 20x leverage (configurable in `resources/sunperp_config.json`) and a **mandatory stop-loss on every position-opening order** — auto-set to 5% from entry if you don't specify one, and rejected outright if wider than 25%. Close-position orders (`reduce_only`) are themselves risk-reducing, so they're exempt from the mandatory stop-loss.

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

## tronscan-skill {#tronscan-skill}

Want to know what's happening on-chain? This skill looks up accounts, transactions, tokens, blocks, and network stats. **Pure read-only, completely safe, costs nothing, needs no credentials.** The perfect first skill to get started.

> Look up the full account info and holdings for address TDqSq...xxxxx.

> Show me the details of this transaction: abc123...

> Show the top 10 TRC20 tokens by market cap.

> Give me a TRON network overview: current TPS, Super Representatives, total accounts.

> Show the last 20 USDT transfers from address TXX...

**Real-world scenarios:**

> Found a new token and want to check if it's legit? "Check the holder distribution and contract verification for token TXX..."

> Tracking a whale? "Show all transactions above 100,000 USDT from address TXX... in the last 24 hours."

> Verifying a transfer? "Did this transaction actually succeed: abc123...?"

---

## trc20-toolkit-skill {#trc20-toolkit-skill}

Need to check balances, transfer tokens, or manage approvals for any TRC20 token? This skill handles it all — supports common tokens by symbol (USDT, USDD, SUN, JST, BTT, WIN, etc.) and any TRC20 token by contract address.

**Completely safe — looking only, no spending:**

> Show my USDT balance.

> Check my USDT, USDD, and SUN balances all at once.

> What's the token info (name, symbol, decimals, total supply) for USDT?

> Check the current USDT approval allowance for spender address TSpender...

**Requires your confirmation (AI shows the bill first):**

> Transfer 10 USDT to TRecipientAddress on the Nile testnet.

> Approve 100 USDT for spender TSpenderAddress.

**Advanced features:**

> Check all my token balances at once: "Show my balances for USDT, USDD, SUN, JST, and BTT." (uses batch mode — invalid tokens won't abort the entire query)

> Test before sending: "Do a dry-run transfer of 50 USDT to TXX...." (validates everything without broadcasting)

> Fetch token metadata: "What are the name, symbol, decimals, and total supply of token TXX...?"

**Safety built in:**

- Self-transfers are automatically rejected
- Unlimited (MAX_UINT256) approvals are blocked — only exact amounts allowed
- Recipient and spender addresses are validated as proper TRON addresses
- Amounts must be greater than 0, even in dry-run mode

**Real-world scenarios:**

> Quick portfolio check? Try: "Show my balances for USDT, USDD, SUN, JST, and BTT."

> Sending tokens to a friend? Try: "Transfer 50 USDT to TXX...."

> Preparing for a DeFi operation? Try: "Approve 200 USDT for the SunSwap router, then check the allowance."

---

## usdd-skill {#usdd-skill}

Want to work with **USDD**, TRON's over-collateralized stablecoin? This skill handles the JUST Protocol's Peg Stability Module (PSM) for 1:1 USDT ↔ USDD swaps, reads vault (CDP) positions and protocol parameters, and checks USDD/USDT/USDC/TRX/JST balances.

**Completely safe — looking only, no spending:**

> Show me PSM state: current fees, USDT reserves, and USDD total supply.

> Check my USDD, USDT, and JST balances.

> Show all USDD vault types (TRX-A, TRX-B, sTRX-A, USDT-A, etc.) with their debt ceilings and stability fees.

> Show me CDP position #42 — collateral locked, debt, and collateralization ratio.

**Requires your confirmation (AI shows the bill first):**

> Swap 1000 USDT for 1000 USDD via the PSM (zero fee).

> Redeem 500 USDD back to 500 USDT via the PSM.

**Real-world scenarios:**

> Getting into USDD for the first time? Try: "Sell 1000 USDT for USDD via PSM" — 1:1 swap, currently zero fee, auto-handles TRC20 approval.

> Checking vault health? Try: "Show me all vault types and their current stability fees." (TRX-A/B/C = 5%, sTRX-A = 1%, USDT-A = 0%)

> Following a specific CDP? Try: "Check CDP #42's collateralization ratio."

:::tip PSM vs. vaults
The PSM gives you **instant 1:1 USDT ↔ USDD** swaps — the easiest way to get USDD. Vault/CDP positions (minting USDD against collateral like TRX) are read-only in this skill — you can query them but not open, draw, or repay directly.
:::

:::caution PSM reserves can be depleted
Before redeeming USDD for USDT, check `psm-info` — if USDT reserves are low, `buyGem` may fail. The skill handles 18-decimal USDD vs. 6-decimal USDT normalization automatically.
:::

---

## trx-staking-skill {#trx-staking-skill}

Want to earn rewards by participating in TRON's governance? This skill stakes TRX for **TRON Power (TP)**, votes for Super Representatives (SRs), and claims voting rewards. TRON uses Delegated Proof of Stake — the top 27 SRs produce blocks and distribute rewards proportionally to their voters every 6 hours.

**Completely safe — looking only, no spending:**

> Show my staking overview: TRON Power, frozen TRX, current votes, and pending rewards.

> List the top 27 active Super Representatives.

> Show the top 50 SRs including partners.

> Check the staking status for address TXX....

**Requires your confirmation:**

> Vote all my TRON Power for SR address TSRAddress.

> Split my votes 60% to TSR1 and 40% to TSR2.

> Claim my pending voting rewards.

**Real-world scenarios:**

> First time voting? Try: "List the top 10 SRs, then dry-run a vote for TSRAddress before confirming."

> Want to diversify? Try: "Split my votes 50/50 between TSR1 and TSR2." Each vote transaction replaces all previous votes — the new slate is complete.

> Collecting rewards? Try: "Check my pending rewards, then claim them." Rewards are separate from unstake withdrawals.

:::tip Key facts
- 1 frozen TRX = 1 TRON Power (TP)
- Voting rewards are distributed every 6 hours
- Votes **replace** all previous votes — each vote is a full slate
- Stake 2.0 compatible: reads `frozenV2[]` and uses `voteWitnessAccount`
:::

:::danger 14-day unbonding period
When TRX is unstaked (via the companion staking flow), it enters a **14-day cooldown** during which it is locked and earns no resources or voting power. After 14 days, you must manually call `withdrawExpireUnfreeze` to reclaim the TRX — it does not return automatically. Unstaking also removes the corresponding TRON Power, which invalidates any active votes that depend on it.
:::

---

## multisig-permissions {#multisig-permissions}

Want to add multi-signature protection to your TRON account? This skill manages TRON's native three-tier permission model (Owner, Active, Witness) — configure keys, set thresholds, scope operation permissions, and coordinate multi-party co-signing. Perfect for team wallets or restricting your AI agent to DeFi-only operations.

**Completely safe — looking only, no spending:**

> Check my account's current permission setup.

> Check the permission configuration for address TXk8r...xxxxx.

> List all pending multi-sig proposals.

**Requires your confirmation:**

> Set up a 2-of-3 multi-sig on my account's owner permission with these three keys.

> Restrict the active permission so the AI agent can only call smart contracts (no direct TRX transfers).

> Propose a transfer of 500 USDT to TRecipient and wait for the co-signer to approve.

**Real-world scenarios:**

> Want team approval for large transfers? Try: "Set up 2-of-3 multi-sig, then propose a 10,000 TRX transfer to TVendor... with memo 'Q1 budget'."

> Want to sandbox your AI agent? Try: "Use the agent-restricted template — let the AI only call smart contracts, but require 2 human keys for permission changes."

> Co-signing a pending proposal? Try: "Review all pending proposals and co-sign proposal prop_xxx."

**Key details:**

- Proposals expire after **24 hours** by default — co-signers must approve within this window
- Active permission operations can be scoped to specific transaction types: TransferContract, TriggerSmartContract, FreezeBalanceV2Contract, DelegateResourceContract, VoteWitnessContract, and more
- Supports **hybrid signature workflows** — combine human approval keys with an agent signing key for co-signing
- Pending proposals are stored locally at `~/.clawdbot/multisig/pending/` and can be shared for distributed signing

:::tip Templates make it easy
You don't need to configure every key and threshold manually. Built-in templates like `basic-2of3`, `agent-restricted`, `team-tiered`, and `weighted-authority` handle the common setups — just provide the key addresses.
:::

:::danger Lockout warning
Changing Owner permissions is **irreversible** without the new keys. The skill validates thresholds to prevent lockout, but always double-check key addresses before confirming Owner permission changes.
:::

---

## x402-payment {#x402-payment}

Some APIs and AI agents require on-chain payment before use. This skill uses the x402 protocol to automatically complete "pay first, then receive" on-chain settlement — the AI detects the charge, completes the on-chain payment, gets the result, and reports back. It always asks for your confirmation before paying. Supports payments on multiple chains — **TRON (TRC20: USDT, USDD)** and **BSC (ERC20: USDT, USDC)** (each payment settles on its own chain; this is multi-chain support, not a cross-chain bridge), covering both mainnet and testnet (Nile / BSC testnet).

**Completely safe — looking only, no spending:**

> Verify my x402 wallet status (addresses + readiness).

> Show my GasFree wallet info (address, activation status, balances).

> Fetch the manifest for this x402 agent: https://api.example.com/.well-known/agent.json

**Requires your confirmation:**

> Use the x402 protocol to call this paid agent endpoint: https://api.example.com (replace with the actual paid endpoint URL you want to call)

> Activate my GasFree account on nile with USDT.

:::tip GasFree support (TRON)
The skill prefers the `exact_gasfree` scheme over `exact_permit` when paying on TRON. GasFree requires an activated account with enough token balance in the GasFree wallet — use `--gasfree-info` to check, and `--gasfree-activate` if it's not active yet.
:::

:::caution Wallet credentials come from agent-wallet
This skill loads signers via `agent-wallet` only — it does **not** read raw private keys from random config files. Set `AGENT_WALLET_PASSWORD` for encrypted local mode, or `AGENT_WALLET_PRIVATE_KEY` / `AGENT_WALLET_MNEMONIC` for static mode. Requires Node.js 20+.
:::

---

## recharge-skill {#recharge-skill}

Check your balance, view order history, or top up your account.

**Completely safe — looking only, no spending:**

> How much balance does my BANK OF AI account have?

> Show my recent BANK OF AI order history.

**Requires your confirmation:**

> Recharge 1 USDT to my BANK OF AI account.

---

## bankofai-guide {#bankofai-guide}

The onboarding companion that ties the rest of the skill set together. You don't typically invoke this skill directly — it kicks in automatically in three situations:

1. **Post-install setup.** Right after you run `npx skills add BofAI/skills`, the installer hands off to `bankofai-guide`. It installs the `@bankofai/agent-wallet` CLI globally, checks whether you already have a wallet, and asks whether you want to set one up now or later.
2. **First-wallet creation.** If you have no wallet yet, it offers two paths: a **quick setup** (strongly recommended — fully automated, takes ~10 seconds, generates an encrypted `local_secure` wallet and a strong random password) and a **detailed setup** (step-by-step walkthrough with custom options). Once your wallet is ready, it shows you both the EVM and TRON addresses and tells you where to deposit USDT.
3. **Wallet guard.** Signing skills (`sunswap`, `sunperp-skill`, `trc20-toolkit-skill`, `multisig-permissions`, `x402-payment`) run `agent-wallet list` first to check wallet state before any on-chain operation. **Only when no wallet is found** do they hand off to `bankofai-guide`, which pauses the current operation, walks you through creating one in a minute or two, and then returns control to the original flow.

**Sample prompts that will activate it:**

> Walk me through BANK OF AI onboarding.

> Run bankofai-guide so I can set up my first wallet.

> Help me create an AgentWallet with quick setup.

:::tip Why this skill exists
Most Web3 stumbles happen on day one — no wallet configured, no idea where to deposit funds, no sense of which address belongs to which chain. `bankofai-guide` compresses that whole journey into a handful of confirmations so the rest of your skills can just work.
:::

:::caution Your password matters
The quick setup auto-generates a strong password and stores it in `~/.agent-wallet/runtime_secrets.json` for convenience. Save or memorize it anyway — if that file is ever deleted, the password is the only way to recover access to the encrypted wallet.
:::

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
