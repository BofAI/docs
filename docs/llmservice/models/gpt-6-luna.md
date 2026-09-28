# GPT-6 Luna

## Overview

GPT-6 Luna is OpenAI's GPT-6 model for focused, high-volume workloads, released on September 22, 2026. Its model ID is `gpt-6-luna`. It combines low token prices with adjustable reasoning, image understanding, and a 1,050,000-token context window.

## Key Features

* **Low-Cost Repeated Tasks**: Standard short-context rates support evaluation for high-volume processing.
* **Coding Capability**: OpenAI reports 66.6% on DeepSWE v1.1 at `max` effort.
* **Workflow Efficiency**: Designed for repetitive, tool-assisted application workflows where per-run cost matters.
* **Adjustable Reasoning**: Supports six effort settings, including `none`, to adapt computation to task complexity.

## Best Use Cases

* **Classification and Extraction**: Repeated labeling, routing, and structured information extraction.
* **Summarization and Rewriting**: Processing support records, internal documents, and content drafts at scale.
* **Bounded Coding Assistance**: Issue triage, test drafting, small fixes, and first-pass reviews.
* **Tool-Assisted Routine Work**: Repetitive research and application workflows with clearly defined steps.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports `none`, `low`, `medium` (default), `high`, `xhigh`, and `max`. |
| **Multimodal** | Text and image input; text output. |
| **Context Window** | 1,050,000 tokens. |
| **Max Output** | 128,000 tokens, including reasoning within the generated-token budget. |
| **Tool Use** | Responses API supports functions, web and file search, computer use, code interpreter, hosted shell, Apply Patch, MCP, skills, tool search, and image generation. |
| **Structured Output** | Supports Structured Outputs and streaming. |
| **Knowledge Cutoff** | May 18, 2026. |

### Known Limitations

* Tool calling with reasoning requires the Responses API. Chat Completions supports function calling only at `reasoning_effort: "none"`.
* Reasoning-enabled requests do not support `temperature`, `top_p`, or log-probability controls. Fine-tuning is unsupported.
* Requests above 272K input tokens use higher rates for the entire request.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Context | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | ---: |
| Up to 272K input tokens | `$0.10` | `$0.125` | `$0.01` | `$0.50` | `$0.01` |
| More than 272K input tokens | `$0.20` | `$0.25` | `$0.02` | `$0.75` | `$0.01` |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

* For requests with more than 272K input tokens, the long-context rates apply to the full request.
* Cache Write is billed at 1.25x the input rate. Cache reads are billed at 0.1x input. The supported cache lifetime is 30 minutes and refreshes on reuse.
* Web search costs `10,000 Credits` (`$0.01`) per use and is not affected by the context tier.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
