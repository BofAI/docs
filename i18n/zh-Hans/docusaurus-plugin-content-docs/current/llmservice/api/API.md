# B.AI API 参考

B.AI 提供统一的大语言模型 API，兼容 OpenAI Chat Completions、OpenAI Responses 和 Anthropic Messages 协议。开发者可以使用同一个 B.AI API Key 接入不同协议，并根据应用或客户端的要求选择对应端点。

- **API 版本：** `v1`
- **生产环境 Base URL：** `https://api.b.ai/v1`
- **请求格式：** `application/json`
- **字符编码：** UTF-8
- **流式传输：** Server-Sent Events（SSE）

---

## 快速开始

### 1. 设置 API Key

macOS、Linux 或 WSL：

```bash
export BAI_API_KEY="sk-..."
```

Windows PowerShell：

```powershell
$env:BAI_API_KEY = "sk-..."
```

### 2. 发起第一个 Responses 请求

```bash
curl https://api.b.ai/v1/responses \
  -H "Authorization: Bearer $BAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "input": "请用一句话介绍 B.AI。"
  }'
```

请求成功时，服务器返回 HTTP `200` 和一个 `response` 对象。

请将 `your-model-id` 替换为已为所选端点启用的模型 ID。

---

## 认证

B.AI 支持以下两种认证请求头。两者使用平台签发的同一种 API Key，选择其中一种即可。

### Bearer Token

```http
Authorization: Bearer <BAI_API_KEY>
```

示例：

```bash
-H "Authorization: Bearer $BAI_API_KEY"
```

### x-api-key

```http
x-api-key: <BAI_API_KEY>
```

示例：

```bash
-H "x-api-key: $BAI_API_KEY"
```

> 两种请求头等价。Codex、OpenAI SDK 及多数 OpenAI 兼容客户端使用 `Authorization`。

---

## 端点概览

| 方法 | 端点 | 协议 | 用途 |
|---|---|---|---|
| `GET` | `/models` | OpenAI 兼容 | 获取与当前凭证关联的模型列表 |
| `POST` | `/responses` | OpenAI Responses | Agent、推理、工具调用及 Codex 等场景 |
| `POST` | `/chat/completions` | OpenAI Chat Completions | 通用聊天补全及现有 OpenAI 兼容应用 |
| `POST` | `/messages` | Anthropic Messages | Claude SDK、Claude Code 等 Anthropic 兼容应用 |

---

## 获取模型列表

`GET /v1/models`

返回与当前 API 凭证关联的模型列表。

### 请求示例

```bash
curl https://api.b.ai/v1/models \
  -H "Authorization: Bearer $BAI_API_KEY"
```

### 响应示例

```json
{
  "object": "list",
  "success": true,
  "data": [
    {
      "id": "your-model-id",
      "object": "model",
      "created": 1626777600
    }
  ]
}
```

---

## Responses API（OpenAI 兼容）

`POST /v1/responses`

Responses API 用于提交模型输入并获取生成结果。根据所选模型和配置，请求可使用流式输出、推理、函数调用和网页搜索等能力，也可用于 Codex 等采用 Responses 协议的客户端。

- **完整地址：** `https://api.b.ai/v1/responses`
- **认证方式：** Bearer Token 或 `x-api-key`
- **非流式响应：** JSON
- **流式响应：** SSE

Responses API 与 Chat Completions 的请求结构不同：

- 使用 `input`，而不是 `messages`；
- 使用 `max_output_tokens`，而不是 `max_tokens`；
- 使用 `output` 数组返回消息、推理和工具调用等输出 item；
- 流式模式返回具名 Responses 事件，而不是 Chat Completion chunk。

### 模型与端点兼容性

Responses 端点接受已启用该协议的模型。模型与端点不兼容时，服务器返回 HTTP `400` 及对应错误信息。

### 请求体

| 参数 | 类型 | 必填 | 描述 |
|---|---|---:|---|
| `model` | string | 是 | 要使用的模型 ID。 |
| `input` | string \| array | 是 | 输入内容，可以是字符串或 Responses input item 数组。 |
| `instructions` | string | 否 | 系统级或开发者级指令。 |
| `stream` | boolean | 否 | 是否使用 SSE 流式返回，默认 `false`。 |
| `max_output_tokens` | integer | 否 | 最大输出 token 数，包含可见输出 token 和推理 token。取值范围取决于所选模型；超出范围时返回 `400`，错误信息会说明允许的范围。 |
| `reasoning` | object | 否 | 推理配置，例如 `effort` 和 `summary`；可用值取决于模型。 |
| `tools` | array | 否 | 模型可调用的工具列表，例如函数或网页搜索。 |
| `tool_choice` | string \| object | 否 | 控制模型是否以及如何选择工具。 |
| `parallel_tool_calls` | boolean | 否 | 是否允许并行工具调用。 |
| `text` | object | 否 | 文本输出配置，包括结构化输出格式；能力取决于模型。 |
| `temperature` | number | 否 | 采样温度；部分推理模型不支持。 |
| `top_p` | number | 否 | Nucleus Sampling 参数；部分推理模型不支持。 |

#### 不支持的参数

| 参数 | API 行为 |
|---|---|
| `max_tokens` | 返回 `400`；请改用 `max_output_tokens`。 |
| `max_completion_tokens` | 返回 `400`；请改用 `max_output_tokens`。 |

### 简单文本输入

```json
{
  "model": "your-model-id",
  "input": "总结量子计算的三个核心概念。"
}
```

### 带指令的输入

```json
{
  "model": "your-model-id",
  "instructions": "你是一名专业、简洁的技术写作助手。",
  "input": [
    {
      "role": "user",
      "content": "用初学者能理解的方式解释向量数据库。"
    }
  ]
}
```

输入 item 可使用 `system`、`developer`、`user` 或 `assistant` 等角色。具体内容块能力取决于所选模型。

### 非流式调用

当 `stream` 为 `false` 或未提供时，API 在模型生成结束后一次性返回完整 JSON。

#### cURL

```bash
curl https://api.b.ai/v1/responses \
  -H "Authorization: Bearer $BAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "input": "请用三句话解释什么是 Responses API。",
    "max_output_tokens": 512
  }'
```

#### 响应示例

```json
{
  "id": "resp_01HXYZ...",
  "object": "response",
  "created_at": 1787587200,
  "status": "completed",
  "model": "your-model-id",
  "output": [
    {
      "id": "msg_01HXYZ...",
      "type": "message",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Responses API 是一个统一的模型响应接口……",
          "annotations": []
        }
      ]
    }
  ],
  "usage": {
    "input_tokens": 18,
    "output_tokens": 42,
    "output_tokens_details": {
      "reasoning_tokens": 12
    },
    "total_tokens": 60
  }
}
```

`output` 可能同时包含 reasoning、message、function call 或 web search call 等多种 item。`output[0]` 不保证是助手文本。

OpenAI SDK 的 `response.output_text` 是 `output` 中 `type` 为 `message` 的 item 下所有 `output_text` 内容块的聚合结果。

### 流式调用

设置 `stream: true` 后，API 使用 SSE 在模型生成过程中持续返回事件。

```bash
curl -N https://api.b.ai/v1/responses \
  -H "Authorization: Bearer $BAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "input": "写一段关于人工智能发展的简短介绍。",
    "stream": true,
    "max_output_tokens": 512
  }'
```

常见事件：

| 事件类型 | 描述 |
|---|---|
| `response.created` | Response 已创建。 |
| `response.in_progress` | Response 正在生成。 |
| `response.output_item.added` | 新的输出 item 已加入。 |
| `response.content_part.added` | 新的内容块已加入。 |
| `response.output_text.delta` | 文本增量。 |
| `response.output_text.done` | 文本输出完成。 |
| `response.output_item.done` | 当前输出 item 完成。 |
| `response.completed` | Response 成功完成。 |
| `response.incomplete` | Response 因输出上限等原因提前结束。 |
| `response.failed` | Response 生成失败。 |

上表列出常见事件。客户端应按事件类型处理已识别事件，并忽略不需要的其他事件。

事件示例：

```text
event: response.output_text.delta
data: {"type":"response.output_text.delta","delta":"Responses"}

event: response.output_text.delta
data: {"type":"response.output_text.delta","delta":" API"}

event: response.completed
data: {"type":"response.completed","response":{"id":"resp_...","status":"completed"}}
```

> 流式请求在 SSE 连接建立前失败时，服务器返回 JSON 错误对象，`Content-Type` 为 `application/json`。

### Python SDK

安装 OpenAI Python SDK：

```bash
pip install openai
```

调用 Responses API：

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["BAI_API_KEY"],
    base_url="https://api.b.ai/v1",
)

response = client.responses.create(
    model="your-model-id",
    input="请用三句话解释什么是 Responses API。",
)

print(response.output_text)
```

### JavaScript SDK

安装 OpenAI JavaScript SDK：

```bash
npm install openai
```

调用 Responses API：

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.BAI_API_KEY,
  baseURL: "https://api.b.ai/v1",
});

const response = await client.responses.create({
  model: "your-model-id",
  input: "请用三句话解释什么是 Responses API。",
});

console.log(response.output_text);
```

### 推理配置

支持推理的模型可以通过 `reasoning` 配置推理强度和摘要：

```json
{
  "model": "your-model-id",
  "input": "分析这个系统设计中的性能瓶颈。",
  "reasoning": {
    "effort": "high",
    "summary": "auto"
  }
}
```

可用的推理档位取决于所选模型。不支持的配置可能返回 HTTP `400`。

推理 token 使用量位于：

```text
usage.output_tokens_details.reasoning_tokens
```

推理 token 计入 `max_output_tokens`。如果该值设置过低，模型可能在产生可见文本之前就耗尽预算，返回 `status` 为 `incomplete` 的响应。

### 函数调用

#### 第一步：声明函数

```json
{
  "model": "your-model-id",
  "max_output_tokens": 512,
  "input": [
    {
      "role": "user",
      "content": "深圳今天的天气怎么样？"
    }
  ],
  "tools": [
    {
      "type": "function",
      "name": "get_weather",
      "description": "查询指定城市的天气",
      "parameters": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string",
            "description": "城市名称"
          }
        },
        "required": ["city"],
        "additionalProperties": false
      },
      "strict": true
    }
  ],
  "tool_choice": "auto"
}
```

当模型决定调用函数时，`output` 中会出现 `function_call` item：

```json
{
  "type": "function_call",
  "call_id": "call_01HXYZ...",
  "name": "get_weather",
  "arguments": "{\"city\":\"深圳\"}"
}
```

#### 第二步：提交函数执行结果

新请求的 `input` 中依次放入原有对话、模型返回的 `function_call`，以及执行结果 `function_call_output`：

```json
{
  "model": "your-model-id",
  "max_output_tokens": 512,
  "tools": [
    {
      "type": "function",
      "name": "get_weather",
      "description": "查询指定城市的天气",
      "parameters": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string",
            "description": "城市名称"
          }
        },
        "required": ["city"],
        "additionalProperties": false
      },
      "strict": true
    }
  ],
  "input": [
    {
      "role": "user",
      "content": "深圳今天的天气怎么样？"
    },
    {
      "type": "function_call",
      "call_id": "call_01HXYZ...",
      "name": "get_weather",
      "arguments": "{\"city\":\"深圳\"}"
    },
    {
      "type": "function_call_output",
      "call_id": "call_01HXYZ...",
      "output": "深圳：晴，28°C"
    }
  ]
}
```

`call_id` 必须与模型返回的值一致。工具定义需要在后续请求中一并带上。

### 网页搜索

支持网页搜索的模型可以使用 `web_search` 工具：

```json
{
  "model": "your-model-id",
  "input": "总结今天值得关注的三条人工智能新闻。",
  "tools": [
    {
      "type": "web_search"
    }
  ]
}
```

网页搜索能力和费用取决于所选模型及请求配置。

### 多轮对话

以下示例按无状态请求方式组织多轮对话。后续请求可在 `input` 中携带生成下一次响应所需的上下文：

```json
{
  "model": "your-model-id",
  "input": [
    {
      "role": "user",
      "content": "什么是向量数据库？"
    },
    {
      "role": "assistant",
      "content": "向量数据库是专门用于存储和检索向量表示的数据库。"
    },
    {
      "role": "user",
      "content": "它最常见的三个应用是什么？"
    }
  ]
}
```

后续请求只需携带生成下一次响应所需的上下文。

---

## Chat Completions API（OpenAI 兼容）

`POST /v1/chat/completions`

接收消息列表并返回模型生成的回复，适合已经使用 OpenAI Chat Completions 协议的应用。

### 主要请求参数

| 参数 | 类型 | 必填 | 描述 |
|---|---|---:|---|
| `model` | string | 是 | 模型 ID。 |
| `messages` | array | 是 | 对话消息列表。 |
| `stream` | boolean | 否 | 是否使用 SSE 流式返回，默认 `false`。 |
| `max_tokens` | integer | 否 | 最大输出 token 数。部分模型也支持 `max_completion_tokens`。 |
| `temperature` | number | 否 | 采样温度，支持范围取决于模型。 |
| `top_p` | number | 否 | Nucleus Sampling 参数。 |
| `stop` | string \| string[] | 否 | 停止序列。 |
| `response_format` | object | 否 | 文本、JSON Object 或 JSON Schema 输出配置。 |
| `tools` | array | 否 | 函数工具定义。 |
| `tool_choice` | string \| object | 否 | 工具选择方式。 |
| `web_search_options` | object | 否 | 为支持的模型配置网页搜索。 |
| `user` | string | 否 | 终端用户标识。 |

### 请求示例

```bash
curl https://api.b.ai/v1/chat/completions \
  -H "Authorization: Bearer $BAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello"}
    ],
    "stream": false,
    "max_tokens": 512
  }'
```

### 非流式响应示例

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1787587200,
  "model": "your-model-id",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 8,
    "total_tokens": 20
  }
}
```

### 流式响应

设置 `stream: true` 时，服务器返回 `text/event-stream`。每个分块的 `object` 为 `chat.completion.chunk`，增量文本位于：

```text
choices[].delta.content
```

---

## Messages API（Anthropic 兼容）

`POST /v1/messages`

Messages API 兼容 Anthropic 消息格式，适合 Anthropic SDK、Claude Code 及其他使用 Messages 协议的客户端。

### 主要请求参数

| 参数 | 类型 | 必填 | 描述 |
|---|---|---:|---|
| `model` | string | 是 | 模型 ID。 |
| `max_tokens` | integer | 是 | 最大输出 token 数。 |
| `messages` | array | 是 | 用户与助手消息列表。 |
| `system` | string \| array | 否 | 系统提示词。 |
| `stream` | boolean | 否 | 是否使用 SSE 流式返回，默认 `false`。 |
| `temperature` | number | 否 | 采样温度，通常为 `0.0` 至 `1.0`。 |
| `top_p` | number | 否 | Nucleus Sampling 参数。 |
| `top_k` | integer | 否 | 仅从概率最高的前 K 个候选项采样。 |
| `stop_sequences` | string[] | 否 | 自定义停止序列。 |
| `thinking` | object | 否 | 扩展思考配置。 |
| `tools` | array | 否 | Anthropic 格式的工具定义。 |
| `tool_choice` | object | 否 | 工具选择方式。 |

### 请求示例

```bash
curl https://api.b.ai/v1/messages \
  -H "x-api-key: $BAI_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "max_tokens": 512,
    "messages": [
      {"role": "user", "content": "Hello, Claude!"}
    ]
  }'
```

### 非流式响应示例

```json
{
  "id": "msg_xxx",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I help you?"
    }
  ],
  "stop_reason": "end_turn",
  "model": "your-model-id",
  "usage": {
    "input_tokens": 4,
    "output_tokens": 12
  }
}
```

### 流式事件

设置 `stream: true` 时，常见事件包括：

| 事件类型 | 描述 |
|---|---|
| `message_start` | 返回初始消息元数据。 |
| `content_block_start` | 开始新的内容块。 |
| `content_block_delta` | 返回文本或思考内容增量。 |
| `content_block_stop` | 当前内容块结束。 |
| `message_delta` | 返回停止原因及使用量增量。 |
| `message_stop` | 消息完成。 |

---

## Codex CLI 接入

B.AI Responses API 可以作为 Codex 的自定义模型提供商使用。以下配置适用于支持自定义模型提供商的 Codex 版本。

### 1. 设置 API Key

```bash
export BAI_API_KEY="sk-..."
```

### 2. 编辑 Codex 配置

编辑用户级配置文件：

```text
~/.codex/config.toml
```

写入以下配置：

```toml
model = "your-model-id"
model_provider = "bai"

[model_providers.bai]
name = "B.AI"
base_url = "https://api.b.ai/v1"
env_key = "BAI_API_KEY"
wire_api = "responses"
requires_openai_auth = false
```

如果该文件已有内容，把 `[model_providers.bai]` 整块追加进去，并将顶层的 `model` 与 `model_provider` 改成上面的取值。各配置项的完整说明见文末的 Codex 文档。

保存后，在已经设置 `BAI_API_KEY` 的终端中启动 Codex：

```bash
codex
```

要更换模型，修改配置中的顶层 `model`：

```toml
model = "your-model-id"
```

### Codex 常见问题

| 问题 | 检查方法 |
|---|---|
| 提示环境变量不存在 | 确认 `env_key` 与环境变量名称完全一致，并从设置该变量的终端启动 Codex。 |
| 请求发往 OpenAI 而不是 B.AI | 确认顶层 `model_provider = "bai"`，并存在 `[model_providers.bai]` 配置块。 |
| 返回 `401` | 检查 API Key 是否有效，以及是否误用了其他环境的 Key。 |
| 返回 `403` | 检查账户状态与模型权限。 |
| 返回模型不支持 | 确认模型 ID 拼写正确，并已为所配置的端点启用。 |

---

## 如何选择接口

| 项目 | Chat Completions | Responses | Messages |
|---|---|---|---|
| 端点 | `/v1/chat/completions` | `/v1/responses` | `/v1/messages` |
| 兼容协议 | OpenAI Chat Completions | OpenAI Responses | Anthropic Messages |
| 主要输入字段 | `messages` | `input` | `messages` |
| 输出上限字段 | `max_tokens` / `max_completion_tokens` | `max_output_tokens` | `max_tokens` |
| 文本输出位置 | `choices[].message.content` | `output[].content[].text` | `content[].text` |
| 输入 token | `usage.prompt_tokens` | `usage.input_tokens` | `usage.input_tokens` |
| 输出 token | `usage.completion_tokens` | `usage.output_tokens` | `usage.output_tokens` |
| 推理 token | `completion_tokens_details.reasoning_tokens` | `output_tokens_details.reasoning_tokens` | 取决于模型和响应内容块 |
| 流式格式 | SSE chunks | SSE events | SSE events |
| 推荐场景 | 现有 OpenAI 兼容应用 | 新项目、Agent、Codex、工具调用 | Anthropic SDK、Claude Code |

请选择与客户端协议及请求结构匹配的端点。

---

## 错误响应

非流式请求以及建立 SSE 连接前发生的错误，统一返回 JSON：

```json
{
  "error": {
    "message": "model \"example-model\" is not supported on /v1/responses",
    "type": "invalid_request_error",
    "param": "",
    "code": "model_not_supported_on_endpoint"
  }
}
```

| 字段 | 类型 | 描述 |
|---|---|---|
| `message` | string | 面向开发者的错误说明，部分错误会附带 request ID。 |
| `type` | string | 错误类型，取值不止一种。 |
| `param` | string | 导致错误的请求参数，可能为空。 |
| `code` | string | 机器可读错误代码。 |

错误响应包含 HTTP 状态码及 `error` 对象。应用可以结合 `code` 和 `message` 进行错误处理与排查。

### HTTP 状态码

| 状态码 | 描述 | 处理方式 |
|---:|---|---|
| `200` | 请求成功 | 按对应端点格式解析响应。 |
| `400` | 请求因格式、参数或端点兼容性而无法处理 | 读取错误对象的 `code` 与 `message`。 |
| `401` | API Key 缺失、无效或已过期 | 检查认证请求头和所使用的环境。 |
| `403` | 模型权限、订阅或账户状态限制 | 检查账户状态与模型权限。 |
| `404` | 请求的资源或模型不存在 | 检查请求路径和模型 ID。 |
| `413` | 请求体超过平台限制 | 缩短输入或减少请求内容。 |
| `429` | 触发速率限制 | 使用指数退避重试并降低并发。 |
| `500` | 服务器内部错误 | 记录 request ID，稍后重试。 |
| `502` | 上游服务错误 | 使用指数退避重试。 |
| `503` | 服务暂时不可用 | 稍后重试或选择其他模型。 |

### Responses 常见错误

| 场景 | 状态码 | 处理方式 |
|---|---:|---|
| 模型与端点不兼容 | `400` | 选择已为该端点启用的模型，或改用其他端点。 |
| 使用 `max_tokens` 或 `max_completion_tokens` | `400` | 改用 `max_output_tokens`。 |
| `max_output_tokens` 超出模型允许范围 | `400` | 按错误信息给出的范围调整取值。 |
| 请求使用了不可用的工具 | `400` | 移除该工具，或选择兼容的模型配置。 |
| Key 无效或环境不匹配 | `401` | 使用生产环境签发的 Key 请求生产域名。 |
| 流式请求在建流前失败 | `4xx` / `5xx` | 按 JSON 错误对象解析，不要按 SSE 解析。 |

### 重试建议

- `400`、`401`、`403`、`404` 需要修改请求或账户状态，不建议自动重试；
- `429`、`500`、`502`、`503` 可以使用带随机抖动的指数退避重试；
- 响应中的 request ID 可用于技术支持排查。

---

## 安全建议

API Key 等同于账户凭证，可以直接发起计费请求。

- Key 应保存在服务端或受保护的本地环境中，通过环境变量或密钥管理服务注入，不要写入浏览器前端、移动端安装包或公开代码仓库；
- 开发、测试与生产环境使用不同的 Key；
- 泄露的 Key 应立即撤销，日志与支持工单中只保留掩码形式，例如 `sk-****abcd`。

---

## 相关资源

- B.AI 文档：<https://docs.b.ai/zh-Hans/llmservice/api/>
- B.AI 官网：<https://b.ai/>
- OpenAI API 文档：<https://developers.openai.com/>
- Codex 文档：<https://developers.openai.com/codex/>
