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
x402-cli pay https://api.example.com/paid --network tron:0xcd8690dc --token USDT
```

It is built entirely on the published TypeScript SDK packages — `@bankofai/x402-core`, `@bankofai/x402-evm`, `@bankofai/x402-fetch`, and `@bankofai/x402-tron`. Stablecoin payments use `scheme=exact`: Permit2 authorization on TRON and BSC, EIP-3009 on Base USDC. TRON also supports `scheme=exact_gasfree`, where a relayer pays the network energy and deducts its fee from the payment token — so the payer doesn't need to hold TRX. See [GasFree payments](./command-reference.md#gasfree-payments-tron).

By default, `pay` signs with your active [Agent Wallet](../../Agent-Wallet/Intro.md) — no private key in an environment variable. See [Paying with Agent Wallet](./command-reference.md#paying-with-agent-wallet).

---

## What can it do?

The CLI groups its capabilities into five commands.

| Command | What it does | Example |
| :--- | :--- | :--- |
| **`pay`** | Pay an x402-protected URL. Probes the endpoint, reads the `402` challenge, signs a payment, and retries. | `x402-cli pay <url> --network tron:0xcd8690dc --token USDT` |
| **`serve`** | Run a local x402 paywall that returns `402 Payment Required` and settles through a facilitator. | `x402-cli serve --pay-to <address> --amount 0.0001` |
| **`roundtrip`** | Start a temporary server, immediately pay it, then exit — the fastest way to smoke-test end to end. | `x402-cli roundtrip --pay-to <address>` |
| **`gateway`** | Manage local gateway provider files: validate, scaffold, start, and build catalog assets. | `x402-cli gateway check ./providers` |
| **`catalog`** | Search, cache, inspect, and export the hosted provider catalog. | `x402-cli catalog search "weather"` |

Read-only commands (`pay --dry-run`, `catalog search`, `gateway check`) need no wallet. An actual payment requires a configured signing wallet; raw private keys are only a development/CI override.

---

## Human-readable by default, JSON when you need it

Output is human-friendly text by default. Add `--json` to any command for a stable, machine-readable envelope — ideal for scripts and AI agents:

```bash
x402-cli pay 'https://x402-gateway.bankofai.io/providers/defillama-tvl-tron/protocols' \
  --network tron:0x2b6653dc \
  --token USDT \
  --dry-run \
  --json
```

```json
{
  "ok": true,
  "command": "pay",
  "component": "client",
  "network": "tron:0x2b6653dc",
  "scheme": "exact",
  "result": {
    "url": "https://x402-gateway.bankofai.io/providers/defillama-tvl-tron/protocols",
    "resource": "https://x402-gateway.bankofai.io/providers/defillama-tvl-tron/protocols",
    "selected": {
      "scheme": "exact",
      "network": "tron:0x2b6653dc",
      "amount": "1",
      "asset": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      "payTo": "TLXPgJVJFgL97gc49j8w8kC22mDTpH9EGa",
      "maxTimeoutSeconds": 300,
      "extra": {
        "assetTransferMethod": "permit2"
      }
    },
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
| **TRON Mainnet** | `tron:0x2b6653dc` | USDT, USDD |
| **TRON Nile Testnet** | `tron:0xcd8690dc` | USDT, USDD |
| **TRON Shasta Testnet** | `tron:0x94a9059e` | USDT |
| **BSC Mainnet** | `eip155:56` | USDT |
| **BSC Testnet** | `eip155:97` | USDT, USDC |
| **Base Mainnet** | `eip155:8453` | USDC |
| **Base Sepolia Testnet** | `eip155:84532` | USDC |

Always pass TRON networks as their canonical CAIP-2 identifiers (`tron:0x…`). Legacy aliases like `tron-mainnet`, `tron:nile`, or `mainnet` are **rejected** — the CLI reports the canonical identifier to use instead. Only the EVM aliases are still accepted and normalized automatically:

| Alias | Canonical identifier |
| :--- | :--- |
| `bsc-mainnet` | `eip155:56` |
| `bsc-testnet` | `eip155:97` |
| `base-mainnet` | `eip155:8453` |
| `base-sepolia` | `eip155:84532` |

Registered token decimals are authoritative and can't be overridden. For an unregistered, non-Base asset, pass `--asset <address>` together with `--decimals <count>`.

:::note Authorization differs by chain
TRON and BSC stablecoin payments use **Permit2** authorization; Base USDC uses **EIP-3009** (`transferWithAuthorization`). Both run through the same `exact` scheme — the CLI picks the right one for the network, so you don't configure it yourself.
:::

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

- **Let Agent Wallet hold the key.** It is the default payer and delegates signing to the configured wallet backend, which may be local or remote. You never need to put a private key in the CLI configuration or environment. `--private-key` and the `*_PRIVATE_KEY` variables exist for development and CI only.
- **Test on testnet first.** Use `tron:0xcd8690dc`, `eip155:97`, or `eip155:84532` before running any payment on mainnet.
- **Preview before you pay.** Run `pay --dry-run` to inspect the exact requirement before signing.
- **Cap the amount.** Use `--max-amount` or `--max-raw-amount` so a mispriced endpoint can't overcharge you.
- **Don't follow redirects blindly.** The CLI deliberately won't auto-follow an HTTP redirect on a paid request, so `PAYMENT-SIGNATURE` is never forwarded to another origin. If an endpoint redirects, verify the destination and call the final URL explicitly.
- **Fund the minimum.** Only keep the funds the current task needs in the payer address.
:::

---

## Next steps

- Want to run your first payment fast? → [Quick Start](./quickstart.md)
- Need every command and flag? → [Command Reference](./command-reference.md)
- Hit a snag or have a question? → [FAQ & Troubleshooting](./faq.md)
