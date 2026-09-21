# Kimi K2.8 Preview

## Overview

Kimi K2.8 Preview is Moonshot AI's K2-series preview model for coding and agent workflows, released on September 11, 2026. Available through the API as `kimi-k2.8-preview`, it combines a 1,048,576-token context window, image and video understanding, and adjustable reasoning. Moonshot AI describes its overall performance as close to Kimi K3, with more efficient thinking than K2.7 Code.

## Key Features

* **Coding and Agent Focus**: Designed for code completion and everyday development, with provider-reported improvements in coding and agent capabilities over K2.7 Code.
* **Adjustable Reasoning**: Supports `low`, `high`, and `max` thinking effort, with `max` as the default. Thinking can also be disabled.
* **1M Context Window**: Accommodates large codebases, supporting documents, and extended conversation history within a 1,048,576-token context window.
* **Visual Inputs**: Accepts images and video alongside text, enabling development tasks that use screenshots, interface references, or recorded behavior.

## Best Use Cases

* **Everyday Software Development**: Code completion, feature implementation, debugging, and test generation, using adjustable reasoning to match task complexity.
* **Repository Analysis and Refactoring**: Reviewing dependencies and coordinating changes across files with substantial code and documentation in context.
* **Visually Guided Development**: Interpreting UI screenshots or screen recordings to guide implementation and investigate reported problems.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports `low`, `high`, or `max`; defaults to `max`. Thinking can also be disabled. |
| **Multimodal** | Supports text, image, and video input with text output. |
| **Context Window** | 1,048,576 tokens. |
| **Max Output** | Not published. |
| **Tool Use** | Supports interactive coding agents that read files, edit code, and execute commands through client-provided tools. |

### Known Limitations

* Published specifications do not currently include K2.8-specific parameter counts, architecture details, a knowledge cutoff, or numerical benchmark results. The comparison with Kimi K3 is qualitative.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | ---: |
| **Kimi K2.8 Preview** | `$1.00` | `$1.00` | `$0.25` | `$4.00` | - |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
