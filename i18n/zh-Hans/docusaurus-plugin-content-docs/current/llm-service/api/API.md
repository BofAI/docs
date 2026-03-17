# BANK OF AI LLM API（OpenAI 兼容）

用于 `/v1/models` 和 `/v1/chat/completions` 的 OpenAI 格式 API 规范。

## 版本
1.0

**协议：** https  
**Host：** api.bankofai.io  

---

# /v1/chat/completions

## POST

### 概述
创建聊天补全（OpenAI 兼容）

### 描述
聊天补全接口。  
认证方式：Bearer Token。

- 非流式返回：JSON 格式，内容在 `choices[].content`
- 流式返回：SSE 事件流，内容在 `choices[].delta.content`

---

## 参数

| 参数 | 位置 | 说明 | 必填 | 类型 |
|-----|-----|-----|-----|-----|
| Authorization | header | Bearer `<token>`，例如 `Bearer sk-xxx` | 是 | string |
| body | body | 请求体（必填：model、messages；可选：stream、max_tokens、temperature、top_p、stop、n） | 是 | main.ChatCompletionsRequest |

---

## 返回

| 状态码 | 说明 | 类型 |
|------|------|------|
| 200 | 非流式：`choices[].content`；流式（SSE）：每个块为 ChatCompletionsStreamChunk | main.ChatCompletionsResponse |
| 401 | 认证失败 | object |

---

# /v1/models

## GET

### 概述
获取模型列表（OpenAI 兼容）

### 描述
返回可用模型列表。  
认证方式：Bearer Token。  

返回结构：

- object
- success
- data

---

## 参数

| 参数 | 位置 | 说明 | 必填 | 类型 |
|-----|-----|-----|-----|-----|
| Authorization | header | Bearer `<token>`，例如 `Bearer sk-xxx` | 是 | string |

---

## 返回

| 状态码 | 说明 | 类型 |
|------|------|------|
| 200 | 返回模型列表：`{ object, success, data[] }` | main.V1ModelsResponse |
| 401 | 认证失败 | object |

---

# 数据模型

## main.ChatChoice

| 字段 | 类型 | 说明 | 必填 |
|----|----|----|----|
| content | string | 返回内容 | 否 |
| finish_reason | string | 结束原因，例如 `"stop"` | 否 |
| index | integer | 结果序号 | 否 |

---

## main.ChatCompletionsRequest

| 字段 | 类型 | 说明 | 必填 |
|----|----|----|----|
| frequency_penalty | number | 频率惩罚：-2.0 ~ 2.0，降低重复 token，默认 0 | 否 |
| max_tokens | integer | 最大生成 token 数 | 否 |
| messages | array | 对话消息列表 | 是 |
| model | string | 使用的模型 ID，例如 `"gpt-4"` | 是 |
| n | integer | 生成结果数量，默认 1 | 否 |
| presence_penalty | number | 出现惩罚：-2.0 ~ 2.0，降低重复主题 | 否 |
| response_format | object | 输出格式：`text`、`json_object` 或 `json_schema` | 否 |
| seed | integer | 随机种子（支持时可用于复现结果） | 否 |
| stop | string / array | 停止生成的字符串（最多 4 个） | 否 |
| stream | boolean | 是否使用流式返回（SSE） | 否 |
| temperature | number | 采样温度 0~2，越高越随机 | 否 |
| tool_choice | string / object | 工具调用控制（none / auto / function） | 否 |
| tools | array | 可调用工具列表 | 否 |
| top_p | number | 核采样参数（默认 1） | 否 |
| user | string | 可选用户标识（用于监控滥用） | 否 |

---

## main.ChatCompletionsResponse

| 字段 | 类型 | 说明 | 必填 |
|----|----|----|----|
| choices | array | 生成结果 | 否 |
| created | integer | 创建时间戳，例如 `1677652288` | 否 |
| id | string | 响应 ID，例如 `"chatcmpl-xxx"` | 否 |
| model | string | 使用的模型 | 否 |
| object | string | 对象类型，例如 `"chat.completion"` | 否 |
| usage | object | Token 使用统计 | 否 |

---

## main.ChatMessage

| 字段 | 类型 | 说明 | 必填 |
|----|----|----|----|
| content | string | 消息内容，例如 `"Hello"` | 否 |
| name | string | 消息作者名称（可选） | 否 |
| role | string | 角色：`system` / `user` / `assistant` / `tool` | 否 |
| tool_call_id | string | 工具调用 ID（role=tool 时使用） | 否 |
| tool_calls | array | assistant 调用工具时返回的调用信息 | 否 |

---

## main.ChatResponseFormat

| 字段 | 类型 | 说明 | 必填 |
|----|----|----|----|
| json_schema | object | JSON Schema（type 为 json_schema 时） | 否 |
| type | string | 输出类型：`text` 或 `json_object` | 否 |

---

## main.ChatTool

| 字段 | 类型 | 说明 | 必填 |
|----|----|----|----|
| function | object | 函数定义（name、description、parameters） | 否 |
| type | string | 必须为 `"function"` | 否 |

---

## main.ChatToolCallFunction

| 字段 | 类型 | 说明 | 必填 |
|----|----|----|----|
| arguments | string | JSON 字符串形式的参数 | 否 |
| name | string | 函数名称 | 否 |

---

## main.ChatToolCallItem

| 字段 | 类型 | 说明 | 必填 |
|----|----|----|----|
| function | object | 调用函数信息 | 否 |
| id | string | 工具调用 ID | 否 |
| type | string | `"function"` | 否 |

---

## main.ChatToolFunction

| 字段 | 类型 | 说明 | 必填 |
|----|----|----|----|
| description | string | 函数说明 | 否 |
| name | string | 函数名称 | 否 |
| parameters | object | 参数 JSON Schema | 否 |

---

## main.ChatUsage

| 字段 | 类型 | 说明 | 必填 |
|----|----|----|----|
| completion_tokens | integer | 输出 token 数 | 否 |
| prompt_tokens | integer | 输入 token 数 | 否 |
| total_tokens | integer | 总 token 数 | 否 |

---

## main.V1ModelItem

| 字段 | 类型 | 说明 | 必填 |
|----|----|----|----|
| created | integer | 创建时间，例如 `1626777600` | 否 |
| id | string | 模型 ID，例如 `"gpt-4"` | 否 |
| object | string | `"model"` | 否 |
| owned_by | string | 所属组织，例如 `"openai"` | 否 |

---

## main.V1ModelsResponse

| 字段 | 类型 | 说明 | 必填 |
|----|----|----|----|
| data | array | 模型列表 | 否 |
| object | string | `"list"` | 否 |
| success | boolean | 是否成功，例如 `true` | 否 |
