# How to Use SKILLS

Skills can be integrated into various AI Agents, such as OpenClaw, ClawdCode, and OpenCode. This guide uses OpenClaw as an example to demonstrate how to use Skills.

Before you begin, please ensure that you have installed OpenClaw, downloaded the [OpenClaw Extension](https://github.com/BofAI/openclaw-extension), and completed the basic configuration of the MCP Server according to its documentation.

## Quick Start

### 1. Browse Available Skills

Currently available skills:

- **sunswap/** - SunSwap DEX trading skill for token swaps
- **8004/** - 8004 Trusted Agent – On-chain identity and reputation system for AI agents
- **x402-payment/** - Enables agent payment functionality on blockchain networks (x402 protocol)
- **x402-payment-demo/** - x402 payment protocol demonstration

### 2. Using a Skill

Tell your AI agent:

```
Please read skills/sunswap/SKILL.md and help me check how much TRX I can get for 100 USDT
```

The AI agent will:

1. Read SKILL.md
2. Call the appropriate tools according to the instructions
3. Return the result
