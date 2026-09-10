---
title: 'Openclaw 扩展'
description: 'Openclaw 扩展的版本发布记录。'
---

# Openclaw 扩展

Openclaw 扩展的版本发布记录。

<div className="changelog-entry">
<div className="changelog-date">2026-09-09</div>
<div className="changelog-body">

### 安装器跟进当前技能集

<div className="changelog-tags"><span className="changelog-tag">修复</span><span className="changelog-tag">SKILLS</span></div>

- 安装器此前固定在 `v1.5.14` 这个技能标签上，因此会装出 14 个技能——其中多个已在 2.0.0 下线——且从不安装 `wallet-cli`。现已改为跟随技能仓库的 `main` 分支，安装当前的 10 个技能。
- 生成的 BANK OF AI 配置此前写入 `base_url: https://chat.ainft.com`，现改为 `https://chat.bankofai.io`，即签发 `BANKOFAI_API_KEY` 的域名。
- TronScan 的配置提示原本声称该技能**必须**设置 `TRONSCAN_API_KEY`。实际并非如此：未配置 key 时技能会回退到 BofAI 代理（`ts.bankofai.io`），key 只用于提高速率上限。两个安装脚本的措辞均已改正。
- 文档同步：向导要求 Node.js 20+（TRON MCP 服务声明了该下限）；且只有 macOS/Linux 脚本不检查版本，Windows 脚本会强制 18。关于是否需要管理员权限的回答也已说明：带版本号的全局安装 `agent-wallet` 是唯一会写到用户目录之外的步骤。

👉 [快速上手](/zh-Hans/Openclaw-extension/QuickStart/) · [常见问题](/zh-Hans/Openclaw-extension/FAQ/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-04-01</div>
<div className="changelog-body">

### TRON 地址默认脱敏显示

<div className="changelog-tags"><span className="changelog-tag">隐私</span></div>

- 扩展界面中的钱包地址改为脱敏展示——共享屏幕或录屏时不会把完整地址暴露出去。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-03-31</div>
<div className="changelog-body">

### 新增 Windows 安装指引

<div className="changelog-tags"><span className="changelog-tag">新增</span></div>

- 在原有 macOS 与 Linux 步骤之外补充 **Windows 安装指引**，并完善了整体配置流程说明。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-03-17</div>
<div className="changelog-body">

### 首次发布

<div className="changelog-tags"><span className="changelog-tag">新增</span></div>

- 发布 Openclaw 扩展的**简介**与**快速开始**——把浏览器扩展连上 Agent Wallet，在当前页面直接发起链上操作。

</div>
</div>
