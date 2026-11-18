# MiniMax Image Generation API

B.AI's image API supports text-to-image generation and reference-image editing, returning results synchronously:

**Send a request -> Read the response -> Download the images.**

With `stream` enabled, images are sent individually as they finish, without waiting for the entire batch.

This reference covers **MiniMax-H3-Image** and **MiniMax-H3-Image-Highspeed**. For capabilities and standard prices, see the [shared model detail page](../image-models/minimax-h3-image.md).

## Preparation

### API Host

```text
https://api.b.ai
```

### Authentication

All endpoints require a B.AI API Key:

```http
Authorization: Bearer YOUR_API_KEY
```

Personal and Team API Keys are supported. The examples use this environment variable:

```bash
export BAI_API_KEY="YOUR_API_KEY"
```

Image generation incurs charges. Ensure your account has sufficient balance.

### Model IDs

| Model | Request `model` |
| --- | --- |
| MiniMax-H3-Image | `minimax-h3-image` |
| MiniMax-H3-Image-Highspeed | `minimax-h3-image-highspeed` |

The Highspeed variant uses the same parameters and limits. Change only the `model` field to switch variants.

Available models depend on your account's access. Use `GET https://api.b.ai/v1/models` to list model IDs associated with your current API credential.

## 1. Generate Images from Text

```http
POST https://api.b.ai/v1/images/generations
```

Submit a JSON request. The server generates the images synchronously and returns the results. **The server may wait up to 600 seconds; set the client timeout to at least 600 seconds.**

### Request Example

```bash
curl https://api.b.ai/v1/images/generations \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "minimax-h3-image",
    "prompt": "An orange cat resting on a windowsill in warm afternoon sunlight, with a film-like texture.",
    "size": "2720x1536",
    "n": 1,
    "response_format": "url"
  }'
```

### Main Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `model` | string | Required model ID. |
| `prompt` | string | Required image description, up to 32,000 characters. Empty or whitespace-only prompts return `400`. |
| `n` | integer | Number of images, from 1 to 10. Defaults to `1`. |
| `size` | string | Output dimensions; defaults to `auto`. Explicit dimensions cannot be combined with `aspect_ratio` or `area`; see Output Size below. |
| `aspect_ratio` | string | Defaults to `auto`. In `X:Y`, X and Y must be integers from 1 to 300, and the ratio must be between 1:3 and 3:1, inclusive. |
| `area` | string | Area preset: `1K`, `2K`, or `4K`. Defaults to `4K`. Only allowed when `size` is `auto` or omitted. |
| `output_format` | string | `jpeg` (default), `jpg`, `png`, or `webp`. `jpg` is equivalent to `jpeg`; the response uses `jpeg`. |
| `response_format` | string | `url` (default) or `b64_json`. `b64_json` does not support streaming. |
| `output_compression` | integer | Compression quality from 0 to 100; defaults to `95`. Applies to `jpeg` and `webp`; ignored for `png`. |
| `disable_prompt_enhanced` | boolean | Whether to disable prompt enhancement. Defaults to `false`, so enhancement is enabled. |
| `stream` | boolean | Whether to stream results. Defaults to `false`. |

### Output Size

Choose one of the following modes. When `size` is `WIDTHxHEIGHT`, also providing `aspect_ratio` or `area`, even as `auto`, returns `400`.

**Explicit dimensions:**

```json
{ "size": "2720x1536" }
```

The total area (width times height) must be between 655,360 and 20,000,000 pixels, and the aspect ratio must be between 1:3 and 3:1, inclusive. Invalid values return `400`. **Explicit dimensions are not resized or rounded.**

**Aspect ratio and area preset:**

```json
{ "aspect_ratio": "16:9", "area": "2K" }
```

The target areas are 1024 x 1024, 2048 x 2048, and 4096 x 4096 pixels. The server converts the selected ratio and area into dimensions:

| <span style={{whiteSpace: 'nowrap'}}>Aspect Ratio</span> | `1K` | `2K` | `4K` |
| --- | --- | --- | --- |
| 1:1 | `1024x1024` | `2048x2048` | `4096x4096` |
| 4:3 / 3:4 | `1184x880` / `880x1184` | `2368x1760` / `1760x2368` | `4736x3552` / `3552x4736` |
| 16:9 / 9:16 | `1360x768` / `768x1360` | `2720x1536` / `1536x2720` | `5472x3072` / `3072x5472` |
| 3:1 / 1:3 | `1776x592` / `592x1776` | `3552x1184` / `1184x3552` | `7104x2368` / `2368x7104` |

The actual dimensions of each image are returned in `data[].size`.

### Prompt Enhancement

Text-to-image generation enables prompt enhancement by default. The server rewrites and expands the prompt, returning the version used in `data[].revised_prompt`.

- With `disable_prompt_enhanced: true`, the original prompt is used. You must specify explicit dimensions (`size: "WIDTHxHEIGHT"`), or a fixed `aspect_ratio: "X:Y"` with `size` set to `auto` or omitted. Otherwise the request returns `400`.
- With enhancement disabled, only approximately the first 4,096 tokens of the prompt take effect.
- To reuse or refine an enhanced prompt, use `revised_prompt` as the next request's `prompt`, edit it as needed, and set `disable_prompt_enhanced: true`. This does not guarantee an identical image.

### Generation Response

A successful response returns HTTP `200`. `data` contains `n` elements in request order. The following example shows **partial success for a request with `n=2`**:

```json
{
  "created": 1792308678,
  "data": [
    {
      "url": "https://example.com/h3-image/output-0.jpg",
      "size": "2720x1536",
      "revised_prompt": "Warm afternoon sunlight falls through a wooden window onto an orange cat resting on the sill, with softly lit fur, blurred indoor plants, and subtle film grain."
    },
    {
      "error": {
        "code": "1027",
        "message": "output image failed content safety check"
      }
    }
  ],
  "output_format": "jpeg",
  "usage": {
    "generated_images": 1,
    "total_tokens": 7254,
    "input_tokens": 3174,
    "output_tokens": 4080,
    "input_tokens_details": {
      "text_tokens": 3174,
      "image_tokens": 0
    },
    "output_tokens_details": {
      "image_tokens": 4080
    }
  },
  "request_id": "021792308678142a2c883cf675b9804d"
}
```

The response body's `request_id` identifies the upstream generation. **When reporting a problem, provide the response header `X-Oneapi-Request-Id`**, which B.AI uses for request records and logs. Every response includes this header.

### Partial Failures

If at least one image succeeds, the endpoint returns `200`. Failed images, including those blocked by content safety checks, contain only `error`, not `url`. `usage.generated_images` reports the number of successful images. **Only successfully generated images are billed.**

If every image fails, the error response includes per-image failure reasons and `usage`:

- `422`: All images failed content safety checks.
- `500`: Other failures.

### Duplicate Requests and Retries

This endpoint is **not idempotent**. Once a request is sent, B.AI completes generation and bills successfully generated images even if the client times out or disconnects. Retrying creates another generation and may incur another charge.

Do not immediately resend a request after a network timeout or temporary error:

- When using the OpenAI SDK, set `max_retries=0` to disable automatic retries.
- Record the response header `X-Oneapi-Request-Id` and your application's task identifier. Check whether the earlier request incurred charges before deciding to resend it.

## 2. Edit Images Using References

```http
POST https://api.b.ai/v1/images/edits
```

Provide 1-16 reference images alongside a prompt to edit subjects, scenes, or styles. Apart from prompt enhancement behavior, parameters are the same as text-to-image generation.

### Request Example

```bash
curl https://api.b.ai/v1/images/edits \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "minimax-h3-image",
    "prompt": "Replace the cat in image 1 with the Shiba Inu from image 2, keeping the background unchanged.",
    "images": [
      { "image_url": "https://example.com/cat.jpg" },
      { "image_url": "https://example.com/dog.png" }
    ],
    "size": "auto",
    "response_format": "url"
  }'
```

The endpoint also accepts `multipart/form-data`, compatible with the OpenAI SDK's `images.edit`. File upload order determines the image numbers, which can be referenced in the prompt as "image 1", "image 2", and so on.

### Reference Image Limits

| Item | Limit |
| --- | --- |
| Formats | JPG, JPEG, PNG, WEBP, HEIC, HEIF |
| File size | Up to 64 MiB per image |
| Total request body | Up to 64 MiB |
| Width and height | 128-8192 pixels per side |
| Long-side to short-side ratio | Up to 4:1 |
| Number of images | 1-16 |

`images[].image_url` accepts:

- A publicly accessible URL (recommended).
- `mm_file://{file_id}`, referencing an uploaded file.
- A data URI: `data:image/<format>;base64,<Base64>`, with a lowercase `<format>`.

Base64 encoding increases file size to approximately 4/3 of the original. **If the request body may exceed 64 MiB, use public URLs or `mm_file://` references instead.**

### Upload Reference Images

Before using `mm_file://`, upload the reference image with `purpose` set to `image_generation_input`. Use the returned `file_id` to construct `mm_file://{file_id}`.

```bash
curl https://api.b.ai/v1/files/upload \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -F "purpose=image_generation_input" \
  -F "file=@cat.jpg"
```

### Differences from Text-to-Image Generation

- `images` is required.
- **Prompt enhancement is always enabled.** `disable_prompt_enhanced` is unsupported.
- With `aspect_ratio: "auto"`, prompt enhancement determines the ratio using the reference images and prompt.
- Prompt enhancement input tokens are included in `usage.input_tokens_details.text_tokens`.

## 3. Streaming Results

Set `stream: true` in a generation or edit request. The server sends individual results using SSE (`text/event-stream`). **Only `response_format: "url"` is supported.**

### Request Example

```bash
curl -N https://api.b.ai/v1/images/generations \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "minimax-h3-image",
    "prompt": "An orange cat resting on a windowsill in warm afternoon sunlight, with a film-like texture.",
    "size": "2720x1536",
    "n": 3,
    "stream": true
  }'
```

### Event Types

| Event | Description |
| --- | --- |
| `<prefix>.partial_succeeded` | One image succeeded; includes `image_index`, `url`, `size`, `output_format`, and `revised_prompt`. |
| `<prefix>.partial_failed` | One image failed; includes `image_index`, `code`, and `message`. |
| `<prefix>.completed` | Processing finished with at least one successful image; includes `usage` and `request_id`. |
| `error` | No images succeeded, including failures before generation starts. No charges apply and all `usage` fields are zero. |

`<prefix>` is `image_generation` for text-to-image generation and `image_edit` for editing.

Events arrive in completion order. Use `image_index`, starting at 0 and ranging from `[0, n-1]`, to identify the image. During processing, the server sends a `: keepalive` comment every 15 seconds; clients can ignore it.

**Check the HTTP status before parsing SSE.** Errors that occur before response headers are sent, such as invalid parameters, authentication failure, rate limiting, or insufficient balance, return regular HTTP error responses rather than an SSE `error` event.

## 4. Download Images

Download and store images returned in `url` yourself. **The platform does not guarantee that these URLs remain available long-term.** Save generated images promptly.

```bash
curl --fail --location \
  "https://example.com/h3-image/output-0.jpg" \
  --output output-0.jpg
```

With `response_format: "b64_json"`, the image data is returned directly in `data[].b64_json`, so no separate download is required. This mode does not support streaming and has total output-area limits:

| `output_format` | Maximum Total Area for `b64_json` | Example |
| --- | --- | --- |
| `png` | 20,000,000 pixels | One image of any supported size |
| `jpeg` / `webp` | 80,000,000 pixels | Four 4K images or ten 2K images |

Requests above these limits return `400`. Use `url` instead.

## OpenAI SDK Compatibility

Both image endpoints are compatible with the OpenAI SDK. Set `base_url` to B.AI:

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.b.ai/v1",
    api_key=os.environ["BAI_API_KEY"],
    timeout=600,
    max_retries=0,  # Avoid duplicate generation and charges on this non-idempotent API.
)

result = client.images.generate(
    model="minimax-h3-image",
    prompt="An orange cat resting on a windowsill in warm afternoon sunlight, with a film-like texture.",
    size="2720x1536",
    response_format="url",
)

for i, item in enumerate(result.data):
    print(i, item.url)  # Failed images have no URL.
```

## Usage and Rate Limits

### Usage

- The response's `usage` object counts **only successfully generated images**, excluding failed images and those blocked by safety checks.
- `input_tokens` includes text-prompt and reference-image input tokens. `output_tokens` counts generated-image output tokens; `total_tokens` is their sum.
- Prompt enhancement input tokens count toward `usage.input_tokens`, once per image (`n` images means `n` enhancement runs). Billing usage includes only successful images; refer to the response's actual `usage`.
- For both variants' token rates, see [Image Generation Model Pricing](../image-models/pricing.md).

### Rate Limits

Image endpoints are rate-limited **per account, by request count**:

| Item | Limit |
| --- | --- |
| Requests per minute per account | 16 |

Both MiniMax variants and GPT-Image-2 **share this quota**.

Request count does not depend on `n`: `n=10` still counts as one request. Exceeding the limit returns `429` with `code: persistent_image_rate_limited`. Reduce the request frequency before retrying.

## Common Errors

Errors have two levels: platform-level errors use HTTP status codes, while individual image failures appear in `data[].error`.

### Platform-Level Errors

| HTTP Status | Common Cause |
| --- | --- |
| `400` | Invalid parameters, parameters not listed in this reference, or insufficient balance |
| `401` | Invalid or expired API Key |
| `403` | Access restrictions or Team member quota limits |
| `404` | Endpoint or model does not exist, or the current identity lacks access |
| `429` | Request rate limit exceeded |
| `500` | Server error |
| `502` / `503` | Temporary service error |

Two common `400` errors:

| Error Identifier / Message | Meaning | Action |
| --- | --- | --- |
| `unknown image parameter` (message) | A parameter not listed here was sent, such as `seed` | Remove the parameter |
| `code: insufficient_user_quota` | Insufficient account balance | Recharge before retrying |

Error responses use this structure:

```json
{
  "error": {
    "code": "",
    "message": "Invalid token (request id: 2026111307415255722563c955d568zj7buxCT)",
    "type": "api_error"
  }
}
```

**When reporting a problem, provide the response header `X-Oneapi-Request-Id`**, which identifies B.AI's request records and logs. Some errors, including `429`, do not include a request ID in `message`.

### Individual Image Errors

`data[].error.code` identifies an individual image failure:

| Code | Meaning | Action |
| --- | --- | --- |
| `1000` | Unknown error / server error | Retry later |
| `1001` | Request timed out | Retry later |
| `1026` | Input blocked by content safety checks | Revise the input |
| `1027` | Output blocked by content safety checks | Revise the input |
| `2013` | Invalid parameters | Check the request parameters |

**Retry carefully:** Image requests are not idempotent. Resending creates a new generation and may incur new charges. After a timeout or network error, check whether the earlier request incurred charges before resending. Only retry 5xx responses and explicit rate-limit errors; retrying invalid parameters (`400`), authentication errors (`401`), insufficient balance (`400`), or safety rejections (`422`) without addressing their cause does not help.
