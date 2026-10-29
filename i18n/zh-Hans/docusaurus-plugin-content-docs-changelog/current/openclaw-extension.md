---
title: 'Openclaw 扩展'
description: 'Openclaw 扩展的版本发布记录。'
---

# Openclaw 扩展

Openclaw 扩展的版本发布记录。

<div className="changelog-entry">
<div className="changelog-date">2026-10-27</div>
<div className="changelog-body">

### 安装器细节更正

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">修复</span></div>

- 技能配置环节（API Key 提示、`Next steps`）只对运行前技能列表里没有的技能运行（默认的全局安装下，列表涵盖 `~/.openclaw/skills/`、`~/.agents/skills/` 和其他 Agent 的技能目录），因此重装会打印 `No new skills were installed.` 并跳过；快速开始已说明这一点并指向手动补填 API Key 的步骤。补充了 `Proceed with installation?` 提示和 `bankofai-recharge` 的远程地址。
- Node.js 报错文字改为安装器实际输出（Windows 上没有 `Error: ` 前缀）；手动创建 `bankofai-config.json` 的步骤和安装器一样加上 `chmod 600`；Windows 改为「基本一样，差异见 FAQ」；删除 `~/.openclaw/skills/` 只会移除技能——MCP 条目、API Key 文件、全局 npm 包和 `~/.agent-wallet` 仍保留；Clean 模式会清掉 MCP 条目、技能和配置文件并重新初始化 agent-wallet，但从不卸载 npm 包。

👉 [快速开始](/zh-Hans/Openclaw-extension/QuickStart/) · [常见问题](/zh-Hans/Openclaw-extension/FAQ/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-10-23</div>
<div className="changelog-body">

### 文档按当前安装器更正

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">修复</span></div>

- **更正 9 月 9 日的条目**——那条所述的安装器改动并未发布。`main` 上的安装器仍锁定 Skills `v1.5.15`（14 个 Skill，不含 `wallet-cli`）、`@bankofai/agent-wallet` 2.3.1 与 `@bankofai/mcp-server-tron` 1.1.7，并写入 `base_url: https://chat.ainft.com`。快速入门与常见问题现按这一安装器描述，页首也说明了其钱包步骤遵循 agent-wallet 2.x。
- **文档的其他更正**——选择 `x402-payment` 时还会执行 `npm install --global @bankofai/x402-cli@1.0.1`；TronScan API Key 为可选（不填时 Skill 走 `ts.bankofai.io`）；项目级安装位置为 `<cwd>/skills/`；安装过程没有 TronGrid 提示；已有钱包时 agent-wallet 2.3.1 会先询问新增还是退出；Windows 上缺少 `~/.openclaw` 时安装器直接退出。
- **Node.js**——两个安装器都会在安装任何内容之前，按 `^22.23.4 || ^24.22.1 || >=26.12.1` 检查完整版本号。

👉 [快速开始](/zh-Hans/Openclaw-extension/QuickStart/) · [常见问题](/zh-Hans/Openclaw-extension/FAQ/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-09-09</div>
<div className="changelog-body">

### 安装器跟进当前技能集

<div className="changelog-tags"><span className="changelog-tag">修复</span><span className="changelog-tag">SKILLS</span></div>

- 安装器此前固定在 `v1.5.14` 这个技能标签上，因此会装出 14 个技能——其中多个已在 2.0.0 下线——且从不安装 `wallet-cli`。现已改为跟随技能仓库的 `main` 分支，安装当前的 10 个技能。
- 生成的 BANK OF AI 配置此前写入 `base_url: https://chat.ainft.com`，现改为 `https://chat.bankofai.io`，即签发 `BANKOFAI_API_KEY` 的域名。
- TronScan 的配置提示原本声称该技能**必须**设置 `TRONSCAN_API_KEY`。实际并非如此：未配置 key 时技能会回退到 BofAI 代理（`ts.bankofai.io`），key 只用于提高速率上限。两个安装脚本的措辞均已改正。
- 文档同步：向导要求 Node.js 20+（TRON MCP 服务声明了该下限）；且只有 macOS/Linux 脚本不检查版本，Windows 脚本也只强制 `>=18`，低于 TRON MCP 服务声明的 `>=20`。关于是否需要管理员权限的回答也已说明：带版本号的全局安装 `agent-wallet` 是唯一会写到用户目录之外的步骤。

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
