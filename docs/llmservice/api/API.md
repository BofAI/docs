# B.AI API Reference

B.AI provides a unified large language model API compatible with the OpenAI Chat Completions, OpenAI Responses, and Anthropic Messages protocols. Use the same B.AI API Key with different protocols and choose the endpoint that matches your application or client.

- **API version:** `v1`
- **Production Base URL:** `https://api.b.ai/v1`
- **Request format:** `application/json`
- **Character encoding:** UTF-8
- **Streaming:** Server-Sent Events (SSE)

---

## Quick Start

### 1. Set the API Key

macOS, Linux, or WSL:

```bash
export BAI_API_KEY="sk-..."
```

Windows PowerShell:

```powershell
$env:BAI_API_KEY = "sk-..."
```

### 2. Send Your First Responses Request

```bash
curl https://api.b.ai/v1/responses \
  -H "Authorization: Bearer $BAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "input": "Introduce B.AI in one sentence."
  }'
```

On success, the server returns HTTP `200` and a `response` object.

Replace `your-model-id` with a model ID enabled for the selected endpoint.

---

## Authentication

B.AI supports the following authentication headers. Both use the same platform-issued API Key; choose either one.

### Bearer Token

```http
Authorization: Bearer <BAI_API_KEY>
```

Example:

```bash
-H "Authorization: Bearer $BAI_API_KEY"
```

### x-api-key

```http
x-api-key: <BAI_API_KEY>
```

Example:

```bash
-H "x-api-key: $BAI_API_KEY"
```

> The two headers are equivalent. Codex, the OpenAI SDK, and most OpenAI-compatible clients use `Authorization`.

---

## Endpoint Overview

| Method | Endpoint | Protocol | Use case |
|---|---|---|---|
| `GET` | `/models` | OpenAI-compatible | List models associated with the current credential |
| `POST` | `/responses` | OpenAI Responses | Agents, reasoning, tool use, and Codex |
| `POST` | `/chat/completions` | OpenAI Chat Completions | General chat completions and existing OpenAI-compatible applications |
| `POST` | `/messages` | Anthropic Messages | Claude SDK, Claude Code, and other Anthropic-compatible clients |

---

## List Models

`GET /v1/models`

Returns the model list associated with the current API credential.

### Request Example

```bash
curl https://api.b.ai/v1/models \
  -H "Authorization: Bearer $BAI_API_KEY"
```

### Response Example

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

## Responses API (OpenAI-Compatible)

`POST /v1/responses`

The Responses API accepts model input and returns generated output. Depending on the selected model and configuration, requests can use streaming, reasoning, function calling, and web search. The endpoint can also be used by clients such as Codex that use the Responses protocol.

- **Full URL:** `https://api.b.ai/v1/responses`
- **Authentication:** Bearer Token or `x-api-key`
- **Non-streaming response:** JSON
- **Streaming response:** SSE

The request structure of the Responses API differs from Chat Completions:

- Use `input` instead of `messages`.
- Use `max_output_tokens` instead of `max_tokens`.
- Use the `output` array for messages, reasoning, tool calls, and other output items.
- Streaming mode returns named Responses events instead of Chat Completion chunks.

### Model and Endpoint Compatibility

The Responses endpoint supports GPT and DeepSeek model families available through B.AI. Use `GET /v1/models` to retrieve the model IDs available to the current API credential. Supported parameters and tools vary by model; if the model and endpoint are incompatible, the server returns HTTP `400` with error details.

DeepSeek models do not support web search. When calling a DeepSeek model through the Responses API, do not include a web search tool in the request. When using a DeepSeek model in Codex, set the top-level Codex option `web_search = "disabled"`.

### Request Body

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `model` | string | Yes | The model ID to use. |
| `input` | string \| array | Yes | Input content as a string or an array of Responses input items. |
| `instructions` | string | No | System-level or developer-level instructions. |
| `stream` | boolean | No | Whether to return an SSE stream. Default `false`. |
| `max_output_tokens` | integer | No | Maximum output tokens, including visible output and reasoning tokens. The allowed range depends on the selected model; values outside the range return `400` with the allowed range in the error. |
| `reasoning` | object | No | Reasoning configuration, such as `effort` and `summary`; available values depend on the model. |
| `tools` | array | No | Tools the model can call, such as functions or web search. |
| `tool_choice` | string \| object | No | Controls whether and how the model selects a tool. |
| `parallel_tool_calls` | boolean | No | Whether parallel tool calls are allowed. |
| `text` | object | No | Text output configuration, including structured output format; availability depends on the model. |
| `temperature` | number | No | Sampling temperature; some reasoning models do not support it. |
| `top_p` | number | No | Nucleus sampling parameter; some reasoning models do not support it. |

#### Unsupported Parameters

| Parameter | API behavior |
|---|---|
| `max_tokens` | Returns `400`; use `max_output_tokens` instead. |
| `max_completion_tokens` | Returns `400`; use `max_output_tokens` instead. |

### Simple Text Input

```json
{
  "model": "your-model-id",
  "input": "Summarize the three core concepts of quantum computing."
}
```

### Input with Instructions

```json
{
  "model": "your-model-id",
  "instructions": "You are a professional and concise technical writing assistant.",
  "input": [
    {
      "role": "user",
      "content": "Explain vector databases in a way a beginner can understand."
    }
  ]
}
```

Input items can use roles such as `system`, `developer`, `user`, and `assistant`. The supported content block types depend on the selected model.

### Non-Streaming Request

When `stream` is `false` or omitted, the API returns the complete JSON response after the model finishes generating.

#### cURL

```bash
curl https://api.b.ai/v1/responses \
  -H "Authorization: Bearer $BAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "input": "Explain the Responses API in three sentences.",
    "max_output_tokens": 512
  }'
```

#### Response Example

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
          "text": "The Responses API is a unified model response interface...",
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

`output` may contain several item types at the same time, including reasoning, message, function call, and web search call items. `output[0]` is not guaranteed to be the assistant's text.

The OpenAI SDK's `response.output_text` aggregates all `output_text` content blocks under `output` items whose `type` is `message`.

### Streaming Request

When `stream: true`, the API continuously returns events over SSE while the model generates a response.

```bash
curl -N https://api.b.ai/v1/responses \
  -H "Authorization: Bearer $BAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "input": "Write a short introduction to the development of artificial intelligence.",
    "stream": true,
    "max_output_tokens": 512
  }'
```

Common events:

| Event type | Description |
|---|---|
| `response.created` | The Response was created. |
| `response.in_progress` | The Response is being generated. |
| `response.output_item.added` | A new output item was added. |
| `response.content_part.added` | A new content part was added. |
| `response.output_text.delta` | A text delta. |
| `response.output_text.done` | Text output is complete. |
| `response.output_item.done` | The current output item is complete. |
| `response.completed` | The Response completed successfully. |
| `response.incomplete` | The Response ended early, for example because of an output limit. |
| `response.failed` | Response generation failed. |

The table lists common events. Clients should handle recognized event types and ignore events they do not need.

Event example:

```text
event: response.output_text.delta
data: {"type":"response.output_text.delta","delta":"Responses"}

event: response.output_text.delta
data: {"type":"response.output_text.delta","delta":" API"}

event: response.completed
data: {"type":"response.completed","response":{"id":"resp_...","status":"completed"}}
```

> If a streaming request fails before the SSE connection is established, the server returns a JSON error object with `Content-Type: application/json`.

### Python SDK

Install the OpenAI Python SDK:

```bash
pip install openai
```

Call the Responses API:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["BAI_API_KEY"],
    base_url="https://api.b.ai/v1",
)

response = client.responses.create(
    model="your-model-id",
    input="Explain the Responses API in three sentences.",
)

print(response.output_text)
```

### JavaScript SDK

Install the OpenAI JavaScript SDK:

```bash
npm install openai
```

Call the Responses API:

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.BAI_API_KEY,
  baseURL: "https://api.b.ai/v1",
});

const response = await client.responses.create({
  model: "your-model-id",
  input: "Explain the Responses API in three sentences.",
});

console.log(response.output_text);
```

### Reasoning Configuration

Models that support reasoning can use `reasoning` to configure reasoning effort and summaries:

```json
{
  "model": "your-model-id",
  "input": "Analyze the performance bottlenecks in this system design.",
  "reasoning": {
    "effort": "high",
    "summary": "auto"
  }
}
```

Available reasoning levels depend on the selected model. Unsupported configurations may return HTTP `400`.

Reasoning token usage is available at:

```text
usage.output_tokens_details.reasoning_tokens
```

Reasoning tokens count toward `max_output_tokens`. If the value is too low, the model may exhaust its budget before producing visible text and return a response with `status` set to `incomplete`.

### Function Calling

#### Step 1: Declare a Function

```json
{
  "model": "your-model-id",
  "max_output_tokens": 512,
  "input": [
    {
      "role": "user",
      "content": "What's the weather like in Shenzhen today?"
    }
  ],
  "tools": [
    {
      "type": "function",
      "name": "get_weather",
      "description": "Get the weather for a specified city",
      "parameters": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string",
            "description": "City name"
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

When the model decides to call the function, a `function_call` item appears in `output`:

```json
{
  "type": "function_call",
  "call_id": "call_01HXYZ...",
  "name": "get_weather",
  "arguments": "{\"city\":\"Shenzhen\"}"
}
```

#### Step 2: Submit the Function Result

In the next request's `input`, include the original conversation, the `function_call` returned by the model, and the `function_call_output` result in order:

```json
{
  "model": "your-model-id",
  "max_output_tokens": 512,
  "tools": [
    {
      "type": "function",
      "name": "get_weather",
      "description": "Get the weather for a specified city",
      "parameters": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string",
            "description": "City name"
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
      "content": "What's the weather like in Shenzhen today?"
    },
    {
      "type": "function_call",
      "call_id": "call_01HXYZ...",
      "name": "get_weather",
      "arguments": "{\"city\":\"Shenzhen\"}"
    },
    {
      "type": "function_call_output",
      "call_id": "call_01HXYZ...",
      "output": "Shenzhen: Clear, 28°C"
    }
  ]
}
```

`call_id` must match the value returned by the model. Include the tool definition in subsequent requests as well.

### Web Search

Models that support web search can use the `web_search` tool:

```json
{
  "model": "your-model-id",
  "input": "Summarize three noteworthy artificial intelligence news stories from today.",
  "tools": [
    {
      "type": "web_search"
    }
  ]
}
```

Web search availability and fees depend on the selected model and request configuration.

### Multi-Turn Conversations

The example below organizes a multi-turn conversation as stateless requests. Include the context required for the next response in the subsequent request's `input`:

```json
{
  "model": "your-model-id",
  "input": [
    {
      "role": "user",
      "content": "What is a vector database?"
    },
    {
      "role": "assistant",
      "content": "A vector database is a database designed to store and retrieve vector representations."
    },
    {
      "role": "user",
      "content": "What are its three most common applications?"
    }
  ]
}
```

Each subsequent request only needs the context required to generate the next response.

---

## Chat Completions API (OpenAI-Compatible)

`POST /v1/chat/completions`

Accepts a list of messages and returns a model-generated response. It is suitable for applications that already use the OpenAI Chat Completions protocol.

### Main Request Parameters

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `model` | string | Yes | Model ID. |
| `messages` | array | Yes | Conversation message list. |
| `stream` | boolean | No | Whether to return an SSE stream. Default `false`. |
| `max_tokens` | integer | No | Maximum output tokens. Some models also support `max_completion_tokens`. |
| `temperature` | number | No | Sampling temperature; the supported range depends on the model. |
| `top_p` | number | No | Nucleus sampling parameter. |
| `stop` | string \| string[] | No | Stop sequences. |
| `response_format` | object | No | Text, JSON Object, or JSON Schema output configuration. |
| `tools` | array | No | Function tool definitions. |
| `tool_choice` | string \| object | No | Tool selection mode. |
| `web_search_options` | object | No | Web search configuration for supported models. |
| `user` | string | No | End-user identifier. |

### Request Example

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

### Non-Streaming Response Example

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

### Streaming Response

When `stream: true`, the server returns `text/event-stream`. Each chunk has `object` set to `chat.completion.chunk`, and incremental text is available at:

```text
choices[].delta.content
```

---

## Messages API (Anthropic-Compatible)

`POST /v1/messages`

The Messages API is compatible with the Anthropic message format and is suitable for the Anthropic SDK, Claude Code, and other clients that use the Messages protocol.

### Main Request Parameters

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `model` | string | Yes | Model ID. |
| `max_tokens` | integer | Yes | Maximum output tokens. |
| `messages` | array | Yes | User and assistant message list. |
| `system` | string \| array | No | System prompt. |
| `stream` | boolean | No | Whether to return an SSE stream. Default `false`. |
| `temperature` | number | No | Sampling temperature, usually from `0.0` to `1.0`. |
| `top_p` | number | No | Nucleus sampling parameter. |
| `top_k` | integer | No | Sample only from the top K candidates by probability. |
| `stop_sequences` | string[] | No | Custom stop sequences. |
| `thinking` | object | No | Extended thinking configuration. |
| `tools` | array | No | Anthropic-format tool definitions. |
| `tool_choice` | object | No | Tool selection mode. |

### Request Example

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

### Non-Streaming Response Example

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

### Streaming Events

When `stream: true`, common events include:

| Event type | Description |
|---|---|
| `message_start` | Initial message metadata. |
| `content_block_start` | A new content block begins. |
| `content_block_delta` | Incremental text or thinking content. |
| `content_block_stop` | The current content block ends. |
| `message_delta` | Incremental stop reason and usage data. |
| `message_stop` | The message is complete. |

---

## Codex CLI Integration

The B.AI Responses API can be used as a custom model provider for Codex with supported GPT and DeepSeek model families. The following configuration applies to Codex versions that support custom model providers.

### 1. Set the API Key

```bash
export BAI_API_KEY="sk-..."
```

### 2. Edit the Codex Configuration

Edit the user-level configuration file:

```text
~/.codex/config.toml
```

Add the following configuration:

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

:::caution Disable Codex web search before using DeepSeek
Codex may expose its built-in web search tool by default, but DeepSeek models do not support that tool. Without this setting, the request may return an unsupported Web Search tool error.

Open `~/.codex/config.toml` and add `web_search = "disabled"` as a top-level option:

```toml
model = "your-model-id"
model_provider = "bai"
web_search = "disabled"
```

Keep `web_search` above and outside the `[model_providers.bai]` block. Save the file, fully quit Codex, and restart it. This setting is required when using DeepSeek; remove or change it when switching to a model configuration that uses web search.
:::

If the file already contains configuration, append the complete `[model_providers.bai]` block and change the top-level `model` and `model_provider` values as shown above. See the Codex documentation at the end of this page for a full explanation of the configuration fields.

After saving, start Codex from a terminal where `BAI_API_KEY` is set:

```bash
codex
```

To change models, edit the top-level `model` value:

```toml
model = "your-model-id"
```

### Codex FAQ

| Issue | Check |
|---|---|
| Environment variable not found | Make sure `env_key` exactly matches the environment variable name, and start Codex from the terminal where the variable is set. |
| Requests go to OpenAI instead of B.AI | Confirm the top-level `model_provider = "bai"` and that a `[model_providers.bai]` block exists. |
| `401` response | Check whether the API Key is valid and whether a Key from another environment was used accidentally. |
| `403` response | Check the account status and model permissions. |
| Model not supported | Confirm that the model ID is spelled correctly and is enabled for the configured endpoint. |
| DeepSeek request reports an unsupported web search tool | Confirm that the top-level configuration contains `web_search = "disabled"`, then restart Codex. |

---

## Choosing an Endpoint

| Item | Chat Completions | Responses | Messages |
|---|---|---|---|
| Endpoint | `/v1/chat/completions` | `/v1/responses` | `/v1/messages` |
| Compatible protocol | OpenAI Chat Completions | OpenAI Responses | Anthropic Messages |
| Main input field | `messages` | `input` | `messages` |
| Output limit field | `max_tokens` / `max_completion_tokens` | `max_output_tokens` | `max_tokens` |
| Text output location | `choices[].message.content` | `output[].content[].text` | `content[].text` |
| Input tokens | `usage.prompt_tokens` | `usage.input_tokens` | `usage.input_tokens` |
| Output tokens | `usage.completion_tokens` | `usage.output_tokens` | `usage.output_tokens` |
| Reasoning tokens | `completion_tokens_details.reasoning_tokens` | `output_tokens_details.reasoning_tokens` | Depends on the model and response content blocks |
| Streaming format | SSE chunks | SSE events | SSE events |
| Recommended use | Existing OpenAI-compatible applications | New projects, agents, Codex, and tool use | Anthropic SDK and Claude Code |

Choose the endpoint that matches the client's protocol and request structure.

---

## Error Responses

Errors from non-streaming requests and errors that occur before an SSE connection is established are returned as JSON:

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

| Field | Type | Description |
|---|---|---|
| `message` | string | Developer-facing error description; some errors include a request ID. |
| `type` | string | Error type; more than one value may be used. |
| `param` | string | Request parameter that caused the error; may be empty. |
| `code` | string | Machine-readable error code. |

Error responses include an HTTP status code and an `error` object. Applications can use `code` and `message` for error handling and troubleshooting.

### HTTP Status Codes

| Status code | Description | Handling |
|---:|---|---|
| `200` | Request succeeded | Parse the response according to the endpoint format. |
| `400` | The request cannot be processed because of its format, parameters, or endpoint compatibility | Read `code` and `message` from the error object. |
| `401` | API Key is missing, invalid, or expired | Check the authentication header and the environment being used. |
| `403` | Model permission, subscription, or account status restriction | Check the account status and model permissions. |
| `404` | The requested resource or model was not found | Check the request path and model ID. |
| `413` | Request body exceeds the platform limit | Shorten the input or reduce the request content. |
| `429` | Rate limit triggered | Retry with exponential backoff and reduce concurrency. |
| `500` | Internal server error | Record the request ID and retry later. |
| `502` | Upstream service error | Retry with exponential backoff. |
| `503` | Service temporarily unavailable | Retry later or choose another model. |

### Common Responses Errors

| Scenario | Status code | Handling |
|---|---:|---|
| Model and endpoint are incompatible | `400` | Select a model enabled for the endpoint or use another endpoint. |
| A DeepSeek request includes web search | `400` | Remove the web search tool. In Codex, set the top-level option `web_search = "disabled"`. |
| `max_tokens` or `max_completion_tokens` is used | `400` | Use `max_output_tokens` instead. |
| `max_output_tokens` exceeds the model limit | `400` | Adjust the value to the range stated in the error. |
| Request uses an unavailable tool | `400` | Remove the tool or choose a compatible model configuration. |
| Key is invalid or the environment does not match | `401` | Use a Key issued for the production environment to call the production domain. |
| Streaming request fails before the stream is established | `4xx` / `5xx` | Parse the JSON error object instead of treating it as SSE. |

### Retry Recommendations

- `400`, `401`, `403`, and `404` require a request or account-status change and should not usually be retried automatically.
- `429`, `500`, `502`, and `503` can be retried with exponential backoff and random jitter.
- Use the request ID in the response when contacting technical support.

---

## Security Recommendations

An API Key is equivalent to an account credential and can make billable requests directly.

- Keep the Key on a server or in a protected local environment. Inject it through environment variables or a secret manager; do not put it in browser frontends, mobile app packages, or public code repositories.
- Use different Keys for development, testing, and production.
- Revoke a leaked Key immediately. Keep only masked forms in logs and support tickets, such as `sk-****abcd`.

---

## Related Resources

- B.AI documentation: <https://docs.b.ai/llmservice/api/>
- B.AI website: <https://b.ai/>
- OpenAI API documentation: <https://developers.openai.com/>
- Codex documentation: <https://developers.openai.com/codex/>
