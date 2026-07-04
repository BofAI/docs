import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 常见问题

### 常规

#### 一句话概括 x402 是什么？

x402 唤醒了长期闲置的 HTTP `402 Payment Required` 状态码，将其转化为一个基于区块链的功能完备的链上支付层，专为 API、网站及自主 AI 代理设计。目前，x402 已在 TRON 和 BSC 网络上支持，并计划在未来扩展至多链生态，实现广泛的区块链网络覆盖。

#### x402 是商业产品吗？

**不是。** x402 是 x402 协议针对区块链的开源实现，遵循 MIT 许可协议发布。您无需购买任何商业产品即可自由使用。

#### 为什么要摒弃传统支付渠道或 API 密钥？

传统支付体系依赖于信用卡网络、用户账户以及繁琐的 UI 交互流程。x402 摒弃了这些依赖，充分利用区块链网络高速、低成本的交易优势，实现了程序化的、HTTP 原生的支付体验（这对 AI 代理尤为理想）。

#### x402 仅适用于加密原生项目吗？

并非如此。任何 Web API 或内容提供商——无论属于 Web3 原生还是传统 Web2——只要希望利用区块链获得低成本、无摩擦的支付通道，均可集成 x402。

### 语言与框架支持

#### 支持哪些语言和框架？

x402 1.0.0 是**仅 TypeScript** 的 SDK，以颗粒化的 `@bankofai/x402-*` 包发布：

- **服务端中间件**：Express、Fastify、Hono、Next.js
- **客户端**：包装 `fetch`（`@bankofai/x402-fetch`）、Axios、MCP 传输
- **Facilitator**：链无关引擎，按方案 verify + settle

此前的 Python SDK 已移至 `legacy/` 仅供参考。

### Facilitator

#### 谁来运行 Facilitator ？

通常情况下，您需要运行自己的 Facilitator 服务。x402 专为自托管而设计，代码仓库中内置的 Facilitator 程序已准备就绪，可直接运行。

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

x402 1.0.0 支持五种支付方案：

- **`exact`**：支付公布的准确金额。ERC-3009 代币（如 BSC 测试网 DHLU）通过 `transferWithAuthorization` 无 gas 结算；普通 ERC-20/TRC-20 代币（如 BSC USDC/USDT、TRON USDT/USDD）通过 Permit2 路径结算，首次付款需一次性 `approve(Permit2)`。`exact` 的协议 payload 遵循 **x402 Foundation** 的 v2 规范。
- **`upto`**：按量计费——客户端签署最高至最大金额的 Permit2 授权，服务端仅结算**实际用量**（≤ max）。非常适合**按量计费**、**LLM Token 消耗**等场景。
- **`batch-settlement`**：面向高频微支付的支付通道——一次性链上存入，然后用链下凭证支付多次请求，一笔交易批量结算。含退款路径。
- **`auth-capture`**（仅 EVM）：托管式授权捕获。
- **`exact_gasfree`**（仅限 TRON）：允许买家使用 USDT/USDD 付款而无需持有 TRX 来支付 gas。由 relayer 通过 GasFree API 支付链上 energy——客户端无需配置 API 密钥。

#### 本 SDK 是否可以与 x402 Foundation（原 Coinbase）的 v2 参考实现互通？

**可以。** `exact` 支付方案（EVM 与 TRON）已遵循 **x402 Foundation** 公布的 v2 协议规范：

- 标准的 v2 客户端可以直接访问本 SDK 的 `exact` 受保护端点，无需任何项目特定的适配层。
- 本 SDK 的客户端可以直接向 v2 兼容的服务端付款。
- V2 结构中转账授权数据位于 `payload.authorization` 字段（结构化对象）；作为迁移过渡，客户端还会同时填充 `extensions.transferAuthorization`，以便仍在运行旧版本的服务端也能解析。
- BSC USDT/USDC 是普通 ERC-20（无 ERC-3009），在 `exact` 方案下通过 Permit2 路径结算——客户端首次付款时自动广播一次性 `approve(Permit2)`。ERC-3009 代币（如 BSC 测试网 DHLU）则无 gas 结算，无需 approve。
- 仓库中的 `examples/bsc-testnet-smoke/` 目录提供了双向互通的烟雾测试示例（Coinbase 官方客户端 → BANK OF AI 服务端、BANK OF AI 客户端 → Coinbase 官方服务端），可作为调试与集成参考。

### 资产、网络及费用

#### 支持哪些资产与网络？

| 网络                          | 代币          | 状态        |
| ----------------------------- | ------------- | ----------- |
| TRON 主网 (`tron:mainnet`)    | USDT (TRC-20) | **Mainnet** |
| TRON Nile (`tron:nile`)       | USDT (TRC-20) | **Testnet** |
| TRON Shasta (`tron:shasta`)   | USDT (TRC-20) | **Testnet** |
| TRON Mainnet (`tron:mainnet`) | USDD (TRC-20) | **Mainnet** |
| TRON Nile (`tron:nile`)       | USDD (TRC-20) | **Testnet** |
| BSC 主网 (`eip155:56`) | USDT (BEP-20) | **Mainnet** |
| BSC 主网 (`eip155:56`) | USDC (BEP-20) | **Mainnet** |
| BSC 主网 (`eip155:56`) | EPS (BEP-20) | **Mainnet** |
| BSC testnet (`eip155:97`)      | USDT (BEP-20) | **Testnet** |
| BSC testnet (`eip155:97`)      | USDC (BEP-20) | **Testnet** |
| BSC testnet (`eip155:97`)      | DHLU (BEP-20, 用于 `exact` 互通测试) | **Testnet** |

此外，可通过 TRON 代币注册表（`@bankofai/x402-tron` 的 `registerToken`）添加自定义 TRC-20 代币；自定义 BEP-20 代币则通过在 server 的 `EVM_TOKENS` 配置表中添加条目来公布。

#### 涉及哪些费用？

- **网络费用**：
  - 在 TRON 链上用于支付能量 (Energy) 和带宽 (Bandwidth) 消耗的 TRX（由 Facilitator 承担）。
  - 在 BSC 链上用于支付 gas 消耗的 BNB（由 Facilitator 承担）。
- **Facilitator 服务费**：每个 Facilitator 可独立配置的服务费用（支持设置为零）。

### 安全性

#### 我必须将私钥暴露给后端吗？

**不需要。** 我们推荐采用以下安全模式：

1.  **买家（客户端/代理）**：在本地运行时环境（如浏览器、Serverless 函数、代理虚拟机）中完成签名。
2.  **卖家**：无需接触买家私钥；仅负责验证签名的有效性。
3.  **Facilitator**：仅使用其自有密钥将交易提交上链。

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

#### 如何在本地运行 x402？

1.  **克隆仓库：** `git clone https://github.com/BofAI/x402.git`
2.  **安装并构建：** `cd x402/typescript && pnpm install && pnpm build`
3.  **配置环境：** `cd examples/typescript && cp .env-exact.example .env-exact`，填入 `AGENT_WALLET_PRIVATE_KEY` 与收款地址
4.  **启动 Facilitator：** `pnpm dev:facilitator`（终端 1，`:4022`）
5.  **启动服务端：** `pnpm dev:server`（终端 2，`:4021`）
6.  **运行客户端：** `pnpm dev:client`（终端 3）

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
3.  **授权额度 (Allowance) 不足**：客户端对 Facilitator 的代币授权额度不足。
4.  **账户余额不足**：客户端钱包地址缺乏足够的 USDT。

建议查看服务端返回的 JSON 响应中的 `error` 字段，以获取具体的错误诊断信息。

#### 在 Nile 测试网运行正常，切换到主网后失败，常见原因有哪些？

- **配置未更新**：确保网络配置项已设为主网而非测试网。
- **资产类型错误**：确认您的钱包持有的是**主网真实 USDT**，而非测试币。
- **手续费不足**：确保 Facilitator 钱包拥有足够的代币用于支付链上的 gas 费用。
- **合约地址变更**：不同网络（Nile vs Mainnet）的代币合约地址是不同的，请检查是否已更新。

### 仍有疑问？

• 在 [x402 仓库](https://github.com/BofAI/x402) 中提交 GitHub Issue 反馈问题
• 参考 x402 仓库中的[可运行示例](https://github.com/BofAI/x402/tree/main/examples/typescript)获取完整的 client → server → facilitator 循环
