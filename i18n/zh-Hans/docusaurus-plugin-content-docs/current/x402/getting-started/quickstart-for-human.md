# 人类用户快速入门

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 前置准备

在开始集成前，请确保您的环境满足以下要求：

- **TRON 钱包**：持有一定量 USDT (TRC-20) 余额的钱包账户。
- **运行环境**：Python 3.10+ (含 pip) 或 Node.js 18+ (含 npm)。
- **目标服务**：一个支持 x402-tron 协议的支付服务端点。

**预配置示例：** 我们提供了可直接运行的 [演示仓库中的客户端示例](https://github.com/bankofai/x402-tron-demo/tree/main/client/terminal)。

## 配置参考

以下是您所需的关键配置项：

| 项目          | 描述                             | 获取方式                                                            |
| ------------- | -------------------------------- | ------------------------------------------------------------------- |
| **TRON 私钥** | 用于对支付进行签名的钱包私钥     | 从 [TronLink](https://www.tronlink.org/) 钱包导出                   |
| **测试 TRX**  | 用于支付测试网交易的手续费 (Gas) | [Nile 水龙头](https://nileex.io/join/getJoinPage)                   |
| **测试 USDT** | 用于进行支付的测试代币           | [Nile USDT 水龙头](https://nileex.io/join/getJoinPage) 或在社区索取 |

**安全提示：** 切勿分享您的私钥！请将其安全地存储在环境变量中，切勿直接写入代码。

```bash
export TRON_PRIVATE_KEY=your_private_key_here
```

## 1. 安装 x402-tron SDK

x402-tron Python 包暂未发布至 PyPI。请从 GitHub 源码安装：

```bash
# Clone the repository
git clone https://github.com/bankofai/x402-tron.git
cd x402-tron/python/x402

# Install
pip install -e .
```

或者直接从 Release 标签安装：

```bash
pip install "git+https://github.com/bankofai/x402-tron.git@v0.1.6#subdirectory=python/x402"
```

安装所需的依赖：

```bash
pip install eth_account

```

安装 x402-tron TypeScript 包：
```bash
npm install @bankofai/x402-tron tronweb
```

## 2. 配置环境变量

将您的钱包私钥设置为环境变量：

```bash
export TRON_PRIVATE_KEY=your_private_key_here
```

## 3. 自动发起付费请求

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

## 4. 错误处理

SDK 在支付过程中可能会抛出错误。处理方法如下：

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

## 总结

通过本指南，您已经完成了以下集成步骤：

- **安装依赖**：集成 `x402-tron` SDK 及 `tronweb` 库。
- **配置身份**：使用 TRON 私钥初始化钱包签名器 (Wallet Signer)。
- **初始化客户端**：实例化 `X402Client` 并注册 TRON 支付处理机制。
- **发起请求**：通过封装后的 HTTP 客户端访问付费 API 接口。
- **自动化流程**：SDK 将自动处理支付全生命周期，包括必要的代币授权 (Approve)。

## 下一步

- 浏览 [核心概念](../core-concepts/http-402.md) 以了解协议
- 查看 [网络支持](../core-concepts/network-and-token-support.md) 以获取支持的代币详情

## 参考资料

- [npm package](https://www.npmjs.com/package/@bankofai/x402-tron) - x402-tron JavaScript SDK
- [示例代码仓库](https://github.com/bankofai/x402-tron-demo) - 完整的集成演示
