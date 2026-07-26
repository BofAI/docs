# Claude Opus 5

## Overview

Claude Opus 5 is an Anthropic model designed for complex agentic coding, long-running workflows, and professional knowledge work. On B.AI, use the model ID `claude-opus-5`.

## Key Features

* **Adaptive Thinking:** Supports `effort` controls (`low`, `medium`, `high`, `xhigh`, and `max`) to balance reasoning depth, latency, and token usage.
* **Long Context:** Supports up to 1,000,000 tokens of context and up to 128,000 output tokens for long documents, codebases, and multi-step workflows.
* **Multimodal Understanding:** Supports text and image input with text output for document, chart, diagram, and interface analysis.
* **Tool-Using Workflows:** Supports function calling and structured output. Additional tool availability depends on the B.AI API configuration.
* **Prompt Caching:** Supports 5-minute and 1-hour cache-write pricing tiers for eligible prompts.

## Best Use Cases

* **Agentic Software Engineering:** Repository-scale implementation, debugging, refactoring, code review, and test-fix-verify workflows.
* **Long-Running Automation:** Multi-step tasks that combine planning, tool calls, intermediate validation, and recovery from failures.
* **Professional Knowledge Work:** Research synthesis, document analysis, structured extraction, and generation of professional deliverables.
* **Long-Context Analysis:** Large codebases, long documents, PDFs, charts, diagrams, and other visual references.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports adaptive thinking with configurable `effort` levels. Higher effort can increase reasoning depth, latency, and token usage. |
| **Creative Writing** | Supports general text generation, long-form writing, and professional document drafting. |
| **Multimodal** | Text and image input; text output. |
| **Response Speed** | Response time depends on prompt complexity, output length, and the selected reasoning effort. |
| **Context Window** | Up to 1,000,000 tokens. |
| **Max Output** | Up to 128,000 tokens. |
| **Tool Use** | Function calling and structured output are supported. Other tools depend on the B.AI API configuration. |
| **Multilingual** | Suitable for multilingual natural-language and developer workflows. |

### Known Limitations

* Very long contexts, large outputs, and higher reasoning effort can increase latency and Credits usage.
* Confirm tool availability and request parameters in a test environment before deploying a new workflow to production.
* Cache behavior and eligibility depend on the request format and platform configuration.

## Credits Usage

| Model | Input (Credits/Token) | 5m Cache Write (Credits/Token) | 1h Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) |
| :--- | --------------------: | -----------------------------: | -----------------------------: | -------------------------: | ---------------------: | -----------------------: |
| **Claude Opus 5** | `5.00` | `6.25` | `10.00` | `0.50` | `25.00` | `10,000` |

:::info Caching note
For Claude Opus 5, a 5-minute cache write is billed at 1.25x the input rate and a 1-hour cache write is billed at 2x. Cache reads are billed at 0.1x the input rate. Eligible prompts must contain at least 512 tokens.
:::

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
