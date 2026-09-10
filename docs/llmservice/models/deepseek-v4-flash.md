import ActivityCard from '@site/src/components/ActivityCard';

# DeepSeek-V4-Flash

## Overview

DeepSeek-V4-Flash is DeepSeek's high-efficiency open-source language model, released alongside V4-Pro on April 24, 2026 under the MIT License. With 284 billion total parameters and only 13 billion active parameters, it delivers performance within striking distance of V4-Pro at roughly one-third of the standard input and output price, making it one of the most cost-effective models available.

<ActivityCard
  variant="free"
  title="DeepSeek-V4-Flash"
  status="Free Offer"
  detail="0 Credits"
>
Offer starts August 17, 2026, and applies to DeepSeek-V4-Flash on B.AI Chat and API.

* **Chat:** Usage is billed at `0 Credits` during the offer.
* **API:** Usage is billed at `0 Credits` during the offer. No per-request, input, cache write, cache read, or output token fees apply.

After the offer ends, the model will return to standard pricing. Offer end time, eligibility, actual charges, and final billing are subject to the platform display.
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
| **Idle** | `0.22` | `0.22` | `0.0073` | `0.66` | `-` | Cache Write: `1x` input; Cache Read: `0.0333x` input |
| **Busy** | `0.44` | `0.44` | `0.0147` | `1.32` | `-` | Cache Write: `1x` input; Cache Read: `0.0333x` input |

:::info Pricing note
The table shows the time-based standard reference price for DeepSeek-V4-Flash. Its current limited-time offer applies `0 Credits` to all B.AI Chat and API usage. After the offer ends, the applicable Idle or Busy period, final settlement price, and billing records are subject to the platform display. B.AI may provide lower actual usage costs through top-up bonuses and account benefits.
:::
