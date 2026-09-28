# Decisions API

Decisions API 用于分类、评分和是非判断，返回结构化结果，不生成自由文本。

---

## 1. 准备 API Key

请登录API页面进行API Key创建

---

## 2. 发起决策请求

向以下地址发送 JSON 请求：

```http
POST https://api.b.ai/v1/decisions
```

无需查询参数。请设置 `Content-Type: application/json`。接口只支持 `POST`，请省略 `stream` 或将其设为 `false`。

### 鉴权

使用 API Key 鉴权：

```http
Authorization: Bearer sk-your-api-key
```

也可以使用 `x-api-key` 请求头：

```http
x-api-key: sk-your-api-key
```

### 请求示例

```bash
curl --request POST "https://api.b.ai/v1/decisions" \
  --header "Authorization: Bearer sk-your-api-key" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "jev-latest",
    "state": {
      "message": "我昨天已经付款，但订单仍然显示未付款。",
      "channel": "email"
    },
    "questions": {
      "needs_support": {
        "type": "noul",
        "instructions": "是否需要人工客服处理？"
      },
      "category": {
        "type": "choice",
        "instructions": "选择问题类别。",
        "criteria": {
          "payment": "付款",
          "delivery": "配送",
          "other": null
        }
      },
      "urgency": {
        "type": "score",
        "instructions": "评价紧急程度。",
        "criteria": ["低", "中", "高"]
      }
    }
  }'
```

将 `sk-your-api-key` 替换为实际 API Key。

### 请求字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `model` | string | 是 | 仅支持 Jev 模型，模型 ID 为 `jev-1.13.0` 或 `jev-latest`。 |
| `state` | string、object 或 array | 是 | 所有问题共享的输入。`null`、数字、布尔值等其他 JSON 类型会被拒绝。 |
| `questions` | object | 是 | 非空的问题 ID 到问题定义的映射。 |

### 问题字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| 问题 ID | 非空字符串 | 是 | `questions` 中的对象键，也会作为响应 `answers` 中的键。 |
| `type` | string | 是 | 只能是 `noul`、`choice` 或 `score`。 |
| `instructions` | string、object 或 array | 是 | 对该问题进行判断的说明。 |
| `criteria` | object 或 array | 取决于 `type` | 可选标签或有序评分等级，具体规则见下文。 |

问题 ID 不能为空或仅包含空白字符。`instructions` 必须是 JSON 字符串、对象或数组。

### `noul` 问题

`noul` 用于是非判断，表示模型判断答案为“是”的概率估计。接近 `0` 表示倾向“否”，接近 `1` 表示倾向“是”，接近 `0.5` 表示不确定；它不表示程度评分。`criteria` 可以省略；如果提供，必须是对象，且只允许使用 `"true"` 和 `"false"` 作为键。两个键均可省略，也接受空对象。已提供的说明必须是字符串、对象或数组，不接受 `null`、数字或布尔值；`criteria` 字段本身也不能为 `null`。

```json
{
  "is_greeting": {
    "type": "noul",
    "instructions": "这条消息是否是问候语？",
    "criteria": {
      "true": "消息是问候语。",
      "false": "消息不是问候语。"
    }
  }
}
```

### `choice` 问题

`choice` 用于答案必须来自固定标签集合的场景。`criteria` 必填，必须是包含 1 到 255 个选项的对象。每个键都是一个选项标识符；选项说明可以是 `null`、字符串、对象或数组。

```json
{
  "language": {
    "type": "choice",
    "instructions": "这段内容使用什么语言？",
    "criteria": {
      "en": "英文",
      "zh": "中文",
      "other": null
    }
  }
}
```

### `score` 问题

`score` 用于按有序等级评分。返回值是各等级按概率加权的数值，可以落在两个等级之间，并不限于整数索引。`criteria` 必填，必须是包含 2 到 10 项的数组。每个等级必须是字符串、对象或数组，不允许为 `null`。

第一个等级的索引为 `0`，第二个等级的索引为 `1`，依此类推。

```json
{
  "quality": {
    "type": "score",
    "instructions": "评价答案质量。",
    "criteria": [
      "较差",
      "可以",
      "优秀"
    ]
  }
}
```

---

## 3. 理解响应

HTTP `200` 直接返回 JSON 结果，顶层字段为 `model`、`answers` 和 `usage`。以下数值仅为示例：

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "needs_support": {
      "type": "noul",
      "noul": 0.96
    },
    "category": {
      "type": "choice",
      "choice": "payment",
      "confidence": 0.94,
      "probabilities": {
        "payment": 0.94,
        "delivery": 0.03,
        "other": 0.03
      }
    },
    "urgency": {
      "type": "score",
      "score": 1.85,
      "confidence": 0.87,
      "probabilities": {
        "0": 0.02,
        "1": 0.11,
        "2": 0.87
      },
      "legend": {
        "0": "低",
        "1": "中",
        "2": "高"
      }
    }
  },
  "usage": {
    "input_tokens": 123,
    "output_tokens": 45
  }
}
```

---

## 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `model` | string | 必填的非空模型名称 |
| `answers` | object | 必须为请求中的每个问题各返回一个答案，且数量完全一致。 |
| `answers.<id>.type` | string | 必须与对应问题的 `type` 一致。 |
| `answers.<id>.noul` | number | `noul` 问题必填，取值范围为 `0` 到 `1`。 |
| `answers.<id>.choice` | string | `choice` 问题必填，必须是该问题 `criteria` 中的一个键。 |
| `answers.<id>.score` | number | `score` 问题必填，范围为 `0` 到最后一个等级的索引，可以是小数。 |
| `answers.<id>.confidence` | number | `choice` 和 `score` 问题必填，范围为 `0` 到 `1`。`confidence` 是根据答案概率分布计算的置信度指标，不能直接解释为答案正确率，也不应按最大选项概率自行计算。`noul` 不返回独立的 `confidence`。 |
| `answers.<id>.probabilities` | object | `choice` 和 `score` 问题必填，键必须与该问题的全部选项键或字符串形式的等级索引完全一致，值范围为 `0` 到 `1`；所有值之和允许 `0.0001` 的浮点误差。 |
| `answers.<id>.legend` | object | `score` 问题必填，键必须与全部字符串形式的等级索引完全一致，每个值均为非 null 的字符串说明。 |
| `usage` | object | 必填，由上游提供商报告的 token 用量。 |
| `usage.input_tokens` | 非负整数 | 必填，用于结算和额度统计。 |
| `usage.output_tokens` | 非负整数 | 必填，用于结算和额度统计。 |

两个 usage 字段均为必填，且总和不超过 `2147483647`。超过 16 MiB 的响应会被拒绝。答案或 usage 无效时返回错误，不会使用估算用量生成成功结果。

本例的 `urgency.score` 为 `0 × 0.02 + 1 × 0.11 + 2 × 0.87 = 1.85`。

---

## 用量与计费

`usage.input_tokens` 和 `usage.output_tokens` 是 token 数量，服务使用它们进行最终额度结算。

余额与额度沿用现有个人、订阅和团队计费规则。可通过 [Balance API](https://docs.b.ai/llmservice/api/balance/) 查询可用余额或额度；查询余额不会预留资金，也不保证后续决策请求一定成功。

---

## 限流

个人 API Key 受充值状态限流规则约束；有效的用户级 RPM 配置优先于默认配置。团队 API Key 不受该个人限流规则约束，但仍受团队额度规则和上游容量限制影响。

HTTP `429` 的响应体可能为空或不是 JSON。请先处理 HTTP 状态，再尝试解析 JSON。遇到临时限流或过载时，使用有次数上限的指数退避重试。

---

## 错误响应

### 鉴权与请求错误

鉴权失败通常返回 HTTP `401`，格式如下：

```json
{
  "error": {
    "message": "<鉴权失败原因>",
    "type": "api_error",
    "code": ""
  }
}
```

请求校验及中继错误通常也使用 `error` 对象。`message`、`type` 和 `code` 的值随错误原因变化，还可能包含其他字段。消息中可能附带请求 ID，请勿通过完整匹配消息文本来判断错误类别。

API Credit 计费中的余额/额度不足可能返回 `400`，错误码包括 `insufficient_user_quota`、`insufficient_team_balance` 或 `team_quota_limit_reached`。请同时检查 `error.code` 和 HTTP 状态，再判断是否需要修改请求参数。

---

## 接入建议

- 在能够保护 API Key 的后端发起请求。
- 将共享上下文放在 `state` 中，将各项判断说明放在 `questions` 中。通过问题 ID 匹配答案，不依赖对象字段顺序。同一请求中的问题独立评估，一个问题不能引用另一个问题的答案。存在依赖关系时，应拆成多次请求，或在应用代码中组合结果。
- 将 `noul` 作为数值判断结果处理，将 `score` 作为可能含小数的评分处理；按业务需要选择判断阈值。
- 使用 `usage.input_tokens` 和 `usage.output_tokens` 记录 token 用量，不要假定固定价格或输出 token 费率。
- 读取 `answers` 前，先检查 HTTP 状态和响应结构；排查问题时保留请求 ID。
- 仅对临时错误执行有次数上限的重试。接口不提供上游幂等性保证，超时后重试可能重复执行上游请求。
