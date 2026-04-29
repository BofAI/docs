# DeepSeek V4 Flash

## Overview

DeepSeek-V4-Flash is DeepSeek's high-efficiency open-source language model, released alongside V4-Pro on April 24, 2026 under the MIT License. With 284 billion total parameters and only 13 billion active parameters, it delivers performance within striking distance of V4-Pro at 12.4x lower cost, making it one of the most cost-effective models available.

## Key Features

* **Ultra-Efficient Architecture**: 284B total parameters with just 13B activated per forward pass, resulting in a compact 160GB download that runs on significantly less hardware than frontier models while maintaining strong performance.
* **1M-Token Context Window**: Shares the same 1-million-token context and 384K max output as V4-Pro, powered by the same CSA/HCA hybrid attention mechanism for efficient long-context inference.
* **Near-Pro Performance at 12.4x Lower Cost**: Scores 79.0% on SWE-bench Verified, only 1.6 percentage points behind V4-Pro's 80.6%, while costing 0.14/0.28 Credits per input/output token.
* **Flash-Max Reasoning Mode**: When given a larger thinking budget (384K+ context), V4-Flash-Max achieves comparable reasoning performance to V4-Pro, closing the gap on complex tasks.

## Best Use Cases

* **High-Volume API Workloads**: At 0.14 Credits per input token, Flash is ideal for applications that process large volumes of text where cost per query matters more than marginal accuracy gains.
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

## Credits and Pricing

| Model                 | Input (Credits/Token) | Output (Credits/Token) | Notes                       |
| :-------------------- | --------------------: | ---------------------: | :-------------------------- |
| **DeepSeek V4 Flash** | `0.14`                | `0.28`                 | 1M context, 384K max output |
