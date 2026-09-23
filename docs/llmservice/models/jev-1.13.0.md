# JEV-1.13.0

## Overview

JEV-1.13.0 is TypeSafe AI's System One model for fast, structured decisions in software workflows. It evaluates supplied context against typed questions and returns choices, scores, and probabilities for applications to act on. Use `jev-1.13.0` to pin the stable version; `jev-latest` currently resolves to the same model.

## Key Features

* **Typed Decision Outputs**: Supports categorical selection (`Choice`), rubric-based assessment (`Score`), and yes/no probability estimation (`Noul`). Applications define the possible answers.
* **Uncertainty Signals**: Choice and Score return probability distributions and a derived confidence value for handling ambiguous cases.
* **Parallel Evaluation**: Multiple independent questions can share one state and run together, reducing sequential API calls.
* **Decision-Focused Training**: Uses Reinforcement Learning for Calibrated Decisions (RLCD) for focused semantic judgments.
* **Composable Workflow Logic**: Applications can combine judgments with explicit rules and weights while keeping final actions under code control.

## Best Use Cases

* **Request Routing and Support Triage**: Classify intent, urgency, and complexity, then route requests to software handlers, specialist models, or human reviewers.
* **RAG Passage Filtering**: Assess relevance, supporting evidence, and contradictions before passing retrieved material to a generative model.
* **Content Screening**: Evaluate messages against defined policy criteria and severity levels.
* **Tool Selection**: Choose from known functions and enumerated argument values, with application code validating and executing the selected action.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **API Interface** | Uses `POST https://api.b.ai/v1/decisions` with `state`, `model`, and `questions`. See the [API reference](../api/API.md). |
| **Model IDs** | `jev-1.13.0` is the stable version; `jev-latest` currently resolves to it. |
| **Reasoning** | Optimized for focused semantic judgments. Complex decisions should be decomposed into narrow questions and combined in code. |
| **Input Modalities** | Text only, supplied as a string, JSON object, or array. |
| **Context Limits** | 64K tokens for the state plus all questions in one request; 32K tokens for the state plus the longest individual question. |
| **Output Types** | Typed decisions rather than generated prose or code. Choice supports up to 255 options; Score accepts 2-10 ordered levels; Noul returns a value from 0 to 1. |
| **Confidence** | Choice and Score include confidence derived from their probability distributions. Noul has no separate confidence field. |
| **Tool Use** | Supports tool selection through typed questions over defined candidates. Execution and unrestricted argument extraction require application logic. |
| **Multilingual** | English is the primary training language. Other languages, including CJK text, require workload-specific validation. |

### Known Limitations

* Schema conformity does not guarantee correct judgments. Validate confidence thresholds on representative data and pin a versioned model ID when behavior must remain consistent.
* Arithmetic, counting, date comparisons, and multi-hop reasoning are unreliable. Keep exact computation in code and use narrowly scoped criteria.
* JEV does not generate free-form explanations, summaries, or code. Extraction works best when candidate values can be enumerated.

## Standard Pricing

The input price below is shown in USD per 1 million tokens. JEV does not use the cache-write, cache-read, output-token, or web-search billing fields.

| Model | Input<br/>(USD / 1M Tokens) | Cache Write<br/>(USD / 1M Tokens) | Cache Read<br/>(USD / 1M Tokens) | Output<br/>(USD / 1M Tokens) | Web Search<br/>(USD / use) |
| :--- | --------------------: | --------------------------: | -------------------------: | ---------------------: | ---: |
| **JEV-1.13.0 / JEV-Latest** | `$0.042` | - | - | - | - |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance. JEV is billed only for input tokens; the other fields above are not applicable.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::
