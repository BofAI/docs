---
title: 'Quickstart for Human'
description: 'This guide walks you through how to use **x402-tron** to interact with services that require payment on TRON blockchain. By the end of this guide, you will be able to programmatically discover payment requirements, complete a payment, and access a paid resource.'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Prerequisites

Before you begin, ensure you have:

- A TRON wallet with USDT (TRC-20)
- Python 3.10+ and pip, or Node.js 18+ and npm
- A service that requires payment via x402-tron

---

### Configuration Reference

Here are the key configuration items you'll need:

| Item                 | Description                                    | How to Get                                                                 |
| -------------------- | ---------------------------------------------- | -------------------------------------------------------------------------- |
| **TRON Private Key** | Your wallet's private key for signing payments | Export from [TronLink](https://www.tronlink.org/) wallet                   |
| **Test TRX**         | Gas fees for testnet transactions              | [Nile Faucet](https://nileex.io/join/getJoinPage)                          |
| **Test USDT**        | Test tokens for making payments                | [Nile USDT Faucet](https://nileex.io/join/getJoinPage) or ask in community |

**Security:** Never share your private key! Store it securely in environment variables, not in code.

```bash
export TRON_PRIVATE_KEY=your_private_key_here
```

### 1. Install x402-tron SDK

<Tabs>
  <TabItem value="python" label="Python">
The x402-tron Python package is not yet published to PyPI. Install from GitHub source:

```bash
# Clone the repository
git clone https://github.com/bankofai/x402-tron.git
cd x402-tron/python/x402

# Install
pip install -e .
```

Or install directly from a release tag:

```bash
pip install "git+https://github.com/bankofai/x402-tron.git@v0.2.1#subdirectory=python/x402"
```

Install the required dependency:

```bash
pip install eth_account
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">
Install the x402-tron TypeScript package:

```bash
npm install @bankofai/x402-tron tronweb
```

  </TabItem>
</Tabs>

### 2. Configure Environment Variables

Set your wallet private key as an environment variable:

```bash
export TRON_PRIVATE_KEY=your_private_key_here
```

### 3. Make Paid Requests Automatically

<Tabs>
  <TabItem value="python" label="Python (httpx)">

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
  <TabItem value="typescript" label="TypeScript">

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

### 4. Handle Errors

The SDK may throw errors during the payment process. Here's how to handle them:

<Tabs>
  <TabItem value="python" label="Python">

```python
from x402_tron.exceptions import (
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
  <TabItem value="typescript" label="TypeScript">

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

### Summary

- Install x402-tron package and tronweb
- Create a wallet signer from your TRON private key
- Create an `X402Client` and register the TRON payment mechanism
- Use the provided HTTP client wrapper to make paid API requests
- Payment flows including token approval are handled automatically

---

**Next Steps:**

- Explore [Core Concepts](../core-concepts/http-402.md) to understand the protocol
- Check out [Network Support](../core-concepts/network-and-token-support.md) for token details

**References:**

- [x402-tron on npm](https://www.npmjs.com/package/@bankofai/x402-tron)
- [Example code](https://github.com/bankofai/x402-tron-demo)
