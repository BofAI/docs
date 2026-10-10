# Video Generation API

The video API supports generation from text, image references, and video references. Processing is asynchronous:

**Create a task -> Query its status -> Download the video.**

## Preparation

### API Host

```text
https://api.b.ai
```

### Authentication

All three endpoints require an API Key:

```http
Authorization: Bearer YOUR_API_KEY
```

Personal and Team API Keys are supported. Use the same identity that created the task when querying or downloading it.

### Model IDs

| Model | Request `model` |
|---|---|
| Seedance 2.0 | `seedance-2.0` |
| Seedance 2.0 Fast | `seedance-2.0-fast` |
| Seedance 2.0 Mini | `seedance-2.0-mini` |
| Seedance 2.5 | `seedance-2.5` |

Available models depend on those enabled for your account.

The examples below use an environment variable:

```bash
export BAI_API_KEY="YOUR_API_KEY"
```

## 1. Create a Video Task

```http
POST https://api.b.ai/v1/videos
```

Submit a JSON request. A successfully accepted request returns a task ID. The video is generated in the background and is not returned in this request.

### Request Example: Text to Video

```bash
curl https://api.b.ai/v1/videos \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "seedance-2.0-mini",
    "content": [
      {
        "type": "text",
        "text": "Gentle morning waves wash onto a beach, with a fixed camera, soft sunlight, and no subtitles."
      }
    ],
    "duration": 4,
    "resolution": "480p",
    "ratio": "16:9",
    "generate_audio": true,
    "watermark": false
  }'
```

### Main Parameters

| Parameter | Type | Description |
|---|---|---|
| `model` | string | Required model ID |
| `content` | array | Input content, including text and optional reference media |
| `duration` | integer | Video duration in seconds; explicitly setting it is recommended |
| `resolution` | string | Resolution; defaults to `720p` when omitted |
| `ratio` | string | Aspect ratio, such as `16:9`; image-reference requests may use `adaptive` where supported by the model |
| `generate_audio` | boolean | Whether to generate audio; defaults to `true` when omitted |
| `watermark` | boolean | Whether to add a watermark |
| `return_last_frame` | boolean | Whether to request the final frame as an image |

Model parameter ranges:

| Model | Resolutions | Specified Duration |
|---|---|---|
| `seedance-2.0` | `480p`, `720p`, `1080p`, `4k` | 4-15 seconds |
| `seedance-2.0-fast` | `480p`, `720p` | 4-15 seconds |
| `seedance-2.0-mini` | `480p`, `720p` | 4-15 seconds |
| `seedance-2.5` | `480p`, `720p`, `1080p` | 4-30 seconds |

Reference media combinations must also meet the requirements of the selected model.

### Image References

Add an image item to `content`:

```json
{
  "type": "image_url",
  "image_url": {
    "url": "https://your-domain.com/first-frame.png"
  },
  "role": "first_frame"
}
```

For first-and-last-frame generation, provide two images with `role` set to `first_frame` and `last_frame`, respectively.

### Video References

Add a video item to `content`:

```json
{
  "type": "video_url",
  "video_url": {
    "url": "https://your-domain.com/reference.mp4"
  },
  "role": "reference_video"
}
```

Upload reference media to storage accessible to the upstream service, and keep the URLs valid throughout generation. This API does not provide a media-upload service.

### Existing Request Format Compatibility

Existing clients can continue using `prompt` and `metadata`:

```json
{
  "model": "seedance-2.0-mini",
  "prompt": "Gentle morning waves wash onto a beach, with soft sunlight.",
  "seconds": 4,
  "metadata": {
    "resolution": "480p",
    "ratio": "16:9",
    "generate_audio": true,
    "watermark": false
  }
}
```

Choose one format where possible. If the same parameter appears at the top level and in `metadata`, keep its values consistent.

### Creation Response

The initial successful acceptance typically returns `202 Accepted`. The following example shows the main fields:

```json
{
  "id": "task_example_001",
  "object": "video",
  "model": "seedance-2.0-mini",
  "status": "queued",
  "progress": 0,
  "created_at": 1791504000,
  "seconds": "4",
  "size": "480p",
  "metadata": {
    "billing_status": "reserved"
  }
}
```

Save the response `id` for status queries and downloads. `202` indicates asynchronous processing, not successful generation.

### Duplicate Submissions and Retries

Each submission may create a separate task and incur charges. Once you have a task ID, query that task instead of creating it again.

## 2. Query a Video Task

```http
GET https://api.b.ai/v1/videos/{task_id}
```

### Request Example

```bash
export TASK_ID="task_example_001"

curl "https://api.b.ai/v1/videos/${TASK_ID}" \
  -H "Authorization: Bearer ${BAI_API_KEY}"
```

### Success Response

The following example shows the main fields:

```json
{
  "id": "task_example_001",
  "object": "video",
  "model": "seedance-2.0-mini",
  "status": "completed",
  "progress": 100,
  "created_at": 1791504000,
  "completed_at": 1791504120,
  "seconds": "4",
  "size": "480p",
  "metadata": {
    "billing_status": "settled",
    "url": "/v1/videos/task_example_001/content"
  }
}
```

If a final frame was requested and returned by the upstream service, `metadata` also includes `last_frame_url`.

### Task Statuses

| `status` | Description |
|---|---|
| `queued` | Queued |
| `in_progress` | Generating |
| `completed` | Generation and settlement have completed; the video can be downloaded |
| `failed` | Task failed; check `error` |
| `unknown` | Status is not yet confirmed; continue checking the original task |

Query every **5-10 seconds**. Do not determine success from `progress: 100` alone.

A failed task may still return HTTP `200` from the query endpoint. Read the response `status`. The following example shows the main fields of a failed task:

```json
{
  "id": "task_example_001",
  "status": "failed",
  "error": {
    "code": "upstream_video_error",
    "message": "Reference media could not be accessed"
  },
  "metadata": {
    "billing_status": "released"
  }
}
```

Refer to the actual response for the failure reason. `released` means the reserved quota has been released; the release process may complete asynchronously.

If `billing_status` is `review`, retain the task ID and contact the platform for verification. Do not automatically create another video task.

## 3. Download the Video

```http
GET https://api.b.ai/v1/videos/{task_id}/content
```

Download when the query result shows both `status: completed` and `billing_status: settled`.

### Request Example

```bash
curl --fail --location \
  "https://api.b.ai/v1/videos/${TASK_ID}/content" \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  --output video.mp4
```

A successful response contains the binary video file, with MP4 as the default format.

Downloads also require authentication. The platform proxies the upstream file and does not provide permanent video storage. Download generated videos to your own storage promptly.

## Usage and Billing

- Quota is reserved before task creation. After generation completes, charges are settled using the upstream service's actual `total_tokens`.
- The rate depends on **model, resolution, and whether reference video is included**, with the applicable group multiplier applied.
- Image-only input is classified as having no reference video. Input containing a valid `video_url` is classified as including reference video.
- Reserved quota is not the final charge.
- Queries and downloads do not incur additional video-generation charges.

See [Video Model Pricing](../video-models/pricing.md) for standard reference rates.

## Common Errors

| HTTP Status | Common Cause |
|---|---|
| `400` | Invalid parameters or content format |
| `401` | Invalid or expired API Key |
| `402` | Insufficient available quota in the platform wallet |
| `403` | Permissions or Team member quota restrictions |
| `404` | Task not found or inaccessible to the current identity |
| `409` | Idempotency conflict, or settlement is not yet complete when downloading |
| `429` | Request rate limited |
| `502` / `503` | Temporary upstream or platform service error |

For example:

```json
{
  "error": {
    "type": "video_error",
    "message": "insufficient video credits"
  }
}
```

This error means insufficient quota was available when the platform attempted to reserve the video-generation charge.

After a network timeout or temporary error, query the original task if you have its ID. If no task ID was received, check whether a task was created before resubmitting, to avoid duplicate generation and charges.
