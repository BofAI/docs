# 在视频创作工具中使用 B.AI

将 B.AI API Key 配置到支持自定义供应商或插件的视频工具中，即可调用适配器支持的模型。本文以 Toonflow 为例介绍接入流程。

## 1. 准备 Key 和适配器

- 在 [B.AI 控制台](https://chat.b.ai/key)创建 API Key，并确认账户有可用额度。
- 安装 [Toonflow](https://github.com/HBAI-Ltd/Toonflow-app/releases)。
- 下载配套的 <a href="pathname:///downloads/video-tools/baiVideo.ts" autoAddBaseUrl={false} download="baiVideo.ts" target="_self">B.AI 视频供应商适配文件</a>。

适配器负责连接工具与 B.AI，处理模型参数、任务查询和结果下载。其他平台的插件不一定兼容 B.AI，不能只替换 Key 就直接使用。

## 2. 导入并配置 B.AI

1. 打开 Toonflow，进入 **设置（Settings）→ 媒体模型（Media models）→ 添加自定义供应商（Add custom provider）**。
2. 选择 **文件导入（File import）**，导入下载的 `.ts` 文件并确认添加。

![在 Toonflow 中导入自定义媒体供应商](/img/video-tools/toonflow-import-provider.png)

*图 1：英文界面的 File import，用于上传配套适配文件。*

3. 在新增的 B.AI 供应商中点击 **编辑模型（Edit model）**，填写以下配置并保存。

| 配置项 | 填写内容 |
| :--- | :--- |
| API Key | 你自己的 B.AI Key，无需添加 `Bearer` 前缀 |
| 请求地址 | `https://api.b.ai/v1` |
| 模型 ID | 使用 B.AI 文档公布、且当前适配器支持的模型 ID |

![在 Toonflow 中配置 B.AI API Key 和请求地址](/img/video-tools/toonflow-bai-settings.png)

*图 2：在 API Key 和 Base URL 中填写连接信息。截图中的模型仅为示例，不代表全部支持范围。*

> B.AI 上架新模型后，创作工具或适配器也需要支持该模型，才能在工具中使用。模型名称、输入素材和可用参数以当前文档及适配器说明为准。

## 3. 生成并保存视频

1. 新建项目，进入画布，添加 **视频生成**节点。
2. 选择 B.AI 供应商及所需模型，输入提示词。
3. 按模型支持范围选择时长、分辨率和比例。首次测试建议使用较短时长、较低分辨率。
4. 点击 **生成视频**，等待完成后预览并下载。

可先使用简单提示词：

```text
清晨的海边，海浪轻轻拍打沙滩，柔和阳光，固定镜头，无字幕。
```

![视频生成结果预览](/img/video-tools/video-preview-example.png)

*图 3：已生成视频的播放器截图，仅展示输出效果。不同模型的效果和参数可能不同。*

视频通常需要经过排队和生成。取得任务 ID 后，请继续查询原任务，不要反复点击生成；每次创建新任务都可能产生费用。

## 常见问题

| 问题 | 处理方式 |
| :--- | :--- |
| 找不到模型 | 检查当前适配器是否支持该模型，并确认模型配置已保存。 |
| 认证失败 | 检查 Key 是否完整、有效。查询和下载应使用创建任务时的身份。 |
| 额度不足 | 检查当前 Key 对应账户或团队的可用额度与权限。 |
| 超时或无法下载 | 保留任务 ID 和报错，先查询原任务状态，避免重复提交。 |

**使用 Agent 时：** 视频模型负责生成视频；如果需要 Agent 理解指令、编写剧本或规划分镜，还需单独配置文本模型。

**使用 ComfyUI 时：** 安装支持 B.AI 的自定义节点，按节点说明配置 Key 并导入工作流。支持的模型与操作由节点版本决定。

## 相关文档

- [使用 Codex 生成 Seedance 视频](./codex/seedance-video-guide.md)：通过 CC Switch 配置 B.AI，让 Codex 完成视频创建、查询和下载。
- [视频生成 API](./api/videos.md)：模型 ID、参数及调用方式。
- [视频生成模型定价](./video-models/pricing.md)：计费单位与价格。

请勿公开分享真实 API Key。
