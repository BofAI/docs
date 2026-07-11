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

:::info SDK（仅 TypeScript）
x402 是**仅 TypeScript** 的 SDK，以颗粒化的 `@bankofai/x402-*` 包发布。本指南展示如何基于已发布的 npm 包开发。
:::

---

## 前置准备

### 确认运行环境

在终端（macOS/Linux 的 Terminal，或 Windows 的 PowerShell/命令提示符）中运行以下命令，确认所需工具已安装：

```bash
node --version    # 需要 Node.js 22 或更高版本
pnpm --version    # 需要 pnpm 11.1 或更高版本
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

## 第一步：安装 SDK 包

在您的 TypeScript API 项目中安装 Express 适配器和 TRON 支付 scheme：

```bash
pnpm add express @bankofai/x402-core @bankofai/x402-express @bankofai/x402-tron
```

请根据服务框架选择对应包（`@bankofai/x402-express`、`@bankofai/x402-hono`、`@bankofai/x402-fastify` 或 `@bankofai/x402-next`）。如果项目不使用 pnpm，也可以用 `npm install` 或 `yarn add` 安装同名包。

如果开发者想要一个更完整的 client → server → facilitator 例子，可以参考仓库中的 [examples](https://github.com/BofAI/x402/tree/main/examples/typescript)；应用开发仍应依赖已发布的 npm 包，而不是链接 monorepo 源码。

---

## 第二步：准备配置值

最小接入只需要两个值：

| 配置 | 说明 | 示例 |
|------|------|------|
| `HTTPFacilitatorClient.url` | 付款验证与结算服务地址 | `https://facilitator.example.com` |
| `payTo` | 您的 TRON 收款地址 | `T...` |

> 💡 **无密钥 server：** 资源服务器从不签名、不持有私钥——它只公布您的公开收款地址（`payTo`）。签名与结算发生在 client 和 facilitator 侧。

> ⚠️ **安全提醒：** 私钥仅保存在本地环境文件或环境变量中。**切勿将含私钥的文件提交到 Git 或分享给任何人。**

---

## 第三步：创建付费 API 服务器

下面是一个最小 Express 资源服务器：`GET /credit` 需要先支付 `1 USDT`，付款成功后返回信用额度数据。

```typescript
import express from "express";
import { createResourceServer } from "@bankofai/x402-core";
import { HTTPFacilitatorClient } from "@bankofai/x402-core/server";
import {
  x402HTTPResourceServer,
  paymentMiddlewareFromHTTPServer,
} from "@bankofai/x402-express";
import { ExactTronScheme } from "@bankofai/x402-tron/exact/server";

const server = createResourceServer(
  new HTTPFacilitatorClient({
    url: "https://facilitator.example.com",
  })
);

server.register("tron:nile", new ExactTronScheme());

express()
  .use(
    paymentMiddlewareFromHTTPServer(
      new x402HTTPResourceServer(server, {
        "GET /credit": {
          accepts: [
            {
              scheme: "exact",
              network: "tron:nile",
              payTo: "T...",
              price: "1 USDT",
            },
          ],
        },
      })
    )
  )
  .get("/credit", (_req, res) =>
    res.json({
      status: "success",
      credit: 1000000,
    })
  )
  .listen(4021);
```

**关键配置参数：**

| 参数 | 说明 | 示例 |
|------|------|--------|
| `payTo` | 您的收款钱包地址 | `T...` |
| `accepts[].price` | 每次请求价格 | `"1 USDT"` |
| `accepts[].network` | 使用的网络 | 测试网：`tron:nile` |
| `accepts[].scheme` | 付款方式 | `"exact"` |
| `routes` | `"METHOD /path"` → `{ accepts }` 的映射 | `"GET /credit"` |

**工作原理：** 当未付款请求到达您的 API 时，中间件自动返回 HTTP `402 Payment Required` 响应并携带付款要求。client SDK 自动完成付款并重发请求——对终端用户几乎不可见。

---

## 第四步：接入结算服务（Facilitator）

### 什么是 Facilitator？

Facilitator 是一个**自动结算服务**：当有人为您的 API 付款时，Facilitator 验证付款是否真实并将其结算到链上，确保资金到达您的收款钱包。您在第三步构建的 server 仅通过 `HTTPFacilitatorClient` 指向 Facilitator——它不自行结算。

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

在 `HTTPFacilitatorClient` 中将 `url` 设为官方端点：

```typescript
const server = createResourceServer(
  new HTTPFacilitatorClient({
    url: "https://facilitator.bankofai.io",
  })
);
```

这是您的 x402 server 用于验证和结算付款的地址——**仅供 API 调用**，无需在浏览器中打开。

> ⚠️ **未配置 API Key 时，该端点受速率限制**（每个 IP 每分钟一次 `/settle`）。仅适合测试。

#### 4.2 申请 API Key

1. 在浏览器中打开[管理后台](https://admin-facilitator.bankofai.io)，使用钱包登录
2. 在 Dashboard 上点击 **"Create API Key"**
3. 确认后，在 Dashboard 点击 **View** 查看并复制您的 API Key

配置 API Key 后，速率限制提升到 **每分钟 1,000 次**，足以满足生产需求。

#### 4.3 将 API Key 接入您的 server

官方 key 以 `X-API-KEY` 头的形式随每次 facilitator 调用发送。生产环境中，请将它保存在环境变量或密钥管理系统中，并随 facilitator 请求发送。

```bash
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

打开**新终端窗口**（不要关闭 facilitator），在您的 API 项目中运行服务器入口文件：

```bash
pnpm tsx src/server.ts
```

**启动成功后，应看到：**

```
Resource server on http://localhost:4021
```

> ✅ **成功：** 终端显示资源服务器在 `http://localhost:4021`

### 5.2 测试未付款访问（应被拒绝）

在任意终端运行：

```bash
curl http://localhost:4021/credit
```

**预期结果：** 服务器返回 HTTP `402` 响应，携带付款要求（一个 `accepts` 数组，列出 scheme、网络、价格和您的收款地址）。

> ✅ **这正是我们想要的！** 确认付款保护已生效——未付款请求被成功拦截。

### 5.3 测试完整付款流程

要测试完整的 付款 → 获取内容 流程，请使用[用户快速入门](./quickstart-for-human.md)中的最小 client。将 client 请求地址设为 `http://localhost:4021/credit`，预期返回：

```json
{ "status": "success", "credit": 1000000 }
```

---

## 故障排查

| 问题 | 原因 | 解决方案 |
|---------|-------|----------|
| `Failed to fetch` / connection refused | facilitator 或 server 未运行 | 先启动 facilitator，再运行您的 API server 入口文件 |
| client `server offered no payment option matching "…"` | 客户端选择的网络或代币与 server 公布的选项不匹配 | 检查 server 的 `accepts`（网络 + 代币），例如 `tron:nile` + `USDT` |
| `npx tsx` 下出现 `ERR_PACKAGE_PATH_NOT_EXPORTED` | 项目未声明为 ESM | 在 `package.json` 中添加 `"type": "module"` |
| `UnsupportedNetworkError` / `No mechanism registered` | 客户端选择的网络没有注册的 scheme | 确保 client 包含目标网络，例如 `tron:nile` |
| `Insufficient balance` / allowance 错误 | 测试钱包缺少测试代币，或 Permit2 授权额度过低 | 从水龙头领取测试代币；client 在首次付款时会自动批准 Permit2 |
| `Connection timeout` | 网络或请求超时 | 检查连接，或设置可靠的 `EVM_RPC_URL`（如 `https://bsc-testnet-rpc.publicnode.com`） |

---

## 在主网运行

在测试网充分验证后，只需几步即可上线并接受真实付款：

### 1. 将 client 和 server 指向主网

将 server 注册的网络和收款地址切换到主网：

```typescript
server.register("tron:mainnet", new ExactTronScheme());

// accepts 中同步改为：
network: "tron:mainnet",
payTo: "TYourMainnetTronAddress",
price: "1 USDT",
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

若使用官方 facilitator，保持 `HTTPFacilitatorClient` 的 `url` 为 `https://facilitator.bankofai.io`，并继续使用您的 `FACILITATOR_API_KEY`。仅 server 的收款地址切换到主网。

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

- 如果开发者想要一个更完整的例子，可以参考仓库中的 [examples](https://github.com/BofAI/x402/tree/main/examples/typescript)，其中包含 client → server → facilitator 循环，以及 `gasfree`、`upto`、`batch-settlement` 场景
- 阅读[核心概念](../core-concepts/http-402.md)了解 x402 协议的工作原理
- 想了解两种 Facilitator 选项的详细配置？参见 [Facilitator 文档](../core-concepts/facilitator.md)
- 从[用户视角](./quickstart-for-human.md)体验调用付费 API，或配置 [AI 代理](./quickstart-for-agent.md)自动调用您的服务

---

## 完成总结

恭喜 🎉！您已完成卖家快速入门。以下是您完成的所有内容：

| 步骤 | 您做了什么 |
|------|----------|
| **前置准备** | 创建收款钱包、领取测试代币、了解配置参数 |
| **第一步** | 安装 x402 SDK 包 |
| **第二步** | 准备 facilitator 地址与收款地址 |
| **第三步** | 运行无密钥 Express 资源服务器（带付款保护） |
| **第四步** | 接入 Facilitator（官方或自托管）进行结算 |
| **第五步** | 验证付款保护与完整的 client → server → facilitator 付款流程 |

您的 API 现在已准备好通过 x402 协议接受区块链付款！
