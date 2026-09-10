import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 配置代理 

了解如何使用所有可用字段和选项来创建、配置和管理代理。

## 创建代理 

在内存中创建一个新代理（尚未注册）：


<Tabs>
<TabItem value="python" label="python">

```python
import os

from bankofai.sdk_8004.core.sdk import SDK

# 初始化 SDK
sdk = SDK(
    network="eip155:97",
    rpcUrl="https://data-seed-prebsc-1-s1.binance.org:8545",
    signer=os.environ["EVM_PRIVATE_KEY"],
    ipfs="pinata",
    pinataJwt=os.environ["PINATA_JWT"]
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
import { SDK } from '@bankofai/8004-sdk';

// 初始化 SDK
const sdk = new SDK({
    network: "eip155:97",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    signer: process.env.EVM_PRIVATE_KEY!
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
agent.setMCP("https://mcp.example.com/");
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
agent.setA2A("https://a2a.example.com/agent-card.json");
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
// TypeScript SDK 支持 setENS() 高层方法
agent.setENS("myagent.eth");
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
from bankofai.sdk_8004.core.models import EndpointType

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
// TypeScript SDK 支持 removeEndpoint()/removeEndpoints() 高层方法
agent.removeEndpoint({ type: "MCP" });
agent.removeEndpoint({ value: "https://old-endpoint.com" });
agent.removeEndpoints();
```

</TabItem>
</Tabs>




## 钱包配置 

### 默认行为（默认将钱包设置为所有者）

根据 8004 协议，`agentWallet` **最初被设置为代理所有者的地址**。

*   **如果你不调用 `setWallet()`**：代理钱包默认保持为**所有者钱包**。
*   **何时需要设置专用代理钱包**：仅当你希望代理使用与所有者**不同**的钱包时（例如：职责分离、热钱包与冷钱包所有者分离、使用不同链的钱包）。
*   **转让后**：`agentWallet` 会重置为**零地址**，新所有者必须通过调用 `setWallet()` 重新进行验证。

### 设置专用代理钱包（签名验证）

`agentWallet` 是一个**保留的链上**属性。根据 8004，设置该属性需要经过签名验证。

*   **谁发送交易**：由 SDK signer 提交链上交易，合约要求它必须是 Agent **所有者**、该 Agent 的被授权地址，或获所有者全量授权的**操作员**。
*   **面向开发者的 SDK API**：TypeScript 为 `agent.setWallet(newWallet, options)`；Python 为 `agent.setWallet(new_wallet, chainId=None, *, new_wallet_signer=None, deadline=None, signature=None)`。地址之后的参数都是可选的——但请务必阅读下文的**签名从何而来**，因为只传一个地址的调用仅在一种特定情况下才成立。
*   **谁必须签名**：**新钱包**必须通过签署 EIP-712 类型数据来授权此更改。合约会先尝试 ECDSA 恢复（普通 EOA 以及 EIP-7702 委托的 EOA）；若恢复结果不是新钱包，则回退为对新钱包调用 [ERC-1271](https://eips.ethereum.org/EIPS/eip-1271) 的 `isValidSignature`，因此智能合约钱包同样受支持。
*   **不能当作普通元数据设置**：`agentWallet` 是保留键——`setMetadata()` 以及 `register()` 的元数据数组都会拒绝它。


<Tabs>
<TabItem value="python" label="python">

```python
import os

# 你必须先注册代理，然后如果你想使用一个与所有者不同的专用钱包，再调用 setWallet()。
tx = agent.register("https://example.com/agent-card.json")
tx.wait_confirmed(timeout=180)

# --- EOA 流程 ---
# 交易由 SDK signer 发送，但 EIP-712 签名必须由*新钱包*产生。
# 只要新钱包不是 SDK signer 本身，就需要通过 new_wallet_signer 传入其私钥。
agent.setWallet(
    "0x742D35CC6634C0532925a3B844Bc9E7595F2bD18",
    new_wallet_signer=os.environ["NEW_WALLET_PRIVATE_KEY"],
)

# 如果 SDK signer *就是*新钱包，SDK 会自动签名：
# agent.setWallet(SDK_signer_的地址)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 你必须先注册代理，然后调用 setWallet()。
const tx = await agent.register("https://example.com/agent-card.json");
await tx.waitConfirmed();

// --- EOA 流程 ---
// 交易由 SDK signer 发送，但 EIP-712 签名必须由*新钱包*产生。
// 只要新钱包不是 SDK signer 本身，就需要通过 newWalletSigner 传入其私钥。
await agent.setWallet("0x742D35CC6634C0532925a3B844Bc9E7595F2bD18", {
  newWalletSigner: process.env.NEW_WALLET_PRIVATE_KEY!,
});

// 如果 SDK signer *就是*新钱包，SDK 会自动签名：
// await agent.setWallet(SDK_signer_的地址);
```

</TabItem>
</Tabs>





钱包地址作为**保留**的 `agentWallet` 属性存储在链上，并需要签名验证 (8004)。

### 取消验证的代理钱包 

如果你之前设置了专用的验证 `agentWallet` 并想将其移除（在链上恢复为“未设置”状态），请使用：

*   **Python**: `agent.unsetWallet()`
*   **TypeScript**: `await agent.unsetWallet()`

这会清除代理在链上的 `agentWallet` 字节数据。

### “我到底要签署什么？”

两个 SDK 都会在内部构建 EIP-712 类型数据。从概念上讲，**新钱包**签署的消息包含：

*   **agentId**: 代理的 tokenId
*   **newWallet**: 你正在设置的钱包地址
*   **owner**: 当前代理所有者（从注册表中读取）
*   **deadline**: 合约强制执行的过期时间戳——不得已经过期，且最多只能比当前区块时间晚 **5 分钟**
*   **domain**: 身份注册表 (Identity Registry) 的 EIP-712 域——名称 `ERC8004IdentityRegistry`、版本 `1`，以及 `chainId` 和 `verifyingContract`

随后合约会以下面两种方式之一校验该签名：

*   **EOA**：合约从 ECDSA 签名中恢复签名者，并要求其等于 `newWallet`。
*   **智能合约钱包**：若恢复失败或得到的地址不同，合约会对 `newWallet` 调用 `isValidSignature(digest, signature)`，并要求返回 ERC-1271 魔数 `0x1626ba7e`。

### 签名从何而来

SDK 会替你构造类型化数据，但它无法凭空造出新钱包的签名。获取签名的途径恰好只有三条，且按以下顺序尝试：

| 你传入 | SDK 的行为 |
| :--- | :--- |
| `signature`（Python / TS 同名） | 直接使用你给的字节。这是智能合约钱包以及任何外部/离线签名场景的路径。 |
| `new_wallet_signer`（Python）/ `newWalletSigner`（TS） | 用该私钥签名。SDK 会先校验该私钥对应的地址是否等于 `newWallet`，不一致则直接报错。 |
| 两者都不传 | 回退到 SDK signer——**且仅当 SDK signer 的地址就是新钱包时才会成功**。否则抛出 `New wallet must sign. Provide new_wallet_signer (EOA) or signature (ERC-1271/external).` |

:::caution 只传一个地址并不是通用写法
不带任何签名参数的 `setWallet(address)`，**仅**在 SDK signer 本身就是该地址时才可用。又因为交易发送方还必须是所有者或获授权的操作员，所以这种写法实际上只适用于「把 Agent 指向我当前正在用来签名的这个钱包」。若要绑定一个与 SDK signer *不同*的钱包，就必须提供 `new_wallet_signer` / `newWalletSigner`，或一个已经准备好的 `signature`。
:::

另外还有两个值得注意的行为：`deadline` 默认为当前时间之后 60 秒（合约本身的上限是 5 分钟）；如果 `agentWallet` 已经就是你传入的地址，SDK 会跳过整笔交易，仅更新本地注册文件后返回 `None` / `undefined`。



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
agent.addSkill("custom_skill/my_skill");

// 添加带有验证的技能
agent.addSkill("advanced_reasoning_planning/strategic_planning");
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
agent.addDomain("custom_domain/my_domain");

// 添加带有验证的领域
agent.addDomain("finance_and_business/investment_services");
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
// TypeScript SDK 支持 removeSkill()/removeDomain() 高层方法
agent.removeSkill("advanced_reasoning_planning/strategic_planning");
agent.removeDomain("finance_and_business/investment_services");
```

</TabItem>
</Tabs>






### 方法链 

所有 OASF 方法都支持链式调用：

<Tabs>
<TabItem value="python" label="python">

```python
agent.addSkill("data_engineering/data_transformation_pipeline", validate_oasf=True)\
     .addDomain("technology/data_science/data_science", validate_oasf=True)\
     .addSkill("natural_language_processing/natural_language_generation/summarization", validate_oasf=True)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
agent.addSkill("data_engineering/data_transformation_pipeline")
     .addDomain("technology/data_science/data_science")
     .addSkill("natural_language_processing/natural_language_generation/summarization");
```

</TabItem>
</Tabs>





### 注册文件中的 OASF 

两个 SDK 存储 OASF 技能与领域的方式不同。**Python** 把它们放在注册文件 `services` 数组里的一个 `OASF` 条目中：

```json
{
  "services": [
    {
      "name": "OASF",
      "endpoint": "https://github.com/agntcy/oasf/",
      "version": "0.8",
      "skills": [
        "advanced_reasoning_planning/strategic_planning",
        "data_engineering/data_transformation_pipeline"
      ],
      "domains": [
        "finance_and_business/investment_services",
        "technology/data_science/data_science"
      ]
    }
  ]
}
```

**TypeScript** 不会构建 OASF 条目：`addSkill()` 与 `addDomain()` 把同样的 slug 推入顶层的扁平 `tags` 数组，其线格式会连同 `metadata` 一并输出；而 Python 发布的文件中这两个键都不存在。当消费方要同时读取两种语言产出的注册文件时，请注意这个差异。

## 信任模型 

信任模型允许代理声明它们如何处理安全和隐私。

### 设置信任模型 

<Tabs>
<TabItem value="python" label="python">

```python
# 设置信任模型
agent.setTrust(reputation=True, cryptoEconomic=True, teeAttestation=True)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 设置信任模型
agent.setTrust({ reputation: true, cryptoEconomic: true, teeAttestation: true });
```

</TabItem>
</Tabs>





## 链上元数据管理 

某些属性可以直接作为链上元数据进行管理。

<Tabs>
<TabItem value="python" label="python">

```python
# 更新链上元数据
agent.setMetadata({"version": "1.1.0", "tier": "pro"})
# 若已注册并要更新 URI，可调用：
# tx = agent.updateRegistration(agentURI="https://example.com/agent-card-updated.json")
# tx.wait_confirmed(timeout=180)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 更新链上元数据
agent.setMetadata({ version: "1.1.0", tier: "pro" });
const tx = await agent.register("https://example.com/agent-card-updated.json");
await tx.waitConfirmed();
```

</TabItem>
</Tabs>




## 加载现有代理

如果你已经有一个注册的代理，可以通过其 ID 加载它：

<Tabs>
<TabItem value="python" label="python">

```python
# 通过 ID 加载代理
agent = sdk.loadAgent("97:123")
```


</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 通过 ID 查询代理摘要
const agentSummary = await sdk.getAgent("97:123");
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
console.log(agentSummary?.name);
console.log(agentSummary?.description);
console.log(agentSummary?.active);
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
     .addDomain("technology/data_science/data_science", validate_oasf=True)\
     .setActive(True)\
     .setX402Support(True)

# 注册代理
tx = agent.register("https://example.com/agent-card.json")
tx.wait_confirmed()
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
const agent = sdk.createAgent({
    name: "高级 AI 助手",
    description: "一个功能齐全的代理示例"
});

agent.setMCP("https://mcp.example.com/")
     .setMetadata({ ens: "advanced-agent.eth" })
     .addSkill("advanced_reasoning_planning/strategic_planning")
     .addDomain("technology/data_science/data_science")
     .setActive(true)
     .setX402Support(true);

// 注册代理
const tx = await agent.register("https://example.com/agent-card.json");
await tx.waitConfirmed();
```


</TabItem>
</Tabs>
