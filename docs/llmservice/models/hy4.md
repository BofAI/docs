import ActivityCard from '@site/src/components/ActivityCard';

# Hy4

## Overview

[Hy4](https://intl.cloud.tencent.com/zh/document/product/1300/80695) is a Tencent Hy language model designed for multi-step agent workflows and long-running productivity tasks. It adds visual understanding to the Hy4 series, combining text and image input with a 1M-token context window. On B.AI, use the model ID `hy4`.

<ActivityCard
  variant="discount"
  title="Hy4"
  status="Limited-Time Discount"
  detail="50% OFF"
>
Hy4 token charges are billed at 50% of the standard reference price, including input, output, cache writes, and cache reads. This offer applies only to `hy4`, not `hy4-preview`.

| Billing Item | Promotional Price (USD / 1M Tokens) |
| :--- | ---: |
| Input | `$0.42` |
| Cache Write | `$0.42` |
| Cache Read | `$0.02` |
| Output | `$1.25` |

The standard pricing table below continues to show original prices. See [Promotions and Pricing Updates](../promotions-and-pricing-notices.md) for the offer. The promotion period, actual settlement prices, and final billing are subject to the platform display.
</ActivityCard>

## Key Features

- **Visual Understanding:** Reads text in images, interprets charts, and analyzes screenshots alongside written instructions.
- **Long-Context Analysis:** Handles substantial reference material, with a 1M-token context window and up to 960,000 input tokens.
- **Agent Workflows:** Combines reasoning and function calling to support multi-step tasks with external tools.
- **Adjustable Thinking:** Enables deep reasoning by default and allows thinking to be disabled for simpler requests.
- **Structured Responses:** Supports structured output for extraction, data processing, and application workflows.

## Best Use Cases

- **Software Development:** Plan implementations, investigate code, and use screenshots as context for interface development and debugging.
- **Document and Chart Analysis:** Extract information from scanned pages, interpret charts, and compare visual evidence with written material.
- **Research and Synthesis:** Work across long reference sets to produce summaries, comparisons, and reasoned answers.
- **Office Agents:** Coordinate analysis and document preparation through connected tools in workflows that require multiple steps.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Input and Output** | Text and image input; text output, including code and structured responses. |
| **Reasoning** | Deep thinking is enabled by default and can be disabled; supports preserved reasoning across tool interactions. |
| **Context Window** | 1M tokens. |
| **Maximum Input** | 960,000 tokens. |
| **Maximum Output** | 64,000 tokens. |
| **Tool Use** | Function calling for external tools and multi-step workflows. |
| **Structured Output** | Supports structured responses for extraction and downstream processing. |
| **Image Input** | PNG, JPEG, WEBP, and static GIF; up to 10 MB per image and 600 images per request, including conversation history, subject to token limits. |

### Known Limitations

- Images are resized internally to fit within approximately 2048 x 2048 pixels; inputs exceeding 5500 x 5500 pixels are rejected. Crop relevant regions when fine detail or small text matters.
- Executing code, editing files, or operating applications requires an environment with the appropriate external tools and permissions.
- Multi-turn tool workflows need to retain the model's reasoning history to preserve continuity between tool calls.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | ---: |
| **Hy4** | `$0.834` | `$0.834` | `$0.042` | `$2.501` | - |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

:::info Pricing note
Model prices in the documentation are based on the model providers' official list prices and serve as B.AI standard reference prices. B.AI may offer discounts or limited-time promotions on this basis; offer details are shown in [Promotions and Pricing Updates](../promotions-and-pricing-notices.md) and the website's discount groups. Applicable prices, offer terms, and final charges are subject to the platform display and actual billing records.
:::
