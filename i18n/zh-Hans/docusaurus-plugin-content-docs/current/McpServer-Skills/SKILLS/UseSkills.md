# 如何使用 SKILLS

Skills 支持集成至 OpenClaw、ClawdCode、OpenCode 等多种 AI Agents。本文以 OpenClaw 为例说明如何使用 skills。

在开始前，请确保您已完成 OpenClaw 的安装，并下载 [OpenClaw 扩展](https://github.com/BofAI/openclaw-extension)，按其文档完成了 MCP Server 的基础配置。


## 兼容平台与安装指南

Agent Skills 广泛支持各种支持 **MCP (Model Context Protocol)** 的 AI 智能体平台。

### 兼容的 AI 智能体
*   **ClawdCode**：强大的 AI 编程助手。
*   **OpenCode**：开源的 AI 开发环境。
*   **OpenClaw**：灵活的 AI 代理框架。
*   以及其他所有支持 MCP 协议的 AI 平台。

### 快速安装示例 (以 OpenClaw 为例)
只需简单两步即可完成配置：
1.  **安装 AI 代理** (如 OpenClaw)。
2.  **安装 OpenClaw 扩展**：在终端运行以下指令：
    ```bash
    curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
    ```

### 其他 AI 代理平台配置
如果你使用的是 ClawdCode 或 OpenCode 等平台：
1.  **安装你的 AI 代理**。
2.  **手动配置 MCP 服务器** (参考各平台的 MCP 服务器文档)。
3.  **克隆技能库到本地**：
    ```bash
    git clone https://github.com/BofAI/skills.git
    ```
4.  **让 AI 代理指向技能目录**，或在需要时直接引用具体的 `SKILL.md` 文件。



## 快速开始

### 1. 浏览可用技能

当前可用的技能：

- **sunswap/** - SunSwap DEX 交易技能，用于代币兑换
- **8004/** - 8004 可信智能体 - AI 智能体的链上身份和信誉系统
- **x402-payment/** - 在区块链网络上启用智能体支付功能（x402 协议）
- **x402-payment-demo/** - x402 支付协议演示

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
*   **提供清晰的上下文**：比如“使用 `xxx` 技能处理 `yyy` 任务”。
*   **指定参数**：如果技能需要特定信息（如金额、币种、日期），在指令中一次性给全，能显著提高成功率。
  
