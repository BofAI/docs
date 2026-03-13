# How to Create a New Skill

This guide explains how to create a new Agent Skill from scratch, following the project's development conventions.

## Quick Template

```shell
# 1. Create directories
mkdir -p my-skill/{examples,resources,scripts}

# 2. Create SKILL.md
cat > my-skill/SKILL.md << 'EOF'
---
name: My Skill
description: What this skill does
version: 1.0.0
dependencies:
  - required-tool
tags:
  - category
---

# My Skill

## Overview
[Description]

## Usage Instructions
1. Step 1
2. Step 2
EOF
```


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


## Testing & Verification

After development, follow these steps to verify:

1. **Read-only test**: Test functions that don't involve write operations (queries, quotes, etc.)
2. **Testnet verification**: Verify write operations on Nile or Shasta testnet
3. **Check**: Ensure expected operations are correctly output
4. **Mainnet small-amount test**: Do a final verification on mainnet with minimal amounts

```bash
# Example: Verify a new skill
cd my-skill && npm install

# Read-only test
node scripts/query.js --network nile

# Actual execution (testnet)
node scripts/execute.js --network nile --execute
```

## Contributing

Once your new skill is ready, refer to [CONTRIBUTING.md](https://github.com/BofAI/skills/blob/main/CONTRIBUTING.md) to submit a Pull Request.
