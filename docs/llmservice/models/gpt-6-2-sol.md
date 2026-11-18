# GPT-6.2 Sol

## Overview

GPT-6.2 Sol is OpenAI's GPT-6.2 reasoning model for everyday coding, professional work, and agent workflows, [released on November 17, 2026](https://developers.openai.com/api/docs/changelog). It combines text and image understanding with tool use and long context, offering a lower-cost option than Astra for complex work.

## Key Features

- **Everyday Software Development**: Supports bug fixes, feature additions, and other work in existing codebases.
- **Iterative Task Execution**: Works through multistep tasks that require testing and revision along the way.
- **Tool-Based Agents**: Supports search, code execution, computer use, and connected tools through the Responses API.
- **Adjustable Reasoning**: Lets applications balance reasoning depth, response time, and token usage; OpenAI recommends starting with medium effort for a new integration.
- **Long Working Context**: Combines a 1.05M-token context window with prompt caching for reusable instructions and reference material.
- **Agent Delegation**: Supports the Responses API Multi-agent beta for delegating independent subtasks to subagents.

## Best Use Cases

- **Codebase Maintenance**: Fixing bugs, adding scoped features, and revising code with clear acceptance criteria.
- **Operational Assistants**: Completing repeatable workflows that combine information retrieval, application interaction, and tool calls.
- **Document Drafting**: Turning notes and source material into drafts for review, then incorporating feedback.
- **Document and Image Analysis**: Reviewing lengthy reference material alongside screenshots or other images, and returning structured findings.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports `low`, `medium`, `high`, `xhigh`, and `max`; `none` and `minimal` are unsupported. |
| **Multimodal** | Text and image input; text output. Native audio and video are unsupported. |
| **Context Window** | [1,050,000 tokens](https://developers.openai.com/api/docs/models/gpt-6.2-sol), shared by input and generated tokens. |
| **Max Input** | 922,000 tokens. |
| **Max Output** | 128,000 tokens, including reasoning and visible output. |
| **Tool Use** | Supports functions, web and file search, code execution, computer use, MCP, and image generation through Responses API tools. |
| **Structured Output** | Supports Structured Outputs and streaming. |
| **Prompt Caching** | Supports implicit and explicit caching, with 30-minute or 12-hour minimum lifetimes in the Responses API. |
| **Knowledge Cutoff** | June 1, 2026. |

### Known Limitations

- Tool calling requires the Responses API; Chat Completions supports requests without tools.
- Sampling and log-probability controls are unsupported. Fine-tuning is unavailable.
- Reasoning consumes the output budget and can increase latency; an insufficient budget can leave a response incomplete before a visible answer is produced.
- Editing earlier conversation content or switching to a smaller model can discard prior reasoning, reducing continuity and increasing repeated work.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Context | Input<br/>(USD / 1M Tokens) | 30m Cache Write<br/>(USD / 1M Tokens) | 12h Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| Up to 272K input tokens | `$2.00` | `$2.50` | `$5.00` | `$0.10` | `$10.00` | `$0.01` |
| More than 272K input tokens | `$4.00` | `$5.00` | `$10.00` | `$0.20` | `$15.00` | `$0.01` |

- Above 272K input tokens, the higher rates apply to the entire request, not only the portion above the threshold.
- [Cache-write charges](https://developers.openai.com/api/docs/guides/prompt-caching) apply to both implicit and explicit caching and replace the ordinary input charge for those tokens. The default minimum lifetime is 30 minutes. A 30-minute write costs 1.25x the applicable input rate; a 12-hour write costs 2.5x. Both lifetimes have the same cache-read rate, 0.05x the applicable input rate.
- Reasoning tokens are billed as output tokens.
- Web search costs `10,000 Credits` (`$0.01`) per use and is not affected by the context tier. Search content tokens are billed at the applicable model token rates.

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

:::info Pricing note
Model prices in the documentation are based on the model providers' official list prices and serve as B.AI standard reference prices. B.AI may offer discounts or limited-time promotions on this basis; offer details are shown in [Promotions and Pricing Updates](../promotions-and-pricing-notices.md) and the website's discount groups. Applicable prices, offer terms, and final charges are subject to the platform display and actual billing records.
:::
