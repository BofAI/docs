# Introduction

TRON MCP Server is designed to provide AI agents with the ability to interact with the TRON blockchain. Through a unified interface, AI agents can utilize tools and AI-guided prompts to access TRON network services, supporting TRX, TRC20 tokens, and smart contract operations. The server leverages the `tronweb` library to fully support the TRON ecosystem.

## MCP Server URL
For the convenience of users with different needs, you can choose to connect directly to the [official cloud service](./UsingOfficialService.md) or choose to perform [local deployment](./UsingLocalService.md) on your own computer. Among them, the official service only provides reading services.

| Environment | URL |
| :------- | :--------------------------------------- |
| Production | [https://tron-mcp-server.bankofai.io/mcp](https://tron-mcp-server.bankofai.io/mcp) |


## Core Capabilities Overview

*   **Blockchain Data**: Read blocks, transactions, and chain parameters (such as energy/bandwidth costs).
*   **Smart Contracts**: Interact with any TRON smart contract (supports read/write).
*   **Token Services**: Transfer TRX and TRC20 tokens; check balances and metadata.
*   **Address Management**: Convert and verify addresses between Hex and Base58 formats.
*   **Security Integration**: Supports private key and mnemonic (BIP-39) wallets to ensure secure operations.
*   **Multi-Network Support**: Fully covers Mainnet, Nile, and Shasta testnets.


## Detailed Functional Features

A specific list of functions provided by TRON MCP Server for the reference of developers and advanced users:

### Blockchain Data Access
*   **Multi-Network Support**: Supports Mainnet, Nile, and Shasta networks.
*   **Chain Information Query**: Get current block height, chain ID, and RPC node information.
*   **Block Data**: Access detailed block information via block number or hash.
*   **Transaction Details**: Get full details of transactions, including resource consumption (energy/bandwidth).
*   **Resource Cost Query**: Real-time query of price parameters for energy and bandwidth on the chain.

### Token Services
*   **Native TRX**: Supports balance query and transfer operations.
*   **TRC20 Tokens**:
    *   Query token balance.
    *   Execute token transfers.
    *   Get token metadata (name, symbol, precision).

### Address Services
*   **Format Conversion**: Seamlessly convert between Hex (`41...` or `0x...`) and Base58 (`T...`) formats.
*   **Address Verification**: Verify the validity of a specific address on the TRON network.

### Smart Contract Interaction
*   **Read Contract**: Call `view` and `pure` type functions.
*   **Write Contract**: Execute contract functions that change the state on the chain.
*   **ABI Auto-Acquisition**: Automatically acquire the ABI interface of verified contracts from the blockchain.

### Wallet and Security
*   **Flexible Configuration**: Supports configuration via `TRON_PRIVATE_KEY` or `TRON_MNEMONIC`.
*   **Hierarchical Deterministic (HD) Wallet**: Supports BIP-44 derivation path `m/44'/195'/0'/0/{index}`.
*   **Message Signing**: Supports secure signing of arbitrary messages.

## Security Considerations
*   **Private Key Management**: Private keys and mnemonics should always be managed securely via environment variables; never hardcode them or store them in insecure files.
*   **Testnet First**: Always thoroughly test on Nile or Shasta testnets before deploying any operations to the mainnet.
*   **Principle of Least Privilege**: Wallets configured for AI agents should only contain the minimum funds required to perform their tasks.
   
## License

This project is released under the MIT License.
