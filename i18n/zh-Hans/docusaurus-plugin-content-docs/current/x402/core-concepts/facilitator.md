import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Facilitator

Facilitator 是一项**可选但强烈推荐**的服务，旨在简化客户端（买家）与服务端（卖家）在区块链网络上的支付验证与结算流程。

## 什么是 Facilitator？

Facilitator 是一种中间件服务，主要负责：

- **验证载荷**：校验客户端提交的支付载荷的有效性。
- **执行结算**：代表服务端将交易提交至区块链进行结算。
- **代币转移**：通过调用 `PaymentPermit` 合约的 `permitTransferFrom` 方法来执行代币转移。

通过引入 Facilitator，服务端无需维护与区块链节点的直连，也无需自行实现复杂的签名验证逻辑。这不仅降低了运维复杂度，还能确保交易验证的准确性与实时性。

## Facilitator 的职责

- **支付验证**：确认客户端提交的签名载荷严格符合服务端声明的支付要求。
- **支付结算**：将验证通过的交易提交至区块链网络，并监控上链状态。
- **费率管理**：支持配置服务费（可选），即对促成的支付收取费用。
- **结果反馈**：将验证与结算结果返回给服务端，作为服务端决定是否交付资源的依据。

> **注意**：Facilitator **不持有资金**，也不充当托管方——它仅根据客户端签名的指令执行验证与链上操作。

## 为什么要使用 Facilitator？

集成 Facilitator 服务能带来显著优势：

- **降低运维门槛**：服务端无需直接处理区块链节点交互或 RPC 管理。
- **协议标准化**：确保跨服务的支付验证与结算流程保持一致。
- **快速集成**：服务端仅需极少的区块链开发工作即可开始接收支付。
- **资源费管理**：Facilitator 负责支付交易执行所需的 TRX（能量 Energy 和带宽 Bandwidth）/BNB，降低了服务端的持有成本。

虽然开发者可以选择在本地自行实现验证与结算逻辑，但使用 Facilitator 能显著加速开发周期并确保协议实现的规范性。

---

## Facilitator 选项：该用哪种？

要使用 x402，您需要接入 Facilitator 服务。目前有两种方案：

| | 官方 Facilitator | 自托管 Facilitator |
|---|---|---|
| **适合人群** | 大多数卖家，特别是刚开始使用 x402 的用户 | 需要完全掌控费用策略、能量管理的高级用户 |
| **是否需要维护服务器** | 不需要 | 需要 |
| **是否需要钱包私钥** | 不需要 | 需要（用于支付手续费）|
| **上手难度** | 低（申请 API Key 即可）| 中（需部署和配置服务）|
| **费用控制** | 固定策略 | 完全自定义 |
| **推荐场景** | 测试、快速上线、中小规模应用 | 大规模生产、需要自定义费率 |

---

## 方案一：使用官方 Facilitator（推荐）

官方托管的 Facilitator 服务已上线，您无需自行维护任何基础设施。

**工作流程：** 申请 API Key → 配置到项目中 → 将 `FACILITATOR_URL` 指向官方服务即可。

**官方服务涉及两个地址，用途不同，请注意区分：**

| 地址 | 用途 |
|------|------|
| [https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io) | **管理后台** — 用于注册账号、申请和管理 Facilitator API Key |
| [https://facilitator.bankofai.io](https://facilitator.bankofai.io) |  **服务端点** — 在项目代码的 `FACILITATOR_URL` 中配置，用于实际处理付款验证和结算请求（API 调用，非浏览器访问） |

快速使用示例可参考 [官方 Facilitator](./OfficialFacilitator.md) 中示例。

---

## 方案二：自托管 Facilitator

如果您希望完全掌控费用策略、能量管理，或有特定的隐私/合规要求，可以选择自己部署 Facilitator 服务。

> ⚠️ **自托管安全提示：**
> - 自托管 Facilitator 需要使用一个**专用钱包**的私钥来支付区块链手续费
> - **这个 Facilitator 钱包应与您的收款钱包分开**，请专门创建一个新钱包
> - Facilitator 钱包只需存入少量代币（用于手续费），不要存入大量资金
> - 私钥通过环境变量设置，**绝对不要提交到 Git 或分享给任何人**

快速使用示例可参考 [卖家快速入门](../getting-started/quickstart-for-sellers.md) 中示例。

---

## Facilitator API 端点

无论使用官方还是自托管，Facilitator 均提供以下标准 API 端点：

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/health` | 服务健康检查 |
| GET | `/supported` | 查询支持的支付能力和配置 |
| POST | `/fee/quote` | 获取支付要求的费用预估 |
| POST | `/verify` | 验证支付载荷有效性 |
| POST | `/settle` | 执行链上结算（官方 Facilitator 下**受限速保护**） |
| GET | `/payments/{payment_id}` | 按支付 ID 查询支付记录（认证后仅返回当前卖家的记录） |
| GET | `/payments/tx/{tx_hash}` | 按交易哈希查询支付记录（认证后仅返回当前卖家的记录） |

---

## 限速策略

`/settle` 端点根据调用方的认证状态动态执行限速：

| 模式 | 限速 | 认证方式 |
|------|------|----------|
| **已认证** | 1000 次 / 分钟 | 请求头携带 `X-API-KEY: <your_key>` |
| **匿名** | 1 次 / 分钟 | 不携带 API Key |

其他端点（`/verify`、`/fee/quote`、`/supported`、`/payments/*`）不单独限速。

> **提示**：任何生产级别的工作负载都建议通过[管理后台](https://admin-facilitator.bankofai.io)申请 API Key，以解锁更高的限速配额。

---

## 支付记录查询

`/payments/{payment_id}` 和 `/payments/tx/{tx_hash}` 端点支持查询历史支付记录。

当请求携带有效的 `X-API-KEY` 时，返回结果会**自动按该 API Key 关联的卖家进行过滤**——您只能看到自己名下的支付记录。匿名请求（不带 API Key）只能访问未绑定任何卖家的记录。

---

## 费用结构

Facilitator 支持灵活配置服务费用：

- **固定费用 (Base Fee)**：每笔交易收取固定的服务费（例如 `1 USDT`）。
- **按比例收费 (Percentage Fee)**：按交易金额的一定百分比收取费用。
- **免费模式 (No Fee)**：支持零费率运营模式。

具体的费用明细将通过 `/fee/quote` 端点返回，并包含在服务端下发给客户端的支付要求（Payment Requirements）中。

---

## 信任模型

x402 协议的设计核心在于**最小化信任假设**：

- **授权签名**：Facilitator 仅能划转客户端签名授权范围内的资金。
- **资金直达**：资金从客户端直接流向卖家（若有服务费，则部分流向 Facilitator），中间不经过资金池。
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
