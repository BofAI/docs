# GLM-5.3-FlashX

## Overview

GLM-5.3-FlashX is Z.AI's speed-optimized variant of GLM-5.3-Flash. It combines native multimodal understanding with a 1M-token context window for interactive coding, tool-using agents, and document workflows. Z.AI reports generation speeds of up to 200 tokens per second; actual speed varies by request and is not guaranteed.

**Model ID:** `glm-5.3-flashx`

## Key Features

* **Accelerated Inference**: Emphasizes faster generation through serving-infrastructure improvements, helping reduce wait time in interactive and tool-driven workflows.
* **Efficient Architecture**: Uses the shared Flash foundation with 320 billion total parameters and 18 billion activated parameters, combining sparse and linear attention to reduce long-context computation.
* **Native Visual Understanding**: Accepts images, videos, text, and files for tasks that combine visual evidence with language and code.
* **Configurable Reasoning**: Supports `low`, `high`, and `max` reasoning effort, with `max` as the default. Thinking remains enabled.
* **Agent Integration**: Supports function calling, streamed tool calls, JSON output, and automatic context caching.

## Best Use Cases

* **Interactive Coding Agents**: Implementation and debugging loops where faster generation can shorten the wait between tool calls.
* **Visual UI Development**: Interpreting screenshots and inspecting rendered interfaces to guide code revisions.
* **Long-Document Assistants**: Combining lengthy source material, charts, and repeated conversation context for analysis and structured extraction.
* **Office Automation**: Planning and revising presentations, reports, and spreadsheets through external authoring tools and visual checks.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Always enabled; supports interleaved thinking during tool use and preserved thinking across turns. |
| **Multimodal** | Supports text, image, video, and file input and produces text output. |
| **Context Window** | 1,000,000 tokens. |
| **Max Output** | 131,072 tokens. |
| **Tool Use** | Supports function calling with optional streaming of tool-call arguments. |
| **Structured Output** | Supports JSON object output; strict JSON Schema enforcement is not documented as a model-specific guarantee. |

### Known Limitations

* Thinking cannot be disabled. Selecting `low` reduces reasoning effort but does not create a non-thinking mode.
* Preserved thinking requires complete, unmodified, correctly ordered historical `reasoning_content`. Integrations must retain it when continuing the relevant reasoning and tool-call sequence.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | ---: |
| **GLM-5.3-FlashX** | `$0.37` | `$0.37` | `$0.075` | `$1.25` | - |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through limited-time offers, top-up bonuses, and account benefits. Specific prices, bonus Credits, account benefits, and final billing are subject to the platform display and billing records.
:::
