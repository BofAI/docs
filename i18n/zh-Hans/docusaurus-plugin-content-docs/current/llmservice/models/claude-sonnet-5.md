# Claude Sonnet 5

## 概述

Claude Sonnet 5 是 Anthropic 于 2026 年 6 月 30 日发布的新一代 Sonnet 系列模型，可作为 Claude Sonnet 4.6 的直接升级版本。该模型面向更强的 Agent 行为、代码能力、工具调用、计算机使用工作流和知识工作场景，并保持 Sonnet 级别的价格定位。

## 核心特性

* **Agentic Task Execution**：面向规划、浏览器和终端等工具使用，以及更可靠的多步骤任务完成能力。
* **默认自适应思考**：请求默认使用 adaptive thinking，除非传入 `thinking: {type: "disabled"}`；`effort` 参数用于控制能力、延迟和 token 消耗之间的权衡。
* **1M 上下文窗口**：默认支持 1M tokens 上下文窗口，没有更小上下文变体，也没有长上下文额外费用。
* **广泛平台可用性**：可通过 Claude API、Claude Code、AWS 上的 Claude Platform、Amazon Bedrock、Google Cloud、Microsoft Foundry preview 和 Claude 消费者计划使用。

## 适用场景

* **生产级 Agent 工作流**：多步骤自动化、Agentic Search、工具密集型推理、浏览器/终端工作流，以及长时间委托任务。
* **软件工程**：代码生成、调试、重构、代码审查、测试修复循环，以及既有代码仓库维护。
* **高频知识工作**：研究、分析、结构化抽取、业务运营、法律研究、客户工作流和内部生产力工具。

## 能力与限制

| 能力维度 | 说明 |
| :--- | :--- |
| **推理能力** | 默认启用 adaptive thinking；`effort` 支持 `low`、`medium`、`high`、`xhigh` 和 `max`，默认值为 `high`。Anthropic 表示其 Agent、代码和知识工作能力强于 Sonnet 4.6。 |
| **创意写作** | 支持通用文本生成和长文写作；Anthropic 建议重新评估样式提示词，因为相较早期 Sonnet 模型，文本风格可能发生变化。 |
| **多模态能力** | 支持文本和图像输入、文本输出、多语言能力和视觉理解；未列出原生音频/视频输入或生成能力。 |
| **响应速度** | 在 Anthropic 模型表中被标记为 "Fast"；较低 effort 可降低延迟和 token 使用，较高 effort 会增加思考和工具使用深度。 |
| **上下文窗口** | 1M tokens |
| **最大输出** | 128K tokens |
| **工具调用** | 支持与 Claude Sonnet 4.6 相同的工具和平台能力集，但不支持 Priority Tier；更高 effort 下更容易触发工具使用。 |
| **多语言能力** | 官方文档表示当前 Claude 模型支持多语言，但未单独公布 Sonnet 5 的语言覆盖基准。 |

### 已知限制

* 已移除手动 extended thinking（`thinking: {type: "enabled", budget_tokens: N}`），使用该参数会返回 400 错误；请改用 adaptive thinking 和 `effort`。
* 非默认采样参数（`temperature`、`top_p`、`top_k`）会返回 400 错误；建议使用 system instructions 控制语气和风格。
* 不支持 assistant message prefilling，使用时会返回 400 错误。
* 新 tokenizer 对同一文本可能比 Claude Sonnet 4.6 多产生约 30% tokens，因此 token 预算、上下文使用量和等效请求成本需要重新评估。
* 默认启用网络安全防护；高风险或禁止的网络安全请求可能会以 `stop_reason: "refusal"` 被拒绝。

## 积分消耗

| 模型名称 | 价格周期 | 输入 (Credits/Token) | 5m Cache Write (Credits/Token) | 1h Cache Write (Credits/Token) | Cache Read (Credits/Token) | 输出 (Credits/Token) | 网页搜索（Credits/次） |
| :--- | :--- | --------------------: | -----------------------------: | -----------------------------: | -------------------------: | -------------------: | ---------------------: |
| **Claude Sonnet 5** | 截至 2026 年 8 月 31 日 | `2.00` | `2.50` | `4.00` | `0.20` | `10.00` | `10,000` |
| **Claude Sonnet 5** | 2026 年 9 月 1 日起 | `3.00` | `3.75` | `6.00` | `0.30` | `15.00` | `10,000` |

:::info 价格说明
价格总表展示当前生效的标准参考价。Claude Sonnet 5 当前标准参考价适用至 2026 年 8 月 31 日。文档价格为 B.AI 平台模型标准参考价，仅供基础计费说明使用。B.AI 可能会通过充值赠送及账户权益等方式，为用户提供更低的实际使用成本。具体价格、赠送积分及账户权益请以平台页面展示及最终账单为准。
:::
