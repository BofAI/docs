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



除记录端点外，`setMCP()` 的行为因语言而异：
*   **Python**：默认（`auto_fetch=True`）会从端点获取工具、提示词（prompts）和资源，并以 `mcpTools`、`mcpPrompts`、`mcpResources` 存入该 MCP 端点条目。获取失败会被跳过：网络和解析错误只在 debug 级别记录，非 HTTP(S) 端点会记录一条 warning。传 `auto_fetch=False` 可关闭。
*   **TypeScript**：只记录端点 URL 和版本（默认 `2025-06-18`），不会访问该端点。

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




除记录端点外，`setA2A()` 的行为因语言而异：
*   **Python**：默认（`auto_fetch=True`）会从 A2A 代理卡片（agent card）中获取技能标签（`skills[].tags`），并以 `a2aSkills` 存入该 A2A 端点条目。获取失败会被跳过：网络和解析错误只在 debug 级别记录，非 HTTP(S) 端点会记录一条 warning。传 `auto_fetch=False` 可关闭。
*   **TypeScript**：只记录代理卡片 URL 和版本（默认 `0.3.0`），不会获取该卡片。

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



两个 SDK 都会把 ENS 名称作为 `ENS` 端点存入注册文件。以 `agentName` 元数据键写上链则有区别：
*   **Python**：首次 `register()`（铸造）时会自动把 `agentName` 写上链；对已注册的 Agent，`register(uri)` 只更新 URI，需改用 `registerIPFS()`，它会把包括 `agentName` 在内的改动元数据写上链。
*   **TypeScript**：`setENS()` 只修改本地注册文件，`register()` / `registerIPFS()` 也不会发送 `agentName`。需在已注册的 Agent 上调用 `await agent.updateOnChainMetadata()` 才会写上链。

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
| 两者都不传 | 回退到 SDK signer——**且仅当 SDK signer 的地址就是新钱包时才会成功**。否则 Python 抛出 `New wallet must sign. Provide new_wallet_signer (EOA) or signature (ERC-1271/external).`，TypeScript 抛出 `newWalletSigner address (…) does not match newWallet (…).`。若 TypeScript SDK 根本没有 signer，则抛出 `New wallet signature is required. Provide options.newWalletSigner or options.signature.` |

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
// TypeScript SDK 不做 OASF 分类法校验：
// addSkill() 接受任意字符串
agent.addSkill("custom_skill/my_skill");
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
// TypeScript SDK 不做 OASF 分类法校验：
// addDomain() 接受任意字符串
agent.addDomain("custom_domain/my_domain");
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
# 更新链上元数据（Agent 须已注册）
agent.setMetadata({"version": "1.1.0", "tier": "pro"})
# setMetadata() 只暂存这些键。对已注册的 Agent，下一次 registerIPFS()（需配置 IPFS 客户端）
# 会上传文件、把 URI 替换为 ipfs://...，然后在 wait_confirmed() 中逐个把改动过的键
# 写上链（尽力而为）。对已注册的 Agent，register(uri) 与 updateRegistration() 只更新 URI。
tx = agent.registerIPFS()
tx.wait_confirmed(timeout=180)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 更新链上元数据（Agent 须已注册）
agent.setMetadata({ version: "1.1.0", tier: "pro" });
// 本地元数据中的每个键各发送一笔 setMetadata 交易（设置了 ENS 名称时另加一笔 agentName），
// 返回交易哈希列表。
// 不要在这里调用 register()：它总是会铸造一个新 Agent。
const txHashes = await agent.updateOnChainMetadata();
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
// 通过 ID 加载代理
const agent = await sdk.loadAgent("97:123");
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
// TypeScript 的 Agent 没有 name/description/active 访问器，需从 toJSON() 读取
const file = agent.toJSON();
console.log(file.name);
console.log(file.description);
console.log(file.active);
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
     .setENS("advanced-agent.eth")
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

## 常见合约错误

以下回退原因来自 TRC-8004 / ERC-8004 注册表合约；"位置"一列写的是合约函数，以及会发送它的 SDK 调用。在 EVM 网络上，`Not authorized` 这类字符串原因会出现在 SDK 的交易错误里（通常来自 gas 估算）。在信誉或验证合约调用里触发的 ERC-721 自定义错误（例如对未注册 Agent 调用 `giveFeedback()`）可能只显示选择器（`0x7e273289` 即 `ERC721NonexistentToken`）。在 TRON 上两种 SDK 都只报 `TRON transaction reverted: <hash> (REVERT)`，需要到 TronScan 查看交易才能看到原因。

| 回退原因 | 位置 | 原因与处理 |
| --- | --- | --- |
| `Not authorized` | 身份注册表的 `setMetadata` / `setAgentURI` / `setAgentWallet`，由 `updateOnChainMetadata()`、`updateRegistration(<uri>)`、`registerIPFS()` 和 `setWallet()` 发送；验证注册表的 `validationRequest` | 发送方不是该 Agent 的所有者、被批准地址或操作员。改用所有者签名，或先 `addOperator()`（TypeScript 还可用 `agent.approve()`） |
| `ERC721InsufficientApproval` | `transferFrom`，由 TypeScript 的 `transfer()` 发送 | 发送方不是所有者、被批准地址或操作员。Python 的 `transfer()` 会在发送前检查所有者，直接抛出 `ValueError: Only the current owner (…) can transfer the agent` |
| `reserved key` | `register()` 的元数据、`setMetadata` | `agentWallet` 是保留键，请用 `setWallet()` |
| `bad wallet` / `expired` / `deadline too far` | `setWallet` | 零地址；`deadline` 已过期；`deadline` 超过当前时间 5 分钟 |
| `invalid wallet sig` | `setWallet` | 签名不是由新钱包产生（ECDSA，合约钱包则为 ERC-1271） |
| `Self-feedback not allowed` | `giveFeedback` | Agent 的所有者、操作员或被批准地址给自己的 Agent 评分 |
| `index must be > 0` / `index out of bounds` | `revokeFeedback`、`appendResponse`、`readFeedback`（SDK 的 `getFeedback()`） | `feedbackIndex` 为 0，或大于该客户端给这个 Agent 的最后一条反馈序号（包括从未给过反馈） |
| `Already revoked` | `revokeFeedback` | 该反馈已被撤回 |
| `Empty URI` | `appendResponse` | `responseURI` 为空。Python 的 `appendResponse()` 只有在配置了 IPFS 客户端、且回复带有 `text` 或 `attachments` 时才会生成 URI，否则（或 IPFS 上传失败时）发送空 URI 并触发此错误 |
| `clientAddresses required` | `getSummary`，没有 subgraph 时由 Python 的 `getReputationSummary()` 调用 | 该 Agent 还没有任何反馈，从链上读到的客户端列表为空。`sdk.getReputationSummary()` 不接受客户端列表参数，按「尚无信誉」处理即可（TypeScript 则返回 0） |
| `exists` / `not validator` / `resp>100` / `unknown` | 验证请求 / 响应 | 请求哈希重复；响应者不是指定的验证者；分数超过 100；请求哈希不存在 |
| `ERC721NonexistentToken` | 身份注册表的写操作和 `ownerOf` / `tokenURI` 读取、`giveFeedback`、`validationRequest` | 该 Agent ID 未在所配置网络上注册。Python 的 `loadAgent()` 会抛出 `Failed to load agent …`；TypeScript 的 `loadAgent()` 不报错，返回一个 URI 为空的 Agent |
