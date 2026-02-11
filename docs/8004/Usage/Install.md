# Installation Guide

## Install via Python

### Prerequisites

* **Python**: 3.8 or higher
* **pip**: Package manager
* **Private Key**: Required for signing transactions (not needed for read-only mode)
* **RPC Node**: Accessible Ethereum RPC endpoint (e.g., Alchemy, Infura)
* **IPFS Provider (Optional)**: Pinata, Filecoin account, or a local IPFS node
* **Subgraph**: Default URL is auto-configured (can be overridden with a custom Subgraph endpoint)

### Installation Steps

#### 1. Install via pip

Run the following command in your terminal:

```bash
pip install agent0-sdk
```

#### 2. Install from Source
Run the following commands in your terminal:
```bash
git clone [https://github.com/agent0lab/agent0-py.git](https://github.com/agent0lab/agent0-py.git)
cd agent0-py
pip install -e .
```

### Core Dependencies

Agent0 SDK depends on the following components:

* **web3** – Ethereum blockchain interaction  
* **eth-account** – Account management and transaction signing  
* **requests** – HTTP request handling  
* **ipfshttpclient** – IPFS integration  
* **pydantic** – Data validation and settings management  
* **python-dotenv** – Environment variable management  
* **aiohttp** – Asynchronous HTTP client  

> **Note**: All dependencies are automatically installed when installing via pip.

## Install via TypeScript

### Prerequisites

* **Node.js**: Version 22 or higher  
* **npm or yarn**: Package manager  
* **Write Operation Configuration**: Configure a server-side private key (`privateKey`) or a browser wallet (`walletProvider`, EIP-1193)  
* **RPC Node**: An accessible Ethereum RPC endpoint (e.g., Alchemy, Infura)  
* **IPFS Provider (Optional)**: Pinata, Filecoin account, or a local IPFS node  
* **Subgraph**: Default URL is automatically configured (can be overridden with a custom Subgraph endpoint)  

---

### Installation Steps

#### 1. Install via npm

Run the following command in your terminal:

```bash
npm install agent0-sdk
```

#### 2. Install from Source
Run the following commands in your terminal:
```bash
git clone https://github.com/agent0lab/agent0-ts.git
cd agent0-ts
npm install
npm run build
```

### Core Dependencies

Agent0 SDK depends on the following components:

* **viem** – EVM client stack (bundled via npm dependencies)  
* **graphql-request** – GraphQL client for Subgraph queries (bundled via npm dependencies)  

> **Note**: All dependencies are automatically installed when using npm or yarn.

---

## Optional Dependencies

For enhanced functionality:

* **Subgraph**: A default URL is automatically configured for fast search queries (can be overridden using the `subgraphOverrides` parameter to point to a custom endpoint).  
* **IPFS Providers**: Supports decentralized file storage using a Pinata JWT or a Filecoin private key.
