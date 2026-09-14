import ActivityCard from '@site/src/components/ActivityCard';

# DeepSeek-V4-Flash

:::info B.AI model routing
B.AI will progressively route requests made using the `DeepSeek-V4-Flash` and `DeepSeek-V4-Flash-Vision-Exp` model names to [DeepSeek-V4.1-Flash](./deepseek-v4-1-flash.md). After routing takes effect, these requests are billed at the applicable DeepSeek-V4.1-Flash price.
:::

## Overview

DeepSeek-V4-Flash is DeepSeek's high-efficiency open-source language model, released alongside V4-Pro on April 24, 2026 under the MIT License. With 284 billion total parameters and only 13 billion active parameters, it delivers performance within striking distance of V4-Pro at roughly 3.1x lower cost, making it one of the most cost-effective models available.

<ActivityCard
  variant="discount"
  title="DeepSeek-V4-Flash"
  status="Limited-Time API Discount"
  detail="50% of Standard Price"
>
The DeepSeek-V4-Flash 50% offer takes effect at 17:00 on September 3, 2026 (UTC+8).

From the effective time, eligible DeepSeek-V4-Flash API usage is billed at 50% of the standard price for the applicable period. The discounted price changes in step with DeepSeek's Idle and Busy pricing periods and remains at 50% in either period.

The pricing table below continues to show standard reference prices. Actual settlement and final billing are subject to the platform display.
</ActivityCard>

## Key Features

* **Ultra-Efficient Architecture**: 284B total parameters with just 13B activated per forward pass, resulting in a compact 160GB download that runs on significantly less hardware than frontier models while maintaining strong performance.
* **1M-Token Context Window**: Shares the same 1-million-token context and 384K max output as V4-Pro, powered by the same CSA/HCA hybrid attention mechanism for efficient long-context inference.
* **Near-Pro Performance at Lower Cost**: Scores 79.0% on SWE-bench Verified, only 1.6 percentage points behind V4-Pro's 80.6%, while its standard reference price is 0.44/1.32 Credits per input/output token.
* **Flash-Max Reasoning Mode**: When given a larger thinking budget (384K+ context), V4-Flash-Max achieves comparable reasoning performance to V4-Pro, closing the gap on complex tasks.

## Best Use Cases

* **High-Volume API Workloads**: With a standard reference input price of 0.44 Credits per token, Flash is ideal for applications that process large volumes of text where cost per query matters more than marginal accuracy gains.
* **Self-Hosted Deployments**: The 160GB model size and 13B active parameters make it feasible for on-premise or single-node GPU deployments, unlike larger frontier models.
* **Agentic Tool-Use Pipelines**: Strong tool-calling and coding capabilities paired with low latency make it well-suited for multi-step agent workflows where many LLM calls are chained together.

## Capabilities and Limitations

| Capability         | Description                                                                             |
| :----------------- | :-------------------------------------------------------------------------------------- |
| **Reasoning**      | Competitive with Claude Sonnet 4.6 level intelligence (47 on Artificial Analysis Index) |
| **Coding**         | 79.0% SWE-bench Verified; 64.4 average across coding benchmarks                         |
| **Multimodal**     | Text-only; no image, audio, or video support                                            |
| **Response Speed** | Optimized for high throughput with 13B active parameters and efficient attention        |
| **Context Window** | 1,000,000 tokens                                                                        |
| **Max Output**     | 384,000 tokens                                                                          |
| **Tool Use**       | Function calling support; strong agentic task performance                               |
| **Multilingual**   | Broad multilingual support; strongest in English and Chinese                            |

### Known Limitations

* Text-only, with no multimodal capabilities.
* Falls behind V4-Pro and frontier closed-source models on pure knowledge tasks and the most complex agentic workflows due to smaller parameter scale.
* May require Flash-Max mode (larger thinking budget) to match Pro-level reasoning, increasing latency and cost for complex tasks.

## Credits Usage

| Billing Period | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :------------- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **Idle** | `0.15` | `0.15` | `0.003` | `0.60` | `-` | Cache Write: `1x` input; Cache Read: `0.02x` input |
| **Busy** | `0.30` | `0.30` | `0.006` | `1.20` | `-` | Cache Write: `1x` input; Cache Read: `0.02x` input |

:::info Pricing note
The standard reference prices above take effect at 12:00 on September 10, 2026 (Beijing Time, UTC+8). The table shows the time-based standard reference price for DeepSeek-V4-Flash. API calls use UTC+8: Busy periods are 09:00-12:00 and 14:00-18:00, Monday through Friday; all other times, including weekends, are Idle periods. DeepSeek-V4-Flash usage in B.AI Chat is billed at Idle rates. From 17:00 on September 3, 2026 (UTC+8), eligible API usage is billed at 50% of the standard price for the applicable period. Final settlement prices and billing records are subject to the platform display. B.AI may provide lower actual usage costs through top-up bonuses and account benefits.
:::
