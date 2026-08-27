import ActivityCard from '@site/src/components/ActivityCard';

# Qwen3.8-Flash

## 概述

Qwen3.8-Flash 是阿里巴巴 Qwen 团队于 2026 年 8 月 26 日发布的托管多模态模型。该模型是基于 Qwen3.8-Flash-Next 构建的生产版本，提供默认 100 万 Token 上下文窗口和托管工具，面向成本敏感的编程、Agent 与视觉知识工作场景。

<ActivityCard
  variant="free"
  title="Qwen3.8-Flash"
  status="免费活动"
  detail="API 已免费 · Chat 上架后免费"
>
B.AI API 和 Chat 分阶段开放免费使用：

* **API：** Qwen3.8-Flash API 调用目前按 `0 Credits` 结算，不收取输入、缓存写入、缓存读取或输出 Token 费用。
* **Chat：** Qwen3.8-Flash 在 B.AI Chat 上架后免费开放，具体免费开放日期以模型实际上架为准；开放后，Chat 使用按 `0 Credits` 结算。

活动结束后，Qwen3.8-Flash 将恢复本页展示的价格。
</ActivityCard>

## 核心特性

* **基于 Flash-Next 的生产版本：** Qwen 将 `qwen3.8-flash` 定义为基于 Qwen3.8-Flash-Next 构建的生产版本。相关开放权重架构采用 Gated DeltaNet、Qwen Sparse Attention、Gated Residual 和 N-gram Embedding；QwenCloud 未单独公布生产模型的参数量。
* **原生多模态输入：** 支持文本、图像和视频输入，输出为文本，适用于视觉编程、文档分析、图表理解和长视频理解。
* **100 万 Token 托管上下文：** 非 Thinking 模式最多支持 991K 输入 Token，Thinking 模式最多支持 983K 输入 Token；两种模式均支持最高 131K 输出 Token。
* **Thinking 与 Agent 控制：** QwenCloud 文档说明 Qwen3.8 系列默认启用 Thinking，可通过 `enable_thinking` 控制，并列出最高 262K Token 的推理预算。
* **面向 Agent 的 API 能力：** 支持前缀续写、函数调用、上下文缓存、结构化输出、Batch API 批处理、微调，以及 QwenCloud Responses API 提供的内置工具。
* **Flash-Next 评测结果：** 相关开放权重基础模型在 SWE-bench Pro、DeepSWE 1.1、CoWorkBench 和 Toolathlon Verified 上分别报告 62.5、58.7、73.9 和 73.5。Qwen 尚未单独发布托管生产端点的基准测试表。

## 适用场景

* **成本敏感的编程 Agent：** 适用于代码仓库分析、代码生成、调试和工具驱动开发等关注 Token 成本与账户级速率限制的场景。
* **长上下文知识工作：** 在 100 万 Token 托管上下文中处理大型文档集、代码库、对话历史和研究资料。
* **多模态分析：** 结合文本指令理解截图、图表、扫描文档、界面和视频。
* **结构化 Agent 工作流：** 适用于结合函数调用、JSON 结构化输出、代码执行、搜索、提取和共享提示词缓存的应用。
* **异步批量处理：** 通过 Batch API 执行分类、提取、评估和数据集处理，批处理输入与输出价格为实时调用价格的一半。

## 能力与限制

| 能力维度 | 说明 |
| :--- | :--- |
| **推理能力** | Qwen3.8 系列默认启用 Thinking，并可通过 `enable_thinking` 控制。QwenCloud 列出最高 262K Token 的推理预算，但模型页面未公布该模型专属的推理强度映射。 |
| **创意写作** | 支持通用、长篇和结构化文本生成。 |
| **编程能力** | 相关 Qwen3.8-Flash-Next 评测报告 SWE-bench Pro 62.5、DeepSWE 1.1 58.7、SWE-bench Multilingual 81.0 和 NL2Repo-Bench 48.1；这些结果不代表托管端点的 SLA。 |
| **多模态能力** | 支持文本、图像和视频输入，输出为文本。 |
| **上下文窗口** | 100 万 Token。 |
| **最大输入** | 非 Thinking 模式为 991K Token，Thinking 模式为 983K Token。 |
| **最大输出** | Thinking 和非 Thinking 模式均为 131K Token。 |
| **工具调用** | 支持函数调用、结构化输出、前缀续写、缓存和 Batch API。Responses API 工具包括 `code_interpreter`、`i2i_search`、`t2i_search`、`web_extractor` 和 `web_search`。 |
| **多语言能力** | 相关 Flash-Next 评测覆盖多语言推理和编程基准。 |

### 已知限制

* `qwen3.8-flash` 是托管生产模型，`Qwen/Qwen3.8-Flash-Next` 则是相关的开放权重架构版本。参数量、自托管行为和 Flash-Next 基准测试结果不应视为托管端点的保证。
* QwenCloud 未公布该模型专属的知识截止时间或完整支持语言列表。
* Thinking Token 按输出 Token 价格计费并占用上下文。应用应根据任务需要启用 Thinking，不应假设更大的推理预算一定更高效。

## 价格

| 模型名称 | 输入（Credits/Token） | 缓存写入（Credits/Token） | 缓存读取（Credits/Token） | 输出（Credits/Token） | 网页搜索（Credits/次） |
| :--- | --------------------: | -------------------------: | -------------------------: | --------------------: | ---------------------: |
| **Qwen3.8-Flash** | `0.16` | `0.16` | `0.016` | `0.47` | `-` |

该模型的显式缓存创建价格为 `0.20 Credits/Token`；显式缓存命中与隐式缓存命中的价格均为 `0.016 Credits/Token`。

:::info 价格说明
文档价格为 B.AI 平台模型标准参考价，仅供基础计费说明使用。B.AI 可能会通过限时活动、充值赠送及账户权益等方式，为用户提供更低的实际使用成本。具体价格、赠送积分、账户权益及最终账单请以平台页面展示和账单记录为准。
:::
