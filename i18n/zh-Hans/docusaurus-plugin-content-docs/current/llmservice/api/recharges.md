# 充值 API

充值 API 用于查询支持的链和代币、创建充值订单、查询支付状态及上报链上交易。当前仅支持加密货币充值，可为当前账户、其他个人账户或团队创建订单。

希望通过自然语言让 Agent 协助充值，请查看相邻的[充值 Skill 使用指南](./recharge-skill-guide.md)。Skill 使用本页接口，不是另一套充值系统。

## 请求地址与认证

| 配置项 | 说明 |
| --- | --- |
| 服务地址 | `https://chat.b.ai`；其他环境使用接入方提供的站点地址，不包含 `/v1` |
| 路径前缀 | `/v1/recharges` |
| 认证 | `Authorization: Bearer <API_KEY>` |
| JSON 请求头 | `Content-Type: application/json` |
| 排查标识 | 响应头 `X-Request-Id` |

**充值接口与模型接口使用不同的服务地址。** 不要将本页路径拼接到模型接口的 `https://api.b.ai/v1`。文档中的服务地址指充值服务，不是当前文档站的域名。

API Key 代表发起账户。同一账户下的不同 API Key 共用订单号空间，并可访问该账户创建的订单。为其他个人或团队充值，不会授予调用方目标账户的访问权限。

响应 JSON 直接返回字段，无统一的 `data` 包装。请安全保存 Key；`checkout_url` 含收银台会话凭证，只应交付给本次付款用户，不要公开分享。

## 端点概览

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/v1/recharges/options` | 查询当前支持的充值选项 |
| `POST` | `/v1/recharges` | 创建充值订单 |
| `GET` | `/v1/recharges/{out_trade_no}` | 查询原订单及支付状态 |
| `POST` | `/v1/recharges/{out_trade_no}/payment-submit` | 直接转账后上报交易 hash |

后续路径使用调用方生成的 **`out_trade_no`**，不是平台返回的 `order_id`。

## 快速接入：通过收银台付款

以下示例使用 `BAI_API_KEY` 环境变量，不要将真实 Key 写入代码或共享日志。示例中的链、币种和数量仅用于展示，建单前须查询实时选项。

### 1. 查询充值选项

```bash
curl 'https://chat.b.ai/v1/recharges/options' \
  -H "Authorization: Bearer ${BAI_API_KEY}"
```

可选查询参数 `chain` 用于按链筛选，例如 `?chain=base`；值按小写处理，省略时返回全部可用选项。

响应 `200`：

```json
{
  "channel": "crypto",
  "min_usd_amount": 1,
  "options": [
    {
      "chain": "base",
      "token_name": "USDC",
      "contract_address": "0x...",
      "min_amount": 1
    }
  ]
}
```

`min_usd_amount` 是最低充值美元价值；`min_amount` 是该代币的最低数量，可能省略。原生币的 `contract_address` 可为空字符串。不要写死支持的链、币种、合约或收款地址；无匹配选项时停止建单。

### 2. 创建订单

不提供付款钱包地址时，省略 `wallet_address`、`signature`、`expires_at` 和 `nonce`，不要传入空字符串或占位值。

```bash
curl 'https://chat.b.ai/v1/recharges' \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -H 'Content-Type: application/json' \
  -d '{
    "channel": "crypto",
    "crypto_recharge_params": {
      "chain": "base",
      "token_name": "USDC",
      "amount": 10
    },
    "out_trade_no": "topup-unique-business-id",
    "recipient": { "type": "self" }
  }'
```

首次建单前生成并保存本次业务唯一的 `out_trade_no`，不要在不同充值任务中重复使用示例订单号。

响应 `200`：

```json
{
  "checkout_url": "/pay?checkout=<SESSION_TOKEN>",
  "crypto_recharge_params": {
    "amount": 10,
    "chain": "base",
    "token_name": "USDC",
    "receiver_address": "0x...",
    "wallet_address": null
  },
  "next_action": "cashier",
  "order_id": "123456",
  "out_trade_no": "topup-unique-business-id",
  "status": "pending"
}
```

### 3. 打开收银台

将返回的 `checkout_url` 相对于充值服务地址解析成完整 URL，例如 `https://chat.b.ai/pay?checkout=<SESSION_TOKEN>`，保留完整查询参数。用户在收银台完成钱包绑定、付款和交易上报。

请保存创建响应，尤其是 `checkout_url`。查询订单接口不会补发该链接；如果创建响应丢失，不要直接更换订单号重建并付款。

### 4. 查询支付结果

```bash
curl 'https://chat.b.ai/v1/recharges/topup-unique-business-id' \
  -H "Authorization: Bearer ${BAI_API_KEY}"
```

查询响应的结构示意如下。时间、地址和标识为示例值：

```json
{
  "amount": 10,
  "chain": "base",
  "channel": "crypto",
  "confirmed_at": null,
  "created_at": "2026-10-21T08:00:00.000Z",
  "expires_at": 1792656000,
  "next_action": "cashier",
  "order_id": "123456",
  "out_trade_no": "topup-unique-business-id",
  "receiver_address": "0x...",
  "recipient": {
    "type": "self",
    "target_id": "user_123",
    "display_label": "p***@example.com"
  },
  "status": "pending",
  "timestamp": 1792569600,
  "token_name": "USDC",
  "tx_hash": "",
  "wallet_address": ""
}
```

创建响应中的支付参数位于 `crypto_recharge_params` 内；查询响应中相应字段位于顶层。未绑定的钱包地址在创建响应中可能为 `null`，在查询响应中为空字符串。

| 状态 | 含义与处理 |
| --- | --- |
| `pending` | 支付尚未确认。保留订单，稍后查询，不要再次付款。 |
| `paid` | 支付已确认，`confirmed_at` 有值。停止付款及支付状态轮询。 |
| `expired` | 未付款订单创建超过 24 小时后显示过期；停止向该订单付款。 |

**`paid` 不等于积分已到账。** 积分入账异步处理，该接口不提供积分到账明细，也不保证积分页面已完成刷新。

## 建单参数与充值对象

| 字段 | 规则 |
| --- | --- |
| `channel` | 必填，当前仅为 `crypto`。 |
| `out_trade_no` | 必填，同一发起账户内唯一；1–64 个 ASCII 字母、数字、`_` 或 `-`。 |
| `recipient` | 指定本次充值对象，见下表。 |
| `crypto_recharge_params.chain` | 必填，使用当前支持的链。 |
| `crypto_recharge_params.token_name` | 必填，使用该链当前支持的代币。 |
| `crypto_recharge_params.amount` | 必填，JSON number，单位为代币数量，不是美元或积分；正数、最多 6 位小数，换算成微单位后须为安全整数，并满足数量及美元价值限制。 |
| `crypto_recharge_params.wallet_address` | 可选；提供时必须同时提交有效的 `signature`、`expires_at` 和 `nonce`。 |
| `crypto_recharge_params.signature` | 提供付款钱包时必填，用于验证钱包归属。 |
| `crypto_recharge_params.expires_at` | 提供付款钱包时必填；签名到期的 Unix 秒时间戳，必须在将来且不超过当前时间后 10 分钟。 |
| `crypto_recharge_params.nonce` | 提供付款钱包时必填；32 字节密码学随机值的 base64url 编码，无 padding，长度为 43 字符。 |

金额以 `1,000,000` 微单位对应 1 个代币保存；换算后的整数不得超过 JavaScript 安全整数上限。最低美元价值及代币最低数量以实时选项为准，最高美元价值及其他限制由服务端在创建时校验。不要为了绕过校验自动提高用户授权的金额。

| 场景 | `recipient` 示例 |
| --- | --- |
| 当前账户自充 | `{"type":"self"}` |
| 为其他个人充值 | `{"type":"personal","identifier":"person@example.com"}`；可使用个人邮箱或钱包标识 |
| 为团队充值 | `{"type":"team","team_slug":"your-team-slug"}` |

到账对象不决定调用方的权限。订单查询和付款上报仍使用原发起账户的 API Key。

## 进阶：绑定钱包并直接转账

### 钱包归属签名

在创建请求的 `crypto_recharge_params` 中同时加入付款地址与三个签名字段。签名消息是以下 UTF-8 文本，字段顺序固定，使用 LF 换行，末尾无换行：

```text
B.AI Recharge v1
Order: <out_trade_no>
Wallet: <normalized wallet address>
Params: <chain>|<token_name>|<amount>
Nonce: <nonce>
ExpiresAt: <expires_at>
```

签名前，将 `chain` 去首尾空白并转小写，`token_name` 去首尾空白并转大写。EVM 地址转小写，TRON 和 Solana 地址保持原样。金额使用无指数、无多余末尾零的普通十进制文本，例如 `10.00` 写成 `10`。

`nonce` 必须为本次新生成的随机值；`expires_at` 必须使用本次实际有效的 Unix 秒时间戳。签名只证明钱包归属，不等于已发送付款交易；API Key 不能代替钱包签名，不要索取或传输私钥。

| 链类型 | 消息签名方式 |
| --- | --- |
| EVM | `personal_sign`，EIP-191 语义。 |
| TRON | `signMessageV2` 对应的消息签名。 |
| Solana | 对完整 UTF-8 消息执行 Ed25519 签名；提交为 128 字符 hex，可带 `0x` 前缀，不是交易 hash 使用的 base58。 |

### 核对订单并付款

创建成功后，根据响应中的 `next_action` 处理。`direct-transfer` 表示可以使用已验证的钱包直接付款；`cashier` 表示应由用户进入收银台完成操作。

付款前查询原订单，核对其仍为 `pending`、尚未过期，也没有已广播或状态不明的付款。使用订单返回的链、币种、准确数量、收款地址和绑定的钱包付款，合约地址取实时充值选项，网络手续费另计。

广播后立即保存真实 `tx_hash`。广播超时应先核对链上结果，不能因查询或上报失败再次转账。

### 上报链上交易

仅在直接转账已完成并取得真实交易 hash 后调用；收银台分支由收银台处理上报。

```bash
curl 'https://chat.b.ai/v1/recharges/topup-unique-business-id/payment-submit' \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -H 'Content-Type: application/json' \
  -d '{"tx_hash":"<TRANSACTION_HASH>"}'
```

响应 `200`：

```json
{
  "confirmed_at": null,
  "order_id": "123456",
  "status": "pending",
  "tx_hash": "<TRANSACTION_HASH>"
}
```

服务端校验付款钱包、收款地址、链、币种、准确数量和交易时间。交易时间不得早于建单时间；超过 10 分钟上报窗口时返回 `TX_EXPIRED`，此时等待扫描并查询原单，不要重新付款。

`tx_hash` 长度为 1–128 字符；EVM/TRON 使用 64 位十六进制，可带 `0x` 前缀；Solana 使用解码后 64 字节的 base58 交易签名。

`pending` 只表示尚未确认，订单中已有 hash 不代表校验成功。同一订单重复上报相同 hash 是幂等的。不要更换 hash 重试；hash 被其他订单占用、订单已记录不同 hash 或状态不可付款时，应保留原记录并处理冲突。

## 错误、限流与重试

通常的错误结构为：

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters"
  }
}
```

| HTTP | 常见错误码 | 处理方式 |
| --- | --- | --- |
| `400` | `INVALID_REQUEST`、`INVALID_AMOUNT`、`UNSUPPORTED_TOKEN`、`RECIPIENT_UNAVAILABLE` | 核对参数、金额、实时渠道和到账对象。 |
| `400` | `INVALID_TX_HASH`、`WALLET_NOT_BOUND`、`PAYMENT_MISMATCHED`、`PAYMENT_INFO_MISMATCHED` | 核对原订单与实际交易，不再次付款。 |
| `400` | `TX_EXPIRED` | 上报超过交易时间窗口；停止上报旧交易，等待扫描并查询原单。 |
| `401` | `INVALID_API_KEY`、`UNAUTHORIZED` | 检查原发起账户的 Key 和服务地址。 |
| `403` | `INVALID_WALLET_SIGNATURE`、`PAYER_MISMATCH` | 核对钱包归属签名和实际付款钱包，停止后续付款。 |
| `404` | `ORDER_NOT_FOUND` | 核对站点、发起账户及 `out_trade_no`，不要使用 `order_id` 代替。 |
| `409` | `OUT_TRADE_NO DUPLICATE` | 查询原订单；重复建单不会返回原订单。并发冲突也可能返回 `400 RECHARGE_CONFLICT`。 |
| `409` | `INVALID_TX_HASH`、`ORDER_ALREADY_REPORTED_TX_HASH`、`ORDER_ALREADY_PAID` | 查询原单，保留订单与交易证据，不更换 hash 或再次付款。 |
| `429` | `TOO_MANY_REQUESTS` | 按 `Retry-After` 秒数等待；提示正在处理时先查询原单。 |
| `503` | `CHECKOUT_UNAVAILABLE`、`PRICE_UNAVAILABLE`、`RECEIVER_UNAVAILABLE`、`RECIPIENT_SERVICE_UNAVAILABLE`、`AUTH_UNAVAILABLE` | 保留请求 ID，先查询原单，再做有限退避重试。 |
| `503` | `PAYMENT_INFO_MISMATCHED` | 交易时间早于建单时可能返回；保留证据，不据此判断未付款，不无限重试。 |

当前按发起账户限制每分钟 60 次请求。订单查询应退避并有停止条件，不要持续高频轮询。

**创建结果不明确：** 超时、中断、`5xx` 或重复订单号冲突时，先用原 `out_trade_no` 查询。确认有单后继续原单；返回 `404` 时先核对环境和账户并短暂退避，仍确认无单时才以原订单号、原业务参数有限重试。签名过期可重新签名，不更换充值对象或金额。

**收银台链接丢失：** 查单不会返回 `checkout_url`。保留原订单，由接入方处理，不能靠新建订单和再次付款恢复原流程。

**付款上报结果不明确：** 先查询原单，必要时在有效窗口内重报同一个 hash。不要更换订单号、付款金额或交易 hash 来绕过冲突。

## 相关文档

- [充值 Skill 使用指南](./recharge-skill-guide.md)
- [余额 API](./balance.md)
- [定价与用量](../pricing-and-usage.md#充值)
