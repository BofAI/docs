# Qwen3.6-27B

## Overview

Qwen3.6-27B FP8 is a dense 27-billion-parameter multimodal model developed by Alibaba's Qwen Team. It is optimized for agentic coding and reasoning, while remaining practical to deploy for production workloads. On B.AI, it is positioned for coding assistance, technical reasoning, multimodal understanding, and tool-assisted workflows. Specific input modalities, context limits, and tool capabilities may vary by B.AI model catalog and platform configuration.

## Key Features

* **Hybrid Gated DeltaNet Architecture**: Uses a hybrid attention design that combines efficient linear-attention-style layers with full self-attention layers, balancing inference efficiency with long-context performance.
* **Natively Multimodal**: Supports text, image, and video inputs at the model level, subject to B.AI platform configuration and availability.
* **Hybrid Thinking Mode**: Supports both thinking and non-thinking response modes where available, allowing different quality-speed tradeoffs per task.
* **Thinking Preservation**: Designed to preserve reasoning context across multi-turn conversations, improving coherence in agentic coding workflows.
* **Multi-Token Prediction (MTP)**: Uses multi-token prediction training to improve inference throughput.

## Best Use Cases

* **Agentic Coding**: Well-suited for autonomous code generation, debugging, and multi-step software engineering workflows.
* **Complex Reasoning Tasks**: Suitable for scientific, mathematical, engineering, and analytical problem-solving.
* **Multimodal Analysis**: Can be used for document, screenshot, chart, diagram, image, and video understanding when the relevant input modality is enabled.
* **Production Workloads**: A practical choice for workloads that need a balance of capability, latency, and usage cost.

## Capabilities and Limitations

| Capability           | Description                                                                                             |
| :------------------- | :------------------------------------------------------------------------------------------------------ |
| **Reasoning**        | Strong technical and analytical reasoning for structured problem-solving tasks                           |
| **Coding**           | Suitable for code generation, debugging, refactoring, and agentic software workflows                     |
| **Creative Writing** | General-purpose text generation; primarily optimized for code and reasoning rather than creative output |
| **Multimodal**       | Text, image, and video input at the model level; text output                                             |
| **Context Window**   | Up to 128k tokens, subject to platform configuration                                                     |
| **Max Output**       | Up to 32,768 tokens, subject to platform configuration                                                   |
| **Tool Use**         | Native function calling and tool use support where enabled                                               |

### Known Limitations

* Specific capability availability may depend on the B.AI integration, provider support, plan settings, and rollout status.
* Video input, tool use, long-context limits, and other advanced capabilities require compatible platform configuration.
* Public evaluations, third-party comparisons, policy behavior, and implementation details may change over time, so they are not treated as fixed guarantees in this documentation.

## Pricing

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **Qwen3.6-27B** | `0.19` | `0.19` | `0.19` | `2.99` | `-` | Cache reads and writes are billed at the same rate. |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
