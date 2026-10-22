# MiMo-V2.6-Pro

## Overview

MiMo-V2.6-Pro is Xiaomi MiMo's flagship open-weight, native multimodal reasoning model in the V2.6 series, released on September 22, 2026. Available through the API as `mimo-v2.6-pro`, its sparse Mixture-of-Experts architecture and 1M-token context window target complex software engineering, extended agent workflows, and research involving multiple tools and modalities.

## Key Features

* **High-Capacity Sparse Architecture**: Uses 1.02 trillion total parameters with 42 billion activated parameters; the published MiMo-V2.6-Pro-RL checkpoint is MIT-licensed.
* **Native Multimodal Reasoning**: Combines text, image, video, and audio understanding for tasks that require reasoning across different forms of evidence.
* **Long-Horizon Agent Training**: Mixed reinforcement learning spans coding, general agents, visual tasks, and cybersecurity across multiple agent frameworks.
* **Extended Working Context**: A 1M-token window accommodates large repositories, lengthy documents, and accumulated tool results.
* **Tool-Assisted Creation**: Supports code-driven interfaces, presentations, and 3D workflows through external tools and visual feedback.

## Best Use Cases

* **Repository-Scale Software Engineering**: Multi-file implementation, debugging, testing, and revision that require sustained reasoning over code and tool histories.
* **Complex Workflow Automation**: Multi-step tasks across applications where the agent must inspect intermediate results and adjust subsequent actions.
* **Multimodal Research Assistance**: Synthesizing long documents and visual or audio evidence, with external search and computation when needed.
* **Visual Development and Content Production**: Building interfaces, presentations, and interactive scenes through generated code, authoring tools, and rendered-result checks.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Deep thinking is enabled by default and can be disabled through `thinking.type` in Chat Completions. |
| **Coding** | Xiaomi's released model-card evaluation reports 71.9 on DeepSWE v1.1. |
| **Agent Evaluation** | Xiaomi reports 76.9 on Toolathlon-Verified and 82.0 on OSWorld-Verified. These are provider-reported benchmark results, not production guarantees. |
| **Multimodal** | Text, image, video, and audio input; text output. |
| **Context Window** | 1M tokens. |
| **Max Output** | 131,072 tokens, shared by reasoning and the final response. |
| **Tool Use** | Function calling, streaming, prompt caching, and Xiaomi's separately billed web-search service. |
| **Structured Output** | JSON object mode; fields, types, and nesting remain prompt-defined and require application-side validation. |

### Known Limitations

* Native output is text. Demonstrations of video, music, or 3D creation rely on external tools and generated code.
* Thinking mode forces `temperature=1.0` and `top_p=0.95`. Multi-turn tool conversations must preserve historical `reasoning_content`; missing it can cause HTTP 400 errors.
* Chat Completions supports only `tool_choice=auto`; other values are discarded and treated as automatic selection.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | ---: |
| **MiMo-V2.6-Pro** | `$0.435` | `$0.435` | `$0.0036` | `$0.87` | - |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
