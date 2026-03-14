import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart for Human Users

## Prerequisites

Before you begin integration, please ensure your environment meets the following requirements:

- **Wallet**: A wallet account with a certain amount of USDT balance.
- **Runtime Environment**: Python 3.10+ (with pip) or Node.js 18+ (with npm/pnpm).
- **Target Service**: A payment service endpoint that supports the x402 protocol.

## Configuration Reference

Here are the key configuration items you will need:

| Item                 | Description                              | How to Obtain                                                                    |
| -------------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| **Private Key**      | Wallet private key used to sign payments | Export from wallet                                                               |
| **Test TRX** (TRON)  | Gas for TRON testnet transactions        | [Nile Faucet](https://nileex.io/join/getJoinPage)                                |
| **Test USDT** (TRON) | Test tokens for TRON payments            | [Nile USDT Faucet](https://nileex.io/join/getJoinPage) or request from community |
| **Test BNB** (BSC)   | Gas for BSC testnet transactions         | [BSC Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet)                 |
| **Test USDT** (BSC)  | Test tokens for BSC payments             | [BSC Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet)                 |

**Security Tip:** Never share your private key! Store it securely in environment variables, never directly in code.

## 1. Install x402 SDK

<Tabs groupId="language">
<TabItem value="python" label="Python">

Install using uv or pip (add `evm` if you need BSC support):

```bash
uv add "bankofai.x402[tron,evm,httpx]"
# or
pip install "bankofai.x402[tron,evm,httpx]"
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```bash
npm install @bankofai/x402-fetch @bankofai/x402-tron @bankofai/x402-evm tronweb viem
```

</TabItem>
</Tabs>

## 2. Configure Environment Variables

Set your wallet private key as an environment variable:

<Tabs>
<TabItem value="TRON" label="TRON">

```bash
export TRON_PRIVATE_KEY=your_private_key_here
```

</TabItem>
<TabItem value="BSC" label="BSC">

```bash
export BSC_PRIVATE_KEY=your_private_key_here
```

</TabItem>
</Tabs>

## 3. Automatically Initiate Payment Requests

<Tabs groupId="chain">
  <TabItem value="tron" label="TRON">
    <Tabs groupId="language">
      <TabItem value="python" label="Python">

```python
import asyncio
import os
import httpx

from bankofai.x402 import x402Client
from bankofai.x402.http.clients import x402_httpx_transport
from bankofai.x402.mechanisms.tron.exact.register import register_exact_tron_client
from bankofai.x402.mechanisms.tron.signers import ClientTronSigner


# ========== Configuration ==========
SERVER_URL = "https://x402-demo.bankofai.io/protected-nile"  # Replace with your target server
# ====================================


async def main():
    # Configure signer
    signer = ClientTronSigner(os.getenv("TRON_PRIVATE_KEY"))

    # Create x402 client and register mechanism
    client = x402Client()
    register_exact_tron_client(client, signer)

    # Make request - payment is handled automatically via transport
    async with httpx.AsyncClient(transport=x402_httpx_transport(client), timeout=60.0) as http_client:
        response = await http_client.get(SERVER_URL)

        print(f"Status: {response.status_code}")
        print("Body:", response.text)


asyncio.run(main())
```

  </TabItem>
  <TabItem value="ts" label="TypeScript">

```typescript
import 'dotenv/config'
import { TronWeb } from 'tronweb'
import { x402Client, wrapFetchWithPayment, x402HTTPClient } from '@bankofai/x402-fetch'
import { ExactTronScheme } from '@bankofai/x402-tron/exact/client'
import { createClientTronSigner } from '@bankofai/x402-tron'

const TRON_PRIVATE_KEY = process.env.TRON_PRIVATE_KEY!
const SERVER_URL = 'https://x402-demo.bankofai.io/protected-nile'

async function main(): Promise<void> {
  // Create signer
  const tronWeb = new TronWeb({ fullHost: 'https://nile.trongrid.io' })
  const signer = createClientTronSigner(tronWeb, TRON_PRIVATE_KEY)

  // Create x402 client and register mechanism
  const client = new x402Client()
  client.register('tron:*', new ExactTronScheme(signer))

  const fetchWithPayment = wrapFetchWithPayment(fetch, client)

  // Make request - payment is handled automatically
  const response = await fetchWithPayment(SERVER_URL)

  console.log(`Status: ${response.status}`)

  // Parse payment response
  const httpClient = new x402HTTPClient(client)
  const settleResponse = httpClient.getPaymentSettleResponse((name) => response.headers.get(name))
  if (settleResponse) {
    console.log(`Transaction: ${settleResponse.transaction}`)
  }

  // Handle response
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await response.json()
    console.log('Response:', body)
  }
}

main().catch(console.error)
```

  </TabItem>
</Tabs>
</TabItem>
<TabItem value="bsc" label="BSC">
<Tabs groupId="language">
  <TabItem value="python" label="Python">

```python
import asyncio
import os
import httpx

from bankofai.x402 import x402Client
from bankofai.x402.http.clients import x402_httpx_transport
from bankofai.x402.mechanisms.evm.exact.register import register_exact_evm_client
from bankofai.x402.mechanisms.evm import EthAccountSigner
from eth_account import Account


# ========== Configuration ==========
SERVER_URL = "https://x402-demo.bankofai.io/protected-bsc-testnet"  # Replace with your target server
# ====================================


async def main():
    # Configure signer
    account = Account.from_key(os.getenv("BSC_PRIVATE_KEY"))
    signer = EthAccountSigner(account)

    # Create x402 client and register mechanism
    client = x402Client()
    register_exact_evm_client(client, signer)

    # Make request - payment is handled automatically via transport
    async with httpx.AsyncClient(transport=x402_httpx_transport(client), timeout=60.0) as http_client:
        response = await http_client.get(SERVER_URL)

        print(f"Status: {response.status_code}")
        print("Body:", response.text)


asyncio.run(main())
```

  </TabItem>
  <TabItem value="ts" label="TypeScript">

```typescript
import 'dotenv/config'
import { x402Client, wrapFetchWithPayment, x402HTTPClient } from '@bankofai/x402-fetch'
import { ExactEvmScheme } from '@bankofai/x402-evm/exact/client'
import { privateKeyToAccount } from 'viem/accounts'

const BSC_PRIVATE_KEY = process.env.BSC_PRIVATE_KEY! as `0x${string}`
const SERVER_URL = 'https://x402-demo.bankofai.io/protected-bsc-testnet'

async function main(): Promise<void> {
  // Create signer
  const signer = privateKeyToAccount(BSC_PRIVATE_KEY)

  // Create x402 client and register mechanism
  const client = new x402Client()
  client.register('eip155:*', new ExactEvmScheme(signer))

  const fetchWithPayment = wrapFetchWithPayment(fetch, client)

  // Make request - payment is handled automatically
  const response = await fetchWithPayment(SERVER_URL)

  console.log(`Status: ${response.status}`)

  // Parse payment response
  const httpClient = new x402HTTPClient(client)
  const settleResponse = httpClient.getPaymentSettleResponse((name) => response.headers.get(name))
  if (settleResponse) {
    console.log(`Transaction: ${settleResponse.transaction}`)
  }

  // Handle response
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await response.json()
    console.log('Response:', body)
  }
}

main().catch(console.error)
```

  </TabItem>

</Tabs>
</TabItem> 
</Tabs>

## 4. Error Handling

The SDK may throw errors during the payment process. Here's how to handle them:

<Tabs groupId="chain">
  <TabItem value="tron" label="TRON">
    <Tabs groupId="language">
      <TabItem value="python" label="Python">

```python
from bankofai.x402.exceptions import (
    X402Error,
    InsufficientBalanceError,
    SignatureCreationError,
    UnsupportedNetworkError,
)

try:
    async with httpx.AsyncClient(transport=x402_httpx_transport(client)) as http_client:
        response = await http_client.get(SERVER_URL)

    print(f"Status: {response.status_code}")

except UnsupportedNetworkError as e:
    # No mechanism registered for the network
    print(f"Network not supported: {e}")

except InsufficientBalanceError as e:
    # Token balance insufficient
    print(f"Insufficient balance: {e}")

except SignatureCreationError as e:
    # Failed to sign payment
    print(f"Signature failed: {e}")

except X402Error as e:
    # Other x402 errors
    print(f"Payment error: {e}")
```

  </TabItem>
  <TabItem value="ts" label="TypeScript">

```typescript
try {
  const response = await fetchWithPayment(SERVER_URL)

  if (response.status === 200) {
    console.log('Success:', await response.json())
  } else {
    console.error(`Request failed: ${response.status}`)
    console.error(await response.text())
  }
} catch (error: any) {
  if (error.message.includes('No mechanism registered')) {
    console.error('Network not supported - register the appropriate mechanism')
  } else if (error.message.includes('balance')) {
    console.error('Insufficient token balance')
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
    InsufficientBalanceError,
    SignatureCreationError,
    UnsupportedNetworkError,
)

try:
    async with httpx.AsyncClient(transport=x402_httpx_transport(client)) as http_client:
        response = await http_client.get(SERVER_URL)

    print(f"Status: {response.status_code}")

except UnsupportedNetworkError as e:
    # No mechanism registered for the network
    print(f"Network not supported: {e}")

except InsufficientBalanceError as e:
    # Token balance insufficient
    print(f"Insufficient balance: {e}")

except SignatureCreationError as e:
    # Failed to sign payment
    print(f"Signature failed: {e}")

except X402Error as e:
    # Other x402 errors
    print(f"Payment error: {e}")
```

  </TabItem>
  <TabItem value="ts" label="TypeScript">

```typescript
try {
  const response = await fetchWithPayment(SERVER_URL)

  if (response.status === 200) {
    console.log('Success:', await response.json())
  } else {
    console.error(`Request failed: ${response.status}`)
    console.error(await response.text())
  }
} catch (error: any) {
  if (error.message.includes('No mechanism registered')) {
    console.error('Network not supported - register the appropriate mechanism')
  } else if (error.message.includes('balance')) {
    console.error('Insufficient token balance')
  } else {
    console.error('Payment error:', error.message)
  }
}
```

  </TabItem>
  
</Tabs>
</TabItem> 
</Tabs>

## Summary

Through this guide, you have completed the following integration steps:

- **Install Dependencies**: Integrate the `x402` SDK, `tronweb` library (TRON).
- **Configure Identity**: Initialize the Wallet Signer with your private key.
- **Initialize Client**: Instantiate `x402Client` and register the payment processing mechanism.
- **Initiate Request**: Access the paid API interface through the encapsulated HTTP client.
- **Automated Process**: The SDK will automatically handle the full payment lifecycle, including necessary token authorization (Approve).

## Next Steps

- Browse [Core Concepts](../core-concepts/http-402.md) to understand the protocol
- See [Network Support](../core-concepts/network-and-token-support.md) for supported token details

## References

- [npm package](https://www.npmjs.com/package/@bankofai/x402) - x402 TypeScript SDK
- [PyPI package](https://pypi.org/project/bankofai-x402/) - x402 Python SDK
- [Example Code Repository](https://github.com/BofAI/x402-demo) - Complete integration demo
