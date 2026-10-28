---
title: 'Agent Wallet'
description: 'Agent Wallet 的版本发布记录。'
---

# Agent Wallet

Agent Wallet 的版本发布记录。

<div className="changelog-entry">
<div className="changelog-date">2026-10-27</div>
<div className="changelog-body">

### 错误码、Privy 自动化与配置结构

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">修复</span></div>

- **SDK 指南**——列出 `WalletCliExecutionError` / `WalletCliUsageError` 的 `code`（`capability_missing`、`network_mismatch`、`timeout` 等）以及 wallet-cli 自身错误码会原样透传；`wallet_cli` 的 chainId 不一致抛 `SigningError`；`signAndBroadcast()` 在广播超时或 `wait` 期限到时返回 `{ txId, stage: 'timeout' }`，只在广播后查询状态失败时抛 `WalletCliSubmittedTransactionError`；`/advanced` 的导出列表补全。
- **CLI 参考**——`privy` 自动化需同时传 `--app-id` 和 `--app-secret-exec`，否则复用或 secret 提示会以退出码 1 结束；`-g/--generate` 会被解析但被忽略；说明了 `wallets_config.json` 的结构。

👉 [SDK 接入指南](/zh-Hans/Agent-Wallet/Developer/SDK-Guide/) · [CLI 命令行手册](/zh-Hans/Agent-Wallet/Developer/CLI-Reference/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-10-21</div>
<div className="changelog-body">

### 按 Agent Wallet 3.0 重写文档

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">破坏性变更</span></div>

- **按 3.0.0 重写**——所有页面改为对应 `@bankofai/agent-wallet` 3.0.0。钱包类型为 `wallet_cli`（推荐）、`privy` 和 `raw_secret`。`local_secure`、主密码、`AGENT_WALLET_PASSWORD`、`runtime_secrets.json`，以及 `init`、`change-password`、`sign msg` 命令都已不存在。参见[从 2.x 升级](/zh-Hans/Agent-Wallet/FAQ/#upgrade-from-2x)。
- **凭据**——wallet-cli 与 Privy 的密钥建议由 exec 脚本提供（`--cli-password-exec`、`--app-secret-exec`；也接受直接传入 `--app-secret`，但会以明文保存），3.x 没有密码环境变量。环境变量兜底只读取 `AGENT_WALLET_PRIVATE_KEY` / `AGENT_WALLET_MNEMONIC`，2.x 的 `TRON_PRIVATE_KEY` 等别名不再读取。
- **网络标识必须精确**——`-n` / `network` 只接受规范的 CAIP-2 字符串，如 `tron:728126428`、`tron:3448148188`、`eip155:56`；`tron:nile` 这类别名和十六进制 TRON ID 会被拒绝。
- **签名结果**——`signTransaction()` 返回带 `family` 字段的 `SignedTransactionArtifact`，不再是字符串，Cookbook 示例按它分支处理。`signMessage` 已移除。
- **只提供 TypeScript**——删除了 Python 标签页。PyPI 上的 `bankofai-agent-wallet` 停在 2.4.0，沿用 2.x 模型。
- **参考手册修正**——`reset` 只删除 `wallets_config.json`；错误类列表补上 `ExternalSigner*` 和 `WalletCli*` 两组；补充 `/advanced`、`/integrations/wallet-cli` 两个导出入口和 `AGENT_WALLET_WALLET_CLI_PATH`。

👉 [快速开始](/zh-Hans/Agent-Wallet/QuickStart/) · [CLI 命令行手册](/zh-Hans/Agent-Wallet/Developer/CLI-Reference/) · [SDK 接入指南](/zh-Hans/Agent-Wallet/Developer/SDK-Guide/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-09-10</div>
<div className="changelog-body">

### Agent Wallet v3.0.0

<div className="changelog-tags"><span className="changelog-tag">新版本</span><span className="changelog-tag">破坏性变更</span></div>

- **钱包类型**——新增 `wallet_cli` 类型，把 TRON 与 EVM 的交易和结构化数据签名委托给本机 wallet-cli 账户（兼容范围 `>=4.13.0 <5.0.0`）。移除 `local_secure`、主密码、`AGENT_WALLET_PASSWORD` 与 `runtime_secrets.json`；已有的 `local_secure` 钱包不会被转换。
- **签名 API**——`signTransaction()` 不再返回字符串，改为带 `family` 字段的 `SignedTransactionArtifact`（EVM 为 `rawTransaction`，TRON 为 `transaction`）。移除 `signRaw()`、`signMessage()` 和 CLI 的 `sign msg`，只保留交易与结构化数据签名。
- **包结构**——adapter、client 和配置解析等低阶 API 移到 `@bankofai/agent-wallet/advanced`；wallet-cli 相关辅助在 `@bankofai/agent-wallet/integrations/wallet-cli`。`ConfigWalletProvider` 改为 `new ConfigWalletProvider(dir, options)`。
- **凭据与环境变量**——Privy 和 wallet-cli 的密钥支持 `{ "exec": "/absolute/script" }` 引用（`--app-secret-exec`、`--cli-password-exec`）。2.x 的 `TRON_PRIVATE_KEY`、`TRON_MNEMONIC`、`TRON_ACCOUNT_INDEX` 不再读取，请改用 `AGENT_WALLET_PRIVATE_KEY`、`AGENT_WALLET_MNEMONIC`、`AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX`。
- 2026 年 9 月 10 日发布到 npm。Python 包在 PyPI 上停留在 2.4.0。升级步骤见[从 2.x 升级](/zh-Hans/Agent-Wallet/FAQ/#upgrade-from-2x)。

👉 [简介](/zh-Hans/Agent-Wallet/Intro/) · [CLI 命令行手册](/zh-Hans/Agent-Wallet/Developer/CLI-Reference/) · [SDK 接入指南](/zh-Hans/Agent-Wallet/Developer/SDK-Guide/)

</div>
</div>

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

👉 [SDK 接入指南](/zh-Hans/Agent-Wallet/Developer/SDK-Guide/) · [CLI 命令行手册](/zh-Hans/Agent-Wallet/Developer/CLI-Reference/)

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
