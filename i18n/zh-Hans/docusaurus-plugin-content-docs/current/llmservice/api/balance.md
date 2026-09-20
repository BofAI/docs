# 余额 API

本指南说明如何获取某个 API Key 可用的余额和额度信息。当应用需要展示当前账户或团队额度时，可在发起模型请求前调用此接口。

> 本文档说明 B.AI `GET /v1/balance` 端点的当前行为。

---

## 1. 准备 API Key

创建或获取一个对目标用户或团队有效的 API Key。该接口接受个人 API Key 和团队 API Key：

- **个人 API Key**：返回当前用户的个人余额。
- **团队 API Key**：返回该成员的额度信息；团队管理员还会获得团队余额。

请妥善保管 API Key。不要将其暴露在浏览器端代码、源代码仓库、截图或日志中。

---

## 2. 查询余额

向余额接口发送 `GET` 请求；无需请求体或查询参数。

```text
GET https://api.b.ai/v1/balance
```

### 鉴权

通过以下任意**一种**请求头传入 API Key：

```http
Authorization: Bearer sk-your-api-key
```

```http
x-api-key: sk-your-api-key
```

### 请求示例

```bash
curl --request GET "https://api.b.ai/v1/balance" \
  --header "Authorization: Bearer sk-your-api-key"
```

请将 `sk-your-api-key` 替换为真实 API Key。

---

## 3. 理解响应

所有成功响应均使用以下外层结构：

```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

`data` 的内容取决于 API Key 类型。

### 个人 API Key

个人 API Key 返回用户的个人余额。

```json
{
  "success": true,
  "message": "",
  "data": {
    "user_id": "user_123",
    "api_key_type": "personal",
    "timestamp": 1789550088169,
    "personal_balance": 1250000,
    "active_status": "active"
  }
}
```

### 团队 API Key：团队管理员

团队管理员会获得团队余额和管理员自身的额度明细。

```json
{
  "success": true,
  "message": "",
  "data": {
    "user_id": "user_123",
    "api_key_type": "team",
    "active_status": "active",
    "timestamp": 1789550088169,
    "team": {
      "team_role": "admin",
      "quota_limit_type": "limited",
      "team_balance": 8000000,
      "member_quota_limit": 3000000,
      "member_quota_used": 450000,
      "member_reset_interval": 2592000,
      "quota_reset_at": "2026-09-30T16:00:00Z"
    }
  }
}
```

### 团队 API Key：额度不限的非管理员成员

非管理员成员会获得自己的成员额度明细。此示例未配置成员额度上限，因此 `quota_limit_type` 为 `unlimited`，且响应中省略 `member_quota_limit` 和 `member_reset_interval` 字段；同时也不包含 `team_balance` 字段。

```json
{
  "success": true,
  "message": "",
  "data": {
    "user_id": "user_456",
    "api_key_type": "team",
    "active_status": "active",
    "timestamp": 1789550088169,
    "team": {
      "team_role": "member",
      "quota_limit_type": "unlimited",
      "member_quota_used": 450000
    }
  }
}
```

> `personal_balance` 仅在个人 API Key 的响应中返回。`team_balance` 仅在团队 Key 调用方具有 `admin` 角色时返回。对于团队 Key，请先检查 `quota_limit_type`，再读取可选额度字段；字段省略不代表其值为零。

---

## 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `success` | boolean | 请求是否处理成功。 |
| `message` | string | 成功时为空；当 `success` 为 `false` 时包含错误信息。 |
| `data.user_id` | string | 与已鉴权 API Key 关联的用户 ID。 |
| `data.api_key_type` | string | API Key 范围：`personal` 或 `team`。 |
| `data.personal_balance` | integer | 当前个人余额，仅在 `personal` Key 中返回。 |
| `data.active_status` | string | 当前用户或团队成员的状态。 |
| `data.timestamp`| integer | 请求的时间戳 |
| `data.team` | object | 团队专属信息，仅在 `team` Key 中返回。 |
| `data.team.team_role` | string | 调用方在团队中的角色，例如 `admin` 或 `member`。 |
| `data.team.quota_limit_type` | string | 团队成员额度模式：当前成员存在额度上限时为 `limited`，否则为 `unlimited`。 |
| `data.team.team_balance` | integer | 当前团队余额，仅当 `team_role` 为 `admin` 时返回。 |
| `data.team.member_quota_limit` | integer | 当前成员的个人额度上限。仅当 `quota_limit_type` 为 `limited` 时返回；显式配置的额度上限为 `0` 时，该字段返回 `0`。 |
| `data.team.member_quota_used` | integer | 当前重置周期内该成员已使用的额度。 |
| `data.team.member_reset_interval` | integer | 成员额度的重置周期，单位为秒。仅当 `quota_limit_type` 为 `limited` 且配置的重置周期非零时返回。 |
| `data.team.quota_reset_at`| string | 额度下次重置的时间点。|

余额和额度均以整数积分单位返回。仅可根据产品配置的积分单位约定，在客户端进行格式化或换算。

---

## 速率限制

该接口受 API Key 充值状态限流器约束：

- 团队 API Key 不适用个人充值状态限流。
- 对个人 API Key，如存在有效的单用户 RPM 配置，将优先使用该配置。

超出限流时，服务返回 HTTP `429`，且不保证响应体为 JSON。请在客户端缓存余额结果，而不是在每次模型调用前都请求本接口。

---

## 错误响应

### 缺失、无效或已过期的凭证

未提供有效凭证时，接口以标准 API 错误格式返回 HTTP `401`：

```json
{
  "error": {
    "message": "<authentication failure message>",
    "type": "api_error",
    "code": ""
  }
}
```

具体的 `message` 会因失败原因而异。例如，未携带 API Key 请求头时，会提示未提供 `Authorization` 或 `x-api-key` 请求头。

### 余额查询失败

服务无法查询所需余额时，会以 HTTP `200` 和 `success: false` 返回：

```json
{
  "success": false,
  "message": "<underlying balance lookup error>"
}
```

对于已经完成的余额查询，应以 `success` 而非仅以 HTTP 状态码作为最终结果判断依据。

---

## 接入说明

- 请从可安全保护 API Key 的可信后端或其他安全环境调用本接口。
- 使用 `api_key_type` 选择对应 UI：`personal` 显示个人余额，`team` 显示成员额度。
- 对团队 Key，仅在 `team_balance` 存在时展示团队余额；该字段缺失表示调用方不是团队管理员。
- 对团队 Key，请使用 `quota_limit_type` 判断是否展示额度上限和重置周期；不要根据数值 `0` 推断额度不限。
- 缓存最近一次成功响应，并按适合产品的时间间隔刷新，以降低触发限流的风险。
