# GPT-6.1 Sol

## Overview

GPT-6.1 Sol is an OpenAI reasoning model released on September 29, 2026, in the GPT-6 series, designed for complex software engineering, computer use, and professional work. On B.AI, use the model ID `gpt-6.1-sol`. OpenAI positions it as a lower-cost alternative to GPT-6 Astra with comparable capabilities across these workloads, combining configurable reasoning with a 1.05M-token context window.

## Key Features

* **Complex Software Engineering**: In OpenAI's DeepSWE v1.1 evaluation, exceeds GPT-6 Sol's best score by 6.4 percentage points at lower reasoning effort and cost.
* **Professional Workflow Automation**: Improves on GPT-6 Sol by 4.8 percentage points at `medium` effort on AutomationBench 1.0.6, which tests multi-step business workflows.
* **Visual Computer Use**: Outperforms GPT-6 Sol by 7 percentage points at maximum effort on OSWorld 2.0, measured as partial reward on the offline v2026.08.08 set.
* **Adjustable Reasoning**: Five effort levels let applications balance reasoning depth, latency, and token consumption. Reasoning cannot be disabled.
* **Reusable Working Context**: Supports implicit and explicit prompt caching for repeated instructions, reference material, and conversation history; cache reads cost 5% of the corresponding uncached input rate.
* **Parallel Agent Work**: The Responses API Multi-agent beta lets the model delegate independent subtasks and combine their results, supporting tasks such as codebase exploration and multi-perspective review.

## Best Use Cases

* **Software Maintenance and Delivery**: Multi-file implementation, debugging, and code review that require repeated inspection, execution, and revision.
* **Professional Deliverables**: Turning source documents and data into reports, presentations, or websites using appropriate document and execution tools.
* **Browser and Desktop Workflows**: Tasks that require understanding screenshots, navigating interfaces, and taking a sequence of actions through computer-use tools.
* **Long-Document Analysis**: Comparing large reference collections or technical specifications while retaining substantial source context and reusing stable material across follow-up requests.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports `low`, `medium` (default), `high`, `xhigh`, and `max`; `none` and `minimal` are unsupported. |
| **Multimodal** | Text and image input; text output. |
| **Context Window** | 1,050,000 tokens, shared by input and generated tokens. |
| **Max Output** | 128,000 tokens; the generated-token budget includes reasoning and visible output. |
| **Tool Use** | Responses API supports functions, web and file search, computer use, hosted shell, code interpreter, Apply Patch, MCP, skills, tool search, and image generation. |
| **Structured Output** | Supports Structured Outputs and streaming. |
| **Agent Coordination** | Multi-agent delegation is in beta. GPT-6 workflows also support asynchronous tool calls and mid-turn steering over Responses API WebSocket connections. |
| **Knowledge Cutoff** | April 30, 2026. |

### Known Limitations

* Tool calling requires the Responses API. Chat Completions supports this model only for requests without tools.
* `temperature`, `top_p`, and log-probability controls are unsupported with its reasoning settings. Fine-tuning is unavailable.
* Reasoning consumes context and output capacity and can increase latency and cost. Insufficient output capacity can produce an incomplete response before a visible answer appears.
* The Multi-agent beta does not support `/responses/compact`, `reasoning.summary`, or `max_tool_calls`; it uses automatic compaction separately for each agent.
* Performance remains workload-dependent. OpenAI still recommends Astra for the hardest scientific research tasks.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Context | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | ---: |
| Up to 272K input tokens | `$2.00` | `$2.50` | `$0.10` | `$10.00` | `$0.01` |
| More than 272K input tokens | `$4.00` | `$5.00` | `$0.20` | `$15.00` | `$0.01` |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

* For requests with more than 272K input tokens, the long-context rates apply to the full request. Output billing includes reasoning tokens.
* Cache Write is billed at 1.25x the input rate and replaces the ordinary input charge for those tokens. It is not an additional charge. Cache reads are billed at 0.05x input. The minimum cacheable prefix is 1,024 visible input tokens. The supported cache lifetime is 30 minutes and refreshes on reuse without another write charge.
* Web search costs `10,000 Credits` (`$0.01`) per use and is not affected by the context tier.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
