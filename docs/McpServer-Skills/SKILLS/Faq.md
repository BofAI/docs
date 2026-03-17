# FAQ

The following questions are arranged in the order you're most likely to encounter them.

---

## Foundational Concepts

### What's the difference between Skill and MCP Server?

This is the most common question. In one sentence: **MCP Server is a toolbox, Skill is an instruction manual.**

MCP Server provides atomic-level tools — like "check balance", "initiate transfer", or "call contract". Skills tell the AI how to combine these tools to complete a full task — for example, "swap tokens on a DEX" requires executing balance check, get quote, verify approval, and execute swap in sequence. Skills define this workflow.

### Do Skills require separate installation?

No additional application needed. A Skill is just a folder — you only need to place it in a directory that your AI tool can read, and the AI will automatically discover and use it.

However, if a skill contains a `scripts/` directory (as sunswap, sunperp-skill, and tronscan-skill do), you need to run `npm install` once in that directory to install script dependencies. This step is automatic when using OpenClaw Extension.

### Which AI tools support Skills?

Currently supported: **OpenClaw** (most complete integration), **Claude Code**, **Cursor**, and any AI assistant that can read local files (using explicit invocation method).

---

## Installation and Configuration

### How do I know the skill installed successfully?

```bash
ls ~/.openclaw/skills
```

You should see directories like `sunswap`, `sunperp-skill`, `tronscan-skill`, `x402-payment`, `recharge-skill`, etc.

Then verify in OpenClaw:

```
Read the sunswap skill and tell me what this skill can do.
```

If the AI accurately describes the skill content, installation was successful.

### What if npm install fails?

First confirm your Node.js version:

```bash
node --version  # needs >= 18
```

If the version is too old, use nvm to upgrade:

```bash
nvm install 18
nvm use 18
```

Then run `npm install` again in the skill directory.

### How do I configure credentials (private keys/API keys)?

Configure through environment variables. Depending on which skills you use, add the corresponding variables in `~/.zshrc` or `~/.bashrc`:

```bash
# TRON wallet (needed for sunswap, sun-mcp-server, x402-payment)
export TRON_PRIVATE_KEY="your_private_key"
export TRONGRID_API_KEY="your_TronGrid_API_Key"

# SunPerp contract trading (needed for sunperp-skill)
export SUNPERP_ACCESS_KEY="your_SunPerp_Access_Key"
export SUNPERP_SECRET_KEY="your_SunPerp_Secret_Key"

# TronScan data queries (needed for tronscan-skill)
export TRONSCAN_API_KEY="your_TronScan_API_Key"

# BANK OF AI (needed for recharge-skill)
export BANKOFAI_API_KEY="your_BANKOFAI_API_Key"
```

After adding them, run `source ~/.zshrc` to apply, then restart your AI tool.

---

## Usage Issues

### The AI says "skill not found" or behaves unexpectedly. What should I do?

First switch to **explicit invocation** — directly tell the AI where the skill file is:

```
Please read ~/.openclaw/skills/sunswap/SKILL.md and help me check the current price of TRX.
```

If explicit invocation works normally, the issue is with implicit triggering matching. Try adding clearer keywords in your task description, like "use sunswap skill", "use tronscan-skill".

If explicit invocation also doesn't work, check if the skill directory exists, npm install is complete, and environment variables are set correctly.

### How do I switch between testnet and mainnet?

Use the `--network` parameter to specify. **Strongly recommend testing every new operation on testnet first**:

```bash
# Testnet (default, try this first)
node scripts/swap.js TRX USDT 100 --network nile

# Mainnet (only after confirming everything works)
node scripts/swap.js TRX USDT 100 --network mainnet --execute
```

You can also tell the AI directly in conversation:

```
Help me swap 100 TRX for USDT on the Nile testnet.
```

### Why does the AI require confirmation before executing?

This is a safety mechanism by design — all write operations (operations involving on-chain transactions) must be explicitly confirmed by the user before execution.

The AI will show in the confirmation prompt: operation type, tokens and amounts involved, target network, estimated Gas, and slippage. This gives you a chance to verify the operation matches expectations before your funds are actually used. **Don't skip this step, and never enable automatic execution of write operations.**

### What does dry-run (simulation) mean?

Scripts in sunswap and other Skills support running without the `--execute` flag — this is dry-run mode. It simulates the execution flow, checks balance and approval status, and gets quotes, but doesn't broadcast any on-chain transactions.

```bash
# Dry-run: simulate check, no execution
node scripts/swap.js TRX USDT 100

# Real execution
node scripts/swap.js TRX USDT 100 --execute
```

Running dry-run first is a good habit when unsure.

### Why is there a difference between the quoted price and the actual execution price?

Because there's a time difference between getting the quote and actual execution, during which the price may change. The sunswap script uses a two-step quoting strategy to handle this: the first quote is shown to you for confirmation; after you confirm, it fetches the latest quote right before submitting the actual transaction, then uses the latest quote to calculate the `amountOutMin` as slippage protection.

If extreme market volatility causes transaction failure, increasing the slippage tolerance (`--slippage 1.0`) usually fixes it.

---

## Security and Advanced

### Can I modify a skill?

Yes. Edit `SKILL.md` or scripts in `scripts/` directly, and the AI will read the latest version on the next call. You can change operation steps, add custom rules, adjust safety parameters, or add new examples.

Modifying `sunperp-skill/resources/sunperp_config.json` lets you adjust leverage limits and stop-loss defaults:

```json
{
  "safety": {
    "max_leverage": 20,
    "stop_loss": {
      "required": true,
      "default_percent": 5,
      "max_percent": 25
    }
  }
}
```

### How is skill versioning managed?

Skill versions are marked by the `version` field in the YAML frontmatter of `SKILL.md`. When using OpenClaw Extension, you can specify a specific version via the `GITHUB_BRANCH` environment variable:

```bash
GITHUB_BRANCH=v1.4.10 ./install.sh   # Install specific version
GITHUB_BRANCH=main ./install.sh       # Use latest main branch
```

The default uses the `v1.4.12` tag version.

### What if my private key is compromised?

**Act immediately, don't hesitate:**

1. Stop using the current AI tool
2. Create a new TRON/EVM wallet address
3. Transfer all assets to the new address (check for pending transactions in the current account first)
4. Update all environment variables to point to the new private key
5. Revoke token approvals on all protocols using the old wallet
6. Review the transaction history of the old wallet to confirm whether any unauthorized operations have occurred

Agent Wallet (encrypted storage) is safer than plaintext private keys — even if environment variables are compromised, attackers still need additional encryption keys to access funds. If you manage significant capital, consider switching to Agent Wallet mode.

### How do I uninstall or update a skill?

**Uninstall:**

```bash
rm -rf ~/.openclaw/skills/sunswap    # Delete specific skill
```

**Update (reinstall the latest version):**

```bash
cd openclaw-extension
./install.sh   # If a skill with the same name exists, the installer will ask if you want to overwrite
```
