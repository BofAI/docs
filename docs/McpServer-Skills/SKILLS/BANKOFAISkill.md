# Skill Catalog

You don't need to write code or understand the technical details. Just copy the sample prompts below into your AI chat, hit enter, and the AI takes care of the rest.

:::warning Three Golden Rules
BANK OF AI SKILLS can operate on **real on-chain assets**. Blockchain transactions are **irreversible** — there's no undo button, no customer service rollback.

1. **Never paste your private key into a chat window.** Use [wallet-cli](/x402/cli/quickstart/) instead (think of it as opening a dedicated "payment account" for your AI — you don't hand over your bank password directly).
2. **Practice with play money first.** Every new operation should be tested on the Nile testnet — it uses free test tokens, so there's nothing to lose.
3. **Read the confirmation prompt carefully.** Before any on-chain transaction, the AI will show you the full bill and wait for your explicit "yes."
:::

---

## Skill Summary

| Skill | What It Does | What Key/Credential Do I Need? |
| :--- | :--- | :--- |
| **wallet-cli** | Standalone TRON wallet operations via the pinned `@tron-walletcli/wallet-cli@4.14.0` — transfers, staking, voting, contracts, signing, chain queries (machine-readable JSON) | A local wallet managed by wallet-cli; agent runs pass passwords via stdin only |
| **sunswap**<br/>installs as `sunswap-dex-trading` | Check prices, get quotes, swap tokens, manage V2/V3/V4 liquidity pools | Read-only: none. Trading: wallet credentials |
| **sunpump-agent-skill**<br/>installs as `sunpump-meme-token-toolkit` | SunPump meme coins: create tokens with one command (server-side, no wallet), market data/rankings/holders/portfolios, plus buy/sell meme coins (automatically picks the swap route based on whether the token has launched, TRON mainnet only) | Read-only & token creation: none. On-chain buy/sell: wallet credentials |
| **sunperp-skill**<br/>installs as `sunperp-perpetual-futures-trading` | Market data, open/close positions, withdrawals | Market data: none. Trading: SunPerp API keys. Withdrawals additionally need `TRON_PRIVATE_KEY` to sign the confirmation |
| **tronscan-skill**<br/>installs as `tronscan-data-lookup` | Look up accounts, transactions, tokens, blocks, network stats | Optional: TronScan API key — without one, requests go through the keyless BofAI proxy and may be rate-limited |
| **usdd-skill**<br/>installs as `usdd-just-protocol` | USDD stablecoin — PSM swaps (1:1 USDT ↔ USDD), vault queries, balance checks | Read-only: none. PSM swaps: wallet credentials |

Five skills install under a different directory name than their repository folder — that second name is what appears in `~/.agents/skills` and what you reference when asking an assistant to read a skill file.

### Credentials

Use the [wallet-cli quick start](/x402/cli/quickstart/) for the official wallet setup. Never paste private keys or passwords into chat. Community projects retain their own requirements: TronScan keys, SunPerp API keys/secrets, and USDD or withdrawal signing settings do not automatically become wallet-cli configuration.

Obtain a B.AI API key from the [console](https://chat.bankofai.io/key) and store it through wallet-cli's supported configuration workflow; never print or commit credentials.

## Haven't Installed Yet?

Head over to **[Quick Start](./QuickStart.md)** — it takes about 1 minute. Come back here to pick your skills once you're set up.

---

## agent-wallet {#agent-wallet}

This legacy wallet Skill is no longer the default setup entry. Start with the [wallet-cli quick start](/x402/cli/quickstart/). SDK, server, and community integrations that still use agent-wallet can use the [Agent Wallet reference](/Agent-Wallet/Intro/).

## wallet-cli {#wallet-cli}

A standalone TRON wallet toolbox. It teaches your AI to run TRON wallet operations through the pinned `@tron-walletcli/wallet-cli@4.14.0` npm package: account, staking, and delegation queries, TRX/token transfers, staking and resource delegation, SR voting and governance, contract calls, message signing, and transaction-status tracking. Every command runs through the CLI's machine-readable interface (`-o json`) — the AI branches on exit codes and structured fields, never on guessed text.

**Completely safe — looking only, no spending:**

> Check my account balance and staking state on Nile with wallet-cli.

> Did this transaction land on-chain? Check its status with wallet-cli: `<your-tx-id>`

> Show me the schema of the wallet-cli `tx send` command (`--json-schema`).

**Requires your confirmation:**

> Use wallet-cli to send 10 TRX to T... on mainnet.

> Stake 100 TRX for energy — mainnet operations are previewed and wait for your explicit confirmation.

:::tip
wallet-cli is the official wallet and CLI entry point. Community Skills and server integrations may still use their own signing implementations; configure each according to its actual dependencies.
:::

:::caution Hard boundaries: passwords and wallet administration
In agent-driven runs, wallet passwords are only accepted via `--password-stdin` from an approved source — the AI never puts a password in command arguments, environment variables, or the chat, and never asks you to paste a password, mnemonic, or private key into the conversation. The root wallet-administration commands `import` / `backup` / `delete` / `change-password` are **human-only by skill policy**: the AI will not run them even if you confirm. This is the skill refusing, not a lock in the CLI — the CLI itself only forces a TTY for `import` and `change-password`, and `backup` even documents a `--password-stdin` form. Any funds-moving operation on mainnet is previewed first and waits for your explicit confirmation.
:::

Note: wallet-cli canonically uses decimal CAIP-2 network ids — `tron:728126428` (Mainnet), `tron:3448148188` (Nile), `tron:2494104990` (Shasta); `tron:mainnet` / `tron:nile` / `tron:shasta` are accepted as input aliases only. This is distinct from the hex identifiers (`tron:0x…`) used in x402 protocol metadata; `wallet-cli x402` still uses wallet-cli network identifiers.

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
Meme coins are highly volatile and easily manipulated. When the AI shows you token info it also surfaces holder concentration — if the top 5 holders together hold more than 40% of supply, it explicitly warns you of rug-pull risk. Default slippage is 5% on the bonding-curve path (`sunpump buy` / `sell`); once a token has launched and trades through `sun swap`, the default is 0.5%; always review the quote before confirming a buy or sell.
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

The standalone payment Skill is being retired from the default integration path. Use the [wallet-cli 4.14 payment flow](/x402/cli/quickstart/): preview first, then authorize payment. This section preserves the old anchor; do not install standalone x402-cli.

## recharge-skill {#recharge-skill}

Use `wallet-cli bai` for recharge and records; discover its commands with `--json-schema` and follow the [B.AI recharge guidance](/x402/cli/command-reference/). It requires a wallet-cli account and a B.AI API key. The recharge service MCP endpoint remains a separate service capability; changing the Skill does not disable it.

## bankofai-guide {#bankofai-guide}

No longer the default installation or first-wallet setup flow. Use the [Skills quick start](/McpServer-Skills/SKILLS/QuickStart/) and [wallet-cli setup guide](/x402/cli/quickstart/). This section retains the old anchor for existing links.

## Recommended Learning Path

**Start here — zero risk, zero config:** Use tronscan-skill to look up accounts and check transactions. Use sunswap to check prices and get quotes. Read-only, no credentials needed.

**Next — practice with play money:** Set up your wallet (see [Wallet CLI Quick Start](/x402/cli/quickstart/)), then test swaps and liquidity operations on the Nile testnet. Confirm the AI behaves exactly as expected.

**Then — mainnet with small amounts:** Run the full flow with a small amount of real funds to make sure everything works.

**Finally — daily use:** Run your regular operations, adjust parameters, and combine skills as needed.

---

## Next Steps

- Want to understand how skills work under the hood? → [What Are Skills?](./Intro.md)
- Running into issues? → [FAQ](./Faq.md)
- Using OpenClaw Extension? → [OpenClaw Extension Documentation](../../Openclaw-extension/Intro.md)

{/* Preserve bookmarks to sections replaced by the wallet-cli migration guidance. */}
<span id="-where-do-i-get-these-keys-how-do-i-set-them-up"></span>
