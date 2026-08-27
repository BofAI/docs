---
title: 'Command Reference'
description: >-
  Complete reference for every x402 CLI command and flag — pay, serve, roundtrip, gateway, and catalog.
---

# Command Reference

This page is the complete reference for all x402 CLI commands.

> Legend: `<arg>` = required argument, `[arg]` = optional argument. Options are optional unless marked **(required)**.

---

## Global options

These flags work on every command.

| Flag | Description |
| :--- | :--- |
| `-h, --help` | Show help for the command |
| `-V, --version` | Print the CLI version |
| `--json` | Print a machine-readable JSON envelope |
| `--human` | Print human-readable output (default) |

`--json` and `--human` are mutually exclusive. The JSON envelope always contains `ok` and `command`, plus either a `result` object or a structured `error` (`code`, `message`, `hint`).

```bash
x402-cli --help
x402-cli --version
x402-cli pay --help
```

---

## `pay`

Pay an x402-protected URL. The CLI sends the request, and if the server answers `402 Payment Required`, it reads the `PAYMENT-REQUIRED` challenge, selects a matching requirement, signs a payment, and retries the request with the signed payload.

```bash
x402-cli pay <url> [options]
```

| Option | Description |
| :--- | :--- |
| `--method <method>` | HTTP method — uppercase, one of `DELETE`, `GET`, `HEAD`, `OPTIONS`, `PATCH`, `POST`, `PUT` (default: `GET`); anything else fails with `INVALID_ARGUMENT` (exit 2) |
| `--header "Name: Value"` | Request header; repeatable |
| `--body <body>` | Request body; ignored for `GET` and `HEAD` |
| `--network <caip2>` | Require a specific network (e.g. `tron:0xcd8690dc`, `base-mainnet`) |
| `--token <symbol>` | Require a specific token (e.g. `USDT`, `USDC`) |
| `--asset <address>` | Require a specific asset address |
| `--decimals <count>` | Decimals for an unregistered explicit asset |
| `--scheme <scheme>` | Require a specific x402 scheme: `exact` or `exact_gasfree` |
| `--gasfree-api-url <url>` | Override the TRON GasFree relayer API URL (env `X402_GASFREE_API_URL`) |
| `--max-gasfree-fee <amount>` | Maximum GasFree relayer fee, in token units |
| `--max-gasfree-fee-raw <n>` | Maximum GasFree relayer fee, in smallest units |
| `--max-amount <amount>` | Maximum human-readable amount you'll pay |
| `--max-raw-amount <amount>` | Maximum amount in smallest units |
| `--dry-run` | Read the requirement but do not sign or pay |
| `--wallet-id <id>` | Explicitly select a configured Agent Wallet (env `AGENT_WALLET_ID`) |
| `--private-key <hex>` | Override Agent Wallet — development and CI only |
| `--rpc-url <url>` | Explicit network RPC URL |
| `--timeout-ms <ms>` | Network timeout in ms (default: `30000`) |
| `--json` | Print the JSON envelope |

Registered token decimals are authoritative and can't be overridden with `--decimals`. Pass `--asset` and `--decimals` together only for an unregistered, non-Base asset.

### Paying with Agent Wallet {#paying-with-agent-wallet}

By default `pay` resolves the **active [Agent Wallet](../../Agent-Wallet/Intro.md)** for the selected network and delegates signing to it — no private key in a config file or environment variable.

- If wallets are configured but none is active, the CLI **stops before signing** rather than silently picking the first one. Set an active wallet, or select one explicitly with `--wallet-id` / `AGENT_WALLET_ID`.
- Use `AGENT_WALLET_DIR` to point at a non-default Agent Wallet directory.
- The CLI never reads private keys out of `wallets_config.json`.
- On EVM networks it checks the payer's token balance before signing, and returns the resolved wallet ID, address, and raw balance in the result. The EIP-712 payer must match that address.

For **development and CI only**, `--private-key` or the `EVM_PRIVATE_KEY` / `TRON_PRIVATE_KEY` / `PRIVATE_KEY` environment variables override Agent Wallet. Prefer the environment variables over the flag in shared environments — command-line arguments can be visible to other local processes.

**Examples:**

```bash
# Preview the requirement without paying
x402-cli pay https://api.example.com/paid --dry-run --json
```

```bash
# Pay, but never spend more than 0.01 USDT
x402-cli pay https://api.example.com/paid \
  --network tron:0xcd8690dc --token USDT --max-amount 0.01
```

```bash
# POST with a body and a custom header
x402-cli pay https://api.example.com/paid \
  --method POST --header "X-Client: demo" --body '{"q":"hello"}'
```

If the endpoint does not return `402`, the CLI reports the actual status and response instead of paying.

### GasFree payments (TRON) {#gasfree-payments-tron}

On TRON, `scheme=exact_gasfree` lets a relayer pay the network energy and deduct its fee from the payment token, so the payer doesn't need to hold TRX. The CLI does **not** prefer GasFree: it takes the first requirement in the server's `accepts` list that passes your `--network` / `--scheme` / `--token` filters. If the endpoint also advertises plain `exact`, pass `--scheme exact_gasfree` to guarantee the gasless route.

GasFree fees are **separate** from the advertised payment amount — they are the relayer's service charge (a fixed per-payment transfer fee, plus a one-time activation fee if the GasFree account is not yet activated), deducted from your GasFree account in the payment token. The CLI always estimates the relayer fee for an `exact_gasfree` requirement and reports it as `gasfreeEstimate` (`fee` and `total`) in the result; adding a fee limit makes it abort before signing when either the estimate or the final signed `maxFee` exceeds your cap:

```bash
x402-cli pay https://api.example.com/pay \
  --network tron:0xcd8690dc --token USDT \
  --scheme exact_gasfree \
  --max-amount 0.01 \
  --max-gasfree-fee 0.5 \
  --json
```

`--max-gasfree-fee` and `--max-gasfree-fee-raw` are mutually exclusive, and are rejected with `INVALID_ARGUMENT` (exit 2) if the requirement the CLI selects is not `exact_gasfree`. Override the relayer endpoint with `--gasfree-api-url <url>` or `X402_GASFREE_API_URL`.

A paid response distinguishes `settled` (the payment cleared on-chain) from `delivered` (the upstream HTTP business response succeeded). A settled-but-undelivered request exits with code 1 and an error envelope (`ok: false`, `error.code: HTTP_ERROR`, or `RATE_LIMITED` on 429); the `paid` / `settled` / `delivered` flags and `paymentResponse` are carried under `error.details`. Read them from there for reconciliation, and do not retry blindly.

### Paying on Base {#paying-on-base}

Base settles USDC through the standard `exact` EVM flow, using **EIP-3009** (`transferWithAuthorization`) rather than Permit2. You don't select that — the CLI applies the right authorization for the network.

```bash
x402-cli pay https://api.example.com/pay \
  --network base-mainnet \
  --token USDC \
  --max-amount 0.01 \
  --rpc-url <production-rpc-url>
```

The built-in public RPC is meant for development only. In production, supply an RPC endpoint via `--rpc-url`, `EVM_RPC_URL_8453` / `EVM_RPC_URL_84532`, or `EVM_RPC_URL`.

:::caution Redirects are not followed
The probe and the signed retry deliberately do **not** follow HTTP redirects, so `PAYMENT-SIGNATURE` is never forwarded to another origin. If an endpoint redirects, inspect the destination and call the final trusted URL explicitly.
:::

### Environment variables {#pay-environment-variables}

Some settings have no flag and are configured through the environment only:

| Variable | Purpose |
| :--- | :--- |
| `AGENT_WALLET_DIR` | Use a non-default Agent Wallet directory |
| `AGENT_WALLET_ID` | Select a configured wallet (same as `--wallet-id`) |
| `TRON_RPC_URL` | TRON RPC endpoint (falls back from `--rpc-url`) |
| `TRON_GRID_API_KEY` | TronGrid API key — set this to avoid public rate limits |
| `X402_TRON_ALLOWANCE_MODE` | TRON allowance handling; defaults to `auto` |
| `EVM_RPC_URL` | Default EVM RPC endpoint |
| `EVM_RPC_URL_<chainId>` | Per-network RPC, e.g. `EVM_RPC_URL_8453`, `EVM_RPC_URL_84532`, `EVM_RPC_URL_56`, `EVM_RPC_URL_97` |
| `RPC_URL` | Generic EVM RPC fallback |
| `X402_GASFREE_API_URL` | Override the TRON GasFree relayer API |
| `EVM_PRIVATE_KEY` / `TRON_PRIVATE_KEY` / `PRIVATE_KEY` | Override Agent Wallet — development and CI only |

> EVM RPC precedence: `--rpc-url` → `EVM_RPC_URL_<chainId>` → `RPC_URL` → `EVM_RPC_URL` → a built-in public endpoint. The built-in endpoints (BSC as well as Base) are for development only.

---

## `serve`

Run a local x402 paywall endpoint. It advertises a payment requirement, then verifies and settles submitted payments through a facilitator.

```bash
x402-cli serve --pay-to <address> [options]
```

| Option | Description |
| :--- | :--- |
| `--pay-to <address>` | **(required)** Recipient wallet address |
| `--amount <amount>` | Human-readable token amount (default: `0.0001`) |
| `--raw-amount <amount>` | Amount in smallest units (mutually exclusive with `--amount`) |
| `--network <caip2>` | Payment network (default: `tron:0xcd8690dc`) |
| `--scheme <scheme>` | Payment scheme: `exact` or `exact_gasfree` (default: `exact`) |
| `--token <symbol>` | Token symbol (default: `USDT`) |
| `--asset <address>` | Explicit token address for an unregistered token |
| `--decimals <count>` | Token decimals, required with an unregistered `--asset` |
| `--host <host>` | Bind host (default: `127.0.0.1`) |
| `--port <port>` | Bind port (default: `4020`) |
| `--resource-url <url>` | URL advertised in the payment requirement |
| `--facilitator-url <url>` | Facilitator base URL (default: `https://facilitator.bankofai.io`) |
| `--valid-for-seconds <n>` | How long the payment requirement stays valid — integer 1–86400 (default: `300`) |
| `--timeout-ms <ms>` | Facilitator timeout in ms (default: `30000`) |
| `-d, --daemon` | Run in the background and print the child pid |
| `--json` | Print the JSON envelope |

The server exposes these routes — the paywall branches on the `PAYMENT-SIGNATURE` header, not on the HTTP method:

| Route | Purpose |
| :--- | :--- |
| `GET /health` | Returns `{ "ok": true }` |
| `GET /.well-known/x402` | Machine-readable payment metadata (network, scheme, asset, amount, `payTo`) |
| `/pay` (any method) | Returns `402 Payment Required` with the challenge header when the request carries no `PAYMENT-SIGNATURE`; with that header, verifies and settles the payment through the facilitator and returns the transaction |

**Examples:**

```bash
x402-cli serve --pay-to T... --network tron:0xcd8690dc --token USDT
```

```bash
x402-cli serve --pay-to 0x... --network eip155:97 --token USDT --amount 0.0001 --daemon
```

---

## `roundtrip`

Start a temporary local server, immediately pay it, then exit. This is the quickest full end-to-end test. It accepts the same options as `serve` and `pay` combined.

```bash
x402-cli roundtrip --pay-to <address> [serve/pay options]
```

**Example:**

```bash
x402-cli roundtrip \
  --pay-to T... --amount 0.0001 --network tron:0xcd8690dc --token USDT
```

With `--json`, `roundtrip` emits a single JSON document containing separate `serve` and `pay` results.

---

## `gateway`

Manage local gateway provider files — validate, scaffold, start a gateway process, and build catalog assets from `provider.yml` files.

```bash
x402-cli gateway <search|start|check|scaffold|catalog> [options]
```

| Subcommand | Description |
| :--- | :--- |
| `search <query>` | Search a catalog artifact (see [`catalog search`](#catalog)) |
| `start` | Start a local x402 gateway process |
| `check <providers>` | Validate one or more `provider.yml` files |
| `scaffold <name>` | Write a starter `provider.yml` |
| `catalog <command>` | Build/check/search gateway catalog assets |

`gateway start` spawns a gateway runtime, but the CLI already ships one: the published package bundles `dist/gateway/cli.js` and depends on `@bankofai/x402-gateway`, so a normal `npm install -g @bankofai/x402-cli` needs nothing extra. It resolves the runtime in order — `--gateway-bin`, the `@bankofai/x402-gateway` dependency, the bundled `dist/gateway/cli.js`, `x402-gateway` on `PATH`, then `../x402-gateway/dist/cli.js` in a checkout. `gateway check`, `gateway catalog build`, `gateway catalog pay-assets`, and `catalog build` call the gateway library in-process; `gateway scaffold` only writes a template file, and `gateway search` / `gateway catalog search` read a catalog source.

Defaults: `gateway start` binds `--host 127.0.0.1 --port 4020` and reads `--providers providers`; `gateway check` also defaults to `providers`; `gateway scaffold` writes to `--output-dir providers/<name>` with `--forward-url https://api.example.com`; a bare `x402-cli gateway catalog` runs `build`.

**Validate provider files:**

```bash
x402-cli gateway check ./providers
```

**Scaffold a new provider:**

```bash
x402-cli gateway scaffold my-service --forward-url https://api.myservice.com
```

This writes `providers/my-service/provider.yml` with a ready-to-edit template (network, recipient, currencies, and a sample metered endpoint).

**Start a gateway:**

```bash
x402-cli gateway start --providers ./providers --host 127.0.0.1 --port 4020
```

### `gateway catalog`

```bash
x402-cli gateway catalog <build|check|pay-assets|search> [options]
```

| Subcommand | Description |
| :--- | :--- |
| `build <providers>` | Build a local catalog from `provider.yml` files |
| `check <providers>` | Validate local `provider.yml` files |
| `pay-assets <providers>` | List payable endpoint assets (method, path, network, price) |
| `search <query>` | Search a catalog artifact |

```bash
x402-cli gateway catalog pay-assets ./providers --json
```

---

## `catalog`

Search, cache, inspect, and export the hosted provider catalog.

```bash
x402-cli catalog <update|search|show|endpoints|pay-json|export-gateway|build> [options]
```

| Subcommand | Description |
| :--- | :--- |
| `update` | Cache hosted/local catalog assets under `~/.cache/x402-cli/catalog` |
| `search <query>` | Search providers by name, tags, chains, category, and endpoints |
| `show <provider>` | Show provider detail JSON |
| `endpoints <provider>` | List a provider's endpoints |
| `pay-json <provider>` | Print a provider's pay JSON (payable route details) |
| `export-gateway <url>` | Export `catalog.json` and `pay.md` from a live gateway |
| `build <providers>` | Build a catalog from local `provider.yml` files |

**Common options:**

| Option | Description |
| :--- | :--- |
| `--catalog <source>` | `catalog.json` path or URL |
| `--provider <fqn>` | Provider FQN (for `export-gateway`) |
| `--output-dir <dir>` | Output directory for generated files (`export-gateway`) |
| `--output <file>` | Write the built catalog JSON to this file (`build`) |
| `--dist-dir <dir>` | Write the built catalog to `<dir>/catalog.json` (`build`) |
| `-n, --limit <count>` | Search result limit (default: `10`) |
| `--include-blocked` | Include blocked providers in search results |
| `--timeout-ms <ms>` | Network timeout in ms (default: `30000`) |
| `--force` | Overwrite existing files (for `export-gateway`) |
| `--raw` | Print the raw pay payload (for `pay-json`) |
| `--json` | Print the JSON envelope |

**Catalog source resolution.** When `--catalog` is omitted, the CLI resolves the source in this order: the `X402_CATALOG` or `X402_GATEWAY_CATALOG` environment variable, then the local cache at `~/.cache/x402-cli/catalog/catalog.json`, then the hosted default `https://x402-catalog.bankofai.io/api/catalog.json`.

**Examples:**

```bash
# Cache the hosted catalog locally for fast, offline search
x402-cli catalog update
```

```bash
# Find providers, limited to 5 results
x402-cli catalog search "weather forecast" -n 5
```

```bash
# Inspect one provider
x402-cli catalog show acme.weather
x402-cli catalog endpoints acme.weather --json
```

```bash
# Get the payable route JSON for a provider
x402-cli catalog pay-json acme.weather --raw
```

```bash
# Export catalog.json + pay.md from a running gateway
x402-cli catalog export-gateway https://gateway.example.com \
  --provider acme.weather --output-dir ./out --force
```

---

## Exit codes

| Exit code | Meaning |
| :--- | :--- |
| `0` | Success |
| `1` | Runtime error (network, wallet, settlement, etc.) |
| `2` | Invalid usage (missing/invalid argument, unknown command) |

For the full list of error codes and their fixes, see [FAQ & Troubleshooting](./faq.md).
