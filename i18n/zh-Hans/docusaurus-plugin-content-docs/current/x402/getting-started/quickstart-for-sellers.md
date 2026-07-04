import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 卖家快速入门

> **测试网优先：** 本指南默认使用测试网，所有操作均使用免费的测试代币——**不涉及真实资金**。测试完成后，请参考本指南末尾的[切换到主网](#在主网运行)部分。

## 您将实现什么

完成本指南后，您将拥有一个**对 API 调用收费的服务**：

- 当用户或 AI 代理调用您的 API 时，系统自动要求支付指定代币
- 支持按次计费、按量计费、动态定价等
- 付款验证与链上结算全自动完成——资金直接进入您的钱包

整个流程共 **4 步**，预计耗时 **15–20 分钟**。

:::info SDK 1.0.0（仅 TypeScript）
x402 `1.0.0` 是一个**仅 TypeScript** 的 pnpm/turbo monorepo，以颗粒化的 `@bankofai/x402-*` 包发布。此前的 Python SDK 已移至 `legacy/` 仅供参考。本指南使用 [`x402` 仓库](https://github.com/BofAI/x402) 中的可运行示例（`examples/typescript/`），这些示例链接了仓库内的 SDK 包并从源码运行。
:::

---

## 前置准备

### 确认运行环境

在终端（macOS/Linux 的 Terminal，或 Windows 的 PowerShell/命令提示符）中运行以下命令，确认所需工具已安装：

```bash
node --version    # 需要 Node.js 20 或更高版本
pnpm --version    # 需要 pnpm 11 或更高版本
git --version     # 版本控制工具
```

如果提示"command not found"，请先安装：
- Node.js：前往 [nodejs.org](https://nodejs.org/zh-cn/download) 下载安装程序（包含 `npm`）
- pnpm：安装 Node.js 后运行 `npm install -g pnpm`
- Git：前往 [git-scm.com](https://git-scm.com/) 下载

---

### 创建收款钱包

您需要一个区块链钱包地址来接收用户的代币。根据所选网络，按以下步骤操作：

<Tabs>
<TabItem value="TRON" label="TRON（推荐）">

**创建 TronLink 钱包（约 3 分钟）：**

1. 在浏览器中安装 [TronLink 扩展](https://www.tronlink.org/)（支持 Chrome/Firefox），或在手机上下载 TronLink App
2. 打开扩展，点击"创建钱包"
3. 设置登录密码（用于解锁钱包，仅本地存储）
4. **重要：** 系统会显示一组助记词（12 个英文单词）——**请抄写在纸上并妥善保管**；这是恢复钱包的唯一方式
5. 按提示验证助记词，完成钱包创建
6. 在主界面复制您的钱包地址（以字母 **`T`** 开头，例如 `TXyz1234...`）

**领取免费测试代币（约 2 分钟）：**

1. 前往 [Nile 测试网水龙头](https://nileex.io/join/getJoinPage)
2. 在输入框粘贴您的 TRON 钱包地址
3. 点击领取，等待约 1–2 分钟
4. 在 TronLink 切换到"Nile 测试网"，刷新并确认 TRX 和 USDT/USDD 余额已到账

> ✅ **成功：** 钱包显示测试 TRX 和测试 USDT（或 USDD）余额大于 0

</TabItem>
<TabItem value="BSC" label="BSC">

**创建 MetaMask 钱包（约 3 分钟）：**

1. 在浏览器中安装 [MetaMask 扩展](https://metamask.io/)（支持 Chrome/Firefox/Edge）
2. 打开扩展，点击"创建新钱包"
3. 设置密码，然后**将助记词（12 个英文单词）抄写在纸上并妥善保管**
4. 按提示验证助记词，完成创建
5. 在主界面复制您的钱包地址（以 **`0x`** 开头，例如 `0xAbc123...`）

**领取免费测试代币（约 2 分钟）：**

1. 前往 [BSC 测试网水龙头](https://www.bnbchain.org/en/testnet-faucet)
2. 粘贴您的钱包地址，领取测试 BNB 和测试 USDT
3. 在 MetaMask 切换到 BSC 测试网并确认余额已到账

> ✅ **成功：** 钱包显示测试 BNB 和测试 USDT 余额大于 0

</TabItem>
</Tabs>

> ⚠️ **钱包安全提醒：**
> - 助记词和私钥是您钱包的"总钥匙"——**任何人（包括平台客服）都不应向您索要**
> - 将助记词抄写在纸上，存放在安全的物理位置——不要保存在手机相册或云存储中
> - 本教程使用测试钱包；建议创建一个专用的新钱包用于测试，不要使用持有真实资产的钱包

---

### 配置参数速查

| 配置项 | 说明 | 获取方式 |
|--------|------|----------|
| **TRON 钱包地址** | 以 `T` 开头的钱包地址（您的收款地址） | 从 TronLink 复制 |
| **BSC 钱包地址** | 以 `0x` 开头的钱包地址（您的收款地址） | 从 MetaMask 复制 |
| **测试 TRX** | TRON 测试网费率代币 | [Nile 水龙头](https://nileex.io/join/getJoinPage) |
| **测试 USDT/USDD（TRON）** | TRON 测试支付代币（USDT 和 USDD 均支持） | [Nile 水龙头](https://nileex.io/join/getJoinPage) |
| **测试 BNB** | BSC 测试网费率代币 | [BSC 测试网水龙头](https://www.bnbchain.org/en/testnet-faucet) |
| **测试 USDT（BSC）** | BSC 测试支付代币 | [BSC 测试网水龙头](https://www.bnbchain.org/en/testnet-faucet) |

**测试网 vs. 主网：**

- **测试网**：使用免费测试代币，不涉及真实资金，适合开发调试。网络标识：`tron:nile` / `eip155:97`
- **主网**：涉及真实支付，上线时使用。网络标识：`tron:mainnet` / `eip155:56`

---

## 第一步：获取 SDK 与示例

示例工作区链接了仓库内的 `@bankofai/x402-*` 包并从源码构建，无需发布到 npm 仓库即可获得最新 SDK：

```bash
git clone https://github.com/BofAI/x402.git
cd x402/typescript            # pnpm/turbo monorepo 根目录

# 安装并链接所有工作区包（SDK + 示例）
pnpm install

# 构建示例所依赖的 @bankofai/x402-* dist
pnpm build

cd examples/typescript
```

通过启动示例资源服务器来验证安装（它会打印端口和所接受的链）：

```bash
pnpm dev:server
```

> ✅ **成功：** 服务器启动并打印启动日志。在未设置收款地址时它会以 `❌ No payout address configured (set EVM_ADDRESS and/or TRON_ADDRESS)` 退出——这是预期行为，说明工具链可用。您将在第二步设置这些地址。

---

## 第二步：配置环境变量

主线（facilitator、server、client）三个进程共用一个文件：`.env-exact`。复制模板并填写：

```bash
cp .env-exact.example .env-exact
```

在编辑器中打开 `.env-exact`，设置钱包与收款变量：

```bash
# ── SHARED · client + facilitator（此处用同一把密钥支付与结算）────────
AGENT_WALLET_PRIVATE_KEY=0x...   # 您的测试钱包私钥

# TronGrid API key —— client 和 facilitator 都会访问 TRON。测试网上可选。
TRON_GRID_API_KEY=

# ── SERVER · 资源提供方（这是您要配置的）──────────────────────────────
EVM_ADDRESS=0x...   # 您的 BSC 收款地址（eip155:97）
TRON_ADDRESS=T...    # 您的 TRON 收款地址（tron:nile）

# server 绑定端口，以及它访问 facilitator 的地址。
SERVER_PORT=4021
FACILITATOR_URL=http://localhost:4022

# ── FACILITATOR · 结算 ────────────────────────────────────────────────
FACILITATOR_PORT=4022
```

> 💡 **无密钥 server：** 资源服务器从不签名、不持有密钥——它只公布您的公开收款地址（`EVM_ADDRESS` / `TRON_ADDRESS`）。签名与结算发生在 client 和 facilitator 侧。`AGENT_WALLET_PRIVATE_KEY` 由 client（用于支付）和 facilitator（用于结算）使用，server 不使用。

> ⚠️ **安全提醒：** 私钥仅保存在 `.env`（已被 gitignore）或环境变量中。**切勿将含私钥的文件提交到 Git 或分享给任何人。**

---

## 第三步：创建付费 API 服务器

示例资源服务器是一个 Express 应用，将 `GET /weather` 保护在 x402 付款之后。它是**链无关**的——每条链的代币与 `accepts` 条目位于 `src/chains/{evm,tron}.ts`，仅当设置了 `*_ADDRESS` 时才公布该链。

以下是服务器入口（`examples/typescript/servers/express/src/index.ts`）：

```typescript
import express from "express";
import { HTTPFacilitatorClient } from "@bankofai/x402-core/server";
import { createResourceServer } from "@bankofai/x402-core";
import {
  x402HTTPResourceServer,
  paymentMiddlewareFromHTTPServer,
} from "@bankofai/x402-express";

import { hasEvm, registerEvm, evmAccepts, evmExtensions } from "./chains/evm.js";
import { hasTron, registerTron, tronAccepts } from "./chains/tron.js";

const PORT = parseInt(process.env.SERVER_PORT || "4021", 10);
const FACILITATOR_URL = process.env.FACILITATOR_URL || "http://localhost:4022";

// server 通过 HTTP 将 verify/settle 委托给 facilitator。
const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
// 预挂日志：verify/settle 结果通过 SDK logger 打印。
const resourceServer = createResourceServer(facilitatorClient);

// 仅当设置了收款地址时才注册该链（并公布其代币）。
type Accept = ReturnType<typeof evmAccepts>[number] | ReturnType<typeof tronAccepts>[number];
const accepts: Accept[] = [];
let extensions: Record<string, unknown> = {};
if (hasEvm()) {
  registerEvm(resourceServer);
  accepts.push(...evmAccepts());
  extensions = { ...extensions, ...evmExtensions() };
}
if (hasTron()) {
  registerTron(resourceServer);
  accepts.push(...tronAccepts());
}

// 您要保护的路由——`accepts` 是价格列表，`extensions` 携带
// 普通 ERC-20（permit2）代币（如 BSC USDC）的 gas 赞助提示。
const routes = {
  "GET /weather": {
    accepts,
    extensions,
    description: "Current weather (paid)",
    mimeType: "application/json",
  },
};

const httpServer = new x402HTTPResourceServer(resourceServer, routes);

const app = express();
app.use(paymentMiddlewareFromHTTPServer(httpServer));

app.get("/weather", (_req, res) => {
  res.json({ report: { weather: "sunny", temperature: 70 } });
});

app.listen(PORT, () => {
  console.log(`🌤️  Resource server on http://localhost:${PORT}`);
});
```

### 各链定价方式

每个链模块构建 `accepts` 条目（价格 + `payTo` + 代币）。两种链族定价方式不同：

- **TRON** 使用 `"<金额> <符号>"` 字符串，由 scheme 从注册表中解析每个代币：
  ```typescript
  // src/chains/tron.ts —— tron:nile 上的 USDT 与 USDD
  export function tronAccepts() {
    const payTo = process.env.TRON_ADDRESS as string;
    return ["tron:nile", "tron:mainnet"].flatMap((network) =>
      ["0.001 USDT", "0.001 USDD"].map((price) => ({ scheme: "exact", network, payTo, price })),
    );
  }
  ```
- **EVM** 公布显式的 `{ amount, asset, extra }` 对象，因为 BSC 没有默认代币注册表项。ERC-3009 代币（如 DHLU）携带其域 `name`/`version`；普通 ERC-20 代币（如 USDC/USDT）设置 `extra.assetTransferMethod: "permit2"` 并需要一次性 Permit2 `approve`：
  ```typescript
  // src/chains/evm.ts
  const EVM_TOKENS = {
    "eip155:97": [
      { asset: "0x375cADdd…B816", amount: "1000", extra: { name: "DA HULU", version: "1" } },       // DHLU, ERC-3009
      { asset: "0x64544969…8930", amount: "1000000000000000", extra: { assetTransferMethod: "permit2" } }, // USDC
      { asset: "0x337610d2…4dDd", amount: "1000000000000000", extra: { assetTransferMethod: "permit2" } }, // USDT
    ],
  };
  ```

**关键配置参数：**

| 参数 | 说明 | 示例 |
|------|------|--------|
| `EVM_ADDRESS` / `TRON_ADDRESS` | 您的收款（payout）钱包地址 | `0xAbc…` / `TXyz…` |
| `accepts[].price` | 每次请求价格（代币金额，或 `"<金额> <符号>"`） | `"0.001 USDT"` |
| `accepts[].network` | 使用的网络 | 测试网：`tron:nile` / `eip155:97` |
| `accepts[].scheme` | 付款方式 | `"exact"` |
| `routes` | `"METHOD /path"` → `{ accepts, extensions, description, mimeType }` 的映射 | `"GET /weather"` |

**工作原理：** 当未付款请求到达您的 API 时，中间件自动返回 HTTP `402 Payment Required` 响应并携带付款要求。client SDK 自动完成付款并重发请求——对终端用户几乎不可见。

---

## 第四步：接入结算服务（Facilitator）

### 什么是 Facilitator？

Facilitator 是一个**自动结算服务**：当有人为您的 API 付款时，Facilitator 验证付款是否真实并将其结算到链上，确保资金到达您的收款钱包。您在第三步构建的 server 仅通过 `FACILITATOR_URL` 指向 Facilitator——它不自行结算。

**启动 API 服务器之前，必须有一个可达的 Facilitator。**

### 两种接入方式，如何选择？

| | 官方 Facilitator（推荐） | 自托管 Facilitator |
|---|---|---|
| **是否需要维护** | 否——官方托管 | 是——您自行运行 |
| **是否需要钱包私钥** | 否 | 是（用于链上结算） |
| **难度** | 低（仅需申请 API Key） | 中（运行示例 facilitator） |
| **适合** | 快速部署、大多数用户 | 需要完全控制费率策略 |

<Tabs>
<TabItem value="official" label="✅ 官方 Facilitator（推荐）">

官方托管的 Facilitator 服务**无需维护基础设施**。完整步骤请参见 [官方 Facilitator](../core-concepts/OfficialFacilitator.md)。

#### 4.1 配置服务端点

在 `.env-exact` 中将 `FACILITATOR_URL` 设为官方端点：

```
FACILITATOR_URL=https://facilitator.bankofai.io
```

这是您的 x402 server 用于验证和结算付款的地址——**仅供 API 调用**，无需在浏览器中打开。

> ⚠️ **未配置 API Key 时，该端点受速率限制**（每个 IP 每分钟一次 `/settle`）。仅适合测试。

#### 4.2 申请 API Key

1. 在浏览器中打开[管理后台](https://admin-facilitator.bankofai.io)，使用钱包登录
2. 在 Dashboard 上点击 **"Create API Key"**
3. 确认后，在 Dashboard 点击 **View** 查看并复制您的 API Key

配置 API Key 后，速率限制提升到 **每分钟 1,000 次**，足以满足生产需求。

#### 4.3 将 API Key 接入您的 server

官方 key 以 `X-API-KEY` 头的形式随每次 facilitator 调用发送。示例 server 已通过 `FACILITATOR_API_KEY` 支持：

```bash
# 追加到 .env-exact
FACILITATOR_API_KEY=paste_your_api_key_here
```

> ⚠️ **安全提醒：** API Key 是服务凭据——**像密码一样保管，切勿提交到 Git**。

> ✅ **完成！** 官方 Facilitator 已配置——**无需启动本地服务**。直接进入第五步测试。

</TabItem>
<TabItem value="selfhost" label="自托管 Facilitator">

自托管方式让您完全控制费率策略。它运行示例 facilitator（`examples/typescript/facilitator/basic`），通过 HTTP 暴露 `/verify`、`/settle`、`/supported`，并按付款的 `network` 字段分发。

> ⚠️ **安全提醒——请先阅读：**
> - 自托管 Facilitator 使用您的钱包提交链上结算交易——**此钱包应与您的收款钱包分开**
> - 仅向 Facilitator 钱包充入少量代币（足够支付手续费）——不要存放大量资金
> - 私钥仅保存在 `.env-exact` 中——**切勿提交到 Git 或分享给任何人**

#### 4.1 自托管 Facilitator 的工作原理

facilitator 验证签名并在链上结算。它按链注册 `exact` scheme 并附带 signer：

```typescript
// examples/typescript/facilitator/basic/src/index.ts（节选）
import { x402Facilitator } from "@bankofai/x402-core/facilitator";

const facilitator = new x402Facilitator()
  .onBeforeSettle(async ctx => console.log("[settle] before", ctx.requirements.network))
  .onAfterSettle(async ctx => console.log("[settle] after", ctx.requirements.network))
  .onSettleFailure(async ctx => console.log("[settle] failure", ctx));

// 仅当钱包解析成功时才注册该链（可仅 EVM、仅 TRON，或两者）。
const evm = await registerEvm(facilitator);
const tron = await registerTron(facilitator);

// 在 FACILITATOR_PORT 上暴露 POST /verify、POST /settle、GET /supported。
app.listen(PORT, () => console.log(`🚀 Facilitator on http://localhost:${PORT}`));
```

每个链模块将 agent-wallet 适配为 facilitator signer：

- **EVM** —— `createFacilitatorEvmSigner(wallet, { network, rpcUrl })`，然后 `facilitator.register(network, new ExactEvmScheme(signer))`
- **TRON** —— `createFacilitatorTronSigner(wallet, { network, apiKey })`，然后 `facilitator.register(network, new ExactTronScheme(signer))`

signer 工厂内部构建 viem client / TronWeb；示例**从不读取原始私钥**——`AGENT_WALLET_PRIVATE_KEY` 由 `@bankofai/agent-wallet` 消费。

#### 4.2 启动 Facilitator

您的 `.env-exact` 中的 `FACILITATOR_URL` 已默认为 `http://localhost:4022`，与示例 facilitator 一致。从 `examples/typescript` 运行：

```bash
pnpm dev:facilitator
```

**启动成功后，应看到类似输出：**

```
[evm] facilitator registered eip155:97 (0x…)
[tron] facilitator registered tron:nile (T…)
🚀 Facilitator on http://localhost:4022  (evm=true, tron=true)
```

> ✅ **成功：** Facilitator 在 4022 端口运行——**保持此终端窗口打开，不要关闭**

</TabItem>
</Tabs>

---

## 第五步：启动并测试您的 API

### 5.1 启动 API 服务器

打开**新终端窗口**（不要关闭 facilitator），从 `examples/typescript` 运行：

```bash
pnpm dev:server
```

**启动成功后，应看到：**

```
🌤️  Resource server on http://localhost:4021  (evm=true, tron=true) → facilitator http://localhost:4022
```

> ✅ **成功：** 终端显示资源服务器在 `http://localhost:4021`

### 5.2 测试未付款访问（应被拒绝）

在任意终端运行：

```bash
curl http://localhost:4021/weather
```

**预期结果：** 服务器返回 HTTP `402` 响应，携带付款要求（一个 `accepts` 数组，列出 scheme、网络、价格和您的收款地址）。

> ✅ **这正是我们想要的！** 确认付款保护已生效——未付款请求被成功拦截。

### 5.3 测试完整付款流程

要测试完整的 付款 → 获取内容 流程，在**第三个终端**启动示例 client。从 `examples/typescript` 开始，先设置要支付的链/代币：

```bash
# 追加到 .env-exact（或在 client 终端 export）
PAY_TARGETS=tron:nile@USDT        # TRON Nile USDT；或 eip155:97@DHLU 用于 BSC
RESOURCE_URL=http://localhost:4021/weather
```

然后运行：

```bash
pnpm dev:client
```

**预期输出：**

```
→ [tron:nile@USDT] GET http://localhost:4021/weather
← 200 OK
{ "report": { "weather": "sunny", "temperature": 70 } }
```

> ✅ **成功：** client 自动检测到 `402`，签署付款，通过 facilitator 在链上结算，并获取了受保护的内容。

> 💡 client 用 `wrapFetchWithPayment(fetch, client)` 包装 `fetch`，使 402 挑战自动支付——客户端流程详见[用户快速入门](./quickstart-for-human.md)。

---

## 故障排查

| 问题 | 原因 | 解决方案 |
|---------|-------|----------|
| `No payout address configured` | 未设置 `EVM_ADDRESS` 和 `TRON_ADDRESS` | 在 `.env-exact` 中至少设置一个并重启 server |
| `Failed to fetch` / connection refused | facilitator 或 server 未运行 | 先启动 facilitator（`pnpm dev:facilitator`），再启动 server（`pnpm dev:server`） |
| client `server offered no payment option matching "…"` | `PAY_TARGETS` 与公布的选项不匹配 | 检查 server 的 `accepts`（网络 + 代币）并对齐 `PAY_TARGETS`，如 `tron:nile@USDT` 或 `eip155:97@DHLU` |
| `npx tsx` 下出现 `ERR_PACKAGE_PATH_NOT_EXPORTED` | 项目未声明为 ESM | 在 `package.json` 中添加 `"type": "module"` |
| `UnsupportedNetworkError` / `No mechanism registered` | `PAY_TARGETS` 中的网络没有注册的 scheme | 确保 client 的 `EVM_NETWORKS`/`TRON_NETWORKS` 包含您的目标，且该链的钱包已解析 |
| `Insufficient balance` / allowance 错误 | 测试钱包缺少测试代币，或 Permit2 授权额度过低 | 从水龙头领取测试代币；client 在首次付款时会自动批准 Permit2 |
| `Connection timeout` | 网络或请求超时 | 检查连接，或设置可靠的 `EVM_RPC_URL`（如 `https://bsc-testnet-rpc.publicnode.com`） |

---

## 在主网运行

在测试网充分验证后，只需几步即可上线并接受真实付款：

### 1. 将 client 和 server 指向主网

示例在相同的表中注册了测试网**和**主网——无需取消注释。在 `.env-exact` 中设置主网值即可切换：

```bash
# server 收款地址 → 您的主网钱包
EVM_ADDRESS=0xYourMainnetBscAddress
TRON_ADDRESS=TYourMainnetTronAddress

# client 在主网支付
PAY_TARGETS=tron:mainnet@USDT      # 或 eip155:56@USDT
```

### 2. 设置可靠的 EVM RPC

BSC 主网需要稳定端点。为 client 和 facilitator 都设置：

```bash
EVM_RPC_URL=https://bsc-rpc.publicnode.com
```

### 3.（自托管）将 Facilitator 切换到主网

facilitator 的 `TRON_NETWORKS` 已包含 `tron:mainnet`，`EVM_NETWORKS` 已包含 `eip155:56`。向 Facilitator 钱包充入足够的真实 TRX/BNB 以支付结算 gas，然后重启：

```bash
pnpm dev:facilitator
```

> 生产 TRON 负载请设置自己的 `TRON_GRID_API_KEY` 以避免速率限制。

### 4.（官方 Facilitator）无需本地改动

若使用官方 facilitator，保持 `FACILITATOR_URL=https://facilitator.bankofai.io` 和您的 `FACILITATOR_API_KEY`。仅 server 的收款地址切换到主网。

### 5. 确认并做小额真实测试

> ⚠️ **主网警告——涉及真实资金。请仔细遵循以下步骤：**
>
> 1. 确保所有功能（付款、收款、错误处理）已在测试网充分验证
> 2. 上线主网后，**先用一个最小金额的真实测试（如 `0.001 USDT`）**
> 3. 在区块链浏览器（[TronScan](https://tronscan.org) 或 [BscScan](https://bscscan.com)）确认交易成功
> 4. 打开收款钱包，确认资金已到账
> 5. 确认一切正常后，再将 API 对外公开

---

## 下一步

- 探索[可运行示例](https://github.com/BofAI/x402/tree/main/examples/typescript)，查看完整的 client → server → facilitator 循环，以及 `gasfree`、`upto`、`batch-settlement` 场景
- 阅读[核心概念](../core-concepts/http-402.md)了解 x402 协议的工作原理
- 想了解两种 Facilitator 选项的详细配置？参见 [Facilitator 文档](../core-concepts/facilitator.md)
- 从[用户视角](./quickstart-for-human.md)体验调用付费 API，或配置 [AI 代理](./quickstart-for-agent.md)自动调用您的服务

---

## 完成总结

恭喜 🎉！您已完成卖家快速入门。以下是您完成的所有内容：

| 步骤 | 您做了什么 |
|------|----------|
| **前置准备** | 创建收款钱包、领取测试代币、了解配置参数 |
| **第一步** | 克隆 SDK 仓库并安装示例工作区 |
| **第二步** | 配置 `.env-exact`（钱包与收款地址） |
| **第三步** | 运行无密钥 Express 资源服务器（带付款保护） |
| **第四步** | 接入 Facilitator（官方或自托管）进行结算 |
| **第五步** | 验证付款保护与完整的 client → server → facilitator 付款流程 |

您的 API 现在已准备好通过 x402 协议接受区块链付款！
