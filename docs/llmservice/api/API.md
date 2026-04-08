# AI API

Chat completion. Auth: Bearer token. Non-stream: JSON with choices[].content. Stream: SSE chunks with choices[].delta.content.

- **Version:** 1.0
- **Base URL:** `https://api.bankofai.io`
- **OpenAPI:** 3.1.0

---

## Authentication

### Bearer Token

- **Type:** HTTP Bearer (JWT)
- **Header:** `Authorization: Bearer <token>`
- **Example:** `Bearer sk-xxx`

### API Key (Messages endpoint only)

- **Type:** API Key
- **Header:** `x-api-key: <your-api-key>`

---

## Endpoints

### 1. List Models

`GET /v1/models`

List available models. Auth: Bearer token.

**Auth:** Bearer Token

**Response 200:**

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

| Status | Description |
|--------|-------------|
| 200 | Success - list of models |
| 400 | Bad Request - invalid parameters or malformed body |
| 401 | Unauthorized - invalid or missing authentication |
| 403 | Forbidden - access denied, insufficient quota, or banned |
| 429 | Too Many Requests - rate limit exceeded |
| 500 | Internal Server Error |

---

### 2. Chat Completions (OpenAI Compatible)

`POST /v1/chat/completions`

Accepts a list of messages and returns a model-generated response. Supports both single-turn and multi-turn conversations. Responses can be streamed (SSE) or returned as a single JSON object.

**Auth:** Bearer Token

#### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | **Yes** | ID of the model to use (e.g. `gpt-5.2`). |
| `messages` | array | **Yes** | List of messages in the conversation. See [ChatMessage](#chatmessage). |
| `stream` | boolean | No | If true, partial message deltas will be sent as server-sent events. Default `false`. |
| `max_tokens` | integer | No | Maximum number of tokens that can be generated in the completion. |
| `temperature` | number | No | Sampling temperature between 0 and 2. Higher = more random. Default `1`. |
| `top_p` | number | No | Nucleus sampling: consider tokens with top_p probability mass. Default `1`. |
| `stop` | string \| string[] | No | Up to 4 sequences where the API will stop generating. |
| `n` | integer | No | How many chat completion choices to generate. Default `1`. |
| `frequency_penalty` | number | No | -2.0 to 2.0. Penalize repeated tokens. Default `0`. |
| `presence_penalty` | number | No | -2.0 to 2.0. Penalize tokens that appear in the text so far. Default `0`. |
| `seed` | integer | No | Random seed for deterministic sampling (if supported by model). |
| `response_format` | object | No | Specify output format: `{ "type": "text" }` or `{ "type": "json_object" }` or `json_schema`. |
| `tools` | array | No | List of tools the model may call. See [ChatTool](#chattool). |
| `tool_choice` | string \| object | No | `"auto"`, `"none"`, `"required"`, or `{ "type": "function", "function": { "name": "..." } }`. |
| `user` | string | No | Optional end-user identifier for abuse monitoring. |
| `web_search_options` | object | No | Enables web search for supported models. See [WebSearchOptions](#websearchoptions). |

#### Request Example

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

#### Response (Non-stream)

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

#### Response (Stream)

Each SSE chunk has `object: "chat.completion.chunk"` with `choices[].delta.content` containing incremental text. The final chunk includes `usage` and `finish_reason`.

| Status | Description |
|--------|-------------|
| 200 | Success |
| 400 | Bad Request - invalid parameters, malformed body, or invalid request |
| 401 | Unauthorized - invalid or missing authentication |
| 403 | Forbidden - access denied, insufficient quota, or model access restricted |
| 429 | Too Many Requests - rate limit exceeded |
| 500 | Internal Server Error |
| 502 | Bad Gateway - upstream service error |
| 503 | Service Unavailable - overloaded or no available channel |

---

### 3. Messages (Claude Compatible)

`POST /v1/messages`

Accepts a list of messages and returns a model-generated response. Supports both single-turn and multi-turn conversations. Authenticate via `x-api-key` header or Bearer token. Responses can be streamed (SSE) or returned as a single JSON object.

**Auth:** API Key (`x-api-key`) or Bearer Token

#### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | **Yes** | ID of the model (e.g. `claude-sonnet-4-6`, `claude-opus-4-6`, `claude-haiku-4-5`). |
| `max_tokens` | integer | **Yes** | Maximum number of tokens to generate. Different models have different maximum values. |
| `messages` | array | **Yes** | Input messages. Alternating user/assistant turns. Limit: 100,000 messages. See [MessagesMessageItem](#messagesmessageitem). |
| `system` | string \| array | No | System prompt. Can be a plain string or an array of text blocks (for `cache_control`). |
| `stream` | boolean | No | Whether to stream the response using SSE. Default `false`. |
| `temperature` | number | No | Randomness (0.0 - 1.0). Use ~0.0 for analytical tasks, ~1.0 for creative tasks. Default `1`. |
| `top_p` | number | No | Nucleus sampling. Default `1`. |
| `top_k` | integer | No | Only sample from the top K options. Default disabled. |
| `stop_sequences` | string[] | No | Custom text sequences that cause the model to stop generating. |
| `metadata` | object | No | Request metadata. Supports `user_id` (opaque identifier). |
| `thinking` | object | No | Extended thinking config. See [ThinkingConfig](#thinkingconfig). |
| `tools` | array | No | Tool definitions the model may use. See [Tool](#tool-anthropic). |
| `tool_choice` | object | No | How the model should use tools: `auto`, `any`, `tool`, or `none`. |

#### Request Example

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

#### Response (Non-stream)

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

#### Response (Stream - SSE Events)

Stream responses emit the following event types:

| Event Type | Description | Key Fields |
|------------|-------------|------------|
| `message_start` | Initial message metadata | `message` (id, model, role, usage) |
| `content_block_start` | New content block begins | `index`, `content_block` (type, text) |
| `content_block_delta` | Incremental content | `index`, `delta` (type: `text_delta`, text) |
| `content_block_stop` | Content block ends | `index` |
| `message_stop` | Message complete | - |

| Status | Description |
|--------|-------------|
| 200 | Success |
| 400 | Bad Request - invalid parameters, malformed body, or invalid request |
| 401 | Unauthorized - invalid or missing API key |
| 403 | Forbidden - access denied, insufficient quota, or model access restricted |
| 429 | Too Many Requests - rate limit exceeded |
| 500 | Internal Server Error |
| 502 | Bad Gateway - upstream service error |
| 503 | Service Unavailable - overloaded or no available channel |

---

## Data Models

### ChatMessage

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role` | string | **Yes** | `"system"`, `"user"`, `"assistant"`, or `"tool"` |
| `content` | string | **Yes** | Message content. For tool role, the result of the tool call. |
| `name` | string | No | Optional name for the message author. |
| `tool_call_id` | string | No | When role is `"tool"`, the ID of the tool call this result is for. |
| `tool_calls` | array | No | When role is `"assistant"` and the model called tools. Array of `{ id, type, function: { name, arguments } }`. |

### MessagesMessageItem

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role` | string | **Yes** | `"user"` or `"assistant"` (no `"system"` - use top-level `system` parameter). |
| `content` | string \| array | **Yes** | Text string or array of content blocks (text, image, tool_use, tool_result). |

### Content Block Types (Messages API)

#### TextBlockParam

```json
{ "type": "text", "text": "Hello, Claude!", "cache_control": { "type": "ephemeral" } }
```

#### ImageBlockParam

Base64 source:
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

URL source:
```json
{
  "type": "image",
  "source": {
    "type": "url",
    "url": "https://example.com/image.jpg"
  }
}
```

Supported media types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`

#### ToolUseBlockParam (from assistant)

```json
{
  "type": "tool_use",
  "id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
  "name": "get_stock_price",
  "input": { "ticker": "AAPL" }
}
```

#### ToolResultBlockParam (from user)

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
  "content": "259.75 USD",
  "is_error": false
}
```

### ThinkingConfig

Enable extended thinking to let Claude show its reasoning process.

**Enabled:**
```json
{ "type": "enabled", "budget_tokens": 1024 }
```
- `budget_tokens`: Must be >= 1024 and less than `max_tokens`.

**Disabled:**
```json
{ "type": "disabled" }
```

### Tool (Anthropic)

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

### ToolChoice (Anthropic)

| Type | Description |
|------|-------------|
| `{ "type": "auto" }` | Model decides whether to use tools. Supports `disable_parallel_tool_use`. |
| `{ "type": "any" }` | Model will use any available tool. Supports `disable_parallel_tool_use`. |
| `{ "type": "tool", "name": "..." }` | Model will use the specified tool. Supports `disable_parallel_tool_use`. |
| `{ "type": "none" }` | Model will not use tools. |

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

| Field | Type | Description |
|-------|------|-------------|
| `search_context_size` | string | `"low"`, `"medium"`, or `"high"` - how much context window for web search results. |
| `user_location` | object | Approximate user location (country ISO 3166-1 alpha-2, city, region, timezone). |

### ChatResponseFormat

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"text"` or `"json_object"` |
| `json_schema` | object | When type is `json_schema`, optional schema for the output. |

---

## Error Response

All error responses follow this format:

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

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Error message |
| `type` | string | Error type (e.g. `invalid_request_error`) |
| `param` | string \| null | Related parameter |
| `code` | string \| null | Error code |
