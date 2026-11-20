# Hy4 Flash

## Overview

[Hy4 Flash](https://intl.cloud.tencent.com/document/product/1300/80695) is Tencent's lightweight Hy4-series model for everyday productivity and high-volume workloads. It combines text and image understanding with a 1M-token context window, deep reasoning, and tool use.

## Key Features

- **Everyday Productivity:** Designed for high-volume office tasks such as drafting, summarization, and information processing.
- **Long-Context Analysis:** Works with extensive documents, reference material, and conversation history within a 1M-token context window.
- **Visual Understanding:** Reads text in images, interprets charts, and analyzes screenshots alongside written instructions.
- **Flexible Reasoning:** Enables deep thinking by default and allows it to be disabled for simpler requests.
- **Connected Workflows:** Supports function calling, preserved thinking, and structured output for tasks that combine reasoning with external tools.

## Best Use Cases

- **Office Assistance:** Draft correspondence, summarize reports, and organize information across routine business tasks.
- **Document and Chart Analysis:** Extract information from scanned pages, interpret charts, and compare images with written material.
- **Coding Assistance:** Explain code, investigate bugs, and support code generation or refactoring with relevant project context.
- **Workflow Automation:** Use connected tools to retrieve information, process results, and prepare structured responses across multiple steps.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Input and Output** | Text and image input; text output, including code and structured responses. |
| **Reasoning** | Deep thinking is enabled by default and can be disabled; supports preserved thinking across tool interactions. |
| **Context Window** | 1M tokens. |
| **Maximum Input** | 960,000 tokens. |
| **Maximum Output** | 64,000 tokens. |
| **Tool Use** | Function calling for external tools and multi-step workflows. |
| **Structured Output** | Supports structured responses for extraction and downstream processing. |
| **Image Input** | PNG, JPEG, WEBP, and static GIF; up to 10 MB per image and 600 images per request, including conversation history, subject to token limits. |

### Known Limitations

- Images are internally resized to approximately 2048 x 2048 pixels, and inputs exceeding 5500 x 5500 pixels are rejected; crop relevant regions when small text or fine detail matters.
- Executing code, editing files, or operating applications requires an environment with the appropriate external tools and permissions.
- For best results, tool workflows using preserved thinking should retain the model's unmodified reasoning history between requests.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | ---: | ---: | ---: | ---: | ---: |
| **Hy4 Flash** | `$0.07` | `$0.07` | `$0.003` | `$0.281` | - |

**Cache writes:** B.AI bills cache writes at the input rate (1x).

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

:::info Pricing note
Model prices in the documentation are based on the model providers' official list prices and serve as B.AI standard reference prices. B.AI may offer discounts or limited-time promotions on this basis; offer details are shown in [Promotions and Pricing Updates](../promotions-and-pricing-notices.md) and the website's discount groups. Applicable prices, offer terms, and final charges are subject to the platform display and actual billing records.
:::
