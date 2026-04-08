# 简介

## SUN CLI 是什么？

SUN CLI（`@bankofai/sun-cli`）是一个命令行工具，让你在终端里就能使用 [SUN.IO（SunSwap）](https://sun.io) 的全部 DeFi 能力。无论你是开发者、运维人员还是 AI Agent，SUN CLI 都能通过一行命令完成代币价格查询、兑换执行、流动性管理等 TRON 链上操作。

简单理解：SUN MCP Server 通过 MCP 协议将 DeFi 能力暴露为标准工具接口，AI 助手可以直接调用，无需拼接命令或解析文本输出。SUN CLI 则提供结构化的命令行界面，适合你手动操作、编写脚本，也可以由 AI Agent 通过 Shell 调用。两者共享同一套底层 DeFi 能力，区别在于集成方式：MCP 是原生协议集成，CLI 是命令行调用。

举个例子，查询 TRX 的实时价格只需：

```bash
sun price TRX
```

执行一笔兑换：

```bash
sun swap TRX USDT 1000000 --yes
```

不需要打开浏览器，不需要前端界面，不需要手动与合约交互。

---

## 它能做什么？

SUN CLI 覆盖了与 SunSwap DEX 交互的完整操作，从实时行情数据到链上交易执行。

**数据查询（只读，无需钱包）：**

| 能力 | 描述 | 示例命令 |
| :--- | :--- | :--- |
| **代币价格** | 查询 SunSwap 上任意代币的实时价格 | `sun price TRX` |
| **兑换报价** | 执行前获取最优路径和预期输出 | `sun swap:quote TRX USDT 1000000` |
| **池子数据** | 池子列表、APY 排行、交易量和流动性历史 | `sun pool top-apy --page-size 5` |
| **持仓查询** | 查看任意地址的流动性仓位 | `sun position list --owner TYourAddress` |
| **协议统计** | SunSwap 全局交易量、用户数、池数量、流动性历史 | `sun protocol info` |
| **矿池信息** | 收益矿池列表、挖矿持仓和矿池交易历史 | `sun farm list` |
| **代币发现** | 按名称搜索代币、按协议版本列表 | `sun token search USDT` |

**DeFi 操作（写入，需要钱包）：**

| 能力 | 描述 | 示例命令 |
| :--- | :--- | :--- |
| **代币兑换** | 通过 Universal Router 执行最优路径兑换 | `sun swap TRX USDT 1000000` |
| **V2 流动性** | 创建流动性池或向 V2 池添加/移除流动性 | `sun liquidity v2:add --token-a TRX --token-b USDT --amount-a 1000000` |
| **V3 流动性** | 铸造、增加、减少集中流动性仓位，收取手续费 | `sun liquidity v3:mint --token0 TRX --token1 USDT --amount0 1000000` |
| **V4 流动性** | V4 集中流动性操作，支持 Permit2 授权 | `sun liquidity v4:mint --token0 TRX --token1 USDT --amount0 1000000` |
| **合约交互** | 读取或写入任意 TRON 智能合约 | `sun contract read <address> balanceOf --args '[...]'` |

---

## SUN CLI vs SUN MCP Server

两个工具连接的是同一个 SunSwap 生态，但服务于不同的使用场景：

| 对比项 | SUN CLI | SUN MCP Server |
| :--- | :--- | :--- |
| **集成方式** | 命令行（Shell 调用） | MCP 协议（原生工具接口） |
| **适合场景** | 手动操作、脚本、CI/CD、AI Agent 通过 Shell 调用 | AI 助手通过 MCP 协议直接调用 |
| **调用方式** | 拼接命令 + 参数，解析文本/JSON 输出 | AI 客户端直接发送结构化工具调用，无需拼接命令 |
| **输出格式** | Table、JSON、TSV | 结构化 MCP 响应 |
| **写入操作** | 支持（需配置钱包） | 支持（需本地部署） |
| **免确认模式** | `--yes` 标志跳过确认 | AI 处理确认流程 |

:::tip 什么时候选哪个？
如果你的 AI 助手支持 MCP 协议（如 Claude），优先选 SUN MCP Server——集成更简洁，无需处理命令拼接和输出解析。如果你需要在 Shell 脚本、定时任务、CI/CD 流水线中使用，或者你的 AI Agent 不支持 MCP 协议，选 SUN CLI。
:::

---

## 输出模式

SUN CLI 支持三种输出格式，同时友好于人类和机器：

- **table** — 默认，人类友好的终端表格
- **json** — 紧凑的机器可读 JSON，适合脚本和 AI Agent
- **tsv** — Tab 分隔值，适合 Shell 管道

```bash
sun pool top-apy --page-size 5
```

```bash
sun --json wallet address
```

```bash
sun --output tsv token list --protocol V3
```

---

## 支持的网络

SUN CLI 支持以下三个 TRON 网络（默认连接主网）：

| 网络 | 标识符 | 用途 | 区块浏览器 |
| :--- | :--- | :--- | :--- |
| **主网** | `mainnet` | 生产环境，真实资产 | [tronscan.org](https://tronscan.org) |
| **Nile 测试网** | `nile` | 开发测试（推荐） | [nile.tronscan.org](https://nile.tronscan.org) |
| **Shasta 测试网** | `shasta` | 开发测试 | [shasta.tronscan.org](https://shasta.tronscan.org) |

通过 `--network` 标志指定目标网络。**强烈建议每次新操作先在 Nile 测试网上验证**——主网操作涉及真实资产，错误无法撤回。

---

## 安全注意事项

:::warning
DeFi 操作直接涉及链上资产，错误操作无法撤回。请牢记以下原则：

- **切勿硬编码私钥**：使用环境变量或 [agent-wallet](https://github.com/BofAI/agent-wallet) 的加密存储，不要在共享环境中使用命令行参数传递密钥。
- **先在测试网验证**：使用 `--network nile` 在主网执行前验证每个写操作。
- **最小资金原则**：CLI 配置的钱包只存放当前任务所需的最低金额。
- **使用 dry-run 模式**：高价值操作前运行 `--dry-run` 预览意图而不广播交易。
- **验证代币地址**：不使用内置符号时，仔细核对合约地址。
- **报价不等于保证**：在波动市场中，实际执行结果可能与报价不同。
:::

---

## 下一步

- 想最快速度上手？ → [快速开始](./QuickStart.md)
- 需要完整命令参考？ → [完整能力清单](./CommandGuide.md)
- 遇到问题？ → [常见问题与排查](./FAQ.md)
