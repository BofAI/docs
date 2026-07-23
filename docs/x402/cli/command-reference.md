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
| `--method <method>` | HTTP method (default: `GET`) |
| `--header "Name: Value"` | Request header; repeatable |
| `--body <body>` | Request body for non-`GET`/`HEAD` methods |
| `--network <caip2>` | Require a specific network (e.g. `tron:nile`) |
| `--token <symbol>` | Require a specific token (e.g. `USDT`) |
| `--scheme <scheme>` | Require a specific x402 scheme (e.g. `exact`) |
| `--max-amount <amount>` | Maximum human-readable amount you'll pay |
| `--max-raw-amount <amount>` | Maximum amount in smallest units |
| `--dry-run` | Read the requirement but do not sign or pay |
| `--private-key <hex>` | Explicit payer key (or use the env vars below) |
| `--rpc-url <url>` | Explicit network RPC URL |
| `--timeout-ms <ms>` | Network timeout in ms (default: `30000`) |
| `--json` | Print the JSON envelope |

The payer key is read from `--private-key`, or from an environment variable: `TRON_PRIVATE_KEY` for TRON networks and `EVM_PRIVATE_KEY` for EVM networks, with `PRIVATE_KEY` accepted as a fallback for either network.

**Examples:**

```bash
# Preview the requirement without paying
x402-cli pay https://api.example.com/paid --dry-run --json
```

```bash
# Pay, but never spend more than 0.01 USDT
TRON_PRIVATE_KEY=<hex> x402-cli pay https://api.example.com/paid \
  --network tron:nile --token USDT --max-amount 0.01
```

```bash
# POST with a body and a custom header
x402-cli pay https://api.example.com/paid \
  --method POST --header "X-Client: demo" --body '{"q":"hello"}'
```

If the endpoint does not return `402`, the CLI reports the actual status and response instead of paying.

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
| `--network <caip2>` | Payment network (default: `tron:nile`) |
| `--token <symbol>` | Token symbol (default: `USDT`) |
| `--asset <address>` | Explicit token address for an unregistered token |
| `--decimals <count>` | Token decimals, required with an unregistered `--asset` |
| `--host <host>` | Bind host (default: `127.0.0.1`) |
| `--port <port>` | Bind port (default: `4020`) |
| `--resource-url <url>` | URL advertised in the payment requirement |
| `--facilitator-url <url>` | Facilitator base URL (default: `https://facilitator.bankofai.io`) |
| `--timeout-ms <ms>` | Facilitator timeout in ms (default: `30000`) |
| `-d, --daemon` | Run in the background and print the child pid |
| `--json` | Print the JSON envelope |

The server exposes four routes:

| Route | Purpose |
| :--- | :--- |
| `GET /health` | Returns `{ "ok": true }` |
| `GET /.well-known/x402` | Machine-readable payment metadata (network, scheme, asset, amount, `payTo`) |
| `GET /pay` | Returns `402 Payment Required` with the challenge header |
| `POST /pay` | Verifies the payment, settles it, and returns the transaction |

**Examples:**

```bash
x402-cli serve --pay-to T... --network tron:nile --token USDT
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
TRON_PRIVATE_KEY=<hex> x402-cli roundtrip \
  --pay-to T... --amount 0.0001 --network tron:nile --token USDT
```

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

`start` and `gateway catalog` require the `@bankofai/x402-gateway` runtime. Install it (`npm install -g @bankofai/x402-gateway`), run from a checkout that has `../x402-gateway/dist/cli.js`, or pass `--gateway-bin <path>`.

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
| `--output-dir <dir>` | Output directory for generated files |
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
