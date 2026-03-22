import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 完整代码示例

:::tip 为什么要看这个页面？
在 [SDK 快速开始](./SDK-Guide.md) 中，你已经学会了如何让 Agent-wallet 完成"离线签名"。但在真实的业务中，AI 代理不能只会签名。它需要：**1. 去节点查数据构建交易 → 2. Agent-wallet 签名 → 3. 广播上链。**

Agent-wallet 专注做好最核心的安全签名步骤（第 2 步）。本页为你提供了一套**"开箱即用"**的完整脚本，结合了 TronGrid 和 Ethers.js / Web3.py，带你跑通真正的全链路闭环。你可以直接复制这些代码用于你的生产环境！
:::

本页走完三个真实场景的完整流程：在 TRON 发送 TRX、在 BSC 发送 BNB、签名 x402 支付许可。每个示例都可以直接运行——复制代码、填入你的地址，就能跑。

文档提供 TypeScript 和 Python 两个版本，点击标签页切换。

---

## 前置条件

运行以下任何示例之前，确保已经完成：

1. 安装 Agent-wallet SDK（详见 [SDK 接入指南](./SDK-Guide.md)）
2. 通过 CLI 初始化本地钱包，或配置静态模式的环境变量
3. 设置 `AGENT_WALLET_PASSWORD`（本地 `local_secure` 模式）或 `AGENT_WALLET_PRIVATE_KEY`（静态模式）

---

## TRON 转账

**使用场景**：AI 代理需要在 TRON 网络发起 TRX 转账——比如支付 API 调用费用、归集资金，或完成自动化任务后结算报酬。

**工作原理**：

TRON 交易不能由客户端直接从零构建。流程必须从调用 TronGrid 的 `createtransaction` 接口开始——该接口返回一个包含 `txID` 和 `raw_data` 的未签名交易对象，由网络节点生成。然后把这个对象传给 Agent-wallet 进行本地签名——签名过程完全离线，私钥不会离开本机。最后，把签名后的交易提交给 TronGrid 的 `broadcasttransaction` 接口，发布到链上。

```
TronGrid（构建）→ Agent-wallet（签名）→ TronGrid（广播）
```

Agent-wallet 只参与中间的签名步骤，不需要 RPC 连接，也不感知交易的业务含义。

### 安装依赖

<Tabs>
<TabItem value="ts" label="TypeScript">

```bash
npm install @bankofai/agent-wallet axios
```

</TabItem>
<TabItem value="python" label="Python">

本示例使用 `aiohttp`（第三方 HTTP 库）和 `asyncio`（Python 标准库，无需安装）：

```bash
pip install aiohttp
```

:::caution 如果出现标准库模块缺失的报错
如果 `asyncio` 等标准库模块导入失败，通常是因为 pyenv 从源码编译 Python 时缺少系统依赖。先安装以下包，再重新运行 `pyenv install 3.11`：

```bash
# CentOS / RHEL / Amazon Linux
sudo yum install -y libffi-devel bzip2-devel openssl-devel readline-devel sqlite-devel xz-devel

# Ubuntu / Debian
sudo apt-get install -y libffi-dev libbz2-dev libssl-dev libreadline-dev libsqlite3-dev liblzma-dev
```
:::

</TabItem>
</Tabs>



### 完整代码

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";
import axios from "axios";

const TRONGRID_API = "https://nile.trongrid.io"; // Nile 测试网；主网改为 https://api.trongrid.io

async function transferTRX(
  fromAddress: string,
  toAddress: string,
  amountSun: number // 1 TRX = 1_000_000 SUN
) {
  // 第一步：初始化 Agent-wallet
  const provider = resolveWalletProvider({ network: "tron:nile" });
  const wallet = await provider.getActiveWallet();

  // 第二步：通过 TronGrid 构建未签名交易
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
    throw new Error("构建交易失败：" + JSON.stringify(unsignedTx));
  }

  console.log("未签名 txID：", unsignedTx.txID);

  // 第三步：用 Agent-wallet 本地签名
  const signedTx = JSON.parse(await wallet.signTransaction(unsignedTx));
  console.log("已签名，signature：", signedTx.signature);

  // 第四步：通过 TronGrid 广播
  const { data: broadcastResult } = await axios.post(
    `${TRONGRID_API}/wallet/broadcasttransaction`,
    signedTx
  );

  if (broadcastResult.result) {
    console.log("广播成功！txID：", signedTx.txID);
  } else {
    console.error("广播失败：", broadcastResult);
  }

  return signedTx.txID;
}

// 示例调用
transferTRX(
  "你的 TRON 地址",      // 替换成你的钱包地址
  "收款方 TRON 地址",    // 替换成收款方地址
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

TRONGRID_API = "https://nile.trongrid.io"  # Nile 测试网；主网改为 https://api.trongrid.io

async def transfer_trx(
    from_address: str,
    to_address: str,
    amount_sun: int,  # 1 TRX = 1_000_000 SUN
):
    # 第一步：初始化 Agent-wallet
    provider = resolve_wallet_provider(network="tron:nile")
    wallet = await provider.get_active_wallet()

    async with aiohttp.ClientSession() as session:
        # 第二步：通过 TronGrid 构建未签名交易
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

        if "txID" not in unsigned_tx:
            raise ValueError(f"构建交易失败：{unsigned_tx}")

        print("未签名 txID：", unsigned_tx["txID"])

        # 第三步：用 Agent-wallet 本地签名
        signed_tx = json.loads(await wallet.sign_transaction(unsigned_tx))
        print("已签名，signature：", signed_tx["signature"])

        # 第四步：通过 TronGrid 广播
        async with session.post(
            f"{TRONGRID_API}/wallet/broadcasttransaction",
            json=signed_tx,
        ) as resp:
            broadcast_result = await resp.json()

        if broadcast_result.get("result"):
            print("广播成功！txID：", signed_tx["txID"])
        else:
            print("广播失败：", broadcast_result)

    return signed_tx["txID"]

# 示例调用
asyncio.run(
    transfer_trx(
        from_address="你的 TRON 地址",      # 替换成你的钱包地址
        to_address="收款方 TRON 地址",       # 替换成收款方地址
        amount_sun=1_000_000,                # 1 TRX
    )
)
```

</TabItem>
</Tabs>

:::caution 注意事项
- 测试请使用 Nile 测试网，测试代币从 [Nile Faucet](https://nileex.io/join/getJoinPage) 领取。
- 切换主网：把 `TRONGRID_API` 改为 `https://api.trongrid.io`，`network` 改为 `tron:mainnet`。
:::

:::tip `visible: true` 与地址格式
代码传了 `visible: true` 给 TronGrid，这个参数影响 API 期望的地址格式：

- **`visible: true`**：API 接受 **Base58 格式**（标准的 TRON 可读地址，例如 `TNmo...`）
- **`visible: false`（或不传）**：API 接受 **十六进制格式**（例如 `41b9f...`）

示例使用 Base58 地址，与 `visible: true` 保持一致。
:::

---

## EVM 转账（BSC / Ethereum）

**使用场景**：AI 代理需要在 BSC、Ethereum 或其他 EVM 兼容链上发起原生代币转账——比如支付 Gas、向合约转账触发业务逻辑，或完成链上任务后结算。

**工作原理**：

EVM 交易需要调用方自己构建交易对象。与 TRON 不同，EVM 交易的字段（`nonce`、`gas`、`chainId` 等）需要通过 RPC 查询当前链状态后手动填入，没有集中式 API 帮你生成。未签名交易构建完成后，传给 Agent-wallet 进行本地签名，返回十六进制编码的已签名交易，最后通过 `sendRawTransaction` 广播。

```
RPC 查询 nonce/gas（构建）→ Agent-wallet（签名）→ RPC sendRawTransaction（广播）
```

示例使用 BSC 测试网，切换到 Ethereum、Polygon、Base 或其他 EVM 链只需改 `RPC_URL` 和 `CHAIN_ID`——Agent-wallet 的调用代码一行不变。

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

// BSC 测试网
const RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545";
const CHAIN_ID = 97; // BSC 测试网；主网用 56

async function transferBNB(
  toAddress: string,
  amountEther: string // 例如 "0.001"
) {
  // 第一步：初始化 Agent-wallet
  const provider = resolveWalletProvider({ network: `eip155:${CHAIN_ID}` });
  const wallet = await provider.getActiveWallet();
  const fromAddress = await wallet.getAddress();

  // 第二步：通过 RPC 查询 nonce 和 gas 信息
  const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);
  const nonce = await rpcProvider.getTransactionCount(fromAddress, "latest");
  const feeData = await rpcProvider.getFeeData();

  if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
    throw new Error("该链不支持 EIP-1559 费用数据");
  }

  // 第三步：构建未签名交易
  const unsignedTx = {
    to: toAddress,
    value: ethers.parseEther(amountEther),
    gas: 21000n,
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    nonce,
    chainId: CHAIN_ID,
    type: 2, // EIP-1559
  };

  console.log("交易已构建，nonce：", nonce);

  // 第四步：用 Agent-wallet 本地签名
  const signedTxHex = await wallet.signTransaction(unsignedTx);
  console.log("已签名");

  // 第五步：广播
  const txResponse = await rpcProvider.broadcastTransaction("0x" + signedTxHex);
  console.log("广播成功！txHash：", txResponse.hash);

  // 等待确认（可选）
  const receipt = await txResponse.wait();
  console.log("已在区块中确认：", receipt?.blockNumber);

  return txResponse.hash;
}

// 示例调用
transferBNB(
  "0x收款方地址", // 替换成收款方地址
  "0.001"         // 发送 0.001 BNB
).catch(console.error);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import asyncio
from agent_wallet import resolve_wallet_provider
from web3 import AsyncWeb3

# BSC 测试网
RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545"
CHAIN_ID = 97  # BSC 测试网；主网用 56

async def transfer_bnb(to_address: str, amount_ether: str):
    # 第一步：初始化 Agent-wallet
    provider = resolve_wallet_provider(network=f"eip155:{CHAIN_ID}")
    wallet = await provider.get_active_wallet()
    from_address = await wallet.get_address()

    # 第二步：通过 RPC 查询 nonce 和 gas 信息
    w3 = AsyncWeb3(AsyncWeb3.AsyncHTTPProvider(RPC_URL))
    nonce = await w3.eth.get_transaction_count(from_address, "latest")
    fee_data = await w3.eth.fee_history(1, "latest", [50])
    base_fee = fee_data["baseFeePerGas"][-1]
    priority_fee = await w3.eth.max_priority_fee

    # 第三步：构建未签名交易
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

    print("交易已构建，nonce：", nonce)

    # 第四步：用 Agent-wallet 本地签名
    signed_tx_hex = await wallet.sign_transaction(unsigned_tx)
    print("已签名")

    # 第五步：广播
    tx_hash = await w3.eth.send_raw_transaction(bytes.fromhex(signed_tx_hex))
    print("广播成功！txHash：", tx_hash.hex())

    # 等待确认（可选）
    receipt = await w3.eth.wait_for_transaction_receipt(tx_hash)
    print("已在区块中确认：", receipt["blockNumber"])

    return tx_hash.hex()

# 示例调用
asyncio.run(
    transfer_bnb(
        to_address="0x收款方地址",  # 替换成收款方地址
        amount_ether="0.001",
    )
)
```

</TabItem>
</Tabs>

:::caution 注意事项
- 测试请使用 BSC 测试网（chainId=97），测试代币从 [BSC Faucet](https://testnet.binance.org/faucet-smart) 领取。
- 切换主网：把 `RPC_URL` 改为主网 RPC 地址，`CHAIN_ID` 改为 `56`，`network` 改为 `eip155:56`。
:::

---

## x402 支付许可签名

**使用场景**：AI 代理正在访问受 x402 协议保护的付费 API——比如获取实时数据、调用 AI 推理服务，或触发链上操作。服务器返回 HTTP 402，要求代理在获取内容之前提供支付授权。

**工作原理**：

x402 支付不是直接发一笔转账，而是"先签名、验证后放行"的模型。代理对一个 `TransferWithAuthorization` 结构（EIP-712 格式）进行签名，把得到的签名随请求一起发给服务器作为支付凭证。服务器验证签名有效后才返回内容。代理不需要等待链上确认——延迟极低。

```
服务器返回 402 → 代理构建 PaymentPermit → Agent-wallet 签名 → 携带签名重发请求 → 服务器验证通过并响应
```

PaymentPermit 数据由 x402 SDK 根据服务器返回的支付参数自动构建，Agent-wallet 只负责最后的签名步骤。下面的示例展示了底层签名逻辑，适用于需要自定义集成或绕过 x402 SDK 的场景。

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";

async function signPaymentPermit(authorization: {
  from: string;
  to: string;
  value: string;
  validAfter: string;
  validBefore: string;
  nonce: string;
}) {
  // 初始化 Agent-wallet（EVM 钱包，network 必须与 x402 支付网络匹配）
  const provider = resolveWalletProvider({ network: "eip155:8453" }); // Base 主网
  const wallet = await provider.getActiveWallet();

  // 构建 EIP-712 结构化数据（与 x402 协议规范对齐）
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
    message: authorization,
  };

  // 用 Agent-wallet 本地签名
  const signature = await wallet.signTypedData(typedData);
  console.log("PaymentPermit 签名：", signature);

  return signature;
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
from agent_wallet import resolve_wallet_provider

async def sign_payment_permit(authorization: dict) -> str:
    # 初始化 Agent-wallet（EVM 钱包，network 必须与 x402 支付网络匹配）
    provider = resolve_wallet_provider(network="eip155:8453")  # Base 主网
    wallet = await provider.get_active_wallet()

    # 构建 EIP-712 结构化数据（与 x402 协议规范对齐）
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

    # 用 Agent-wallet 本地签名
    signature = await wallet.sign_typed_data(typed_data)
    print("PaymentPermit 签名：", signature)

    return signature
```

</TabItem>
</Tabs>

:::tip
x402 SDK 会自动构建 PaymentPermit 数据并调用签名接口，通常不需要手写这段代码。上面的示例展示了底层签名逻辑，适用于需要自定义集成的场景。详见 [x402 协议文档](../../x402/index.md)。
:::

---

## 下一步

- 喜欢敲命令？ → [CLI 命令行手册](./CLI-Reference.md)
- 要开发应用？ → [SDK 接入指南](./SDK-Guide.md)
- 了解 x402 与 Agent-wallet 如何配合 → [x402 简介](../../x402/index.md)
- 查看常见问题 → [FAQ](../FAQ.md)
