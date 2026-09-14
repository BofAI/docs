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
- 切换到 BSC 时，请替换 `network`、`rpcUrl` 与 `signer`（EVM 私钥），补上该链的 `chainId`，并去掉 `feeLimit`——它只适用于 TRON。下面的 BSC 示例即为完整形态。
- TRON 推荐参数：`feeLimit=120000000`——单位是 SUN，即单次合约调用最多消耗 120 TRX 手续费。请省略 `chainId`——它属于旧版兼容字段；不传它，Nile 才会生成当前的 `3448148188:<tokenId>` 形式的 agent ID。

Python（TRON）初始化示例：

```python
import os

sdk = SDK(
    network="nile",  # 主网用 "mainnet"
    rpcUrl="https://nile.trongrid.io",
    signer=os.environ["TRON_PRIVATE_KEY"],
    feeLimit=120000000,
)
```

TypeScript（TRON）初始化示例：

```typescript
const sdk = new SDK({
  network: "nile", // 主网用 "mainnet"
  rpcUrl: "https://nile.trongrid.io",
  signer: process.env.TRON_PRIVATE_KEY!,
  feeLimit: 120000000,
});
```

Python（BSC）初始化示例：

```python
import os

sdk = SDK(
    chainId=97,
    network="eip155:97",  # BSC 测试网；主网用 eip155:56
    rpcUrl="https://data-seed-prebsc-1-s1.binance.org:8545",
    signer=os.environ["EVM_PRIVATE_KEY"],
)
```

TypeScript（BSC）初始化示例：

```typescript
const sdk = new SDK({
  chainId: 97,
  network: "eip155:97", // BSC 测试网；主网用 eip155:56
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
  signer: process.env.EVM_PRIVATE_KEY!,
});
```


<Tabs>
<TabItem value="python" label="python">

```python
from bankofai.sdk_8004.core.sdk import SDK
import os

# 快速开始本地变量（请替换成你的真实值）
RPC_URL = "https://nile.trongrid.io"
PRIVATE_KEY = os.environ["TRON_PRIVATE_KEY"]
PINATA_JWT = os.environ["PINATA_JWT"]

# Initialize SDK
sdk = SDK(
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

# Optional: point the agent at a dedicated wallet (requires signature verification).
# By default the agent wallet is the owner's wallet. The one-argument form below only
# works when the SDK signer IS that wallet; otherwise pass new_wallet_signer.
# See Configure Agents -> "How the signature is supplied".
# agent.setWallet("TYourTronWalletAddress")

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
  const PRIVATE_KEY = process.env.TRON_PRIVATE_KEY!;
  
  // Initialize SDK
  const sdk = new SDK({
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
    .addDomain("technology/data_science/data_science");

  // Set status
  agent.setActive(true);
  agent.setX402Support(false);

  // Register on-chain
  const tx = await agent.register("https://example.com/agent-card.json");
  const { result: registrationFile } = await tx.waitConfirmed();

  // Optional: point the agent at a dedicated wallet (requires signature verification).
  // By default the agent wallet is the owner's wallet. The one-argument form below only
  // works when the SDK signer IS that wallet; otherwise pass newWalletSigner.
  // See Configure Agents -> "How the signature is supplied".
  // await agent.setWallet('TYourTronWalletAddress');

  console.log('✅ Agent registered!');
  console.log(`   ID: ${registrationFile.agentId}`);
  console.log(`   URI: ${registrationFile.agentURI}`);

  // Load agent by ID directly from chain (works without subgraph)
  const loaded = await sdk.loadAgent(registrationFile.agentId!);
  console.log(`✅ Loaded by ID: ${loaded.toJSON().name}`);
}

main().catch(console.error);
```

</TabItem>
</Tabs>
