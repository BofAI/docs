## Overview

GPT-5.5 is OpenAI's most capable model, released on April 23, 2026. Codenamed "Spud," it is the first fully retrained base model since GPT-4.5, and all prior GPT-5 releases were post-training iterations on the same foundation. GPT-5.5 features a natively omnimodal architecture, a 1-million-token context window, and leads on 14 benchmarks at launch.

## Key Features

* **Rebuilt Foundation**: First complete base model retraining since GPT-4.5, delivering fundamental capability improvements rather than incremental post-training gains across reasoning, coding, and knowledge tasks.
* **Natively Omnimodal**: A single parameter pool handles text, images, audio, and video, enabling seamless cross-modal reasoning without separate encoder modules.
* **60% Hallucination Reduction**: Achieves a 60% reduction in hallucination rate compared to GPT-5.4, and uses approximately 40% fewer output tokens on equivalent Codex tasks, improving both reliability and cost efficiency.
* **Frontier Benchmark Performance**: 88.7% on SWE-bench Verified, 92.4% on MMLU, 93.6% on GPQA Diamond, and 85.0% on ARC-AGI-2, an 11.7-point jump over GPT-5.4.

## Best Use Cases

* **Complex Software Engineering**: With 88.7% on SWE-bench Verified and strong tool-use integration, GPT-5.5 excels at end-to-end coding tasks including debugging, refactoring, and multi-file changes.
* **Multimodal Workflows**: The natively omnimodal architecture makes it uniquely suited for tasks that span text, images, audio, and video, such as analyzing meeting recordings, processing documents with figures, or building multimedia applications.
* **Research and Analysis**: Top scores on GPQA Diamond (93.6%) and MMLU (92.4%) make it the strongest choice for PhD-level science questions, complex reasoning, and knowledge-intensive research tasks.

## Capabilities and Limitations

| Capability         | Description                                                                              |
| :----------------- | :--------------------------------------------------------------------------------------- |
| **Reasoning**      | 93.6% GPQA Diamond, 85.0% ARC-AGI-2, medium reasoning effort by default                  |
| **Coding**         | 88.7% SWE-bench Verified; 40% fewer output tokens on Codex tasks vs GPT-5.4             |
| **Multimodal**     | Natively omnimodal: text, image, audio, and video in a single architecture               |
| **Response Speed** | Medium reasoning effort by default; configurable for latency-sensitive workloads          |
| **Context Window** | 1,050,000 tokens (2x pricing for input beyond 272K tokens)                               |
| **Max Output**     | 128,000 tokens                                                                           |
| **Tool Use**       | Full function calling, tool search, hosted tools, prompt caching, and compaction support |
| **Multilingual**   | Broad multilingual support across major languages                                         |

### Known Limitations

* Significantly more expensive than open-source alternatives, roughly 50x the cost of DeepSeek V4 Pro for input tokens.
* Lost the harder SWE-Bench Pro benchmark to Claude Opus 4.7 despite winning the standard SWE-Bench Verified headline.
* 2x input pricing for prompts exceeding 272K tokens increases costs substantially for long-context workloads.

## Credits and Pricing

| Model       | Input (Credits/Token) | Output (Credits/Token) | Notes                                     |
| :---------- | --------------------: | ---------------------: | :---------------------------------------- |
| **GPT-5.5** | `5.00`                | `30.00`                | 2x input / 1.5x output beyond 272K tokens |

## References

[1] [OpenAI GPT-5.5 Announcement](https://openai.com/index/gpt-5-5)  
[2] [OpenAI API Pricing](https://openai.com/api/pricing)
