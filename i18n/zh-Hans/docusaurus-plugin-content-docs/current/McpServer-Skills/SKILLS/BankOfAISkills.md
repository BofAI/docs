# BANK OF AI Skills

BANK OF AI Skills 是一组为 AI 智能体设计的可复用技能包。每个技能封装了特定领域的知识（如 DEX 交易、链上数据查询、支付协议等），以 `SKILL.md` 为核心，为智能体提供分步操作指引、可执行脚本和常见使用模式的示例，让智能体能够像专业用户一样完成链上操作。

BANK OF AI Skills 支持集成至 OpenClaw、Claude Code、Claude Desktop、Cursor 等兼容 MCP 的 AI Agents。你无需编写代码，只需用自然语言描述任务，智能体便会自动匹配并执行对应的技能。

:::tip 安全注意事项
*   **切勿硬编码私钥**：不要在提示词或配置中直接写入私钥，请始终使用环境变量。
*   **测试网与主网**：注意区分网络环境，建议先在测试网上验证后再切换到主网操作。
*   **滑点保护**：使用 DeFi 相关技能（如兑换）时，务必设置合适的滑点容忍度，防止因价格波动造成损失。
:::


## 技能列表

以下是当前可用的技能，涵盖 DEX 交易、链上数据查询、支付协议和 NFT 等场景：

| SKILL | 功能 |
| :--- | :--- |
| **x402-payment** | x402 支付技能，用于在受支持的链上调用付费智能体和付费 API。 |
| **ainft-skill** | 本地 AINFT 技能，用于余额查询和账户相关查询。 |
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

你应该能看到 `sunswap`、`x402-payment`、`x402-payment-demo`、`ainft-skill`、`tronscan-skill` 等条目。

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

### x402-payment
> 使用 x402 协议调用这个付费智能体端点。

### ainft-skill
> 帮我查询该账户当前的 AINFT 余额和最近的订单。

### sunswap

**余额查询：**
> 帮我查看我在 SunSwap 上的 TRX 和 USDT 余额。

**价格查询：**
> TRX 当前的价格是多少？

**兑换报价：**
> 100 USDT 在 SunSwap 上能兑换多少 TRX？

**执行兑换：**
> 在 SunSwap 上将 100 TRX 兑换为 USDT。

**流动性：**
> 在 SunSwap V2 池中添加 100 TRX 和 15 USDT 的流动性。

### tronscan-skill

**账户查询：**
> 帮我查询地址 TXXXXXXXXXXXXXXXXXXXXXXX 的账户信息。

**钱包组合：**
> 显示该地址的钱包组合和 USD 估值。

**交易验证：**
> 查询这笔交易哈希的详情和执行状态。

**代币排名：**
> 显示市值排名前 10 的 TRC20 代币。

**全网概览：**
> 给我一份 TRON 全网概览 — 交易吞吐量、超级代表和供应量指标。





