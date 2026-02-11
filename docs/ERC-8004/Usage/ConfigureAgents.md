import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Configure Agents

Learn how to create, configure, and manage agents using all available fields and options.

## Create an Agent

Create a new agent in memory (not yet registered):


<Tabs>
<TabItem value="python" label="python">

```python
from agent0_sdk import SDK

# Initialize SDK
sdk = SDK(
    chainId=11155111,
    rpcUrl="https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer=your_private_key,
    ipfs="pinata",
    pinataJwt=your_pinata_jwt
)

# Create agent
agent = sdk.createAgent(
    name="My AI Agent",
    description="An intelligent assistant capable of handling various tasks. Skills include: data analysis, code generation, natural language processing. Pricing: $0.10 per request, with a free tier available.",
    image="https://example.com/agent-image.png"  # Optional
)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
import { SDK } from '@ag0/sdk';

// Initialize SDK
const sdk = new SDK({
    chainId: 11155111,
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer: your_private_key,
    ipfs: "pinata",
    pinataJwt: your_pinata_jwt
});

// Create agent
const agent = sdk.createAgent({
    name: "My AI Agent",
    description: "An intelligent assistant capable of handling various tasks. Skills include: data analysis, code generation, natural language processing. Pricing: $0.10 per request, with a free tier available.",
    image: "https://example.com/agent-image.png"  // Optional
});
```

</TabItem>
</Tabs>



## Core Fields

### Name and Description


<Tabs>
<TabItem value="python" label="python">

```python
# Update basic information
agent.updateInfo(
    name="Updated Agent Name",
    description="Updated description",
    image="https://example.com/new-image.png"
)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Update basic information
agent.updateInfo({
    name: "Updated Agent Name",
    description: "Updated description",
    image: "https://example.com/new-image.png"
});
```

</TabItem>
</Tabs>





### Active Status

<Tabs>
<TabItem value="python" label="python">

```python
# Set agent to active/inactive status
agent.setActive(True)   # Active (visible in search)
agent.setActive(False)  # Inactive (hidden but not deleted)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Set agent to active/inactive status
agent.setActive(true);   // Active
agent.setActive(false);  // Inactive
```

</TabItem>
</Tabs>




### x402 Payment Support
<Tabs>
<TabItem value="python" label="python">

```python
# Enable/disable x402 payment support
agent.setX402Support(True)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Enable/disable x402 payment support
agent.setX402Support(true);
```

</TabItem>
</Tabs>





## Endpoint Configuration

### MCP (Model Context Protocol) Endpoint

<Tabs>
<TabItem value="python" label="python">

```python
# Set MCP endpoint
agent.setMCP(endpoint="https://mcp.example.com/")
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Set MCP endpoint
agent.setMCP({ endpoint: "https://mcp.example.com/" });
```

</TabItem>
</Tabs>



When you set an MCP endpoint, the SDK automatically:
*   Fetches tools, prompts, and resources from the endpoint.
*   Populates the agent's capabilities.

### A2A (Agent-to-Agent) Endpoint

<Tabs>
<TabItem value="python" label="python">

```python
# Set A2A endpoint
agent.setA2A(agentcard="https://a2a.example.com/agent-card.json")
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Set A2A endpoint
agent.setA2A({ agentcard: "https://a2a.example.com/agent-card.json" });
```

</TabItem>
</Tabs>




The SDK automatically:
*   Fetches skills from the A2A agent card.
*   Indexes these capabilities for search.

### ENS

<Tabs>
<TabItem value="python" label="python">

```python
# Set ENS name
agent.setENS(name="myagent.eth")
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Set ENS name
agent.setENS({ name: "myagent.eth" });
```

</TabItem>
</Tabs>



This stores the ENS name in:
*   The registry file.
*   As on-chain metadata.

### Remove Endpoints

<Tabs>
<TabItem value="python" label="python">

```python
# Remove a specific type of endpoint
agent.removeEndpoint(type=EndpointType.MCP)

# Remove by value
agent.removeEndpoint(value="https://old-endpoint.com")

# Remove all endpoints
agent.removeEndpoints()
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Remove a specific type of endpoint
agent.removeEndpoint({ type: EndpointType.MCP });

// Remove by value
agent.removeEndpoint({ value: "https://old-endpoint.com" });

// Remove all endpoints
agent.removeEndpoints();
```

</TabItem>
</Tabs>




## Wallet Configuration

### Default Behavior (Wallet set to owner by default)

According to the ERC-8004 protocol, `agentWallet` is **initially set to the agent owner's address**.

*   **If you do not call `setWallet()`**: The agent wallet remains the **owner's wallet** by default.
*   **When a dedicated agent wallet is needed**: Only if you want the agent to use a wallet **different** from the owner (e.g., separation of duties, hot wallet vs. cold wallet owner separation, using wallets on different chains).
*   **After transfer**: `agentWallet` will be reset to the **zero address**, and the new owner must re-authenticate by calling `setWallet()`.

### Set a Dedicated Agent Wallet (Signature Verification)

`agentWallet` is a **reserved on-chain** property. Setting this property requires signature verification according to ERC-8004.

*   **Who sends the transaction**: The SDK signer (usually the agent **owner** or an authorized **operator**) submits the on-chain transaction.
*   **Developer-facing SDK API**: `agent.setWallet(...)`.
*   **Who must sign**: The **new wallet** must authorize this change by signing EIP-712 typed data (EOA) signature.


<Tabs>
<TabItem value="python" label="python">

```python
# You must register the agent first, then call setWallet() if you want to use a dedicated wallet different from the owner's.
tx = agent.registerIPFS()
tx.wait_confirmed(timeout=180)

# --- EOA Flow ---
# The *new wallet* must sign EIP-712 typed data.
# If the new wallet is not the same address as the SDK signer, provide `new_wallet_signer`.
agent.setWallet(
    new_wallet="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    chainId=11155111,
    new_wallet_signer=NEW_WALLET_PRIVATE_KEY,  # Private key of 0x742d...
)

```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// You must register the agent first, then call setWallet().
const tx = await agent.registerIPFS();
await tx.waitConfirmed();

// --- EOA Flow ---
await agent.setWallet({
    newWallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    chainId: 11155111,
    newWalletPrivateKey: NEW_WALLET_PRIVATE_KEY
});

```

</TabItem>
</Tabs>




The wallet address is stored as a **reserved** `agentWallet` property on-chain and requires signature verification (ERC-8004).

### Unset Verified Agent Wallet

If you previously set a dedicated verified `agentWallet` and want to remove it (restore it to an "unset" state on-chain), use:

*   **Python**: `agent.unsetWallet()`
*   **TypeScript**: `await agent.unsetWallet()`

This clears the agent's `agentWallet` byte data on-chain.

### "What am I signing?" (EOA)

Both SDKs internally construct EIP-712 typed data. Conceptually, the message signed by the **new wallet** contains:

*   **agentId**: The agent's tokenId
*   **newWallet**: The wallet address you are setting
*   **owner**: The current agent owner (read from the registry)
*   **deadline**: A short validity window enforced by the contract
*   **domain**: The EIP-712 domain of the Identity Registry (chainId + verifyingContract, and name/version)

#### EOA

*   **EOA Signature (Python)**: Pass `new_wallet_signer=...` (private key / eth-account account) unless the SDK signer is the new wallet.
*   **EOA Signature (TypeScript)**: Pass `newWalletPrivateKey` unless the SDK signer is the new wallet.



## OASF Skills and Domains

Agents can advertise their capabilities using the Open Agentic Schema Framework (OASF) taxonomy. This provides a standardized classification for skills and domains, improving discoverability and interoperability.

### Add Skills

<Tabs>
<TabItem value="python" label="python">

```python
# Add a skill without validation (allows any string)
agent.addSkill("custom_skill/my_skill", validate_oasf=False)

# Add a skill with validation (ensures it exists in the OASF taxonomy)
agent.addSkill("advanced_reasoning_planning/strategic_planning", validate_oasf=True)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Add a skill without validation
agent.addSkill({ skill: "custom_skill/my_skill", validateOasf: false });

// Add a skill with validation
agent.addSkill({ skill: "advanced_reasoning_planning/strategic_planning", validateOasf: true });
```

</TabItem>
</Tabs>





### Add Domains
<Tabs>
<TabItem value="python" label="python">

```python
# Add a domain without validation
agent.addDomain("custom_domain/my_domain", validate_oasf=False)

# Add a domain with validation
agent.addDomain("finance_and_business/investment_services", validate_oasf=True)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Add a domain without validation
agent.addDomain({ domain: "custom_domain/my_domain", validateOasf: false });

// Add a domain with validation
agent.addDomain({ domain: "finance_and_business/investment_services", validateOasf: true });
```

</TabItem>
</Tabs>







### Remove Skills and Domains

<Tabs>
<TabItem value="python" label="python">

```python
# Remove a skill
agent.removeSkill("advanced_reasoning_planning/strategic_planning")

# Remove a domain
agent.removeDomain("finance_and_business/investment_services")
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Remove a skill
agent.removeSkill({ skill: "advanced_reasoning_planning/strategic_planning" });

// Remove a domain
agent.removeDomain({ domain: "finance_and_business/investment_services" });
```

</TabItem>
</Tabs>






### Method Chaining

All OASF methods support chaining:

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





### OASF in the Registry File

OASF skills and domains are stored in the `endpoints` array of the registry file:

```json
{
  "endpoints": [
    {
      "name": "OASF",
      "endpoint": "https://github.com/agntcy/oasf/",
      "version": "v0.8.0",
      "skills": [
        "advanced_reasoning_planning/strategic_planning",
      ],
      "domains": [
        "technology/data_science"
      ]
    }
  ]
}
```

## Trust Models

Trust models allow agents to declare how they handle security and privacy.

### Set Trust Models

<Tabs>
<TabItem value="python" label="python">

```python
# Set trust models
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
// Set trust models
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





## On-Chain Metadata Management

Certain properties can be managed directly as on-chain metadata.

<Tabs>
<TabItem value="python" label="python">

```python
# Update on-chain metadata
agent.updateOnChainMetadata()
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Update on-chain metadata
await agent.updateOnChainMetadata();
```

</TabItem>
</Tabs>




## Load Existing Agent

If you already have a registered agent, you can load it by its ID:

<Tabs>
<TabItem value="python" label="python">

```python
# Load agent by ID
agent = sdk.getAgent(agent_id="0x123...")
```


</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Load agent by ID
const agent = await sdk.getAgent("0x123...");
```

</TabItem>
</Tabs>



## Direct Property Access

You can directly access properties of the agent object:

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




## Full Configuration Example

Here's a complete example of configuring an agent with various settings:

<Tabs>
<TabItem value="python" label="python">

```python
agent = sdk.createAgent(
    name="Advanced AI Assistant",
    description="A fully featured agent example"
)

agent.setMCP(endpoint="https://mcp.example.com/")\
     .setENS(name="advanced-agent.eth")\
     .addSkill("advanced_reasoning_planning/strategic_planning", validate_oasf=True)\
     .addDomain("technology/data_science", validate_oasf=True)\
     .setActive(True)\
     .setX402Support(True)

# Register agent
tx = agent.registerIPFS()
tx.wait_confirmed()
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
const agent = sdk.createAgent({
    name: "Advanced AI Assistant",
    description: "A fully featured agent example"
});

agent.setMCP({ endpoint: "https://mcp.example.com/" })
     .setENS({ name: "advanced-agent.eth" })
     .addSkill({ skill: "advanced_reasoning_planning/strategic_planning", validateOasf: true })
     .addDomain({ domain: "technology/data_science", validateOasf: true })
     .setActive(true)
     .setX402Support(true);

// Register agent
const tx = await agent.registerIPFS();
await tx.waitConfirmed();
```


</TabItem>
</Tabs>



