# 人类用户快速入门

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 前置准备

在开始集成前，请确保您的环境满足以下要求：

- **钱包**：持有一定量 USDT 余额的钱包账户。
- **运行环境**：Python 3.10+ (含 pip) 或 Node.js 18+ (含 npm)。
- **目标服务**：一个支持 x402 协议的支付服务端点。

## 配置参考

以下是您所需的关键配置项：

| 项目          | 描述                             | 获取方式                                                           |
| ------------- | -------------------------------- | ------------------------------------------------------------------ |
| **私钥**      | 用于对支付进行签名的钱包私钥     | 从钱包导出                                                         |
| **测试 TRX**  | 用于支付测试网交易的手续费 (Gas) | [Nile 水龙头](https://nileex.io/join/getJoinPage)                  |
| **测试 USDT** | 用于进行支付的测试代币           | [Nile USDT 水龙头](https://nileex.io/join/getJoinPage)或在社区索取 |
| **测试 BNB**  | 用于支付测试网交易的手续费 (Gas) | [Testnet 水龙头](https://www.bnbchain.org/en/testnet-faucet)       |
| **测试 USDT** | 用于进行支付的测试代币           | [Testnet USDT 水龙头](https://www.bnbchain.org/en/testnet-faucet)  |

**安全提示：** 切勿分享您的私钥！请将其安全地存储在环境变量中，切勿直接写入代码。

## 1. 安装 x402 SDK

<Tabs groupId="language">
<TabItem value="python" label="Python">

从 GitHub 安装：

```bash
pip install "bankofai-x402[tron,evm,httpx] @ git+https://github.com/BofAI/x402.git@main#subdirectory=python/x402"
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```bash
npm install @bankofai/x402-fetch @bankofai/x402-tron @bankofai/x402-evm tronweb viem
```

</TabItem>
</Tabs>

## 2. 配置环境变量

将您的钱包私钥设置为环境变量：

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

## 3. 自动发起付费请求

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
# The x402 server URL you want to access
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

// ========== 配置 ==========
// 您想要访问的 x402 服务器 URL
const SERVER_URL = 'https://x402-demo.bankofai.io/protected-nile' // 替换为您的目标服务器
// ==========================

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

## 4. 错误处理

SDK 在支付过程中可能会抛出错误。处理方法如下：

<Tabs groupId="chain">
  <TabItem value="tron" label="TRON">
    <Tabs groupId="language">
      <TabItem value="python" label="Python">

```python
from bankofai.x402 import (
    PaymentError,
    NoMatchingRequirementsError,
    SchemeNotFoundError,
)

try:
    async with httpx.AsyncClient(transport=x402_httpx_transport(client)) as http_client:
        response = await http_client.get(SERVER_URL)

    print(f"Status: {response.status_code}")

except SchemeNotFoundError as e:
    # No mechanism registered for the network
    print(f"Network not supported: {e}")

except NoMatchingRequirementsError as e:
    # All requirements filtered out by policies or none matching
    print(f"No matching requirements: {e}")

except PaymentError as e:
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
from bankofai.x402 import (
    PaymentError,
    NoMatchingRequirementsError,
    SchemeNotFoundError,
)

try:
    async with httpx.AsyncClient(transport=x402_httpx_transport(client)) as http_client:
        response = await http_client.get(SERVER_URL)

    print(f"Status: {response.status_code}")

except SchemeNotFoundError as e:
    # No mechanism registered for the network
    print(f"Network not supported: {e}")

except NoMatchingRequirementsError as e:
    # All requirements filtered out by policies or none matching
    print(f"No matching requirements: {e}")

except PaymentError as e:
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

## 总结

通过本指南，您已经完成了以下集成步骤：

- **安装依赖**：集成 `x402` SDK ， `tronweb` 库（TRON），`ethers.js`库（BSC）。
- **配置身份**：使用私钥初始化钱包签名器 (Wallet Signer)。
- **初始化客户端**：实例化 `x402Client` 并注册支付处理机制。
- **发起请求**：通过封装后的 HTTP 客户端访问付费 API 接口。
- **自动化流程**：SDK 负责处理 402 检测和签名生命周期。对于需要 Permit2 的代币（如 USDT），请确保您已预先向 Permit2 合约授予了足够的额度。

## 下一步

- 浏览 [核心概念](../core-concepts/http-402.md) 以了解协议
- 查看 [网络支持](../core-concepts/network-and-token-support.md) 以获取支持的代币详情

## 参考资料

- [npm package](https://www.npmjs.com/package/@bankofai/x402) - x402 JavaScript SDK
- [示例代码仓库](https://github.com/BofAI/x402-demo) - 完整的集成演示
