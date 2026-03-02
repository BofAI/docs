# 创建 SKILLS

查看 [AGENTS.md](https://github.com/BofAI/skills/blob/main/) 了解如何创建新技能。

## 快速模板

```shell
# 1. 创建目录
mkdir -p my-skill/{examples,resources,scripts}

# 2. 创建 SKILL.md
cat > my-skill/SKILL.md << 'EOF'
---
name: My Skill
description: 这个技能的功能
version: 1.0.0
dependencies:
  - required-tool
tags:
  - category
---

# My Skill

## 概述
[描述]

## 使用说明
1. 步骤 1
2. 步骤 2
EOF
```

## SKILL 规范

每个 SKILL 必须包含：

* ✅ **SKILL.md** - 主指令文件（带有 YAML 前置元数据）
* ✅ **README.md** - 快速描述
* ⚠️ **examples/** - 使用示例（推荐）
* ⚠️ **resources/** - 配置文件（可选）
* ⚠️ **scripts/** - 辅助脚本（可选）

详见 [AGENTS.md](https://github.com/BofAI/skills/blob/main/)
