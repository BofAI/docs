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
| **Node.js** | Recommended: 22.23.4+ (22.x) or 24.22.1+ (24.x), the October 2026 security releases ([download](https://nodejs.org/)). A source checkout of `main` (tag `v1.1.8`, Option B below) requires this range (its `package.json` still says `1.1.7`, so the server reports version `1.1.7`); the npm package `1.1.7` that `npx` runs (Option A) declares `>=20`. |
| **TronGrid API Key** | Optional but recommended ([apply here](https://www.trongrid.io/)) |

Verify your Node.js version:

```bash
node --version  # recommended: v22.23.4+ or v24.22.1+
```

The requirement is the `engines` field in `package.json`: on a source checkout, `npm install` under another Node.js version prints an `EBADENGINE` warning but still installs, and the server does not check the Node.js version at runtime.

### Security Principles

Before configuring your wallet, make sure to understand the following security principles:

:::danger Security Warning
**Never** save private keys or mnemonic phrases directly in MCP configuration files. These files are often unencrypted and could be accidentally shared or committed to Git. Always use system environment variables or encrypted wallets.
:::

---
## Installation Steps
### Step 1: Configure Wallet

The wallet determines which identity the AI assistant uses to perform on-chain operations. TRON MCP Server uses [Agent Wallet](../../../Agent-Wallet/Intro.md) for secure wallet management. If no wallet is configured, write tools return a wallet error when called (see [FAQ](./FAQ.md#write-tools-wallet-error)).

#### Agent Wallet

TRON MCP Server uses [Agent Wallet](../../../Agent-Wallet/Intro.md) for wallet management. Private keys are encrypted and stored on local disk, never exposed as plaintext in environment variables. Even if environment variables are leaked, the attacker still needs the encrypted keystore file to access funds. Agent Wallet also supports **multi-wallet management** and runtime wallet switching via the `select_wallet` tool.

| Feature | Description |
| :--- | :--- |
| Security Level | High (encrypted storage) |
| Multi-Wallet Support | Yes |
| Runtime Wallet Switching | Yes |
| Recommended For | All use cases |

> TRON MCP Server depends on Agent Wallet **2.x** (`@bankofai/agent-wallet ^2.3.0`). The [Agent-Wallet documentation](../../../Agent-Wallet/Intro.md) describes 3.x, which this server does not use yet — follow the 2.x commands on this page.

First, install the Agent Wallet 2.x CLI:

```bash
npm install -g @bankofai/agent-wallet@2
```

The `@2` pin installs the latest 2.x release (2.4.0 at the time of writing). Without it, npm installs 3.x, which has no `local_secure` wallets, no master password, and no `--save-runtime-secrets`, so the steps below would not work.

Then, choose one of the following two paths depending on your situation:

#### Path 1: Generate a New Wallet (Recommended for New Users)

If you don't have an existing private key, use `agent-wallet start local_secure` to generate a new wallet with an encrypted keystore and master password:

```bash
agent-wallet start local_secure --save-runtime-secrets
```

Follow the interactive prompts to set your master password and generate a wallet. Agent Wallet manages the encrypted keystore for you, but the server still needs the password at signing time. `--save-runtime-secrets` writes it to `~/.agent-wallet/runtime_secrets.json`; without the flag it is not persisted, and you must instead export `AGENT_WALLET_PASSWORD` in the environment the MCP server runs in.

If you already ran `agent-wallet start` without the flag, do not run it again to fix this: with wallets present it only offers `add`, which creates a new wallet and makes it the active one, or `exit`, which saves nothing. Export `AGENT_WALLET_PASSWORD`, or save the password with one of these commands:

- `agent-wallet sign msg hello -n tron --save-runtime-secrets` — asks for the password, saves it, then signs a test message with the active wallet. It saves the password before checking it, so if it prints `Wrong password`, delete `~/.agent-wallet/runtime_secrets.json` and run it again.
- `agent-wallet add local_secure --save-runtime-secrets` — checks the password before saving it, but also creates an additional wallet (the active wallet stays the same).

Without a saved or exported password, unlocking a `local_secure` wallet fails when a write tool is called. Use `AGENT_WALLET_DIR` if your keystore lives outside `~/.agent-wallet`.

#### Path 2: Import an Existing Private Key

If you already have a private key you want to use, set it via the `AGENT_WALLET_PRIVATE_KEY` environment variable (Agent Wallet also accepts the alias `TRON_PRIVATE_KEY`, and a mnemonic via `AGENT_WALLET_MNEMONIC` or `TRON_MNEMONIC`). Note the precedence: the env-var path is only reached when no password resolves (neither `runtime_secrets.json` nor `AGENT_WALLET_PASSWORD`) **and** the wallet directory holds no wallets. If you already ran Path 1, saved a runtime password, or ran the Openclaw installer, the keystore path wins and these variables are silently ignored.

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



---

### Step 2: Configure Network (Optional)

#### TronGrid API Key

On a source checkout from `v1.1.8`, the API Key also decides which Mainnet endpoint the server talks to. For frequent on-chain queries, it is recommended to configure a free TronGrid API Key:

```bash
# Add to ~/.zshrc or ~/.bashrc
export TRONGRID_API_KEY="<your-TronGrid-API-Key>"
```

Register for free at [trongrid.io](https://www.trongrid.io/). How the variable affects each network (the only difference between versions is Mainnet without a key):

| Network | `TRONGRID_API_KEY` set | `TRONGRID_API_KEY` not set |
| :--- | :--- | :--- |
| **Mainnet** | `https://api.trongrid.io`, with your key sent as `TRON-PRO-API-KEY` (your own quota) | Source checkout from `v1.1.8`: falls back to the BANK OF AI endpoint `https://hptg.bankofai.io`. npm `1.1.7` (what `npx` runs): `https://api.trongrid.io` without a key |
| **Nile** | `https://nile.trongrid.io` (key header also sent) | `https://nile.trongrid.io` |
| **Shasta** | `https://api.shasta.trongrid.io` (key header also sent) | `https://api.shasta.trongrid.io` |

The server works without a key, but keyless requests to TronGrid (Mainnet on npm `1.1.7`, and Nile / Shasta) share TronGrid's public rate limits, so high-frequency use can hit rate-limit errors. Set one if you want Mainnet traffic to go to TronGrid under your own quota.


---

### Step 3: Local Private Deployment

Multiple deployment options are available. For most users, Option A is sufficient.

#### Option A: Run directly with npx (Recommended)

No need to clone the repository — run the latest version directly via `npx`. This is also the command used in the [Configuration Notes](#configuration-notes) below.

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

Start the server in HTTP mode, then connect your MCP client via the HTTP endpoint. From the published package, pass the `--http` flag — no clone needed:

```bash
npx -y @bankofai/mcp-server-tron --http
```

:::caution `-h` starts HTTP mode — it does not print help
The launcher treats `-h` as the short alias for `--http`, and `-r` as the short alias for `--readonly`. There is no help flag; typing `-h` starts the HTTP server.
:::

From a source checkout (Option B) you can use the script instead:

```bash
npm run start:http
```

This will start a local stateless Streamable HTTP server (default: `http://localhost:3001/mcp`) that your MCP client can connect to. `GET` and `DELETE` on `/mcp` return `405` (SSE is not supported), and `GET /` returns server information. Each request is handled independently — no session state is maintained between requests.

You can customize the port and host via environment variables:

```bash
export MCP_PORT=3001      # default: 3001
export MCP_HOST=0.0.0.0   # default: 0.0.0.0
```

The Docker and source-checkout start scripts also read `MCP_LOG_DIR` (default `/app/logs` in the container, `./logs` from a checkout). The published npm package ships only `build/`, `bin/`, `package.json`, `README.md` and `LICENSE`, so that variable does not apply to the `npx` route above.

#### Option D: Docker Deployment

Run TRON MCP Server in a Docker container for isolated, reproducible environments. The Docker image always runs in **read-only HTTP mode**: `docker-start.sh` passes `--readonly`, and there is no switch to turn it off.

```bash
# 1. Create a .env file for sensitive variables (never commit this file)
cat > .env.docker << 'EOF'
TRONGRID_API_KEY=your-key-here
EOF

# 2. Build the image (requires the source checkout from Option B —
#    the Dockerfile is not part of the published npm package)
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
The Docker image is designed for read-only cloud deployments. For local write operations (transfers, staking, etc.), use Option A, B, or C with a configured Agent Wallet.
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
