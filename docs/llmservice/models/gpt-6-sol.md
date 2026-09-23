# GPT-6 Sol

## Overview

GPT-6 Sol is an OpenAI GPT-6 model released on September 22, 2026, for complex software engineering and agentic workflows with a focus on balancing capability and cost. Its model ID is `gpt-6-sol`. It combines configurable reasoning, visual input, and a 1,050,000-token context window.

## Key Features

* **Repository-Level Coding**: OpenAI reports 68.8% on DeepSWE v1.1 at `max` effort, supporting sustained implementation and debugging work.
* **Professional Workflow Automation**: OpenAI reports 33.2% on AutomationBench 1.0.6 at `xhigh` effort for workflows spanning multiple applications.
* **Visual Computer Use**: Combines screenshot understanding with computer-use tools for visual application workflows.
* **Flexible Reasoning**: Supports `none`, `low`, `medium`, `high`, `xhigh`, and `max` reasoning effort.
* **Reusable Agent Context**: Supports implicit and explicit prompt caching for agent workflows.

## Best Use Cases

* **Software Maintenance and Delivery**: Multi-file implementation, debugging, code review, and test generation.
* **Business Process Automation**: Tool-driven workflows across support, operations, and internal applications.
* **Document and Codebase Analysis**: Synthesis across large reference collections and repositories.
* **Browser and Desktop Assistance**: Visual workflows that interpret interface state and execute multistep actions.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports `none`, `low`, `medium` (default), `high`, `xhigh`, and `max`. |
| **Multimodal** | Text and image input; text output. |
| **Context Window** | 1,050,000 tokens. |
| **Max Output** | 128,000 tokens; reasoning consumes part of the generated-token budget. |
| **Tool Use** | Responses API supports functions, web and file search, computer use, hosted shell, code interpreter, Apply Patch, MCP, skills, tool search, and image generation. |
| **Structured Output** | Supports Structured Outputs and streaming. |
| **Knowledge Cutoff** | April 20, 2026. |

### Known Limitations

* Reasoning with tools requires the Responses API. Chat Completions permits function calling only with `reasoning_effort: "none"`.
* With reasoning enabled, `temperature`, `top_p`, and log-probability controls are unsupported. Fine-tuning is not available.
* Requests above 272K input tokens use higher rates for the entire request.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Context | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | ---: |
| Up to 272K input tokens | `$2.00` | `$2.50` | `$0.20` | `$10.00` | `$0.01` |
| More than 272K input tokens | `$4.00` | `$5.00` | `$0.40` | `$15.00` | `$0.01` |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

* For requests with more than 272K input tokens, the long-context rates apply to the full request. Output billing includes reasoning tokens.
* Cache Write is billed at 1.25x the input rate. Cache reads are billed at 0.1x input. The supported cache lifetime is 30 minutes and refreshes on reuse.
* Web search costs `10,000 Credits` (`$0.01`) per use and is not affected by the context tier.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
