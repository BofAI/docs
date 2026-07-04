---
title: 'SDK 功能矩阵'
description: 'x402 TypeScript SDK（1.0.0）的功能支持矩阵，以颗粒化 @bankofai/x402-* 包发布。'
---

# SDK 功能矩阵

本页跟踪 x402 SDK 的功能支持情况。

> **SDK 1.0.0（仅 TypeScript）**：x402 是一个**仅 TypeScript** 的 pnpm/turbo monorepo，以颗粒化的 `@bankofai/x402-*` 包发布。`core` 与 EVM 机制 fork 自 [`x402-foundation/x402`](https://github.com/x402-foundation/x402) 上游；TRON 机制为自研。此前的 Python + TypeScript SDK 已移至 `legacy/` 仅供参考。

---

## 包

| 包 | 用途 |
|---------|---------|
| `@bankofai/x402-core` | 协议类型、client/facilitator/server 引擎、`HTTPFacilitatorClient`、可观测性 |
| `@bankofai/x402-evm` | EVM 机制：`exact`、`upto`、`batch-settlement`、`auth-capture` |
| `@bankofai/x402-tron` | TRON 机制：`exact`、`upto`、`batch-settlement`、`exact_gasfree` |
| `@bankofai/x402-fetch` | 包装 `fetch` 的 client（`wrapFetchWithPayment`） |
| `@bankofai/x402-express` | Express server 中间件 |
| `@bankofai/x402-hono` | Hono server 中间件 |
| `@bankofai/x402-fastify` | Fastify server 中间件 |
| `@bankofai/x402-next` | Next.js server 中间件 |
| `@bankofai/x402-axios` | Axios client 包装 |
| `@bankofai/x402-mcp` | 面向 AI 代理的 MCP 传输（client + server） |
| `@bankofai/x402-extensions` | 扩展：gas 赞助、payment-identifier、bazaar、sign-in-with-x、offer-receipt、builder-code |

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

| 网络 | 状态 |
|-----------|--------|
| `tron:mainnet` | ✅ |
| `tron:nile` | ✅ |
| `tron:shasta` | ✅ |
| `eip155:56`（BSC 主网） | ✅ |
| `eip155:97`（BSC 测试网） | ✅ |

> 上游 EVM 链（Base、Base Sepolia、MegaETH、Monad、Hyperliquid）也已接入 EVM 默认资产注册表。在示例中添加一条链仅需编辑配置表——无需改动 SDK。

---

## 付款方案

x402 1.0.0 支持五种付款方案。每种方案按链族实现为 client + server + facilitator 三件套。

| 方案 | EVM | TRON | 说明 |
|--------|-----|------|-------------|
| `exact` | ✅ | ✅ | 支付精确金额。ERC-3009 `transferWithAuthorization`（无 gas）或 Permit2（一次性 `approve(Permit2)`）用于普通 ERC-20。 |
| `upto` | ✅ | ✅ | 按量计费——client 签署最高至最大金额的 Permit2 授权；server 仅结算实际用量（≤ max）。 |
| `batch-settlement` | ✅ | ✅ | 支付通道：链上一次性存入，然后用链下凭证支付多次请求；facilitator 批量 claim 并在一笔交易中结算。含退款路径。 |
| `auth-capture` | ✅ | ❌ | 托管式授权捕获（仅 EVM）。 |
| `exact_gasfree` | ❌ | ✅ | 仅 TRON。用 USDT/USDD 付款**无需持有 TRX 支付 gas**——由 relayer 通过 GasFree API 支付链上 energy。 |

> **x402 Foundation v2 兼容性**：`exact` 方案（EVM 和 TRON）符合 **x402 Foundation** 发布的 v2 线格式。标准 v2 client 可与本 SDK 的 server 互通，反之亦然。详见[网络与代币支持 → `exact` 方案](./core-concepts/network-and-token-support.md#exact-scheme)。

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

---

## Client 功能

| 功能 | 状态 |
|------------|--------|
| 自动处理 402（`wrapFetchWithPayment`） | ✅ |
| 自动 Permit2 / 代币授权 | ✅ |
| 授权额度检查 | ✅ |
| 签名（TRON，TIP-712） | ✅ |
| 签名（EVM，EIP-712） | ✅ |
| 余额感知的付款选择（`filterAffordableRequirements`） | ✅ |
| 最低价代币选择策略 | ✅ |
| GasFree（零 gas TRON 付款） | ✅ |

---

## Server 功能

| 功能 | 状态 |
|------------|--------|
| 受保护路由集成 | ✅（`paymentMiddlewareFromHTTPServer`、`x402HTTPResourceServer`） |
| 多链 `accepts` 公布 | ✅ |
| gas 赞助扩展（Permit2 approve） | ✅ |
| 付款验证（通过 facilitator） | ✅ |
| 付款结算（通过 facilitator） | ✅ |
| 费率支持 | ✅ |

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

> 自托管示例 facilitator（`facilitator/basic`）暴露 `/verify`、`/settle`、`/supported`。官方托管 facilitator 额外提供 `/fee/quote` 和 `/payments/{id}` 查询端点——详见[官方 Facilitator](./core-concepts/OfficialFacilitator.md)。

---

## 支持的代币

| 代币 | 网络 | 状态 |
|--------|---------|--------|
| USDT（TRC-20） | `tron:mainnet`、`tron:nile` | ✅ |
| USDD（TRC-20） | `tron:mainnet`、`tron:nile` | ✅ |
| USDT（BEP-20） | `eip155:56`、`eip155:97` | ✅ |
| USDC（BEP-20） | `eip155:56`、`eip155:97` | ✅ |
| DHLU（BSC 测试网，ERC-3009） | `eip155:97` | ✅ |
| 自定义 TRC-20 / BEP-20 | 任意 | ✅（通过代币注册表 / `EVM_TOKENS` 配置） |

---

## 可观测性

所有 `@bankofai/x402-*` 包通过 `@bankofai/x402-core` 的一个进程级 logger 输出日志。启动时调用一次 `setLogger(...)` 即可将日志重定向到文件、`pino`/`winston`，或用 `noopLogger` 静默。

---

## 图例

- ✅ = 已实现
- ⏳ = 计划中 / 进行中
- ❌ = 不计划
