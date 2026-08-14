# GLM-5.3

## Overview

GLM-5.3 is a text foundation model released by Z.AI on August 14, 2026 for complex coding, long-horizon agent tasks, and cybersecurity work. It uses the same base model as GLM-5.2; Z.AI attributes the update's gains to scaled post-training across more environments, more diverse tasks, and longer trajectories.

:::note 🎁 Limited-time offer: GLM-5.3 at 10% off
Offer starts August 14, 2026.

**Eligibility:** This offer applies to GLM-5.3 requests made through the B.AI API and B.AI web app.

For a limited time, eligible requests are billed at 90% of the standard reference price: Input `1.26`, Cache Write `1.26`, Cache Read `0.234`, and Output `3.96` Credits/Token.

This page continues to show standard reference prices. Offer end time, eligibility, actual settlement prices, and final billing are subject to the platform display.
:::

## Key Features

* **Scaled Post-Training**: Retains the GLM-5.2 base model while expanding reinforcement-learning environments, task diversity, and training compute for long-horizon professional workflows.
* **Configurable Always-On Reasoning**: Supports `low`, `high`, and `max` reasoning effort, with `max` as the default. Native GLM-5.3 requests require thinking to remain enabled.
* **Coding and Agent Performance**: Z.AI reports 28.3 on Terminal-Bench 3.0, 66.9 on DeepSWE v1.1, 78.1 on FrontierSWE, and 48.2 on AutomationBench v1.0.6.
* **Cybersecurity Evaluation**: Z.AI reports 84.5 on CyberGym, 54.4 on ExploitBench, and 105/130 completed ExploitGym tasks under normalized two-hour/six-hour budgets.
* **1M-Token Coding Workflows**: The GLM Coding Plan supports a 1M-token context. Claude Code users enable it with the `glm-5.3[1m]` model name and a 1,000,000-token auto-compaction window.

## Best Use Cases

* **Complex Software Engineering**: Repository-scale implementation, debugging, performance optimization, and test-fix-verify loops that require sustained work across many files and tools.
* **Long-Horizon Coding Agents**: ZCode, Claude Code, Codex, OpenCode, Cline, and other configurable agents that can use Z.AI's Anthropic-compatible or OpenAI-compatible Coding Plan endpoints.
* **Authorized Security Research**: Vulnerability discovery, validation, and exploit-chain analysis in systems the operator is permitted to test.
* **Tool-Driven Professional Workflows**: Multi-step engineering and research tasks with executable environments, objective verification, and iterative feedback.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | Thinking is always enabled. `reasoning_effort` supports `low`, `high`, and `max`; the default is `max`, which Z.AI recommends for coding tasks. |
| **Creative Writing** | General text generation is available. |
| **Coding** | Z.AI reports Terminal-Bench 2.1: 88.2, Terminal-Bench 3.0: 28.3, DeepSWE v1.1: 66.9, NL2Repo: 58.0, FrontierSWE: 78.1, and SWE-Marathon v1.1: 42.5. |
| **Multimodal** | Text input and text output. |
| **Response Speed** | Not published as a guaranteed API rate. |
| **Context Window** | Up to 1M tokens in GLM Coding Plan workflows. Claude Code requires the `glm-5.3[1m]` suffix to enable the 1M-token mode. |
| **Max Output** | Not published as a general API limit. |
| **Tool Use** | Designed and evaluated in tool-using coding-agent harnesses; available to Coding Plan users through ZCode and configurable Anthropic-compatible or OpenAI-compatible agents. |
| **Multilingual** | Natural-language prompting is supported. |

### Known Limitations

* Native GLM-5.3 API requests do not support `thinking.type: "disabled"`; applications must enable thinking and can choose `reasoning_effort: "low"` for lighter reasoning. The Coding Plan compatibility layer may automatically map disabled thinking to `low`.
* The model is text-only; image, audio, and video inputs are not advertised for GLM-5.3.

## Credits Usage

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) | Billing Notes |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: | :--- |
| **GLM-5.3** | `1.40` | `1.40` | `0.26` | `4.40` | `-` | - |

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
