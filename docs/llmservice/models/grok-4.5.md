# Grok 4.5

## Overview

Grok 4.5 is a SpaceXAI reasoning model for coding, agentic tasks, engineering, and knowledge work. On B.AI, use the model ID `grok-4.5`.

## Key Features

* **Agentic Engineering:** Suitable for multi-step coding, debugging, refactoring, and repository-scale work.
* **Configurable Reasoning:** Supports reasoning-effort controls for balancing response speed and depth.
* **Long Multimodal Context:** Supports text and image input within a 500,000-token context window and returns text output.
* **Tool-Using Workflows:** Supports function calling and structured outputs, with additional tool capabilities depending on API configuration.
* **Long-Context Pricing:** Requests with more than 200,000 prompt tokens use the long-context pricing tier.

## Best Use Cases

* Repository-scale coding, including implementation, debugging, refactoring, and technical review.
* Tool-using agents that combine structured output, function calling, and repeated reasoning loops.
* Technical analysis across engineering, science, mathematics, and mixed text/image materials.
* Long-context document and knowledge-work workflows.

## Capabilities and Limitations

| Capability | Detailed Description |
| :--- | :--- |
| **Reasoning** | Supports configurable reasoning effort for tasks with different latency and depth requirements. |
| **Coding** | Suitable for multi-step software engineering and technical problem-solving workflows. |
| **Multimodal** | Supports text and image input with text output. |
| **Context Window** | Supports up to 500,000 tokens. |
| **Tool Use** | Supports function calling and structured outputs; tool availability depends on API configuration. |
| **Multilingual** | Suitable for natural-language technical and knowledge-work requests. |

### Known Limitations

* The model can produce inaccurate responses; validate results before using them in critical workflows.
* Requests with more than 200,000 prompt tokens use the long-context pricing tier for the request.
* Actual tool availability and related charges depend on the real-time options exposed by the platform.

## Credits Usage

| Model and Context Tier | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: |
| **Grok 4.5** | `2.00` | `2.00` | `0.30` | `6.00` |
| **Grok 4.5** (>200K prompt tokens) | `4.00` | `4.00` | `0.60` | `12.00` |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
