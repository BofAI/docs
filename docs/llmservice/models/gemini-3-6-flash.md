# Gemini 3.6 Flash

## Overview

Gemini 3.6 Flash is a Gemini 3-series model for agentic coding, multimodal knowledge work, spatial reasoning, and multi-step workflows. On B.AI, use the model ID `gemini-3.6-flash`.

## Key Features

* **Agentic Workflows:** Designed for repeated reasoning, tool calls, and multi-step task execution.
* **Multimodal Input:** Supports text, image, video, audio, and PDF input with text output.
* **Configurable Thinking:** Supports thinking levels for balancing quality, latency, and token usage.
* **Long Context:** Supports up to 1,048,576 input tokens for large document collections, codebases, and extended task histories.
* **Tool Integration:** Supports function calling, structured outputs, code execution, grounding, URL context, and file-search workflows when enabled by the API configuration.

## Best Use Cases

* Agentic software engineering, including code generation, debugging, migrations, and repository-scale changes.
* Multimodal knowledge work, such as document analysis, chart interpretation, and report drafting.
* Long-context analysis across large codebases, document sets, and task histories.
* Tool-using workflows that combine reasoning, structured output, and repeated execution steps.

## Capabilities and Limitations

| Capability | Detailed Description |
| :--- | :--- |
| **Reasoning** | Supports configurable thinking levels for tasks that need different quality, latency, and cost tradeoffs. |
| **Coding** | Suitable for iterative coding, debugging, and multi-step engineering workflows. |
| **Multimodal** | Supports text, image, video, audio, and PDF input with text output. |
| **Context Window** | Supports up to 1,048,576 input tokens. |
| **Max Output** | Supports up to 65,536 output tokens. |
| **Tool Use** | Supports function calling, structured outputs, code execution, grounding, URL context, and file-search workflows when available. |
| **Multilingual** | Suitable for multilingual developer and knowledge-work tasks. |

### Known Limitations

* The model can produce inaccurate responses; use grounding or current external data when up-to-date information is required.
* Actual latency and tool availability vary with thinking level, prompt size, media inputs, and API configuration.
* Output is text-only; native image and audio generation are not included.

## Credits Usage

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **Gemini 3.6 Flash** | `1.50` | `1.50` | `0.15` | `7.50` | `14,000` | - |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
