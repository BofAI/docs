---
title: 'BANK OF AI x402：面向 AI 智能体的稳定币支付方案'
description: '从 HTTP 402 的挑战—响应流程，到 exact / exact_gasfree / upto / batch-settlement 四种支付方案的取舍，以及一个基于 TRON 的端到端付费推理案例。'
---

# BANK OF AI x402：面向 AI 智能体的稳定币支付方案

## 1. 当 AI 智能体开始需要支付

AI 智能体不只是读取公开信息。它会检索数据、调用模型、购买专业工具，甚至把一个任务交给另一个 Agent。在这些场景里，服务的消费者不再总是坐在浏览器前的人，而是会根据任务、价格和预算自行作出调用决策的软件。

传统收费方式为人工操作而设计：先注册账户、保存 API Key、购买套餐或预充值。它们仍然适合长期客户关系，却不擅长处理一次性的、跨服务的、金额很小的机器调用。调用方必须预先开户和授信，服务方又要维护账户、额度和账单；一项临时需要的能力也可能因此无法被 Agent 自主购买。

x402 把支付协商放回 HTTP 请求本身。服务先说明「这个资源需要什么付款」，客户端在理解条件后签署付款凭证并重试请求。于是，按次付费可以与 API 调用处于同一交互闭环：没有预先建立账户关系，也不需要把支付页面塞进 Agent 的执行路径。

## 2. BANK OF AI x402 与 TRON

### 2.1 x402 是什么

HTTP `402 Payment Required` 长期保留为「需要支付」的状态码。x402 将它变成一次可机器处理的挑战—响应流程：

1. 客户端请求受保护的资源。
2. Resource Server 返回 `402`，并在 `PAYMENT-REQUIRED` 头中提供一个或多个可接受的 Payment Requirements，例如网络、资产、金额、收款方、有效期和支付方案。
3. 客户端选择自己能够满足的一项要求，使用钱包签署 Payment Payload，并在重试请求中通过 `PAYMENT-SIGNATURE` 头携带它。
4. 服务端验证付款；必要时由 Facilitator 验证签名和链上可结算性，并在结算后向客户端返回资源与 `PAYMENT-RESPONSE`。

Payment Requirements 是服务端的报价与约束，Payment Payload 是客户端对其中一项条件的签名响应。两者必须一起被验证：不能只验证「有一笔转账」，还必须确认网络、Token、金额、收款地址、有效期及所选 scheme 与最初的报价一致。

### 2.2 为什么优先支持 TRON

TRON 为 x402 提供了面向稳定币的结算环境。对于以美元计价的 API、模型推理和数据服务，TRC-20 稳定币使报价与用户的成本预期更直接；网络也适合需要频繁、小额支付的应用。当前 SDK 支持 TRON Nile、Shasta 测试网及主网，开发时应先在测试网完成全链路验证。

但「低成本」不是「零成本」。普通 TRON 交易仍涉及带宽、能量或 TRX；确认时间、RPC 可用性、Token 合约支持及 Facilitator 的流动性与风控策略都会影响真实体验。BANK OF AI x402 的价值在于以统一的 HTTP 支付协议接入这些稳定币能力，而不是保证任何 Token、钱包或网络条件下都能自动付款。

### 2.3 BANK OF AI x402

BANK OF AI x402 完全兼容 Coinbase x402 的核心 HTTP 支付协议与交互模型：服务端以 `402 Payment Required` 发布支付要求，客户端签署支付凭证后重试请求，并通过标准化的验证与结算流程完成交付。因此，支持 x402 的 Agent、Resource Server 和 Facilitator 可以复用相同的协议模型。BANK OF AI 的扩展重点位于多网络、稳定币资产以及相应的签名和结算实现层；TRON 则是本文重点展开的结算网络。

在 TRON 生态中，[BANK OF AI](/zh-Hans/BANK-OF-AI/Intro/) 将自身定位为「你的 Web3 AI 门户」，为 Agent 提供付款、身份、行动与认知能力。产品矩阵采用三层架构：**应用层**是 Agent 运行和被使用的地方——Agent Harness、Agent 应用与 Marketplace；**中间层**是 BANK OF AI 提供的服务与开发工具——Agent 集成与 Skills、Agent Wallet、x402 支付服务、MCP 服务，以及 x402 SDK、8004 SDK 与各类 CLI；**基础设施与标准层**则是协议标准与所依赖的链上、模型基座——MCP / x402 / 8004 协议，链上合约与资产，以及 LLM 服务与基础模型。

![BANK OF AI 产品矩阵](/img/devnotes/bankofai-product-matrix.svg)

在这套分层中，x402 是基础设施与标准层里的开放支付协议，与负责 Agent 身份和信誉的 8004 并列；MCP 则定义 Agent 与工具之间的上下文交互方式。x402 Gateway、x402 Facilitator、x402 Recharge Server、Agent Wallet、Skills 及各类 MCP Server 位于中间层，将这些协议转化为可直接调用的能力。各层可独立使用，也可按场景组合：需要支付时使用 x402，需要验证身份或信誉时使用 8004，需要连接工具或链上服务时通过 MCP。

## 3. BANK OF AI x402 的架构与支付流程

### 3.1 核心参与方

- **AI Agent 与 Agent Wallet**：Agent 决定是否购买资源；钱包保存密钥、检查预算和策略，并为付款要求生成 TIP-712 签名。私钥不应交给 Resource Server 或 Facilitator。
- **Resource Server**：提供受保护资源，生成 Payment Requirements，在验证和结算成功后交付内容或执行服务。
- **Facilitator**：按网络和 scheme 验证支付凭证、模拟或提交链上结算，并返回可审计的结果。它可以独立部署，也可以由服务端承担相同的逻辑职责。
- **区块链网络与支付合约**：承载资产、授权及结算交易；不同 scheme 可能依赖不同的合约或代理。本文的支付流程图以 TRON 和 TRC-20 资产为例。

### 3.2 一次完整的 x402 支付

![一次完整的 BANK OF AI x402 支付](/img/devnotes/tron-x402-payment-flow.svg)

1. Agent 向付费端点发送普通 HTTP 请求。
2. Resource Server 返回 `402 Payment Required`，公布可接受的支付选项。
3. Agent 的选择器从中挑选支持的网络、资产与 scheme；钱包同时检查余额、额度、收款方和有效期。
4. 钱包为所选要求签署 Payment Payload，Agent 带着 `PAYMENT-SIGNATURE` 重试原请求。
5. Resource Server 将 requirements 与 payload 交给 Facilitator 验证；在交付前或交付后结算，取决于服务自身的价值和失败处理策略。
6. Facilitator 返回验证/结算结果及交易标识，Resource Server 交付资源，并以 `PAYMENT-RESPONSE` 向客户端回传结果。

### 3.3 核心协议数据

- **`PAYMENT-REQUIRED`**：402 响应中的支付挑战，通常包含 `accepts` 列表。每项描述一种可支付的组合，而非笼统地说「请转账」。
- **`PAYMENT-SIGNATURE`**：重试请求中的已编码支付响应，包含客户端接受的要求和 scheme 特定的签名 payload。
- **`PAYMENT-RESPONSE`**：成功响应中的结算信息，例如最终结算金额、交易哈希或 scheme 的后续状态。
- **Payment Requirements / Payload**：前者是报价，后者是对报价的可验证承诺。安全实现必须校验它们的绑定关系，并拒绝过期、篡改、重复使用或超额结算的凭证。

## 4. BANK OF AI x402 的支付方案

### 4.1 Exact：固定金额支付

`exact` 用于价格在调用前就确定的服务。服务端报价 0.01 USDT，客户端签署这笔确定金额，Facilitator 验证后一次性结算。它的心智模型最简单，适合单篇报告、固定价格的数据查询、文件下载或一次性工具调用。

它的限制同样明确：实际成本若在执行后才知道，服务端不能把 `exact` 当作一张可随意加价的空白支票。对价格不确定的推理、带宽或计算任务，应改用 `upto`，或先把价格拆成可预先报价的阶段。

### 4.2 Exact Gasfree：TRON 网络的无 TRX 支付

`exact_gasfree` 是 TRON 专用的固定金额方案。付款人可使用 USDT 或 USDD 支付，而无需在自己的普通钱包中持有 TRX；官方 GasFree Proxy/中继路径负责提交交易并支付相应的链上资源费用。

这不是普适的「免成本」付款。该方案要求钱包、Token、GasFree 服务与 Facilitator 都支持相应流程；其成本体现为 GasFree **中继费**：由客户端估算，并在付款金额之外从支付代币中扣除——支付要求本身不含任何费用对象。生产部署应显式检查可用资产、GasFree 账户状态、费用配置和失败回退路径，不能仅根据主钱包的 TRX 余额判断是否可付。

### 4.3 Upto：按实际用量支付

`upto` 让客户端授权一个最大金额，而不是预先确定最终金额。Resource Server 在完成工作后，依据可审计的计量结果提交一个不超过上限的实际结算金额。例如，Agent 可以授权「最多 0.10 USDT」，模型服务按实际输入/输出 Token、推理时长或带宽使用量收取 0.063 USDT。

上限是对付款人的保护，不是服务端的建议值：最终结算必须小于或等于授权上限。服务方也应公开计量单位、价格、舍入规则和失败时的收费政策，否则「按量」会变成不可解释的账单。

### 4.4 Batch Settlement：高频微支付的通道方案

`batch-settlement` 面向连续、高频且单笔金额较小的服务调用。付款方先创建通道并 Deposit，之后每次消费由链下签名的累积 Voucher 表示；服务端验证 Voucher 后即可交付服务，再按请求数量、累计金额或时间窗口批量 Claim/Settle。这样无需让每一次 Agent 工具调用都等待链上交易。

它并非单笔支付的简单替代。通道资金会被预先占用，客户端和服务端都需要管理 Voucher 状态、有效期、重放防护、失败重试与最终对账。因此，它适合持续检索、行情订阅、多轮推理和 Agent 工作流；偶发的单次调用通常仍以 `exact` 或 `upto` 更为直接。

### 4.5 支付方案选择

| 业务条件 | 优先方案 | 原因与前提 |
| --- | --- | --- |
| 固定价格 API、下载、一次性结果 | `exact` | 条件和金额可在执行前确定。 |
| 付款钱包没有 TRX，但使用受支持资产和服务 | `exact_gasfree` | 依赖 GasFree Proxy、中继与 Facilitator 的共同支持。 |
| 价格取决于实际 Token、时长或带宽 | `upto` | 先授权上限，后按实际用量结算。 |
| 高频、小额、连续调用 | `batch-settlement` | 以通道与链下 Voucher 减少每次调用都上链的需要。 |

## 5. Batch Settlement：面向高频智能体调用的批量结算

### 5.1 为什么需要 Batch Settlement

`exact` 和 `upto` 都适合「一次请求，一次结算」：付款条件明确后，服务端验证并提交对应的链上结算。但这一前提在高频微支付中会成为瓶颈——单笔网络成本可能超过服务本身的价格，链上确认会拉长 HTTP 响应，持续检索、行情订阅或多轮 Agent 编排也会产生过多交易。

`batch-settlement` 的核心是将「访问授权」与「最终价值转移」解耦。Agent 在每次请求时提交一份可验证的支付承诺，服务端验证通过后立即交付；真正的资金领取则在稍后按批次进行。客户端得到的结算结果可以是通道状态或凭证标识，而不必是每次调用的一笔交易哈希。

在 BANK OF AI x402 中，Batch Settlement 可在不同网络上采用相应的通道实现。以 TRON 为例，它表现为一个资金的单向支付通道：资金先锁定在通道中，链下 Voucher 覆盖多次消费，最终由 Facilitator 代表服务方批量提交链上领取。它降低的是每次调用的链上交互频率，不会消除资金占用、状态存储、对账和争议处理的工程成本。

### 5.2 核心机制

- **Deposit**：付款方以不可变的 `ChannelConfig` 创建或识别通道，并存入可支付资产。配置绑定付款方、收款方、Token、授权方、提现等待期与随机盐；通道 ID 由该配置、网络和合约地址确定性派生。
- **Voucher**：每次调用由 Agent 签署一张累积凭证，核心字段是 `maxClaimableAmount`。它表示「截至这次调用，服务方最多可领取多少」，而不是一笔孤立的小额转账。
- **Claim**：服务方提交一张或多张最新 Voucher，将可领取金额登记到链上 `totalClaimed`。这一步确认债权，但不一定立即转出 Token。
- **Settle**：将同一收款方、同一 Token 下已登记的金额合并转出。一次 `settle` 可以覆盖多个通道和大量请求，这才是 batch 的主要成本优势。
- **Refund / Withdraw**：合作退款可立即退回未用余额；若服务方不配合，付款方可发起带等待期的单边提现，保障资金不会永久锁定。

累积 Voucher 也是防重放的关键。第 N 次调用的上限等于「已计费累计金额 + 本次可接受的上限」，因此新凭证天然覆盖上一个较低的上限；服务端只需保留最新状态，旧凭证即使被重放也无法增加可领取金额。客户端在继续签署前应核对 `chargedAmount`、累计金额、通道余额和 `channelId`，不一致时停止签署并进入恢复或提现流程。

### 5.3 完整流程

![Batch Settlement 支付通道与累积凭证](/img/devnotes/batch-settlement-channel.svg)

图中的流程可分为三个阶段。前两阶段分别解决「如何建立可支付余额」与「如何在不等待链上确认的情况下连续调用」；第三阶段才把累积的消费正式结算。

#### 阶段一：开通道（首次链上交易）

1. **客户端提交 Deposit 载荷**：首次使用或通道余额耗尽时，Agent Wallet 发送 `ChannelConfig`、首张 Voucher 与 Token 存款授权。`ChannelConfig` 固定付款方、收款方、Token、授权方、提现等待期与 salt，并派生确定性的 `channelId`。
2. **Resource Server 请求验证与存款**：服务端将载荷交给 Facilitator，执行 `/verify` 和 `/settle(deposit)`；Facilitator 验证签名与存款授权后，把资产存入通道托管合约。
3. **通道准备就绪**：链上通道保存资金与初始状态。此后付款方不必为每次调用再提交链上交易；Facilitator 负责该次链上操作的资源费用。

#### 阶段二：高频请求（本地签名，链下执行）

1. **客户端签署新的累积 Voucher**：每次请求，Agent Wallet 将 `maxClaimableAmount` 更新为「历史已计费累计金额 + 本次可接受的最高费用」，并只在本地完成签名。
2. **服务端本地验签并执行业务**：Resource Server 验证 Voucher、通道配置、累计上限与余额，无需为这一笔请求访问链上；验证通过后立即执行推理、检索或其他付费服务。
3. **服务端回传计费快照**：服务端返回 `200 OK`、本次实际 `chargedAmount` 与 `channelState`。实际费用不得超过 Voucher 的上限；客户端在下一次签名之前核对金额、累计值、余额和 `channelId`。
4. **新凭证覆盖旧凭证**：同一通道重复 N 次后，服务端只需持久化最新的累积 Voucher 与 `chargedCumulativeAmount`。较低金额的旧凭证不会增加可领取金额，因此无需为每笔调用单独管理 nonce。

#### 阶段三：批量结算（按策略上链）

1. **选择结算时机**：服务端可按固定周期、累计金额阈值或付款方发起提现来触发结算，并取出多个通道的最新 Voucher。
2. **Claim：批量确认可领取金额**：服务端请求 Facilitator 调用 `/settle(claim)`；后者将多通道的最新凭证打包，提交 `claimWithSignature`，把累计金额登记为 `totalClaimed`。此时资金仍在通道合约中。
3. **Settle：归集并转给收款方**：Facilitator 再通过 `/settle(settle)` 归集同一收款方、同一 Token 的已记账资金，并执行一次实际的 Token 转账。
4. **退出与退款**：服务完成后可合作 `refund` 未用余额；若付款方发起 `initiateWithdraw`，服务方必须在 `withdrawDelay` 内完成 Claim，期满后付款方可 `finalizeWithdraw` 取回未被领取的余额。

### 5.4 批次结算策略

结算可按三种策略触发：定期结算使网络成本和账务节奏可预测；金额阈值限制服务方的未领取风险敞口；仅在付款方提现时结算最省 Gas，却让服务方承担最大的「未及时领取」风险。生产系统通常会将阈值与最长等待时间结合，而不是只依赖一种策略。

必须区分「请求成功」「Voucher 已接受」「Claim 已上链」和「Token 已 Settle」四种状态。服务端需以 `channelId` 与累计金额为索引，原子保存最新状态；链上重试则应依据交易哈希、事件和幂等键判断。对付款方而言，风险上限是已签 Voucher 的 `maxClaimableAmount`；对服务方而言，关键风险是付款方开始提现后未能在 `withdrawDelay` 内完成 Claim。

### 5.5 Batch Settlement 的收益与代价

收益是更少的链上交易、更低的平均结算开销，以及不必等待每次确认的更短服务路径。它适合单笔价值接近或低于网络成本、需要低延迟响应，且同一付款方会持续调用同一服务方的场景。

代价也很具体：付款方资金会预先占用；服务端需要持久化并正确恢复通道状态；客户端需要核对每次的计费快照；双方还要处理离线凭证、重试、通道关闭与退出窗口。对偶发的单次调用，`exact` 或 `upto` 往往更简单；对高价值且需要协议级退款保障的交易，也应评估更适合的托管/捕获模型。建议直接使用 SDK 提供的通道管理与恢复逻辑，而不要自行拼装 Voucher 和结算状态机。

## 6. 端到端应用案例：AI 智能体调用付费推理服务

本章以 **TRON Nile 测试网**为例，展示 Agent 如何使用 TRC-20 稳定币，通过 BANK OF AI x402 的 `batch-settlement` 方案调用付费推理服务。生产环境可将同一流程切换到 TRON 主网；协议交互、通道状态和 Voucher 机制保持不变。

### 6.1 案例场景

设想一个研究 Agent 正在完成一项跨来源的分析任务。它需要连续调用同一个推理服务：先摘要一批文档，再做多轮追问、抽取结构化结论，最后生成报告。每次调用的金额很小，但整个任务可能在几十分钟内产生数十到数百次请求。

如果每次推理都单独在 TRON 上结算，服务响应会被链上交互拖慢，网络成本也会吞噬微支付的经济性。这里采用 `batch-settlement`：Agent 首次调用时在 **TRON Nile** 上以 TRC-20 USDT 或 USDD 打开并充值支付通道；随后每次推理只签署一张递增的 Voucher；推理服务即时返回结果，并在后台把多次消费合并领取。

### 6.2 推理服务的计费模型

与固定价格天气查询不同，推理成本取决于模型、上下文长度和生成长度。服务端应在 402 要求中明确 `network=TRON_NILE`、可接受的 TRC-20 资产（如 USDT 或 USDD）和本次调用的**最高费用**，并将输入 Token 单价、输出 Token 单价、模型等级和最小计费单位写清楚。Agent 的预算策略据此决定是否签署 Voucher；服务完成后，实际费用必须不超过该次上限。

一次成功的推理响应除模型结果外，还应返回以下可审计信息：

| 返回字段 | 推理服务中的含义 | Agent 的核对动作 |
| --- | --- | --- |
| `chargedAmount` | 本次实际收费 | 不得超过本次签署的最高费用。 |
| `channelState.chargedCumulativeAmount` | 本任务在该通道上的累计消费 | 必须等于上次累计值加本次实际收费。 |
| `channelState.balance` | 通道剩余可用资金的依据 | 余额不足时停止继续调用或充值新通道。 |
| 使用量明细 | 输入/输出 Token、模型版本、计费规则版本 | 用于账单解释、成本分析和异常审计。 |

这样，Batch Settlement 只负责把多次已授权的消费聚合结算；「本次推理究竟为什么收费」仍由推理服务的计量系统负责，并应随结果一同公开给付款方。

### 6.3 一次研究任务的计费实例

假设 Agent 在 TRON Nile 上获得 5 USDT 的研究预算，要对 40 份材料做摘要、交叉提问和报告生成。服务将单次推理的上限设为 0.10 USDT，实际价格按输入/输出 Token 计算。支付过程可以这样理解：

1. **任务开始**：Agent 使用 TRON 钱包在首次调用时打开通道并 Deposit 5 USDT。它不需要预先知道每次推理的精确成本，只需确认每次最高不超过 0.10 USDT、总任务不超过 5 USDT。
2. **第 1 次摘要**：Agent 签署最高 0.10 USDT 的 Voucher；服务实际使用 12,000 输入 Token 和 800 输出 Token，计费 0.042 USDT。响应返回摘要、`chargedAmount=0.042` 以及累计消费 `0.042`。
3. **后续推理**：第 2 次调用前，Agent 以已确认的 `0.042` 为基础签署新的累积上限。随着多轮检索、比较和改写进行，服务持续返回 Token 用量与新的累计值；Agent 发现任何金额、通道或计量规则不一致时立即停止签署。
4. **达到结算阈值**：例如累计消费到 1 USDT 或经过 10 分钟，服务端通过 TRON Facilitator 将该通道及其他用户通道的最新 Voucher 批量 Claim，再按收款方与 TRC-20 Token 集中 Settle。模型调用本身始终不等待这次链上操作。
5. **任务结束**：报告生成完成时，假设 80 次调用实际消费 3.16 USDT。已签 Voucher 使服务方可以领取这部分费用；未消费的 1.84 USDT 通过合作 Refund 或提现流程回到 Agent。

这个案例中，推理计量、Agent 预算和支付通道各自有明确边界：计量系统决定实际费用，Agent 决定是否接受下一次上限，Batch Settlement 则把已经发生的多次消费合并结算。

### 6.4 最小参考实现

仓库的 [examples/typescript](https://github.com/BofAI/x402/tree/main/examples/typescript) 提供了与上述 **TRON Nile** 结构相同的可运行参考实现：它以 `GET /weather` 代替推理端点，但首笔 TRC-20 Deposit、后续 Voucher 与后台 Claim/Settle 的路径完全一致。要将它用于推理服务，只需把路由业务替换为模型调用，并保留 `batch-settlement` 的 TRON 支付注册与通道管理。

Facilitator 是这条 TRON 路径中不可缺少的结算服务。最小接入建议优先使用 BANK OF AI 官方托管 Facilitator：在 Nile 测试网将 `FACILITATOR_URL` 配置为 `https://tn-facilitator.bankofai.io`；切换生产环境时使用 `https://facilitator.bankofai.io`。它负责验证、Deposit、Claim、Settle 与 Refund 的链上执行。

```ts
const facilitator = new HTTPFacilitatorClient({
  url: "https://tn-facilitator.bankofai.io", // TRON Nile
  // 生产环境使用 facilitator.bankofai.io，并为请求附带 X-API-KEY。
});
```

客户端的关键是注册 `BatchSettlementTronScheme`，再将普通 `fetch` 包装为具备支付能力的请求函数：

```ts
import { resolveWallet } from "@bankofai/agent-wallet";
import { x402Client, wrapFetchWithPayment } from "@bankofai/x402-fetch";
import { createClientTronSigner, TRON_NILE } from "@bankofai/x402-tron";
import { BatchSettlementTronScheme } from "@bankofai/x402-tron/batch-settlement/client";

const wallet = (await resolveWallet({ network: TRON_NILE })) as
  Parameters<typeof createClientTronSigner>[0];
const signer = await createClientTronSigner(wallet, { network: TRON_NILE });
const client = new x402Client((_version, accepts) =>
  accepts.find((item) =>
    item.scheme === "batch-settlement" && item.network === TRON_NILE,
  )!,
);

client.register(
  TRON_NILE,
  new BatchSettlementTronScheme(signer, {
    depositPolicy: { depositMultiplier: 5 },
  }),
);

const paidFetch = wrapFetchWithPayment(fetch, client);
const response = await paidFetch("https://inference.example.com/v1/generate");
```

服务端则注册同一 TRON scheme，并把通道管理器放在后台运行：

```ts
const scheme = new BatchSettlementTronScheme(process.env.TRON_ADDRESS!);
resourceServer.register(TRON_NILE, scheme);

scheme.createChannelManager(facilitator, TRON_NILE).start({
  claimIntervalSecs: 60,
  settleIntervalSecs: 120,
  maxClaimsPerBatch: 100,
});
```

## 7. 总结

BANK OF AI x402 让 API 能用 HTTP 原生的挑战—响应方式报价和收款，令 Agent 可以在受控预算内按需购买数字服务。TRON 为其中的 TRC-20 稳定币结算提供了重点支持；`exact` 适合固定报价，`exact_gasfree` 面向满足 GasFree 条件的无 TRX 钱包，`upto` 将实际用量限制在预先授权的上限内，`batch-settlement` 则为高频微支付降低链上结算频率。

真正可靠的 Agent 支付系统仍需把协议能力与产品规则一起实现：最小权限的钱包、明确的资产和服务白名单、金额上限、短有效期与防重放、可恢复的幂等流程、可审计的计量，以及测试网到主网的逐步验证。这样，支付才会成为 Agent 可安全组合的一项能力，而不是新的不可控风险来源。

---

## 相关文档

- [x402 支付协议](/zh-Hans/) —— 协议总览与核心概念
- [x402 CLI](/zh-Hans/x402/cli/) —— 在终端里支付与自建付费端点
- [SDK 功能](/zh-Hans/x402/sdk-features/) —— 各支付方案的 SDK 支持情况
