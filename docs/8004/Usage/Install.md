# Installation Guide

## Install with Python

### Prerequisites

*   **Python**: 3.8 or higher
*   **pip**: Package manager
*   **Private Key**: For signing transactions (not required for read-only mode)
*   **RPC Node**: Accessible Ethereum RPC endpoint (e.g., Alchemy, Infura)
*   **IPFS Provider (Optional)**: Pinata, Filecoin account, or local IPFS node
*   **Subgraph**: Automatically configures default URL (supports custom Subgraph endpoints via overrides)

### Installation Steps
#### 1. Install using pip
Execute in a terminal window:
```bash
pip install bankofai-8004-sdk
```
#### 2. Install from source
Execute in a terminal window:
```bash
git clone https://github.com/bankofai/8004-sdk.git
cd 8004-sdk/python
pip install -e .
```
### Core Dependencies
`bankofai.sdk_8004` depends on the following components:

*   **web3** - EVM chain interaction
*   **eth-account** - Account management and signing
*   **tronpy** - TRON blockchain interaction
*   **requests** - HTTP request handling
*   **aiohttp** - Asynchronous HTTP client
*   **eth-hash** - Hashing utilities (e.g., keccak)

> **Note**: All dependencies are automatically installed when installing via pip.


## Install with TypeScript
### Prerequisites
*   **Node.js**: 20 or higher
*   **npm or yarn**: Package manager
*   **Write Operation Configuration**: Requires server-side private key (`privateKey`) or browser wallet (`walletProvider`, EIP-1193) to be configured
*   **RPC Node**: Accessible Ethereum RPC endpoint (e.g., Alchemy, Infura)
*   **IPFS Provider (Optional)**: Pinata, Filecoin account, or local IPFS node
*   **Subgraph**: Automatically configures default URL (supports custom Subgraph endpoints via overrides)



### Installation Steps
#### 1. Install using npm
Execute in a terminal window:
```bash
npm install @bankofai/8004-sdk
```
#### 2. Install from source
Execute in a terminal window:
```bash
git clone https://github.com/bankofai/8004-sdk.git
cd 8004-sdk/ts
npm install
npm run build
```


### Core Dependencies

`@bankofai/8004-sdk` depends on the following components:

*   **viem** / EVM client technology stack (bundled via npm dependencies)
*   **tronweb** / TRON client technology stack (bundled via npm dependencies)
*   **graphql-request** / GraphQL tool for Subgraph queries (bundled via npm dependencies)

> **Note**: All dependencies are automatically installed when installing via npm or yarn.

## Optional Dependencies

For enhanced functionality:

*   **Subgraph**: Automatically configured with a default URL for fast search queries (can be overridden via `subgraphOverrides` parameter to point to a custom endpoint).
*   **IPFS Providers**: Supports using Pinata JWT or Filecoin private key for decentralized file storage.
