# API Reference

## Tools (95 total)

### Wallet & Address

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `get_wallet_address` | Get the address of the configured wallet. | - | Read |
| `list_wallets` | List all available wallets. | - | Read |
| `select_wallet` | Switch the active wallet at runtime. | `walletId` | Write |
| `sign_message` | Sign an arbitrary message using the configured wallet. | `message` | Write |
| `convert_address` | Convert addresses between Hex and Base58 formats. | `address` | Read |

### Network & Chain

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `get_chain_info` | Get current block number and chain ID. | `network` | Read |
| `get_chain_parameters` | Get current energy and bandwidth unit prices. | `network` | Read |
| `get_supported_networks` | List all supported TRON networks. | - | Read |

### Blocks

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `get_block` | Get block details by number or hash. | `blockIdentifier`, `network` | Read |
| `get_latest_block` | Get the latest block. | `network` | Read |

### Transactions

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `get_transaction` | Get transaction details by hash. | `txHash`, `network` | Read |
| `get_transaction_info` | Get receipt including resource usage. | `txHash`, `network` | Read |

### Balances

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `get_balance` | Get TRX balance of an address. | `address`, `network` | Read |
| `get_token_balance` | Get TRC20 token balance of an address. | `address`, `tokenAddress`, `network` | Read |

### Transfers

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `transfer_trx` | Transfer TRX to an address. | `to`, `amount`, `network` | Write |
| `transfer_trc20` | Transfer TRC20 tokens to an address. | `tokenAddress`, `to`, `amount`, `network` | Write |

### Smart Contracts

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `read_contract` | Call read-only functions on a smart contract. | `contractAddress`, `functionName`, `args`, `abi`, `network` | Read |
| `write_contract` | Execute state-changing functions on a smart contract. | `contractAddress`, `functionName`, `args`, `abi`, `value`, `network` | Write |
| `deploy_contract` | Deploy a smart contract to the network. | `abi`, `bytecode`, `args`, `name`, `network`, `feeLimit` | Write |
| `estimate_energy` | Estimate energy consumption for a contract call. | `address`, `functionName`, `args`, `abi`, `network` | Read |
| `multicall` | Execute multiple read-only calls in a single batch. | `calls`, `network`, `multicallAddress`, `version` | Read |
| `get_contract` | Get raw contract metadata (ABI and bytecode). | `contractAddress`, `network` | Read |
| `get_contract_info` | Get high-level contract information. | `contractAddress`, `network` | Read |
| `fetch_contract_abi` | Fetch contract ABI from the chain. | `contractAddress`, `network` | Read |
| `update_contract_setting` | Update contract consume_user_resource_percent. | `contractAddress`, `consumeUserResourcePercent`, `network` | Write |
| `update_energy_limit` | Update contract originEnergyLimit. | `contractAddress`, `originEnergyLimit`, `network` | Write |
| `clear_abi` | Clear the on-chain ABI metadata of a contract. | `contractAddress`, `network` | Write |

### Account Management

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `get_account` | Get full account info (balance, resources, permissions). | `address`, `network` | Read |
| `get_account_balance` | Get TRX balance at a specific block height. | `address`, `blockHash`, `blockNumber`, `network` | Read |
| `get_account_net` | Get bandwidth resource information. | `address`, `network` | Read |
| `get_account_resource` | Get energy, bandwidth, frozen balance, and delegation info. | `address`, `network` | Read |
| `get_delegated_resource` | Query delegated resources between two accounts. | `fromAddress`, `toAddress`, `network` | Read |
| `get_delegated_resource_index` | Query resource delegation index. | `address`, `network` | Read |
| `generate_account` | Generate a new TRON account. | - | Read |
| `validate_address` | Validate a TRON address and detect format. | `address` | Read |
| `create_account` | Activate a new account on the network. | `address`, `network` | Write |
| `update_account` | Update account name. | `accountName`, `network` | Write |
| `account_permission_update` | Update account permissions (multi-sig). | `ownerPermission`, `activePermissions`, `witnessPermission`, `network` | Write |

### Account Data (TronGrid)

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `get_account_info` | Get comprehensive account info from TronGrid. | `address`, `network` | Read |
| `get_account_transactions` | Get transaction history for an account. | `address`, `limit`, `fingerprint`, `network` | Read |
| `get_account_trc20_transactions` | Get TRC20 transfer history. | `address`, `contractAddress`, `limit`, `fingerprint`, `network` | Read |
| `get_account_internal_transactions` | Get internal transactions for an account. | `address`, `limit`, `fingerprint`, `network` | Read |
| `get_account_trc20_balances` | Get all TRC20 token balances. | `address`, `network` | Read |

### Contract Data (TronGrid)

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `get_contract_transactions` | Get transaction history for a contract. | `address`, `limit`, `fingerprint`, `network` | Read |
| `get_contract_internal_transactions` | Get internal transactions for a contract. | `address`, `limit`, `fingerprint`, `network` | Read |
| `get_trc20_token_holders` | Get token holder list for a TRC20 contract. | `address`, `limit`, `fingerprint`, `network` | Read |

### Resource Delegation (Stake 2.0)

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `delegate_resource` | Delegate staked resources to another address. | `receiverAddress`, `amount`, `resource`, `lock`, `lockPeriod`, `network` | Write |
| `undelegate_resource` | Revoke previously delegated resources. | `receiverAddress`, `amount`, `resource`, `network` | Write |
| `get_can_delegated_max_size` | Get max delegatable TRX amount. | `address`, `resource`, `network` | Read |
| `get_delegated_resource_v2` | Get delegated resource details between two addresses. | `fromAddress`, `toAddress`, `network` | Read |
| `get_delegated_resource_account_index_v2` | Get delegated resource account index. | `address`, `network` | Read |

### Staking (Stake 2.0)

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `freeze_balance_v2` | Freeze TRX to obtain resources. | `amount`, `resource`, `network` | Write |
| `unfreeze_balance_v2` | Unfreeze TRX to release resources. | `amount`, `resource`, `network` | Write |
| `withdraw_expire_unfreeze` | Withdraw expired unfrozen balance. | `network` | Write |
| `cancel_all_unfreeze_v2` | Cancel pending unfreezes and re-stake. | `network` | Write |
| `get_available_unfreeze_count` | Get remaining unfreeze operations count. | `address`, `network` | Read |
| `get_can_withdraw_unfreeze_amount` | Get withdrawable unstaked TRX amount. | `address`, `timestampMs`, `network` | Read |

### Governance & Super Representatives

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `list_witnesses` | List all Super Representatives on the network. | `network` | Read |
| `get_paginated_witnesses` | Get paginated list of active SRs. | `offset`, `limit`, `network` | Read |
| `get_next_maintenance_time` | Get next maintenance window timestamp. | `network` | Read |
| `get_reward` | Query unclaimed voting reward for an address. | `address`, `network` | Read |
| `get_brokerage` | Query SR brokerage ratio. | `witnessAddress`, `network` | Read |
| `create_witness` | Apply to become a Super Representative (9999 TRX). | `url`, `network` | Write |
| `update_witness` | Update SR website URL. | `url`, `network` | Write |
| `vote_witness` | Vote for Super Representatives. | `votes`, `network` | Write |
| `withdraw_balance` | Withdraw accumulated voting rewards. | `network` | Write |
| `update_brokerage` | Update SR brokerage ratio. | `brokerage`, `network` | Write |

### Proposals

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `list_proposals` | List all governance proposals. | `network` | Read |
| `get_proposal` | Get proposal details by ID. | `proposalId`, `network` | Read |
| `create_proposal` | Create a governance proposal (SR only). | `parameters`, `network` | Write |
| `approve_proposal` | Vote to approve/disapprove a proposal. | `proposalId`, `approve`, `network` | Write |
| `delete_proposal` | Delete a governance proposal. | `proposalId`, `network` | Write |

### Events

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `get_events_by_transaction_id` | Get events emitted by a transaction. | `transactionId`, `network` | Read |
| `get_events_by_contract_address` | Get events emitted by a contract. | `contractAddress`, `eventName`, `limit`, `network` | Read |
| `get_events_by_block_number` | Get events in a specific block. | `blockNumber`, `network` | Read |
| `get_events_of_latest_block` | Get events from the latest block. | `network` | Read |

### Mempool

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `get_pending_transactions` | Get pending transaction IDs in the mempool. | `network` | Read |
| `get_transaction_from_pending` | Get a specific pending transaction. | `txId`, `network` | Read |
| `get_pending_size` | Get number of pending transactions. | `network` | Read |

### Node

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `list_nodes` | List all connected node addresses. | `network` | Read |
| `get_node_info` | Get detailed node information. | `network` | Read |

### Full-Node Query API

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `get_block_by_num` | Query block by height. | `num`, `network` | Read |
| `get_block_by_id` | Query block by hash. | `value`, `network` | Read |
| `get_block_by_latest_num` | Get most recent N blocks. | `num`, `network` | Read |
| `get_block_by_limit_next` | Get blocks within a height range. | `startNum`, `endNum`, `network` | Read |
| `get_now_block` | Get current latest block. | `network` | Read |
| `get_transaction_by_id` | Query transaction by hash. | `value`, `network` | Read |
| `get_transaction_info_by_id` | Query transaction receipt. | `value`, `network` | Read |
| `get_transaction_info_by_block_num` | Get receipts for all transactions in a block. | `num`, `network` | Read |
| `get_energy_prices` | Query historical energy unit prices. | `network` | Read |
| `get_bandwidth_prices` | Query historical bandwidth unit prices. | `network` | Read |
| `get_burn_trx` | Query total TRX burned from fees. | `network` | Read |
| `get_approved_list` | Query accounts that signed a transaction. | `transaction`, `network` | Read |
| `get_block_balance` | Get all balance changes in a block. | `hash`, `number`, `network` | Read |

### Broadcast & Transaction Building

| Tool Name | Description | Key Parameters | Mode |
| :-- | :-- | :-- | :-- |
| `broadcast_transaction` | Broadcast a signed transaction (JSON). | `transaction`, `network` | Write |
| `broadcast_hex` | Broadcast a signed transaction (hex). | `transaction`, `network` | Write |
| `create_transaction` | Create an unsigned TRX transfer transaction. | `ownerAddress`, `toAddress`, `amount`, `network` | Write |

---

## Prompts (6 total)

| Prompt Name | Description | Key Parameters | Requires Wallet |
| :-- | :-- | :-- | :-- |
| `prepare_transfer` | Safely prepare and execute a token transfer with validation checks. | `tokenType`, `recipient`, `amount`, `network`, `tokenAddress` | Yes |
| `interact_with_contract` | Safely execute write operations on a smart contract with validation. | `contractAddress`, `functionName`, `args`, `value`, `network` | Yes |
| `diagnose_transaction` | Analyze transaction status, failures, and provide debugging insights. | `txHash`, `network` | No |
| `explain_tron_concept` | Explain TRON and blockchain concepts with examples. | `concept` | No |
| `analyze_wallet` | Get comprehensive overview of wallet assets and activity. | `address`, `network`, `tokens` | No |
| `check_network_status` | Check current network health and conditions. | `network` | No |

---

## Resources (1 total)

| Resource Name | URI | Description |
| :-- | :-- | :-- |
| `supported_networks` | `tron://networks` | Get list of all supported TRON networks and their configuration. |
