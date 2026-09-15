---
title: 'SKILLS'
description: 'SKILLS 的版本发布记录。'
---

# SKILLS

SKILLS 的版本发布记录。

<div className="changelog-entry">
<div className="changelog-date">2026-09-09</div>
<div className="changelog-body">

### 技能目录细节修正

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">修复</span></div>

- **SunPerp 提现**——凭证列补充说明：提现除 SunPerp 密钥外，还需要 `TRON_PRIVATE_KEY` 用于签署确认。
- **客户端支持范围**——安装器覆盖了相当广的一批编程助手与 AI 客户端（Claude Code、Cursor、Codex、Cline、Gemini CLI、Amp、Zed 等），对有独立技能目录的工具建立软链接，没有的则直接复制。此前 FAQ 只列了 OpenClaw。
- **充值服务地址**——`BANKOFAI_API_KEY` 在 `chat.bankofai.io/key` 获取；skills 仓库中 recharge 技能残留的 `chat.ainft.com` 默认值已修正。

👉 [技能目录](/zh-Hans/McpServer-Skills/SKILLS/BANKOFAISkill/) · [常见问题](/zh-Hans/McpServer-Skills/SKILLS/Faq/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-09-08</div>
<div className="changelog-body">

### x402-payment CLI 版本要求订正

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">修复</span></div>

- 订正 `x402-payment` 的要求：该技能只接受 `x402-cli` `1.0.1`，而不是“1.0.1 及以上”。同时转义交易 ID 占位符，使页面符合 MDX 语法并可正常编译。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-09-07</div>
<div className="changelog-body">

### Skills 2.0.0 —— 更精简、以 wallet-cli 为中心的技能目录

<div className="changelog-tags"><span className="changelog-tag">新版本</span><span className="changelog-tag">破坏性变更</span></div>

- **移除五个技能**：`multisig-permissions`、`trc20-toolkit-skill`、`trx-staking-skill`、`twitter-digest`、`twitter-mcp`。通用 TRON 操作——TRC20 转账与代币查询、质押与 SR 投票、账户权限管理——现由 **`wallet-cli`** 承接；X/Twitter 工作流不再属于这个以 DeFi 为核心的集合。目录现共 **10 个技能**。
- **`wallet-cli` 2.0.0**——锁定的 CLI 升至 `@tron-walletcli/wallet-cli@4.13.0`，规范网络标识改为十进制 CAIP-2 ID（主网 `tron:728126428`、Nile `tron:3448148188`、Shasta `tron:2494104990`）；`tron:mainnet` 这类名称仅作为输入别名保留。
- **技能版本统一**——所有保留技能的版本号与仓库发布版本（2.0.0）一致，并由 CI 一致性检查保障。

👉 [技能目录](/zh-Hans/McpServer-Skills/SKILLS/BANKOFAISkill/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-08-29</div>
<div className="changelog-body">

### 安装源锁定稳定的 main 分支

<div className="changelog-tags"><span className="changelog-tag">更新</span></div>

- 推荐安装源现已锁定**稳定的 `main` 分支**：`npx skills add https://github.com/BofAI/skills/tree/main`。其他开发分支可能包含未发布内容，仅供有意测试时使用。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-08-26</div>
<div className="changelog-body">

### 新技能：wallet-cli

<div className="changelog-tags"><span className="changelog-tag">新增</span><span className="changelog-tag">TRON</span></div>

- 新增 **`wallet-cli`**——通过锁定版 `@tron-walletcli/wallet-cli@4.12.0` 直接完成 TRON 钱包操作（账户、转账、质押、治理、合约、签名、链上查询），全程走 CLI 的机器可读 JSON 契约（`-o json`，先看退出码）。
- 内置硬性安全边界：Agent 执行时钱包密码只接受 `--password-stdin` 传入（不进命令行参数、环境变量或对话）；根钱包管理命令（`import` / `backup` / `delete` / `change-password`）**仅限人工执行**——即使用户确认，Agent 也不会代跑。

👉 [技能目录](/zh-Hans/McpServer-Skills/SKILLS/BANKOFAISkill/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-07-21</div>
<div className="changelog-body">

### x402-payment 改用 x402 CLI

<div className="changelog-tags"><span className="changelog-tag">更新</span><span className="changelog-tag">x402</span></div>

- **支付统一走 `x402-cli`**（仅限 1.0.1），不再使用技能内置的本地 TypeScript 脚本。技能会校验已安装版本，缺失或版本不匹配时提示如何安装。
- **每笔付款先预览、再限额**——首次调用陌生端点前先跑 `--dry-run --json` 预览，真实付款带 `--max-amount`。GasFree 付款还必须用 `--max-gasfree-fee` 给中继费单独限额，因为付款上限并不包含它。
- **只接受规范的 CAIP-2 TRON 标识符**——`tron:0x2b6653dc`、`tron:0xcd8690dc`、`tron:0x94a9059e`；`tron:mainnet` 这类简写会被拒绝。`agent-wallet` 技能同样改用这套标识符。
- 已下线的 `--gasfree-info` / `--gasfree-activate` 脚本参数被移除；卸载脚本现在支持自定义技能目录。

👉 [技能目录](/zh-Hans/McpServer-Skills/SKILLS/BANKOFAISkill/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-07-10</div>
<div className="changelog-body">

### GasFree 支付说明与新的目录地址

<div className="changelog-tags"><span className="changelog-tag">更新</span><span className="changelog-tag">x402</span></div>

- Skills 现已支持并说明 TRON 上的 **`exact_gasfree` 支付方案**——账户里不备 TRX 也能付款调用 x402 服务。
- **API 目录接口更换了新地址**。Skills 与 facilitator 配置同步更新；如果你锁定了旧版本，需要重新安装。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-04-15</div>
<div className="changelog-body">

### 新增简介与一行安装

<div className="changelog-tags"><span className="changelog-tag">文档</span></div>

- 新增**简介**页，说明 Skills 究竟给你的 AI 带来了什么；配套**快速开始**，一条命令完成安装。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-03-13</div>
<div className="changelog-body">

### BANK OF AI Skill

<div className="changelog-tags"><span className="changelog-tag">新增</span></div>

- 发布 **BANK OF AI Skill** 说明文档——正是这套技能包让 AI 客户端学会查余额、问报价，并通过 Agent Wallet 执行链上交易。

</div>
</div>
