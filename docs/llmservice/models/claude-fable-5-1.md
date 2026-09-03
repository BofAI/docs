# Claude Fable 5.1

## Overview

Claude Fable 5.1, released by Anthropic on September 1, 2026, is a generally available Mythos-class model in the Claude 5 family for demanding reasoning and long-horizon agentic work. It shares its underlying model with the limited-access Claude Mythos 5.1. On B.AI, use the model ID `claude-fable-5-1`.

## Key Features

* **Long-Horizon Agentic Performance:** Anthropic reports 52.6% on Terminal-Bench-Science 0.1, 55.8% on Terminal-Bench 4.0, 31.4% on AutomationBench, and 73.4% on CursorBench 3.2.0 with production safeguards enabled.
* **Always-On Adaptive Thinking:** Adaptive thinking cannot be disabled. The `effort` control supports `low`, `medium`, `high`, `xhigh`, and `max`, with `high` as the Claude API default.
* **1M Context and 128K Output:** Provides a 1,000,000-token context window and up to 128,000 output tokens at standard per-token pricing across the full window.
* **Agent-Oriented API Controls:** Supports automatic tool use, strict tool schemas, structured output, preserved thinking, per-message effort, turn-scoped system messages, readable progress updates, and content provenance. Several of these controls are beta features.
* **Lower Cache-Read Cost:** Cache hits and refreshes cost 0.25 Credits/Token, one quarter of the Claude Fable 5 cache-read rate, while base input and output prices remain unchanged.

## Best Use Cases

* **Long-Running Software Engineering:** Repository-scale implementation, debugging, code review, performance work, and autonomous sessions that span many tools and checkpoints.
* **Multi-Step Research and Analysis:** Research workflows that require search, evidence synthesis, iterative hypothesis testing, and recovery from failed steps.
* **Enterprise Knowledge Work:** Complex document, spreadsheet, presentation, financial-analysis, and cross-file workflows that benefit from a large context window and vision.
* **Browser and Computer-Use Agents:** Tasks that operate across applications, maintain state over extended sessions, and provide progress updates between tool calls.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Always-on adaptive thinking with five effort levels. Anthropic reports 60.9% on Humanity's Last Exam without tools and 65.0% with tools. |
| **Creative Writing** | Supports drafting, editing, research synthesis, and professional artifact creation. |
| **Multimodal** | Accepts text and image input and produces text output. It can analyze charts, diagrams, tables, files, and PDFs. |
| **Context Window** | 1M tokens. |
| **Max Output** | 128,000 tokens. |
| **Tool Use** | Supports automatic function calling, strict tool use, structured output, browser and computer-use workflows, and preserved thinking. Forced `any` or named-tool selection is not supported. |
| **Multilingual** | Anthropic lists multilingual support across current Claude models. |
| **Knowledge Cutoff** | Reliable knowledge cutoff and training-data cutoff: June 2026. |

### Known Limitations

* Forced tool choice is not supported. Setting `tool_choice` to `any` or to a named tool returns a 400 error; integrations should use `auto` or `none` and express required tool behavior in the prompt.
* Thinking blocks are forward-compatible only: Claude Fable 5.1 can read thinking blocks from earlier models, but earlier models cannot read its thinking blocks.
* Editing the system prompt, tool definitions, or earlier messages after a Fable 5.1 thinking block can invalidate that block. Long-running integrations should treat conversation history as append-only or use the documented block-dropping controls.
* The model is comparatively slow and costs twice as much per base input and output token as Claude Opus 5.
* Fable safeguards may refuse or route some cybersecurity and biology requests to another Claude model. Fable 5.1 also requires 30-day data retention by default; zero-data-retention use requires express authorization from Anthropic.
* Priority Tier is not supported for Claude Fable 5.1.

## Pricing

| Model | Input (Credits/Token) | 5m Cache Write (Credits/Token) | 1h Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) |
| :--- | --------------------: | -----------------------------: | -----------------------------: | -------------------------: | ---------------------: | -----------------------: |
| **Claude Fable 5.1** | `10.00` | `12.50` | `20.00` | `0.25` | `50.00` | `-` |

:::info Caching note
For Claude Fable 5.1, a 5-minute cache write is billed at 1.25x the input rate and a 1-hour cache write is billed at 2x. Cache reads are billed at 0.025x the input rate.
:::

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
