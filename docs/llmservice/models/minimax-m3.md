# MiniMax M3

## Overview

MiniMax M3 is MiniMax's next-generation large language model in the M series. It introduces MiniMax Sparse Attention (MSA), a sub-quadratic attention mechanism designed to improve inference efficiency for million-token context workloads while maintaining output quality comparable to the M2 series. Availability may vary by B.AI model catalog and rollout status.

## Key Features

* **MiniMax Sparse Attention (MSA)**: Uses a two-stage GQA-based sparse attention architecture. A lightweight index branch selects relevant KV blocks, while the sparse branch computes attention only on those selected blocks to reduce attention cost.
* **Million-Token Context**: Designed for 1M-token context scenarios, with preview materials reporting substantially faster decoding and prefill compared with the M2 series at long context lengths.
* **Multimodal Support**: Image-input support depends on platform rollout and model configuration, extending the M series beyond text-only workflows where available.
* **Agent & Office Focus**: Optimized for document understanding, spreadsheet processing, presentation generation, and enterprise agent workflows.

## Best Use Cases

* **Ultra-Long Context Processing**: Multi-document analysis, long conversation history, and large codebase understanding.
* **AI Agent Deployment**: Autonomous task execution that combines tool use, reasoning, and long-context state.
* **Office Automation**: Intelligent processing and generation of documents, spreadsheets, and presentations.

## Capabilities and Limitations

| Capability           | Description                                                                                 |
| :------------------- | :------------------------------------------------------------------------------------------ |
| **Reasoning**        | Designed for frontier-tier reasoning and agent workflows; final benchmark details may vary   |
| **Creative Writing** | Not specified                                                                               |
| **Multimodal**       | Text workflows; image-input support depends on platform rollout and model configuration      |
| **Response Speed**   | Designed for faster long-context prefill and decoding than the M2 series                     |
| **Context Window**   | 1,000,000 tokens                                                                            |
| **Max Output**       | Not specified                                                                               |
| **Tool Use**         | Designed for function calling and agent workflow support                                     |
| **Multilingual**     | Not specified                                                                               |

### Known Limitations

* Final availability, model limits, and benchmark scores may change during rollout.
* Some capabilities described in preview materials may depend on platform support and model configuration.

## Credits Usage

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **MiniMax M3** | `0.30` | `0.30` | `0.06` | `1.20` | `-` | - |
