import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# HTTP 402

## 什么是 HTTP 402？

[HTTP 402](https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.2) 是一个标准但长期未被充分利用的 HTTP 响应状态码，意在表示“必须付费才能访问请求的资源”。

在 x402 协议中，我们重新激活了此状态码，用于：

- **告知**客户端（买方或代理）访问受限，需要支付。
- **传达**详细的支付要求，包括金额、代币类型及目标地址。
- **提供**构建程序化付款所需的必要元数据（用于构造待签名的载荷）。

## 为什么要使用 HTTP 402？

x402 采用 HTTP 402 的核心旨在为网络资源实现**无摩擦、API 原生**的支付体验，尤其适用于：

- **机器对机器 (M2M) 支付**：如 AI 代理 (AI Agents) 之间的自主交易。
- **按量付费 (Pay-per-use)**：如 API 调用计费或付费墙内容解锁。
- **微支付 (Micropayments)**：无需账户注册或绑定传统法币支付渠道的小额支付。
- **全球支付**：基于区块链网络的稳定币 (USDT) 结算，消除地域限制。

通过复用标准的 402 状态码，x402 保持了与原生 Web 协议的高度兼容性，能够轻松集成至任何基于 HTTP 的服务架构中。

## 支付标头

x402 定义了一组标准化 HTTP 标头用于支付通信：

- **`PAYMENT-REQUIRED`**：包含服务端生成的**支付要求**（Base64 编码）。此标头随 `402` 响应返回，明确告知客户端支付的详细参数。
- **`PAYMENT-SIGNATURE`**：包含客户端生成的**支付载荷**（Base64 编码）。客户端在收到 402 响应后，携带此标头重试请求，作为已授权支付的加密证明。
- **`PAYMENT-RESPONSE`**：包含服务端返回的**结算响应**（Base64 编码）。此标头随成功响应（如 `200 OK`）返回，内含交易哈希等结算凭证。

> **技术说明**：上述标头的值必须是**有效的 Base64 编码 JSON 字符串**。这种编码方式确保了跨不同 HTTP 实现的兼容性，并有效防止了 JSON 载荷中的特殊字符引发解析错误。

## 支付要求结构

当服务端返回 `402 Payment Required` 响应时，其 `PAYMENT-REQUIRED` 标头解码后包含以下结构数据：

<Tabs>
<TabItem value="TRON" label="TRON">

```json
{
  "x402Version": 2,
  "error": "Payment required",
  "resource": {
    "url": "http://example.com/protected",
    "description": null,
    "mimeType": null
  },
  "accepts": [
    {
      "scheme": "exact",
      "network": "tron:nile",
      "amount": "100",
      "asset": "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
      "payTo": "<SELLER_TRON_ADDRESS>",
      "maxTimeoutSeconds": 3600,
      "extra": {
        "name": "Tether USD",
        "version": "1",
        "assetTransferMethod": "permit2"
      }
    }
  ],
  "extensions": {}
}
```

</TabItem>
<TabItem value="BSC" label="BSC">

```json
{
  "x402Version": 2,
  "error": "Payment required",
  "resource": {
    "url": "http://example.com/protected",
    "description": null,
    "mimeType": null
  },
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:97",
      "amount": "100000000000000",
      "asset": "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
      "payTo": "<SELLER_BSC_ADDRESS>",
      "maxTimeoutSeconds": 3600,
      "extra": {
        "name": "Tether USD",
        "version": "1",
        "assetTransferMethod": "permit2"
      }
    }
  ],
  "extensions": {}
}
```

</TabItem>
</Tabs>

**关键字段：**

| 字段                | 描述                                                                |
| ------------------- | ------------------------------------------------------------------- |
| `x402Version`       | 协议版本（当前为 2）                                                |
| `error`             | 人类可读的错误提示                                                  |
| `resource`          | 关于请求资源的信息                                                  |
| `accepts`           | 接受的支付选项数组                                                  |
| `scheme`            | 支付方案（当前为 `exact`）                                          |
| `network`           | 网络标识符（`tron:nile`, `tron:mainnet`, `eip155:56`, `eip155:97`） |
| `amount`            | 支付金额，以最小单位计（例如：100 = 0.0001 USDT）                   |
| `asset`             | TRC-20/BEP-20 代币合约地址                                          |
| `payTo`             | 卖家的钱包地址                                                      |
| `maxTimeoutSeconds` | 支付有效期的最大时长                                                |
| `extra`             | 方案特定的元数据（如代币名称、版本、转账方式）                      |
| `extensions`        | 请求的附加上下文                                                    |

## 支付签名结构

客户端在 `PAYMENT-SIGNATURE` 标头中以签名载荷进行响应：

<Tabs>
<TabItem value="TRON" label="TRON">

```json
{
  "x402Version": 2,
  "payload": {
    "authorization": {
      "from": "<CLIENT_TRON_ADDRESS>",
      "to": "<SELLER_TRON_ADDRESS>",
      "value": "100",
      "validAfter": 1770817311,
      "validBefore": 1770820911,
      "nonce": "0x..."
    },
    "signature": "0x..."
  },
  "accepted": {
    "scheme": "exact",
    "network": "tron:nile",
    "amount": "100",
    "asset": "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
    "payTo": "<SELLER_TRON_ADDRESS>",
    "maxTimeoutSeconds": 3600,
    "extra": {
      "name": "Tether USD",
      "version": "1",
      "assetTransferMethod": "permit2"
    }
  }
}
```

</TabItem>
<TabItem value="BSC" label="BSC">

```json
{
  "x402Version": 2,
  "payload": {
    "authorization": {
      "from": "<CLIENT_BSC_ADDRESS>",
      "to": "<SELLER_BSC_ADDRESS>",
      "value": "100000000000000",
      "validAfter": 1770817158,
      "validBefore": 1770820758,
      "nonce": "0x..."
    },
    "signature": "0x..."
  },
  "accepted": {
    "scheme": "exact",
    "network": "eip155:97",
    "amount": "100000000000000",
    "asset": "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    "payTo": "<SELLER_BSC_ADDRESS>",
    "maxTimeoutSeconds": 3600,
    "extra": {
      "name": "Tether USD",
      "version": "1",
      "assetTransferMethod": "permit2"
    }
  }
}
```

</TabItem>
</Tabs>

**关键字段：**

| 字段          | 描述                                      |
| ------------- | ----------------------------------------- |
| `x402Version` | 协议版本（当前为 2）                      |
| `payload`     | 加密签名及授权详情                        |
| `accepted`    | 正在履行的具体 `PaymentRequirements` 对象 |
| `resource`    | 可选的资源信息                            |
| `extensions`  | 可选的扩展数据                            |

## 总结

HTTP 402 是 x402 协议的基石，它赋能服务端直接在 HTTP 响应层面对接支付逻辑。通过这一标准状态码，协议实现了：

- **发出支付信号**：明确标记资源为“付费访问”状态。
- **传递支付参数**：精准传达金额、代币合约及接收方地址等关键元数据。
- **无缝集成**：完全兼容现有的标准 HTTP 工作流（无状态、RESTful）。
- **程序化结算**：在区块链上实现全自动、无需人工干预的支付流程。

## 下一步

接下来，请深入探索：

- [客户端 / 服务器](./client-server.md) — 了解客户端和服务器的角色与职责
- [Facilitator](./facilitator.md) — 了解服务器如何验证并结算支付
