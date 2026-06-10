# GLM-5.1

## Overview

GLM-5.1 is an open-source flagship AI model developed by Z.ai, formerly Zhipu AI, a Tsinghua University spinoff and the first publicly traded foundation model company. Released on April 7, 2026, it is a post-training upgrade to GLM-5, built on a 754-billion-parameter Mixture-of-Experts architecture with 40 billion active parameters per token. GLM-5.1 is designed for agentic engineering and long-horizon autonomous software development.

## Key Features

* **Agentic Coding**: Achieves 58.4% on SWE-Bench Pro, ranking #1 as of April 2026, ahead of GPT-5.4 and Claude Opus 4.6.
* **8-Hour Autonomous Execution**: Can work autonomously on a single task for up to 8 hours, completing full plan-execute-test-fix-optimize loops across hundreds of iterations and thousands of tool calls.
* **MIT Licensed Open Weights**: Released on Hugging Face under the MIT license, allowing unrestricted commercial use, modification, and fine-tuning.
* **Ascend-Native Training**: Trained entirely on Huawei Ascend 910B chips using the MindSpore framework, enabling full independence from U.S.-manufactured hardware.

## Best Use Cases

* **Long-Horizon Software Engineering**: Well suited for complex, multi-step coding tasks that require sustained autonomous execution, such as building or maintaining large systems over long task cycles.
* **Agentic Tool Orchestration**: Strong function calling, MCP integration, and structured output support make it effective for AI agents that need to interact with external tools and APIs.
* **Cost-Effective Frontier Performance**: Delivers strong coding performance at a significantly lower cost than many proprietary frontier models.

## Capabilities and Limitations

| Capability         | Description                                                                                                  |
| :----------------- | :----------------------------------------------------------------------------------------------------------- |
| **Reasoning**      | AIME 2026: 95.3%, GPQA-Diamond: 86.2%, with strong system-level reasoning across planning and iterative debugging |
| **Coding**         | SWE-Bench Pro 58.4%, CyberGym 68.7%, BrowseComp 68.0%, MCP-Atlas 71.8%                                      |
| **Multimodal**     | Text only. No image, audio, or video input. A separate GLM-5V-Turbo variant is available for vision tasks   |
| **Response Speed** | Not independently benchmarked yet; expected to be comparable to similar-scale MoE models                    |
| **Context Window** | 200K tokens                                                                                                  |
| **Max Output**     | 128K tokens                                                                                                  |
| **Tool Use**       | Function calling, structured output, context caching, MCP integration, and thinking mode                    |
| **Multilingual**   | Strong multilingual support, particularly in Chinese and English                                             |

### Known Limitations

* Text-only input with no native multimodal support. Vision use cases rely on the separate GLM-5V-Turbo model.
* Math and science benchmark scores trail some top proprietary models, making it less suitable for purely quantitative research tasks.
* On broader coding composites such as Terminal-Bench 2.0 plus NL2Repo, Claude Opus 4.6 still leads.
* Self-hosting requires substantial compute resources because of the 754B parameter count.

## Credits Usage

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **GLM-5.1** | `1.40` | `1.40` | `0.26` | `4.40` | `-` | - |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
