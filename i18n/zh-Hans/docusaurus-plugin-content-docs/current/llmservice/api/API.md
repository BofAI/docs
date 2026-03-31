# AI API

聊天补全。认证：Bearer token。非流式返回：JSON（choices[].content）。流式返回：SSE（choices[].delta.content）。

- **版本：** 1.0

## Servers（服务器）

| URL | 描述 |
|-----|------|
| `https://api.bankofai.com` | 生产环境 |

---

## Authentication（认证）

### Bearer 认证

- **类型：** HTTP Bearer
- **格式：** JWT
- **说明：** Bearer \<token\>，例如：`Bearer sk-xxx`

### API Key 认证

- **类型：** API Key
- **位置：** Header
- **字段名：** `x-api-key`
- **说明：** API Key 认证，例如：`x-api-key: your-api-key`

---

## Endpoints（接口）

### 模型列表

#### `GET /v1/models` - 获取模型列表（OpenAI 兼容）

获取可用模型列表。认证：Bearer token。返回：object，success，data。

**认证方式：** Bearer Auth

**响应：**

| 状态码 | 描述 |
|--------|------|
| 200 | object: list；success: true；data: 模型数组（包含 id、object、created、owned_by） |
| 400 | 请求错误 - 参数无效或请求体格式错误 |
| 401 | 未授权 - 缺少或无效认证 |
| 403 | 禁止访问 - 权限不足、配额不足或被封禁 |
| 429 | 请求过多 - 触发限流 |
| 500 | 服务器内部错误 |

**200 响应结构：** [V1ModelsResponse](#v1modelsresponse)

**错误响应结构：** [ErrorResponse](#errorresponse)

---

### Messages（消息接口）

#### `POST /v1/messages` - 发送消息（Claude 兼容）

接收消息列表并返回模型生成的响应。支持单轮和多轮对话。使用 x-api-key 认证。支持流式（SSE）和非流式返回。

**认证方式：** API Key（`x-api-key`）

**请求体：** [ChatCompletionsRequest](#chatcompletionsrequest)（必填，`application/json`）

**响应：**

| 状态码 | 描述 |
|--------|------|
| 200 | 成功（结构取决于是否使用流式） |
| 400 | 请求错误 - 参数或格式错误 |
| 401 | 未授权 - API Key 无效或缺失 |
| 403 | 禁止访问 - 权限不足或模型受限 |
| 429 | 请求过多 - 限流 |
| 500 | 服务器内部错误 |
| 502 | 网关错误 - 上游服务异常 |
| 503 | 服务不可用 - 系统过载或无可用通道 |

**200 返回类型：**
- `application/json`
- `text/event-stream`

**错误响应结构：** [ErrorResponse](#errorresponse)

---

### Chat Completions（聊天补全）

#### `POST /v1/chat/completions` - 创建聊天补全（OpenAI 兼容）

接收消息列表并返回模型生成结果。支持单轮和多轮对话。使用 Bearer token 认证。支持流式和非流式返回。

**认证方式：** Bearer Auth

**请求体：** [ChatCompletionsRequest](#chatcompletionsrequest)

**响应：**

| 状态码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 请求错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 429 | 限流 |
| 500 | 服务器错误 |
| 502 | 网关错误 |
| 503 | 服务不可用 |

**返回类型：**
- `application/json`
- `text/event-stream`

---

## Schemas（数据结构）

### ErrorResponse（错误响应）

| 字段 | 类型 | 描述 |
|------|------|------|
| error | object | 错误信息 |
| error.message | string | 错误描述 |
| error.type | string | 错误类型 |
| error.param | string \| null | 相关参数 |
| error.code | string \| null | 错误代码 |

---

### V1ModelsResponse

| 字段 | 类型 | 示例 | 描述 |
|------|------|------|------|
| object | string | "list" | |
| success | boolean | true | |
| data | array | | 模型数组 |

---

### V1ModelItem

| 字段 | 类型 | 示例 | 描述 |
|------|------|------|------|
| id | string | "gpt-5.2" | |
| object | string | "model" | |
| created | integer | 1626777600 | |
| owned_by | string | "openai" | |

---

### ChatCompletionsRequest

**必填字段：** `model`, `messages`

| 字段 | 类型 | 描述 |
|------|------|------|
| model | string | 模型 ID |
| messages | array | 对话消息列表 |
| stream | boolean | 是否流式返回 |
| max_tokens | integer | 最大生成 token |
| temperature | number | 随机性（0-2） |
| top_p | number | 核采样 |
| stop | string \| array | 停止词 |
| n | integer | 返回数量 |
| frequency_penalty | number | 重复惩罚 |
| presence_penalty | number | 出现惩罚 |
| seed | integer | 随机种子 |
| response_format | object | 输出格式 |
| tools | array | 工具调用 |
| tool_choice | string \| object | 工具选择 |
| user | string | 用户标识 |
| web_search_options | object | Web 搜索配置 |

---

### WebSearchOptions

| 字段 | 类型 | 描述 |
|------|------|------|
| search_context_size | string | 上下文大小（low/medium/high） |
| user_location | object | 用户位置 |

---

### ChatMessage

| 字段 | 类型 | 描述 |
|------|------|------|
| role | string | system / user / assistant / tool |
| content | string | 消息内容 |
| name | string | 可选 |
| tool_call_id | string | 工具调用 ID |
| tool_calls | array | 工具调用列表 |

---

### ChatResponseFormat

| 字段 | 类型 | 描述 |
|------|------|------|
| type | string | text / json_object |
| json_schema | any | JSON Schema |

---

### ChatTool

| 字段 | 类型 | 描述 |
|------|------|------|
| type | string | function |
| function | object | 函数定义 |

---

### ChatToolFunction

| 字段 | 类型 | 描述 |
|------|------|------|
| name | string | 函数名 |
| description | string | 描述 |
| parameters | any | 参数 |

---

### ChatToolCallItem

| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 调用 ID |
| type | string | function |
| function | object | 调用函数 |

---

### ChatCompletionsResponse

| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 请求 ID |
| object | string | 类型 |
| created | integer | 时间戳 |
| model | string | 模型 |
| choices | array | 返回结果 |
| usage | object | Token 使用情况 |

---

### ChatUsage

| 字段 | 类型 | 描述 |
|------|------|------|
| prompt_tokens | integer | 输入 token |
| completion_tokens | integer | 输出 token |
| total_tokens | integer | 总 token |
| prompt_tokens_details | object | 输入详情 |
| completion_tokens_details | object | 输出详情 |
