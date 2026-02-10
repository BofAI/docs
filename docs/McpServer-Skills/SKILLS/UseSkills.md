# 如何使用技能

### 前置要求

1. ✅ 已安装 AI 智能体（OpenClaw）
2. ✅ 已安装 **OpenClaw 扩展**（用于 TRON 功能）
   * 下载：[bankofai/openclaw-extension](https://github.com/bankofai/openclaw-extension)
   * 按照该仓库中的说明设置 MCP 服务器

## 面向开发者

### 创建新技能

查看 [AGENTS.md](AGENTS.md) 了解如何创建新技能。

**快速模板**：

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

### 技能规范

每个技能必须包含：

* ✅ **SKILL.md** - 主指令文件（带有 YAML 前置元数据）
* ✅ **README.md** - 快速描述
* ⚠️ **examples/** - 使用示例（推荐）
* ⚠️ **resources/** - 配置文件（可选）
* ⚠️ **scripts/** - 辅助脚本（可选）

详见 [AGENTS.md](AGENTS.md)。
