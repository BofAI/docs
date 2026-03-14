# 网络与代币支持

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## TRON 网络标识符

x402 采用标准化的网络标识符格式：`tron:<network_name>`。
其中 `<network_name>` 对应为 `mainnet`、`shasta` 或 `nile`。

### 标识符参考表

| 网络名称 (Network Name) | 网络 (Network) | 描述 (Description)   |
| :---------------------- | :------------- | :------------------- |
| **TRON Mainnet**        | `tron:mainnet` | TRON 主网 (生产环境) |
| **TRON Shasta**         | `tron:shasta`  | TRON Shasta 测试网   |
| **TRON Nile**           | `tron:nile`    | TRON Nile 测试网     |

## BSC 网络标识符

对于 BSC，x402 采用 EIP-155 链 ID 格式：

| 网络名称 (Network Name) | 网络 (Network) | 描述 (Description)  |
| :---------------------- | :------------- | :------------------ |
| **BSC Mainnet**         | `eip155:56`    | BSC 主网 (生产环境) |
| **BSC Testnet**         | `eip155:97`    | BSC 测试网          |

## 概览

x402 专为区块链生态设计，实现了原生的链上支付验证与结算功能。协议底层采用安全的签名机制，确保消息授权的安全性与防篡改能力。

### 支持的网络

| 网络环境         | 状态 (Status) | 说明 (Notes)                                |
| :--------------- | :------------ | :------------------------------------------ |
| **TRON Mainnet** | **Mainnet**   | **生产网络**：用于处理真实价值资产。        |
| **TRON Nile**    | **Testnet**   | **推荐测试网**：TRON 首选的开发与调试环境。 |
| **TRON Shasta**  | **Testnet**   | **备用测试网**：长期稳定的测试环境。        |
| **BSC Mainnet**  | **Mainnet**   | **生产网络**：用于处理真实价值资产。        |
| **BSC Testnet**  | **Testnet**   | **推荐测试网**：BSC 首选的开发与调试环境。  |

### 支持的代币

x402 协议全面支持 **TRC-20/BEP-20** 标准代币，并默认将 **USDT** 和 **USDD** 作为主要结算货币。

#### 支持的代币列表

| 代币符号 | 网络环境       | 合约地址 (Contract Address)                  |
| :------- | :------------- | :------------------------------------------- |
| **USDT** | `tron:mainnet` | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`         |
| **USDT** | `tron:nile`    | `TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf`         |
| **USDD** | `tron:mainnet` | `TXDk8mbtRbXeYuMNS83CfKPaYYT8XWv9Hz`         |
| **USDD** | `tron:nile`    | `TGjgvdTWWrybVLaVeFqSyVqJQWjxqRYbaK`         |
| **USDT** | `eip155:56`    | `0x55d398326f99059fF775485246999027B3197955` |
| **USDT** | `eip155:97`    | `0x337610d27c682E347C9cD60BD4b3b107C9d34dDd` |

> **扩展支持**：协议具有高度的可扩展性。通过在 `TokenRegistry` 中进行注册，您可以轻松配置并支持任意自定义的 TRC-20/BEP-20 代币。

#### 安全签名

x402 采用类型化数据签名来处理所有支付相关的签名授权。

该机制带来了以下核心优势：

- **链下授权 (Off-chain Authorization)**：买方在本地（链下）对转账意图进行签名，无需预先锁定资金。
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

x402 使用统一的 `exact` 支付方案作为其链上支付的标准。

#### `exact` 方案

`exact` 方案为跨不同代币标准和区块链协议的支付提供了统一的接口。它会根据资产的功能自动选择最佳的转账方式：

- **EIP-3009 (原生授权)**：由 **Base 链上的 USDC** 等代币支持。这允许通过 `transferWithAuthorization` 进行无 Gas 支付，无需预先执行 `approve` 交易。
- **Permit2**：用于 **USDT (TRON 和 EVM)** 等原生不支持 EIP-3009 的代币。这需要用户对 `Permit2` 合约进行一次性 `approve` 授权，之后即可通过链下签名进行多次支付。
- **EIP-2612 (Permit)**：适用于支持签名批准的代币。SDK 可以将 permit 和转账合并为一个无缝流程。

### 代币兼容性说明

- **USDT (TRON 和 EVM)**：原生不支持 EIP-3009。它**必须**使用 **Permit2** 流程，这需要对 `Permit2` 合约进行一次性 `approve` 授权。
- **USDC (Base)**：原生支持 **EIP-3009**，允许通过 `transferWithAuthorization` 实现完全无 Gas 且无需预先授权的支付体验。

x402 SDK 会根据代币的功能自动选择合适的方法。对于 USDT 用户，TypeScript SDK 提供了扩展程序以简化 Permit2 授权流程。

#### 运作原理

1. **授权 (Authorize)**：客户端签署一条授权特定支付金额和接收者的消息。SDK 会根据底层代币协议（例如 TRON 的 TIP-712）自动包含适当的元数据（nonce、deadline 等）。
2. **验证与结算 (Verify & Settle)**：服务端验证签名并将其提交给 Facilitator。Facilitator 使用代币支持的最有效方式在链上执行交易。对于基于 Permit2 的代币，Facilitator 将调用 `Permit2` 合约完成资金划转。

### 部署私有 Facilitator

您可以选择部署私有的 Facilitator 节点，以完全掌控区块链网络上的支付验证与结算流程。

Facilitator 作为协议的中间件，承担以下核心职责：

1. **验证载荷 (Verify)**：校验签名的加密有效性及参数完整性。
2. **提交交易 (Submit)**：构建并向区块链广播交易。
3. **监控确认 (Monitor)**：追踪交易在链上的确认状态，确保资金最终到账。

**部署先决条件**

- **节点访问权限**：稳定的全节点 RPC 访问（例如 TronGrid 或自建节点）。
- **Gas 资源储备**：一个持有充足 **TRX/BNB** 的钱包，用于支付链上交易产生的 gas 费用。
- **代码部署**：拉取并配置 x402 Facilitator 服务代码。

> **深入了解**：请查阅 [Facilitator](./facilitator.md) 文档以获取详细的配置指南与 API 参考。

### 快速参考

| 核心组件     | TRON/BSC 实现详情                                                    |
| :----------- | :------------------------------------------------------------------- |
| **网络环境** | `tron:mainnet`, `tron:shasta`, `tron:nile`, `eip155:56`, `eip155:97` |
| **代币标准** | TRC-20 代币（默认内置 USDT 和 USDD 支持）, BEP-20 代币               |
| **签名机制** | 类型化数据签名                                                       |
| **支付方案** | `exact`                                                              |

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
