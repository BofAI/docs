# How to Use SKILLS

Skills support integration into various AI Agents such as OpenClaw, ClawdCode, and OpenCode. This document uses OpenClaw as an example to illustrate how to use skills.

Before you begin, please ensure that you have completed the installation of OpenClaw and downloaded the [OpenClaw Extension](https://github.com/BofAI/openclaw-extension), and have completed the basic configuration of the MCP Server according to its documentation.


## Installation

### Option 1: OpenClaw Extension (Recommended)

If you use OpenClaw, the fastest way is to install the OpenClaw extension:

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

The extension helps with:
*   Cloning the skills repository.
*   Setting up common MCP servers.
*   Configuring supported skills.

### Option 2: Manual Installation

For ClawdCode, OpenCode, or any other MCP-compatible platform:

1.  Install your AI agent platform.
2.  Configure the MCP servers required for your workflows.
3.  Clone this repository.
4.  Point your agent to the `skills/` directory, or directly reference specific `SKILL.md` files.

```bash
git clone https://github.com/BofAI/skills.git
cd skills/skills
```



## Quick Start

### 1. Browse Available Skills

Currently available skills:

- **sunswap/** - SunSwap DEX skill for balance queries, quotes, swaps, and liquidity workflows.
- **8004-skill/** - ERC-8004 skill for on-chain agent identity, trust, verification, and registration workflows.
- **x402-payment/** - x402 payment skill for invoking paid agents and paid APIs on supported chains.
- **x402-payment-demo/** - Demo workflow for end-to-end x402 protected resource access.
- **ainft-skill/** - Local AINFT skill for balance queries and account-related queries.

### 2. How to Use a Skill?

Using skills is very simple; you don't need to write complex code, just give instructions as you would in a normal conversation.

#### Method One: Explicit Instruction
If you know the path to a skill, you can directly tell the AI to read and execute it. This is very efficient for debugging or performing specific tasks.

**Example: SunSwap Exchange Query**
You just need to tell the AI:
> "Please read `skills/sunswap/SKILL.md` and help me check how much TRX 100 USDT can be exchanged for."

**Upon receiving the instruction, the AI will immediately:**
1.  **Precise Positioning**: Skip searching and directly open the specified `SKILL.md`.
2.  **Rule Internalization**: Understand SunSwap's API calling logic and exchange formula.
3.  **Automated Execution**: Call background scripts to query real-time exchange rates.
4.  **Result Delivery**: Tell you "100 USDT can currently be exchanged for approximately XXX TRX."

#### Method Two: Implicit Trigger
If you have already installed the relevant skill package, you don't even need to mention the word "skill"; the AI will automatically activate it based on your intent.

**Example: SunSwap Exchange Query**
You just need to tell the AI:
> "Help me check how much TRX 100 USDT can be exchanged for on SunSwap right now."

**The AI's internal actions:**
*   **Intent Recognition**: The AI captures keywords like "SunSwap," "exchange," "USDT/TRX."
*   **Automatic Matching**: The AI scans the "card catalog" and finds that the description of the `sunswap` skill perfectly matches.
*   **Seamless Activation**: Automatically loads `skills/sunswap/SKILL.md` in the background and executes the query script.
*   **Intelligent Reply**: Directly provides the result.

#### How to Make the AI Use Skills Better?
*   **Provide clear context**: For example, "Use the `xxx` skill to handle the `yyy` task."
*   **Specify parameters**: If the skill requires specific information (e.g., amount, currency, date), providing it all at once in the instruction will significantly increase the success rate.


### 3. Usage Examples By Skill

#### sunswap
> Please read `skills/sunswap/SKILL.md` and check how much TRX I can get for 100 USDT on SunSwap.

#### 8004-skill
> Please read `skills/8004-skill/SKILL.md` and look up the on-chain registration details for agent 1:8 on TRON mainnet.

#### x402-payment
> Please read `skills/x402-payment/SKILL.md` and call this paid agent endpoint using x402.

#### x402-payment-demo
> Please read `skills/x402-payment-demo/SKILL.md` and run a demo x402 payment flow end to end.

#### ainft-skill
> Please read `skills/ainft-skill/SKILL.md` and check the current AINFT balance and recent orders for this account.
