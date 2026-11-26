# Gemini 4 Neon

## Overview

Gemini 4 Neon is a multimodal reasoning model that Google DeepMind released on November 18, 2026. Adapted from Gemini 4 Carbon, it sits between Hydrogen and Carbon in the Gemini 4 family and is designed to complete complex coding, analysis, and multi-step workflows quickly.

## Key Features

- **Multi-file coding** across implementation, debugging, and verification with tests.
- **Tool-assisted workflows** that carry results from one step into the next and adapt to user feedback during a task.
- **Multimodal analysis** that draws on documents, images, audio, and recorded video in the same request.
- **Adjustable reasoning** to balance response time and token use against the difficulty of the task.
- **Long decode** for tasks that need more generation capacity than a single synchronous response allows.

## Best Use Cases

- **Software maintenance** for tracing regressions across modules, implementing fixes, and checking them against existing tests.
- **Technical document review** for comparing specifications, diagrams, and recordings to extract requirements or identify inconsistencies.
- **Scientific and quantitative analysis** for exploring mathematical problems and explaining patterns in datasets or charts.
- **Workflow automation** for gathering information, validating it with tools, and returning records that downstream systems can use.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Inputs and Output** | Accepts text, images, video, audio, and PDFs, and produces text. |
| **Context Window** | Shares 1,048,576 tokens across input, thinking, and output. |
| **Generation Limit** | The default synchronous limit is 65,536 tokens of thinking and output. Long decode can use the remaining context budget through background execution or continuation. [Long decode guide](https://aistudio.google.com/docs/long-decode) |
| **Thinking Levels** | Supports `low`, `medium`, `high` (default), and `xhigh`. |
| **Tool Use** | Google's Gemini API supports function calling, code execution, file search, URL context, search and map grounding, and computer use. |
| **Structured Output** | Supports JSON responses constrained by a schema. |
| **Video Understanding** | Uses static processing by default and supports optional agentic video understanding in the Gemini API. |
| **Prompt Caching** | The Gemini API supports automatic prefix caching for eligible prompts of at least 4,096 tokens. |

### Known Limitations

- **Reasoning cost and latency.** The `xhigh` level can take longer and use more tokens. Difficult prompts can take several minutes.
- **Sampling controls.** The Gemini API uses fixed sampling settings and ignores valid custom `temperature`, `top_p`, and `top_k` values.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | ---: | ---: | ---: | ---: | ---: |
| Gemini 4 Neon | `$3.00` | `$3.00` | `$0.15` | `$15.00` | `$0.014` |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

Web search costs `14,000 Credits` per use, equivalent to `$0.014` per use.

:::info Caching note
For this model on B.AI, cache writes are priced at 1x the input rate. This model supports implicit caching only; the cache-write price shown in the table does not imply support for explicit cache creation. Google's implicit caching requires prompts of at least 4,096 tokens; meeting that threshold does not guarantee a cache hit on every request.
:::

:::info Pricing note
Model prices in the documentation are based on the model providers' official list prices and serve as B.AI standard reference prices. B.AI may offer discounts or limited-time promotions on this basis; offer details are shown in [Promotions and Pricing Updates](../promotions-and-pricing-notices.md) and the website's discount groups. Applicable prices, offer terms, and final charges are subject to the platform display and actual billing records.
:::
