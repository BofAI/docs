# 常见问题

### 常规

#### 一句话概括 x402-tron 是什么？

x402-tron 是 x402 开放支付协议在 TRON 网络上的实现。它唤醒了长期闲置的 HTTP `402 Payment Required` 状态码，将其转化为一个基于 TRON 区块链的功能完备的链上支付层，专为 API、网站及自主 AI 代理设计。

#### x402-tron 是商业产品吗？

**不是。** x402-tron 是 x402 协议针对 TRON 区块链的开源实现，遵循 MIT 许可协议发布。您无需购买任何商业产品即可自由使用。

#### 为什么要摒弃传统支付渠道或 API 密钥？

传统支付体系依赖于信用卡网络、用户账户以及繁琐的 UI 交互流程。x402-tron 摒弃了这些依赖，充分利用 TRON 网络高速、低成本的交易优势，实现了程序化的、HTTP 原生的支付体验（这对 AI 代理尤为理想）。

#### x402-tron 仅适用于加密原生项目吗？

并非如此。任何 Web API 或内容提供商——无论属于 Web3 原生还是传统 Web2——只要希望利用 TRON 区块链获得低成本、无摩擦的支付通道，均可集成 x402-tron。

### 语言与框架支持

#### 支持哪些语言和框架？

x402-tron 目前提供以下 SDK：

- **Python**: 集成了 FastAPI 和 Flask 支持
- **TypeScript**: 支持标准 fetch 客户端

这两种语言的 SDK 均完整实现了客户端 (Client)、服务端 (Server) 和 Facilitator 的功能。

### Facilitator

#### 谁来运行 Facilitator ？

通常情况下，您需要运行自己的 Facilitator 服务。x402-tron 专为自托管而设计，代码仓库中内置的 Facilitator 程序已准备就绪，可直接运行。

官方托管的 Facilitator 服务也 **即将推出**，届时您无需自行部署基础设施即可使用 x402-tron。

#### 如何防止恶意 Facilitator 窃取资金或伪造结算？

所有的支付载荷均由买方**使用 TIP-712 进行签名**，且结算过程**直接在 TRON 区块链上**执行。任何试图篡改交易数据的 Facilitator 都无法通过链上的签名验证。Facilitator 仅有权执行以下操作：

- 转移买方授权的确切金额
- 转账至签名载荷中指定的特定接收地址

### 定价策略与方案

#### 如何为端点制定价格？

常见的定价模式包括：

- **单次调用固定费率**：例如，每次请求收取 `1 USDT`。
- **分层定价**：为不同级别的端点（如 `/basic` 与 `/pro`）设定差异化价格。
- **`exact`方案**：支付服务指定的准确金额

#### x402-tron 支持哪些支付方案？

x402-tron 目前支持 `exact` 方案，其核心机制允许：

- 客户端授权一个**最高支付金额**。
- 服务端结算**实际产生的费用**（不超过授权上限）。
- 此方案非常适用于**按量计费 (Metered Billing)**、**LLM Token 消耗**等场景。

### 资产、网络及费用

#### 支持哪些资产与网络？

| 网络                          | 代币          | 状态        |
| ----------------------------- | ------------- | ----------- |
| TRON 主网 (`tron:mainnet`)    | USDT (TRC-20) | **Mainnet** |
| TRON Nile (`tron:nile`)       | USDT (TRC-20) | **Testnet** |
| TRON Shasta (`tron:shasta`)   | USDT (TRC-20) | **Testnet** |
| TRON Mainnet (`tron:mainnet`) | USDD (TRC-20) | **Mainnet** |
| TRON Nile (`tron:nile`)       | USDD (TRC-20) | **Testnet** |

此外，支持通过 TokenRegistry 添加自定义的 TRC-20 代币。

#### 涉及哪些费用？

- **TRON 网络费用**：用于支付能量 (Energy) 和带宽 (Bandwidth) 消耗的 TRX（由 Facilitator 承担）。
- **Facilitator 服务费**：每个 Facilitator 可独立配置的服务费用（支持设置为零）。

### 安全性

#### 我必须将私钥暴露给后端吗？

**不需要。** 我们推荐采用以下安全模式：

1.  **买方（客户端/代理）**：在本地运行时环境（如浏览器、Serverless 函数、代理虚拟机）中完成签名。
2.  **卖方**：无需接触买方私钥；仅负责验证签名的有效性。
3.  **Facilitator**：仅使用其自有密钥将交易提交上链。

#### 退款机制如何运作？

`exact` 方案属于**推送支付 (Push Payment)**——交易一旦上链执行即不可逆转。处理退款通常有以下两种方式：

1.  **业务层退款：** 由卖方主动发起一笔新的 USDT 转账，将资金返还给买方。
2.  **按实结算（预防性）：** 利用 `exact` 方案特性，服务端仅结算实际产生的费用，而非全额扣款（从而避免需要退款的情况）。

### AI 代理集成

#### 代理如何获知支付金额？

代理遵循与人类用户一致的交互流程：

1.  发起初始请求。
2.  解析响应中 `PAYMENT-REQUIRED` 标头包含的支付指令。
3.  使用 x402-tron 客户端 SDK 对 TIP-712 支付载荷进行签名。
4.  携带包含签名的 `PAYMENT-SIGNATURE` 标头再次发起请求。

#### 代理需要钱包吗？

**需要。** 程序化 TRON 钱包（通过 TronWeb 或 x402-tron 提供的签名器类实现）允许代理对 TIP-712 载荷进行签名，且**无需直接暴露助记词**，从而确保资金安全。

### 开发指南

#### 如何在本地运行 x402-tron？

1.  **克隆仓库：** 下载 [x402-tron-demo 仓库](https://github.com/bankofai/x402-tron-demo) 到本地。
2.  **安装依赖：** 安装项目依赖项（Python 环境请执行 `pip install -r requirements.txt`）。
3.  **配置环境：** 参考 `.env.example` 示例，在 `.env` 文件中配置您的 TRON 私钥。
4.  **启动 Facilitator：** 运行 `python facilitator/main.py`。
5.  **启动服务端：** 运行 `python server/main.py`。
6.  **运行客户端：** 执行 `python client/main.py` 发起测试请求。

#### 推荐使用哪个测试网？

推荐使用 **TRON Nile** 进行测试。该网络运行稳定，且测试币领取（水龙头）服务完善。

- **Nile 水龙头 (Faucet):** https://nileex.io/join/getJoinPage
- **Nile 区块浏览器:** https://nile.tronscan.org

### 故障排查

#### 为何携带了 `PAYMENT-SIGNATURE` 仍收到 `402 Payment Required` 响应？

常见原因如下：

1.  **TIP-712 签名无效**：域 (Domain) 参数配置错误或载荷 (Payload) 字段不匹配。
2.  **支付金额不足**：签名载荷中的金额低于服务端要求的金额。
3.  **授权额度 (Allowance) 不足**：客户端对 Facilitator 的代币授权额度不足。
4.  **账户余额不足**：客户端钱包地址缺乏足够的 USDT。

建议查看服务端返回的 JSON 响应中的 `error` 字段，以获取具体的错误诊断信息。

#### 在 Nile 测试网运行正常，切换到主网后失败，常见原因有哪些？

- **配置未更新**：确保网络配置项已设为 `network: "tron:mainnet"` 而非 `"tron:nile"`。
- **资产类型错误**：确认您的钱包持有的是**主网真实 USDT**，而非测试币。
- **手续费不足**：确保 Facilitator 钱包拥有足够的 TRX 用于支付链上能量与带宽费用。
- **合约地址变更**：不同网络（Nile vs Mainnet）的代币合约地址是不同的，请检查是否已更新。

#### 如何检查代币授权额度？

可以使用 SDK 提供的辅助方法进行检查：

```python
allowance = await signer.check_allowance(
    token_address="TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
    required_amount=1000000,
    network="tron:nile"
)
print(f"Current allowance: {allowance}")
```

### 仍有疑问？

• 在 [x402-tron 仓库](https://github.com/bankofai/x402-tron) 中提交 GitHub Issue 反馈问题
• 参考 [x402-tron-demo](https://github.com/bankofai/x402-tron-demo) 获取完整可运行的示例代码
