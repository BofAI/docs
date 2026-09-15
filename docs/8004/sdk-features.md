---
title: 'SDK Feature Matrix'
description: 'Feature support matrix for the 8004 SDK across its TypeScript and Python implementations.'
---

# SDK Feature Matrix

This page tracks what the 8004 SDK actually implements, and where the TypeScript and Python implementations differ.

> **Two implementations, one repository.** `8004-sdk` ships a TypeScript package and a Python package from the same repository (`ts/` and `python/`). They target the same contracts and the same registration file format, but **they are not feature-identical** — the gaps are listed under [Language parity](#language-parity).
>
> **Current release:** `@bankofai/8004-sdk` **1.1.2** on npm; the Python package is not on PyPI, so install it from the repository's `main` branch. TypeScript requires **Node.js ≥ 20**; Python requires **Python ≥ 3.11**.

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
| `SubgraphClient` — indexed queries | ✅ | ✅ | Optional; requires a deployed subgraph |
| `AgentIndexer` | ✅ | ✅ | Python also exposes `refreshIndex` / `refreshAgentIndex` |

---

## Networks

Contract addresses ship with the SDK in `resource/chains.json` and are identical in both languages. The full list is on the [Contract Addresses](/8004/contract/) page.

| Ecosystem | Network name | CAIP-2 / chainId | EIP-712 chainId | Default endpoint |
|---|---|---|---|---|
| BSC | `mainnet` | `eip155:56` / `56` | `56` | `https://bsc-dataseed.binance.org` |
| BSC | `testnet` | `eip155:97` / `97` | `97` | `https://data-seed-prebsc-1-s1.binance.org:8545` |
| TRON | `mainnet` | — | `728126428` | `https://api.trongrid.io` |
| TRON | `nile` | — | `3448148188` | `https://nile.trongrid.io` |
| TRON | `shasta` | — | `2494104990` | `https://api.shasta.trongrid.io` |

Use the bare TRON names (`mainnet` / `nile` / `shasta`) — that is what the examples show. Both SDKs also accept a `tron:`-prefixed alias (`tron:nile`, and a bare `tron` resolves to Nile), stripping the prefix internally; these are the SDK's own aliases, not the CAIP-2 identifiers x402 uses. The EIP-712 chainId column is what the SDK puts in the typed-data domain when signing an agent-wallet change on TRON.

---

## Identity and Registration

| Feature | TypeScript | Python | API |
|---|:--:|:--:|---|
| Create an agent locally | ✅ | ✅ | `sdk.createAgent(...)` |
| Edit name / description / image | ✅ | ✅ | `agent.updateInfo({...})` — edits the local registration file; publish it with `updateRegistration()` |
| Register with an HTTP(S) URI | ✅ | ✅ | `agent.register(agentURI)` |
| Register via IPFS upload | ✅ | ✅ | `agent.registerIPFS()` |
| Update the on-chain URI | ✅ | ✅ | `agent.updateRegistration(...)` |
| Set the agent URI locally | ✅ | ✅ | `agent.setAgentUri(uri)` — local only, no transaction |
| Load an agent from chain by ID | ✅ | ✅ | `sdk.loadAgent(agentId)` — works without a subgraph |
| MCP / A2A / ENS endpoints | ✅ | ✅ | `setMCP()`, `setA2A()`, `setENS()` |
| Remove endpoints | ✅ | ✅ | `removeEndpoint()`, `removeEndpoints()` |
| OASF skills and domains | ✅ | ✅ | `addSkill()`, `addDomain()`, `removeSkill()`, `removeDomain()` — but stored differently: Python builds an `OASF` entry inside `services` (its `version` is `0.8`), TypeScript pushes the slugs into a flat `tags` array |
| Validate a slug against the OASF taxonomy | ❌ | ✅ | Python's `validate_oasf=True` checks the bundled taxonomy (136 skills, 204 domains); TypeScript accepts any string |
| Trust models | ✅ | ✅ | `setTrust(...)` — an object in TypeScript, keyword arguments in Python; both cover `reputation`, `cryptoEconomic`, `teeAttestation` |
| Replace the trust model list wholesale | ✅ | ✅ | TypeScript `agent.setTrustModels([...])` normalises the names; Python `agent.trustModels([...])` assigns them as given |
| Arbitrary metadata | ✅ | ✅ | `setMetadata()` |
| Read / delete a single metadata key | ❌ | ✅ | `agent.getMetadata()`, `agent.delMetadata()` |
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
| Search feedback | ✅ | ✅ | `sdk.searchFeedback(...)` — subgraph-backed |
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
| Read the owner | ❌ | ✅ | `sdk.getAgentOwner()` |
| Ownership / transfer pre-checks | ❌ | ✅ | `sdk.isAgentOwner()`, `sdk.canTransferAgent()` |

:::note Transfer clears the agent wallet
The Identity Registry clears `agentWallet` on every transfer, so `getAgentWallet()` returns the zero address afterwards. The new owner must call `setWallet()` again.
:::

---

## Discovery and Indexing

| Feature | TypeScript | Python | Requires subgraph |
|---|:--:|:--:|:--:|
| `sdk.loadAgent(agentId)` | ✅ | ✅ | No — reads the chain directly |
| `sdk.getAgent(agentId)` | ✅ | ✅ | Yes |
| `sdk.searchAgents(filters)` | ✅ | ✅ | Yes |
| `sdk.searchFeedback(filters)` | ✅ | ✅ | Yes |
| `sdk.getSubgraphClient(chainId?)` — Python `sdk.get_subgraph_client()` | ✅ | ✅ | — returns nothing when unconfigured |
| `sdk.refreshIndex()`, `sdk.refreshAgentIndex()` | ❌ | ✅ | Yes — same indexer as `getAgent` |

If no subgraph is configured, the index-backed calls are unavailable — `loadAgent()` remains the way to fetch an agent.

---

## Storage

The two languages configure storage completely differently.

**Python** ships built-in providers, selected on the `SDK(...)` constructor:

| Provider | Config value | Required option |
|---|---|---|
| Pinata | `ipfs="pinata"` | `pinataJwt` |
| Filecoin | `ipfs="filecoinPin"` | `filecoinPrivateKey` |
| Self-hosted IPFS node | `ipfs="node"` | `ipfsNodeUrl` |

**TypeScript** ships none of these. `SDKConfig` exposes a single `ipfsUploader?: (json: string) => Promise<string>` callback that you implement yourself; `registerIPFS()` throws `No ipfsUploader configured` without it.

IPFS is optional in both languages. It is needed only for `registerIPFS()` and for reading an `ipfs://` agent URI; HTTP(S) registration works without it.

---

## Language parity

The two implementations diverge in four ways worth planning around:

1. **Validation is TypeScript-only.** See above — this is the largest functional gap.
2. **Defaults and config shapes differ.** `setA2A()` defaults to version `0.30` in Python and `0.3.0` in TypeScript; `subgraphUrl` and `ipfsUploader` are TypeScript-only constructor options, while `registryOverrides`, `indexingStore` and the built-in IPFS providers are Python-only.
3. **Reading agent fields.** Python exposes twenty-one read-only properties on `Agent` (`name`, `description`, `endpoints`, `mcpTools`, `owners`, `operators`, `updatedAt`, and so on). TypeScript exposes only `agent.agentId`; everything else is read through `agent.toJSON()`.
4. **Helper coverage.** Python adds ownership pre-checks (`isAgentOwner`, `canTransferAgent`), metadata accessors (`getMetadata`, `delMetadata`), `activate()` / `deactivate()`, and `saveToFile()`. TypeScript adds `updateOnChainMetadata()`, `uploadRegistrationFile()` and `submitRegister()`.

:::note Two Python names are defined twice
In the Python `Agent` class, `transfer` and `trustModels` are each defined twice and the later definition wins. The effective `transfer` is `transfer(newOwnerAddress)` — the earlier four-argument form with `approve_operator` is unreachable — and the read-only `trustModels` property is shadowed by the setter of the same name, so `agent.trustModels` returns the bound method rather than the list. Read the trust models from `agent.registrationFile()` instead.
:::

---

## Legend

- ✅ = Implemented
- ❌ = Not implemented in this language
