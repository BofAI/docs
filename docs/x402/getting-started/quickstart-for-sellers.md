---
title: 'Quickstart for Sellers'
description: 'This guide walks you through integrating with **x402-tron** to enable payments for your API or service on TRON blockchain. By the end, your API will be able to charge buyers and AI agents for access.'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**Note:** This quickstart begins with testnet configuration (TRON Nile) for safe testing. When you're ready for production, see [Running on Mainnet](#running-on-mainnet) for the simple changes needed to accept real payments on TRON mainnet.

## Overview

As a seller, you only need **3 steps** to start accepting payments:

1. **Install x402-tron SDK** - Install the Python SDK
2. **Develop Your Server** - Add payment protection to your API endpoints
3. **Start a Facilitator** - Run the payment verification service

---

### Prerequisites

Before you begin, ensure you have:

- **Python 3.10+** and pip installed ([Download Python](https://www.python.org/downloads/))
- A **TRON wallet address** to receive payments (e.g., from [TronLink](https://www.tronlink.org/))
- Basic knowledge of Python web development (we'll use FastAPI)

**Pre-configured Examples:** We have ready-to-run examples: [server example](https://github.com/bankofai/x402-tron-demo/tree/main/server) and [facilitator example](https://github.com/bankofai/x402-tron-demo/tree/main/facilitator). You can clone and run them directly!

---

### Configuration Reference

Here are the key configuration items you'll need:

| Item                    | Description                                        | How to Get                                                                 |
| ----------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| **TRON Wallet Address** | Your address to receive payments (starts with `T`) | Create via [TronLink](https://www.tronlink.org/) wallet                    |
| **Test TRX**            | Gas fees for testnet transactions                  | [Nile Faucet](https://nileex.io/join/getJoinPage)                          |
| **Test USDT**           | Test tokens for payment testing                    | [Nile USDT Faucet](https://nileex.io/join/getJoinPage) or ask in community |

**Testnet vs Mainnet:**

- **Testnet (Nile)**: Free test tokens, no real money. Use `tron:nile` as network.
- **Mainnet**: Real USDT payments. Requires TronGrid API Key. Use `tron:mainnet` as network.

---

## Step 1: Install x402-tron SDK

The x402-tron SDK provides everything you need to add payment protection to your API.

**Option A: Install from GitHub (Recommended)**

```bash
pip install "git+https://github.com/bankofai/x402-tron.git@v0.1.6#subdirectory=python/x402[fastapi]"
```

**Option B: Install from source (for development)**

```bash
# Clone the repository
git clone https://github.com/bankofai/x402-tron.git
cd x402-tron/python/x402

# Install with FastAPI support
pip install -e ".[fastapi]"
```

**Verify Installation:** Run `python -c "import x402_tron; print('SDK installed successfully!')"` to verify.

---

## Step 2: Develop Your Server

Now let's create a simple API server with payment protection. The SDK provides a decorator that automatically handles payment verification.

Create a new file called `server.py`:

<Tabs>
  <TabItem value="python" label="Python (FastAPI)">

```python
from fastapi import FastAPI
from x402_tron.server import X402Server
from x402_tron.fastapi import x402_protected
from x402_tron.facilitator import FacilitatorClient

app = FastAPI()

# ========== Configuration ==========
# Replace with YOUR TRON wallet address (this is where you receive payments)
PAY_TO_ADDRESS = "YourTronWalletAddressHere"

# Facilitator URL (we'll start this in Step 3)
FACILITATOR_URL = "http://localhost:8001"
# ====================================

# Initialize x402 server
server = X402Server()
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

# This endpoint requires payment to access
@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],    # Price per request (supports multiple tokens)
    network="tron:nile",       # Use testnet for testing
    pay_to=PAY_TO_ADDRESS,     # Your wallet address
)
async def protected_endpoint():
    return {"data": "This is premium content!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

  </TabItem>
</Tabs>

**Key Configuration Options:**

| Parameter | Description                | Example                 |
| --------- | -------------------------- | ----------------------- |
| `prices` | Payment amount per request (list) | `["0.0001 USDT"]` |
| `network` | TRON network identifier    | `"tron:nile"` (testnet) |
| `pay_to`  | Your TRON wallet address   | `"TYour...Address"`     |

**How It Works:** When a request is made without payment, your server automatically returns HTTP 402 (Payment Required) with payment instructions. The client SDK handles the rest!

---

## Step 3: Start a Facilitator

The facilitator is a service that verifies and settles payments on-chain. You need to run it before starting your server.

**Options:**

- **Run Your Own Facilitator** (recommended for testing)
- **Use Official Facilitator** - _Coming Soon_

### Run Your Own Facilitator

Open a **new terminal window** and run:

```bash
# Clone the demo repository
git clone https://github.com/bankofai/x402-tron-demo.git
cd x402-tron-demo

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.sample .env
```

**Configure `.env` file:**

```bash
# Facilitator wallet private key (for settling payments on-chain)
TRON_PRIVATE_KEY=your_facilitator_private_key_here

# TronGrid API Key (required for mainnet, optional for testnet)
TRON_GRID_API_KEY=your_trongrid_api_key_here
```

**Facilitator Wallet:** The facilitator needs a wallet with TRX for gas fees. For testnet, get free TRX from [Nile Faucet](https://nileex.io/join/getJoinPage).

**Start the facilitator:**

```bash
./start.sh facilitator
```

**Facilitator Endpoints:** Once running, the facilitator provides these endpoints on `http://localhost:8001`:

- `GET /supported` - Supported capabilities
- `POST /verify` - Verify payment payload
- `POST /settle` - Settle payment on-chain
- `POST /fee/quote` - Get fee quote

---

## Step 4: Test Your Integration

Now let's verify everything works!

### 4.1 Start Your Server

In a **new terminal window** (keep the facilitator running):

```bash
python server.py
```

Your server is now running on `http://localhost:8000`.

### 4.2 Test the Payment Flow

**Test 1: Access without payment**

```bash
curl http://localhost:8000/protected
```

Expected: HTTP 402 response with payment instructions in the `PAYMENT-REQUIRED` header.

**Test 2: Complete payment flow**

To test the full payment flow, you need a client that can sign payments. See:

- [Quickstart for Human](./quickstart-for-human.md) - For browser-based payments
- [Quickstart for Agent](./quickstart-for-agent.md) - For AI agent payments

---

## Troubleshooting

| Problem                             | Solution                                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `Connection refused` to facilitator | Make sure the facilitator is running on port 8001                                                             |
| `ModuleNotFoundError: x402_tron`    | Run `pip install "git+https://github.com/bankofai/x402-tron.git@v0.1.6#subdirectory=python/x402[fastapi]"` |
| Invalid wallet address error        | Ensure your TRON address starts with `T` and is 34 characters                                                 |

**Need Help?** Check out the complete examples:

- [Server Example](https://github.com/bankofai/x402-tron-demo/tree/main/server)
- [Facilitator Example](https://github.com/bankofai/x402-tron-demo/tree/main/facilitator)

---

## Running on Mainnet

Once you've tested your integration on testnet (Nile), you're ready to accept real payments on TRON mainnet.

### 1. Update Server Configuration

In your `server.py`, change the `network` parameter in the `@x402_protected` decorator:

```python
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    network="tron:mainnet",  # Change from "tron:nile" to "tron:mainnet"
    pay_to=PAY_TO_ADDRESS,
)
```

### 2. Update Your Facilitator

If running your own facilitator on mainnet:

1. **Apply for a TronGrid API Key**: Register at [TronGrid](https://www.trongrid.io/) and create an API key. This is required for reliable mainnet RPC access.
2. Update environment variables to use mainnet credentials (including `TRON_GRID_API_KEY`)
3. Ensure the facilitator wallet has TRX for energy/bandwidth fees
4. Update the facilitator network configuration to `mainnet`

### 3. Update Your Wallet

Make sure your receiving wallet address is a real mainnet address where you want to receive USDT payments.

### 4. Test with Real Payments

Before going live:

1. Test with small amounts first
2. Verify payments are arriving in your wallet
3. Monitor the facilitator for any issues

**Warning:** Mainnet transactions involve real money. Always test thoroughly on testnet first and start with small amounts on mainnet.

---

## Network Identifiers

x402-tron uses simple network identifiers:

| Network             | Identifier     |
| ------------------- | -------------- |
| TRON Mainnet        | `tron:mainnet` |
| TRON Nile Testnet   | `tron:nile`    |
| TRON Shasta Testnet | `tron:shasta`  |

See [Network Support](../core-concepts/network-and-token-support.md) for the full list.

---

### Next Steps

- Check out the [demo examples](https://github.com/bankofai/x402-tron-demo/tree/main/server) for more complex payment flows
- Explore [Core Concepts](../core-concepts/http-402.md) to understand how x402-tron works
- Get started as a [human buyer](./quickstart-for-human.md) or set up an [AI agent](./quickstart-for-agent.md)

### Summary

Congratulations! You've completed the seller quickstart. Here's what you accomplished:

| Step       | What You Did                                      |
| ---------- | ------------------------------------------------- |
| **Step 1** | Installed the x402-tron SDK                       |
| **Step 2** | Created a server with payment-protected endpoints |
| **Step 3** | Started a facilitator for payment verification    |
| **Step 4** | Tested your integration                           |

Your API is now ready to accept TRON-based payments through x402-tron! 🎉
