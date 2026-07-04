import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 用户快速入门

## 本指南面向谁？

本指南面向希望**通过代码调用 x402 保护的 API 并自动完成付款**的开发者。完成后，您将拥有一个可工作的 TypeScript 脚本：它能检测 402 响应、为访问付费、并获取受保护的内容——全程无需手动操作。

> **测试网优先：** 本指南默认使用测试网，您可以安全地完成每一步而不花费真实资金。

:::info SDK 1.0.0（仅 TypeScript）
x402 `1.0.0` 是**仅 TypeScript** 的 SDK，以颗粒化的 `@bankofai/x402-*` 包发布。本指南使用 [`x402` 仓库](https://github.com/BofAI/x402) 中的可运行 fetch client（`examples/typescript/clients/fetch`），它链接了仓库内的 SDK 包并从源码运行。
:::

---

## 前置准备

### 首先：私钥安全

> 🔴 **私钥安全警告——开始前请阅读：**
>
> - 您的**私钥**是控制钱包的唯一凭据。任何拥有它的人都可以完全访问您的资金。
> - 本指南要求您配置私钥。请严格遵守以下规则：
>   1. **切勿**将私钥直接写在代码文件中
>   2. **切勿**将含私钥的文件提交到 Git 或推送到 GitHub
>   3. **切勿**通过消息应用、邮件或聊天发送私钥
>   4. 仅将其保存在本地 `.env` 文件或系统环境变量中
>   5. 测试时请创建一个**专用测试钱包**，仅持有少量测试代币——切勿使用持有真实资产的钱包

### 开始前清单

- [ ] 已安装 **Node.js 20+** 和 **pnpm 11+**
- [ ] 已创建专用**测试钱包**（见下文）
- [ ] 已领取测试代币（免费）
- [ ] 有一个目标 x402 保护的 API URL（或运行示例 server）

### 创建测试钱包并领取测试代币

<Tabs>
<TabItem value="TRON" label="TRON">

**创建测试钱包：**

1. 安装 [TronLink 浏览器扩展](https://www.tronlink.org/) 或手机 App
2. 点击"创建钱包"，设置密码，并**将助记词抄写在纸上并妥善保管**
3. 创建后，复制您的钱包地址（以 `T` 开头）

**领取免费测试代币：**

1. 前往 [Nile 测试网水龙头](https://nileex.io/join/getJoinPage)
2. 粘贴您的 TRON 测试钱包地址，领取测试 TRX 和 USDT/USDD
3. 在 TronLink 切换到"Nile 测试网"并确认余额

**导出私钥：**

1. 在 TronLink 中，前往 设置 → 账户管理 → 导出私钥
2. 输入密码确认
3. 复制 64 位十六进制字符串——下一步将用到

> ✅ **成功检查：** 您拥有 TRON 测试钱包地址、其私钥，以及测试 TRX 和 USDT（或 USDD）余额

</TabItem>
<TabItem value="BSC" label="BSC">

**创建测试钱包：**

1. 安装 [MetaMask 浏览器扩展](https://metamask.io/)
2. 点击"创建新钱包"，设置密码，并**将助记词抄写在纸上并妥善保管**
3. 创建后，复制您的钱包地址（以 `0x` 开头）

**领取免费测试代币：**

1. 前往 [BSC 测试网水龙头](https://www.bnbchain.org/en/testnet-faucet)
2. 粘贴您的 BSC 测试钱包地址，领取测试 BNB 和 USDT
3. 在 MetaMask 切换到 BSC 测试网并确认余额

**导出私钥：**

1. 在 MetaMask 中，点击 账户详情 → 导出私钥
2. 输入 MetaMask 密码确认
3. 复制 64 位十六进制字符串——下一步将用到

> ✅ **成功检查：** 您拥有 BSC 测试钱包地址、其私钥，以及测试 BNB 和 USDT 余额

</TabItem>
</Tabs>

---

## 第一步：获取 SDK 与示例

示例工作区链接了仓库内的 `@bankofai/x402-*` 包并从源码运行：

```bash
git clone https://github.com/BofAI/x402.git
cd x402/typescript            # pnpm/turbo monorepo 根目录

# 安装并链接所有工作区包（SDK + 示例）
pnpm install

# 构建示例所依赖的 @bankofai/x402-* dist
pnpm build

cd examples/typescript
```

fetch client 依赖 `@bankofai/x402-fetch`、`@bankofai/x402-evm`、`@bankofai/x402-tron` 和 `@bankofai/agent-wallet`——全部由 `pnpm install` 自动链接。

:::info 钱包管理
x402 使用 [Agent Wallet](../../Agent-Wallet/QuickStart.md) 解析和管理钱包凭据。Agent Wallet 作为示例的依赖自动安装。私钥解析优先级：
1. 加密钱包文件（通过 Agent Wallet CLI 导入）
2. 环境变量 `AGENT_WALLET_PRIVATE_KEY`

本指南使用环境变量方式。
:::

---

## 第二步：配置私钥

**切勿将私钥写在代码中。** 将其存为环境变量以使其远离源文件。复制环境模板并填入您的密钥：

```bash
cp .env-exact.example .env-exact
```

打开 `.env-exact` 并设置付款方变量：

```bash
# ── SHARED · client（您是付款方）─────────────────────────────────────────
AGENT_WALLET_PRIVATE_KEY=your_private_key_here

# TronGrid API key —— 测试网上可选，生产 TRON 建议。
TRON_GRID_API_KEY=

# ── CLIENT · 支付哪些链/代币 ─────────────────────────────────────────────
# <network>[@<token>]  例如 tron:nile@USDT 或 eip155:97@DHLU
PAY_TARGETS=tron:nile@USDT

# 您要调用的 x402 保护 API。
RESOURCE_URL=http://localhost:4021/weather
```

> 💡 **提示：** `PAY_TARGETS` 控制 client 用哪个链/代币支付，每条目支付一次，按顺序执行。省略代币则使用该网络的第一个公布代币。请使用 `@`（而非 `#`）——dotenv 会把 `#` 当作注释。

<Tabs>
<TabItem value="TRON" label="TRON">

**可选：** 生产 TRON 负载请配置 TronGrid API Key 以获得更可靠的 RPC：

```bash
TRON_GRID_API_KEY="your_trongrid_api_key_here"
```

:::note
未设置 `TRON_GRID_API_KEY` 时，高负载下请求可能被速率限制。生产环境请设置自己的 `TRON_GRID_API_KEY` 以确保可靠性。
:::

</TabItem>
<TabItem value="BSC" label="BSC">

BSC 测试网默认的 viem RPC 端点经常不可达。请设置可靠的 RPC：

```bash
EVM_RPC_URL=https://bsc-testnet-rpc.publicnode.com
```

</TabItem>
</Tabs>

> ⚠️ **安全提醒：** 私钥仅保存在 `.env-exact`（已被 gitignore）或环境变量中。**切勿将含私钥的文件提交到 Git 或分享给任何人。**

---

## 第三步：编写并运行客户端代码

示例 fetch client 包装 `fetch`，使 HTTP `402 Payment Required` 挑战自动支付。以下是入口（`examples/typescript/clients/fetch/src/index.ts`），节选至要点：

```typescript
import { x402Client, wrapFetchWithPayment } from "@bankofai/x402-fetch";

import { registerEvm } from "./chains/evm.js";
import { registerTron } from "./chains/tron.js";

const RESOURCE_URL = process.env.RESOURCE_URL || "http://localhost:4021/weather";

// selector 是付款选择策略：选择要支付哪个公布的选项。
// 完整示例中由 PAY_TARGETS 驱动；此处我们接受第一个选项。
let target: { prefix: string; asset?: string } | null = null;
const client = new x402Client((_x402Version, accepts) => {
  const t = target;
  if (!t) return accepts[0]!;
  const match = accepts.find(
    (a) =>
      a.network.startsWith(t.prefix) &&
      (!t.asset || a.asset.toLowerCase() === t.asset.toLowerCase()),
  );
  if (!match) throw new Error(`server offered no payment option matching "${t.prefix}"`);
  return match;
});

// 仅当钱包解析成功时才注册该链（可仅 EVM、仅 TRON，或两者）。
const evm = await registerEvm(client);
const tron = await registerTron(client);

const fetchWithPay = wrapFetchWithPayment(fetch, client);

// 每个目标支付一次，按顺序。
const targets = [{ prefix: "tron:", asset: undefined }]; // 简化版
for (const t of targets) {
  target = t;
  console.log(`\n→ GET ${RESOURCE_URL}`);
  const res = await fetchWithPay(RESOURCE_URL);
  console.log(`← ${res.status} ${res.statusText}`);
  console.log(JSON.stringify(await res.json(), null, 2));
}
```

### 各链如何注册

每条链位于 `src/chains/` 下各自的模块中。仅当该链的 agent-wallet 解析成功时才注册——因此您可以仅从 EVM、仅从 TRON，或两者支付。

<Tabs>
<TabItem value="tron" label="TRON">

```typescript
// src/chains/tron.ts
import { createClientTronSigner } from "@bankofai/x402-tron";
import { ExactTronScheme } from "@bankofai/x402-tron/exact/client";
import type { x402Client } from "@bankofai/x402-fetch";
import { tryResolveWallet } from "../env.js";

export async function registerTron(client: x402Client): Promise<boolean> {
  const wallet = await tryResolveWallet("tron");
  if (!wallet) return false;

  for (const network of ["tron:nile", "tron:mainnet"] as const) {
    // 工厂内部构建 TronWeb，并自动广播 USDT/USDD 首次付款前
    // 需要的一次性 Permit2 approve。
    const signer = await createClientTronSigner(wallet, {
      network,
      apiKey: process.env.TRON_GRID_API_KEY,
    });
    client.register(network, new ExactTronScheme(signer));
  }
  return true;
}
```

</TabItem>
<TabItem value="bsc" label="BSC">

```typescript
// src/chains/evm.ts
import { createClientEvmSigner } from "@bankofai/x402-evm/adapters/agent-wallet";
import { ExactEvmScheme } from "@bankofai/x402-evm/exact/client";
import type { x402Client } from "@bankofai/x402-fetch";
import { tryResolveWallet } from "../env.js";

export async function registerEvm(client: x402Client): Promise<boolean> {
  const wallet = await tryResolveWallet("evm");
  if (!wallet) return false;

  for (const network of ["eip155:97", "eip155:56"] as const) {
    // 工厂内部构建 viem client；ERC-3009 代币（如 DHLU）
    // 离线签名，无需 RPC；permit2 代币则读取链。
    const signer = await createClientEvmSigner(wallet, {
      network,
      rpcUrl: process.env.EVM_RPC_URL?.trim() || undefined,
    });
    client.register(network, new ExactEvmScheme(signer));
  }
  return true;
}
```

</TabItem>
</Tabs>

### 运行 client

首先确保资源服务器 + facilitator 正在运行（参见[卖家快速入门](./quickstart-for-sellers.md)），然后从 `examples/typescript` 运行：

```bash
pnpm dev:client
```

**预期输出：**

```
→ [tron:nile@USDT] GET http://localhost:4021/weather
← 200 OK
{ "report": { "weather": "sunny", "temperature": 70 } }
```

> ✅ **成功：** SDK 检测到 `402`，签署付款，在链上结算，并返回了受保护的内容。

> 💡 要改为支付 BSC 代币，设置 `PAY_TARGETS=eip155:97@DHLU`（ERC-3009，无 gas）或 `eip155:97@USDC`（permit2，一次性 `approve`）。

---

## 第四步：错误排查

| 问题 | 原因 | 解决方案 |
|---------|-------|----------|
| `No wallet configured for EVM or TRON` | 未设置或为空 `AGENT_WALLET_PRIVATE_KEY` | 在 `.env-exact` 中设置并重新运行；确保在**运行脚本的同一终端窗口**中执行 export |
| `WalletNotFoundError: No active wallet set` | agent-wallet 未配置钱包 | 运行 `agent-wallet start` 并按提示导入私钥 |
| `Insufficient balance` / 余额错误 | 测试钱包 USDT/USDD 不足 | 返回前置准备，从水龙头领取测试代币 |
| `server offered no payment option matching "…"` | `PAY_TARGETS` 与 server 公布的不匹配 | 检查 server 的 `accepts`（网络 + 代币）并对齐 `PAY_TARGETS`，如 `tron:nile@USDT` 或 `eip155:97@DHLU` |
| `InsufficientAllowanceError` / 授权错误 | 代币授权额度过低 | SDK 在首次付款时自动广播一次性 Permit2 `approve`；若仍存在，检查钱包余额 |
| `Connection timeout` | 网络或请求超时 | 检查连接；BSC 请设置可靠的 `EVM_RPC_URL=https://bsc-testnet-rpc.publicnode.com` |
| `ERR_PACKAGE_PATH_NOT_EXPORTED` | 项目未声明为 ESM | 在 `package.json` 中添加 `"type": "module"` |

如需更细粒度的错误处理：

```typescript
try {
  const res = await fetchWithPay(RESOURCE_URL);
  if (res.status === 200) {
    console.log("Success:", await res.json());
  } else {
    console.error(`Request failed: ${res.status}`);
    console.error(await res.text());
  }
} catch (error) {
  if (error instanceof Error && error.message.includes("no payment option")) {
    console.error("No matching payment option — check PAY_TARGETS vs the server's accepts");
  } else if (error instanceof Error && error.message.includes("allowance")) {
    console.error("Insufficient token allowance — check wallet balance");
  } else {
    console.error("Payment error:", error);
  }
}
```

---

## 完成总结

通过本指南，您：

- **创建了测试钱包**并领取了测试代币，理解了私钥安全的重要性
- **安装了 SDK** 并将私钥配置为环境变量（而非写在代码中）
- **编写并运行了**自动付款客户端代码
- **理解了完整流程**：SDK 检测 402 → 签署授权 → 付款 → 获取内容

---

## 下一步

- 阅读[核心概念](../core-concepts/http-402.md)深入了解 x402 协议
- 查看[网络与代币支持](../core-concepts/network-and-token-support.md)了解支持的代币与网络
- 想构建自己的付费 API？参见[卖家快速入门](./quickstart-for-sellers.md)

---

## 参考资料

- [x402 仓库](https://github.com/BofAI/x402) —— SDK 源码与可运行示例（`examples/typescript/`）
- [fetch client 示例](https://github.com/BofAI/x402/tree/main/examples/typescript/clients/fetch) —— 本指南所基于的 client
- [Agent Wallet](https://github.com/BofAI/agent-wallet) —— SDK 使用的密钥托管
