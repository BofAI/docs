# Introduction

A comprehensive Model Context Protocol (MCP) server that provides blockchain services for the TRON network. This server enables AI agents to interact with the TRON blockchain through tools and AI-guided prompts via a unified interface, supporting TRX, TRC20 tokens, and smart contracts.

The TRON MCP server leverages the Model Context Protocol to deliver blockchain services to AI agents. It uses `tronweb` to fully support the TRON ecosystem.

## Key Features

* **Blockchain Data**: Read blocks, transactions, and chain parameters (energy/bandwidth costs).
* **Smart Contracts**: Interact with any TRON smart contract (read/write).
* **Tokens**: Transfer TRX and TRC20 tokens; check balances.
* **Address Management**: Convert between Hex (0x...) and Base58 (T...) formats.
* **Wallet Integration**: Supports private key and mnemonic (BIP-39) wallets.
* **Multi-Network**: Seamless support for Mainnet, Nile, and Shasta.

## Security Considerations

* **Private Key Management**: Private keys and mnemonics should always be managed securely via environment variables. Never hardcode them or store them in insecure files.
* **Testnet First**: Always thoroughly test on Nile or Shasta testnets before deploying any operations to mainnet.
* **Principle of Least Privilege**: Wallets configured for AI agents should only contain the minimum funds required to perform their tasks.
* **Code Audit**: It is recommended to conduct a security audit of the server code before using it in a production environment.

## License

This project is released under the MIT License.
