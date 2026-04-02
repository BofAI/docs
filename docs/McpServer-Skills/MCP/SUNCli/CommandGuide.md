# Command Guide

This page is the complete reference for all SUN CLI commands. Commands are organized by category: wallet management, market data, trading, liquidity, protocol analytics, and contract interaction.

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
sun -k your_private_key --network nile --yes swap TRX USDT 1000000
```

```bash
sun --dry-run contract send TContract transfer --args '["TRecipient","1000000"]'
```

---

## Wallet & Portfolio

Inspect the active wallet and on-chain balances.

### `wallet address`

Display the configured wallet address and current network.

```bash
sun wallet address
```

### `wallet balances`

Query token balances for the active wallet or any address.

```bash
sun wallet balances
```

```bash
sun wallet balances --owner TYourAddress --tokens TRX,TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

### `position list`

View SunSwap liquidity positions for an address.

```bash
sun position list --owner TYourAddress
```

### `position tick`

Query tick data for a specific pool.

```bash
sun position tick <poolAddress>
```

### `farm positions`

View yield farm positions.

```bash
sun farm positions --owner TYourAddress
```

---

## Price & Discovery

### `price`

Query real-time token prices on SunSwap.

```bash
sun price TRX
```

```bash
sun price USDT
```

```bash
sun price --address TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

### `token list`

List tokens by protocol version.

```bash
sun token list --protocol V3
```

### `token search`

Search for tokens by name or symbol.

```bash
sun token search USDT
```

### `pool list`

List pools filtered by token.

```bash
sun pool list --token TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

### `pool search`

Search for pools by token pair.

```bash
sun pool search "TRX USDT"
```

### `pool top-apy`

List pools ranked by APY.

```bash
sun pool top-apy --page-size 10
```

### `pool hooks`

List pools with hooks enabled.

```bash
sun pool hooks
```

### `pair info`

Get pair-level information for a token.

```bash
sun pair info --token TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

### `farm list`

List available yield farms.

```bash
sun farm list
```

---

## Swap

### `swap`

Execute a token swap via the optimal route. Requires a configured wallet.

```bash
sun swap TRX USDT 1000000 --slippage 0.005
```

```bash
sun -k your_private_key --network nile --yes swap TRX USDT 1000000
```

Successful responses include `txid`, route details, and a `tronscanUrl` link.

### `swap:quote`

Get a read-only swap quote without executing. No wallet needed.

```bash
sun swap:quote TRX USDT 1000000
```

```bash
sun swap:quote TRX USDT 1000000 --all
```

### `swap:quote-raw`

Low-level router quote with raw arguments.

```bash
sun swap:quote-raw --router <routerAddress> --args '[...]'
```

### `swap:exact-input`

Low-level exact-input swap via a specific router.

```bash
sun swap:exact-input --router <routerAddress> --args '[...]' --value 1000000
```

---

## Liquidity

### V2

```bash
sun liquidity v2:add --token-a TRX --token-b USDT --amount-a 1000000 --amount-b 290000
```

```bash
sun liquidity v2:remove --token-a TRX --token-b USDT --liquidity 500000
```

### V3

```bash
sun liquidity v3:mint --token0 TRX --token1 USDT --amount0 1000000
```

```bash
sun liquidity v3:increase --token-id 123 --amount0 500000
```

```bash
sun liquidity v3:decrease --token-id 123 --liquidity 1000
```

```bash
sun liquidity v3:collect --token-id 123
```

### V4

```bash
sun liquidity v4:mint --token0 TRX --token1 USDT --amount0 1000000
```

```bash
sun liquidity v4:mint --token0 TRX --token1 USDT --amount0 1000000 --create-pool
```

```bash
sun liquidity v4:increase --token-id 123 --token0 TRX --token1 USDT --amount0 500000
```

```bash
sun liquidity v4:decrease --token-id 123 --liquidity 1000 --token0 TRX --token1 USDT
```

```bash
sun liquidity v4:collect --token-id 123
```

```bash
sun liquidity v4:info --pm <positionManager> --token-id 123
```

---

## Protocol & History

### Protocol Analytics

```bash
sun protocol info
```

```bash
sun protocol vol-history --start 2026-01-01 --end 2026-03-01
```

```bash
sun protocol users-history --start 2026-01-01 --end 2026-03-01
```

```bash
sun protocol tx-history --start 2026-01-01 --end 2026-03-01
```

```bash
sun protocol pools-history --start 2026-01-01 --end 2026-03-01
```

```bash
sun protocol liq-history --start 2026-01-01 --end 2026-03-01
```

### Pool History

```bash
sun pool vol-history <poolAddress> --start 2026-01-01 --end 2026-03-01
```

```bash
sun pool liq-history <poolAddress> --start 2026-01-01 --end 2026-03-01
```

### Transaction Scan

```bash
sun tx scan --type swap --token TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t --start 2026-01-01
```

---

## Generic Contract

Read from or write to arbitrary TRON smart contracts.

### `contract read`

```bash
sun contract read <contractAddress> balanceOf --args '["TYourAddress"]'
```

### `contract send`

```bash
sun contract send <contractAddress> transfer --args '["TRecipient","1000000"]' --value 0
```

`contract send` also returns a `tronscanUrl` link when a transaction is broadcast successfully.

---

## Built-In Token Symbols

Many commands accept token symbols in addition to full TRON addresses:

| Symbol | Address | Decimals |
| :--- | :--- | :--- |
| `TRX` | `T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb` | 6 |
| `WTRX` | `TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR` | 6 |
| `USDT` | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` | 6 |
| `USDCOLD` | `TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8` | 6 |
| `USDD` | `TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn` | 18 |
| `SUN` | `TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S` | 18 |
| `JST` | `TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9` | 18 |
| `BTT` | `TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4` | 18 |
| `WIN` | `TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7` | 6 |

You can use either the symbol or the full address:

```bash
sun swap TRX USDT 1000000
```

```bash
sun swap T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t 1000000
```
