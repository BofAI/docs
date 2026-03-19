import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 完整使用示例

Agent-wallet 只负责签名，构建交易和广播由调用者完成。本页通过完整的代码示例，演示如何将这三个步骤串联起来——包括 TRON 转账、EVM 转账，以及 x402 PaymentPermit 签名场景。

每个示例均提供 TypeScript 和 Python 两个版本，可通过标签切换。

---

## 准备工作

在运行以下示例前，请确保：

1. Python >= 3.11（SDK 使用了 `StrEnum` 等 3.11+ 特性）；TypeScript 无版本限制
2. 已安装 Agent-wallet SDK（参见 [SDK 快速开始](./SDKQuickStart.md)）
3. 已通过 CLI 初始化本地钱包，或已配置静态模式环境变量
4. 已设置 `AGENT_WALLET_PASSWORD`（本地模式）或 `AGENT_WALLET_PRIVATE_KEY`（静态模式）

---

## TRON 转账

**适用场景**：AI 代理需要在 TRON 链上发起一笔 TRX 转账，例如支付 API 调用费用、向另一个地址归集资金，或在自动化任务完成后结算报酬。

**流程说明**：

TRON 的转账不能由客户端直接凭空构造，必须先调用 TronGrid 的 `createtransaction` 接口，由链上节点生成一个包含 `txID` 和 `raw_data` 的未签名交易对象。拿到这个对象后，交给 Agent-wallet 在本地完成签名——签名过程完全离线，私钥不离开本机。最后把签名后的交易提交给 TronGrid 的 `broadcasttransaction` 接口广播上链。

```
TronGrid（构建）→ Agent-wallet（签名）→ TronGrid（广播）
```

Agent-wallet 只参与中间的签名步骤，不依赖任何 RPC 连接，也不感知交易的业务含义。

### 安装依赖

<Tabs>
<TabItem value="ts" label="TypeScript">

```bash
npm install @bankofai/agent-wallet axios
```

</TabItem>
<TabItem value="python" label="Python">

本示例用到了 `aiohttp`（第三方 HTTP 库）和 `asyncio`（Python 标准库，无需安装）：

```bash
pip install aiohttp
```

:::caution 如果运行时提示标准库模块缺失
如果导入 `asyncio` 等标准库时报错，通常是用 pyenv 构建 Python 时缺少系统依赖所致。请先安装以下包，再重新执行 `pyenv install 3.11`：

```bash
# CentOS / RHEL / Amazon Linux
sudo yum install -y libffi-devel bzip2-devel openssl-devel readline-devel sqlite-devel xz-devel

# Ubuntu / Debian
sudo apt-get install -y libffi-dev libbz2-dev libssl-dev libreadline-dev libsqlite3-dev liblzma-dev
```
:::

</TabItem>
</Tabs>

:::tip `visible: true` 与地址格式
代码中向 TronGrid 传入了 `visible: true` 参数。该参数会影响 API 对地址格式的要求：

- **`visible: true`**：API 期望地址为 **Base58 格式**（即普通 TRON 地址，如 `TNmo...`）
- **`visible: false`（或不传）**：API 期望地址为 **十六进制格式**（如 `41b9f...`）

示例代码使用的是 Base58 格式地址，保持与 `visible: true` 一致即可。
:::

### 完整代码

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";
import axios from "axios";

const TRONGRID_API = "https://nile.trongrid.io"; // Nile 测试网, 主网改为 https://api.trongrid.io

async function transferTRX(
  fromAddress: string,
  toAddress: string,
  amountSun: number // 1 TRX = 1_000_000 SUN
) {
  // 第一步: 初始化 Agent-wallet
  const provider = resolveWalletProvider({ network: "tron:nile" });
  const wallet = await provider.getActiveWallet();

  // 第二步: 通过 TronGrid 构建未签名交易
  const { data: unsignedTx } = await axios.post(
    `${TRONGRID_API}/wallet/createtransaction`,
    {
      owner_address: fromAddress,
      to_address: toAddress,
      amount: amountSun,
      visible: true,
    }
  );

  if (!unsignedTx.txID) {
    throw new Error("构建交易失败: " + JSON.stringify(unsignedTx));
  }

  console.log("未签名交易 txID:", unsignedTx.txID);

  // 第三步: Agent-wallet 本地签名
  const signedTx = JSON.parse(await wallet.signTransaction(unsignedTx));
  console.log("签名完成, signature:", signedTx.signature);

  // 第四步: 通过 TronGrid 广播
  const { data: broadcastResult } = await axios.post(
    `${TRONGRID_API}/wallet/broadcasttransaction`,
    signedTx
  );

  if (broadcastResult.result) {
    console.log("广播成功! txID:", signedTx.txID);
  } else {
    console.error("广播失败: ", broadcastResult);
  }

  return signedTx.txID;
}

// 使用示例
transferTRX(
  "YOUR_TRON_ADDRESS",    // 替换为你的钱包地址
  "RECIPIENT_TRON_ADDRESS", // 替换为接收方地址
  1_000_000              // 1 TRX
).catch(console.error);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import asyncio
import json
import aiohttp
from agent_wallet import resolve_wallet_provider

TRONGRID_API = "https://nile.trongrid.io"  # Nile 测试网, 主网改为 https://api.trongrid.io

async def transfer_trx(
    from_address: str,
    to_address: str,
    amount_sun: int,  # 1 TRX = 1_000_000 SUN
):
    # 第一步: 初始化 Agent-wallet
    provider = resolve_wallet_provider(network="tron:nile")
    wallet = await provider.get_active_wallet()

    async with aiohttp.ClientSession() as session:
        # 第二步: 通过 TronGrid 构建未签名交易
        async with session.post(
            f"{TRONGRID_API}/wallet/createtransaction",
            json={
                "owner_address": from_address,
                "to_address": to_address,
                "amount": amount_sun,
                "visible": True,
            },
        ) as resp:
            unsigned_tx = await resp.json()

        print("TronGrid 返回原始响应:", json.dumps(unsigned_tx, indent=2, ensure_ascii=False))

        if "txID" not in unsigned_tx:
            raise ValueError(f"构建交易失败: {unsigned_tx}")

        print("未签名交易 txID:", unsigned_tx["txID"])

        # 第三步: Agent-wallet 本地签名
        signed_tx = json.loads(await wallet.sign_transaction(unsigned_tx))
        print("签名完成, signature:", signed_tx["signature"])

        # 第四步: 通过 TronGrid 广播
        async with session.post(
            f"{TRONGRID_API}/wallet/broadcasttransaction",
            json=signed_tx,
        ) as resp:
            broadcast_result = await resp.json()

        if broadcast_result.get("result"):
            print("广播成功! txID:", signed_tx["txID"])
        else:
            print("广播失败: ", broadcast_result)

    return signed_tx["txID"]

# 使用示例
asyncio.run(
    transfer_trx(
        from_address="YOUR_TRON_ADDRESS",      # 替换为你的钱包地址
        to_address="RECIPIENT_TRON_ADDRESS",   # 替换为接收方地址
        amount_sun=1_000_000,                  # 1 TRX
    )
)
```

</TabItem>
</Tabs>

:::caution 注意
- 测试时请使用 Nile 测试网，可在 [Nile Faucet](https://nileex.io/join/getJoinPage) 领取测试币
- 主网操作请将 `TRONGRID_API` 改为 `https://api.trongrid.io`，`network` 改为 `tron:mainnet`
:::

---

## EVM 转账（BSC / Ethereum）

**适用场景**：AI 代理需要在 BSC、Ethereum 或其他 EVM 兼容链上发起原生代币转账，例如支付 Gas、向合约转账触发业务逻辑，或在任务执行后完成链上结算。

**流程说明**：

EVM 交易需要调用方自行构造交易对象。与 TRON 不同，EVM 交易的字段（`nonce`、`gas`、`chainId` 等）需要通过 RPC 查询当前链状态后手动填入，不依赖中心化 API 生成。构建好未签名交易后，交给 Agent-wallet 在本地签名，返回一段十六进制编码的已签名交易数据，再通过 `sendRawTransaction` 广播到链上。

```
RPC 查 nonce/gas（构建）→ Agent-wallet（签名）→ RPC sendRawTransaction（广播）
```

示例使用 BSC 测试网，但切换到 Ethereum、Polygon、Base 等链只需更改 `RPC_URL` 和 `CHAIN_ID` 两个参数，Agent-wallet 的调用代码完全不变。

### 安装依赖

<Tabs>
<TabItem value="ts" label="TypeScript">

```bash
npm install @bankofai/agent-wallet ethers
```

</TabItem>
<TabItem value="python" label="Python">

```bash
pip install web3
```

</TabItem>
</Tabs>

### 完整代码

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";
import { ethers } from "ethers";

// BSC 测试网 (Testnet)
const RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545";
const CHAIN_ID = 97; // BSC 测试网, 主网为 56

async function transferBNB(
  toAddress: string,
  amountEther: string // 如 "0.001"
) {
  // 第一步: 初始化 Agent-wallet
  const provider = resolveWalletProvider({ network: `eip155:${CHAIN_ID}` });
  const wallet = await provider.getActiveWallet();
  const fromAddress = await wallet.getAddress();

  // 第二步: 通过 RPC 查询 nonce 和 gas 信息
  const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);
  const nonce = await rpcProvider.getTransactionCount(fromAddress, "latest");
  const feeData = await rpcProvider.getFeeData();

  // 第三步: 构建未签名交易
  const unsignedTx = {
    to: toAddress,
    value: ethers.parseEther(amountEther),
    gas: 21000n,
    maxFeePerGas: feeData.maxFeePerGas!,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas!,
    nonce,
    chainId: CHAIN_ID,
    type: 2, // EIP-1559
  };

  console.log("构建交易完成, nonce:", nonce);

  // 第四步: Agent-wallet 本地签名
  const signedTxHex = await wallet.signTransaction(unsignedTx);
  console.log("签名完成");

  // 第五步: 广播
  const txResponse = await rpcProvider.broadcastTransaction("0x" + signedTxHex);
  console.log("广播成功! txHash:", txResponse.hash);

  // 等待确认 (可选)
  const receipt = await txResponse.wait();
  console.log("交易已确认, 区块号:", receipt?.blockNumber);

  return txResponse.hash;
}

// 使用示例
transferBNB(
  "0xYOUR_RECIPIENT_ADDRESS", // 替换为接收方地址
  "0.001"                     // 发送 0.001 BNB
).catch(console.error);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import asyncio
from agent_wallet import resolve_wallet_provider
from web3 import AsyncWeb3

# BSC 测试网 (Testnet)
RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545"
CHAIN_ID = 97  # BSC 测试网, 主网为 56

async def transfer_bnb(to_address: str, amount_ether: str):
    # 第一步: 初始化 Agent-wallet
    provider = resolve_wallet_provider(network=f"eip155:{CHAIN_ID}")
    wallet = await provider.get_active_wallet()
    from_address = await wallet.get_address()

    # 第二步: 通过 RPC 查询 nonce 和 gas 信息
    w3 = AsyncWeb3(AsyncWeb3.AsyncHTTPProvider(RPC_URL))
    nonce = await w3.eth.get_transaction_count(from_address, "latest")
    fee_data = await w3.eth.fee_history(1, "latest", [50])
    base_fee = fee_data["baseFeePerGas"][-1]
    priority_fee = await w3.eth.max_priority_fee

    # 第三步: 构建未签名交易
    unsigned_tx = {
        "to": to_address,
        "value": w3.to_wei(amount_ether, "ether"),
        "gas": 21000,
        "maxFeePerGas": base_fee + priority_fee,
        "maxPriorityFeePerGas": priority_fee,
        "nonce": nonce,
        "chainId": CHAIN_ID,
        "type": 2,  # EIP-1559
    }

    print("构建交易完成, nonce:", nonce)

    # 第四步: Agent-wallet 本地签名
    signed_tx_hex = await wallet.sign_transaction(unsigned_tx)
    print("签名完成")

    # 第五步: 广播
    tx_hash = await w3.eth.send_raw_transaction(bytes.fromhex(signed_tx_hex))
    print("广播成功! txHash:", tx_hash.hex())

    # 等待确认 (可选)
    receipt = await w3.eth.wait_for_transaction_receipt(tx_hash)
    print("交易已确认, 区块号:", receipt["blockNumber"])

    return tx_hash.hex()

# 使用示例
asyncio.run(
    transfer_bnb(
        to_address="0xYOUR_RECIPIENT_ADDRESS",  # 替换为接收方地址
        amount_ether="0.001",                   # 发送 0.001 BNB
    )
)
```

</TabItem>
</Tabs>

:::caution 注意
- 测试时请使用 BSC 测试网（chainId=97），可在 [BSC Faucet](https://testnet.binance.org/faucet-smart) 领取测试币
- 主网操作请将 `RPC_URL` 改为主网 RPC，`CHAIN_ID` 改为 `56`，`network` 改为 `eip155:56`
:::

---

## x402 PaymentPermit 签名

**适用场景**：AI 代理正在访问一个受 x402 协议保护的付费 API——比如获取实时数据、调用 AI 推理服务，或触发某个链上操作。服务端返回 HTTP 402 状态码，要求代理先完成链上支付授权，才能继续获取内容。

**流程说明**：

x402 协议的支付不是直接发起转账，而是采用"先签名授权、后验证放行"的方式。代理需要对一个 `TransferWithAuthorization` 结构（EIP-712 格式）进行签名，签名结果作为支付凭证随请求头一起发送给服务端。服务端验证签名合法后才返回内容，整个过程不需要代理等待链上确认，延迟极低。

```
服务端返回 402 → 代理构建 PaymentPermit → Agent-wallet 签名 → 携带签名重发请求 → 服务端验证放行
```

PaymentPermit 数据由 x402 SDK 根据服务端返回的支付参数自动构建，Agent-wallet 只负责最后的签名步骤。下面展示的是底层签名逻辑，适用于需要自定义集成或绕过 x402 SDK 的场景。

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";

async function signPaymentPermit(
  paymentPayload: {
    x402Version: number;
    scheme: string;
    network: string;
    payload: {
      signature: string;
      authorization: {
        from: string;
        to: string;
        value: string;
        validAfter: string;
        validBefore: string;
        nonce: string;
      };
    };
  }
) {
  // 初始化 Agent-wallet (EVM 钱包, 网络与 x402 支付网络对应)
  const provider = resolveWalletProvider({ network: "eip155:8453" }); // Base 主网
  const wallet = await provider.getActiveWallet();

  // 构建 EIP-712 typed data (与 x402 协议规范一致)
  const typedData = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      TransferWithAuthorization: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "bytes32" },
      ],
    },
    primaryType: "TransferWithAuthorization",
    domain: {
      name: "USD Coin",
      version: "2",
      chainId: 8453,
      verifyingContract: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base USDC
    },
    message: paymentPayload.payload.authorization,
  };

  // Agent-wallet 本地签名
  const signature = await wallet.signTypedData(typedData);
  console.log("PaymentPermit 签名:", signature);

  return signature;
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
from agent_wallet import resolve_wallet_provider

async def sign_payment_permit(authorization: dict) -> str:
    # 初始化 Agent-wallet (EVM 钱包, 网络与 x402 支付网络对应)
    provider = resolve_wallet_provider(network="eip155:8453")  # Base 主网
    wallet = await provider.get_active_wallet()

    # 构建 EIP-712 typed data (与 x402 协议规范一致)
    typed_data = {
        "types": {
            "EIP712Domain": [
                {"name": "name", "type": "string"},
                {"name": "version", "type": "string"},
                {"name": "chainId", "type": "uint256"},
                {"name": "verifyingContract", "type": "address"},
            ],
            "TransferWithAuthorization": [
                {"name": "from", "type": "address"},
                {"name": "to", "type": "address"},
                {"name": "value", "type": "uint256"},
                {"name": "validAfter", "type": "uint256"},
                {"name": "validBefore", "type": "uint256"},
                {"name": "nonce", "type": "bytes32"},
            ],
        },
        "primaryType": "TransferWithAuthorization",
        "domain": {
            "name": "USD Coin",
            "version": "2",
            "chainId": 8453,
            "verifyingContract": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",  # Base USDC
        },
        "message": authorization,
    }

    # Agent-wallet 本地签名
    signature = await wallet.sign_typed_data(typed_data)
    print("PaymentPermit 签名:", signature)

    return signature
```

</TabItem>
</Tabs>

:::tip
x402 SDK 会自动构建 PaymentPermit 数据并调用签名接口，通常不需要手动编写上述代码。这里展示的是底层签名逻辑，适用于需要自定义集成的场景。详见 [x402 协议文档](../../x402/index.md)。
:::

---

## 下一步

- 回顾签名接口的完整参数说明 → [SDK 快速开始](./SDKQuickStart.md)
- 了解 x402 协议与 Agent-wallet 的配合方式 → [x402 简介](../../x402/index.md)
- 查看常见问题 → [常见问题](./FAQ.md)
