import ActivityCard from '@site/src/components/ActivityCard';

# Qwen3.8-Flash

## Overview

Qwen3.8-Flash is a hosted multimodal model from Alibaba's Qwen team, announced on August 26, 2026. It is the production version based on Qwen3.8-Flash-Next, adding a default 1M-token context window and hosted tools for cost-sensitive coding, agentic, and visual knowledge-work applications.

<ActivityCard
  variant="free"
  title="Qwen3.8-Flash"
  status="Free Offer"
  detail="API Free · Chat on Launch"
>
Free access is available in phases across B.AI API and Chat:

* **API:** Qwen3.8-Flash API usage is currently billed at `0 Credits`. No input, cache write, cache read, or output token fees apply.
* **Chat:** Free access begins when Qwen3.8-Flash becomes available in B.AI Chat. The availability date is subject to the actual model listing. Once available, Chat usage is billed at `0 Credits`.

After the offer ends, Qwen3.8-Flash will return to the prices shown on this page.
</ActivityCard>

## Key Features

* **Production Flash-Next Lineage:** Qwen identifies `qwen3.8-flash` as the production version based on Qwen3.8-Flash-Next. The related open-weight architecture uses Gated DeltaNet, Qwen Sparse Attention, Gated Residual, and N-gram Embedding; QwenCloud does not separately publish the production model's parameter count.
* **Native Multimodal Input:** Accepts text, images, and video and produces text output, supporting visual coding, document analysis, charts, and long-video understanding.
* **1M-Token Hosted Context:** Supports up to 991K input tokens without thinking, 983K input tokens with thinking, and 131K output tokens in either mode.
* **Thinking and Agent Controls:** QwenCloud documents thinking as enabled by default for the Qwen3.8 series, exposes the `enable_thinking` control, and lists a maximum reasoning budget of 262K tokens.
* **Agent-Oriented API Features:** Supports prefix completion, function calling, context caching, structured output, Batch API processing, fine-tuning, and built-in tools through QwenCloud's Responses API.
* **Published Flash-Next Evaluation:** The related open-weight foundation reports 62.5 on SWE-bench Pro, 58.7 on DeepSWE 1.1, 73.9 on CoWorkBench, and 73.5 on Toolathlon Verified. Qwen has not published a separate benchmark table for the hosted production endpoint.

## Best Use Cases

* **Cost-Sensitive Coding Agents:** Repository analysis, code generation, debugging, and tool-driven development where low token prices and high account-level rate limits matter.
* **Long-Context Knowledge Work:** Reviewing large document sets, codebases, conversation histories, and research materials within a 1M-token hosted context.
* **Multimodal Analysis:** Understanding screenshots, charts, scanned documents, interfaces, and video together with text instructions.
* **Structured Agent Workflows:** Applications that combine function calling, JSON structured output, code execution, search, extraction, and cached shared prompts.
* **Asynchronous Bulk Processing:** Classification, extraction, evaluation, and dataset processing through the Batch API at half the real-time input and output rates.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Thinking is enabled by default for the Qwen3.8 series and can be controlled with `enable_thinking`. QwenCloud lists a 262K-token maximum reasoning budget but does not publish a model-specific reasoning-effort mapping on the model page. |
| **Creative Writing** | Supports general, long-form, and structured text generation. |
| **Coding** | The related Qwen3.8-Flash-Next evaluation reports SWE-bench Pro: 62.5, DeepSWE 1.1: 58.7, SWE-bench Multilingual: 81.0, and NL2Repo-Bench: 48.1. These are not hosted-endpoint SLA results. |
| **Multimodal** | Accepts text, image, and video input and produces text output. |
| **Context Window** | 1M tokens. |
| **Maximum Input** | 991K tokens in non-thinking mode and 983K tokens in thinking mode. |
| **Max Output** | 131K tokens in both thinking and non-thinking modes. |
| **Tool Use** | Supports function calling, structured output, prefix completion, caching, and Batch API processing. Responses API tools include `code_interpreter`, `i2i_search`, `t2i_search`, `web_extractor`, and `web_search`. |
| **Multilingual** | The related Flash-Next evaluation includes multilingual reasoning and coding benchmarks. |

### Known Limitations

* `qwen3.8-flash` is the hosted production model, while `Qwen/Qwen3.8-Flash-Next` is the related open-weight architecture release. Parameter counts, self-hosting behavior, and Flash-Next benchmark results should not be treated as hosted-endpoint guarantees.
* QwenCloud does not publish a model-specific knowledge cutoff or complete supported-language list.
* Thinking tokens are billed at the output-token rate and consume context. Applications should enable thinking according to task needs rather than assuming that a larger reasoning budget is always more efficient.

## Pricing

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: |
| **Qwen3.8-Flash** | `0.16` | `0.16` | `0.016` | `0.47` | `-` |

Explicit cache creation costs `0.20 Credits/Token`. Both explicit and implicit cache hits cost `0.016 Credits/Token`.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through limited-time offers, top-up bonuses, and account benefits. Specific prices, bonus Credits, account benefits, and final billing are subject to the platform display and billing records.
:::
