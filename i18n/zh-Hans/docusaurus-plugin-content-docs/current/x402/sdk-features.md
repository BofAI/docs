# SDK 功能特性

本页面记录了 x402-tron 各语言 SDK（Python, TypeScript）的功能实现进度与支持状态。

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

## 机制 

| 机制 | Python | TypeScript |
|-----------|--------|------------|
| exact/tron (TIP-712) | ✅ | ✅ |

## 签名器 

| 签名器 | Python | TypeScript |
|--------|--------|------------|
| TronClientSigner | ✅ | ✅ |
| TronFacilitatorSigner | ✅ | ⏳ |

## 客户端功能 

| 功能 | Python | TypeScript |
|---------|--------|------------|
| 自动处理 402 | ✅ | ✅ |
| 自动代币批准 | ✅ | ✅ |
| 额度检查 | ✅ | ✅ |
| TIP-712 签名 | ✅ | ✅ |

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
| 自定义 TRC-20 | ✅ | ✅ |

## 图例 

- ✅ = 已实现
- ⏳ = 计划中 / 开发中
- ❌ = 无计划