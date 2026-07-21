# Kimi K3

## Overview

Kimi K3 is Moonshot AI's flagship model, announced on July 16, 2026. Available through the API as `kimi-k3`, it combines a sparse Mixture-of-Experts architecture, native image and video understanding, always-on reasoning, and a 1,048,576-token context window for long-horizon coding, knowledge work, and agentic workflows.

## Key Features

* **Sparse MoE Architecture**: Uses Kimi Delta Attention (KDA), Attention Residuals (AttnRes), and Stable LatentMoE, activating a subset of experts per request for efficient large-scale inference.
* **Long-Horizon Agentic Work**: Designed to navigate large repositories, coordinate terminal tools, conduct multi-step research, and produce complete software or knowledge-work artifacts with limited supervision.
* **Native Visual Understanding**: Accepts text, image, and video input and can use visual feedback in frontend engineering, game development, CAD, document analysis, animation, and video-editing workflows.
* **1M Context and Large Outputs**: Provides a 1,048,576-token context window with automatic context caching. `max_completion_tokens` defaults to 131,072 and can be configured up to 1,048,576, subject to the combined context limit.
* **Production API Controls**: Supports streaming, function calling, `tool_choice`, dynamic tool loading, strict JSON Schema output, Partial Mode, and official Formula tools through an OpenAI-compatible Chat Completions API.

## Best Use Cases

* **Large-Repository Software Engineering**: Long-running implementation, debugging, repository navigation, terminal orchestration, GPU kernel optimization, compiler work, and visually guided frontend or game development.
* **End-to-End Knowledge Work**: Research, financial and scientific analysis, document synthesis, spreadsheet tasks, presentation creation, and interactive reports that combine evidence, code, and visualizations.
* **Multimodal Agent Workflows**: Tasks that require text, screenshots, images, video, tools, and iterative visual feedback within the same agent loop.
* **Long-Context Applications**: Codebase assistants, fixed-corpus analysis, document Q&A, and agents that benefit from a stable repeated prefix and automatic cache hits.

## Capabilities and Limitations

| Capability           | Description                                                                                                                                                                        |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reasoning**        | Always uses thinking mode; `reasoning_effort` currently supports only `max`.                                                                                                       |
| **Coding**           | Suitable for long-running coding, repository navigation, terminal workflows, compiler work, GPU kernel optimization, debugging, and visually guided frontend or game development. |
| **Creative Writing** | Supports general and long-form text generation.                                                                                                                                    |
| **Multimodal**       | Text, image, and video input with text output.                                                                                                                                     |
| **Response Speed**   | Latency depends on reasoning length, output length, media inputs, and tool use.                                                                                                    |
| **Context Window**   | 1,048,576 tokens, with automatic caching for repeated initial context.                                                                                                             |
| **Max Output**       | 131,072 tokens by default; configurable up to 1,048,576 tokens, subject to the combined context-window limit.                                                                      |
| **Tool Use**         | Function calling, `tool_choice`, dynamic tool loading, structured output, JSON Mode, Partial Mode, and official Formula tools.                                                     |
| **Multilingual**     | Supports Chinese and English usage; provider-side language coverage may evolve with the Kimi API.                                                                                  |

### Known Limitations

* Kimi K3 currently supports only `reasoning_effort="max"`; `temperature`, `top_p`, `n`, presence penalty, and frequency penalty are fixed by the API.
* Multi-turn and tool-calling requests must return the complete assistant message, including thinking history. Omitting that history or switching to Kimi K3 midway through a session can make output quality unstable.
* Applications with strict boundaries should provide explicit constraints in the system prompt or `AGENTS.md`.
* Public image URLs are not accepted directly. Images must use base64 or an `ms://` file reference, and videos must be uploaded before use.
* Built-in web-search support is not listed in the current B.AI pricing table for this model. Check the platform model catalog for the latest runtime availability.

## Credits Usage

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **Kimi K3** | `3.00` | `3.00` | `0.30` | `15.00` | `-` | Cache write is billed at the same rate as input; cache read is billed at 0.1x input |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
