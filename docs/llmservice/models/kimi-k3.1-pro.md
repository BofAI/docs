# Kimi K3.1 Pro

## Overview

[Kimi K3.1 Pro](https://www.kimi.com/en/blog/kimi-k3-1-pro) is Moonshot AI's first K3.1-series flagship, a 3T-class model developed through further post-training of Kimi K3. It combines native visual understanding and a 1M-token context window with improved coding, 3D creation, financial research, and multi-step agent capabilities.

## Model Variants

| Model | API Model ID | Description |
| :--- | :--- | :--- |
| **Kimi K3.1 Pro** | `kimi-k3.1-pro` | Standard variant with lower input, output, and cache-write prices. |
| **Kimi K3.1 Pro Highspeed** | `kimi-k3.1-pro-highspeed` | Same intelligence and context window, with approximately 2-3x the speed according to Moonshot AI; suited to interactive coding and latency-sensitive agent workflows. |

## Key Features

- **Software Engineering**: Handles codebase fixes, debugging, and complete project builds, including interactive websites and games in tool-enabled environments.
- **3D and Spatial Reasoning**: Interprets sketches, reference images, and text briefs to write Blender or CAD scripts for parametric models and scenes.
- **Financial Research and Modeling**: Supports cross-document analysis, numerical reasoning, and spreadsheet modeling through connected retrieval and execution tools.
- **Adjustable Reasoning**: Offers low, high, and max reasoning effort to balance depth, latency, and token usage.
- **Long-Context Visual Understanding**: Processes text, images, and video within a 1,048,576-token context window for substantial codebases and reference material.

## Best Use Cases

- **Repository Development**: Investigate bugs, implement features, and iterate on larger projects using file, terminal, and testing tools.
- **Interactive Web and Game Prototypes**: Build frontend interfaces, Three.js scenes, and game experiences from written or visual references.
- **Parametric 3D Design**: Generate and refine scripts for mechanical parts, architectural models, furniture, and configurable products.
- **Financial Analysis**: Compare reports, trace supporting evidence, and prepare research or linked spreadsheet models with appropriate tools.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Always enabled, with low, high, and max effort; max is the default. |
| **Input and Output** | Text, image, and video input; text output, including code and structured JSON. |
| **Context Window** | 1,048,576 tokens, shared by input and generated output. |
| **Max Output** | [131,072 tokens by default](https://platform.kimi.ai/docs/api/chat); configurable up to 1,048,576, subject to remaining context capacity. |
| **Tool Use** | Function calling and dynamic tool loading for multi-step workflows. |
| **Structured Output** | JSON mode and JSON Schema output, including nested objects and arrays. |
| **Streaming** | Supports incremental reasoning and final-answer output. |

### Known Limitations

- Sampling controls are fixed: temperature is 1.0 and top-p is 0.95; only one completion per request is supported.
- Multi-turn and tool-calling workflows must preserve complete assistant messages, including reasoning history.
- Producing 3D assets, running code, or editing spreadsheets requires suitable external tools and an execution environment.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | 5m Cache Write<br/>(USD / 1M Tokens) | 1h Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **Kimi K3.1 Pro** | `$2.00` | `$2.00` | `$4.00` | `$0.20` | `$10.00` | - |
| **Kimi K3.1 Pro Highspeed** | `$4.00` | `$4.00` | `$8.00` | `$0.20` | `$20.00` | - |

- Cache lifetimes are 5 minutes (5m, default) and 1 hour (1h). Cache hits renew the selected lifetime without another write charge.
- Input, cache-write, and cache-read rates apply to separate portions of input usage; the same tokens are not charged under multiple input categories.

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
