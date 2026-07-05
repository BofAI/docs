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

:::info SDK 1.0.0 (TypeScript-only)
x402 `1.0.0` is a **TypeScript-only** pnpm/turbo monorepo published as granular `@bankofai/x402-*` packages. The previous Python SDK lives under `legacy/` for reference. This guide uses the runnable examples in the [`x402` repository](https://github.com/BofAI/x402) (`examples/typescript/`), which link the in-repo SDK packages and run from source.
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

## Step 1: Get the SDK and Examples

The examples workspace links the in-repo `@bankofai/x402-*` packages and builds from source, so you get the latest SDK without publishing to a registry.

```bash
git clone https://github.com/BofAI/x402.git
cd x402/typescript            # the pnpm/turbo monorepo root (SDK packages)

# Install + link the SDK packages, then build their dist
pnpm install
pnpm build

# Examples live in a separate workspace at the repo root
cd ../examples/typescript
pnpm install                  # links the in-repo SDK packages + example deps
```

Verify the install by starting the example resource server (it will print a port and the chains it accepts):

```bash
pnpm dev:server
```

> ✅ **Success:** The server boots and prints a startup line. With no payout address set yet it exits with `❌ No payout address configured (set EVM_ADDRESS and/or TRON_ADDRESS)` — that's expected and confirms the toolchain works. You'll set those in Step 2.

---

## Step 2: Configure Your Environment

All three processes in the main line (facilitator, server, client) share one file: `.env-exact`. Copy the template and fill it in:

```bash
cp .env-exact.example .env-exact
```

Open `.env-exact` in your editor and set the wallet + payout variables:

```bash
# ── SHARED · client + facilitator (the same key pays and settles here) ────
AGENT_WALLET_PRIVATE_KEY=0x...   # your test wallet private key

# TronGrid API key — both client and facilitator touch TRON. Optional on testnet.
TRON_GRID_API_KEY=

# ── SERVER · the resource provider (this is what YOU configure) ───────────
EVM_ADDRESS=0x...   # your BSC payout address (eip155:97)
TRON_ADDRESS=T...    # your TRON payout address (tron:nile)

# Where the server binds, and where it reaches the facilitator.
SERVER_PORT=4021
FACILITATOR_URL=http://localhost:4022

# ── FACILITATOR · settlement ─────────────────────────────────────────────
FACILITATOR_PORT=4022
```

> 💡 **Keyless server:** The resource server never signs or holds a key — it only advertises your public payout address (`EVM_ADDRESS` / `TRON_ADDRESS`). Signing and settlement happen at the client and facilitator. `AGENT_WALLET_PRIVATE_KEY` is used by the client (to pay) and the facilitator (to settle), not by the server.

> ⚠️ **Security reminder:** Keep your private key only in `.env` (which is gitignored) or as an environment variable. **Never commit a file containing a private key to Git or share it with anyone.**

---

## Step 3: Create a Payment-Protected API Server

The example resource server is an Express app that protects `GET /weather` behind x402 payment. It is **chain-agnostic** — each chain's tokens and `accepts` entries live in `src/chains/{evm,tron}.ts`, and a chain is advertised only when its `*_ADDRESS` is set.

Here is the server entry point (`examples/typescript/servers/express/src/index.ts`):

```typescript
import express from "express";
import { HTTPFacilitatorClient } from "@bankofai/x402-core/server";
import { createResourceServer } from "@bankofai/x402-core";
import {
  x402HTTPResourceServer,
  paymentMiddlewareFromHTTPServer,
} from "@bankofai/x402-express";

import { hasEvm, registerEvm, evmAccepts, evmExtensions } from "./chains/evm.js";
import { hasTron, registerTron, tronAccepts } from "./chains/tron.js";

const PORT = parseInt(process.env.SERVER_PORT || "4021", 10);
const FACILITATOR_URL = process.env.FACILITATOR_URL || "http://localhost:4022";

// The server delegates verify/settle to a facilitator over HTTP.
const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
// Logging pre-attached: verify/settle results print via the SDK logger.
const resourceServer = createResourceServer(facilitatorClient);

// Register each chain (and advertise its tokens) only when its payout is set.
type Accept = ReturnType<typeof evmAccepts>[number] | ReturnType<typeof tronAccepts>[number];
const accepts: Accept[] = [];
let extensions: Record<string, unknown> = {};
if (hasEvm()) {
  registerEvm(resourceServer);
  accepts.push(...evmAccepts());
  extensions = { ...extensions, ...evmExtensions() };
}
if (hasTron()) {
  registerTron(resourceServer);
  accepts.push(...tronAccepts());
}

// The route you protect — `accepts` is the price list, `extensions` carries
// the gas-sponsoring hint for plain-ERC20 (permit2) tokens like BSC USDC.
const routes = {
  "GET /weather": {
    accepts,
    extensions,
    description: "Current weather (paid)",
    mimeType: "application/json",
  },
};

const httpServer = new x402HTTPResourceServer(resourceServer, routes);

const app = express();
app.use(paymentMiddlewareFromHTTPServer(httpServer));

app.get("/weather", (_req, res) => {
  res.json({ report: { weather: "sunny", temperature: 70 } });
});

app.listen(PORT, () => {
  console.log(`🌤️  Resource server on http://localhost:${PORT}`);
});
```

### How pricing works per chain

Each chain module builds the `accepts` entries (price + `payTo` + token). The two chain families price differently:

- **TRON** uses a `"<amount> <symbol>"` string, so the scheme resolves each token from its registry:
  ```typescript
  // src/chains/tron.ts — USDT and USDD on tron:nile
  export function tronAccepts() {
    const payTo = process.env.TRON_ADDRESS as string;
    return ["tron:nile", "tron:mainnet"].flatMap((network) =>
      ["0.001 USDT", "0.001 USDD"].map((price) => ({ scheme: "exact", network, payTo, price })),
    );
  }
  ```
- **EVM** advertises explicit `{ amount, asset, extra }` objects, because BSC has no default-token registry entry. ERC-3009 tokens (e.g. DHLU) carry their domain `name`/`version`; plain ERC-20 tokens (e.g. USDC/USDT) set `extra.assetTransferMethod: "permit2"` and need a one-time Permit2 `approve`:
  ```typescript
  // src/chains/evm.ts
  const EVM_TOKENS = {
    "eip155:97": [
      { asset: "0x375cADdd…B816", amount: "1000", extra: { name: "DA HULU", version: "1" } },       // DHLU, ERC-3009
      { asset: "0x64544969…8930", amount: "1000000000000000", extra: { assetTransferMethod: "permit2" } }, // USDC
      { asset: "0x337610d2…4dDd", amount: "1000000000000000", extra: { assetTransferMethod: "permit2" } }, // USDT
    ],
  };
  ```

**Key configuration parameters:**

| Parameter | Description | Example |
|------|------|--------|
| `EVM_ADDRESS` / `TRON_ADDRESS` | Your receiving (payout) wallet address | `0xAbc…` / `TXyz…` |
| `accepts[].price` | Price per request (token amount, or `"<amount> <symbol>"`) | `"0.001 USDT"` |
| `accepts[].network` | Network to use | Testnet: `tron:nile` / `eip155:97` |
| `accepts[].scheme` | Payment scheme | `"exact"` |
| `routes` | Map of `"METHOD /path"` → `{ accepts, extensions, description, mimeType }` | `"GET /weather"` |

**How it works:** When an unpaid request reaches your API, the middleware automatically returns an HTTP `402 Payment Required` response with payment instructions. The client SDK pays automatically and re-sends the request — the process is nearly invisible to the end user.

---

## Step 4: Connect to a Facilitator

### What is a Facilitator?

A Facilitator is an **automated settlement service**: when someone pays your API, the Facilitator verifies the payment is genuine and settles it on-chain, ensuring funds reach your payout wallet. The server you built in Step 3 only points at a Facilitator via `FACILITATOR_URL` — it does not settle on its own.

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

Set `FACILITATOR_URL` in your `.env-exact` to the official endpoint:

```
FACILITATOR_URL=https://facilitator.bankofai.io
```

This is the address your x402 server uses to verify and settle payments — **for API calls only**, no need to open it in a browser.

> ⚠️ **Without an API Key, this endpoint is rate-limited** (one `/settle` call per IP per minute). Suitable for testing only.

#### 4.2 Apply for an API Key

1. Open the [Admin Portal](https://admin-facilitator.bankofai.io) in your browser and sign in with your wallet
2. On the Dashboard, click **"Create API Key"**
3. Confirm, then click **View** in the Dashboard to see and copy your API Key

With an API Key, the rate limit increases to **1,000 requests/minute**, sufficient for production use.

#### 4.3 Wire the API Key into Your Server

The official key is sent as the `X-API-KEY` header on every facilitator call. The example server already supports it via `FACILITATOR_API_KEY`:

```bash
# Append to .env-exact
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

Open a **new terminal window** (do not close the facilitator), and from `examples/typescript` run:

```bash
pnpm dev:server
```

**After a successful start, you should see:**

```
🌤️  Resource server on http://localhost:4021  (evm=true, tron=true) → facilitator http://localhost:4022
```

> ✅ **Success:** Terminal shows the resource server on `http://localhost:4021`

### 5.2 Test Unpaid Access (Should Be Rejected)

In any terminal, run:

```bash
curl http://localhost:4021/weather
```

**Expected result:** The server returns an HTTP `402` response with the payment requirements (an `accepts` array listing scheme, network, price, and your payout address).

> ✅ **This is exactly what we want!** It confirms that payment protection is working — unpaid requests are successfully blocked.

### 5.3 Test the Full Payment Flow

To test the complete pay → receive content flow, start the example client in a **third terminal**. From `examples/typescript`, first set which chain/token to pay:

```bash
# Append to .env-exact (or export in the client terminal)
PAY_TARGETS=tron:nile@USDT        # TRON Nile USDT; or eip155:97@DHLU for BSC
RESOURCE_URL=http://localhost:4021/weather
```

Then run:

```bash
pnpm dev:client
```

**Expected output:**

```
→ [tron:nile@USDT] GET http://localhost:4021/weather
← 200 OK
{ "report": { "weather": "sunny", "temperature": 70 } }
```

> ✅ **Success:** The client automatically detected the `402`, signed a payment, settled on-chain via the facilitator, and received the protected content.

> 💡 The client wraps `fetch` with `wrapFetchWithPayment(fetch, client)` so 402 challenges are paid automatically — see [Quickstart for Human Users](./quickstart-for-human.md) for the client-side walkthrough.

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `No payout address configured` | Neither `EVM_ADDRESS` nor `TRON_ADDRESS` is set | Set at least one in `.env-exact` and restart the server |
| `Failed to fetch` / connection refused | Facilitator or server not running | Start the facilitator first (`pnpm dev:facilitator`), then the server (`pnpm dev:server`) |
| Client `server offered no payment option matching "…"` | `PAY_TARGETS` doesn't match an advertised option | Check the server's `accepts` (network + token) and align `PAY_TARGETS`, e.g. `tron:nile@USDT` or `eip155:97@DHLU` |
| `ERR_PACKAGE_PATH_NOT_EXPORTED` under `npx tsx` | Project is not declared as ESM | Add `"type": "module"` to your `package.json` |
| `UnsupportedNetworkError` / `No mechanism registered` | The network in `PAY_TARGETS` has no registered scheme | Ensure the client's `EVM_NETWORKS`/`TRON_NETWORKS` includes your target, and the wallet for that chain resolved |
| `Insufficient balance` / allowance error | Test wallet lacks test tokens, or Permit2 allowance too low | Claim test tokens from the faucet; the client auto-approves Permit2 on first payment |
| `Connection timeout` | Network or request timeout | Check your connection, or set a reliable `EVM_RPC_URL` (e.g. `https://bsc-testnet-rpc.publicnode.com`) |

---

## Running on Mainnet

After fully validating on the testnet, only a few steps are needed to go live and accept real payments:

### 1. Point the Client and Server at Mainnet

The example registers testnet **and** mainnet in the same tables — no uncommenting needed. Switch by setting mainnet values in `.env-exact`:

```bash
# Server payout addresses → your mainnet wallets
EVM_ADDRESS=0xYourMainnetBscAddress
TRON_ADDRESS=TYourMainnetTronAddress

# Client pays on mainnet
PAY_TARGETS=tron:mainnet@USDT      # or eip155:56@USDT
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

If you use the official facilitator, keep `FACILITATOR_URL=https://facilitator.bankofai.io` and your `FACILITATOR_API_KEY`. Only your server's payout addresses move to mainnet.

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

- Explore the [runnable examples](https://github.com/BofAI/x402/tree/main/examples/typescript) for the full client → server → facilitator loop, plus the `gasfree`, `upto`, and `batch-settlement` scenarios
- Read the [core concepts](../core-concepts/http-402.md) to understand how the x402 protocol works
- Want detailed configuration for both Facilitator options? See the [Facilitator documentation](../core-concepts/facilitator.md)
- Experience calling a paid API from the [user perspective](./quickstart-for-human.md), or configure an [AI agent](./quickstart-for-agent.md) to call your service automatically

---

## Summary

Congratulations 🎉! You've completed the Seller Quickstart. Here's everything you accomplished:

| Step | What You Did |
|------|----------|
| **Prerequisites** | Created a receiving wallet, obtained test tokens, reviewed configuration parameters |
| **Step 1** | Cloned the SDK repo and installed the example workspace |
| **Step 2** | Configured `.env-exact` with your wallet and payout addresses |
| **Step 3** | Ran a keyless Express resource server with payment protection |
| **Step 4** | Connected to a Facilitator (official or self-hosted) for settlement |
| **Step 5** | Verified payment protection and the full client → server → facilitator payment flow |

Your API is now ready to accept blockchain payments via the x402 protocol!
