---
name: bai-recharge
description: 使用 B.AI 充值 API 查询实时链和币种、创建 crypto 充值订单、提供收银台或按授权直接转账，并查询支付结果。用于当前账户自充、个人代充和团队代充，不用于模型调用或通用钱包转账。
---

# B.AI 充值

## 能力与授权

本 Skill 提供 API 操作说明，不提供 API Key、HTTP 工具或钱包。先检查当前 Agent 的工具、权限与用户授权；不得将 Skill 本身当作付款授权。查询和建单授权不等于签名或付款授权，遵守当前 Agent 与钱包工具的确认要求。缺少能力或授权时说明缺失项，不索取私钥，不猜测或伪造签名及交易 hash。

按“查询实时渠道 → 创建订单 → 按 next_action 分流 → 查询支付结果”执行。保留业务订单号和已有交易，避免重复建单、重复付款。cashier 分支交付收银台链接后，由用户在收银台绑定钱包、付款及上报交易；Agent 不调用收银台专用接口。

## 1. 准备上下文

- 使用接入环境提供的充值服务 origin 与 API Key。生产示例为 `https://chat.b.ai`，不含 `/v1`；不是 `https://api.b.ai`。不要猜测测试环境地址。
- 从安全配置读取 Key，不显示、不写入代码或共享日志，不从其他客户端凭据文件提取。
- 明确到账对象、付款链、币种和代币数量。金额不是美元或积分。
- 首次建单前生成并保存本次业务唯一的 `out_trade_no`：1–64 个 ASCII 字母、数字、`_` 或 `-`。
- 有付款钱包时，确认实际付款地址及对应链的消息签名能力。

recipient 只选一种：

| 场景 | 请求对象 |
| --- | --- |
| 自充 | `{"type":"self"}` |
| 个人代充 | `{"type":"personal","identifier":"<邮箱或钱包标识>"}` |
| 团队代充 | `{"type":"team","team_slug":"<team slug>"}` |

用户未表达对象时可以采用 self；表达了代充但缺少目标时先询问，不能改为给自己充值。

所有公开充值端点使用 `Authorization: Bearer <API_KEY>`；JSON POST 使用 `Content-Type: application/json`。响应字段直接读取，没有统一 data 包装。错误结构为 `{"error":{"code":"...","message":"..."}}`。保存响应头 `X-Request-Id` 以便排查。当前按发起账户限每分钟 60 次请求；429 按 Retry-After 等待。

## 2. 查询实时选项

调用 `GET {BASE_URL}/v1/recharges/options`；可用 `?chain=<chain>` 筛选。

```json
{
  "channel": "crypto",
  "min_usd_amount": 1,
  "options": [{
    "chain": "base",
    "token_name": "USDC",
    "contract_address": "<合约地址或空字符串>",
    "min_amount": 1
  }]
}
```

链、代币、最低数量和最低美元价值均以实际响应为准，不硬编码示例规则。contract_address 是字符串，原生币可为空；min_amount 可省略。用户未选定且有多个可用项时询问选择；无匹配项则停止建单，不自动换链或换币。

金额为正数、最多 6 位小数，乘以 1,000,000 后必须可精确表示为 JavaScript 安全整数。同时满足代币最小数量及标称最低美元价值；最高美元价值及其他限制由服务端创建时校验。失败后按错误核查，不自动提高付款金额。

## 3. 创建订单

### 无付款钱包地址：收银台

完全省略 wallet_address、signature、expires_at、nonce，不传 null、空字符串或占位地址。调用 `POST {BASE_URL}/v1/recharges`：

```json
{
  "channel": "crypto",
  "crypto_recharge_params": {
    "chain": "base",
    "token_name": "USDC",
    "amount": 10
  },
  "out_trade_no": "topup-unique-business-id",
  "recipient": {"type":"self"}
}
```

示例值必须替换为本次已确认的需求，amount 为 JSON number。

### 有付款钱包地址：先签名

同时提供 wallet_address、signature、expires_at、nonce。有地址但不能签名时说明缺失能力，不暗中删地址换流程。

1. chain 去首尾空白并转小写；token_name 去首尾空白并转大写。EVM 地址转小写，TRON 和 Solana 保持原样。
2. 生成 32 字节密码学随机值，编码为无 padding 的 43 字符 base64url nonce。
3. expires_at 使用将来的 Unix 秒整数，不超过当前时间后 600 秒；可采用当前时间加 5 分钟。
4. 金额转为无指数、无多余末尾零的十进制文本，如 10.00 签为 10。
5. 对以下 UTF-8 文本签名，字段顺序固定，LF 换行且末尾无换行：

```text
B.AI Recharge v1
Order: <out_trade_no>
Wallet: <规范化付款地址>
Params: <chain>|<token_name>|<amount>
Nonce: <nonce>
ExpiresAt: <expires_at>
```

EVM 使用 personal_sign / EIP-191；TRON 使用 signMessageV2 对应消息签名；Solana 对完整 UTF-8 消息做 Ed25519 签名，signature 提交为 128 字符 hex，可带 0x 前缀。Solana 建单 signature 不是 base58 交易 hash。API Key 不能代替钱包签名。

将四个真实值放入 crypto_recharge_params 后建单。钱包消息签名证明归属，不表示付款交易已经广播。

### 保存与恢复

成功为 HTTP 200，包含 checkout_url、crypto_recharge_params、next_action、order_id、out_trade_no、status。保存创建响应和原请求参数；后续请求路径用 out_trade_no，不是 order_id。创建响应中的付款参数是嵌套对象，查单时相应字段在顶层。

同一发起账户重复订单号返回 `409 OUT_TRADE_NO DUPLICATE`，不会返回原订单；并发冲突也可能是 `400 RECHARGE_CONFLICT`。

创建超时、中断、5xx 或冲突后，先按原业务号查单。存在则核对到账对象、链、币种、金额及钱包，继续原单。404 时先核对环境和发起账户并短暂退避，仍确认无单时，才以原业务号及原业务参数有限重试；签名到期可以重新签名。

查单不会补发 checkout_url。cashier 订单若丢失创建响应，保留原单并交由接入方处理；不得用新号建单或再次付款绕过结果不明。无法确认时报告“建单结果待确认”，停止付款。

## 4. 按 next_action 分流

先查询详情，检查订单为 pending、尚未过期，也没有已广播或状态不明的本次转账。创建响应没有订单有效期，付款前以查询详情的 expires_at 为准。paid 不再付款，过期或其他不可付款状态停止。

### cashier

将 checkout_url 相对于接入环境的 BASE_URL 解析为完整 URL，保留 checkout 参数，只交给本次付款用户。链接含会话凭证，不能公开分享。

说明后续钱包绑定、付款和上报由收银台处理。Agent 不绕过收银台转账、不调用收银台专用接口、不代收银台上报。后续仅查原单，不把已建单当作已付款。

### direct-transfer

核对实际钱包及授权，遵循当前工具的签名和付款确认要求。用订单返回的链、币种、准确数量、receiver_address 和绑定的 wallet_address 付款；合约取实时渠道选项，网络费另计。

缺少钱包能力或付款授权时，只交付付款参数或 checkout_url，不擅自执行。交付收银台后由用户完成后续操作。

广播后立即保存真实 tx_hash。广播超时先用钱包或链确认结果，不能因为 pending、建单冲突或上报失败重复转账。未知 next_action、缺失链接或参数不全时，保存订单并停止付款。

## 5. 上报并查询支付结果

仅 direct-transfer 已付款后调用：

```http
POST /v1/recharges/{out_trade_no}/payment-submit
Authorization: Bearer <API_KEY>
Content-Type: application/json

{"tx_hash":"<真实交易hash>"}
```

tx_hash 为 1–128 字符；EVM/TRON 使用 64 位十六进制，可带 0x 前缀；Solana 为解码后 64 字节的 base58 交易签名。提交本单真实交易，不能使用其他付款试探。

交易的钱包、收款地址、链、币种、准确数量必须匹配，交易时间不能早于建单时间。交易超过 10 分钟上报窗口返回 `400 TX_EXPIRED` 时，停止上报旧交易，等待扫描并查原单，不再次付款。

上报返回 order_id、status、tx_hash、confirmed_at，没有 out_trade_no。pending 时 hash 可能已写入订单，但不证明核验通过；只能查原单或在有效窗口有限重报同一 hash，不能换 hash 或再次付款。cashier 上报由收银台完成。

调用 `GET {BASE_URL}/v1/recharges/{out_trade_no}`，使用原发起账户的 Bearer Key。同账户不同 Key 共享订单访问范围；为他人或团队充值不授予目标账户权限。

- pending：尚未确认支付。可按 3、5、10 秒逐步退避，最长间隔 30 秒，单次跟踪最多 5 分钟或更早的订单过期时间。这是客户端策略；超时保留订单和 hash，报告待确认并允许后续恢复。
- paid：停止付款和支付状态轮询，报告“支付已确认”。此接口不提供积分到账明细，不宣称积分已到账。
- expired 或其他状态：停止付款，报告实际状态。未付款订单创建超过 24 小时显示 expired，已付款仍为 paid。

未绑定钱包时，创建响应的 wallet_address 可为 null，查询响应为空字符串。未上报的 tx_hash 为空字符串；confirmed_at 在 paid 时有值。

## 6. 错误处理与交付

| 返回 | 处理 |
| --- | --- |
| 400 参数、地址、金额、币种或目标错误 | 核查原参数、实时选项及目标，不自动增加金额。签名到期或超时限则重签。 |
| 401 | 核查发起账户 Key 和站点，保留订单并停止付款。 |
| 403 INVALID_WALLET_SIGNATURE / PAYER_MISMATCH | 核查签名和实际钱包，停止后续付款。 |
| 404 ORDER_NOT_FOUND | 核对环境、发起账户及业务号，不使用 order_id 代替。 |
| 409 OUT_TRADE_NO DUPLICATE / 400 RECHARGE_CONFLICT | 查询原业务号并按恢复规则处理。 |
| 409 INVALID_TX_HASH / ORDER_ALREADY_REPORTED_TX_HASH / ORDER_ALREADY_PAID | 保留原订单与交易证据，查原单，不更换 hash、不重复付款。 |
| 400/409 PAYMENT_MISMATCHED / 400 PAYMENT_INFO_MISMATCHED | 核对订单与实际交易，不改订单或再付款来绕过。 |
| 503 PAYMENT_INFO_MISMATCHED | 可能是交易早于建单，保留证据，不当作未付款或普通可无限重试错误。 |
| 400 TX_EXPIRED | 等待扫描并查原单，不重新付款。 |
| 429 | 按 Retry-After 等待；提示 Request is being processed 时先查原单，再考虑重报同一 hash。 |
| 其他 5xx | 保存请求 ID，先查原单及付款结果，再有限退避重试；不据此推断付款未发生。 |

不要依赖“相同钱包、链、币种及金额会自动拦截”防止重复付款；以原业务号、原订单和链上记录控制恢复流程。不承诺充值赠送积分。

结束时交付 out_trade_no、order_id（如有）、实际支付状态、链/币种/数量、真实 tx_hash（如有）及下一步。只有查到或上报得到 paid 才报告支付确认；待收银台、待链上确认、结果不明都明确标注。
