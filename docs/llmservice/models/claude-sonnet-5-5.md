# Claude Sonnet 5.5

## Overview

Claude Sonnet 5.5, released by Anthropic on September 28, 2026, is designed for well-scoped software engineering, everyday agent workflows, and professional document creation. On B.AI, use the model ID `claude-sonnet-5.5`. It combines a 1M-token context window with adaptive thinking, offering a faster, lower-cost complement to Claude Opus 5.5.

## Key Features

* **Agentic Coding**: Anthropic's release evaluation table reports 70.6% on Terminal-Bench 4.0 and 55.5% on CursorBench 4.0. These are reported benchmark results, not guarantees for production workloads.
* **Adjustable Reasoning**: Five effort levels balance reasoning depth, latency, and token usage. Adaptive thinking is the default; `between_tools` removes up-front thinking for workloads that need faster initial responses.
* **Large Working Context**: Supports 1M tokens of context with no long-context price premium, enabling work across lengthy documents, repositories, and conversations.
* **Tools and Structured Results**: Supports client-side and server-side tools, structured outputs, strict tool schemas, and computer and browser use through supported tools.
* **Visual and Document Work**: Interprets images and PDFs and supports workflows that produce reports, presentations, spreadsheets, and user interfaces with appropriate tools.

## Best Use Cases

* **Scoped Software Engineering**: Bug fixes, code review, and feature implementation that benefit from fast iteration and repeated tool use.
* **Business Deliverables**: Turning source materials into reports, slide decks, and spreadsheet analyses with document and execution tools.
* **Document and Visual Analysis**: Reviewing long reports, charts, and screenshots using the large context window and image understanding.
* **Interactive Agents**: Multi-step support and internal workflows where effort controls help balance response time, reasoning, and cost.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Adaptive thinking by default; `low`, `medium`, `high` (Claude API default), `xhigh`, and `max` effort. `between_tools` is accepted only at `low`, `medium`, or `high`. |
| **Multimodal** | Text and image input; text output. Supports PDF analysis. |
| **Context Window** | 1M tokens. |
| **Max Output** | 128K tokens for standard requests, including thinking and visible output. |
| **Tool Use** | Automatic tool selection, structured outputs, and strict schemas on the Claude API. Mid-conversation system messages are supported; per-message effort, tool changes, and on-demand compaction are beta features. |
| **Prompt Caching** | Minimum cacheable prompt length is 512 tokens. Supports 5-minute and 1-hour cache durations. |
| **Knowledge Cutoff** | June 2026. |

### Known Limitations

* `thinking: {"type": "disabled"}`, manual thinking budgets, non-default sampling parameters, assistant prefilling, and forced `tool_choice` values (`any` or a named tool) return a 400 error.
* Thinking blocks are bound to the originating account or linked accounts and have model-compatibility restrictions. Preserve blocks unchanged and keep conversations append-only.
* Longer progress notes between tool calls arrive in thinking blocks and are hidden by default under adaptive thinking. Parse responses by block type; do not assume the first block contains visible text.
* At lower effort, the model can stop before completing long tasks or skip verification; higher effort can introduce unrequested additions. Complex, open-ended work still favors Opus 5.5.
* A refusal can return HTTP 200 with `stop_reason: "refusal"`. Optional server-side fallback is beta and can return a successful response from a different model.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | 5m Cache Write<br/>(USD / 1M Tokens) | 1h Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | --------------------: | -----------------------------: | -----------------------------: | -------------------------: | ---------------------: | ---: |
| **Claude Sonnet 5.5** | `$2.00` | `$2.50` | `$4.00` | `$0.20` | `$10.00` | `$0.01` |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance. Web search costs `10,000 Credits` (`$0.01`) per use.

:::info Caching note
For Claude Sonnet 5.5, a 5-minute cache write is billed at 1.25x the input rate and a 1-hour cache write is billed at 2x. Cache reads and refreshes are billed at 0.1x the input rate. Eligible prompts must contain at least 512 tokens.
:::

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
