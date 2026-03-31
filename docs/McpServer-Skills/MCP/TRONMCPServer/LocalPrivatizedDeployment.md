# Local Private Deployment

## What is Local Private Deployment?

Local private deployment means running TRON MCP Server on your own machine, giving your AI assistant **full read and write access** to the TRON blockchain.

With the [official cloud service](./OfficialServerAccess.md), you can query all publicly available on-chain data. But once you need actual asset operations — sending TRX to an address, calling state-changing functions on smart contracts, staking TRX for energy, voting for Super Representatives — these operations require signing transactions with your private key. For security reasons, private keys can only be managed locally and are never uploaded to any remote service.

**The core purpose of local deployment is to run a complete MCP Server on your machine, securely holding wallet credentials, so the AI assistant can sign and broadcast transactions on your behalf.**

### What Can Local Deployment Do?

Compared to the read-only cloud service, local deployment unlocks full write operation capabilities:

- **Transfers**: Send TRX and TRC20 tokens
- **Smart Contracts**: Deploy new contracts, call state-changing functions, manage contract settings
- **Staking & Delegation**: Freeze TRX for energy/bandwidth, delegate resources to other addresses
- **Governance**: Vote for Super Representatives, create and approve proposals
- **Wallet Management**: Multi-wallet switching, message signing, account permission updates
- **Transaction Construction**: Create unsigned transactions, broadcast signed transactions

Of course, all read-only query capabilities are also fully retained.

---

## Before You Start

### Environment Requirements

| Requirement | Description |
| :--- | :--- |
| **Node.js** | v20.0.0 or higher ([download](https://nodejs.org/)) |
| **TronGrid API Key** | Optional but recommended ([apply here](https://www.trongrid.io/)) |

Verify your Node.js version:

```bash
node --version  # Should output v20.x.x or higher
```

### Security Principles

Before configuring your wallet, make sure to understand the following security principles:

:::danger Security Warning
**Never** save private keys or mnemonic phrases directly in MCP configuration files. These files are often unencrypted and could be accidentally shared or committed to Git. Always use system environment variables or encrypted wallets.
:::

---
## Installation Steps
### Step 1: Configure Wallet

The wallet determines which identity the AI assistant uses to perform on-chain operations. TRON MCP Server supports three wallet modes; if no wallet is configured, the server automatically runs in read-only mode.

#### There are three wallet options — choose based on your needs

| Feature | Agent Wallet | Private Key | Mnemonic |
| :--- | :--- | :--- | :--- |
| Security Level | High (encrypted storage) | Low (plaintext) | Low (plaintext) |
| Multi-Wallet Support | Yes | No | No |
| Runtime Wallet Switching | Yes | No | No |
| Setup Complexity | Medium | Simple | Simple |
| Recommended For | Production, significant funds | Development, small amounts | Development, small amounts |

#### Option 1: Agent Wallet (Recommended)

This is the most secure option. Private keys are encrypted and stored on local disk, never exposed as plaintext in environment variables. Even if environment variables are leaked, the attacker still needs the encrypted keystore file to access funds. Agent Wallet also supports **multi-wallet management** and runtime wallet switching via the `select_wallet` tool.

> For installation, initialization, and detailed usage of Agent Wallet, see the [Agent-Wallet documentation](../../../Agent-Wallet/Intro).

**Set environment variables after initializing Agent Wallet:**

```bash
# Add to ~/.zshrc or ~/.bashrc
export AGENT_WALLET_PASSWORD='<your-master-password>'

# Optional: specify custom wallet directory (default: ~/.agent-wallet)
export AGENT_WALLET_DIR="$HOME/.agent-wallet"
```



#### Option 2: Private Key

Provide the private key directly via environment variable. Simplest setup, but lower security.

```bash
# Add to ~/.zshrc or ~/.bashrc
export TRON_PRIVATE_KEY="<your-private-key-hex>"
```

The private key can be in hex format with or without the `0x` prefix.

:::warning
Using a plaintext private key in environment variables carries a **real risk of fund theft** — environment variables can be leaked via shell history, process listings (`ps aux`), or log files. **Only keep small amounts of funds** in wallets configured this way.
:::

#### Option 3: Mnemonic Phrase

Use a BIP-39 mnemonic phrase for HD wallet derivation.

```bash
# Add to ~/.zshrc or ~/.bashrc
export TRON_MNEMONIC="word1 word2 word3 ... word12"

# Optional: specify HD wallet derivation index (default: 0)
# Derivation path: m/44'/195'/0'/0/{index}
export TRON_ACCOUNT_INDEX="0"
```

:::warning
Same security risks as the private key option. Mnemonic phrases stored in plaintext are vulnerable to exposure. Use this only for development/testing wallets with small balances.
:::



---

### Step 2: Configure Network (Optional)

#### TronGrid API Key

The TRON Mainnet public RPC has strict rate limits. For frequent on-chain queries, it is strongly recommended to configure a free TronGrid API Key:

```bash
# Add to ~/.zshrc or ~/.bashrc
export TRONGRID_API_KEY="<your-TronGrid-API-Key>"
```

Register for free at [trongrid.io](https://www.trongrid.io/). The server still works without this, but may encounter rate-limiting errors during high-frequency operations. Testnet networks (Nile, Shasta) are less affected by rate limits.


---

### Step 3: Local Private Deployment

Two options are available. For most users, Option A is sufficient.

#### Option A: Run directly with npx (Recommended)

No need to clone the repository — run the latest version directly via `npx`. This is also the default method used in the MCP client configuration examples below.

```bash
npx -y @bankofai/mcp-server-tron
```

#### Option B: Clone from Source

For developers who need to modify the source code or contribute:

```bash
git clone https://github.com/BofAI/mcp-server-tron.git
cd mcp-server-tron
npm install
npm run build
```

#### Option C: Run in HTTP Mode

Start the server in HTTP mode, then connect your MCP client via the HTTP endpoint:

```bash
npm run start:http
```

This will start a local HTTP server (default: `http://localhost:3001/mcp`) that your MCP client can connect to.

#### Configuration Notes

If you're configuring an MCP client to point to your local server:

- **If running via npx or source**: Use the appropriate command in your MCP client's configuration (e.g., `command: npx` with `args: ["-y", "@bankofai/mcp-server-tron"]`)
- **If running in HTTP mode**: Point your client to `http://localhost:3001/mcp` via the HTTP URL configuration option

If your MCP client does not inherit system environment variables, you'll need to configure them explicitly in the client settings. **Make sure any configuration file storing credentials is never shared or committed to version control**.

---

### Step 4: Verify Connection

After completing configuration, **fully exit and restart** your AI client, then try:

```
What is the address of my configured wallet?
```

If everything is working, the AI will call the `get_wallet_address` tool and return your wallet's Base58 and Hex addresses.

You can also try a testnet transfer (make sure you have test TRX on Nile):

```
Transfer 1 TRX to address TNPee...xxxxx on the Nile testnet
```

:::info Getting Test TRX
You can get free test TRX for the Nile testnet from the TRON faucet. Visit [nile.tronscan.org](https://nile.tronscan.org) and look for the faucet option, or search for "TRON Nile faucet" online.
:::

---

## Next Steps

- Want to see detailed parameters and usage for each tool? → [Full Capability List](./ToolList.md)
- Encountering issues? → [FAQ](./FAQ.md)
