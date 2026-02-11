import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart for Human Users

## Prerequisites

Before you begin integration, please ensure your environment meets the following requirements:

- **Wallet**: A wallet account with a certain amount of USDT balance.
- **Runtime Environment**: Python 3.10+ (with pip) or Node.js 18+ (with npm).
- **Target Service**: A payment service endpoint that supports the x402 protocol.

## Configuration Reference

Here are the key configuration items you will need:

| Item          | Description                             | How to Obtain                                                              |
| ------------- | --------------------------------------- | -------------------------------------------------------------------------- |
| **Private Key** | Wallet private key used to sign payments | Export from wallet                                                         |
| **Test TRX**  | Gas for testnet transactions            | [Nile Faucet](https://nileex.io/join/getJoinPage)                          |
| **Test USDT** | Test tokens for payments                | [Nile USDT Faucet](https://nileex.io/join/getJoinPage) or request from community |
| **Test BNB**  | Gas for testnet transactions            | [Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet)               |
| **Test USDT** | Test tokens for payments                | [Testnet USDT Faucet](https://www.bnbchain.org/en/testnet-faucet)          |




**Security Tip:** Never share your private key! Store it securely in environment variables, never directly in code.
<Tabs>
<TabItem value="TRON" label="TRON">

```bash
export TRON_PRIVATE_KEY=your_private_key_here
```

</TabItem>
<TabItem value="BSC" label="BSC">

```json

```

</TabItem>
</Tabs>

## 1. Install x402 SDK

The x402 Python package is not yet published to PyPI. Please install from GitHub source:

```bash
# Clone the repository
git clone https://github.com/bankofai/x402.git
cd x402/python/x402

# Install
pip install -e .
```

Or install directly from a Release tag:

```bash
pip install "git+https://github.com/bankofai/x402.git@v0.2.1#subdirectory=python/x402"
```

Install required dependencies:

```bash
pip install eth_account

```

Install the x402 TypeScript package:

```bash
npm install @bankofai/x402 tronweb
```

## 2. Configure Environment Variables

Set your wallet private key as an environment variable:

<Tabs>
<TabItem value="TRON" label="TRON">

```bash
export TRON_PRIVATE_KEY=your_private_key_here
```

</TabItem>
<TabItem value="BSC" label="BSC">

```json

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

from x402_tron.clients import X402Client, X402HttpClient
from x402_tron.mechanisms.client import ExactTronClientMechanism
from x402_tron.signers.client import TronClientSigner


# ========== Configuration ==========
# The x402-tron server URL you want to access
SERVER_URL = "https://x402-tron-demo.bankofai.io/protected-nile"  # Replace with your target server
# ====================================


async def main():
    # Configure signer
    signer = TronClientSigner.from_private_key(
        os.getenv("TRON_PRIVATE_KEY"),
        network="nile"
    )

    # Create x402 client and register TRON mechanism
    x402_client = X402Client().register(
        "tron:nile",
        ExactTronClientMechanism(signer)
    )

    async with httpx.AsyncClient(timeout=60.0) as http_client:
        client = X402HttpClient(http_client, x402_client)

        # Make request - payment is handled automatically
        response = await client.get(SERVER_URL)

        print(f"Status: {response.status_code}")
        print("Headers:", response.headers)


asyncio.run(main())
```

  </TabItem>
  <TabItem value="ts" label="TypeScript">

```typescript
import { TronWeb } from 'tronweb'
import { X402Client, X402FetchClient, ExactTronClientMechanism, TronClientSigner } from '@bankofai/x402-tron'

const TRON_PRIVATE_KEY = process.env.TRON_PRIVATE_KEY!

// ========== Configuration ==========
// The x402-tron server URL you want to access
const SERVER_URL = 'https://x402-tron-demo.bankofai.io/protected-nile' // Replace with your target server
// ====================================

async function main(): Promise<void> {
  // Configure TronWeb
  const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io',
    privateKey: TRON_PRIVATE_KEY,
  })

  // Create signer
  const signer = TronClientSigner.withPrivateKey(tronWeb, TRON_PRIVATE_KEY, 'nile')

  // Create x402 client and register TRON mechanism
  const x402Client = new X402Client().register('tron:*', new ExactTronClientMechanism(signer))

  const client = new X402FetchClient(x402Client)

  // Make request - payment is handled automatically
  const response = await client.get(SERVER_URL)

  console.log(`Status: ${response.status}`)

  // Parse payment response
  const paymentResponse = response.headers.get('payment-response')
  if (paymentResponse) {
    const jsonString = Buffer.from(paymentResponse, 'base64').toString('utf8')
    const settleResponse = JSON.parse(jsonString)
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


  </TabItem>
  <TabItem value="ts" label="TypeScript">



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
from x402.exceptions import (
    X402Error,
    InsufficientAllowanceError,
    SignatureCreationError,
    UnsupportedNetworkError,
)

try:
    response = await client.get(SERVER_URL)

    print(f"Status: {response.status_code}")
    print("Headers:", response.headers)

except UnsupportedNetworkError as e:
    # No mechanism registered for the network
    print(f"Network not supported: {e}")

except InsufficientAllowanceError as e:
    # Token allowance insufficient
    print(f"Insufficient allowance: {e}")

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
  const response = await client.get(SERVER_URL)

  if (response.status === 200) {
    console.log('Success:', await response.json())
  } else {
    console.error(`Request failed: ${response.status}`)
    console.error(await response.text())
  }
} catch (error) {
  if (error.message.includes('No mechanism registered')) {
    console.error('Network not supported - register the appropriate mechanism')
  } else if (error.message.includes('allowance')) {
    console.error('Insufficient token allowance')
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

```

  </TabItem>
  <TabItem value="ts" label="TypeScript">

```typescript

```

  </TabItem>
  
</Tabs>
</TabItem> 
</Tabs>







## Summary

Through this guide, you have completed the following integration steps:

- **Install Dependencies**: Integrate the `x402` SDK, `tronweb` library (TRON), `ethers.js` library (BSC).
- **Configure Identity**: Initialize the Wallet Signer with your private key.
- **Initialize Client**: Instantiate `X402Client` and register the payment processing mechanism.
- **Initiate Request**: Access the paid API interface through the encapsulated HTTP client.
- **Automated Process**: The SDK will automatically handle the full payment lifecycle, including necessary token authorization (Approve).

## Next Steps

- Browse [Core Concepts](../core-concepts/http-402.md) to understand the protocol
- See [Network Support](../core-concepts/network-and-token-support.md) for supported token details

## References

- [npm package](https://www.npmjs.com/package/@bankofai/x402) - x402 JavaScript SDK
- [Example Code Repository](https://github.com/bankofai/x402-demo) - Complete integration demo
