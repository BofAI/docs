# AI API

Chat completion. Auth: Bearer token. Non-stream: JSON with choices[].content. Stream: SSE chunks with choices[].delta.content.

- **Version:** 1.0

## Servers

| URL | Description |
|-----|-------------|
| `https://api.ainft.com` | Production |

## Authentication

### Bearer Auth

- **Type:** HTTP Bearer
- **Format:** JWT
- **Description:** Bearer \<token\>, e.g. `Bearer sk-xxx`

### API Key Auth

- **Type:** API Key
- **In:** Header
- **Name:** `x-api-key`
- **Description:** API Key authentication, e.g. `x-api-key: your-api-key`

---

## Endpoints

### Model List

#### `GET /v1/models` - List models (OpenAI compatible)

List available models. Auth: Bearer token. Response: object, success, data.

**Authentication:** Bearer Auth

**Responses:**

| Status Code | Description |
|-------------|-------------|
| 200 | object: list; success: true; data: array of { id, object, created, owned_by } |
| 400 | Bad Request - invalid parameters or malformed body |
| 401 | Unauthorized - invalid or missing authentication |
| 403 | Forbidden - access denied, insufficient quota, or banned |
| 429 | Too Many Requests - rate limit exceeded |
| 500 | Internal Server Error |

**200 Response Schema:** [V1ModelsResponse](#v1modelsresponse)

**Error Response Schema:** [ErrorResponse](#errorresponse)

---

### Messages

#### `POST /v1/messages` - Send a message (Claude compatible)

Accepts a list of messages and returns a model-generated response. Supports both single-turn and multi-turn conversations. Authenticate via x-api-key header. Responses can be streamed (SSE) or returned as a single JSON object.

**Authentication:** API Key Auth (`x-api-key`)

**Request Body:** [ChatCompletionsRequest](#chatcompletionsrequest) (required, `application/json`)

**Responses:**

| Status Code | Description |
|-------------|-------------|
| 200 | Success. Schema differs by stream mode. |
| 400 | Bad Request - invalid parameters, malformed body, or invalid request |
| 401 | Unauthorized - invalid or missing API key |
| 403 | Forbidden - access denied, insufficient quota, or model access restricted |
| 429 | Too Many Requests - rate limit exceeded |
| 500 | Internal Server Error |
| 502 | Bad Gateway - upstream service error |
| 503 | Service Unavailable - overloaded or no available channel |

**200 Response Content Types:**
- `application/json`: [ChatCompletionsResponse](#chatcompletionsresponse)
- `text/event-stream`: [ChatCompletionsResponse](#chatcompletionsresponse)

**Error Response Schema:** [ErrorResponse](#errorresponse)

---

### Chat Completions

#### `POST /v1/chat/completions` - Create a chat completion (OpenAI compatible)

Accepts a list of messages and returns a model-generated response. Supports both single-turn and multi-turn conversations. Authenticate via Bearer token. Responses can be streamed (SSE) or returned as a single JSON object.

**Authentication:** Bearer Auth

**Request Body:** [ChatCompletionsRequest](#chatcompletionsrequest) (required, `application/json`)

**Responses:**

| Status Code | Description |
|-------------|-------------|
| 200 | Success. Schema differs by stream mode. |
| 400 | Bad Request - invalid parameters, malformed body, or invalid request |
| 401 | Unauthorized - invalid or missing authentication |
| 403 | Forbidden - access denied, insufficient quota, or model access restricted |
| 429 | Too Many Requests - rate limit exceeded |
| 500 | Internal Server Error |
| 502 | Bad Gateway - upstream service error |
| 503 | Service Unavailable - overloaded or no available channel |

**200 Response Content Types:**
- `application/json`: [ChatCompletionsResponse](#chatcompletionsresponse)
- `text/event-stream`: [ChatCompletionsResponse](#chatcompletionsresponse)

**Error Response Schema:** [ErrorResponse](#errorresponse)

---

## Schemas

### ErrorResponse

| Field | Type | Description |
|-------|------|-------------|
| `error` | object | Error details |
| `error.message` | string | Error message |
| `error.type` | string | Error type (e.g. invalid_request_error) |
| `error.param` | string \| null | Related parameter |
| `error.code` | string \| null | Error code |

---

### V1ModelsResponse

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `object` | string | `"list"` | |
| `success` | boolean | `true` | |
| `data` | array | | Array of [V1ModelItem](#v1modelitem) |

---

### V1ModelItem

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `id` | string | `"gpt-4"` | |
| `object` | string | `"model"` | |
| `created` | integer | `1626777600` | |
| `owned_by` | string | `"openai"` | |

---

### ChatCompletionsRequest

**Required fields:** `model`, `messages`

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `model` | string | ID of the model to use (e.g. gpt-4). | `"gpt-4"` |
| `messages` | array | List of messages in the conversation. Array of [ChatMessage](#chatmessage). | |
| `stream` | boolean | If true, partial message deltas will be sent as server-sent events. Default false. | |
| `max_tokens` | integer | Maximum number of tokens that can be generated in the completion. | |
| `temperature` | number | Sampling temperature between 0 and 2. Higher = more random. Default 1. | |
| `top_p` | number | Nucleus sampling: consider tokens with top_p probability mass. Default 1. | |
| `stop` | string \| string[] | Up to 4 sequences where the API will stop generating. String or array of strings. | |
| `n` | integer | How many chat completion choices to generate. Default 1. | |
| `frequency_penalty` | number | -2.0 to 2.0. Penalize repeated tokens. Default 0. | |
| `presence_penalty` | number | -2.0 to 2.0. Penalize tokens that appear in the text so far. Default 0. | |
| `seed` | integer | Random seed for deterministic sampling (if supported by model). | |
| `response_format` | object | [ChatResponseFormat](#chatresponseformat). Specify output format. | |
| `tools` | array | List of tools the model may call. Array of [ChatTool](#chattool). Each has type "function" and function { name, description?, parameters? }. | |
| `tool_choice` | string \| object | `"auto"` \| `"none"` \| `"required"` \| [ToolChoiceObject](#toolchoiceobject). | |
| `user` | string | Optional end-user identifier for abuse monitoring. | |
| `web_search_options` | object | [WebSearchOptions](#websearchoptions). Optional web search configuration. | |

---

### WebSearchOptions

Optional. Enables web search for models that support it (OpenAI Chat Completions). When present, this gateway treats the request as web-search-enabled; model allowlists may apply. Field names align with OpenAI `web_search_options`.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `search_context_size` | string | Guidance for how much context window space to use for web search results. Enum: `"low"`, `"medium"`, `"high"`. | `"medium"` |
| `user_location` | object | Approximate user location to refine search results (e.g. country as ISO 3166-1 alpha-2, city, region, timezone). Structure follows OpenAI documentation. | |

---

### ChatMessage

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `role` | string | `"system"` \| `"user"` \| `"assistant"` \| `"tool"`. System sets behavior; user/assistant are conversation; tool is tool result. | `"user"` |
| `content` | string | Message content. For tool role, the result of the tool call. | `"Hello"` |
| `name` | string | Optional name for the message author (e.g. to disambiguate multiple users). | |
| `tool_call_id` | string | When role is "tool", the id of the tool call this result is for. Required for tool messages. | |
| `tool_calls` | array | When role is "assistant" and the model called tools, array of [ChatToolCallItem](#chattoolcallitem). | |

---

### ChatResponseFormat

Specify output format: `{ "type": "text" }` or `{ "type": "json_object" }` or json_schema.

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"text"` or `"json_object"`. |
| `json_schema` | any | When type is json_schema, optional schema for the output. |

---

### ChatTool

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `type` | string | Must be `"function"`. | `"function"` |
| `function` | object | [ChatToolFunction](#chattoolfunction). Function definition (name, description, parameters). | |

---

### ChatToolFunction

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Name of the function. |
| `description` | string | Optional description for the model. |
| `parameters` | any | Optional JSON schema for the function arguments. |

---

### ChatToolCallItem

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | ID of the tool call. | |
| `type` | string | `"function"`. | `"function"` |
| `function` | object | [ChatToolCallFunction](#chattoolcallfunction). Name and arguments of the call. | |

---

### ChatToolCallFunction

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Name of the function to call. |
| `arguments` | string | JSON string of the arguments. |

---

### ToolChoiceObject

Precise mode: specifies the particular function to call.

**Required fields:** `type`, `function`

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `type` | string | Must be `"function"`. Enum: `"function"`. | `"function"` |
| `function` | object | [ToolChoiceFunction](#toolchoicefunction). Function definition to call. | |

---

### ToolChoiceFunction

**Required fields:** `name`

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Name of the function to call. |

---

### ChatCompletionsResponse

Non-stream: object=chat.completion, choices[].message, usage. Stream: object=chat.completion.chunk, choices[].delta; final chunk has usage.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | | `"chatcmpl-xxx"` |
| `object` | string | `"chat.completion"` (non-stream) or `"chat.completion.chunk"` (stream). | |
| `created` | integer | | `1677652288` |
| `model` | string | | `"gpt-4"` |
| `service_tier` | string | | `"default"` |
| `system_fingerprint` | string \| null | | |
| `choices` | array | Empty in final usage chunk. Array of [ChatChoice](#chatchoice). | |
| `usage` | null \| object | [ChatUsage](#chatusage). Non-stream: always present. Stream: null until final chunk. | |
| `obfuscation` | string | | |

---

### ChatMessageContent

Non-stream choices[].message. Full assistant message with role, content, refusal, annotations.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `role` | string | | `"assistant"` |
| `content` | string | Assistant reply text. | |
| `refusal` | string \| null | Refusal reason when model declines; null otherwise. | |
| `annotations` | array | Citations, references, etc. | |

---

### ChatChoice

Non-stream: message. Stream: delta. finish_reason null until last content chunk.

| Field | Type | Description |
|-------|------|-------------|
| `index` | integer | |
| `message` | object | [ChatMessageContent](#chatmessagecontent). Non-stream only. Full assistant message. |
| `delta` | object | [ChatChoiceDelta](#chatchoicedelta). Stream only. Incremental content; empty {} on stop. |
| `finish_reason` | string \| null | Null until done; e.g. `"stop"`, `"length"`, `"tool_calls"`. |

---

### ChatChoiceDelta

| Field | Type | Description |
|-------|------|-------------|
| `content` | string | |
| `role` | string | |
| `tool_calls` | array | Array of [ChatToolCallItem](#chattoolcallitem). |

---

### ChatUsage

| Field | Type | Description |
|-------|------|-------------|
| `prompt_tokens` | integer | Number of tokens in the prompt. |
| `completion_tokens` | integer | Number of tokens in the completion. |
| `total_tokens` | integer | Total tokens (prompt + completion). |
| `prompt_tokens_details` | object | See below. |
| `prompt_tokens_details.cached_tokens` | integer | |
| `prompt_tokens_details.audio_tokens` | integer | |
| `completion_tokens_details` | object | See below. |
| `completion_tokens_details.reasoning_tokens` | integer | |
| `completion_tokens_details.audio_tokens` | integer | |
| `completion_tokens_details.accepted_prediction_tokens` | integer | |
| `completion_tokens_details.rejected_prediction_tokens` | integer | |
