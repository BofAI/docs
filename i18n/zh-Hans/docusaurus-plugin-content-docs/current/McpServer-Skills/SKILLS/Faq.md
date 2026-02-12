# 常见问题

### 问：SKILL 需要单独安装吗？

**答**：❌ 不需要。SKILL 只是 AI 智能体直接读取的文档。

### 问：SKILL 和 MCP Server 有什么区别？

**答**：

- **SKILL** = 指令文档（教 AI 如何做某事）
- **MCP Server** = 工具服务（提供实际能力）

技能告诉 AI 如何使用 MCP 服务器工具。

### 问：如何知道技能需要哪些依赖？

**答**：查看 SKILL.md 中的 YAML 前置元数据：

```yaml
dependencies:
  - mcp-server-tron
```

### 问：如果 AI 智能体找不到技能怎么办？

**答**：明确告诉它：

```
请阅读 skills/sunswap/SKILL.md
```

### 问：我可以修改技能吗？

**答**：✅ 可以！直接编辑 SKILL.md，AI 智能体会读取最新版本。
