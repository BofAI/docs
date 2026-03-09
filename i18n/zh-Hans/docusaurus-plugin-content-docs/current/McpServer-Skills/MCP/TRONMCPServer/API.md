# API 参考

## 工具（共 95 个）

### 钱包与地址

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `get_wallet_address` | 获取已配置钱包的地址。 | - | 读取 |
| `list_wallets` | 列出所有可用钱包。 | - | 读取 |
| `select_wallet` | 在运行时切换活跃钱包。 | `walletId` | 写入 |
| `sign_message` | 使用已配置的钱包签署任意消息。 | `message` | 写入 |
| `convert_address` | 在 Hex 和 Base58 格式之间转换地址。 | `address` | 读取 |

### 网络与链

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `get_chain_info` | 获取当前区块号和链 ID。 | `network` | 读取 |
| `get_chain_parameters` | 获取当前能量和带宽单价。 | `network` | 读取 |
| `get_supported_networks` | 列出所有支持的 TRON 网络。 | - | 读取 |

### 区块

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `get_block` | 按区块号或哈希获取区块详情。 | `blockIdentifier`, `network` | 读取 |
| `get_latest_block` | 获取最新区块。 | `network` | 读取 |

### 交易

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `get_transaction` | 按哈希获取交易详情。 | `txHash`, `network` | 读取 |
| `get_transaction_info` | 获取交易收据，包括资源使用情况。 | `txHash`, `network` | 读取 |

### 余额

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `get_balance` | 获取地址的 TRX 余额。 | `address`, `network` | 读取 |
| `get_token_balance` | 获取地址的 TRC20 代币余额。 | `address`, `tokenAddress`, `network` | 读取 |

### 转账

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `transfer_trx` | 向指定地址转账 TRX。 | `to`, `amount`, `network` | 写入 |
| `transfer_trc20` | 向指定地址转账 TRC20 代币。 | `tokenAddress`, `to`, `amount`, `network` | 写入 |

### 智能合约

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `read_contract` | 调用智能合约的只读函数。 | `contractAddress`, `functionName`, `args`, `abi`, `network` | 读取 |
| `write_contract` | 执行智能合约的状态变更函数。 | `contractAddress`, `functionName`, `args`, `abi`, `value`, `network` | 写入 |
| `deploy_contract` | 将智能合约部署到网络。 | `abi`, `bytecode`, `args`, `name`, `network`, `feeLimit` | 写入 |
| `estimate_energy` | 估算合约调用的能量消耗。 | `address`, `functionName`, `args`, `abi`, `network` | 读取 |
| `multicall` | 在单次批量中执行多个只读调用。 | `calls`, `network`, `multicallAddress`, `version` | 读取 |
| `get_contract` | 获取合约原始元数据（ABI 和字节码）。 | `contractAddress`, `network` | 读取 |
| `get_contract_info` | 获取合约高级信息。 | `contractAddress`, `network` | 读取 |
| `fetch_contract_abi` | 从链上获取合约 ABI。 | `contractAddress`, `network` | 读取 |
| `update_contract_setting` | 更新合约的 consume_user_resource_percent。 | `contractAddress`, `consumeUserResourcePercent`, `network` | 写入 |
| `update_energy_limit` | 更新合约的 originEnergyLimit。 | `contractAddress`, `originEnergyLimit`, `network` | 写入 |
| `clear_abi` | 清除合约的链上 ABI 元数据。 | `contractAddress`, `network` | 写入 |

### 账户管理

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `get_account` | 获取完整账户信息（余额、资源、权限）。 | `address`, `network` | 读取 |
| `get_account_balance` | 获取指定区块高度的 TRX 余额。 | `address`, `blockHash`, `blockNumber`, `network` | 读取 |
| `get_account_net` | 获取带宽资源信息。 | `address`, `network` | 读取 |
| `get_account_resource` | 获取能量、带宽、冻结余额和委托信息。 | `address`, `network` | 读取 |
| `get_delegated_resource` | 查询两个账户之间的委托资源。 | `fromAddress`, `toAddress`, `network` | 读取 |
| `get_delegated_resource_index` | 查询资源委托索引。 | `address`, `network` | 读取 |
| `generate_account` | 生成新的 TRON 账户。 | - | 读取 |
| `validate_address` | 验证 TRON 地址并检测格式。 | `address` | 读取 |
| `create_account` | 在网络上激活新账户。 | `address`, `network` | 写入 |
| `update_account` | 更新账户名称。 | `accountName`, `network` | 写入 |
| `account_permission_update` | 更新账户权限（多签）。 | `ownerPermission`, `activePermissions`, `witnessPermission`, `network` | 写入 |

### 账户数据（TronGrid）

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `get_account_info` | 从 TronGrid 获取综合账户信息。 | `address`, `network` | 读取 |
| `get_account_transactions` | 获取账户的交易历史。 | `address`, `limit`, `fingerprint`, `network` | 读取 |
| `get_account_trc20_transactions` | 获取 TRC20 转账历史。 | `address`, `contractAddress`, `limit`, `fingerprint`, `network` | 读取 |
| `get_account_internal_transactions` | 获取账户的内部交易。 | `address`, `limit`, `fingerprint`, `network` | 读取 |
| `get_account_trc20_balances` | 获取所有 TRC20 代币余额。 | `address`, `network` | 读取 |

### 合约数据（TronGrid）

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `get_contract_transactions` | 获取合约的交易历史。 | `address`, `limit`, `fingerprint`, `network` | 读取 |
| `get_contract_internal_transactions` | 获取合约的内部交易。 | `address`, `limit`, `fingerprint`, `network` | 读取 |
| `get_trc20_token_holders` | 获取 TRC20 合约的代币持有者列表。 | `address`, `limit`, `fingerprint`, `network` | 读取 |

### 资源委托（Stake 2.0）

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `delegate_resource` | 将已质押的资源委托给另一个地址。 | `receiverAddress`, `amount`, `resource`, `lock`, `lockPeriod`, `network` | 写入 |
| `undelegate_resource` | 撤销之前委托的资源。 | `receiverAddress`, `amount`, `resource`, `network` | 写入 |
| `get_can_delegated_max_size` | 获取可委托的最大 TRX 数量。 | `address`, `resource`, `network` | 读取 |
| `get_delegated_resource_v2` | 获取两个地址之间的委托资源详情。 | `fromAddress`, `toAddress`, `network` | 读取 |
| `get_delegated_resource_account_index_v2` | 获取委托资源账户索引。 | `address`, `network` | 读取 |

### 质押（Stake 2.0）

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `freeze_balance_v2` | 冻结 TRX 以获取资源。 | `amount`, `resource`, `network` | 写入 |
| `unfreeze_balance_v2` | 解冻 TRX 以释放资源。 | `amount`, `resource`, `network` | 写入 |
| `withdraw_expire_unfreeze` | 提取已过期的解冻余额。 | `network` | 写入 |
| `cancel_all_unfreeze_v2` | 取消待处理的解冻并重新质押。 | `network` | 写入 |
| `get_available_unfreeze_count` | 获取剩余可解冻操作次数。 | `address`, `network` | 读取 |
| `get_can_withdraw_unfreeze_amount` | 获取可提取的已解质押 TRX 数量。 | `address`, `timestampMs`, `network` | 读取 |

### 治理与超级代表

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `list_witnesses` | 列出网络上所有超级代表。 | `network` | 读取 |
| `get_paginated_witnesses` | 获取活跃超级代表的分页列表。 | `offset`, `limit`, `network` | 读取 |
| `get_next_maintenance_time` | 获取下一个维护窗口时间戳。 | `network` | 读取 |
| `get_reward` | 查询地址的未领取投票奖励。 | `address`, `network` | 读取 |
| `get_brokerage` | 查询超级代表的佣金比例。 | `witnessAddress`, `network` | 读取 |
| `create_witness` | 申请成为超级代表（9999 TRX）。 | `url`, `network` | 写入 |
| `update_witness` | 更新超级代表网站 URL。 | `url`, `network` | 写入 |
| `vote_witness` | 为超级代表投票。 | `votes`, `network` | 写入 |
| `withdraw_balance` | 提取累积的投票奖励。 | `network` | 写入 |
| `update_brokerage` | 更新超级代表佣金比例。 | `brokerage`, `network` | 写入 |

### 提案

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `list_proposals` | 列出所有治理提案。 | `network` | 读取 |
| `get_proposal` | 按 ID 获取提案详情。 | `proposalId`, `network` | 读取 |
| `create_proposal` | 创建治理提案（仅限超级代表）。 | `parameters`, `network` | 写入 |
| `approve_proposal` | 投票批准/否决提案。 | `proposalId`, `approve`, `network` | 写入 |
| `delete_proposal` | 删除治理提案。 | `proposalId`, `network` | 写入 |

### 事件

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `get_events_by_transaction_id` | 获取交易触发的事件。 | `transactionId`, `network` | 读取 |
| `get_events_by_contract_address` | 获取合约触发的事件。 | `contractAddress`, `eventName`, `limit`, `network` | 读取 |
| `get_events_by_block_number` | 获取指定区块中的事件。 | `blockNumber`, `network` | 读取 |
| `get_events_of_latest_block` | 获取最新区块中的事件。 | `network` | 读取 |

### 内存池

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `get_pending_transactions` | 获取内存池中待处理的交易 ID。 | `network` | 读取 |
| `get_transaction_from_pending` | 获取特定的待处理交易。 | `txId`, `network` | 读取 |
| `get_pending_size` | 获取待处理交易数量。 | `network` | 读取 |

### 节点

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `list_nodes` | 列出所有已连接的节点地址。 | `network` | 读取 |
| `get_node_info` | 获取节点详细信息。 | `network` | 读取 |

### 全节点查询 API

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `get_block_by_num` | 按高度查询区块。 | `num`, `network` | 读取 |
| `get_block_by_id` | 按哈希查询区块。 | `value`, `network` | 读取 |
| `get_block_by_latest_num` | 获取最近 N 个区块。 | `num`, `network` | 读取 |
| `get_block_by_limit_next` | 获取指定高度范围内的区块。 | `startNum`, `endNum`, `network` | 读取 |
| `get_now_block` | 获取当前最新区块。 | `network` | 读取 |
| `get_transaction_by_id` | 按哈希查询交易。 | `value`, `network` | 读取 |
| `get_transaction_info_by_id` | 查询交易收据。 | `value`, `network` | 读取 |
| `get_transaction_info_by_block_num` | 获取区块中所有交易的收据。 | `num`, `network` | 读取 |
| `get_energy_prices` | 查询历史能量单价。 | `network` | 读取 |
| `get_bandwidth_prices` | 查询历史带宽单价。 | `network` | 读取 |
| `get_burn_trx` | 查询手续费销毁的 TRX 总量。 | `network` | 读取 |
| `get_approved_list` | 查询已签署交易的账户。 | `transaction`, `network` | 读取 |
| `get_block_balance` | 获取区块中所有余额变动。 | `hash`, `number`, `network` | 读取 |

### 广播与交易构建

| 工具名称 | 描述 | 关键参数 | 模式 |
| :-- | :-- | :-- | :-- |
| `broadcast_transaction` | 广播已签名的交易（JSON）。 | `transaction`, `network` | 写入 |
| `broadcast_hex` | 广播已签名的交易（hex）。 | `transaction`, `network` | 写入 |
| `create_transaction` | 创建未签名的 TRX 转账交易。 | `ownerAddress`, `toAddress`, `amount`, `network` | 写入 |

---

## 提示（共 6 个）

| 提示名称 | 描述 | 关键参数 | 需要钱包 |
| :-- | :-- | :-- | :-- |
| `prepare_transfer` | 安全地准备和执行带验证检查的代币转账。 | `tokenType`, `recipient`, `amount`, `network`, `tokenAddress` | 是 |
| `interact_with_contract` | 安全地执行带验证的智能合约写入操作。 | `contractAddress`, `functionName`, `args`, `value`, `network` | 是 |
| `diagnose_transaction` | 分析交易状态、失败原因并提供调试建议。 | `txHash`, `network` | 否 |
| `explain_tron_concept` | 通过示例解释 TRON 和区块链概念。 | `concept` | 否 |
| `analyze_wallet` | 获取钱包资产和活动的综合概览。 | `address`, `network`, `tokens` | 否 |
| `check_network_status` | 检查当前网络健康状况和运行条件。 | `network` | 否 |

---

## 资源（共 1 个）

| 资源名称 | URI | 描述 |
| :-- | :-- | :-- |
| `supported_networks` | `tron://networks` | 获取所有支持的 TRON 网络及其配置列表。 |
