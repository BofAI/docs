# Gemini 3.8 Flash

## Overview

Gemini 3.8 Flash is a generally available Gemini 3-series model released by Google on September 2, 2026. It is positioned for long-horizon software engineering, autonomous agents, and complex knowledge workflows, with a 1M-token input window and configurable reasoning effort.

## Key Features

- **Long-Horizon Agentic Execution**: Designed for multi-step planning, iterative tool use, and verification across extended software-engineering and enterprise workflows.
- **Configurable Thinking**: Supports `low`, `medium`, and `high` thinking levels; `medium` is the default, while `minimal` is rejected.
- **Native Multimodal Input**: Accepts text, images, video, audio, and PDFs within a 1,048,576-token input limit and produces up to 65,536 text tokens.
- **Broad Tool Support**: Supports function calling, structured outputs, code execution, File Search, URL context, Search and Maps grounding, and Computer Use in preview.

## Best Use Cases

- **Agentic Software Engineering**: Repository analysis, multi-file implementation, debugging, and migration workflows that require repeated reasoning and tool calls.
- **Complex Knowledge Work**: Long-form analysis and report generation across large document sets, structured data, and domain-specific evidence.
- **Multimodal Analysis**: Understanding documents, screenshots, charts, video, and audio together with text instructions.
- **Tool-Orchestrated Applications**: Agents that combine custom functions with code execution, search, URL retrieval, file search, or computer interaction.
- **Asynchronous Bulk Processing**: Classification, extraction, evaluation, and other delay-tolerant workloads that can use Batch or Flex inference.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports `low`, `medium`, and `high` thinking levels, with `medium` as the default. Higher effort can improve difficult multi-step work but may increase token consumption and latency. |
| **Coding** | Optimized for long-horizon software-engineering and agentic coding workflows. Google's release materials report gains over Gemini 3.7 Flash; provider-run evaluations are not production guarantees. |
| **Multimodal** | Accepts text, image, video, audio, and PDF input and produces text output. |
| **Context Window** | 1,048,576 input tokens. |
| **Max Output** | 65,536 tokens. |
| **Tool Use** | Function calling, structured outputs, code execution, File Search, URL context, Search and Maps grounding, and Computer Use (Preview). |
| **Knowledge Cutoff** | March 2026 overall; Google notes that knowledge in some domains may be limited to January 2025. Use grounding for newer or time-sensitive information. |

### Known Limitations

- The model can hallucinate, and Google notes that occasional slowness or timeout issues may occur.
- Difficult tasks and higher thinking levels may consume more reasoning and output tokens than earlier Flash workflows; applications should tune effort to their latency and cost targets.
- `minimal` thinking is unsupported. Legacy sampling parameters including `temperature`, `top_p`, and `top_k` are ignored, and prefilled model turns are rejected.
- Computer Use remains a preview capability, and the model does not support native image generation or native audio generation.

## Pricing

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) |
| :--- | ---: | ---: | ---: | ---: | ---: |
| Gemini 3.8 Flash | 0.75 | 0.75 | 0.075 | 3.75 | 14,000 |

Explicit cache storage costs 0.50 Credits/Token per hour through December 31, 2026, and 1.00 Credits/Token per hour starting January 1, 2027.
