## Overview

GPT-5.4 Nano is the smallest and most cost-effective variant in the GPT-5.4 family, released on March 17, 2026, designed for speed-critical and cost-sensitive scenarios. At just $0.20/$1.25 per MTok, it delivers reasoning capabilities with an Intelligence Index of 44.4, far above the median of 20 among similarly-priced models — ideal for classification, data extraction, ranking, and sub-agent tasks at scale.

## Key Features

- **Extreme Cost Efficiency**: $0.20/1M input + $1.25/1M output, blended rate (3:1 input-to-output ratio) of just $0.46/1M tokens — the most affordable option in the GPT-5.4 family.
- **High-Speed Inference**: ~221.8 tokens/second generation speed with 3.72-second time to first token, suitable for real-time systems.
- **Reasoning Model**: Despite being the smallest variant, GPT-5.4 Nano is still a reasoning model with extended thinking / chain-of-thought reasoning.
- **Multimodal Input**: Supports text and image input, suitable for lightweight multimodal tasks like visual classification and image analysis.
- **400K Context Window**: Same 400,000 token context window as Mini, providing ample input capacity.

## Best Use Cases

- **Classification & Data Extraction**: OpenAI's officially recommended core use case, delivering reliable performance for structured data processing, text classification, and information extraction.
- **Coding Sub-Agents**: Suitable for handling simpler supporting tasks in multi-agent architectures, such as code formatting, linting, and small code generation.
- **Real-Time Systems & High-Throughput Pipelines**: Ultra-low latency and cost combination makes it perfect for background tasks, real-time ranking, and large-scale automation pipelines.
- **Distributed Agent Architectures**: Serves as edge execution nodes in distributed agent systems, minimizing per-call cost and latency.

## Capabilities and Limitations

| Capability             | Detailed Description                                                                                                                                                 |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reasoning Ability**  | Intelligence Index 44.4 (median 20 for similar price tier), with chain-of-thought reasoning, but less capable than Mini and Standard on complex multi-step problems. |
| **Creative Ability**   | Suitable for short text generation and template filling; not suited for long-form writing or creation requiring deep reasoning.                                      |
| **Multimodal Ability** | Supports text and image input with text output; suitable for basic image classification and recognition, complex image analysis is better handled by larger models.  |
| **Response Speed**     | Very fast — ~221.8 tokens/second, 3.72s time to first token, the fastest model in the GPT-5.4 family.                                                                |
| **Context Window**     | 400,000 tokens                                                                                                                                                       |
| **Max Output**         | Not officially specified                                                                                                                                             |
| **Knowledge Cutoff**   | August 31, 2025                                                                                                                                                      |

## Credits Usage

| Model        | Input (per 1M tokens) | Output (per 1M tokens) |
| :----------- | --------------------: | ---------------------: |
| GPT-5.4 Nano |                 $0.20 |                  $1.25 |
