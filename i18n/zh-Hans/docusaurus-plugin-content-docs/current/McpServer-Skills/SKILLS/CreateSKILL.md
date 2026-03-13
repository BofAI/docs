# 如何创建 SKILLS

本文介绍如何从零开始创建一个新的 Agent Skill，并遵循项目的开发规范。

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


### 必需文件

| 文件 | 说明 |
| :--- | :--- |
| `SKILL.md` | 主指令文件，带有 YAML frontmatter 元数据。AI 代理通过此文件了解技能的用途和操作流程。 |

### 推荐文件

| 文件/目录 | 说明 |
| :--- | :--- |
| `package.json` | 依赖管理，声明所需的 npm 包。 |
| `scripts/` | 可执行脚本，AI 代理调用这些脚本完成实际操作。 |
| `resources/` | 配置数据，如代币地址、合约地址、API 端点等。 |

### 可选文件

| 文件/目录 | 说明 |
| :--- | :--- |
| `README.md` | 面向开发者的快速说明。 |
| `examples/` | 使用示例。 |
| `assets/` | 模板、图片或其他资源。 |


## 测试与验证

开发完成后，建议按以下步骤验证：

1. **只读测试**：先测试不涉及写操作的功能（查询、报价等）
2. **测试网验证**：在 Nile 或 Shasta 测试网上验证写操作
3. **检查**：确保正确输出预期操作
4. **主网小额测试**：用最小金额在主网做最终验证

```bash
# 示例：验证一个新技能
cd my-skill && npm install

# 只读测试
node scripts/query.js --network nile

# 实际执行（测试网）
node scripts/execute.js --network nile --execute
```

## 提交贡献

准备好新技能后，参考 [CONTRIBUTING.md](https://github.com/BofAI/skills/blob/main/CONTRIBUTING.md) 提交 Pull Request。
