# Claude Fable 5.2

## Overview

Claude Fable 5.2, released by Anthropic on November 9, 2026, is a Claude model for complex reasoning, software engineering, and long-running agent workflows. It shares its underlying model with Claude Mythos 5.2, with additional cybersecurity and biology safeguards for general access.

## Key Features

- **Complex Technical Work:** Designed for demanding coding, mathematical reasoning, scientific analysis, and engineering tasks that require sustained planning and iteration.
- **Adaptive Reasoning:** Always-on adaptive thinking adjusts reasoning to the task, with five effort levels to balance depth, latency, and token use.
- **Large Working Context:** A 1M-token context window and up to 128K output tokens support extensive codebases, source material, and detailed deliverables.
- **Agent Tools and Structured Results:** Supports automatic tool calling, strict tool schemas, JSON output, and computer-use workflows through connected tools.
- **Improved Vision and Communication:** Interprets images, charts, and diagrams, with clearer explanations and summaries than earlier Fable models, according to Anthropic.
- **Faster Generation:** Anthropic reports output generation up to 30% faster than Fable 5.1. See the [release announcement](https://www.anthropic.com/claude-fable-and-mythos-5-2).

## Best Use Cases

- **Repository-Scale Engineering:** Code migrations, difficult debugging, performance optimization, and implementation spanning many files and tools.
- **Extended Research:** Multi-step investigation combining evidence gathering, quantitative analysis, and iterative testing of ideas.
- **Professional Deliverables:** Developing complex source material into reports, spreadsheets, presentations, and other finished work through suitable tools.
- **Visual and Engineering Analysis:** Interpreting technical diagrams, charts, screenshots, and design references alongside textual requirements.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Always-on adaptive thinking; `low`, `medium`, `high`, `xhigh`, and `max` effort, with `high` as the Claude API default. |
| **Multimodal** | Text and image input; text output. |
| **Context Window** | 1,000,000 tokens. |
| **Max Output** | 128,000 tokens. |
| **Tool Use** | Automatic function calling and computer use; strict tool schemas and structured JSON output are unavailable with customer-managed encryption keys. |
| **Prompt Caching** | Supports 5-minute and 1-hour cache durations; minimum cacheable prompt length is 512 tokens. |
| **Knowledge Cutoff** | June 2026. |

### Known Limitations

- Forced tool selection is unsupported; integrations must use automatic tool selection or disable tool use.
- Preserved thinking depends on unchanged prior context. Editing earlier instructions, tools, or messages can invalidate reasoning blocks and cause an API error. Only Fable 5.2 and Mythos 5.2 can read Fable 5.2 thinking blocks.
- Safeguards block most cybersecurity-related tasks and restrict biology requests. Some specialized AI-development tasks are also restricted or subject to fallback to earlier models.
- Long tasks can stop before completion, particularly at lower effort levels; workflows should check that the requested result is complete.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | 5m Cache Write<br/>(USD / 1M Tokens) | 1h Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | --------------------: | -----------------------------: | -----------------------------: | -------------------------: | ---------------------: | ---: |
| **Claude Fable 5.2** | `$8.00` | `$10.00` | `$16.00` | `$0.20` | `$40.00` | `$0.01` |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

- Standard per-token rates apply across the full 1M-token context window, with no long-context surcharge.
- Cache creation uses write rates; subsequent hits and refreshes use the cache-read rate.

:::info Caching note
For Claude Fable 5.2, a 5-minute cache write is billed at 1.25x the input rate and a 1-hour cache write is billed at 2x. Cache reads are billed at 0.025x the input rate.
:::

:::info Pricing note
Model prices in the documentation are based on the model providers' official list prices and serve as B.AI standard reference prices. B.AI may offer discounts or limited-time promotions on this basis; offer details are shown in [Promotions and Pricing Updates](../promotions-and-pricing-notices.md) and the website's discount groups. Applicable prices, offer terms, and final charges are subject to the platform display and actual billing records.
:::
