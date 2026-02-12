import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start
`bankofai.sdk_8004` is the **reference implementation of the 8004 standard**, designed for the Agentic Economy. As a Software Development Kit (SDK), it leverages blockchain and decentralized storage to enable Agents to register identities, publish capabilities, and establish reputation systems, thereby achieving permissionless discovery without relying on intermediaries.

This example covers the full flow for SDK initialization, agent definition, MCP/A2A capability publishing, and on-chain registration.

> Note: without subgraph integration, index-based queries (`searchAgents` / `getAgent`) are unavailable; direct ID loading via `loadAgent(agentId)` still works from chain data.

## TRON / BSC Switch Guide

- This page uses TRON Nile testnet as the default: `network="nile"` and `rpcUrl="https://nile.trongrid.io"`.
- To switch to BSC, replace: `network`, `rpcUrl`, and `signer` (EVM private key).
- Recommended TRON parameters: `chainId=1`, `feeLimit=120000000`.

Python (TRON) initialization:

```python
sdk = SDK(
    chainId=1,
    network="nile",  # or tron:nile; for mainnet use mainnet / tron:mainnet
    rpcUrl="https://nile.trongrid.io",
    signer="YOUR_TRON_PRIVATE_KEY",
    feeLimit=120000000,
)
```

TypeScript (TRON) initialization:

```typescript
const sdk = new SDK({
  chainId: 1,
  network: "nile", // or tron:nile; for mainnet use mainnet / tron:mainnet
  rpcUrl: "https://nile.trongrid.io",
  signer: "YOUR_TRON_PRIVATE_KEY",
  feeLimit: 120000000,
});
```

Python (BSC) initialization:

```python
sdk = SDK(
    chainId=97,
    network="eip155:97",  # BSC testnet; use eip155:56 for mainnet
    rpcUrl="https://data-seed-prebsc-1-s1.binance.org:8545",
    signer="0xYOUR_EVM_PRIVATE_KEY",
)
```

TypeScript (BSC) initialization:

```typescript
const sdk = new SDK({
  chainId: 97,
  network: "eip155:97", // BSC testnet; use eip155:56 for mainnet
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
  signer: "0xYOUR_EVM_PRIVATE_KEY",
});
```

<Tabs>
<TabItem value="python" label="python">

```python
from bankofai.sdk_8004.core.sdk import SDK

# Quick Start: Local Environment Variables  (Please replace with your actual values) 
RPC_URL = "https://nile.trongrid.io"
PRIVATE_KEY = "YOUR_TRON_PRIVATE_KEY"
PINATA_JWT = "YOUR_PINATA_JWT"

# Initialize the SDK
sdk = SDK(
    chainId=1,
    network="nile",
    rpcUrl=RPC_URL,
    signer=PRIVATE_KEY,
    feeLimit=120000000,
    ipfs="pinata",
    pinataJwt=PINATA_JWT
)

# Create an Agent
agent = sdk.createAgent(
    name="My AI Agent",
    description="An intelligent assistant for handling various tasks",
    image="https://example.com/agent.png"
)

# Configure Endpoints
agent.setMCP("https://mcp.example.com/")
agent.setA2A("https://a2a.example.com/agent-card.json")
agent.setENS("myagent.eth")

# Configure Trust Model
agent.setTrust(reputation=True, cryptoEconomic=True)

# Add Metadata
agent.setMetadata({
    "version": "1.0.0",
    "category": "ai-assistant"
})

# Add OASF Skills and Domains
agent.addSkill("data_engineering/data_transformation_pipeline", validate_oasf=True)\
     .addDomain("technology/data_science/data_science", validate_oasf=True)

# Set Status
agent.setActive(True)
agent.setX402Support(False)

# Register on-chain
reg_tx = agent.register("https://example.com/agent-card.json")
reg = reg_tx.wait_confirmed(timeout=180).result

# Optional: Set a dedicated agent wallet on-chain (requires signature verification);
# By default, the agent wallet is the owner's wallet; only set if you want to use a different wallet.
# agent.setWallet("TYourTronWalletAddress", chainId=1)

print(f"✅ Agent registered!")
print(f"   ID: {reg.agentId}")
print(f"   URI: {reg.agentURI}")

# Load agent by ID directly from chain (works without subgraph)
loaded = sdk.loadAgent(reg.agentId)
print(f"✅ Loaded by ID: {loaded.registration_file.name}")

```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
import { SDK } from '@bankofai/8004-sdk';

async function main() {
  // Quick Start: Local Environment Variables  (Please replace with your actual values) 
  const RPC_URL = "https://nile.trongrid.io";
  const PRIVATE_KEY = "YOUR_TRON_PRIVATE_KEY";
  
  // Initialize the SDK
  const sdk = new SDK({
    chainId: 1,
    network: "nile",
    rpcUrl: RPC_URL,
    signer: PRIVATE_KEY,
    feeLimit: 120000000,
  });

  // Create an Agent
  const agent = sdk.createAgent({
    name: "My AI Agent",
    description: "An intelligent assistant for handling various tasks",
    image: "https://example.com/agent.png",
  });

  // Configure Endpoints
  agent.setMCP("https://mcp.example.com/");
  agent.setA2A("https://a2a.example.com/agent-card.json");

  // Configure Trust Model
  agent.setTrust({ reputation: true, cryptoEconomic: true });

  // Add Metadata
  agent.setMetadata({
    version: '1.0.0',
    category: 'ai-assistant',
  });

// Add OASF Skills and Domains
agent
  .addSkill("data_engineering/data_transformation_pipeline")
  .addDomain("technology/data_science");

// Set Status
agent.setActive(true);
agent.setX402Support(false);

// Register on-chain
const tx = await agent.register("https://example.com/agent-card.json");
const { result: registrationFile } = await tx.waitConfirmed();

// Optional: Set a dedicated agent wallet on-chain (requires signature verification);
// By default, the agent wallet is the owner's wallet; only set if you want to use a different wallet.
// await agent.setWallet("TYourTronWalletAddress");

  console.log("✅ Agent registered!");
  console.log(`   ID: ${registrationFile.agentId}`);
  console.log(`   URI: ${registrationFile.agentURI}`);

  // Load agent by ID directly from chain (works without subgraph)
  const loaded = await sdk.loadAgent(registrationFile.agentId!);
  console.log(`✅ Loaded by ID: ${loaded.registrationFile.name}`);
}

main().catch(console.error);
```

</TabItem>
</Tabs>
