# SDK Guide

You've tried the CLI and can sign from the command line. Now you want signing inside your own code — an MCP Server, an automation script, an AI agent workflow.

This page shows you how. By the end, you'll be able to resolve a wallet, read its address, and sign transactions and EIP-712 / TIP-712 typed data with the `@bankofai/agent-wallet` 3.x TypeScript SDK.

:::tip New here?
If you haven't created a wallet yet, start with the [Quick Start](../QuickStart.md). The SDK reads the same `wallets_config.json` the CLI writes — no need to set up anything twice.
:::

:::note Python SDK
Agent-wallet 3.x is TypeScript only. The Python package `bankofai-agent-wallet` on PyPI stopped at 2.4.0 and follows the 2.x model (`local_secure`, master password, `sign_message`); it does not support the `wallet_cli` type or the 3.x signing results described here.
:::

---

## Step 1: Install

**Check Your Node.js Version**

Use Node.js `^22.23.4 || ^24.22.1 || >=26.12.1` — the October 2026 security releases. This is the `engines` range on the source `main` branch; the published npm `3.0.0` still declares `>=18.0.0`, but wallet-cli `4.15.1` itself declares the same range. On `main`, when the `wallet_cli` wallet type launches wallet-cli through a JavaScript entrypoint with the current Node (a locally installed package, or an `AGENT_WALLET_WALLET_CLI_PATH` pointing at a `.js` file), it checks the same range first; a `wallet-cli` executable found on `PATH` is not checked. (In the published `3.0.0`, that entrypoint check only requires Node.js 20+.) Check your current version:

```bash
node -v
```

:::tip Install / Upgrade Node.js

We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions:

```bash
# Install nvm (skip if already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell config
source ~/.bashrc   # or source ~/.zshrc

# Install and switch to the current Node.js LTS
nvm install --lts
nvm use --lts
```

You can also download the **LTS** installer directly from [nodejs.org](https://nodejs.org).

:::

**Install the SDK**

```bash
npm install @bankofai/agent-wallet
```

The package ships both ESM and CommonJS builds. Only if you use `wallet_cli` wallets, also install the optional peer dependency:

```bash
npm install '@tron-walletcli/wallet-cli@^4.13.0'
```

---

## Step 2: Choose Where the Key Comes From

`resolveWalletProvider()` / `resolveWallet()` decide the source for you — no `if/else` in your code:

1. **Wallet config (recommended).** If `wallets_config.json` in the wallet directory (`dir` option → `AGENT_WALLET_DIR` → `~/.agent-wallet`) contains at least one wallet, a `ConfigWalletProvider` is used. It handles every wallet type the CLI can create: `wallet_cli`, `privy`, and `raw_secret`.
2. **Environment variable fallback.** Otherwise an `EnvWalletProvider` reads a key from the environment.

There is no password to export: `wallet_cli` credentials come from the exec script or value saved in the wallet config, and `privy` credentials are saved there too.

### Environment Variable Fallback {#environment-variable-fallback}

For disposable environments (e.g. a CI pipeline with a throwaway test key) you can skip the wallet config and feed the key directly:

```bash
export AGENT_WALLET_PRIVATE_KEY='your-private-key-in-hex'
# or
export AGENT_WALLET_MNEMONIC='word1 word2 word3 ...'
```

:::danger Plaintext key
This reads your private key in plaintext from the environment. Only use it in fully isolated test environments with throwaway keys. Setting both variables at once is an error.
:::

### Environment Variable Reference

| Variable | Purpose | Used by |
| :--- | :--- | :--- |
| `AGENT_WALLET_DIR` | Wallet directory (default `~/.agent-wallet`) | Wallet config |
| `AGENT_WALLET_WALLET_CLI_PATH` | wallet-cli executable or JavaScript entrypoint, when not on `PATH` | `wallet_cli` wallets |
| `AGENT_WALLET_PRIVATE_KEY` | Plaintext private key (hex) | Env fallback — choose one |
| `AGENT_WALLET_MNEMONIC` | Plaintext mnemonic phrase | Env fallback — choose one |
| `AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX` | Mnemonic account index (default `0`) | Env fallback |

The env fallback is only consulted when the wallet config has no wallets. The 2.x names `TRON_PRIVATE_KEY`, `TRON_MNEMONIC`, `TRON_ACCOUNT_INDEX` and `AGENT_WALLET_PASSWORD` are no longer read.

---

## Usage Examples

### Networks

Every `network` option takes an exact canonical CAIP-2 string: `eip155:<chainId>` (e.g. `eip155:1`, `eip155:56`, `eip155:97`) or `tron:<chainId>` (`tron:728126428` mainnet, `tron:3448148188` Nile, `tron:2494104990` Shasta). Aliases such as `tron:nile`, `tron:mainnet`, bare `tron` / `eip155`, hex TRON ids, and case or whitespace variants throw a `NetworkError`.

`raw_secret`, env-fallback and `wallet_cli` wallets **require** a network — it selects the EVM or TRON signer (and, for a mnemonic, the derivation path `m/44'/60'/0'/0/{index}` or `m/44'/195'/0'/0/{index}`). `privy` wallets may omit it.

For `wallet_cli` wallets the network must also be one wallet-cli itself knows — its built-ins (`eip155:1`, `eip155:11155111`, `eip155:56`, `eip155:97`, `eip155:8453`, `eip155:84532` (the two Base networks were added in wallet-cli 4.14.0) and the three TRON networks) or a network added to wallet-cli's own config — otherwise signing fails with `network_mismatch`. `raw_secret` and `privy` wallets have no such limit.

### Resolve a Wallet

The shortest path is `resolveWallet()`. It takes `network`, `dir`, and an optional `walletId` to pick a specific configured wallet instead of the active one (ignored in env-fallback mode):

```typescript
import { resolveWallet } from "@bankofai/agent-wallet";

const wallet = await resolveWallet({ network: "tron:3448148188" });
console.log("Address:", await wallet.getAddress());

// Or target a specific wallet instead of the active one
const other = await resolveWallet({ network: "eip155:56", walletId: "trading" });
```

When you need the provider itself, use `resolveWalletProvider()`:

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";

const provider = resolveWalletProvider({ network: "tron:3448148188" });
const wallet = await provider.getActiveWallet();     // or getActiveWallet("eip155:56")
```

Both functions accept `dir`, the programmatic equivalent of `AGENT_WALLET_DIR`.

### The `Wallet` Interface

```typescript
interface Wallet {
  getAddress(): Promise<string>;
  signTransaction(payload: TransactionPayload, options?: SignOptions): Promise<SignedTransactionArtifact>;
}

interface Eip712Capable {
  signTypedData(data: Record<string, unknown>, options?: SignOptions): Promise<string>;
}

type SignOptions = {
  authorizationSignature?: string; // forwarded to Privy as privy-authorization-signature
  signal?: AbortSignal;            // cancels a wallet-cli signing subprocess
};
```

- `signTransaction` returns a typed artifact: `{ family: "evm", rawTransaction }` (hex **without** `0x`) or `{ family: "tron", transaction }` (the transaction object with `txID` and `signature` attached). Branch on `family` — don't parse strings.
- `signTypedData` returns a hex signature **without** the `0x` prefix. It lives on the separate `Eip712Capable` interface; check for it before calling (all three built-in wallet types implement it).
- There is no `signMessage` or `signRaw` in 3.x.

### Sign a Transaction

Agent-wallet only handles signing — not building or broadcasting. You need to construct the unsigned transaction via RPC (e.g. TronGrid, an EVM node) first, then pass it to the SDK.

#### TRON Transaction

The payload must contain `raw_data_hex` (as returned by TronGrid). For `raw_secret`, `privy` and environment-variable wallets a missing `txID` is computed from `raw_data_hex`. A `wallet_cli` wallet needs the complete transaction — `raw_data`, `raw_data_hex` and a `txID` equal to the SHA-256 of `raw_data_hex` — or wallet-cli refuses to sign.

```typescript
// 1. Caller builds the unsigned transaction via TronGrid
const unsignedTx = {
  txID: "abc123...",
  raw_data_hex: "0a02...",
  raw_data: { /* raw data returned by TronGrid */ },
};

// 2. SDK signs (raw_secret signs in-process; wallet_cli delegates to wallet-cli)
const signed = await wallet.signTransaction(unsignedTx);
if (signed.family !== "tron") throw new Error("expected a TRON wallet");
console.log("Signed transaction:", signed.transaction);

// 3. Caller broadcasts signed.transaction
```

#### EVM Transaction (BSC, Ethereum, etc.)

```typescript
const signed = await wallet.signTransaction({
  type: "eip1559",
  to: "0xRecipient...",
  value: 0n,
  gas: 21000n,
  maxFeePerGas: 20000000000n,
  maxPriorityFeePerGas: 1000000000n,
  nonce: 0,
  chainId: 56,
});
if (signed.family !== "evm") throw new Error("expected an EVM wallet");
console.log("Signed tx:", "0x" + signed.rawTransaction);
```

`wallet_cli` wallets additionally reject a `chainId` that doesn't match the wallet's network, already-signed payloads, and EIP-4844 / EIP-7702 transactions.

### Sign EIP-712 Typed Data

Used for x402 payment authorizations, Permit2, and similar scenarios:

```typescript
import type { Eip712Capable, Wallet } from "@bankofai/agent-wallet";

function supportsTypedData(wallet: Wallet): wallet is Wallet & Eip712Capable {
  return "signTypedData" in wallet && typeof wallet.signTypedData === "function";
}

if (!supportsTypedData(wallet)) throw new Error("wallet cannot sign typed data");

const sig = await wallet.signTypedData({
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "chainId", type: "uint256" },
    ],
    Transfer: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },
  primaryType: "Transfer",
  domain: { name: "MyDApp", chainId: 1 },
  message: { to: "0x...", amount: 1000000 },
});
console.log("Signature:", sig);
```

---

### Manage Multiple Wallets

`ConfigWalletProvider` reads and edits the wallet configuration. You get one from `resolveWalletProvider()` (when wallets are configured) or by constructing it directly with `new ConfigWalletProvider(dir, { network })`:

```typescript
import { resolveWalletProvider, ConfigWalletProvider } from "@bankofai/agent-wallet";

const provider = resolveWalletProvider({ network: "tron:3448148188" });

if (provider instanceof ConfigWalletProvider) {
  // List all wallets — returns [walletId, config, isActive] tuples
  for (const [id, config, isActive] of provider.listWallets()) {
    console.log(`${id} (${config.type})${isActive ? " ← active" : ""}`);
  }

  // Switch the active wallet (persisted to wallets_config.json)
  provider.setActive("my-evm-wallet");

  // Or use a specific wallet on a specific network without switching
  const bsc = await provider.getWallet("my-evm-wallet", "eip155:56");
}

// With no active wallet set, this falls back to the first configured wallet
const wallet = await provider.getActiveWallet();
```

---

### Error Handling

The SDK's typed errors extend `WalletError`. A few setup and input failures are thrown as plain `Error` instead: no wallet source found (no configured wallets and no `AGENT_WALLET_PRIVATE_KEY` / `AGENT_WALLET_MNEMONIC`), both of those env vars set at once, a malformed private key, or an invalid `AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX`. Catch the specific types you can handle:

```typescript
import {
  WalletNotFoundError,
  NetworkError,
  SigningError,
  WalletCliNotFoundError,
  WalletCliExecutionError,
} from "@bankofai/agent-wallet";

try {
  const wallet = await provider.getActiveWallet();
  const signed = await wallet.signTransaction(unsignedTx);
} catch (e) {
  if (e instanceof WalletNotFoundError) {
    console.error("Wallet not found — check the wallet id");
  } else if (e instanceof NetworkError) {
    console.error("Invalid or mismatched network — use canonical CAIP-2, e.g. tron:3448148188");
  } else if (e instanceof WalletCliNotFoundError) {
    console.error("wallet-cli is not installed or not on PATH");
  } else if (e instanceof WalletCliExecutionError || e instanceof SigningError) {
    console.error("Signing failed:", e.message);
  } else {
    throw e;
  }
}
```

Error type hierarchy (all exported from the package root):

```
WalletError
├── WalletNotFoundError              # Specified wallet id not found (or no wallets configured)
├── DecryptionError                  # Kept for compatibility; not thrown by 3.x wallet types
├── InsufficientBalanceError         # Not thrown by the SDK; for your own code
├── SigningError                     # Signing operation failed or payload rejected
├── NetworkError                     # Non-canonical or mismatched network
├── UnsupportedOperationError        # Operation not supported by this wallet
└── ExternalSignerError
    ├── ExternalSignerConfigError
    │   ├── PrivyConfigError
    │   └── WalletCliConfigError
    ├── ExternalSignerExecutionError
    │   ├── PrivyRequestError
    │   ├── PrivyRateLimitError
    │   ├── PrivyAuthError
    │   └── WalletCliExecutionError
    │       └── WalletCliSubmittedTransactionError
    ├── ExternalSignerUsageError
    │   └── WalletCliUsageError
    └── ExternalSignerNotFoundError
        └── WalletCliNotFoundError
```

`WalletCliExecutionError` and `WalletCliUsageError` carry a `code`. Codes raised by agent-wallet itself: `capability_missing` (the wallet-cli executable cannot sign this family; an account without an address for the family raises `contract_mismatch`), `network_mismatch` (network unknown to wallet-cli; checked after the capability), `contract_mismatch`, `unsupported_version`, `unsupported_runtime`, `migration_required` / `migration_completed` / `migration_cancelled`, `timeout`, `aborted`, `spawn_error`, `stdin_write`, `output_limit`, `status_query_failed`, and `internal_error` when wallet-cli's failure envelope has an empty `code` (an envelope with no `code` at all raises `contract_mismatch`). When wallet-cli returns a failure envelope, its own code is passed through unchanged (for example `account_not_found`, `auth_failed`): exit `2` becomes `WalletCliUsageError`, exit `1` becomes `WalletCliExecutionError`. A `wallet_cli` transaction whose `chainId` does not match `-n` is rejected with `SigningError`, not `NetworkError`.

:::tip Don't auto-retry wallet-cli timeouts
If `signAndBroadcast()` from `@bankofai/agent-wallet/integrations/wallet-cli` times out, don't resend automatically — check the result first. Two timeouts are not exceptions: when the broadcast times out with a known `txId`, or when the `wait: true` polling deadline passes, the call returns `{ txId, stage: 'timeout' }`. A timeout while building or signing, or a broadcast timeout before any `txId` is known, throws `WalletCliExecutionError` with code `timeout`. `WalletCliSubmittedTransactionError` is thrown only when, with `wait: true`, a status query fails after the transaction was broadcast (including a status query that itself times out, in which case its `code` is `timeout`); it carries that `txId`. Plain `signTransaction()` never broadcasts, so it never throws this error.
:::

### Advanced Entry Points

| Import path | Contents |
| :--- | :--- |
| `@bankofai/agent-wallet` | `resolveWallet`, `resolveWalletProvider`, `ConfigWalletProvider`, `EnvWalletProvider`, `Network`, `WalletType`, `loadConfig` / `saveConfig`, types and errors |
| `@bankofai/agent-wallet/advanced` | Low-level adapters and clients (`EvmSigner`, `TronSigner`, `RawSecretSigner`, `PrivyAdapter`, `WalletCliAdapter`, `PrivyClient`, `WalletCliClient`), secret providers (`ExecSecretProvider`, `StaticSecretProvider`) |
| `@bankofai/agent-wallet/advanced` (continued) | Also `LocalSigner`, the config resolvers (`ExternalSignerConfigResolver`, `PrivyConfigResolver`, `WalletCliConfigResolver`), `resolveSecret` / `isSecretRef` / `DEFAULT_EXEC_TIMEOUT_MS` / `DEFAULT_SECRET_STDOUT_LIMIT` / `DEFAULT_SECRET_STDERR_LIMIT`, `defaultSecretProviderFactory`, and `parseWalletCliNetwork` / `assertTronWalletCliNetwork` |
| `@bankofai/agent-wallet/integrations/wallet-cli` | TRON-only helpers that use wallet-cli for build / broadcast / status: `signAndBroadcast`, `buildTransfer`, `broadcast`, `getTxStatus`, `getBalance`, `getTxInfo` |

---

## Next Steps

- Prefer the command line? → [CLI Reference](./CLI-Reference.md)
- Looking for ready-made code? → [SDK Cookbook](./SDK-Cookbook.md)
- Understand Agent-wallet's design → [Introduction](../Intro.md)
- Common questions → [FAQ](../FAQ.md)
