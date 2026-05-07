# GPT-5.5 Instant

## Overview

GPT-5.5 Instant is an OpenAI model released on May 5, 2026 as the successor to GPT-5.3 Instant. It shares the same underlying architecture as GPT-5.5 Thinking and Pro, a natively omnimodal model that processes text, images, audio, and video end to end, but is optimized for low latency and everyday conversational use.

## Key Features

* **Reduced Hallucinations**: 52.5% fewer hallucinated claims than GPT-5.3 Instant on high-stakes prompts such as medicine, law, and finance, and 37.3% fewer inaccurate claims on user-flagged factual errors.
* **Natively Omnimodal**: Processes text, images, audio, and video in a single unified architecture rather than combining separate models. Improvements include better image understanding and stronger STEM question answering.
* **Concise Output**: Uses roughly 30.2% fewer words and 29.2% fewer lines than GPT-5.3 Instant to convey the same information, with tighter formatting and less unnecessary verbosity.
* **Personalized Memory**: Can reference past conversations, files, and Gmail for more personalized responses for eligible Plus and Pro users.

## Best Use Cases

* **Everyday Knowledge Work**: Optimized for information-seeking questions, how-tos, technical writing, and translation with a warm conversational tone and low latency.
* **Multimodal Analysis**: Strong image and document understanding makes it well-suited for analyzing uploads, screenshots, charts, and other visual content.
* **High-Stakes Factual Q&A**: The reduction in hallucinations makes it more reliable for queries in medicine, law, and finance compared to prior Instant-tier models.

## Capabilities and Limitations

| Capability         | Description                                                                                    |
| :----------------- | :--------------------------------------------------------------------------------------------- |
| **Reasoning**      | AIME 2025: 81.2% versus 65.4% for GPT-5.3 Instant. Shares architecture with GPT-5.5 Thinking |
| **Coding**         | Capable for everyday coding tasks; GPT-5.5 Thinking is recommended for complex agentic coding |
| **Multimodal**     | Text, image, audio, and video input in a natively omnimodal architecture                      |
| **Response Speed** | Low-latency design; matches GPT-5.4 per-token latency despite higher capability               |
| **Context Window** | 1M tokens (922K input + 128K output). Long-context surcharge above 272K input tokens         |
| **Max Output**     | 128K tokens                                                                                   |
| **Tool Use**       | Web search, file analysis, and auto-switching across tools                                    |
| **Multilingual**   | Improved translation quality with broad multilingual support                                  |

### Known Limitations

* Instant tier trades reasoning depth for speed, so complex multi-step reasoning and agentic workflows are better served by GPT-5.5 Thinking or Pro.
* MMMU-Pro multimodal score (76) and AIME math score (81.2) are lower than the full GPT-5.5 Thinking model.
* The rapid release cadence means prompts and custom GPT workflows optimized for this model may need periodic retuning.
* Knowledge cutoff is December 2025. Web search can help with more recent information.

## Credits Usage

| Model               | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Billing Notes                                        |
| :------------------ | --------------------: | --------------------------: | -------------------------: | ---------------------: | :--------------------------------------------------- |
| **GPT-5.5 Instant** | `5.00`                | `5.00`                      | `0.50`                     | `30.00`                | Long-context (>272K input tokens): Input 2x, Output 1.5x |
