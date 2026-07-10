# GPT-5.6 Luna

## Overview

GPT-5.6 Luna is OpenAI's cost-oriented GPT-5.6 tier, made generally available on July 9, 2026. In the API, its model ID is `gpt-5.6-luna`, and OpenAI positions it for efficient, high-volume workloads.

## Key Features

* **Cost-Oriented GPT-5.6 Tier**: Designed for high-volume workloads where lower token cost and responsiveness are important.
* **Expanded Reasoning Controls**: Supports `none`, `low`, `medium`, `high`, `xhigh`, and `max` reasoning effort; GPT-5.6 also supports Pro mode through `reasoning.mode: "pro"`.
* **Agentic Tooling**: Supports Responses API workflows, functions, web search, file search, computer use, Programmatic Tool Calling, persisted reasoning, and multi-agent beta.
* **Large Working Context**: Supports a 1.05M-token context window and up to 128K output tokens, with a February 16, 2026 knowledge cutoff.

## Best Use Cases

* **High-Volume Assistance**: Summarization, rewriting, classification, extraction, routing, and lightweight analysis.
* **Responsive Product Features**: User-facing assistants, workflow copilots, and routine automation with predictable cost constraints.
* **First-Pass Technical Work**: Initial issue triage, draft code review, test-case generation, and document analysis before escalating difficult cases to Terra or Sol.

## Capabilities and Limitations

| Capability           | Description                                                                                                                                              |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reasoning**        | Supports `none`, `low`, `medium`, `high`, `xhigh`, and `max`; API Pro mode is enabled with `reasoning.mode: "pro"` rather than a separate Pro model slug. |
| **Coding**           | Official benchmark examples include SWE-Bench Pro 62.7%, DeepSWE v1.1 67.2%, and Terminal-Bench 2.1 84.7%.                                               |
| **Creative Writing** | General text generation is supported.                                                                                                                    |
| **Multimodal**       | Text and image input with text output; GPT-5.6 preserves original image dimensions for `original` or `auto` detail.                                      |
| **Response Speed**   | Public API latency depends on reasoning effort, tools, and processing tier; Luna is positioned for efficient, high-volume use.                           |
| **Context Window**   | 1.05M tokens.                                                                                                                                            |
| **Max Output**       | 128K tokens.                                                                                                                                             |
| **Tool Use**         | Functions, web search, file search, computer use, Programmatic Tool Calling, persisted reasoning, and multi-agent beta.                                  |
| **Multilingual**     | OpenAI API model documentation lists multilingual support across current models.                                                                         |

### Known Limitations

* Luna is positioned below Terra and Sol for capability, so complex reasoning, sensitive technical work, and quality-first workflows may need escalation.
* Higher reasoning efforts, Pro mode, multi-agent runs, and long-context use can increase latency and cost.
* Cyber and biology safeguards may refuse, block, or pause sensitive requests, including some legitimate dual-use work.
* Prompt cache writes are billed on GPT-5.6 models, so cache breakpoints should be monitored with `cache_write_tokens` and `cached_tokens`.

## Credits Usage

| Context | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| Short context | `1.00` | `1.25` | `0.10` | `6.00` | `10,000` | Standard GPT-5.6 Luna pricing |
| Long context (>272K input tokens) | `2.00` | `2.50` | `0.20` | `9.00` | `10,000` | Long-context pricing tier |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::

* For GPT-5.6 models, cache writes are billed at 1.25x the uncached input rate; cache reads remain discounted at 0.1x input.
