# Qwen3.8-27B

## Overview

Qwen3.8-27B is an open-weight, dense vision-language model from Alibaba's Qwen team with 27 billion parameters. It is designed for coding, professional workflows, research, multimodal interaction, and long-horizon agent tasks. The model accepts text, image, and video input and produces text output. Thinking mode is enabled by default and can be enabled or disabled depending on task requirements.

## Key Features

* **Open-Weight Dense Model:** Uses a 27B-parameter dense architecture that balances model capabilities with deployment costs.
* **Ultra-Long Context and Output:** Provides a 262,144-token context window and a 131,072-token maximum output, suitable for large codebases, long documents, and multi-step tasks.
* **Multimodal Input:** Supports text, image, and video inputs with text output.
* **Flexible Reasoning Modes:** Thinking mode is enabled by default, can be disabled when appropriate, and supports different reasoning-effort levels.
* **Agents and Tool Calling:** Supports tool calling, structured output, and multi-step task execution for long-horizon agent workflows.

## Best Use Cases

* **Coding and Software Engineering:** Code generation, code comprehension, debugging, refactoring, and repository-level tasks.
* **Professional Workflows:** Complex information organization, structured information extraction, and multi-step business tasks.
* **Research and Long-Document Analysis:** Analysis and summarization of lengthy reports, research papers, knowledge bases, and large-scale contexts.
* **Long-Horizon Agent Tasks:** Tool calling, task planning, sustained reasoning, and multi-turn execution.
* **Multimodal Understanding:** Joint understanding of and question answering across images, videos, and text.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Thinking mode is enabled by default but can be disabled depending on the task; multiple reasoning-effort levels are supported. |
| **Creative Writing** | Suitable for code generation, professional content creation, research, and complex workflows. |
| **Multimodal** | Accepts text, image, and video input and produces text output. |
| **Response Speed** | Response time varies depending on reasoning effort, input length, and output size. |
| **Context Window** | 262,144 tokens. |
| **Max Output** | 131,072 tokens. |
| **Tool Use** | Supports tool calling, structured output, and multi-step task execution. |

## Pricing

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: |
| **Qwen3.8-27B** | `0.22` | `0.22` | `0.022` | `1.60` | `-` |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
