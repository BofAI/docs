# Grok 4.6

## Overview

Grok 4.6 is a SpaceXAI reasoning model in the Grok 4 family, released on August 12, 2026 for coding, long-running agents, interactive and visual projects, and knowledge work. Available through the API as `grok-4.6`, it supports text and image input, text output, a 500,000-token context window, and four configurable reasoning-effort levels.

## Key Features

* **Long-Horizon Agentic Work**: Trained on agentic reinforcement-learning tasks across knowledge work, general coding, kernel optimization, web development, and computer-aided design, with an emphasis on sustaining complex work across many steps.
* **Configurable Reasoning**: Supports `low`, `medium`, `high`, and `xhigh` reasoning effort, with `high` as the default. Reasoning cannot be disabled, and the API can stream summarized reasoning content.
* **Coding and Knowledge-Work Evaluations**: SpaceXAI reports 69.9% on CursorBench v3.2, 65.9% on DeepSWE v1.1, 61.3% on FrontierCode v1.1 Extended, and 57.5% on APEX-Agents.
* **Long Multimodal Context**: Accepts text and image input within a 500,000-token context window and returns text output. Prompts at or above 200,000 tokens use long-context pricing.
* **Structured Agent Workflows**: Supports function calling, parallel tool calls, structured outputs, and built-in tools such as web search and X search.

## Best Use Cases

* **Repository-Scale Software Engineering**: Implementing features, debugging, refactoring, and validating changes across large codebases or long-running coding sessions.
* **Interactive Product Prototypes**: Turning a broad product idea into a working application, including its structure, visual language, and core interactions, then iterating from feedback.
* **Tool-Using Research Agents**: Combining reasoning with web or X search, custom functions, structured outputs, and repeated verification steps.
* **Technical Knowledge Work**: Analyzing documents and images or producing technical artifacts across science, engineering, mathematics, and other professional domains.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports `low`, `medium`, `high`, and `xhigh` reasoning effort; `high` is the default and reasoning cannot be disabled. Official results include 61 on the AA Intelligence Index and 1,753 on GDPVal-AA v2. |
| **Coding** | Designed for long-running agentic coding and technical workflows. Official results include 69.9% on CursorBench v3.2, 65.9% on DeepSWE v1.1, 61.3% on FrontierCode v1.1 Extended, and 26% on Terminal-Bench v3.0. |
| **Creative Writing** | Supports general text generation and document creation. |
| **Multimodal** | Text and image input with text output. |
| **Response Speed** | SpaceXAI has not published a model-specific latency or tokens-per-second figure. |
| **Context Window** | 500,000 tokens. Prompts at or above 200,000 tokens are billed at the long-context rates for all tokens in the request. |
| **Max Output** | SpaceXAI's release notes state that the model has no text output limit. |
| **Tool Use** | Function calling, parallel tool calls, structured outputs, and built-in tools including web search and X search. The Responses API also supports code execution, file or collections search, and Remote MCP tools. |
| **Multilingual** | Natural-language prompting is supported. |
| **Knowledge Cutoff** | February 1, 2026. |

### Known Limitations

* `logprobs` and `top_logprobs` are not supported by Grok 4.20 and newer models. Reasoning requests also reject `presencePenalty`, `frequencyPenalty`, and `stop`.
* SpaceXAI has not published a model-specific throughput figure, multilingual evaluation, or separate numeric output-token ceiling.

## Credits Usage

| Model and Context Tier | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: |
| **Grok 4.6** | `2.00` | `2.00` | `0.50` | `6.00` |
| **Grok 4.6** (>=200K prompt tokens) | `4.00` | `2.00` | `1.00` | `12.00` |

* Once a prompt reaches 200,000 tokens, long-context rates apply to all input, cached input, reasoning, and output tokens in the request. Reasoning tokens are billed at the output-token rate.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
