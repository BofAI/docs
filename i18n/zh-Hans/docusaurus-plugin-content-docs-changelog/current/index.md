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
