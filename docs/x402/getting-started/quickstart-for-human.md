import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart for Human Users

## Who Is This Guide For?

This guide is for developers who want to **call an x402-protected API from code** and have payments handled automatically. When you're done, you'll have a working Python or TypeScript script that detects a 402 response, pays for access, and retrieves the protected content — all without manual steps.

> **Testnet first:** This guide uses testnet by default. You can safely follow every step without spending real money.

---

## Prerequisites

### First: Private Key Security

> 🔴 **Private key security warning — please read before you begin:**
>
> - Your **private key** is the sole credential that controls your wallet. Anyone who has it can access your funds completely.
> - This guide requires you to configure a private key. Follow these rules strictly:
>   1. **Never** write your private key directly in code files (e.g. `client.py`)
>   2. **Never** commit a file containing a private key to Git or push it to GitHub
>   3. **Never** send your private key via messaging apps, email, or chat
>   4. Store it only in a local `.env` file or as a system environment variable
>   5. For testing, create a **dedicated test wallet** holding only a small amount of test tokens — never use a wallet holding real assets

### Checklist Before You Start

- [ ] **Python 3.10+** or **Node.js 18+** installed (depending on your chosen language)
- [ ] A dedicated **test wallet** created (see below)
- [ ] Test tokens claimed (free)
- [ ] A target x402-protected API URL (or use our demo endpoint)

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

## Step One: Install the SDK

<Tabs groupId="language">
<TabItem value="python" label="Python">

Run the following in your terminal:

```bash
pip install "bankofai-x402[tron] @ git+https://github.com/BofAI/x402.git#subdirectory=python/x402"
```

Also install EVM (BSC) dependencies:

```bash
pip install eth_account web3
```

Verify the installation:

```bash
python -c "import bankofai.x402; print('Installation successful!')"
```

> ✅ **Success check:** Terminal prints `Installation successful!`

Or install from source:

```bash
git clone https://github.com/BofAI/x402.git
cd x402/python/x402
pip install -e .
```

</TabItem>
<TabItem value="ts" label="TypeScript">

In your project directory, run:

```bash
npm install @bankofai/x402 tronweb dotenv
```

Since `@bankofai/x402` is an ESM module, add the following to your `package.json` if not already present:

```json
{
  "type": "module"
}
```

> 💡 If you see `ERR_PACKAGE_PATH_NOT_EXPORTED` when running with `npx tsx`, this `"type": "module"` entry is usually the fix.

> ✅ **Success check:** `npm install` completes and `node_modules/@bankofai` folder exists

</TabItem>
</Tabs>

---

:::info Wallet Management
x402 SDK uses [Agent Wallet](../../Agent-Wallet/QuickStart.md) to resolve and manage wallet credentials. Agent Wallet is automatically installed as a dependency of x402. Private key resolution priority:
1. Encrypted wallet file (imported via the Agent Wallet CLI)
2. Environment variable `AGENT_WALLET_PRIVATE_KEY`

This guide uses the environment variable method.
:::

## Step Two: Configure Your Private Key

**Never put your private key in code.** Store it as an environment variable so it stays out of your source files. Replace `your_private_key_here` with the private key you exported in the Prerequisites step.

```bash
export AGENT_WALLET_PRIVATE_KEY=your_private_key_here
```

> 💡 **Tip:** To make this permanent across terminal sessions, add the line to your shell profile:
> ```bash
> echo 'export AGENT_WALLET_PRIVATE_KEY=your_key' >> ~/.zshrc   # for zsh (macOS default)
> echo 'export AGENT_WALLET_PRIVATE_KEY=your_key' >> ~/.bashrc  # for bash (Linux default)
> source ~/.zshrc   # or source ~/.bashrc — apply immediately without restarting the terminal
> ```

Verify the variable was set:

```bash
echo $AGENT_WALLET_PRIVATE_KEY
```

> ✅ **Success check:** Terminal prints your private key string (not blank)

<Tabs>
<TabItem value="TRON" label="TRON">

**Optional:** For production TRON workloads, configure a TronGrid API Key for better RPC reliability:

```bash
export TRON_GRID_API_KEY="your_trongrid_api_key_here"
```

> 💡 **How to get a TronGrid API Key:** Register for free at [TronGrid](https://www.trongrid.io/), create an API Key, and paste it above.

:::note Fallback RPC Endpoint
When `TRON_GRID_API_KEY` is not set, mainnet RPC calls are automatically
routed through a BANK OF AI-operated public endpoint
(`https://api.trongrid.io` proxied via BANK OF AI). This endpoint has no
guaranteed SLA and may be rate-limited under high load. For production
workloads, set your own `TRON_GRID_API_KEY` to ensure reliability and
independence from BANK OF AI's infrastructure.
:::

</TabItem>
<TabItem value="BSC" label="BSC">

No additional configuration needed for BSC.

</TabItem>
</Tabs>

---

## Step Three: Write and Run the Client Code

Create a new file (e.g. `client.py` or `client.ts`) and paste the code for your chosen chain and language:

<Tabs groupId="chain">
<TabItem value="tron" label="TRON">
<Tabs groupId="language">
<TabItem value="python" label="Python">

```python
import asyncio
import httpx

from bankofai.x402.clients import X402Client, X402HttpClient, SufficientBalancePolicy
from bankofai.x402.mechanisms.tron.exact_permit import ExactPermitTronClientMechanism
from bankofai.x402.mechanisms.tron.exact_gasfree.client import ExactGasFreeClientMechanism
from bankofai.x402.signers.client import TronClientSigner
from bankofai.x402.utils.gasfree import GasFreeAPIClient
from bankofai.x402.config import NetworkConfig


# ========== Configuration ==========
# The x402-protected API you want to call.
# The URL below is our demo endpoint — use it to verify your setup works end-to-end.
SERVER_URL = "https://x402-demo.bankofai.io/protected-nile"
# ====================================

# GasFree API clients (routed through BANK OF AI proxy — no API keys needed)
gasfree_clients = {
    "tron:nile": GasFreeAPIClient(NetworkConfig.get_gasfree_api_base_url("tron:nile")),
    "tron:mainnet": GasFreeAPIClient(NetworkConfig.get_gasfree_api_base_url("tron:mainnet")),
}


async def main():
    # Initialize signer via agent-wallet (resolves wallet from environment automatically)
    signer = await TronClientSigner.create()

    # Create x402 client and register payment mechanisms and balance policy
    x402_client = X402Client()
    x402_client.register("tron:*", ExactPermitTronClientMechanism(signer))
    x402_client.register("tron:*", ExactGasFreeClientMechanism(signer, clients=gasfree_clients))
    x402_client.register_policy(SufficientBalancePolicy)

    async with httpx.AsyncClient(timeout=120) as http_client:
        client = X402HttpClient(http_client, x402_client)

        # Make the request — the SDK handles payment automatically
        response = await client.get(SERVER_URL)

        print(f"Status: {response.status_code}")
        print("Response:", response.text)


asyncio.run(main())
```

**Run the script:**

```bash
python client.py
```

**Expected output:**

```
Status: 200
Response: {"data": "This is premium content!"}
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```typescript
import 'dotenv/config'
import {
  X402Client, X402FetchClient,
  ExactPermitTronClientMechanism, ExactGasFreeClientMechanism,
  TronClientSigner, SufficientBalancePolicy,
  GasFreeAPIClient, getGasFreeApiBaseUrl,
} from '@bankofai/x402'

// ========== Configuration ==========
// The x402-protected API you want to call.
// The URL below is our demo endpoint — use it to verify your setup works end-to-end.
const SERVER_URL = 'https://x402-demo.bankofai.io/protected-nile'
// ====================================

async function main(): Promise<void> {
  // Initialize signer via agent-wallet (resolves wallet from environment automatically)
  const signer = await TronClientSigner.create()

  // Create x402 client and register payment mechanisms and balance policy
  const x402 = new X402Client()
  x402.register('tron:*', new ExactPermitTronClientMechanism(signer))
  x402.register('tron:*', new ExactGasFreeClientMechanism(signer, {
    'tron:nile': new GasFreeAPIClient(getGasFreeApiBaseUrl('tron:nile')),
    'tron:mainnet': new GasFreeAPIClient(getGasFreeApiBaseUrl('tron:mainnet')),
  }))
  x402.registerPolicy(SufficientBalancePolicy)

  const client = new X402FetchClient(x402)

  // Make the request — the SDK handles payment automatically
  const response = await client.get(SERVER_URL)

  console.log(`Status: ${response.status}`)

  // Parse the payment receipt (optional)
  const paymentResponse = response.headers.get('payment-response')
  if (paymentResponse) {
    const jsonString = Buffer.from(paymentResponse, 'base64').toString('utf8')
    const settleResponse = JSON.parse(jsonString)
    console.log(`Transaction hash: ${settleResponse.transaction}`)
  }

  // Print the response body
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await response.json()
    console.log('Response:', body)
  }
}

main().catch(console.error)
```

**Run the script:**

```bash
npx tsx client.ts
```

**Expected output:**

```
Status: 200
Transaction hash: abc123...
Response: { data: 'This is premium content!' }
```

</TabItem>
</Tabs>
</TabItem>
<TabItem value="bsc" label="BSC">
<Tabs groupId="language">
<TabItem value="python" label="Python">

```python
import asyncio
import httpx

from bankofai.x402.clients import X402Client, X402HttpClient, SufficientBalancePolicy
from bankofai.x402.mechanisms.evm.exact_permit import ExactPermitEvmClientMechanism
from bankofai.x402.mechanisms.evm.exact import ExactEvmClientMechanism
from bankofai.x402.signers.client import EvmClientSigner


# ========== Configuration ==========
SERVER_URL = "https://x402-demo.bankofai.io/protected-bsc-testnet"
# ====================================


async def main():
    # Initialize signer via agent-wallet (resolves wallet from environment automatically)
    signer = await EvmClientSigner.create()

    # Create x402 client and register BSC mechanisms and balance policy
    x402_client = X402Client()
    x402_client.register("eip155:*", ExactPermitEvmClientMechanism(signer))
    x402_client.register("eip155:*", ExactEvmClientMechanism(signer))
    x402_client.register_policy(SufficientBalancePolicy)

    async with httpx.AsyncClient(timeout=120) as http_client:
        client = X402HttpClient(http_client, x402_client)

        # Make the request — the SDK handles payment automatically
        response = await client.get(SERVER_URL)

        print(f"Status: {response.status_code}")
        print("Response:", response.text)


asyncio.run(main())
```

**Run the script:**

```bash
python client.py
```

**Expected output:**

```
Status: 200
Response: {"data": "This is premium content!"}
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```typescript
import 'dotenv/config'
import {
  X402Client, X402FetchClient,
  ExactPermitEvmClientMechanism, ExactEvmClientMechanism,
  EvmClientSigner, SufficientBalancePolicy,
} from '@bankofai/x402'

// ========== Configuration ==========
const SERVER_URL = 'https://x402-demo.bankofai.io/protected-bsc-testnet'
// ====================================

async function main(): Promise<void> {
  // Initialize signer via agent-wallet (resolves wallet from environment automatically)
  const signer = await EvmClientSigner.create()

  // Create x402 client and register BSC mechanisms and balance policy
  const x402 = new X402Client()
  x402.register('eip155:*', new ExactPermitEvmClientMechanism(signer))
  x402.register('eip155:*', new ExactEvmClientMechanism(signer))
  x402.registerPolicy(SufficientBalancePolicy)

  const client = new X402FetchClient(x402)

  // Make the request — the SDK handles payment automatically
  const response = await client.get(SERVER_URL)

  console.log(`Status: ${response.status}`)

  // Parse the payment receipt (optional)
  const paymentResponse = response.headers.get('payment-response')
  if (paymentResponse) {
    const jsonString = Buffer.from(paymentResponse, 'base64').toString('utf8')
    const settleResponse = JSON.parse(jsonString)
    console.log(`Transaction hash: ${settleResponse.transaction}`)
  }

  // Print the response body
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await response.json()
    console.log('Response:', body)
  }
}

main().catch(console.error)
```

**Run the script:**

```bash
npx tsx client.ts
```

**Expected output:**

```
Status: 200
Transaction hash: abc123...
Response: { data: 'This is premium content!' }
```

</TabItem>
</Tabs>
</TabItem>
</Tabs>

---

## Step Four: Error Troubleshooting

If your script throws an error, refer to the table below:

| Error | Cause | Fix |
|-------|-------|-----|
| Environment variable is `None` or not set | Private key env var not configured | Re-run the `export` command in **the same terminal window** where you run the script |
| `Insufficient balance` / balance error | Test wallet doesn't have enough USDT/USDD | Go back to Prerequisites and claim test tokens from the faucet |
| `UnsupportedNetworkError` | Registered network doesn't match the server | Confirm `SERVER_URL` network matches your registered mechanism (`tron:*` for TRON, `eip155:*` for BSC) |
| `InsufficientAllowanceError` | Token allowance too low | The SDK usually handles this automatically; if it persists, check your wallet balance |
| `Connection timeout` | Network or request timeout | Check your connection, or increase `timeout=60.0` to a larger value |
| `ModuleNotFoundError` | SDK not installed | Re-run the Step One install command |

If you need finer-grained error handling in your code:

<Tabs groupId="chain">
<TabItem value="tron" label="TRON">
<Tabs groupId="language">
<TabItem value="python" label="Python">

```python
from bankofai.x402.exceptions import (
    X402Error,
    InsufficientAllowanceError,
    SignatureCreationError,
    UnsupportedNetworkError,
)

try:
    response = await client.get(SERVER_URL)
    print(f"Status: {response.status_code}")
    print("Response:", response.text)

except UnsupportedNetworkError as e:
    print(f"Network not supported (check your registered mechanism): {e}")

except InsufficientAllowanceError as e:
    print(f"Insufficient token allowance (check wallet balance): {e}")

except SignatureCreationError as e:
    print(f"Signature failed (check your private key): {e}")

except X402Error as e:
    print(f"Payment error: {e}")
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```typescript
try {
  const response = await client.get(SERVER_URL)
  if (response.status === 200) {
    console.log('Success:', await response.json())
  } else {
    console.error(`Request failed: ${response.status}`)
    console.error(await response.text())
  }
} catch (error) {
  if (error.message.includes('No mechanism registered')) {
    console.error('Network not supported — check your registered mechanism')
  } else if (error.message.includes('allowance')) {
    console.error('Insufficient token allowance — check wallet balance')
  } else {
    console.error('Payment error:', error.message)
  }
}
```

</TabItem>
</Tabs>
</TabItem>
<TabItem value="bsc" label="BSC">
<Tabs groupId="language">
<TabItem value="python" label="Python">

```python
from bankofai.x402.exceptions import (
    X402Error,
    InsufficientAllowanceError,
    SignatureCreationError,
    UnsupportedNetworkError,
)

try:
    response = await client.get(SERVER_URL)
    print(f"Status: {response.status_code}")
    print("Response:", response.text)

except UnsupportedNetworkError as e:
    print(f"Network not supported (check your registered mechanism): {e}")

except InsufficientAllowanceError as e:
    print(f"Insufficient token allowance (check wallet balance): {e}")

except SignatureCreationError as e:
    print(f"Signature failed (check your private key): {e}")

except X402Error as e:
    print(f"Payment error: {e}")
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```typescript
try {
  const response = await client.get(SERVER_URL)
  if (response.status === 200) {
    console.log('Success:', await response.json())
  } else {
    console.error(`Request failed: ${response.status}`)
    console.error(await response.text())
  }
} catch (error) {
  if (error.message.includes('No mechanism registered')) {
    console.error('Network not supported — check your registered mechanism')
  } else if (error.message.includes('allowance')) {
    console.error('Insufficient token allowance — check wallet balance')
  } else {
    console.error('Payment error:', error.message)
  }
}
```

</TabItem>
</Tabs>
</TabItem>
</Tabs>

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

- [npm package](https://www.npmjs.com/package/@bankofai/x402) — x402 TypeScript SDK
- [Python SDK source](https://github.com/BofAI/x402/tree/main/python/x402) — x402 Python SDK (installed from GitHub)
- [Demo repository](https://github.com/BofAI/x402-demo) — Full integration examples
