import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Registration (HTTP)

Register your agent on-chain using a direct HTTP/HTTPS URL pointing to the registration file.

## Overview

HTTP registration is useful when:

*   You self-host the registration file.
*   You want full control over how the file is served.
*   You prefer traditional hosting over IPFS.

## Step-by-Step Process

### 1. Configure Your Agent

Note:
* `setMCP()` / `setA2A()` are HTTP/HTTPS service endpoints that clients actually call.
* `setENS()` is optional naming metadata and does not replace MCP/A2A endpoint URLs.

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

agent.setMCP("https://mcp.example.com/");
agent.setA2A("https://a2a.example.com/agent.json");
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
const registrationData = agent.toJSON();

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

If you want validators to consider HTTPS endpoint domains as "verified", publish:

*   `https://{endpoint-domain}/.well-known/agent-registration.json`

This file should contain a `registrations` entry matching your on-chain identity:

```json
{
  "registrations": [
    {
      "agentId": 123,
      "agentRegistry": "eip155:97:0x8004A818BFB912233c491871b3d84c89A494BD9e"
    }
  ]
}
```

Note:
*   This is optional and primarily for third-party validators/aggregators.
*   If your `agentURI` is hosted under the same domain, this extra check is usually not necessary.

### 4. Register On-Chain

<Tabs>
<TabItem value="python" label="python">

```python
# Register using your HTTP URL
tx = agent.register("https://yourdomain.com/agents/my-agent.json")
registration_file = tx.wait_confirmed(timeout=180).result

print(f"Agent registered, ID: {registration_file.agentId}")
print(f"Agent URI: {registration_file.agentURI}")  # https://yourdomain.com/...
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Register using your HTTP URL
const tx = await agent.register("https://yourdomain.com/agents/my-agent.json");
const registrationFile = (await tx.waitConfirmed()).result;

console.log(`Agent registered, ID: ${registrationFile.agentId}`);
console.log(`Agent URI: ${registrationFile.agentURI}`); // https://yourdomain.com/...
```

</TabItem>
</Tabs>

### 5. Load By Agent ID (without subgraph)

`getAgent()` and `searchAgents()` are index/subgraph-based. If subgraph is not configured, use `loadAgent(agentId)` for direct on-chain loading.

<Tabs>
<TabItem value="python" label="python">

```python
# Load by ID directly from chain
loaded = sdk.loadAgent(registration_file.agentId)
print(f"Loaded name: {loaded.registration_file.name}")
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Load by ID directly from chain
const loaded = await sdk.loadAgent(registrationFile.agentId!);
console.log(`Loaded name: ${loaded.registrationFile.name}`);
```

</TabItem>
</Tabs>



## Full Example

<Tabs>
<TabItem value="python" label="python">

```python
from bankofai.sdk_8004.core.sdk import SDK

# Initialize the SDK
sdk = SDK(
    network="eip155:97",
    rpcUrl="https://data-seed-prebsc-1-s1.binance.org:8545",
    signer=private_key
)

# 1. Configure Agent
agent = sdk.createAgent(
    name="My AI Agent",
    description="A useful AI assistant",
    image="https://example.com/agent.png"
)
agent.setMCP("https://mcp.example.com/")
agent.setA2A("https://a2a.example.com/agent.json")

# 2. Generate Registration File
registration_data = agent.registrationFile().to_dict()
json_content = str(agent.registrationFile())

# 3. Save and Upload to Your Server
with open("my-agent.json", "w") as f:
    f.write(json_content)
# Upload to: https://yourdomain.com/agents/my-agent.json

# 4. Register On-Chain
tx = agent.register("https://yourdomain.com/agents/my-agent.json")
tx.wait_confirmed(timeout=180)

print(f"✅ Agent registered, ID: {agent.agentId}")
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
import { SDK } from '@bankofai/8004-sdk';

// Initialize the SDK
const sdk = new SDK({
    network: "eip155:97",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    signer: private_key
});

// 1. Configure Agent
const agent = sdk.createAgent({
    name: "My AI Agent",
    description: "A useful AI assistant",
    image: "https://example.com/agent.png"
});
agent.setMCP("https://mcp.example.com/");
agent.setA2A("https://a2a.example.com/agent.json");

// 2. Generate Registration File
const registrationData = agent.toJSON();
const jsonContent = JSON.stringify(registrationData, null, 2);

// 3. Save and Upload to Your Server
// Upload to: https://yourdomain.com/agents/my-agent.json

// 4. Register On-Chain
const tx = await agent.register("https://yourdomain.com/agents/my-agent.json");
await tx.waitConfirmed();

console.log(`✅ Agent registered, ID: ${agent.agentId}`);
```

</TabItem>
</Tabs>









## Update Registration

Update an agent:

<Tabs>
<TabItem value="python" label="python">

```python
# 1. Load existing agent
agent = sdk.loadAgent("97:123")

# 2. Modify configuration
agent.updateInfo(description="Updated description")
agent.setMCP("https://new-mcp.example.com")

# 3. Generate new registration file
json_content = str(agent.registrationFile())

# 4. Upload the updated file to your server
with open("my-agent-updated.json", "w") as f:
    f.write(json_content)

# 5. Update URI on-chain (only if URI has changed)
tx = agent.updateRegistration("https://yourdomain.com/agents/my-agent-updated.json")
tx.wait_confirmed(timeout=180)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// 1. Load an existing agent
const agent = await sdk.loadAgent("97:123");

// 2. Update configuration
agent.updateInfo({ description: "Updated description" });
agent.setMCP("https://new-mcp.example.com");

// 3. Generate new registration file
const registrationData = agent.toJSON();
const jsonContent = JSON.stringify(registrationData, null, 2);

// 4. Upload the updated file to your server

// 5. Update the URI on-chain (only if the URI has changed)
const tx = await agent.updateRegistration("https://yourdomain.com/agents/my-agent-updated.json");
await tx.waitConfirmed();
```

</TabItem>
</Tabs>





## Registration File Format

The SDK generates a registration file compliant with the 8004 standard:

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "My AI Agent",
  "description": "Agent description",
  "image": "https://example.com/image.png",
  "endpoints": [
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
      "agentRegistry": "eip155:97:0x8004A818BFB912233c491871b3d84c89A494BD9e"
    }
  ],
  "supportedTrust": ["reputation"],
  "active": true,
  "x402support": false,
  "updatedAt": 1234567890
}
```

**Note:**
* The registration JSON generated by Python uses `x402Support`.
* The registration JSON currently generated by TypeScript uses `x402support`.
