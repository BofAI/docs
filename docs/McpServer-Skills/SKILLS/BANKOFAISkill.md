# BANK OF AI Skills

BANK OF AI Skills is a ready-to-use skill pack designed for AI agents, covering core DeFi scenarios in the TRON/BNB ecosystem — DEX trading, perpetual contracts, on-chain data queries, and payment protocols. Each skill encapsulates a complete business workflow: from how to call APIs and what order to execute steps, to handling approvals and protecting user assets, all embedded in `SKILL.md` and accompanying scripts.

You don't need to write code — just tell the AI in natural language what you want to do, and it will automatically find and execute the corresponding skill.

:::warning Before Using Any Skill, Please Read
BANK OF AI Skills can operate on **real on-chain assets**. Blockchain transactions are **irreversible** once on-chain — there's no "undo" button, no customer service rollback, and funds sent to the wrong address cannot be recovered. Remember three essential rules before using:

1. **Private keys must never appear in chat windows or config files.** Only pass them through environment variables (like `TRON_PRIVATE_KEY`). If a private key is compromised, move assets to a new wallet immediately.
2. **Test on testnet first, then mainnet.** Every new operation must be verified first on Nile or Shasta testnet before switching to mainnet execution.
3. **Write operations require manual confirmation.** Before executing any on-chain transaction, the AI should show you the complete operation details and wait for your explicit confirmation.
:::

---

## Available Skills Overview

| Skill | Version | Functionality | Required Credentials |
| :--- | :--- | :--- | :--- |
| **sunswap** | v2.0.0 | SunSwap DEX trading — balance, quotes, swaps, V2/V3 liquidity | `TRON_PRIVATE_KEY` |
| **sunperp-skill** | v1.0.0 | SunPerp perpetual contracts — market data, orders, positions, withdrawals | `SUNPERP_ACCESS_KEY` + `SUNPERP_SECRET_KEY` |
| **tronscan-skill** | v1.0.0 | TronScan on-chain data queries — accounts, transactions, tokens, blocks | `TRONSCAN_API_KEY` |
| **x402-payment** | v1.4.0 | x402 protocol payments — calling paid APIs and paid agents | `TRON_PRIVATE_KEY` or `EVM_PRIVATE_KEY` |
| **recharge-skill** | v1.1.1 | BANK OF AI balance queries, order history, TRC20 recharge via MCP | `BANKOFAI_API_KEY` |

---

## Installation

The simplest installation method is using **OpenClaw Extension** — install all components with one command, automatically configure the skills directory, and the AI is ready out of the box:

```bash
# Method 1: Direct run (for trusted sources)
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash

# Method 2: Check script before running (recommended)
git clone https://github.com/BofAI/openclaw-extension.git
cd openclaw-extension
./install.sh
```

After installation, skills will be placed in the `~/.openclaw/skills/` directory, and OpenClaw will automatically discover and load them.

Verify that skills are ready after installation:

```bash
ls ~/.openclaw/skills
```

You should see directories like `sunswap`, `sunperp-skill`, `tronscan-skill`, `x402-payment`, `recharge-skill`, etc.

### Installation on Other Platforms

If you use Claude Code, Cursor, or other AI tools that support Skills, you can also install manually:

**Claude Code:**

```bash
git clone https://github.com/BofAI/skills.git /tmp/bofai-skills
mkdir -p ~/.config/claude-code/skills
cp -r /tmp/bofai-skills/* ~/.config/claude-code/skills/
```

Claude Code will automatically load these skills when it starts.

**Cursor:**

```bash
# Clone to project root
git clone https://github.com/BofAI/skills.git .cursor/skills
```

In Cursor Chat, use the `@` symbol to reference specific `SKILL.md` files for context, or add the skills path to `.cursorrules`.

**Universal Method (any AI tool):**

```bash
git clone https://github.com/BofAI/skills.git ~/bofai-skills
```

Then explicitly tell the AI to read a skill file in your conversation:

```
Please read ~/bofai-skills/sunswap/SKILL.md and help me check the current price of TRX.
```

---

## Verify Installation

After installation, starting with read-only operations is the best entry point — no private keys needed, zero risk, perfect for getting familiar with how skills work.

In your client, enter:

```
How much TRX can I get for 100 USDT on SunSwap?
```

```
Help me check the current market data for BTC-USDT perpetual contract.
```

---

## Usage Examples for Each Skill

Each example is marked with an operation type:
- 🟢 **Read-only** — produces no on-chain transactions, no private key needed
- ⚠️ **Write operation** — initiates on-chain transactions, requires user confirmation before execution

### sunswap

```
# 🟢 Query balance
Help me check my TRX and USDT balances.

# 🟢 Query price
What's the current price of TRX?

# 🟢 Get swap quote
How much TRX can I get for 100 USDT on SunSwap?

# ⚠️ Execute swap
Swap 100 TRX for USDT on SunSwap Nile testnet.

# ⚠️ Add liquidity
Add 100 TRX and 15 USDT liquidity to the TRX/USDT pool on SunSwap V2.

# 🟢 View V3 positions
Help me check all my current SunSwap V3 liquidity positions.

# ⚠️ Collect fees
Help me collect fee rewards from V3 position #12345.
```

### sunperp-skill

```
# 🟢 View market data
What are the current price, 24h change, and funding rate for BTC-USDT perpetual contract?

# 🟢 View account
What's my SunPerp account balance and available margin?

# 🟢 View open positions
What open positions do I have? Show entry price, unrealized P&L and liquidation price.

# ⚠️ Open position
Open 1 BTC-USDT long position at market price on SunPerp with 10x leverage, set 5% stop loss.

# ⚠️ Close position
Close all my BTC-USDT positions.

# ⚠️ Withdraw
Withdraw 10 USDT from SunPerp to my on-chain address.
```

### tronscan-skill

```
# 🟢 Account query
Help me query the complete account info and holdings for address TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf.

# 🟢 Transaction query
Query the details of this transaction hash: abc123...

# 🟢 Token info
Show the top 10 TRC20 tokens by market cap.

# 🟢 Network overview
Give me a TRON network overview: current TPS, number of Super Representatives, total accounts.

# 🟢 Transfer history
Query the last 20 USDT transfers from address TXX...
```

### x402-payment

```
# ⚠️ Call paid endpoint
Use x402 protocol to call this paid agent endpoint: https://api.example.com

# 🟢 Check Gasfree status
Help me check the current Gasfree wallet status and available balance.
```

### recharge-skill

```
# 🟢 Query balance
How much balance does my BANK OF AI account have?

# 🟢 Query orders
Show my recent BANK OF AI order history.

# ⚠️ Recharge
Recharge 1 USDT to my BANK OF AI account.

# ⚠️ Recharge (Chinese)
给 BANK OF AI 充值 1 USDT
```

---

## Recommended Learning Path

If you're just starting with BANK OF AI Skills, following this order makes it smoother:

Step 1: Read-only queries
  → Start with tronscan-skill to query accounts and check transactions, get familiar with skill interaction
  → Use sunswap to check prices and quotes, no real trades

Step 2: Testnet write operations
  → Execute swaps, add liquidity, open contracts on Nile testnet
  → Confirm AI behavior matches expectations, parameters pass correctly

Step 3: Mainnet small transactions
  → Verify the complete workflow with small amounts of capital

Step 4: Mainnet production use
  → Daily operations, adjust parameters and skill combinations as needed

---

## Next Steps

- Want to understand how Skills work? → [What Are Skills?](./Intro.md)
- Encountering issues? → [FAQ](./Faq.md)
- Using OpenClaw Extension? → [OpenClaw Extension Documentation](../../Openclaw-extension/Intro.md)
