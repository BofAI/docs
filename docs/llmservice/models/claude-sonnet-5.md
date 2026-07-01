# Claude Sonnet 5

## Overview

Claude Sonnet 5, released by Anthropic on June 30, 2026, is the next generation of the Sonnet family and a drop-in upgrade for Claude Sonnet 4.6. It is designed for stronger agentic behavior, coding, tool use, computer-use workflows, and knowledge work at Sonnet-tier pricing.

## Key Features

* **Agentic Task Execution**: Designed to plan, use tools such as browsers and terminals, and complete multi-step work more reliably than Claude Sonnet 4.6.
* **Adaptive Thinking by Default**: Requests run with adaptive thinking unless `thinking: {type: "disabled"}` is passed; the `effort` parameter controls the capability, latency, and token-spend tradeoff.
* **1M Context Window**: Supports a 1M-token context window by default, with no smaller context variant and no long-context surcharge.
* **Broad Platform Availability**: Available through the Claude API, Claude Code, Claude Platform on AWS, Amazon Bedrock, Google Cloud, Microsoft Foundry preview, and Claude consumer plans.

## Best Use Cases

* **Production Agent Workflows**: Multi-step automation, agentic search, tool-heavy reasoning, browser/terminal workflows, and long-running delegated tasks.
* **Software Engineering**: Coding, debugging, refactoring, code review, test-fix loops, and brownfield repository work where follow-through matters.
* **High-Volume Knowledge Work**: Research, analysis, structured extraction, business operations, legal research, customer workflows, and internal productivity tools that need a balance of capability and cost.

## Capabilities and Limitations

| Capability           | Description                                                                                                                                                                                                               |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Reasoning**        | Adaptive thinking is on by default; `effort` supports `low`, `medium`, `high`, `xhigh`, and `max`, with `high` as the default. Anthropic reports stronger agentic, coding, and knowledge-work performance than Sonnet 4.6. |
| **Creative Writing** | Supports general text generation and long-form writing; Anthropic recommends re-evaluating style prompts because prose style may shift versus earlier Sonnet models.                                                      |
| **Multimodal**       | Text and image input, text output, multilingual capabilities, and vision. Native audio/video input or generation is not listed.                                                                                           |
| **Response Speed**   | Listed with "Fast" comparative latency in Anthropic's model table. Lower effort can reduce latency and token usage; higher effort increases thinking/tool-use depth.                                                      |
| **Context Window**   | 1M tokens.                                                                                                                                                                                                                |
| **Max Output**       | 128K tokens.                                                                                                                                                                                                              |
| **Tool Use**         | Supports the same tool and platform feature set as Claude Sonnet 4.6 except Priority Tier is not available; tool use is more readily triggered at higher effort levels.                                                   |
| **Multilingual**     | Official docs state multilingual support across current Claude models, but do not publish a separate Sonnet 5 language benchmark.                                                                                         |

### Known Limitations

* Manual extended thinking (`thinking: {type: "enabled", budget_tokens: N}`) is removed and returns a 400 error; use adaptive thinking with `effort` instead.
* Non-default sampling parameters (`temperature`, `top_p`, `top_k`) return a 400 error; use system instructions for tone and style control.
* Assistant message prefilling remains unsupported and returns a 400 error.
* The new tokenizer produces approximately 30% more tokens for the same text than Claude Sonnet 4.6, so token budgets, context usage, and equivalent-request costs should be remeasured.
* Cybersecurity safeguards are enabled by default; high-risk or prohibited cybersecurity requests may be refused with `stop_reason: "refusal"`.

## Credits Usage

| Model | Pricing Period | Input (Credits/Token) | 5m Cache Write (Credits/Token) | 1h Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) |
| :--- | :--- | --------------------: | -----------------------------: | -----------------------------: | -------------------------: | ---------------------: | -----------------------: |
| **Claude Sonnet 5** | Through Aug 31, 2026 | `2.00` | `2.50` | `4.00` | `0.20` | `10.00` | `10,000` |
| **Claude Sonnet 5** | From Sep 1, 2026 | `3.00` | `3.75` | `6.00` | `0.30` | `15.00` | `10,000` |

:::info Pricing note
The main pricing table shows the currently effective standard reference price. For Claude Sonnet 5, the current standard reference price applies through August 31, 2026. Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
