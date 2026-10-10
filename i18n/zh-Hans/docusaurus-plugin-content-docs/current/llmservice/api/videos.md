# 视频生成 API

视频 API 支持文本、图片参考和视频参考生成视频，采用异步处理方式：

**创建任务 → 查询状态 → 下载视频。**

## 准备工作

### 接口地址

```text
https://api.b.ai
```

### 鉴权

三个接口均需携带 API Key：

```http
Authorization: Bearer YOUR_API_KEY
```

支持个人 API Key 和 Team API Key。查询和下载时，请使用创建任务时的身份。

### 模型名称

| 模型 | 请求中的 `model` |
|---|---|
| Seedance 2.0 | `seedance-2.0` |
| Seedance 2.0 Fast | `seedance-2.0-fast` |
| Seedance 2.0 Mini | `seedance-2.0-mini` |
| Seedance 2.5 | `seedance-2.5` |

实际可调用的模型以当前账户开放范围为准。

以下示例使用环境变量：

```bash
export BAI_API_KEY="YOUR_API_KEY"
```

## 1. 创建视频任务

```http
POST https://api.b.ai/v1/videos
```

提交 JSON 请求，成功受理后返回任务 ID。视频在后台生成，不会在本次请求中直接返回。

### 请求示例：文生视频

```bash
curl https://api.b.ai/v1/videos \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "seedance-2.0-mini",
    "content": [
      {
        "type": "text",
        "text": "清晨海浪缓缓涌上海滩，固定镜头，阳光柔和，无字幕。"
      }
    ],
    "duration": 4,
    "resolution": "480p",
    "ratio": "16:9",
    "generate_audio": true,
    "watermark": false
  }'
```

### 主要参数

| 参数 | 类型 | 说明 |
|---|---|---|
| `model` | string | 必填，模型名称 |
| `content` | array | 输入内容，包括文本和可选参考素材 |
| `duration` | integer | 视频时长，单位秒；建议明确填写 |
| `resolution` | string | 分辨率，省略时使用 `720p` |
| `ratio` | string | 画面比例，例如 `16:9`；图片参考可按模型能力使用 `adaptive` |
| `generate_audio` | boolean | 是否生成音频，省略时使用 `true` |
| `watermark` | boolean | 是否添加水印 |
| `return_last_frame` | boolean | 是否请求返回尾帧图片 |

模型参数范围：

| 模型 | 分辨率 | 指定时长 |
|---|---|---|
| `seedance-2.0` | `480p`、`720p`、`1080p`、`4k` | 4–15 秒 |
| `seedance-2.0-fast` | `480p`、`720p` | 4–15 秒 |
| `seedance-2.0-mini` | `480p`、`720p` | 4–15 秒 |
| `seedance-2.5` | `480p`、`720p`、`1080p` | 4–30 秒 |

具体素材组合仍需符合对应模型要求。

### 图片参考

在 `content` 中添加图片项：

```json
{
  "type": "image_url",
  "image_url": {
    "url": "https://your-domain.com/first-frame.png"
  },
  "role": "first_frame"
}
```

使用首尾帧时，分别提供两张图片，并设置 `role` 为 `first_frame` 和 `last_frame`。

### 视频参考

在 `content` 中添加视频项：

```json
{
  "type": "video_url",
  "video_url": {
    "url": "https://your-domain.com/reference.mp4"
  },
  "role": "reference_video"
}
```

参考素材应提前上传至上游可访问的存储，URL 在生成期间保持有效。当前接口不提供素材上传服务。

### 兼容现有请求格式

已有调用方可以继续使用 `prompt` 和 `metadata`：

```json
{
  "model": "seedance-2.0-mini",
  "prompt": "清晨海浪缓缓涌上海滩，阳光柔和。",
  "seconds": 4,
  "metadata": {
    "resolution": "480p",
    "ratio": "16:9",
    "generate_audio": true,
    "watermark": false
  }
}
```

建议选择一种格式填写。同一参数同时出现在顶层和 `metadata` 时，应保持值一致。

### 创建响应

首次成功受理通常返回 `202 Accepted`。以下为主要字段示例：

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

保存响应中的 `id`，用于后续查询和下载。`202` 表示进入异步处理，不代表已经生成成功。

### 重复提交与重试

每次提交都可能创建独立任务并产生费用。取得任务 ID 后，请查询原任务，不要重复创建。

## 2. 查询视频任务

```http
GET https://api.b.ai/v1/videos/{task_id}
```

### 请求示例

```bash
export TASK_ID="task_example_001"

curl "https://api.b.ai/v1/videos/${TASK_ID}" \
  -H "Authorization: Bearer ${BAI_API_KEY}"
```

### 成功响应

以下为主要字段示例：

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

如果请求了尾帧且上游返回对应结果，`metadata` 中还会包含 `last_frame_url`。

### 状态说明

| `status` | 说明 |
|---|---|
| `queued` | 排队中 |
| `in_progress` | 生成中 |
| `completed` | 生成成功且结算完成，可以下载 |
| `failed` | 任务失败，查看 `error` |
| `unknown` | 状态尚未确认，继续核对原任务 |

建议每 **5–10 秒**查询一次。不要仅通过 `progress: 100` 判断成功。

任务失败时，查询接口仍可能返回 HTTP `200`，需读取响应中的 `status`。以下为失败响应的主要字段示例：

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

失败原因以实际响应为准。`released` 表示预占额度已释放；释放过程可能异步完成。

如果 `billing_status` 为 `review`，请保留任务 ID 联系平台核对，不要自动重新创建视频。

## 3. 下载视频

```http
GET https://api.b.ai/v1/videos/{task_id}/content
```

当查询结果为 `status: completed` 且 `billing_status: settled` 时，可以下载。

### 请求示例

```bash
curl --fail --location \
  "https://api.b.ai/v1/videos/${TASK_ID}/content" \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  --output video.mp4
```

成功响应为视频二进制文件，默认格式为 MP4。

下载同样需要鉴权。平台代理读取上游文件，不提供视频永久保存服务，建议生成完成后及时下载至自己的存储。

## 用量与计费

- 创建前预占额度，生成完成后按上游实际 `total_tokens` 结算。
- 单价按**模型、分辨率、是否包含参考视频**匹配，并应用对应分组倍率。
- 只有图片输入，属于“不含参考视频”；包含有效 `video_url`，属于“包含参考视频”。
- 预占额度不等于最终费用。
- 查询和下载不会新增视频生成费用。

标准参考单价见[视频模型价格总表](../video-models/pricing.md)。

## 常见错误

| HTTP 状态码 | 常见原因 |
|---|---|
| `400` | 请求参数或内容格式不正确 |
| `401` | API Key 无效或已过期 |
| `402` | 平台钱包可用额度不足 |
| `403` | 权限或 Team 成员额度受限 |
| `404` | 任务不存在或当前身份无权访问 |
| `409` | 幂等请求冲突，或下载时尚未完成结算 |
| `429` | 请求受到限流 |
| `502` / `503` | 上游或平台服务暂时异常 |

例如：

```json
{
  "error": {
    "type": "video_error",
    "message": "insufficient video credits"
  }
}
```

该错误表示平台预占视频费用时可用额度不足。

网络超时或暂时异常时，已有任务 ID 的请求应优先查询原任务。未取得任务 ID 时，请先核对是否已创建成功，避免直接重发造成重复生成和计费。
