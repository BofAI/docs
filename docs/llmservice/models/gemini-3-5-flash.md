# Gemini 3.5 Flash

## Overview

Gemini 3.5 Flash is a Flash-tier model in the Gemini 3 family. It is designed for low-latency, cost-efficient workloads that still require strong reasoning, coding support, and multimodal understanding.

On B.AI, use the model ID `gemini-3.5-flash`.

## Key Features

* **Agentic Execution:** Suitable for sub-agent deployment, multi-step workflows, and rapid agentic loops at scale.
* **Coding Support:** Optimized for iterative coding cycles, rapid exploration, and prototyping where fast turnaround matters.
* **Configurable Thinking Levels:** Supports `minimal`, `low`, `medium`, and `high` thinking levels, with `medium` as the default.
* **Combined Tool Use:** Supports function calling, code execution, Google Search grounding, URL context, and structured outputs.

## Best Use Cases

* **Agentic Workflows at Scale:** A strong fit for production agent systems that need fast, repeated tool calls and sustained task progress.
* **Rapid Coding Iterations:** Useful for developer tools, code generation pipelines, debugging assistance, and interactive prototyping.
* **Cost-Efficient Intelligence:** Suitable for high-volume production workloads that need a balance of speed, capability, and cost.

## Capabilities and Limitations

| Capability | Detailed Description |
| :--- | :--- |
| **Reasoning** | Strong reasoning with configurable thinking levels for balancing quality, latency, and cost. |
| **Coding** | Optimized for iterative coding cycles and agentic coding workflows. |
| **Multimodal** | Supports text, image, video, audio, and PDF input with text output. |
| **Response Speed** | Flash-tier latency, including a `minimal` thinking level for faster chat-like responses. |
| **Context Window** | Supports a context window of up to 1,048,576 tokens. |
| **Max Output** | Supports up to 65,536 output tokens. |
| **Tool Use** | Supports function calling, code execution, Google Search grounding, URL context, and structured outputs. |
| **Multilingual** | Supports multilingual tasks across major languages. |

## Credits Usage

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **Gemini 3.5 Flash** | `1.50` | `1.50` | `0.15` | `9.00` | `14,000` | - |
