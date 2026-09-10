# MiMo-V2.5-Pro

## Overview

MiMo-V2.5-Pro is an open-weight text model from Xiaomi MiMo that entered public beta on April 23, 2026. The higher-capacity member of the MiMo-V2.5 family uses a 1.02-trillion-parameter sparse Mixture-of-Experts (MoE) architecture with 42 billion active parameters and is designed for long-horizon agents, software engineering, and complex reasoning.

## Key Features

* **1.02T Sparse MoE Architecture:** Uses 1.02 trillion total parameters, 42 billion active parameters, 384 routed experts, and eight selected experts per token.
* **Hybrid Long-Context Attention:** Interleaves 60 Sliding Window Attention layers with 10 global-attention layers and a 128-token sliding window. Xiaomi reports that the 6:1 local-to-global pattern reduces KV-cache storage by nearly 7x.
* **1M Context and 128K Output:** Supports a one-million-token context window and up to 128K output tokens for repository-scale work, long documents, and extended agent trajectories.
* **Agent and Coding Evaluation:** Xiaomi reports 1,581 Elo on GDPVal-AA, 63.8 on ClawEval, 57.2 on SWE-Bench Pro, 78.9 on SWE-Bench Verified, and 68.4 on Terminal-Bench 2.0.
* **Controllable Reasoning and Tools:** Deep thinking is enabled by default but can be disabled. The API supports streaming, function calling, and structured output.

## Best Use Cases

* **Long-Horizon Software Engineering:** Repository navigation, multi-file implementation, debugging, testing, and tool-driven work that must remain coherent across long trajectories.
* **Complex Agent Workflows:** Tasks involving repeated function calls, planning, execution, and correction over large working contexts.
* **Long-Document Reasoning:** Analysis and synthesis across extensive code, technical documents, research material, or conversation history.
* **Self-Hosted Model Development:** Commercial inference, fine-tuning, or secondary training where MIT-licensed weights and framework-level deployment control are required.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Deep thinking is enabled by default and can be turned off with `thinking.type`. Xiaomi reports 48.0 on Humanity's Last Exam with tools and 34.0 without tools. |
| **Coding** | Xiaomi reports 57.2 on SWE-Bench Pro, 78.9 on SWE-Bench Verified, 68.4 on Terminal-Bench 2.0, and an implementation rank of 3.4 on FrontierSWE. |
| **Creative Writing** | Supports general and long-form text generation. |
| **Multimodal** | Text input and text output. |
| **Context Window** | 1M tokens. |
| **Max Output** | 128K tokens. |
| **Tool Use** | Supports function calling, structured output, streaming, and Xiaomi's web-search tool. In thinking-mode agent conversations, tool-call history must retain the complete `reasoning_content` field. |
| **Multilingual** | The official model repository identifies English and Chinese support. Xiaomi reports 83.6 on GlobalMMLU, 91.5 on C-Eval, and 90.2 on CMMLU for the Pro Base model, but does not publish a complete language-support list. |

### Known Limitations

* `mimo-v2.5-pro` is a text model and does not provide the full-modal understanding available in `mimo-v2.5`.
* In thinking mode, custom `temperature` and `top_p` values are ignored; the API forces `1.0` and `0.95`. Multi-turn tool workflows that omit historical `reasoning_content` can fail with HTTP 400 or lose context quality.

## Pricing

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: |
| **MiMo-V2.5-Pro** | `0.435` | `0.435` | `0.0036` | `0.87` | `-` |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
