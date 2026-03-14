import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart for Sellers

**Note:** This quickstart guide will first use testnet configurations to ensure a safe testing process. When you are ready to go live in a production environment, please refer to [Running on Mainnet](#running-on-mainnet) for simple configuration changes required to receive real payments on the mainnet.

## Overview

As a seller, you can start receiving payments in just **3 steps**:

1.  **Install x402 SDK** — Install the Python SDK
2.  **Develop Server** — Add payment protection to your API endpoints
3.  **Start Facilitator** — Run the payment verification service

### Prerequisites

Before you begin, please ensure you have:

- **Python 3.10+** and pip ([Download Python](https://www.python.org/downloads/))
- A **wallet address** to receive funds
- Basic knowledge of Python Web Development (this tutorial will use FastAPI)

**Pre-configured Examples:** We provide out-of-the-box example code: [Server Example](https://github.com/BofAI/x402-demo/tree/main/server) and [Facilitator Example](https://github.com/BofAI/x402-demo/tree/main/facilitator). You can clone the repository and run them directly!

### Configuration Reference

Here are the key configuration items you will need:

| Configuration Item      | Description                                           | How to Obtain                                                                    |
| ----------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------- |
| **TRON Wallet Address** | Your address for receiving payments (starts with `T`) | Create via wallet                                                                |
| **Test TRX**            | Gas for testnet transactions                          | [Nile Faucet](https://nileex.io/join/getJoinPage)                                |
| **Test USDT**           | Test tokens for payment process                       | [Nile USDT Faucet](https://nileex.io/join/getJoinPage) or request from community |
| **BSC Wallet Address**  | Your address for receiving payments                   | Create via wallet                                                                |
| **Test BNB**            | Gas for testnet transactions                          | [Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet)                     |
| **Test USDT**           | Test tokens for payments                              | [Testnet USDT Faucet](https://www.bnbchain.org/en/testnet-faucet)                |

**Testnet vs. Mainnet:**

- **Testnet**: Uses free test tokens, no real funds involved. Use network identifiers `tron:nile` or `eip155:97`.
- **Mainnet**: Involves real USDT payments. Use network identifiers `tron:mainnet` or `eip155:56`.

## Step One: Install x402 SDK

The x402 SDK provides everything you need to add payment protection to your API.

**Option A: Install using uv (Recommended)**

```bash
# For TRON support
uv add "bankofai.x402[fastapi,tron]"
# For BSC (EVM) support
uv add "bankofai.x402[fastapi,evm]"
# For both
uv add "bankofai.x402[fastapi,tron,evm]"
```

**Option B: Install using pip**

```bash
pip install "bankofai.x402[fastapi,tron,evm]"
```

**Verify Installation:** Run `python -c "import bankofai.x402; print('SDK installed successfully!')"` to verify.

## Step Two: Develop Your Server

Now, let's create a simple API server with payment protection. The SDK provides a decorator that automatically handles payment verification.

Create a new file named `server.py`:

<Tabs>
<TabItem value="TRON" label="TRON">

```python
from fastapi import FastAPI
from bankofai.x402.server import x402ResourceServer
from bankofai.x402.http import FacilitatorConfig, HTTPFacilitatorClient, PaymentOption
from bankofai.x402.http.middleware.fastapi import PaymentMiddlewareASGI
from bankofai.x402.http.types import RouteConfig
from bankofai.x402.mechanisms.tron.exact import ExactTronServerScheme

app = FastAPI()

# ========== Configuration ==========
# Replace with YOUR TRON wallet address
PAY_TO_ADDRESS = "YourTronWalletAddressHere"
# Facilitator URL
FACILITATOR_URL = "http://localhost:8001"
NETWORK = "tron:nile"
# ====================================

# Initialize x402 server
facilitator = HTTPFacilitatorClient(FacilitatorConfig(url=FACILITATOR_URL))
server = x402ResourceServer(facilitator)
server.register(NETWORK, ExactTronServerScheme())

# Configure protected routes
routes = {
    "GET /protected": RouteConfig(
        accepts=[
            PaymentOption(
                scheme="exact",
                pay_to=PAY_TO_ADDRESS,
                price="0.0001 USDT",
                network=NETWORK,
            ),
        ],
        description="Premium content",
    ),
}

# Add x402 Middleware
app.add_middleware(PaymentMiddlewareASGI, routes=routes, server=server)

@app.get("/protected")
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
from bankofai.x402.server import x402ResourceServer
from bankofai.x402.http import FacilitatorConfig, HTTPFacilitatorClient, PaymentOption
from bankofai.x402.http.middleware.fastapi import PaymentMiddlewareASGI
from bankofai.x402.http.types import RouteConfig
from bankofai.x402.mechanisms.evm.exact import ExactEvmServerScheme

app = FastAPI()

# ========== Configuration ==========
# Replace with YOUR BSC wallet address
PAY_TO_ADDRESS = "0xYourBscWalletAddressHere"
# Facilitator URL
FACILITATOR_URL = "http://localhost:8001"
NETWORK = "eip155:97" # BSC Testnet
# ====================================

# Initialize x402 server
facilitator = HTTPFacilitatorClient(FacilitatorConfig(url=FACILITATOR_URL))
server = x402ResourceServer(facilitator)
server.register(NETWORK, ExactEvmServerScheme())

# Configure protected routes
routes = {
    "GET /protected": RouteConfig(
        accepts=[
            PaymentOption(
                scheme="exact",
                pay_to=PAY_TO_ADDRESS,
                price="0.0001 USDT",
                network=NETWORK,
            ),
        ],
        description="Premium content",
    ),
}

# Add x402 Middleware
app.add_middleware(PaymentMiddlewareASGI, routes=routes, server=server)

@app.get("/protected")
async def protected_endpoint():
    return {"data": "This is premium content!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

</TabItem>
</Tabs>

**Key Configuration Options:**

| Parameter | Description                                                | Example                           |
| --------- | ---------------------------------------------------------- | --------------------------------- |
| `prices`  | Payment amount per request (list)                          | `["0.0001 USDT"]`                 |
| `schemes` | Payment scheme per price (list): `exact_permit` or `exact` | `["exact_permit"]`                |
| `network` | Network identifier                                         | `tron:nile`/`eip155:97` (testnet) |
| `pay_to`  | Your wallet receiving address                              | `T...` or `0x...`                 |

**How it Works:** When an unpaid request is received, your server automatically returns an HTTP 402 (Payment Required) status code with payment instructions. The rest of the process is handled automatically by the client SDK!

## Step Three: Start the Facilitator

The Facilitator is a service used to verify and settle payments on-chain. You need to run this service before starting your API server.

**Options:**

- **Run your own Facilitator** (recommended for testing)
- **Use the [official Facilitator](https://github.com/BofAI/x402-facilitator)**

### Run Your Own Facilitator

Open a **new terminal window** and run the following commands:

```bash
# Clone the demo repository
git clone https://github.com/BofAI/x402-demo.git
cd x402-demo

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

# BSC Facilitator wallet private key (for settling payments on-chain)
BSC_PRIVATE_KEY=your_facilitator_private_key_here
```

**Facilitator Wallet:** The Facilitator requires a wallet holding native gas tokens (TRX for TRON, BNB for BSC) to pay for transaction fees. For testnet, get free tokens from the respective faucets.

**Start Facilitator:**

```bash
./start.sh facilitator
```

**Facilitator Endpoints:** Once running, the Facilitator provides the following endpoints at `http://localhost:8001`:

- `GET /supported` - Supported features
- `POST /verify` - Verify payment payload
- `POST /settle` - Settle payment on-chain
- `POST /fee/quote` - Get fee quote

## Step Four: Test Your Integration

Now, let's verify that everything is working correctly!

### 4.1 Start Your Server

In a **new terminal window** (keep the Facilitator running):

```bash
python server.py
```

Your server is now running at `http://localhost:8000`.

### 4.2 Test Payment Process

**Test 1: Unpaid Access**

```bash
curl http://localhost:8000/protected
```

Expected result: HTTP 402 response, with payment instructions in the `PAYMENT-REQUIRED` header.

**Test 2: Full Payment Process**

To test the full payment process, you need a client capable of signing payments. Please refer to:

- [Quickstart for Human Users](./quickstart-for-human.md) - For browser-based payments
- [Quickstart for AI Agents](./quickstart-for-agent.md) - For AI Agent payments

## Troubleshooting

| Issue                                               | Solution                                        |
| --------------------------------------------------- | ----------------------------------------------- |
| `Connection refused` when connecting to Facilitator | Ensure the Facilitator is running on port 8001  |
| `ModuleNotFoundError: bankofai.x402`                | Run `pip install "bankofai.x402[tron,fastapi]"` |
| Invalid wallet address error                        | Ensure your address is correct                  |

**Need help?** Check out the full examples:

- [Server Example](https://github.com/BofAI/x402-demo/tree/main/server)
- [Facilitator Example](https://github.com/BofAI/x402-demo/tree/main/facilitator)

## Running on Mainnet

Once you have tested your integration on the testnet, you are ready to accept real payments on the mainnet.

### 1. Update Server Configuration

In your `server.py`, update the `NETWORK` variable:
<Tabs>
<TabItem value="TRON" label="TRON">

```python
NETWORK = "tron:mainnet"  # Change from "tron:nile" to "tron:mainnet"
```

</TabItem>
<TabItem value="BSC" label="BSC">

```python
NETWORK = "eip155:56"  # Change from "eip155:97" to "eip155:56"
```

</TabItem>
</Tabs>

### 2. Update Your Facilitator

If you are running your own Facilitator service, do the following:
<Tabs>
<TabItem value="TRON" label="TRON">

1.  **Apply for a TronGrid API Key**: Go to [TronGrid](https://www.trongrid.io/) to register and create an API Key. This step is necessary to ensure the stability of mainnet RPC access.
2.  **Update Environment Variables**: Configure mainnet credentials (including `TRON_GRID_API_KEY`).
3.  **Prepare Gas Fees**: Ensure the Facilitator wallet holds enough TRX to pay for Energy and Bandwidth fees.
4.  **Switch Network Configuration**: Update the Facilitator's network configuration to `tron:mainnet`.

</TabItem>
<TabItem value="BSC" label="BSC">

1.  **Prepare Gas Fees**: Ensure the Facilitator wallet holds enough BNB to pay for gas fees.
2.  **Switch Network Configuration**: Update the Facilitator's network configuration to `eip155:56`.

</TabItem>
</Tabs>

### 3. Update Your Receiving Wallet

Please ensure your receiving address is a **real mainnet address** to ensure you can properly receive USDT payments.

### 4. Conduct Real Payment Tests

Before going live, follow these steps:

1.  First, try a **minimal payment** for testing.
2.  Verify that funds successfully reach your wallet.
3.  Monitor the Facilitator service for any abnormal errors.

**Warning:** Mainnet transactions involve real funds. Be sure to thoroughly test on the testnet first, and when switching to mainnet, always start with small amounts for verification.

### Next Steps

- See [Demo Examples](https://github.com/BofAI/x402-demo/tree/main/server) for more complex payment flows.
- Dive deeper into [Core Concepts](../core-concepts/http-402.md) to understand how x402 works.
- Start experiencing as a [Human User](./quickstart-for-human.md) or configure an [AI Agent](./quickstart-for-agent.md).

### Summary

Congratulations! You have completed the seller quickstart guide. Let's review your achievements:

| Step           | Accomplishment                                           |
| -------------- | -------------------------------------------------------- |
| **Step One**   | Installed the x402 SDK                                   |
| **Step Two**   | Created a payment-protected server endpoint              |
| **Step Three** | Started the Facilitator service for payment verification |
| **Step Four**  | Completed integration testing                            |

Congratulations 🎉! Your API is now ready to receive blockchain-based payments via x402!
