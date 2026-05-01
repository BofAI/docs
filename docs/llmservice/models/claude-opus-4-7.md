# Claude Opus 4.7

## Overview

Claude Opus 4.7, released on April 16, 2026, is Anthropic's most capable publicly available AI model in the Claude 4 family. It represents a significant leap in coding, agentic workflows, and visual understanding, with benchmark-leading performance on software engineering and multi-step tool-calling tasks.

## Key Features

* **Elite Coding Performance**: Achieves 87.6% on SWE-bench Verified and 64.3% on SWE-bench Pro, representing a nearly 7-point and 10.9-point improvement over Opus 4.6 respectively.
* **1M Token Context Window**: Full million-token context at standard pricing with no long-context premium, enabling analysis of entire codebases and lengthy documents.
* **High-Resolution Vision**: Accepts images up to 2,576 pixels on the long edge (~3.75 megapixels), over 3x the resolution of prior Claude models, with improved understanding of chemical structures and technical diagrams.
* **Task Budgets**: A new feature giving the model a rough estimate of how many tokens to target for a full agentic loop, including thinking, tool calls, tool results, and final output.
* **xhigh Effort Level**: A new effort level between high and max, providing finer control over the quality-speed-cost tradeoff. This is the default for Claude Code subscribers.
* **Production Cybersecurity Safeguards**: Ships with built-in security protections tested on Opus before rolling out to Mythos-class models.

## Best Use Cases

* **Autonomous Software Engineering**: Handles complex, long-running coding tasks with rigor and consistency, devising ways to verify its own outputs before reporting back. Ideal for large-scale refactors, bug resolution, and feature implementation.
* **Multi-Step Agentic Workflows**: Excels in orchestrating sequences of tool calls, API interactions, and decision-making loops with precise instruction-following -- suitable for production agent deployments.
* **Visual Document Analysis**: The 3.3x resolution upgrade makes it highly effective for reading technical diagrams, charts, screenshots, chemical structures, and complex visual documents.
* **Long-Context Research**: With 1M tokens of context and 128K max output, well-suited for synthesizing information across entire repositories, legal corpora, or research paper collections.

## Capabilities and Limitations

| Capability         | Description                                                                                       |
| :----------------- | :------------------------------------------------------------------------------------------------ |
| **Reasoning**      | GPQA Diamond: 94.2%. Strong analytical and scientific reasoning with adaptive thinking support.   |
| **Coding**         | SWE-bench Verified: 87.6%, SWE-bench Pro: 64.3%, Terminal-Bench: 69.4%.                           |
| **Agentic**        | MCP-Atlas scaled tool use: 77.3%, Finance Agent v1.1: 64.4%. Rigorous multi-step execution.      |
| **Computer Use**   | OSWorld-Verified: 78.0%. Strong desktop and browser interaction capabilities.                     |
| **Multimodal**     | Text and image input. High-resolution vision up to ~3.75 MP. CharXiv: 82.1% (91.0% with tools). |
| **Context Window** | 1,000,000 tokens input.                                                                           |
| **Max Output**     | 128,000 tokens standard; 300,000 tokens via Message Batches API with beta header.                |
| **Tool Use**       | Full function calling, code execution, MCP support, adaptive thinking, task budgets.             |
| **Multilingual**   | Strong multilingual performance across major world languages.                                     |

### Known Limitations

* Claude Mythos Preview remains more broadly capable, leading Opus 4.7 on most benchmarks including SWE-bench Pro (77.8% vs 64.3%) and SWE-bench Verified (93.9% vs 87.6%).
* New tokenizer produces up to 35% more tokens for the same input text, meaning actual per-request costs may increase despite unchanged per-token pricing.
* Image input only (no audio or video input natively).
* No real-time or internet-connected capabilities without tool integrations.

## Pricing

| Model           | Input (Credits/Token) | Output (Credits/Token) | Notes                                 |
| :-------------- | --------------------: | ---------------------: | :------------------------------------ |
| Claude Opus 4.7 |                  5.50 |                  27.50 | Up to 90% savings with prompt caching |
