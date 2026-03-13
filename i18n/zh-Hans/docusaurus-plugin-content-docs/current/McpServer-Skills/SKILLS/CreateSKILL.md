# 如何创建 SKILLS

本文介绍如何从零开始创建一个新的 Agent Skill，并遵循项目的开发规范。

## 快速模板

```shell
# 1. 创建目录结构
mkdir -p my-skill/{scripts,resources}

# 2. 创建 SKILL.md
cat > my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: 一句话描述技能功能
version: 1.0.0
dependencies:
  - node >= 18
  - tronweb
tags:
  - defi
  - tron
---

# 技能名称

## 概述
AI 代理将阅读的指令...

## 可用工具
列出所有脚本及其用法...

## 工作流程
分步骤描述代理应如何完成任务...
EOF

# 3. 安装依赖
cd my-skill && npm init -y && npm install tronweb
```

## 技能规范

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

## SKILL.md 结构

每个技能的 `SKILL.md` 使用 YAML frontmatter 定义元数据，正文包含操作指令：

```yaml
---
name: my-skill
description: 一句话描述技能功能
version: 1.0.0
dependencies:
  - node >= 18
  - tronweb
tags:
  - defi
  - tron
---

# 技能名称

## 概述
描述技能的用途和适用场景。

## 可用工具
列出 scripts/ 中的所有脚本及其参数：

### balance.js
查询钱包余额。
`node scripts/balance.js [address] --network mainnet`

### swap.js
执行代币兑换。
`node scripts/swap.js <fromToken> <toToken> <amount> [--execute]`

## 工作流程
1. 第一步：查询余额...
2. 第二步：获取报价...
3. 第三步：执行兑换...

## 注意事项
- 安全提示
- 网络选择建议
```

## 脚本开发约定

### 安全优先

所有涉及私钥或链上写操作的脚本，必须通过 `--execute` 标志显式确认。默认为 dry-run 模式（只模拟，不执行）。

```javascript
const execute = args.includes('--execute');
if (!execute) {
  console.log('[DRY-RUN] 以下交易不会实际执行：');
  // 显示交易详情但不发送
  return;
}
```

### 网络参数

统一使用 `--network` 参数指定网络：

```bash
node scripts/swap.js TRX USDT 100 --network nile      # 测试网
node scripts/swap.js TRX USDT 100 --network mainnet    # 主网（默认）
```

支持的网络标识符：

| 网络 | 标识符 | 说明 |
| :--- | :--- | :--- |
| TRON 主网 | `mainnet` | 默认网络 |
| TRON Nile | `nile` | 测试网 |
| TRON Shasta | `shasta` | 测试网 |
| BSC 主网 | `bsc` | EVM 链 |
| BSC 测试网 | `bsc-testnet` | EVM 测试网 |

### 私钥加载

按以下优先级搜索私钥：

```
TRON_PRIVATE_KEY > PRIVATE_KEY > 配置文件 > 钱包文件
```

### 输出格式

支持 `--format json` 用于程序化调用，默认输出人类可读格式：

```bash
node scripts/balance.js --format json     # JSON 输出
node scripts/balance.js                   # 人类可读（默认）
```

### 错误处理

- 使用 `process.exit(1)` 返回非零退出码
- 输出清晰的错误信息，说明失败原因和建议操作

## 配置解析优先级

```
CLI 参数 > 环境变量 > 本地配置文件 > 用户目录配置文件
```

## 环境变量参考

| 变量 | 说明 | 使用技能 |
| :--- | :--- | :--- |
| `TRON_PRIVATE_KEY` | TRON 操作主私钥 | 全部 |
| `EVM_PRIVATE_KEY` / `ETH_PRIVATE_KEY` | EVM 链私钥 | x402-payment |
| `TRONGRID_API_KEY` | TronGrid API Key（主网推荐） | sunswap, 8004 |
| `GASFREE_API_KEY` | GasFree 无 Gas 费支付 API Key | x402-payment |
| `GASFREE_API_SECRET` | GasFree API Secret | x402-payment |
| `AINFT_API_KEY` | AINFT 商户 API Key | ainft-skill |
| `PINATA_JWT` | Pinata JWT（IPFS 上传用） | 8004-skill |

## 测试与验证

开发完成后，建议按以下步骤验证：

1. **只读测试**：先测试不涉及写操作的功能（查询、报价等）
2. **测试网验证**：在 Nile 或 Shasta 测试网上验证写操作
3. **Dry-run 检查**：确保 dry-run 模式正确输出预期操作
4. **主网小额测试**：用最小金额在主网做最终验证

```bash
# 示例：验证一个新技能
cd my-skill && npm install

# 只读测试
node scripts/query.js --network nile

# Dry-run（不实际执行）
node scripts/execute.js --network nile

# 实际执行（测试网）
node scripts/execute.js --network nile --execute
```

## 提交贡献

准备好新技能后，参考 [CONTRIBUTING.md](https://github.com/BofAI/skills/blob/main/CONTRIBUTING.md) 提交 Pull Request。
