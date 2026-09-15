import ThemedImage from '@theme/ThemedImage';

# 客户端与服务器

深入理解这些角色，对于在区块链上设计、构建或集成基于 x402 的程序化支付服务至关重要。

> **注意**
>
> - **客户端 (Client)**：指发起 HTTP 请求的技术组件。在实际业务场景中，通常对应资源的**买家**。
> - **服务端 (Server)**：指响应请求的技术组件。在实际业务场景中，通常对应资源的**卖家**。

## 客户端角色 (Client Role)

客户端是发起请求以访问付费资源的实体。

客户端的形式多种多样，包括：

- 面向用户的应用程序
- 自主代理 (Autonomous Agents)
- 代表用户或系统执行操作的后台服务

### 核心职责

- **发起请求**：向资源服务器发送初始 HTTP 请求。
- **处理支付要求**：解析 `402 Payment Required` 响应，并提取支付详情。
- **管理代币授权**：为普通 ERC-20/TRC-20 代币授权 Permit2（一次性 `approve(Permit2)`）；ERC-3009 代币无需授权。由谁广播因链而异。**在 TRON 上**，client 会在首次付款时自动广播该授权、能量自付——除非 server 声明了 `trc20ApprovalResourceSponsoring` 扩展（SDK 1.2.0+），此时 client 只签名不广播，由 facilitator 赞助能量/带宽并广播。**在 EVM 上 client 从不广播任何交易**：要么在 server 声明了 `eip2612GasSponsoring` 或 `erc20ApprovalGasSponsoring` 时附上一笔已签名但未广播的授权交由 facilitator 转发；要么在没有任何相关扩展时，验款直接以 `permit2_allowance_required` 失败，授权必须在首次付款前另行完成。详见 [SDK 功能矩阵](../sdk-features.md#extensions)。
- **准备支付载荷**：根据服务端的要求，构建并签署支付载荷。
- **携带支付凭证重发请求**：在请求头中附加 `PAYMENT-SIGNATURE` 并重新发送请求。

客户端**无需**维护钱包之外的任何账户体系、登录凭据或会话 Token。所有的交互均为**无状态**的，且完全基于标准 HTTP 协议进行。

## 服务端角色 (Server Role)

服务端是要求付费才能访问其资源的提供者。

服务端的形态多种多样，包括：

- API 服务
- 数字内容提供商
- 任何可通过 HTTP 访问且寻求变现的资源

### 核心职责

- **定义支付要求**：对未附带有效支付凭证的请求响应 HTTP `402 Payment Required`，并在响应体中详细说明支付要求。
- **验证支付载荷**：调用 Facilitator 服务对传入的签名载荷进行验证。
- **结算交易**：验证通过后，通过 Facilitator 提交交易以完成资金结算。
- **交付资源**：支付确认无误后，向客户端返回所请求的资源。

服务端**无需**管理客户端身份或维护会话状态。验证与结算过程由 Facilitator 针对每个请求独立处理。

## 通信流程

在 x402 协议中，客户端与服务端之间的典型交互流程如下：

1.  **客户端发起请求**：向服务端发送针对付费资源的请求。
2.  **服务端要求付费**：响应 `402 Payment Required` 状态码，并在 `PAYMENT-REQUIRED` 标头中包含支付要求（Base64 编码）。
3.  **客户端提交支付**：根据要求生成签名，并将签名载荷放入 `PAYMENT-SIGNATURE` 标头（Base64 编码）中重新发送请求。
4.  **服务端验证支付**：调用 Facilitator 服务对接收到的支付载荷进行验证。
5.  **服务端先交付资源、再结算**：在默认的 `authorization` 付款流程下——所有内置方案声明的都是这个流程——资源服务端会先执行业务处理函数，之后再通过 Facilitator 结算，并在返回资源时于 `PAYMENT-RESPONSE` 标头中带上结算确认信息（内含交易哈希）。若服务端选用了「先结算」的流程，以及 BANK OF AI 网关，则顺序相反：先结算再转发到上游。

<ThemedImage
  alt="x402 中客户端、服务端与 Facilitator 的通信流程"
  sources={{
    light: '/img/diagrams/x402-payment-flow.zh.light.svg',
    dark: '/img/diagrams/x402-payment-flow.zh.svg',
  }}
/>

## 总结

在 x402 协议体系中：

- **客户端 (Client)**：发起资源请求，并负责提供经过签名的支付载荷。
- **服务端 (Server)**：执行支付策略，验证交易有效性，并在确认支付成功后交付资源。

这种交互模式完全基于原生 HTTP 协议，具备**无状态 (Stateless)** 特性，既兼容面向用户的应用程序，也能完美支持自动化/自主代理 (Autonomous Agents)。

## 下一步

接下来，请深入探索：

- [Facilitator](./facilitator.md) — 了解服务器如何验证并结算支付
- [钱包(Wallet)](./wallet.md) — 了解如何管理用于支付的钱包
