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

The wallet determines which identity the AI assistant uses to perform on-chain operations. TRON MCP Server uses [Agent Wallet](../../../Agent-Wallet/Intro.md) for secure wallet management. If no wallet is configured, write tools will return an error prompting you to set up a wallet.

#### Agent Wallet

TRON MCP Server uses [Agent Wallet](../../../Agent-Wallet/Intro) for wallet management. Private keys are encrypted and stored on local disk, never exposed as plaintext in environment variables. Even if environment variables are leaked, the attacker still needs the encrypted keystore file to access funds. Agent Wallet also supports **multi-wallet management** and runtime wallet switching via the `select_wallet` tool.

| Feature | Description |
| :--- | :--- |
| Security Level | High (encrypted storage) |
| Multi-Wallet Support | Yes |
| Runtime Wallet Switching | Yes |
| Recommended For | All use cases |

> For installation, initialization, and detailed usage of Agent Wallet, see the [Agent-Wallet documentation](../../../Agent-Wallet/Intro).

First, install Agent Wallet:

```bash
npm install -g @bankofai/agent-wallet
```

Then, choose one of the following two options depending on your situation:

#### Option A: Generate a New Wallet (Recommended for New Users)

If you don't have an existing private key, use `agent-wallet start` to generate a new wallet with an encrypted keystore and master password:

```bash
agent-wallet start
```

Follow the interactive prompts to set your master password and generate a wallet. Once complete, the wallet is ready to use — **no additional environment variables are needed**. Agent Wallet will automatically manage the encrypted keystore.

#### Option B: Import an Existing Private Key

If you already have a private key you want to use, set it via the `AGENT_WALLET_PRIVATE_KEY` environment variable:

```bash
export AGENT_WALLET_PRIVATE_KEY=your_private_key_here
```

:::tip
To make this persist across terminal sessions, add it to your shell configuration file:

```bash
echo 'export AGENT_WALLET_PRIVATE_KEY=your_private_key' >> ~/.zshrc   # zsh (macOS default)
echo 'export AGENT_WALLET_PRIVATE_KEY=your_private_key' >> ~/.bashrc  # bash (Linux default)
source ~/.zshrc   # or source ~/.bashrc — takes effect immediately without restarting the terminal
```

Verify the environment variable is set:

```bash
echo $AGENT_WALLET_PRIVATE_KEY
```
:::

:::caution Legacy wallet options removed
As of v1.1.7, the legacy `TRON_PRIVATE_KEY` and `TRON_MNEMONIC` environment variables are no longer supported. All wallet management is now handled through Agent Wallet. If you were previously using plaintext private keys or mnemonics, please migrate to Agent Wallet for improved security.
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

Multiple deployment options are available. For most users, Option A is sufficient.

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

This will start a local stateless Streamable HTTP server (default: `http://localhost:3001/mcp`) that your MCP client can connect to. Each request is handled independently — no session state is maintained between requests.

You can customize the port and host via environment variables:

```bash
export MCP_PORT=3001      # default: 3001
export MCP_HOST=0.0.0.0   # default: 0.0.0.0
```

#### Option D: Docker Deployment

Run TRON MCP Server in a Docker container for isolated, reproducible environments. The Docker image runs in **read-only HTTP mode** by default.

```bash
# 1. Create a .env file for sensitive variables (never commit this file)
cat > .env.docker << 'EOF'
TRONGRID_API_KEY=your-key-here
EOF

# 2. Build the image
docker build -t mcp-server-tron .

# 3. Run the container with --env-file
docker run -d \
  -p 3001:3001 \
  -v $(pwd)/logs:/app/logs \
  --env-file .env.docker \
  mcp-server-tron
```

:::warning
Never pass API keys with `-e KEY=value` on the command line — the value will appear in shell history and `docker inspect` output. Always use `--env-file` with a file excluded from version control (add `.env.docker` to your `.gitignore`).
:::

The container exposes port 3001 and writes date-stamped logs to the mounted `logs/` directory. A health check endpoint is available at `http://localhost:3001/health`.

:::tip
The Docker image is designed for read-only cloud deployments. For local write operations (transfers, staking, etc.), use Option A or B with a configured Agent Wallet.
:::

#### Configuration Notes

If you're configuring an MCP client to point to your local server:

- **If running via npx or source**: Use the appropriate command in your MCP client's configuration (e.g., `command: npx` with `args: ["-y", "@bankofai/mcp-server-tron"]`)
- **If running in HTTP mode or Docker**: Point your client to `http://localhost:3001/mcp` via the HTTP URL configuration option

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
