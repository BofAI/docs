import ActivityCard from '@site/src/components/ActivityCard';

# DeepSeek-V4-Flash-Vision-Exp

<ActivityCard
  variant="discount"
  title="DeepSeek-V4-Flash-Vision-Exp"
  status="API 限时折扣"
  detail="标准价 5 折"
>
DeepSeek-V4-Flash-Vision-Exp 5 折活动于 2026 年 9 月 3 日 17:00（UTC+8）正式生效。

自生效时间起，符合条件的 `deepseek-v4-flash-vision-exp` API 使用按对应闲时或忙时标准价的 50% 结算。活动价格随 DeepSeek 分时计费时段同步变化，各时段均保持 5 折。

下方价格表继续展示标准参考价，实际结算价格及最终账单以平台页面展示为准。
</ActivityCard>

## 概述

DeepSeek-V4-Flash-Vision-Exp 是 DeepSeek-V4 系列的首款实验性多模态模型，于 2026 年 8 月 21 日发布。该模型在 DeepSeek-V4-Flash 基础上增加视觉模块并继续进行图像理解训练，同时在 DeepSeek 的评测中保持了相近的纯文本智能体能力。

## 主要特性

- **原生图像理解**：支持以 JPEG、PNG、GIF 和 WebP 格式交错输入文本与图像，可用于读取截图、分析图表、视觉问答及其他基于图像的任务。
- **多模态智能体评测**：DeepSeek 公布的结果为 ApexBench（Pass@1）36.5、Chartography 64.3 和 ZeroBench（Pass@5）35.0，显示其视觉智能体能力较纯文本 DeepSeek-V4-Flash-0731 基线有所提升。
- **延续文本智能体能力**：DeepSeek 表示其纯文本能力与 DeepSeek-V4-Flash 相近，公布的成绩包括 Terminal-Bench 2.1 83.9、DeepSWE 59.3 和 Toolathlon-Verified 75.9。
- **长上下文推理**：托管 API 提供 1M Token 上下文窗口和最高 384K Tokens 输出，支持可选思考模式以及 `low`、`high` 或 `max` 推理强度。
- **面向智能体的 API 支持**：支持工具调用、JSON 输出、上下文缓存和 Chat Prefix Completion，同时支持 OpenAI 兼容的 Chat Completions、Responses 接口及 Anthropic 兼容的 Messages 接口。
- **开放权重参考版本**：官方 MIT License 仓库提供 305B 参数检查点，并包含视觉编码器与对齐器、DFlash Attention、混合专家层、Hyper-Connections 和 DSpark 前向路径的参考代码。

## 适用场景

- **视觉软件智能体**：结合工具检查截图、渲染后的界面、仪表盘或画布状态，并据此修改代码或其他内容。
- **文档和图表分析**：读取截图中的文本、理解图表，并根据视觉化的业务或技术资料回答问题。
- **多模态工具工作流**：通过 Responses API 处理工具返回的图像，将视觉证据与多步推理和函数调用结合。
- **大批量视觉审查**：在单次请求中处理多张图像，对截图、页面或帧集合执行一致的分析。
- **开放权重评测**：在能够承担大型检查点和参考运行环境要求的受控自托管环境中，测试 DeepSeek 实验性 V4 视觉架构。

## 能力与限制

| 能力 | 说明 |
| :--- | :--- |
| **推理** | 支持思考和非思考模式，思考模式默认使用 `high` 强度。主要推理强度为 `low`、`high` 和 `max`，兼容的 `medium` 与 `xhigh` 请求会映射为 `high`。 |
| **编程与智能体** | DeepSeek 公布的结果为 Terminal-Bench 2.1 83.9、DeepSWE 59.3 和 Toolathlon-Verified 75.9。这些厂商评测使用 DeepSeek Harness minimal 模式、`max` 强度、`temperature = 1.0` 和 `top_p = 0.95`。 |
| **工具调用** | 在思考和非思考模式下均支持函数调用，同时支持 JSON 输出、上下文缓存及 Responses API 中包含图像的工具输出。 |
| **多模态** | 支持文本与图像输入，输出为文本。每张图像会在推理前调整尺寸，最多占用 384 个输入 Tokens；在尺寸限制范围内，API 每次请求最多接受 600 张图像。 |
| **上下文窗口** | 1M Tokens。 |
| **最大输出** | 384K Tokens。 |

### 已知限制

- 图像可放置的位置取决于接口：Chat Completions 接受 `user` 消息中的图像；Responses API 还接受 `developer` 消息和受支持工具输出中的图像。`system` 或 `assistant` 消息中的图像会被拒绝。
- 已记录的多模态接口支持图像，但未说明支持音频、视频输入、图像生成或其他非文本输出。
- 不支持 FIM Completion，Chat Prefix Completion 仍为 Beta 功能。
- 在思考模式下，`temperature`、`top_p`、`presence_penalty` 和 `frequency_penalty` 不生效。包含工具调用的多轮请求需要在后续请求中完整回传此前的 `reasoning_content`。
- DeepSeek 未公布该模型专属的知识截止时间或完整语言支持列表。

## 价格

| 计费时段 | 输入（Credits/Token） | 缓存写入（Credits/Token） | 缓存读取（Credits/Token） | 输出（Credits/Token） |
| :--- | ---: | ---: | ---: | ---: |
| **闲时** | 0.22 | 0.22 | 0.0073 | 0.66 |
| **忙时** | 0.44 | 0.44 | 0.0147 | 1.32 |

API 调用按北京时间（UTC+8）实行分时计费：忙时为周一至周五 09:00-12:00 和 14:00-18:00；其余时间（包括周六、周日全天）为闲时。

图像会根据尺寸换算为输入 Tokens，并与文本输入一同计费；调整尺寸后，每张图像最多占用 384 Tokens。
