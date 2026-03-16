import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart for Sellers

> **Testnet First:** This guide uses testnet by default — all operations use free test tokens and **no real funds are involved**. Once your integration is verified, see [Running on Mainnet](#running-on-mainnet) at the end of this guide to go live.

## What You'll Build

After completing this guide, you'll have an **API service that charges per call**:

- When a user or AI agent calls your API, the system automatically requires them to pay in the token you specify (USDT by default; USDD and custom TRC-20/BEP-20 tokens are also supported)
- Supports per-request billing, metered usage, dynamic pricing, and more
- Payment verification and blockchain settlement are fully automated — funds go directly to your wallet

The full setup takes **4 steps**, estimated time: **15–20 minutes**.

---

## Prerequisites

### Verify Your Environment

Run the following commands in your terminal (macOS/Linux Terminal, or Windows PowerShell) to confirm the required tools are installed:

```bash
python --version   # Requires 3.10 or higher
pip --version      # Installed with Python
git --version      # Version control tool
```

If any command returns "not found", install the missing tools:
- Python: [python.org](https://www.python.org/downloads/)
- Git: [git-scm.com](https://git-scm.com/)

---

### Create a Receiving Wallet

You need a blockchain wallet address to receive tokens (USDT or USDD) from your API users. Follow the steps below for your chosen network:

> 💡 **About USDD:** USDD is TRON's native stablecoin, fully supported by x402 alongside USDT. It is a great primary option on TRON mainnet. BSC currently supports USDT only.

<Tabs>
<TabItem value="TRON" label="TRON (Recommended)">

**Create a TronLink wallet (~3 min):**

1. Install the [TronLink browser extension](https://www.tronlink.org/) (Chrome/Firefox) or the mobile app
2. Open the extension and click "Create Wallet"
3. Set a local password to unlock the wallet
4. **Important:** Write down your seed phrase (12 English words) on paper and store it safely — it's the only way to recover your wallet
5. Confirm the seed phrase when prompted; your wallet is now created
6. Copy your wallet address from the home screen (starts with **`T`**, e.g. `TXyz1234...`)

**Claim free test tokens (~2 min):**

1. Go to the [Nile Testnet Faucet](https://nileex.io/join/getJoinPage)
2. Paste your TRON wallet address and claim free test TRX and USDT/USDD
3. In TronLink, switch to the "Nile Testnet" and refresh to confirm your TRX and USDT/USDD balance

> ✅ **Success check:** Wallet shows test TRX and test USDT (or USDD) balance greater than 0

</TabItem>
<TabItem value="BSC" label="BSC">

**Create a MetaMask wallet (~3 min):**

1. Install the [MetaMask browser extension](https://metamask.io/) (Chrome/Firefox/Edge)
2. Click "Create a new wallet", set a password, and **write down your seed phrase on paper**
3. Confirm the seed phrase; your wallet is now created
4. Copy your wallet address from the home screen (starts with **`0x`**, e.g. `0xAbc123...`)

**Claim free test tokens (~2 min):**

1. Go to the [BSC Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet)
2. Paste your wallet address and claim test BNB and USDT
3. In MetaMask, switch to the BSC Testnet and confirm the balance arrived

> ✅ **Success check:** Wallet shows test BNB and test USDT balance greater than 0

</TabItem>
</Tabs>

> ⚠️ **Wallet security:** Your seed phrase and private key are the master key to your wallet. **Never share them with anyone — including support staff.** Write the seed phrase on paper; do not store it in cloud storage or screenshots.

---

### Configuration Reference

| Item | Description | How to Obtain |
|------|-------------|---------------|
| **TRON Receiving Address** | Wallet address starting with `T` | Copy from TronLink |
| **BSC Receiving Address** | Wallet address starting with `0x` | Copy from MetaMask |
| **Test TRX** | Gas token for TRON testnet | [Nile Faucet](https://nileex.io/join/getJoinPage) |
| **Test USDT/USDD (TRON)** | TRON test payment tokens (both supported) | [Nile Faucet](https://nileex.io/join/getJoinPage) |
| **Test BNB** | Gas token for BSC testnet | [BSC Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet) |
| **Test USDT (BSC)** | BSC test payment token | [BSC Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet) |

**Testnet vs. Mainnet:**

- **Testnet**: Free test tokens, no real funds. Network identifiers: `tron:nile` / `eip155:97`
- **Mainnet**: Real USDT/USDD payments. Network identifiers: `tron:mainnet` / `eip155:56`

---

## Step One: Install x402 SDK

Open your terminal and run the install command:

**Recommended (install directly from GitHub):**

```bash
pip install "bankofai-x402[tron,fastapi] @ git+https://github.com/BofAI/x402.git@v0.3.1#subdirectory=python/x402"
```

Verify the installation:

```bash
python -c "import bankofai.x402; print('SDK installed successfully!')"
```

> ✅ **Success check:** Terminal prints `SDK installed successfully!`

**Alternative (install from source, for development):**

```bash
git clone https://github.com/BofAI/x402.git
cd x402/python/x402
pip install -e ".[fastapi]"
```

> 💡 **Permission error?** Prefix the command with `sudo` (macOS/Linux) or run PowerShell as Administrator (Windows).

---

## Step Two: Create Your Payment-Protected Server

Create a new file named `server.py` in your project directory and paste the code for your chosen network:

<Tabs>
<TabItem value="TRON" label="TRON">

```python
from fastapi import FastAPI
from bankofai.x402.server import X402Server
from bankofai.x402.fastapi import x402_protected
from bankofai.x402.facilitator import FacilitatorClient
from bankofai.x402.config import NetworkConfig

app = FastAPI()

# ========== Edit these two values ==========
# Replace with your actual TRON wallet address (for receiving payments)
PAY_TO_ADDRESS = "YourTronWalletAddressHere"

# Facilitator URL (will be configured in Step 3 — leave as-is for now)
FACILITATOR_URL = "http://localhost:8001"
# ===========================================

# Initialize the x402 server
server = X402Server()
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

# This endpoint requires payment to access
@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],          # Charge per request (adjust as needed)
    schemes=["exact_permit"],         # Payment scheme
    network=NetworkConfig.TRON_NILE, # Testnet (change to TRON_MAINNET for production)
    pay_to=PAY_TO_ADDRESS,           # Your receiving wallet address
)
async def protected_endpoint():
    return {"data": "This is premium content!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

</TabItem>
<TabItem value="BSC" label="BSC">

```python
from fastapi import FastAPI
from bankofai.x402.server import X402Server
from bankofai.x402.fastapi import x402_protected
from bankofai.x402.facilitator import FacilitatorClient
from bankofai.x402.config import NetworkConfig
from bankofai.x402.mechanisms.evm.exact_permit import ExactPermitEvmServerMechanism
from bankofai.x402.mechanisms.evm.exact import ExactEvmServerMechanism

app = FastAPI()

# ========== Edit these two values ==========
# Replace with your actual BSC wallet address (for receiving payments)
PAY_TO_ADDRESS = "0xYourBscWalletAddressHere"

# Facilitator URL (will be configured in Step 3 — leave as-is for now)
FACILITATOR_URL = "http://localhost:8001"
# ===========================================

# Initialize the x402 server and register BSC mechanisms
server = X402Server()
server.register(NetworkConfig.BSC_TESTNET, ExactPermitEvmServerMechanism())
server.register(NetworkConfig.BSC_TESTNET, ExactEvmServerMechanism())
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

# This endpoint requires payment to access
@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],            # Charge per request
    network=NetworkConfig.BSC_TESTNET, # Testnet (change to BSC_MAINNET for production)
    pay_to=PAY_TO_ADDRESS,             # Your receiving wallet address
    schemes=["exact_permit"],
)
async def protected_endpoint():
    return {"data": "This is premium content!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

</TabItem>
</Tabs>

**Key configuration parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| `PAY_TO_ADDRESS` | Your receiving wallet address | `TXyz...` (TRON) or `0xAbc...` (BSC) |
| `prices` | Charge per request | `["0.0001 USDT"]` |
| `network` | Network to use | Testnet: `TRON_NILE` / `BSC_TESTNET` |
| `schemes` | Payment scheme | `["exact_permit"]` |

**How it works:** When an unpaid request arrives, your server automatically returns HTTP 402 (Payment Required) with payment instructions in the response header. The client SDK handles payment and retries the request automatically — users barely notice.

---

## Step Three: Connect to a Facilitator

### What is a Facilitator?

Think of the Facilitator as an **automated notary**: when someone pays your API, the Facilitator verifies the payment is genuine and records the settlement on-chain.

**You must complete the Facilitator setup before starting your API server.**

### Which option should I choose?

| | Official Facilitator (Recommended) | Self-Hosted Facilitator |
|---|---|---|
| **Infrastructure to maintain** | None — fully hosted | You run it yourself |
| **Wallet private key required** | No | Yes (to pay gas fees) |
| **Setup difficulty** | Low (get an API Key) | Medium (deploy and configure) |
| **Best for** | Most users, fast launch | Custom fee rate strategies |

<Tabs>
<TabItem value="official" label="✅ Official Facilitator (Recommended)">

The official hosted Facilitator requires **no infrastructure on your end**. Detailed information can also be found in [OfficialFacilitator](../core-concepts/OfficialFacilitator.md)

#### 3.1 Configure the Service Endpoint

Set your `FACILITATOR_URL` to the Official Facilitator service endpoint:

```
https://facilitator.bankofai.io
```

This is the address your x402 server calls to verify and settle payments. It is for **API calls only** — do not open it in a browser.

> ⚠️ **Without an API Key, this endpoint is rate-limited to 1 request/minute per IP.** This is fine for testing, but will block your API in production. Proceed to step 3.2 to get your API Key.

#### 3.2 Get Your API Key

Apply for a free API Key at the admin portal:

[https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io)

1. Open the link above in your browser
2. Click **TronLink** to sign in with your wallet (identity verification only — **no funds deducted**)
3. On the Dashboard, click **"Create API Key"**
4. Click Confirm, then click **View** to reveal and copy your API Key

With an API Key configured, the rate limit rises to **1,000 requests/minute** — enough for production.

> 📖 **Step-by-step screenshots:** [Official Facilitator](../core-concepts/OfficialFacilitator.md)

> ⚠️ **Security:** Your API Key is a service credential — **treat it like a password and never commit it to Git.**

#### 3.3 Configure Your `.env` File

The Facilitator authenticates requests via the HTTP header `X-API-KEY: <your_key>`. The SDK handles this automatically — just set the following in your `.env` file and the SDK attaches the header on every Facilitator call:

```bash
# Official Facilitator service endpoint
FACILITATOR_URL=https://facilitator.bankofai.io

# API Key — SDK sends this as the X-API-KEY header automatically
FACILITATOR_API_KEY=paste_your_api_key_here
```

#### 3.4 Update server.py to Use the Official Facilitator

Add `import os` at the top of `server.py` and update the Facilitator initialization:

<Tabs>
<TabItem value="TRON" label="TRON">

```python
import os
# ... other imports unchanged ...

# Official Facilitator URL (read from environment variable)
# The SDK reads FACILITATOR_API_KEY from env automatically — no need to pass it explicitly
FACILITATOR_URL = os.getenv("FACILITATOR_URL", "https://facilitator.bankofai.io")

# Initialize x402 server, connect to Official Facilitator
server = X402Server()
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))
```

</TabItem>
<TabItem value="BSC" label="BSC">

```python
import os
# ... other imports unchanged ...

# Official Facilitator URL (read from environment variable)
# The SDK reads FACILITATOR_API_KEY from env automatically — no need to pass it explicitly
FACILITATOR_URL = os.getenv("FACILITATOR_URL", "https://facilitator.bankofai.io")

# Initialize x402 server, register BSC mechanisms, connect to Official Facilitator
server = X402Server()
server.register(NetworkConfig.BSC_TESTNET, ExactPermitEvmServerMechanism())
server.register(NetworkConfig.BSC_TESTNET, ExactEvmServerMechanism())
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))
```

</TabItem>
</Tabs>

> ✅ **Done!** The Official Facilitator is configured. **No local service to start** — go straight to Step Four.

</TabItem>
<TabItem value="selfhost" label="Self-Hosted Facilitator">

Self-hosting gives you full control over fee policies and energy management — suited for advanced users with custom requirements.

> ⚠️ **Security — please read first:**
> - Requires a **dedicated wallet** private key to pay blockchain gas fees — **keep it separate from your receiving wallet**
> - Only put a small amount of tokens in the Facilitator wallet (just enough for gas)
> - The private key lives only in your `.env` file — **never push it to GitHub or share it**

#### 3.1 Prepare a Dedicated Facilitator Wallet

Create a brand-new wallet for the Facilitator (same steps as your receiving wallet), then claim test tokens from the faucet to cover gas fees.

#### 3.2 Clone and Configure the Facilitator

Open a **new terminal window** (keep the current one open) and run:

```bash
# Download the demo project (includes Facilitator implementation)
git clone https://github.com/BofAI/x402-demo.git
cd x402-demo

# Install dependencies
pip install -r requirements.txt

# Create config file from template
cp .env.sample .env
```

Open the `.env` file in `x402-demo` with any text editor and fill in the Facilitator wallet's private key:

<Tabs>
<TabItem value="TRON" label="TRON">

```bash
# Private key of the Facilitator's dedicated wallet (NOT your receiving wallet!)
# How to export: TronLink → Settings → Account Management → Export Private Key
TRON_PRIVATE_KEY=paste_your_facilitator_private_key_here

# TronGrid API Key (required for mainnet, optional for testnet)
# Apply at: https://www.trongrid.io/
TRON_GRID_API_KEY=
```

</TabItem>
<TabItem value="BSC" label="BSC">

```bash
# Private key of the Facilitator's dedicated wallet (NOT your receiving wallet!)
# How to export: MetaMask → Account Details → Export Private Key
BSC_PRIVATE_KEY=paste_your_facilitator_private_key_here
```

</TabItem>
</Tabs>

#### 3.3 Start the Facilitator

```bash
./start.sh facilitator
```

**Expected output:**

```
Facilitator running on http://localhost:8001
Supported endpoints:
  GET  /supported
  POST /verify
  POST /settle
  POST /fee/quote
```

> ✅ **Success check:** Terminal shows `Facilitator running on http://localhost:8001` — **keep this window open**

The `FACILITATOR_URL = "http://localhost:8001"` in `server.py` is already correct for self-hosted. **No changes needed** — proceed to Step Four.

</TabItem>
</Tabs>

---

## Step Four: Start and Test Your API

### 4.1 Start Your API Server

Open a **third terminal window** (keep the previous terminals running), navigate to your `server.py` directory, and run:

```bash
python server.py
```

**Expected output:**

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

> ✅ **Success check:** Terminal shows `Uvicorn running on http://0.0.0.0:8000`

### 4.2 Test Unpaid Access (Should Be Blocked)

```bash
curl http://localhost:8000/protected
```

**Expected result:**

```json
{"error": "Payment required", "x402Version": 1}
```

> ✅ **This is exactly what we want!** Payment protection is working — unpaid requests are blocked.

### 4.3 Test the Full Payment Flow

To test payment end-to-end, you need a client that can sign payments:

- [Quickstart for Human Users](./quickstart-for-human.md) — call your paid API via code
- [Quickstart for AI Agents](./quickstart-for-agent.md) — configure an AI agent to pay automatically

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` to Facilitator | **Self-hosted:** confirm the Facilitator terminal is still running on port 8001. **Official:** check that `FACILITATOR_URL` is set to `https://facilitator.bankofai.io` |
| `ModuleNotFoundError: bankofai` | Re-run the Step One install command |
| Invalid wallet address error | TRON address starts with `T`; BSC address starts with `0x` — check for a complete copy |
| Facilitator fails to start (self-hosted) | Check the private key in `.env` — no extra spaces or line breaks |
| API Key invalid or rate-limited (official) | Confirm `FACILITATOR_API_KEY` is correct; visit [admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io) to check key status |
| `server.py` startup error | Confirm `PAY_TO_ADDRESS` has been replaced with your real wallet address |

**More examples and references:**

- [Full server example](https://github.com/BofAI/x402-demo/tree/main/server)
- [Facilitator example](https://github.com/BofAI/x402-demo/tree/main/facilitator)
- [Facilitator deep-dive](../core-concepts/facilitator.md) — detailed setup comparison for both options
- [Official Facilitator](../core-concepts/OfficialFacilitator.md) — step-by-step with screenshots

---

## Running on Mainnet

Once your testnet integration is fully verified, follow these steps to accept real USDT/USDD payments:

### 1. Update Server Configuration

Change the `network` parameter in the `@x402_protected` decorator in `server.py`:

<Tabs>
<TabItem value="TRON" label="TRON">

```python
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    schemes=["exact_permit"],
    network=NetworkConfig.TRON_MAINNET,  # Changed from TRON_NILE
    pay_to=PAY_TO_ADDRESS,
)
```

</TabItem>
<TabItem value="BSC" label="BSC">

```python
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    schemes=["exact_permit"],
    network=NetworkConfig.BSC_MAINNET,  # Changed from BSC_TESTNET
    pay_to=PAY_TO_ADDRESS,
)
```

</TabItem>
</Tabs>

### 2. Update Your Facilitator

<Tabs>
<TabItem value="TRON" label="TRON">

1. **Apply for a TronGrid API Key**: Register at [TronGrid](https://www.trongrid.io/) and add the key to `TRON_GRID_API_KEY` in your `.env` (required for mainnet)
2. **Update private key**: Replace the Facilitator wallet private key with a mainnet wallet key
3. **Fund gas fees**: Deposit enough real TRX in the Facilitator wallet to cover Energy and Bandwidth fees
4. **Switch network**: Update the Facilitator's network config to `NetworkConfig.TRON_MAINNET`

</TabItem>
<TabItem value="BSC" label="BSC">

1. **Fund gas fees**: Deposit enough real BNB in the Facilitator wallet to cover gas fees
2. **Switch network**: Update the Facilitator's network config to `NetworkConfig.BSC_MAINNET`

</TabItem>
</Tabs>

### 3. Confirm Your Receiving Wallet Address

Make sure `PAY_TO_ADDRESS` is your **real mainnet wallet address** and that you have the seed phrase or private key backed up.

### 4. Do a Small Real-Money Test First

> ⚠️ **Mainnet warning — real funds involved. Follow these steps strictly:**
>
> 1. Complete all testing on testnet before switching to mainnet
> 2. After going live, **send one minimal test payment first (e.g. 0.0001 USDT)**
> 3. Confirm the transaction on the block explorer ([TronScan](https://tronscan.org) or [BscScan](https://bscscan.com))
> 4. Open your receiving wallet and confirm the funds arrived
> 5. Only open your API to the public after this verification passes

---

## Next Steps

- Explore [demo examples](https://github.com/BofAI/x402-demo/tree/main/server) for more complex payment flows
- Read the [Core Concepts](../core-concepts/http-402.md) to understand how x402 works under the hood
- Want to understand both Facilitator options in detail? See the [Facilitator guide](../core-concepts/facilitator.md)
- Experience the [user perspective](./quickstart-for-human.md) or set up an [AI agent](./quickstart-for-agent.md) to call your API

---

## Summary

Congratulations 🎉! You've completed the seller quickstart. Here's what you accomplished:

| Step | Accomplished |
|------|-------------|
| **Prerequisites** | Created a receiving wallet and claimed test tokens |
| **Step One** | Installed the x402 SDK |
| **Step Two** | Created a payment-protected API endpoint |
| **Step Three** | Connected to a Facilitator settlement service |
| **Step Four** | Verified payment protection and the full payment flow |

Your API is now ready to receive blockchain payments via x402!
