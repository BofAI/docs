# 常见问题与排查

以下问题按你最可能遇到的顺序排列。

---

## 基础概念

### Skill 和 MCP Server 有什么区别？

这是最常见的问题。一句话解释：**MCP Server 是工具箱，Skill 是操作手册。**

MCP Server 提供原子级工具——比如"查余额"、"发起转账"、"调用合约"。Skill 则告诉 AI 如何把这些工具组合起来完成一个完整任务——比如"在 DEX 上兑换代币"需要依次执行查余额、获取报价、检查授权、执行兑换四个步骤，Skill 负责定义这个流程。

### Skill 需要单独安装吗？

不需要额外安装应用程序。Skill 就是一个文件夹——你只需把它放在 AI 工具能读取的目录里，AI 就能自动发现和使用它。

但如果技能包含 `scripts/` 目录（sunswap、sunperp-skill、tronscan-skill 都有），需要在该目录下运行一次 `npm install` 安装脚本依赖。使用 OpenClaw Extension 安装时这步是自动的。

### Skills 支持哪些 AI 工具？

目前支持：**OpenClaw**（最完整的集成体验）、**Claude Code**、**Cursor**，以及任何支持读取本地文件的 AI 助手（通过显式调用方式）。

---

## 安装与配置

### 怎么知道技能安装成功了？

```bash
ls ~/.openclaw/skills
```

应该能看到 `sunswap`、`sunperp-skill`、`tronscan-skill`、`x402-payment`、`ainft-skill` 等目录。

然后在 OpenClaw 中验证：

```
阅读 sunswap 技能，告诉我这个技能能做什么。
```

如果 AI 能准确描述技能内容，说明安装成功。

### npm install 报错怎么办？

先确认 Node.js 版本：

```bash
node --version  # 需要 >= 18
```

如果版本过低，用 nvm 升级：

```bash
nvm install 18
nvm use 18
```

然后重新在技能目录执行 `npm install`。

### 凭证（私钥/API Key）怎么配置？

通过环境变量配置。根据你使用的技能，在 `~/.zshrc` 或 `~/.bashrc` 中添加对应变量：

```bash
# TRON 钱包（sunswap、sun-mcp-server、x402-payment 需要）
export TRON_PRIVATE_KEY="你的私钥"
export TRONGRID_API_KEY="你的 TronGrid API Key"

# SunPerp 合约交易（sunperp-skill 需要）
export SUNPERP_ACCESS_KEY="你的 SunPerp Access Key"
export SUNPERP_SECRET_KEY="你的 SunPerp Secret Key"

# TronScan 数据查询（tronscan-skill 需要）
export TRONSCAN_API_KEY="你的 TronScan API Key"

# AINFT（ainft-skill 需要）
export AINFT_API_KEY="你的 AINFT API Key"
```

添加后执行 `source ~/.zshrc` 生效，然后重启 AI 工具。

---

## 使用问题

### AI 说"找不到技能"或行为不符合预期怎么办？

首先换成**显式调用**——直接告诉 AI 技能文件在哪里：

```
请阅读 ~/.openclaw/skills/sunswap/SKILL.md，帮我查 TRX 当前价格。
```

如果显式调用正常，说明是隐式触发的匹配问题。可以在任务描述中加入更明确的关键词，比如"使用 sunswap 技能"、"通过 tronscan-skill"。

如果显式调用也不工作，检查技能目录是否存在、npm install 是否完成、环境变量是否正确设置。

### 如何在测试网和主网之间切换？

通过 `--network` 参数指定。**强烈建议每次新操作都先在测试网验证**：

```bash
# 测试网（默认，推荐先用这个）
node scripts/swap.js TRX USDT 100 --network nile

# 主网（确认一切正常后再用）
node scripts/swap.js TRX USDT 100 --network mainnet --execute
```

也可以在对话中直接告诉 AI：

```
在 Nile 测试网上帮我把 100 TRX 兑换成 USDT。
```

### 为什么 AI 在执行前要让我确认？

这是设计如此的安全机制——所有写操作（涉及链上交易的操作）都必须经过用户明确确认才能执行。

AI 会在确认提示中展示：操作类型、涉及的代币和金额、目标网络、预估 Gas 和滑点。这是为了让你在资金真正动用之前，有机会核查操作是否符合预期。**不要跳过这个步骤，更不要开启自动执行写操作。**

### dry-run（模拟执行）是什么意思？

sunswap 等 Skill 的脚本支持不带 `--execute` 标志运行——这就是 dry-run 模式。它会模拟执行流程、检查余额和授权状态、获取报价，但不会广播任何链上交易。

```bash
# Dry-run：模拟检查，不执行
node scripts/swap.js TRX USDT 100

# 真实执行
node scripts/swap.js TRX USDT 100 --execute
```

遇到不确定的情况时，先跑 dry-run 是个好习惯。

### 为什么报价和实际成交有差异？

因为从获取报价到实际执行之间有时间差，这段时间内价格可能发生变化。sunswap 的 `swap.js` 采用两步报价策略来处理这个问题：第一次报价展示给用户确认，用户确认后在实际提交交易前会重新获取最新报价，然后以最新报价计算的 `amountOutMin` 作为滑点保护。

如果市场波动剧烈导致交易失败，适当增大滑点容忍度（`--slippage 1.0`）通常能解决。

---

## 安全与进阶

### 我可以修改技能吗？

可以。直接编辑 `SKILL.md` 或 `scripts/` 中的脚本，AI 下次调用时会读取最新版本。你可以修改操作步骤、添加自定义规则、调整安全参数，或者添加新的示例。

修改 `sunperp-skill/resources/sunperp_config.json` 可以调整杠杆上限和止损默认值：

```json
{
  "safety": {
    "max_leverage": 20,
    "stop_loss": {
      "required": true,
      "default_percent": 5,
      "max_percent": 25
    }
  }
}
```

### 技能的版本怎么管理？

技能版本由 `SKILL.md` 的 YAML frontmatter 中的 `version` 字段标记。使用 OpenClaw Extension 时，可以通过 `GITHUB_BRANCH` 环境变量指定安装特定版本：

```bash
GITHUB_BRANCH=v1.4.10 ./install.sh   # 安装指定版本
GITHUB_BRANCH=main ./install.sh       # 使用最新主分支
```

默认使用 `v1.4.12` 标签版本。

### 私钥泄露了怎么办？

**立即行动，不要犹豫：**

1. 停止使用当前 AI 工具
2. 创建一个新的 TRON/EVM 钱包地址
3. 将所有资产转移到新地址（注意检查当前账户是否有待处理交易）
4. 更新所有环境变量，指向新的私钥
5. 撤销旧钱包在所有协议上的代币授权
6. 查看旧钱包的交易记录，确认是否已有未授权的操作

Agent Wallet（加密存储）比明文私钥更安全——即使环境变量泄露，攻击者还需要额外的加密密钥才能访问资金。如果你管理较多资金，建议切换到 Agent Wallet 模式。

### 如何卸载或更新技能？

**卸载：**

```bash
rm -rf ~/.openclaw/skills/sunswap    # 删除指定技能
```

**更新（重新安装最新版本）：**

```bash
cd openclaw-extension
./install.sh   # 如果同名技能已存在，安装程序会询问是否覆盖
```
