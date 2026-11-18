# GPT-6.2 Astra

## Overview

GPT-6.2 Astra is OpenAI's GPT-6.2 reasoning model for demanding software engineering and professional projects, [released on November 17, 2026](https://developers.openai.com/api/docs/changelog). It combines text and image understanding, adjustable reasoning, and tool use to plan and complete complex work.

## Key Features

- **Complex Project Work**: Plans and carries out projects, adapting its approach as new information becomes available.
- **Software Engineering**: Builds and revises software, using code execution and editing tools to support implementation and verification.
- **Visual Computer Use**: Interprets screenshots and works with computer-use tools to carry out tasks across applications.
- **Long Working Context**: Accommodates extensive source material, code, and conversation history within a 1.05M-token context window.
- **Agent Delegation**: Supports the Responses API Multi-agent beta, allowing independent subtasks to be delegated to subagents.
- **Clear Writing**: Produces concise, direct writing by default, with tone and detail adjustable for the intended audience.

## Best Use Cases

- **Complex Software Projects**: Implementation, debugging, and code review that involve multiple components and repeated testing.
- **Research and Technical Decisions**: Open-ended analysis that requires comparing evidence, testing assumptions, and weighing trade-offs.
- **Professional Deliverables**: Turning a detailed brief and supporting material into reports, documents, or applications with iterative revision.
- **Computer-Based Workflows**: Coordinating a sequence of actions across interfaces, files, and connected tools.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports `low`, `medium`, `high`, `xhigh`, and `max`; `none` and `minimal` are unsupported. |
| **Multimodal** | Text and image input; text output. Native audio and video are unsupported. |
| **Context Window** | [1,050,000 tokens](https://developers.openai.com/api/docs/models/gpt-6.2-astra), shared by input and generated tokens. |
| **Max Input** | 922,000 tokens. |
| **Max Output** | 128,000 tokens, including reasoning and visible output. |
| **Tool Use** | Supports functions, web and file search, code execution, computer use, MCP, and image generation through Responses API tools. |
| **Structured Output** | Supports Structured Outputs and streaming. |
| **Prompt Caching** | Supports implicit and explicit caching, with 30-minute or 12-hour minimum lifetimes in the Responses API. |
| **Knowledge Cutoff** | May 18, 2026. |

### Known Limitations

- Tool calling requires the Responses API; Chat Completions supports requests without tools.
- Sampling and log-probability controls are unsupported. Fine-tuning is unavailable.
- Reasoning consumes the output budget and can increase latency; an insufficient budget can leave a response incomplete before a visible answer is produced.
- Editing earlier conversation content or switching to a smaller model can discard prior reasoning, reducing continuity and increasing repeated work.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Context | Input<br/>(USD / 1M Tokens) | 30m Cache Write<br/>(USD / 1M Tokens) | 12h Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| Up to 272K input tokens | `$8.00` | `$10.00` | `$20.00` | `$0.40` | `$40.00` | `$0.01` |
| More than 272K input tokens | `$16.00` | `$20.00` | `$40.00` | `$0.80` | `$60.00` | `$0.01` |

- Above 272K input tokens, the higher rates apply to the entire request, not only the portion above the threshold.
- [Cache-write charges](https://developers.openai.com/api/docs/guides/prompt-caching) apply to both implicit and explicit caching and replace the ordinary input charge for those tokens. The default minimum lifetime is 30 minutes. A 30-minute write costs 1.25x the applicable input rate; a 12-hour write costs 2.5x. Both lifetimes have the same cache-read rate, 0.05x the applicable input rate.
- Reasoning tokens are billed as output tokens.
- Web search costs `10,000 Credits` (`$0.01`) per use and is not affected by the context tier. Search content tokens are billed at the applicable model token rates.

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

:::info Pricing note
Model prices in the documentation are based on the model providers' official list prices and serve as B.AI standard reference prices. B.AI may offer discounts or limited-time promotions on this basis; offer details are shown in [Promotions and Pricing Updates](../promotions-and-pricing-notices.md) and the website's discount groups. Applicable prices, offer terms, and final charges are subject to the platform display and actual billing records.
:::
