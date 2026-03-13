# 如何使用 SKILLS

**Skill（技能）** 是 AI 智能体可以用来完成特定任务的可复用能力。每个技能封装了特定领域的知识（例如如何使用 SunSwap DEX），为智能体提供分步操作指引，并包含常见使用模式的示例。

Skills 支持集成至 OpenClaw、Claude Code、Claude Desktop、Cursor 等兼容 MCP 的 AI Agents。


## 快速开始

本节以 `OpenClaw + OpenClaw 扩展` 为例，这是本仓库的主要安装路径。

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

你应该能看到 `sunswap`、`x402-payment`、`x402-payment-demo`、`ainft-skill` 等条目。

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


## 在其他平台上安装

如果你不使用 OpenClaw，通用模式如下：

1.  安装或配置你的 AI 智能体。
2.  配置工作流所需的 MCP 服务器。
3.  将技能仓库克隆到本地。
4.  让智能体读取目标 `SKILL.md`。

如果平台不支持专用技能目录，请在提示词中显式引用 `SKILL.md` 文件。

### Claude Code

```bash
git clone https://github.com/BofAI/skills.git ~/.bofai/skills
```

然后使用显式提示词指向技能文件：

```text
请阅读 ~/.bofai/skills/skills/sunswap/SKILL.md，帮我查看 100 USDT 能兑换多少 TRX。
```

### Claude Desktop

克隆仓库：

```bash
git clone https://github.com/BofAI/skills.git ~/.bofai/skills
```

使用方式：
*   在平台的本地集成入口中配置 MCP 服务器。
*   将本仓库保存在本地磁盘。
*   显式告诉智能体要读取哪个 `SKILL.md`。

```text
请阅读 ~/.bofai/skills/skills/sunswap/SKILL.md，帮我查看 100 USDT 能兑换多少 TRX。
```

### Cursor

```bash
git clone https://github.com/BofAI/skills.git ~/.bofai/skills
```

然后在 Cursor 聊天中指向本地技能文件，或者打开仓库让它读取 `skills/<技能名>/SKILL.md`：

```text
请阅读 skills/x402-payment/SKILL.md，说明需要配置哪些环境变量。
```

### 手动安装（通用）

适用于任何没有专用安装器的 MCP 兼容平台：

```bash
git clone https://github.com/BofAI/skills.git ~/.bofai/skills
```

然后：
1.  自行配置所需的 MCP 服务器。
2.  如果平台支持技能目录，将其指向 `~/.bofai/skills/skills`。
3.  否则，在提示词中直接引用 `SKILL.md` 文件。



## 技能列表

| SKILL | 功能 |
| :--- | :--- |
| **sunswap** | SunSwap DEX 技能，用于余额查询、报价、兑换及流动性相关工作流。 |
| **x402-payment** | x402 支付技能，用于在受支持的链上调用付费智能体和付费 API。 |
| **x402-payment-demo** | 端到端 x402 受保护资源访问的演示工作流。 |
| **ainft-skill** | 本地 AINFT 技能，用于余额查询和账户相关查询。 |


## 各技能使用示例

#### sunswap
> 请阅读 `skills/sunswap/SKILL.md`，帮我查看 100 USDT 在 SunSwap 上能兑换多少 TRX。

#### x402-payment
> 请阅读 `skills/x402-payment/SKILL.md`，使用 x402 协议调用这个付费智能体端点。

#### x402-payment-demo
> 请阅读 `skills/x402-payment-demo/SKILL.md`，端到端运行一次 x402 支付演示流程。

#### ainft-skill
> 请阅读 `skills/ainft-skill/SKILL.md`，查询该账户当前的 AINFT 余额和最近的订单。


## 安全注意事项

*   **切勿硬编码私钥**：不要在提示词或配置中直接写入私钥，请始终使用环境变量。
*   **测试网与主网**：注意区分网络环境，建议先在测试网上验证后再切换到主网操作。
*   **滑点保护**：使用 DeFi 相关技能（如兑换）时，务必设置合适的滑点容忍度，防止因价格波动造成损失。
*   **确认 Gas/手续费**：确保账户中有足够的 TRX 或原生代币用于支付交易手续费。
