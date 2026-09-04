import ActivityCard from '@site/src/components/ActivityCard';

# DeepSeek-V4-Flash-Vision-Exp

<ActivityCard
  variant="discount"
  title="DeepSeek-V4-Flash-Vision-Exp"
  status="Limited-Time API Discount"
  detail="50% of Standard Price"
>
The DeepSeek-V4-Flash-Vision-Exp 50% offer takes effect at 17:00 on September 3, 2026 (UTC+8).

From the effective time, eligible `deepseek-v4-flash-vision-exp` API usage is billed at 50% of the standard price for the applicable Idle or Busy period. The discounted price changes in step with DeepSeek's time-based pricing and remains at 50% in either period.

The pricing table below continues to show standard reference prices. Actual settlement and final billing are subject to the platform display.
</ActivityCard>

## Overview

DeepSeek-V4-Flash-Vision-Exp is DeepSeek's first experimental multimodal model in the DeepSeek-V4 family, released on August 21, 2026. It extends DeepSeek-V4-Flash with visual modules and continued training for image understanding while retaining comparable text-only agent performance in DeepSeek's evaluations.

## Key Features

- **Native Image Understanding**: Accepts interleaved text and image input in JPEG, PNG, GIF, and WebP formats for screenshot reading, chart analysis, visual question answering, and other image-grounded tasks.
- **Multimodal Agent Evaluation**: DeepSeek reports 36.5 on ApexBench (Pass@1), 64.3 on Chartography, and 35.0 on ZeroBench (Pass@5), indicating stronger visually grounded agent performance than the text-only DeepSeek-V4-Flash-0731 baseline in its published evaluation.
- **Text-Agent Continuity**: DeepSeek reports text-only capabilities comparable to DeepSeek-V4-Flash, including 83.9 on Terminal-Bench 2.1, 59.3 on DeepSWE, and 75.9 on Toolathlon-Verified.
- **Long-Context Reasoning**: The hosted API provides a 1M-token context window, up to 384K output tokens, optional thinking, and `low`, `high`, or `max` reasoning effort.
- **Agent-Oriented API Support**: Supports tool calls, JSON output, context caching, Chat Prefix Completion, and OpenAI-compatible Chat Completions and Responses interfaces, as well as an Anthropic-compatible Messages interface.
- **Open-Weight Reference Release**: The official MIT-licensed repository lists a 305B-parameter checkpoint and includes reference code for the vision encoder and aligner, DFlash attention, mixture-of-experts layers, Hyper-Connections, and the DSpark forward path.

## Best Use Cases

- **Visual Software Agents**: Inspecting screenshots, rendered interfaces, dashboards, or canvas state while using tools to modify code or other artifacts.
- **Document and Chart Analysis**: Reading text from screenshots, interpreting charts, and answering questions grounded in visual business or technical material.
- **Multimodal Tool Workflows**: Processing images returned by tools through the Responses API and combining visual evidence with multi-step reasoning and function calls.
- **Large Visual Review Batches**: Handling many images in one request when applications need consistent analysis across collections of screenshots, pages, or frames.
- **Open-Weight Evaluation**: Testing DeepSeek's experimental V4 vision architecture in controlled self-hosted research environments where the large checkpoint and reference-runtime requirements are acceptable.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports thinking and non-thinking modes; thinking is enabled by default at `high` effort. The primary effort levels are `low`, `high`, and `max`; compatible `medium` and `xhigh` requests map to `high`. |
| **Coding and Agents** | DeepSeek reports Terminal-Bench 2.1: 83.9, DeepSWE: 59.3, and Toolathlon-Verified: 75.9. These are provider-run evaluations using DeepSeek Harness minimal mode, `max` effort, `temperature = 1.0`, and `top_p = 0.95`. |
| **Tool Use** | Supports function calling in thinking and non-thinking modes, JSON output, context caching, and image-bearing tool outputs through the Responses API. |
| **Multimodal** | Accepts text and image input and produces text output. Each image is resized before inference and uses at most 384 input tokens; the API accepts up to 600 images per request within its size limits. |
| **Context Window** | 1M tokens. |
| **Max Output** | 384K tokens. |

### Known Limitations

- Image placement is interface-dependent: Chat Completions accepts images in `user` messages, while the Responses API also accepts them in `developer` messages and supported tool outputs. Images in `system` or `assistant` messages are rejected.
- The documented multimodal route accepts images but does not document audio or video input, image generation, or other non-text output.
- FIM Completion is not supported. Chat Prefix Completion remains a beta feature.
- In thinking mode, `temperature`, `top_p`, `presence_penalty`, and `frequency_penalty` have no effect. Tool-calling conversations must pass the full prior `reasoning_content` back on subsequent requests.
- DeepSeek does not publish a model-specific knowledge cutoff or a complete supported-language list.

## Pricing

| Billing Period | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) |
| :--- | ---: | ---: | ---: | ---: |
| **Idle** | 0.22 | 0.22 | 0.0073 | 0.66 |
| **Busy** | 0.44 | 0.44 | 0.0147 | 1.32 |

API calls use UTC+8. Busy periods are 09:00-12:00 and 14:00-18:00, Monday through Friday; all other times, including weekends, are Idle periods.

Images are converted to input tokens according to their dimensions and billed together with text input; each image uses at most 384 tokens after resizing.
