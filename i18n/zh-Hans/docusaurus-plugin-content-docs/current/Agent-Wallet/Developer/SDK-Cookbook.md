import ThemedImage from '@theme/ThemedImage';

# 完整代码示例

:::tip 为什么要看这个页面？
在 [SDK 接入指南](./SDK-Guide.md) 中，你已经学会了如何让 Agent-wallet 完成"离线签名"。但在真实的业务中，AI 代理不能只会签名。它需要：**1. 去节点查数据构建交易 → 2. Agent-wallet 签名 → 3. 广播上链。**

Agent-wallet 专注做好最核心的安全签名步骤（第 2 步）。本页为你提供了一套**"开箱即用"**的完整脚本，结合了 TronGrid、Ethers.js 与 `@bankofai/agent-wallet` 3.x SDK，带你跑通真正的全链路闭环。你可以直接复制这些代码用于你的生产环境！
:::

本页走完三个真实场景的完整流程：在 TRON 发送 TRX、在 BSC 发送 BNB、签名 x402 支付许可。每个示例都可以直接运行——复制代码、填入你的地址，就能跑。

所有示例均为 TypeScript——Agent-wallet 3.x 没有 Python SDK（PyPI 上的 `bankofai-agent-wallet` 停留在 2.4.0）。

---

## 前置条件

运行以下任何示例之前，确保已经完成：

1. 安装 Agent-wallet SDK（详见 [SDK 接入指南](./SDK-Guide.md)）
2. 已用 CLI 配置好钱包——推荐 `wallet_cli` 钱包（参见 [快速开始](../QuickStart.md)）——或设置了环境变量回退
3. 已在所用测试网上为钱包充值（TRON 地址至少收到过一次 TRX 才会被激活）

:::danger 真金白银操作请勿使用环境变量回退（`AGENT_WALLET_PRIVATE_KEY`）或 `raw_secret`
这两种方式都以明文保存私钥。请仅在完全隔离的测试环境中配合一次性私钥使用。主网操作请使用 `wallet_cli`（或 `privy`）钱包。
:::

---

## TRON 转账

**使用场景**：AI 代理需要在 TRON 网络发起 TRX 转账——比如支付 API 调用费用、归集资金，或完成自动化任务后结算报酬。

**工作原理**：

TRON 交易不能由客户端直接从零构建。流程必须从调用 TronGrid 的 `createtransaction` 接口开始——该接口返回一个包含 `txID` 和 `raw_data` 的未签名交易对象，由网络节点生成。然后把这个对象传给 Agent-wallet 签名——`raw_secret` 在进程内签名，`wallet_cli` 委托给本机的 wallet-cli 子进程，私钥都不会离开本机。最后，把签名后的交易提交给 TronGrid 的 `broadcasttransaction` 接口，发布到链上。

<ThemedImage
  alt="TRON 转账：TronGrid 构建 → Agent-wallet 签名 → TronGrid 广播"
  sources={{
    light: '/img/diagrams/agent-wallet-tron-flow.zh.light.svg',
    dark: '/img/diagrams/agent-wallet-tron-flow.zh.svg',
  }}
/>

Agent-wallet 只参与中间的签名步骤，不需要 RPC 连接，也不感知交易的业务含义。

### 安装依赖

```bash
npm install @bankofai/agent-wallet axios
```

### 完整代码

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
  const provider = resolveWalletProvider({ network: "tron:3448148188" }); // Nile
  const wallet = await provider.getActiveWallet();

  // 确保 fromAddress 与钱包地址一致——不匹配会导致 TronGrid 报错
  const walletAddress = await wallet.getAddress();
  if (fromAddress !== walletAddress) {
    throw new Error(`fromAddress 不匹配：预期 ${walletAddress}，实际 ${fromAddress}`);
  }

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

  // 第三步：用 Agent-wallet 签名——返回带类型的结果
  const signed = await wallet.signTransaction(unsignedTx);
  if (signed.family !== "tron") {
    throw new Error("签名结果不是 TRON 交易——请检查钱包网络");
  }
  const signedTx = signed.transaction;
  if (!signedTx.signature) {
    throw new Error("签名后的交易缺少 signature 字段");
  }
  if (!signedTx.txID) {
    throw new Error("签名后的交易缺少 txID 字段");
  }
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
  "YOUR_TRON_ADDRESS",      // 替换成你的钱包地址
  "RECIPIENT_TRON_ADDRESS",    // 替换成收款方地址
  1_000_000              // 1 TRX
).catch(console.error);
```


:::caution 注意事项
- 测试请使用 Nile 测试网，测试代币从 [Nile Faucet](https://nileex.io/join/getJoinPage) 领取。
- 切换主网：把 `TRONGRID_API` 改为 `https://api.trongrid.io`，`network` 改为 `tron:728126428`。3.x 会拒绝 `tron:nile` / `tron:mainnet` 这类别名。
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

EVM 交易需要调用方自己构建交易对象。与 TRON 不同，EVM 交易的字段（`nonce`、`gas`、`chainId` 等）需要通过 RPC 查询当前链状态后手动填入，没有集中式 API 帮你生成。未签名交易构建完成后，传给 Agent-wallet 签名，返回 `{ family: "evm", rawTransaction }`，其中是十六进制编码的已签名交易，最后通过 `sendRawTransaction` 广播。

<ThemedImage
  alt="EVM 转账：RPC 构建 → Agent-wallet 签名 → RPC 广播"
  sources={{
    light: '/img/diagrams/agent-wallet-evm-flow.zh.light.svg',
    dark: '/img/diagrams/agent-wallet-evm-flow.zh.svg',
  }}
/>

示例使用 BSC 测试网，切换到 Ethereum、Polygon、Base 或其他 EVM 链只需改 `RPC_URL` 和 `CHAIN_ID`——Agent-wallet 的调用代码一行不变。

### 安装依赖

```bash
npm install @bankofai/agent-wallet ethers
```

### 完整代码

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";
import { ethers } from "ethers";

// BSC 测试网
const RPC_URL = "https://bsc-testnet-rpc.publicnode.com";
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
    type: "eip1559",
  };

  console.log("交易已构建，nonce：", nonce);

  // 第四步：用 Agent-wallet 签名——返回带类型的结果
  const signed = await wallet.signTransaction(unsignedTx);
  if (signed.family !== "evm") {
    throw new Error("签名结果不是 EVM 交易——请检查钱包网络");
  }
  console.log("已签名");

  // 第五步：广播
  // rawTransaction 是不带 '0x' 前缀的十六进制；ethers 需要加上
  const txResponse = await rpcProvider.broadcastTransaction("0x" + signed.rawTransaction);
  console.log("广播成功！txHash：", txResponse.hash);

  // 等待确认（可选 — 添加超时以防止无限阻塞）
  try {
    const receipt = await txResponse.wait(1); // 等待 1 个确认，超时则抛出异常
    console.log("已在区块中确认：", receipt?.blockNumber);
  } catch (e) {
    console.warn("等待回执超时或失败：", e);
  }

  return txResponse.hash;
}

// 示例调用
transferBNB(
  "0xYOUR_RECIPIENT_ADDRESS", // 替换成收款方地址
  "0.001"         // 发送 0.001 BNB
).catch(console.error);
```


:::caution 注意事项
- 测试请使用 BSC 测试网（chainId=97），测试代币从 [BSC Faucet](https://testnet.binance.org/faucet-smart) 领取。
- 切换主网：把 `RPC_URL` 改为主网 RPC 地址，`CHAIN_ID` 改为 `56`，`network` 改为 `eip155:56`。
:::

---

## x402 EIP-3009 支付签名

**使用场景**：AI 代理正在访问受 x402 协议保护的付费 API——比如获取实时数据、调用 AI 推理服务，或触发链上操作。服务器返回 HTTP 402，要求代理在获取内容之前提供支付授权。

**工作原理**：

x402 支付不是直接发一笔转账，而是"先签名、验证后放行"的模型。代理对一个 `TransferWithAuthorization` 结构（EIP-712 格式）进行签名，把得到的签名随请求一起发给服务器作为支付凭证。服务器验证签名后，通过 facilitator 完成结算，结算成功才返回内容；结算失败则返回 `402`。Agent-wallet 只负责本地签名，自己不会广播任何交易。

:::note 该签哪个结构
本节签的是 EIP-3009 的 `TransferWithAuthorization`——Base USDC 在 x402 `exact` 方案下使用的授权结构。它和仓库自带 x402 示例（`bsc-x402-sign-typed-data.ts`、`tron-x402-sign-typed-data.ts`）里的 `PaymentPermit` 结构并不相同：后者的域名是 `x402PaymentPermit`，主类型为 `PaymentPermitDetails`，字段是 `{ buyer, amount, nonce }`。以服务端在 `402` 响应里声明的结构为准。采用哪种授权方式取决于代币而非链：TRON 的 USDT/USDD 与 BSC 的 USDT/USDC 走 Permit2，而 Base 官方 USDC 这类 EIP-3009 代币走 `transferWithAuthorization`——详见[网络与代币支持](../../x402/core-concepts/network-and-token-support.md)。
:::

<ThemedImage
  alt="x402 支付授权：先签名，验证通过再放行"
  sources={{
    light: '/img/diagrams/agent-wallet-x402-permit-flow.zh.light.svg',
    dark: '/img/diagrams/agent-wallet-x402-permit-flow.zh.svg',
  }}
/>

授权数据由 x402 SDK 根据服务器返回的支付参数自动构建，Agent-wallet 只负责最后的签名步骤。下面的示例展示了底层签名逻辑，适用于需要自定义集成或绕过 x402 SDK 的场景。

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";
import type { Eip712Capable, Wallet } from "@bankofai/agent-wallet";

async function signTransferWithAuthorization(authorization: {
  from: string;
  to: string;
  value: string;
  validAfter: string;
  validBefore: string;
  nonce: string;
}) {
  // 初始化 Agent-wallet（EVM 钱包，network 必须与 x402 支付网络匹配）
  // 使用 wallet_cli 钱包时，Base 需要 wallet-cli 4.14.0 及以上（更早的版本会报 network_mismatch）
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

  // signTypedData 定义在 Eip712Capable 上，而不在基础的 Wallet 接口上
  if (!("signTypedData" in wallet)) {
    throw new Error("该钱包不支持结构化数据签名");
  }
  const signer = wallet as Wallet & Eip712Capable;

  // 用 Agent-wallet 签名（返回不带 0x 前缀的 hex 签名）
  const signature = await signer.signTypedData(typedData);
  console.log("TransferWithAuthorization 签名：", signature);

  return signature;
}
```


:::tip
x402 SDK 会自动构建授权数据并调用签名接口，通常不需要手写这段代码。上面的示例展示了底层签名逻辑，适用于需要自定义集成的场景。详见 [x402 协议文档](../../x402/index.md)。
:::

---

## 更多示例

Agent-wallet 仓库中还包含更多可直接运行的进阶示例：

| 示例 | 说明 |
| :--- | :--- |
| `tron-sign-and-broadcast` | 通过 TronGrid 构建 TRX 转账、签名并广播 |
| `bsc-sign-and-broadcast` | 构建、签名并广播 BSC 交易 |
| `wallet-cli-sign` | 通过已配置的 `wallet_cli` 钱包签名 |
| `dual-sign-typed-data-from-private-key` | 用同一个私钥在 TRON 和 EVM 上签名 EIP-712 数据 |
| `switch-active-wallet` | 在代码中切换多个钱包 |
| `create-wallet-provider` | 用 `resolveWalletProvider` 解析钱包 Provider |
| `tron-x402-sign-typed-data` | 在 TRON 上签名 x402 PaymentPermit |
| `bsc-x402-sign-typed-data` | 在 BSC 上签名 x402 PaymentPermit |
| `verify-tron-privy-typed-data` | 验证 Privy TRON EIP-712 签名 |
| `compare-sign-consistency` | 跨钱包签名一致性测试 |

参见 [TypeScript 示例](https://github.com/BofAI/agent-wallet/tree/main/packages/typescript/examples)。

:::tip 通过 wallet-cli 完成 TRON 转账
使用 `wallet_cli` 钱包时，也可以让 wallet-cli 负责构建和广播 TRON 转账：`@bankofai/agent-wallet/integrations/wallet-cli` 中的 `signAndBroadcast` 会依次完成构建 → 签名 → 广播，并返回 `stage: "submitted"`；传入 `wait: true` 时还会轮询交易状态，直到确认、失败或超时。这些工具仅支持 TRON，主网（`tron:728126428`）需要显式传入 `confirmMainnet: true`。
:::

---

## 下一步

- 喜欢敲命令？ → [CLI 命令行手册](./CLI-Reference.md)
- 要开发应用？ → [SDK 接入指南](./SDK-Guide.md)
- 了解 x402 与 Agent-wallet 如何配合 → [x402 简介](../../x402/index.md)
- 查看常见问题 → [FAQ](../FAQ.md)
