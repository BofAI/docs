# Features

### Blockchain Data Access

* **TRON Network Support**: Mainnet, Nile, Shasta.
* **Chain Information**: Block number, chain ID, RPC endpoint.
* **Block Data**: Access by number or hash.
* **Transaction Details**: Full details, including resource usage (Energy/Bandwidth).
* **Resource Costs**: Query current chain parameters for energy and bandwidth pricing.

### Token Services

* **Native TRX**: Check balance and transfer.
* **TRC20 Tokens**:
  * Check balance.
  * Transfer tokens.
  * Retrieve token metadata (name, symbol, decimals).

### Address Services

* **Format Conversion**: Convert between Hex (`41...` or `0x...`) and Base58 (`T...`) formats.
* **Validation**: Verify whether an address is valid on TRON.

### Smart Contract Interaction

* **Read Contracts**: Call `view` and `pure` functions.
* **Write Contracts**: Execute state-changing functions.
* **ABI Retrieval**: Automatically fetch ABI for verified contracts from the blockchain.

### Wallet & Security

* **Flexible Wallet Configuration**: Configure via `TRON_PRIVATE_KEY` or `TRON_MNEMONIC`.
* **HD Wallet Support**: BIP-44 derivation path `m/44'/195'/0'/0/{index}`.
* **Signing**: Sign arbitrary messages.

## Supported Networks

* **Mainnet**: `mainnet` (default)
* **Nile Testnet**: `nile`
* **Shasta Testnet**: `shasta`
