import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart for Human Users

## Who Is This Guide For?

This guide is for developers who want to **call an x402-protected API from code** and have payments handled automatically. When you're done, you'll have a working TypeScript script that detects a 402 response, pays for access, and retrieves the protected content — all without manual steps.

> **Testnet first:** This guide uses testnet by default. You can safely follow every step without spending real money.

:::info SDK 1.0.0 (TypeScript-only)
x402 `1.0.0` is a **TypeScript-only** SDK published as granular `@bankofai/x402-*` packages. This guide uses the runnable fetch client in the [`x402` repository](https://github.com/BofAI/x402) (`examples/typescript/clients/fetch`), which links the in-repo SDK packages and runs from source.
:::

---

## Prerequisites

### First: Private Key Security

> 🔴 **Private key security warning — please read before you begin:**
>
> - Your **private key** is the sole credential that controls your wallet. Anyone who has it can access your funds completely.
> - This guide requires you to configure a private key. Follow these rules strictly:
>   1. **Never** write your private key directly in code files
>   2. **Never** commit a file containing a private key to Git or push it to GitHub
>   3. **Never** send your private key via messaging apps, email, or chat
>   4. Store it only in a local `.env` file or as a system environment variable
>   5. For testing, create a **dedicated test wallet** holding only a small amount of test tokens — never use a wallet holding real assets

### Checklist Before You Start

- [ ] **Node.js 20+** and **pnpm 11+** installed
- [ ] A dedicated **test wallet** created (see below)
- [ ] Test tokens claimed (free)
- [ ] A target x402-protected API URL (or run the example server)

### Create a Test Wallet and Get Test Tokens

<Tabs>
<TabItem value="TRON" label="TRON">

**Create a test wallet:**

1. Install the [TronLink browser extension](https://www.tronlink.org/) or mobile app
2. Click "Create Wallet", set a password, and **write down your seed phrase on paper and store it safely**
3. After creation, copy your wallet address (starts with `T`)

**Claim free test tokens:**

1. Go to the [Nile Testnet Faucet](https://nileex.io/join/getJoinPage)
2. Paste your TRON test wallet address and claim test TRX and USDT/USDD
3. In TronLink, switch to the "Nile Testnet" and confirm the balance

**Export your private key:**

1. In TronLink, go to Settings → Account Management → Export Private Key
2. Enter your password to confirm
3. Copy the 64-character hex string — you'll need it in the next step

> ✅ **Success check:** You have a TRON test wallet address, its private key, and test TRX and USDT (or USDD) in the balance

</TabItem>
<TabItem value="BSC" label="BSC">

**Create a test wallet:**

1. Install the [MetaMask browser extension](https://metamask.io/)
2. Click "Create a new wallet", set a password, and **write down your seed phrase on paper and store it safely**
3. After creation, copy your wallet address (starts with `0x`)

**Claim free test tokens:**

1. Go to the [BSC Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet)
2. Paste your BSC test wallet address and claim test BNB and USDT
3. In MetaMask, switch to the BSC Testnet and confirm the balance

**Export your private key:**

1. In MetaMask, click Account Details → Export Private Key
2. Enter your MetaMask password to confirm
3. Copy the 64-character hex string — you'll need it in the next step

> ✅ **Success check:** You have a BSC test wallet address, its private key, and test BNB and USDT in the balance

</TabItem>
</Tabs>

---

## Step One: Get the SDK and Examples

The examples workspace links the in-repo `@bankofai/x402-*` packages and runs from source:

```bash
git clone https://github.com/BofAI/x402.git
cd x402/typescript            # the pnpm/turbo monorepo root

# Install + link all workspace packages (SDK + examples)
pnpm install

# Build the @bankofai/x402-* dist the examples import from
pnpm build

cd examples/typescript
```

The fetch client depends on `@bankofai/x402-fetch`, `@bankofai/x402-evm`, `@bankofai/x402-tron`, and `@bankofai/agent-wallet` — all linked automatically by `pnpm install`.

:::info Wallet Management
x402 uses [Agent Wallet](../../Agent-Wallet/QuickStart.md) to resolve and manage wallet credentials. Agent Wallet is installed as a dependency of the examples. Private key resolution priority:
1. Encrypted wallet file (imported via the Agent Wallet CLI)
2. Environment variable `AGENT_WALLET_PRIVATE_KEY`

This guide uses the environment variable method.
:::

---

## Step Two: Configure Your Private Key

**Never put your private key in code.** Store it as an environment variable so it stays out of your source files. Copy the env template and fill in your key:

```bash
cp .env-exact.example .env-exact
```

Open `.env-exact` and set the payer variables:

```bash
# ── SHARED · client (you are the payer) ──────────────────────────────────
AGENT_WALLET_PRIVATE_KEY=your_private_key_here

# TronGrid API key — optional on testnet, recommended for production TRON.
TRON_GRID_API_KEY=

# ── CLIENT · which chains/tokens to pay ──────────────────────────────────
# <network>[@<token>]  e.g. tron:nile@USDT or eip155:97@DHLU
PAY_TARGETS=tron:nile@USDT

# The x402-protected API you want to call.
RESOURCE_URL=http://localhost:4021/weather
```

> 💡 **Tip:** `PAY_TARGETS` controls which chain/token the client pays with, one payment per entry, in order. Omit the token to use that network's first advertised token. Use `@` (not `#`) — dotenv treats `#` as a comment.

<Tabs>
<TabItem value="TRON" label="TRON">

**Optional:** For production TRON workloads, configure a TronGrid API Key for better RPC reliability:

```bash
TRON_GRID_API_KEY="your_trongrid_api_key_here"
```

:::note
When `TRON_GRID_API_KEY` is not set, requests may be rate-limited under heavy workloads. For production, set your own `TRON_GRID_API_KEY` to ensure reliability.
:::

</TabItem>
<TabItem value="BSC" label="BSC">

For BSC testnet, the default viem RPC endpoint is frequently unreachable. Set a reliable RPC:

```bash
EVM_RPC_URL=https://bsc-testnet-rpc.publicnode.com
```

</TabItem>
</Tabs>

> ⚠️ **Security reminder:** Keep your private key only in `.env-exact` (gitignored) or as an environment variable. **Never commit files containing private keys to Git or share them with anyone.**

---

## Step Three: Write and Run the Client Code

The example fetch client wraps `fetch` so HTTP `402 Payment Required` challenges are paid automatically. Here is the entry point (`examples/typescript/clients/fetch/src/index.ts`), abridged to the essentials:

```typescript
import { x402Client, wrapFetchWithPayment } from "@bankofai/x402-fetch";

import { registerEvm } from "./chains/evm.js";
import { registerTron } from "./chains/tron.js";

const RESOURCE_URL = process.env.RESOURCE_URL || "http://localhost:4021/weather";

// The selector is the payment-selection policy: pick which advertised option to pay.
// PAY_TARGETS drives this in the full example; here we accept the first option.
let target: { prefix: string; asset?: string } | null = null;
const client = new x402Client((_x402Version, accepts) => {
  const t = target;
  if (!t) return accepts[0]!;
  const match = accepts.find(
    (a) =>
      a.network.startsWith(t.prefix) &&
      (!t.asset || a.asset.toLowerCase() === t.asset.toLowerCase()),
  );
  if (!match) throw new Error(`server offered no payment option matching "${t.prefix}"`);
  return match;
});

// Register each chain only if its wallet resolves (EVM-only, TRON-only, or both).
const evm = await registerEvm(client);
const tron = await registerTron(client);

const fetchWithPay = wrapFetchWithPayment(fetch, client);

// Pay the resource once per target, in order.
const targets = [{ prefix: "tron:", asset: undefined }]; // simplified
for (const t of targets) {
  target = t;
  console.log(`\n→ GET ${RESOURCE_URL}`);
  const res = await fetchWithPay(RESOURCE_URL);
  console.log(`← ${res.status} ${res.statusText}`);
  console.log(JSON.stringify(await res.json(), null, 2));
}
```

### How each chain is registered

Each chain lives in its own module under `src/chains/`. A chain registers only if its agent-wallet resolves — so you can pay from EVM-only, TRON-only, or both.

<Tabs>
<TabItem value="tron" label="TRON">

```typescript
// src/chains/tron.ts
import { createClientTronSigner } from "@bankofai/x402-tron";
import { ExactTronScheme } from "@bankofai/x402-tron/exact/client";
import type { x402Client } from "@bankofai/x402-fetch";
import { tryResolveWallet } from "../env.js";

export async function registerTron(client: x402Client): Promise<boolean> {
  const wallet = await tryResolveWallet("tron");
  if (!wallet) return false;

  for (const network of ["tron:nile", "tron:mainnet"] as const) {
    // The factory builds TronWeb internally and auto-broadcasts the one-time
    // Permit2 approve that USDT/USDD need before their first payment.
    const signer = await createClientTronSigner(wallet, {
      network,
      apiKey: process.env.TRON_GRID_API_KEY,
    });
    client.register(network, new ExactTronScheme(signer));
  }
  return true;
}
```

</TabItem>
<TabItem value="bsc" label="BSC">

```typescript
// src/chains/evm.ts
import { createClientEvmSigner } from "@bankofai/x402-evm/adapters/agent-wallet";
import { ExactEvmScheme } from "@bankofai/x402-evm/exact/client";
import type { x402Client } from "@bankofai/x402-fetch";
import { tryResolveWallet } from "../env.js";

export async function registerEvm(client: x402Client): Promise<boolean> {
  const wallet = await tryResolveWallet("evm");
  if (!wallet) return false;

  for (const network of ["eip155:97", "eip155:56"] as const) {
    // The factory builds the viem client internally; ERC-3009 tokens (e.g. DHLU)
    // sign offline and need no RPC, while permit2 tokens read the chain.
    const signer = await createClientEvmSigner(wallet, {
      network,
      rpcUrl: process.env.EVM_RPC_URL?.trim() || undefined,
    });
    client.register(network, new ExactEvmScheme(signer));
  }
  return true;
}
```

</TabItem>
</Tabs>

### Run the client

First, make sure a resource server + facilitator are running (see [Quickstart for Sellers](./quickstart-for-sellers.md)), then from `examples/typescript`:

```bash
pnpm dev:client
```

**Expected output:**

```
→ [tron:nile@USDT] GET http://localhost:4021/weather
← 200 OK
{ "report": { "weather": "sunny", "temperature": 70 } }
```

> ✅ **Success:** The SDK detected the `402`, signed a payment, settled on-chain, and returned the protected content.

> 💡 To pay a BSC token instead, set `PAY_TARGETS=eip155:97@DHLU` (ERC-3009, gasless) or `eip155:97@USDC` (permit2, one-time `approve`).

---

## Step Four: Error Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `No wallet configured for EVM or TRON` | `AGENT_WALLET_PRIVATE_KEY` is not set or empty | Set it in `.env-exact` and re-run; run the `export` command in **the same terminal window** where you run the script |
| `WalletNotFoundError: No active wallet set` | agent-wallet has no wallet configured | Run `agent-wallet start` and follow the prompts to import your private key |
| `Insufficient balance` / balance error | Test wallet doesn't have enough USDT/USDD | Go back to Prerequisites and claim test tokens from the faucet |
| `server offered no payment option matching "…"` | `PAY_TARGETS` doesn't match what the server advertises | Check the server's `accepts` (network + token) and align `PAY_TARGETS`, e.g. `tron:nile@USDT` or `eip155:97@DHLU` |
| `InsufficientAllowanceError` / allowance error | Token allowance too low | The SDK auto-broadcasts the one-time Permit2 `approve` on first payment; if it persists, check your wallet balance |
| `Connection timeout` | Network or request timeout | Check your connection; for BSC set a reliable `EVM_RPC_URL=https://bsc-testnet-rpc.publicnode.com` |
| `ERR_PACKAGE_PATH_NOT_EXPORTED` | Project is not declared as ESM | Add `"type": "module"` to your `package.json` |

If you need finer-grained error handling in your code:

```typescript
try {
  const res = await fetchWithPay(RESOURCE_URL);
  if (res.status === 200) {
    console.log("Success:", await res.json());
  } else {
    console.error(`Request failed: ${res.status}`);
    console.error(await res.text());
  }
} catch (error) {
  if (error instanceof Error && error.message.includes("no payment option")) {
    console.error("No matching payment option — check PAY_TARGETS vs the server's accepts");
  } else if (error instanceof Error && error.message.includes("allowance")) {
    console.error("Insufficient token allowance — check wallet balance");
  } else {
    console.error("Payment error:", error);
  }
}
```

---

## Summary

Through this guide you:

- **Created a test wallet** and claimed test tokens, understanding why private key security matters
- **Installed the SDK** and configured your private key as an environment variable (not in code)
- **Wrote and ran** automated payment client code
- **Understood the full flow**: SDK detects 402 → signs authorization → pays → retrieves content

---

## Next Steps

- Read [Core Concepts](../core-concepts/http-402.md) to understand the x402 protocol in depth
- See [Network and Token Support](../core-concepts/network-and-token-support.md) for supported tokens and networks
- Want to build your own paid API? See [Quickstart for Sellers](./quickstart-for-sellers.md)

---

## References

- [x402 repository](https://github.com/BofAI/x402) — SDK source and runnable examples (`examples/typescript/`)
- [Fetch client example](https://github.com/BofAI/x402/tree/main/examples/typescript/clients/fetch) — the client this guide is based on
- [Agent Wallet](https://github.com/BofAI/agent-wallet) — key custody used by the SDK
