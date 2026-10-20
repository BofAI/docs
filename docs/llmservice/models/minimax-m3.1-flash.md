# MiniMax-M3.1-Flash

## Overview

MiniMax-M3.1-Flash, also known as Space Bunny, is a MiniMax M-series model designed for workplace automation, software engineering, visual reasoning, and professional analysis. It combines multi-step task execution with frontend and presentation creation, supporting workflows that turn information and visual references into practical deliverables.

**Model ID:** `minimax-m3.1-flash`

## Key Features

- **Workplace Automation:** Designed for complex, multi-step workflows. MiniMax reports a score of 72.5% on AutomationBench-AA.
- **Software Engineering:** Supports understanding codebases, fixing bugs, and building features. MiniMax reports 73.67% on DeepSWE.
- **Visual Reasoning:** Handles visual understanding and chart reasoning. MiniMax reports 91.0 on BabyVision with tools and 82.5 on CharXiv RQ.
- **Frontend and Presentation Creation:** Supports producing frontend implementations and presentations in tool-enabled workflows.
- **Knowledge and Reasoning:** Covers everyday questions, professional analysis, and scientific reasoning, with MiniMax-reported results of 56% on AA-Omniscience, 48% on HLE, and 22.3% on CritPt.
- **Tool-Based Analysis:** MiniMax reports 76.15 on BankerToolBench in its internal comparison.

## Best Use Cases

- **Multi-Step Office Work:** Coordinate information gathering, analysis, and deliverable preparation across a connected workflow.
- **Codebase Maintenance:** Investigate bugs, understand existing implementations, and develop features within real software projects.
- **Visual Analysis and Prototyping:** Interpret charts and visual references, then use the findings to guide frontend development.
- **Research and Presentations:** Organize knowledge, analyze technical or business questions, and turn findings into presentation content.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports reasoning tasks; available thinking modes and effort controls are not confirmed for this release. |
| **Multimodal** | Supports visual understanding; the exact supported input and output modalities are not confirmed for this release. |
| **Context Window** | 1M tokens. |
| **Max Output** | 512K tokens. |
| **Tool Use** | Tool-assisted workflows are reported; API function-calling support and controls are not confirmed for this release. |

### Known Limitations

- Workflow automation and frontend or presentation creation require an environment with the appropriate tools, data access, and execution permissions.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens.

| Model | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | ---: | ---: | ---: | ---: | ---: |
| MiniMax-M3.1-Flash | `$0.15` | `$0.15` | `$0.015` | `$0.60` | - |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
