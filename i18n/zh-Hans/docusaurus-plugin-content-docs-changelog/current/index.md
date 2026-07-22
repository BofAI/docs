---
title: '更新日志'
description: 'BANK OF AI 各产品的更新与公告——全部产品，按时间倒序。'
---

# 更新日志

BANK OF AI 各产品的更新与公告。

<div className="changelog-entry">
<div className="changelog-date">2026-07-21</div>
<div className="changelog-body">

### 文档

<div className="changelog-tags"><span className="changelog-tag">产品更新</span><span className="changelog-tag">文档</span><span className="changelog-tag">x402</span></div>

- **TRON 网络标识符全面改用 CAIP-2 格式**——`tron:0x2b6653dc`（主网）、`tron:0xcd8690dc`（Nile）、`tron:0x94a9059e`（Shasta）。应用代码中建议使用 SDK 常量 `TRON_MAINNET` / `TRON_NILE` / `TRON_SHASTA`，而不是硬编码十六进制字符串。[网络与代币支持](../x402/core-concepts/network-and-token-support/)
- **移除 `auth-capture` 方案**——x402 现记录四种支付方案：`exact`、`upto`、`batch-settlement` 与 `exact_gasfree`（TRON）。[SDK 功能](../x402/sdk-features/)
- **x402 快速开始精简**——买家与卖家两篇均已简化。
- **新增模型**：LLM Service 增加 Kimi K3 定价文档。
- **BANK OF AI 简介重写**——围绕"你的 AI 究竟多了什么"重新组织，配四项能力概览与端到端执行示例。
- **新增板块——最佳实践**：产品文档之外的动手演练与操作习惯沉淀。[阅读第一篇](../devnotes/first-onchain-swap/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-07-17</div>
<div className="changelog-body">

### 文档

<div className="changelog-tags"><span className="changelog-tag">产品更新</span><span className="changelog-tag">文档</span></div>

- **新增 x402 CLI 文档集**：概览、快速开始、完整命令参考与 FAQ，中英双语。[查看文档](../x402/cli/)
- **文档站升级**：离线全文搜索（⌘K）、更新日志页签、板块图标、更清爽的侧边栏布局。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-07-15</div>
<div className="changelog-body">

### x402 CLI

<div className="changelog-tags"><span className="changelog-tag">新版本</span><span className="changelog-tag">x402</span><span className="changelog-tag">CLI</span></div>

- **`v1.0.0` 首个正式版发布**——`@bankofai/x402-cli`，用于 x402 支付的 TypeScript 命令行客户端：`pay` 支付任意受保护 URL、`serve` 启动本地付费端点、`roundtrip` 端到端冒烟测试，以及管理 provider 文件与服务目录的 `gateway` / `catalog`。
- 基于已发布的 `@bankofai/x402-core` / `x402-evm` / `x402-tron` SDK 1.0 包构建；`scheme=exact` 配合 Permit2。
- 支持网络：TRON（`tron:mainnet` / `tron:nile` / `tron:shasta`）与 BSC（`eip155:56` / `eip155:97`）。[快速开始](../x402/cli/quickstart/)

</div>
</div>
<div className="changelog-entry">
<div className="changelog-date">2026-07-10</div>
<div className="changelog-body">

### SKILLS · LLM Service

<div className="changelog-tags"><span className="changelog-tag">更新</span><span className="changelog-tag">新模型</span><span className="changelog-tag">x402</span></div>

- **SKILLS**——新增 TRON 上 **`exact_gasfree` 方案**的说明，同时 API 目录更换为新地址。如果你锁定了旧版本，需要重新安装。[详情](./skills/)
- **LLM Service**——新增 **GPT-5.6** 系列：`sol`、`terra`、`luna`。[详情](./llm-service/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-07-02</div>
<div className="changelog-body">

### LLM Service

<div className="changelog-tags"><span className="changelog-tag">新模型</span></div>

- 新增 **Claude Fable 5** 与 **Claude Sonnet 5**，定价完整。[详情](./llm-service/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-06-19</div>
<div className="changelog-body">

### LLM Service

<div className="changelog-tags"><span className="changelog-tag">新模型</span><span className="changelog-tag">定价</span></div>

- 新增 **GLM-5.2**。
- 修正 **Qwen 缓存读取价格**——按旧数字估算过成本的话需要重新核对。[详情](./llm-service/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-06-13</div>
<div className="changelog-body">

### LLM Service

<div className="changelog-tags"><span className="changelog-tag">移除</span></div>

- 废弃模型已从模型列表和定价页移除，继续调用这些模型名会直接报错。[详情](./llm-service/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-06-01</div>
<div className="changelog-body">

### LLM Service

<div className="changelog-tags"><span className="changelog-tag">新模型</span></div>

- 新增 **MiniMax M3** 与 **Claude Opus 4.8**，模型侧边栏按系列重新归类。[详情](./llm-service/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-04-15</div>
<div className="changelog-body">

### SKILLS · Agent Wallet

<div className="changelog-tags"><span className="changelog-tag">文档</span></div>

- **SKILLS**——新增简介，配套快速开始，一条命令完成安装。[详情](./skills/)
- **Agent Wallet**——新增简介，讲清私钥存在哪里、签名怎么完成；配套快速开始带你创建第一个钱包。[详情](./agent-wallet/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-04-01</div>
<div className="changelog-body">

### Openclaw 扩展

<div className="changelog-tags"><span className="changelog-tag">隐私</span></div>

- 扩展界面中的钱包地址改为**脱敏展示**——共享屏幕或录屏时更安全。[详情](./openclaw-extension/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-03-31</div>
<div className="changelog-body">

### Openclaw 扩展

<div className="changelog-tags"><span className="changelog-tag">新增</span></div>

- 在 macOS 与 Linux 之外补充 **Windows 安装指引**。[详情](./openclaw-extension/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-03-22</div>
<div className="changelog-body">

### Agent Wallet

<div className="changelog-tags"><span className="changelog-tag">新增</span><span className="changelog-tag">安全</span></div>

- 发布开发者文档三件套：**CLI 参考**、**SDK 指南**、**SDK Cookbook**。
- **安全修复**——配置文档不再使用 `echo $AGENT_WALLET_PASSWORD`，这条命令会把钱包密码打印到终端并留在 shell 历史里。如果你照旧文档操作过，建议清理 shell 历史并更换密码。[详情](./agent-wallet/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-03-17</div>
<div className="changelog-body">

### MCP Server · Openclaw 扩展

<div className="changelog-tags"><span className="changelog-tag">新增</span><span className="changelog-tag">文档</span></div>

- **MCP Server**——新增 TRON MCP Server 完整**工具清单**，含参数说明。[详情](./mcp-server/)
- **Openclaw 扩展**——首次发布：简介与快速开始，把浏览器扩展连上 Agent Wallet。[详情](./openclaw-extension/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-03-13</div>
<div className="changelog-body">

### SKILLS

<div className="changelog-tags"><span className="changelog-tag">新增</span></div>

- 发布 **BANK OF AI Skill** 说明文档——正是这套技能包让 AI 客户端学会查余额、问报价，并通过 Agent Wallet 执行交易。[详情](./skills/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-03-10</div>
<div className="changelog-body">

### MCP Server

<div className="changelog-tags"><span className="changelog-tag">新增</span><span className="changelog-tag">TRON</span></div>

- 两种接入方式：**官方服务接入**直接使用托管地址，**本地私有化部署**适用于密钥和流量必须留在自己环境的场景。[详情](./mcp-server/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-03-02</div>
<div className="changelog-body">

### 8004 协议

<div className="changelog-tags"><span className="changelog-tag">更新</span></div>

- 仓库地址从 `bankofai` 迁移到 **`BofAI`**。旧链接会自动跳转，但脚本或依赖里写死的地址需要更新。[详情](./8004/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-02-12</div>
<div className="changelog-body">

### 8004 协议

<div className="changelog-tags"><span className="changelog-tag">新版本</span></div>

- **v1.1.0**——新增支持网络与合约地址页，发布 Usage 三篇（安装、配置 Agent、HTTP 注册），并重写快速开始，完整走通注册第一个 Agent 的流程。[详情](./8004/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-02-11</div>
<div className="changelog-body">

### MCP Server · 8004 协议

<div className="changelog-tags"><span className="changelog-tag">新增</span></div>

- **MCP Server**——**TRON MCP Server** 与 **BSC MCP Server** 首批文档发布，覆盖安装、功能与接口说明。[详情](./mcp-server/)
- **8004 协议**——初版文档上线，讲清链上 Agent 身份解决什么问题以及怎么上手。[详情](./8004/)

</div>
</div>
