import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Facilitator

Facilitator 是一项**可选但强烈推荐**的服务，旨在简化客户端（买家）与服务端（卖家）在区块链网络上的支付验证与结算流程。

## 什么是 Facilitator？

Facilitator 是一种中间件服务，主要负责：

- **验证载荷**：校验客户端提交的支付载荷的有效性。
- **执行结算**：代表服务端将交易提交至区块链进行结算。
- **代币转移**：执行对应方案的链上结算——ERC-3009 `transferWithAuthorization`、通过 `x402ExactPermit2Proxy`（`exact`）或 `x402UptoPermit2Proxy`（`upto`）的 Permit2 转账、批量 settlement claim，或 GasFree relay。

通过引入 Facilitator，服务端无需维护与区块链节点的直连，也无需自行实现复杂的签名验证逻辑。这不仅降低了运维复杂度，还能确保交易验证的准确性与实时性。

## Facilitator 的职责

- **支付验证**：确认客户端提交的签名载荷严格符合服务端声明的支付要求。
- **支付结算**：将验证通过的交易提交至区块链网络，并监控上链状态。
- **结算记录**：每次拿到结算机制结果（成功或失败）的 settle 尝试写入一行，因此失败与重试都会累积。在结算之前或结算过程中被拒绝的请求不写记录：请求体格式错误（400）、赞助访问被拒（403/503）、Permit2 重放防护错误，以及内部错误（500）。表上有一个针对 (`network`, `asset`, `payer`, `nonce`) 且条件为 `status = 'success'` 的部分唯一索引，保证每笔授权至多一条*成功*记录，与链上的重放保护（同一笔授权只能结算一次）互为补充。它同时支持记录查询，调用方认证后才按卖家过滤。保存失败只会记日志，绝不影响 `/settle` 的返回。
- **结果反馈**：将验证与结算结果返回给服务端，作为服务端决定是否交付资源的依据。

> **注意**：Facilitator **不持有资金**，也不充当托管方——它仅根据客户端签名的指令执行验证与链上操作。

## 为什么要使用 Facilitator？

集成 Facilitator 服务能带来显著优势：

- **降低运维门槛**：服务端无需直接处理区块链节点交互或 RPC 管理。
- **协议标准化**：确保跨服务的支付验证与结算流程保持一致。
- **快速集成**：服务端仅需极少的区块链开发工作即可开始接收支付。
- **资源费管理**：Facilitator 负责支付交易执行所需的 TRX（能量 Energy 和带宽 Bandwidth）/BNB，降低了服务端的持有成本。自 SDK 1.2.0 起，TRON 的 Facilitator 还可以选择启用 `trc20ApprovalResourceSponsoring` 扩展，向付款方临时委托自己的 Stake 2.0 能量（必要时还有带宽），使付款方的首笔 `approve(Permit2)` 无需 TRX。该能力需要主动启用：Facilitator 必须注册赞助 runtime，并配套有界的赞助策略与持久化的操作协调器。无论哪种代付，资源服务端都还要在路由上声明对应扩展——正是这个声明让 SDK 客户端附带代付载荷（Facilitator 本身并不校验它，因此非 SDK 客户端可以绕过这一步）。EVM 网络上有对应的能力——为付款方的 ERC-20 `approve` 代付 gas——但 SDK 不会替你接好：自建 Facilitator 必须自行注册该扩展。官方 Facilitator 已为其服务的 EVM 网络注册，并在 Nile 上为持有 API Key 的调用方启用了 TRON 授权资源赞助，详见[官方 Facilitator](./OfficialFacilitator.md)。

虽然开发者可以选择在本地自行实现验证与结算逻辑，但使用 Facilitator 能显著加速开发周期并确保协议实现的规范性。

---

## Facilitator 选项：该用哪种？

要使用 x402，您需要接入 Facilitator 服务。目前有两种方案：

| | 官方 Facilitator | 自托管 Facilitator |
|---|---|---|
| **适合人群** | 大多数卖家，特别是刚开始使用 x402 的用户 | 需要完全掌控结算钱包、RPC 节点以及注册哪些网络/方案的高级用户 |
| **是否需要维护服务器** | 不需要 | 需要 |
| **是否需要结算钱包** | 不需要 | 需要——通过 `@bankofai/agent-wallet` 解析的有余额钱包（用于支付网络手续费）|
| **上手难度** | 低（申请 API Key 即可）| 中（需部署和配置服务）|
| **网络与方案控制** | 固定集合 | 完全自定义 |
| **推荐场景** | 测试、快速上线、中小规模应用 | 大规模生产、私有化或合规要求场景 |

---

## 方案一：使用官方 Facilitator（推荐）

官方托管的 Facilitator 服务已上线，您无需自行维护任何基础设施。

**工作流程：** 申请 API Key → 配置到项目中 → 将 `FACILITATOR_URL` 指向官方服务即可。

**官方服务涉及两个地址，用途不同，请注意区分：**

| 地址 | 用途 |
|------|------|
| [https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io) | **管理后台** — 用于注册账号、申请和管理 Facilitator API Key |
| `https://facilitator.bankofai.io` |  **服务端点** — 在项目代码的 `FACILITATOR_URL` 中配置，用于实际处理付款验证和结算请求（API 调用，非浏览器访问） |

快速使用示例可参考 [官方 Facilitator](./OfficialFacilitator.md) 中示例。

---

## 方案二：自托管 Facilitator

如果您希望完全掌控结算钱包、RPC 节点、能量管理，或注册哪些网络与方案，又或有特定的隐私/合规要求，可以选择自己部署 Facilitator 服务。

> ⚠️ **自托管安全提示：**
> - 自托管 Facilitator 需要一个**有余额的专用钱包**来支付区块链手续费。该钱包通过 `@bankofai/agent-wallet` v3 解析：使用 `privy` 或 `wallet_cli` provider 时私钥留在服务进程之外；`raw_secret` provider 会把明文私钥存在配置中，仅适用于开发环境
> - **这个 Facilitator 钱包应与您的收款钱包分开**，请专门创建一个新钱包
> - Facilitator 钱包只需存入少量代币（用于手续费），不要存入大量资金
> - 不要把原始私钥写进 `.env`、配置文件或命令行，**更不要提交到 Git 或分享给任何人**

快速使用示例可参考 [卖家快速入门](../getting-started/quickstart-for-sellers.md) 中示例。

---

## Facilitator API 端点

无论使用官方还是自托管，Facilitator 均提供以下标准 API 端点：

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/health` | 服务健康检查 |
| GET | `/supported` | 查询支持的支付能力和配置 |
| POST | `/verify` | 验证支付载荷有效性（**受限速保护**，见下文） |
| POST | `/settle` | 执行链上结算（**受限速保护**，见下文）；并持久化一条结算记录 |
| GET | `/payments/tx/{tx_hash}` | 按结算交易哈希查询支付记录（认证后仅返回当前卖家的记录） |
| GET | `/payments?network=&nonce=[&asset=&payer=]` | 按链上授权身份查询支付记录（认证后仅返回当前卖家的记录） |
| GET | `/payments` | 已认证卖家的结算记录流（`?limit=&offset=`；`limit` 默认 `50`、上限 `200`——超过 `200` 会被静默压到 `200`，不会报错；`offset` 默认 `0`） |
| GET | `/sponsoring/ready` | TRON 授权资源赞助的就绪状态（`?network=` 只查单个网络）；就绪返回 HTTP `200`，否则（启动中、恢复中、降级或未启用赞助）返回 `503` |
| GET | `/metrics` | Prometheus 指标（运维用途；仅当监控与主端口共用时才在主端口暴露） |
| ALL | `/mainnet/*` · `/nile/*` | GasFree Open API 透明代理（HMAC 签名）——由 TRON `exact_gasfree` 方案内部使用 |

记录查询的失败会返回以下错误码：无匹配记录时 `404 not_found`；身份查询参数不完整（传了 `network`/`nonce`/`asset`/`payer` 中的部分，但缺少必需的 `network`+`nonce` 组合）时 `400 invalid_identity_query`；调用 `/payments` 但既未提供身份参数也未提供 API Key 时 `400 missing_identity_or_auth`。

`/verify` 与 `/settle` 保持 x402 的响应结构（`invalidReason` / `errorReason`）。除 SDK 自身的原因外，服务还会返回：请求体格式错误时 `400 invalid_json` 或 `missing_parameters`；`413` `{"code":"body_too_large","message":…}`（默认上限 1 MiB）；`429` `{"error":"rate_limit_exceeded"}`；请求携带 `trc20ApprovalResourceSponsoring` 但部署不予赞助时 `403 sponsor_auth_required`、`sponsor_network_disabled` 或 `sponsor_pay_to_invalid`；暂时性状况返回 `503` 并带 `Retry-After`（`sponsor_owner_busy`、`sponsor_recovery_in_progress`、`sponsor_storage_unavailable`，以及仅 `/settle` 会返回的 `permit2_authorization_busy`、`permit2_storage_unavailable`、`permit2_nonce_check_unavailable`）。`/settle` 时 nonce 已被消耗的 Permit2 授权会以 `permit2_nonce_consumed`（HTTP 200）失败，不会广播新交易；授权格式错误时 `/settle` 返回 `400 permit2_invalid_authorization`。受赞助的授权还可能在协议层失败（HTTP 200，放在 `invalidReason` / `errorReason` 里）：`approval_transaction_reused`（已签名的 approve 已被用于另一笔不同的支付请求）、`sponsor_approval_lifetime_exceeded`（已签名 approve 的有效期超过 630 秒），以及仅 `/settle` 会返回的 `sponsor_existing_delegation`。未预期的异常返回 `500 internal_error`。GasFree 代理只挂在 `/mainnet` 和 `/nile` 下（其他路径直接返回普通的 `404`），上游失败或响应过大时返回 `502 bad_gateway`。

> **不存在** `/fee/quote` 端点，各方案也完全不收取 facilitator 费用。支付记录以链上授权身份（`network` + `scheme` + `asset` + `payer` + `nonce`）为键，而非客户端提供的 payment ID。

---

## 限速策略

`/verify` 与 `/settle` 端点根据调用方的认证状态动态执行限速，两个端点各自独立计数：

| 模式 | 限速 | 认证方式 |
|------|------|----------|
| **已认证** | 官方服务：每个 API Key 每分钟最多 1000 次，`/verify` 与 `/settle` 分别计数；自建部署未配置 `rate_limit.authenticated` 时采用相同默认值（可自行调整） | 请求头携带 `X-API-KEY: <your_key>` |
| **匿名** | 官方服务：每个 IP 每分钟最多 10 次，`/verify` 与 `/settle` 分别计数；这也是自建部署未配置 `rate_limit.anonymous` 时的默认值（可自行调整） | 不携带 API Key |

其他端点（`/supported`、`/payments/*`、`/sponsoring/ready`、`/health`）不限速。超出限额时返回 HTTP `429` `{"error":"rate_limit_exceeded"}`，并带 `Retry-After` 头。

> **计数按实例进行。** 官方生产配置使用 `rate_limit.store: memory`，每个 facilitator 实例各自维护计数器；落到不同实例上的请求不会累计到同一个总数里。自建部署默认同样使用内存存储——如需在多个副本间共享计数，请设置 `rate_limit.store: redis`（并配置 `redis_url`）。

> **提示**：任何生产级别的工作负载都建议通过[管理后台](https://admin-facilitator.bankofai.io)申请 API Key，以解锁更高的限速配额。

---

## 支付记录查询

`/payments/tx/{tx_hash}` 和 `/payments?network=&nonce=[&asset=&payer=]` 端点支持查询历史支付记录；`/payments` 单独返回已认证卖家的结算记录流。记录以链上授权身份（`network` + `scheme` + `asset` + `payer` + `nonce`）为键，而非客户端提供的 payment ID。

当请求携带有效的 `X-API-KEY` 时，返回结果会**自动按该 API Key 关联的卖家进行过滤**——您只能看到自己名下的支付记录。

:::danger 匿名的标识符查询不做卖家过滤
当前的访问行为如下：

- **携带有效 `X-API-KEY`**——查询结果按该 Key 对应的卖家过滤。
- **匿名调用 `tx_hash` 或 `network` + `nonce` 查询接口**——当前实现**不添加卖家过滤**，返回结果可能包含已绑定卖家的记录。
- **`/payments` 列表接口**——仍要求身份验证：不带身份参数又不带 API Key 时返回 `400`，只给部分身份参数同样返回 `400`，不会退化成记录流。
- **这两个查询接口没有限流**——官方服务的匿名限流只作用于 `/verify` 与 `/settle`，记录查询接口没有单独限流。

结算 tx hash 属于链上公开数据，而 `network` + `nonce` 查询还能查到**失败**的结算——包括广播前就失败的那些，它们根本没有 tx hash，也就无从通过其他途径查到。实际后果是：**结算元数据应当被视为事实上公开的**，尽管并不存在免认证的列表接口。响应体从不包含卖家 id，因此查询暴露的是某条已绑定卖家记录的支付元数据，而不是卖家归属本身。

**以上描述的是当前实现行为，不代表推荐的访问控制策略。** 请勿依赖它做设计：绝不要把结算 tx hash 或授权 nonce 当作秘密；希望查询限定在自己账户范围内时，请带上 API Key。该行为在后续版本中可能收紧。
:::

---

## 费用

当前各方案**不收取 facilitator 费用**：没有 `base_fee` 配置，支付要求中没有费用对象，也没有 `/fee/quote` 端点——它们已在 SDK 1.0.1 中移除。一次结算向卖家转移的是签名中的金额——不会少于公布金额；使用官方 SDK/CLI 付款时即为公布金额本身。

实际存在的成本只有：

- **网络手续费**（TRON 的能量/带宽 TRX、BNB 或 ETH gas）由 Facilitator 的结算钱包承担。
- **GasFree 中继费**：即中继方代付网络能量所收的服务费（每笔转账费，新 GasFree 账户首笔另加一次性激活费），TRON `exact_gasfree` 下由中继方自行定价，在付款金额之外从支付代币中扣除——客户端应显式设置上限。

---

## 信任模型

x402 协议的设计核心在于**最小化信任假设**：

- **授权签名**：Facilitator 仅能划转客户端签名授权范围内的资金。
- **资金直达**：在 `exact` 与 `upto` 下，资金从客户端直接流向卖家，中间不经过资金池。`batch-settlement` 是有意为之的例外——付款方先存入链上托管合约，由它保管通道余额，直到一次 settle 操作把多笔认领汇总成一次转账。所有方案都不收取 facilitator 费用。
- **链上验证**：所有交易记录均在区块链上公开可查。

即使是**恶意的 Facilitator** 也无法执行以下操作：

- 划转超过客户端授权限额的资金。
- 将资金转移给非签名指定的接收方。
- 篡改任何已签名的支付条款。

---

## 总结

在 x402 协议体系中，**Facilitator** 充当了区块链链上的独立验证与结算层。它赋能服务端在无需部署完整区块链基础设施的情况下，安全地确认支付并完成链上结算。

---

## 下一步

- [官方 Facilitator](./OfficialFacilitator.md) — 如何申请和配置官方 Facilitator 的 API Key（详细图文步骤）
- [卖家快速入门](../getting-started/quickstart-for-sellers.md) — 完整的服务端接入流程
- [钱包](./wallet.md) — 了解如何管理用于支付的钱包
- [网络与代币支持](./network-and-token-support.md) — 了解支持的网络和代币
