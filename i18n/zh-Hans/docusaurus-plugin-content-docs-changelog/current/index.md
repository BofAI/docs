---
title: '更新日志'
description: 'BANK OF AI 各产品的更新与公告——全部产品，按时间倒序。'
---

# 更新日志

BANK OF AI 各产品的更新与公告。

<div className="changelog-entry">
<div className="changelog-date">2026-09-09</div>
<div className="changelog-body">

### 8004 与 Openclaw 扩展校正

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">修复</span><span className="changelog-tag">8004</span><span className="changelog-tag">Openclaw</span></div>

- 8004 文档内部已一致：`setWallet` 由四种互不一致的调用形态统一为每种 SDK 一种，并说明新钱包签名的三种提供方式、移除旧版 TRON `chainId`、改用 SDK 实际接受的网络标识、私钥改从环境变量读取。Openclaw 安装器不再固定在已被取代的技能标签上，并写入正确的 BANK OF AI 域名。[8004 详情](./8004/) · [Openclaw 详情](./openclaw-extension/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-09-09</div>
<div className="changelog-body">

### 第二轮文档对照源码校核

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">x402</span><span className="changelog-tag">Agent Wallet</span><span className="changelog-tag">SKILLS</span></div>

- 对 x402 SDK、CLI、目录、Gateway、Facilitator、Agent Wallet 与 Skills 各仓库做了第二轮校核。API 目录示例按真实 provider 文件重建——此前的示例缺少现已必填的 `assetTransferMethod`，照抄会校验失败——并删除了并不存在的 `subTitle` 字段。修正了载荷字段、重试范围与仅 TRON 可用的能力描述；EVM 授权 gas 代付按真实生效条件重新说明；Agent Wallet SDK 指南补充了 `resolveWallet()` 与 `SignOptions`。[x402 详情](./x402/) · [Agent Wallet 详情](./agent-wallet/) · [SKILLS 详情](./skills/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-09-08</div>
<div className="changelog-body">

### 文档已与当前源代码同步

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">x402</span><span className="changelog-tag">Agent Wallet</span><span className="changelog-tag">SKILLS</span></div>

- 已依据当前 x402 SDK、API Catalog、Gateway、CLI、Facilitator、Agent Wallet 与 Skills 仓库同步英文和简体中文文档。订正内容包括 Catalog 的 `assetTransferMethod` 契约、`auth-capture` 仅有 client 的当前状态、Gateway 的授权与结算流程、Privy 的 `--network` 例外，以及 `x402-payment` 技能必须使用准确版本 `x402-cli@1.0.1` 的要求；同时修复了仓库链接、MDX 语法与失效的站内链接。[x402 详情](./x402/) · [Agent Wallet 详情](./agent-wallet/) · [SKILLS 详情](./skills/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-09-07</div>
<div className="changelog-body">

### SKILLS 2.0.0 —— 破坏性目录精简

<div className="changelog-tags"><span className="changelog-tag">新版本</span><span className="changelog-tag">SKILLS</span><span className="changelog-tag">破坏性变更</span></div>

- Skills 2.0.0 移除 `multisig-permissions`、`trc20-toolkit-skill`、`trx-staking-skill`、`twitter-digest`、`twitter-mcp`——前三者的 TRON 操作并入 **`wallet-cli`**（现锁定 `@tron-walletcli/wallet-cli@4.13.0`，规范网络标识为十进制 CAIP-2 ID），两个 X/Twitter 技能则移出这个以 DeFi 为核心的集合。目录现共 10 个技能，版本统一为 2.0.0。[详情](./skills/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-08-29</div>
<div className="changelog-body">

### SKILLS —— 安装源锁定 main 分支

<div className="changelog-tags"><span className="changelog-tag">更新</span><span className="changelog-tag">SKILLS</span></div>

- 技能安装现已锁定**稳定的 `main` 分支**——`npx skills add https://github.com/BofAI/skills/tree/main`；其他开发分支可能包含未发布内容。[详情](./skills/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-08-28</div>
<div className="changelog-body">

### x402 SDK v1.2.0 —— TRON 授权资源赞助

<div className="changelog-tags"><span className="changelog-tag">新版本</span><span className="changelog-tag">x402</span><span className="changelog-tag">TRON</span></div>

- **x402 SDK 1.2.0** 新增 `trc20ApprovalResourceSponsoring` 扩展：在 TRON 上，付款方只签名一次性的 `approve(Permit2, MaxUint256)` 而不广播，由启用了该扩展的 facilitator 校验后临时委托付款方所缺的 Stake 2.0 能量（必要时还有带宽）、广播交易并回收资源——因此首笔 Permit2 付款或通道存入无需 TRX。`@bankofai/x402-extensions` 与 `-tron` 升至 1.2.0，四个服务端中间件升至 1.1.1，其余包保持 1.1.0。官方 facilitator 未启用该扩展。[详情](./x402/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-08-26</div>
<div className="changelog-body">

### SKILLS —— 新技能 wallet-cli

<div className="changelog-tags"><span className="changelog-tag">新增</span><span className="changelog-tag">SKILLS</span><span className="changelog-tag">TRON</span></div>

- **`wallet-cli`** 加入技能目录（现共 15 个技能）：通过锁定版 `@tron-walletcli/wallet-cli@4.12.0` 直接完成 TRON 钱包操作——转账、质押、治理、合约、签名、链上查询；Agent 执行时密码仅经 stdin 传入，钱包管理仅限人工。[详情](./skills/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-08-25</div>
<div className="changelog-body">

### x402 SDK v1.1.0 · 文档

<div className="changelog-tags"><span className="changelog-tag">新版本</span><span className="changelog-tag">x402</span><span className="changelog-tag">文档</span></div>

- **x402 SDK 1.1.0**——付款流程显式化（`upfront` / `escrow` 通过 `extra.paymentFlow` 在协议中传递，默认 `authorization`）、客户端消费管控默认开启（单笔约 `$1` 上限 + 默认资产白名单）、付款选择策略与生命周期钩子、EVM 智能账户支持（ERC-7702、白名单内 ERC-6492），`HTTPFacilitatorClient` 默认超时 90 秒。11 个包需整体升级，要求 Node.js 22+。[SDK 功能矩阵](../x402/sdk-features/)
- **文档订正**——移除已废弃的 facilitator 计费内容（`base_fee`、`extra.fee`、`/fee/quote`）；官方服务将匿名 `/settle` 限制为每个 IP 每分钟 1 次；不再宣称 GasFree 会被自动优选——CLI 取第一条匹配过滤条件的支付要求，需要强制时请传 `--scheme exact_gasfree`；TRON Shasta 现已注明「SDK/CLI 可签名、但官方 facilitator 不结算」（请用 Nile 或自建）；CLI 页面标明了它的**锁定依赖**——CLI 1.0.2 内含的 `@bankofai/x402-*` SDK 包仍是 1.0.1（`x402-gateway` 为 1.0.2），因此尚不具备 1.1.0 的客户端消费管控；Skills 各页的安装命令统一改为 `npx skills add … -g`。[x402 文档](../)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-08-20</div>
<div className="changelog-body">

### Facilitator —— BSC 回执可靠性

<div className="changelog-tags"><span className="changelog-tag">修复</span><span className="changelog-tag">Facilitator</span></div>

- **BSC 主网**（`eip155:56`）的结算回执查询新增备用 RPC 兜底，单个节点无响应不再把已结算的付款误判为失败。[官方 Facilitator](../x402/core-concepts/OfficialFacilitator/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-07-30</div>
<div className="changelog-body">

### x402 CLI v1.0.2 · Catalog —— 支持 Base

<div className="changelog-tags"><span className="changelog-tag">新版本</span><span className="changelog-tag">x402</span><span className="changelog-tag">Base</span></div>

- **CLI 已支持 Base**——`eip155:8453` 与 `eip155:84532` 均支持 USDC；服务目录目前只发布 `eip155:8453` Base 主网路由。Base 在 `exact` 方案下使用 EIP-3009 授权，而非 Permit2。
- **Agent Wallet 成为 CLI 默认付款方**——`pay` 用你当前激活的钱包签名，私钥不再进环境变量。若配置了钱包但没有激活项，CLI 会在签名前停下而不是替你选。[详情](./x402/)
- 付费请求不再跟随 HTTP 重定向，避免 `PAYMENT-SIGNATURE` 流向其他源。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-07-29</div>
<div className="changelog-body">

### 官方 Facilitator —— 支持 Base 结算

<div className="changelog-tags"><span className="changelog-tag">更新</span><span className="changelog-tag">Facilitator</span><span className="changelog-tag">Base</span></div>

- 官方 facilitator 现已结算 **Base USDC**——在 TRON 主网/Nile 与 BSC 主网/测试网之外，新增启用 `eip155:8453`（主网）与 `eip155:84532`（Sepolia）。仓库自带的示例 facilitator 在 EVM 侧仍只注册 `eip155:97` 与 `eip155:56`，自托管的 Base 卖家需自行添加。[官方 Facilitator](../x402/core-concepts/OfficialFacilitator/)
- **自托管破坏性变更**——facilitator 配置只接受规范 CAIP-2 标识符；`bsc:mainnet`、`tron:nile` 这类友好别名不再解析，启动时直接报错。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-07-21</div>
<div className="changelog-body">

### 文档

<div className="changelog-tags"><span className="changelog-tag">产品更新</span><span className="changelog-tag">文档</span><span className="changelog-tag">x402</span><span className="changelog-tag">SKILLS</span></div>

- **SKILLS —— `x402-payment` 改用 `x402-cli` 付款**（仅限 1.0.1），不再使用内置本地脚本；新增 `--dry-run` 预览、`--max-amount` 限额、GasFree 必须限费，以及规范的 CAIP-2 TRON 标识符。[详情](./skills/)

- **TRON 网络标识符全面改用 CAIP-2 格式**——`tron:0x2b6653dc`（主网）、`tron:0xcd8690dc`（Nile）、`tron:0x94a9059e`（Shasta）。应用代码中建议使用 SDK 常量 `TRON_MAINNET` / `TRON_NILE` / `TRON_SHASTA`，而不是硬编码十六进制字符串。[网络与代币支持](../x402/core-concepts/network-and-token-support/)
- **明确 `auth-capture` 状态**——x402 定义了五种命名方案；`auth-capture` 目前仅提供 EVM client，server 与 facilitator 实现仍待发布。[SDK 功能](../x402/sdk-features/)
- **x402 快速开始精简**——买家与卖家两篇均已简化。
- **新增模型**：LLM Service 增加 Kimi K3 定价文档。
- **BANK OF AI 简介重写**——围绕"你的 AI 究竟多了什么"重新组织，配四项能力概览与端到端执行示例。
- **新增板块——最佳实践**：产品文档之外的动手演练与操作习惯沉淀。[阅读第一篇](../devnotes/first-onchain-swap/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-07-20</div>
<div className="changelog-body">

### x402 CLI v1.0.1 · Catalog

<div className="changelog-tags"><span className="changelog-tag">新版本</span><span className="changelog-tag">x402</span><span className="changelog-tag">TRON</span></div>

- **x402 CLI v1.0.1**——TRON **GasFree** 支付（`exact_gasfree`，无需 TRX）、标准 CAIP-2 网络标识（旧的 `tron:nile` 被拒绝）、`settled` 与 `delivered` 状态区分。基于 x402 SDK 1.0.1。[详情](./x402/)
- **x402 Catalog**——目录路由现支持 TRON 上的 `exact_gasfree`；网络标识必须用标准 CAIP-2；旧的 `fee` / `feeConfig` 字段已移除。[详情](./x402/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-07-17</div>
<div className="changelog-body">

### 文档

<div className="changelog-tags"><span className="changelog-tag">产品更新</span><span className="changelog-tag">文档</span></div>

- **新增 x402 CLI 文档集**：概览、快速开始、完整命令参考与 FAQ，中英双语。[Wallet CLI 指引](/zh-Hans/wallet-cli/)
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
- 支持网络：TRON（`tron:mainnet` / `tron:nile` / `tron:shasta`）与 BSC（`eip155:56` / `eip155:97`）。[Wallet CLI 指引](/zh-Hans/wallet-cli/quickstart/)

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
