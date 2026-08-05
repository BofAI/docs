---
title: 'Quick Start'
description: >-
  Install x402 CLI and complete a full pay-to-settle roundtrip on the TRON Nile testnet in a few minutes.
---

# Quick Start

The goal of this page is simple: **install the CLI and complete a full payment roundtrip on a testnet in a few minutes.** All testnet operations use free test tokens — no real funds are involved.

---

## Prerequisites

Before you start, make sure you have:

1. **Node.js** >= 20 ([download](https://nodejs.org/))
2. **npm** (comes with Node.js)
3. An **[Agent Wallet](../../Agent-Wallet/QuickStart.md)** with an active wallet for the network you'll pay on — this is how the CLI signs by default
4. A funded testnet address for the payment step — a TRON **Nile** address holding a small amount of test **USDT** and **TRX** (for energy). See [Wallet](../core-concepts/wallet.md).

Verify your environment:

```bash
node --version   # v20.x or later
npm --version
```

---

## Step 1: Install

Install the CLI globally so the `x402-cli` command is available everywhere:

```bash
npm install -g @bankofai/x402-cli
```

Confirm it's working:

```bash
x402-cli --version
x402-cli --help
```

You should see the version number and the list of commands (`pay`, `serve`, `roundtrip`, `gateway`, `catalog`).

---

## Step 2: Try it without spending anything

The fastest way to see a real `402` challenge is a **dry run**. This probes a live TRON Mainnet endpoint, reads its payment requirement, and prints exactly what you'd be asked to pay — without signing or spending:

```bash
x402-cli pay 'https://x402-gateway.bankofai.io/providers/defillama-tvl-tron/protocols' \
  --network tron:0x2b6653dc \
  --token USDT \
  --dry-run \
  --json
```

This step reads a TRON Mainnet requirement, but `--dry-run` never signs or submits a payment. Its output includes the selected requirement (network, asset, amount, recipient). This is your safety net: always dry-run an unfamiliar endpoint before paying it.

---

## Step 3: Run a full roundtrip on testnet

`roundtrip` starts a temporary local paywall, pays it, and exits — a complete end-to-end test of your setup. Your active Agent Wallet for Nile does the signing.

```bash
x402-cli roundtrip \
  --pay-to <your-nile-recipient-address> \
  --amount 0.0001 \
  --network tron:0xcd8690dc \
  --token USDT
```

When it succeeds, the CLI prints the settled transaction. That transaction hash is your proof the payment cleared on-chain — congratulations, your setup works end to end.

:::caution Keep your keys safe
The CLI signs with your active [Agent Wallet](../../Agent-Wallet/QuickStart.md), so no private key goes into a shell or a config file. If wallets are configured but none is active, the CLI stops before signing — set one active, or pick one with `--wallet-id`. The `--private-key` flag and `*_PRIVATE_KEY` variables exist for development and CI only; prefer the environment variable over the flag, since command-line arguments can be visible to other local processes.
:::

---

## Step 4: Pay a real x402 endpoint

Once the roundtrip works, paying any x402-protected URL uses the same command. Replace the placeholders below with the URL, network, and token advertised by the provider:

```bash
x402-cli pay '<x402-url>' \
  --network <network> \
  --token <token> \
  --max-amount 0.01
```

`--max-amount` caps what you're willing to pay: if the endpoint's price exceeds it, the CLI aborts before signing. The same command works on EVM networks — just point `--network` at one, such as `eip155:97` (BSC Testnet) or `base-sepolia` (Base Sepolia, USDC).

:::tip No TRX? Use GasFree
On TRON, if the endpoint advertises `exact_gasfree`, the CLI can pay without any TRX in your wallet — a relayer covers the network energy and takes its fee from the payment token. The CLI selects it automatically, or you can require it with `--scheme exact_gasfree` and cap the relayer fee with `--max-gasfree-fee`. See [GasFree payments](./command-reference.md#gasfree-payments-tron).
:::

---

## Optional: Run your own paywall

Want to charge for a resource instead of paying for one? Start a local x402 server:

```bash
x402-cli serve \
  --pay-to <your-recipient-address> \
  --amount 0.0001 \
  --network tron:0xcd8690dc \
  --token USDT \
  --port 4020
```

It exposes:

- `GET /health` — liveness check
- `GET /.well-known/x402` — machine-readable payment metadata
- `GET /pay` — returns `402 Payment Required`
- `POST /pay` — verifies and settles a submitted payment through the facilitator

In another terminal, pay it:

```bash
x402-cli pay http://127.0.0.1:4020/pay --network tron:0xcd8690dc --token USDT
```

Point the server at a specific facilitator with `--facilitator-url` (defaults to `https://facilitator.bankofai.io`), and add `--daemon` to run it in the background and print the child process id.

---

## Next steps

- **[Command Reference](./command-reference.md)** — Every command and flag: `pay`, `serve`, `roundtrip`, `gateway`, `catalog`.
- **[FAQ & Troubleshooting](./faq.md)** — Fix common errors and understand the error codes.
- **[Core Concepts](../core-concepts/http-402.md)** — How the `402` handshake and facilitator settlement actually work.
