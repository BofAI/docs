# FAQ

---

## About Agent-wallet

### What is Agent-wallet and what does it do?

Agent-wallet is a **signing-only SDK**. It does two things: stores private keys encrypted locally, and signs messages, transactions, and EIP-712 typed data locally.

It does NOT: connect to RPCs, query on-chain data, build transactions, broadcast transactions, or initiate transfers or payments autonomously.

This separation is intentional — signing is a highly sensitive operation that should be as simple, auditable, and dependency-free as possible. The more focused the SDK, the smaller the attack surface.

### How is it different from a regular blockchain wallet?

Regular wallets (like MetaMask or TronLink) are designed for human users — they typically include balance displays, transfer UIs, DApp connections, and require manual confirmation for every operation.

Agent-wallet is designed for programs. It exposes only a signing interface, with no UI, no network functionality, and no need for human interaction. The caller (an MCP Server, workflow code, etc.) is responsible for building transactions; Agent-wallet only signs and returns the result for the caller to broadcast.

### What about transfers and payments?

Agent-wallet does not implement transfers itself. A complete transfer flow requires three steps:

1. **Build the transaction** — The caller constructs an unsigned transaction object via TronGrid, Infura, or another RPC
2. **Sign** — The caller passes the unsigned transaction to Agent-wallet, which signs it locally and returns the result
3. **Broadcast** — The caller submits the signed transaction to the RPC for broadcasting

Agent-wallet only participates in step 2.

### What's the difference between the CLI and the SDK? Which should I use?

Both provide the same underlying capabilities, but for different scenarios:

- **CLI** is for manual operation — initializing wallets, managing keys, testing signatures by hand. Day-to-day key management is done through the CLI.
- **SDK** is for programmatic integration — calling the signing interface from your own code, such as inside an MCP Server or an automation script.

Most users will use both: the CLI to initialize and manage wallets, and the SDK to call signing in code.

---

## Local Mode vs. Static Mode

### When should I use local mode vs. static mode?

**Local mode** (set `AGENT_WALLET_PASSWORD`) is suitable when:
- You need to manage multiple wallets
- You want keys encrypted and persisted locally long-term
- You need to interact with wallets via the CLI

**Static mode** (set `AGENT_WALLET_PRIVATE_KEY` or `AGENT_WALLET_MNEMONIC`) is suitable when:
- You only need a single wallet
- You're in a CI/CD or one-off script scenario
- Keys are already managed by an external system and you don't want an additional local storage layer

### Can I use both modes at the same time?

No, you can't run both simultaneously — but you can switch at any time. `AGENT_WALLET_PASSWORD` takes precedence over the private key / mnemonic variables. `AGENT_WALLET_PRIVATE_KEY` and `AGENT_WALLET_MNEMONIC` cannot be set at the same time.

### How do I fill in the `network` parameter?

The `network` parameter determines which chain adapter to use:

| Value | Description |
| :--- | :--- |
| `eip155:1` | Ethereum Mainnet |
| `eip155:56` | BSC Mainnet |
| `eip155:137` | Polygon Mainnet |
| `eip155:8453` | Base Mainnet |
| `eip155:42161` | Arbitrum Mainnet |
| `tron:mainnet` | TRON Mainnet |
| `tron:nile` | TRON Nile Testnet |
| `tron:shasta` | TRON Shasta Testnet |

Any value with the `eip155:` prefix routes to the EVM adapter; `tron:` routes to the TRON adapter. The chain ID itself doesn't affect signing logic — it only determines which adapter handles the request.

---

## Security

### How are private keys stored?

In local mode, private keys are stored encrypted in **Keystore V3** format, using scrypt (N=262144, r=8, p=1) + AES-128-CTR + keccak256 MAC. This is the encryption standard widely used across the Ethereum ecosystem. The computational cost of scrypt is extremely high, making brute-force attacks effectively infeasible.

The master password is never stored. `master.json` holds only an encrypted sentinel value used to verify whether a password is correct — not the password itself.

### Will my keys ever be sent over the network?

Never. All signing operations are pure local computation. Agent-wallet makes no network calls. Your private keys never leave your machine.

### How should I protect my master password?

- Pass it via an environment variable (`AGENT_WALLET_PASSWORD`) rather than writing it in code
- Don't commit `.env` files containing passwords to Git — add them to `.gitignore`
- Use a password manager (such as 1Password or Bitwarden) to store your master password

### What if I forget my master password?

The master password cannot be recovered. Agent-wallet does not store it and provides no recovery mechanism.

If you forget your master password:
- If you have another backup of your private key (such as a mnemonic), run `agent-wallet reset` to wipe local data, then re-initialize and re-import your key
- If you have no other backup, the encrypted key files cannot be decrypted and access to those wallets is permanently lost

This is why we strongly recommend **backing up your private key or mnemonic separately** when creating a wallet — don't rely solely on Agent-wallet's local storage.

### Are keys used by AI agents safe?

That depends on how you configure them. Recommended practices:

- Create a dedicated wallet for the agent — don't use your personal primary wallet
- Fund that wallet with only the small amount the agent needs to operate
- Pass keys or passwords via environment variables — never hardcode them

This way, even if the agent behaves unexpectedly, losses are limited to the pre-funded amount.

---

## Cross-Language Compatibility

### Are key files interchangeable between Python and TypeScript?

Yes. Both implementations use the exact same Keystore V3 format. A key file created by Python can be read directly by TypeScript and vice versa. This means you can initialize a wallet with the CLI (TypeScript) and use the same keys directly in Python code.

### Do both language versions produce the same signatures?

Yes. The same private key signing the same data produces identical results in both Python and TypeScript. Address derivation rules and EIP-712 encoding logic are also identical.

### What are the API differences between the two language versions?

The interface design is a 1:1 correspondence. The main difference is naming convention: TypeScript uses camelCase (`signMessage`, `getActiveWallet`) while Python uses snake_case (`sign_message`, `get_active_wallet`). Behavior is otherwise identical.

---

## Relationship with Other Components

### What is the relationship between Agent-wallet and MCP Server?

MCP Servers (such as TRON MCP Server and BSC MCP Server) provide AI agents with on-chain operation tools — querying balances, building transactions, etc. When an MCP Server needs a signature, it calls Agent-wallet to sign, then handles broadcasting itself.

Agent-wallet is the signing backend for MCP Servers. MCP Servers do not directly handle private keys.

### What is the relationship between Agent-wallet and the x402 protocol?

x402 is an HTTP payment protocol. When an agent needs to complete an x402 payment, it must sign the PaymentPermit typed data (EIP-712 format). That signature is provided by Agent-wallet.

The x402 SDK handles building payment requests and managing the protocol flow; Agent-wallet handles signing. Their responsibilities are clearly separated — Agent-wallet has no knowledge of or concern for x402 business logic.

---

## Supported Chains

| Chain Type | Network Identifier | Specific Networks |
| :--- | :--- | :--- |
| EVM | `eip155:*` | Ethereum, BSC, Polygon, Base, Arbitrum, and any EVM-compatible chain |
| TRON | `tron:*` | TRON Mainnet, Nile Testnet, Shasta Testnet |

---

## Next Steps

- Initialize a wallet and start signing → [CLI Quick Start](./QuickStart.md)
- Integrate signing in your code → [SDK Quick Start](./SDKQuickStart.md)
- Understand the overall design → [Introduction](./Intro.md)
