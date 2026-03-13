# 常见问题

### 问：Skill 需要单独安装吗？

**答**：不需要。Skill 只是 AI 智能体直接读取的文档和脚本集合。你只需要将技能目录放在正确的位置，AI 就能自动发现和使用它。如果技能包含 `scripts/` 目录，需要先运行 `npm install` 安装其依赖。

---

### 问：Skill 和 MCP Server 有什么区别？

**答**：

| | Skill | MCP Server |
| :--- | :--- | :--- |
| **定义** | 指令文档 + 脚本集合 | 工具服务 |
| **作用** | 教 AI **如何做**某件事 | 提供 AI **做事的能力** |
| **示例** | sunswap 技能教 AI 如何执行兑换流程 | mcp-server-tron 提供链上交互能力 |

简单来说：Skill 是"操作手册"，MCP Server 是"工具箱"。Skill 告诉 AI 如何使用 MCP Server 提供的工具。

---

### 问：如何知道技能需要哪些依赖？

**答**：查看技能目录下的两个文件：

1. `SKILL.md` 顶部的 YAML frontmatter：
```yaml
dependencies:
  - node >= 18
  - mcp-server-tron
```

2. `package.json` 中的 npm 依赖：
```bash
cd skills/sunswap && npm install
```

---

### 问：如果 AI 智能体找不到技能怎么办？

**答**：你可以显式告诉 AI 技能的路径：

> 请阅读 `skills/sunswap/SKILL.md`，帮我查看 100 USDT 能兑换多少 TRX。

如果使用 OpenClaw 扩展安装，技能会被自动配置，AI 可以通过隐式触发自动匹配。

---

### 问：我可以修改技能吗？

**答**：可以。直接编辑 `SKILL.md` 或 `scripts/` 中的脚本，AI 智能体下次调用时会读取最新版本。

---

### 问：支持哪些网络？

**答**：

| 网络 | 标识符 | 链 | 说明 |
| :--- | :--- | :--- | :--- |
| TRON 主网 | `mainnet` | TRON | 默认网络 |
| TRON Nile | `nile` | TRON | 测试网 |
| TRON Shasta | `shasta` | TRON | 测试网 |
| BSC 主网 | `bsc` | BSC | EVM 链 |
| BSC 测试网 | `bsc-testnet` | BSC | EVM 测试网 |

使用 `--network` 参数切换网络：

```bash
node scripts/swap.js TRX USDT 100 --network nile
```

---

### 问：如何切换测试网和主网？

**答**：通过 `--network` 参数指定。建议始终先在测试网（`nile` 或 `shasta`）上完成验证，再切换到 `mainnet`。

```bash
# 测试网
node scripts/swap.js TRX USDT 100 --network nile

# 主网
node scripts/swap.js TRX USDT 100 --network mainnet --execute
```

---

### 问：执行写操作安全吗？

**答**：所有涉及链上写操作的脚本默认为 **dry-run 模式**（只模拟不执行）。必须显式添加 `--execute` 标志才会真正执行交易。

```bash
node scripts/swap.js TRX USDT 100              # dry-run，不执行
node scripts/swap.js TRX USDT 100 --execute    # 实际执行
```

---

### 问：私钥如何配置？

**答**：通过环境变量配置，切勿写死在代码中：

```bash
export TRON_PRIVATE_KEY="your_private_key"
export TRONGRID_API_KEY="your_api_key"    # 主网推荐配置
```

私钥加载优先级：`TRON_PRIVATE_KEY` > `PRIVATE_KEY` > 配置文件 > 钱包文件

---

### 问：如何贡献新技能？

**答**：参考 [如何创建新技能](./CreateSKILL.md) 完成开发，然后按照 [CONTRIBUTING.md](https://github.com/BofAI/skills/blob/main/CONTRIBUTING.md) 提交 Pull Request。
