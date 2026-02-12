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

| 项目          | 描述                             | 获取方式                                                            |
| ------------- | -------------------------------- | ------------------------------------------------------------------- |
| **私钥** | 用于对支付进行签名的钱包私钥     | 从钱包导出                   |
| **测试 TRX**  | 用于支付测试网交易的手续费 (Gas) | [Nile 水龙头](https://nileex.io/join/getJoinPage)                   |
| **测试 USDT** | 用于进行支付的测试代币           | [Nile USDT 水龙头](https://nileex.io/join/getJoinPage)或在社区索取 |
| **测试 BNB**  | 用于支付测试网交易的手续费 (Gas) | [Testnet 水龙头](https://www.bnbchain.org/en/testnet-faucet)                   |
| **测试 USDT** | 用于进行支付的测试代币           | [Testnet USDT 水龙头](https://www.bnbchain.org/en/testnet-faucet) |






**安全提示：** 切勿分享您的私钥！请将其安全地存储在环境变量中，切勿直接写入代码。

## 1. 安装 x402 SDK

x402 Python 包暂未发布至 PyPI。请从 GitHub 源码安装：

```bash
# Clone the repository
git clone https://github.com/bankofai/x402.git
cd x402/python/x402

# Install
pip install -e .
```

或者直接从 Release 标签安装：

```bash
pip install "bankofai-x402[tron] @ git+https://github.com/bankofai/x402.git@v0.3.1#subdirectory=python/x402"
```

安装所需的依赖：

```bash
pip install eth_account web3
```

安装 x402 TypeScript 包：

```bash
npm install @bankofai/x402 tronweb
```

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

from bankofai.x402.clients import X402Client, X402HttpClient, SufficientBalancePolicy
from bankofai.x402.mechanisms.tron.exact_permit import ExactPermitTronClientMechanism
from bankofai.x402.signers.client import TronClientSigner


# ========== Configuration ==========
# The x402 server URL you want to access
SERVER_URL = "https://x402-demo.bankofai.io/protected-nile"  # Replace with your target server
# ====================================


async def main():
    # Configure signer (network is resolved dynamically)
    signer = TronClientSigner.from_private_key(os.getenv("TRON_PRIVATE_KEY"))

    # Create x402 client, register mechanism and balance policy
    x402_client = X402Client()
    x402_client.register("tron:*", ExactPermitTronClientMechanism(signer))
    x402_client.register_policy(SufficientBalancePolicy)

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
import {
  X402Client, X402FetchClient,
  ExactPermitTronClientMechanism, TronClientSigner,
  SufficientBalancePolicy,
} from '@bankofai/x402'

const TRON_PRIVATE_KEY = process.env.TRON_PRIVATE_KEY!

// ========== Configuration ==========
// The x402 server URL you want to access
const SERVER_URL = 'https://x402-demo.bankofai.io/protected-nile' // Replace with your target server
// ====================================

async function main(): Promise<void> {
  // Create signer (network is resolved dynamically)
  const signer = new TronClientSigner(TRON_PRIVATE_KEY)

  // Create x402 client, register mechanism and balance policy
  const x402 = new X402Client()
  x402.register('tron:*', new ExactPermitTronClientMechanism(signer))
  x402.registerPolicy(SufficientBalancePolicy)

  const client = new X402FetchClient(x402)

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

```python
import asyncio
import os
import httpx

from bankofai.x402.clients import X402Client, X402HttpClient, SufficientBalancePolicy
from bankofai.x402.mechanisms.evm.exact_permit import ExactPermitEvmClientMechanism
from bankofai.x402.mechanisms.evm.exact import ExactEvmClientMechanism
from bankofai.x402.signers.client import EvmClientSigner


# ========== Configuration ==========
SERVER_URL = "https://x402-demo.bankofai.io/protected-bsc-testnet"  # Replace with your target server
# ====================================


async def main():
    # Configure signer (network is resolved dynamically)
    signer = EvmClientSigner.from_private_key(os.getenv("BSC_PRIVATE_KEY"))

    # Create x402 client, register mechanisms and balance policy
    x402_client = X402Client()
    x402_client.register("eip155:*", ExactPermitEvmClientMechanism(signer))
    x402_client.register("eip155:*", ExactEvmClientMechanism(signer))
    x402_client.register_policy(SufficientBalancePolicy)

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
import {
  X402Client, X402FetchClient,
  ExactPermitEvmClientMechanism, ExactEvmClientMechanism,
  EvmClientSigner, SufficientBalancePolicy,
} from '@bankofai/x402'

const BSC_PRIVATE_KEY = process.env.BSC_PRIVATE_KEY!

// ========== Configuration ==========
const SERVER_URL = 'https://x402-demo.bankofai.io/protected-bsc-testnet' // Replace with your target server
// ====================================

async function main(): Promise<void> {
  // Create signer (network is resolved dynamically)
  const signer = new EvmClientSigner(BSC_PRIVATE_KEY)

  // Create x402 client, register mechanisms and balance policy
  const x402 = new X402Client()
  x402.register('eip155:*', new ExactPermitEvmClientMechanism(signer))
  x402.register('eip155:*', new ExactEvmClientMechanism(signer))
  x402.registerPolicy(SufficientBalancePolicy)

  const client = new X402FetchClient(x402)

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
</Tabs>

## 4. 错误处理

SDK 在支付过程中可能会抛出错误。处理方法如下：


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
from bankofai.x402.exceptions import (
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
</Tabs>







 

## 总结

通过本指南，您已经完成了以下集成步骤：

- **安装依赖**：集成 `x402` SDK ， `tronweb` 库（TRON），`ethers.js`库（BSC）。
- **配置身份**：使用私钥初始化钱包签名器 (Wallet Signer)。
- **初始化客户端**：实例化 `X402Client` 并注册支付处理机制。
- **发起请求**：通过封装后的 HTTP 客户端访问付费 API 接口。
- **自动化流程**：SDK 将自动处理支付全生命周期，包括必要的代币授权 (Approve)。

## 下一步

- 浏览 [核心概念](../core-concepts/http-402.md) 以了解协议
- 查看 [网络支持](../core-concepts/network-and-token-support.md) 以获取支持的代币详情

## 参考资料

- [npm package](https://www.npmjs.com/package/@bankofai/x402) - x402 JavaScript SDK
- [示例代码仓库](https://github.com/bankofai/x402-demo) - 完整的集成演示
