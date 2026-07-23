---
title: 'x402 CLI'
description: >-
  x402 CLI (@bankofai/x402-cli) is a TypeScript command-line client for x402 payments — pay protected URLs, run a local paywall, and manage the provider catalog from your terminal.
---

# x402 CLI

## What is x402 CLI?

x402 CLI (`@bankofai/x402-cli`) brings the [x402 payment protocol](../index.md) to your terminal. It is a single, dependency-light command that lets a human operator, a shell script, or an AI agent **pay an x402-protected URL, stand up a local paywall, and browse the provider catalog** — without writing any integration code.

Think of it this way: the [x402 SDK](../sdk-features.md) is what you embed inside an application to charge for or pay for a resource. The CLI is the same capability wrapped as a command you can run right now:

```bash
# Pay any x402-protected endpoint
x402-cli pay https://api.example.com/paid --network tron:nile --token USDT
```

It is built entirely on the published TypeScript SDK packages — `@bankofai/x402-core`, `@bankofai/x402-evm`, and `@bankofai/x402-tron` — and every stablecoin payment uses `scheme=exact` with Permit2 authorization (`extra.assetTransferMethod=permit2`).

---

## What can it do?

The CLI groups its capabilities into five commands.

| Command | What it does | Example |
| :--- | :--- | :--- |
| **`pay`** | Pay an x402-protected URL. Probes the endpoint, reads the `402` challenge, signs a payment, and retries. | `x402-cli pay <url> --network tron:nile --token USDT` |
| **`serve`** | Run a local x402 paywall that returns `402 Payment Required` and settles through a facilitator. | `x402-cli serve --pay-to <address> --amount 0.0001` |
| **`roundtrip`** | Start a temporary server, immediately pay it, then exit — the fastest way to smoke-test end to end. | `x402-cli roundtrip --pay-to <address>` |
| **`gateway`** | Manage local gateway provider files: validate, scaffold, start, and build catalog assets. | `x402-cli gateway check ./providers` |
| **`catalog`** | Search, cache, inspect, and export the hosted provider catalog. | `x402-cli catalog search "weather"` |

Read-only commands (`pay --dry-run`, `catalog search`, `gateway check`) need no wallet. Only an actual payment requires a payer private key.

---

## Human-readable by default, JSON when you need it

Output is human-friendly text by default. Add `--json` to any command for a stable, machine-readable envelope — ideal for scripts and AI agents:

```bash
x402-cli pay https://api.example.com/paid --dry-run --json
```

```json
{
  "ok": true,
  "command": "client",
  "network": "tron:nile",
  "scheme": "exact",
  "result": {
    "url": "https://api.example.com/paid",
    "message": "Dry run - no payment submitted"
  }
}
```

Every JSON envelope carries `ok`, `command`, and either a `result` object or a structured `error` with `code`, `message`, and `hint`. On success you also get `network` and `scheme` where relevant.

---

## Supported networks & tokens

The CLI ships a built-in token registry. Pass a network with `--network` and a token with `--token`.

| Network | Identifier | Built-in tokens |
| :--- | :--- | :--- |
| **TRON Mainnet** | `tron:mainnet` | USDT, USDD |
| **TRON Nile Testnet** | `tron:nile` | USDT, USDD |
| **TRON Shasta Testnet** | `tron:shasta` | USDT |
| **BSC Mainnet** | `eip155:56` | USDT |
| **BSC Testnet** | `eip155:97` | USDT, USDC |

Convenience aliases are accepted and normalized automatically:

| Alias | Canonical identifier |
| :--- | :--- |
| `tron-mainnet` | `tron:mainnet` |
| `tron-nile` | `tron:nile` |
| `tron-shasta` | `tron:shasta` |
| `bsc-mainnet` | `eip155:56` |
| `bsc-testnet` | `eip155:97` |

For a token that isn't in the registry, pass `--asset <address>` together with `--decimals <count>`.

---

## CLI vs SDK

Both paths speak the same protocol; they differ in how you integrate.

| Comparison | x402 CLI | x402 SDK |
| :--- | :--- | :--- |
| **Integration** | Command line (shell invocation) | Imported into your TypeScript app |
| **Best for** | Manual testing, scripts, CI/CD, AI agents via shell | Production services and clients |
| **Setup** | `npm install -g @bankofai/x402-cli` | `npm install @bankofai/x402-*` |
| **Output** | Human text or `--json` envelope | Native SDK objects |

:::tip When to choose which?
Use the CLI to explore, test, and script against x402 endpoints, or to give an AI agent a payment capability through the shell. When you're embedding payments into a real product, build directly on the [SDK](../sdk-features.md).
:::

---

## Security notes

:::warning
Payments move real on-chain assets and cannot be reversed. Keep these principles in mind:

- **Never hardcode private keys.** Prefer environment variables (`TRON_PRIVATE_KEY`, `EVM_PRIVATE_KEY`, `PRIVATE_KEY`) or an [agent-wallet](../../Agent-Wallet/Intro.md) payer wallet over the `--private-key` flag in shared environments.
- **Test on testnet first.** Use `tron:nile` or `eip155:97` before running any payment on mainnet.
- **Preview before you pay.** Run `pay --dry-run` to inspect the exact requirement before signing.
- **Cap the amount.** Use `--max-amount` or `--max-raw-amount` so a mispriced endpoint can't overcharge you.
- **Fund the minimum.** Only keep the funds the current task needs in the payer address.
:::

---

## Next steps

- Want to run your first payment fast? → [Quick Start](./quickstart.md)
- Need every command and flag? → [Command Reference](./command-reference.md)
- Hit a snag or have a question? → [FAQ & Troubleshooting](./faq.md)
