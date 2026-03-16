# 人类用户快速入门

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 本指南适合谁？

本指南适合想要通过代码**调用 x402 付费 API** 的开发者。完成后，您将能够用 Python 或 TypeScript 编写脚本，自动完成"付款 → 获取 API 内容"的完整流程，无需手动操作。

> **测试优先：** 本指南默认使用测试网，不涉及真实资金。您可以安全地跟着步骤操作，熟悉整个流程后再连接真实钱包。

---

## 前置准备

### 第一件事：私钥安全

> 🔴 **私钥安全警告——请务必先读这一节：**
>
> - **私钥** 是控制您钱包的唯一凭证，相当于银行卡的密码+卡号合一，**获取私钥的人即可完全控制您的资产**
> - 本指南需要您配置私钥，请务必遵守以下规则：
>   1. **永远不要**将私钥直接写进代码文件（如 `client.py`）
>   2. **永远不要**将含有私钥的文件提交到 Git 或上传到 GitHub
>   3. **永远不要**通过微信、邮件、聊天记录发送私钥
>   4. 私钥应只存放在本地的 `.env` 文件或系统环境变量中
>   5. 测试时，请专门创建一个只含少量测试代币的**测试钱包**，不要使用存有真实资产的钱包

### 准备工作清单

在开始之前，请确认以下条件：

- [ ] 已安装 **Python 3.10+** 或 **Node.js 18+**（根据您选择的语言）
- [ ] 已创建一个专用**测试钱包**（见下方说明）
- [ ] 已获取测试代币（免费）
- [ ] 知道要访问的 x402 付费 API 地址（或使用我们提供的演示地址）

### 创建测试钱包并获取测试代币

<Tabs>
<TabItem value="TRON" label="TRON">

**创建测试钱包：**

1. 安装 [TronLink 浏览器插件](https://www.tronlink.org/) 或手机 App
2. 点击"创建钱包"，设置密码，**将助记词抄写在纸上保管好**
3. 钱包创建后，复制您的地址（以 `T` 开头）

**获取测试代币（免费）：**

1. 前往 [Nile 测试网水龙头](https://nileex.io/join/getJoinPage)
2. 粘贴您的 TRON 测试钱包地址，领取测试 TRX 和测试 USDT/USDD
3. 在 TronLink 中切换到"Nile 测试网"，确认余额到账

**导出私钥：**

1. 在 TronLink 中进入"设置 → 账户管理 → 导出私钥"
2. 输入密码确认
3. 复制这串私钥（64位十六进制字符），下一步会用到

> ✅ **成功标志：** 拥有 TRON 测试钱包地址和对应私钥，钱包中有测试 TRX 和 USDT（或 USDD）

</TabItem>
<TabItem value="BSC" label="BSC">

**创建测试钱包：**

1. 安装 [MetaMask 浏览器插件](https://metamask.io/)
2. 点击"创建新钱包"，设置密码，**将助记词抄写在纸上保管好**
3. 复制您的钱包地址（以 `0x` 开头）

**获取测试代币（免费）：**

1. 前往 [BSC 测试网水龙头](https://www.bnbchain.org/en/testnet-faucet)
2. 粘贴 BSC 测试钱包地址，领取测试 BNB 和测试 USDT
3. 在 MetaMask 中切换到 BSC 测试网，确认余额到账

**导出私钥：**

1. 在 MetaMask 中点击账户图标 → "账户详情" → "导出私钥"
2. 输入 MetaMask 密码确认
3. 复制这串私钥（64位十六进制字符），下一步会用到

> ✅ **成功标志：** 拥有 BSC 测试钱包地址和对应私钥，钱包中有测试 BNB 和 USDT

</TabItem>
</Tabs>

---

## 第一步：安装 SDK

根据您使用的编程语言，选择对应的安装方式：

<Tabs groupId="language">
<TabItem value="python" label="Python">

打开终端，执行以下命令安装 x402 Python SDK：

```bash
pip install "bankofai-x402[tron] @ git+https://github.com/BofAI/x402.git@v0.3.1#subdirectory=python/x402"
```

再安装 EVM（BSC）所需的额外依赖：

```bash
pip install eth_account web3
```

验证安装：

```bash
python -c "import bankofai.x402; print('安装成功！')"
```

> ✅ **成功标志：** 终端输出 `安装成功！`

如遇安装问题，也可从源码安装：

```bash
git clone https://github.com/BofAI/x402.git
cd x402/python/x402
pip install -e .
```

</TabItem>
<TabItem value="ts" label="TypeScript">

打开终端，在您的项目目录下执行：

```bash
npm install @bankofai/x402 tronweb dotenv
```

由于 `@bankofai/x402` 是 ESM 模块，请在您的 `package.json` 中添加以下字段（如果没有则添加）：

```json
{
  "type": "module"
}
```

> 💡 如果在使用 `npx tsx` 运行时遇到 `ERR_PACKAGE_PATH_NOT_EXPORTED` 错误，通常是因为缺少这个 `"type": "module"` 配置。

> ✅ **成功标志：** `npm install` 执行完毕，`node_modules` 目录中出现 `@bankofai` 文件夹

</TabItem>
</Tabs>

---

## 第二步：配置私钥环境变量

**不要将私钥写进代码！** 请将私钥存储为环境变量，这样代码从环境中读取，私钥不会出现在代码文件里。

<Tabs>
<TabItem value="TRON" label="TRON">

在终端中执行（将 `your_private_key_here` 替换为您在前置准备中导出的私钥）：

```bash
export TRON_PRIVATE_KEY=your_private_key_here
```

> 💡 **更推荐的方式：** 在项目目录创建 `.env` 文件，写入 `TRON_PRIVATE_KEY=你的私钥`，然后在 `.gitignore` 中添加 `.env`，防止意外提交到 Git。

</TabItem>
<TabItem value="BSC" label="BSC">

在终端中执行（将 `your_private_key_here` 替换为您在前置准备中导出的私钥）：

```bash
export BSC_PRIVATE_KEY=your_private_key_here
```

> 💡 **更推荐的方式：** 在项目目录创建 `.env` 文件，写入 `BSC_PRIVATE_KEY=你的私钥`，然后在 `.gitignore` 中添加 `.env`，防止意外提交到 Git。

</TabItem>
</Tabs>

验证环境变量已生效：

<Tabs>
<TabItem value="TRON" label="TRON">

```bash
echo $TRON_PRIVATE_KEY
```

</TabItem>
<TabItem value="BSC" label="BSC">

```bash
echo $BSC_PRIVATE_KEY
```

</TabItem>
</Tabs>

> ✅ **成功标志：** 终端输出您的私钥字符串（不是空白）

---

## 第三步：编写并运行调用代码

新建一个文件（如 `client.py` 或 `client.ts`），复制对应的代码：

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


# ========== 配置项 ==========
# 您要访问的 x402 付费 API 地址
# 下方是我们提供的测试地址，您可以先用它验证流程是否通畅
SERVER_URL = "https://x402-demo.bankofai.io/protected-nile"
# ===========================


async def main():
    # 用私钥初始化签名器（网络由服务器响应动态确定）
    signer = TronClientSigner.from_private_key(os.getenv("TRON_PRIVATE_KEY"))

    # 创建 x402 客户端，注册付款机制和余额检查策略
    x402_client = X402Client()
    x402_client.register("tron:*", ExactPermitTronClientMechanism(signer))
    x402_client.register_policy(SufficientBalancePolicy)

    async with httpx.AsyncClient(timeout=60.0) as http_client:
        client = X402HttpClient(http_client, x402_client)

        # 发起请求——SDK 会自动处理付款，您无需手动操作
        response = await client.get(SERVER_URL)

        print(f"状态码: {response.status_code}")
        print("响应内容:", response.text)


asyncio.run(main())
```

**运行代码：**

```bash
python client.py
```

**预期输出：**

```
状态码: 200
响应内容: {"data": "这是需要付款才能获取的内容！"}
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```typescript
import 'dotenv/config'
import {
  X402Client, X402FetchClient,
  ExactPermitTronClientMechanism, TronClientSigner,
  SufficientBalancePolicy,
} from '@bankofai/x402'

const TRON_PRIVATE_KEY = process.env.TRON_PRIVATE_KEY!

// ========== 配置项 ==========
// 您要访问的 x402 付费 API 地址
// 下方是我们提供的测试地址，您可以先用它验证流程是否通畅
const SERVER_URL = 'https://x402-demo.bankofai.io/protected-nile'
// ===========================

async function main(): Promise<void> {
  // 用私钥初始化签名器
  const signer = new TronClientSigner(TRON_PRIVATE_KEY)

  // 创建 x402 客户端，注册付款机制和余额检查策略
  const x402 = new X402Client()
  x402.register('tron:*', new ExactPermitTronClientMechanism(signer))
  x402.registerPolicy(SufficientBalancePolicy)

  const client = new X402FetchClient(x402)

  // 发起请求——SDK 会自动处理付款，您无需手动操作
  const response = await client.get(SERVER_URL)

  console.log(`状态码: ${response.status}`)

  // 解析付款回执（可选）
  const paymentResponse = response.headers.get('payment-response')
  if (paymentResponse) {
    const jsonString = Buffer.from(paymentResponse, 'base64').toString('utf8')
    const settleResponse = JSON.parse(jsonString)
    console.log(`交易哈希: ${settleResponse.transaction}`)
  }

  // 打印响应内容
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await response.json()
    console.log('响应内容:', body)
  }
}

main().catch(console.error)
```

**运行代码：**

```bash
npx tsx client.ts
```

**预期输出：**

```
状态码: 200
交易哈希: abc123...
响应内容: { data: '这是需要付款才能获取的内容！' }
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


# ========== 配置项 ==========
# 您要访问的 x402 付费 API 地址
SERVER_URL = "https://x402-demo.bankofai.io/protected-bsc-testnet"
# ===========================


async def main():
    # 用私钥初始化签名器
    signer = EvmClientSigner.from_private_key(os.getenv("BSC_PRIVATE_KEY"))

    # 创建 x402 客户端，注册付款机制和余额检查策略
    x402_client = X402Client()
    x402_client.register("eip155:*", ExactPermitEvmClientMechanism(signer))
    x402_client.register("eip155:*", ExactEvmClientMechanism(signer))
    x402_client.register_policy(SufficientBalancePolicy)

    async with httpx.AsyncClient(timeout=60.0) as http_client:
        client = X402HttpClient(http_client, x402_client)

        # 发起请求——SDK 会自动处理付款，您无需手动操作
        response = await client.get(SERVER_URL)

        print(f"状态码: {response.status_code}")
        print("响应内容:", response.text)


asyncio.run(main())
```

**运行代码：**

```bash
python client.py
```

**预期输出：**

```
状态码: 200
响应内容: {"data": "这是需要付款才能获取的内容！"}
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

const BSC_PRIVATE_KEY = process.env.BSC_PRIVATE_KEY!

// ========== 配置项 ==========
// 您要访问的 x402 付费 API 地址
const SERVER_URL = 'https://x402-demo.bankofai.io/protected-bsc-testnet'
// ===========================

async function main(): Promise<void> {
  // 用私钥初始化签名器
  const signer = new EvmClientSigner(BSC_PRIVATE_KEY)

  // 创建 x402 客户端，注册付款机制和余额检查策略
  const x402 = new X402Client()
  x402.register('eip155:*', new ExactPermitEvmClientMechanism(signer))
  x402.register('eip155:*', new ExactEvmClientMechanism(signer))
  x402.registerPolicy(SufficientBalancePolicy)

  const client = new X402FetchClient(x402)

  // 发起请求——SDK 会自动处理付款，您无需手动操作
  const response = await client.get(SERVER_URL)

  console.log(`状态码: ${response.status}`)

  // 解析付款回执（可选）
  const paymentResponse = response.headers.get('payment-response')
  if (paymentResponse) {
    const jsonString = Buffer.from(paymentResponse, 'base64').toString('utf8')
    const settleResponse = JSON.parse(jsonString)
    console.log(`交易哈希: ${settleResponse.transaction}`)
  }

  // 打印响应内容
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await response.json()
    console.log('响应内容:', body)
  }
}

main().catch(console.error)
```

**运行代码：**

```bash
npx tsx client.ts
```

**预期输出：**

```
状态码: 200
交易哈希: abc123...
响应内容: { data: '这是需要付款才能获取的内容！' }
```

</TabItem>
</Tabs>
</TabItem>
</Tabs>

---

## 第四步：错误排查

运行代码时如果出现报错，参考以下常见原因和解决方法：

| 错误信息 | 原因 | 解决方法 |
|----------|------|----------|
| `环境变量未设置` 或 `None` | 私钥环境变量没有正确设置 | 重新执行第二步的 `export` 命令，注意是在**同一个终端窗口**中运行 |
| `Insufficient balance` / 余额不足 | 测试钱包里没有足够的测试 USDT/USDD | 回到前置准备，从水龙头重新领取测试代币 |
| `UnsupportedNetworkError` | 代码中注册的网络与服务器不匹配 | 确认 `SERVER_URL` 对应的网络与您注册的 mechanism 一致（TRON 对应 `tron:*`，BSC 对应 `eip155:*`） |
| `InsufficientAllowanceError` | 代币授权额度不足 | SDK 通常会自动处理授权，如持续出现请检查钱包余额 |
| `Connection timeout` | 网络请求超时 | 检查网络连接，或将代码中的 `timeout=60.0` 改为更大的值 |
| `ModuleNotFoundError` | SDK 未正确安装 | 重新执行第一步的安装命令 |


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
    print(f"状态码: {response.status_code}")
    print("响应内容:", response.text)

except UnsupportedNetworkError as e:
    print(f"网络不支持（请检查是否注册了正确的 mechanism）: {e}")

except InsufficientAllowanceError as e:
    print(f"代币授权额度不足（请检查钱包余额）: {e}")

except SignatureCreationError as e:
    print(f"签名失败（请检查私钥是否正确）: {e}")

except X402Error as e:
    print(f"付款出错: {e}")
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```typescript
try {
  const response = await client.get(SERVER_URL)
  if (response.status === 200) {
    console.log('成功:', await response.json())
  } else {
    console.error(`请求失败，状态码: ${response.status}`)
    console.error(await response.text())
  }
} catch (error) {
  if (error.message.includes('No mechanism registered')) {
    console.error('网络不支持——请检查是否注册了正确的 mechanism')
  } else if (error.message.includes('allowance')) {
    console.error('代币授权额度不足——请检查钱包余额')
  } else {
    console.error('付款出错:', error.message)
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
    print(f"状态码: {response.status_code}")
    print("响应内容:", response.text)

except UnsupportedNetworkError as e:
    print(f"网络不支持（请检查是否注册了正确的 mechanism）: {e}")

except InsufficientAllowanceError as e:
    print(f"代币授权额度不足（请检查钱包余额）: {e}")

except SignatureCreationError as e:
    print(f"签名失败（请检查私钥是否正确）: {e}")

except X402Error as e:
    print(f"付款出错: {e}")
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```typescript
try {
  const response = await client.get(SERVER_URL)
  if (response.status === 200) {
    console.log('成功:', await response.json())
  } else {
    console.error(`请求失败，状态码: ${response.status}`)
    console.error(await response.text())
  }
} catch (error) {
  if (error.message.includes('No mechanism registered')) {
    console.error('网络不支持——请检查是否注册了正确的 mechanism')
  } else if (error.message.includes('allowance')) {
    console.error('代币授权额度不足——请检查钱包余额')
  } else {
    console.error('付款出错:', error.message)
  }
}
```

</TabItem>
</Tabs>
</TabItem>
</Tabs>

---

## 总结

通过本指南，您完成了以下步骤：

- **创建测试钱包** 并领取了测试代币，理解了私钥安全的重要性
- **安装 SDK** 并配置了私钥环境变量（而非写入代码）
- **编写并运行**了自动付款的客户端代码
- **理解了整个付款流程**：SDK 自动检测 402 响应 → 自动签名 → 自动付款 → 获取内容

---

## 下一步

- 阅读[核心概念](../core-concepts/http-402.md)深入了解 x402 协议
- 查看[网络支持](../core-concepts/network-and-token-support.md)了解支持的代币和网络
- 想搭建自己的付费 API？参见[卖家快速入门](./quickstart-for-sellers.md)

---

## 参考资料

- [npm 包](https://www.npmjs.com/package/@bankofai/x402) — x402 TypeScript SDK
- [Python SDK 源码](https://github.com/BofAI/x402/tree/main/python/x402) — x402 Python SDK（从 GitHub 安装）
- [示例代码仓库](https://github.com/BofAI/x402-demo) — 完整集成演示
