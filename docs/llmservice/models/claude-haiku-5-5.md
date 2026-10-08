# Claude Haiku 5.5

## Overview

Claude Haiku 5.5, released by Anthropic on October 7, 2026, is a compact Claude 5.5 model designed for high-volume, latency-sensitive work. On B.AI, use the model ID `claude-haiku-5.5`. It combines adaptive thinking and a 1M-token context window with fast responses for classification, extraction, summarization, and focused agent tasks.

## Key Features

* **Fast Routine Processing**: Designed for repetitive workloads such as request routing, database queries, and conversation summaries.
* **Adjustable Reasoning**: The first Haiku model with five effort levels, allowing users to balance reasoning depth, response time, and token usage.
* **Large Working Context**: Handles up to 1M tokens of context for lengthy documents and conversation histories.
* **Visual Understanding**: Accepts text and images for tasks involving screenshots, charts, and other visual content.
* **Tools and Agent Workflows**: Supports tool use and structured outputs, with computer and browser tools for interface workflows and focused subagent work.

## Best Use Cases

* **Classification and Routing**: Categorizing support tickets, labeling content, and directing requests to the right workflow.
* **Document Extraction and Summaries**: Pulling specific facts from source materials and condensing reports or conversation histories.
* **Live Customer Support**: Handling frequent, narrowly scoped questions where quick responses matter.
* **Focused Coding Assistance**: Performing bounded lookups, summaries, and supporting tasks within a larger coding workflow.
* **Interface Automation**: Working through short browser or computer tasks using an appropriate tool environment.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Adaptive thinking by default; `low`, `medium` (default), `high`, `xhigh`, and `max` effort. |
| **Thinking Control** | Thinking can be disabled at `low`, `medium`, or `high` effort; higher levels require thinking. |
| **Multimodal** | Text and image input; text output, with multilingual capabilities. |
| **Context Window** | 1M tokens. |
| **Max Output** | 128K tokens for standard requests, including thinking and visible output. |
| **Tool Use** | Tool calling and structured outputs; computer and browser use require supported tools and an execution environment. |
| **Prompt Caching** | Supports 5-minute and 1-hour cache durations. |
| **Knowledge Cutoff** | June 2026. |

### Known Limitations

* **Complex Agent Tasks**: Sonnet 5.5 and Opus 5.5 remain better suited to complex, extended coding work. Haiku 5.5 fits more narrowly scoped tasks.
* **Completion Reliability**: Lower effort can lead to skipped searches, early stopping, or unverified code changes. At `xhigh` effort, some multi-turn responses can end without visible text; check task completion and response content.
* **Structured Output with Tools**: With thinking disabled, the model can skip a necessary tool call when producing JSON. Adaptive thinking is recommended for workflows combining structured outputs and custom tools.
* **Migration Compatibility**: Manual thinking budgets, assistant prefilling, and non-default sampling controls are unsupported. The newer tokenizer produces approximately 30% more tokens for the same text than Haiku 4.5, depending on content.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Prompt Length | Input<br/>(USD / 1M Tokens) | 5m Cache Write<br/>(USD / 1M Tokens) | 1h Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| Up to 100,000 tokens | `$0.10` | `$0.125` | `$0.20` | `$0.01` | `$0.50` | `$0.01` |
| Over 100,000 tokens | `$0.50` | `$0.625` | `$1.00` | `$0.05` | `$2.50` | `$0.01` |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance. Web search costs `10,000 Credits` (`$0.01`) per use.

:::info Prompt-length pricing
Prompts over 100,000 tokens use the higher rates for the entire request, including input, output, cache writes, and cache reads, not just the tokens above the threshold. Web search is billed per use at the same rate in both tiers.
:::

:::info Caching note
For Claude Haiku 5.5, a 5-minute cache write is billed at 1.25x the applicable input rate, a 1-hour cache write at 2x, and a cache read at 0.1x. The pricing overview's `Cache Write` column shows the 5-minute rates; the 1-hour rates are listed above.
:::

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
