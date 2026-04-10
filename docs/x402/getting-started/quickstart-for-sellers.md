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

---

## Prerequisites

### Verify Your Environment

In your terminal (Terminal on macOS/Linux, or PowerShell/Command Prompt on Windows), run the following commands to confirm the required tools are installed:

```bash
python --version   # Requires 3.11 or higher
pip --version      # Installed alongside Python
git --version      # Version control tool
```

If any command says "command not found", install it first:
- Python: go to [python.org](https://www.python.org/downloads/) to download the installer
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
| **TRON Wallet Address** | Wallet address starting with `T` | Copy from TronLink |
| **BSC Wallet Address** | Wallet address starting with `0x` | Copy from MetaMask |
| **Test TRX** | TRON testnet fee token | [Nile Faucet](https://nileex.io/join/getJoinPage) |
| **Test USDT/USDD (TRON)** | TRON test payment token (both USDT and USDD supported) | [Nile Faucet](https://nileex.io/join/getJoinPage) |
| **Test BNB** | BSC testnet fee token | [BSC Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet) |
| **Test USDT (BSC)** | BSC test payment token | [BSC Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet) |

**Testnet vs. Mainnet:**

- **Testnet**: Uses free test tokens, no real funds involved, suitable for development and debugging. Network identifiers: `tron:nile` / `eip155:97`
- **Mainnet**: Involves real payments, used when going live. Network identifiers: `tron:mainnet` / `eip155:56`

---

## Step 1: Install the x402 SDK

Open your terminal and run the following install command:

**Recommended (install directly from GitHub, ideal for getting started quickly):**

```bash
pip install "bankofai-x402[tron,fastapi] @ git+https://github.com/BofAI/x402.git#subdirectory=python/x402"
```

After installation, run the following command to verify it succeeded:

```bash
python -c "import bankofai.x402; print('SDK installed successfully!')"
```

> ✅ **Success:** Terminal outputs `SDK installed successfully!`

**Alternative (install from source, for developers who need to modify the source code):**

```bash
# Clone the repository
git clone https://github.com/BofAI/x402.git
cd x402/python/x402

# Install (with FastAPI support)
pip install -e ".[fastapi]"
```

> 💡 **Permission error?** Prefix the command with `sudo` (macOS/Linux), or run PowerShell as Administrator (Windows).

---

## Step 2: Create a Payment-Protected API Server

Now let's create an API server with payment protection. The x402 SDK provides an `@x402_protected` decorator — simply add it to any endpoint you want to charge for, and the SDK will automatically handle all payment verification logic.

In your project directory, create a new file named `server.py` and paste in the following code:

<Tabs>
<TabItem value="TRON" label="TRON">

```python
from fastapi import FastAPI, Request
from bankofai.x402.server import X402Server
from bankofai.x402.fastapi import x402_protected
from bankofai.x402.facilitator import FacilitatorClient
from bankofai.x402.config import NetworkConfig

app = FastAPI()

# ========== Modify the following two settings ==========
# Replace the address below with your TRON wallet address from Prerequisites (used to receive payments)
PAY_TO_ADDRESS = "YourTronWalletAddressHere"

# Facilitator service URL (will be started in Step 3, default address does not need to change)
FACILITATOR_URL = "http://localhost:8001"
# ========================================================

# Initialize x402 server
server = X402Server()
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

# Add payment protection to this API endpoint
@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],          # Charge per request (adjust as needed)
    schemes=["exact_permit"],         # Payment scheme
    network=NetworkConfig.TRON_NILE, # Using testnet now (change to TRON_MAINNET when going live)
    pay_to=PAY_TO_ADDRESS,           # Your receiving wallet address
)
async def protected_endpoint(request: Request):
    return {"data": "This is premium content!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

</TabItem>
<TabItem value="BSC" label="BSC">

```python
from fastapi import FastAPI, Request
from bankofai.x402.server import X402Server
from bankofai.x402.fastapi import x402_protected
from bankofai.x402.facilitator import FacilitatorClient
from bankofai.x402.config import NetworkConfig
from bankofai.x402.mechanisms.evm.exact_permit import ExactPermitEvmServerMechanism
from bankofai.x402.mechanisms.evm.exact import ExactEvmServerMechanism

app = FastAPI()

# ========== Modify the following two settings ==========
# Replace the address below with your BSC wallet address from Prerequisites (used to receive payments)
PAY_TO_ADDRESS = "0xYourBscWalletAddressHere"

# Facilitator service URL (will be started in Step 3, default address does not need to change)
FACILITATOR_URL = "http://localhost:8001"
# ========================================================

# Initialize x402 server and register BSC payment mechanisms
server = X402Server()
server.register(NetworkConfig.BSC_TESTNET, ExactPermitEvmServerMechanism())
server.register(NetworkConfig.BSC_TESTNET, ExactEvmServerMechanism())
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

# Add payment protection to this API endpoint
@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],            # Charge per request
    network=NetworkConfig.BSC_TESTNET, # Using testnet now (change to BSC_MAINNET when going live)
    pay_to=PAY_TO_ADDRESS,             # Your receiving wallet address
    schemes=["exact_permit"],
)
async def protected_endpoint(request: Request):
    return {"data": "This is premium content!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

</TabItem>
</Tabs>

**Key Configuration Parameters:**

| Parameter | Description | Example Value |
|------|------|--------|
| `PAY_TO_ADDRESS` | Your receiving wallet address | `TXyz...` (TRON) or `0xAbc...` (BSC) |
| `prices` | Price per request | `["0.0001 USDT"]` |
| `network` | Network to use | Testnet: `TRON_NILE` / `BSC_TESTNET` |
| `schemes` | Payment scheme | `["exact_permit"]` |

**How it works:** When an unpaid request reaches your API, the server automatically returns an HTTP 402 (Payment Required) response with payment instructions in the response headers. The client SDK automatically completes the payment and re-sends the request — the process is nearly invisible to the end user.

---

## Step 3: Connect to a Facilitator

### What is a Facilitator?

Simply put, a Facilitator is an **automated settlement service**: when someone pays your API, the Facilitator verifies that the payment is genuine and settles it on the blockchain, ensuring funds are recorded on-chain.

**You must complete the Facilitator configuration before starting your API server.**

### Two Options — Which Should You Choose?

| | Official Facilitator (Recommended) | Self-Hosted Facilitator |
|---|---|---|
| **Maintenance required** | No — officially hosted | Yes — you run it yourself |
| **Wallet private key required** | No | Yes (to pay transaction fees) |
| **Difficulty** | Low (just apply for an API Key) | Medium (requires deployment and configuration) |
| **Best for** | Fast deployment, most users | Full control over fee strategy |

<Tabs>
<TabItem value="official" label="✅ Official Facilitator (Recommended)">

The officially hosted Facilitator service requires **no infrastructure to maintain**. You can also refer to [Official Facilitator](../core-concepts/OfficialFacilitator.md) for details.

#### 3.1 Configure the Service Endpoint

Set your `FACILITATOR_URL` to the official Facilitator service address:

```
https://facilitator.bankofai.io
```

This is the address your x402 server uses to verify and settle payments — **for API calls only**, no need to open it in a browser.

> ⚠️ **Without an API Key, this endpoint is rate-limited to 1 request per minute per IP address.** This is sufficient for testing, but in production it will throttle your API. Continue to step 3.2 to apply for an API Key.

#### 3.2 Apply for an API Key

Apply for a free API Key in the admin dashboard:

[https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io)

1. Open the link above in your browser
2. Click **TronLink** to log in with your wallet (for identity verification only — **no charges will be made**)
3. After logging in, go to the Dashboard and click **"Create API Key"**
4. Confirm, then click **View** in the Dashboard to see and copy your API Key

With an API Key, the rate limit increases to **1,000 requests/minute**, sufficient for production use.

> 📖 **Detailed step-by-step guide** available at: [Official Facilitator](../core-concepts/OfficialFacilitator.md)

> ⚠️ **Security reminder:** Your API Key is a service credential — **treat it like a password and never commit it to Git**

#### 3.3 Configure the `.env` File

In your project directory (where `server.py` is located), create or edit the `.env` file and add the following:

```bash
# Official Facilitator service URL
FACILITATOR_URL=https://facilitator.bankofai.io

# API Key (apply at admin-facilitator.bankofai.io) — SDK passes it automatically via the X-API-KEY header
FACILITATOR_API_KEY=paste_your_api_key_here
```

#### 3.4 Update server.py to Connect to the Official Facilitator

Update the Facilitator initialization section in `server.py` to read configuration from environment variables (add `import os` at the top of the file):

<Tabs>
<TabItem value="TRON" label="TRON">

```python
import os
# ... other imports unchanged ...

# Official Facilitator service URL (read from environment variable)
# SDK automatically reads FACILITATOR_API_KEY from the environment — no need to pass it explicitly
FACILITATOR_URL = os.getenv("FACILITATOR_URL", "https://facilitator.bankofai.io")

# Initialize x402 server and connect to Official Facilitator
server = X402Server()
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))
```

</TabItem>
<TabItem value="BSC" label="BSC">

```python
import os
# ... other imports unchanged ...

# Official Facilitator service URL (read from environment variable)
# SDK automatically reads FACILITATOR_API_KEY from the environment — no need to pass it explicitly
FACILITATOR_URL = os.getenv("FACILITATOR_URL", "https://facilitator.bankofai.io")

# Initialize x402 server, register BSC mechanisms, connect to Official Facilitator
server = X402Server()
server.register(NetworkConfig.BSC_TESTNET, ExactPermitEvmServerMechanism())
server.register(NetworkConfig.BSC_TESTNET, ExactEvmServerMechanism())
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))
```

</TabItem>
</Tabs>

> ✅ **Done!** The Official Facilitator is configured — **no local service to start**. Proceed directly to Step 4 to test.

</TabItem>
<TabItem value="selfhost" label="Self-Hosted Facilitator">

The self-hosted option gives you full control over fee strategy and network configuration. It is intended for advanced users with specific customization requirements.

> ⚠️ **Security reminder — please read first:**
> - You need the private key of a **dedicated wallet** to pay blockchain transaction fees — **this wallet should be separate from your receiving wallet**
> - The Facilitator wallet only needs a small amount of tokens (for fees) — do not deposit large amounts
> - The private key is set via environment variable — **never commit it to Git or share it with anyone**

#### 3.1 Prepare Prerequisites

Before starting, make sure you have:

- **Python 3.11+** and **Git** (confirmed in the Prerequisites section above)
- **PostgreSQL** — the Facilitator stores payment records in a database.

  <Tabs>
  <TabItem value="mac" label="macOS">

  ```bash
  brew install postgresql@16
  brew services start postgresql@16
  createdb x402
  ```

  </TabItem>
  <TabItem value="linux" label="Linux">

  **Ubuntu / Debian:**
  ```bash
  sudo apt install -y postgresql
  sudo systemctl start postgresql
  sudo -u postgres createdb x402
  ```

  **Amazon Linux / CentOS / RHEL / Fedora:**
  ```bash
  sudo dnf install -y postgresql15 postgresql15-server   # Amazon Linux 2023; other distros: postgresql-server
  sudo postgresql-setup --initdb
  sudo systemctl start postgresql
  sudo systemctl enable postgresql
  sudo -u postgres createdb x402
  ```

  **Arch Linux:**
  ```bash
  sudo pacman -S postgresql
  sudo -u postgres initdb -D /var/lib/postgres/data
  sudo systemctl start postgresql
  sudo -u postgres createdb x402
  ```

  </TabItem>
  <TabItem value="windows" label="Windows">

  Download and run the installer from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/), then create a database named `x402` via pgAdmin or psql.

  </TabItem>
  </Tabs>

  **Set a password for the `postgres` user** (required for the connection string):

  ```bash
  sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'yourpassword';"
  ```

  > Replace `yourpassword` with a password of your choice. You will use it in the connection string below.

  **Enable password authentication** (Linux only — required on most distributions):

  By default, PostgreSQL uses `ident` authentication on Linux, which only allows connections when the OS username matches the database username. You need to change it to `md5` (password-based) for the Facilitator to connect:

  ```bash
  # Find the pg_hba.conf file
  sudo find / -name pg_hba.conf 2>/dev/null
  # Typical location: /var/lib/pgsql/data/pg_hba.conf (Amazon Linux / CentOS)
  #                   /etc/postgresql/*/main/pg_hba.conf (Ubuntu / Debian)
  ```

  Open the file and change `ident` to `md5` for IPv4 and IPv6 local connections:

  ```
  # IPv4 local connections:
  host    all             all             127.0.0.1/32            md5
  # IPv6 local connections:
  host    all             all             ::1/128                 md5
  ```

  Then restart PostgreSQL to apply:

  ```bash
  sudo systemctl restart postgresql
  ```

  Connection string: `postgresql+asyncpg://postgres:yourpassword@localhost:5432/x402`

- **A dedicated Facilitator wallet** — create a new wallet (separate from your receiving wallet, following the same steps in Prerequisites), and claim testnet tokens from the faucet to cover transaction fees.

#### 3.2 Clone and Install

Open a **new terminal window** and run:

```bash
# Clone the Facilitator service
git clone https://github.com/BofAI/x402-facilitator.git
cd x402-facilitator

# Install dependencies
pip install -r requirements.txt
```

#### 3.3 Configure the Service

Copy the example config and open it in a text editor:

```bash
cp config/facilitator.config.example.yaml config/facilitator.config.yaml
```

Fill in the required fields:

<Tabs>
<TabItem value="TRON" label="TRON">

```yaml
database:
  url: "postgresql+asyncpg://postgres:yourpassword@localhost:5432/x402"

facilitator:
  networks:
    tron:nile:                   # Use tron:mainnet when going live
      base_fee:
        USDT: 100                # 0.0001 USDT per settlement (adjust as needed)
        USDD: 100000000000000  # 0.0001 USDD (18 decimals; adjust as needed)
```

</TabItem>
<TabItem value="BSC" label="BSC">

```yaml
database:
  url: "postgresql+asyncpg://postgres:yourpassword@localhost:5432/x402"

facilitator:
  networks:
    bsc:testnet:                 # Use bsc:mainnet when going live
      base_fee:
        USDT: 100                # 0.0001 USDT per settlement (adjust as needed)
```

</TabItem>
</Tabs>

Then set the private key of your dedicated Facilitator wallet as an environment variable:

<Tabs>
<TabItem value="TRON" label="TRON">

```bash
# How to get it: TronLink → Settings → Account Management → Export Private Key
export AGENT_WALLET_PRIVATE_KEY=paste_your_facilitator_private_key_here

# TronGrid API Key (recommended for stable RPC access)
# Apply at: https://www.trongrid.io/
export TRON_GRID_API_KEY=paste_your_trongrid_api_key_here
```

</TabItem>
<TabItem value="BSC" label="BSC">

```bash
# How to get it: MetaMask → Account Details → Export Private Key
export AGENT_WALLET_PRIVATE_KEY=paste_your_facilitator_private_key_here
```

</TabItem>
</Tabs>

#### 3.4 Start the Facilitator Service

```bash
python src/main.py
```

**After a successful start, you should see output like:**

```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
```

> ✅ **Success:** Uvicorn is running on port 8001 — **keep this terminal window open, do not close it**

#### 3.5 Register an API Key (Optional)

If you want to track payment records per seller, register an API key using the built-in script:

```bash
python scripts/register_seller.py
# A random API key will be generated and printed — save it
```

Set this key on your server side:
```bash
export FACILITATOR_API_KEY=your_generated_key
```

The `FACILITATOR_URL = "http://localhost:8001"` in `server.py` is already configured for self-hosting — **no other changes needed**. Proceed to Step 4.

</TabItem>
</Tabs>

---

## Step 4: Start and Test Your API

### 4.1 Start the API Server

Open a **third terminal window** (do not close the previous ones), navigate to the directory containing `server.py`, and run:

```bash
python server.py
```

**After a successful start, you should see:**

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

> ✅ **Success:** Terminal shows `Uvicorn running on http://0.0.0.0:8000`

### 4.2 Test Unpaid Access (Should Be Rejected)

In any terminal, run:

```bash
curl http://localhost:8000/protected
```

**Expected result:** The server returns an HTTP 402 response with content similar to:

```json
{"error": "Payment required", "x402Version": 1}
```

> ✅ **This is exactly what we want!** It confirms that payment protection is working — unpaid requests are successfully blocked.

### 4.3 Test the Full Payment Flow

To test the complete pay → receive content flow, you need a client that can sign payments:

- [Human User Quickstart](./quickstart-for-human.md) — Call your paid API using code
- [AI Agent Quickstart](./quickstart-for-agent.md) — Configure an AI agent to call your API automatically

---

## Troubleshooting

| Issue | Solution |
|------|----------|
| `Connection refused` when connecting to Facilitator | If using **self-hosted**: confirm the Facilitator terminal from Step 3 is still running on port 8001 (`python src/main.py`). If using **official**: check that `FACILITATOR_URL` is correctly set to `https://facilitator.bankofai.io` |
| `ModuleNotFoundError: bankofai` | Re-run the install command from Step 1 |
| Wallet address format error | TRON addresses start with `T`; BSC addresses start with `0x` — check that the address was copied in full |
| Facilitator fails to start — database error | Confirm `database.url` in `config/facilitator.config.yaml` is correct and the PostgreSQL instance is running |
| Facilitator fails to start — wallet error | Confirm `AGENT_WALLET_PRIVATE_KEY` is exported in your terminal session with no extra spaces or line breaks |
| API Key invalid or rate limited (official) | Confirm `FACILITATOR_API_KEY` is correctly set; go to [admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io) to check the key status |
| `server.py` fails to start | Confirm `PAY_TO_ADDRESS` has been replaced with a real wallet address (do not leave the placeholder text) |

**Need more examples and references?**

- [Complete server example code](https://github.com/BofAI/x402-demo/tree/main/server)
- [Facilitator example code](https://github.com/BofAI/x402-demo/tree/main/facilitator)
- [Facilitator reference](../core-concepts/facilitator.md) — Full setup comparison for both options
- [Official Facilitator](../core-concepts/OfficialFacilitator.md) — Step-by-step guide with screenshots for the API Key

---

## Running on Mainnet

After fully validating on the testnet, only a few steps are needed to go live and accept real payments:

### 1. Update Server Configuration

Modify the `network` parameter in the `@x402_protected` decorator in `server.py`:

<Tabs>
<TabItem value="TRON" label="TRON">

```python
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    schemes=["exact_permit"],
    network=NetworkConfig.TRON_MAINNET,  # Changed from TRON_NILE to TRON_MAINNET
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
    network=NetworkConfig.BSC_MAINNET,  # Changed from BSC_TESTNET to BSC_MAINNET
    pay_to=PAY_TO_ADDRESS,
)
```

</TabItem>
</Tabs>

### 2. Update Facilitator Configuration

<Tabs>
<TabItem value="TRON" label="TRON">

1. **Apply for a TronGrid API Key**: go to [TronGrid](https://www.trongrid.io/) to register and create an API Key, then set it as an environment variable:

   ```bash
   export TRON_GRID_API_KEY=your_trongrid_api_key
   ```

   :::note
   When `TRON_GRID_API_KEY` is not set, requests may be rate-limited under heavy workloads. For production, set your own `TRON_GRID_API_KEY` to ensure reliability.
   :::

2. **Replace the private key**: update `AGENT_WALLET_PRIVATE_KEY` to the mainnet Facilitator wallet's private key:

   ```bash
   export AGENT_WALLET_PRIVATE_KEY=your_mainnet_facilitator_private_key
   ```

3. **Fund the fee wallet**: transfer sufficient real TRX to the Facilitator mainnet wallet (to pay Energy and Bandwidth fees).

4. **Update the network config**: open `config/facilitator.config.yaml` and change the network key from `tron:nile` to `tron:mainnet`:

   ```yaml
   facilitator:
     networks:
       tron:mainnet:              # Changed from tron:nile
         base_fee:
           USDT: 100
           USDD: 100000000000000  # 0.0001 USDD (18 decimals; adjust as needed)
   ```

5. **Restart the service**: `python src/main.py`

</TabItem>
<TabItem value="BSC" label="BSC">

1. **Fund the fee wallet**: transfer sufficient real BNB to the Facilitator mainnet wallet (to pay Gas fees).

2. **Replace the private key**: update `AGENT_WALLET_PRIVATE_KEY` to the mainnet Facilitator wallet's private key:

   ```bash
   export AGENT_WALLET_PRIVATE_KEY=your_mainnet_facilitator_private_key
   ```

3. **Update the network config**: open `config/facilitator.config.yaml` and change the network key from `bsc:testnet` to `bsc:mainnet`:

   ```yaml
   facilitator:
     networks:
       bsc:mainnet:               # Changed from bsc:testnet
         base_fee:
           USDT: 100
   ```

4. **Restart the service**: `python src/main.py`

</TabItem>
</Tabs>

### 3. Confirm Your Receiving Wallet Address

Ensure that `PAY_TO_ADDRESS` is set to a **real mainnet wallet address** you control, and confirm you have a backup of the seed phrase or private key for that wallet.

### 4. Perform a Small Real-Money Test Before Going Live

> ⚠️ **Mainnet warning — real funds are involved. Please follow these steps carefully:**
>
> 1. Ensure all functionality (payment, receipt, error handling) has been fully validated on the testnet
> 2. After going live on mainnet, **start with one minimum-amount real test (e.g. 0.0001 USDT)**
> 3. Confirm the transaction succeeded on the blockchain explorer ([TronScan](https://tronscan.org) or [BscScan](https://bscscan.com))
> 4. Open your receiving wallet and confirm the funds have arrived
> 5. Only open your API to the public after confirming everything is correct

---

## Next Steps

- View [demo examples](https://github.com/BofAI/x402-demo/tree/main/server) for more complex payment flows
- Read the [core concepts](../core-concepts/http-402.md) to understand how the x402 protocol works
- Want detailed configuration for both Facilitator options? See the [Facilitator documentation](../core-concepts/facilitator.md)
- Experience calling a paid API from the [user perspective](./quickstart-for-human.md), or configure an [AI agent](./quickstart-for-agent.md) to call your service automatically

---

## Summary

Congratulations 🎉! You've completed the Seller Quickstart. Here's everything you accomplished:

| Step | What You Did |
|------|----------|
| **Prerequisites** | Created a receiving wallet, obtained test tokens, reviewed configuration parameters |
| **Step 1** | Installed the x402 SDK |
| **Step 2** | Created an API server with payment protection |
| **Step 3** | Configured and connected the Facilitator settlement service |
| **Step 4** | Verified payment protection and the full payment flow |

Your API is now ready to accept blockchain payments via the x402 protocol!
