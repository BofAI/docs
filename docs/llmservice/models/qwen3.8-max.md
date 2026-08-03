# Qwen3.8-Max

## Overview

Qwen3.8-Max is Alibaba's flagship Qwen model for coding, professional knowledge work, multimodal understanding, and long-horizon agent tasks. It was officially released on August 3, 2026, with the API model ID `qwen3.8-max`. The model uses a Mixture-of-Experts (MoE) architecture with 2.4 trillion total parameters and 95 billion activated parameters, accepts text, image, and video input, and produces text output.

## Key Features

* **2.4T-Parameter MoE Architecture:** Built on the Qwen3.5 architectural foundation with 2.4 trillion total parameters and 95 billion activated parameters per token.
* **Native Multimodal Intelligence:** Processes text, images, and video in the same model. Qwen describes vision as part of an agent's planning, execution, and self-correction loop rather than a separate preprocessing step.
* **1M-Token Context:** Provides a 1-million-token context window, with up to 991.80K input tokens in non-thinking mode, 983.61K input tokens in thinking mode, and 131.07K output tokens.
* **Configurable Reasoning:** Thinking is enabled by default. The API supports `low`, `medium`, and `xhigh` reasoning effort, with `xhigh` as the default, and preserves reasoning across turns by default.
* **Long-Horizon Agent Work:** The launch report documents autonomous coding, research, chip-design optimization, and year-long business-simulation tasks. In one coding case, the model operated for about 16 days and produced 265 commits, 127 pull requests, and 151 issues without human intervention.
* **Agent and API Integration:** Supports Function Calling, structured output, prefix completion, batch inference, context caching, and built-in tools. It can be accessed through OpenAI-compatible Chat Completions and Responses APIs, Anthropic-compatible APIs, or DashScope.

## Best Use Cases

* **Autonomous Software Engineering:** Multi-day implementation, repository maintenance, testing, debugging, and iterative delivery using coding agents.
* **Research and Experimentation:** Reproducing papers, writing experimental pipelines, running iterative evaluations, and refining hypotheses with tools.
* **Professional Knowledge Work:** Legal review, financial analysis, document production, data analysis, design prototyping, and other multi-step office workflows.
* **Long-Horizon Planning and Optimization:** Tasks that require hundreds of feedback cycles, persistent state, adaptive planning, and repeated verification.
* **Multimodal Agents:** Workflows that combine documents, screenshots, images, video, code execution, search, and external tools.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Thinking is enabled by default. `reasoning_effort` supports `low`, `medium`, and `xhigh`; `xhigh` is the default. The maximum mapped thinking budget is 262,144 tokens, while the default budget is 131,072. |
| **Coding** | Designed for autonomous, long-horizon coding. Qwen reports 86.6 on Terminal-Bench 2.1, 67.7 on SWE-bench Pro, 73.5 on FrontierSWE, and 93.0 on PaperBench. |
| **Multimodal** | Accepts text, image, and video input and produces text output. |
| **Context Window** | 1M tokens. |
| **Maximum Input** | 991.80K tokens in non-thinking mode and 983.61K tokens in thinking mode. |
| **Max Output** | 131.07K tokens in both modes. |
| **Structured Output** | Supported. |
| **Architecture** | Mixture-of-Experts architecture based on Qwen3.5. |
| **Total Parameters** | 2.4 trillion. |
| **Activated Parameters** | 95 billion. |
| **Knowledge Cutoff** | Unpublished. |

### Known Limitations

* Preserved thinking is enabled by default. Multi-turn clients must return the complete, unmodified `reasoning_content` history; preserved reasoning also counts toward input tokens and billing.
* Alibaba has not published a model-specific knowledge cutoff, measured generation speed, or complete language-coverage list.

## Pricing

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **Qwen3.8-Max** | `2.00` | `2.00` | `0.25` | `6.00` | `-` | Cache Read uses the official implicit-cache price. |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
