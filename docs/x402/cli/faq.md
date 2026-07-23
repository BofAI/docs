---
title: 'FAQ & Troubleshooting'
description: >-
  Common questions, error codes, and fixes for the x402 CLI.
---

# FAQ & Troubleshooting

Common questions and troubleshooting tips for the x402 CLI.

---

## Installation & setup

### What are the system requirements?

- **Node.js** 20 or later
- **npm** (comes with Node.js)
- A terminal on macOS, Linux, or Windows (WSL recommended)

### How do I update the CLI?

```bash
npm update -g @bankofai/x402-cli
```

### Can I run it without installing globally?

Yes. From a project that has it installed, run `node dist/cli.js <command>`, or use `npx @bankofai/x402-cli <command>`.

---

## Wallets & payments

### Do I need a wallet to use the CLI?

Only for actual payments. Read-only commands — `pay --dry-run`, `catalog search`, `catalog show`, `gateway check` — need no wallet. A real `pay` or `roundtrip` requires a payer private key.

### How do I provide my private key?

Set one of these environment variables:

- **TRON networks** → `TRON_PRIVATE_KEY`
- **EVM networks** (BSC) → `EVM_PRIVATE_KEY`
- **Either network** → `PRIVATE_KEY`, used as a fallback when the network-specific variable isn't set

You can also pass `--private-key <hex>` for a single command, but avoid this in shared shells or committed scripts — command-line arguments are recorded in shell history and process listings.

:::caution
For anything beyond throwaway testing, use an [agent-wallet](../../Agent-Wallet/Intro.md) payer wallet rather than raw environment keys, and keep only the minimum funds the current task needs in the payer address.
:::

### Will a payment ever spend more than I expect?

Not if you cap it. Use `--max-amount <human>` or `--max-raw-amount <smallest-units>`; if the endpoint's price exceeds your cap, the CLI aborts **before** signing. When in doubt, run `pay --dry-run` first to see the exact requirement.

### Which networks and tokens are supported?

TRON (`tron:mainnet`, `tron:nile`, `tron:shasta`) and BSC (`eip155:56`, `eip155:97`), with a built-in registry for USDT, USDD, and USDC depending on the network. See [x402 CLI overview](./index.md#supported-networks--tokens) for the full table. For a token that isn't registered, pass `--asset <address>` with `--decimals <count>`.

---

## Understanding errors

Every failure prints a stable error `code`, a message, and a `hint`. Add `--json` to get the same information as a structured envelope. The most common codes:

| Code | What happened | How to fix it |
| :--- | :--- | :--- |
| `WALLET_NOT_CONFIGURED` | No payer key found | Set `TRON_PRIVATE_KEY` / `EVM_PRIVATE_KEY` / `PRIVATE_KEY`, or configure an agent-wallet payer |
| `TRON_ACCOUNT_NOT_ACTIVATED` | The TRON address has never been used on-chain | Send it a small amount of TRX to activate it before signing |
| `INSUFFICIENT_TOKEN_BALANCE` | Payer lacks the token being charged | Fund the payer with the exact token and network the provider advertises |
| `INSUFFICIENT_GAS` | Not enough native gas / energy | Fund the payer with the network's native gas token (TRX / BNB) |
| `NO_MATCHING_PAYMENT_REQUIREMENT` | No offered requirement matched your filters | Relax `--network`, `--token`, or `--scheme`, or use values the provider offers |
| `PAYMENT_AMOUNT_TOO_HIGH` | Price exceeded your `--max-amount` | Raise the cap only if the price is expected |
| `INVALID_X402_RESPONSE` | Endpoint returned `402` without a `PAYMENT-REQUIRED` header | The endpoint is misconfigured; contact the provider |
| `PERMIT_REVERTED` | Token/Permit2 rejected the signature | Retry with a fresh requirement; verify token/network support |
| `DEADLINE_OR_CLOCK_SKEW` | Requirement expired or clock is off | Sync your local clock and retry with a fresh requirement |
| `RATE_LIMITED` | Upstream service or RPC is rate limiting | Wait briefly and retry |
| `NETWORK_ERROR` | Could not reach the URL/RPC | Check the URL, local server, proxy, and connectivity |
| `SDK_API_DRIFT` | Installed SDK packages don't match the CLI | Reinstall `@bankofai/x402-cli` and its SDK dependencies |

### "402 response missing PAYMENT-REQUIRED header"

The endpoint returned `402` but didn't include the machine-readable challenge header. This is a server-side misconfiguration — the CLI can't derive a payment requirement from it.

### "no matching payment requirement"

The endpoint offered payment options, but none matched your `--network`, `--token`, or `--scheme` filters. Run `pay --dry-run --json` without those filters to see what the provider actually accepts, then narrow accordingly.

---

## The gateway

### `gateway start` says the runtime isn't found

`gateway start` and `gateway catalog` need the separate `@bankofai/x402-gateway` package. Install it (`npm install -g @bankofai/x402-gateway`), run from a checkout that has `../x402-gateway/dist/cli.js`, or point at a binary with `--gateway-bin <path>`.

### How do I validate my provider files before deploying?

```bash
x402-cli gateway check ./providers
```

This parses every `provider.yml`, checks required fields (`name`, `forward_url`, `operator.network`, `operator.recipient`), validates each endpoint, and reports duplicates.

---

## The catalog

### Where does `catalog` read from by default?

When you omit `--catalog`, the source is resolved in this order: the `X402_CATALOG` / `X402_GATEWAY_CATALOG` environment variable, then the local cache (`~/.cache/x402-cli/catalog/catalog.json`), then the hosted default `https://x402-catalog.bankofai.io/api/catalog.json`.

### How do I make search faster or work offline?

Run `x402-cli catalog update` once to cache the hosted catalog and provider details locally. Subsequent searches read from the cache.

---

## Output & scripting

### How do I get machine-readable output?

Add `--json` to any command for an envelope with `ok`, `command`, and either `result` or a structured `error`. This is the recommended mode for scripts and AI agents.

### What do the exit codes mean?

`0` success, `1` runtime error (network, wallet, settlement), `2` invalid usage (missing/invalid argument or unknown command).

---

## Still stuck?

- Re-read the exact usage for a command with `x402-cli <command> --help`.
- Review the [Command Reference](./command-reference.md) for every flag.
- Learn how the underlying handshake works in [Core Concepts](../core-concepts/http-402.md).
