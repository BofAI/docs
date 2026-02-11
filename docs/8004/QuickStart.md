import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start
`bankofai.sdk_8004` is the **reference implementation of the 8004 standard**, designed for the Agentic Economy. As a Software Development Kit (SDK), it leverages blockchain and decentralized storage to enable Agents to register identities, publish capabilities, and establish reputation systems, thereby achieving permissionless discovery without relying on intermediaries.

This example covers the entire process of initializing the SDK, defining agent attributes, publishing MCP/A2A capabilities, registering them on the blockchain, and finally retrieving them by ID.

<Tabs>
<TabItem value="python" label="python">

```python
from bankofai.sdk_8004.core.sdk import SDK
import os

# Initialize the SDK
# Subgraph automatically uses the default URL - no configuration needed!
sdk = SDK(
    network="eip155:97",
    rpcUrl=os.getenv("RPC_URL"),
    signer=os.getenv("PRIVATE_KEY"),
    ipfs="pinata",
    pinataJwt=os.getenv("PINATA_JWT")
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
     .addDomain("technology/data_science", validate_oasf=True)

# Set Status
agent.setActive(True)
agent.setX402Support(False)

# Register on-chain
reg_tx = agent.register("https://example.com/agent-card.json")
reg = reg_tx.wait_confirmed(timeout=180).result

# Optional: Set a dedicated agent wallet on-chain (requires signature verification);
# By default, the agent wallet is the owner's wallet; only set if you want to use a different wallet.
# agent.setWallet("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", chainId=97)

print(f"✅ Agent registered!")
print(f"   ID: {reg.agentId}")
print(f"   URI: {reg.agentURI}")

# Retrieve Agent
retrieved = sdk.getAgent(agent.agentId)
print(f"✅ Retrieved: {retrieved.name}")

```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
import { SDK } from '@bankofai/8004-sdk';

async function main() {
  // Initialize the SDK
  // Subgraph automatically uses the default URL - no configuration needed!
  const sdk = new SDK({
    network: "eip155:97",
    rpcUrl: process.env.RPC_URL || "",
    signer: process.env.PRIVATE_KEY,
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
// await agent.setWallet("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");

  console.log("✅ Agent registered!");
  console.log(`   ID: ${registrationFile.agentId}`);
  console.log(`   URI: ${registrationFile.agentURI}`);

  // Retrieve Agent (asynchronous operation in TypeScript)
  const retrieved = await sdk.getAgent(registrationFile.agentId!);
  console.log(`✅ Retrieved: ${retrieved.name}`);
}

main().catch(console.error);
```

</TabItem>
</Tabs>
