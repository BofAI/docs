# 网络与代币支持

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## TRON 网络标识符

x402 采用 CAIP-2 网络标识符格式：`tron:<hex_chain_id>`。
应用代码中优先使用 `@bankofai/x402-tron` 导出的常量（`TRON_MAINNET`、`TRON_NILE`、`TRON_SHASTA`），不要手动复制不透明的 hex 字符串。

### 标识符参考表

| 网络名称 (Network Name) | CAIP-2 ID | SDK 常量 | 描述 (Description) |
| :---------------------- | :-------- | :------- | :----------------- |
| **TRON Mainnet**        | `tron:0x2b6653dc` | `TRON_MAINNET` | TRON 主网 (生产环境) |
| **TRON Shasta**         | `tron:0x94a9059e`  | `TRON_SHASTA`  | TRON Shasta 测试网 |
| **TRON Nile**           | `tron:0xcd8690dc`  | `TRON_NILE`    | TRON Nile 测试网 |


## BSC 网络标识符

在 x402 协议层（链路传输），BSC 采用 EIP-155 链 ID 格式：

| 网络名称 (Network Name) | 协议标识符 (Protocol ID) | 描述 (Description)   |
| :---------------------- | :------------- | :------------------- |
| **BSC Mainnet**        | `eip155:56` | BSC 主网 (生产环境) |
| **BSC Testnet**         | `eip155:97`  | BSC 测试网   |

> **注意**：在自托管 Facilitator 的 YAML 配置文件中，使用更易读的格式：`bsc:mainnet` 和 `bsc:testnet`。Facilitator 启动时会自动将其映射为协议层对应的 EIP-155 链 ID。


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
| **USDT** | `tron:0x2b6653dc` | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` |
| **USDT** | `tron:0xcd8690dc`    | `TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf` |
| **USDD** | `tron:0x2b6653dc` | `TXDk8mbtRbXeYuMNS83CfKPaYYT8XWv9Hz` |
| **USDD** | `tron:0xcd8690dc`    | `TGjgvdTWWrybVLaVeFqSyVqJQWjxqRYbaK` |
| **USDT** | `eip155:56` | `0x55d398326f99059fF775485246999027B3197955` |
| **USDC** | `eip155:56` | `0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d` |
| **EPS** | `eip155:56` | `0xA7f552078dcC247C2684336020c03648500C6d9F` |
| **USDT** | `eip155:97`    | `0x337610d27c682E347C9cD60BD4b3b107C9d34dDd` |
| **USDC** | `eip155:97`    | `0x64544969ed7EBf5f083679233325356EbE738930` |
| **DHLU** | `eip155:97`    | `0x375cADdd2cB68cE82e3D9B075D551067a7b4B816` |

> **扩展支持**：协议具有高度的可扩展性。通过 TRON 代币注册表（`@bankofai/x402-tron` 的 `registerToken`）或 server 的 `EVM_TOKENS` 配置表，您可以轻松配置并支持任意自定义的 TRC-20/BEP-20 代币。

> **关于 `exact` 方案的代币选择**：ERC-3009 代币（如 BSC 测试网 **DHLU**）通过 `transferWithAuthorization` 无 gas 结算。普通 ERC-20 代币（如 BSC USDC/USDT、TRON USDT/USDD）通过 Permit2 路径结算——客户端首次付款时自动广播一次性 `approve(Permit2)`。每代币的结算方式由 server `accepts[].price.extra` 中的数据决定：ERC-3009 → `{ name, version }`；普通 ERC-20 → `{ assetTransferMethod: "permit2" }`。

#### 安全签名

x402 采用类型化数据签名来处理所有支付相关的签名授权。

该机制带来了以下核心优势：

- **链下授权 (Off-chain Authorization)**：买家在本地（链下）对转账意图进行签名，无需预先锁定资金。
- **最小化信任 (Trust-minimized)**：签名包含严格的限制条件，Facilitator 无法在客户端明确授权的范围（金额、接收方、有效期）之外转移任何资金。
- **链上可验证 (On-chain Verifiability)**：所有的签名最终都可在智能合约层面进行加密学验证，确保交易的不可篡改性。

### 代币配置参数

在服务端配置 `HTTP 402` 支付要求时，您需要明确指定以下三个核心参数：

1.  **网络 (Network)**：目标网络的唯一标识符（例如 `tron:0xcd8690dc`）。
2.  **资产 (Asset)**：目标 TRC-20/BEP-20 代币的**合约地址**。
3.  **金额 (Amount)**：基于代币**最小单位**（Raw Amount）的整数值。

> **精度换算示例**：
> TRON 上 USDT 的精度 (Decimals) 为 **6**。
> 若需收取 **1.0 USDT**，配置的数值应为 `1000000`。

### 支付方案

x402 支持五种支付方案。每种方案按链族实现为 client + server + facilitator 三件套。

#### `exact` 方案

`exact` 方案支付公布的准确金额，覆盖两种代币转账路径：

- **ERC-3009 `transferWithAuthorization`**：适用于原生支持该标准的代币（如 BSC 测试网 DHLU）。无 gas：无需 `approve`；客户端签署类型化数据授权，facilitator 在链上调用 `transferWithAuthorization`。
- **Permit2**：适用于不实现 ERC-3009 的普通 ERC-20/TRC-20 代币（如 BSC USDC/USDT、TRON USDT/USDD）。客户端签署 Permit2 witness，facilitator 通过 `x402ExactPermit2Proxy` 合约结算。需要一次性 `approve(Permit2)`；客户端首次付款时自动广播。

`exact` 方案遵循 **x402 Foundation** 发布的 **v2 链路格式**：标准 v2 客户端可直接向本 SDK 的服务端发起付款请求，本 SDK 客户端也可直接访问任何 v2 兼容的服务端——无需项目特定的转换。转账授权数据位于 `payload.authorization` 中。

#### `upto` 方案

按量计费。客户端签署最高至最大金额的 Permit2 授权；服务端按每次请求决定**实际用量**并仅结算该部分（≤ max）。一次签名形状，每次请求不同收费——非常适合**按量计费**（LLM Token 消耗、计算时长、带宽）。EVM 和 TRON 均支持（均走 Permit2）。

#### `batch-settlement` 方案

面向高频微支付（如 AI 代理每 token 计费）的支付通道方案。客户端链上**一次性存入**，然后用链下**凭证**支付多次请求；facilitator **批量 claim** 并在一笔交易中结算到 `payTo`——因此 N 次请求约仅花费一次存入的 gas。含**退款**路径，可退回通道中未使用的余额。EVM 和 TRON 均支持。

#### `auth-capture` 方案

托管式授权捕获（仅 EVM）。资金被授权进入托管合约，并按业务逻辑释放。

#### `exact_gasfree` 方案

TRON 专属。允许用户使用 USDT/USDD 付款而**无需持有 TRX 来支付 gas 费用**。客户端签署 TIP-712 GasFree 许可，由 relayer 通过官方 GasFree 代理支付链上 energy——付款方无需 TRX，也无需一次性 `approve`。资金来自付款方的 GasFree 托管钱包（非主钱包）。支持 `tron:0x2b6653dc` 和 `tron:0xcd8690dc`。

##### GasFree 账户管理（通过 x402-payment skill）

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

#### 工作原理

1.  **预授权 (Authorize)**：客户端签署类型化数据消息，授权付款（精确金额，或 `upto`/`batch-settlement` 的最大金额）。
2.  **执行服务 (Execute)**：服务端执行请求任务，并（对于按量计费方案）计算**实际成本**。
3.  **最终结算 (Settle)**：Facilitator 根据方案发起链上交易——`transferWithAuthorization`、Permit2 `permitTransferFrom`、批量 claim 或 GasFree relay。

### 部署私有 Facilitator

您可以选择部署私有的 Facilitator，以完全掌控区块链网络上的支付验证与结算流程。自托管示例（`examples/typescript/facilitator/basic`）是一个暴露 `/verify`、`/settle`、`/supported` 的 Express 服务——无需数据库。

Facilitator 作为协议的中间件，承担以下核心职责：

1.  **验证载荷 (Verify)**：校验类型化数据签名的加密有效性及参数完整性。
2.  **提交交易 (Submit)**：构建并向区块链广播链上结算交易。
3.  **监控确认 (Monitor)**：追踪交易在链上的确认状态，确保资金最终到账。

**部署先决条件**

- **节点访问权限**：稳定的 RPC 访问（例如 TronGrid 或公共 BSC 端点）。
- **Gas 资源储备**：一个持有充足 **TRX/BNB** 的钱包，用于支付结算 gas 费用。
- **代码部署**：运行 `examples/typescript/facilitator/basic` 示例 facilitator。

> **深入了解**：请查阅 [Facilitator](./facilitator.md) 文档以获取详细的配置指南与 API 参考，以及[卖家快速入门](../getting-started/quickstart-for-sellers.md)。

### 快速参考

| 核心组件     | TRON/BSC 实现详情                              |
| :----------- | :----------------------------------------- |
| **网络环境** | `tron:0x2b6653dc`, `tron:0x94a9059e`, `tron:0xcd8690dc`, `eip155:56`, `eip155:97` |
| **代币标准** | TRC-20 代币（默认内置 USDT 和 USDD 支持）,BEP-20 代币 |
| **签名机制** | TIP-712 / EIP-712 类型化数据签名                     |
| **支付方案** | `exact`、`upto`、`batch-settlement`、`auth-capture`（EVM）、`exact_gasfree`（TRON） |

### 添加自定义代币

在**客户端 / facilitator** 侧，通过 TRON 代币注册表（`@bankofai/x402-tron`）注册自定义 TRC-20 代币：

```typescript
import { registerToken, TRON_NILE } from "@bankofai/x402-tron";

registerToken(TRON_NILE, {
  address: "<YOUR_TOKEN_CONTRACT_ADDRESS>",
  decimals: 6,
  name: "My Token",
  symbol: "MYT",
});
```

在**资源服务器**侧，自定义 EVM 代币通过在 server 的 `src/chains/evm.ts` 中的 `EVM_TOKENS` 表添加一条目来公布——一个显式的 `{ asset, amount, extra }` 对象。添加一条链仅需一条表项；无需改动 SDK。

注册完成后，即可在 TRON 价格中使用自定义代币符号（例如 `"0.001 MYT"`）。

### 总结

x402 专为区块链架构深度定制，提供了原生的 TRC-20/BEP-20 代币集成与安全签名支持。

**核心要点：**

- **开发环境**：推荐优先使用 **测试网** 进行开发与调试。
- **原生资产**：**USDT** 为默认的首选结算代币，且 SDK 已预置相关合约地址配置。
- **安全机制**：TIP-712 / EIP-712 类型化数据签名机制确保了安全且最小化信任 (Trust-minimized) 的支付授权流程。
- **扩展能力**：可通过 TRON 代币注册表（`registerToken`）或 server 的 `EVM_TOKENS` 配置表灵活扩展支持任意自定义的 **TRC-20/BEP-20 代币**。
