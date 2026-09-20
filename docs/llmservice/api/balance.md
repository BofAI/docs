# Balance API

This guide explains how to retrieve the available balance and quota information for an API Key. Applications that need to display the current account or team quota can call this endpoint before sending a model request.

> This document describes the current behavior of the B.AI `GET /v1/balance` endpoint.

---

## 1. Prepare an API Key

Create or obtain an API Key that is valid for the target user or team. This endpoint accepts both personal and team API Keys:

- **Personal API Key:** Returns the current user's personal balance.
- **Team API Key:** Returns the member's quota information; team administrators also receive the team balance.

Keep the API Key secure. Do not expose it in browser-side code, source code repositories, screenshots, or logs.

---

## 2. Retrieve the Balance

Send a `GET` request to the balance endpoint. No request body or query parameters are required.

```text
GET https://api.b.ai/v1/balance
```

### Authentication

Pass the API Key in either **one** of the following request headers:

```http
Authorization: Bearer sk-your-api-key
```

```http
x-api-key: sk-your-api-key
```

### Request Example

```bash
curl --request GET "https://api.b.ai/v1/balance" \
  --header "Authorization: Bearer sk-your-api-key"
```

Replace `sk-your-api-key` with the actual API Key.

---

## 3. Understand the Response

Successful responses use the following top-level structure:

```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

The contents of `data` depend on the API Key type.

### Personal API Key

A personal API Key returns the user's personal balance.

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

### Team API Key: Team Administrator

A team administrator receives the team balance and the administrator's own quota details.

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

### Team API Key: Non-Administrator Member with Unlimited Quota

A non-administrator member receives their own member quota details. In this example, no member quota limit is configured, so `quota_limit_type` is `unlimited`, and the response omits `member_quota_limit` and `member_reset_interval`. It also does not include `team_balance`.

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

> `personal_balance` is returned only for a personal API Key. `team_balance` is returned only when the caller using a team API Key has the `admin` role. For a team API Key, check `quota_limit_type` before reading optional quota fields; an omitted field does not mean its value is zero.

---

## Response Fields

| Field | Type | Description |
| --- | --- | --- |
| `success` | boolean | Whether the request was processed successfully. |
| `message` | string | Empty on success; contains an error message when `success` is `false`. |
| `data.user_id` | string | The user ID associated with the authenticated API Key. |
| `data.api_key_type` | string | API Key scope: `personal` or `team`. |
| `data.personal_balance` | integer | Current personal balance. Returned only for a `personal` API Key. |
| `data.active_status` | string | Current user or team member status. |
| `data.timestamp`| integer | Timestamp of the request. |
| `data.team` | object | Team-specific information. Returned only for a `team` API Key. |
| `data.team.team_role` | string | The caller's role in the team, such as `admin` or `member`. |
| `data.team.quota_limit_type` | string | Team member quota mode: `limited` when the current member has a quota limit; otherwise `unlimited`. |
| `data.team.team_balance` | integer | Current team balance. Returned only when `team_role` is `admin`. |
| `data.team.member_quota_limit` | integer | The current member's personal quota limit. Returned only when `quota_limit_type` is `limited`; if the explicitly configured limit is `0`, this field returns `0`. |
| `data.team.member_quota_used` | integer | Quota used by the member during the current reset period. |
| `data.team.member_reset_interval` | integer | Member quota reset interval in seconds. Returned only when `quota_limit_type` is `limited` and the configured reset interval is nonzero. |
| `data.team.quota_reset_at`| string | The next quota refill time. |


Balances and quotas are returned as integer Credits. Format or convert these values on the client only according to the Credits unit configured for the product.

---

## Rate Limits

This endpoint is subject to the API Key top-up status rate limiter:

- Team API Keys are exempt from the personal top-up status rate limit.
- For a personal API Key, a valid per-user RPM configuration takes precedence when present.

When the rate limit is exceeded, the service returns HTTP `429`, and the response body is not guaranteed to be JSON. Cache balance results in the client instead of requesting this endpoint before every model call.

---

## Error Responses

### Missing, Invalid, or Expired Credentials

When valid credentials are not provided, the endpoint returns HTTP `401` in the standard API error format:

```json
{
  "error": {
    "message": "<authentication failure message>",
    "type": "api_error",
    "code": ""
  }
}
```

The exact `message` varies by the cause of the failure. For example, when an API Key header is missing, the message indicates that neither the `Authorization` nor the `x-api-key` header was provided.

### Balance Lookup Failure

If the service cannot retrieve the required balance, it returns HTTP `200` with `success: false`:

```json
{
  "success": false,
  "message": "<underlying balance lookup error>"
}
```

For a completed balance request, use `success`, rather than only the HTTP status code, to determine the final result.

---

## Integration Guidance

- Call this endpoint from a trusted backend or another secure environment where the API Key can be protected.
- Use `api_key_type` to select the corresponding UI: display the personal balance for `personal` and the member quota for `team`.
- For a team API Key, display the team balance only when `team_balance` is present. If this field is absent, the caller is not a team administrator.
- For a team API Key, use `quota_limit_type` to determine whether to display the quota limit and reset interval. Do not infer an unlimited quota from a numeric value of `0`.
- Cache the latest successful response and refresh it at an interval appropriate for the product to reduce the risk of triggering rate limits.
