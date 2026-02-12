import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 快速开始
`bankofai.sdk_8004` 是 **8004 标准的参考实现**，专为 Agentic Economy 打造。作为一套 SDK，它利用区块链与去中心化存储赋予 Agents 注册身份、发布能力及建立信誉系统的功能，从而实现了无需依赖中介的无许可发现机制。

此示例涵盖了初始化 SDK、定义 Agents 属性、发布 MCP/A2A 能力、将其注册至区块链以及最后通过 ID 重新检索的过程。


<Tabs>
<TabItem value="python" label="python">

```python
from bankofai.sdk_8004.core.sdk import SDK

# 快速开始本地变量（请替换成你的真实值）
RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545"
PRIVATE_KEY = "0xYOUR_PRIVATE_KEY"
PINATA_JWT = "YOUR_PINATA_JWT"

# Initialize SDK
sdk = SDK(
    network="eip155:97",
    rpcUrl=RPC_URL,
    signer=PRIVATE_KEY,
    ipfs="pinata",
    pinataJwt=PINATA_JWT
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
     .addDomain("technology/data_science/data_science", validate_oasf=True)

# Set status
agent.setActive(True)
agent.setX402Support(False)

# Register on-chain
reg_tx = agent.register("https://example.com/agent-card.json")
reg = reg_tx.wait_confirmed(timeout=180).result

# Optional: set a dedicated agent wallet on-chain (signature-verified;
# By default, agentWallet starts as the owner wallet; only set this if you want a different one.
# agent.setWallet("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", chainId=97)

print(f"✅ Agent registered!")
print(f"   ID: {reg.agentId}")
print(f"   URI: {reg.agentURI}")

# Retrieve agent
retrieved = sdk.getAgent(agent.agentId)
print(f"✅ Retrieved: {retrieved.name}")

```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
import { SDK } from '@bankofai/8004-sdk';

async function main() {
  // 快速开始本地变量（请替换成你的真实值）
  const RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545";
  const PRIVATE_KEY = "0xYOUR_PRIVATE_KEY";

  // Initialize SDK
  const sdk = new SDK({
    network: "eip155:97",
    rpcUrl: RPC_URL,
    signer: PRIVATE_KEY,
  });

  // Create agent
  const agent = sdk.createAgent({
    name: "My AI Agent",
    description: "An intelligent assistant for various tasks",
    image: "https://example.com/agent.png",
  });

  // Configure endpoints
  agent.setMCP("https://mcp.example.com/");
  agent.setA2A("https://a2a.example.com/agent-card.json");

  // Configure trust models
  agent.setTrust({ reputation: true, cryptoEconomic: true });

  // Add metadata
  agent.setMetadata({
    version: '1.0.0',
    category: 'ai-assistant',
  });

// Add OASF skills and domains
agent
  .addSkill("data_engineering/data_transformation_pipeline")
  .addDomain("technology/data_science");

// Set status
agent.setActive(true);
agent.setX402Support(false);

// Register on-chain
const tx = await agent.register("https://example.com/agent-card.json");
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

</TabItem>
</Tabs>
