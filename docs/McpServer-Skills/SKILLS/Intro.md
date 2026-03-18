# What Are Skills?

You may have already used MCP Server to let an AI assistant check balances, send transfers, and invoke contracts. But you'll notice that some tasks aren't "call a tool once and done" — for example, swapping tokens on a DEX requires checking your balance first, getting a quote, approving the transaction, then executing the swap. Each step involves decision-making and parameter handling.

**Skills exist precisely for this kind of multi-step task.**

A Skill is a "task handbook" — it's not a tool itself, but rather instructions that tell the AI how to combine a series of tools in the correct order with the correct parameters to complete a full business workflow.

---

## The Difference Between Skills and MCP Server

Many people ask this question when first encountering Skills: what's the difference from MCP Server?

| | MCP Server | Skill |
| :--- | :--- | :--- |
| **Essence** | Tool service | Task handbook + script collection |
| **Purpose** | Provide AI with **atomic capabilities to get things done** | Teach AI **how to combine capabilities to complete a task** |
| **Example** | `mcp-server-tron` provides the `send_trx` tool | `sunswap` tells AI how to use multiple tools to execute a DEX swap |
| **Analogy** | Kitchen knives, pots, and stoves | A recipe |

Simply put: **MCP Server is a toolbox, Skill is an instruction manual.** A Skill tells the AI which drawer to open, which tool to grab, and what steps to follow to complete the task.

---

## What Does a Skill Look Like?

A Skill is a folder with a very simple structure:

| File/Directory | Purpose | Required? |
| :--- | :--- | :--- |
| `SKILL.md` | Core instruction document — where AI learns how to execute the task | **Yes** |
| `scripts/` | Executable scripts — AI calls these to perform specific operations | Optional |
| `resources/` | Reference data — contract addresses, token lists, config files, etc. | Optional |
| `package.json` | npm dependency declaration (required if the Skill has scripts) | Optional |

The top of `SKILL.md` contains YAML Frontmatter that declares basic information about the Skill:

```yaml
---
name: SunSwap DEX Trading
description: Execute token swaps on SunSwap DEX for TRON blockchain using automated scripts.
version: 2.0.0
dependencies:
  - node >= 18.0.0
  - tronweb
tags:
  - defi
  - dex
  - swap
  - tron
---

# SunSwap DEX Trading Skill

## 🚀 Quick Start
...(specific operation instructions)
```

The `name` and `description` fields are key for AI to identify and match skills — the more accurate they are, the more easily the AI can find them at the right moment. The main content is the specific operation instructions with no format restrictions — it can be text explanations, code examples, parameter tables, or anything that helps the AI understand.

---

## Why Not Just Give All Instructions Directly to the AI?

The key question for understanding Skills design: if we just tell the AI how to operate, why not just say it in the conversation?

This approach has two fundamental problems:

**Context window is limited and expensive.** If we stuff the complete content of all Skills into every conversation, the instructions alone would consume huge amounts of tokens, making the AI slower and dramatically increasing costs per conversation.

**Scattered attention.** When the AI faces detailed explanations for dozens of Skills, it struggles to focus on the current task and easily confuses rules and parameters across different skills, leading to errors.

Skills solve this with **three-tier progressive loading** — only loading what's needed when it's needed.

---

## Three-Tier Progressive Loading

Think of Skills as a library's retrieval system:

**Tier 1: Shelf Index (ultra-lightweight)**

When starting up, the system only exposes to the AI the `name` and `description` of all Skills — like labels on shelves. These "index cards" are tiny, so loading even hundreds of Skills at once creates no burden. Through this tier, the AI decides "which skill do I need for this task?"

**Tier 2: Operation Manual (loaded on demand)**

Only when the AI confirms it needs a particular Skill does it read the complete `SKILL.md` content. This step triggers only when a skill is matched, providing the AI with specific execution steps, parameter requirements, edge conditions, and common error handling.

**Tier 3: Tool Execution (real-time invocation)**

Only when the task execution reaches a point requiring actual operations (like querying on-chain balance, executing a swap), the AI calls the corresponding script or MCP tool to do the substantive work, then returns the result to the conversation.

This design lets the system manage large numbers of Skills while maintaining low latency and high accuracy.

---

## How Does the AI Find and Use a Skill?

The AI selects and executes a Skill in four steps:

**Step 1: Intent Recognition**

You send a request (e.g., "Help me swap 100 USDT for TRX on SunSwap"), the AI parses the intent, scans the descriptions of all mounted Skills, and finds the best match.

**Step 2: Rule Internalization**

The AI reads the Skill's `SKILL.md`, understanding the execution steps, parameter formats, network selection, and security constraints.

**Step 3: Tool Execution**

Following the manual's guidance, the AI proceeds step by step — calling scripts to check balance, get quotes, verify approvals, execute the swap — waiting for your confirmation at critical points.

**Step 4: Result Feedback**

After completion, the AI presents results in an easy-to-read format. When information is missing or execution fails, it asks proactively.

---

## Two Ways to Invoke Skills

You can trigger a Skill in two ways:

**Explicit Invocation** — directly tell the AI which Skill to read, suitable for scenarios requiring deterministic behavior:

```
Read the sunswap skill and help me check how much TRX I can get for 100 USDT on SunSwap.
```

**Implicit Triggering** — describe the task and let the AI auto-match, suitable for everyday conversation:

```
Check how much TRX I can get for 100 USDT on SunSwap right now.
```

The difference lies in control: explicit invocation ensures the AI uses the Skill you specified; implicit triggering is more natural but if the description isn't clear enough, the AI might match the wrong Skill. When execution doesn't meet expectations, switching to explicit invocation usually solves the problem.

---

## Next Steps

- Want to know what Skills BANK OF AI provides? → [BANK OF AI Skills](./BANKOFAISkill.md)
- Have questions? → [FAQ](./Faq.md)
