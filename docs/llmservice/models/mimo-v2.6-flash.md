# MiMo-V2.6-Flash

## Overview

MiMo-V2.6-Flash is an open-weight, native multimodal reasoning model released by Xiaomi MiMo on September 22, 2026. Available through the API as `mimo-v2.6-flash`, it combines a sparse Mixture-of-Experts architecture with a 1M-token context window, targeting frequent calls, large-scale office workloads, and cost-sensitive coding and agent applications.

## Key Features

* **Efficient Sparse Architecture**: Uses 309 billion total parameters with 15 billion activated parameters; the published MiMo-V2.6-Flash-RL checkpoint is MIT-licensed.
* **Native Multimodal Understanding**: Processes text, images, video, and audio together, enabling workflows that combine written instructions with visual and acoustic evidence.
* **Long-Context Agent Work**: Supports extensive source material, repository context, and tool histories within a 1M-token window.
* **Broad Agent Training**: Mixed reinforcement learning spans coding, general agents, visual tasks, and cybersecurity across multiple agent frameworks.
* **Flexible API Workflows**: Supports switchable deep thinking, function calls, streaming, JSON output, prompt caching, and discounted asynchronous batch processing.

## Best Use Cases

* **High-Volume Office Automation**: Summarization, classification, and structured extraction where lower token prices and batch processing help control aggregate cost.
* **Visual Workflow Agents**: Interpreting screenshots and interface states, then using external tools to complete and check routine computer tasks.
* **Iterative Coding Assistance**: Implementation, debugging, and test-and-revise loops that combine code, tool results, and visual feedback.
* **Multimodal Document Analysis**: Reviewing long collections of text, charts, recordings, and video with shared context.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Deep thinking is enabled by default and can be disabled through `thinking.type` in Chat Completions. |
| **Coding** | Xiaomi's released model-card evaluation reports 67.9 on DeepSWE v1.1. |
| **Agent Evaluation** | Xiaomi reports 73.6 on Toolathlon-Verified and 80.8 on OSWorld-Verified. These are provider-reported benchmark results, not production guarantees. |
| **Multimodal** | Text, image, video, and audio input; text output. |
| **Context Window** | 1M tokens. |
| **Max Output** | 131,072 tokens, shared by reasoning and the final response. |
| **Tool Use** | Function calling and Xiaomi's separately billed web-search service. |
| **Structured Output** | JSON object mode; fields, types, and nesting remain prompt-defined and require application-side validation. |

### Known Limitations

* Native output is text. Computer operation and media creation require external tools or generated code.
* Thinking mode forces `temperature=1.0` and `top_p=0.95`. Multi-turn tool conversations must preserve historical `reasoning_content`; missing it can cause HTTP 400 errors.
* Chat Completions supports only `tool_choice=auto`; other values are discarded and treated as automatic selection.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | ---: |
| **MiMo-V2.6-Flash** | `$0.14` | `$0.14` | `$0.0028` | `$0.28` | - |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
