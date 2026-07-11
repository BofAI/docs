import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart for Sellers

> **Testnet First:** This guide uses the testnet by default. All operations use free test tokens — **no real funds are involved**. Once testing is complete, refer to the [Switch to Mainnet](#running-on-mainnet) section at the end of this guide.

## What You'll Build

After completing this guide, you'll have a **service that charges for API calls**:

- When a user or AI agent calls your API, the system automatically requires payment of a specified token
- Supports per-request billing, metered usage, dynamic pricing, and more
- Payment verification and blockchain settlement are fully automated — funds go directly to your wallet

The entire flow takes **4 steps**, estimated time: **15–20 minutes**.

:::info (TypeScript-only)
x402 is a **TypeScript-only** SDK published as granular `@bankofai/x402-*` packages. This guide shows how to build with the published npm packages.
:::

---

## Prerequisites

### Verify Your Environment

In your terminal (Terminal on macOS/Linux, or PowerShell/Command Prompt on Windows), run the following commands to confirm the required tools are installed:

```bash
node --version    # Requires Node.js 22 or higher
pnpm --version    # Requires pnpm 11.1 or higher
git --version     # Version control tool
```

If any command says "command not found", install it first:
- Node.js: go to [nodejs.org](https://nodejs.org/en/download) to download the installer (includes `npm`)
- pnpm: after installing Node.js, run `npm install -g pnpm`
- Git: go to [git-scm.com](https://git-scm.com/) to download

---

### Create a Payment Wallet

You need a blockchain wallet address to receive tokens from users. Follow the steps below based on your chosen network:

<Tabs>
<TabItem value="TRON" label="TRON (Recommended)">

**Create a TronLink Wallet (approx. 3 minutes):**

1. Install the [TronLink extension](https://www.tronlink.org/) in your browser (Chrome/Firefox supported), or download the TronLink app on your phone
2. Open the extension and click "Create Wallet"
3. Set a login password (used to unlock the wallet, stored locally only)
4. **Important:** The system will display a seed phrase (12 English words) — **write it down on paper** and keep it safe; this is the only way to recover your wallet
5. Verify the seed phrase as prompted to complete wallet creation
6. Copy your wallet address from the home screen (starts with the letter **`T`**, e.g. `TXyz1234...`)

**Claim Free Test Tokens (approx. 2 minutes):**

1. Go to the [Nile Testnet Faucet](https://nileex.io/join/getJoinPage)
2. Paste your TRON wallet address into the input field
3. Click to claim and wait about 1–2 minutes
4. Switch to "Nile Testnet" in TronLink, refresh, and confirm your TRX and USDT/USDD balance has arrived

> ✅ **Success:** Wallet shows test TRX and test USDT (or USDD) balance greater than 0

</TabItem>
<TabItem value="BSC" label="BSC">

**Create a MetaMask Wallet (approx. 3 minutes):**

1. Install the [MetaMask extension](https://metamask.io/) in your browser (Chrome/Firefox/Edge supported)
2. Open the extension and click "Create a new wallet"
3. Set a password, then **write down your seed phrase (12 English words) on paper and keep it safe**
4. Verify the seed phrase as prompted to complete creation
5. Copy your wallet address from the home screen (starts with **`0x`**, e.g. `0xAbc123...`)

**Claim Free Test Tokens (approx. 2 minutes):**

1. Go to the [BSC Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet)
2. Paste your wallet address and claim test BNB and test USDT
3. Switch to BSC Testnet in MetaMask and confirm the balance has arrived

> ✅ **Success:** Wallet shows test BNB and test USDT balance greater than 0

</TabItem>
</Tabs>

> ⚠️ **Wallet Security Reminder:**
> - Your seed phrase and private key are the "master key" to your wallet — **no one (including platform support) should ever ask you for them**
> - Write your seed phrase on paper and store it in a safe physical location — do not save it in your phone gallery or cloud storage
> - This tutorial uses a test wallet; it is recommended to create a dedicated new wallet for testing rather than using a wallet with real assets

---

### Configuration Reference

| Configuration | Description | How to Obtain |
|--------|------|----------|
| **TRON Wallet Address** | Wallet address starting with `T` (your payout address) | Copy from TronLink |
| **BSC Wallet Address** | Wallet address starting with `0x` (your payout address) | Copy from MetaMask |
| **Test TRX** | TRON testnet fee token | [Nile Faucet](https://nileex.io/join/getJoinPage) |
| **Test USDT/USDD (TRON)** | TRON test payment token (both USDT and USDD supported) | [Nile Faucet](https://nileex.io/join/getJoinPage) |
| **Test BNB** | BSC testnet fee token | [BSC Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet) |
| **Test USDT (BSC)** | BSC test payment token | [BSC Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet) |

**Testnet vs. Mainnet:**

- **Testnet**: Uses free test tokens, no real funds involved, suitable for development and debugging. Network identifiers: `tron:nile` / `eip155:97`
- **Mainnet**: Involves real payments, used when going live. Network identifiers: `tron:mainnet` / `eip155:56`

---

## Step 1: Install the SDK Packages

Install the Express adapter and TRON payment scheme in your TypeScript API project:

```bash
pnpm add express @bankofai/x402-core @bankofai/x402-express @bankofai/x402-tron
```

Use the framework package that matches your server (`@bankofai/x402-express`, `@bankofai/x402-hono`, `@bankofai/x402-fastify`, or `@bankofai/x402-next`). Use `npm install` or `yarn add` with the same package names if your project does not use pnpm.

If you want a more complete client → server → facilitator example, refer to the repository [examples](https://github.com/BofAI/x402/tree/main/examples/typescript). Application development should still depend on the published packages instead of linking the monorepo source.

---

## Step 2: Prepare Configuration Values

The minimal server needs only two values:

| Configuration | Description | Example |
|------|------|------|
| `HTTPFacilitatorClient.url` | Payment verification and settlement service URL | `https://facilitator.example.com` |
| `payTo` | Your TRON receiving address | `T...` |

> 💡 **Keyless server:** The resource server never signs or holds a private key — it only advertises your public receiving address (`payTo`). Signing and settlement happen on the client and facilitator side.

> ⚠️ **Security reminder:** Keep your private key only in a local env file or as an environment variable. **Never commit a file containing a private key to Git or share it with anyone.**

---

## Step 3: Create a Payment-Protected API Server

Here is a minimal Express resource server. `GET /credit` requires a `1 USDT` payment before it returns the credit payload.

```typescript
import express from "express";
import { createResourceServer } from "@bankofai/x402-core";
import { HTTPFacilitatorClient } from "@bankofai/x402-core/server";
import {
  x402HTTPResourceServer,
  paymentMiddlewareFromHTTPServer,
} from "@bankofai/x402-express";
import { ExactTronScheme } from "@bankofai/x402-tron/exact/server";

const server = createResourceServer(
  new HTTPFacilitatorClient({
    url: "https://facilitator.example.com",
  })
);

server.register("tron:nile", new ExactTronScheme());

express()
  .use(
    paymentMiddlewareFromHTTPServer(
      new x402HTTPResourceServer(server, {
        "GET /credit": {
          accepts: [
            {
              scheme: "exact",
              network: "tron:nile",
              payTo: "T...",
              price: "1 USDT",
            },
          ],
        },
      })
    )
  )
  .get("/credit", (_req, res) =>
    res.json({
      status: "success",
      credit: 1000000,
    })
  )
  .listen(4021);
```

**Key configuration parameters:**

| Parameter | Description | Example |
|------|------|--------|
| `payTo` | Your receiving wallet address | `T...` |
| `accepts[].price` | Price per request | `"1 USDT"` |
| `accepts[].network` | Network to use | Testnet: `tron:nile` |
| `accepts[].scheme` | Payment scheme | `"exact"` |
| `routes` | Map of `"METHOD /path"` → `{ accepts }` | `"GET /credit"` |

**How it works:** When an unpaid request reaches your API, the middleware automatically returns an HTTP `402 Payment Required` response with payment instructions. The client SDK pays automatically and re-sends the request — the process is nearly invisible to the end user.

---

## Step 4: Connect to a Facilitator

### What is a Facilitator?

A Facilitator is an **automated settlement service**: when someone pays your API, the Facilitator verifies the payment is genuine and settles it on-chain, ensuring funds reach your payout wallet. The server you built in Step 3 only points at a Facilitator through `HTTPFacilitatorClient` — it does not settle on its own.

**You must have a Facilitator reachable before starting your API server.**

### Two Options — Which Should You Choose?

| | Official Facilitator (Recommended) | Self-Hosted Facilitator |
|---|---|---|
| **Maintenance required** | No — officially hosted | Yes — you run it yourself |
| **Wallet private key required** | No | Yes (to settle on-chain) |
| **Difficulty** | Low (just apply for an API Key) | Medium (run the example facilitator) |
| **Best for** | Fast deployment, most users | Full control over fee strategy |

<Tabs>
<TabItem value="official" label="✅ Official Facilitator (Recommended)">

The officially hosted Facilitator service requires **no infrastructure to maintain**. See [Official Facilitator](../core-concepts/OfficialFacilitator.md) for the full step-by-step guide.

#### 4.1 Configure the Service Endpoint

Set the `url` in `HTTPFacilitatorClient` to the official endpoint:

```typescript
const server = createResourceServer(
  new HTTPFacilitatorClient({
    url: "https://facilitator.bankofai.io",
  })
);
```

This is the address your x402 server uses to verify and settle payments — **for API calls only**, no need to open it in a browser.

> ⚠️ **Without an API Key, this endpoint is rate-limited** (one `/settle` call per IP per minute). Suitable for testing only.

#### 4.2 Apply for an API Key

1. Open the [Admin Portal](https://admin-facilitator.bankofai.io) in your browser and sign in with your wallet
2. On the Dashboard, click **"Create API Key"**
3. Confirm, then click **View** in the Dashboard to see and copy your API Key

With an API Key, the rate limit increases to **1,000 requests/minute**, sufficient for production use.

#### 4.3 Wire the API Key into Your Server

The official key is sent as the `X-API-KEY` header on every facilitator call. Keep it in an environment variable or secret manager, and pass it with facilitator requests in production.

```bash
FACILITATOR_API_KEY=paste_your_api_key_here
```

> ⚠️ **Security reminder:** Your API Key is a service credential — **treat it like a password and never commit it to Git**.

> ✅ **Done!** The Official Facilitator is configured — **no local service to start**. Proceed directly to Step 5 to test.

</TabItem>
<TabItem value="selfhost" label="Self-Hosted Facilitator">

The self-hosted option gives you full control over fee strategy. It runs the example facilitator (`examples/typescript/facilitator/basic`), which exposes `/verify`, `/settle`, `/supported` over HTTP and dispatches by the payment's `network` field.

> ⚠️ **Security reminder — please read first:**
> - A self-hosted Facilitator uses your wallet to submit on-chain settlement transactions — **this wallet should be separate from your receiving wallet**
> - Only deposit a small amount of tokens into the Facilitator wallet (enough for fees); do not store large amounts
> - Keep the private key only in `.env-exact` — **never commit it to Git or share it with anyone**

#### 4.1 How the Self-Hosted Facilitator Works

The facilitator verifies signatures and settles on-chain. It registers the `exact` scheme per chain with a signer:

```typescript
// examples/typescript/facilitator/basic/src/index.ts (abridged)
import { x402Facilitator } from "@bankofai/x402-core/facilitator";

const facilitator = new x402Facilitator()
  .onBeforeSettle(async ctx => console.log("[settle] before", ctx.requirements.network))
  .onAfterSettle(async ctx => console.log("[settle] after", ctx.requirements.network))
  .onSettleFailure(async ctx => console.log("[settle] failure", ctx));

// Register each chain only if its wallet resolves (EVM-only, TRON-only, or both).
const evm = await registerEvm(facilitator);
const tron = await registerTron(facilitator);

// Exposes POST /verify, POST /settle, GET /supported on FACILITATOR_PORT.
app.listen(PORT, () => console.log(`🚀 Facilitator on http://localhost:${PORT}`));
```

Each chain module adapts the agent-wallet to a facilitator signer:

- **EVM** — `createFacilitatorEvmSigner(wallet, { network, rpcUrl })`, then `facilitator.register(network, new ExactEvmScheme(signer))`
- **TRON** — `createFacilitatorTronSigner(wallet, { network, apiKey })`, then `facilitator.register(network, new ExactTronScheme(signer))`

The signer factories build the viem client / TronWeb internally; the example **never reads a raw private key** — `AGENT_WALLET_PRIVATE_KEY` is consumed by `@bankofai/agent-wallet`.

#### 4.2 Start the Facilitator

`FACILITATOR_URL` in your `.env-exact` already defaults to `http://localhost:4022`, which matches the example facilitator. From `examples/typescript`, run:

```bash
pnpm dev:facilitator
```

**After a successful start, you should see output like:**

```
[evm] facilitator registered eip155:97 (0x…)
[tron] facilitator registered tron:nile (T…)
🚀 Facilitator on http://localhost:4022  (evm=true, tron=true)
```

> ✅ **Success:** Facilitator is running on port 4022 — **keep this terminal window open, do not close it**

</TabItem>
</Tabs>

---

## Step 5: Start and Test Your API

### 5.1 Start the API Server

Open a **new terminal window** (do not close the facilitator), and run your server entry point from your API project:

```bash
pnpm tsx src/server.ts
```

> ✅ **Success:** The process keeps running and the resource server listens on `http://localhost:4021`

### 5.2 Test Unpaid Access (Should Be Rejected)

In any terminal, run:

```bash
curl http://localhost:4021/credit
```

**Expected result:** The server returns an HTTP `402` response with the payment requirements (an `accepts` array listing scheme, network, price, and your payout address).

> ✅ **This is exactly what we want!** It confirms that payment protection is working — unpaid requests are successfully blocked.

### 5.3 Test the Full Payment Flow

To test the complete pay → receive content flow, use the minimal client in [Quickstart for Human Users](./quickstart-for-human.md). Point it at `http://localhost:4021/credit`; the expected response is:

```json
{ "status": "success", "credit": 1000000 }
```

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `Failed to fetch` / connection refused | Facilitator or server not running | Start the facilitator first, then run your API server entry point |
| Client `server offered no payment option matching "…"` | The client selected a network or token that the server does not advertise | Check the server's `accepts` (network + token), e.g. `tron:nile` + `USDT` |
| `ERR_PACKAGE_PATH_NOT_EXPORTED` under `npx tsx` | Project is not declared as ESM | Add `"type": "module"` to your `package.json` |
| `UnsupportedNetworkError` / `No mechanism registered` | The selected client network has no registered scheme | Ensure the client includes your target network, such as `tron:nile` |
| `Insufficient balance` / allowance error | Test wallet lacks test tokens, or Permit2 allowance too low | Claim test tokens from the faucet; the client auto-approves Permit2 on first payment |
| `Connection timeout` | Network or request timeout | Check your connection, or set a reliable `EVM_RPC_URL` (e.g. `https://bsc-testnet-rpc.publicnode.com`) |

---

## Running on Mainnet

After fully validating on the testnet, only a few steps are needed to go live and accept real payments:

### 1. Point the Client and Server at Mainnet

Switch the server registration and receiving address to mainnet:

```typescript
server.register("tron:mainnet", new ExactTronScheme());

// In accepts, update:
network: "tron:mainnet",
payTo: "TYourMainnetTronAddress",
price: "1 USDT",
```

### 2. Set a Reliable EVM RPC

BSC mainnet needs a stable endpoint. Set this for both the client and facilitator:

```bash
EVM_RPC_URL=https://bsc-rpc.publicnode.com
```

### 3. (Self-Hosted) Switch the Facilitator to Mainnet

The facilitator's `TRON_NETWORKS` already includes `tron:mainnet`, and `EVM_NETWORKS` includes `eip155:56`. Fund the Facilitator wallet with real TRX/BNB to cover settlement gas, then restart:

```bash
pnpm dev:facilitator
```

> For production TRON workloads, set your own `TRON_GRID_API_KEY` to avoid rate limiting.

### 4. (Official Facilitator) No Local Change Needed

If you use the official facilitator, keep `HTTPFacilitatorClient`'s `url` as `https://facilitator.bankofai.io` and continue using your `FACILITATOR_API_KEY`. Only your server's payout addresses move to mainnet.

### 5. Confirm and Do a Small Real Test

> ⚠️ **Mainnet warning — real funds are involved. Please follow these steps carefully:**
>
> 1. Ensure all functionality (payment, receipt, error handling) has been fully validated on the testnet
> 2. After going live on mainnet, **start with one minimum-amount real test (e.g. `0.001 USDT`)**
> 3. Confirm the transaction succeeded on the blockchain explorer ([TronScan](https://tronscan.org) or [BscScan](https://bscscan.com))
> 4. Open your receiving wallet and confirm the funds have arrived
> 5. Only open your API to the public after confirming everything is correct

---

## Next Steps

- If you want a more complete example, refer to the repository [examples](https://github.com/BofAI/x402/tree/main/examples/typescript), which include the client → server → facilitator loop plus the `gasfree`, `upto`, and `batch-settlement` scenarios
- Read the [core concepts](../core-concepts/http-402.md) to understand how the x402 protocol works
- Want detailed configuration for both Facilitator options? See the [Facilitator documentation](../core-concepts/facilitator.md)
- Experience calling a paid API from the [user perspective](./quickstart-for-human.md), or configure an [AI agent](./quickstart-for-agent.md) to call your service automatically

---

## Summary

Congratulations 🎉! You've completed the Seller Quickstart. Here's everything you accomplished:

| Step | What You Did |
|------|----------|
| **Prerequisites** | Created a receiving wallet, obtained test tokens, reviewed configuration parameters |
| **Step 1** | Installed the x402 SDK packages |
| **Step 2** | Prepared the facilitator URL and receiving address |
| **Step 3** | Ran a keyless Express resource server with payment protection |
| **Step 4** | Connected to a Facilitator (official or self-hosted) for settlement |
| **Step 5** | Verified payment protection and the full client → server → facilitator payment flow |

Your API is now ready to accept blockchain payments via the x402 protocol!
