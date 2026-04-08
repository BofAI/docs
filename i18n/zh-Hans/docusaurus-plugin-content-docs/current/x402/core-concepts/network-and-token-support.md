# 网络与代币支持

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## TRON 网络标识符

x402 采用标准化的网络标识符格式：`tron:<network_name>`。
其中 `<network_name>` 对应为 `mainnet`、`shasta` 或 `nile`。

### 标识符参考表

| 网络名称 (Network Name) | 网络 (Network)      | 描述 (Description)   |
| :---------------------- | :------------- | :------------------- |
| **TRON Mainnet**        | `tron:mainnet` | TRON 主网 (生产环境) |
| **TRON Shasta**         | `tron:shasta`  | TRON Shasta 测试网   |
| **TRON Nile**           | `tron:nile`    | TRON Nile 测试网     |


## BSC 网络标识符

对于 BSC，x402 采用 EIP-155 链 ID 格式：

| 网络名称 (Network Name) | 网络 (Network)      | 描述 (Description)   |
| :---------------------- | :------------- | :------------------- |
| **BSC Mainnet**        | `eip155:56` | BSC 主网 (生产环境) |
| **BSC Testnet**         | `eip155:97`  | BSC 测试网   |


## 概览

x402 专为区块链生态设计，实现了原生的链上支付验证与结算功能。协议底层采用安全的签名机制，确保消息授权的安全性与防篡改能力。

### 支持的网络

| 网络环境         | 状态 (Status) | 说明 (Notes)                           |
| :--------------- | :------------ | :------------------------------------- |
| **TRON Mainnet** | **Mainnet**   | **生产网络**：用于处理真实价值资产。   |
| **TRON Nile**    | **Testnet**   | **推荐测试网**：TRON 首选的开发与调试环境。 |
| **TRON Shasta**  | **Testnet**   | **备用测试网**：长期稳定的测试环境。   |
| **BSC Mainnet**        | **Mainnet**   | **生产网络**：用于处理真实价值资产。   |
| **BSC Testnet**         | **Testnet**   | **推荐测试网**：BSC 首选的开发与调试环境。 |

### 支持的代币

x402 协议全面支持 **TRC-20/BEP-20** 标准代币，并默认将 **USDT** 和 **USDD** 作为主要结算货币。

#### 支持的代币列表

| 代币符号 | 网络环境       | 合约地址 (Contract Address)          |
| :------- | :------------- | :----------------------------------- |
| **USDT** | `tron:mainnet` | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` |
| **USDT** | `tron:nile`    | `TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf` |
| **USDD** | `tron:mainnet` | `TXDk8mbtRbXeYuMNS83CfKPaYYT8XWv9Hz` |
| **USDD** | `tron:nile`    | `TGjgvdTWWrybVLaVeFqSyVqJQWjxqRYbaK` |
| **USDT** | `eip155:56` | `0x55d398326f99059fF775485246999027B3197955` |
| **USDT** | `eip155:97`    | `0x337610d27c682E347C9cD60BD4b3b107C9d34dDd` |

> **扩展支持**：协议具有高度的可扩展性。通过在 `TokenRegistry` 中进行注册，您可以轻松配置并支持任意自定义的 TRC-20/BEP-20 代币。

#### 安全签名

x402 采用类型化数据签名来处理所有支付相关的签名授权。

该机制带来了以下核心优势：

- **链下授权 (Off-chain Authorization)**：买家在本地（链下）对转账意图进行签名，无需预先锁定资金。
- **最小化信任 (Trust-minimized)**：签名包含严格的限制条件，Facilitator 无法在客户端明确授权的范围（金额、接收方、有效期）之外转移任何资金。
- **链上可验证 (On-chain Verifiability)**：所有的签名最终都可在智能合约层面进行加密学验证，确保交易的不可篡改性。

### 代币配置参数

在服务端配置 `HTTP 402` 支付要求时，您需要明确指定以下三个核心参数：

1.  **网络 (Network)**：目标网络的唯一标识符（例如 `tron:nile`）。
2.  **资产 (Asset)**：目标 TRC-20/BEP-20 代币的**合约地址**。
3.  **金额 (Amount)**：基于代币**最小单位**（Raw Amount）的整数值。

> **精度换算示例**：
> TRON 上 USDT 的精度 (Decimals) 为 **6**。
> 若需收取 **1.0 USDT**，配置的数值应为 `1000000`。

### 支付方案

x402 支持三种支付方案：`exact_permit`、`exact` 和 `exact_gasfree`。

#### `exact_permit` 方案

`exact_permit` 方案通过 `PaymentPermit` 合约进行代币转账，适用于：

- **按次/按量付费 API**：例如 LLM 的 Token 生成费、图像生成服务。
- **计量资源**：云计算实例的运行时间、数据存储量、网络带宽消耗。
- **动态定价服务**：基于实际使用量的后付费模式。

#### `exact` 方案

`exact` 方案适用于原生支持 `transferWithAuthorization` 的代币，无需 `PaymentPermit` 合约。

#### `exact_gasfree` 方案

`exact_gasfree` 是 TRON 专属的支付机制，允许用户使用 USDT/USDD 付款而**无需持有 TRX 来支付 gas 费用**。结算通过 BANK OF AI Facilitator 端点的官方 GasFree 代理完成。

核心特性：

- **买家零 gas 成本**：买家无需持有 TRX，gas 费用由 GasFree 基础设施承担
- **无需 API 密钥**：所有 GasFree API 调用通过 BANK OF AI 代理路由至 `https://facilitator.bankofai.io/{mainnet,nile}`，客户端无需配置 `GASFREE_API_KEY` 或 `GASFREE_API_SECRET`
- **仅限 TRON**：支持 `tron:mainnet` 和 `tron:nile`

#### GasFree 账户管理（通过 x402-payment skill）

使用 `x402-payment` skill 时，可直接通过 CLI 管理 GasFree 账户：

**查询 GasFree 钱包信息**（地址、激活状态、余额、nonce）：
```bash
npx tsx x402-payment/src/x402_invoke.ts --gasfree-info
npx tsx x402-payment/src/x402_invoke.ts --gasfree-info --network nile
npx tsx x402-payment/src/x402_invoke.ts --gasfree-info --wallet <YOUR_WALLET_ADDRESS>
```

**激活 GasFree 账户**（首次使用前需要激活）：
```bash
npx tsx x402-payment/src/x402_invoke.ts --gasfree-activate
npx tsx x402-payment/src/x402_invoke.ts --gasfree-activate --network mainnet
npx tsx x402-payment/src/x402_invoke.ts --gasfree-activate --network nile --token USDT
```

激活过程会向 GasFree 钱包存入少量代币（nile 约 3.05 USDT）以完成资金注入，然后提交 GasFree 交易触发激活。建议先使用 `--gasfree-info` 检查账户是否已激活。

#### 工作原理

1.  **预授权 (Authorize)**：客户端签署消息，授权支付**最大金额** (Max Amount)。
2.  **执行服务 (Execute)**：服务端执行请求任务，并计算**实际成本** (Actual Cost)。
3.  **最终结算 (Settle)**：Facilitator 根据实际成本发起链上扣款。

### 部署私有 Facilitator

您可以选择部署私有的 Facilitator 节点，以完全掌控区块链网络上的支付验证与结算流程。

Facilitator 作为协议的中间件，承担以下核心职责：

1.  **验证载荷 (Verify)**：校验签名的加密有效性及参数完整性。
2.  **提交交易 (Submit)**：构建并向区块链广播 `transferFrom` 交易。
3.  **监控确认 (Monitor)**：追踪交易在链上的确认状态，确保资金最终到账。

**部署先决条件**

- **节点访问权限**：稳定的全节点 RPC 访问（例如 TronGrid 或自建节点）。
- **Gas 资源储备**：一个持有充足 **TRX/BNB** 的钱包，用于支付链上交易产生的 gas 费用。
- **代码部署**：拉取并配置 x402 Facilitator 服务代码。

> **深入了解**：请查阅 [Facilitator](./facilitator.md) 文档以获取详细的配置指南与 API 参考。

### 快速参考

| 核心组件     | TRON/BSC 实现详情                              |
| :----------- | :----------------------------------------- |
| **网络环境** | `tron:mainnet`, `tron:shasta`, `tron:nile`, `eip155:56`, `eip155:97` |
| **代币标准** | TRC-20 代币（默认内置 USDT 和 USDD 支持）,BEP-20 代币 |
| **签名机制** | 类型化数据签名                     |
| **支付方案** | `exact_permit`, `exact`, `exact_gasfree`（仅限 TRON） |

### 添加自定义代币

可通过在 `TokenRegistry`（代币注册表）中注册来支持自定义 TRC-20/BEP-20 代币：

```python
from bankofai.x402.tokens import TokenRegistry, TokenInfo

TokenRegistry.register_token(
    "tron:nile",
    TokenInfo(
        address="<YOUR_TOKEN_CONTRACT_ADDRESS>",
        decimals=6,
        name="My Token",
        symbol="MYT",
    ),
)
```

注册完成后，即可在 `prices` 中使用自定义代币符号（例如 `"0.01 MYT"`）。

### 总结

x402 专为区块链架构深度定制，提供了原生的 TRC-20/BEP-20 代币集成与安全签名支持。

**核心要点：**

- **开发环境**：推荐优先使用 **测试网** 进行开发与调试。
- **原生资产**：**USDT** 为默认的首选结算代币，且 SDK 已预置相关合约地址配置。
- **安全机制**：类型化数据签名机制确保了安全且最小化信任 (Trust-minimized) 的支付授权流程。
- **扩展能力**：可通过 `TokenRegistry` 接口灵活扩展支持任意自定义的 **TRC-20/BEP-20 代币**。
