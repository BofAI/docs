# 用户管理 API 示例
这是一个用于在 GitHub 上展示的 OpenAPI 规范示例，包含了基础的用户查询接口。

## Version: 1.0.0

**Contact information:**  
你的名字/团队名  
https://github.com/你的用户名  
your-email@example.com  

---

### [GET] /users/{id}
**获取用户信息**

根据用户的唯一 ID 获取该用户的详细信息。

#### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| id | path | 用户的唯一 ID | Yes | long |

#### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 请求成功，返回用户信息 | **application/json**: [UserResponse](#userresponse)<br> |
| 400 | 请求参数错误 (例如 ID 格式不对) | **application/json**: [ErrorResponse](#errorresponse)<br> |
| 404 | 用户不存在 | **application/json**: [ErrorResponse](#errorresponse)<br> |

---
### Schemas

#### UserResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | integer | *Example:* `200` | No |
| data | { **"id"**: long, **"name"**: string, **"email"**: string (email), **"createdAt"**: dateTime } |  | No |

#### ErrorResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | integer | *Example:* `404` | No |
| message | string | *Example:* `"未找到该用户"` | No |
