# Gemini 3.5 Flash-Lite

## Overview

Gemini 3.5 Flash-Lite is a Gemini 3-series model for low-latency, high-throughput multimodal processing. It is suited to document extraction, classification, translation, structured data tasks, and parallel subagent workflows. On B.AI, use the model ID `gemini-3.5-flash-lite`.

## Key Features

* **High-Throughput Processing:** Designed for latency-sensitive, high-volume production traffic.
* **Multimodal Input:** Supports text, image, video, audio, and PDF input with text output.
* **Configurable Thinking:** Supports multiple thinking levels, with a lightweight default for fast responses.
* **Long Context:** Supports up to 1,048,576 input tokens for large-scale document and data processing.
* **Tool Integration:** Supports function calling, structured outputs, code execution, grounding, URL context, and file-search workflows when enabled by the API configuration.

## Best Use Cases

* Document and data extraction from PDFs, records, tables, and other multimodal inputs.
* Classification, routing, translation, tagging, and summarization at scale.
* Parallel subagent tasks that benefit from fast responses and structured outputs.
* Interactive applications, including chatbots and high-throughput content workflows.

## Capabilities and Limitations

| Capability | Detailed Description |
| :--- | :--- |
| **Reasoning** | Supports configurable thinking levels for trading off response speed and reasoning depth. |
| **Coding** | Suitable for focused coding assistance, tool-using tasks, and structured-output workflows. |
| **Multimodal** | Supports text, image, video, audio, and PDF input with text output. |
| **Context Window** | Supports up to 1,048,576 input tokens. |
| **Max Output** | Supports up to 65,536 output tokens. |
| **Tool Use** | Supports function calling, structured outputs, code execution, grounding, URL context, and file-search workflows when available. |
| **Multilingual** | Suitable for translation and multilingual production workloads. |

### Known Limitations

* The model can produce inaccurate responses; validate extracted or classified information before using it in critical workflows.
* Actual latency and tool availability vary with thinking level, prompt size, media inputs, and API configuration.
* Output is text-only; native image and audio generation are not included.

## Credits Usage

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **Gemini 3.5 Flash-Lite** | `0.30` | `0.30` | `0.03` | `2.50` | `14,000` | - |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
