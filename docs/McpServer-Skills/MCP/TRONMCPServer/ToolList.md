# Full Capability List

TRON MCP Server provides **95 tools**, **6 prompts**, and **1 resource** for interacting with the TRON blockchain. Tools are the core capability — they are the actual functions the AI calls on your behalf.

:::info Read vs Write
- **Read** tools: Available in both cloud (read-only) and local deployments. These are query-only operations with no on-chain impact.
- **Write** tools: Only available with local deployment + wallet configured. These modify blockchain state (transfers, staking, contract calls, etc.).

If no wallet is configured, write tools are automatically hidden from the AI.
:::

---

## Tools (95 total)

### Wallet & Address

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `get_wallet_address` | Get the address (Base58 & Hex) of the currently configured wallet. | - | Read |
| `list_wallets` | List all available wallets with IDs and addresses (Agent Wallet mode). | - | Read |
| `select_wallet` | Switch the active wallet at runtime (Agent Wallet mode). | `walletId` | Write |
| `sign_message` | Sign an arbitrary message using the configured wallet. | `message` | Write |
| `convert_address` | Convert addresses between Hex (`41...`/`0x...`) and Base58 (`T...`) formats. | `address` | Read |

**Example prompts:**
- "What is the address of my configured wallet?"
- "Convert address 41a1e39aefa49eb34bb8f8abe226e1de2c6c2e79 to Base58"
- "List all my available wallets"

---

### Network & Chain

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `get_chain_info` | Get current block number and chain ID. | `network` | Read |
| `get_chain_parameters` | Get current energy and bandwidth unit prices. | `network` | Read |
| `get_supported_networks` | List all supported TRON networks. | - | Read |

**Example prompts:**
- "What is the current TRON mainnet block height?"
- "How much does Energy and Bandwidth cost on TRON right now?"
- "Which networks does TRON MCP Server support?"

---

### Blocks

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `get_block` | Get block details by number or hash. | `blockIdentifier`, `network` | Read |
| `get_latest_block` | Get the latest block info. | `network` | Read |

**Example prompts:**
- "Show me the details of TRON block 65000000"
- "What's in the latest TRON block?"

---

### Transactions

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `get_transaction` | Get full transaction details by hash. | `txHash`, `network` | Read |
| `get_transaction_info` | Get receipt including resource usage (energy/bandwidth consumed). | `txHash`, `network` | Read |

**Example prompts:**
- "Look up transaction abc123... on TRON"
- "How much Energy did transaction xyz... consume?"

---

### Balances

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `get_balance` | Get TRX balance of an address. | `address`, `network` | Read |
| `get_token_balance` | Get TRC20 token balance of an address. | `address`, `tokenAddress`, `network` | Read |

**Example prompts:**
- "Check the TRX balance of TXyz..."
- "How much USDT (TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t) does address TXyz... hold?"

---

### Transfers

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `transfer_trx` | Transfer TRX to an address. | `to`, `amount`, `network` | Write |
| `transfer_trc20` | Transfer TRC20 tokens to an address. | `tokenAddress`, `to`, `amount`, `network` | Write |

**Example prompts:**
- "Transfer 50 TRX to address TXyz..."
- "Send 100 USDT to TXyz... on Nile testnet"

:::warning
Transfer operations are irreversible. The AI will confirm details with you before executing.
:::

---

### Smart Contracts

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `read_contract` | Call read-only (`view`/`pure`) functions on a smart contract. | `contractAddress`, `functionName`, `args`, `abi`, `network` | Read |
| `write_contract` | Execute state-changing functions on a smart contract. | `contractAddress`, `functionName`, `args`, `abi`, `value`, `network` | Write |
| `deploy_contract` | Deploy a smart contract to the network. | `abi`, `bytecode`, `args`, `name`, `network`, `feeLimit` | Write |
| `estimate_energy` | Estimate energy consumption for a contract call. | `address`, `functionName`, `args`, `abi`, `network` | Read |
| `multicall` | Execute multiple read-only calls in a single batch. | `calls`, `network`, `multicallAddress`, `version` | Read |
| `get_contract` | Get raw contract metadata (ABI and bytecode). | `contractAddress`, `network` | Read |
| `get_contract_info` | Get high-level contract information (ABI, function list). | `contractAddress`, `network` | Read |
| `fetch_contract_abi` | Fetch ABI entry array for verified contracts from the chain. | `contractAddress`, `network` | Read |
| `update_contract_setting` | Update contract `consume_user_resource_percent` (creator only). | `contractAddress`, `consumeUserResourcePercent`, `network` | Write |
| `update_energy_limit` | Update contract `originEnergyLimit` (creator only). | `contractAddress`, `originEnergyLimit`, `network` | Write |
| `clear_abi` | Clear the on-chain ABI metadata of a contract (creator only). | `contractAddress`, `network` | Write |

**Example prompts:**
- "Call the `balanceOf` function of contract TXyz... with my address"
- "Get the ABI of contract TXyz..."
- "Estimate how much Energy it would cost to call `transfer` on this contract"
- "Deploy this smart contract to Nile testnet"

---

### Account Management

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `get_account` | Get full account info (balance, resources, permissions). | `address`, `network` | Read |
| `get_account_balance` | Get TRX balance at a specific block height (historical query). | `address`, `blockHash`, `blockNumber`, `network` | Read |
| `get_account_net` | Get bandwidth resource information for an account. | `address`, `network` | Read |
| `get_account_resource` | Get energy, bandwidth, frozen balance, and delegation info. | `address`, `network` | Read |
| `get_delegated_resource` | Query delegated resources between two accounts. | `fromAddress`, `toAddress`, `network` | Read |
| `get_delegated_resource_index` | Query resource delegation index (who delegated to/from this account). | `address`, `network` | Read |
| `generate_account` | Generate a new TRON keypair offline (does not activate on-chain). | - | Read |
| `validate_address` | Validate a TRON address and detect its format. | `address` | Read |
| `create_account` | Activate a new account on the network (costs bandwidth). | `address`, `network` | Write |
| `update_account` | Update account name (can only be set once). | `accountName`, `network` | Write |
| `account_permission_update` | Update account permissions (multi-signature configuration). | `ownerPermission`, `activePermissions`, `witnessPermission`, `network` | Write |

**Example prompts:**
- "Show the full account details for address TXyz..."
- "How much Energy and Bandwidth does address TXyz... have?"
- "Generate a new TRON address"
- "Is this a valid TRON address: TXyz...?"

---

### Account Data (via TronGrid API)

These tools use TronGrid's indexed API for richer account data queries.

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `get_account_info` | Get comprehensive account info from TronGrid. | `address`, `network` | Read |
| `get_account_transactions` | Get transaction history for an account. | `address`, `limit`, `fingerprint`, `network` | Read |
| `get_account_trc20_transactions` | Get TRC20 transfer history. | `address`, `contractAddress`, `limit`, `fingerprint`, `network` | Read |
| `get_account_internal_transactions` | Get internal transactions for an account. | `address`, `limit`, `fingerprint`, `network` | Read |
| `get_account_trc20_balances` | Get all TRC20 token balances for an account. | `address`, `network` | Read |

**Example prompts:**
- "Show the recent transaction history for address TXyz..."
- "What TRC20 tokens does address TXyz... hold?"
- "Show the USDT transfer history for this address"

:::info Pagination
Tools that return lists support `limit` and `fingerprint` parameters for pagination. Use the `fingerprint` from the previous response to get the next page.
:::

---

### Contract Data (via TronGrid API)

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `get_contract_transactions` | Get transaction history for a contract. | `address`, `limit`, `fingerprint`, `network` | Read |
| `get_contract_internal_transactions` | Get internal transactions for a contract. | `address`, `limit`, `fingerprint`, `network` | Read |
| `get_trc20_token_holders` | Get token holder list for a TRC20 contract. | `address`, `limit`, `fingerprint`, `network` | Read |

**Example prompts:**
- "Who are the top holders of this TRC20 token?"
- "Show the recent transactions on this contract"

---

### Resource Delegation (Stake 2.0)

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `delegate_resource` | Delegate staked Energy or Bandwidth to another address. | `receiverAddress`, `amount`, `resource`, `lock`, `lockPeriod`, `network` | Write |
| `undelegate_resource` | Revoke previously delegated resources. | `receiverAddress`, `amount`, `resource`, `network` | Write |
| `get_can_delegated_max_size` | Get max delegatable TRX amount for an address. | `address`, `resource`, `network` | Read |
| `get_delegated_resource_v2` | Get delegated resource details between two addresses. | `fromAddress`, `toAddress`, `network` | Read |
| `get_delegated_resource_account_index_v2` | Get delegated resource account index. | `address`, `network` | Read |

**Example prompts:**
- "Delegate 500 TRX worth of Energy to address TXyz..."
- "How much can I delegate to others?"
- "Show all my resource delegations"

---

### Staking (Stake 2.0)

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `freeze_balance_v2` | Freeze (stake) TRX to obtain Energy or Bandwidth. | `amount`, `resource`, `network` | Write |
| `unfreeze_balance_v2` | Unfreeze (unstake) TRX to release resources. | `amount`, `resource`, `network` | Write |
| `withdraw_expire_unfreeze` | Withdraw expired unfrozen balance back to available TRX. | `network` | Write |
| `cancel_all_unfreeze_v2` | Cancel pending unfreezes and re-stake immediately. | `network` | Write |
| `get_available_unfreeze_count` | Get remaining unfreeze operations count (max 32 concurrent). | `address`, `network` | Read |
| `get_can_withdraw_unfreeze_amount` | Get withdrawable unstaked TRX amount at a given timestamp. | `address`, `timestampMs`, `network` | Read |

**Example prompts:**
- "Stake 1000 TRX for Energy"
- "Unstake 500 TRX from Bandwidth"
- "Do I have any expired unfreezes I can withdraw?"

:::info About Stake 2.0
TRON uses Stake 2.0 for resource management. When you freeze TRX, you get Energy (for smart contract execution) or Bandwidth (for regular transactions). Unfreezing has a ~14-day waiting period before you can withdraw the TRX back.
:::

---

### Governance & Super Representatives

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `list_witnesses` | List all Super Representatives on the network. | `network` | Read |
| `get_paginated_witnesses` | Get paginated list of active SRs. | `offset`, `limit`, `network` | Read |
| `get_next_maintenance_time` | Get next maintenance window timestamp (vote tally time). | `network` | Read |
| `get_reward` | Query unclaimed voting reward for an address. | `address`, `network` | Read |
| `get_brokerage` | Query SR brokerage ratio (reward split with voters). | `witnessAddress`, `network` | Read |
| `create_witness` | Apply to become a Super Representative candidate (costs 9999 TRX). | `url`, `network` | Write |
| `update_witness` | Update Super Representative website URL. | `url`, `network` | Write |
| `vote_witness` | Vote for Super Representatives with frozen TRX. | `votes`, `network` | Write |
| `withdraw_balance` | Withdraw accumulated SR voting rewards. | `network` | Write |
| `update_brokerage` | Update SR brokerage ratio. | `brokerage`, `network` | Write |

**Example prompts:**
- "List the top 27 Super Representatives on TRON"
- "How much unclaimed voting reward does my address have?"
- "Vote for SR candidate TXyz... with 1000 votes"

---

### Proposals

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `list_proposals` | List all governance proposals. | `network` | Read |
| `get_proposal` | Get proposal details by ID. | `proposalId`, `network` | Read |
| `create_proposal` | Create a governance proposal (SR only). | `parameters`, `network` | Write |
| `approve_proposal` | Vote to approve/disapprove a proposal. | `proposalId`, `approve`, `network` | Write |
| `delete_proposal` | Delete a governance proposal (creator only). | `proposalId`, `network` | Write |

**Example prompts:**
- "Show all active TRON governance proposals"
- "What are the details of proposal #42?"

---

### Events

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `get_events_by_transaction_id` | Get events emitted by a specific transaction. | `transactionId`, `network` | Read |
| `get_events_by_contract_address` | Get events emitted by a specific contract. | `contractAddress`, `eventName`, `limit`, `network` | Read |
| `get_events_by_block_number` | Get events emitted in a specific block. | `blockNumber`, `network` | Read |
| `get_events_of_latest_block` | Get events from the latest block. | `network` | Read |

**Example prompts:**
- "What events did transaction abc123... emit?"
- "Show the recent Transfer events from USDT contract"
- "What events happened in the latest block?"

---

### Mempool

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `get_pending_transactions` | Get pending transaction IDs in the mempool. | `network` | Read |
| `get_transaction_from_pending` | Get a specific pending transaction by ID. | `txId`, `network` | Read |
| `get_pending_size` | Get number of pending transactions in the pool. | `network` | Read |

**Example prompts:**
- "How many transactions are pending in the TRON mempool?"
- "Is transaction abc123... still pending?"

---

### Node

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `list_nodes` | List all connected node addresses. | `network` | Read |
| `get_node_info` | Get detailed node information (version, resources, etc.). | `network` | Read |

---

### Full-Node Query API

These tools provide direct access to TRON full-node RPC methods for advanced queries.

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `get_block_by_num` | Query block by block height. | `num`, `network` | Read |
| `get_block_by_id` | Query block by block hash. | `value`, `network` | Read |
| `get_block_by_latest_num` | Get the most recent N blocks (solidified). | `num`, `network` | Read |
| `get_block_by_limit_next` | Get blocks within a height range `[startNum, endNum)`. | `startNum`, `endNum`, `network` | Read |
| `get_now_block` | Get the current latest block. | `network` | Read |
| `get_transaction_by_id` | Query transaction by hash. | `value`, `network` | Read |
| `get_transaction_info_by_id` | Query transaction receipt by hash. | `value`, `network` | Read |
| `get_transaction_info_by_block_num` | Get receipts for all transactions in a block. | `num`, `network` | Read |
| `get_energy_prices` | Query historical energy unit prices over time. | `network` | Read |
| `get_bandwidth_prices` | Query historical bandwidth unit prices over time. | `network` | Read |
| `get_burn_trx` | Query total TRX burned from transaction fees. | `network` | Read |
| `get_approved_list` | Query accounts that signed a given transaction. | `transaction`, `network` | Read |
| `get_block_balance` | Get all balance change operations in a specific block. | `hash`, `number`, `network` | Read |

---

### Broadcast & Transaction Building

| Tool Name | Description | Key Parameters | Mode |
| :--- | :--- | :--- | :--- |
| `broadcast_transaction` | Broadcast a signed transaction (JSON format). | `transaction`, `network` | Write |
| `broadcast_hex` | Broadcast a signed transaction (hex-encoded protobuf). | `transaction`, `network` | Write |
| `create_transaction` | Create an unsigned TRX transfer transaction. | `ownerAddress`, `toAddress`, `amount`, `network` | Write |

**Example prompts:**
- "Create an unsigned transaction to transfer 10 TRX from my address to TXyz..."
- "Broadcast this signed transaction: {...}"

---

## Prompts (6 total)

Prompts are pre-defined workflow templates that guide the AI through complex multi-step operations. They help ensure safety (e.g., confirming before transfers) and thoroughness (e.g., checking balance before sending).

| Prompt Name | Description | Key Parameters | Requires Wallet |
| :--- | :--- | :--- | :--- |
| `prepare_transfer` | Safely prepare and execute a token transfer with balance checks, cost estimation, and user confirmation. | `tokenType`, `recipient`, `amount`, `network`, `tokenAddress` | Yes |
| `interact_with_contract` | Safely execute write operations on a smart contract with parameter validation, cost estimation, and confirmation. | `contractAddress`, `functionName`, `args`, `value`, `network` | Yes |
| `diagnose_transaction` | Analyze transaction status, identify failure causes, and provide debugging insights. | `txHash`, `network` | No |
| `explain_tron_concept` | Explain TRON and blockchain concepts (Energy, Bandwidth, Staking, etc.) with examples. | `concept` | No |
| `analyze_wallet` | Get comprehensive overview of wallet assets, balances, and activity. | `address`, `network`, `tokens` | No |
| `check_network_status` | Check current network health, block production, and resource costs. | `network` | No |

**Example prompts:**
- "Help me transfer 100 TRX to TXyz... safely" (triggers `prepare_transfer`)
- "Analyze transaction abc123... — why did it fail?" (triggers `diagnose_transaction`)
- "Explain how Energy works on TRON" (triggers `explain_tron_concept`)
- "Give me a full analysis of wallet TXyz..." (triggers `analyze_wallet`)

---

## Resources (1 total)

Resources provide static reference data that the AI can query for context.

| Resource Name | URI | Description |
| :--- | :--- | :--- |
| `supported_networks` | `tron://networks` | Returns the list of all supported TRON networks and their configuration (RPC URLs, explorer links, etc.). |
