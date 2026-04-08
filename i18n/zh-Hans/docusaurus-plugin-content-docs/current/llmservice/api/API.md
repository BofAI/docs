# AI API

聊天补全。认证方式：Bearer Token。非流式响应为 JSON（`choices[].content`）；流式响应为 SSE 分块（`choices[].delta.content`）。

- **版本：** 1.0
- **Base URL：** `https://api.bankofai.io`
- **OpenAPI：** 3.1.0

---

## 认证

### Bearer Token

- **类型：** HTTP Bearer（JWT）
- **请求头：** `Authorization: Bearer <token>`
- **示例：** `Bearer sk-xxx`

### API Key（仅 Messages 端点支持）

- **类型：** API Key
- **请求头：** `x-api-key: <your-api-key>`

---

## 端点

### 1. 获取模型列表

`GET /v1/models`

获取可用模型列表。认证方式：Bearer Token。

**认证：** Bearer Token

**200 响应：**

```json
{
  "object": "list",
  "success": true,
  "data": [
    {
      "id": "gpt-5.2",
      "object": "model",
      "created": 1626777600,
      "owned_by": "openai",
      "supported_endpoint_types": ["openai", "anthropic"]
    }
  ]
}
```

| 状态码 | 描述 |
|--------|------|
| 200 | 成功 - 返回模型列表 |
| 400 | 错误请求 - 参数无效或请求体格式错误 |
| 401 | 未授权 - 认证无效或缺失 |
| 403 | 禁止访问 - 无权限、额度不足或账号被封禁 |
| 429 | 请求过多 - 超出速率限制 |
| 500 | 服务器内部错误 |

---

### 2. 聊天补全（OpenAI 兼容）

`POST /v1/chat/completions`

接收一组消息并返回模型生成的回复。支持单轮和多轮对话。响应既可以是单个 JSON 对象，也可以通过流式（SSE）返回。

**认证：** Bearer Token

#### 请求体

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `model` | string | **是** | 要使用的模型 ID（例如 `gpt-5.2`）。 |
| `messages` | array | **是** | 对话中的消息列表。参见 [ChatMessage](#chatmessage)。 |
| `stream` | boolean | 否 | 若为 true，将通过 Server-Sent Events 返回部分消息增量。默认值为 `false`。 |
| `max_tokens` | integer | 否 | 本次补全最多可生成的 token 数。 |
| `temperature` | number | 否 | 采样温度，范围 0 到 2。值越高，结果越随机。默认 `1`。 |
| `top_p` | number | 否 | Nucleus Sampling，仅考虑累计概率达到 top_p 的 token。默认 `1`。 |
| `stop` | string \| string[] | 否 | 最多 4 个停止序列，命中后 API 将停止生成。 |
| `n` | integer | 否 | 生成多少个补全选项。默认 `1`。 |
| `frequency_penalty` | number | 否 | 范围 -2.0 到 2.0。用于惩罚重复 token。默认 `0`。 |
| `presence_penalty` | number | 否 | 范围 -2.0 到 2.0。用于惩罚已在文本中出现过的 token。默认 `0`。 |
| `seed` | integer | 否 | 随机种子，用于确定性采样（如果模型支持）。 |
| `response_format` | object | 否 | 指定输出格式：`{ "type": "text" }`、`{ "type": "json_object" }` 或 `json_schema`。 |
| `tools` | array | 否 | 模型可调用的工具列表。参见 [ChatTool](#chattool)。 |
| `tool_choice` | string \| object | 否 | 可选值：`"auto"`、`"none"`、`"required"`，或 `{ "type": "function", "function": { "name": "..." } }`。 |
| `user` | string | 否 | 可选的终端用户标识，用于滥用监控。 |
| `web_search_options` | object | 否 | 为支持的模型开启网页搜索。参见 [WebSearchOptions](#websearchoptions)。 |

#### 请求示例

```json
{
  "model": "gpt-5.2",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Hello" }
  ],
  "stream": false,
  "max_tokens": 1024,
  "temperature": 1
}
```

#### 响应（非流式）

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-5.2",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you?",
        "refusal": null,
        "annotations": []
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 8,
    "total_tokens": 20,
    "prompt_tokens_details": { "cached_tokens": 0, "audio_tokens": 0 },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  }
}
```

#### 响应（流式）

每个 SSE 分块的 `object` 都是 `"chat.completion.chunk"`，其中 `choices[].delta.content` 包含增量文本。最后一个分块会包含 `usage` 和 `finish_reason`。

| 状态码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 错误请求 - 参数无效、请求体格式错误或请求非法 |
| 401 | 未授权 - 认证无效或缺失 |
| 403 | 禁止访问 - 无权限、额度不足或模型访问受限 |
| 429 | 请求过多 - 超出速率限制 |
| 500 | 服务器内部错误 |
| 502 | 网关错误 - 上游服务错误 |
| 503 | 服务不可用 - 服务过载或无可用通道 |

---

### 3. Messages（Claude 兼容）

`POST /v1/messages`

接收一组消息并返回模型生成的回复。支持单轮和多轮对话。可通过 `x-api-key` 请求头或 Bearer Token 进行认证。响应既可以是单个 JSON 对象，也可以通过流式（SSE）返回。

**认证：** API Key（`x-api-key`）或 Bearer Token

#### 请求体

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `model` | string | **是** | 模型 ID（例如 `claude-sonnet-4-6`、`claude-opus-4-6`、`claude-haiku-4-5`）。 |
| `max_tokens` | integer | **是** | 最多生成的 token 数。不同模型的最大值不同。 |
| `messages` | array | **是** | 输入消息。用户与助手轮流出现。上限：100,000 条消息。参见 [MessagesMessageItem](#messagesmessageitem)。 |
| `system` | string \| array | 否 | 系统提示词。可以是纯字符串，也可以是文本块数组（用于 `cache_control`）。 |
| `stream` | boolean | 否 | 是否使用 SSE 流式返回。默认 `false`。 |
| `temperature` | number | 否 | 随机性（0.0 - 1.0）。分析型任务建议接近 0.0，创意型任务建议接近 1.0。默认 `1`。 |
| `top_p` | number | 否 | Nucleus Sampling。默认 `1`。 |
| `top_k` | integer | 否 | 仅从概率最高的前 K 个选项中采样。默认关闭。 |
| `stop_sequences` | string[] | 否 | 自定义停止文本序列，命中后停止生成。 |
| `metadata` | object | 否 | 请求元数据。支持 `user_id`（不透明标识符）。 |
| `thinking` | object | 否 | 扩展思考配置。参见 [ThinkingConfig](#thinkingconfig)。 |
| `tools` | array | 否 | 模型可调用的工具定义。参见 [Tool](#tool-anthropic)。 |
| `tool_choice` | object | 否 | 模型如何使用工具：`auto`、`any`、`tool` 或 `none`。 |

#### 请求示例

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 1024,
  "messages": [
    { "role": "user", "content": "Hello, Claude!" }
  ],
  "system": "You are a helpful assistant.",
  "temperature": 1.0
}
```

#### 响应（非流式）

```json
{
  "id": "chatcmpl-xxx",
  "type": "message",
  "role": "assistant",
  "content": [
    { "type": "text", "text": "Hello! How can I help you?" }
  ],
  "stop_reason": "end_turn",
  "model": "gpt-5",
  "usage": {
    "input_tokens": 4,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 12,
    "claude_cache_creation_5_m_tokens": 0,
    "claude_cache_creation_1_h_tokens": 0
  }
}
```

#### 响应（流式 - SSE 事件）

流式响应会发出以下事件类型：

| 事件类型 | 描述 | 关键字段 |
|----------|------|----------|
| `message_start` | 初始消息元数据 | `message`（id、model、role、usage） |
| `content_block_start` | 开始新的内容块 | `index`、`content_block`（type、text） |
| `content_block_delta` | 增量内容 | `index`、`delta`（type: `text_delta`、text） |
| `content_block_stop` | 内容块结束 | `index` |
| `message_stop` | 消息完成 | - |

| 状态码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 错误请求 - 参数无效、请求体格式错误或请求非法 |
| 401 | 未授权 - API Key 无效或缺失 |
| 403 | 禁止访问 - 无权限、额度不足或模型访问受限 |
| 429 | 请求过多 - 超出速率限制 |
| 500 | 服务器内部错误 |
| 502 | 网关错误 - 上游服务错误 |
| 503 | 服务不可用 - 服务过载或无可用通道 |

---

## 数据模型

### ChatMessage

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `role` | string | **是** | `"system"`、`"user"`、`"assistant"` 或 `"tool"` |
| `content` | string | **是** | 消息内容。对于 `tool` 角色，这里是工具调用结果。 |
| `name` | string | 否 | 消息作者的可选名称。 |
| `tool_call_id` | string | 否 | 当 `role` 为 `"tool"` 时，对应的工具调用 ID。 |
| `tool_calls` | array | 否 | 当 `role` 为 `"assistant"` 且模型调用了工具时使用。格式为 `{ id, type, function: { name, arguments } }` 的数组。 |

### MessagesMessageItem

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `role` | string | **是** | `"user"` 或 `"assistant"`（不支持 `"system"`，请使用顶层 `system` 参数）。 |
| `content` | string \| array | **是** | 文本字符串，或内容块数组（text、image、tool_use、tool_result）。 |

### 内容块类型（Messages API）

#### TextBlockParam

```json
{ "type": "text", "text": "Hello, Claude!", "cache_control": { "type": "ephemeral" } }
```

#### ImageBlockParam

Base64 来源：

```json
{
  "type": "image",
  "source": {
    "type": "base64",
    "media_type": "image/jpeg",
    "data": "/9j/4AAQSkZJRg..."
  }
}
```

URL 来源：

```json
{
  "type": "image",
  "source": {
    "type": "url",
    "url": "https://example.com/image.jpg"
  }
}
```

支持的媒体类型：`image/jpeg`、`image/png`、`image/gif`、`image/webp`

#### ToolUseBlockParam（来自 assistant）

```json
{
  "type": "tool_use",
  "id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
  "name": "get_stock_price",
  "input": { "ticker": "AAPL" }
}
```

#### ToolResultBlockParam（来自 user）

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
  "content": "259.75 USD",
  "is_error": false
}
```

### ThinkingConfig

启用扩展思考，让 Claude 展示其推理过程。

**启用：**

```json
{ "type": "enabled", "budget_tokens": 1024 }
```

- `budget_tokens`：必须大于等于 1024，并且小于 `max_tokens`。

**禁用：**

```json
{ "type": "disabled" }
```

### Tool（Anthropic）

```json
{
  "name": "get_stock_price",
  "description": "Get the current stock price for a given ticker symbol.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": { "type": "string" }
    },
    "required": ["ticker"]
  }
}
```

### ToolChoice（Anthropic）

| 类型 | 描述 |
|------|------|
| `{ "type": "auto" }` | 模型自行决定是否使用工具。支持 `disable_parallel_tool_use`。 |
| `{ "type": "any" }` | 模型将使用任意可用工具。支持 `disable_parallel_tool_use`。 |
| `{ "type": "tool", "name": "..." }` | 模型将使用指定工具。支持 `disable_parallel_tool_use`。 |
| `{ "type": "none" }` | 模型不会使用工具。 |

### ChatTool

```json
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "Get weather for a location",
    "parameters": {
      "type": "object",
      "properties": {
        "location": { "type": "string" }
      },
      "required": ["location"]
    }
  }
}
```

### WebSearchOptions

| 字段 | 类型 | 描述 |
|------|------|------|
| `search_context_size` | string | `"low"`、`"medium"` 或 `"high"`，表示网页搜索结果占用的上下文大小。 |
| `user_location` | object | 用户的大致位置（国家 ISO 3166-1 alpha-2、城市、地区、时区）。 |

### ChatResponseFormat

| 字段 | 类型 | 描述 |
|------|------|------|
| `type` | string | `"text"` 或 `"json_object"` |
| `json_schema` | object | 当 `type` 为 `json_schema` 时，指定可选的输出结构 schema。 |

---

## 错误响应

所有错误响应都遵循以下格式：

```json
{
  "error": {
    "message": "Error message",
    "type": "invalid_request_error",
    "param": null,
    "code": null
  }
}
```

| 字段 | 类型 | 描述 |
|------|------|------|
| `message` | string | 错误信息 |
| `type` | string | 错误类型（例如 `invalid_request_error`） |
| `param` | string \| null | 相关参数 |
| `code` | string \| null | 错误代码 |
