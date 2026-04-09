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

The wallet determines which identity the AI assistant uses to perform on-chain operations. SUN MCP Server uses [Agent Wallet](../../../Agent-Wallet/Intro.md) for secure wallet management. If no wallet is configured, the server automatically runs in read-only mode.

#### Agent Wallet

SUN MCP Server uses [Agent Wallet](../../../Agent-Wallet/Intro.md) for wallet management. Private keys are encrypted and stored on local disk, never exposed as plaintext in environment variables. Even if environment variables are leaked, the attacker still needs the encrypted keystore file to access funds. Agent Wallet also supports **multi-wallet management** and runtime wallet switching via the `select_wallet` tool.

| Feature | Description |
| :--- | :--- |
| Security Level | High (encrypted storage) |
| Multi-Wallet Support | Yes |
| Runtime Wallet Switching | Yes |
| Recommended For | All use cases |

> For installation, initialization, and detailed usage of Agent Wallet, see the [Agent-Wallet documentation](../../../Agent-Wallet/Intro.md).

**Set environment variables after initializing Agent Wallet:**

```bash
# Add to ~/.zshrc or ~/.bashrc
export AGENT_WALLET_PASSWORD='<your-master-password>'

# Optional: specify custom wallet directory (default: ~/.agent-wallet)
export AGENT_WALLET_DIR="$HOME/.agent-wallet"
```

:::caution Legacy wallet options removed
The legacy `TRON_PRIVATE_KEY` and `TRON_MNEMONIC` environment variables are no longer supported. All wallet management is now handled through Agent Wallet. If you were previously using plaintext private keys or mnemonics, please migrate to Agent Wallet for improved security.
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

### Step 3: Server Running Methods

After wallet configuration is complete, you can run the server using one of the following methods:

### Option A: Run directly with npx (Recommended)

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

### Option B: Clone from Source

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

### Option C: HTTP Mode

Run SUN MCP Server in HTTP server mode, allowing remote connections.

**Start HTTP Server:**

```bash
sun-mcp-server --transport streamable-http --host 127.0.0.1 --port 8080 --mcpPath /mcp
```

:::warning
HTTP mode is suitable for local development and testing. For remote deployment, use HTTPS and appropriate authentication.
:::

:::tip About Environment Variables
- **npx Run**: Export environment variables directly in the terminal before running the command.
- **HTTP Mode**: When starting the HTTP server, environment variables should be exported before the startup command:

```bash
export TRON_NETWORK=nile
sun-mcp-server --transport streamable-http --host 127.0.0.1 --port 8080 --mcpPath /mcp
```

- **Server Configuration**: Once the server is running, configure your MCP client to connect to it.
:::

---

### Step 4: Client Configuration

After the server is running, you need to configure your MCP client to connect to it. Refer to your MCP client's documentation for configuration instructions. The server will be accessible at one of the following:

- **npx/Local Build**: Typically runs as a subprocess managed by your client
- **HTTP Mode**: `http://127.0.0.1:8080/mcp` (or the host/port you specified)

---

### Step 5: Verify Connection

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
