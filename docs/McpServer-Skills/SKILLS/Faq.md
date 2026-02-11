# FAQ

### Q: Do skills need to be installed separately?

**A**: ❌ No. Skills are simply documents that the AI agent reads directly.

### Q: What is the difference between a Skill and the MCP server?

**A**:

- **Skill** = Instruction document (teaches the AI how to do something)
- **MCP Server** = Tool service (provides actual capabilities)

Skills tell the AI how to use the MCP server tools.

### Q: How do I know what dependencies a skill requires?

**A**: Check the YAML frontmatter metadata in SKILL.md:

```yaml
dependencies:
  - mcp-server-tron
```

### Q: What if the AI agent cannot find a skill?

**A**: Explicitly tell it:

Please read skills/sunswap/SKILL.md

### Q: Can I modify a skill?

**A**: ✅ Yes! Simply edit SKILL.md, and the AI agent will read the latest version.
