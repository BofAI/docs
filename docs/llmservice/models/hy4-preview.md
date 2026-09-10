# Hy4 Preview

## Overview

Hy4 Preview is an open-weight Mixture-of-Experts language model released by the Tencent Hy Team on August 28, 2026. It is an early Hy4-series release with 770 billion backbone parameters, 49 billion activated parameters per token, and a 1M-token context window. On B.AI, use the model ID `hy4-preview`.

## Key Features

* **770B Sparse MoE Architecture:** Uses 78 backbone layers, 256 routed experts and one shared expert per MoE layer, and activates the top eight routed experts plus the shared expert for each token. A separate native MTP layer adds 10B total and 0.7B activated parameters for speculative decoding.
* **Long-Context API Limits:** Supports a 1M-token context window, up to 960K input tokens, and up to 64K output tokens.
* **Preserved Deep Reasoning:** Thinking is enabled by default. The API exposes `reasoning_content`, which should be returned with the complete assistant message during multi-turn tool workflows.
* **Agent API Support:** Supports structured output, function calling, cached input, and OpenAI Chat Completions, OpenAI Responses, and Anthropic Messages interfaces.
* **Productivity-Oriented Validation:** In Tencent's blind internal evaluation, 163 experts rated outputs on 203 engineering tasks. Hy4 Preview averaged 2.99/4.00, compared with 2.92 for GLM-5.3 and 2.94 for Kimi K3.

## Best Use Cases

* **Software Engineering Agents:** Long-horizon planning, implementation, debugging, verification, frontend work, and multi-step tool use across large repositories.
* **Office and Data Workflows:** Cross-document analysis, financial modeling, data analysis, and production of documents, spreadsheets, and presentations.
* **Game Development:** Playable-prototype generation, game-engine workflows, and iterative refinement over multiple turns.
* **Scientific Research:** Tool-assisted analysis and problem solving in areas such as AI research, molecular dynamics, condensed-matter physics, and mathematics.
* **Private or Customized Deployment:** Open-weight deployments that require local serving, quantization, or task-specific fine-tuning and can accommodate the model's substantial compute requirements.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports deep reasoning with preserved thinking. The documented reasoning-effort levels are `low` and `high`, with `high` as the default for `hy4-preview` tool workflows. |
| **Creative Writing** | Supports general text generation and Chinese content creation. |
| **Multimodal** | Text input and text output. |
| **Response Speed** | Tencent has not published a guaranteed generation rate. The official release reports a 31.8% throughput gain from model-assisted inference-system optimization relative to Tencent's internal baseline. |
| **Context Window** | 1M tokens. |
| **Maximum Input** | 960,000 tokens. |
| **Max Output** | 64,000 tokens. |
| **Tool Use** | Function calling, structured output, automatic tool selection, cached input, and preserved reasoning across tool calls. |
| **Multilingual** | Tencent documents Chinese and English use. |

### Known Limitations

* Tencent identifies this release as an early version of Hy4 rather than a final Hy4 model.
* The official model card reports that Hy4 Preview can spend longer than necessary reasoning through complex tasks and can over-verify its own work.
* Multi-turn tool integrations should preserve and replay the full assistant message, including `reasoning_content`; omitting it can degrade the documented continuation workflow.
* Hy4 Preview does not support native image, audio, or video understanding.
* Tencent has not published a model-specific knowledge cutoff, guaranteed API throughput, or complete language-support list.

## Pricing

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: |
| **Hy4 Preview** | `0.834` | `0.834` | `0.042` | `2.501` | `-` |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
