# FAQ

Common questions and troubleshooting tips for SUN CLI.

---

## Installation & Setup

### What are the system requirements?

- **Node.js** 20.0.0 or later
- **npm** (comes with Node.js)
- A terminal or shell environment (macOS, Linux, or Windows with WSL)

### How do I update SUN CLI?

```bash
npm update -g @bankofai/sun-cli
```

---

## Wallet & Configuration

### I get "No wallet configured" — what should I do?

Write operations (swap, liquidity, contract send) require a wallet. Set exactly one wallet source:

- `AGENT_WALLET_PRIVATE_KEY` — direct private key
- `AGENT_WALLET_MNEMONIC` — mnemonic phrase
- `AGENT_WALLET_PASSWORD` — encrypted wallet via agent-wallet

Or provide the equivalent root-level flag (`-k`, `-m`, `-p`) for a single invocation. See the [agent-wallet Quick Start](https://github.com/BofAI/agent-wallet?tab=readme-ov-file#quick-start) for full setup instructions.

### Can I use SUN CLI without a wallet?

Yes. All read-only commands work without any wallet configuration: price queries, swap quotes, pool data, protocol stats, token search, and more.

### Is my private key safe?

SUN CLI never uploads your private key to any remote service. All signing happens locally. However, be cautious with command-line flags (`-k`, `-m`) as they may appear in your shell history. Prefer environment variables or agent-wallet's encrypted storage.

---

## Common Errors

### `unknown command 'nile'`

Root flags like `--network` must be placed **before** the subcommand:

```bash
# Correct
sun --network nile swap TRX USDT 1000000

# Wrong — 'nile' is parsed as a command
sun swap TRX USDT 1000000 --network nile
```

When using npm scripts, pass arguments after `--`:

```bash
npm run start -- --network nile swap TRX USDT 1000000
```

### `Swap failed`

Common causes:

- Wallet not configured
- Unsupported token symbol or invalid address
- Insufficient balance
- RPC or router API failure
- Stale or invalid route parameters

**Recommendation:** Run `swap:quote` first to verify the route, then retry with `--yes` only after the quote looks correct.

### Transactions succeed but I see unexpected results

- **Slippage**: In volatile markets, the actual output may differ from the quoted amount. Adjust slippage tolerance with `--slippage`.
- **Token decimals**: Amounts are specified in the token's smallest unit. For TRX (6 decimals), `1000000` = 1 TRX.
- **Network mismatch**: Make sure you're on the intended network. Check with `sun wallet address`.

---

## AI Agent Integration

### Can AI agents use SUN CLI?

Yes. SUN CLI is designed for both human and AI-driven workflows. Key features for automation:

- `--json` output for machine-readable responses
- `--yes` flag to skip confirmation prompts
- `--dry-run` to preview actions without executing
- `--fields` to filter output to specific fields
- Exit codes for error handling in scripts

### What's the difference between SUN CLI and SUN MCP Server?

SUN CLI is a command-line tool invoked directly. SUN MCP Server is an MCP-compatible server that AI clients (like Claude) connect to for natural language DeFi interaction. Both access the same SunSwap ecosystem. Choose CLI for scripts and automation, MCP Server for AI-assisted workflows.

---

## Networks & Tokens

### Which networks are supported?

Mainnet, Nile testnet, and Shasta testnet. Default is mainnet. Use `--network nile` or `--network shasta` for testing.

### How do I use a custom token not in the built-in list?

Use the token's full TRON contract address instead of a symbol:

```bash
sun price --address TYourTokenAddress
sun swap TYourTokenAddress TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t 1000000
```

### Can I set a custom RPC endpoint?

Yes. Set the `TRON_RPC_URL` environment variable:

```bash
export TRON_RPC_URL=https://your-tron-rpc.example
```

---

## Still Need Help?

If your question isn't covered here, check the [Command Guide](./CommandGuide.md) for detailed usage, or file an issue on the [GitHub repository](https://github.com/nicholaskarlson/sun-cli).
