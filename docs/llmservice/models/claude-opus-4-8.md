# Claude Opus 4.8

## Overview

Claude Opus 4.8 is an advanced model in Anthropic's Claude Opus series, released on May 28, 2026. It builds on Claude Opus 4.7 with improvements across coding, reasoning, agentic workflows, and long-running task reliability. Availability may vary by B.AI model catalog and platform rollout status.

## Key Features

* **Stronger Software Engineering**: Designed for production-grade coding, complex refactors, debugging, and multi-file implementation tasks.
* **Improved Agentic Reliability**: Better suited for long-running tool workflows, with stronger judgment around uncertainty, verification, and when to ask for clarification.
* **Long-Context Workflows**: Supports extended analysis across large codebases, documents, and multi-step work sessions.
* **Multimodal Understanding**: Supports text and image input for document, screenshot, chart, and diagram understanding.
* **Claude Code Compatibility**: Can be used in Claude Code and agent workflows where supported by the B.AI and Anthropic integrations. Feature availability may depend on Anthropic, Claude Code, and B.AI rollout status.

## Best Use Cases

* **Professional Software Engineering**: Complex feature work, bug fixing, code review, repository-scale refactors, and technical planning.
* **Large-Scale Agentic Workflows**: Multi-step tasks that require tool use, iterative verification, and sustained context over longer sessions.
* **Research and Knowledge Work**: Synthesis across long documents, technical reports, legal or financial materials, and structured research tasks.
* **Visual Document Analysis**: Reasoning over screenshots, diagrams, charts, PDFs, and other image-based inputs when supported by the workflow.

## Capabilities and Limitations

| Capability         | Description                                                                                         |
| :----------------- | :-------------------------------------------------------------------------------------------------- |
| **Reasoning**      | Advanced reasoning for complex professional and technical tasks                                      |
| **Coding**         | Strong coding, debugging, refactoring, and code review capabilities                                  |
| **Agentic**        | Suitable for long-running tool workflows and multi-step agent tasks                                  |
| **Computer Use**   | Can support browser and desktop interaction through compatible tools and environments                |
| **Multimodal**     | Text and image input; text output                                                                   |
| **Context Window** | 1,000,000 tokens                                                                                    |
| **Max Output**     | 128,000 tokens                                                                                      |
| **Tool Use**       | Function calling, code execution, MCP support, adaptive thinking, and Claude Code workflows          |
| **Multilingual**   | Strong multilingual performance across major world languages                                         |

### Known Limitations

* Some capabilities depend on the B.AI integration, Anthropic platform support, Claude Code plan, and feature rollout status.
* Web access, code execution, computer use, and external actions require compatible tools or integrations.
* Image input is supported, but native audio or video input is not listed for this model.
* Benchmark rankings and third-party comparisons can change over time, so use them as directional guidance rather than fixed guarantees.

## Credits Usage

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **Claude Opus 4.8** | `5.00` | `6.25` | `0.50` | `25.00` | `10,000` | - |

* **Prompt caching**: Cache writes are charged at 1.25x base input price for the 5-minute TTL option, or 2x base input price for the 1-hour TTL option. Cache reads are charged at 0.1x base input price. Prompt caching requires a minimum of 1,024 tokens.
