# GPT-6 Astra

## Overview

GPT-6 Astra is OpenAI's first 6-series model, announced on September 3, 2026, for complex end-to-end work across software, browsers, research, and professional applications. Its model ID is `gpt-6-astra`. It combines configurable reasoning, computer-use capabilities, and a 1.05M-token context window for long-running, tool-intensive workflows.

## Key Features

* **Agentic Computer Work**: Combines visual understanding, computer use, browsing, and tool execution for multistep workflows.
* **Software Engineering**: Supports hosted shell, code interpreter, Apply Patch, and other Responses API tools for complex engineering tasks.
* **Long-Context Reasoning**: Provides a 1.05M-token context window and up to 128K output tokens.
* **Asynchronous Agent Workflows**: Supports async tool calls and mid-turn steering, allowing applications to supply new instructions or tool results while a response is in progress.
* **Configurable Reasoning**: Supports `low`, `medium`, `high`, `xhigh`, and `max` reasoning effort.

## Best Use Cases

* **Long-Horizon Software Engineering**: Repository-level implementation, debugging, migration, and verification tasks that require sustained context and repeated tool use.
* **Browser and Desktop Automation**: Workflows that navigate websites or professional software, interpret visual state, and complete multistep operations with human oversight.
* **Research and Scientific Analysis**: Evidence-heavy research and technical workflows that combine long-context reasoning, browsing, code execution, and document analysis.
* **Business Artifact Creation**: Creating and revising structured documents, spreadsheets, presentations, and analyses while following existing templates and user feedback.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Supports `low`, `medium`, `high`, `xhigh`, and `max` reasoning effort; `none` is not supported. |
| **Computer Use** | Supports visual understanding and computer-use workflows; production behavior depends on the application harness, tools, safeguards, and task environment. |
| **Multimodal** | Accepts text and image input and generates text output. |
| **Context Window** | 1,050,000 tokens. |
| **Max Output** | 128,000 tokens. |
| **Tool Use** | Supports function calling, Structured Outputs, web search, file search, image generation, code interpreter, hosted shell, Apply Patch, computer use, MCP, skills, and tool search through the Responses API. |
| **Knowledge Cutoff** | April 30, 2026. |

### Known Limitations

* GPT-6 Astra does not support `none` reasoning effort.
* Requests above 272K input tokens use higher rates for the entire request.
* Production safeguards and monitoring may refuse, pause, or stop some sensitive requests, including legitimate defensive-security work.

## Credits Usage

| Context | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: |
| Up to 272K input tokens | `10.00` | `12.50` | `1.00` | `50.00` | `10,000` |
| More than 272K input tokens | `20.00` | `25.00` | `2.00` | `75.00` | `10,000` |

* For requests with more than 272K input tokens, the long-context input, cache, and output rates apply to the full request.
* Web search is billed per use and is not affected by the input-token context tier.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
