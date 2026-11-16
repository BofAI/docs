# Gemini 4 Hydrogen

## Overview

Gemini 4 Hydrogen is a Google DeepMind model in the Gemini 4 family, released on [November 12, 2026](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/). Adapted from Gemini 4 Carbon, it focuses on efficient everyday coding, agent execution, and multimodal knowledge work, with adjustable reasoning and a unified 1M-token context window.

## Key Features

- **Iterative Coding**: Supports repository exploration, issue resolution, debugging, and targeted code changes.
- **Agent Execution**: Handles multi-step tool workflows and can serve as a worker or verifier alongside other models.
- **Multimodal Analysis**: Combines text, documents, images, charts, audio, and recorded video for research and synthesis.
- **Adjustable Reasoning**: Offers four thinking levels to balance reasoning depth, response time, and token use.
- **Extended Generation**: Long decode supports lengthy reports, code, and reasoning within the remaining context budget.

## Best Use Cases

- **Software Maintenance**: Investigating bugs, answering codebase questions, implementing fixes, and checking changes with tests.
- **Document-Based Research**: Synthesizing reports, tables, charts, and recorded material into summaries or structured findings.
- **Web Prototyping**: Building interactive applications and refining interfaces through repeated implementation and review.
- **Worker and Verifier Agents**: Executing defined subtasks, gathering evidence, and checking results in coordinated agent workflows.

## Capabilities and Limitations

| Capability              | Description                                                                                                                                                                  |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reasoning**           | Supports `low`, `medium`, `high` (default), and `xhigh` thinking levels.                                                                                                     |
| **Multimodal**          | Accepts text, images, audio, video, and PDFs; produces text.                                                                                                                 |
| **Document Formats**    | Google's Cloud API also accepts Word, PowerPoint, Excel, and OpenDocument files.                                                                                             |
| **Context Window**      | [1,048,576 tokens](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/4-hydrogen) shared across input, thinking, function calls, and final output. |
| **Generation Limit**    | 65,536 combined thinking, function-call, and final-output tokens per default synchronous segment; long decode can use the remaining unified context budget through continuation or background processing.                                                                                |
| **Tool Use**            | Supports function calling, code execution, URL context, grounding, and computer use through compatible integrations.                                                         |
| **Structured Outputs**  | Supports schema-constrained responses for extraction and structured deliverables.                                                                                            |
| **Video Understanding** | Agentic video processing is supported but requires enabling; static processing is the default.                                                                               |
| **Prompt Caching**      | Google's API applies implicit caching to shared prompt prefixes of at least 4,096 tokens; explicit caching is unsupported.                                                   |
| **Knowledge Cutoff**    | March 2026; knowledge in some domains may be less current.                                                                                                                   |

### Known Limitations

- **Shared Generation Budget**: Thinking and function calls consume output tokens. Higher thinking levels can increase token use and latency, leaving less room for the final answer under a fixed limit.
- **Output Length**: Exact word-count or token-length targets are unreliable.
- **Generation Controls**: Custom `temperature`, `top_p`, and `top_k` values are ignored. The `minimal` thinking level and explicit thinking budgets are unsupported.
- **Reliability**: Hallucinations, occasional slow responses, and timeouts remain possible; factual conclusions and generated code require verification.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | ---: | ---: | ---: | ---: | ---: |
| Gemini 4 Hydrogen | `$1.50` | `$1.50` | `$0.075` | `$7.50` | `$0.014` |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

Web search costs `14,000 Credits` per use, equivalent to `$0.014` per use.

:::info Caching note
For this model on B.AI, cache writes are priced at 1x the input rate. This is a B.AI billing rule, not a separate cache-write price listed by Google. The model supports implicit caching only; the cache-write price does not imply support for explicit cache creation. Google's implicit caching requires prompts of at least 4,096 tokens; meeting that threshold does not guarantee a cache hit on every request.
:::

:::info Pricing note
Model prices in the documentation are based on the model providers' official list prices and serve as B.AI standard reference prices. B.AI may offer discounts or limited-time promotions on this basis; offer details are shown in [Promotions and Pricing Updates](../promotions-and-pricing-notices.md) and the website's discount groups. Applicable prices, offer terms, and final charges are subject to the platform display and actual billing records.
:::
