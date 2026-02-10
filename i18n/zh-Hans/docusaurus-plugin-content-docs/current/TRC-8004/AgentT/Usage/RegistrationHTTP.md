# 注册 (HTTP)

使用指向注册文件的直接 HTTP/HTTPS URL 将您的代理（agent）在链上注册。

## 概览 (Overview)

HTTP 注册在以下情况下非常有用：

*   您自行托管注册文件。
*   您希望完全控制文件的提供方式。
*   相比 IPFS，您更倾向于传统的托管方式。

## 分步流程 (Step-by-Step Process)

### 1. 配置您的代理 (Configure Your Agent)

**Python**
```python
# 创建并配置您的代理
agent = sdk.createAgent(
    name="我的 AI 代理",
    description="代理描述",
    image="https://example.com/image.png"
)

agent.setMCP("https://mcp.example.com/")
agent.setA2A("https://a2a.example.com/agent.json")
agent.setENS("myagent.tron")
agent.setTrust(reputation=True)
```

**TypeScript**
```typescript
// 创建并配置您的代理
const agent = sdk.createAgent({
    name: "我的 AI 代理",
    description: "代理描述",
    image: "https://example.com/image.png"
});

agent.setMCP({ endpoint: "https://mcp.example.com/" });
agent.setA2A({ agentcard: "https://a2a.example.com/agent.json" });
agent.setENS({ name: "myagent.tron" });
agent.setTrust({ reputation: true });
```


### 2. 生成注册文件内容 (Generate Registration File Content)

从 SDK 获取 JSON 内容：

**Python**
```python
# 获取注册文件对象
registration_file = agent.registrationFile()

# 转换为字典（JSON 就绪）
registration_data = registration_file.to_dict()

# 或者获取格式化后的 JSON 字符串
json_content = str(registration_file)  # 带有缩进的 JSON
```

**TypeScript**
```typescript
// 获取注册文件内容
const registrationData = agent.registrationFile().toDict();

// 或者获取 JSON 字符串
const jsonContent = JSON.stringify(registrationData, null, 2);
```


### 3. 托管注册文件 (Host the Registration File)

将 JSON 内容保存到您的 Web 服务器：

**Python**
```python
# 保存到文件
with open("my-agent.json", "w") as f:
    f.write(json_content)

# 上传到您的 Web 服务器
# 示例 URL：
# https://yourdomain.com/agents/my-agent.json
# https://yourusername.github.io/agents/my-agent.json
```

**TypeScript**
```typescript
// 保存到文件（Node.js 示例）
import * as fs from 'fs';
fs.writeFileSync('my-agent.json', jsonContent);

// 上传到您的 Web 服务器
```


## 可选：端点域名验证 (.well-known)

如果您希望验证者将 HTTPS 端点域名视为“已验证”，请发布：

*   `https://{endpoint-domain}/.well-known/agent-registration.json`

该文件应包含一个与您的链上身份匹配的 `registrations` 条目：

```json
{
  "registrations": [
    {
      "agentId": 123,
      "agentRegistry": "eip155:11155111:0x8004A818BFB912233c491871b3d84c89A494BD9e"
    }
  ]
}
```

注意：
*   这是可选的，主要供第三方验证者/聚合器使用。
*   如果您的 `agentURI` 托管在同一个域名下，通常不需要进行此额外检查。

### 4. 在链上注册 (Register On-Chain)

**Python**
```python
# 使用您的 HTTP URL 进行注册
tx = agent.registerHTTP("https://yourdomain.com/agents/my-agent.json")
registration_file = tx.wait_confirmed(timeout=180).result

print(f"代理已注册，ID: {registration_file.agentId}")
print(f"代理 URI: {registration_file.agentURI}")  # https://yourdomain.com/...
```

**TypeScript**
```typescript
// 使用您的 HTTP URL 进行注册
const tx = await agent.registerHTTP("https://yourdomain.com/agents/my-agent.json");
const registrationFile = (await tx.waitConfirmed()).result;

console.log(`代理已注册，ID: ${registrationFile.agentId}`);
console.log(`代理 URI: ${registrationFile.agentURI}`); // https://yourdomain.com/...
```


## 完整示例 (Complete Example)

::: tabs
@tab Python
```python
from agent0_sdk import SDK

# 初始化 SDK
sdk = SDK(
    chainId=11155111,
    rpcUrl="https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer=private_key
)

# 1. 配置代理
agent = sdk.createAgent(
    name="我的 AI 代理",
    description="一个有用的 AI 助手",
    image="https://example.com/agent.png"
)
agent.setMCP("https://mcp.example.com/")
agent.setA2A("https://a2a.example.com/agent.json")

# 2. 生成注册文件
registration_data = agent.registrationFile().to_dict()
json_content = str(agent.registrationFile())

# 3. 保存并上传到您的服务器
with open("my-agent.json", "w") as f:
    f.write(json_content)
# 上传至：https://yourdomain.com/agents/my-agent.json

# 4. 在链上注册
tx = agent.registerHTTP("https://yourdomain.com/agents/my-agent.json")
tx.wait_confirmed(timeout=180)

print(f"✅ 代理已注册，ID: {agent.agentId}")
```

**TypeScript**
```typescript
import { SDK } from '@ag0/sdk';

// 初始化 SDK
const sdk = new SDK({
    chainId: 11155111,
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer: private_key
});

// 1. 配置代理
const agent = sdk.createAgent({
    name: "我的 AI 代理",
    description: "一个有用的 AI 助手",
    image: "https://example.com/agent.png"
});
agent.setMCP({ endpoint: "https://mcp.example.com/" });
agent.setA2A({ agentcard: "https://a2a.example.com/agent.json" });

// 2. 生成注册文件
const registrationData = agent.registrationFile().toDict();
const jsonContent = JSON.stringify(registrationData, null, 2);

// 3. 保存并上传到您的服务器
// 上传至：https://yourdomain.com/agents/my-agent.json

// 4. 在链上注册
const tx = await agent.registerHTTP("https://yourdomain.com/agents/my-agent.json");
await tx.waitConfirmed();

console.log(`✅ 代理已注册，ID: ${agent.agentId}`);
```


## 更新注册 (Update Registration)

更新代理：

**Python**
```python
# 1. 加载现有代理
agent = sdk.loadAgent("11155111:123")

# 2. 修改配置
agent.updateInfo(description="更新后的描述")
agent.setMCP("https://new-mcp.example.com")

# 3. 生成新的注册文件
json_content = str(agent.registrationFile())

# 4. 将更新后的文件上传到您的服务器
with open("my-agent-updated.json", "w") as f:
    f.write(json_content)

# 5. 在链上更新 URI（仅当 URI 发生更改时）
agent.setAgentUri("https://yourdomain.com/agents/my-agent-updated.json")
```

**TypeScript**
```typescript
// 1. 加载现有代理
const agent = await sdk.loadAgent("11155111:123");

// 2. 修改配置
agent.updateInfo({ description: "更新后的描述" });
agent.setMCP({ endpoint: "https://new-mcp.example.com" });

// 3. 生成新的注册文件
const registrationData = agent.registrationFile().toDict();
const jsonContent = JSON.stringify(registrationData, null, 2);

// 4. 将更新后的文件上传到您的服务器

// 5. 在链上更新 URI（仅当 URI 发生更改时）
await agent.setAgentUri("https://yourdomain.com/agents/my-agent-updated.json");
```


## 注册文件格式 (Registration File Format)

SDK 会生成符合 ERC-8004 标准的注册文件：

```json
{
  "type": "https://tips.tron.org/TIPS/tip-8004#registration-v1",
  "name": "我的 AI 代理",
  "description": "代理描述",
  "image": "https://example.com/image.png",
  "services": [
    {
      "name": "MCP",
      "endpoint": "https://mcp.example.com/",
      "version": "2025-06-18",
      "mcpTools": ["tool1", "tool2"],
      "mcpPrompts": ["prompt1"],
      "mcpResources": ["resource1"]
    },
    {
      "name": "A2A",
      "endpoint": "https://a2a.example.com/agent.json",
      "version": "0.30",
      "a2aSkills": ["skill1", "skill2"]
    }
  ],
  "registrations": [
    {
      "agentId": 123,
      "agentRegistry": "eip155:11155111:0x8004a6090Cd10A7288092483047B097295Fb8847"
    }
  ],
  "supportedTrust": ["reputation"],
  "active": true,
  "x402Support": false,
  "updatedAt": 1234567890
}
```

