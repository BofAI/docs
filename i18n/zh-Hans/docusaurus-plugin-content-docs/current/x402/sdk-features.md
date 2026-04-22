# SDK 功能特性

本页面记录了 x402 各语言 SDK（Python, TypeScript）的功能实现进度与支持状态。

## 核心 

| 组件 | Python | TypeScript |
|-----------|--------|------------|
| 服务端 (Server) | ✅ | ⏳ |
| 客户端 (Client) | ✅ | ✅ |
| Facilitator | ✅ | ⏳ |

### HTTP 框架集成

| 角色 | Python | TypeScript |
|------|--------|------------|
| 服务端 | FastAPI, Flask | - |
| 客户端 | httpx | fetch |

## 网络 

| 网络 | Python | TypeScript |
|---------|--------|------------|
| tron:mainnet | ✅ | ✅ |
| tron:nile | ✅ | ✅ |
| tron:shasta | ✅ | ✅ |
| eip155:56 (BSC Mainnet) | ✅ | ✅ |
| eip155:97 (BSC Testnet) | ✅ | ✅ |


## 机制 

| 机制 | Python | TypeScript |
|-----------|--------|------------|
| exact_permit/tron | ✅ | ✅ |
| exact_permit/bsc | ✅ | ✅ |
| exact/tron | ✅ | ✅ |
| exact/bsc | ✅ | ✅ |
| exact_gasfree/tron | ✅ | ✅ |

> **Coinbase x402 v2 兼容**：自 v0.5.9 起，`exact` 机制（EVM 与 TRON）的 `payload` 已对齐 x402 Foundation（原 Coinbase）v2 链路传输格式。标准 v2 客户端可直接与本 SDK 服务端互通，反之亦然。详见 [网络与代币支持 → `exact` 方案](./core-concepts/network-and-token-support.md#exact-方案)。

## 签名器 

| 签名器 | Python | TypeScript |
|--------|--------|------------|
| TronClientSigner | ✅ | ✅ |
| EvmClientSigner | ✅ | ✅ |
| TronFacilitatorSigner | ✅ | ⏳ |
| EvmFacilitatorSigner | ✅ | ⏳ |

## 客户端功能 

| 功能 | Python | TypeScript |
|---------|--------|------------|
| 自动处理 402 | ✅ | ✅ |
| 自动代币批准 | ✅ | ✅ |
| 额度检查 | ✅ | ✅ |
| 签名 (TRON) | ✅ | ✅ |
| 签名 (EVM) | ✅ | ✅ |
| SufficientBalancePolicy（余额检查策略） | ✅ | ✅ |
| GasFree（TRON 零 gas 支付） | ✅ | ✅ |

## 服务端功能 

| 功能 | Python | TypeScript |
|---------|--------|------------|
| @x402_protected 装饰器 | ✅ | ⏳ |
| 支付验证 | ✅ | ⏳ |
| 支付结算 | ✅ | ⏳ |
| 费用支持 | ✅ | ⏳ |

## Facilitator 功能 

| 功能 | Python | TypeScript |
|---------|--------|------------|
| /verify 端点 | ✅ | ⏳ |
| /settle 端点 | ✅ | ⏳ |
| /fee/quote 端点 | ✅ | ⏳ |
| /supported 端点 | ✅ | ⏳ |
| 提交交易 | ✅ | ⏳ |
| 确认交易 | ✅ | ⏳ |

## 支持代币 

| 代币 | Python | TypeScript |
|-------|--------|------------|
| USDT (TRC-20) | ✅ | ✅ |
| USDD (TRC-20) | ✅ | ✅ |
| 自定义 TRC-20 | ✅ | ✅ |
| USDT (BEP-20) | ✅ | ✅ |
| USDC (BEP-20，主网/测试网) | ✅ | ✅ |
| DHLU (BSC 测试网，用于 `exact` 互通测试) | ✅ | ✅ |
| 自定义 BEP-20 | ✅ | ✅ |

## 图例 

- ✅ = 已实现
- ⏳ = 计划中 / 开发中
- ❌ = 无计划