import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Local Privatized Deployment

## What is Local Privatized Deployment?

Local privatized deployment refers to running a complete instance of SUN MCP Server on your own computer. Unlike relying on third-party services, local deployment gives you full control over your wallet, network connection, and data privacy.

This mode is particularly suitable for scenarios that require executing DeFi operations. By configuring wallet private keys or mnemonics, you can unlock the following write operations:

- **Swap**: Automatic routing swaps using Universal Router
- **Liquidity Management**: Add and remove liquidity for SunSwap V2/V3/V4
- **Position Management**: Mint, increase, decrease positions and collect fees for SunSwap V3/V4
- **Contract Interaction**: Call arbitrary contracts via `sunswap_send_contract`

:::info
Without wallet configuration, SUN MCP Server will run in **read-only mode**, allowing querying on-chain data but unable to execute write operations.
:::

---

## Before You Start

### Environment Requirements

| Item | Requirement | Description |
|------|------|------|
| Node.js | >= 20.0.0 | v20.0.0 or higher ([download](https://nodejs.org/)) |
| npm | >= 10.0 | Usually installed with Node.js |
| Operating System | Linux / macOS / Windows | Cross-platform support |
| Disk Space | >= 100 MB | For dependency installation |
| Network | Internet Connection | Communication with TRON network |

### Security Principles

:::danger Important Security Tips
1. **Private Key Protection**: Never commit private keys to version control. Use `.env` files and add them to `.gitignore`.
2. **Permission Management**: Ensure `.env` file permissions are `600` (owner read-only).
3. **Multiple Wallet Mode Prohibited**: Configuring multiple wallet methods simultaneously will trigger an error. Only one method can be used at a time.
4. **Mnemonic Terminology**: In this document, "mnemonic" refers to BIP-39 standard 12-word or 24-word recovery phrases.
5. **Mainnet Caution**: Before using real funds on mainnet, thoroughly test on testnets (Nile, Shasta).
:::

---

## Installation Steps
### Step 1: Configure Wallet

The wallet determines which identity the AI assistant uses to perform on-chain operations. SUN MCP Server supports three wallet modes; if no wallet is configured, the server automatically runs in read-only mode.

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


### Step 2: Local Private Deployment

#### Option A: Run directly with npx (Recommended)

The simplest and quickest method, no installation or cloning needed.

**Command:**

```bash
npx -y @bankofai/sun-mcp-server
```

**Description:**
- `npx` automatically downloads the latest version of `@bankofai/sun-mcp-server`
- `-y` flag automatically confirms prompts
- First run may take a few seconds to download

**Run with environment variables:**

```bash
TRON_NETWORK=nile npx -y @bankofai/sun-mcp-server
```

#### Option B: Clone from Source

Suitable for development and custom modifications.

**Steps:**

```bash
# 1. Clone repository
git clone https://github.com/BofAI/sun-mcp-server.git
cd sun-mcp-server

# 2. Install dependencies
npm install

# 3. Build project
npm run build

# 4. Run server
npx tsx src/index.ts
```

**Or install globally:**

```bash
npm install -g @bankofai/sun-mcp-server
sun-mcp-server
```

---

### Step 3: Client Configuration

After configuration is complete, you need to add the connection definition of SUN MCP Server in your AI client.

#### Find Configuration File

Depending on your AI client, the configuration file location is as follows:

| Client | Configuration File Path |
|--------|-------------|
| **Claude Desktop** | `~/.claude/resources/mcp/servers.json` |
| **Cursor** | `~/.cursor/extensions/mcp/servers.json` |
| **Claude Code (CLI)** | `~/.claude/mcp_servers.json` or via environment variable |

#### Add Server Definition

Choose the tab corresponding to your deployment method:

<Tabs>
<TabItem value="npx-recommended" label="Option A: npx Run (Recommended)">

**Claude Desktop Configuration:**

Add to `~/.claude/resources/mcp/servers.json`:

```json
{
  "mcpServers": {
    "sun": {
      "command": "npx",
      "args": ["-y", "@bankofai/sun-mcp-server"],
      "env": {
        "AGENT_WALLET_PASSWORD": "your_secure_password",
        "AGENT_WALLET_DIR": "~/.agent-wallet",
        "TRON_NETWORK": "nile"
      }
    }
  }
}
```

**Claude Code**

```bash
# Basic
claude mcp add sun-mcp-server -- npx -y @bankofai/sun-mcp-server

# With environment variables
claude mcp add -e AGENT_WALLET_PASSWORD=xxx sun-mcp-server -- npx -y @bankofai/sun-mcp-server
```

**Cursor Configuration:**

Add to `~/.cursor/extensions/mcp/servers.json`:

```json
{
  "mcpServers": {
    "sun": {
      "command": "npx",
      "args": ["-y", "@bankofai/sun-mcp-server"],
      "env": {
        "TRON_NETWORK": "nile"
      }
    }
  }
}
```

</TabItem>

<TabItem value="source-local" label="Option B: Local Source Code">

For running from source code.

**Claude Desktop Configuration:**

Add to `~/.claude/resources/mcp/servers.json`:

```json
{
  "mcpServers": {
    "sun": {
      "command": "npx",
      "args": ["tsx", "/path/to/sun-mcp-server/src/index.ts"],
      "env": {
        "AGENT_WALLET_PASSWORD": "your_secure_password",
        "TRON_NETWORK": "nile"
      }
    }
  }
}
```

**Cursor Configuration:**

Add to `~/.cursor/extensions/mcp/servers.json`:

```json
{
  "mcpServers": {
    "sun": {
      "command": "npx",
      "args": ["tsx", "/path/to/sun-mcp-server/src/index.ts"],
      "env": {
        "TRON_NETWORK": "nile"
      }
    }
  }
}
```

</TabItem>

<TabItem value="http-mode" label="Option C: HTTP Mode">

Run SUN MCP Server in HTTP server mode, allowing remote connections.

**Start HTTP Server:**

```bash
sun-mcp-server --transport streamable-http --host 127.0.0.1 --port 8080 --mcpPath /mcp
```

**Claude Desktop Configuration:**

```json
{
  "mcpServers": {
    "sun": {
      "url": "http://127.0.0.1:8080/mcp"
    }
  }
}
```

**Cursor Configuration:**

```json
{
  "mcpServers": {
    "sun": {
      "url": "http://127.0.0.1:8080/mcp"
    }
  }
}
```

:::warning
HTTP mode is suitable for local development and testing. For remote deployment, use HTTPS and appropriate authentication.
:::

</TabItem>
</Tabs>

:::tip About Environment Variables
- **npx Run**: Environment variables are set in the `"env"` field of the configuration file, or exported directly in the terminal before running.
- **HTTP Mode**: When starting the HTTP server, environment variables should be exported before the startup command:

```bash
export TRON_NETWORK=nile
sun-mcp-server --transport streamable-http --host 127.0.0.1 --port 8080 --mcpPath /mcp
```

- **Restart Required**: After modifying configuration, you need to restart the AI client for changes to take effect.
:::

---

### Step 4: Verify Connection

After starting the AI client, you should be able to see the tool list of SUN MCP Server. Perform the following tests to confirm the configuration is correct:

#### Query Test

Try the following command in chat:

```
Check the current prices of USDT and TRX on SunSwap
```

Expect to receive the current block number.

#### If Testing on Testnet

If you configured to use Nile testnet:

```bash
TRON_NETWORK=nile
```

You can get test TRX from [TRON Nile Faucet](https://nile.trongrid.io/join), then try the following operations:

- Query test account balance
- Execute a test swap (if wallet is configured)
- Check transaction history

:::info Diagnostic Steps
If you encounter connection issues:

1. **Check Network Connection**: Ensure you can access TRON network endpoints
2. **View Logs**: When running the server, check console output for error messages
3. **Test Network**: Try switching to testnet (Nile) to rule out network issues
:::

---

## Next Steps

Now that you've successfully deployed SUN MCP Server! Next you can:

1. **View Full Capability List**: Browse [Full Capability List](./ToolList.md) to understand all available operations
2. **Resolve Common Issues**: Consult [Frequently Asked Questions](./FAQ.md) for help

:::success
Congratulations! You can now interact with the TRON blockchain through your AI client. Start exploring the unlimited possibilities of DeFi!
:::
