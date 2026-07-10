# GPT-5.6 Terra

## Overview

GPT-5.6 Terra is OpenAI's balanced GPT-5.6 tier, made generally available on July 9, 2026. In the API, its model ID is `gpt-5.6-terra`, and OpenAI positions it for workloads that balance capability and cost.

## Key Features

* **Balanced GPT-5.6 Tier**: Positioned between Sol and Luna for production workflows that need strong reasoning at lower cost than Sol.
* **Expanded Reasoning Controls**: Supports `none`, `low`, `medium`, `high`, `xhigh`, and `max` reasoning effort; GPT-5.6 also supports Pro mode through `reasoning.mode: "pro"`.
* **Agentic Tooling**: Supports Responses API workflows, functions, web search, file search, computer use, Programmatic Tool Calling, persisted reasoning, and multi-agent beta.
* **Large Working Context**: Supports a 1.05M-token context window and up to 128K output tokens, with a February 16, 2026 knowledge cutoff.

## Best Use Cases

* **Production Knowledge Work**: Drafting, analysis, document processing, structured research, and multi-step business workflows.
* **Software Engineering Assistance**: Debugging, test planning, code review, repository navigation, and implementation support where cost control matters.
* **Scaled Professional Automation**: Tool-heavy workflows that need strong quality but do not require Sol for every request.

## Capabilities and Limitations

| Capability           | Description                                                                                                                                              |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reasoning**        | Supports `none`, `low`, `medium`, `high`, `xhigh`, and `max`; API Pro mode is enabled with `reasoning.mode: "pro"` rather than a separate Pro model slug. |
| **Coding**           | Official benchmark examples include SWE-Bench Pro 63.4%, DeepSWE v1.1 69.6%, and Terminal-Bench 2.1 87.4%.                                               |
| **Creative Writing** | General text generation is supported.                                                                                                                    |
| **Multimodal**       | Text and image input with text output; GPT-5.6 preserves original image dimensions for `original` or `auto` detail.                                      |
| **Response Speed**   | Public API latency depends on reasoning effort, tools, and processing tier; Terra is positioned as the balanced tier for intelligence and cost.          |
| **Context Window**   | 1.05M tokens.                                                                                                                                            |
| **Max Output**       | 128K tokens.                                                                                                                                             |
| **Tool Use**         | Functions, web search, file search, computer use, Programmatic Tool Calling, persisted reasoning, and multi-agent beta.                                  |
| **Multilingual**     | OpenAI API model documentation lists multilingual support across current models.                                                                         |

### Known Limitations

* Terra is positioned below Sol for capability, so the hardest quality-first workflows may need Sol, Pro mode, or higher reasoning effort.
* Higher reasoning efforts, Pro mode, multi-agent runs, and long-context use can increase latency and cost.
* Cyber and biology safeguards may refuse, block, or pause sensitive requests, including some legitimate dual-use work.
* Prompt cache writes are billed on GPT-5.6 models, so cache breakpoints should be monitored with `cache_write_tokens` and `cached_tokens`.

## Credits Usage

| Context | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| Short context | `2.50` | `3.125` | `0.25` | `15.00` | `10,000` | Standard GPT-5.6 Terra pricing |
| Long context (>272K input tokens) | `5.00` | `6.25` | `0.50` | `22.50` | `10,000` | Long-context pricing tier |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::

* For GPT-5.6 models, cache writes are billed at 1.25x the uncached input rate; cache reads remain discounted at 0.1x input.
