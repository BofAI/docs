# Bank of AI LLM API（兼容 OpenAI）

本接口与 **OpenAI API 完全兼容**，你可以直接复用现有 OpenAI SDK，仅需替换 Base URL 即可接入。

支持接口：

- `/v1/chat/completions`：对话生成  
- `/v1/models`：获取模型列表  

---

## 基本信息

- **版本：** 1.0  
- **协议：** https  
- **Host：** api.bankofai.io  

---

# /v1/chat/completions

## POST

### 功能说明
创建对话补全（Chat Completion），接口格式与 OpenAI 一致。

### 认证方式
在 Header 中传入：

```
Authorization: Bearer sk-xxxx
```

---

### 返回方式

- **普通模式**：返回完整 JSON（内容在 `choices[].content`）  
- **流式模式**：SSE 流（内容在 `choices[].delta.content`）  

---

## 请求参数

| 参数 | 位置 | 说明 | 必填 |
|-----|-----|-----|-----|
| Authorization | header | Bearer Token，例如 `Bearer sk-xxx` | 是 |
| body | body | 请求体（必须包含 model 和 messages） | 是 |

---

## 请求体字段说明（body）

| 字段 | 类型 | 说明 |
|----|----|----|
| model | string | 模型 ID，例如 `gpt-4` |
| messages | array | 对话消息列表 |
| max_tokens | integer | 最大生成 token 数 |
| temperature | number | 随机性（0~2） |
| top_p | number | 核采样 |
| n | integer | 返回结果数量 |
| stream | boolean | 是否开启流式输出 |
| stop | string / array | 停止词 |
| presence_penalty | number | 主题惩罚 |
| frequency_penalty | number | 频率惩罚 |
| tools | array | 可调用工具 |
| tool_choice | string / object | 工具调用策略 |
| response_format | object | 输出格式 |
| user | string | 用户标识 |

---

## 返回结果

| 状态码 | 说明 |
|------|------|
| 200 | 成功返回结果（普通 / 流式） |
| 401 | 认证失败 |

---

# /v1/models

## GET

### 功能说明
获取当前可用模型列表。

### 认证方式

```
Authorization: Bearer sk-xxxx
```

---

## 返回结果

| 状态码 | 说明 |
|------|------|
| 200 | 返回模型列表 |
| 401 | 认证失败 |

返回结构：

```json
{
  "object": "list",
  "success": true,
  "data": [
    {
      "id": "gpt-4",
      "object": "model",
      "created": 1626777600,
      "owned_by": "openai"
    }
  ]
}
```

---

# 数据结构说明

## ChatChoice（生成结果）

| 字段 | 类型 | 说明 |
|----|----|----|
| content | string | AI 返回内容 |
| finish_reason | string | 结束原因，例如 `stop` |
| index | integer | 结果序号 |

---

## ChatMessage（对话消息）

| 字段 | 类型 | 说明 |
|----|----|----|
| role | string | system / user / assistant / tool |
| content | string | 消息内容 |
| name | string | 可选用户名 |
| tool_call_id | string | 工具调用 ID |
| tool_calls | array | 工具调用信息 |

---

## ChatCompletionsResponse（响应结构）

| 字段 | 类型 | 说明 |
|----|----|----|
| id | string | 请求 ID |
| object | string | 类型 |
| created | integer | 时间戳 |
| model | string | 模型名称 |
| choices | array | 生成结果 |
| usage | object | Token 使用统计 |

---

## Token 使用统计（Usage）

| 字段 | 类型 | 说明 |
|----|----|----|
| prompt_tokens | integer | 输入 token |
| completion_tokens | integer | 输出 token |
| total_tokens | integer | 总 token |

---

## 工具调用（Function Calling）

支持 OpenAI 标准工具调用：

### 工具定义

```json
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "获取天气",
    "parameters": {}
  }
}
```

---

### 模型调用返回

```json
{
  "tool_calls": [
    {
      "id": "call_xxx",
      "type": "function",
      "function": {
        "name": "get_weather",
        "arguments": "{ \"city\": \"Beijing\" }"
      }
    }
  ]
}
```

---

# 总结

- 完全兼容 OpenAI API  
- 支持流式输出  
- 支持工具调用（Function Calling）  
- 支持多模型统一接入  

只需将 Base URL 替换为：

```
https://api.bankofai.io/v1
```

即可快速接入 Bank of AI 🚀
