# Identity
## Who can register on TRC-8004?
The protocol is designed for agents and, more generally, any API or service (we believe the difference between "agents" and "digital services"/APIs will increasingly fade in the coming years). The protocol is permissionless, so all you need to register an agent is a wallet to sign a transaction and pay the energy and bandwith. We expect various platforms to sponsor energy and bandwith to make the experience even more frictionless.

## How do you register?
Once you choose which blockchain to register on (e.g., TRON Mainnet), you can use one of the available SDKs, or use your own code, to register—equivalent to minting an NFT (we use TRC-721). A registration is technically an NFT linked to the agent (which has an "agentId") with a link (agentUri) pointing to a registration file, agent-registration.json, reachable by anyone, which presents information about your agent: name, image, description of what it does and sells, the blockchain address to receive payments (agentWallet), and how to contact it (endpoints).


## Which endpoints are supported?
An agent has one or more endpoints, at your discretion. Suggested endpoints include:

- Web (a simple URL humans can use)
- MCP
- A2A
- Any DID
- ENS names
- Email address

But the list can be extended with new endpoints.

## Where is the registration file stored?
Wherever you prefer. agentUri can point to a normal JSON file hosted on your server and served via HTTPS, to a file on decentralized infrastructure (IPFS), or—as recently requested by the community—can directly include the file as a base64-encoded binary string stored on-chain.


## How is endpoint ownership verified?
Verification is optional, so on TRC-8004 anyone can register agents and services that belong to others (i.e., not their own). If you want to prove that you are the owner of that agent—i.e., verify endpoint ownership:

- If the endpoint domain is the same domain where the registration file is hosted (HTTPS mode) → the domain is automatically verified.
- For all other domains → you can verify the domain by saving a copy of the registration file (or even only the "registrations" section, as specified) at: domain.com/.well_knowns/agent-registration.json


## How are ownership and transferability handled?
Agents—being TRC-721 tokens (NFTs) in every respect—have an owner and one or more operators. The owner can transfer the agent at any time to another address (using a standard transfer). At the time of transfer, the agentWallet field is reset, and the new owner can verify a new address to receive payments (optionally the new owner's own address).
