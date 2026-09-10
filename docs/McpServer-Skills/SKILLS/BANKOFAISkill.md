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
| **wallet-cli** | Standalone TRON wallet operations via the pinned `@tron-walletcli/wallet-cli@4.13.0` — transfers, staking, voting, contracts, signing, chain queries (machine-readable JSON) | A local wallet managed by wallet-cli; agent runs pass passwords via stdin only |
| **sunswap**<br/>installs as `sunswap-dex-trading` | Check prices, get quotes, swap tokens, manage V2/V3/V4 liquidity pools | Read-only: none. Trading: wallet credentials |
| **sunpump-agent-skill**<br/>installs as `sunpump-meme-token-toolkit` | SunPump meme coins: create tokens with one command (server-side, no wallet), market data/rankings/holders/portfolios, plus buy/sell meme coins (automatically picks the swap route based on whether the token has launched, TRON mainnet only) | Read-only & token creation: none. On-chain buy/sell: wallet credentials |
| **sunperp-skill**<br/>installs as `sunperp-perpetual-futures-trading` | Market data, open/close positions, withdrawals | Market data: none. Trading: SunPerp API keys. Withdrawals additionally need `TRON_PRIVATE_KEY` to sign the confirmation |
| **tronscan-skill**<br/>installs as `tronscan-data-lookup` | Look up accounts, transactions, tokens, blocks, network stats | Optional: TronScan API key — without one, requests go through the keyless BofAI proxy and may be rate-limited |
| **usdd-skill**<br/>installs as `usdd-just-protocol` | USDD stablecoin — PSM swaps (1:1 USDT ↔ USDD), vault queries, balance checks | Read-only: none. PSM swaps: wallet credentials |
| **x402-payment** | On-chain "pay-first" auto-settlement on TRON (TRC20) & BSC (ERC20), with GasFree support | Wallet credentials (via agent-wallet) |
| **recharge-skill** | Balance, order history, account top-up | Balance and order queries: BANK OF AI API key. Top-up: wallet credentials — it is authorised by an on-chain x402 payment, not by the API key |
| **bankofai-guide** | Onboarding helper — post-install setup, first AgentWallet creation, wallet guard for other skills | None (runs automatically when needed) |

Five skills install under a different directory name than their repository folder — that second name is what appears in `~/.agents/skills` and what you reference when asking an assistant to read a skill file.

### 🔑 Where Do I Get These Keys? How Do I Set Them Up?

If you just want the AI to look up public data (like token prices or block height), you don't need to configure anything — just start using it.

But if you want to unlock advanced features or trading, grab the keys you need below:

**1. Wallet Credentials (for spending money and trading)**

- **Where to get it:** You don't need to apply anywhere — this is simply your TRON wallet private key.
- **How to set it up:** We've prepared two options in [Quick Start](./QuickStart.md#-want-the-ai-to-trade-for-you) — pick whichever suits you:
  - **Option 1 (Recommended):** Use [Agent Wallet](../../Agent-Wallet/QuickStart.md) — visual interface, 2 minutes, private key encrypted and never exposed.
  - **Option 2:** Paste your private key directly into your system config file (the "notepad method") — great for power users or quick testing.

**2. TronScan API Key (your VIP pass for data queries)**

You can query data without this — requests then go through the keyless BofAI proxy (`ts.bankofai.io`) — but if you query too fast, the system may rate-limit you. With a key, you get the VIP fast lane.

- **Where to get it (completely free):** Go to [TronScan](https://tronscan.org/), register an account, and click to generate a key.
- **How to set it up:** Follow the same "notepad method" in [Quick Start — "Want the AI to Trade for You?"](./QuickStart.md#-want-the-ai-to-trade-for-you) and paste `TRONSCAN_API_KEY` in the same way.

**3. SunPerp API Keys (for perpetual contract trading)**

- **Where to get them:** Go to [SunPerp](https://sunperp.com/), connect your wallet, then generate an API Key and Secret in your account settings.
- **How to set them up:** Use the same "notepad method" to paste `SUNPERP_ACCESS_KEY` and `SUNPERP_SECRET_KEY` into your config file.

**4. BANK OF AI API Key (for balance and order-history queries)**

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

> Managing multiple chains? Try: "Show me all my wallets and their addresses" — one wallet derives both EVM and TRON addresses from the same key. Use `eip155:<chainId>` for EVM networks (e.g. `eip155:1` Ethereum, `eip155:56` BSC, `eip155:137` Polygon, `eip155:42161` Arbitrum, `eip155:8453` Base) and canonical CAIP-2 IDs for TRON: `tron:0x2b6653dc` (Mainnet), `tron:0xcd8690dc` (Nile), `tron:0x94a9059e` (Shasta).

> Need to sign something? Try: "Sign this transaction on BSC" — the AI handles the signing locally without broadcasting. Supports raw transactions, EIP-191 messages, and EIP-712 typed data (EVM only).

:::tip Why use Agent Wallet instead of raw private keys?
Agent Wallet encrypts your private key with a master password. Even if someone accesses your files, they can't use the key without the master password. This is the recommended way to configure wallet credentials for all other skills (sunswap, x402-payment, etc.).
:::

:::caution Dangerous operations are agent-restricted
`remove`, `reset`, and `change-password` cannot be executed by the AI — you must run these commands yourself in the terminal. This protects against accidental or irreversible loss of wallet access. The AI will explain the command and ask you to run it yourself.
:::

For detailed setup instructions, see [Agent Wallet Quick Start](../../Agent-Wallet/QuickStart.md).

---

## wallet-cli {#wallet-cli}

A standalone TRON wallet toolbox. It teaches your AI to run TRON wallet operations through the pinned `@tron-walletcli/wallet-cli@4.13.0` npm package: account, staking, and delegation queries, TRX/token transfers, staking and resource delegation, SR voting and governance, contract calls, message signing, and transaction-status tracking. Every command runs through the CLI's machine-readable interface (`-o json`) — the AI branches on exit codes and structured fields, never on guessed text.

**Completely safe — looking only, no spending:**

> Check my account balance and staking state on Nile with wallet-cli.

> Did this transaction land on-chain? Check its status with wallet-cli: `<your-tx-id>`

> Show me the schema of the wallet-cli `tx send` command (`--json-schema`).

**Requires your confirmation:**

> Use wallet-cli to send 10 TRX to T... on mainnet.

> Stake 100 TRX for energy — mainnet operations are previewed and wait for your explicit confirmation.

:::tip How it differs from agent-wallet
`agent-wallet` is the signing engine other skills (sunswap, x402-payment, …) rely on; `wallet-cli` is a standalone TRON wallet toolbox that performs transfers, staking, and governance directly. For swaps or liquidity, use `sunswap` — not wallet-cli.
:::

:::caution Hard boundaries: passwords and wallet administration
In agent-driven runs, wallet passwords are only accepted via `--password-stdin` from an approved source — the AI never puts a password in command arguments, environment variables, or the chat, and never asks you to paste a password, mnemonic, or private key into the conversation. The root wallet-administration commands `import` / `backup` / `delete` / `change-password` are **human-only by skill policy**: the AI will not run them even if you confirm. This is the skill refusing, not a lock in the CLI — the CLI itself only forces a TTY for `import` and `change-password`, and `backup` even documents a `--password-stdin` form. Any funds-moving operation on mainnet is previewed first and waits for your explicit confirmation.
:::

Note: wallet-cli canonically uses decimal CAIP-2 network ids — `tron:728126428` (Mainnet), `tron:3448148188` (Nile), `tron:2494104990` (Shasta); `tron:mainnet` / `tron:nile` / `tron:shasta` are accepted as input aliases only. This is distinct from the hex identifiers (`tron:0x…`) required by the x402 tooling.

Since Skills 2.0.0, the generic TRON workflows of the retired `trc20-toolkit-skill`, `trx-staking-skill`, and `multisig-permissions` skills — TRC20/TRC10 transfers and token queries, staking and SR voting, and account-permission management (`permission show|update`) — are handled by this skill.

---

## sunswap {#sunswap}

Want to swap tokens, check rates, or manage liquidity on SunSwap? Just tell the AI. This skill is powered by `@sun-protocol/sun-cli` (pinned to 1.2.2) and supports swaps plus V2 AMM, V3 concentrated liquidity, and V4 hooks-enabled pools.

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

> Looking to buy the dip? Try: "What's the current price of TRX, and how has this pool's volume moved over the last 7 days?"

:::tip V3 fee tiers & tick alignment
V3 only accepts fee tiers `100`, `500`, `3000`, or `10000` (0.01% / 0.05% / 0.3% / 1%). `--tick-lower` and `--tick-upper` must be multiples of the fee's tick spacing (1 / 10 / 60 / 200). The AI validates these before minting — misaligned ticks would otherwise fail on-chain.
:::

---

## sunpump-agent-skill {#sunpump-agent-skill}

Want to play with meme coins on SunPump? This skill is built on `@sun-protocol/sun-cli` (pinned to 1.2.2) and helps you create meme tokens, check market data, do research, and buy/sell meme coins. Token creation (`sun sunpump launch`) is **server-side — no wallet needed**: provide a name, symbol, description, and logo, and the platform signs and broadcasts the creation transaction for you. For trading, it **picks the trade path automatically**: tokens that haven't created a SunSwap V2 pair yet ("pre-launch") go through `sun sunpump buy/sell`, while tokens that already have a SunSwap V2 pair ("post-launch") use a regular `sun swap` — before placing an order the AI runs `sunpump state` to confirm which path applies. **Every sunpump-agent-skill capability — queries and trading alike — is TRON mainnet only; testnets are not supported.**

**Absolutely safe, read-only:**

> What are the top 10 SunPump meme coins by 24h gain?

> Get the detail for token TXYZ...: price, market cap, 24h volume, holder count.

> Show me the holder distribution for TXYZ... — is it controlled by a few addresses?

> Show wallet T...'s SunPump holdings and last 20 trades.

**Requires your confirmation (the AI shows you the bill first):**

> Launch a meme token on SunPump: name `<your token name>`, symbol `<SYMBOL>`, description `<one sentence>`, logo `<path to your image>`.

> Buy TXYZ... with 10 TRX on SunPump (a token without a SunSwap V2 pair yet).

> Sell 1000 TXYZ... with slippage set to 5%.

> Buy some TXYZ... that already has a SunSwap V2 pair, with 100 TRX and 1% slippage.

**Real scenarios:**

> Looking for hot new coins? "List the top 10 SunPump tokens by 24h volume, then check the holder concentration of the #1."

> Want to snipe a launch? "What's the state of TXYZ... right now? If it's still tradeable on the bonding curve, buy it with 10 TRX." — the AI checks `state` first, quotes, and only places the order after you confirm.

> Want to review your record? "Show me wallet T...'s SunPump holdings and buy history."

:::tip Pre-launch vs post-launch
A SunPump token has two states: **pre-launch** (no SunSwap V2 pair yet, `state` = 1 TRADING or 2 READY_TO_LAUNCH) and **post-launch** (a SunSwap V2 pair has been created, `state` = 3 LAUNCHED). The key concept is the **Bonding Curve (launch progress bar)**: as the community buys in, the meme coin's market cap grows, and once the curve hits 100% a trading pair is automatically created on SunSwap V2 and the token "launches". The AI picks the right command automatically — you don't need to worry about the details, but understanding this helps you follow what it's doing.
:::

:::caution Meme coins are high-risk
Meme coins are highly volatile and easily manipulated. When the AI shows you token info it also surfaces holder concentration — if the top few addresses hold too much combined (e.g. top 5 > 40%), it explicitly warns you of rug-pull risk. Default slippage is 5% on the bonding-curve path (`sunpump buy` / `sell`); once a token has launched and trades through `sun swap`, the default is 0.5%; always review the quote before confirming a buy or sell.
:::

:::tip About token creation (launch)
Creation goes through the SunPump agent endpoint — the platform signs and broadcasts the transaction, so **no wallet is needed**. Name, symbol, and description are required; a logo is strongly recommended (launches without one may be rejected by the API). On success the AI reports the new token's contract address and creation tx hash. Like every other SunPump operation, launch is **mainnet only** — the CLI rejects any non-mainnet `--network` before doing anything, even under `--dry-run`.
:::

**sunpump-agent-skill's full functionality (queries and trading) only works on TRON mainnet, not testnets.**

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

## x402-payment {#x402-payment}

Some APIs and AI agents require on-chain payment before use. This skill uses the x402 protocol to automatically complete "pay first, then receive" on-chain settlement — the AI detects the charge, previews it, completes the on-chain payment, gets the result, and reports back. It always asks for your confirmation before paying. Payments run through the `x402-cli` command-line tool and this Skill requires **exactly version 1.0.1**. The skill checks your installed version first and, if the CLI is missing or another version is installed, asks before installing `npm install -g @bankofai/x402-cli@1.0.1` — no local payment scripts are involved. The standalone CLI's latest release is 1.0.2, but that is not the version pinned by this Skill. Payments settle on **TRON (TRC20: USDT, USDD)** or **BSC (ERC20: USDT on mainnet; USDT and USDC on testnet)** — each payment settles on its own chain; this is multi-chain support, not a cross-chain bridge.

**Completely safe — looking only, no spending:**

> Check whether x402-cli is installed and which version I have.

> Preview what this endpoint would charge before I pay anything: https://api.example.com/protected

> Show me what this endpoint would charge, without paying: https://api.example.com/protected

**Requires your confirmation:**

> Use the x402 protocol to call this paid agent endpoint, and don't spend more than 0.01 USDT: https://api.example.com (replace with the actual paid endpoint URL you want to call)

> Pay this endpoint on Nile with USDT via GasFree — cap the payment at 0.01 and the relayer fee at 0.5.

:::tip Always previewed, always capped
Before the first payment to an unfamiliar endpoint, the skill runs a dry run (`x402-cli pay <url> --dry-run --json`) and shows you the network, scheme, token, and exact amount. Unless you explicitly approve the exact advertised amount, every real payment then carries a spending cap (`--max-amount`), so the payment itself can't exceed what you approved — on GasFree the relayer fee sits on top of it, capped separately (see below).
:::

:::tip GasFree support (TRON)
GasFree (`scheme=exact_gasfree`) lets you pay on TRON without holding TRX for energy — a relayer covers the network cost and charges a small fee in the payment token instead (the relayer's service charge: a fixed transfer fee per payment, plus a one-time activation fee on first use, deducted from your GasFree account). The CLI takes the first payment option the endpoint offers that matches your constraints — it does not prefer GasFree — so say "require GasFree" whenever an endpoint also offers a normal TRON payment. Your GasFree account needs enough of the payment token to cover **both** the payment amount and the relayer fee. Because the spending cap doesn't include that fee, every GasFree payment also caps the fee (`--max-gasfree-fee`) unless you explicitly approve the estimate. GasFree is TRON-only — it can't be combined with a BSC (`eip155:*`) network.
:::

:::info Networks use canonical CAIP-2 IDs
`tron:0x2b6653dc` (TRON Mainnet — USDT, USDD), `tron:0xcd8690dc` (Nile — USDT, USDD), `tron:0x94a9059e` (Shasta — USDT), `eip155:56` (BSC — USDT), `eip155:97` (BSC testnet — USDT, USDC). Shorthand aliases such as `tron:mainnet` are no longer accepted.
:::

:::caution Wallet credentials come from agent-wallet
This skill prefers `agent-wallet` for signing — it does **not** read raw private keys from random config files, and never accepts a private key typed into a chat command. The underlying CLI does still honour `EVM_PRIVATE_KEY` / `TRON_PRIVATE_KEY` / `PRIVATE_KEY` if they are already set in your environment, which is the development and CI escape hatch. Set `AGENT_WALLET_PASSWORD` for encrypted local mode, or `AGENT_WALLET_PRIVATE_KEY` / `AGENT_WALLET_MNEMONIC` for static mode. Requires Node.js 20+.
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

1. **Post-install setup.** Right after you run `npx skills add https://github.com/BofAI/skills/tree/main -g`, the installer hands off to `bankofai-guide`. It installs the `@bankofai/agent-wallet` CLI globally, checks whether you already have a wallet, and asks whether you want to set one up now or later.
2. **First-wallet creation.** If you have no wallet yet, it offers two paths: a **quick setup** (strongly recommended — fully automated, takes ~10 seconds, generates an encrypted `local_secure` wallet and a strong random password) and a **detailed setup** (step-by-step walkthrough with custom options). Once your wallet is ready, it shows you both the EVM and TRON addresses and tells you where to deposit USDT.
3. **Wallet guard.** Signing skills run `agent-wallet list` first (`sunswap`, `sunperp-skill`, `sunpump-agent-skill` and `x402-payment`; the first three also hand off to `bankofai-guide`) to check wallet state before any on-chain operation. **Only when no wallet is found** do they hand off to `bankofai-guide`, which pauses the current operation, walks you through creating one in a minute or two, and then returns control to the original flow.

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
