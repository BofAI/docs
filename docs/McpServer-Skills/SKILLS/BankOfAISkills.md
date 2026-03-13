# BANK OF AI Skills

BANK OF AI Skills is a collection of reusable skill packages designed for AI agents. Each skill encapsulates domain knowledge (such as DEX trading, on-chain data queries, payment protocols, etc.), centered around a `SKILL.md` file that provides step-by-step instructions, executable scripts, and common usage examples — enabling agents to perform on-chain operations like a professional user.

BANK OF AI Skills support integration into OpenClaw, Claude Code, Claude Desktop, Cursor, and other MCP-compatible AI Agents. No coding is required — simply describe your task in natural language, and the agent will automatically match and execute the corresponding skill.

:::warning Security Notice — Please Read Before Using Any Skill
BankOfAI Skills can operate on **real on-chain assets**. Blockchain transactions are **irreversible** once confirmed — there is no "undo" button, no customer support rollback, and no way to recover funds sent to the wrong address. Before you begin, keep these three rules in mind:

1. **Never expose private keys in chat windows, prompts, or configuration files.** Always pass them through environment variables (e.g. `TRON_PRIVATE_KEY`, `PRIVATE_KEY`). Do not paste your private key into any AI conversation, do not hardcode it in scripts, and do not commit it to version control. If a key is accidentally exposed, rotate it immediately.
2. **Testnet first, mainnet second.** Every new operation — whether it is a swap, a transfer, or adding liquidity — must be verified on Nile or Shasta testnet before switching to mainnet. Testnet tokens have no real value, so you can experiment freely without financial risk.
3. **Write operations require manual confirmation.** The agent should display full operation details — including recipient address, token, amount, estimated fees, and slippage — and wait for your explicit confirmation before broadcasting any on-chain transaction. Never enable auto-execution for write operations.
:::


## Skills List

The following skills are currently available, covering DEX trading, on-chain data queries, payment protocols, and NFTs:

| Skill | Function | Read/Write |
| :--- | :--- | :---: |
| **x402-payment** | x402 payment skill for invoking paid agents and paid APIs on supported chains. | Read+Write |
| **ainft-skill** | Local AINFT skill for balance queries and account-related queries. | Read-only |
| **sunswap** | SunSwap DEX skill for balance queries, quotes, swaps, and liquidity workflows. | Read+Write |
| **tronscan-skill** | Comprehensive TRON blockchain data lookup via TronScan API. Supports accounts, transactions, tokens, blocks, and network-wide statistics. | Read-only |

> **Read/Write note**: `Read-only` skills never initiate on-chain transactions and are safe for beginners; `Read+Write` skills operate on real on-chain assets — always follow the safety guidelines.


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


## Usage Examples By Skill

### x402-payment
> Call this paid agent endpoint using the x402 protocol.

### ainft-skill
> Check the current AINFT balance and recent orders for this account.

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
> Look up the account info for address TXXXXXXXXXXXXXXXXXXXXXXX.

**Wallet Portfolio:**
> Show me the wallet portfolio and USD value for this address.

**Transaction Verification:**
> Check the details and status of this transaction hash.

**Token Ranking:**
> Show me the top 10 TRC20 tokens by market cap.

**Network Overview:**
> Give me a TRON network overview — transaction throughput, super representatives, and supply metrics.


## Safety Guidelines

On-chain operations are irreversible. The following are not suggestions — they are **mandatory rules**.

### Private Key Management

```
✗ Never do this:
"Use private key a]K9x...z3 to execute the swap"    → Key exposed in chat logs

✓ Correct approach:
export TRON_PRIVATE_KEY="your_private_key"           → Pass via environment variables
```

Principle: **Private keys must never appear in prompts, configuration files, or chat history.** The agent should obtain keys through environment variables or a secure key management service.

### Network Isolation

| Stage | Recommended Network | Description |
|-------|-------------------|-------------|
| First use / Learning | Nile testnet | Zero-cost experimentation |
| Feature verification | Shasta testnet | Closer to mainnet environment |
| Production use | Mainnet | Switch only after confirming everything works |

Always **explicitly declare** the network when switching, to prevent the agent from executing transactions on the wrong network:

```text
"Switch to TRON mainnet, then check my balance."
```

### DeFi Operation Safety

- **Slippage protection**: Always set slippage tolerance when executing swaps (recommended 0.5%–1%) to prevent losses from price fluctuations
- **Quote before execute**: For any swap, have the agent query a quote first and confirm the price is reasonable before executing
- **Split large trades**: Large transactions should be split into multiple smaller ones to reduce single-trade slippage risk
- **Approval management**: Regularly check token approvals (Approve) and revoke any that are no longer needed

### Operation Confirmation Checklist

For any **write operation**, the agent should confirm the following with the user before execution:

1. Operation type (Swap / Add liquidity / Transfer, etc.)
2. Tokens and amounts involved
3. Current network (testnet / mainnet)
4. Estimated Gas fees
5. Slippage settings

**Execute only after the user explicitly confirms.**


## Best Practices

### Tips for Writing Prompts

**Provide all parameters at once** to reduce guessing and follow-up questions from the agent:

```text
# Bad → Agent needs to ask multiple follow-up questions
"Help me swap some tokens."

# Good → All key information provided upfront
"Swap 100 USDT to TRX on SunSwap with 0.5% slippage on mainnet."
```

### Recommended Learning Path

```
1. Read-only queries      → Get familiar with how skills work
   ↓
2. Testnet write ops      → Verify the full workflow, zero risk
   ↓
3. Mainnet small amounts  → Confirm everything works as expected
   ↓
4. Mainnet production     → Day-to-day operations
```

### Troubleshooting

| Problem | Possible Cause | Solution |
|---------|---------------|----------|
| Agent says "skill not found" | Skill files not in the correct directory | Check installation path, refer to the installation section |
| Agent behavior doesn't match expectations | Implicit triggering matched the wrong skill | Switch to explicit invocation |
| On-chain transaction failed | Insufficient Gas / Slippage too low / Network error | Check balance, adjust slippage, confirm network |
| Large gap between quote and actual execution | Insufficient liquidity or market volatility | Reduce trade amount, or wait for the market to stabilize |