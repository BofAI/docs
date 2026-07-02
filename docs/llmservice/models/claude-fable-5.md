# Claude Fable 5

## Overview

Claude Fable 5 is a high-capability Anthropic model available on B.AI for advanced reasoning, coding, long-context analysis, and agentic workflows. It is designed for complex tasks that require sustained context, tool-assisted execution, and high-quality structured outputs. Specific capabilities, context limits, tool support, and availability may vary by B.AI model catalog and platform configuration.

## Key Features

* **Advanced Reasoning**: Suitable for complex analytical, technical, and professional knowledge tasks.
* **Software Engineering Workflows**: Designed for coding assistance, debugging, refactoring, code review, and multi-step implementation planning.
* **Long-Context Tasks**: Supports extended analysis across large codebases, long documents, and multi-turn work sessions when enabled by the platform configuration.
* **Agentic and Tool-Assisted Workflows**: Suitable for workflows that rely on tool use, function calling, code execution, MCP, or compatible agent environments.
* **Multimodal Understanding**: Supports text and image input for document, screenshot, chart, and diagram understanding where available.

## Best Use Cases

* **Complex Software Engineering**: Large feature work, repository-scale refactors, migration planning, bug investigation, and code review.
* **Extended Agentic Workflows**: Multi-step tasks that require planning, tool use, verification, and sustained context over longer sessions.
* **Research and Knowledge Work**: Analysis and synthesis across technical documents, legal or financial materials, and structured research sources.
* **Visual Document Analysis**: Understanding screenshots, diagrams, charts, PDFs, and other image-based materials when supported by the workflow.

## Capabilities and Limitations

| Capability         | Description                                                                                         |
| :----------------- | :-------------------------------------------------------------------------------------------------- |
| **Reasoning**      | Advanced reasoning for complex professional and technical tasks                                      |
| **Coding**         | Strong coding, debugging, refactoring, and code review capabilities                                  |
| **Agentic**        | Suitable for long-running tool workflows and multi-step agent tasks                                  |
| **Computer Use**   | Can support browser and desktop interaction through compatible tools and environments                |
| **Multimodal**     | Text and image input; text output                                                                   |
| **Context Window** | Up to 1,000,000 tokens, subject to platform configuration                                            |
| **Max Output**     | Up to 128,000 tokens, subject to platform configuration                                              |
| **Tool Use**       | Function calling, code execution, MCP support, adaptive thinking, and compatible agent workflows     |
| **Multilingual**   | Strong multilingual performance across major world languages                                         |

### Known Limitations

* Specific capability availability may depend on the B.AI integration, Anthropic platform support, plan settings, and rollout status.
* Web access, code execution, computer use, and external actions require compatible tools or integrations.
* Image input is supported, but native audio or video input is not listed for this model.
* Public evaluations, third-party comparisons, policy behavior, and implementation details may change over time, so they are not treated as fixed guarantees in this documentation.

## Credits Usage

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **Claude Fable 5** | `10.00` | `12.50` | `1.00` | `50.00` | `10,000` | - |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::

* **Prompt caching**: Cache writes are charged at 1.25x base input price for the 5-minute TTL option, or 2x base input price for the 1-hour TTL option. Cache reads are charged at 0.1x base input price. Prompt caching requires a minimum of 1,024 tokens.
