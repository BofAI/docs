# Claude Opus 5.5

## Overview

Claude Opus 5.5 is an Anthropic model released on September 22, 2026, for extended software engineering, autonomous agents, and professional knowledge work. On B.AI, use the model ID `claude-opus-5.5`. It combines a 1M-token context window with always-on adaptive thinking.

## Key Features

* **Agentic Coding**: Designed for repository-scale engineering, iterative testing, and long-running tool workflows.
* **Adjustable Reasoning**: Supports `low`, `medium`, `high`, `xhigh`, and `max` effort. The default is `medium`; adaptive thinking cannot be disabled.
* **Large Working Context**: Supports 1M tokens of context and up to 128K output tokens, with no long-context price premium.
* **Tools and Structured Results**: Supports automatic tool selection, strict schemas, structured outputs, computer and browser use, and mid-conversation system messages.
* **Vision and Professional Writing**: Supports charts, diagrams, screenshots, documents, code explanations, and business deliverables.

## Best Use Cases

* **Repository-Scale Engineering**: Migrations, debugging, and code review requiring sustained context and tool use.
* **Business Agents**: Multi-step application workflows requiring context retention and subtask coordination.
* **Document Analysis**: Reviewing reports and spreadsheets and preparing summaries from textual and visual evidence.
* **Visual Application Workflows**: Interpreting screenshots or operating interfaces through computer and browser tools.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Always-on adaptive thinking with `low`, `medium` (default), `high`, `xhigh`, and `max` effort. |
| **Multimodal** | Text and image input; text output. Supports PDF analysis and visual interpretation. |
| **Context Window** | 1M tokens. |
| **Max Output** | 128K tokens. |
| **Tool Use** | Client-side and server-side tools, automatic function calling, strict schemas, and structured outputs. Forced tool selection is unsupported. |
| **Prompt Caching** | Minimum cacheable prompt length is 512 tokens. Supports 5-minute and 1-hour cache durations. |
| **Knowledge Cutoff** | June 2026. |

### Known Limitations

* Disabling thinking, setting manual `budget_tokens`, or forcing `tool_choice` to `any` or a named tool returns a 400 error.
* Preserved thinking is tied to its model and prior context; incompatible edits or model switches can invalidate or drop replayed blocks.
* Safeguard refusals can return HTTP 200 with `stop_reason: "refusal"`; HTTP success alone does not establish task completion.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | 5m Cache Write<br/>(USD / 1M Tokens) | 1h Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | --------------------: | -----------------------------: | -----------------------------: | -------------------------: | ---------------------: | ---: |
| **Claude Opus 5.5** | `$4.00` | `$5.00` | `$8.00` | `$0.20` | `$20.00` | `$0.01` |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance. Web search costs `10,000 Credits` (`$0.01`) per use.

:::info Caching note
For Claude Opus 5.5, a 5-minute cache write is billed at 1.25x the input rate and a 1-hour cache write is billed at 2x. Cache reads and refreshes are billed at 0.05x the input rate. Eligible prompts must contain at least 512 tokens.
:::

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
