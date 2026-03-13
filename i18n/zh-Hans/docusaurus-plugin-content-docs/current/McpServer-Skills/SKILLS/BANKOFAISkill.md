# BANK OF AI Skills

BANK OF AI Skills 是一组为 AI 智能体设计的可复用技能包。每个技能封装了特定领域的知识（如 DEX 交易、链上数据查询、支付协议等），以 `SKILL.md` 为核心，为智能体提供分步操作指引、可执行脚本和常见使用模式的示例，让智能体能够像专业用户一样完成链上操作。

BANK OF AI Skills 支持集成至 OpenClaw、Claude Code、Claude Desktop、Cursor 等兼容 MCP 的 AI Agents。你无需编写代码，只需用自然语言描述任务，智能体便会自动匹配并执行对应的技能。

:::warning 安全前置声明 — 请在使用任何 Skill 之前阅读
BankOfAI Skills 可以操作**真实的链上资产**。区块链交易一旦上链**不可撤销**，没有"撤销"按钮，没有客服回滚，转错地址的资金也无法追回。在你开始之前，请牢记三条铁律：

1. **私钥永远不要出现在聊天窗口、提示词或配置文件中。** 只通过环境变量传递（如 `TRON_PRIVATE_KEY`、`PRIVATE_KEY`）。不要将私钥粘贴到任何 AI 对话中，不要硬编码在脚本里，更不要提交到版本控制系统。一旦私钥意外泄露，请立即更换。
2. **先测试网，后主网。** 每一个新操作——无论是兑换、转账还是添加流动性——都必须先在 Nile 或 Shasta 测试网上验证通过，再切换到主网执行。测试网代币没有真实价值，你可以放心实验，不会产生任何经济损失。
3. **写操作必须人工确认。** Agent 执行任何链上交易前，应向你展示完整的操作详情——包括接收地址、代币类型、数量、预估手续费和滑点——并等待你的明确确认后才能广播交易。切勿对写操作启用自动执行。
:::


## 技能列表

以下是当前可用的技能，涵盖 DEX 交易、链上数据查询、支付协议和 NFT 等场景：

| SKILL | 功能 | 
| :--- | :--- | 
| **x402-payment** | x402 支付技能，用于在受支持的链上调用付费智能体和付费 API。 | 
| **sunswap** | SunSwap DEX 技能，用于余额查询、报价、兑换及流动性相关工作流。 | 
| **tronscan-skill** | 通过 TronScan API 进行 TRON 区块链数据查询，支持账户、交易、代币、区块及全网统计。 | 


## 快速开始

以 `OpenClaw + OpenClaw 扩展` 为例。

### 1. 安装

安装 [OpenClaw 扩展](https://github.com/BofAI/openclaw-extension)，它会自动安装集成层、连接 MCP 服务器并安装技能仓库。

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

如果你希望先检查安装脚本再运行：

```bash
git clone https://github.com/BofAI/openclaw-extension.git
cd openclaw-extension
./install.sh
```

### 2. 验证

安装完成后，验证技能仓库是否可用。

检查本地技能目录：

```bash
ls ~/.openclaw/skills
```

你应该能看到 `sunswap`、`x402-payment`、`x402-payment-demo`、`tronscan-skill` 等条目。

然后在 OpenClaw 中通过提示词验证：

```text
阅读 sunswap 技能，告诉我这个技能能做什么。
```

### 3. 首次使用

从一个简单的只读工作流开始。调用技能有两种方式：

**显式调用** — 直接告诉智能体要读取哪个技能文件。适用于你已知目标技能或需要确定性行为的场景：

```text
阅读 sunswap 技能，帮我查看 100 USDT 在 SunSwap 上能兑换多少 TRX。
```

**隐式触发** — 描述任务，让智能体自动匹配并激活对应技能。适用于技能已安装且请求能明确对应某个工作流的场景：

```text
帮我查一下现在 100 USDT 在 SunSwap 能换多少 TRX。
```

:::tip 使用建议
*   **提供清晰的上下文**：比如"使用 `xxx` 技能处理 `yyy` 任务"。
*   **指定参数**：如果技能需要特定信息（如金额、币种、日期），在指令中一次性给全，能显著提高成功率。
*   **从只读操作开始**：首次使用建议先从查询类操作入手（如余额查询、价格报价），熟悉技能运作方式后再尝试写操作（如兑换、转账）。
:::


## 其他平台安装

### OpenClaw

OpenClaw 提供最完整的集成体验，自动连接技能和 MCP 依赖。

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

### Claude Code

1.  克隆仓库：
    ```bash
    git clone https://github.com/BofAI/skills.git /tmp/bofai-skills
    ```
2.  将技能复制到 Claude Code 配置目录以实现自动发现：
    ```bash
    mkdir -p ~/.config/claude-code/skills
    cp -r /tmp/bofai-skills/* ~/.config/claude-code/skills/
    ```
3.  Claude Code 启动时将自动加载这些技能。

### Cursor

1.  将仓库克隆到项目根目录：
    ```bash
    git clone https://github.com/BofAI/skills.git .cursor/skills
    ```
2.  如需项目范围内可用，可将技能路径添加到 `.cursorrules`，或在 Cursor Chat 中使用 `@` 符号引用特定的 `SKILL.md` 文件来提供上下文。




## 各技能使用示例

### 操作类型说明

- 🟢 **Read** — 只读查询，不会产生链上交易  
- ⚠️ **Write** — 会发起链上交易（需要用户确认）

---

### x402-payment

**调用付费端点（⚠️ Write）：**
> 使用 x402 协议调用这个付费智能体端点。

---

### sunswap

**余额查询（🟢 Read）：**
> 帮我查看我在 SunSwap 上的 TRX 和 USDT 余额。

**价格查询（🟢 Read）：**
> TRX 当前的价格是多少？

**兑换报价（🟢 Read）：**
> 100 USDT 在 SunSwap 上能兑换多少 TRX？

**执行兑换（⚠️ Write）：**
> 在 SunSwap 上将 100 TRX 兑换为 USDT。

**流动性操作（⚠️ Write）：**
> 在 SunSwap V2 池中添加 100 TRX 和 15 USDT 的流动性。

---

### tronscan-skill

**账户查询（🟢 Read）：**
> 帮我查询地址 TXXXXXXXXXXXXXXXXXXXXXXX 的账户信息。

**钱包组合（🟢 Read）：**
> 显示该地址的钱包组合和 USD 估值。

**交易验证（🟢 Read）：**
> 查询这笔交易哈希的详情和执行状态。

**代币排名（🟢 Read）：**
> 显示市值排名前 10 的 TRC20 代币。

**全网概览（🟢 Read）：**
> 给我一份 TRON 全网概览 — 交易吞吐量、超级代表和供应量指标。

## 安全规范

链上操作不可逆，以下不是建议，是**必须遵守的规则**。

### 私钥管理

```
✗ 永远不要这样做：
"用私钥 a]K9x...z3 帮我执行兑换"    → 私钥暴露在聊天记录/日志中

✓ 正确做法：
export TRON_PRIVATE_KEY="你的私钥"    → 通过环境变量传递
```

原则：**私钥绝不出现在提示词、配置文件、聊天记录中的任何地方。** Agent 应通过环境变量或安全密钥管理服务获取。

### 网络环境隔离

| 操作阶段 | 推荐网络 | 说明 |
|---------|---------|------|
| 首次使用/学习 | Nile 测试网 | 零成本试错，随便玩 |
| 功能验证 | Shasta 测试网 | 更接近主网环境 |
| 正式操作 | 主网 | 确认无误后再切换 |

切换网络时务必**显式声明**，避免 Agent 在错误的网络上执行交易：

```text
"切换到 TRON 主网，然后帮我查询余额。"
```

### DeFi 操作安全

- **滑点保护**：执行 Swap 时务必设置滑点容忍度（建议 0.5%–1%），防止价格波动导致损失
- **先报价再执行**：任何兑换操作，先让 Agent 查询报价，确认价格合理后再执行
- **大额拆分**：大额交易建议拆分成多笔小额执行，降低单笔滑点风险
- **授权管理**：定期检查代币授权（Approve），撤销不再使用的授权

### 操作确认清单

对于任何**写操作**，Agent 应在执行前向用户确认以下信息：

1. 操作类型（Swap / 添加流动性 / 转账等）
2. 涉及的代币和金额
3. 当前网络（测试网 / 主网）
4. 预估 Gas 费用
5. 滑点设置

**用户明确确认后才执行。**


## 最佳实践

### 给指令的技巧

**一次性给全参数**，减少 Agent 的猜测和追问：

```text
# 不好 → Agent 需要反复追问
"帮我换点币。"

# 好 → 所有关键信息一步到位
"在 SunSwap 上将 100 USDT 兑换为 TRX，滑点设为 0.5%，使用主网。"
```

### 推荐的学习路径

```
1. 只读查询        → 熟悉 Skill 的交互方式
   ↓
2. 测试网写操作     → 验证完整流程，零风险
   ↓
3. 主网小额操作     → 确认一切正常
   ↓
4. 主网正式使用     → 日常操作
```

### 常见排障

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| Agent 说"找不到技能" | 技能文件未放到正确目录 | 检查安装路径，参考安装章节 |
| Agent 行为与预期不符 | 隐式触发匹配到了错误的技能 | 改用显式调用 |
| 链上交易失败 | Gas 不足 / 滑点过低 / 网络错误 | 检查余额、调整滑点、确认网络 |
| 报价与实际成交差异大 | 流动性不足或市场波动 | 减小交易金额，或等待市场稳定 |





