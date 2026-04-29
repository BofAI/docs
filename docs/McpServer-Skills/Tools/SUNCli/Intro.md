# Introduction

## What is SUN CLI?

SUN CLI (`@bankofai/sun-cli`) is a command-line tool that brings the full power of [SUN.IO (SunSwap)](https://sun.io) to your terminal. Whether you're a human operator or an AI agent, SUN CLI lets you query DeFi data, execute token swaps, and manage liquidity positions on the TRON network through a single command-line interface.

Think of it this way: SUN MCP Server exposes DeFi capabilities as standard tool interfaces via the MCP protocol—AI assistants call them directly without assembling commands or parsing text output. SUN CLI provides a structured command-line interface for manual operation and scripting, and can also be invoked by AI agents through the shell. Both share the same underlying DeFi capabilities; the difference is the integration method: MCP is native protocol integration, CLI is command-line invocation.

For example, checking the price of TRX is as simple as:

```bash
sun price TRX
```

And executing a swap — for example, **swap 1 TRX for USDT**:

```bash
sun swap TRX USDT 1000000 --yes
```

> Amounts are passed as integers scaled by the token's `decimals`. TRX has 6 decimals, so `1000000` is exactly **1 TRX**.

No frontend, no browser, no manual contract interaction.

---

## What can it do?

SUN CLI covers the full range of SunSwap DEX interactions, from real-time market data to on-chain transactions.

**Data Queries (read-only, no wallet needed):**

| Capability | Description | Example Command |
| :--- | :--- | :--- |
| **Token Prices** | Real-time prices for any token on SunSwap | `sun price TRX` |
| **Swap Quotes** | Get optimal route and expected output before executing | `sun swap:quote TRX USDT 1000000` |
| **Pool Data** | Pool lists, APY rankings, volume and liquidity history | `sun pool top-apy --page-size 5` |
| **Position Query** | View liquidity positions for any address | `sun position list --owner TYourAddress` |
| **Protocol Stats** | SunSwap-wide volume, users, pools, and liquidity history | `sun protocol info` |
| **Farm Info** | Yield farm lists, mining positions, and farming transactions | `sun farm list` |
| **Token Discovery** | Search tokens, list by protocol version | `sun token search USDT` |

**DeFi Operations (write, requires wallet):**

| Capability | Description | Example Command |
| :--- | :--- | :--- |
| **Token Swap** | Execute optimal-route swaps via the Universal Router | `sun swap TRX USDT 1000000` |
| **V2 Liquidity** | Create pools or add/remove V2 pool liquidity | `sun liquidity v2:add --token-a TRX --token-b USDT --amount-a 1000000` |
| **V3 Liquidity** | Mint, increase, decrease concentrated positions, collect fees | `sun liquidity v3:mint --token0 TRX --token1 USDT --amount0 1000000` |
| **V4 Liquidity** | V4 concentrated liquidity with Permit2 authorization | `sun liquidity v4:mint --token0 TRX --token1 USDT --amount0 1000000` |
| **Contract Interaction** | Read or write to any TRON smart contract | `sun contract read <address> balanceOf --args '[...]'` |

---

## SUN CLI vs SUN MCP Server

Both tools connect you to the same SunSwap ecosystem, but serve different use cases:

| Comparison | SUN CLI | SUN MCP Server |
| :--- | :--- | :--- |
| **Integration** | Command line (shell invocation) | MCP protocol (native tool interface) |
| **Best for** | Manual operation, scripts, CI/CD, AI agents via shell | AI assistants calling tools directly via MCP |
| **Invocation** | Assemble command + flags, parse text/JSON output | AI client sends structured tool calls—no command assembly needed |
| **Output formats** | Table, JSON, TSV | Structured MCP responses |
| **Write operations** | Supported (with wallet) | Supported (local deployment) |
| **No-prompt mode** | `--yes` flag for unattended execution | AI handles confirmation flow |

:::tip When to choose which?
If your AI assistant supports the MCP protocol, prefer SUN MCP Server—the integration is cleaner with no command assembly or output parsing. If you need shell scripts, cron jobs, CI/CD pipelines, or your AI agent doesn't support MCP, choose SUN CLI.
:::

---

## Output Modes

SUN CLI supports three output formats, making it friendly for both humans and machines:

- **table** — default, human-friendly terminal tables
- **json** — compact, machine-readable JSON for scripts and AI agents
- **tsv** — tab-separated values for shell pipelines

```bash
sun pool top-apy --page-size 5
```

```bash
sun --json wallet address
```

```bash
sun --output tsv token list --protocol V3
```

---

## Supported Networks

SUN CLI supports the same three TRON networks (mainnet by default):

| Network | Identifier | Purpose | Block Explorer |
| :--- | :--- | :--- | :--- |
| **Mainnet** | `mainnet` | Production, real assets | [tronscan.org](https://tronscan.org) |
| **Nile Testnet** | `nile` | Development and testing (recommended) | [nile.tronscan.org](https://nile.tronscan.org) |
| **Shasta Testnet** | `shasta` | Development and testing | [shasta.tronscan.org](https://shasta.tronscan.org) |

Specify the network with the `--network` flag. **We strongly recommend validating operations on the Nile testnet first**—mainnet operations involve real assets and cannot be undone.

---

## Security Notes

:::warning
DeFi operations involve on-chain assets and mistakes cannot be reversed. Keep these principles in mind:

- **Never hardcode private keys**: Use environment variables or encrypted wallet management via [agent-wallet](https://github.com/BofAI/agent-wallet), not command-line flags in shared environments.
- **Test on testnet first**: Use `--network nile` before running any write operation on mainnet.
- **Minimum funds principle**: Only keep the funds needed for the current task in the CLI's configured wallet.
- **Use dry-run mode**: Run `--dry-run` before high-value writes to preview intent without broadcasting.
- **Verify token addresses**: When not using built-in symbols, double-check contract addresses.
- **Quotes are not guarantees**: In volatile markets, actual execution results may differ from quotes.
:::

---

## Next Steps

- Want to get up and running fast? &rarr; [Quick Start](./QuickStart.md)
- Need the full command reference? &rarr; [Complete Capabilities](./CommandGuide.md)
- Have questions or running into issues? &rarr; [FAQ & Troubleshooting](./FAQ.md)
