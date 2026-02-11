# Introduction

AI Agent Skills Library – Reusable Capability Modules for AI Agents

## What is a Skill?

A **Skill** is a document containing detailed instructions that teach an AI agent how to complete a specific task.

**Analogy**: It is like providing the AI with an "operation manual" that tells it how to use tools to accomplish a job.

```
User: "Help me swap USDT to TRX"
↓
AI agent reads the SunSwap skill
↓
AI agent follows the instructions in SKILL.md
↓
Calls mcp-server tools
↓
Completes the DEX transaction
```

## Quick Start

### 1. Browse Available Skills

Currently available skills:

* **sunswap/** - SunSwap DEX trading skill for token swaps
* **8004/** - 8004 Trusted Agent – On-chain identity and reputation system for AI agents
* **x402_payment/** - Enables agent payment functionality on blockchain networks (x402 protocol)
* **x402_payment_demo/** - x402 payment protocol demonstration

### 2. Using a Skill

Tell your AI agent:

```
Please read skills/sunswap/SKILL.md and help me check how much TRX I can get for 100 USDT
```


The AI agent will:

1. Read SKILL.md  
2. Call the appropriate tools according to the instructions  
3. Return the result  

## Repository Structure

```
skills/
├── README.md # This file - Overview
├── LICENSE # MIT License
├── CONTRIBUTING.md # Contribution Guide
├── AGENTS.md # Developer Guide (How to create new skills)
├── sunswap/ # SunSwap DEX trading skill
│ ├── README.md # Skill description
│ ├── SKILL.md # Main instruction file (AI agent reads this file)
│ ├── examples/ # Usage examples
│ ├── resources/ # Configuration files (contract addresses, token lists, etc.)
│ └── scripts/ # Helper scripts
├── 8004/ # 8004 Trusted Agent skill
│ ├── README.md # Skill description
│ ├── SKILL.md # Main instruction file
│ ├── lib/ # Contract ABIs and configuration
│ ├── scripts/ # Node.js scripts for agent operations
│ ├── templates/ # Registration templates
│ └── examples/ # Usage examples
└── x402_payment/ # x402 payment protocol skill
├── SKILL.md # Main instruction file
└── dist/ # Compiled utility scripts
```