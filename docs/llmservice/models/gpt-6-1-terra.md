# GPT-6.1 Terra

## Overview

GPT-6.1 Terra is an OpenAI GPT-6 series model [released on October 26, 2026](https://developers.openai.com/api/docs/changelog), focused on efficient visual reasoning, precise computer use, and clear, natural writing. It combines text and image understanding with configurable reasoning for everyday professional workflows. On B.AI, use the model ID `gpt-6.1-terra`.

## Key Features

- **Visual Reasoning**: Interprets product photos, technical drawings, and application screenshots to support comparison and analysis.
- **Computer Use**: Works with computer-use tools to navigate interfaces and carry out tasks across applications.
- **Natural Writing**: Drafts and revises concise text from supplied material, with attention to audience and voice.
- **Adjustable Reasoning**: Six effort settings, including `none`, let applications balance reasoning depth, response time, and token consumption.
- **Long Working Context**: A 1.05M-token context window accommodates substantial reference material and conversation history.

## Best Use Cases

- **Visual Review and Matching**: Matching product images to catalog entries or comparing technical drawings against requirements.
- **Application Workflows**: Completing screen-based tasks with a defined outcome, such as entering information or updating records through connected tools.
- **Business Writing**: Turning supplied notes and reference material into concise drafts, summaries, and revisions.
- **Scoped Code Fixes**: Making targeted changes to existing code when requirements and verification steps are clear.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports `none`, `low`, `medium` (default), `high`, `xhigh`, and `max`. |
| **Multimodal** | Text and image input; text output. Native audio and video input or output are unsupported. |
| **Context Window** | [1,050,000 tokens](https://developers.openai.com/api/docs/models/gpt-6.1-terra), shared by input and generated tokens. |
| **Max Output** | 128,000 tokens, including reasoning and visible output. |
| **Tool Use** | Supports function calling, web and file search, computer use, code execution, MCP, and image generation through tools in the Responses API. |
| **Structured Output** | Supports Structured Outputs and streaming. |
| **Prompt Caching** | Supports implicit and explicit caching through the Responses API, with a 30-minute or 12-hour minimum lifetime. |
| **Knowledge Cutoff** | June 1, 2026. |

### Known Limitations

- Tool calling requires the Responses API; Chat Completions supports requests without tools.
- With reasoning enabled, `temperature`, `top_p`, and log-probability controls are unsupported. Fine-tuning is unavailable.
- Reasoning can increase latency and consume the output budget before a complete visible answer is produced.
- For complex projects and demanding analysis, GPT-6.1 Sol or GPT-6 Astra may be a better fit.

## Standard Pricing

The token prices below are shown in USD per 1 million tokens; web search is billed in USD per use.

| Context | Input<br/>(USD / 1M Tokens) | 30m Cache Write<br/>(USD / 1M Tokens) | 12h Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| Up to 272K input tokens | `$1.00` | `$1.25` | `$2.50` | `$0.05` | `$5.00` | `$0.01` |
| More than 272K input tokens | `$2.00` | `$2.50` | `$5.00` | `$0.10` | `$7.50` | `$0.01` |

- Above 272K input tokens, the higher rates apply to the entire request, not only the portion above the threshold.
- Cache-write rates replace the ordinary input charge for those tokens. The default minimum cache lifetime is 30 minutes; 12-hour caching has a higher write rate but the same cache-read rate. The 30-minute write rate is 1.25x the applicable input rate, the 12-hour write rate is 2.5x, and cache reads are 0.05x.
- Web search costs `10,000 Credits` (`$0.01`) per use and is not affected by the context tier.

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through account benefits. Specific prices and account benefits are subject to the platform display and final billing records.
:::
