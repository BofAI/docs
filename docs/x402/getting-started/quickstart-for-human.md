import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart for Human Users

## Who Is This Guide For?

This guide is for developers who want to **call an x402-protected API from code** and have payments handled automatically. When you're done, you'll have a working TypeScript script that detects a 402 response, pays for access, and retrieves the protected content — all without manual steps.

> **Testnet first:** This guide uses testnet by default. You can safely follow every step without spending real money.

:::info (TypeScript-only)
x402 is a **TypeScript-only** SDK published as granular `@bankofai/x402-*` packages. This guide shows how to integrate the published npm packages directly.
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

- [ ] **Node.js 22+** and **pnpm 11.1+** installed
- [ ] A dedicated **test wallet** created (see below)
- [ ] Test tokens claimed (free)
- [ ] A target x402-protected API URL, such as the `/credit` endpoint from [Quickstart for Sellers](./quickstart-for-sellers.md)

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

## Step One: Install the SDK Packages

Install the published npm packages in your TypeScript application:

```bash
pnpm add @bankofai/agent-wallet @bankofai/x402-fetch @bankofai/x402-tron
pnpm add -D tsx   # to run the TypeScript entry point below
```

Use `npm install` or `yarn add` with the same package names if your project does not use pnpm.

:::info Wallet Management
x402 uses [Agent Wallet](../../Agent-Wallet/QuickStart.md) to resolve and manage wallet credentials. Agent Wallet is installed with the package set above. Private key resolution priority:
1. Encrypted wallet file (imported via the Agent Wallet CLI)
2. Environment variable `AGENT_WALLET_PRIVATE_KEY`

This guide uses the environment variable method.
:::

---

## Step Two: Configure Your Private Key

**Never put your private key in code.** Set it as an environment variable so it stays out of your source files:

```bash
export AGENT_WALLET_PRIVATE_KEY=your_private_key_here
```

> 💡 **Tip:** This quickstart pays on `TRON_NILE` (`tron:0xcd8690dc`). The client chooses the payment option where `network === TRON_NILE` from the server's `accepts` list.

For production TRON workloads, use a TronGrid API Key for better RPC reliability. The SDK never reads environment variables, so pass it explicitly to the signer:

```bash
export TRON_GRID_API_KEY="your_trongrid_api_key_here"
```

```typescript
const signer = await createClientTronSigner(wallet, {
  network: TRON_NILE,
  apiKey: process.env.TRON_GRID_API_KEY,
});
```

Without `apiKey`, the signer stays on the key-less public endpoint.

> ⚠️ **Security reminder:** Keep your private key only in an environment variable or a secure secret manager. **Never commit files containing private keys to Git or share them with anyone.**

---

## Step Three: Write and Run the Client Code

The client wraps `fetch` so HTTP `402 Payment Required` challenges are paid automatically. Here is a minimal TRON client:

```typescript
import { resolveWallet, type Wallet, type Eip712Capable } from "@bankofai/agent-wallet";
import { x402Client, wrapFetchWithPayment } from "@bankofai/x402-fetch";
import { createClientTronSigner, TRON_NILE } from "@bankofai/x402-tron";
import { ExactTronScheme } from "@bankofai/x402-tron/exact/client";

// resolveWallet is typed as the base Wallet, which does not declare
// signTypedData — but for tron it returns a TronSigner, which implements both
// Wallet and Eip712Capable. Combine the SDK's own types so the wallet
// satisfies what createClientTronSigner expects.
type SignerWallet = Wallet & Eip712Capable;

const wallet = (await resolveWallet({
  network: TRON_NILE,
})) as SignerWallet;

const signer = await createClientTronSigner(wallet, {
  network: TRON_NILE,
});

const client = new x402Client((_version, accepts) =>
  accepts.find((a) => a.network === TRON_NILE)!
);

client.register(TRON_NILE, new ExactTronScheme(signer));

const fetchWithPay = wrapFetchWithPayment(fetch, client);

const res = await fetchWithPay("http://localhost:4021/credit");

console.log(await res.json());
```

### Run the client

First, make sure a resource server + facilitator are running (see [Quickstart for Sellers](./quickstart-for-sellers.md)), then run your client app with the same environment variables:

```bash
pnpm tsx src/index.ts   # or your app's dev script
```

**Expected output:**

```
{ "status": "success", "credit": 1000000 }
```

> ✅ **Success:** The SDK detected the `402` and signed a payment; the resource server then had the facilitator settle it on-chain and returned the protected content.

> 💡 To pay with another network or token, adjust the `accepts.find(...)` selector and register the matching network scheme.

:::caution Default spend controls cap each payment at $1
Since SDK 1.1.0 the client refuses any payment above `$1` and any asset outside the default-asset registry, before your selector ever runs. This quickstart works because the seller guide prices the route at exactly `1 USDT`. For anything larger, raise the cap:

```typescript
client.setSpendControls({ maxAmountPerPayment: "$5" });
```

See [SDK Feature Matrix](../sdk-features.md) for the full options, including `allowedAssets`.
:::

---

## Step Four: Error Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `WalletNotFoundError` / no wallet resolved | agent-wallet has no wallet, or `AGENT_WALLET_PRIVATE_KEY` is not set in this shell | Run `agent-wallet start`, or run the `export` in **the same terminal window** as the script |
| `WalletNotFoundError: No active wallet set` | agent-wallet has no wallet configured | Run `agent-wallet start` and follow the prompts to import your private key |
| `Insufficient balance` / balance error | Test wallet doesn't have enough USDT/USDD | Go back to Prerequisites and claim test tokens from the faucet |
| `No network/scheme registered for x402 version: 2 …` | No scheme is registered for any network the server advertises — this is raised before your selector runs | Check that the server's `accepts` includes `network: TRON_NILE` and that you called `client.register(TRON_NILE, …)` |
| `permit2_allowance_required` | The Permit2 allowance is missing or too low | On TRON the SDK auto-broadcasts the one-time `approve` on first payment; if it persists, check that the wallet holds enough TRX for that approve |
| `approval_reset_required` (TRON) | The token already has a non-zero but insufficient Permit2 allowance, and the default `zero-first` strategy will not overwrite it | Set the token's Permit2 allowance back to `0`, then retry — the SDK never inserts an implicit `approve(0)` |
| `approval_asset_unsupported` (TRON) | The token is not a known Permit2 asset and no approval strategy was configured for it | Configure it with `createTrc20ApprovalPolicy`, or pay with a supported token |
| `Connection timeout` | Network or request timeout | Check the API service, facilitator, and TRON RPC connection |
| `ERR_PACKAGE_PATH_NOT_EXPORTED` | Project is not declared as ESM | Add `"type": "module"` to your `package.json` |

If you need finer-grained error handling in your code:

```typescript
try {
  const res = await fetchWithPay("http://localhost:4021/credit");
  if (res.status === 200) {
    console.log("Success:", await res.json());
  } else {
    console.error(`Request failed: ${res.status}`);
    console.error(await res.text());
  }
} catch (error) {
  if (error instanceof Error && error.message.includes("no payment option")) {
    console.error("No matching payment option — check TRON_NILE vs the server's accepts");
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

- [x402 npm packages](https://www.npmjs.com/package/@bankofai/x402-tron) — published packages for application development
- [Fetch client example](https://github.com/BofAI/x402/tree/main/examples/typescript/clients/fetch) — if you want a more complete client example, refer to the examples
- [Agent Wallet](https://github.com/BofAI/agent-wallet) — key custody used by the SDK
