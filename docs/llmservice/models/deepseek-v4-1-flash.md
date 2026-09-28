import ActivityCard from '@site/src/components/ActivityCard';

# DeepSeek-V4.1-Flash

## Overview

DeepSeek-V4.1-Flash is a native multimodal Mixture-of-Experts model released by DeepSeek on September 10, 2026. It combines a 552-billion-parameter backbone, a 1M-token context window, and a Causal Encoder-Decoder design that activates 8 billion parameters per token during prefill and 16 billion during decoding. On B.AI, use the model name `DeepSeek-V4.1-Flash`.

:::info B.AI model routing
B.AI will progressively route requests made using the `DeepSeek-V4-Flash` and `DeepSeek-V4-Flash-Vision-Exp` model names to DeepSeek-V4.1-Flash. After routing takes effect, these requests are billed at the applicable DeepSeek-V4.1-Flash price.
:::

<ActivityCard
  variant="discount"
  title="DeepSeek-V4.1-Flash"
  status="Limited-Time Discount"
  detail="30% from Sep 25, 15:00 UTC+8"
>
At 15:00 on September 25, 2026 (Beijing Time, UTC+8), the promotional rate changes from 10% to 30% of the standard reference price.

The promotional price changes in step with DeepSeek's time-based pricing and remains at 30% of the applicable Off-Peak or Peak standard price.

The pricing table below continues to show standard reference prices. Actual settlement and final billing are subject to the platform display.
</ActivityCard>

## Key Features

* **Causal Encoder-Decoder Architecture:** Uses a 40-layer Transformer split into a 20-layer causal encoder and a 20-layer decoder. Projecting the decoder's global KV cache from the encoder output reduces active computation for input-heavy agent workloads.
* **Compressed Long-Context Inference:** CSA2, hierarchical sparse indexing, FP4 KV caching, and SWA Bounded Replay reduce the persistent global KV cache for long-context inference.
* **Native Multimodal Training:** Processes images and text jointly and produces text output. Its vision encoder and projector are trained with the language model rather than attached only during post-training.
* **Controllable Reasoning:** Supports `low`, `high`, and `max` reasoning-effort levels through the hosted API, with thinking enabled at `high` by default.
* **Structured and Tool-Driven Output:** Supports JSON output, tool calls, context caching, Chat Prefix Completion, and FIM in non-thinking mode.

## Best Use Cases

* **Long-Horizon Coding Agents:** Repository-scale implementation, debugging, testing, and terminal work that benefit from long context and tool use.
* **Multimodal Software Workflows:** Inspecting screenshots, rendered interfaces, diagrams, and tool-produced images while modifying code or other artifacts.
* **Document and Chart Analysis:** Extracting and reasoning over screenshots, scanned documents, dashboards, and charts through native image-and-text input.
* **High-Volume Agent Systems:** Input-heavy workflows where compressed KV cache, low active-parameter counts, context caching, and Flash-tier pricing help control operating costs.
* **Structured Automation:** Classification, extraction, JSON-formatted responses, and multi-step tool orchestration.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports `low`, `high`, and `max` reasoning-effort levels. Thinking is enabled at `high` by default; the Responses API can disable it with `none`. |
| **Coding and Agents** | Designed for long-horizon coding, repository work, terminal tasks, and multi-step agent workflows. |
| **Multimodal** | Accepts text and image input and produces text output. |
| **Context Window** | 1M tokens. |
| **Max Output** | 384K tokens. |
| **Tool Use** | Supports function calling, JSON output, context caching, image-bearing tool output through the Responses API, Chat Prefix Completion, and FIM Completion in non-thinking mode. |

### Known Limitations

* The hosted API maps reasoning controls to `low`, `high`, and `max`; compatible effort values may be mapped rather than preserved as distinct levels.
* In thinking mode, `temperature`, `presence_penalty`, and `frequency_penalty` do not affect generation. Tool-calling conversations must return prior `reasoning_content` in subsequent requests.
* Images are accepted only in supported user or tool-output positions. Images in `system` or `assistant` messages return an HTTP 400 error.
* DeepSeek does not separately publish a maximum input-token limit, knowledge cutoff, or complete supported-language list.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Billing Period | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) | Billing Notes |
| :------------- | --------------------: | --------------------------: | -------------------------: | ---------------------: | ---: | :--- |
| **Off-Peak** | `$0.15` | `$0.15` | `$0.003` | `$0.60` | - | Cache Write: `1x` input; Cache Read: `0.02x` input |
| **Peak** | `$0.30` | `$0.30` | `$0.006` | `$1.20` | - | Cache Write: `1x` input; Cache Read: `0.02x` input |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

:::info Pricing note
The table shows the time-based standard reference price for DeepSeek-V4.1-Flash. Off-Peak prices are half of Peak prices. In Beijing Time (UTC+8), 09:00-12:00 and 14:00-18:00, Monday through Friday (excluding Chinese public holidays), are Peak periods; all other times, including weekends and Chinese public holidays, are Off-Peak periods. DeepSeek-V4.1-Flash usage in B.AI Chat is billed at Off-Peak rates. Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through promotions, top-up bonuses, and account benefits.
:::
