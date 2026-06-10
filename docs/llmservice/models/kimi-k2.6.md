# Kimi K2.6

## Overview

Kimi K2.6 is Moonshot AI's open-weight multimodal model, released on April 20, 2026. It is the third K2-class model in nine months, following K2 and K2.5. Built on a 1-trillion-parameter Mixture-of-Experts architecture with 32 billion active parameters per token, K2.6 combines native multimodal input, advanced agent swarm orchestration, and strong coding performance.

## Key Features

* **Native Multimodal Architecture**: Supports text, image, and video input through the custom MoonViT vision encoder. Video input is new in K2.6 and supports mp4, mov, avi, and webm formats.
* **Agent Swarm Orchestration**: Supports up to 300 concurrent sub-agents per task and 4,000 coordinated steps, with a 96.6% tool-invocation success rate, up from 91% on K2.5.
* **Coding Performance**: Achieves SWE-Bench Pro 58.6%, SWE-bench Verified 80.2%, LiveCodeBench v6 89.6%, and Terminal-Bench 2.0 66.7%.
* **Modified MIT License**: Open weights are available on Hugging Face and are free for commercial use below 100M MAU or $20M monthly revenue.

## Best Use Cases

* **End-to-End Coding & UI Generation**: Well suited for transforming prompts and visual inputs into production-ready interfaces and lightweight full-stack workflows across Python, Rust, and Go.
* **Multi-Agent Systems**: The 300-agent swarm capacity with 4,000-step coordination makes it effective for complex autonomous workflows that require long-context stability.
* **Cost-Effective Multimodal Processing**: Offers strong multimodal and agentic performance at a lower cost than many proprietary multimodal alternatives.

## Capabilities and Limitations

| Capability         | Description                                                                                                   |
| :----------------- | :------------------------------------------------------------------------------------------------------------ |
| **Reasoning**      | AIME 2026: 96.4%, GPQA-Diamond: 90.5%, HLE with tools: 54.0%                                                  |
| **Coding**         | SWE-Bench Pro 58.6%, SWE-bench Verified 80.2%, LiveCodeBench v6 89.6%, Terminal-Bench 2.0 66.7%             |
| **Multimodal**     | Text, image (png, jpeg, webp, gif), and video (mp4, mov, avi, webm) input through the MoonViT vision encoder |
| **Response Speed** | Optimized for throughput in agentic workflows; specific tokens-per-second metrics vary by deployment          |
| **Context Window** | 262K tokens                                                                                                   |
| **Max Output**     | 16K tokens, up to 98K in extended mode                                                                        |
| **Tool Use**       | 96.6% tool-invocation success, 4,000+ tool calls per session, and multi-agent handoffs                       |
| **Multilingual**   | 160K vocabulary optimized for code and non-English text; SWE-bench Multilingual 76.7%                        |

### Known Limitations

* Multimodal benchmark performance is weaker than top proprietary models on some vision tasks such as MMMU-Pro and MathVision.
* URL-based image input is not supported through the API; only base64-encoded content or file upload is supported.
* Image resolution is capped at 4K, video at 2K, and the full request body must remain under 100MB.
* Pure math reasoning trails some higher-end proprietary models on benchmarks such as AIME 2026 and GPQA-Diamond.
* The 262K context window is smaller than some proprietary alternatives offering 1M+ tokens.
* Independent reviews note only marginal improvement over K2.5 on day-to-day tasks and weaker performance on some domain-specific workloads.

## Credits Usage

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **Kimi K2.6** | `0.95` | `0.95` | `0.16` | `4.00` | `-` | - |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
