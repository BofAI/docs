# API 参考

### 工具

#### 钱包与地址

| 工具名称 | 描述 | 关键参数 |
| :-- | :-- | :-- |
| `get_wallet_address` | 获取已配置钱包的地址 (Base58 & Hex)。 | \- |
| `convert_address` | 在 Hex 和 Base58 格式之间转换。 | `address` |

#### 网络与资源

| 工具名称 | 描述 | 关键参数 |
| :-- | :-- | :-- |
| `get_chain_info` | 获取当前区块和链 ID。 | `network` |
| `get_chain_parameters` | 获取当前能量和带宽成本。 | `network` |
| `get_supported_networks` | 列出可用网络。 | \- |

#### 区块与交易

| 工具名称 | 描述 | 关键参数 |
| :-- | :-- | :-- |
| `get_block` | 按编号或哈希获取区块。 | `blockIdentifier`, `network` |
| `get_latest_block` | 获取最新区块。 | `network` |
| `get_transaction` | 按哈希获取交易详情。 | `txHash`, `network` |
| `get_transaction_info` | 获取收据/信息，包括资源使用。 | `txHash`, `network` |

#### 余额

| 工具名称 | 描述 | 关键参数 |
| :-- | :-- | :-- |
| `get_balance` | 获取地址的 TRX 余额。 | `address`, `network` |
| `get_token_balance` | 获取地址的 TRC20 代币余额。 | `address`, `tokenAddress`, `network` |

#### 转账（写入）

| 工具名称 | 描述 | 关键参数 |
| :-- | :-- | :-- |
| `transfer_trx` | 将 TRX 转移到另一个地址。 | `toAddress`, `amount`, `network` |
| `transfer_trc20` | 将 TRC20 代币转移到另一个地址。 | `toAddress`, `tokenAddress`, `amount`, `network` |

#### 智能合约（写入）

| 工具名称 | 描述 | 关键参数 |
| :-- | :-- | :-- |
| `trigger_smart_contract` | 调用智能合约的写入函数。 | `contractAddress`, `functionSelector`, `parameters`, `network` |

#### 智能合约（读取）

| 工具名称 | 描述 | 关键参数 |
| :-- | :-- | :-- |
| `trigger_constant_contract` | 调用智能合约的读取（`view` 或 `pure`）函数。 | `contractAddress`, `functionSelector`, `parameters`, `network` |
| `get_contract_abi` | 获取已验证合约的 ABI。 | `contractAddress`, `network` |

#### 资源管理

| 工具名称 | 描述 | 关键参数 |
| :-- | :-- | :-- |
| `freeze_balance` | 冻结 TRX 以获取带宽或能量。 | `amount`, `resource`, `duration`, `network` |
| `unfreeze_balance` | 解冻 TRX。 | `resource`, `network` |
| `delegate_resource` | 委托带宽或能量给另一个地址。 | `amount`, `resource`, `receiverAddress`, `network` |
| `undelegate_resource` | 取消委托带宽或能量。 | `amount`, `resource`, `receiverAddress`, `network` |

### 提示

#### `tron_query`

用于向 TRON 区块链提出通用查询的提示。它利用上述工具来获取所需信息。

*   **示例**：
    *   “获取地址 `Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` 的 TRX 余额。”
    *   “获取最新区块信息。”
    *   “将 100 TRX 转移到 `Tyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`。”

#### `tron_smart_contract_interaction`

用于与 TRON 智能合约交互的提示。它允许 AI 代理调用合约函数并处理交易。

*   **示例**：
    *   “调用合约 `Czzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz` 的 `transfer` 函数，将 50 个代币发送给 `Tkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk`。”


