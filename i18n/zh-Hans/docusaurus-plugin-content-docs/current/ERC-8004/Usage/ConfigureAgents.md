import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 配置代理 

了解如何使用所有可用字段和选项来创建、配置和管理代理。

## 创建代理 

在内存中创建一个新代理（尚未注册）：


<Tabs>
<TabItem value="python" label="python">

```python
from agent0_sdk import SDK

# 初始化 SDK
sdk = SDK(
    chainId=11155111,
    rpcUrl="https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer=your_private_key,
    ipfs="pinata",
    pinataJwt=your_pinata_jwt
)

# 创建代理
agent = sdk.createAgent(
    name="我的 AI 代理",
    description="一个能处理各种任务的智能助手。技能包括：数据分析、代码生成、自然语言处理。定价：每次请求 0.10 美元，提供免费额度。",
    image="https://example.com/agent-image.png"  # 可选
)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
import { SDK } from '@ag0/sdk';

// 初始化 SDK
const sdk = new SDK({
    chainId: 11155111,
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer: your_private_key,
    ipfs: "pinata",
    pinataJwt: your_pinata_jwt
});

// 创建代理
const agent = sdk.createAgent({
    name: "我的 AI 代理",
    description: "一个能处理各种任务的智能助手。技能包括：数据分析、代码生成、自然语言处理。定价：每次请求 0.10 美元，提供免费额度。",
    image: "https://example.com/agent-image.png"  // 可选
});
```

</TabItem>
</Tabs>



## 核心字段 

### 名称与描述 


<Tabs>
<TabItem value="python" label="python">

```python
# 更新基本信息
agent.updateInfo(
    name="更新后的代理名称",
    description="更新后的描述",
    image="https://example.com/new-image.png"
)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 更新基本信息
agent.updateInfo({
    name: "更新后的代理名称",
    description: "更新后的描述",
    image: "https://example.com/new-image.png"
});
```

</TabItem>
</Tabs>





### 活跃状态

<Tabs>
<TabItem value="python" label="python">

```python
# 设置代理为 活跃/非活跃 状态
agent.setActive(True)   # 活跃（在搜索中可见）
agent.setActive(False)  # 非活跃（隐藏但不删除）
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 设置代理为 活跃/非活跃 状态
agent.setActive(true);   // 活跃
agent.setActive(false);  // 非活跃
```

</TabItem>
</Tabs>




### x402 支付支持 
<Tabs>
<TabItem value="python" label="python">

```python
# 启用/禁用 x402 支付支持
agent.setX402Support(True)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 启用/禁用 x402 支付支持
agent.setX402Support(true);
```

</TabItem>
</Tabs>





## 端点配置 

### MCP (Model Context Protocol) 端点

<Tabs>
<TabItem value="python" label="python">

```python
# 设置 MCP 端点
agent.setMCP(endpoint="https://mcp.example.com/")
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 设置 MCP 端点
agent.setMCP({ endpoint: "https://mcp.example.com/" });
```

</TabItem>
</Tabs>



当你设置 MCP 端点时，SDK 会自动：
*   从端点获取工具、提示词（prompts）和资源。
*   填充代理的能力集（capabilities）。

### A2A (Agent-to-Agent) 端点

<Tabs>
<TabItem value="python" label="python">

```python
# 设置 A2A 端点
agent.setA2A(agentcard="https://a2a.example.com/agent-card.json")
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 设置 A2A 端点
agent.setA2A({ agentcard: "https://a2a.example.com/agent-card.json" });
```

</TabItem>
</Tabs>




SDK 会自动：
*   从 A2A 代理卡片（agent card）中获取技能。
*   为搜索索引这些能力。

### ENS

<Tabs>
<TabItem value="python" label="python">

```python
# 设置 ENS 名称
agent.setENS(name="myagent.eth")
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 设置 ENS 名称
agent.setENS({ name: "myagent.eth" });
```

</TabItem>
</Tabs>



这会将 ENS 名称存储在：
*   注册文件中。
*   作为链上元数据。

### 移除端点 

<Tabs>
<TabItem value="python" label="python">

```python
# 移除特定类型的端点
agent.removeEndpoint(type=EndpointType.MCP)

# 按值移除
agent.removeEndpoint(value="https://old-endpoint.com")

# 移除所有端点
agent.removeEndpoints()
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 移除特定类型的端点
agent.removeEndpoint({ type: EndpointType.MCP });

// 按值移除
agent.removeEndpoint({ value: "https://old-endpoint.com" });

// 移除所有端点
agent.removeEndpoints();
```

</TabItem>
</Tabs>




## 钱包配置 

### 默认行为（默认将钱包设置为所有者）

根据 ERC-8004 协议，`agentWallet` **最初被设置为代理所有者的地址**。

*   **如果你不调用 `setWallet()`**：代理钱包默认保持为**所有者钱包**。
*   **何时需要设置专用代理钱包**：仅当你希望代理使用与所有者**不同**的钱包时（例如：职责分离、热钱包与冷钱包所有者分离、使用不同链的钱包）。
*   **转让后**：`agentWallet` 会重置为**零地址**，新所有者必须通过调用 `setWallet()` 重新进行验证。

### 设置专用代理钱包（签名验证）

`agentWallet` 是一个**保留的链上**属性。根据 ERC-8004，设置该属性需要经过签名验证。

*   **谁发送交易**：SDK 签名者（通常是代理**所有者**或授权的**操作员**）提交链上交易。
*   **面向开发者的 SDK API**：`agent.setWallet(...)`。
*   **谁必须签名**：**新钱包**必须通过签署 EIP-712 类型数据 (EOA) 签名来授权此更改。


<Tabs>
<TabItem value="python" label="python">

```python
# 你必须先注册代理，然后如果你想使用一个与所有者不同的专用钱包，再调用 setWallet()。
tx = agent.registerIPFS()
tx.wait_confirmed(timeout=180)

# --- EOA 流程 ---
# *新钱包* 必须签署 EIP-712 类型数据。
# 如果新钱包与 SDK 签名者不是同一个地址，请提供 `new_wallet_signer`。
agent.setWallet(
    new_wallet="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    chainId=11155111,
    new_wallet_signer=NEW_WALLET_PRIVATE_KEY,  # 0x742d... 的私钥
)

```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 你必须先注册代理，然后调用 setWallet()。
const tx = await agent.registerIPFS();
await tx.waitConfirmed();

// --- EOA 流程 ---
await agent.setWallet({
    newWallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    chainId: 11155111,
    newWalletPrivateKey: NEW_WALLET_PRIVATE_KEY
});

```

</TabItem>
</Tabs>





钱包地址作为**保留**的 `agentWallet` 属性存储在链上，并需要签名验证 (ERC-8004)。

### 取消验证的代理钱包 

如果你之前设置了专用的验证 `agentWallet` 并想将其移除（在链上恢复为“未设置”状态），请使用：

*   **Python**: `agent.unsetWallet()`
*   **TypeScript**: `await agent.unsetWallet()`

这会清除代理在链上的 `agentWallet` 字节数据。

### “我到底要签署什么？” (EOA)

两个 SDK 都会在内部构建 EIP-712 类型数据。从概念上讲，**新钱包**签署的消息包含：

*   **agentId**: 代理的 tokenId
*   **newWallet**: 你正在设置的钱包地址
*   **owner**: 当前代理所有者（从注册表中读取）
*   **deadline**: 合约强制执行的短有效期窗口
*   **domain**: 身份注册表 (Identity Registry) 的 EIP-712 域（chainId + verifyingContract，以及名称/版本）

#### EOA

*   **EOA 签名 (Python)**：除非 SDK 签名者就是新钱包，否则传入 `new_wallet_signer=...`（私钥 / eth-account 账户）。
*   **EOA 签名 (TypeScript)**：除非 SDK 签名者就是新钱包，否则传入 `newWalletPrivateKey`。



## OASF 技能与领域 

代理可以使用开放代理架构框架 (Open Agentic Schema Framework, OASF) 分类法来宣传其能力。这为技能和领域提供了标准化的分类，从而提高了可发现性和互操作性。

### 添加技能 

<Tabs>
<TabItem value="python" label="python">

```python
# 添加技能而不进行验证（允许任何字符串）
agent.addSkill("custom_skill/my_skill", validate_oasf=False)

# 添加带有验证的技能（确保其存在于 OASF 分类法中）
agent.addSkill("advanced_reasoning_planning/strategic_planning", validate_oasf=True)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 添加技能而不进行验证
agent.addSkill({ skill: "custom_skill/my_skill", validateOasf: false });

// 添加带有验证的技能
agent.addSkill({ skill: "advanced_reasoning_planning/strategic_planning", validateOasf: true });
```

</TabItem>
</Tabs>





### 添加领域 
<Tabs>
<TabItem value="python" label="python">

```python
# 添加领域而不进行验证
agent.addDomain("custom_domain/my_domain", validate_oasf=False)

# 添加带有验证的领域
agent.addDomain("finance_and_business/investment_services", validate_oasf=True)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 添加领域而不进行验证
agent.addDomain({ domain: "custom_domain/my_domain", validateOasf: false });

// 添加带有验证的领域
agent.addDomain({ domain: "finance_and_business/investment_services", validateOasf: true });
```

</TabItem>
</Tabs>







### 移除技能与领域 

<Tabs>
<TabItem value="python" label="python">

```python
# 移除技能
agent.removeSkill("advanced_reasoning_planning/strategic_planning")

# 移除领域
agent.removeDomain("finance_and_business/investment_services")
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 移除技能
agent.removeSkill({ skill: "advanced_reasoning_planning/strategic_planning" });

// 移除领域
agent.removeDomain({ domain: "finance_and_business/investment_services" });
```

</TabItem>
</Tabs>






### 方法链 

所有 OASF 方法都支持链式调用：

<Tabs>
<TabItem value="python" label="python">

```python
agent.addSkill("data_engineering/data_transformation_pipeline", validate_oasf=True)\
     .addDomain("technology/data_science", validate_oasf=True)\
     .addSkill("natural_language_processing/summarization", validate_oasf=True)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
agent.addSkill({ skill: "data_engineering/data_transformation_pipeline", validateOasf: true })
     .addDomain({ domain: "technology/data_science", validateOasf: true })
     .addSkill({ skill: "natural_language_processing/summarization", validateOasf: true });
```

</TabItem>
</Tabs>





### 注册文件中的 OASF 

OASF 技能和领域存储在注册文件的 `endpoints` 数组中：

```json
{
  "endpoints": [
    {
      "name": "OASF",
      "endpoint": "https://github.com/agntcy/oasf/",
      "version": "v0.8.0",
      "skills": [
        "advanced_reasoning_planning/strategic_planning",
        "data_engineering/data_transformation_pipeline"
      ],
      "domains": [
        "technology/data_science"
      ]
    }
  ]
}
```

## 信任模型 

信任模型允许代理声明它们如何处理安全和隐私。

### 设置信任模型 

<Tabs>
<TabItem value="python" label="python">

```python
# 设置信任模型
agent.setTrustModels([
    {
        "name": "TEE",
        "endpoint": "https://tee.example.com",
        "version": "1.0.0"
    }
])
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 设置信任模型
agent.setTrustModels([
    {
        "name": "TEE",
        "endpoint": "https://tee.example.com",
        "version": "1.0.0"
    }
]);
```

</TabItem>
</Tabs>





## 链上元数据管理 

某些属性可以直接作为链上元数据进行管理。

<Tabs>
<TabItem value="python" label="python">

```python
# 更新链上元数据
agent.updateOnChainMetadata()
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 更新链上元数据
await agent.updateOnChainMetadata();
```

</TabItem>
</Tabs>




## 加载现有代理

如果你已经有一个注册的代理，可以通过其 ID 加载它：

<Tabs>
<TabItem value="python" label="python">

```python
# 通过 ID 加载代理
agent = sdk.getAgent(agent_id="0x123...")
```


</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 通过 ID 加载代理
const agent = await sdk.getAgent("0x123...");
```

</TabItem>
</Tabs>



## 直接属性访问 

你可以直接访问代理对象的属性：

<Tabs>
<TabItem value="python" label="python">

```python
print(agent.name)
print(agent.description)
print(agent.active)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
console.log(agent.name);
console.log(agent.description);
console.log(agent.active);
```

</TabItem>
</Tabs>




## 完整配置示例 

这是一个配置具有多种设置的代理的完整示例：

<Tabs>
<TabItem value="python" label="python">

```python
agent = sdk.createAgent(
    name="高级 AI 助手",
    description="一个功能齐全的代理示例"
)

agent.setMCP(endpoint="https://mcp.example.com/")\
     .setENS(name="advanced-agent.eth")\
     .addSkill("advanced_reasoning_planning/strategic_planning", validate_oasf=True)\
     .addDomain("technology/data_science", validate_oasf=True)\
     .setActive(True)\
     .setX402Support(True)

# 注册代理
tx = agent.registerIPFS()
tx.wait_confirmed()
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
const agent = sdk.createAgent({
    name: "高级 AI 助手",
    description: "一个功能齐全的代理示例"
});

agent.setMCP({ endpoint: "https://mcp.example.com/" })
     .setENS({ name: "advanced-agent.eth" })
     .addSkill({ skill: "advanced_reasoning_planning/strategic_planning", validateOasf: true })
     .addDomain({ domain: "technology/data_science", validateOasf: true })
     .setActive(true)
     .setX402Support(true);

// 注册代理
const tx = await agent.registerIPFS();
await tx.waitConfirmed();
```


</TabItem>
</Tabs>



