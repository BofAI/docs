# Hy3

## Overview

Hy3 is a text foundation model from Tencent Hunyuan, released on July 6, 2026. It is available through the API with the model ID `hy3`. The model uses a Mixture-of-Experts (MoE) architecture with 295 billion total parameters and 21 billion activated parameters, and is designed for coding, long-context knowledge work, reasoning, and tool-driven agent workflows.

## Key Features

* **Hybrid Reasoning:** Supports direct responses and deeper reasoning. The documented modes are `no_think`, `think_low`, and `think_high`, allowing developers to balance response speed with reasoning depth.
* **Sparse MoE Architecture:** Uses 295 billion total parameters and 21 billion activated parameters. Its architecture includes 192 experts, with eight activated per token, plus 3.8 billion MTP-layer parameters.
* **Long-Context Generation:** Supports a 256K-token context window, a 192K-token maximum input, and a 128K-token maximum output.
* **Agent-Oriented API Support:** Supports structured output, function calling, context caching, and preserved reasoning for tool-driven workflows.

## Best Use Cases

* **Software Engineering Agents:** Repository-scale implementation, debugging, frontend development, CI/CD work, and multi-step tool use.
* **Office and Knowledge Work:** Long-document analysis, report and presentation preparation, knowledge-base question answering, and structured file generation.
* **Financial and Data Workflows:** Financial modeling, data analysis, and other workflows that combine reasoning with external tools and iterative verification.
* **Long-Horizon Agent Tasks:** Workflows that require planning, repeated tool calls, multi-turn constraint retention, and recovery from tool-call errors.
* **Self-Hosted Model Customization:** Private deployment, fine-tuning, quantization, or reinforcement-learning post-training with the available open weights.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports direct and deeper reasoning modes: `no_think`, `think_low`, and `think_high`. |
| **Creative Writing** | Supports general text generation and long-form content workflows. |
| **Coding** | Designed for coding agents and software-development workflows. Tencent reports particularly strong results in frontend development, data and storage, and CI/CD tasks. |
| **Multimodal** | Text input and text output only. |
| **Context Window** | 256K tokens. |
| **Maximum Input** | 192K tokens. |
| **Max Output** | 128K tokens. |
| **Tool Use** | Supports function calling, structured output, automatic tool selection, and preserved reasoning across tool calls. |

### Known Limitations

* Hy3 is a text-only model; applications that require native image, audio, or video understanding need a separate multimodal model.
* When preserved reasoning is enabled for multi-turn tool use, clients must return the assistant message's `reasoning_content` together with its tool calls and tool results. Dropping that state interrupts the documented continuation workflow.

## Pricing

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: |
| **Hy3** | `0.132` | `0.132` | `0.033` | `0.528` | `-` |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
