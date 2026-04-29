# Quick Start

The goal of this page is simple: **install SUN CLI and make your first DeFi query in under 1 minute.**

No wallet needed for read-only commands—install and start querying immediately.

---

## Preparation

Before you get started, make sure you have:

1. **Node.js** >= 20.0.0 ([download link](https://nodejs.org/))
2. **npm** (comes with Node.js)

---

## Step 1: Install

Run one command to install SUN CLI globally:

```bash
npm install -g @bankofai/sun-cli
```

After installation, the `sun` command is available in your terminal.

---

## Step 2: Your First Query

Let's check the current price of TRX. Run:

```bash
sun price TRX
```

You should see output like this:

```text
✔ Fetching prices...
┌───────┬────────────────┐
│ Token │ Price (USD)    │
├───────┼────────────────┤
│ TRX   │ 0.301739439813 │
└───────┴────────────────┘
```

That's it—you're connected to SunSwap.

---

## Step 3: Explore More Data

Try a few more read-only commands to see what's available:

**Check top APY pools:**

```bash
sun pool top-apy --page-size 5
```

**Quote a swap of 1 TRX for USDT** (no wallet required):

```bash
sun swap:quote TRX USDT 1000000
```

This shows the best route and expected output—without executing anything. (Amounts use integer-scaled decimals; TRX is 6 decimals → `1000000` = 1 TRX. See [Swap → amount precision](./CommandGuide.md#swap).)

**Get JSON output for scripting:**

```bash
sun --json price USDT
```

---

## Configure a Wallet (For Write Operations)

Read-only commands work out of the box. To execute swaps, manage liquidity, or send contract transactions, you need to configure a wallet.

SUN CLI uses [`agent-wallet`](../../../Agent-Wallet/Intro.md) for wallet management. Install and configure it:

```bash
npm install -g @bankofai/agent-wallet
```

Then set up your wallet following the [agent-wallet Quick Start guide](../../../Agent-Wallet/QuickStart.md).

:::caution Keep your keys safe
Never hardcode private keys or mnemonics in config files or shell history. Use environment variables or agent-wallet's encrypted storage. For testing, always start with the Nile testnet.
:::

Once your wallet is configured, verify it:

```bash
sun wallet address
```

You should see your wallet address and network:

```json
{ "address": "TNmoJ...xxxxx", "network": "mainnet" }
```

---

## Execute Your First Swap (On Testnet)

With a wallet configured, try **swapping 1 TRX for USDT** on the Nile testnet:

```bash
sun swap TRX USDT 1000000 --network nile --yes
```

The `--yes` flag skips the confirmation prompt. The output includes the transaction ID and a Tronscan link to verify on-chain.

:::tip Always test on Nile first
Before running any write operation on mainnet, verify it on the Nile testnet. Mainnet operations involve real assets and cannot be undone.
:::

---

## Network & API Configuration

Optionally, set these environment variables for customization:

```bash
export TRON_NETWORK=mainnet
```

```bash
export TRON_GRID_API_KEY="<YOUR_KEY>"
```

```bash
export TRON_RPC_URL=https://your-rpc
```

---

## Next Steps

- **[Complete Capabilities](./CommandGuide.md)** — Full reference for all commands: wallet, price, swap, liquidity, protocol, and contract operations
- **[FAQ & Troubleshooting](./FAQ.md)** — Troubleshooting common issues
- **[SUN MCP Server](../SUNMCPServer/Intro.md)** — Prefer AI-driven DeFi? Use SUN MCP Server for natural language interaction
