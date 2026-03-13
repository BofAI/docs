# How to Use SKILLS

A **Skill** is a reusable capability that AI agents can use to accomplish specific tasks. Each skill encapsulates domain knowledge (e.g., how to use SunSwap DEX), provides step-by-step instructions for agents, and includes examples showing common usage patterns.

Skills support integration into OpenClaw, Claude Code, Claude Desktop, Cursor, and other MCP-compatible AI Agents.


## Quick Start

This section uses `OpenClaw + OpenClaw Extension` as example, which is the primary installation path.

### 1. Installation

Install the [OpenClaw Extension](https://github.com/BofAI/openclaw-extension), which installs the integration layer, connects MCP servers, and installs skills from the repository.

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

If you prefer to inspect the installer before running it:

```bash
git clone https://github.com/BofAI/openclaw-extension.git
cd openclaw-extension
./install.sh
```

### 2. Verification

After installation, verify that the skills repository is available and that your agent can read a skill.

Check the local skills directory:

```bash
ls ~/.openclaw/skills
```

You should see entries such as `sunswap`, `x402-payment`, `x402-payment-demo`, `ainft-skill`, etc.

Then verify in OpenClaw by asking a direct prompt:

```text
Read the sunswap skill and tell me what this skill can do.
```

### 3. First Use

Start with a narrow, read-only workflow. There are two ways to invoke a skill:

**Explicit Invocation** — Tell the agent exactly which skill file to read. Use this when you already know the target skill or want deterministic behavior:

```text
Read the sunswap skill and help me check how much TRX I can get for 100 USDT on SunSwap right now.
```

**Implicit Triggering** — Describe the task and let the agent match the appropriate skill automatically. Use this when skills are already installed and the request clearly maps to one workflow:

```text
Check how much TRX 100 USDT can swap to on SunSwap right now.
```

:::tip Usage Tips
*   **Provide clear context**: For example, "Use the `xxx` skill to handle the `yyy` task."
*   **Specify parameters**: If the skill requires specific information (e.g., amount, currency, date), providing it all at once will significantly increase the success rate.
*   **Start with read-only operations**: For first-time use, start with query-type operations (such as balance queries, price quotes) to get familiar with how skills work before trying write operations (such as swaps, transfers).
:::


## Installation on Other Platforms

If you are not using OpenClaw, the common pattern is:

1.  Install or configure the AI agent.
2.  Configure the required MCP servers for your workflow.
3.  Clone the skills repository locally.
4.  Let the agent read the target `SKILL.md`.

If a platform does not support a dedicated skills directory, explicitly reference the `SKILL.md` file in your prompt.

### Claude Code

```bash
git clone https://github.com/BofAI/skills.git ~/.bofai/skills
```

Then use explicit prompts that point to a skill file:

```text
Please read ~/.bofai/skills/skills/sunswap/SKILL.md and check how much TRX I can get for 100 USDT.
```

### Claude Desktop

Clone the repository:

```bash
git clone https://github.com/BofAI/skills.git ~/.bofai/skills
```

Usage pattern:
*   Configure MCP servers in the platform's local integration entry.
*   Keep this repository on disk.
*   Explicitly tell the agent which `SKILL.md` to read.

```text
Please read ~/.bofai/skills/skills/sunswap/SKILL.md and check how much TRX I can get for 100 USDT.
```

### Cursor

```bash
git clone https://github.com/BofAI/skills.git ~/.bofai/skills
```

Then either point Cursor to the local skill file in chat, or open the repository and ask it to read `skills/<skill-name>/SKILL.md`:

```text
Please read skills/x402-payment/SKILL.md and explain the required environment variables.
```

### Manual Installation (Generic)

For any MCP-compatible platform without a dedicated installer:

```bash
git clone https://github.com/BofAI/skills.git ~/.bofai/skills
```

Then:
1.  Configure the required MCP servers yourself.
2.  Point the platform to `~/.bofai/skills/skills` if it supports a skills directory.
3.  Otherwise, reference `SKILL.md` files directly in prompts.



## Skills List

| Skill | Function |
| :--- | :--- |
| **sunswap** | SunSwap DEX skill for balance queries, quotes, swaps, and liquidity workflows. |
| **x402-payment** | x402 payment skill for invoking paid agents and paid APIs on supported chains. |
| **x402-payment-demo** | Demo workflow for end-to-end x402 protected resource access. |
| **ainft-skill** | Local AINFT skill for balance queries and account-related queries. |


## Usage Examples By Skill

#### sunswap
> Please read `skills/sunswap/SKILL.md` and check how much TRX I can get for 100 USDT on SunSwap.

#### x402-payment
> Please read `skills/x402-payment/SKILL.md` and call this paid agent endpoint using x402.

#### x402-payment-demo
> Please read `skills/x402-payment-demo/SKILL.md` and run a demo x402 payment flow end to end.

#### ainft-skill
> Please read `skills/ainft-skill/SKILL.md` and check the current AINFT balance and recent orders for this account.


## Security Notes

*   **Never hardcode private keys** in prompts or configurations. Always use environment variables.
*   **Testnet vs Mainnet**: Pay attention to the network environment. It is recommended to test on testnet first before switching to mainnet.
*   **Slippage protection**: For DeFi-related skills (such as swaps), always set appropriate slippage tolerance to prevent losses from price fluctuations.
*   **Verify gas/fee requirements**: Ensure the account has sufficient TRX or native tokens for transaction fees.
