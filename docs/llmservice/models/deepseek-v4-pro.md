# DeepSeek V4 Pro

## Overview

DeepSeek-V4-Pro is DeepSeek's flagship open-source large language model, released on April 24, 2026 under the MIT License. Built on a Mixture-of-Experts (MoE) architecture with 1.6 trillion total parameters and 49 billion active parameters, it supports a 1-million-token context window and delivers frontier-level performance in coding, mathematics, and reasoning at a fraction of the cost of comparable closed-source models.

## Key Features

* **Massive Scale, Efficient Inference**: 1.6T total parameters with only 49B activated per forward pass via MoE, achieving frontier performance while keeping inference costs low, roughly 1/20th the price of Claude Opus 4.7.
* **1M-Token Context Window**: Supports up to 1 million input tokens and 384K maximum output tokens, enabled by a hybrid attention mechanism combining Compressed Sparse Attention (CSA) and Heavily Compressed Attention (HCA) that reduces single-token inference FLOPs to 27% and KV cache to 10% compared to DeepSeek-V3.2.
* **Top-Tier Coding Performance**: Achieves 80.6% on SWE-bench Verified (within 0.2 points of Claude Opus 4.6), 67.9% on Terminal-Bench 2.0, 93.5% on LiveCodeBench, and a 3206 Codeforces rating.
* **Advanced Tool Use**: Scores 73.6 on MCPAtlas Public, supports up to 128 parallel function calls, and ships with pre-tuned adapters for Claude Code, OpenCode, OpenClaw, and CodeBuddy.

## Best Use Cases

* **Software Engineering Agents**: With 80.6% on SWE-bench Verified and strong tool-use capabilities, V4-Pro is well-suited for autonomous coding agents that need to navigate large codebases.
* **Long-Document Analysis**: The 1M-token context window enables processing of entire codebases, legal corpora, or research paper collections in a single pass.
* **Cost-Sensitive Frontier Workloads**: For teams that need near-frontier reasoning and coding at open-source economics, V4-Pro offers the best performance-per-dollar ratio in its class.

## Capabilities and Limitations

| Capability         | Description                                                               |
| :----------------- | :------------------------------------------------------------------------ |
| **Reasoning**      | Matches leading closed-source models on math and STEM; 95.2% on HMMT 2026 |
| **Coding**         | 80.6% SWE-bench Verified, 93.5% LiveCodeBench, 3206 Codeforces rating     |
| **Multimodal**     | Text-only; multimodal capabilities are in development                     |
| **Response Speed** | Optimized for long-context efficiency via CSA/HCA hybrid attention        |
| **Context Window** | 1,000,000 tokens                                                          |
| **Max Output**     | 384,000 tokens                                                            |
| **Tool Use**       | Function calling with up to 128 parallel calls; 73.6 on MCPAtlas Public   |
| **Multilingual**   | Broad multilingual support; strongest in English and Chinese              |

### Known Limitations

* Text-only, with no image, audio, or video understanding or generation.
* Trails GPT-5.4 and Gemini 3.1 Pro on world knowledge benchmarks by a margin DeepSeek estimates at 3-6 months of development.
* May underperform on tasks requiring creative writing or highly nuanced reasoning compared to top closed-source models.

## Credits and Pricing

| Model               | Input (Credits/Token) | Output (Credits/Token) | Notes                       |
| :------------------ | --------------------: | ---------------------: | :-------------------------- |
| **DeepSeek V4 Pro** | `1.74`                | `3.48`                 | 1M context, 384K max output |
