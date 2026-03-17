# 完整能力清单

TRON MCP Server 提供 **95 个工具**、**6 个提示词模板**和 **1 个资源定义**。这个页面是完整的能力清单——当你想知道"它到底能做什么"或者"某个工具叫什么名字"时，来这里查就对了。

## 先了解两个概念

在浏览工具列表之前，有两件事需要知道：

:::info 读取 vs 写入
每个工具都标记了**模式**——"读取"或"写入"：

- **读取工具**：只查询链上数据，不影响任何状态。在云服务和本地部署中均可使用。
- **写入工具**：会修改区块链状态（转账、质押、合约调用等）。仅在本地部署且配置了钱包后才可使用。

如果你没有配置钱包，写入工具不会出现在 AI 的可用工具列表中——它们会被自动隐藏，不用担心误触。
:::

:::tip network 参数
大多数工具都有一个可选的 `network` 参数，用于指定目标网络（`mainnet`、`nile` 或 `shasta`）。不指定时默认走主网。在测试阶段，建议每次都明确指定 `nile`，避免意外操作主网。
:::

---

## 工具（共 95 个）

### 钱包与地址

管理钱包身份和地址格式转换。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `get_wallet_address` | 获取当前已配置钱包的地址（Base58 和 Hex 格式） | - | 读取 |
| `list_wallets` | 列出所有可用钱包的 ID 和地址（Agent Wallet 模式） | - | 读取 |
| `select_wallet` | 在运行时切换活跃钱包（Agent Wallet 模式） | `walletId` | 写入 |
| `sign_message` | 使用已配置的钱包对任意消息进行签名 | `message` | 写入 |
| `convert_address` | 在 Hex（`41...`/`0x...`）和 Base58（`T...`）格式之间转换地址 | `address` | 读取 |

**试试这样说：** "我配置的钱包地址是什么？" · "把地址 41a1e39aefa49eb34bb8f8abe226e1de2c6c2e79 转换成 Base58 格式" · "列出我所有可用的钱包"

---

### 网络与链

查询网络级别的基础信息。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `get_chain_info` | 获取当前区块号和链 ID | `network` | 读取 |
| `get_chain_parameters` | 获取当前能量和带宽单价 | `network` | 读取 |
| `get_supported_networks` | 列出所有支持的 TRON 网络 | - | 读取 |

**试试这样说：** "TRON 主网当前的区块高度是多少？" · "现在能量和带宽价格是多少？"

---

### 区块

按区块号或哈希查询区块内容。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `get_block` | 按区块号或哈希获取区块详情 | `blockIdentifier`, `network` | 读取 |
| `get_latest_block` | 获取最新区块信息 | `network` | 读取 |

**试试这样说：** "查看 TRON 区块 65000000 的详情" · "最新的 TRON 区块里有什么？"

---

### 交易

获取交易的完整信息和执行结果。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `get_transaction` | 按哈希获取完整交易详情 | `txHash`, `network` | 读取 |
| `get_transaction_info` | 获取交易收据，包括资源消耗（能量/带宽） | `txHash`, `network` | 读取 |

**试试这样说：** "查一下交易 abc123... 的详情" · "这笔交易消耗了多少能量？"

---

### 余额

查询地址的 TRX 和代币持仓。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `get_balance` | 查询地址的 TRX 余额 | `address`, `network` | 读取 |
| `get_token_balance` | 查询地址的 TRC20 代币余额 | `address`, `tokenAddress`, `network` | 读取 |

**试试这样说：** "查一下 TXyz... 的 TRX 余额" · "这个地址持有多少 USDT？"

---

### 转账

发送 TRX 和 TRC20 代币。这是最常用的写入操作——执行前 AI 会与你确认详情。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `transfer_trx` | 向地址转账 TRX | `to`, `amount`, `network` | 写入 |
| `transfer_trc20` | 向地址转账 TRC20 代币 | `tokenAddress`, `to`, `amount`, `network` | 写入 |

**试试这样说：** "向地址 TXyz... 转账 50 TRX" · "在 Nile 测试网上向 TXyz... 发送 100 USDT"

:::warning
转账操作不可撤销。AI 在执行前会与你确认详情。
:::

---

### 智能合约

从读取合约状态到部署新合约，覆盖智能合约交互的全流程。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `read_contract` | 调用智能合约的只读（`view`/`pure`）函数 | `contractAddress`, `functionName`, `args`, `abi`, `network` | 读取 |
| `write_contract` | 执行智能合约的状态变更函数 | `contractAddress`, `functionName`, `args`, `abi`, `value`, `network` | 写入 |
| `deploy_contract` | 将智能合约部署到网络 | `abi`, `bytecode`, `args`, `name`, `network`, `feeLimit` | 写入 |
| `estimate_energy` | 预估合约调用的能量消耗 | `address`, `functionName`, `args`, `abi`, `network` | 读取 |
| `multicall` | 在单次批量请求中执行多个只读调用 | `calls`, `network`, `multicallAddress`, `version` | 读取 |
| `get_contract` | 获取合约原始元数据（ABI 和字节码） | `contractAddress`, `network` | 读取 |
| `get_contract_info` | 获取合约高级信息（ABI、函数列表） | `contractAddress`, `network` | 读取 |
| `fetch_contract_abi` | 从链上获取已验证合约的 ABI 数组 | `contractAddress`, `network` | 读取 |
| `update_contract_setting` | 更新合约的 `consume_user_resource_percent`（仅创建者） | `contractAddress`, `consumeUserResourcePercent`, `network` | 写入 |
| `update_energy_limit` | 更新合约的 `originEnergyLimit`（仅创建者） | `contractAddress`, `originEnergyLimit`, `network` | 写入 |
| `clear_abi` | 清除合约的链上 ABI 元数据（仅创建者） | `contractAddress`, `network` | 写入 |

**试试这样说：** "调用合约 TXyz... 的 `balanceOf` 函数" · "获取合约 TXyz... 的 ABI" · "预估调用 `transfer` 函数需要多少能量" · "把这个合约部署到 Nile 测试网"

---

### 账户管理

查询账户的完整信息，包括余额、资源、权限和委托关系。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `get_account` | 获取完整账户信息（余额、资源、权限） | `address`, `network` | 读取 |
| `get_account_balance` | 查询特定区块高度时的 TRX 余额（历史查询） | `address`, `blockHash`, `blockNumber`, `network` | 读取 |
| `get_account_net` | 获取账户的带宽资源信息 | `address`, `network` | 读取 |
| `get_account_resource` | 获取能量、带宽、冻结余额和委托信息 | `address`, `network` | 读取 |
| `get_delegated_resource` | 查询两个账户之间的委托资源情况 | `fromAddress`, `toAddress`, `network` | 读取 |
| `get_delegated_resource_index` | 查询账户的资源委托索引 | `address`, `network` | 读取 |
| `generate_account` | 离线生成新的 TRON 密钥对（不会在链上激活） | - | 读取 |
| `validate_address` | 验证 TRON 地址并检测其格式 | `address` | 读取 |
| `create_account` | 在网络上激活新账户（消耗带宽） | `address`, `network` | 写入 |
| `update_account` | 更新账户名称（只能设置一次） | `accountName`, `network` | 写入 |
| `account_permission_update` | 更新账户权限（多签配置） | `ownerPermission`, `activePermissions`, `witnessPermission`, `network` | 写入 |

**试试这样说：** "查看地址 TXyz... 的完整账户详情" · "这个地址有多少能量和带宽？" · "帮我生成一个新的 TRON 地址" · "验证一下这个地址是否合法"

---

### 账户数据（TronGrid API）

这些工具通过 TronGrid 索引 API 提供更丰富的账户数据——交易历史、代币持仓等需要索引的数据都在这里。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `get_account_info` | 从 TronGrid 获取综合账户信息 | `address`, `network` | 读取 |
| `get_account_transactions` | 获取账户的交易历史 | `address`, `limit`, `fingerprint`, `network` | 读取 |
| `get_account_trc20_transactions` | 获取 TRC20 转账历史 | `address`, `contractAddress`, `limit`, `fingerprint`, `network` | 读取 |
| `get_account_internal_transactions` | 获取账户的内部交易历史 | `address`, `limit`, `fingerprint`, `network` | 读取 |
| `get_account_trc20_balances` | 获取账户持有的所有 TRC20 代币余额 | `address`, `network` | 读取 |

**试试这样说：** "显示地址 TXyz... 最近的交易" · "这个地址持有哪些 TRC20 代币？" · "查看这个地址的 USDT 转账历史"

:::info 分页
返回列表的工具支持 `limit` 和 `fingerprint` 参数进行分页。使用上一次响应中的 `fingerprint` 值获取下一页数据。
:::

---

### 合约数据（TronGrid API）

查询合约级别的交易历史和代币持有者信息。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `get_contract_transactions` | 获取合约的交易历史 | `address`, `limit`, `fingerprint`, `network` | 读取 |
| `get_contract_internal_transactions` | 获取合约的内部交易历史 | `address`, `limit`, `fingerprint`, `network` | 读取 |
| `get_trc20_token_holders` | 获取 TRC20 代币的持有者列表 | `address`, `limit`, `fingerprint`, `network` | 读取 |

**试试这样说：** "这个 TRC20 代币的前几大持有者是谁？" · "显示这个合约的最近交易"

---

### 资源委托（Stake 2.0）

将质押获得的能量或带宽委托给其他地址，或查询委托关系。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `delegate_resource` | 将质押的能量或带宽委托给其他地址 | `receiverAddress`, `amount`, `resource`, `lock`, `lockPeriod`, `network` | 写入 |
| `undelegate_resource` | 撤销已委托的资源 | `receiverAddress`, `amount`, `resource`, `network` | 写入 |
| `get_can_delegated_max_size` | 获取地址可委托的最大 TRX 数量 | `address`, `resource`, `network` | 读取 |
| `get_delegated_resource_v2` | 获取两个地址之间的委托资源详情 | `fromAddress`, `toAddress`, `network` | 读取 |
| `get_delegated_resource_account_index_v2` | 获取委托资源账户索引 | `address`, `network` | 读取 |

**试试这样说：** "向地址 TXyz... 委托价值 500 TRX 的能量" · "我最多可以委托多少资源？" · "显示我所有的资源委托情况"

---

### 质押（Stake 2.0）

冻结 TRX 获取能量或带宽，解冻释放 TRX。这是 TRON 资源模型的核心操作。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `freeze_balance_v2` | 冻结（质押）TRX 以获取能量或带宽 | `amount`, `resource`, `network` | 写入 |
| `unfreeze_balance_v2` | 解冻（解质押）TRX 以释放资源 | `amount`, `resource`, `network` | 写入 |
| `withdraw_expire_unfreeze` | 将已到期的解冻余额提取回可用 TRX | `network` | 写入 |
| `cancel_all_unfreeze_v2` | 取消待处理的解冻并立即重新质押 | `network` | 写入 |
| `get_available_unfreeze_count` | 获取剩余解冻操作次数（最多同时 32 个） | `address`, `network` | 读取 |
| `get_can_withdraw_unfreeze_amount` | 获取在指定时间戳可提取的解冻 TRX 数量 | `address`, `timestampMs`, `network` | 读取 |

**试试这样说：** "质押 1000 TRX 换取能量" · "解除 500 TRX 的带宽质押" · "我有已到期可提取的解冻余额吗？"

:::info 关于 Stake 2.0
TRON 使用 Stake 2.0 进行资源管理。冻结 TRX 后可获得能量（用于智能合约执行）或带宽（用于普通交易）。解冻后有约 14 天的等待期，之后才能将 TRX 提取回来。
:::

---

### 治理与超级代表

查看超级代表列表、投票、管理奖励和佣金。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `list_witnesses` | 列出网络上所有超级代表 | `network` | 读取 |
| `get_paginated_witnesses` | 分页获取当前活跃超级代表列表 | `offset`, `limit`, `network` | 读取 |
| `get_next_maintenance_time` | 获取下次维护窗口时间戳（投票统计时间） | `network` | 读取 |
| `get_reward` | 查询地址的未领取投票奖励 | `address`, `network` | 读取 |
| `get_brokerage` | 查询超级代表的佣金比例 | `witnessAddress`, `network` | 读取 |
| `create_witness` | 申请成为超级代表候选人（需花费 9999 TRX） | `url`, `network` | 写入 |
| `update_witness` | 更新超级代表的网站 URL | `url`, `network` | 写入 |
| `vote_witness` | 使用冻结的 TRX 为超级代表投票 | `votes`, `network` | 写入 |
| `withdraw_balance` | 提取累积的超级代表投票奖励 | `network` | 写入 |
| `update_brokerage` | 更新超级代表佣金比例 | `brokerage`, `network` | 写入 |

**试试这样说：** "列出 TRON 上前 27 个超级代表" · "我有多少未领取的投票奖励？" · "给超级代表 TXyz... 投 1000 票"

---

### 提案

TRON 的链上治理机制——超级代表可以创建和投票表决网络参数变更提案。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `list_proposals` | 列出所有治理提案 | `network` | 读取 |
| `get_proposal` | 按 ID 获取提案详情 | `proposalId`, `network` | 读取 |
| `create_proposal` | 创建治理提案（仅超级代表） | `parameters`, `network` | 写入 |
| `approve_proposal` | 投票批准/反对提案 | `proposalId`, `approve`, `network` | 写入 |
| `delete_proposal` | 删除治理提案（仅创建者） | `proposalId`, `network` | 写入 |

**试试这样说：** "显示所有 TRON 活跃治理提案" · "提案 #42 的详细内容是什么？"

---

### 事件

查询智能合约触发的事件日志——监控链上活动的核心能力。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `get_events_by_transaction_id` | 获取特定交易触发的事件 | `transactionId`, `network` | 读取 |
| `get_events_by_contract_address` | 获取特定合约触发的事件 | `contractAddress`, `eventName`, `limit`, `network` | 读取 |
| `get_events_by_block_number` | 获取特定区块中触发的事件 | `blockNumber`, `network` | 读取 |
| `get_events_of_latest_block` | 获取最新区块中的事件 | `network` | 读取 |

**试试这样说：** "交易 abc123... 触发了哪些事件？" · "显示 USDT 合约最近的 Transfer 事件" · "最新区块里发生了哪些事件？"

---

### 内存池

查看尚未被打包的待处理交易。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `get_pending_transactions` | 获取内存池中的待处理交易 ID | `network` | 读取 |
| `get_transaction_from_pending` | 获取内存池中的特定交易详情 | `txId`, `network` | 读取 |
| `get_pending_size` | 获取当前待处理交易数量 | `network` | 读取 |

**试试这样说：** "TRON 内存池中有多少笔待处理交易？" · "交易 abc123... 还在待处理中吗？"

---

### 节点

查询 TRON 网络节点信息。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `list_nodes` | 列出所有已连接的节点地址 | `network` | 读取 |
| `get_node_info` | 获取已连接全节点的详细信息（版本、资源等） | `network` | 读取 |

---

### 全节点查询 API

这些工具直接对应 TRON 全节点的 RPC 方法，适合需要精确控制查询参数的高级用户。日常使用中，上面的高级工具（如 `get_block`、`get_transaction`）已经够用，但如果你需要批量查区块、查历史价格或做更底层的操作，这些工具会很有用。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `get_block_by_num` | 按区块高度查询区块 | `num`, `network` | 读取 |
| `get_block_by_id` | 按区块哈希查询区块 | `value`, `network` | 读取 |
| `get_block_by_latest_num` | 获取最近 N 个区块（已固化） | `num`, `network` | 读取 |
| `get_block_by_limit_next` | 获取高度区间 `[startNum, endNum)` 内的区块 | `startNum`, `endNum`, `network` | 读取 |
| `get_now_block` | 获取当前最新区块 | `network` | 读取 |
| `get_transaction_by_id` | 按哈希查询交易 | `value`, `network` | 读取 |
| `get_transaction_info_by_id` | 按哈希查询交易收据 | `value`, `network` | 读取 |
| `get_transaction_info_by_block_num` | 获取某区块中所有交易的收据 | `num`, `network` | 读取 |
| `get_energy_prices` | 查询能量单价历史数据 | `network` | 读取 |
| `get_bandwidth_prices` | 查询带宽单价历史数据 | `network` | 读取 |
| `get_burn_trx` | 查询交易手续费累计销毁的 TRX 总量 | `network` | 读取 |
| `get_approved_list` | 查询对某交易签名的账户列表 | `transaction`, `network` | 读取 |
| `get_block_balance` | 获取某区块中所有余额变动操作 | `hash`, `number`, `network` | 读取 |

---

### 广播与交易构建

手动构建和广播交易——适合需要离线签名或自定义交易流程的高级场景。

| 工具名称 | 描述 | 关键参数 | 模式 |
| :--- | :--- | :--- | :--- |
| `broadcast_transaction` | 广播已签名的交易（JSON 格式） | `transaction`, `network` | 写入 |
| `broadcast_hex` | 广播已签名的交易（十六进制编码的 protobuf 格式） | `transaction`, `network` | 写入 |
| `create_transaction` | 创建未签名的 TRX 转账交易 | `ownerAddress`, `toAddress`, `amount`, `network` | 写入 |

**试试这样说：** "创建一个从我的地址向 TXyz... 转 10 TRX 的未签名交易" · "广播这个已签名的交易"

---

## 提示词模板（共 6 个）

工具是单个操作，而提示词模板是**预定义的多步工作流**。当你触发一个提示词时，AI 会按照预设的流程串联多个工具来完成任务——比如转账前先检查余额、预估费用、请你确认，然后才执行。

| 提示词名称 | 描述 | 关键参数 | 是否需要钱包 |
| :--- | :--- | :--- | :--- |
| `prepare_transfer` | 安全准备和执行代币转账，含余额检查、费用预估和用户确认 | `tokenType`, `recipient`, `amount`, `network`, `tokenAddress` | 是 |
| `interact_with_contract` | 安全执行合约写操作，含参数验证、费用预估和确认步骤 | `contractAddress`, `functionName`, `args`, `value`, `network` | 是 |
| `diagnose_transaction` | 分析交易状态，识别失败原因，提供调试建议 | `txHash`, `network` | 否 |
| `explain_tron_concept` | 通过示例解释 TRON 和区块链概念（能量、带宽、质押等） | `concept` | 否 |
| `analyze_wallet` | 全面概览钱包资产、余额和活动情况 | `address`, `network`, `tokens` | 否 |
| `check_network_status` | 检查当前网络健康状况、出块情况和资源价格 | `network` | 否 |

**试试这样说：**
- "帮我安全地向 TXyz... 转账 100 TRX" → 触发 `prepare_transfer`
- "分析一下交易 abc123... 为什么失败了" → 触发 `diagnose_transaction`
- "解释一下 TRON 上的能量是怎么运作的" → 触发 `explain_tron_concept`
- "给我全面分析一下钱包 TXyz..." → 触发 `analyze_wallet`

---

## 资源（共 1 个）

资源是静态参考数据，AI 可以随时查询以获取上下文信息。

| 资源名称 | URI | 描述 |
| :--- | :--- | :--- |
| `supported_networks` | `tron://networks` | 返回所有支持的 TRON 网络及其配置信息（RPC 地址、浏览器链接等） |
