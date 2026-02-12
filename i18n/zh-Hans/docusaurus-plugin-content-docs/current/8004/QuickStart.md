import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 快速开始
`bankofai.sdk_8004` 是 **8004 标准的参考实现**，专为 Agentic Economy 打造。作为一套 SDK，它利用区块链与去中心化存储赋予 Agents 注册身份、发布能力及建立信誉系统的功能，从而实现了无需依赖中介的无许可发现机制。

此示例涵盖了初始化 SDK、定义 Agents 属性、发布 MCP/A2A 能力并将其注册至区块链的过程。

> 说明：当前未集成 subgraph 组件时，`searchAgents` / `getAgent`（索引查询）暂不支持；但可通过 `loadAgent(agentId)` 按 ID 直接从链上加载。
>
> 端点说明：`setMCP()` 和 `setA2A()` 配置的是可调用的 HTTP/HTTPS 接口；`setENS()` 仅是可选标识信息，不会替代 MCP/A2A URL。

## TRON / BSC 切换说明

- 本页默认示例使用 TRON Nile 测试网：`network="nile"`，`rpcUrl="https://nile.trongrid.io"`。
- 切换到 BSC 时，请替换：`network`、`rpcUrl`、`signer`（EVM 私钥）。
- TRON 推荐参数：`chainId=1`、`feeLimit=120000000`。

Python（TRON）初始化示例：

```python
sdk = SDK(
    chainId=1,
    network="nile",  # 或 tron:nile；主网可用 mainnet / tron:mainnet
    rpcUrl="https://nile.trongrid.io",
    signer="YOUR_TRON_PRIVATE_KEY",
    feeLimit=120000000,
)
```

TypeScript（TRON）初始化示例：

```typescript
const sdk = new SDK({
  chainId: 1,
  network: "nile", // 或 tron:nile；主网可用 mainnet / tron:mainnet
  rpcUrl: "https://nile.trongrid.io",
  signer: "YOUR_TRON_PRIVATE_KEY",
  feeLimit: 120000000,
});
```

Python（BSC）初始化示例：

```python
sdk = SDK(
    chainId=97,
    network="eip155:97",  # BSC 测试网；主网用 eip155:56
    rpcUrl="https://data-seed-prebsc-1-s1.binance.org:8545",
    signer="0xYOUR_EVM_PRIVATE_KEY",
)
```

TypeScript（BSC）初始化示例：

```typescript
const sdk = new SDK({
  chainId: 97,
  network: "eip155:97", // BSC 测试网；主网用 eip155:56
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
  signer: "0xYOUR_EVM_PRIVATE_KEY",
});
```


<Tabs>
<TabItem value="python" label="python">

```python
from bankofai.sdk_8004.core.sdk import SDK

# 快速开始本地变量（请替换成你的真实值）
RPC_URL = "https://nile.trongrid.io"
PRIVATE_KEY = "YOUR_TRON_PRIVATE_KEY"
PINATA_JWT = "YOUR_PINATA_JWT"

# Initialize SDK
sdk = SDK(
    chainId=1,
    network="nile",
    rpcUrl=RPC_URL,
    signer=PRIVATE_KEY,
    feeLimit=120000000,
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
# 可选：ENS 仅用于标识，不是可调用接口
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
  // 快速开始本地变量（请替换成你的真实值）
  const RPC_URL = "https://nile.trongrid.io";
  const PRIVATE_KEY = "YOUR_TRON_PRIVATE_KEY";
  
  // Initialize SDK
  const sdk = new SDK({
    chainId: 1,
    network: "nile",
    rpcUrl: RPC_URL,
    signer: PRIVATE_KEY,
    feeLimit: 120000000,
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
// await agent.setWallet('TYourTronWalletAddress');

  console.log('✅ Agent registered!');
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
