---
title: 常见问题与排查
description: SUN MCP Server 的常见问题解答，涵盖连接、认证、DeFi 操作和故障排除。
---

# 常见问题与排查

本页面收集了使用 SUN MCP Server 时的常见问题及其解决方案。

## 连接问题

### MCP 客户端 "无法连接到 MCP 服务器"

**症状：** MCP 客户端 显示服务器未响应或连接被拒绝。

**解决步骤：**

1. **检查 Node.js 安装**
   ```bash
   node --version  # 应返回 v18+
   npm --version
   ```

2. **验证服务器运行**
   ```bash
   # 如果使用官方服务器
   npx -y @bankofai/sun-mcp-server
   
   # 如果使用本地部署
   npm start
   ```

3. **检查 JSON 格式**
   - 在 MCP 客户端 配置中验证 `stdio.json` 的 JSON 格式
   - 常见错误：末尾多余逗号、未匹配的括号

4. **重启 MCP 客户端**
   - 完全关闭应用程序
   - 清除缓存（方法取决于你使用的特定 MCP 客户端）
   - 重新启动应用程序

5. **检查服务器日志**
   ```bash
   # 如果使用官方服务器，启用详细日志
   DEBUG=* npx -y @bankofai/sun-mcp-server
   ```

**如果问题持续：** 查看 [官方服务器访问指南](OfficialServerAccess.md) 以获取最新的配置示例。

### HTTP 模式下"连接被拒绝"

**症状：** 尝试通过 HTTP 连接时出现连接被拒绝错误。

**常见原因和解决方案：**

1. **服务器未运行**
   ```bash
   # 启动服务器在 HTTP 模式
   sun-mcp-server --http --port 8080
   ```

2. **端口 8080 被占用**
   ```bash
   # 检查端口占用
   lsof -i :8080
   
   # 使用不同的端口
   sun-mcp-server --http --port 8081
   ```

3. **防火墙阻止连接**
   - 检查本地防火墙规则
   - 确保允许 localhost:8080 连接
   - 在 macOS 上：系统设置 > 安全与隐私 > 防火墙

4. **确认服务器地址**
   - 使用 `http://localhost:8080` 而非 `127.0.0.1:8080`
   - 确保没有拼写错误

### 工具列表中只有读取工具

**症状：** 无法看到 `sunswap_swap`、`sunswap_add_liquidity` 等写入工具。

**原因：** 未配置钱包。

**解决方案：**

1. **配置 [Agent Wallet](../../../Agent-Wallet/Intro)**（推荐）— 设置 `AGENT_WALLET_PASSWORD`

2. **或配置私钥（仅测试网）**
   ```bash
   export TRON_PRIVATE_KEY="your_64_hex_char_private_key"
   ```

3. **或配置助记词**
   ```bash
   export TRON_MNEMONIC="word1 word2 ... word12"
   ```

4. **重新启动服务器**并重新连接 MCP 客户端

验证配置成功的方式：查看 [完整能力清单](ToolList.md) 中的完整能力清单。

## 认证与密钥问题

### "私钥无效"错误

**症状：** 服务器拒绝提供的私钥。

**私钥格式要求：**
- 必须是 64 个十六进制字符（不包括 `0x` 前缀）
- 有效范围：`0x0000000000000000000000000000000000000000000000000000000000000001` 至 `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140`

**检查步骤：**
```bash
# 检查私钥长度
echo -n "your_private_key" | wc -c
# 应输出 64

# 检查是否为有效的十六进制
echo "your_private_key" | grep -E '^[0-9a-fA-F]{64}$'
# 如果有输出，则格式正确
```

**常见错误：**
- 包含 `0x` 前缀（移除它）
- 长度不足 64 字符（从导出工具获取完整密钥）
- 包含空格或特殊字符

### "Agent Wallet 密码错误"

**症状：** 服务器无法解密 Agent Wallet。

**解决步骤：**

1. **验证密码已设置**：运行 `[[ -n "$AGENT_WALLET_PASSWORD" ]] && echo "已设置" || echo "未设置"` 确认变量已设置（不会泄露密码明文）。
2. **检查钱包目录**：确认 `~/.agent-wallet/` 存在并包含钱包文件。如果使用了自定义目录，确保 `AGENT_WALLET_DIR` 指向正确路径。
3. **密码丢失**：需要重新初始化钱包。**警告：此操作会永久清除所有钱包和密钥——请务必提前转移资金或备份助记词。** 运行 `agent-wallet reset` 清除并重新开始——详见 [CLI 命令行手册 → 重置](../../../Agent-Wallet/Developer/CLI-Reference#agent-wallet-reset-reset-all-data)和 [Agent-Wallet 常见问题](../../../Agent-Wallet/FAQ)。含有特殊字符的密码是受支持的——设置环境变量时请使用单引号。


### "Conflicting wallet modes"

**症状：** 错误 "检测到冲突的钱包模式"。

**原因：** 同时设置了多个钱包环境变量。

**解决方案：** 仅设置以下之一：

```bash
# 选项 1：Agent Wallet（推荐用于生产）
export AGENT_WALLET_PASSWORD='your_password'
unset TRON_PRIVATE_KEY
unset TRON_MNEMONIC

# 选项 2：私钥（仅限测试网）
export TRON_PRIVATE_KEY='your_64_hex_chars'
unset AGENT_WALLET_PASSWORD
unset TRON_MNEMONIC

# 选项 3：助记词
export TRON_MNEMONIC='word1 word2 ... word12'
unset AGENT_WALLET_PASSWORD
unset TRON_PRIVATE_KEY
```

**验证配置：**
```bash
# 清除所有钱包相关环境变量
unset AGENT_WALLET_PASSWORD TRON_PRIVATE_KEY TRON_MNEMONIC

# 只设置一个
export AGENT_WALLET_PASSWORD='your_password'

# 重启服务器
sun-mcp-server
```

## DeFi 操作错误

### "兑换失败"

**症状：** `sunswap_swap` 调用返回错误。

**常见原因和解决方案：**

1. **余额不足**
   ```bash
   # 检查源代币余额
   sunswap_get_balances  # 列出所有余额
   ```
   - 确认有足够的源代币
   - 账户中的金额应包括 Gas 费用

2. **滑点容限过低**
   ```
   # 示例：2% 滑点容限可能不够
   增加到 3-5%
   ```
   - 波动市场中可能需要更高的容限
   - 但过高的容限增加了被抢先交易的风险

3. **代币不可交易**
   - 检查代币是否在 SunSwap 上列出
   - 某些新代币可能不支持交易
   - 验证代币合约地址是否正确

4. **流动性不足**
   ```
   使用 sunswap_quote_exact_input 检查可用流动性
   ```
   - 小额交易可能失败
   - 尝试更小的数量或使用多跳路由

**诊断步骤：**
```
1. 检查余额
2. 使用 sunswap_quote_exact_input 估计输出
3. 尝试使用更高的滑点容限
4. 检查网络状态
```

### "添加流动性失败"

**症状：** `sunswap_add_liquidity` 返回错误。

**常见原因和解决方案：**

1. **代币未授权**
   ```
   需要授权两个代币用于 SunSwap 合约
   ```
   - 调用 `sunswap_approve_token` 或 `permit2_approve`
   - 授予足够的金额
   - 两个代币都需要授权

2. **数量比例不合理**
   ```
   当前价格可能已变化
   减少滑点容限允许更大范围的比例
   ```
   - 检查池子的当前价格
   - 调整代币数量以匹配池子的比例
   - 或增加容限百分比

3. **金额太小**
   ```
   最小流动性要求可能未满足
   ```
   - 尝试增加金额
   - 检查 SunSwap 的最小头寸要求

4. **池子不存在**
   - 验证池子对是否在 SunSwap 上存在
   - 检查费用等级是否正确（V2：0.3%，V3：0.01%-1%）

**诊断提示：** 始终先验证余额和授权，再调用添加流动性。

### "Permit2 签名失败"

**症状：** Permit2 授权返回签名错误。

**解决步骤：**

1. **检查 Wallet 支持**
   ```bash
   # Agent Wallet 必须支持 signTypedData
   [[ -n "$AGENT_WALLET_PASSWORD" ]] && echo "已设置" || echo "未设置"
   ```

2. **验证签名数据**
   - 检查 Permit2 请求的结构化数据
   - 确认链 ID、代币地址、截止时间正确

3. **重新初始化 Wallet** — 运行 `agent-wallet reset` 清除并重新开始。详见 [CLI 命令行手册 → 重置](../../../Agent-Wallet/Developer/CLI-Reference#agent-wallet-reset-reset-all-data)。

4. **使用备用授权方法**
   ```
   如果 Permit2 持续失败，改用 sunswap_approve_token
   ```

### 交易显示"REVERT"状态

**症状：** 交易提交但在链上还原。

**常见原因：**

1. **余额在交易签署后减少**
   - 钱包可能同时参与其他交易
   - 间隔足够的时间确保提交

2. **滑点价格变化**
   - 交易排队期间价格已改变
   - 增加滑点容限重试

3. **合约状态改变**
   - 池子或代币合约已更新
   - 等待一个区块后重试

4. **授权不足**
   - Permit2 授权已过期或用尽
   - 重新授权后重试

5. **Gas 不足**
   - TRON 上不常见，但检查账户余额
   - 确保账户有足够的 TRX 作为 Gas

**调试提示：**
```
检查交易哈希在 https://tronscan.org 上的详细错误信息
```

## AI 行为问题

### AI 构造了无效代币地址

**症状：** AI 使用了不存在的代币地址，导致操作失败。

**解决方案：**

1. **在提示中提供准确的地址**
   ```
   请使用 USDT（TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t）
   ```

2. **使用官方代币列表**
   - 从 SunSwap 或 TronScan 获取地址
   - 始终验证地址格式（大小写和长度）

3. **让 AI 验证地址**
   ```
   在执行任何操作前，使用 sunswap_get_token_price 
   验证代币是否存在
   ```

### AI 尝试调用不存在的工具

**症状：** AI 调用了 `invalid_tool_name` 等不存在的工具。

**解决方案：**

1. **参考官方工具列表**
   - 查阅 [SUN MCP Server 工具列表](ToolList.md)
   - 提供正确的工具名称给 AI

2. **提示中明确列出工具**
   ```
   可用的兑换工具包括：
   - sunswap_swap
   - sunswap_quote_exact_input
   - sunswap_quote_exact_output
   ```

3. **简化请求**
   - 请求单个操作而非复杂的多步骤工作流
   - AI 会更可靠地调用正确的工具

### 响应速度较慢

**症状：** 查询数据或执行操作需要很长时间。

**优化步骤：**

1. **简化工作流**
   - 减少多工具协调的步骤数
   - 避免大量连续查询

2. **使用本地服务器**
   - 参考 [本地私有化部署](LocalPrivatizedDeployment.md)
   - 可能比官方服务器更快（取决于网络）

3. **批量操作**
   ```
   合并相关查询以减少往返次数
   ```

## 通用问题

### 主网、Nile 和 Shasta 有什么区别？

| 特性 | 主网（Mainnet） | Nile 测试网 | Shasta 测试网 |
|------|---|---|---|
| **用途** | 生产环境 | 官方测试 | 社区测试 |
| **网络参数** | `mainnet` | `nile` | `shasta` |
| **真实价值** | 是 | 否（测试 TRX） | 否（测试 TRX） |
| **交易最终性** | 立即 | 立即 | 立即 |
| **推荐用途** | 生产 DeFi | 开发和测试 | 实验 |
| **稳定性** | 最高 | 高 | 中等 |
| **获取测试 TRX** | 不适用 | [Nile Faucet](https://nile.trongrid.io/join/getjoined) | [Shasta Faucet](https://shasta.trongrid.io/join/getjoined) |

**最佳实践：**
- 开发时始终使用 Nile
- 最终测试在 Shasta
- 仅在充分验证后迁移到主网

### 能否同时使用多个 MCP Server 实例？

**是的。** 例如，可以同时运行官方主网服务器和本地 Nile 实例。

**配置示例（MCP 客户端）：**

```json
{
  "mcpServers": {
    "sun-mainnet": {
      "command": "npx",
      "args": ["-y", "@bankofai/sun-mcp-server"],
      "env": {
        "TRON_NETWORK": "mainnet",
        "AGENT_WALLET_PASSWORD": "your_mainnet_password"
      }
    },
    "sun-nile": {
      "command": "sun-mcp-server",
      "args": ["--port", "8081"],
      "env": {
        "TRON_NETWORK": "nile",
        "TRON_PRIVATE_KEY": "your_testnet_private_key"
      }
    }
  }
}
```

**注意：** 分别为每个实例使用不同的钱包凭证，以避免混淆。

### 如何更新到最新版本？

**使用 npx（推荐）：**
```bash
# npx 自动获取最新版本
npx -y @bankofai/sun-mcp-server

# 强制清除缓存并获取最新版本
npx --clear-cache -y @bankofai/sun-mcp-server
```

**使用本地安装：**
```bash
# 更新全局安装
npm install -g @bankofai/sun-mcp-server

# 或在项目中更新
npm update @bankofai/sun-mcp-server
```

**使用 Git 仓库：**
```bash
# 克隆或更新仓库
git clone https://github.com/BofAI/sun-mcp-server.git
cd sun-mcp-server

# 拉取最新代码
git pull

# 安装依赖和启动
npm install
npm start
```

### 工具太多导致 LLM 上下文溢出？

**症状：** Claude 报告 token 限制被超出或工具列表太长。

**解决方案：使用工具过滤：**

```bash
# 仅启用特定工具（白名单）
sun-mcp-server --whitelist sunswap_swap,sunswap_get_balances,sunswap_quote_exact_input

# 排除某些工具（黑名单）
sun-mcp-server --blacklist getUserPositions,getPoolVolHistory
```

**优化提示：**
- 为不同任务创建多个服务器实例
- 使用白名单仅加载必要工具
- 定期清理未使用的工具配置

### 支持哪个 MCP 协议版本？

**SUN MCP Server 支持 MCP 1.10.2 及更高版本。**

**验证版本：**
```bash
# 检查依赖中的版本
npm list @modelcontextprotocol/sdk

# 应输出类似：
# @modelcontextprotocol/sdk@1.10.2
```

**升级 MCP SDK：**
```bash
npm update @modelcontextprotocol/sdk
```

---

## 获取更多帮助

- **GitHub Issues：** https://github.com/BofAI/sun-mcp-server/issues
- **完整能力清单：** 查阅 [完整能力清单](ToolList.md) 
- **本地部署：** 参考 [本地私有化部署](LocalPrivatizedDeployment.md)
- **官方服务器：** 参考 [官方云服务接入](OfficialServerAccess.md)
