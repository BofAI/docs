# Complete Capabilities

This page is the complete reference for all SUN CLI commands. Commands are organized by category: wallet management, price, token, swap, pool, liquidity, position, pair, farm, protocol, transaction, contract, and SunPump.

> Legend: `<arg>` = required argument, `[arg]` = optional argument.
> Options marked with **(required)** must be provided. All others are optional.

---

## Global Flags

All commands inherit these root-level flags. **Root flags must be placed before the subcommand.**

| Flag | Description |
| :--- | :--- |
| `--output <format>` | Output format: `table`, `json`, `tsv` |
| `--json` | Shortcut for JSON output |
| `--fields <list>` | Comma-separated output field filter |
| `--network <network>` | Override `TRON_NETWORK` (e.g., `mainnet`, `nile`, `shasta`) |
| `-k, --private-key <key>` | Provide a private key for this invocation only |
| `-m, --mnemonic <phrase>` | Provide a mnemonic for this invocation only |
| `-i, --mnemonic-account-index <index>` | Provide a mnemonic account index for this invocation only |
| `-p, --agent-wallet-password <password>` | Override `AGENT_WALLET_PASSWORD` for this invocation |
| `-d, --agent-wallet-dir <dir>` | Override `AGENT_WALLET_DIR` for this invocation |
| `-y, --yes` | Skip confirmation prompts |
| `--dry-run` | Print intent without sending the write action |

:::caution Private Key Security
The `-k` / `--private-key` and `-m` / `--mnemonic` flags pass sensitive
material as command-line arguments, which may be recorded in shell history
and process listings. Prefer environment variables (`AGENT_WALLET_PRIVATE_KEY`,
`AGENT_WALLET_MNEMONIC`) or [agent-wallet](https://github.com/BofAI/agent-wallet)
encrypted storage for all non-throwaway keys.
:::

**Examples:**

```bash
sun --json price TRX
```

```bash
sun --output tsv pool top-apy --page-size 10
```

```bash
sun --fields address,network wallet address
```

```bash
sun -p your_agent_wallet_password wallet address
```

```bash
sun -k your_private_key --network nile --yes swap TRX USDT 1000000
```

```bash
sun --dry-run contract send TContract transfer --args '["TRecipient","1000000"]'
```

---

## Wallet & Portfolio

### `wallet address` (read)

Print the active wallet address.

```bash
sun wallet address
```

### `wallet balances` (read)

Fetch wallet token balances.

```bash
sun wallet balances [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--owner <address>` | Wallet address to query | Active wallet |
| `--tokens <tokens>` | Comma-separated token list: `TRX,<TRC20_ADDRESS>,...` | `TRX` |

---

## Price

### `price [token]` (read)

Get token prices from SUN.IO. Accepts a built-in symbol or address.

```bash
sun price [token] [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--address <addresses>` | Comma-separated token contract addresses | — |

```bash
sun price TRX
```

```bash
sun price USDT
```

```bash
sun price --address TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

---

## Token

### `token list` (read)

Fetch tokens by address or protocol.

```bash
sun token list [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--address <tokenAddress>` | Filter by token contract address | — |
| `--protocol <protocol>` | Protocol filter (V2, V3, V4) | — |
| `--page <n>` | Page number | `1` |
| `--page-size <n>` | Page size | `20` |
| `--sort <field>` | Sort field | — |
| `--no-blacklist` | Include blacklisted tokens | `false` |

### `token search <keyword>` (read)

Fuzzy search for tokens by name or symbol.

```bash
sun token search <keyword> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--protocol <protocol>` | Protocol filter | — |
| `--page <n>` | Page number | `1` |
| `--page-size <n>` | Page size | `20` |

---

## Swap

:::caution Amount precision — `<amountIn>` is an integer scaled by the token's `decimals`
Every `<amountIn>` (and every `--amount*` option in the Liquidity section below) is the human-readable amount × `10^decimals`. **No decimal point, no automatic conversion.**

- TRX, USDT (TRC20), WTRX, USDCOLD, WIN — **6 decimals** → `1` token = `1000000`
- USDD, SUN, JST, BTT, USDDOLD — **18 decimals** → `1` token = `1000000000000000000`

So `sun swap TRX USDT 1000000` swaps **1 TRX** (not 1,000,000 TRX) for USDT.
:::

### `swap <tokenIn> <tokenOut> <amountIn>` (write)

Execute a token swap via SunSwap Universal Router.

```bash
sun swap <tokenIn> <tokenOut> <amountIn> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--slippage <n>` | Slippage tolerance as decimal (e.g. 0.005 = 0.5%) | `0.005` |

```bash
# Swap 1 TRX for USDT
sun swap TRX USDT 1000000
```

```bash
# Same swap, with 1% slippage tolerance
sun swap TRX USDT 1000000 --slippage 0.01
```

### `swap:quote <tokenIn> <tokenOut> <amountIn>` (read)

Get a swap quote without executing.

```bash
sun swap:quote <tokenIn> <tokenOut> <amountIn> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--all` | Show all available routes | `false` |

```bash
# Quote: swap 1 TRX for USDT
sun swap:quote TRX USDT 1000000
```

```bash
sun swap:quote TRX USDT 1000000 --all
```

### `swap:quote-raw` (read)

Low-level router quote call.

```bash
sun swap:quote-raw [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--router <address>` | **(required)** Smart router contract address | — |
| `--fn <name>` | Quote function name | `quoteExactInput` |
| `--args <json>` | **(required)** Arguments as JSON array | — |
| `--abi <json>` | Router ABI as JSON array | — |

### `swap:exact-input` (write)

Low-level router swap execution.

```bash
sun swap:exact-input [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--router <address>` | **(required)** Smart router contract address | — |
| `--fn <name>` | Swap function name | `swapExactInput` |
| `--args <json>` | **(required)** Arguments as JSON array | — |
| `--value <sun>` | TRX call value in Sun | — |
| `--abi <json>` | Router ABI as JSON array | — |

---

## Pool

### `pool list` (read)

List pools with filters.

```bash
sun pool list [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--address <poolAddress>` | Filter by pool address | — |
| `--token <tokenOrAddress>` | Filter by token (symbol or address) | — |
| `--protocol <protocol>` | Protocol filter (V2, V3, V4) | — |
| `--page <n>` | Page number | `1` |
| `--page-size <n>` | Page size | `20` |
| `--sort <field>` | Sort field | — |
| `--no-blacklist` | Include blacklisted pools | `false` |

### `pool search <keyword>` (read)

Search pools by keyword.

```bash
sun pool search <keyword> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--protocol <protocol>` | Protocol filter | — |
| `--page <n>` | Page number | `1` |
| `--page-size <n>` | Page size | `20` |

### `pool top-apy` (read)

List top APY pools.

```bash
sun pool top-apy [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--protocol <protocol>` | Protocol filter | — |
| `--page <n>` | Page number | `1` |
| `--page-size <n>` | Page size | `20` |

### `pool hooks` (read)

List registered pool hooks.

```bash
sun pool hooks
```

### `pool vol-history <poolAddress>` (read)

Pool volume history over a date range.

```bash
sun pool vol-history <poolAddress> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--start <date>` | Start date (YYYY-MM-DD) | — |
| `--end <date>` | End date (YYYY-MM-DD) | — |

### `pool liq-history <poolAddress>` (read)

Pool liquidity history over a date range.

```bash
sun pool liq-history <poolAddress> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--start <date>` | Start date (YYYY-MM-DD) | — |
| `--end <date>` | End date (YYYY-MM-DD) | — |

---

## Liquidity

### `liquidity v2:add` (write)

Add V2 liquidity. Router address is auto-detected by network.

```bash
sun liquidity v2:add [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--token-a <tokenOrSymbol>` | **(required)** Token A (symbol or address) | — |
| `--token-b <tokenOrSymbol>` | **(required)** Token B (symbol or address) | — |
| `--amount-a <raw>` | Amount of token A (raw units) | — |
| `--amount-b <raw>` | Amount of token B (raw units) | — |
| `--min-a <raw>` | Minimum amount A | — |
| `--min-b <raw>` | Minimum amount B | — |
| `--router <address>` | V2 router address | Auto by network |
| `--to <address>` | LP token recipient | Active wallet |
| `--deadline <timestamp>` | Transaction deadline | — |
| `--abi <json>` | Custom router ABI | — |

> Provide at least one of `--amount-a` or `--amount-b`. When only one is given, the other is auto-calculated from pool reserves.

Create a new liquidity pool (both token amounts required):

```bash
sun liquidity v2:add --token-a TRX --token-b USDT --amount-a 1000000 --amount-b 290000
```

Add liquidity to an existing pool (the other token amount is calculated automatically):

```bash
sun liquidity v2:add --token-a TRX --token-b USDT --amount-a 1000000
```

### `liquidity v2:remove` (write)

Remove V2 liquidity.

```bash
sun liquidity v2:remove [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--token-a <tokenOrSymbol>` | **(required)** Token A | — |
| `--token-b <tokenOrSymbol>` | **(required)** Token B | — |
| `--liquidity <raw>` | **(required)** LP token amount to remove | — |
| `--min-a <raw>` | Minimum amount A | — |
| `--min-b <raw>` | Minimum amount B | — |
| `--router <address>` | V2 router address | Auto by network |
| `--to <address>` | Token recipient | Active wallet |
| `--deadline <timestamp>` | Transaction deadline | — |
| `--abi <json>` | Custom router ABI | — |

```bash
sun liquidity v2:remove --token-a TRX --token-b USDT --liquidity 500000
```

### `liquidity v3:mint` (write)

Mint a new V3 concentrated liquidity position. Position Manager is auto-detected by network.

```bash
sun liquidity v3:mint [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--token0 <tokenOrSymbol>` | **(required)** Token 0 (symbol or address) | — |
| `--token1 <tokenOrSymbol>` | **(required)** Token 1 (symbol or address) | — |
| `--fee <n>` | Pool fee tier | `3000` |
| `--tick-lower <n>` | Lower tick boundary | Auto |
| `--tick-upper <n>` | Upper tick boundary | Auto |
| `--amount0 <raw>` | Amount of token 0 | — |
| `--amount1 <raw>` | Amount of token 1 | — |
| `--min0 <raw>` | Minimum amount 0 | — |
| `--min1 <raw>` | Minimum amount 1 | — |
| `--pm <address>` | Position Manager address | Auto by network |
| `--recipient <address>` | NFT recipient | Active wallet |
| `--deadline <timestamp>` | Transaction deadline | — |
| `--abi <json>` | Custom ABI | — |

> Provide at least one of `--amount0` or `--amount1`. When only one is given, the other is auto-calculated. TRX is automatically converted to WTRX for V3 pool lookup.

```bash
sun liquidity v3:mint --token0 TRX --token1 USDT --amount0 1000000
```

### `liquidity v3:increase` (write)

Increase liquidity on an existing V3 position.

```bash
sun liquidity v3:increase [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--token-id <id>` | **(required)** Position NFT token ID | — |
| `--amount0 <raw>` | Amount of token 0 | — |
| `--amount1 <raw>` | Amount of token 1 | — |
| `--min0 <raw>` | Minimum amount 0 | — |
| `--min1 <raw>` | Minimum amount 1 | — |
| `--token0 <tokenOrSymbol>` | Token 0 (needed for single-sided auto-compute) | — |
| `--token1 <tokenOrSymbol>` | Token 1 (needed for single-sided auto-compute) | — |
| `--fee <n>` | Pool fee (needed for single-sided auto-compute) | `3000` |
| `--pm <address>` | Position Manager address | Auto by network |
| `--deadline <timestamp>` | Transaction deadline | — |
| `--abi <json>` | Custom ABI | — |

> When providing only one amount, `--token0`, `--token1`, and `--fee` are required for auto-calculation.

```bash
sun liquidity v3:increase --token-id 123 --amount0 500000
```

### `liquidity v3:decrease` (write)

Decrease liquidity on an existing V3 position.

```bash
sun liquidity v3:decrease [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--token-id <id>` | **(required)** Position NFT token ID | — |
| `--liquidity <raw>` | **(required)** Liquidity amount to remove | — |
| `--min0 <raw>` | Minimum amount 0 | — |
| `--min1 <raw>` | Minimum amount 1 | — |
| `--pm <address>` | Position Manager address | Auto by network |
| `--deadline <timestamp>` | Transaction deadline | — |
| `--abi <json>` | Custom ABI | — |

```bash
sun liquidity v3:decrease --token-id 123 --liquidity 1000
```

### `liquidity v3:collect` (write)

Collect accumulated fees from a V3 position.

```bash
sun liquidity v3:collect [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--token-id <id>` | **(required)** Position NFT token ID | — |
| `--recipient <address>` | Fee recipient | Active wallet |
| `--pm <address>` | Position Manager address | Auto by network |
| `--abi <json>` | Custom ABI | — |

```bash
sun liquidity v3:collect --token-id 123
```

### `liquidity v4:mint` (write)

Mint a new V4 concentrated liquidity position.

```bash
sun liquidity v4:mint [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--token0 <tokenOrSymbol>` | **(required)** Token 0 | — |
| `--token1 <tokenOrSymbol>` | **(required)** Token 1 | — |
| `--fee <n>` | Pool fee tier | — |
| `--tick-lower <n>` | Lower tick boundary | Auto |
| `--tick-upper <n>` | Upper tick boundary | Auto |
| `--amount0 <raw>` | Amount of token 0 | — |
| `--amount1 <raw>` | Amount of token 1 | — |
| `--slippage <n>` | Slippage tolerance | — |
| `--sqrt-price <value>` | Initial sqrtPriceX96 (for pool creation) | — |
| `--create-pool` | Create the pool if it doesn't exist | `false` |
| `--recipient <address>` | NFT recipient | Active wallet |
| `--deadline <timestamp>` | Transaction deadline | — |

In an existing pool:

```bash
sun liquidity v4:mint --token0 TRX --token1 USDT --amount0 1000000
```

Create pool if it does not exist:

```bash
sun liquidity v4:mint --token0 TRX --token1 USDT --amount0 1000000 --create-pool
```

### `liquidity v4:increase` (write)

Increase liquidity on an existing V4 position.

```bash
sun liquidity v4:increase [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--token-id <id>` | **(required)** Position NFT token ID | — |
| `--token0 <tokenOrSymbol>` | **(required)** Token 0 | — |
| `--token1 <tokenOrSymbol>` | **(required)** Token 1 | — |
| `--fee <n>` | Pool fee tier | — |
| `--amount0 <raw>` | Amount of token 0 | — |
| `--amount1 <raw>` | Amount of token 1 | — |
| `--slippage <n>` | Slippage tolerance | — |
| `--deadline <timestamp>` | Transaction deadline | — |

```bash
sun liquidity v4:increase --token-id 123 --token0 TRX --token1 USDT --amount0 500000
```

### `liquidity v4:decrease` (write)

Decrease liquidity on an existing V4 position.

```bash
sun liquidity v4:decrease [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--token-id <id>` | **(required)** Position NFT token ID | — |
| `--liquidity <raw>` | **(required)** Liquidity amount to remove | — |
| `--token0 <tokenOrSymbol>` | **(required)** Token 0 | — |
| `--token1 <tokenOrSymbol>` | **(required)** Token 1 | — |
| `--fee <n>` | Pool fee tier | — |
| `--min0 <raw>` | Minimum amount 0 | — |
| `--min1 <raw>` | Minimum amount 1 | — |
| `--slippage <n>` | Slippage tolerance | — |
| `--deadline <timestamp>` | Transaction deadline | — |

```bash
sun liquidity v4:decrease --token-id 123 --liquidity 1000 --token0 TRX --token1 USDT
```

### `liquidity v4:collect` (write)

Collect accumulated fees from a V4 position.

```bash
sun liquidity v4:collect [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--token-id <id>` | **(required)** Position NFT token ID | — |
| `--token0 <tokenOrSymbol>` | Token 0 | — |
| `--token1 <tokenOrSymbol>` | Token 1 | — |
| `--fee <n>` | Pool fee tier | — |
| `--deadline <timestamp>` | Transaction deadline | — |

```bash
sun liquidity v4:collect --token-id 123
```

### `liquidity v4:info` (read)

Get details about a V4 position.

```bash
sun liquidity v4:info [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--pm <address>` | **(required)** Position Manager address | — |
| `--token-id <id>` | **(required)** Position NFT token ID | — |

```bash
sun liquidity v4:info --pm <positionManager> --token-id 123
```

---

## Position

### `position list` (read)

List liquidity positions.

```bash
sun position list [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--owner <address>` | Owner wallet address | — |
| `--pool <poolAddress>` | Filter by pool | — |
| `--protocol <protocol>` | Protocol filter (V2, V3, V4) | — |
| `--page <n>` | Page number | `1` |
| `--page-size <n>` | Page size | `20` |

### `position tick <poolAddress>` (read)

Get tick data for a pool.

```bash
sun position tick <poolAddress> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--page <n>` | Page number | `1` |
| `--page-size <n>` | Page size | `20` |

---

## Pair

### `pair info` (read)

Get token pair information.

```bash
sun pair info [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--token <tokenAddress>` | Token contract address | — |
| `--protocol <protocol>` | Protocol filter | — |
| `--page <n>` | Page number | `1` |
| `--page-size <n>` | Page size | `20` |

---

## Farm

### `farm list` (read)

List farming pools.

```bash
sun farm list [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--farm <farmAddress>` | Filter by farm address | — |
| `--page <n>` | Page number | `1` |
| `--page-size <n>` | Page size | `20` |

### `farm tx` (read)

List farming transaction history.

```bash
sun farm tx [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--owner <address>` | Owner address | — |
| `--farm <farmAddress>` | Filter by farm | — |
| `--type <farmTxType>` | Transaction type | — |
| `--start <time>` | Start time (ISO or unix ms) | — |
| `--end <time>` | End time | — |
| `--page <n>` | Page number | `1` |
| `--page-size <n>` | Page size | `20` |

### `farm positions` (read)

List farming positions.

```bash
sun farm positions [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--owner <address>` | Owner address | — |
| `--farm <farmAddress>` | Filter by farm | — |
| `--page <n>` | Page number | `1` |
| `--page-size <n>` | Page size | `20` |

---

## Protocol

### `protocol info` (read)

```bash
sun protocol info [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--protocol <protocol>` | Protocol filter | — |

### `protocol vol-history` (read)

```bash
sun protocol vol-history [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--protocol <protocol>` | Protocol filter | — |
| `--start <date>` | Start date (YYYY-MM-DD) | — |
| `--end <date>` | End date (YYYY-MM-DD) | — |

### `protocol users-history` (read)

```bash
sun protocol users-history [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--protocol <protocol>` | Protocol filter | — |
| `--start <date>` | Start date | — |
| `--end <date>` | End date | — |

### `protocol tx-history` (read)

```bash
sun protocol tx-history [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--protocol <protocol>` | Protocol filter | — |
| `--start <date>` | Start date | — |
| `--end <date>` | End date | — |

### `protocol pools-history` (read)

```bash
sun protocol pools-history [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--protocol <protocol>` | Protocol filter | — |
| `--start <date>` | Start date | — |
| `--end <date>` | End date | — |

### `protocol liq-history` (read)

```bash
sun protocol liq-history [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--protocol <protocol>` | Protocol filter | — |
| `--start <date>` | Start date | — |
| `--end <date>` | End date | — |

---

## Transaction

### `tx scan` (read)

Scan on-chain transaction history.

```bash
sun tx scan [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--protocol <protocol>` | Protocol filter | — |
| `--token <tokenAddress>` | Filter by token address | — |
| `--pool <poolAddress>` | Filter by pool address | — |
| `--type <type>` | Transaction type: `swap`, `add`, `withdraw` | — |
| `--start <time>` | Start time (ISO or unix ms) | — |
| `--end <time>` | End time | — |
| `--page-size <n>` | Page size | `20` |
| `--offset <offset>` | Pagination offset | — |

---

## Contract

### `contract read <address> <functionName>` (read)

Read from any TRON smart contract.

```bash
sun contract read <address> <functionName> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--args <json>` | Arguments as JSON array | `[]` |
| `--abi <json>` | Contract ABI as JSON array | — |

```bash
sun contract read TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t balanceOf --args '["TYourAddress"]'
```

### `contract send <address> <functionName>` (write)

Send a transaction to any TRON smart contract.

```bash
sun contract send <address> <functionName> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--args <json>` | Arguments as JSON array | `[]` |
| `--value <sun>` | TRX call value in Sun | — |
| `--abi <json>` | Contract ABI as JSON array | — |

```bash
sun contract send TRecipient transfer --args '["TRecipient","1000000"]' --value 0
```

`contract send` returns `tronscanUrl` when a transaction is broadcast successfully.

---

## SunPump

SunPump is the meme-token launchpad on TRON. This command group covers token discovery (prices, rankings, holders, wallet portfolios, trade history), one-command token creation (`launch`), plus pre-launch trading.

> **About the Bonding Curve:** the Bonding Curve is a token's launch progress bar — as the community participates and buys in, the meme coin's market cap grows and the curve fills toward 100%; once it hits 100% a trading pair is automatically created on SunSwap V2 and the token "launches". Tokens still under 100% (pre-launch) trade with `sun sunpump buy/sell` on SunPump; after launch, use [`sun swap`](#swap) instead.

:::caution SunPump is TRON mainnet only
All `sunpump` subcommands only work on TRON mainnet. The API host is `https://api-v2.sunpump.meme/pump-api` and the on-chain bonding-curve contract is `TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw`. Passing `--network nile` (or any non-mainnet value) fails fast with `SunPump is only available on mainnet`. Drop `--network` or pass `--network mainnet`.
:::

:::tip Pre-launch vs post-launch — pick the right trade command
- **Pre-launch (Bonding Curve under 100%, no SunSwap V2 pair yet):** `tokenLaunchedInstant` is `null`, on-chain `state` is `1` (TRADING) or `2` (READY_TO_LAUNCH) — trade with `sun sunpump buy` / `sun sunpump sell`.
- **Post-launch (SunSwap V2 pair created):** `state` is `3` (LAUNCHED) and `swapPoolAddress` is set — use [`sun swap`](#swap) instead.

Run `sun sunpump state <addr>` or `sun sunpump token get <addr>` before trading to decide which path to use. Read-only queries (prices, holders, portfolio, trade history) and `launch` need no wallet; trading does.
:::

### `sunpump token get <contractAddress>` (read)

Get SunPump token detail by contract address: price, market cap, 24h volume, holder count, total supply, owner, swap-pool address, social links, and launch state.

```bash
sun sunpump token get <contractAddress>
```

### `sunpump token list` (read)

List SunPump tokens with optional filters and pagination.

```bash
sun sunpump token list [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--contract <address>` | Filter by contract address | — |
| `--owner <address>` | Filter by owner address | — |
| `--symbol <symbol>` | Filter by symbol | — |
| `--name <name>` | Filter by name | — |
| `--description <text>` | Filter by description | — |
| `--page <n>` | Page number | — |
| `--size <n>` | Page size | — |
| `--sort <field>` | Sort field (e.g. `marketCap,desc`) | — |

### `sunpump token search <query>` (read)

Fuzzy search tokens by name or symbol.

```bash
sun sunpump token search <query> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--on-sunswap` | Only tokens already launched on SunSwap | `false` |
| `--page <n>` | Page number | — |
| `--size <n>` | Page size | — |
| `--sort <field>` | Sort field | — |

### `sunpump token search-v2 <query>` (read)

The v2 version of fuzzy search (calls the `/token/searchV2` endpoint). Compared with `search`, it adds the `--dlive`, `--ai-helper`, `--twitter-launch`, and `--sun-agent-launch` filters.

```bash
sun sunpump token search-v2 <query> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--on-sunswap` | Only tokens already launched on SunSwap | — |
| `--dlive` | Filter: DLive showing | — |
| `--ai-helper` | Filter: AI helper | — |
| `--twitter-launch` | Filter: Twitter launch | — |
| `--sun-agent-launch` | Filter: Sun agent launch | — |
| `--page <n>` | Page number | — |
| `--size <n>` | Page size | — |
| `--sort <field>` | Sort field | — |

### `sunpump token by-owner <ownerAddress>` (read)

List tokens created by a wallet.

```bash
sun sunpump token by-owner <ownerAddress> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--page <n>` | Page number | — |
| `--size <n>` | Page size | — |
| `--sort <field>` | Sort field | — |

### `sunpump token holders <tokenAddress>` (read)

List a token's holders, with balance and percentage.

```bash
sun sunpump token holders <tokenAddress> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--include-zero` | Include zero-balance holders | — |
| `--page <n>` | Page number | — |
| `--size <n>` | Page size | — |
| `--sort <field>` | Sort field (default: balance descending) | — |

> The `percent` field is returned as a percent value (e.g. `38.51` = 38.51%) by the holders endpoint, but as a fraction (e.g. `0.3851`) by the token-list endpoint. The CLI normalizes this, but check the magnitude when reading raw JSON.

### `sunpump token holders-v2 <tokenAddress>` (read)

The v2 version of the holders list (calls the newer `/token/holdersV2` endpoint). Same input options as `holders`; returned fields may differ slightly.

```bash
sun sunpump token holders-v2 <tokenAddress> [options]
```

### `sunpump token ranking` (read)

Get token ranking by a chosen metric. **`--type` is required.**

```bash
sun sunpump token ranking --type MARKET_CAP --size 10
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--type <rankingType>` | **(required)** Ranking type: `MARKET_CAP`, `VOLUME_24H`, `PRICE_CHANGE_24H` | — |
| `--size <n>` | Number of entries | — |

> `--type` only accepts `MARKET_CAP`, `VOLUME_24H`, or `PRICE_CHANGE_24H` (case-sensitive); other values are rejected by the API.

### `sunpump token king-of-hill` (read)

Get the current king-of-the-hill token.

```bash
sun sunpump token king-of-hill
```

### `sunpump token pump-list` (read)

Get the raw SunPump token list (returns the API response directly, without stripping the outer `{code, msg, data}` envelope).

```bash
sun sunpump token pump-list
```

### `sunpump token favors` (read, requires signature)

List a user's favorite tokens. Requires a signed message.

```bash
sun sunpump token favors --user-address <address> --signature <sig> --signed-message <msg> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--user-address <address>` | **(required)** User wallet address | — |
| `--signature <sig>` | **(required)** Signature of the signed message | — |
| `--signed-message <msg>` | **(required)** The signed message | — |
| `--token-address <address>` | Filter by token address | — |
| `--page <n>` | Page number | — |
| `--size <n>` | Page size | — |

### `sunpump tx token <contractAddress>` (read)

Query a token's buy/sell trade history.

```bash
sun sunpump tx token <contractAddress> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--swap-type <type>` | Direction filter (`BUY` / `SELL`) | — |
| `--pool <address>` | Swap pool address | — |
| `--tx-hash <hash>` | Specific tx hash | — |
| `--block <n>` | Block number | — |
| `--start-time <epoch>` | Start time (epoch **seconds**) | — |
| `--end-time <epoch>` | End time (epoch **seconds**) | — |
| `--page <n>` | Page number | — |
| `--size <n>` | Page size | — |
| `--sort <field>` | Sort field (e.g. `txDateTime,desc`) | — |

> `--start-time` / `--end-time` are epoch **seconds**, not milliseconds.

### `sunpump tx user <ownerAddress>` (read)

Query a wallet's buy/sell trade history. Same options as `tx token`.

```bash
sun sunpump tx user <ownerAddress> --size 20
sun sunpump tx user <ownerAddress> --swap-type BUY --size 20
```

### `sunpump portfolio <walletAddress>` (read)

List all SunPump tokens held by a wallet, with TRX-denominated value and portfolio weight.

```bash
sun sunpump portfolio <walletAddress> [options]
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--include-zero` | Include zero-balance tokens | — |
| `--min-trx <amount>` | Minimum TRX-equivalent value | — |
| `--page <n>` | Page number | — |
| `--size <n>` | Page size | — |
| `--sort <field>` | Sort field (e.g. `valueInTrx,desc`) | — |

### `sunpump launch` (write, no wallet required)

Create a new meme token through the SunPump agent endpoint (`POST /ai/agentTokenLaunch`). Creation is **server-side**: the platform signs and broadcasts the creation transaction, so no local wallet is needed. The CLI prints a summary and asks for confirmation (`--yes` skips); `--dry-run` previews the request without sending. On success it prints the new token's contract address, creation tx hash, and logo URL.

```bash
sun sunpump launch --name "<token name>" --symbol "<SYMBOL>" \
  --description "<one-line description>" --image ./logo.png \
  --twitter-url "https://x.com/<your-handle>" --website-url "https://<your-site>"
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--name <name>` | **(required)** Token name | — |
| `--symbol <symbol>` | **(required)** Token symbol | — |
| `--description <text>` | **(required)** Token description | — |
| `--image <path>` | Logo image file, read and sent as base64 | — |
| `--image-base64 <data>` | Logo as a raw base64 string (overrides `--image`) | — |
| `--twitter-url <url>` | Twitter URL | — |
| `--telegram-url <url>` | Telegram URL | — |
| `--website-url <url>` | Website URL | — |
| `--tweet-username <name>` | Tweet username to associate with the launch | — |

> Providing a logo via `--image` / `--image-base64` is strongly recommended — launches without a logo may be rejected by the API with an opaque `500` (the CLI hints at this when it happens).

### `sunpump state <tokenAddress>` (read)

Show a SunPump token's on-chain state, to decide whether to use the SunPump bonding-curve path or SunSwap.

```bash
sun sunpump state <tokenAddress>
```

| State | Label | Tradeable via `sunpump buy/sell`? |
| :--- | :--- | :--- |
| `0` | `NOT_EXIST` | No (unknown to SunPump) |
| `1` | `TRADING` | Yes |
| `2` | `READY_TO_LAUNCH` | Yes (Bonding Curve at 100%, about to create a SunSwap V2 pair) |
| `3` | `LAUNCHED` | No — use `sun swap` |

> `sun-kit`'s TypeScript enum only lists 0–2, but the on-chain contract returns 3 for launched tokens. The CLI maps 3 to `LAUNCHED` — trust the printed label, not the raw number.

### `sunpump quote-buy <tokenAddress>` (read)

Preview a SunPump buy without sending a transaction.

```bash
sun sunpump quote-buy <tokenAddress> --trx 10
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--trx <amount>` | **(required)** TRX to spend, **decimal** (e.g. `10` or `1.5`) | — |

### `sunpump quote-sell <tokenAddress>` (read)

Preview a SunPump sell without sending a transaction.

```bash
sun sunpump quote-sell <tokenAddress> --amount 1000
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--amount <amount>` | **(required)** Token amount to sell, **decimal** | — |
| `--decimals <n>` | Token decimals | `18` |

### `sunpump buy <tokenAddress>` (write)

Buy a meme token with TRX on SunPump (only for tokens that have not yet created a SunSwap V2 pair). `--trx` accepts decimals; the CLI scales by TRX-Sun (1e6) internally.

```bash
sun sunpump buy <tokenAddress> --trx 10
sun sunpump buy <tokenAddress> --trx 10 --slippage 0.1
sun sunpump buy <tokenAddress> --trx 10 --min-out 27955000000000000000000
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--trx <amount>` | **(required)** TRX to spend, **decimal** | — |
| `--slippage <n>` | Slippage tolerance as a decimal (meme tokens are volatile) | `0.05` |
| `--min-out <raw>` | Minimum tokens out in raw base units (overrides slippage) | — |

### `sunpump sell <tokenAddress>` (write)

Sell a meme token for TRX on SunPump (only for tokens that have not yet created a SunSwap V2 pair). On the first sell of a token, the SDK auto-sends a TRC20 `approve` transaction first.

```bash
sun sunpump sell <tokenAddress> --amount 1000
sun sunpump sell <tokenAddress> --amount 1000 --decimals 6
sun sunpump sell <tokenAddress> --amount 1000 --slippage 0.1
```

| Option | Description | Default |
| :--- | :--- | :--- |
| `--amount <amount>` | **(required)** Token amount to sell, **decimal** | — |
| `--decimals <n>` | Token decimals (resolve via `sunpump token get` if unsure) | `18` |
| `--slippage <n>` | Slippage tolerance as a decimal | `0.05` |
| `--min-out <raw>` | Minimum TRX out in Sun (overrides slippage) | — |

> Use `--dry-run` to print the resolved parameters (TRX/Sun scaling, computed `minOut`, slippage, network) without broadcasting — handy for showing the user exactly what will be sent.

---

## Built-In Token Symbols

Many commands accept token symbols in addition to full TRON addresses:

| Symbol | Address | Decimals |
| :--- | :--- | :--- |
| `TRX` | `T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb` | 6 |
| `WTRX` | `TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR` | 6 |
| `USDT` | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` | 6 |
| `USDCOLD` | `TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8` | 6 |
| `USDDOLD` | `TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn` | 18 |
| `USDD` | `TXDk8mbtRbXeYuMNS83CfKPaYYT8XWv9Hz` | 18 |
| `SUN` | `TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S` | 18 |
| `JST` | `TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9` | 18 |
| `BTT` | `TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4` | 18 |
| `WIN` | `TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7` | 6 |
| `NFT` | `TFczxzPhnThNSqr5by8tvxsdCFRRz6cPNq` | 6 |
| `TUSD` | `TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4` | 18 |

You can use either the symbol or the full address:

```bash
sun swap TRX USDT 1000000
```

```bash
sun swap T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t 1000000
```

You can find other tokens in [tokenlist](https://sunlists.justnetwork.io/#/detail?uri=https://list.justswap.io/justswap.json).
