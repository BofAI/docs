---
title: 'SDK Feature Matrix'
description: 'Feature support matrix for the 8004 SDK across its TypeScript and Python implementations.'
---

# SDK Feature Matrix

This page tracks what the 8004 SDK actually implements, and where the TypeScript and Python implementations differ.

> **Two implementations, one repository.** `8004-sdk` ships a TypeScript package and a Python package from the same repository (`ts/` and `python/`). They target the same contracts and the same registration file format, but **they are not feature-identical** — the gaps are listed under [Language parity](#language-parity).
>
> **Current release:** `@bankofai/8004-sdk` **1.2.1** on npm; the Python package (source version `1.2.1`) is not on PyPI, so install it from the repository's `main` branch. TypeScript requires **Node.js 22.23.4+ (22.x), 24.22.1+ (24.x), or 26.12.1+ (26.x)**; Python requires **Python ≥ 3.11**.

---

## Packages

| Language | Package | Import | Install |
|---|---|---|---|
| TypeScript | `@bankofai/8004-sdk` | `import { SDK } from '@bankofai/8004-sdk'` | `npm install @bankofai/8004-sdk` |
| Python | `bankofai-8004-sdk` | `from bankofai.sdk_8004.core.sdk import SDK` | Install from GitHub — see [Installation](/8004/Usage/Install/) |

The Python package is not yet published to PyPI; install it from the repository.

### Runtime dependencies

| TypeScript | Python |
|---|---|
| `viem` (EVM client) | `web3` (EVM client) |
| `tronweb` (TRON client) | `tronpy` (TRON client) |
| `graphql-request` (subgraph queries) | `requests`, `aiohttp` (HTTP) |
| — | `eth-account`, `eth-hash` (signing, keccak) |

---

## Core Components

| Component | TypeScript | Python | Notes |
|---|:--:|:--:|---|
| `SDK` — chain clients, registries, top-level calls | ✅ | ✅ | |
| `Agent` — registration file builder + on-chain agent | ✅ | ✅ | |
| `TransactionHandle` — await confirmation, map the result | ✅ | ✅ | `waitConfirmed()` / `wait_confirmed()` |
| `SubgraphClient` — indexed queries | ✅ | ✅ | Optional. Python ships default subgraph URLs for Base Mainnet and Base Sepolia (and Ethereum, Polygon, Sepolia); TypeScript ships none, so pass `subgraphUrl`. Neither has a BSC default |
| `AgentIndexer` | ✅ | ✅ | Python also exposes `refreshIndex` / `refreshAgentIndex` |

---

## Networks

Contract addresses ship with the SDK. The BSC and TRON entries are identical in both languages; for Base, the TypeScript SDK configures all three registries, while the Python SDK knows only the Identity and Reputation Registry addresses. The full list is on the [Contract Addresses](/8004/contract/) page.

Pass BSC as `eip155:56` / `eip155:97`. A bare `mainnet` resolves to **TRON** mainnet in both SDKs, and a bare `testnet` is rejected by TypeScript (Python falls back to chainId 97). TypeScript additionally accepts `bsc`, `bsc:mainnet` and `evm`, but without `chainId: 56` **all three resolve to BSC Testnet (97)** — including `bsc:mainnet`. Use `eip155:56` for BSC Mainnet.

| Ecosystem | Network name | CAIP-2 / chainId | EIP-712 chainId | Default endpoint |
|---|---|---|---|---|
| BSC | `eip155:56` | `eip155:56` / `56` | `56` | `https://bsc-dataseed.binance.org` |
| BSC | `eip155:97` | `eip155:97` / `97` | `97` | `https://data-seed-prebsc-1-s1.binance.org:8545` |
| Base | `base` | `eip155:8453` / `8453` | `8453` | `https://mainnet.base.org` |
| Base | `base:sepolia` | `eip155:84532` / `84532` | `84532` | `https://sepolia.base.org` |
| TRON | `mainnet` | — / `728126428` | `728126428` | `https://api.trongrid.io` |
| TRON | `nile` | — / `3448148188` | `3448148188` | `https://nile.trongrid.io` |
| TRON | `shasta` | — / `2494104990` | `2494104990` | `https://api.shasta.trongrid.io` |

Use the bare TRON names (`mainnet` / `nile` / `shasta`) — that is what the examples show. Both SDKs also accept a `tron:`-prefixed alias (`tron:nile`, and a bare `tron` resolves to Nile), stripping the prefix internally; these are the SDK's own aliases, not the CAIP-2 identifiers x402 uses. The EIP-712 chainId column is what the SDK puts in the typed-data domain when signing an agent-wallet change on TRON. Since 1.1.2 both SDKs also use that value as the TRON chainId, so agent IDs take the form `3448148188:<tokenId>` on Nile (older releases produced `1:<tokenId>`; persisted IDs are not rewritten). `loadAgent()` and the reputation calls in both SDKs reject an ID whose chain prefix differs from the configured network; indexer and subgraph queries such as `getAgent()` and `searchFeedback()` do not check it.

Base uses the official ERC-8004 Registry deployments. TypeScript accepts `base` / `base:mainnet` / `eip155:8453` and `base:sepolia` / `eip155:84532`. Python accepts only `eip155:8453` / `eip155:84532` and has no Base Validation Registry; a bare `network="base"` is not rejected but falls back to chainId 97 (BSC Testnet).

---

## Identity and Registration

| Feature | TypeScript | Python | API |
|---|:--:|:--:|---|
| Create an agent locally | ✅ | ✅ | `sdk.createAgent(...)` |
| Edit name / description / image | ✅ | ✅ | `agent.updateInfo({...})` — edits the local registration file; publish it with `updateRegistration()` |
| Register with an HTTP(S) URI | ✅ | ✅ | `agent.register(agentURI)` |
| Register without a URI, or with on-chain metadata entries | ✅ | ✅ | TS passes them explicitly: `agent.register()` / `agent.register(agentURI, metadata)`. Python's `register(agentURI)` takes only the URI but mints the metadata staged with `setMetadata()` (plus the ENS name as `agentName`); `registerIPFS()` mints without a URI first |
| Register via IPFS upload | ✅ | ✅ | `agent.registerIPFS()` — for a new agent, mints first, then uploads the file with the minted agent ID and sets the URI (two transactions) |
| Update the on-chain URI | ✅ | ✅ | `agent.updateRegistration(...)` |
| Set the agent URI locally | ✅ | ✅ | `agent.setAgentUri(uri)` — local only, no transaction |
| Load an agent from chain by ID | ✅ | ✅ | `sdk.loadAgent(agentId)` — works without a subgraph |
| Read the on-chain agent URI | ✅ | ❌ | `sdk.getAgentURI(agentId)` |
| MCP / A2A / ENS endpoints | ✅ | ✅ | `setMCP()`, `setA2A()`, `setENS()` |
| Remove endpoints | ✅ | ✅ | `removeEndpoint()`, `removeEndpoints()` |
| OASF skills and domains | ✅ | ✅ | `addSkill()`, `addDomain()`, `removeSkill()`, `removeDomain()` — but stored differently: Python builds an `OASF` entry inside `services` (its `version` is `0.8`), TypeScript pushes the slugs into a flat `tags` array |
| Validate a slug against the OASF taxonomy | ❌ | ✅ | Python's `validate_oasf=True` checks the bundled taxonomy (136 skills, 204 domains); TypeScript accepts any string |
| Trust models | ✅ | ✅ | `setTrust(...)` — an object in TypeScript, keyword arguments in Python; both cover `reputation`, `cryptoEconomic`, `teeAttestation` |
| Replace the trust model list wholesale | ✅ | ✅ | TypeScript `agent.setTrustModels([...])` normalises the names; Python `agent.trustModels([...])` assigns them as given |
| Arbitrary metadata | ✅ | ✅ | `setMetadata()` |
| Read local metadata / delete one key | ❌ | ✅ | `agent.getMetadata()` returns a copy of all local metadata; `agent.delMetadata(key)` deletes one key — local registration file |
| Read one on-chain metadata value | ✅ | ❌ | `sdk.getMetadata(agentId, key)` — returns the raw bytes as hex |
| Push metadata changes on-chain | ✅ | ❌ | `agent.updateOnChainMetadata()` |
| Active flag | ✅ | ✅ | `setActive()`; Python also has `activate()` / `deactivate()` |
| x402 support flag | ✅ | ✅ | `setX402Support()` |

:::note `agentWallet` is not ordinary metadata
The Identity Registry reserves the `agentWallet` key. `setMetadata()` and the metadata array passed to `register()` both reject it on-chain — it can only be changed through the wallet API below.
:::

---

## Agent Wallet

| Feature | TypeScript | Python | Notes |
|---|:--:|:--:|---|
| Read the current agent wallet | ✅ | ✅ | `agent.getWallet()`, `sdk.getAgentWallet()` (TS only at SDK level) |
| Set a verified agent wallet | ✅ | ✅ | `agent.setWallet(...)` |
| Unset it | ✅ | ✅ | `agent.unsetWallet()` |
| SDK auto-signs when the signer is the new wallet | ✅ | ✅ | The only case where the bare one-argument call works |
| Sign with a supplied key | ✅ | ✅ | `newWalletSigner` (TS) / `new_wallet_signer` (Python) |
| Accept an externally produced signature | ✅ | ✅ | `signature` — the path for ERC-1271 smart contract wallets |
| Custom deadline | ✅ | ✅ | Defaults to 60s; the contract caps it at 5 minutes |
| Skip the transaction if already set | ✅ | ✅ | Returns `undefined` / `None` |

See [Configure Agents → How the signature is supplied](/8004/Usage/ConfigureAgents/) for the rules that govern which path applies.

---

## Reputation

All reputation calls live on the `SDK` object in both languages.

| Feature | TypeScript | Python | API |
|---|:--:|:--:|---|
| Leave feedback | ✅ | ✅ | `sdk.giveFeedback(...)` |
| Read one feedback entry | ✅ | ✅ | `sdk.getFeedback(...)` |
| Aggregate summary | ✅ | ✅ | `sdk.getReputationSummary(...)` |
| Revoke your own feedback | ✅ | ✅ | `sdk.revokeFeedback(...)` |
| Append a response to feedback | ✅ | ✅ | `sdk.appendResponse(...)` |
| Search feedback | ✅ | ✅ | `sdk.searchFeedback(...)` — subgraph-backed; without a subgraph, TypeScript returns `[]` and Python reads a single agent's feedback from chain |
| Read all feedback from chain | ✅ | ❌ | `sdk.readAllFeedback(...)` |
| Read clients, last index, response count | ✅ | ❌ | `sdk.getClients()`, `sdk.getLastIndex()`, `sdk.getResponseCount()` |
| Build a feedback file | ❌ | ✅ | `sdk.prepareFeedbackFile(...)` |

:::note Self-feedback is blocked on-chain
The Reputation Registry rejects feedback from the agent's owner and from any approved operator. Feedback is attributed to the caller's address — there is no separate off-chain signature.
:::

---

## Validation

| Feature | TypeScript | Python | API |
|---|:--:|:--:|---|
| Request validation | ✅ | ❌ | `sdk.validationRequest(...)` |
| Submit a validator response | ✅ | ❌ | `sdk.validationResponse(...)` |
| Read validation status | ✅ | ❌ | `sdk.getValidationStatus(...)` |
| Aggregate validation summary | ✅ | ❌ | `sdk.getValidationSummary(...)` |
| List an agent's / a validator's request hashes | ✅ | ❌ | `sdk.getAgentValidations(...)`, `sdk.getValidatorRequests(...)` |

:::caution Validation is TypeScript-only today
The Python package resolves the Validation Registry contract and ships its ABI, but exposes **no** validation methods. Use the TypeScript SDK, or call the contract directly, if you need the Validation Registry from Python.
:::

The registry itself is deliberately generic: only the validator named in the request may answer, and a response carries a score from **0 to 100** plus a tag and a URI pointing at the evidence. How that verdict was reached — TEE attestation, staking, zkML — is outside the contract.

---

## Ownership and Operators

| Feature | TypeScript | Python | API |
|---|:--:|:--:|---|
| Transfer the agent | ✅ | ✅ | `agent.transfer(...)`; Python also has `sdk.transferAgent(...)` |
| Approve the new owner as operator during transfer | ✅ | ❌ | TS `transfer(to, approveOperator)`; the Python `Agent.transfer` takes only the address |
| Add / remove an operator | ✅ | ✅ | `agent.addOperator()`, `agent.removeOperator()` |
| Approve an address for this agent only | ✅ | ❌ | `agent.approve(operator)` |
| Read approvals | ✅ | ❌ | `sdk.getApproved(agentId)`, `sdk.isApprovedForAll(owner, operator)` |
| Read the owner | ✅ | ✅ | `sdk.getAgentOwner()` |
| Ownership / transfer pre-checks | ❌ | ✅ | `sdk.isAgentOwner()`, `sdk.canTransferAgent()` |

:::note Transfer clears the agent wallet
The Identity Registry clears `agentWallet` on every transfer, so it reads back as the zero address afterwards — which the SDKs report as `undefined` (TypeScript `sdk.getAgentWallet()`) / `None` (Python `agent.getWallet()`). The new owner must call `setWallet()` again.
:::

---

## Discovery and Indexing

| Feature | TypeScript | Python | Requires subgraph |
|---|:--:|:--:|:--:|
| `sdk.loadAgent(agentId)` | ✅ | ✅ | No — reads the chain directly |
| `sdk.getAgent(agentId)` | ✅ | ✅ | Yes (Python falls back to its local index cache, which `refreshIndex` cannot fill in 1.2.1 — see below) |
| `sdk.searchAgents(filters)` | ✅ | ✅ | Yes |
| `sdk.searchFeedback(filters)` | ✅ | ✅ | Yes, except Python's on-chain fallback for a single `agentId` |
| `sdk.getSubgraphClient(chainId?)` — Python `sdk.get_subgraph_client()` | ✅ | ✅ | — returns nothing when unconfigured |
| `sdk.refreshIndex()`, `sdk.refreshAgentIndex()` | ❌ | ⚠️ | Broken in 1.2.1: the SDK builds its indexer without the Identity Registry, so `refreshAgentIndex()` raises `Failed to get agent data: Identity registry not available` and `refreshIndex()` returns `[]` |

Without a subgraph (TypeScript unless you pass `subgraphUrl` or a `subgraphOverrides` entry for the chain; Python on BSC unless you pass `subgraphOverrides`, and always on TRON), `searchAgents()` is unavailable, Python `getAgent()` raises `Agent … not found in index` and TypeScript `getAgent()` returns `undefined`, TypeScript `searchFeedback()` returns `[]`, and Python `searchFeedback()` works only for a single `agentId`. `loadAgent()` remains the way to fetch an agent. On TRON, Python's `getAgent("<chainId>:<agentId>")` still queries a subgraph URL given in `subgraphOverrides` or the `SUBGRAPH_URL_<chainId>` environment variable.

---

## Storage

The two languages configure storage completely differently.

**Python** ships built-in providers, selected on the `SDK(...)` constructor:

| Provider | Config value | Required option |
|---|---|---|
| Pinata | `ipfs="pinata"` | `pinataJwt` |
| Filecoin | `ipfs="filecoinPin"` | `filecoinPrivateKey` |
| Self-hosted IPFS node | `ipfs="node"` | `ipfsNodeUrl` |

**TypeScript** ships none of these. `SDKConfig` exposes a single `ipfsUploader?: (json: string) => Promise<string>` callback that you implement yourself; `registerIPFS()` throws `No ipfsUploader configured` without it. For a new agent that error comes from `waitConfirmed()`, after the registration transaction has already minted the agent with an empty URI, so configure the uploader first.

IPFS is optional in both languages. It is needed for `registerIPFS()`; in Python also for reading an `ipfs://` agent URI and for `giveFeedback(feedbackFile=...)` (which raises without an IPFS client). TypeScript reads `ipfs://` URIs through the public `https://ipfs.io/ipfs/` gateway with no configuration. HTTP(S) registration works without IPFS.

---

## Language parity

The two implementations diverge in four ways worth planning around:

1. **Validation is TypeScript-only.** See above — this is the largest functional gap.
2. **Defaults and config shapes differ.** `setA2A()` defaults to version `0.30` in Python and `0.3.0` in TypeScript; `subgraphUrl` and `ipfsUploader` are TypeScript-only constructor options, while `registryOverrides`, `indexingStore`, `embeddings` and the built-in IPFS providers are Python-only. `feeLimit` (TRON, in SUN) defaults to 120,000,000 in TypeScript and 10,000,000 in Python.
3. **Reading agent fields.** Python exposes twenty-one read-only properties on `Agent` (`name`, `description`, `endpoints`, `mcpTools`, `owners`, `operators`, `updatedAt`, and so on). TypeScript exposes only `agent.agentId`; everything else is read through `agent.toJSON()`.
4. **Helper coverage.** TypeScript also exposes `sdk.getTypedDataChainId()`; Python also exposes `sdk.chain_id()`, `sdk.registries()`, `sdk.set_chain()`, `sdk.isReadOnly` and `agent.registrationFile()` / `agent.toJson()`. Python adds ownership pre-checks (`isAgentOwner`, `canTransferAgent`), metadata accessors (`getMetadata`, `delMetadata`), `activate()` / `deactivate()`, and `saveToFile()`. TypeScript adds `updateOnChainMetadata()`, `uploadRegistrationFile()`, `submitRegister()`, `agent.approve()`, and the Registry read calls listed above (`getAgentURI`, `sdk.getMetadata`, `getApproved`, `isApprovedForAll`, `readAllFeedback`, `getClients`, `getLastIndex`, `getResponseCount`, and the validation reads).

:::note Two Python names are defined twice
In the Python `Agent` class, `transfer` and `trustModels` are each defined twice and the later definition wins. The effective `transfer` is `transfer(newOwnerAddress)` — the earlier four-argument form with `approve_operator` is unreachable — and the read-only `trustModels` property is shadowed by the setter of the same name, so `agent.trustModels` returns the bound method rather than the list. Read the trust models from `agent.registrationFile()` instead.
:::

---

## Legend

- ✅ = Implemented
- ❌ = Not implemented in this language
- ⚠️ = Present but not working in the current release
