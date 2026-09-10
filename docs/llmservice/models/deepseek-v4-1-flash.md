# DeepSeek-V4.1-Flash

## Overview

DeepSeek-V4.1-Flash is a native multimodal Mixture-of-Experts model released by DeepSeek on September 10, 2026. It combines a 552-billion-parameter backbone, a 1M-token context window, and a Causal Encoder-Decoder design that activates 8 billion parameters per token during prefill and 16 billion during decoding. On B.AI, use the model name `DeepSeek-V4.1-Flash`.

:::info B.AI model routing
B.AI will progressively route requests made using the `DeepSeek-V4-Flash`, `DeepSeek-V4-Flash-Vision-Exp`, and `DeepSeek-V4-Pro` model names to DeepSeek-V4.1-Flash. After routing takes effect, these requests are billed at the applicable DeepSeek-V4.1-Flash price.
:::

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

## Credits Usage

| Billing Period | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :------------- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **Idle** | `0.15` | `0.15` | `0.003` | `0.60` | `-` | Cache Write: `1x` input; Cache Read: `0.02x` input |
| **Busy** | `0.30` | `0.30` | `0.006` | `1.20` | `-` | Cache Write: `1x` input; Cache Read: `0.02x` input |

:::info Pricing note
The table shows the time-based standard reference price for DeepSeek-V4.1-Flash. API calls use UTC+8: Busy periods are 09:00-12:00 and 14:00-18:00, Monday through Friday; all other times, including weekends, are Idle periods. DeepSeek-V4.1-Flash usage in B.AI Chat is billed at Idle rates. Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through promotions, top-up bonuses, and account benefits.
:::
