# Gemini 4 Carbon

## Overview

Gemini 4 Carbon is a Google DeepMind reasoning model in the Gemini 4 family, publicly released on [November 10, 2026](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/). Built on Gemini 4 Argon, it emphasizes deeper reasoning and extended verification for difficult software engineering, scientific research, and multimodal knowledge work.

## Key Features

- **Sustained Engineering Workflows:** Handles complex debugging, architectural changes, and migrations through repeated investigation, implementation, and verification.
- **Scientific Reasoning:** Supports mathematical proofs, experimental data analysis, hypothesis exploration, and simulation development.
- **Multimodal Analysis:** Combines document text, charts, images, audio, and video to reason across varied source material.
- **Configurable Thinking:** Offers three reasoning levels to balance depth, response time, and token consumption.
- **Extended Generation:** Supports long decode for problems that need more than the default 64K-token generation budget.

## Best Use Cases

- **Complex Repository Maintenance:** Investigating bugs across subsystems, planning migrations, and checking changes against existing tests.
- **Document-Based Analysis:** Synthesizing dense reports, tables, charts, and technical drawings into structured findings and report drafts.
- **Research and Simulation:** Exploring mathematical or scientific problems, analyzing experimental results, and developing computational models.
- **Full-Stack and Visual Development:** Building applications, refining interfaces, and implementing interactive 3D scenes with tool-assisted verification.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports `low`, `medium` (default), and `high` thinking levels. |
| **Multimodal** | Accepts text, images, video, audio, and PDFs; produces text. |
| **Context Window** | 1,048,576 tokens shared across input, thinking, and output. |
| **Generation Limit** | 65,536 combined thinking and output tokens by default; long decode can use the remaining unified context budget. |
| **Tool Use** | Supports function calling, code execution, File Search, URL context, Search and Maps grounding, and computer use. |
| **Structured Outputs** | Supports schema-constrained structured responses. |
| **Video Understanding** | Supports agentic video understanding; video processing defaults to `static`. |
| **Prompt Caching** | Google's API enables implicit caching by default for prompts of at least 4,096 tokens; explicit caching is unsupported. |
| **Knowledge Cutoff** | March 2026; knowledge in some domains may be less current. |

### Known Limitations

- **Reasoning Budget and Latency:** Carbon generally spends more thinking tokens per turn than Argon. A small generation budget can leave too little room for the answer, and difficult prompts may take several minutes or time out.
- **Long Decode Requirements:** Generation beyond 65,536 tokens requires a higher output limit and background execution or client-side continuation. Exact output-length targets are unreliable.
- **Unsupported Controls and Outputs:** `temperature`, `top_p`, and `top_k` are ignored. Native image generation, native audio generation, and the Live API are unsupported.
- **Cybersecurity Variants:** Specialized cyber capabilities and Google's reported cyber benchmark results apply to verified-defender access through the Fairwind Program.
- **Reliability:** Hallucinations remain possible; factual claims, scientific conclusions, and generated code still require verification.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | ---: | ---: | ---: | ---: | ---: |
| Gemini 4 Carbon | `$4.00` | `$4.00` | `$0.20` | `$20.00` | `$0.014` |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

Web search costs `14,000 Credits` per use, equivalent to `$0.014` per use.

:::info Caching note
For this model on B.AI, cache writes are priced at 1x the input rate. This model supports implicit caching only; the cache-write price shown in the table does not imply support for explicit cache creation. Google's implicit caching requires prompts of at least 4,096 tokens; meeting that threshold does not guarantee a cache hit on every request.
:::

:::info Pricing note
Model prices in the documentation are based on the model providers' official list prices and serve as B.AI standard reference prices. B.AI may offer discounts or limited-time promotions on this basis; offer details are shown in [Promotions and Pricing Updates](../promotions-and-pricing-notices.md) and the website's discount groups. Applicable prices, offer terms, and final charges are subject to the platform display and actual billing records.
:::
