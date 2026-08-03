# Qwen3.7-Max

Qwen3.7-Max is a Qwen model available through B.AI for programming, office productivity, long-context analysis, and tool-assisted workflows. On B.AI, use the model ID `qwen3.7-max`.

## Key Features

* **Hybrid Thinking:** Supports thinking and non-thinking response modes where available, allowing different depth and latency tradeoffs by task.
* **Long Context:** Supports up to 1,000,000 tokens of context, subject to B.AI platform configuration and request limits.
* **Agent and Tool Workflows:** Suitable for function calling, structured output, and tool-assisted tasks where these capabilities are enabled.
* **Context Caching:** Supports cache-aware usage. Cache behavior and availability are subject to the current B.AI model configuration.

## Best Use Cases

* Repository-scale implementation, debugging, code review, and multi-step engineering tasks.
* Large-document analysis, research synthesis, and enterprise knowledge workflows.
* Document drafting, summarization, data analysis, and structured productivity tasks.
* Tool-driven automation that uses function calling or structured output.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports thinking and non-thinking modes where available. |
| **Coding** | Suitable for code generation, debugging, review, refactoring, and multi-step engineering workflows. |
| **Creative Writing** | Supports general-purpose drafting and open-ended text generation. |
| **Multimodal** | The `qwen3.7-max` model ID accepts text input and returns text output. |
| **Context Window** | Up to 1,000,000 tokens, subject to platform configuration and request limits. |
| **Max Output** | Up to 65,536 tokens, subject to platform configuration. |
| **Tool Use** | Function calling and structured output are available where enabled. |
| **Multilingual** | Suitable for multilingual text-generation workflows. |

### Known Limitations

* Model availability, input modalities, tool support, and request limits depend on the current B.AI model catalog and platform configuration.
* The model ID may be updated by the provider or platform. Verify the current model catalog before relying on fixed behavior in production workflows.
* Model output can be inaccurate. Validate results before using them in critical decisions or production systems.

## Pricing

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **Qwen3.7-Max** | `1.65` | `1.65` | `0.33` | `4.951` | `-` | - |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
