import ActivityCard from '@site/src/components/ActivityCard';

# MiMo-V2.5

## Overview

MiMo-V2.5 is an open-weight native omnimodal model from Xiaomi MiMo that entered public beta on April 23, 2026. It combines a 310-billion-parameter sparse Mixture-of-Experts (MoE) language backbone with dedicated vision and audio encoders to understand text, images, video, and audio in long-context agent workflows.

<ActivityCard
  variant="free"
  title="MiMo-V2.5"
  status="Free Offer"
  detail="API Free · Chat Aug 25"
>
MiMo-V2.5 free access is available in phases:

* **API:** MiMo-V2.5 API usage is billed at `0 Credits` from August 24, 2026.
* **Chat:** The free-access date is August 25, 2026. The exact availability time is subject to actual activation. Once available, MiMo-V2.5 usage is billed at `0 Credits`.

After the offer ends, MiMo-V2.5 will return to standard pricing. The table below shows its standard reference price.
</ActivityCard>

## Key Features

* **Native Omnimodal Understanding:** Processes text, image, video, and audio input in one model, using a 729M-parameter vision encoder and a 261M-parameter audio encoder in addition to the language backbone.
* **310B Sparse MoE Architecture:** Uses 310 billion total parameters, 15 billion active parameters, 256 routed experts, and eight selected experts per token.
* **Efficient 1M-Token Context:** Interleaves 39 Sliding Window Attention layers with nine global-attention layers in a 5:1 pattern. Xiaomi reports nearly 6x lower KV-cache storage while retaining long-context performance.
* **Multimodal and Coding Evaluation:** Xiaomi reports 77.9 on MMMU-Pro, 87.7 on Video-MME, 23.8 on Claw-Eval Multimodal, 65.8 on Terminal-Bench 2.0, and 56.1 on SWE-Bench Pro.
* **Agent-Oriented API Controls:** Supports deep thinking, streaming, function calling, structured output, and Xiaomi's separately billed web-search service.

## Best Use Cases

* **Multimodal Analysis:** Understanding screenshots, charts, scanned documents, video, and audio alongside written instructions and contextual data.
* **Visual and Media-Aware Agents:** Agents that must inspect multimodal evidence, reason about it, call tools, and produce a text response or action plan.
* **General Coding and Automation:** Software tasks that benefit from image-based UI context, terminal tools, structured output, and lower API cost than the Pro variant.
* **Long-Context Applications:** Document analysis, codebase assistance, media archives, and extended conversations that need up to a one-million-token context.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Deep thinking is enabled by default and can be turned off with `thinking.type`. Xiaomi's official multimodal results include 77.9 on MMMU-Pro and 81.0 on CharXiv RQ. |
| **Coding** | Xiaomi reports 71.8 on MiMo Coding Bench, 62.3 on Claw-Eval Text, 65.8 on Terminal-Bench 2.0, and 56.1 on SWE-Bench Pro. |
| **Creative Writing** | Supports general and long-form text generation. |
| **Multimodal** | Accepts text, image, video, and audio input and produces text output. Official results include 87.7 on Video-MME, 83.5 on DailyOmni, and 23.8 on Claw-Eval Multimodal. |
| **Context Window** | 1M tokens. |
| **Max Output** | 128K tokens. |
| **Tool Use** | Supports function calling, structured output, streaming, and Xiaomi's web-search tool. In thinking-mode agent conversations, tool-call history must retain the complete `reasoning_content` field. |
| **Multilingual** | The official model repository identifies English and Chinese support. |

### Known Limitations

* The hosted API provides multimodal understanding with text output; it does not generate images, audio, or video as native response modalities.
* In thinking mode, custom `temperature` and `top_p` values are ignored; the API forces `1.0` and `0.95`. Multi-turn tool workflows that omit historical `reasoning_content` can fail with HTTP 400 or lose context quality.

## Pricing

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: |
| **MiMo-V2.5** | `0.14` | `0.14` | `0.0028` | `0.28` | `-` |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
