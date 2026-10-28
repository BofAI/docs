# Qwen3.7-Flash

## Overview

[Qwen3.7-Flash](https://www.qwencloud.com/models/qwen3.7-flash) is a cost-efficient native vision-language model from Alibaba's Qwen team, released on July 25, 2026. It combines a one-million-token context window with visual understanding, multimodal coding, and tool-driven task execution.

**Model ID:** `qwen3.7-flash`.

## Key Features

- **Native Multimodal Understanding:** Analyzes text, images, and video, including objects, spatial relationships, and real-world scenes.
- **Long Context:** Handles large document collections, codebases, and extended conversations within a 1,000,000-token context window.
- **Optional Thinking:** Uses reasoning for complex tasks and supports disabling thinking for simpler requests.
- **Visual Coding:** Supports coding tasks that combine written instructions with screenshots or other visual references.
- **Structured Workflows:** Supports function calling, prefix completion, context caching, and structured JSON output.

## Best Use Cases

- **Document and Visual Analysis:** Extract information from documents, screenshots, charts, and images.
- **Coding Assistance:** Generate and debug code or turn visual references into interface implementations.
- **Long-Context Q&A:** Answer questions over large reference materials or conversation histories.
- **Tool-Driven Assistants:** Combine model reasoning with external tools for search, analysis, and multi-step tasks.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Hybrid thinking mode, enabled by default and optional per request. |
| **Input and Output** | Text, image, and video input; text output. |
| **Context Window** | 1,000,000 tokens. |
| **Maximum Input** | 991,808 tokens without thinking; 983,616 tokens with thinking. |
| **Maximum Output** | 131,072 tokens in either mode. |
| **Tool Use** | Function calling supports connections to external tools and systems. |
| **Structured Output** | Supports JSON Object and [JSON Schema](https://docs.qwencloud.com/developer-guides/text-generation/structured-output) output modes. |
| **Context Caching** | Supports explicit and automatic implicit caching of shared prompt prefixes. |

### Known Limitations

- Video understanding does not include the video's audio track; audio input is unsupported.
- Thinking adds generation time and billable output tokens.

## Standard Pricing

All token prices below are in USD per 1 million tokens. Select the tier by the request's total input length. Here, 1K = 1,000 tokens and 1M = 1,000,000 tokens.

| Billing Item | Input &le; 32K | 32K < Input &le; 256K | 256K < Input &le; 1M |
| :--- | ---: | ---: | ---: |
| Ordinary Input | $0.03 | $0.10 | $0.20 |
| Output | $0.13 | $0.40 | $0.80 |
| <span style={{whiteSpace: 'nowrap'}}>Implicit Cache Read</span> | $0.006 | $0.02 | $0.04 |
| <span style={{whiteSpace: 'nowrap'}}>Explicit Cache Write</span> | $0.038 | $0.125 | $0.25 |
| <span style={{whiteSpace: 'nowrap'}}>Explicit Cache Read</span> | $0.003 | $0.01 | $0.02 |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

### Tier and Cache Billing

- Total input length selects the pricing tier for all input and output tokens in the request. Thinking tokens are billed at the output rate.
- Implicit cache creation tokens are billed at the ordinary input rate, with no additional cache-write fee. Cache hits are billed at the implicit cache-read rate.
- Explicit Cache Write replaces the ordinary input charge for newly cached tokens; it is not an additional charge on top of ordinary input for the same tokens.
- Explicit and implicit caching are alternative modes. Their applicable prices are shown above.
- [Explicit caches](https://www.alibabacloud.com/help/en/model-studio/context-cache) last five minutes, refreshed on a hit; automatic implicit cache hits are not guaranteed.
- The [pricing overview](../pricing-and-usage.md) shows the base-tier implicit-cache prices. Refer to the table above for higher input tiers and explicit-cache prices.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through account benefits. Specific prices and account benefits are subject to the platform display and final billing records.
:::
