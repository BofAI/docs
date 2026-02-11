# How to Use SKILLS

### Prerequisites

1. ✅ AI Agent (OpenClaw) installed  
2. ✅ **OpenClaw Extension** installed  
   * Download: [bankofai/openclaw-extension](https://github.com/bankofai/openclaw-extension)  
   * Follow the instructions in that repository to set up the MCP server  


## For Developers

### Create a New SKILL

See [AGENTS.md](https://github.com/bankofai/skills/blob/main/) to learn how to create a new skill.

**Quick Template**:

```shell
# 1. Create directory structure
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

### SKILL Specification

Each SKILL must include:

* ✅ **SKILL.md** - Main instruction file (with YAML frontmatter metadata)
* ✅ **README.md** - Quick description
* ⚠️ **examples/** - Usage examples (recommended)
* ⚠️ **resources/** - Configuration files (optional)
* ⚠️ **scripts/** - Helper scripts (optional)

For more details, see [AGENTS.md](https://github.com/bankofai/skills/blob/main/)
