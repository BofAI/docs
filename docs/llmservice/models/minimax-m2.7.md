# MiniMax M2.7

## Overview

MiniMax M2.7 is a reasoning-focused large language model developed by MiniMax (Shanghai), released on March 18, 2026. Built on a Sparse Mixture-of-Experts (MoE) architecture with 230 billion total parameters and 10 billion active parameters per token, it delivers strong coding and reasoning performance at low per-token cost. M2.7 introduces self-evolving capabilities, reduced hallucination rates, and native multi-agent collaboration support.

## Key Features

* **Cost-Efficient Reasoning**: Delivers strong reasoning performance at a lower operating cost than many flagship models, with 20% fewer output tokens needed for equivalent results.
* **Low Hallucination Rate**: Scores a 34% hallucination rate on the AA-Omniscience Index, lower than Claude Sonnet 4.6 and Gemini 3.1 Pro Preview.
* **Multi-Agent Collaboration**: Native support for multi-agent orchestration and complex skill coordination, including dynamic tool discovery and invocation at runtime.
* **Self-Evolution**: Can autonomously complete 30-50% of reinforcement-learning research workflows, representing an early step toward model self-improvement.

## Best Use Cases

* **Autonomous Coding & Debugging**: Strong SWE-Pro and Terminal-Bench 2 performance makes it well-suited for live debugging, root cause analysis, and multi-file code generation.
* **Cost-Sensitive Agent Workflows**: Well suited for high-volume agentic tasks where per-token cost matters.
* **Document & Report Generation**: Handles full document generation across Word, Excel, and PowerPoint workflows, including financial modeling scenarios.

## Capabilities and Limitations

| Capability         | Description                                                                                                                |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **Reasoning**      | AA Intelligence Index: 50, ranked #1 of 136 models as of March 2026. Strong system-level reasoning and trace analysis    |
| **Coding**         | SWE-Pro 56.2%, SWE-bench Verified 78%, Terminal-Bench 2 57.0%, PinchBench 86.2%                                          |
| **Multimodal**     | Text-only. No image, audio, or video input                                                                                |
| **Response Speed** | Approximately 52.7 tokens/sec, slightly below the 54.9 tokens/sec median for similar models. TTFT 2.05s                 |
| **Context Window** | 204.8K tokens                                                                                                             |
| **Max Output**     | 131.1K tokens                                                                                                             |
| **Tool Use**       | Dynamic tool search, multi-agent handoffs, and dependency tracking across parallel workstreams                            |
| **Multilingual**   | SWE Multilingual 76.5%                                                                                                    |

### Known Limitations

* Text-only input with no multimodal image or video support.
* Some independent benchmarks, such as BridgeBench for vibe coding, show regression from M2.5.
* Open weights are released under a non-commercial license, and commercial use requires a separate agreement.

## Credits Usage

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **MiniMax M2.7** | `0.30` | `0.375` | `0.06` | `1.20` | `-` | - |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
