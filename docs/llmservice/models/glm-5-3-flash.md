import ActivityCard from '@site/src/components/ActivityCard';

# GLM-5.3-Flash

## Overview

GLM-5.3-Flash is an open-weight, natively multimodal model released by Z.AI on August 26, 2026 as the Flash-tier member of the GLM-5 family. It combines 320 billion total parameters with 18 billion activated parameters, a 1M-token context window, and a hybrid sparse-and-linear-attention architecture for coding, agentic, and visual knowledge-work workloads.

<ActivityCard
  variant="discount"
  title="GLM-5.3-Flash"
  status="Limited-Time Discount"
  detail="30% from Sep 25, 15:00 UTC+8"
>
At 15:00 on September 25, 2026 (Beijing Time, UTC+8), the promotional rate changes from 10% to 30% of the standard reference price.

From that time, eligible GLM-5.3-Flash usage through B.AI API and Chat is billed at 30% of the standard reference price.

The pricing table below continues to show standard reference prices.
</ActivityCard>

## Key Features

* **Efficient Hybrid Architecture**: Uses sparse attention, linear attention, Manifold-Constrained Hyper-Connections (mHC), and IndexPool. Z.AI reports 3.0x lower attention compute and 4.4x smaller KV-cache size than GLM-5.3 in its architecture comparison.
* **Native Multimodal Understanding**: Accepts text, images, videos, and files, allowing agents to inspect interfaces, rendered outputs, documents, and other visual evidence during a task.
* **Coding and Agent Evaluation**: Z.AI reports 84.3 on Terminal-Bench 2.1, 63.4 on DeepSWE v1.1, 78.4 on Toolathlon Verified, and 48.8 on AutomationBench v1.0.6.
* **Configurable Always-On Reasoning**: Supports `low`, `high`, and `max` reasoning effort, with `max` as the default. Thinking cannot be disabled.

## Best Use Cases

* **Visual Software Engineering**: Building and refining frontends, games, 3D scenes, and other interfaces by combining code changes with screenshot or rendered-output inspection.
* **Long-Horizon Coding Agents**: Repository-scale implementation, debugging, testing, and multi-step automation that require reasoning, function calls, and large working contexts.
* **Multimodal Professional Workflows**: Extracting and reasoning over documents, charts, dashboards, presentations, spreadsheets, and video before producing structured text or office deliverables through an agent environment.
* **Cost-Sensitive API Workloads**: High-volume text and multimodal tasks that benefit from low per-token pricing, cached-input discounts, and a 1M-token context window.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Thinking is always enabled. `reasoning_effort` supports `low`, `high`, and `max`; the default is `max`. |
| **Creative Writing** | Supports general and long-form text generation. |
| **Coding** | Z.AI reports Terminal-Bench 2.1: 84.3, DeepSWE v1.1: 63.4, NL2Repo: 56.3, Toolathlon Verified: 78.4, and AutomationBench v1.0.6: 48.8. |
| **Multimodal** | Accepts text, image, video, and file input and produces text output. |
| **Context Window** | 1,000,000 tokens. |
| **Max Output** | 131,072 tokens; the default `max_tokens` value is 65,536. |
| **Tool Use** | Supports function calling, streamed tool calls, context caching, and JSON structured output. ZCode can pair the model with Browser Use and Computer Use for visually grounded agent workflows. |
| **Multilingual** | The official model repository identifies English and Chinese support. |

### Known Limitations

* `thinking.type` only supports `enabled`; applications that require lighter reasoning should use `reasoning_effort: "low"` rather than disabling thinking.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Model | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | ---: |
| **GLM-5.3-Flash** | `$0.15` | `$0.15` | `$0.03` | `$0.50` | - |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

**Standard price effective date:** The prices above take effect at 00:00 on September 10, 2026 (UTC+8). This standard price update does not affect current promotions. During a promotion, billing follows the applicable promotion rules; after it ends, the standard reference prices above apply.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through limited-time offers, top-up bonuses, and account benefits. Specific prices, bonus Credits, account benefits, and final billing are subject to the platform display and billing records.
:::
