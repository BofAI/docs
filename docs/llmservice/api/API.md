# AI API (OpenAI Compatible)
Chat completion. Auth: Bearer token. Non-stream: JSON with choices[].content. Stream: SSE chunks with choices[].delta.content.

## Version: 1.0

### Available authorizations
#### bearerAuth (HTTP, bearer)
Bearer <token>, e.g. Bearer sk-xxx  
Bearer format: JWT

---
## Model List

### [GET] /v1/models
**List models (OpenAI compatible)**

List available models. Auth: Bearer token. Response: object, success, data.

#### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | object: list; success: true; data: array of { id, object, created, owned_by } | **application/json**: [V1ModelsResponse](#v1modelsresponse)<br> |
| 400 | Bad Request - invalid parameters or malformed body | **application/json**: [ErrorResponse](#errorresponse)<br> |
| 401 | Unauthorized - invalid or missing authentication | **application/json**: [ErrorResponse](#errorresponse)<br> |
| 403 | Forbidden - access denied, insufficient quota, or banned | **application/json**: [ErrorResponse](#errorresponse)<br> |
| 429 | Too Many Requests - rate limit exceeded | **application/json**: [ErrorResponse](#errorresponse)<br> |
| 500 | Internal Server Error | **application/json**: [ErrorResponse](#errorresponse)<br> |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth |  |

---
## Chat Completions

### [POST] /v1/chat/completions
**Create chat completion (OpenAI compatible)**

Chat completion. Auth: Bearer token. Non-stream: JSON with choices[].content. Stream: SSE chunks with choices[].delta.content.

#### Request Body

| Required | Schema |
| -------- | ------ |
|  Yes | **application/json**: [ChatCompletionsRequest](#chatcompletionsrequest)<br> |

#### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success. Schema differs by stream mode. | **application/json**: [ChatCompletionsResponse](#chatcompletionsresponse)<br>**text/event-stream**: [ChatCompletionsResponse](#chatcompletionsresponse)<br> |
| 400 | Bad Request - invalid parameters, malformed body, or invalid request | **application/json**: [ErrorResponse](#errorresponse)<br> |
| 401 | Unauthorized - invalid or missing authentication | **application/json**: [ErrorResponse](#errorresponse)<br> |
| 403 | Forbidden - access denied, insufficient quota, or model access restricted | **application/json**: [ErrorResponse](#errorresponse)<br> |
| 429 | Too Many Requests - rate limit exceeded | **application/json**: [ErrorResponse](#errorresponse)<br> |
| 500 | Internal Server Error | **application/json**: [ErrorResponse](#errorresponse)<br> |
| 502 | Bad Gateway - upstream service error | **application/json**: [ErrorResponse](#errorresponse)<br> |
| 503 | Service Unavailable - overloaded or no available channel | **application/json**: [ErrorResponse](#errorresponse)<br> |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth |  |

---
### Schemas

#### ErrorResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| error | { **"message"**: string, **"type"**: string, **"param"**: string, null, **"code"**: string, null } |  | No |

#### V1ModelsResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| object | string | *Example:* `"list"` | No |
| success | boolean | *Example:* `true` | No |
| data | [ [V1ModelItem](#v1modelitem) ] |  | No |

#### V1ModelItem

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string | *Example:* `"gpt-4"` | No |
| object | string | *Example:* `"model"` | No |
| created | integer | *Example:* `1626777600` | No |
| owned_by | string | *Example:* `"openai"` | No |

#### ChatCompletionsRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| model | string | ID of the model to use (e.g. gpt-4).<br>*Example:* `"gpt-4"` | Yes |
| messages | [ [ChatMessage](#chatmessage) ] | List of messages in the conversation. | Yes |
| stream | boolean | If true, partial message deltas will be sent as server-sent events. Default false. | No |
| max_tokens | integer | Maximum number of tokens that can be generated in the completion. | No |
| temperature | number | Sampling temperature between 0 and 2. Higher = more random. Default 1. | No |
| top_p | number | Nucleus sampling: consider tokens with top_p probability mass. Default 1. | No |
| stop |  | Up to 4 sequences where the API will stop generating. String or array of strings. | No |
| n | integer | How many chat completion choices to generate. Default 1. | No |
| frequency_penalty | number | -2.0 to 2.0. Penalize repeated tokens. Default 0. | No |
| presence_penalty | number | -2.0 to 2.0. Penalize tokens that appear in the text so far. Default 0. | No |
| seed | integer | Random seed for deterministic sampling (if supported by model). | No |
| response_format | [ChatResponseFormat](#chatresponseformat) |  | No |
| tools | [ [ChatTool](#chattool) ] | List of tools the model may call. Each has type "function" and function { name, description?, parameters? }. | No |
| tool_choice |  |  | No |
| user | string | Optional end-user identifier for abuse monitoring. | No |

#### ChatMessage

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| role | string | "system" \| "user" \| "assistant" \| "tool". System sets behavior; user/assistant are conversation; tool is tool result.<br>*Example:* `"user"` | No |
| content | string | Message content. For tool role, the result of the tool call.<br>*Example:* `"Hello"` | No |
| name | string | Optional name for the message author (e.g. to disambiguate multiple users). | No |
| tool_call_id | string | When role is "tool", the id of the tool call this result is for. Required for tool messages. | No |
| tool_calls | [ [ChatToolCallItem](#chattoolcallitem) ] | When role is "assistant" and the model called tools, array of { id, type, function: { name, arguments } }. | No |

#### ChatResponseFormat

Specify output format: { "type": "text" } or { "type": "json_object" } or json_schema.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| type | string | "text" or "json_object". | No |
| json_schema |  | When type is json_schema, optional schema for the output. | No |

#### ChatTool

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| type | string | Must be "function".<br>*Example:* `"function"` | No |
| function | [ChatToolFunction](#chattoolfunction) | Function definition (name, description, parameters). | No |

#### ChatToolFunction

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Name of the function. | No |
| description | string | Optional description for the model. | No |
| parameters |  | Optional JSON schema for the function arguments. | No |

#### ChatToolCallItem

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string | ID of the tool call. | No |
| type | string | "function".<br>*Example:* `"function"` | No |
| function | [ChatToolCallFunction](#chattoolcallfunction) | Name and arguments of the call. | No |

#### ChatToolCallFunction

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Name of the function to call. | No |
| arguments | string | JSON string of the arguments. | No |

#### ToolChoiceObject

Precise mode: specifies the particular function to call.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| type | string, <br>**Available values:** "function" | Must be "function".<br>*Enum:* `"function"`<br>*Example:* `"function"` | Yes |
| function | [ToolChoiceFunction](#toolchoicefunction) | Function definition to call. | Yes |

#### ToolChoiceFunction

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Name of the function to call. | Yes |

#### ChatCompletionsResponse

Non-stream: object=chat.completion, choices[].message, usage. Stream: object=chat.completion.chunk, choices[].delta; final chunk has usage.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string | *Example:* `"chatcmpl-xxx"` | No |
| object | string, <br>**Available values:** "chat.completion", "chat.completion.chunk" | "chat.completion" (non-stream) or "chat.completion.chunk" (stream).<br>*Enum:* `"chat.completion"`, `"chat.completion.chunk"` | No |
| created | integer | *Example:* `1677652288` | No |
| model | string | *Example:* `"gpt-4"` | No |
| service_tier | string | *Example:* `"default"` | No |
| system_fingerprint | string, null |  | No |
| choices | [ [ChatChoice](#chatchoice) ] | Empty in final usage chunk. | No |
| usage |  | Non-stream: always present. Stream: null until final chunk. | No |
| obfuscation | string |  | No |

#### ChatMessageContent

Non-stream choices[].message. Full assistant message with role, content, refusal, annotations.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| role | string | *Example:* `"assistant"` | No |
| content | string | Assistant reply text. | No |
| refusal | string, null | Refusal reason when model declines; null otherwise. | No |
| annotations | [  ] | Citations, references, etc. | No |

#### ChatChoice

Non-stream: message. Stream: delta. finish_reason null until last content chunk.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| index | integer |  | No |
| message | [ChatMessageContent](#chatmessagecontent) | Non-stream only. Full assistant message. | No |
| delta | [ChatChoiceDelta](#chatchoicedelta) | Stream only. Incremental content; empty {} on stop. | No |
| finish_reason | string, null | Null until done; e.g. "stop", "length", "tool_calls". | No |

#### ChatChoiceDelta

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| content | string |  | No |
| role | string |  | No |
| tool_calls | [ [ChatToolCallItem](#chattoolcallitem) ] |  | No |

#### ChatUsage

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| prompt_tokens | integer | Number of tokens in the prompt. | No |
| completion_tokens | integer | Number of tokens in the completion. | No |
| total_tokens | integer | Total tokens (prompt + completion). | No |
| prompt_tokens_details | { **"cached_tokens"**: integer, **"audio_tokens"**: integer } |  | No |
| completion_tokens_details | { **"reasoning_tokens"**: integer, **"audio_tokens"**: integer, **"accepted_prediction_tokens"**: integer, **"rejected_prediction_tokens"**: integer } |  | No |
