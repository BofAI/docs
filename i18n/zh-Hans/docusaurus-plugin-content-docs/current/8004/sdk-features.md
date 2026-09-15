---
title: 'SDK 特性矩阵'
description: '8004 SDK 在 TypeScript 与 Python 两个实现中的特性支持矩阵。'
---

# SDK 特性矩阵

本页记录 8004 SDK 实际实现了哪些能力，以及 TypeScript 与 Python 两个实现之间的差异。

> **同一个仓库，两套实现。** `8004-sdk` 从同一仓库（`ts/` 与 `python/`）分别发布 TypeScript 包与 Python 包。它们面向相同的合约、相同的注册文件格式，但**功能并不完全对等**——差异汇总见[语言差异](#语言差异)。
>
> **当前版本：** npm 上的 `@bankofai/8004-sdk` 为 **1.1.2**；Python 包未发布到 PyPI，请从仓库 `main` 分支安装。TypeScript 要求 **Node.js ≥ 20**；Python 要求 **Python ≥ 3.11**。

---

## 软件包

| 语言 | 包名 | 引入方式 | 安装 |
|---|---|---|---|
| TypeScript | `@bankofai/8004-sdk` | `import { SDK } from '@bankofai/8004-sdk'` | `npm install @bankofai/8004-sdk` |
| Python | `bankofai-8004-sdk` | `from bankofai.sdk_8004.core.sdk import SDK` | 从 GitHub 安装——见[安装指南](/zh-Hans/8004/Usage/Install/) |

Python 包尚未发布到 PyPI，请从仓库安装。

### 运行时依赖

| TypeScript | Python |
|---|---|
| `viem`（EVM 客户端） | `web3`（EVM 客户端） |
| `tronweb`（TRON 客户端） | `tronpy`（TRON 客户端） |
| `graphql-request`（Subgraph 查询） | `requests`、`aiohttp`（HTTP） |
| — | `eth-account`、`eth-hash`（签名、keccak） |

---

## 核心组件

| 组件 | TypeScript | Python | 说明 |
|---|:--:|:--:|---|
| `SDK`——链客户端、注册表、顶层调用 | ✅ | ✅ | |
| `Agent`——注册文件构造器 + 链上 Agent | ✅ | ✅ | |
| `TransactionHandle`——等待确认并映射结果 | ✅ | ✅ | `waitConfirmed()` / `wait_confirmed()` |
| `SubgraphClient`——索引查询 | ✅ | ✅ | 可选；需已部署 subgraph |
| `AgentIndexer` | ✅ | ✅ | Python 额外提供 `refreshIndex` / `refreshAgentIndex` |

---

## 支持网络

合约地址随 SDK 一起分发在 `resource/chains.json` 中，两个语言完全一致。完整列表见[合约地址](/zh-Hans/8004/contract/)页面。

| 生态 | 网络名 | CAIP-2 / chainId | EIP-712 chainId | 默认端点 |
|---|---|---|---|---|
| BSC | `mainnet` | `eip155:56` / `56` | `56` | `https://bsc-dataseed.binance.org` |
| BSC | `testnet` | `eip155:97` / `97` | `97` | `https://data-seed-prebsc-1-s1.binance.org:8545` |
| TRON | `mainnet` | — | `728126428` | `https://api.trongrid.io` |
| TRON | `nile` | — | `3448148188` | `https://nile.trongrid.io` |
| TRON | `shasta` | — | `2494104990` | `https://api.shasta.trongrid.io` |

TRON 请使用裸名称（`mainnet` / `nile` / `shasta`），示例中也是这么写的。两个 SDK 同时接受带 `tron:` 前缀的别名（如 `tron:nile`，单独的 `tron` 会解析为 Nile），内部会去掉该前缀；这是 SDK 自身的别名，与 x402 使用的 CAIP-2 标识不是一回事。EIP-712 chainId 一列，是 SDK 在 TRON 上签署 Agent 钱包变更时写入类型化数据域的值。

---

## 身份与注册

| 能力 | TypeScript | Python | API |
|---|:--:|:--:|---|
| 本地创建 Agent | ✅ | ✅ | `sdk.createAgent(...)` |
| 修改名称 / 描述 / 图片 | ✅ | ✅ | `agent.updateInfo({...})`——只改本地注册文件，需再调 `updateRegistration()` 发布 |
| 以 HTTP(S) URI 注册 | ✅ | ✅ | `agent.register(agentURI)` |
| 通过 IPFS 上传注册 | ✅ | ✅ | `agent.registerIPFS()` |
| 更新链上 URI | ✅ | ✅ | `agent.updateRegistration(...)` |
| 在本地设置 agent URI | ✅ | ✅ | `agent.setAgentUri(uri)`——仅本地，不发交易 |
| 按 ID 从链上加载 Agent | ✅ | ✅ | `sdk.loadAgent(agentId)`——无需 subgraph |
| MCP / A2A / ENS 端点 | ✅ | ✅ | `setMCP()`、`setA2A()`、`setENS()` |
| 移除端点 | ✅ | ✅ | `removeEndpoint()`、`removeEndpoints()` |
| OASF 技能与领域 | ✅ | ✅ | `addSkill()`、`addDomain()`、`removeSkill()`、`removeDomain()`——但存储位置不同：Python 在 `services` 中构建 `OASF` 条目（其 `version` 为 `0.8`），TypeScript 则把 slug 推入扁平的 `tags` 数组 |
| 按 OASF 分类表校验 slug | ❌ | ✅ | Python 的 `validate_oasf=True` 会对照内置分类表校验（136 个技能、204 个领域）；TypeScript 接受任意字符串 |
| 信任模型 | ✅ | ✅ | `setTrust(...)`——TypeScript 传对象，Python 传关键字参数；两者都支持 `reputation`、`cryptoEconomic`、`teeAttestation` |
| 整体替换信任模型列表 | ✅ | ✅ | TypeScript 的 `agent.setTrustModels([...])` 会归一化名称；Python 的 `agent.trustModels([...])` 按原样赋值 |
| 任意元数据 | ✅ | ✅ | `setMetadata()` |
| 读取 / 删除单个元数据键 | ❌ | ✅ | `agent.getMetadata()`、`agent.delMetadata()` |
| 将元数据变更推送上链 | ✅ | ❌ | `agent.updateOnChainMetadata()` |
| 激活标志 | ✅ | ✅ | `setActive()`；Python 另有 `activate()` / `deactivate()` |
| x402 支持标志 | ✅ | ✅ | `setX402Support()` |

:::note `agentWallet` 不是普通元数据
身份注册表保留了 `agentWallet` 这个键。`setMetadata()` 以及传给 `register()` 的元数据数组都会在链上拒绝它——只能通过下面的钱包 API 修改。
:::

---

## Agent 钱包

| 能力 | TypeScript | Python | 说明 |
|---|:--:|:--:|---|
| 读取当前 Agent 钱包 | ✅ | ✅ | `agent.getWallet()`；`sdk.getAgentWallet()` 仅 TypeScript 在 SDK 层提供 |
| 设置已验证的 Agent 钱包 | ✅ | ✅ | `agent.setWallet(...)` |
| 取消设置 | ✅ | ✅ | `agent.unsetWallet()` |
| signer 就是新钱包时自动签名 | ✅ | ✅ | 只传一个地址的写法**仅**在这种情况下可用 |
| 用传入的私钥签名 | ✅ | ✅ | `newWalletSigner`（TS）/ `new_wallet_signer`（Python） |
| 接受外部产生的签名 | ✅ | ✅ | `signature`——ERC-1271 智能合约钱包走这条路径 |
| 自定义 deadline | ✅ | ✅ | 默认 60 秒；合约上限为 5 分钟 |
| 已是该地址时跳过交易 | ✅ | ✅ | 返回 `undefined` / `None` |

各路径的适用规则见[配置 Agent → 签名从何而来](/zh-Hans/8004/Usage/ConfigureAgents/)。

---

## 信誉

两个语言的信誉相关调用都挂在 `SDK` 对象上。

| 能力 | TypeScript | Python | API |
|---|:--:|:--:|---|
| 留下反馈 | ✅ | ✅ | `sdk.giveFeedback(...)` |
| 读取单条反馈 | ✅ | ✅ | `sdk.getFeedback(...)` |
| 聚合摘要 | ✅ | ✅ | `sdk.getReputationSummary(...)` |
| 撤销自己的反馈 | ✅ | ✅ | `sdk.revokeFeedback(...)` |
| 对反馈追加回应 | ✅ | ✅ | `sdk.appendResponse(...)` |
| 检索反馈 | ✅ | ✅ | `sdk.searchFeedback(...)`——依赖 subgraph |
| 构建反馈文件 | ❌ | ✅ | `sdk.prepareFeedbackFile(...)` |

:::note 链上禁止自评
信誉注册表会拒绝来自该 Agent 所有者以及任何获授权操作员的反馈。反馈的归属由调用方地址确定——不存在额外的链下签名。
:::

---

## 验证

| 能力 | TypeScript | Python | API |
|---|:--:|:--:|---|
| 发起验证请求 | ✅ | ❌ | `sdk.validationRequest(...)` |
| 提交验证者响应 | ✅ | ❌ | `sdk.validationResponse(...)` |
| 读取验证状态 | ✅ | ❌ | `sdk.getValidationStatus(...)` |

:::caution 验证功能目前仅 TypeScript 可用
Python 包会解析验证注册表合约、也内置了它的 ABI，但**没有**暴露任何验证方法。如果需要在 Python 中使用验证注册表，请改用 TypeScript SDK，或直接调用合约。
:::

注册表本身是刻意做成通用的：只有请求中指定的验证者才能作答，响应携带一个 **0 到 100** 的评分、一个标签，以及指向证据的 URI。至于该结论是如何得出的——TEE 证明、质押、zkML——则不在合约关心的范围内。

---

## 所有权与操作员

| 能力 | TypeScript | Python | API |
|---|:--:|:--:|---|
| 转让 Agent | ✅ | ✅ | `agent.transfer(...)`；Python 另有 `sdk.transferAgent(...)` |
| 转让时将新所有者设为操作员 | ✅ | ❌ | TS 为 `transfer(to, approveOperator)`；Python 的 `Agent.transfer` 只接受地址 |
| 添加 / 移除操作员 | ✅ | ✅ | `agent.addOperator()`、`agent.removeOperator()` |
| 读取所有者 | ❌ | ✅ | `sdk.getAgentOwner()` |
| 所有权 / 转让前置检查 | ❌ | ✅ | `sdk.isAgentOwner()`、`sdk.canTransferAgent()` |

:::note 转让会清空 Agent 钱包
身份注册表在每次转让时都会清空 `agentWallet`，因此转让后 `getAgentWallet()` 返回零地址。新所有者必须重新调用 `setWallet()`。
:::

---

## 发现与索引

| 能力 | TypeScript | Python | 是否需要 subgraph |
|---|:--:|:--:|:--:|
| `sdk.loadAgent(agentId)` | ✅ | ✅ | 否——直接读链 |
| `sdk.getAgent(agentId)` | ✅ | ✅ | 是 |
| `sdk.searchAgents(filters)` | ✅ | ✅ | 是 |
| `sdk.searchFeedback(filters)` | ✅ | ✅ | 是 |
| `sdk.getSubgraphClient(chainId?)`——Python 为 `sdk.get_subgraph_client()` | ✅ | ✅ | ——未配置时不返回 |
| `sdk.refreshIndex()`、`sdk.refreshAgentIndex()` | ❌ | ✅ | 是——与 `getAgent` 共用索引器 |

若未配置 subgraph，依赖索引的调用不可用——此时 `loadAgent()` 仍是获取 Agent 的途径。

---

## 存储

两个语言的存储配置方式完全不同。

**Python** 内置了提供方，在 `SDK(...)` 构造函数中选择：

| 提供方 | 配置值 | 必需选项 |
|---|---|---|
| Pinata | `ipfs="pinata"` | `pinataJwt` |
| Filecoin | `ipfs="filecoinPin"` | `filecoinPrivateKey` |
| 自建 IPFS 节点 | `ipfs="node"` | `ipfsNodeUrl` |

**TypeScript** 不内置任何提供方。`SDKConfig` 只暴露一个需要你自行实现的 `ipfsUploader?: (json: string) => Promise<string>` 回调；未提供时 `registerIPFS()` 会抛出 `No ipfsUploader configured`。

两个语言中 IPFS 都是可选的。只有 `registerIPFS()` 以及读取 `ipfs://` 形式的 agent URI 才需要它；HTTP(S) 注册无需配置。

---

## 语言差异

两套实现有四处差异值得在选型时纳入考虑：

1. **验证功能仅 TypeScript 有。** 见上文——这是最大的功能缺口。
2. **默认值与配置形态不同。** `setA2A()` 的默认版本 Python 为 `0.30`、TypeScript 为 `0.3.0`；`subgraphUrl` 与 `ipfsUploader` 是 TypeScript 独有的构造参数，而 `registryOverrides`、`indexingStore` 及内置 IPFS 提供方则是 Python 独有。
3. **读取 Agent 字段的方式不同。** Python 在 `Agent` 上暴露了二十一个只读属性（`name`、`description`、`endpoints`、`mcpTools`、`owners`、`operators`、`updatedAt` 等）。TypeScript 只暴露 `agent.agentId`，其余一律通过 `agent.toJSON()` 读取。
4. **辅助方法各有侧重。** Python 多出所有权前置检查（`isAgentOwner`、`canTransferAgent`）、元数据存取（`getMetadata`、`delMetadata`）、`activate()` / `deactivate()` 以及 `saveToFile()`。TypeScript 多出 `updateOnChainMetadata()`、`uploadRegistrationFile()` 与 `submitRegister()`。

:::note Python 中有两个同名定义重复
在 Python 的 `Agent` 类里，`transfer` 与 `trustModels` 各自被定义了两次，最终生效的是后一个。生效的 `transfer` 是 `transfer(newOwnerAddress)`——此前那个带 `approve_operator` 的四参数版本不可达；而只读的 `trustModels` 属性被同名 setter 覆盖，因此 `agent.trustModels` 返回的是绑定方法而非列表。要读取信任模型，请改用 `agent.registrationFile()`。
:::

---

## 图例

- ✅ = 已实现
- ❌ = 该语言未实现
