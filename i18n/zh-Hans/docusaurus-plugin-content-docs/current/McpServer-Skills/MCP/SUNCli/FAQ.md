# 常见问题

SUN CLI 常见问题和故障排查。

---

## 安装与配置

### 系统要求是什么？

- **Node.js** 20.0.0 或更高版本
- **npm**（随 Node.js 一起安装）
- 终端或 Shell 环境（macOS、Linux 或 Windows WSL）

### 如何更新 SUN CLI？

```bash
npm update -g @bankofai/sun-cli
```

---

## 钱包与配置

### 提示"No wallet configured"怎么办？

写入操作（swap、liquidity、contract send）需要钱包。设置以下钱包源之一：

- `AGENT_WALLET_PRIVATE_KEY` — 直接提供私钥
- `AGENT_WALLET_MNEMONIC` — 助记词
- `AGENT_WALLET_PASSWORD` — 通过 agent-wallet 的加密钱包

或者使用根级标志（`-k`、`-m`、`-p`）为单次调用提供钱包。详见 [agent-wallet 快速开始](https://github.com/BofAI/agent-wallet?tab=readme-ov-file#quick-start)。

### 不配置钱包能用吗？

可以。所有只读命令无需任何钱包配置：价格查询、兑换报价、池子数据、协议统计、代币搜索等等。

### 我的私钥安全吗？

SUN CLI 永远不会将你的私钥上传到任何远程服务。所有签名都在本地完成。但要注意命令行标志（`-k`、`-m`）可能出现在 Shell 历史记录中。建议使用环境变量或 agent-wallet 的加密存储。

---

## 常见错误

### `unknown command 'nile'`

`--network` 等根级标志必须放在**子命令之前**：

```bash
# 正确
sun --network nile swap TRX USDT 1000000

# 错误——'nile' 被解析为命令
sun swap TRX USDT 1000000 --network nile
```

使用 npm scripts 时，在 `--` 后传递参数：

```bash
npm run start -- --network nile swap TRX USDT 1000000
```

### `Swap failed`

常见原因：

- 钱包未配置
- 不支持的代币符号或无效地址
- 余额不足
- RPC 或路由 API 故障
- 路径参数过期或无效

**建议：** 先运行 `swap:quote` 验证路径，确认报价合理后再使用 `--yes` 重试。

### 交易成功但结果不符预期

- **滑点**：在波动市场中，实际输出可能与报价不同。通过 `--slippage` 调整滑点容忍度。
- **代币精度**：金额以代币最小单位指定。TRX（6 位精度），`1000000` = 1 TRX。
- **网络不匹配**：确保你在目标网络上。用 `sun wallet address` 检查。

---

## AI Agent 集成

### AI Agent 能使用 SUN CLI 吗？

可以。SUN CLI 专为人类和 AI 驱动的工作流设计。自动化相关的关键特性：

- `--json` 输出提供机器可读响应
- `--yes` 标志跳过确认提示
- `--dry-run` 预览操作而不执行
- `--fields` 过滤输出到指定字段
- 退出码用于脚本中的错误处理

### SUN CLI 和 SUN MCP Server 有什么区别？

SUN CLI 是直接调用的命令行工具。SUN MCP Server 是一个 MCP 兼容的服务器，AI 客户端（如 Claude）通过它进行自然语言 DeFi 交互。两者访问的是同一个 SunSwap 生态。脚本和自动化选 CLI，AI 辅助工作流选 MCP Server。

---

## 网络与代币

### 支持哪些网络？

主网、Nile 测试网和 Shasta 测试网。默认为主网。使用 `--network nile` 或 `--network shasta` 进行测试。

### 如何使用内置列表之外的代币？

使用代币的完整 TRON 合约地址代替符号：

```bash
sun price --address TYourTokenAddress
```

```bash
sun swap TYourTokenAddress TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t 1000000
```

### 可以使用自定义 RPC 端点吗？

可以。设置 `TRON_RPC_URL` 环境变量：

```bash
export TRON_RPC_URL=https://your-tron-rpc.example
```

---

## 还有其他问题？

如果这里没有覆盖你的问题，查看 [命令指南](./CommandGuide.md) 了解详细用法，或在 [GitHub 仓库](https://github.com/nicholaskarlson/sun-cli) 提交 Issue。
