import ActivityCard from '@site/src/components/ActivityCard';

# Qwen4-Max

## Overview

Qwen4-Max is Alibaba's flagship model and the first release in the Qwen4 family, combining reasoning, native visual understanding, and extended task execution. It is designed for coding, professional knowledge work, engineering design, and scientific exploration.

<ActivityCard
  variant="discount"
  title="Qwen4-Max"
  status="Limited-Time Discount"
  detail="10% OFF"
>
Qwen4-Max token charges are billed at 90% of the standard reference price, including input, output, explicit cache writes for both lifetimes, and cache reads.

| Billing Item | Promotional Price (USD / 1M Tokens) |
| :--- | ---: |
| Ordinary Input | `$1.35` |
| Output | `$4.05` |
| Explicit Cache Write (5 min) | `$1.6875` |
| Explicit Cache Write (1 hour) | `$2.70` |
| Cache Read (Implicit or Explicit) | `$0.0675` |

The standard pricing table below and the [Pricing and Usage](../pricing-and-usage.md) table continue to show original prices. The promotion period, applicable terms, and final billing are subject to the platform display.
</ActivityCard>

## Key Features

- **Configurable Reasoning:** Switch between thinking and non-thinking modes, with three reasoning effort levels for tasks that require deeper analysis.
- **Native Visual Understanding:** Analyze text, images, and video together for document review, visual reasoning, and workflows that depend on visual feedback.
- **1M-Token Context:** Work with large document collections, codebases, and extended conversation histories in a single context.
- **Coding and Professional Work:** Combine code generation, evidence retrieval, analysis, and tools to produce software, reports, and other deliverables.
- **Multi-Step Agents:** Supports function calling and parallel tool calls for workflows that plan, execute, check results, and iterate.
- **Reusable Context:** Explicit caching supports 5-minute and 1-hour lifetimes for repeated prompts, tool definitions, and reference material.

## Best Use Cases

- **Software Engineering:** Implement features, debug code, and iterate on tests using repository context and development tools.
- **Professional Analysis:** Cross-check source documents and prepare research reports, financial workbooks, or presentations with supporting tools.
- **Visual Document Review:** Interpret scanned documents, diagrams, screenshots, and video, then extract or summarize relevant information.
- **Research Workflows:** Combine literature review, specialized tools, and experimental feedback in multi-step scientific or engineering tasks.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Input and Output** | Accepts text, images, and video; produces text output. |
| **Reasoning** | Thinking is enabled by default at high effort; `low`, `high`, and `xhigh` effort levels are supported. |
| **Context Window** | 1,000,000 tokens. |
| **Maximum Input** | 991,808 tokens in non-thinking mode; 983,616 tokens in thinking mode. |
| **Maximum Output** | 131,072 tokens in non-thinking mode; 262,144 tokens shared between thinking and the final answer in thinking mode. |
| **Thinking Budget** | Defaults to 131,072 tokens within the combined output limit. |
| **Image Understanding** | Up to 16 million pixels per image and 2,048 images supplied by URL, subject to the context limit. |
| **Video Understanding** | Up to 2 hours and 2 GB per video, with up to 64 videos per request, subject to the context limit. |
| **Tool Use** | Supports function calling and parallel tool calls. |
| **Structured Output** | Supports JSON Object and JSON Schema modes. |
| **Context Caching** | Supports implicit caching and explicit caching with 5-minute or 1-hour lifetimes. |

### Known Limitations

- With image or video input, JSON Schema requests fall back to JSON Object mode; schema constraints do not apply. See [Structured output](https://platform.qianwenai.com/docs/developer-guides/text-generation/structured-output).
- The provider's built-in code interpreter requires thinking mode.

## Standard Pricing

All token prices below are in USD per 1 million tokens, using the provider's Singapore international list prices.

| Billing Item | Price (USD / 1M Tokens) |
| :--- | ---: |
| Ordinary Input | `$1.50` |
| Output | `$4.50` |
| Explicit Cache Write (5 min) | `$1.875` |
| Explicit Cache Write (1 hour) | `$3.00` |
| Cache Read (Implicit or Explicit) | `$0.075` |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

### Cache Billing

- When no cache parameters are configured, implicit caching identifies reusable input prefixes automatically. Cache creation tokens are billed at the ordinary input rate, with no additional cache-write fee; hits are not guaranteed.
- Explicit caching requires cache configuration and supports 5-minute or 1-hour lifetimes. Newly cached tokens are billed at 1.25 times or 2 times the input rate, respectively, instead of an additional ordinary input charge for the same tokens.
- Both implicit and explicit cache reads cost `$0.075` per 1 million tokens. Output tokens, including thinking tokens, are billed at the output rate.
- The [pricing overview](../pricing-and-usage.md) lists both explicit cache-write lifetimes. See the provider's [model pricing](https://www.alibabacloud.com/help/en/model-studio/model-pricing) and [Qwen4 explicit-cache rules](https://www.alibabacloud.com/help/en/model-studio/explicit-cache-qwen4) for the corresponding reference rates and cache behavior.

:::info Pricing note
Model prices in the documentation are based on the model providers' official list prices and serve as B.AI standard reference prices. B.AI may offer discounts or limited-time promotions on this basis; offer details are shown in [Promotions and Pricing Updates](../promotions-and-pricing-notices.md) and the website's discount groups. Applicable prices, offer terms, and final charges are subject to the platform display and actual billing records.
:::
