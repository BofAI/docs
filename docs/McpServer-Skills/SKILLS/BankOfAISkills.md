# BANK Of AI Skills

Each BANK Of AI Skill encapsulates domain knowledge (e.g., how to use SunSwap DEX), provides step-by-step instructions for agents, and includes examples showing common usage patterns.

BANK Of AI Skills support integration into OpenClaw, Claude Code, Claude Desktop, Cursor, and other MCP-compatible AI Agents.


## Quick Start

This section uses `OpenClaw + OpenClaw Extension` as example.

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

You should see entries such as `sunswap`, `x402-payment`, `x402-payment-demo`, `ainft-skill`, `tronscan-skill`, etc.

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

### OpenClaw

OpenClaw provides the most integrated experience, automatically wiring skills and MCP dependencies.

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

### Claude Code

1.  Clone the repository:
    ```bash
    git clone https://github.com/BofAI/skills.git /tmp/bofai-skills
    ```
2.  Copy the skills to your Claude Code configuration directory for automatic discovery:
    ```bash
    mkdir -p ~/.config/claude-code/skills
    cp -r /tmp/bofai-skills/* ~/.config/claude-code/skills/
    ```
3.  Claude Code will now automatically load these skills upon startup.

### Cursor

1.  Clone the repository into your project's root:
    ```bash
    git clone https://github.com/BofAI/skills.git .cursor/skills
    ```
2.  For project-wide availability, add the skill path to your `.cursorrules` or reference the specific `SKILL.md` file using the `@` symbol in Cursor Chat to provide the necessary context.



## Skills List

| Skill | Function |
| :--- | :--- |
| **sunswap** | SunSwap DEX skill for balance queries, quotes, swaps, and liquidity workflows. |
| **x402-payment** | x402 payment skill for invoking paid agents and paid APIs on supported chains. |
| **x402-payment-demo** | Demo workflow for end-to-end x402 protected resource access. |
| **ainft-skill** | Local AINFT skill for balance queries and account-related queries. |
| **tronscan-skill** | Comprehensive TRON blockchain data lookup via TronScan API. Supports accounts, transactions, tokens, blocks, and network-wide statistics. |


## Usage Examples By Skill

### sunswap

**Balance Query:**
> Check my TRX and USDT balance on SunSwap.

**Price Query:**
> What is the current price of TRX?

**Swap Quote:**
> How much TRX can I get for 100 USDT on SunSwap?

**Execute Swap:**
> Swap 100 TRX to USDT on SunSwap.

**Liquidity:**
> Add liquidity with 100 TRX and 15 USDT to the V2 pool on SunSwap.

### tronscan-skill

**Account Lookup:**
> Look up the account info for address TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf.

**Wallet Portfolio:**
> Show me the wallet portfolio and USD value for this address.

**Transaction Verification:**
> Check the details and status of this transaction hash.

**Token Ranking:**
> Show me the top 10 TRC20 tokens by market cap.

**Network Overview:**
> Give me a TRON network overview — transaction throughput, super representatives, and supply metrics.

### x402-payment
> Read the x402-payment skill and call this paid agent endpoint using x402.

### x402-payment-demo
> Read the x402-payment-demo skill and run a demo x402 payment flow end to end.

### ainft-skill
> Read the ainft-skill and check the current AINFT balance and recent orders for this account.


## Security Notes

*   **Never hardcode private keys** in prompts or configurations. Always use environment variables.
*   **Testnet vs Mainnet**: Pay attention to the network environment. It is recommended to test on testnet first before switching to mainnet.
*   **Slippage protection**: For DeFi-related skills (such as swaps), always set appropriate slippage tolerance to prevent losses from price fluctuations.
