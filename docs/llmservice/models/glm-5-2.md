# GLM-5.2

## Overview

GLM-5.2 is a GLM-family text foundation model developed by Z.AI and released on June 16, 2026. It is positioned for long-horizon coding and engineering tasks, with a 1M-token context window, 128K maximum output, and a `reasoning_effort` control for adjusting reasoning depth.

## Key Features

* **1M Context Window**: Supports up to 1M tokens of context for project-scale codebases, long documents, and multi-step engineering workflows.
* **Long-Horizon Coding**: Z.AI reports 81.0 on Terminal-Bench 2.1 and 62.1 on SWE-bench Pro, with emphasis on project-level code understanding and sustained task execution.
* **Configurable Reasoning**: Supports deep-thinking mode and the GLM-5.2-specific `reasoning_effort` parameter, with `high` and `max` reasoning levels for complex tasks.
* **Agent and Tool Integration**: Supports function calling, streaming tool calls, structured output, context caching, and MCP-based tool/data-source integration.

## Best Use Cases

* **Project-Scale Codebase Work**: Reviewing, refactoring, migrating, or extending repositories where the model needs to retain architecture, module boundaries, API contracts, and engineering conventions.
* **Long-Horizon Engineering Tasks**: Multi-file implementation, dependency-aware refactoring, SDK adaptation, debugging loops, and test-fix-verify cycles that require sustained progress.
* **Tool-Using Agent Workflows**: Coding agents, internal automation, MCP-connected workflows, and structured-output systems that need reliable tool invocation and streamed tool-call arguments.

## Capabilities and Limitations

| Capability           | Description                                                                                                                                   |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reasoning**        | Supports deep-thinking mode and `reasoning_effort`; Z.AI positions it for complex engineering, debugging, and long-chain reasoning workflows. |
| **Creative Writing** | Supports general text generation through the chat completion API, but official GLM-5.2 materials emphasize coding and engineering use cases.  |
| **Coding**           | Z.AI reports Terminal-Bench 2.1 score of 81.0 and SWE-bench Pro score of 62.1, with focus on long-horizon coding-agent scenarios.             |
| **Multimodal**       | Text input and text output. Vision and multimodal workflows are handled by separate Z.AI vision-language models.                              |
| **Response Speed**   | Official docs do not publish latency or tokens-per-second figures; streaming responses and streaming tool calls are supported.                |
| **Context Window**   | 1M tokens.                                                                                                                                    |
| **Max Output**       | 128K tokens.                                                                                                                                  |
| **Tool Use**         | Function calling, streaming tool calls, structured output, context caching, and MCP integration.                                              |
| **Multilingual**     | Suitable for Chinese and English developer workflows; official docs do not publish a GLM-5.2 language coverage benchmark.                     |

### Known Limitations

* Text-only model; image, video, and GUI-understanding tasks require a separate vision-language model.
* Very long contexts and 128K outputs can increase latency and cost; cap `max_tokens` and use context caching where applicable.

## Credits Usage

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **GLM-5.2** | `1.40` | `1.40` | `0.28` | `4.40` | `-` | - |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
