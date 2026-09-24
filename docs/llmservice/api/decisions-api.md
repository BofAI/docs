# Decisions API

The Decisions API is used for classification, scoring, and yes/no judgments. It returns structured results and does not generate free-form text.

---

## 1. Prepare an API Key

Please log in to the API page to create an API Key.

---

## 2. Send a Decisions Request

Send a JSON request to:

```http
POST https://api.b.ai/v1/decisions
```

No query parameters are required. Set `Content-Type: application/json`. Only `POST` is supported; omit `stream` or set it to `false`.

### Authentication

Authenticate with an API key:

```http
Authorization: Bearer sk-your-api-key
```

The `x-api-key` header is also accepted:

```http
x-api-key: sk-your-api-key
```

### Request Example

```bash
curl --request POST "https://api.b.ai/v1/decisions" \
  --header "Authorization: Bearer sk-your-api-key" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "jev-latest",
    "state": {
      "message": "I paid yesterday, but the order is still unpaid.",
      "channel": "email"
    },
    "questions": {
      "needs_support": {
        "type": "noul",
        "instructions": "Does this require human support?"
      },
      "category": {
        "type": "choice",
        "instructions": "Choose the issue category.",
        "criteria": {
          "payment": "Payment",
          "delivery": "Delivery",
          "other": null
        }
      },
      "urgency": {
        "type": "score",
        "instructions": "Rate urgency.",
        "criteria": ["Low", "Medium", "High"]
      }
    }
  }'
```

Replace `sk-your-api-key` with your API Key.

### Request Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `model` | string | Yes | Only Jev models are supported. The model ID must be `jev-1.13.0` or `jev-latest`. |
| `state` | string, object, or array | Yes | The shared input evaluated by every question. Other JSON types, including `null`, numbers, and booleans, are rejected. |
| `questions` | object | Yes | A non-empty map of question IDs to question definitions. |

### Question fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| Question ID | non-empty string | Yes | The key in `questions`. It is also the key used in the response `answers` object. |
| `type` | string | Yes | One of `noul`, `choice`, or `score`. |
| `instructions` | string, object, or array | Yes | The instruction for evaluating this question. |
| `criteria` | object or array | Depends on `type` | The allowed labels or ordered score levels. See the type-specific rules below. |

Question IDs must not be empty or consist only of whitespace. `instructions` must be a JSON string, object, or array.

### `noul` questions

Use `noul` for a yes/no judgment. `noul` is the model's estimated probability that the answer is "yes". Values close to `0` lean toward "no", values close to `1` lean toward "yes", and values close to `0.5` indicate uncertainty; it is not a degree score. `criteria` may be omitted. If it is provided, it must be an object whose only permitted keys are `"true"` and `"false"`. Either key may be omitted, and an empty object is accepted. Each supplied description must be a string, object, or array; `null`, numbers, and booleans are rejected. The `criteria` field itself cannot be `null`.

```json
{
  "is_greeting": {
    "type": "noul",
    "instructions": "Is this message a greeting?",
    "criteria": {
      "true": "The message is a greeting.",
      "false": "The message is not a greeting."
    }
  }
}
```

### `choice` questions

Use `choice` when the answer must be one of a fixed set of labels. `criteria` is required and must be an object containing 1 to 255 options. Each key is an option identifier. An option description may be `null`, a string, an object, or an array.

```json
{
  "language": {
    "type": "choice",
    "instructions": "Which language is used?",
    "criteria": {
      "en": "English",
      "zh": "Chinese",
      "other": null
    }
  }
}
```

### `score` questions

Use `score` for an evaluation across ordered levels. The returned score is a probability-weighted value and may fall between levels; it is not restricted to an integer index. `criteria` is required and must be an array with 2 to 10 items. Each level must be a string, object, or array; `null` is not allowed.

The first level has index `0`, the second has index `1`, and so on.

```json
{
  "quality": {
    "type": "score",
    "instructions": "Rate the answer quality.",
    "criteria": [
      "Poor",
      "Acceptable",
      "Excellent"
    ]
  }
}
```

---

## 3. Understand the Response

HTTP `200` returns the result directly as JSON, with `model`, `answers`, and `usage` at the top level. The following values are illustrative:

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "needs_support": {
      "type": "noul",
      "noul": 0.96
    },
    "category": {
      "type": "choice",
      "choice": "payment",
      "confidence": 0.94,
      "probabilities": {
        "payment": 0.94,
        "delivery": 0.03,
        "other": 0.03
      }
    },
    "urgency": {
      "type": "score",
      "score": 1.85,
      "confidence": 0.87,
      "probabilities": {
        "0": 0.02,
        "1": 0.11,
        "2": 0.87
      },
      "legend": {
        "0": "Low",
        "1": "Medium",
        "2": "High"
      }
    }
  },
  "usage": {
    "input_tokens": 123,
    "output_tokens": 45
  }
}
```

---

## Response Fields

| Field | Type | Description |
| --- | --- | --- |
| `model` | string | Required, non-empty model name. |
| `answers` | object | Must contain exactly one answer for every request question. |
| `answers.<id>.type` | string | Must match the corresponding question type. |
| `answers.<id>.noul` | number | Required for `noul`; must be between `0` and `1`. |
| `answers.<id>.choice` | string | Required for `choice`; must be one of the keys in that question's `criteria`. |
| `answers.<id>.score` | number | Required for `score`; must be between `0` and the last criteria index, including fractional values. |
| `answers.<id>.confidence` | number | Required for `choice` and `score`; must be between `0` and `1`. `confidence` is a confidence metric calculated from the answer probability distribution. It cannot be directly interpreted as answer accuracy and should not be calculated independently as the maximum option probability. `noul` does not return a separate `confidence`. |
| `answers.<id>.probabilities` | object | Required for `choice` and `score`; must contain exactly the option keys or string level indices for that question, with values between `0` and `1`. The values must sum to `1` within a tolerance of `0.0001`. |
| `answers.<id>.legend` | object | Required for `score`; must contain exactly the string level indices, each mapped to a non-null string description. |
| `usage` | object | Required token usage reported by the provider. |
| `usage.input_tokens` | non-negative integer | Required for settlement and quota accounting. |
| `usage.output_tokens` | non-negative integer | Required for settlement and quota accounting. |

Both usage fields are required, and their sum must not exceed `2147483647`. Responses larger than 16 MiB are rejected. Invalid answers or usage result in an error rather than a successful result with estimated usage.

In this example, `urgency.score` is `0 × 0.02 + 1 × 0.11 + 2 × 0.87 = 1.85`.

---

## Usage and Billing

`usage.input_tokens` and `usage.output_tokens` are the token counts used for final quota settlement.

Balances and quotas follow the existing personal, subscription, and team billing rules. You can inspect available balance or quota with the [Balance API](https://docs.b.ai/llmservice/api/balance/); a balance lookup does not reserve funds or guarantee that a later decisions request will succeed.

---

## Rate Limits

Personal API Keys are subject to the top-up status rate limiter. A valid per-user RPM setting takes precedence over the configured defaults. Team API Keys bypass this personal limiter but remain subject to team quota rules and upstream capacity limits.

HTTP `429` may have an empty or non-JSON body. Handle the HTTP status before attempting to parse JSON. For temporary rate limits or overload, retry with bounded exponential backoff.

---

## Error Responses

### Authentication and Request Errors

Authentication failures normally return HTTP `401` in this form:

```json
{
  "error": {
    "message": "<authentication failure message>",
    "type": "api_error",
    "code": ""
  }
}
```

Request validation and relay failures also normally use an `error` object. Its `message`, `type`, and `code` depend on the failure; additional fields may be present. Messages can include a request ID. Do not match the full message text to determine the error category.

For API Credit billing, balance/quota failures can return `400` with codes such as `insufficient_user_quota`, `insufficient_team_balance`, or `team_quota_limit_reached`. Inspect `error.code` as well as the HTTP status before deciding whether the request parameters need correction.

---

## Integration Guidance

- Send requests from a backend that can protect the API Key.
- Put shared context in `state` and each evaluation instruction in `questions`. Match answers by question ID, not object order. Questions within the same request are evaluated independently; one question cannot reference another question's answer. If questions depend on one another, split them into multiple requests or combine the results in application code.
- Read `noul` as a numeric judgment and `score` as a potentially fractional value. Choose decision thresholds that fit your application.
- Use `usage.input_tokens` and `usage.output_tokens` for recorded token usage; avoid assuming a fixed price or output-token rate.
- Check the HTTP status and response shape before reading `answers`. Keep the request ID when troubleshooting.
- Use bounded retries for transient errors. The endpoint provides no provider idempotency guarantee; retrying after a timeout may repeat upstream work.
