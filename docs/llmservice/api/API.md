# BANK OF AI LLM API (OpenAI Compatible)
OpenAPI spec for /v1/models and /v1/chat/completions (OpenAI format).

## Version: 1.0

**Schemes:** https

**Host:** api.bankofai.io

---
### /v1/chat/completions

#### POST
##### Summary

Create chat completion (OpenAI compatible)

##### Description

Chat completion. Auth: Bearer token. Non-stream: JSON with choices[].content. Stream: SSE chunks with choices[].delta.content.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| Authorization | header | Bearer &lt;token&gt;, e.g. Bearer sk-xxx | Yes | string |
| body | body | Request body (model, messages required; stream, max_tokens, temperature, top_p, stop, n optional) | Yes | [main.ChatCompletionsRequest](#mainchatcompletionsrequest) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Non-stream: choices[].content. Stream (SSE): each chunk is ChatCompletionsStreamChunk with choices[].delta.content. | [main.ChatCompletionsResponse](#mainchatcompletionsresponse) |
| 401 | Authentication failed | object |

---
### /v1/models

#### GET
##### Summary

List models (OpenAI compatible)

##### Description

List available models. Auth: Bearer token. Response: object, success, data.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| Authorization | header | Bearer &lt;token&gt;, e.g. Bearer sk-xxx | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | object: list; success: true; data: array of { id, object, created, owned_by } | [main.V1ModelsResponse](#mainv1modelsresponse) |
| 401 | Authentication failed | object |

---
### Models

#### main.ChatChoice

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| content | string |  | No |
| finish_reason | string | *Example:* `"stop"` | No |
| index | integer |  | No |

#### main.ChatCompletionsRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| frequency_penalty | number | FrequencyPenalty: -2.0 to 2.0. Penalize repeated tokens. Default 0. | No |
| max_tokens | integer | MaxTokens: maximum number of tokens that can be generated in the completion. | No |
| messages | [ [main.ChatMessage](#mainchatmessage) ] | Messages: list of messages in the conversation. Required. | No |
| model | string | Model: ID of the model to use (e.g. gpt-4). Required.<br/>*Example:* `"gpt-4"` | No |
| n | integer | N: how many chat completion choices to generate. Default 1. | No |
| presence_penalty | number | PresencePenalty: -2.0 to 2.0. Penalize tokens that appear in the text so far. Default 0. | No |
| response_format | [main.ChatResponseFormat](#mainchatresponseformat) | ResponseFormat: specify output format: { "type": "text" } or { "type": "json_object" } or json_schema. | No |
| seed | integer | Seed: random seed for deterministic sampling (if supported by model). | No |
| stop |  | Stop: up to 4 sequences where the API will stop generating. String or array of strings. | No |
| stream | boolean | Stream: if true, partial message deltas will be sent as server-sent events. Default false. | No |
| temperature | number | Temperature: sampling temperature between 0 and 2. Higher = more random. Default 1. | No |
| tool_choice |  | ToolChoice: "none" \| "auto" \| { "type": "function", "function": { "name": "..." } }. Controls which tool(s) to call. | No |
| tools | [ [main.ChatTool](#mainchattool) ] | Tools: list of tools the model may call. Each has type "function" and function { name, description?, parameters? }. | No |
| top_p | number | TopP: nucleus sampling: consider tokens with top_p probability mass. Default 1. | No |
| user | string | User: optional end-user identifier for abuse monitoring. | No |

#### main.ChatCompletionsResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| choices | [ [main.ChatChoice](#mainchatchoice) ] |  | No |
| created | integer | *Example:* `1677652288` | No |
| id | string | *Example:* `"chatcmpl-xxx"` | No |
| model | string | *Example:* `"gpt-4"` | No |
| object | string | *Example:* `"chat.completion"` | No |
| usage | [main.ChatUsage](#mainchatusage) |  | No |

#### main.ChatMessage

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| content | string | Content: message content. For tool role, the result of the tool call.<br/>*Example:* `"Hello"` | No |
| name | string | Name: optional name for the message author (e.g. to disambiguate multiple users). | No |
| role | string | Role: "system" \| "user" \| "assistant" \| "tool". System sets behavior; user/assistant are conversation; tool is tool result.<br/>*Example:* `"user"` | No |
| tool_call_id | string | ToolCallId: when role is "tool", the id of the tool call this result is for. Required for tool messages. | No |
| tool_calls | [ [main.ChatToolCallItem](#mainchattoolcallitem) ] | ToolCalls: when role is "assistant" and the model called tools, array of { id, type, function: { name, arguments } }. | No |

#### main.ChatResponseFormat

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| json_schema |  | JsonSchema: when type is json_schema, optional schema for the output. | No |
| type | string | Type: "text" or "json_object". | No |

#### main.ChatTool

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| function | [main.ChatToolFunction](#mainchattoolfunction) | Function: function definition (name, description, parameters). | No |
| type | string | Type: must be "function".<br/>*Example:* `"function"` | No |

#### main.ChatToolCallFunction

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| arguments | string | Arguments: JSON string of the arguments. | No |
| name | string | Name: name of the function to call. | No |

#### main.ChatToolCallItem

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| function | [main.ChatToolCallFunction](#mainchattoolcallfunction) | Function: name and arguments of the call. | No |
| id | string | Id: ID of the tool call. | No |
| type | string | Type: "function".<br/>*Example:* `"function"` | No |

#### main.ChatToolFunction

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| description | string | Description: optional description for the model. | No |
| name | string | Name: name of the function. | No |
| parameters |  | Parameters: optional JSON schema for the function arguments. | No |

#### main.ChatUsage

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| completion_tokens | integer | CompletionTokens: number of tokens in the completion. | No |
| prompt_tokens | integer | PromptTokens: number of tokens in the prompt. | No |
| total_tokens | integer | TotalTokens: total tokens (prompt + completion). | No |

#### main.V1ModelItem

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| created | integer | *Example:* `1626777600` | No |
| id | string | *Example:* `"gpt-4"` | No |
| object | string | *Example:* `"model"` | No |
| owned_by | string | *Example:* `"openai"` | No |

#### main.V1ModelsResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| data | [ [main.V1ModelItem](#mainv1modelitem) ] |  | No |
| object | string | *Example:* `"list"` | No |
| success | boolean | *Example:* `true` | No |
