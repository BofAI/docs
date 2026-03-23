# Official Cloud Service Access

## What is the Official Cloud Service?

The official cloud service is a TRON MCP Server instance hosted by **BANK OF AI**, providing AI clients with **read-only query capabilities for the TRON blockchain**.

In the traditional approach, if you want an AI assistant to read on-chain data, you typically need to:

- Install Node.js and related dependencies locally
- Clone the repository and complete the build
- Configure environment variables and network parameters
- Maintain server version updates yourself

This is far too much overhead for users who simply want to check a balance.

**The core purpose of the official cloud service is to handle all of this infrastructure for you.** You only need to add a single service URL to your AI client's configuration to start interacting with the TRON blockchain.

### Key Advantages

**1. No private key exposure risk**

Since the cloud service is read-only, you never need to provide a wallet private key or mnemonic. This fundamentally eliminates risks like key leakage and config files accidentally committed to Git. It's especially convenient for team collaboration — any member can connect directly without key distribution or management concerns.

**2. Official maintenance and continuous updates**

The cloud service is maintained by the official team and always runs the latest stable version of TRON MCP Server. This includes:

- Updates with new tools and features
- Adaptations for underlying TRON network upgrades
- Continuous performance and stability improvements

You don't need to worry about version numbers or manually run `npm install` or rebuild.

**3. Covers the vast majority of real-world use cases**

The most common daily operations — checking address balances, analyzing transaction details, reading contract state, viewing the Super Representative list, monitoring on-chain events — are all read-only queries, fully supported through the cloud service. Only when you need to actually move assets (transfers, staking, contract writes) do you need to switch to [Local Private Deployment](./LocalPrivatizedDeployment.md).

> In short: **The official cloud service acts as a "read-only API gateway" for the TRON blockchain** — AI clients only need the service URL to query all public on-chain data.

:::warning Important
The official cloud service only provides **read-only access**. It does **not support** transfers, contract writes, staking, or any other write operations. For full functionality, please use [Local Private Deployment](./LocalPrivatizedDeployment.md).
:::

---

## How to Connect

Simply tell your AI Agent to execute the following command:

```bash
npx add-mcp https://tron-mcp-server.bankofai.io/mcp
```

Once the command completes, restart your AI Agent, and the MCP Server is ready to use — you can start interacting with the TRON blockchain.

---

## Verify Connection

Once connected, you can test by asking your AI Agent the following question:

```
Query the current block height of TRON mainnet
```

If you receive a normal response (e.g., showing the current block height), the connection is working.

If you encounter issues, please check [FAQ](./FAQ.md) for troubleshooting.

---

## Available Capabilities

When connected via the official cloud service, you can use all **read-only** tools, including but not limited to:

| Category | Example Capabilities |
| :--- | :--- |
| Balance Queries | Query TRX balance, TRC20 token balance, all token holdings |
| Transaction Queries | Look up transaction details, receipts, resource consumption |
| Block Data | Query by block number, by hash, latest block, batch queries |
| Account Info | Account details, resources, delegation info, bandwidth/energy |
| Smart Contract Reading | Call view/pure functions, get ABI, contract metadata |
| Event Queries | Query events by transaction, contract, block number |
| Network Status | Chain info, resource prices, supported networks |
| Governance | List Super Representatives, proposals, reward queries |
| Address Utilities | Format conversion, address validation |

For the Full Capability List, please refer to [Full Capability List](./ToolList.md).

---

## Next Steps

- Need transfers, staking, or contract writes? → [Local Private Deployment](./LocalPrivatizedDeployment.md)
- Want the detailed description of all 95 tools? → [Full Capability List](./ToolList.md)
