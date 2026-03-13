# FAQ

### Q: Do skills need to be installed separately?

**A**: No. Skills are simply documents and script collections that the AI agent reads directly. You just need to place the skill directory in the correct location, and the AI can automatically discover and use it. If a skill contains a `scripts/` directory, you need to run `npm install` first to install its dependencies.

---

### Q: What is the difference between a Skill and the MCP Server?

**A**:

| | Skill | MCP Server |
| :--- | :--- | :--- |
| **Definition** | Instruction document + script collection | Tool service |
| **Role** | Teaches AI **how to do** something | Provides AI **the ability to do** something |
| **Example** | sunswap skill teaches AI the swap workflow | tron-mcp-server provides on-chain interaction capabilities |

In short: a Skill is the "operation manual," and an MCP Server is the "toolbox." Skills tell the AI how to use the tools provided by MCP Servers.

---

### Q: How do I know what dependencies a skill requires?

**A**: Check two files in the skill directory:

1. YAML frontmatter at the top of `SKILL.md`:
```yaml
dependencies:
  - node >= 18
  - tron-mcp-server
```

2. npm dependencies in `package.json`:
```bash
cd skills/sunswap && npm install
```

---

### Q: What if the AI agent cannot find a skill?

**A**: You can explicitly tell the AI the skill's path:

> Please read `skills/sunswap/SKILL.md` and check how much TRX I can get for 100 USDT.

If installed via the OpenClaw extension, skills are automatically configured, and the AI can match them through implicit triggering.

---

### Q: Can I modify a skill?

**A**: Yes. Simply edit `SKILL.md` or the scripts in `scripts/`, and the AI agent will read the latest version on its next invocation.

---

### Q: How do I switch between testnet and mainnet?

**A**: Specify via the `--network` parameter. It is recommended to always complete verification on a testnet (`nile` or `shasta`) first before switching to `mainnet`.

```bash
# Testnet
node scripts/swap.js TRX USDT 100 --network nile

# Mainnet
node scripts/swap.js TRX USDT 100 --network mainnet --execute
```

---

### Q: How do I configure private keys?

**A**: Configure via environment variables. Never hardcode them in your code:

```bash
export TRON_PRIVATE_KEY="your_private_key"
export TRONGRID_API_KEY="your_api_key"    # Recommended for mainnet
```

Private key loading priority: `TRON_PRIVATE_KEY` > `PRIVATE_KEY` > Config file > Wallet file


