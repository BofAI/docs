---
title: 'Agent Wallet'
description: 'Agent Wallet 的版本发布记录。'
---

# Agent Wallet

Agent Wallet 的版本发布记录。

<div className="changelog-entry">
<div className="changelog-date">2026-04-15</div>
<div className="changelog-body">

### 新增简介与快速安装

<div className="changelog-tags"><span className="changelog-tag">文档</span></div>

- 新增**简介**，讲清私钥存在哪里、签名怎么完成；配套**快速开始**，带你创建第一个钱包。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-03-22</div>
<div className="changelog-body">

### 开发者文档上线，以及一处密码处理修复

<div className="changelog-tags"><span className="changelog-tag">新增</span><span className="changelog-tag">安全</span></div>

- 发布开发者文档三件套：**CLI 参考**、**SDK 指南**、**SDK Cookbook**。
- **安全修复**：早期配置文档里用了 `echo $AGENT_WALLET_PASSWORD`，这会把钱包密码直接打印到终端，并留在 shell 历史里。相关示例已全部删除。如果你照旧文档操作过，建议清理 shell 历史并更换密码。

</div>
</div>
