# How to Use SKILLS

Skills support integration into various AI Agents such as OpenClaw, ClawdCode, and OpenCode. This document uses OpenClaw as an example to illustrate how to use skills.

Before you begin, please ensure that you have completed the installation of OpenClaw and downloaded the [OpenClaw Extension](https://github.com/BofAI/openclaw-extension), and have completed the basic configuration of the MCP Server according to its documentation.


## Compatible Platforms and Installation Guide

Agent Skills are widely supported by various AI agent platforms that support **MCP (Model Context Protocol)**.

### Compatible AI Agents
*   **ClawdCode**: A powerful AI programming assistant.
*   **OpenCode**: An open-source AI development environment.
*   **OpenClaw**: A flexible AI agent framework.
*   And all other AI platforms that support the MCP protocol.

### Quick Installation Example (using OpenClaw)
Configuration can be completed in just two simple steps:
1.  **Install an AI Agent** (e.g., OpenClaw).
2.  **Install the OpenClaw Extension**: Run the following command in your terminal:
    ```bash
    curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
    ```

### Other AI Agent Platform Configurations
If you are using platforms like ClawdCode or OpenCode:
1.  **Install your AI Agent**.
2.  **Manually configure the MCP Server** (refer to the MCP Server documentation for each platform).
3.  **Clone the skill library locally**:
    ```bash
    git clone https://github.com/BofAI/skills.git
    ```
4.  **Point your AI Agent to the skill directory**, or directly reference specific `SKILL.md` files when needed.



## Quick Start

### 1. Browse Available Skills

Currently available skills:

- **sunswap/** - SunSwap DEX trading skill, used for token exchange
- **8004/** - 8004 Trusted Agent - AI Agent's on-chain identity and reputation system
- **x402-payment/** - Enables agent payment functionality on blockchain networks (x402 protocol)
- **x402-payment-demo/** - x402 Payment Protocol Demo

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

####  How to Make the AI Use Skills Better?
*   **Provide clear context**: For example, "Use the `xxx` skill to handle the `yyy` task."
*   **Specify parameters**: If the skill requires specific information (e.g., amount, currency, date), providing it all at once in the instruction will significantly increase the success rate.
