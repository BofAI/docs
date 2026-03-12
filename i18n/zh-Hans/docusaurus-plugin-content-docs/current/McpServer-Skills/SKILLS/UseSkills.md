# 如何使用 SKILLS

Skills 支持集成至 OpenClaw、ClawdCode、OpenCode 等多种 AI Agents。本文以 OpenClaw 为例说明如何使用 skills。

在开始前，请确保您已完成 OpenClaw 的安装，并下载 [OpenClaw 扩展](https://github.com/BofAI/openclaw-extension)，按其文档完成了 MCP Server 的基础配置。


## 安装 (Installation)

### 选项 1：OpenClaw 扩展（推荐）

如果你使用 OpenClaw，最快的方法是安装 OpenClaw 扩展：

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

该扩展有助于：
*   克隆技能仓库。
*   设置通用的 MCP 服务器。
*   配置受支持的技能。

### 选项 2：手动安装

对于 ClawdCode、OpenCode 或任何其他兼容 MCP 的平台：

1.  安装你的 AI 智能体平台。
2.  配置工作流所需的 MCP 服务器。
3.  克隆本仓库。
4.  将你的智能体指向 `skills/` 目录，或直接引用特定的 `SKILL.md`。

```bash
git clone https://github.com/BofAI/skills.git
cd skills/skills
```



## 快速开始

### 1. 浏览可用技能

当前可用的技能：

- **sunswap/** - SunSwap DEX 技能，用于余额查询、报价、兑换及流动性相关工作流。
- **8004-skill/** - ERC-8004 技能，用于链上智能体身份、信任、验证和注册工作流。
- **x402-payment/** - x402 支付技能，用于在受支持的链上调用付费智能体和付费 API。
- **x402-payment-demo/** - 端到端 x402 受保护资源访问的演示工作流。
- **ainft-skill/** - 本地 AINFT 技能，用于余额查询和账户相关查询。

### 2. 如何使用一个技能？

使用技能非常简单，你不需要编写复杂的代码，只需要像平时聊天一样下达指令即可。

### 方式一：显式指令
如果你知道某个技能的路径，可以直接告诉 AI 去阅读并执行。这在调试或执行特定任务时非常高效。

**示例：SunSwap 兑换查询**
你只需要对 AI 说：
> “请阅读 `skills/sunswap/SKILL.md` 并帮我查看 100 USDT 可以兑换多少 TRX。”

**AI 收到指令后会立即：**
1.  **精准定位**：跳过搜索，直接打开指定的 `SKILL.md`。
2.  **规则内化**：读懂 SunSwap 的 API 调用逻辑和兑换公式。
3.  **自动化执行**：调用后台脚本查询实时汇率。
4.  **结果交付**：告诉你“100 USDT 当前可兑换约 XXX TRX”。

### 方式二：隐式触发
当你已经安装了相关的技能包，你甚至不需要提到“技能”二字，AI 会根据你的意图自动激活它。

**示例：SunSwap 兑换查询**
你只需要对 AI 说：
> “帮我查一下现在 100 USDT 在 SunSwap 能换多少 TRX。”

**AI 内部的动作：**
*   **意图识别**：AI 捕捉到关键词“SunSwap”、“兑换”、“USDT/TRX”。
*   **自动匹配**：AI 扫描“名片库”，发现 `sunswap` 技能的描述完全匹配。
*   **无感激活**：后台自动加载 `skills/sunswap/SKILL.md` 并执行查询脚本。
*   **智能回复**：直接给出结果。

### 如何让 AI 用得更好？
*   **提供清晰的上下文**：比如”使用 `xxx` 技能处理 `yyy` 任务”。
*   **指定参数**：如果技能需要特定信息（如金额、币种、日期），在指令中一次性给全，能显著提高成功率。


### 3. 各技能使用示例

#### sunswap
> 请阅读 `skills/sunswap/SKILL.md`，帮我查看 100 USDT 在 SunSwap 上能兑换多少 TRX。

#### 8004-skill
> 请阅读 `skills/8004-skill/SKILL.md`，查询 TRON 主网上智能体 1:8 的链上注册详情。

#### x402-payment
> 请阅读 `skills/x402-payment/SKILL.md`，使用 x402 协议调用这个付费智能体端点。

#### x402-payment-demo
> 请阅读 `skills/x402-payment-demo/SKILL.md`，端到端运行一次 x402 支付演示流程。

#### ainft-skill
> 请阅读 `skills/ainft-skill/SKILL.md`，查询该账户当前的 AINFT 余额和最近的订单。

