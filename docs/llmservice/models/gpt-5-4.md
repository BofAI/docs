## Overview

GPT-5.4 is OpenAI's flagship frontier model released on March 5, 2026, the first mainline model to unify reasoning, coding (GPT-5.3-Codex), and computer use into a single architecture. With up to 1,050,000 tokens of context and 128,000 tokens of max output, it is OpenAI's most capable and versatile model to date.

## Key Features

- **Unified Architecture**: Merges reasoning, coding, and computer use into one model — no need to switch between specialized models.
- **Configurable Reasoning Effort**: Five discrete reasoning levels (none, low, medium, high, xhigh) let developers control thinking depth and cost per query.
- **Computer Use API**: A new Computer Use API enables the model to see screens, move cursors, click elements, type text, and interact with desktop applications.
- **Tool Search**: Deferred tool loading mechanism that fetches tool definitions only when needed, reducing total token usage by 47% while maintaining the same accuracy.
- **1M+ Context Window**: Supports up to 1,050,000 tokens of context (922K input + 128K output), enabling analysis of entire codebases or document collections in a single request.

## Best Use Cases

- **Agentic Coding Assistants**: Scores 57.7% on SWE-Bench Pro, ideal for complex multi-step coding tasks and autonomous code repair.
- **Desktop Automation & RPA**: OSWorld score of 75% surpasses the human expert baseline of 72.4%, suitable for browser navigation, form filling, and desktop application control.
- **Knowledge-Intensive Work**: GDPval score of 83% with 33% fewer factual errors per claim than GPT-5.2, ideal for research analysis, document processing, and professional Q&A.
- **Long-Context Analysis**: The 1M token context window is perfect for legal document review, large-scale code audits, and cross-document correlation analysis.

## Capabilities and Limitations

| Capability | Detailed Description |
| :--- | :--- |
| **Reasoning Ability** | SWE-Bench Pro 57.7%, SWE-Bench Verified ~80%, high GPQA Diamond scores, with five configurable reasoning levels. |
| **Creative Ability** | Excellent long-form text and code generation with 128K max output supporting whole-project generation. |
| **Multimodal Ability** | Supports text and image input with text output; MMMU Pro score of 81.2%. |
| **Response Speed** | As a flagship model, moderate inference speed; higher latency in xhigh reasoning mode, near real-time in none mode. |
| **Context Window** | Standard 272K tokens; expandable to 1,050,000 tokens (requires explicit configuration). |
| **Max Output** | 128,000 tokens |
| **Knowledge Cutoff** | August 31, 2025 |

## Credits and Pricing

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
| :--- | :--- | :--- |
| GPT-5.4 | $2.50 | $15.00 |
