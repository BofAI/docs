# API Reference

### Tools

#### Wallet & Address

| Tool Name | Description | Key Parameters |
| :-- | :-- | :-- |
| `get_wallet_address` | Get the configured wallet address (Base58 & Hex). | - |
| `convert_address` | Convert between Hex and Base58 formats. | `address` |

#### Network & Resources

| Tool Name | Description | Key Parameters |
| :-- | :-- | :-- |
| `get_chain_info` | Get current block number and chain ID. | `network` |
| `get_chain_parameters` | Get current energy and bandwidth costs. | `network` |
| `get_supported_networks` | List available networks. | - |

#### Blocks & Transactions

| Tool Name | Description | Key Parameters |
| :-- | :-- | :-- |
| `get_block` | Get a block by number or hash. | `blockIdentifier`, `network` |
| `get_latest_block` | Get the latest block. | `network` |
| `get_transaction` | Get transaction details by hash. | `txHash`, `network` |
| `get_transaction_info` | Get receipt/info including resource usage. | `txHash`, `network` |

#### Balances

| Tool Name | Description | Key Parameters |
| :-- | :-- | :-- |
| `get_balance` | Get TRX balance of an address. | `address`, `network` |
| `get_token_balance` | Get TRC20 token balance of an address. | `address`, `tokenAddress`, `network` |

#### Transfers (Write)

| Tool Name | Description | Key Parameters |
| :-- | :-- | :-- |
| `transfer_trx` | Transfer TRX to another address. | `toAddress`, `amount`, `network` |
| `transfer_trc20` | Transfer TRC20 tokens to another address. | `toAddress`, `tokenAddress`, `amount`, `network` |

#### Smart Contracts (Write)

| Tool Name | Description | Key Parameters |
| :-- | :-- | :-- |
| `trigger_smart_contract` | Call a state-changing function of a smart contract. | `contractAddress`, `functionSelector`, `parameters`, `network` |

#### Smart Contracts (Read)

| Tool Name | Description | Key Parameters |
| :-- | :-- | :-- |
| `trigger_constant_contract` | Call a read-only (`view` or `pure`) function of a smart contract. | `contractAddress`, `functionSelector`, `parameters`, `network` |
| `get_contract_abi` | Get the ABI of a verified contract. | `contractAddress`, `network` |

#### Resource Management

| Tool Name | Description | Key Parameters |
| :-- | :-- | :-- |
| `freeze_balance` | Freeze TRX to obtain bandwidth or energy. | `amount`, `resource`, `duration`, `network` |
| `unfreeze_balance` | Unfreeze TRX. | `resource`, `network` |
| `delegate_resource` | Delegate bandwidth or energy to another address. | `amount`, `resource`, `receiverAddress`, `network` |
| `undelegate_resource` | Undelegate bandwidth or energy. | `amount`, `resource`, `receiverAddress`, `network` |

### Prompts

#### `tron_query`

A prompt for making general queries to the TRON blockchain. It utilizes the above tools to retrieve the required information.

* **Examples**:
  * “Get the TRX balance of address `Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.”
  * “Get the latest block information.”
  * “Transfer 100 TRX to `Tyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`.”

#### `tron_smart_contract_interaction`

A prompt for interacting with TRON smart contracts. It allows the AI agent to call contract functions and handle transactions.

* **Examples**:
  * “Call the `transfer` function of contract `Czzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz` to send 50 tokens to `Tkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk`.”
