# 快速开始

此示例涵盖了初始化 SDK、定义 Agents 属性、发布 MCP/A2A 能力、将其注册至区块链以及最后通过 ID 重新检索的过程。

**Python**
```
from agent0_sdk import SDK
import os

# Initialize SDK
# Subgraph automatically uses default URL - no configuration needed!
sdk = SDK(
    chainId=11155111,  
    rpcUrl=os.getenv("RPC_URL"),
    signer=os.getenv("PRIVATE_KEY"),
    ipfs="pinata",
    pinataJwt=os.getenv("PINATA_JWT")
)

# Create agent
agent = sdk.createAgent(
    name="My AI Agent",
    description="An intelligent assistant for various tasks",
    image="https://example.com/agent.png"
)

# Configure endpoints
agent.setMCP("https://mcp.example.com/")
agent.setA2A("https://a2a.example.com/agent-card.json")
agent.setENS("myagent.eth")

# Configure trust models
agent.setTrust(reputation=True, cryptoEconomic=True)

# Add metadata
agent.setMetadata({
    "version": "1.0.0",
    "category": "ai-assistant"
})

# Add OASF skills and domains
agent.addSkill("data_engineering/data_transformation_pipeline", validate_oasf=True)\
     .addDomain("technology/data_science", validate_oasf=True)

# Set status
agent.setActive(True)
agent.setX402Support(False)

# Register on-chain with IPFS
reg_tx = agent.registerIPFS()
reg = reg_tx.wait_confirmed(timeout=180).result

# Optional: set a dedicated agent wallet on-chain (signature-verified;
# By default, agentWallet starts as the owner wallet; only set this if you want a different one.
# agent.setWallet("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", chainId=11155111)

print(f"✅ Agent registered!")
print(f"   ID: {reg.agentId}")
print(f"   URI: {reg.agentURI}")

# Retrieve agent
retrieved = sdk.getAgent(agent.agentId)
print(f"✅ Retrieved: {retrieved.name}")
```

**TypeScript**

```
import { SDK } from 'agent0-sdk';

async function main() {
  // Initialize SDK
  // Subgraph automatically uses default URL - no configuration needed!
  const sdk = new SDK({
    chainId: 11155111, 
    rpcUrl: process.env.RPC_URL || '',
    privateKey: process.env.PRIVATE_KEY, // Optional: private key for signing transactions
    ipfs: 'pinata', // or 'filecoinPin' or 'node'
    pinataJwt: process.env.PINATA_JWT, // Required if ipfs='pinata'
  });

  // Create agent
  const agent = sdk.createAgent(
    'My AI Agent',
    'An intelligent assistant for various tasks',
    'https://example.com/agent.png'
  );

  // Configure endpoints (async in TypeScript)
  await agent.setMCP('https://mcp.example.com/');
  await agent.setA2A('https://a2a.example.com/agent-card.json');
  agent.setENS('myagent.eth');

  // Configure trust models
  agent.setTrust(true, true); // reputation=true, cryptoEconomic=true

  // Add metadata
  agent.setMetadata({
    version: '1.0.0',
    category: 'ai-assistant',
  });

// Add OASF skills and domains
agent
  .addSkill('data_engineering/data_transformation_pipeline', true)
  .addDomain('technology/data_science', true);

// Set status
agent.setActive(true);
agent.setX402Support(false);

// Register on-chain with IPFS (async in TypeScript)
const tx = await agent.registerIPFS();
const { result: registrationFile } = await tx.waitConfirmed();

// Optional: set a dedicated agent wallet on-chain (signature-verified;
// By default, agentWallet starts as the owner wallet; only set this if you want a different one.
// await agent.setWallet('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');

  console.log('✅ Agent registered!');
  console.log(`   ID: ${registrationFile.agentId}`);
  console.log(`   URI: ${registrationFile.agentURI}`);

  // Retrieve agent (async in TypeScript)
  const retrieved = await sdk.getAgent(registrationFile.agentId!);
  console.log(`✅ Retrieved: ${retrieved.name}`);
}

main().catch(console.error);
```