import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Registration (HTTP)

Register your agent on-chain using a direct HTTP/HTTPS URL pointing to the registration file.

## Overview

HTTP registration is very useful when:

*   You self-host the registration file.
*   You want full control over how the file is served.
*   You prefer traditional hosting over IPFS.

## Step-by-Step Process

### 1. Configure Your Agent

<Tabs>
<TabItem value="python" label="python">

```python
# Create and configure your agent
agent = sdk.createAgent(
    name="My AI Agent",
    description="Agent description",
    image="https://example.com/image.png"
)

agent.setMCP("https://mcp.example.com/")
agent.setA2A("https://a2a.example.com/agent.json")
agent.setENS("myagent.eth")
agent.setTrust(reputation=True)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Create and configure your agent
const agent = sdk.createAgent({
    name: "My AI Agent",
    description: "Agent description",
    image: "https://example.com/image.png"
});

agent.setMCP({ endpoint: "https://mcp.example.com/" });
agent.setA2A({ agentcard: "https://a2a.example.com/agent.json" });
agent.setENS({ name: "myagent.eth" });
agent.setTrust({ reputation: true });
```

</TabItem>
</Tabs>



### 2. Generate Registration File Content

Get the JSON content from the SDK:

<Tabs>
<TabItem value="python" label="python">

```python
# Get the registration file object
registration_file = agent.registrationFile()

# Convert to dictionary (JSON ready)
registration_data = registration_file.to_dict()

# Or get the formatted JSON string
json_content = str(registration_file)  # JSON with indentation
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Get registration file content
const registrationData = agent.registrationFile().toDict();

// Or get the JSON string
const jsonContent = JSON.stringify(registrationData, null, 2);
```

</TabItem>
</Tabs>



### 3. Host the Registration File

Save the JSON content to your web server:

<Tabs>
<TabItem value="python" label="python">

```python
# Save to file
with open("my-agent.json", "w") as f:
    f.write(json_content)

# Upload to your web server
# Example URLs:
# https://yourdomain.com/agents/my-agent.json
# https://yourusername.github.io/agents/my-agent.json
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Save to file (Node.js example)
import * as fs from 'fs';
fs.writeFileSync('my-agent.json', jsonContent);

// Upload to your web server
```

</TabItem>
</Tabs>




## Optional: Endpoint Domain Verification (.well-known)

If you want validators to consider the HTTPS endpoint domain as "verified", publish:

*   `https://{endpoint-domain}/.well-known/agent-registration.json`

This file should contain a `registrations` entry that matches your on-chain identity:

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

Note:
*   This is optional and primarily for third-party validators/aggregators.
*   This extra check is usually not needed if your `agentURI` is hosted under the same domain.

### 4. Register On-Chain

<Tabs>
<TabItem value="python" label="python">

```python
# Register using your HTTP URL
tx = agent.registerHTTP("https://yourdomain.com/agents/my-agent.json")
registration_file = tx.wait_confirmed(timeout=180).result

print(f"Agent registered, ID: {registration_file.agentId}")
print(f"Agent URI: {registration_file.agentURI}")  # https://yourdomain.com/...
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Register using your HTTP URL
const tx = await agent.registerHTTP("https://yourdomain.com/agents/my-agent.json");
const registrationFile = (await tx.waitConfirmed()).result;

console.log(`Agent registered, ID: ${registrationFile.agentId}`);
console.log(`Agent URI: ${registrationFile.agentURI}`); // https://yourdomain.com/...
```

</TabItem>
</Tabs>



## Full Example

<Tabs>
<TabItem value="python" label="python">

```python
from agent0_sdk import SDK

# Initialize SDK
sdk = SDK(
    chainId=11155111,
    rpcUrl="https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer=private_key
)

# 1. Configure agent
agent = sdk.createAgent(
    name="My AI Agent",
    description="A useful AI assistant",
    image="https://example.com/agent.png"
)
agent.setMCP("https://mcp.example.com/")
agent.setA2A("https://a2a.example.com/agent.json")

# 2. Generate registration file
registration_data = agent.registrationFile().to_dict()
json_content = str(agent.registrationFile())

# 3. Save and upload to your server
with open("my-agent.json", "w") as f:
    f.write(json_content)
# Upload to: https://yourdomain.com/agents/my-agent.json

# 4. Register on-chain
tx = agent.registerHTTP("https://yourdomain.com/agents/my-agent.json")
tx.wait_confirmed(timeout=180)

print(f"✅ Agent registered, ID: {agent.agentId}")
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
import { SDK } from '@ag0/sdk';

// Initialize SDK
const sdk = new SDK({
    chainId: 11155111,
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer: private_key
});

// 1. Configure agent
const agent = sdk.createAgent({
    name: "My AI Agent",
    description: "A useful AI assistant",
    image: "https://example.com/agent.png"
});
agent.setMCP({ endpoint: "https://mcp.example.com/" });
agent.setA2A({ agentcard: "https://a2a.example.com/agent.json" });

// 2. Generate registration file
const registrationData = agent.registrationFile().toDict();
const jsonContent = JSON.stringify(registrationData, null, 2);

// 3. Save and upload to your server
// Upload to: https://yourdomain.com/agents/my-agent.json

// 4. Register on-chain
const tx = await agent.registerHTTP("https://yourdomain.com/agents/my-agent.json");
await tx.waitConfirmed();

console.log(`✅ Agent registered, ID: ${agent.agentId}`);
```

</TabItem>
</Tabs>




## Update Registration

Update agent:

<Tabs>
<TabItem value="python" label="python">

```python
# 1. Load existing agent
agent = sdk.loadAgent("11155111:123")

# 2. Modify configuration
agent.updateInfo(description="Updated description")
agent.setMCP("https://new-mcp.example.com")

# 3. Generate new registration file
json_content = str(agent.registrationFile())

# 4. Upload the updated file to your server
with open("my-agent-updated.json", "w") as f:
    f.write(json_content)

# 5. Update URI on-chain (only if URI has changed)
agent.setAgentUri("https://yourdomain.com/agents/my-agent-updated.json")
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 1. Load existing agent
const agent = await sdk.loadAgent("11155111:123");

// 2. Modify configuration
agent.updateInfo({ description: "Updated description" });
agent.setMCP({ endpoint: "https://new-mcp.example.com" });

// 3. Generate new registration file
const registrationData = agent.registrationFile().toDict();
const jsonContent = JSON.stringify(registrationData, null, 2);

// 4. Upload the updated file to your server

// 5. Update URI on-chain (only if URI has changed)
await agent.setAgentUri("https://yourdomain.com/agents/my-agent-updated.json");
```

</TabItem>
</Tabs>




## Registration File Format

The SDK generates an 8004 compliant registration file:

```json
{
  "type": "https://eips.eth.org/EIPS/eip-8004#registration-v1",
  "name": "My AI Agent",
  "description": "Agent description",
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
