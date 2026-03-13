# How to Create a New Skill

This guide explains how to create a new Agent Skill from scratch, following the project's development conventions.

## Quick Template

```shell
# 1. Create directory structure
mkdir -p my-skill/{scripts,resources}

# 2. Create SKILL.md
cat > my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: One-line description of the skill
version: 1.0.0
dependencies:
  - node >= 18
  - tronweb
tags:
  - defi
  - tron
---

# Skill Name

## Overview
Instructions for the AI agent...

## Available Tools
List all scripts and their usage...

## Workflow
Step-by-step description of how the agent should complete the task...
EOF

# 3. Install dependencies
cd my-skill && npm init -y && npm install tronweb
```

## Skill Specification

### Required Files

| File | Description |
| :--- | :--- |
| `SKILL.md` | Main instruction file with YAML frontmatter metadata. The AI agent reads this to understand the skill's purpose and workflow. |

### Recommended Files

| File/Directory | Description |
| :--- | :--- |
| `package.json` | Dependency management, declares required npm packages. |
| `scripts/` | Executable scripts that the AI agent calls to perform actual operations. |
| `resources/` | Configuration data such as token addresses, contract addresses, API endpoints, etc. |

### Optional Files

| File/Directory | Description |
| :--- | :--- |
| `README.md` | Quick description for developers. |
| `examples/` | Usage examples. |
| `assets/` | Templates, images, or other resources. |

## SKILL.md Structure

Each skill's `SKILL.md` uses YAML frontmatter for metadata, with the body containing operational instructions:

```yaml
---
name: my-skill
description: One-line description of the skill
version: 1.0.0
dependencies:
  - node >= 18
  - tronweb
tags:
  - defi
  - tron
---

# Skill Name

## Overview
Describe the skill's purpose and applicable scenarios.

## Available Tools
List all scripts in scripts/ with their parameters:

### balance.js
Query wallet balance.
`node scripts/balance.js [address] --network mainnet`

### swap.js
Execute token swap.
`node scripts/swap.js <fromToken> <toToken> <amount> [--execute]`

## Workflow
1. Step 1: Query balance...
2. Step 2: Get quote...
3. Step 3: Execute swap...

## Notes
- Security tips
- Network selection recommendations
```

## Script Development Conventions

### Safety First

All scripts involving private keys or on-chain write operations must require an explicit `--execute` flag. The default mode is dry-run (simulate only, no execution).

```javascript
const execute = args.includes('--execute');
if (!execute) {
  console.log('[DRY-RUN] The following transaction will NOT be executed:');
  // Show transaction details without sending
  return;
}
```

### Network Parameter

Use the unified `--network` parameter to specify the network:

```bash
node scripts/swap.js TRX USDT 100 --network nile      # Testnet
node scripts/swap.js TRX USDT 100 --network mainnet    # Mainnet (default)
```

Supported network identifiers:

| Network | Identifier | Chain | Description |
| :--- | :--- | :--- | :--- |
| TRON Mainnet | `mainnet` | TRON | Default network |
| TRON Nile | `nile` | TRON | Testnet |
| TRON Shasta | `shasta` | TRON | Testnet |
| BSC Mainnet | `bsc` | BSC | EVM chain |
| BSC Testnet | `bsc-testnet` | BSC | EVM testnet |

### Private Key Loading

Private keys are searched in the following priority order:

```
TRON_PRIVATE_KEY > PRIVATE_KEY > Config file > Wallet file
```

### Output Format

Support `--format json` for programmatic use; default output is human-readable:

```bash
node scripts/balance.js --format json     # JSON output
node scripts/balance.js                   # Human-readable (default)
```

### Error Handling

- Use `process.exit(1)` to return non-zero exit codes
- Output clear error messages explaining the failure reason and suggested actions

## Configuration Priority

```
CLI arguments > Environment variables > Local config file > User directory config file
```

## Environment Variables Reference

| Variable | Description | Used By |
| :--- | :--- | :--- |
| `TRON_PRIVATE_KEY` | Primary private key for TRON operations | All |
| `EVM_PRIVATE_KEY` / `ETH_PRIVATE_KEY` | EVM chain private key | x402-payment |
| `TRONGRID_API_KEY` | TronGrid API Key (recommended for mainnet) | sunswap, 8004 |
| `GASFREE_API_KEY` | GasFree gasless payment API Key | x402-payment |
| `GASFREE_API_SECRET` | GasFree API Secret | x402-payment |
| `AINFT_API_KEY` | AINFT merchant API Key | ainft-skill |
| `PINATA_JWT` | Pinata JWT (for IPFS uploads) | 8004-skill |

## Testing & Verification

After development, follow these steps to verify:

1. **Read-only test**: Test functions that don't involve write operations (queries, quotes, etc.)
2. **Testnet verification**: Verify write operations on Nile or Shasta testnet
3. **Dry-run check**: Ensure dry-run mode correctly outputs expected operations
4. **Mainnet small-amount test**: Do a final verification on mainnet with minimal amounts

```bash
# Example: Verify a new skill
cd my-skill && npm install

# Read-only test
node scripts/query.js --network nile

# Dry-run (no actual execution)
node scripts/execute.js --network nile

# Actual execution (testnet)
node scripts/execute.js --network nile --execute
```

## Contributing

Once your new skill is ready, refer to [CONTRIBUTING.md](https://github.com/BofAI/skills/blob/main/CONTRIBUTING.md) to submit a Pull Request.
