# Muse Spark 1.3

## Overview

Muse Spark 1.3 is a proprietary agentic and coding model from Meta Superintelligence Labs, released on September 2, 2026. Meta makes it available through Muse Code and Meta Model API and positions the update for longer-horizon work, stronger instruction retention, improved multitasking, and more efficient coding-agent execution.

## Key Features

- **Long-Horizon Agent Work**: Designed to build context with tools, identify gaps in its plan, retain learned information, and complete open-ended objectives across extended workflows.
- **Collaborative Control**: Trained to ask clarifying questions when instructions are ambiguous, request help when blocked, and confirm before consequential actions.
- **Multi-Workflow Tracking**: Improved at mapping new prompts to the correct task in long, interrupted, or mixed-purpose threads without dropping earlier requirements.
- **Coding Efficiency**: In comparisons run by Meta engineers, the model used about 20% fewer tool calls and 25% fewer tokens than Muse Spark 1.2 while producing cleaner, less verbose code.
- **Improved Safety Calibration**: Meta reports stronger resistance to prompt injection and better judgment around irreversible actions in agentic workflows.

## Best Use Cases

- **Long-Running Coding Agents**: Feature implementation, debugging, codebase analysis, and other engineering tasks that need iterative tools and sustained instruction following.
- **Complex Deliverable Workflows**: Producing reports, presentations, analyses, or other artifacts from multiple files and conflicting source materials.
- **Research and Automation Agents**: Workflows that gather their own context, revise plans, and combine browsing or business-automation tools.
- **Multi-Task Collaboration**: Persistent assistant threads where users interrupt, redirect, or resume several related workstreams.

## Capabilities and Limitations

| Capability | Description |
| :--- | :--- |
| **Reasoning** | The reasoning modes available before 1.3 remained available at launch. Meta said `max` reasoning would follow after additional safety testing; the public announcement does not enumerate the other API mode names. |
| **Coding** | Trained on longer-horizon coding tasks. Meta reports roughly 20% fewer tool calls and 25% fewer tokens than Muse Spark 1.2 in internal engineering comparisons. |
| **Agentic Workflows** | Uses tools to gather context, revises plans, tracks learning across long tasks, asks for clarification, and is trained to confirm consequential actions. |
| **Multimodal** | Meta's launch demonstrations cover workflows involving documents, spreadsheets, CAD data, audio, and presentations. |
| **Context Window** | 1M tokens. |
| **Max Output** | 131,000 tokens. |

### Known Limitations

- `max` reasoning was used for Meta's published Muse Spark 1.3 evaluations but was not available to API users at launch; Meta said it would ship after additional safety testing.
- Improved self-awareness and safety calibration do not guarantee correct outputs or safe autonomous execution; applications still need approval gates for consequential actions.

## Pricing

| Model | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) |
| :--- | ---: | ---: | ---: | ---: |
| Muse Spark 1.3 | 1.25 | 1.25 | 0.15 | 4.25 |
