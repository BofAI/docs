import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Facilitator

The Facilitator is an **optional but highly recommended** service designed to simplify payment verification and settlement between clients (buyers) and servers (sellers) on blockchain networks.

## What is a Facilitator?

A Facilitator is a middleware service primarily responsible for:

- **Payload Verification**: Validating the payment payload submitted by the client.
- **Settlement Execution**: Submitting transactions to the blockchain on behalf of the server to complete settlement.
- **Token Transfer**: Executing token transfers by calling the `permitTransferFrom` method of the `PaymentPermit` contract.

By introducing a Facilitator, servers no longer need to maintain direct connections to blockchain nodes or implement complex signature verification logic themselves. This reduces operational complexity while ensuring accurate and real-time transaction validation.

## Responsibilities of the Facilitator

- **Payment Verification**: Ensures that the signed payload strictly complies with the server's declared payment requirements.
- **Payment Settlement**: Submits validated transactions to the blockchain and monitors their confirmation status.
- **Fee Management**: Supports configurable service fees (optional) for facilitating payments.
- **Result Feedback**: Returns verification and settlement results to the server, enabling it to decide whether to deliver the requested resource.

> **Note**: The Facilitator **does not custody funds** and does not act as an escrow. It only executes verification and on-chain operations according to the client's signed authorization.

## Why Use a Facilitator?

Integrating a Facilitator provides significant advantages:

- **Reduced Operational Overhead**: Servers do not need to directly manage blockchain nodes or RPC infrastructure.
- **Protocol Standardization**: Ensures consistent payment verification and settlement processes across services.
- **Fast Integration**: Servers can begin accepting payments with minimal blockchain development effort.
- **Resource Fee Management**: The Facilitator covers transaction execution costs such as TRX (Energy and Bandwidth) / BNB, reducing the operational burden on the server.

Although developers may implement verification and settlement logic locally, using a Facilitator significantly accelerates development and ensures protocol-compliant implementation.

---

## Facilitator Options: Which Should You Use?

To use x402, you need access to a Facilitator service. There are currently two options:

| | Official Facilitator | Self-Hosted Facilitator |
|---|---|---|
| **Best for** | Most sellers, especially those new to x402 | Advanced users who need full control over fee policies and energy management |
| **Requires server maintenance** | No | Yes |
| **Requires wallet private key** | No | Yes (for paying transaction fees) |
| **Setup difficulty** | Low (just obtain an API Key) | Medium (requires deployment and configuration) |
| **Fee control** | Fixed policy | Fully customizable |
| **Recommended for** | Testing, quick launch, small to medium-scale apps | Large-scale production, custom fee structures |

---

## Option 1: Use the Official Facilitator (Recommended)

The officially hosted Facilitator service is available and ready to use — no infrastructure to maintain on your side.

**Workflow:** Obtain an API Key → Add it to your project → Point `FACILITATOR_URL` at the official service endpoint.

**The official service involves two distinct URLs — please note the difference:**

| Address | Purpose |
|---------|---------|
| [https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io) | **Admin Portal** — Register, create, and manage your Facilitator API Key (open in browser) |
| [https://facilitator.bankofai.io](https://facilitator.bankofai.io) | **Service Endpoint** — Set as `FACILITATOR_URL` in your code; handles payment verification and settlement (API calls only, not for browser access) |

### Step 1: Obtain a Facilitator API Key

1. Open your browser and go to [https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io)
2. Log in with your TronLink wallet (for identity verification only — **no funds will be deducted**)
3. Click "Create API Key" in the Dashboard
4. Copy the generated API Key and keep it safe

> 📖 **For detailed step-by-step instructions with screenshots**, see: [Facilitator API Key Guide](./facilitator-api-key.md)

> ⚠️ **API Key security:** Your API Key is your credential for accessing the official service. **Do not commit it to Git or share it with anyone.** Without an API Key, the rate limit is 1 request/minute; with one configured, the limit is raised to 1,000 requests/minute, sufficient for production use.

### Step 2: Configure the API Key in Your Project

In your x402 project root, open (or create) a `.env` file and add the following:

```bash
# Official Facilitator service configuration
FACILITATOR_API_KEY=your_api_key_here

# Official Facilitator service endpoint
FACILITATOR_URL=https://facilitator.bankofai.io
```

> 💡 **No `.env` file yet?** Run `cp .env.sample .env` in your project directory to create one from the template, or create it manually.

### Step 3: Use the Official Facilitator in server.py

<Tabs>
<TabItem value="TRON" label="TRON">

```python
from fastapi import FastAPI
from bankofai.x402.server import X402Server
from bankofai.x402.fastapi import x402_protected
from bankofai.x402.facilitator import FacilitatorClient
from bankofai.x402.config import NetworkConfig
import os

app = FastAPI()

# Your payment recipient wallet address
PAY_TO_ADDRESS = "your_TRON_wallet_address_here"

# Official Facilitator service endpoint (read from environment variable)
# The SDK automatically reads FACILITATOR_API_KEY from env — no explicit parameter needed
FACILITATOR_URL = os.getenv("FACILITATOR_URL", "https://facilitator.bankofai.io")

# Initialize x402 server and connect to the official Facilitator
server = X402Server()
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    schemes=["exact_permit"],
    network=NetworkConfig.TRON_NILE,  # Testnet; change to TRON_MAINNET for production
    pay_to=PAY_TO_ADDRESS,
)
async def protected_endpoint():
    return {"data": "This content requires payment to access!"}


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
import os

app = FastAPI()

# Your payment recipient wallet address
PAY_TO_ADDRESS = "your_BSC_wallet_address_here_0x..."

# Official Facilitator service endpoint (read from environment variable)
# The SDK automatically reads FACILITATOR_API_KEY from env — no explicit parameter needed
FACILITATOR_URL = os.getenv("FACILITATOR_URL", "https://facilitator.bankofai.io")

# Initialize x402 server, register BSC mechanisms, and connect to the official Facilitator
server = X402Server()
server.register(NetworkConfig.BSC_TESTNET, ExactPermitEvmServerMechanism())
server.register(NetworkConfig.BSC_TESTNET, ExactEvmServerMechanism())
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    network=NetworkConfig.BSC_TESTNET,  # Testnet; change to BSC_MAINNET for production
    pay_to=PAY_TO_ADDRESS,
    schemes=["exact_permit"],
)
async def protected_endpoint():
    return {"data": "This content requires payment to access!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

</TabItem>
</Tabs>

> ✅ **Done!** Your server is now connected to the official Facilitator — no settlement infrastructure to maintain yourself.

---

## Option 2: Self-Hosted Facilitator

If you need full control over fee policies and energy management, or have specific privacy or compliance requirements, you can deploy your own Facilitator service.

> ⚠️ **Self-hosting security notes:**
> - A self-hosted Facilitator requires a **dedicated wallet** private key to pay blockchain transaction fees
> - **This Facilitator wallet should be separate from your payment recipient wallet** — create a new wallet specifically for this purpose
> - Only deposit a small amount of tokens into the Facilitator wallet (enough for fees); do not store large amounts
> - Keep the private key only in your `.env` file — **never upload it to GitHub or share it with anyone**

### Step 1: Prepare a Dedicated Facilitator Wallet

Create a separate wallet for the Facilitator (distinct from your payment recipient wallet) and fund it with gas tokens from the faucet:

<Tabs>
<TabItem value="TRON" label="TRON">

1. In TronLink, create a new account (click avatar → "Add Account" → "Create")
2. Go to the [Nile Testnet Faucet](https://nileex.io/join/getJoinPage) to claim test TRX for the new account (used to pay transaction fees)
3. Export the private key for this new account: **Settings → Account Management → Export Private Key**

</TabItem>
<TabItem value="BSC" label="BSC">

1. In MetaMask, create a new account (click account icon → "Add Account" → "Create Account")
2. Go to the [BSC Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet) to claim test BNB for the new account (used to pay transaction fees)
3. Export the private key for this new account: **Account Details → Export Private Key**

</TabItem>
</Tabs>

### Step 2: Clone and Configure the Facilitator

Open a **new terminal window** and run the following commands:

```bash
# Clone the demo project (which includes the Facilitator implementation)
git clone https://github.com/BofAI/x402-demo.git
cd x402-demo

# Install dependencies
pip install -r requirements.txt

# Create your config file from the template
cp .env.sample .env
```

Open the `.env` file in the `x402-demo` directory with a text editor and fill in the following:

<Tabs>
<TabItem value="TRON" label="TRON">

```bash
# Private key of the dedicated Facilitator wallet (used to pay blockchain transaction fees)
# Note: this is the dedicated wallet created in Step 1, NOT your payment recipient wallet
TRON_PRIVATE_KEY=your_facilitator_wallet_private_key_here

# TronGrid API Key (required for mainnet, can be left blank for testnet)
# Apply at: https://www.trongrid.io/
TRON_GRID_API_KEY=
```

</TabItem>
<TabItem value="BSC" label="BSC">

```bash
# Private key of the dedicated Facilitator wallet (used to pay blockchain transaction fees)
# Note: this is the dedicated wallet created in Step 1, NOT your payment recipient wallet
BSC_PRIVATE_KEY=your_facilitator_wallet_private_key_here
```

</TabItem>
</Tabs>

### Step 3: Start the Facilitator Service

```bash
./start.sh facilitator
```

**On successful startup, you should see:**

```
Facilitator running on http://localhost:8001
Supported endpoints:
  GET  /supported
  POST /verify
  POST /settle
  POST /fee/quote
```

> ✅ **Success indicator:** The terminal shows `Facilitator running on http://localhost:8001` — keep this terminal window open

### Step 4: Use the Self-Hosted Facilitator in server.py

<Tabs>
<TabItem value="TRON" label="TRON">

```python
from fastapi import FastAPI
from bankofai.x402.server import X402Server
from bankofai.x402.fastapi import x402_protected
from bankofai.x402.facilitator import FacilitatorClient
from bankofai.x402.config import NetworkConfig

app = FastAPI()

# Your payment recipient wallet address
PAY_TO_ADDRESS = "your_TRON_wallet_address_here"

# Self-hosted Facilitator address (local by default; update to your server's public address for production)
FACILITATOR_URL = "http://localhost:8001"

# Initialize x402 server and connect to the self-hosted Facilitator
server = X402Server()
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    schemes=["exact_permit"],
    network=NetworkConfig.TRON_NILE,  # Testnet; change to TRON_MAINNET for production
    pay_to=PAY_TO_ADDRESS,
)
async def protected_endpoint():
    return {"data": "This content requires payment to access!"}


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

# Your payment recipient wallet address
PAY_TO_ADDRESS = "your_BSC_wallet_address_here_0x..."

# Self-hosted Facilitator address (local by default; update to your server's public address for production)
FACILITATOR_URL = "http://localhost:8001"

# Initialize x402 server, register BSC mechanisms, and connect to the self-hosted Facilitator
server = X402Server()
server.register(NetworkConfig.BSC_TESTNET, ExactPermitEvmServerMechanism())
server.register(NetworkConfig.BSC_TESTNET, ExactEvmServerMechanism())
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    network=NetworkConfig.BSC_TESTNET,  # Testnet; change to BSC_MAINNET for production
    pay_to=PAY_TO_ADDRESS,
    schemes=["exact_permit"],
)
async def protected_endpoint():
    return {"data": "This content requires payment to access!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

</TabItem>
</Tabs>

> ✅ **Done!** Your server now routes all payment verification and settlement through your local Facilitator on port 8001.

### Deploy the Self-Hosted Facilitator to a Server (Optional)

If you want to run the self-hosted Facilitator in production (rather than just local testing), deploy `x402-demo` to your server and update `FACILITATOR_URL` to your server's public address, for example:

```python
FACILITATOR_URL = "https://your-server.com"
```

See the [x402-facilitator repository](https://github.com/BofAI/x402-facilitator) for deployment documentation.

---

## Facilitator API Endpoints

Whether using the official service or a self-hosted instance, the Facilitator provides the following standard API endpoints:

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/` | GET | Retrieve basic service information |
| `/supported` | GET | Query supported feature configuration |
| `/fee/quote` | POST | Get estimated fee quote |
| `/verify` | POST | Verify payment payload validity |
| `/settle` | POST | Execute on-chain settlement |

---

## Fee Structure

The Facilitator supports flexible service fee configurations:

- **Base Fee**: A fixed service fee per transaction (e.g., `1 USDT`).
- **Percentage Fee**: A percentage-based fee calculated from the transaction amount.
- **No Fee Mode**: Supports zero-fee operation.

Detailed fee information is returned via the `/fee/quote` endpoint and included in the Payment Requirements sent from the server to the client.

---

## Trust Model

The x402 protocol is designed around **minimal trust assumptions**:

- **Signature-Based Authorization**: The Facilitator can only transfer funds within the scope explicitly authorized by the client's signature.
- **Direct Fund Flow**: Funds move directly from the client to the seller (and partially to the Facilitator if fees apply), without passing through a pooled account.
- **On-Chain Transparency**: All transactions are publicly verifiable on-chain.

Even a **malicious Facilitator** cannot:

- Transfer funds beyond the client's authorized limit.
- Redirect funds to an address not specified in the signed payload.
- Modify any signed payment terms.

---

## Summary

Within the x402 protocol architecture, the **Facilitator** serves as an independent on-chain verification and settlement layer. It enables servers to securely confirm payments and complete blockchain settlements without deploying a full blockchain infrastructure.

---

## Next Steps

- [Facilitator API Key](./facilitator-api-key.md) — How to apply for and configure an API Key for the official Facilitator (step-by-step with screenshots)
- [Quickstart for Sellers](../getting-started/quickstart-for-sellers.md) — Complete server-side integration walkthrough
- [Wallet](./wallet.md) — Learn how to manage wallets used for payments
- [Network and Token Support](./network-and-token-support.md) — Learn about supported networks and tokens
