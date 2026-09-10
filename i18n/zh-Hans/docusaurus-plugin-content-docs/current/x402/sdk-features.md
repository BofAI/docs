---
title: 'SDK 功能矩阵'
description: 'x402 TypeScript SDK 的功能支持矩阵，以颗粒化 @bankofai/x402-* 包发布。'
---

# SDK 功能矩阵

本页跟踪 x402 SDK 的功能支持情况。

> **SDK（仅 TypeScript）**：x402 是一个**仅 TypeScript** 的 SDK，以颗粒化的 `@bankofai/x402-*` npm 包发布。源码由 pnpm/turbo monorepo 维护，但应用应依赖已发布的包。此前的 Python + TypeScript SDK 已移至 `legacy/` 仅供参考。
>
> **当前版本：1.2.0**（2026-08-28）。11 个 `@bankofai/x402-*` 包共用一条版本线，但不再次次齐步发布：1.2.0 发布了 `@bankofai/x402-extensions` 与 `@bankofai/x402-tron` 的 `1.2.0`，`@bankofai/x402-express`、`-fastify`、`-hono`、`-next` 的 `1.1.1`，而 `@bankofai/x402-core`、`-evm`、`-fetch`、`-axios`、`-mcp` 仍为 `1.1.0`（本次发布未变更其 API 与依赖）。每个包将内部依赖锁定为对应包已发布版本的 `~` 范围，因此请按上述版本组合安装。SDK 要求 **Node.js 22+**。

---

## 包

| 包 | 用途 |
|---------|---------|
| `@bankofai/x402-core` | 协议类型、client/facilitator/server 引擎、`HTTPFacilitatorClient`、可观测性 |
| `@bankofai/x402-evm` | EVM 机制：`exact`、`upto`、`batch-settlement`，另含 `auth-capture` 的 client（`@bankofai/x402-evm/auth-capture/client`，不导出 server 与 facilitator） |
| `@bankofai/x402-tron` | TRON 机制：`exact`、`upto`、`batch-settlement`、`exact_gasfree` |
| `@bankofai/x402-fetch` | 包装 `fetch` 的 client（`wrapFetchWithPayment`） |
| `@bankofai/x402-express` | Express server 中间件 |
| `@bankofai/x402-hono` | Hono server 中间件 |
| `@bankofai/x402-fastify` | Fastify server 中间件 |
| `@bankofai/x402-next` | Next.js server 中间件 |
| `@bankofai/x402-axios` | Axios client 包装 |
| `@bankofai/x402-mcp` | 面向 AI 代理的 MCP 传输（client + server） |
| `@bankofai/x402-extensions` | 扩展：EVM gas 赞助（`eip2612GasSponsoring`、`erc20ApprovalGasSponsoring`）、TRON 资源赞助（`trc20ApprovalResourceSponsoring`，1.2.0 新增）、payment-identifier、bazaar、sign-in-with-x、offer-receipt、builder-code |

---

## 核心组件

| 组件 | 状态 |
|------------|--------|
| 资源服务器（Resource Server） | ✅ |
| 客户端（Client） | ✅ |
| Facilitator | ✅ |

### HTTP 框架集成

| 角色 | 框架 |
|------|------------|
| Server | Express、Fastify、Hono、Next.js |
| Client | `fetch`（包装）、Axios、MCP |

---

## 网络

| 网络 | SDK 常量 | 状态 |
|-----------|----------|--------|
| `tron:0x2b6653dc` | `TRON_MAINNET` | ✅ |
| `tron:0xcd8690dc` | `TRON_NILE` | ✅ |
| `tron:0x94a9059e` | `TRON_SHASTA` | ✅ |
| `eip155:56`（BSC 主网） | - | ✅ |
| `eip155:97`（BSC 测试网） | - | ✅ |
| `eip155:8453`（Base 主网） | - | ✅ |
| `eip155:84532`（Base Sepolia） | - | ✅（CLI/SDK 测试） |

> 另有二十条上游 EVM 链（MegaETH、Monad、Polygon、Arbitrum One/Sepolia、Celo、XDC、Flare、Mezo、Radius、Stable、ADI、HPP、Igra 等）也已接入 EVM 默认资产注册表。公开 API Catalog 只发布 Base 主网路由；Base Sepolia 保留用于 CLI/SDK 测试。

---

## 付款方案

x402 定义了五种命名付款方案。其中四种按链族提供 client + server + facilitator 三件套；`auth-capture` 目前仅提供 EVM client 实现。

| 方案 | EVM | TRON | 说明 |
|--------|-----|------|-------------|
| `exact` | ✅ | ✅ | 支付精确金额。ERC-3009 `transferWithAuthorization`（无 gas）或 Permit2（一次性 `approve(Permit2)`）用于普通 ERC-20。 |
| `upto` | ✅ | ✅ | 按量计费——client 签署最高至最大金额的 Permit2 授权；server 仅结算实际用量（≤ max）。 |
| `batch-settlement` | ✅ | ✅ | 支付通道：链上一次性存入，然后用链下凭证支付多次请求；facilitator 批量 claim 并在一笔交易中结算。含退款路径。 |
| `exact_gasfree` | ❌ | ✅ | 仅 TRON。用 USDT/USDD 付款**无需持有 TRX 支付 gas**——由 relayer 通过 GasFree API 支付链上 energy。 |
| `auth-capture` | ⚠️ 仅 Client | ❌ | 可退款的 Base Commerce Payments 授权/扣款流程。当前发布包尚未提供对应的 server 或 facilitator 实现。 |

### 付款流程（1.1.0 新增）

scheme/network server 现在会按资产转账方式声明自己支持哪些付款流程。`upfront` 与 `escrow` 会通过 `extra.paymentFlow` 在协议中传递；`authorization` 是默认流程，不会写入 `extra`——字段缺失即代表它：

| 流程 | 含义 |
|------|------|
| `authorization` | client 签署授权，facilitator 在结算时划走资金——即 `exact` / `upto` 的经典行为，也是默认流程。 |
| `upfront` | client 在资源交付前先转出资金。 |
| `escrow` | 资金先锁进托管，之后再捕获、作废或退款，而不是直接转给卖家。 |

v1.0 的 `SchemeNetworkServer` 实现可以不声明付款流程，它们会继续沿用 authorization 流程。

`upfront` 与 `escrow` 是给自定义方案用的编排钩子。截至 1.1.0，内置的四个 server 方案（`exact`、`upto`、`batch-settlement`、`exact_gasfree`）都只声明 `authorization`，因此使用内置方案时 `extra.paymentFlow` 不会出现在协议数据里。

> **x402 Foundation v2 兼容性**：`exact` 方案（EVM 和 TRON）符合 **x402 Foundation** 发布的 v2 线格式。标准 v2 client 可与本 SDK 的 server 互通，反之亦然。详见[网络与代币支持 → `exact` 方案](./core-concepts/network-and-token-support.md#exact-scheme)。

---

## 扩展（Extensions） {#extensions}

`@bankofai/x402-extensions` 提供一组可选的协议扩展：`bazaar`、`sign-in-with-x`、`offer-receipt`、`payment-identifier`、`eip2612-gas-sponsoring`、`erc20-approval-gas-sponsoring`、`trc20-approval-resource-sponsoring` 与 `builder-code`。它们均从包根导出——赞助类扩展没有单独的子路径入口。由 resource server 在 `PaymentRequired.extensions` 中声明某个扩展；赞助类扩展与 `payment-identifier` 只在 server 声明后才生效，而 `builder-code` 的归属码由注册了它的一方自行附加，不依赖 server 声明。

### TRON 授权资源赞助（1.2.0 新增）

`trc20ApprovalResourceSponsoring`（协议 schema 版本 `1`）让付款方在**不持有 TRX** 的情况下完成 TRON 上的**首笔** Permit2 付款或通道存入。client 不再自行广播那笔一次性的 `approve(Permit2, MaxUint256)`，而是签名后将已签名的交易字节随付款载荷一并上传；facilitator 严格解码并将其与本次付款绑定校验，临时向付款方委托其所缺的（Stake 2.0）能量——必要时还有带宽，原封不动地广播该交易，随后通过可恢复的状态机回收委托的资源。

| 角色 | 做什么 |
|------|--------|
| Resource server | **主动启用**——将 `declareTrc20ApprovalResourceSponsoringExtension()` 展开到路由的 `extensions` 里。该路由必须使用 `extra.assetTransferMethod: "permit2"`。 |
| Client | **无需配置**——当 server 声明了版本 `1`、所选路径为 Permit2、且当前 Permit2 授权额度不足时，`@bankofai/x402-tron` 会自动附上已签名的授权交易。 |
| Facilitator | **主动启用**——用 `@bankofai/x402-tron` 的 `createTrc20ResourceSponsoringRuntime({ ... })` 构造 runtime，再注册 `createTrc20ApprovalResourceSponsoringExtension(runtime)`。 |

适用于 TRON 的 `exact`（`assetTransferMethod: "permit2"`）、TRON 的 `upto`，以及 `batch-settlement` 的 Permit2 **存入/补充**路径；不用于 EIP-3009 转账，也不用于批量结算的凭证、claim、settle 与退款路径。它只赞助那一笔 `approve` 交易——付款金额、收款方、nonce、截止时间仍然只由 scheme 载荷决定，且这笔 `approve` 内部不会向用户收取任何费用。也没有新增接口：流程仍为 `402 Payment Required` → `PAYMENT-SIGNATURE` → `/verify` → `/settle`。

```typescript
import { declareTrc20ApprovalResourceSponsoringExtension } from "@bankofai/x402-extensions";

const route = {
  price: {
    amount: "1000000",
    asset: "T...",
    extra: { assetTransferMethod: "permit2" },
  },
  extensions: {
    ...declareTrc20ApprovalResourceSponsoringExtension(),
  },
};
```

:::caution 前提与限制
- 付款方必须是**已激活的单签名 TRON 外部账户（EOA）**，且使用默认的 owner 权限；不支持多签与自定义权限账户。
- 在默认的 `zero-first` 授权策略下，**非零但不足**的授权额度会直接报 `approval_reset_required`——SDK 不会自动插入一笔 `approve(0)`。不属于已知 Permit2 资产的代币会报 `approval_asset_unsupported`，除非你用 `createTrc20ApprovalPolicy` 为它配置策略。
- 生产环境的 facilitator 必须为 runtime 配备持久化的操作协调器，并在启动时及定时运行对账；导出的 `InMemoryTrc20SponsoringCoordinator` 仅用于测试和单进程开发。
- [官方 facilitator](./core-concepts/OfficialFacilitator.md) 目前**未**启用该扩展；TRON 授权赞助需要自建 facilitator，并准备一个有 Stake 2.0 资源量的资源持有钱包。
:::

---

## Signer

密钥托管在 [`@bankofai/agent-wallet`](https://github.com/BofAI/agent-wallet) 中；SDK 从不接触原始私钥。signer 工厂内部构建链 client（viem / TronWeb）。

| signer 工厂 | 角色 |
|----------|------|
| `createClientTronSigner` | Client（TRON） |
| `createClientEvmSigner` | Client（EVM） |
| `createFacilitatorTronSigner` | Facilitator（TRON） |
| `createFacilitatorEvmSigner` | Facilitator（EVM） |
| `createAuthorizerTronSigner` | Authorizer（TRON，batch-settlement） |
| `createAuthorizerEvmSigner` | Authorizer（EVM，batch-settlement） |

---

## Client 功能

| 功能 | 状态 |
|------------|--------|
| 自动处理 402（`wrapFetchWithPayment`） | ✅ |
| 自动 Permit2 / 代币授权 | ✅ |
| 授权额度检查 | ✅ |
| 签名（TRON，TIP-712） | ✅ |
| 签名（EVM，EIP-712） | ✅ |
| 余额感知的付款选择（`filterAffordableRequirements`） | ✅ 仅 TRON |
| 最低价代币选择策略 | ✅ 仅 TRON |
| GasFree（零 gas TRON 付款） | ✅ |
| 消费管控（默认资产白名单 + 单笔上限） | ✅ —— **1.1.0 起默认开启** |
| 按资产的原子单位上限（`allowedAssets[].maxAmountPerPayment`） | ✅ |
| 付款选择策略（`PaymentPolicy`） | ✅ |
| 生命周期钩子（`onBeforePaymentCreation`、`onAfterPaymentCreation`、`onPaymentCreationFailure`、`onPaymentResponse`） | ✅ |

:::caution 消费管控默认开启
1.1.0 起，client 只会支付默认资产注册表中认识的资产，且每笔付款上限为 `DEFAULT_MAX_AMOUNT_PER_PAYMENT`（约合 `$1`）。要提高上限，用 `spendControls.maxAmountPerPayment`（`Money` 值，或 `false` 取消上限）。要支付自定义代币，把它列入 `spendControls.allowedAssets`（可单独设置 `maxAmountPerPayment`，但该值必须是最小单位的整数，而非美元金额），或设 `allowedAssets: true` 放行任意资产。`spendControls: false` 则整体关闭该防护。
:::

---

## Server 功能

| 功能 | 状态 |
|------------|--------|
| 受保护路由集成 | ✅（`paymentMiddlewareFromHTTPServer`、`x402HTTPResourceServer`） |
| 多链 `accepts` 公布 | ✅ |
| EVM gas 赞助扩展（`eip2612GasSponsoring` / `erc20ApprovalGasSponsoring`） | ✅ |
| TRON 资源赞助扩展（`trc20ApprovalResourceSponsoring`） | ✅ —— 1.2.0 新增；用 `declareTrc20ApprovalResourceSponsoringExtension()` 声明 |
| 付款验证（通过 facilitator） | ✅ |
| 付款结算（通过 facilitator） | ✅ |

---

## Facilitator 功能

| 功能 | 状态 |
|------------|--------|
| `POST /verify` 端点 | ✅ |
| `POST /settle` 端点 | ✅ |
| `GET /supported` 端点 | ✅ |
| 提交链上交易 | ✅ |
| 确认交易（回执轮询） | ✅ |
| 扩展钩子（`onBeforeSettle` / `onAfterSettle` / `onSettleFailure`） | ✅ |
| EVM 智能账户——已部署账户、ERC-7702 委托、ERC-6492 反事实钱包 | ✅ —— 签名验证在 facilitator 侧；ERC-6492 需显式配置 `eip6492AllowedFactories` 白名单 |

> 自托管示例 facilitator（`facilitator/basic`）暴露 `/verify`、`/settle`、`/supported`。官方托管 facilitator 额外提供结算记录查询 `GET /payments/tx/{tx_hash}` 与 `GET /payments`，以及 `/health`——详见[官方 Facilitator](./core-concepts/OfficialFacilitator.md)。Prometheus 指标在独立的监控端口上（发布配置中为 `9001`），不在对外 API 端口。没有 `/fee/quote` 端点：SDK 的各方案不收取 facilitator 费用。
>
> 1.1.0 起，`HTTPFacilitatorClient` 使用带类型的超时错误，默认超时 90 秒。其限流重试（3 次）只作用于 `getSupported()`——`verify()` 与 `settle()` 遇到 429 会直接抛给调用方，不会重试。

---

## 支持的代币

| 代币 | 网络 | 状态 |
|--------|---------|--------|
| USDT（TRC-20） | `tron:0x2b6653dc`、`tron:0xcd8690dc`、`tron:0x94a9059e` | ✅ |
| USDD（TRC-20） | `tron:0x2b6653dc`、`tron:0xcd8690dc` | ✅ |
| USDT（BEP-20） | `eip155:56`、`eip155:97` | ✅ |
| USDC（BEP-20） | `eip155:56`、`eip155:97` | ✅ |
| DHLU（BSC 测试网，ERC-3009） | `eip155:97` | ✅ |
| 官方 USDC（ERC-20，EIP-3009） | `eip155:8453`、`eip155:84532` | ✅ |
| 自定义 TRC-20 / BEP-20 | 任意 | ✅（通过代币注册表 / `EVM_TOKENS` 配置） |

> 其中只有一部分是**默认资产**：TRON 与 BSC 主网上的 USDT、BSC 测试网与 Base 上的 USDC。1.1.0 起，客户端消费管控会拒绝其余资产——USDD、BSC 主网 USDC、BSC 测试网 USDT、DHLU、自定义代币——除非通过 `spendControls.allowedAssets` 放行。详见[网络与代币支持](./core-concepts/network-and-token-support.md#supported-tokens)。

---

## 可观测性

所有 `@bankofai/x402-*` 包通过 `@bankofai/x402-core` 的一个进程级 logger 输出日志。启动时调用一次 `setLogger(...)` 即可将日志重定向到文件、`pino`/`winston`，或用 `noopLogger` 静默。

---

## 图例

- ✅ = 已实现
- ⏳ = 计划中 / 进行中
- ❌ = 不计划
