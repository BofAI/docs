---
title: 'SKILLS'
description: 'SKILLS 的版本发布记录。'
---

# SKILLS

SKILLS 的版本发布记录。

<div className="changelog-entry">
<div className="changelog-date">2026-07-21</div>
<div className="changelog-body">

### x402-payment 改用 x402 CLI

<div className="changelog-tags"><span className="changelog-tag">更新</span><span className="changelog-tag">x402</span></div>

- **支付统一走 `x402-cli`**（1.0.1 及以上），不再使用技能内置的本地 TypeScript 脚本。技能会校验你已装的版本，缺失时告诉你如何安装。
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
