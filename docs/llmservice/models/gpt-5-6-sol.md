# GPT-5.6 Sol

## Overview

GPT-5.6 Sol is OpenAI's flagship GPT-5.6 tier, made generally available on July 9, 2026. In the API, its model ID is `gpt-5.6-sol`, and the `gpt-5.6` alias routes to this tier. It is designed for complex professional work, reasoning, coding, cybersecurity, science, and tool-heavy workflows.

## Key Features

* **GPT-5.6 Flagship Tier**: Designed for complex professional work, reasoning, coding, cybersecurity, science, and tool-heavy workflows.
* **Expanded Reasoning Controls**: Supports `none`, `low`, `medium`, `high`, `xhigh`, and `max` reasoning effort; GPT-5.6 also supports Pro mode through `reasoning.mode: "pro"`.
* **Agentic Tooling**: Supports Responses API workflows, functions, web search, file search, computer use, Programmatic Tool Calling, persisted reasoning, and multi-agent beta.
* **Large Working Context**: Supports a 1.05M-token context window and up to 128K output tokens, with a February 16, 2026 knowledge cutoff.

## Best Use Cases

* **Complex Software Engineering**: Repository-level debugging, command-line workflows, multi-file implementation, validation, and code review.
* **Long-Horizon Knowledge Work**: Browser, document, spreadsheet, presentation, and computer-use tasks that need sustained context and tool coordination.
* **Defensive Security and Research Support**: Authorized vulnerability review, patch development, threat modeling, biology workflow analysis, and scientific research assistance with human oversight.

## Capabilities and Limitations

| Capability           | Description                                                                                                                                                                    |
| :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reasoning**        | Supports `none`, `low`, `medium`, `high`, `xhigh`, and `max`; API Pro mode is enabled with `reasoning.mode: "pro"` rather than a separate Pro model slug.                     |
| **Coding**           | Official benchmark examples include SWE-Bench Pro 64.6%, DeepSWE v1.1 72.7%, Terminal-Bench 2.1 88.8%, and Terminal-Bench 2.1 Ultra 91.9%.                                     |
| **Creative Writing** | General text generation is supported.                                                                                                                                          |
| **Multimodal**       | Text and image input with text output; GPT-5.6 preserves original image dimensions for `original` or `auto` detail.                                                            |
| **Response Speed**   | Public API latency depends on reasoning effort, tools, and processing tier; OpenAI also announced Cerebras access for Sol at up to 750 tokens per second for select customers. |
| **Context Window**   | 1.05M tokens.                                                                                                                                                                  |
| **Max Output**       | 128K tokens.                                                                                                                                                                   |
| **Tool Use**         | Functions, web search, file search, computer use, Programmatic Tool Calling, persisted reasoning, and multi-agent beta.                                                        |
| **Multilingual**     | OpenAI API model documentation lists multilingual support across current models.                                                                                               |

### Known Limitations

* Higher reasoning efforts, Pro mode, multi-agent runs, and long-context use can increase latency and cost.
* Cyber and biology safeguards may refuse, block, or pause sensitive requests, including some legitimate dual-use work.
* OpenAI says GPT-5.6 does not cross the Critical threshold in cybersecurity or biology evaluations, so it should not be treated as an autonomous operator for high-risk work.
* Prompt cache writes are billed on GPT-5.6 models, so cache breakpoints should be monitored with `cache_write_tokens` and `cached_tokens`.

## Credits Usage

| Context | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| Short context | `5.00` | `6.25` | `0.50` | `30.00` | `10,000` | Standard GPT-5.6 Sol pricing |
| Long context (>272K input tokens) | `10.00` | `12.50` | `1.00` | `45.00` | `10,000` | Long-context pricing tier |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::

* For GPT-5.6 models, cache writes are billed at 1.25x the uncached input rate; cache reads remain discounted at 0.1x input.
