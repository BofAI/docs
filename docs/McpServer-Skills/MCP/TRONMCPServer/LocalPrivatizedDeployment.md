import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
**Never** save private keys or mnemonic phrases directly in MCP configuration files (such as `claude_desktop_config.json` or `mcp.json`). These files are often unencrypted and could be accidentally shared or committed to Git. Always use system environment variables or encrypted wallets.
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

This is the most secure option. Private keys are encrypted and stored on local disk, never exposed as plaintext in environment variables. Even if environment variables are leaked, the attacker still needs the encrypted keystore file to access funds.

**Install and initialize Agent Wallet:**

```bash
# Install
npm install -g @bankofai/agent-wallet

# Create encrypted wallet
agent-wallet start
```
Agent Wallet also supports **multi-wallet management** — you can create multiple wallets and switch between them at runtime using the `select_wallet` tool, ideal for scenarios requiring operations across different accounts.

> For detailed installation and usage instructions, see the [agent-wallet documentation](https://github.com/BofAI/agent-wallet/blob/main/doc/getting-started.md).

**Set environment variables:**

```bash
# Add to ~/.zshrc or ~/.bashrc
export AGENT_WALLET_PASSWORD="<your-master-password>"

# Optional: specify custom wallet directory (default: ~/.agent-wallet)
export AGENT_WALLET_DIR="~/.agent-wallet"
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

---

### Step 4: Client Configuration

With environment variables set and installation done, now point your AI client to the local server.

#### Find Your Configuration File

| Application | Operating System | Configuration Path |
| :--- | :--- | :--- |
| **Claude Desktop** | macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| | Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Cursor** | All | Project root: `.cursor/mcp.json` |
| **Google Antigravity** | All | `~/.config/antigravity/mcp.json` |
| **Opencode** | All | `~/.config/opencode/mcp.json` |

#### Add Server Definition

<Tabs>
<TabItem value="npx" label="Option A: npx Run (Recommended)">

Run the latest version directly from npm. No need to clone any repository.

**Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": ["-y", "@bankofai/mcp-server-tron"],
      "env": {
        "AGENT_WALLET_PASSWORD": "YOUR_PASSWORD (Or set in system env)",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE (Or set in system env)"
      }
    }
  }
}
```

**Claude Code**:

```bash
# Basic
claude mcp add mcp-server-tron -- npx -y @bankofai/mcp-server-tron

# With environment variables
claude mcp add -e AGENT_WALLET_PASSWORD=xxx -e TRONGRID_API_KEY=xxx mcp-server-tron -- npx -y @bankofai/mcp-server-tron
```

**Cursor** (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": ["-y", "@bankofai/mcp-server-tron"],
      "env": {
        "AGENT_WALLET_PASSWORD": "YOUR_PASSWORD (Or set in system env)",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE (Or set in system env)"
      }
    }
  }
}
```

</TabItem>
<TabItem value="local" label="Option B: Local Source Code">

For developers running from a cloned repository.

**Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/mcp-server-tron/src/index.ts"],
      "env": {
        "AGENT_WALLET_PASSWORD": "YOUR_PASSWORD (Or set in system env)",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE (Or set in system env)"
      }
    }
  }
}
```

Replace the path with your actual cloned repository path.

**Cursor** (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/mcp-server-tron/src/index.ts"],
      "env": {
        "AGENT_WALLET_PASSWORD": "YOUR_PASSWORD (Or set in system env)",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE (Or set in system env)"
      }
    }
  }
}
```

</TabItem>
<TabItem value="http" label="Option C: Connect to Local HTTP">

If you started the server in HTTP mode (`npm run start:http`), connect via HTTP URL:

**Claude Code**:

```bash
claude mcp add --transport http mcp-server-tron http://localhost:3001/mcp
```

**Cursor** (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

</TabItem>
</Tabs>

:::tip About the `env` Section in Configuration
If you have already set environment variables in your system (via `~/.zshrc` or `~/.bashrc`), you can omit the `env` section from the configuration entirely — the server will automatically read system environment variables.

If your MCP client does not inherit system environment variables, you'll need to set them in the `env` section. In that case, **make sure the configuration file is never shared or committed to version control**.
:::

---

### Step 5: Verify Connection

After completing configuration, **fully exit and restart** your AI client, then try:

```
What is the address of my configured wallet?
```

If everything is working, the AI will call the `get_wallet_address` tool and return your wallet's Base58 and Hex addresses.

You can also try a testnet transfer (make sure you have test TRX on Nile):

```
Transfer 1 TRX to address TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL on the Nile testnet
```

:::info Getting Test TRX
You can get free test TRX for the Nile testnet from the TRON faucet. Visit [nile.tronscan.org](https://nile.tronscan.org) and look for the faucet option, or search for "TRON Nile faucet" online.
:::

---

## Next Steps

- Want to see detailed parameters and usage for each tool? → [Full Capability Listt](./ToolList.md)
- Encountering issues? → [FAQ](./FAQ.md)
