# Gemini 4 Argon

## Overview

Gemini 4 Argon is a Google DeepMind reasoning model announced on September 30, 2026, and generally available since October 13, 2026. It is designed for complex software engineering, scientific reasoning, and enterprise knowledge work, with a unified 1M-token context window and long-decode generation.

## Key Features

- **Adjustable Reasoning:** Supports `low`, `medium` (default), and `high` thinking levels to balance reasoning depth, latency, and token use.
- **Agentic Coding:** Designed for demanding debugging, code migration, and iterative engineering workflows.
- **Enterprise Analysis:** Supports reasoning across documents and evidence for complex professional knowledge work.
- **Multimodal Understanding:** Accepts text, image, video, audio, and PDF input, including charts and long videos, and produces text output.
- **Defensive Cybersecurity:** Can identify, validate, and patch software vulnerabilities in authorized agent workflows.
- **Extended Generation:** Long decode supports generation beyond 64K tokens within the remaining unified context budget, subject to interface and execution requirements.

## Best Use Cases

- **Software Maintenance:** Multi-step debugging, code migration, and optimization requiring iterative analysis and verification.
- **Professional Research:** Financial investigation and legal research or drafting that combine evidence across documents.
- **Visual Knowledge Work:** Chart interpretation and video analysis alongside document-based reasoning.
- **Security Remediation:** Authorized vulnerability discovery and patch validation, subject to access controls and safeguards.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Dynamic thinking with `low`, `medium`, and `high` levels; `medium` is the default. |
| **Multimodal** | Text, image, video, audio, and PDF input; text output. |
| **Context Window** | 1,048,576 tokens shared across input, thinking, and output. This is a unified budget, not separate input and output allowances. |
| **Max Output** | 65,536 tokens for synchronous requests. Provider long decode can use up to 1,048,576 minus input tokens, including thinking, where supported by the interface. |
| **Tool Use** | Provider capabilities include function calling, structured outputs, code execution, File Search, URL context, Search and Maps grounding, and Computer Use (Preview). B.AI availability depends on the endpoint. |
| **Video Understanding** | Agentic video understanding is generally available; video processing defaults to `static`. |
| **Prompt Caching** | Implicit caching only, enabled by default for prompts of at least 4,096 tokens. Explicit caching is unsupported. |
| **Knowledge Cutoff** | March 2026; knowledge in some domains may be less current. |

### Known Limitations

- **Output Budget:** Thinking consumes the generation budget. A small limit can produce truncated or empty answers; longer input leaves less room for generation.
- **Long Decode:** On the provider's Interactions API, outputs above 65,536 tokens require background execution and a raised output limit. Do not assume the same behavior is available through every B.AI endpoint. Exact word-count or token-length targets are unreliable.
- **Unsupported Features:** Explicit caching, native image or audio generation, and the Live API are unsupported. Computer Use remains a preview capability.
- **Sampling Controls:** `temperature`, `top_p`, and `top_k` are ignored.
- **Reliability and Latency:** Hallucinations, occasional slowness, and timeouts remain possible; difficult prompts can take several minutes.
- **Evaluation Conditions:** Provider evaluations may use the highest thinking settings and different test environments. Evaluation scores do not guarantee production outcomes.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | ---: | ---: | ---: | ---: | ---: |
| Gemini 4 Argon | `$2.00` | `$2.00` | `$0.10` | `$10.00` | `$0.014` |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

Web search costs `14,000 Credits` per use, equivalent to `$0.014` per use.

:::info Caching note
This model supports implicit caching only. The cache-write price shown in the table does not imply support for explicit cache creation. For provider implicit caching, prompts must meet the minimum length of 4,096 tokens; meeting the length threshold does not guarantee a cache hit on every request.
:::

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
