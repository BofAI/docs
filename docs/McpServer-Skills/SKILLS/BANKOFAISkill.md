# BANK OF AI Skills

BANK OF AI Skills is a set of reusable skill packages designed for AI agents. Each skill encapsulates knowledge in a specific domain (e.g., DEX trading, on-chain data querying, payment protocols, etc.), with `SKILL.md` as its core, providing agents with step-by-step operational guidance, executable scripts, and examples of common usage patterns, enabling agents to perform on-chain operations like professional users.

BANK OF AI Skills supports integration with MCP-compatible AI Agents such as OpenClaw, Claude Code, Claude Desktop, and Cursor. You don't need to write code; simply describe the task in natural language, and the agent will automatically match and execute the corresponding skill.

:::warning Security Pre-declaration — Please read before using any Skill
BankOfAI Skills can operate on **real on-chain assets**. Once a blockchain transaction is on-chain, it is **irreversible**. There is no "undo" button, no customer service rollback, and funds sent to the wrong address cannot be recovered. Before you begin, please keep these three iron rules in mind:

1. **Private keys should never appear in chat windows, prompts, or configuration files.** Only pass them through environment variables (e.g., `TRON_PRIVATE_KEY`, `PRIVATE_KEY`). Do not paste private keys into any AI conversation, do not hardcode them in scripts, and certainly do not commit them to version control systems. If a private key is accidentally leaked, replace it immediately.
2. **Testnet first, then Mainnet.** Every new operation—whether it's swapping, transferring, or adding liquidity—must first be verified on the Nile or Shasta testnets before being executed on the mainnet. Testnet tokens have no real value, so you can experiment with confidence without any economic loss.
3. **Write operations must be manually confirmed.** Before executing any on-chain transaction, the Agent should show you the complete operation details—including recipient address, token type, amount, estimated fees, and slippage—and wait for your explicit confirmation before broadcasting the transaction. Never enable automatic execution for write operations.
:::


## Skill List

Below are the currently available skills, covering scenarios such as DEX trading, on-chain data querying, payment protocols, and NFTs:

| SKILL | Function | 
| :--- | :--- | 
| **x402-payment** | x402 payment skill, used to call paid agents and paid APIs on supported chains. | 
| **sunswap** | SunSwap DEX skill, used for balance queries, quotes, swaps, and liquidity-related workflows. | 
| **tronscan-skill** | TRON blockchain data query via TronScan API, supporting accounts, transactions, tokens, blocks, and network statistics. | 


## Quick Start

Taking `OpenClaw + OpenClaw Extension` as an example.

### 1. Installation

Install [OpenClaw Extension](https://github.com/BofAI/openclaw-extension), which automatically installs the integration layer, connects to the MCP server, and installs the skill repository.

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

If you want to inspect the installation script before running:

```bash
git clone https://github.com/BofAI/openclaw-extension.git
cd openclaw-extension
./install.sh
```

### 2. Verification

After installation, verify that the skill repository is available.

Check the local skill directory:

```bash
ls ~/.openclaw/skills
```

You should see entries like `sunswap`, `x402-payment`, `x402-payment-demo`, `tronscan-skill`.

Then verify in OpenClaw with a prompt:

```text
Read the sunswap skill and tell me what this skill can do.
```

### 3. First Use

Start with a simple read-only workflow. There are two ways to call a skill:

**Explicit Call** — Directly tell the agent which skill file to read. Suitable when you know the target skill or need deterministic behavior:

```text
Read the sunswap skill and help me check how much TRX 100 USDT can swap for on SunSwap.
```

**Implicit Trigger** — Describe the task and let the agent automatically match and activate the corresponding skill. Suitable when the skill is installed and the request clearly corresponds to a workflow:

```text
Help me check how much TRX 100 USDT can swap for on SunSwap right now.
```

:::tip Usage Tips
*   **Provide clear context**: For example, "Use `xxx` skill to handle `yyy` task."
*   **Specify parameters**: If the skill requires specific information (e.g., amount, currency, date), providing all of it at once in the instruction can significantly increase the success rate.
*   **Start with read-only operations**: For first-time use, it is recommended to start with query-type operations (e.g., balance inquiry, price quote) to familiarize yourself with how the skill works before attempting write operations (e.g., swaps, transfers).
:::


## Other Platform Installations

### OpenClaw

OpenClaw provides the most complete integration experience, automatically connecting skills and MCP dependencies.

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

### Claude Code

1.  Clone the repository:
    ```bash
    git clone https://github.com/BofAI/skills.git /tmp/bofai-skills
    ```
2.  Copy the skills to the Claude Code configuration directory for automatic discovery:
    ```bash
    mkdir -p ~/.config/claude-code/skills
    cp -r /tmp/bofai-skills/* ~/.config/claude-code/skills/
    ```
3.  Claude Code will automatically load these skills upon startup.

### Cursor

1.  Clone the repository to the project root directory:
    ```bash
    git clone https://github.com/BofAI/skills.git .cursor/skills
    ```
2.  To make skills available project-wide, you can add the skill path to `.cursorrules`, or use the `@` symbol in Cursor Chat to reference specific `SKILL.md` files to provide context.




## Skill Usage Examples

### Operation Type Description

- 🟢 **Read** — Read-only query, no on-chain transactions will occur  
- ⚠️ **Write** — Will initiate on-chain transactions (requires user confirmation)

---

### x402-payment

**Call Paid Endpoint (⚠️ Write):**
> Use the x402 protocol to call this paid agent endpoint.

---

### sunswap

**Balance Query (🟢 Read):**
> Help me check my TRX and USDT balances on SunSwap.

**Price Query (🟢 Read):**
> What is the current price of TRX?

**Swap Quote (🟢 Read):**
> How much TRX can 100 USDT swap for on SunSwap?

**Execute Swap (⚠️ Write):**
> Swap 100 TRX for USDT on SunSwap.

**Liquidity Operations (⚠️ Write):**
> Add 100 TRX and 15 USDT liquidity to the SunSwap V2 pool.

---

### tronscan-skill

**Account Query (🟢 Read):**
> Help me query the account information for address TXXXXXXXXXXXXXXXXXXXXXXX.

**Wallet Portfolio (🟢 Read):**
> Show the wallet portfolio and USD valuation for this address.

**Transaction Verification (🟢 Read):**
> Query the details and execution status of this transaction hash.

**Token Ranking (🟢 Read):**
> Show the top 10 TRC20 tokens by market capitalization.

**Network Overview (🟢 Read):**
> Give me a TRON network overview — transaction throughput, super representatives, and supply metrics.

## Security Guidelines

On-chain operations are irreversible. The following are not suggestions, but **rules that must be followed**.

### Private Key Management

```
✗ Never do this:
"Help me execute a swap with private key a]K9x...z3"    → Private key exposed in chat history/logs

✓ Correct practice:
export TRON_PRIVATE_KEY="Your private key"    → Pass via environment variables
```

Principle: **Private keys must never appear anywhere in prompts, configuration files, or chat logs.** Agents should obtain them through environment variables or secure key management services.

### Network Environment Isolation

| Operation Phase | Recommended Network | Description |
|---------|---------|------|
| First Use/Learning | Nile Testnet | Zero-cost trial and error, play around freely |
| Feature Verification | Shasta Testnet | Closer to mainnet environment |
| Formal Operation | Mainnet | Switch only after confirming everything is correct |

When switching networks, always **explicitly declare** to avoid the Agent executing transactions on the wrong network:

```text
"Switch to TRON Mainnet, then help me check the balance."
```

### DeFi Operation Security

- **Slippage Protection**: When executing a Swap, always set a slippage tolerance (recommended 0.5%–1%) to prevent losses due to price fluctuations.
- **Quote First, then Execute**: For any swap operation, first let the Agent query for a quote, and only execute after confirming the price is reasonable.
- **Large Amount Splitting**: For large transactions, it is recommended to split them into multiple smaller executions to reduce the risk of slippage for a single transaction.
- **Authorization Management**: Regularly check token authorizations (Approve) and revoke authorizations that are no longer in use.

### Operation Confirmation Checklist

For any **write operation**, the Agent should confirm the following information with the user before execution:

1. Operation type (Swap / Add Liquidity / Transfer, etc.)
2. Involved tokens and amounts
3. Current network (Testnet / Mainnet)
4. Estimated Gas fees
5. Slippage settings

**Execute only after explicit user confirmation.**


## Best Practices

### Tips for Giving Instructions

**Provide all parameters at once** to reduce agent guessing and follow-up questions:

```text
# Bad → Agent needs to ask repeatedly
"Help me swap some tokens."

# Good → All key information in one go
"Swap 100 USDT for TRX on SunSwap, set slippage to 0.5%, use Mainnet."
```

### Recommended Learning Path

```
1. Read-only queries        → Familiarize with Skill interaction
   ↓
2. Testnet write operations     → Verify full process, zero risk
   ↓
3. Mainnet small amount operations     → Confirm everything is working
   ↓
4. Formal Mainnet use     → Daily operations
```

### Common Troubleshooting

| Problem | Possible Cause | Solution |
|------|---------|---------|
| Agent says "Skill not found" | Skill file not in correct directory | Check installation path, refer to installation section |
| Agent behavior does not match expectations | Implicit trigger matched wrong skill | Use explicit call instead |
| On-chain transaction failed | Insufficient Gas / Too low slippage / Network error | Check balance, adjust slippage, confirm network |
| Quote differs significantly from actual execution | Insufficient liquidity or market volatility | Reduce transaction amount, or wait for market stabilization |





