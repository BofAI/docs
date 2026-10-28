import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 常见问题

### 常规

#### 一句话概括 x402 是什么？

x402 唤醒了长期闲置的 HTTP `402 Payment Required` 状态码，将其转化为一个基于区块链的功能完备的链上支付层，专为 API、网站及自主 AI 代理设计。目前，x402 已支持 TRON、BSC 和 Base，并计划在未来扩展至更广泛的多链生态。

#### x402 是商业产品吗？

**不是。** x402 是 x402 协议针对区块链的开源实现。[代码仓库](https://github.com/BofAI/x402)采用 MIT 许可协议，而已发布的 npm 包 `@bankofai/x402-tron` 与 `@bankofai/x402-tron-extensions` 在其 `package.json` 中声明的是 `Apache-2.0`（官方 `@x402/*` 包同样如此）。您无需购买任何商业产品即可自由使用。

#### 为什么要摒弃传统支付渠道或 API 密钥？

传统支付体系依赖于信用卡网络、用户账户以及繁琐的 UI 交互流程。x402 摒弃了这些依赖，充分利用区块链网络高速、低成本的交易优势，实现了程序化的、HTTP 原生的支付体验（这对 AI 代理尤为理想）。

#### x402 仅适用于加密原生项目吗？

并非如此。任何 Web API 或内容提供商——无论属于 Web3 原生还是传统 Web2——只要希望利用区块链获得低成本、无摩擦的支付通道，均可集成 x402。

### 语言与框架支持

#### 支持哪些语言和框架？

x402 是**仅 TypeScript** 的 SDK：TRON 相关包以 `@bankofai/x402-tron` 与 `@bankofai/x402-tron-extensions` 发布，Core、EVM 与框架集成使用官方 `@x402/*` 包：

- **服务端中间件**：Express、Fastify、Hono、Next.js
- **客户端**：包装 `fetch`（`@x402/fetch`）、Axios、MCP 传输
- **Facilitator**：链无关引擎，按方案 verify + settle

已退役的 Python SDK 与旧的根目录 `legacy/` 归档已在 x402 v2.0.0 中移除，`typescript/packages/legacy/` 下的兼容 npm 包也已在 v2.1.0 中移除。

### Facilitator

#### 谁来运行 Facilitator ？

通常情况下，您需要运行自己的 Facilitator 服务。x402 专为自托管而设计：仓库在 `examples/typescript/facilitator/basic` 提供了可直接运行的参考实现，投产前请按自身需求加固。

[官方托管的 Facilitator](https://github.com/BofAI/x402-facilitator) 服务也已上线，您无需自行部署基础设施即可使用 x402。

#### 如何防止恶意 Facilitator 窃取资金或伪造结算？

所有的支付载荷均由**买家签名**，且结算过程**直接在区块链上**执行。任何试图篡改交易数据的 Facilitator 都无法通过链上的签名验证。Facilitator 仅有权执行以下操作：

- 转移买家授权的确切金额
- 转账至签名载荷中指定的特定接收地址

### 定价策略与方案

#### 如何为端点制定价格？

常见的定价模式包括：

- **单次调用固定费率**：例如，每次请求收取 `1 USDT`。
- **分层定价**：为不同级别的端点（如 `/basic` 与 `/pro`）设定差异化价格。
- **`exact` 方案**：按公布的准确金额每次调用支付

#### x402 支持哪些支付方案？

x402 定义了五种命名支付方案。其中四种可端到端使用；`auth-capture` 目前仅提供客户端支持：

- **`exact`**：支付公布的准确金额。EIP-3009 代币（如 Base 官方 USDC）通过 `transferWithAuthorization` 无 gas 结算；普通 ERC-20/TRC-20 代币（如 BSC USDC/USDT、TRON USDT/USDD）通过 Permit2 路径结算，首次付款需一次性 `approve(Permit2)`。`exact` 的协议 payload 遵循 **x402 Foundation** 的 v2 规范。
- **`upto`**：按量计费——客户端签署最高至最大金额的 Permit2 授权，服务端仅结算**实际用量**（≤ max）。非常适合**按量计费**、**LLM Token 消耗**等场景。
- **`batch-settlement`**：面向高频微支付的支付通道——一次性链上存入，然后用链下凭证支付多次请求，一笔交易批量结算。含退款路径。
- **`exact_gasfree`**（仅限 TRON）：允许买家使用 USDT/USDD 付款而无需持有 TRX 来支付 gas。由 relayer 通过 GasFree API 支付链上 energy——客户端无需配置 API 密钥。relayer 会在付款金额之外，从支付代币中扣除自己的中继费。
- **`auth-capture`**（仅 EVM client）：支持可退款的 Base Commerce Payments 授权/扣款流程。当前发布包尚未包含 server 与 facilitator 实现。

#### 本 SDK 是否可以与 x402 Foundation（原 Coinbase）的 v2 参考实现互通？

**可以。** `exact` 支付方案（EVM 与 TRON）已遵循 **x402 Foundation** 公布的 v2 协议规范：

- 标准的 v2 客户端可以直接访问本 SDK 的 `exact` 受保护端点，无需任何项目特定的适配层。
- 本 SDK 的客户端可以直接向 v2 兼容的服务端付款。
- V2 结构中转账授权数据是结构化对象：EIP-3009 路径位于 `payload.authorization`，Permit2 路径位于 `payload.permit2Authorization`。
- BSC USDT/USDC 是普通 ERC-20（无 ERC-3009），在 `exact` 方案下通过 Permit2 路径结算，需要一次性 `approve(Permit2)`。在 EVM 上客户端从不广播该授权：要么事先已授权，要么在 server 声明了 gas 代付扩展时交由 facilitator 转发——否则请求会以 `permit2_allowance_required` 失败。
- Base 主网官方 USDC 在 `exact` 下使用 EIP-3009：付款方签署 `transferWithAuthorization`，无需 Permit2 approve。
- 原 `legacy/examples/bsc-testnet-smoke/` 互通烟雾测试已随根目录 `legacy/` 归档在 x402 v2.0.0 中移除。当前请以可运行的 [`examples/typescript`](https://github.com/BofAI/x402/tree/main/examples/typescript) 工作区作为 client → server → facilitator 的参考；自 v2.1.0 起它只覆盖 TRON，EVM 请参考[上游示例](https://github.com/x402-foundation/x402/tree/main/examples/typescript)。

### 资产、网络及费用

#### 支持哪些资产与网络？

| 网络                          | 代币          | 状态        |
| ----------------------------- | ------------- | ----------- |
| TRON 主网 (`tron:728126428`)    | USDT (TRC-20) | **Mainnet** |
| TRON Nile (`tron:3448148188`)       | USDT (TRC-20) | **Testnet** |
| TRON Shasta (`tron:2494104990`)   | USDT (TRC-20) | **测试网**（仅 SDK/CLI 支持——官方 facilitator 不结算 Shasta，请用 Nile 或自建） |
| TRON Mainnet (`tron:728126428`) | USDD (TRC-20) | **Mainnet** |
| TRON Nile (`tron:3448148188`)       | USDD (TRC-20) | **Testnet** |
| BSC 主网 (`eip155:56`) | USDT (BEP-20) | **Mainnet** |
| BSC 主网 (`eip155:56`) | USDC（BEP-20；`0x8AC76a…`，不在任何内置代币注册表中——仅能作为显式资产） | **Mainnet** |
| BSC testnet (`eip155:97`)      | USDT (BEP-20) | **Testnet** |
| BSC testnet (`eip155:97`)      | USDC (BEP-20) | **Testnet** |
| Base 主网 (`eip155:8453`) | 官方 USDC（ERC-20，EIP-3009） | **Mainnet** |
| Base Sepolia (`eip155:84532`) | USDC（ERC-20，EIP-3009） | **Testnet** |

自 x402 v2.0.0（`@bankofai/x402-tron` 2.0.0）起，TRON 标识使用十进制链 ID；旧的十六进制写法（`tron:0x2b6653dc`、`tron:0xcd8690dc`、`tron:0x94a9059e`）仍可作为输入别名。

其中只有一部分是**默认资产**（TRON 三个网络上的 USDT，Base 与 Base Sepolia 上的 USDC）。SDK 1.1.0 起，客户端消费管控会拒绝其他资产——包括 TRON USDD 和所有 BSC 资产——除非通过 `spendControls.allowedAssets` 放行。

此外，可通过 TRON 代币注册表（`@bankofai/x402-tron` 的 `registerToken`）添加自定义 TRC-20 代币；自定义 BEP-20 代币则通过在 server 路由上使用显式的 `{ asset, amount, extra }` 价格来公布。

#### 涉及哪些费用？

- **网络费用**：
  - 在 TRON 链上用于支付能量 (Energy) 和带宽 (Bandwidth) 消耗的 TRX（由 Facilitator 承担）。自 SDK 1.2.0 起，启用了 `trc20ApprovalResourceSponsoring` 的 Facilitator 还可以为付款方的首笔 Permit2 `approve` 买单：向付款方临时委托自己质押所得的能量（必要时还有带宽），并在授权交易广播后回收。
  - 在 BSC 链上用于支付 gas 消耗的 BNB（由 Facilitator 承担）。当 Facilitator 注册了授权 gas 代付扩展时，付款方一次性的 ERC-20 `approve` 也可以被代付——官方 Facilitator 已为 BSC 与 Base 注册，自建 Facilitator 需自行启用。SDK 客户端只有在资源服务端于路由上声明了该扩展时，才会附带代付载荷。
  - 在 Base 链上用于支付 gas 的 ETH（由 Facilitator 承担）。代付作用于 Base 的 Permit2 路径；Base USDC 在 `exact` 下走 EIP-3009，本来就不需要 `approve`。
- **Facilitator 服务费**：无。当前各方案不带任何费用字段——`base_fee` 配置与 `/fee/quote` 端点已在 SDK 1.0.1 移除。TRON `exact_gasfree` 由 GasFree relayer 从支付代币中收取自己的中继费，请在客户端设置中继费上限。

### 安全性

#### 我必须将私钥暴露给后端吗？

**不需要。** 我们推荐采用以下安全模式：

1.  **买家（客户端/代理）**：在本地运行时环境（如浏览器、Serverless 函数、代理虚拟机）中完成签名。
2.  **卖家**：无需接触买家私钥；仅负责验证签名的有效性。
3.  **Facilitator**：使用自己的结算钱包提交交易，钱包通过 `@bankofai/agent-wallet` 解析——使用 `privy` 或 `wallet_cli` provider 时私钥留在 facilitator 进程之外（`raw_secret` 把明文私钥存在配置中，仅适用于开发环境）。

#### 退款机制如何运作？

`exact` 方案属于**推送支付 (Push Payment)**——一旦在链上结算即不可逆转。而 `batch-settlement` 方案则支持链上**退款**路径，可退回通道中未使用的余额。处理退款通常有以下两种方式：

1.  **业务层退款：** 由卖家主动发起一笔新的 USDT 转账，将资金返还给买家。
2.  **按实结算（预防性）：** 利用支付方案特性，服务端仅结算实际产生的费用，而非全额扣款（从而避免需要退款的情况）。

### AI 代理集成

#### 代理如何获知支付金额？

代理遵循与人类用户一致的交互流程：

1.  发起初始请求。
2.  解析响应中 `PAYMENT-REQUIRED` 标头包含的支付指令。
3.  使用 x402 客户端 SDK 对支付载荷进行签名。
4.  携带包含签名的 `PAYMENT-SIGNATURE` 标头再次发起请求。

#### 代理需要钱包吗？

**需要。** 程序化钱包（通过 x402 提供的签名器类实现）允许代理对支付载荷进行签名，且**无需直接暴露助记词**，从而确保资金安全。

### 开发指南

#### 如何在本地开发 x402？

在您的 TypeScript 应用中安装已发布的 npm 包并基于这些包开发，例如：

```bash
pnpm add @x402/core@2.28.0 @x402/fetch@2.28.0 @bankofai/x402-tron@2.1.0 @x402/evm@2.28.0 @bankofai/agent-wallet
pnpm add @x402/express@2.28.0
```

请根据服务框架选择对应包（`@x402/express`、`@x402/hono`、`@x402/fastify` 或 `@x402/next`），版本与 `@x402/core` 一致为 `2.28.0`——`@bankofai/x402-tron` 2.1.0 要求精确的 `@x402/core@2.28.0`。仅在使用 TRON 资源赞助时再安装 `@bankofai/x402-tron-extensions@2.1.0`。[`examples/typescript`](https://github.com/BofAI/x402/tree/main/examples/typescript) 工作区是 client → server → facilitator 流程的可运行参考，不是应用开发的前置条件。

#### 推荐使用哪个测试网？

TRON 上推荐使用 **TRON Nile** 进行测试。该网络运行稳定，且测试币领取（水龙头）服务完善。

- **Nile 水龙头 (Faucet):** https://nileex.io/join/getJoinPage
- **Nile 区块浏览器:** https://nile.tronscan.org

BSC 上推荐使用 **BSC Testnet** 进行测试。该网络是 BSC 主网的镜像环境，完全兼容 EVM，且拥有成熟的浏览器和工具链支持。

- **BSC Testnet 水龙头 (Faucet):** https://www.bnbchain.org/en/testnet-faucet
- **BSC Testnet 区块浏览器:** https://testnet.bscscan.com

### 故障排查

#### 为何携带了 `PAYMENT-SIGNATURE` 仍收到 `402 Payment Required` 响应？

常见原因如下：

1.  **签名无效**：域 (Domain) 参数配置错误或载荷 (Payload) 字段不匹配。
2.  **支付金额不足**：签名载荷中的金额低于服务端要求的金额。
3.  **账户余额不足**：客户端钱包地址缺乏足够的 USDT。

响应体默认是 `{}`。失败原因在 `PAYMENT-REQUIRED` 响应头里——该头部是 Base64 编码的付款要求，其中的 `error` 字段即诊断信息，可用 `@x402/core/http` 的 `decodePaymentRequiredHeader` 解码查看。

`exact` / `upto` 的 Permit2 路径上授权额度 (Allowance) 不足时，返回的不是 402：服务端会响应 HTTP `412 Precondition Failed`，同一头部中的 `error` 为 `"permit2_allowance_required"`。（`batch-settlement` 的存入路径则以 402 返回其方案专属的错误码。）

#### 在 Nile 测试网运行正常，切换到主网后失败，常见原因有哪些？

- **配置未更新**：确保网络配置项已设为主网而非测试网。
- **资产类型错误**：确认您的钱包持有的是**主网真实 USDT**，而非测试币。
- **手续费不足**：确保 Facilitator 钱包拥有足够的代币用于支付链上的 gas 费用。
- **合约地址变更**：不同网络（Nile vs Mainnet）的代币合约地址是不同的，请检查是否已更新。

### 仍有疑问？

• 在 [x402 仓库](https://github.com/BofAI/x402) 中提交 GitHub Issue 反馈问题
• 参考 x402 仓库中的[可运行示例](https://github.com/BofAI/x402/tree/main/examples/typescript)获取完整的 client → server → facilitator 循环
