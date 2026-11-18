# MiniMax 图像生成 API

B.AI 图像 API 支持文生图与参考图编辑，同步返回生成结果：

**提交请求 → 读取响应 → 下载图片。**

开启 `stream` 后，图片按完成顺序逐张推送，不必等待整批结束。

本文档介绍 **MiniMax-H3-Image** 与 **MiniMax-H3-Image-Highspeed** 的调用方式。模型能力与标准价格见[共用详情页](../image-models/minimax-h3-image.md)。

## 准备工作

### 接口地址

```text
https://api.b.ai
```

### 鉴权

所有接口均需携带 API Key：

```http
Authorization: Bearer YOUR_API_KEY
```

支持个人 API Key 和 Team API Key。

以下示例使用环境变量：

```bash
export BAI_API_KEY="YOUR_API_KEY"
```

图像生成会产生费用，请确保账户余额充足。

### 模型名称

| 模型 | 请求中的 `model` |
| --- | --- |
| MiniMax-H3-Image | `minimax-h3-image` |
| MiniMax-H3-Image-Highspeed | `minimax-h3-image-highspeed` |

`minimax-h3-image-highspeed` 是 `minimax-h3-image` 的高速版本，参数与限制完全一致，仅切换 `model` 字段。


实际可调用的模型以当前账户开放范围为准，可通过 `GET https://api.b.ai/v1/models` 查询当前 API 凭证关联的模型 ID。

## 1. 创建图像任务（文生图）

```http
POST https://api.b.ai/v1/images/generations
```

提交 JSON 请求，服务端同步生成并返回结果。**服务端最长等待 600 秒，请将客户端超时设置为不小于 600 秒。**

### 请求示例

```bash
curl https://api.b.ai/v1/images/generations \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "minimax-h3-image",
    "prompt": "一只橘猫躺在窗台上晒太阳，午后暖光，胶片质感",
    "size": "2720x1536",
    "n": 1,
    "response_format": "url"
  }'
```

### 主要参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `model` | string | 必填，模型名称 |
| `prompt` | string | 必填，画面描述，最长 32000 字符；空或仅空白内容返回 `400` |
| `n` | integer | 生成图片数量，取值 1–10，默认 `1` |
| `size` | string | 输出尺寸，默认 `auto`；与 `aspect_ratio` / `area` 互斥，见下文「输出尺寸」 |
| `aspect_ratio` | string | 画面比例，默认 `auto`；`X:Y` 中 X、Y 为 1–300 的整数，比例需在 1:3 ~ 3:1 之间（闭区间） |
| `area` | string | 面积档位 `1K` / `2K` / `4K`，默认 `4K`；仅在 `size` 为 `auto` 或省略时可设置 |
| `output_format` | string | `jpeg`（默认）/ `jpg` / `png` / `webp`；`jpg` 等价于 `jpeg`，响应中统一返回 `jpeg` |
| `response_format` | string | `url`（默认）/ `b64_json`；`b64_json` 不支持流式 |
| `output_compression` | integer | 压缩质量，取值 0–100，默认 `95`；仅对 `jpeg` / `webp` 生效，`png` 忽略该参数 |
| `disable_prompt_enhanced` | boolean | 是否关闭提示词增强，默认 `false`（开启） |
| `stream` | boolean | 是否流式返回，默认 `false` |

### 输出尺寸

尺寸有两种写法，只能二选一。设置 `size` 为 `WIDTHxHEIGHT` 时再传 `aspect_ratio` 或 `area`（哪怕是 `auto`）会返回 `400`。

**宽高模式：**

```json
{ "size": "2720x1536" }
```

面积（宽 × 高）需在 655,360 ~ 20,000,000 像素之间，比例在 1:3 ~ 3:1 之间（闭区间），否则返回 `400`。**尺寸不会被缩放或取整**，不符合即报错。

**比例 + 面积档位模式：**

```json
{ "aspect_ratio": "16:9", "area": "2K" }
```

`area` 的目标面积分别为 1024 × 1024、2048 × 2048、4096 × 4096 像素，服务端按比例换算实际宽高。各比例下的实际输出尺寸：

| <span style={{whiteSpace: 'nowrap'}}>画面比例</span> | `1K` | `2K` | `4K` |
| --- | --- | --- | --- |
| 1:1 | `1024x1024` | `2048x2048` | `4096x4096` |
| 4:3 / 3:4 | `1184x880` / `880x1184` | `2368x1760` / `1760x2368` | `4736x3552` / `3552x4736` |
| 16:9 / 9:16 | `1360x768` / `768x1360` | `2720x1536` / `1536x2720` | `5472x3072` / `3072x5472` |
| 3:1 / 1:3 | `1776x592` / `592x1776` | `3552x1184` / `1184x3552` | `7104x2368` / `2368x7104` |

每张图片的实际尺寸见响应中的 `data[].size`。

### 提示词增强

文生图默认开启提示词增强，服务端会改写并扩写 prompt，实际使用的提示词在 `data[].revised_prompt` 中返回。

- `disable_prompt_enhanced: true`：直接使用原始 `prompt`，此时必须显式给出宽高（`size` 为 `WIDTHxHEIGHT`），或给出固定比例（`size` 为 `auto`/省略且 `aspect_ratio` 为 `X:Y`），否则返回 `400`。
- 关闭增强后，模型仅读取前约 4096 个 token，其余内容不生效。
- 调优流程：取 `revised_prompt`，自行修改后作为新请求的 `prompt`，并设置 `disable_prompt_enhanced: true`，即可复用或调整增强后的提示词，但不保证生成完全相同的图片。

### 创建响应

返回 `200`，`data` 始终包含 `n` 个元素，顺序与请求一致。以下示例展示 **`n=2` 时一张成功、一张失败**的响应：

```json
{
  "created": 1792308678,
  "data": [
    {
      "url": "https://example.com/h3-image/output-0.jpg",
      "size": "2720x1536",
      "revised_prompt": "午后的暖光穿过木质窗框落在窗台上，一只橘猫侧躺着晒太阳，半眯着眼睛，毛发边缘泛着金色光泽，背景是虚化的室内绿植，胶片颗粒，柔和暖色调"
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

响应体中的 `request_id` 为上游生成标识。**反馈问题时请提供响应头 `X-Oneapi-Request-Id`**，平台流水与日志均以此为准，每个响应都会携带。

### 部分失败

只要有任意一张图生成成功，接口就返回 `200`。`data` 中失败的元素（含被内容安全拦截的图）只包含 `error` 字段，没有 `url`。实际成功数量见 `usage.generated_images`，**只有成功产出的图片计费**。

全部失败时返回错误响应，并附带逐图失败原因与 `usage`：

- `422`：全部图片未通过内容安全检查
- `500`：其他原因

### 重复提交与重试

该接口**不是幂等接口**。请求一旦发出，B.AI 会完成生成并按实际成功的图片结算，即使客户端超时或断开；重试会再次生成并再次扣费。

网络超时或暂时异常时，不要直接重发。推荐做法：

- 使用 OpenAI SDK 时设置 `max_retries=0`，关闭默认自动重试；
- 自行记录响应头 `X-Oneapi-Request-Id` 与业务侧任务标识，先确认上一笔是否已扣费，再决定是否补发。

## 2. 参考图编辑

```http
POST https://api.b.ai/v1/images/edits
```

在文生图的基础上传入 1–16 张参考图，可对主体、场景、风格等进行编辑。除提示词增强行为外，其余参数与文生图一致。

### 请求示例

```bash
curl https://api.b.ai/v1/images/edits \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "minimax-h3-image",
    "prompt": "把图 1 中的猫替换成图 2 中的柴犬，保持背景不变",
    "images": [
      { "image_url": "https://example.com/cat.jpg" },
      { "image_url": "https://example.com/dog.png" }
    ],
    "size": "auto",
    "response_format": "url"
  }'
```

也支持 `multipart/form-data`，与 OpenAI SDK 的 `images.edit` 兼容，文件上传顺序即图片序号（图 1、图 2……），prompt 中可用「图 1」「图 2」引用。

### 参考图限制

| 项目 | 限制 |
| --- | --- |
| 格式 | JPG、JPEG、PNG、WEBP、HEIC、HEIF |
| 单文件大小 | ≤ 64 MiB |
| 请求体总大小 | ≤ 64 MiB |
| 宽高范围 | \[128, 8192] px |
| 长短边比例 | ≤ 4:1 |
| 数量 | 1 ~ 16 |

`images[].image_url` 支持三种来源：

- 公网可访问的 URL（推荐）；
- `mm_file://{file_id}`，引用已上传文件的标识；
- `data:image/<format>;base64,<Base64>` data URI（`<format>` 小写）。

Base64 编码后体积约为原文件的 4/3，请求体容易触顶。**请求体可能超过 64 MiB 时，请改用公网 URL 或 `mm_file://`。**

### 上传参考图

使用 `mm_file://` 前，先通过文件上传接口传入参考图，`purpose` 固定为 `image_generation_input`，再用返回的 `file_id` 拼出 `mm_file://{file_id}`。

```bash
curl https://api.b.ai/v1/files/upload \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -F "purpose=image_generation_input" \
  -F "file=@cat.jpg"
```

### 与文生图的差异

- `images` 为必填项。
- **始终开启提示词增强**，不支持 `disable_prompt_enhanced`。
- `aspect_ratio` 为 `auto` 时，由提示词增强结合参考图内容决定。
- 提示词增强的 token 计入 `usage.input_tokens_details.text_tokens`。

## 3. 流式输出

在文生图或参考图编辑请求中设置 `stream: true`，服务端以 SSE（`text/event-stream`）逐张推送结果。**仅支持 `response_format: "url"`。**

### 请求示例

```bash
curl -N https://api.b.ai/v1/images/generations \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "minimax-h3-image",
    "prompt": "一只橘猫躺在窗台上晒太阳，午后暖光，胶片质感",
    "size": "2720x1536",
    "n": 3,
    "stream": true
  }'
```

### 事件类型

| 事件 | 说明 |
| --- | --- |
| `<prefix>.partial_succeeded` | 单张图片生成成功，携带 `image_index`、`url`、`size`、`output_format`、`revised_prompt` |
| `<prefix>.partial_failed` | 单张图片失败，携带 `image_index`、`code`、`message` |
| `<prefix>.completed` | 全部结束且至少一张成功，携带 `usage` 与 `request_id` |
| `error` | 无任何图片成功（含提交生成前失败），不计费，`usage` 各字段均为 0 |

`<prefix>` 在文生图为 `image_generation`，在参考图编辑为 `image_edit`。

事件按完成顺序推送，用 `image_index`（从 0 开始，范围 `[0, n-1]`）对应图片。等待期间服务端每 15 秒发送一行 `: keepalive` 注释，客户端可直接忽略。

**解析 SSE 前先判断 HTTP 状态码**：响应头发出之前的错误（参数非法、鉴权失败、限流、余额不足）仍以常规 HTTP 错误返回，不会以 `error` 事件形式出现。

## 4. 下载图片

响应中的 `url` 需要自行下载并转存，**平台不保证链接长期有效**。生成后请及时保存到自己的存储。

```bash
curl --fail --location \
  "https://example.com/h3-image/output-0.jpg" \
  --output output-0.jpg
```

若使用 `response_format: "b64_json"`，则直接在 `data[].b64_json` 中拿到 Base64 数据，无需额外下载。该方式不支持流式，且受总面积限制：

| `output_format` | `b64_json` 总面积上限 | 示例 |
| --- | --- | --- |
| `png` | 20,000,000 px | 1 张任意尺寸图片 |
| `jpeg` / `webp` | 80,000,000 px | 4 张 4K，或 10 张 2K |

超出上限返回 `400`，建议改用 `url`。

## OpenAI SDK 兼容

两个接口均兼容 OpenAI SDK，只需把 `base_url` 指向 B.AI：

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.b.ai/v1",
    api_key=os.environ["BAI_API_KEY"],
    timeout=600,
    max_retries=0,  # 接口非幂等：关闭自动重试，避免重复生成与扣费
)

result = client.images.generate(
    model="minimax-h3-image",
    prompt="一只橘猫躺在窗台上晒太阳，午后暖光，胶片质感",
    size="2720x1536",
    response_format="url",
)

for i, item in enumerate(result.data):
    print(i, item.url)  # 失败的图片 url 为 None
```

## 用量与限流

### 用量

- 用量统计在响应的 `usage` 字段中，**只计入成功生成的图片**，失败或被安全拦截的图片不计入。
- `input_tokens` 为文本提示词与参考图消耗的输入 token，`output_tokens` 为生成图片消耗的输出 token，`total_tokens` 为两者之和。
- 提示词增强消耗的输入 token 计入 `usage.input_tokens`，**按张数计（`n` 张计 `n` 次）**。实际计费用量以响应中的 `usage` 为准，仅统计成功生成的图片。

两个模型的 Token 单价详见[图像生成模型定价](../image-models/pricing.md)。

### 限流

图像接口按**账户**限流，**按请求次数**计：

| 项目 | 限额 |
| --- | --- |
| 每个账户每分钟请求数 | 16 |

两个 MiniMax 模型与 GPT-Image-2 **共用**这一配额。

请求次数与 `n` 无关，`n=10` 仍算 1 次请求。触发限流时返回 `429`（`code: persistent_image_rate_limited`），请降低请求频率后重试。

## 常见错误

错误分两层：平台接口级错误以 HTTP 状态码返回；单张图片的失败原因通过 `data[].error` 返回。

### 平台接口级错误

| HTTP 状态码 | 常见原因 |
| --- | --- |
| `400` | 请求参数不合法、携带了本文档未列出的参数、余额不足 |
| `401` | API Key 无效或已过期 |
| `403` | 权限或 Team 成员额度受限 |
| `404` | 端点或模型不存在，或当前身份无权访问 |
| `429` | 请求次数超限 |
| `500` | 服务端异常 |
| `502` / `503` | 服务暂时异常 |

`400` 常见的两类细分：

| 错误标识 / 提示 | 含义 | 处理建议 |
| --- | --- | --- |
| `unknown image parameter`（错误提示） | 携带了本文档未列出的参数（例如 `seed`） | 移除该参数后重试 |
| `code: insufficient_user_quota` | 账户余额不足 | 充值后重试 |

错误响应采用统一结构：

```json
{
  "error": {
    "code": "",
    "message": "Invalid token (request id: 2026111307415255722563c955d568zj7buxCT)",
    "type": "api_error"
  }
}
```

**反馈问题时请提供响应头 `X-Oneapi-Request-Id`**，平台流水与日志均以此为准。部分错误（如 `429`）的 `message` 中不含 request id。

### 单张图片级错误

`data[].error.code` 为单张图片的错误码，常见值如下：

| 错误码 | 含义 | 处理建议 |
| --- | --- | --- |
| `1000` | 未知错误 / 服务端异常 | 稍后重试 |
| `1001` | 请求超时 | 稍后重试 |
| `1026` | 输入内容被判定为敏感 | 修改输入内容 |
| `1027` | 输出图片被判定为敏感 | 修改输入内容 |
| `2013` | 参数非法 | 检查请求参数 |

**失败重试建议**：图像接口不是幂等接口，重试会重新生成并重新扣费。发生超时或网络异常时，先确认上一笔是否已产生费用，再决定是否重发；只应重试 5xx 与明确的限流错误，参数错误（`400`）、鉴权错误（`401`）、余额不足（`400`）、安全检查错误（`422`）重试无意义。
