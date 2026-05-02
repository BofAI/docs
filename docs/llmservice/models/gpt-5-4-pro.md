## Overview

GPT-5.4 Pro is the highest-performance variant in the GPT-5.4 family, allocating more compute for deeper reasoning to produce smarter and more precise answers on complex, high-stakes tasks. Available exclusively via the Responses API, some requests may take several minutes to complete, making it ideal for accuracy-critical professional use cases.

## Key Features

- **Enhanced Deep Reasoning**: Allocates significantly more reasoning compute, outperforming the standard model on math, science, and complex coding problems.
- **1M+ Native Context**: Natively supports 1,050,000 token context (922K input + 128K output) without additional configuration.
- **Unified Capability Inheritance**: Inherits all GPT-5.4 capabilities including Computer Use, Tool Search, and configurable reasoning effort.
- **Responses API Exclusive**: Available only via the Responses API, specifically optimized for complex tasks requiring deep thinking.

## Best Use Cases

- **High-Stakes Decision Support**: Ideal for financial analysis, legal reasoning, medical diagnostic assistance, and other professional domains requiring extreme accuracy.
- **Complex Research & Analysis**: The 1M+ context window and deep reasoning make it perfect for cross-document research and systematic analysis.
- **Advanced Coding Challenges**: Excels on frontier coding benchmarks, suitable for large-scale code refactoring, architecture design, and complex bug diagnosis.
- **Enterprise AI Agents**: Powers autonomous agent systems requiring the highest reasoning quality, suitable for critical business process automation.

## Capabilities and Limitations

| Capability             | Detailed Description                                                                                                                                                                                                                     |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reasoning Ability**  | Strongest reasoning in the GPT-5.4 family; ranks #1 out of 104 models (overall score 92/100). SWE-bench Pro 57.7%, OSWorld 75% (surpassing 72.4% human expert baseline), GDPval 83%. Configurable reasoning effort: medium, high, xhigh. |
| **Creative Ability**   | Inherits GPT-5.4's creative capabilities with 128K max output; deeper reasoning improves structured creative tasks like technical writing and system design documents.                                                                   |
| **Multimodal Ability** | Supports text and image input with text output; image understanding and analysis on par with GPT-5.4 standard.                                                                                                                           |
| **Tool Use**           | Agentic tool use score 88.9 (#1 of 104 models). Supports Computer Use, Tool Search, and multi-step workflow orchestration.                                                                                                               |
| **Response Speed**     | Slower — some complex requests may take several minutes, not suitable for low-latency scenarios.                                                                                                                                         |
| **Context Window**     | 1,050,000 tokens (922K input + 128K output), natively supported without additional configuration.                                                                                                                                        |
| **Max Output**         | 128,000 tokens                                                                                                                                                                                                                           |
| **Knowledge Cutoff**   | August 31, 2025                                                                                                                                                                                                                          |

## Credits Usage

| Model       | Input (Credits/Token) | Output (Credits/Token) |
| :---------- | --------------------: | ---------------------: |
| GPT-5.4 Pro |                 30.00 |                 180.00 |



## Limitations

- **High latency**: Complex requests may take several minutes; not suitable for real-time or low-latency applications.
- **Cost**: It is one of the most expensive API models available.
- **No audio/video input**: Multimodal support is limited to text and image input.
