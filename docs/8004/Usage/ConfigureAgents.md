import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Configure Agents

Learn how to create, configure, and manage agents using all available fields and options.

## Create an Agent

Create a new agent in memory (not yet registered):


<Tabs>
<TabItem value="python" label="python">

```python
import os

from bankofai.sdk_8004.core.sdk import SDK

# Initialize the SDK
sdk = SDK(
    network="eip155:97",
    rpcUrl="https://data-seed-prebsc-1-s1.binance.org:8545",
    signer=os.environ["EVM_PRIVATE_KEY"],
    ipfs="pinata",
    pinataJwt=os.environ["PINATA_JWT"]
)

# Create an Agent
agent = sdk.createAgent(
    name="My AI Agent",
    description="An intelligent assistant capable of handling various tasks. Skills include: data analysis, code generation, natural language processing. Pricing: $0.10 per request, with a free tier available.",
    image="https://example.com/agent-image.png"  # Optional
)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
import { SDK } from '@bankofai/8004-sdk';

// Initialize the SDK
const sdk = new SDK({
    network: "eip155:97",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    signer: process.env.EVM_PRIVATE_KEY!
});

// Create an Agent
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
# Set agent to Active/Inactive status
agent.setActive(True)   # Active (visible in search)
agent.setActive(False)  # Inactive (hidden but not deleted)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Set agent to Active/Inactive status
agent.setActive(true);   // Active
agent.setActive(false);  // Inactive
```

</TabItem>
</Tabs>




### x402 Payment Support
<Tabs>
<TabItem value="python" label="python">

```python
# Enable/Disable x402 payment support
agent.setX402Support(True)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Enable/Disable x402 payment support
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
agent.setMCP("https://mcp.example.com/");
```

</TabItem>
</Tabs>



What `setMCP()` does beyond recording the endpoint differs by language:
*   **Python**: by default (`auto_fetch=True`) it fetches tools, prompts, and resources from the endpoint and stores them on the MCP endpoint entry as `mcpTools`, `mcpPrompts`, and `mcpResources`. A failed fetch is skipped: network and parse errors are logged only at debug level, and a non-HTTP(S) endpoint logs a warning. Pass `auto_fetch=False` to turn this off.
*   **TypeScript**: it only records the endpoint URL and version (default `2025-06-18`). It does not contact the endpoint.

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
agent.setA2A("https://a2a.example.com/agent-card.json");
```

</TabItem>
</Tabs>




What `setA2A()` does beyond recording the endpoint differs by language:
*   **Python**: by default (`auto_fetch=True`) it fetches the skill tags (`skills[].tags`) from the A2A agent card and stores them on the A2A endpoint entry as `a2aSkills`. A failed fetch is skipped: network and parse errors are logged only at debug level, and a non-HTTP(S) endpoint logs a warning. Pass `auto_fetch=False` to turn this off.
*   **TypeScript**: it only records the agent card URL and version (default `0.3.0`). It does not fetch the card.

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
// TypeScript SDK supports the high-level setENS() method
agent.setENS("myagent.eth");
```

</TabItem>
</Tabs>



Both SDKs store the ENS name as an `ENS` endpoint in the registration file. Writing it on-chain as the `agentName` metadata key differs:
*   **Python**: the first `register()` (minting) writes `agentName` on-chain for you; on an already registered agent, `register(uri)` only updates the URI, so use `registerIPFS()`, which writes changed metadata including `agentName`.
*   **TypeScript**: `setENS()` only changes the local registration file, and `register()` / `registerIPFS()` do not send `agentName`. Call `await agent.updateOnChainMetadata()` on a registered agent to write it.

### Remove Endpoints

<Tabs>
<TabItem value="python" label="python">

```python
from bankofai.sdk_8004.core.models import EndpointType

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
// The TypeScript SDK supports the high-level removeEndpoint() / removeEndpoints() methods.
agent.removeEndpoint({ type: "MCP" });
agent.removeEndpoint({ value: "https://old-endpoint.com" });
agent.removeEndpoints();
```

</TabItem>
</Tabs>




## Wallet Configuration

### Default Behavior (Wallet set to Owner by default)

According to the 8004 protocol, the `agentWallet` is **initially set to the agent owner's address**.

*   **If you do not call `setWallet()`**: The agent wallet defaults to the **owner's wallet**.
*   **When a dedicated agent wallet is needed**: Only if you want the agent to use a **different** wallet than the owner (e.g., separation of duties, hot/cold wallet owner separation, using wallets from different chains).
*   **After transfer**: `agentWallet` will be reset to the **zero address**, and the new owner must re-verify by calling `setWallet()`.

### Set a Dedicated Agent Wallet (Signature Verification)

`agentWallet` is a **reserved on-chain** property. According to 8004, setting this property requires signature verification.

*   **Who sends the transaction**: The SDK signer submits the on-chain transaction, and the contract requires it to be the agent **owner**, the address approved for that agent, or an **operator** approved for all of the owner's agents.
*   **Developer-facing SDK API**: `agent.setWallet(newWallet, options)` in TypeScript; `agent.setWallet(new_wallet, chainId=None, *, new_wallet_signer=None, deadline=None, signature=None)` in Python. Everything after the address is optional — but see **How the signature is supplied** below, because the bare one-argument call only works in one specific case.
*   **Who must sign**: The **new wallet** must authorize this change by signing EIP-712 typed data. The contract first tries ECDSA recovery (plain EOAs and EIP-7702 delegated EOAs); if that does not yield the new wallet, it falls back to an [ERC-1271](https://eips.ethereum.org/EIPS/eip-1271) `isValidSignature` call on the new wallet, so smart contract wallets are supported too.
*   **Not settable as plain metadata**: `agentWallet` is a reserved key — `setMetadata()` and the metadata array of `register()` both reject it.


<Tabs>
<TabItem value="python" label="python">

```python
import os

# You must register the agent first, then call setWallet() if you want to use a dedicated wallet different from the owner.
tx = agent.register("https://example.com/agent-card.json")
tx.wait_confirmed(timeout=180)

# --- EOA Flow ---
# The SDK signer sends the transaction, but the *new wallet* must produce the
# EIP-712 signature. Pass its key as new_wallet_signer whenever the new wallet
# is not the SDK signer itself.
agent.setWallet(
    "0x742D35CC6634C0532925a3B844Bc9E7595F2bD18",
    new_wallet_signer=os.environ["NEW_WALLET_PRIVATE_KEY"],
)

# If the SDK signer *is* the new wallet, the SDK signs automatically:
# agent.setWallet(address_of_the_sdk_signer)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// You must register the agent first, then call setWallet().
const tx = await agent.register("https://example.com/agent-card.json");
await tx.waitConfirmed();

// --- EOA Flow ---
// The SDK signer sends the transaction, but the *new wallet* must produce the
// EIP-712 signature. Pass its key as newWalletSigner whenever the new wallet
// is not the SDK signer itself.
await agent.setWallet("0x742D35CC6634C0532925a3B844Bc9E7595F2bD18", {
  newWalletSigner: process.env.NEW_WALLET_PRIVATE_KEY!,
});

// If the SDK signer *is* the new wallet, the SDK signs automatically:
// await agent.setWallet(addressOfTheSdkSigner);
```

</TabItem>
</Tabs>





The wallet address is stored as a **reserved** `agentWallet` property on-chain and requires signature verification (8004).

### Unset Verified Agent Wallet

If you previously set a dedicated, verified `agentWallet` and wish to remove it (revert to an "unset" state on-chain), use:

*   **Python**: `agent.unsetWallet()`
*   **TypeScript**: `await agent.unsetWallet()`

This clears the agent's `agentWallet` bytes data on-chain.

### "What exactly am I signing?"

Both SDKs internally construct EIP-712 typed data. Conceptually, the message signed by the **new wallet** contains:

*   **agentId**: The agent's tokenId
*   **newWallet**: The wallet address you are setting
*   **owner**: The current agent owner (read from the registry)
*   **deadline**: An expiry timestamp enforced by the contract — it must not have passed, and may be at most **5 minutes** in the future
*   **domain**: The EIP-712 domain of the Identity Registry — name `ERC8004IdentityRegistry`, version `1`, plus `chainId` and `verifyingContract`

The contract then verifies that signature in one of two ways:

*   **EOA**: The contract recovers the signer from the ECDSA signature and requires it to equal `newWallet`.
*   **Smart contract wallet**: If recovery fails or returns a different address, the contract calls `isValidSignature(digest, signature)` on `newWallet` and requires the ERC-1271 magic value `0x1626ba7e`.

### How the signature is supplied

The SDK builds the typed data for you, but it cannot invent the new wallet's signature. There are exactly three ways it obtains one, and they are tried in this order:

| You pass | What the SDK does |
| :--- | :--- |
| `signature` (Python) / `signature` (TS) | Uses your bytes as-is. This is the path for smart contract wallets and any external/offline signer. |
| `new_wallet_signer` (Python) / `newWalletSigner` (TS) | Signs with that key. The SDK checks the key's address against `newWallet` first and raises if they differ. |
| neither | Falls back to the SDK signer — **and this only succeeds if the SDK signer's address is the new wallet**. Otherwise Python raises `New wallet must sign. Provide new_wallet_signer (EOA) or signature (ERC-1271/external).` and TypeScript throws `newWalletSigner address (…) does not match newWallet (…).` If the TypeScript SDK has no signer at all, it throws `New wallet signature is required. Provide options.newWalletSigner or options.signature.` |

:::caution The bare one-argument call is not the general case
`setWallet(address)` with no signing option works **only** when the SDK signer already is that address. Since the transaction sender must also be the owner or an approved operator, the bare call is effectively for "point the agent at the wallet I am already signing with". To attach a wallet that is *different* from the SDK signer, you must supply `new_wallet_signer` / `newWalletSigner` or a ready-made `signature`.
:::

Two more behaviours worth knowing: `deadline` defaults to 60 seconds from now (the contract's own ceiling is 5 minutes), and if `agentWallet` is already set to the address you passed, the SDK skips the transaction entirely and returns `None` / `undefined` after updating the local registration file.



## OASF Skills and Domains

Agents can advertise their capabilities using the Open Agentic Schema Framework (OASF) taxonomy. This provides a standardized classification for skills and domains, enhancing discoverability and interoperability.

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
// The TypeScript SDK does not validate against the OASF taxonomy:
// addSkill() accepts any string
agent.addSkill("custom_skill/my_skill");
agent.addSkill("advanced_reasoning_planning/strategic_planning");
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
// The TypeScript SDK does not validate against the OASF taxonomy:
// addDomain() accepts any string
agent.addDomain("custom_domain/my_domain");
agent.addDomain("finance_and_business/investment_services");
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
// The TypeScript SDK supports the high-level removeSkill() / removeDomain() methods.
agent.removeSkill("advanced_reasoning_planning/strategic_planning");
agent.removeDomain("finance_and_business/investment_services");
```

</TabItem>
</Tabs>






### Method Chaining

All OASF methods support chaining:

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





### OASF in Registration File

The two SDKs store OASF skills and domains differently. **Python** keeps them in an `OASF` entry inside the registration file's `services` array:

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

**TypeScript** does not build an OASF entry: `addSkill()` and `addDomain()` push the same slugs into a flat top-level `tags` array, which its wire format carries alongside `metadata`. Python's published file has neither key. Expect this difference when a consumer reads registration files produced by both languages.

## Trust Model

Trust models allow agents to declare how they handle security and privacy.

### Set Trust Model

<Tabs>
<TabItem value="python" label="python">

```python
# Set trust model
agent.setTrust(reputation=True, cryptoEconomic=True, teeAttestation=True)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Set trust model
agent.setTrust({ reputation: true, cryptoEconomic: true, teeAttestation: true });
```

</TabItem>
</Tabs>





## On-chain Metadata Management

Certain properties can be managed directly as on-chain metadata.

<Tabs>
<TabItem value="python" label="python">

```python
# Update on-chain metadata (the agent must already be registered)
agent.setMetadata({"version": "1.1.0", "tier": "pro"})
# setMetadata() only stages the keys. On a registered agent, the next registerIPFS()
# (requires an IPFS client) uploads the file, replaces the URI with ipfs://..., and then
# writes each changed key on chain (best-effort) inside wait_confirmed().
# register(uri) and updateRegistration() update only the URI of a registered agent.
tx = agent.registerIPFS()
tx.wait_confirmed(timeout=180)
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Update on-chain metadata (the agent must already be registered)
agent.setMetadata({ version: "1.1.0", tier: "pro" });
// Sends one setMetadata transaction per key in the local metadata (plus agentName
// when an ENS name is set) and returns their hashes.
// Do not call register() here: it always mints a new agent.
const txHashes = await agent.updateOnChainMetadata();
```

</TabItem>
</Tabs>




## Load Existing Agent

If you already have a registered agent, you can load it by its ID:

<Tabs>
<TabItem value="python" label="python">

```python
# Load agent by ID
agent = sdk.loadAgent("97:123")
```


</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
// Load agent by ID
const agent = await sdk.loadAgent("97:123");
```

</TabItem>
</Tabs>



## Direct Property Access

You can directly access the properties of the agent object:

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
// The TypeScript Agent has no name/description/active getters; read them from toJSON()
const file = agent.toJSON();
console.log(file.name);
console.log(file.description);
console.log(file.active);
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
     .addDomain("technology/data_science/data_science", validate_oasf=True)\
     .setActive(True)\
     .setX402Support(True)

# Register agent
tx = agent.register("https://example.com/agent-card.json")
tx.wait_confirmed()
```

</TabItem>
<TabItem value="TypeScript" label="TypeScript">

```typescript
const agent = sdk.createAgent({
    name: "Advanced AI Assistant",
    description: "A fully featured agent example"
});

agent.setMCP("https://mcp.example.com/")
     .setENS("advanced-agent.eth")
     .addSkill("advanced_reasoning_planning/strategic_planning")
     .addDomain("technology/data_science/data_science")
     .setActive(true)
     .setX402Support(true);

// Register agent
const tx = await agent.register("https://example.com/agent-card.json");
await tx.waitConfirmed();
```


</TabItem>
</Tabs>

## Common Contract Errors

These revert reasons come from the TRC-8004 / ERC-8004 registry contracts; the "Where" column names the contract function and the SDK calls that send it. On EVM networks a string reason such as `Not authorized` appears in the SDK's transaction error (usually from gas estimation). A custom ERC-721 error raised inside a Reputation or Validation call, such as `giveFeedback()` on an unregistered agent, may show only as its selector (`0x7e273289` is `ERC721NonexistentToken`). On TRON both SDKs report only `TRON transaction reverted: <hash> (REVERT)`, so look the transaction up on TronScan to see the reason.

| Revert reason | Where | Cause and fix |
| --- | --- | --- |
| `Not authorized` | Identity Registry `setMetadata` / `setAgentURI` / `setAgentWallet`, sent by `updateOnChainMetadata()`, `updateRegistration(<uri>)`, `registerIPFS()` and `setWallet()`; Validation Registry `validationRequest` | The sender is not the agent's owner, approved address or operator. Sign with the owner, or `addOperator()` (TypeScript also `agent.approve()`) first |
| `ERC721InsufficientApproval` | `transferFrom`, sent by TypeScript `transfer()` | The sender is not the owner, approved address or operator. Python `transfer()` checks the owner before sending and raises `ValueError: Only the current owner (…) can transfer the agent` instead |
| `reserved key` | `register()` metadata, `setMetadata` | `agentWallet` is reserved; use `setWallet()` |
| `bad wallet` / `expired` / `deadline too far` | `setWallet` | Zero address; `deadline` already passed; `deadline` more than 5 minutes ahead |
| `invalid wallet sig` | `setWallet` | The signature was not produced by the new wallet (ECDSA, or ERC-1271 for contract wallets) |
| `Self-feedback not allowed` | `giveFeedback` | The agent's owner, an operator or the approved address rated the agent |
| `index must be > 0` / `index out of bounds` | `revokeFeedback`, `appendResponse`, `readFeedback` (SDK `getFeedback()`) | `feedbackIndex` is 0, or higher than the last feedback that client gave the agent (including when it gave none) |
| `Already revoked` | `revokeFeedback` | The feedback was already revoked |
| `Empty URI` | `appendResponse` | `responseURI` is empty. Python `appendResponse()` builds the URI only when an IPFS client is configured and the response has `text` or `attachments`; otherwise, or when the IPFS upload fails, it sends an empty URI and hits this error |
| `clientAddresses required` | `getSummary`, called by Python `getReputationSummary()` without a subgraph | The agent has no feedback yet, so the client list read from the chain is empty. `sdk.getReputationSummary()` takes no client list, so treat this as "no reputation yet" (TypeScript returns zeros instead) |
| `exists` / `not validator` / `resp>100` / `unknown` | Validation request / response | Duplicate request hash; responder is not the named validator; score above 100; unknown request hash |
| `ERC721NonexistentToken` | Identity Registry writes and `ownerOf` / `tokenURI` reads, `giveFeedback`, `validationRequest` | The agent ID is not registered on the configured network. Python `loadAgent()` raises `Failed to load agent …`; TypeScript `loadAgent()` does not throw and returns an agent with an empty URI |
