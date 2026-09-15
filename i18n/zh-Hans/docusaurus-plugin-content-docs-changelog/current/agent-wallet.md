---
title: 'Agent Wallet'
description: 'Agent Wallet 的版本发布记录。'
---

# Agent Wallet

Agent Wallet 的版本发布记录。

<div className="changelog-entry">
<div className="changelog-date">2026-09-09</div>
<div className="changelog-body">

### 补齐 SDK 接口文档，修正 CLI 示例

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">修复</span></div>

- **补充 `resolveWallet()`**——一步到位的快捷函数（Python 为 `resolve_wallet()`），可替代 `resolveWalletProvider()` + `getActiveWallet()` 两步写法，并支持 `walletId` 与 `dir` 选项。
- **补充 `SignOptions.authorizationSignature`**——每个签名方法都接受它作为可选的第二参数，会转为 Privy 授权密钥策略所需的 `privy-authorization-signature` 请求头。该字段在 TypeScript 中为 `authorizationSignature`，Python 中为 `authorization_signature`。
- **Python 错误类导入**——顶层 `agent_wallet` 只导出六个错误类，其余五个需从 `agent_wallet.core.errors` 导入。
- **CLI 快速上手**——自定义密码示例改为显式指定钱包类型（`start local_secure -p …`），因为在交互式类型选择里选了 `raw_secret` 或 `privy` 时 `-p` 会被拒绝。
- **Cookbook**——x402 签名章节更名为 EIP-3009，并说明它与仓库示例中同名但域名和字段都不同的 `PaymentPermit` 结构的区别。

👉 [SDK 指南](/zh-Hans/Agent-Wallet/Developer/SDK-Guide/) · [CLI 参考](/zh-Hans/Agent-Wallet/Developer/CLI-Reference/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-09-08</div>
<div className="changelog-body">

### CLI 签名说明订正

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">修复</span></div>

- 明确 `local_secure` 与 `raw_secret` 钱包签名时需要 `--network`；Privy 钱包则从 Privy wallet 获取链类型，EVM 交易使用载荷中的 `chainId`。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-04-15</div>
<div className="changelog-body">

### 新增简介与快速安装

<div className="changelog-tags"><span className="changelog-tag">文档</span></div>

- 新增**简介**，讲清私钥存在哪里、签名怎么完成；配套**快速开始**，带你创建第一个钱包。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-04-01</div>
<div className="changelog-body">

### Agent Wallet v2.4.0

<div className="changelog-tags"><span className="changelog-tag">新版本</span></div>

- **新增 Privy 钱包类型**——将密钥托管到 [Privy](https://privy.io) 的服务端钱包；用 Privy App ID、App Secret 与 Wallet ID 配置。密钥不会落在你的磁盘上（签名请求发往 Privy API）。
- **新增 `resolve-address` 命令**——显示钱包派生出的 EVM 与 TRON 地址（`privy` 钱包为单一地址）。
- **`change-password` 支持非交互模式**——`change-password -p '<旧密码>' --new-password '<新密码>'` 无需提示即可执行，便于脚本化轮换。
- **重构 `start` / `add <type>` 子命令**——可在命令行直接指定钱包类型（`local_secure` / `raw_secret` / `privy`）。

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
