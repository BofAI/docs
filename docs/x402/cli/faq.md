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

Only for actual payments. Read-only commands — `pay --dry-run`, `catalog search`, `catalog show`, `gateway check` — need no wallet. A real `pay` or `roundtrip` signs with your active [Agent Wallet](../../Agent-Wallet/Intro.md).

### How does the CLI choose which wallet to sign with?

It resolves the **active Agent Wallet** for the payment network. If wallets are configured but none is marked active, the CLI stops before signing instead of guessing — set one active, or select one explicitly:

- `--wallet-id <id>` or `AGENT_WALLET_ID` — pick a specific configured wallet
- `AGENT_WALLET_DIR` — use a non-default Agent Wallet directory

The CLI never reads private keys out of `wallets_config.json`. On EVM networks it also checks the payer's token balance before signing, and returns the resolved wallet ID, address, and raw balance in the result.

### Can I still use a raw private key?

Yes, but only for development and CI: `--private-key <hex>`, or the `EVM_PRIVATE_KEY` / `TRON_PRIVATE_KEY` / `PRIVATE_KEY` environment variables. Prefer the environment variable over the flag in shared environments — command-line arguments are recorded in shell history and process listings.

:::caution
For anything beyond throwaway testing, use Agent Wallet rather than raw keys, and keep only the minimum funds the current task needs in the payer address.
:::

### Will a payment ever spend more than I expect?

Not if you cap it. Use `--max-amount <human>` or `--max-raw-amount <smallest-units>`; if the endpoint's price exceeds your cap, the CLI aborts **before** signing. When in doubt, run `pay --dry-run` first to see the exact requirement.

### Which networks and tokens are supported?

TRON (`tron:0x2b6653dc`, `tron:0xcd8690dc`, `tron:0x94a9059e`), BSC (`eip155:56`, `eip155:97`), and Base (`eip155:8453`, `eip155:84532`), with a built-in registry for USDT, USDD, and USDC depending on the network. See [x402 CLI overview](./index.md#supported-networks--tokens) for the full table. Registered token decimals are authoritative; pass `--asset <address>` with `--decimals <count>` only for an unregistered, non-Base asset.

Pass TRON networks as their canonical CAIP-2 identifiers (`tron:0x…`). Legacy identifiers such as `tron:nile`, `tron:mainnet`, or `mainnet` are no longer accepted — the CLI rejects them and tells you the canonical identifier to use. EVM aliases (`bsc-mainnet`, `bsc-testnet`, `base-mainnet`, `base-sepolia`) are accepted.

### How is paying on Base different?

Base settles USDC with **EIP-3009** (`transferWithAuthorization`) instead of Permit2, still under the `exact` scheme. You don't configure this — the CLI applies the right authorization per network. The one thing to set yourself is RPC: the built-in public endpoint is for development only, so in production pass `--rpc-url`, or set `EVM_RPC_URL_8453` / `EVM_RPC_URL_84532` / `EVM_RPC_URL`. See [Paying on Base](./command-reference.md#paying-on-base).

### Can I pay without holding TRX?

Yes, on TRON, using GasFree. With `scheme=exact_gasfree`, a relayer pays the network energy and deducts its fee from the payment token, so the payer wallet needs only the stablecoin — no TRX. The CLI takes the first advertised requirement matching your filters and does not prefer GasFree, so require it with `--scheme exact_gasfree` whenever the endpoint also offers plain `exact`. Because the relayer fee is separate from the payment amount, cap it with `--max-gasfree-fee <amount>`. See [GasFree payments](./command-reference.md#gasfree-payments-tron).

---

## Understanding errors

Every failure prints a stable error `code`, a message, and a `hint`. Add `--json` to get the same information as a structured envelope. The most common codes:

| Code | What happened | How to fix it |
| :--- | :--- | :--- |
| `WALLET_NOT_CONFIGURED` | No active Agent Wallet for this network | Set an active wallet, or select one with `--wallet-id` / `AGENT_WALLET_ID`. For dev/CI, use `--private-key` or a `*_PRIVATE_KEY` variable |
| `WALLET_PASSWORD_REQUIRED` | Agent Wallet needs its unlock password | Provide the password through Agent Wallet's supported secure configuration |
| `WALLET_DECRYPTION_FAILED` | Wrong password for the Agent Wallet | Unlock with the correct password and retry |
| `WALLET_CONFIG_CORRUPT` | Agent Wallet configuration is unreadable | Check `~/.agent-wallet/wallets_config.json`, or recreate the local configuration |
| `WALLET_NETWORK_ERROR` | Can't reach the Agent Wallet backend | Check connectivity to the configured wallet backend |
| `WALLET_SIGNING_FAILED` | The wallet couldn't produce the signature | Confirm the active wallet supports this network and typed-data request |
| `WALLET_UNSUPPORTED_OPERATION` | The wallet backend can't sign typed data for this network | Switch to a wallet backend that supports typed-data signing here |
| `WALLET_AUTH_FAILED` | Remote wallet authentication was rejected | Check the remote wallet's authentication configuration |
| `WALLET_ERROR` | Other Agent Wallet failure | Inspect the active wallet configuration and backend status |
| `TOKEN_TRANSFER_FAILED` | The token `transferFrom` reverted | Check token balance, the token contract, and the payer's allowance |
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
| `SDK_API_DRIFT` | Installed SDK packages don't match the CLI | Reinstall `@bankofai/x402-cli` (its SDK dependencies are pinned, so don't upgrade them separately) |
| `INVALID_SETTLEMENT` | The gateway returned a `PAYMENT-RESPONSE` that is not a successful settlement | Do not treat the request as paid; contact the gateway operator |
| `WALLET_ADDRESS_MISMATCH` | The selected wallet doesn't match the payer in the typed data | Reselect the wallet and retry with a fresh requirement |
| `INVALID_PAYMENT_REQUIREMENT` | The `402` requirement failed structural validation (scheme, network, amount, address, timeout, resource URL) | The endpoint is misconfigured; contact the provider |
| `TOKEN_BALANCE_CHECK_FAILED` | The balance check on the payment token failed | Verify the RPC endpoint and the token/network pair |
| `HTTP_ERROR` | The paid retry returned a non-2xx status | Read `error.details` for `settled` / `paymentResponse` before retrying |
| `IO_ERROR` | Fallback code for an error the CLI could not classify (local file read/write failures land here too) | Re-run with `--json` and read the raw `message`; check the provider/gateway logs |

### "402 response missing PAYMENT-REQUIRED header"

The endpoint returned `402` but didn't include the machine-readable challenge header. This is a server-side misconfiguration — the CLI can't derive a payment requirement from it.

### "no matching payment requirement"

The endpoint offered payment options, but none matched your `--network`, `--token`, or `--scheme` filters. Run `pay --dry-run --json` without those filters to see what the provider actually accepts, then narrow accordingly.

---

## The gateway

### `gateway start` says the runtime isn't found

This usually means a broken or partial install: the CLI normally bundles the gateway runtime (`dist/gateway/cli.js`) and depends on `@bankofai/x402-gateway`, so reinstall `@bankofai/x402-cli` first, or point at another runtime with `--gateway-bin <path>`. Only `gateway start` needs that runtime at all: `gateway check`, `gateway catalog build`, `gateway catalog pay-assets`, and `catalog build` call the gateway library in-process, `gateway scaffold` just writes a template file, and the search commands read a catalog source.

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
