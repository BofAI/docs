# FAQ & Troubleshooting

When you encounter problems, check here first. Organized by the order you're most likely to encounter them: connection issues (most common), then authentication and keys, on-chain errors, AI behavior issues, and finally some general questions.

---

## Connection Issues

Connection issues usually occur during the initial configuration phase. If your AI client can't recognize the TRON tools, this is likely where the problem is.

### "Failed to connect to MCP server" in your MCP client

This is the most common issue. Troubleshoot in the following order:

1. **Check Node.js version**. What is declared depends on how you run the server:
   - **`npx -y @bankofai/mcp-server-tron`** runs the npm package `1.1.7`, which declares Node.js `>=20`.
   - **A source checkout** of `main` (tag `v1.1.8`) requires 22.23.4+ (22.x) or 24.22.1+ (24.x). Its `package.json` still says `1.1.7`, so the server reports version `1.1.7` there too.

   Either way, we recommend the October 2026 security releases, 22.23.4+ or 24.22.1+:
   ```bash
   node --version  # recommended: v22.23.4+ or v24.22.1+
   ```
   If your version is below what your route declares, upgrade Node.js first.

2. **Check that npx is available**. Run `npx --version` in your terminal. If the command is not found, your Node.js installation is incomplete — reinstall it.

3. **Verify config file format**. Your MCP client configuration file must be valid JSON. Common mistakes include trailing commas, missing quotes, or mismatched brackets. Validate your configuration file using a JSON validator.

4. **Fully quit and restart**. Closing the window is not the same as quitting — you need to fully exit your MCP client, then reopen it.

5. **Check logs**. If none of the above resolves the issue, check your MCP client's log files for entries containing "mcp" or "tron".

### "Connection refused" in HTTP mode

When using HTTP mode (`npx -y @bankofai/mcp-server-tron --http`, or `npm run start:http` from a source checkout) and clients cannot connect, the usual causes are:

1. **Server is not running**. Confirm first:
   ```bash
   curl http://localhost:3001/health
   ```
   If it returns "Connection refused", the server process is not started or has exited.

2. **Port is occupied**. Another program may be using port 3001:
   ```bash
   lsof -i :3001
   ```
   If there's a conflict, switch to a different port via environment variable:
   ```bash
   export MCP_PORT=3002
   ```

3. **Firewall blocking**. If you're accessing the local HTTP service from another machine, check whether the firewall allows inbound connections on that port.

### Write tools appear but return a wallet error {#write-tools-wallet-error}

As of v1.1.7, write tools (transfers, staking, etc.) are always visible in the AI's tool list, but wallet availability is checked at execution time. If you call a write tool without a usable wallet, the tool returns an error such as `Error transferring TRX: <reason>`, where `<reason>` comes from Agent Wallet — see [Wallet error messages](#wallet-error-messages) below for what each one means.

To enable write operations, set up Agent Wallet **2.x**, the version this server depends on:

```bash
npm install -g @bankofai/agent-wallet@2
agent-wallet start local_secure --save-runtime-secrets
```

- `--save-runtime-secrets` writes your master password to `~/.agent-wallet/runtime_secrets.json`; alternatively, set the `AGENT_WALLET_PASSWORD` environment variable to it
- Optionally set `AGENT_WALLET_DIR` if using a custom wallet directory

The [Agent-Wallet documentation](../../../Agent-Wallet/Intro.md) describes Agent Wallet 3.x, which this server does not use yet — use the 2.x commands above.

After configuring, restart your AI client. For detailed instructions, see [Local Private Deployment](./LocalPrivatizedDeployment.md).

:::info
If you're connected via the official cloud service or using `--readonly` mode, write tools will not appear at all — this is expected behavior.
:::

---

## Authentication & Key Issues

### Wallet error messages {#wallet-error-messages}

TRON MCP Server uses [Agent Wallet](../../../Agent-Wallet/Intro.md) for all wallet management. When a write tool (or `get_wallet_address` / `sign_message`) cannot get a wallet, the error text tells you which case you hit:

| Error text | Meaning |
| :--- | :--- |
| `resolve_wallet could not find a wallet source in config or env` | No wallet at all: no password resolves, the wallet directory holds no wallets, and none of `AGENT_WALLET_PRIVATE_KEY`, `TRON_PRIVATE_KEY`, `AGENT_WALLET_MNEMONIC` or `TRON_MNEMONIC` is set. |
| `Password required for local_secure wallets` | Wallets exist in the wallet directory, but no password resolved — neither `runtime_secrets.json` nor `AGENT_WALLET_PASSWORD`. |
| `No active wallet set.` | A password resolved, but the wallet directory holds no wallets. In this case the private-key and mnemonic variables are ignored — create or import a wallet with Agent Wallet, or remove the password so the env-var path is used. |
| `MAC mismatch — wrong password or corrupted file` | A password was found but does not match the keystore (see the next section). |
| `Wallet not configured.` | Agent Wallet could not even load its configuration — for example a malformed `runtime_secrets.json` or `wallets_config.json`. With agent-wallet 2.3.x (what a source checkout's `package-lock.json` installs), setting both a private key and a mnemonic also ends here, when the env-var path is reached (see below the table). |
| `Provide only one of AGENT_WALLET_PRIVATE_KEY or AGENT_WALLET_MNEMONIC` | A private key (`AGENT_WALLET_PRIVATE_KEY` or `TRON_PRIVATE_KEY`) and a mnemonic (`AGENT_WALLET_MNEMONIC` or `TRON_MNEMONIC`) are both set and the env-var path is reached, with agent-wallet 2.4.0 — what `npx -y @bankofai/mcp-server-tron` (npm `1.1.7`, dependency `^2.3.0`) installs today. The server passes the text through, e.g. `Error transferring TRX: Provide only one of …`, or `Error: Provide only one of …` from `get_wallet_address`. Unset one of the two. |

Both agent-wallet versions read the private key from `AGENT_WALLET_PRIVATE_KEY` or its alias `TRON_PRIVATE_KEY`, and the mnemonic from `AGENT_WALLET_MNEMONIC` or its alias `TRON_MNEMONIC`. They read these env vars only on the env-var path — when no password resolves **and** the wallet directory holds no wallets. Otherwise the variables are silently ignored, and neither of the both-set errors above can occur.

To resolve the first two:

1. **No wallet yet: install and initialize Agent Wallet 2.x** with `npm install -g @bankofai/agent-wallet@2`, then `agent-wallet start local_secure --save-runtime-secrets`, which also saves the master password to `runtime_secrets.json`. (The [Agent-Wallet documentation](../../../Agent-Wallet/Intro.md) describes 3.x, which this server does not use yet.)
2. **Wallets already exist: make the password available** — export it:
   ```bash
   export AGENT_WALLET_PASSWORD='<your-master-password>'
   ```
   or save it to `runtime_secrets.json` as described in [Local Private Deployment](./LocalPrivatizedDeployment.md) (Path 1). Re-running `agent-wallet start` does not help: with wallets present it only offers `add`, which creates a new wallet and makes it the active one, or `exit`, which saves nothing.
3. **Restart your AI client** for the changes to take effect. The server resolves the wallet source once and caches it, so a restart is required after changing wallet settings.

### "MAC mismatch — wrong password or corrupted file" error

The password the server resolved (from `runtime_secrets.json` or `AGENT_WALLET_PASSWORD`) must exactly match the master password you set when you ran `agent-wallet start`. Verify that the wallet directory exists (`ls ~/.agent-wallet/`) and that `AGENT_WALLET_DIR` points to the correct path if you used a custom directory.

If the password is lost, you'll need to re-initialize. **Warning: this wipes all wallets and keys — ensure funds are moved or mnemonics backed up before proceeding.** Run `agent-wallet reset` to wipe and start over. In agent-wallet 2.x (what this server uses), `reset` deletes every file in `~/.agent-wallet` — `master.json`, `wallets_config.json`, `runtime_secrets.json` and the `secret_*.json` keystores. The Agent-Wallet pages describe 3.x, whose `reset` removes only `wallets_config.json`.

### TronGrid API Key not working

The API Key is configured but requests are still rate-limited — check the following:

1. **Is the variable name correct?** The correct name is `TRONGRID_API_KEY` (not `TRON_API_KEY` or other variants).

2. **Is the Key still active?** Log into [trongrid.io](https://www.trongrid.io/) to confirm your API Key is active.

3. **The key is read from the environment, not from a request header.** The server reads `TRONGRID_API_KEY` from its own process environment and forwards it upstream as `TRON-PRO-API-KEY`; it does not inspect incoming request headers at all. A per-request API key against the hosted cloud service is therefore not possible — run a local or self-hosted instance with `TRONGRID_API_KEY` set if you need your own quota.

---

## On-Chain Errors

These errors occur during transaction execution and are usually related to on-chain resources or contract logic.

### "Bandwidth not sufficient" error

Every TRON transaction consumes Bandwidth. If the account has neither enough staked Bandwidth nor enough TRX to burn for Bandwidth, the transaction fails.

**How to resolve:**
- Have the AI check your Bandwidth first: "Check the bandwidth resources of my address"
- Stake some TRX for Bandwidth: "Stake 100 TRX for Bandwidth"
- Or ensure the account has enough TRX balance — even without staked Bandwidth, the system will automatically burn TRX to pay for it

### "Energy not sufficient" error

Interacting with smart contracts (including TRC20 token transfers) requires Energy. If staked Energy is insufficient, TRX is burned to cover the cost; if TRX is also insufficient, the transaction fails.

**How to resolve:**
- Estimate cost first: "Estimate how much Energy is needed to call this contract's transfer function"
- Stake TRX for Energy: "Stake 500 TRX for Energy"
- `write_contract` has no fee-limit parameter, so make sure the wallet holds enough TRX to burn for the Energy shortfall. Only `deploy_contract` accepts a `feeLimit` (in Sun, default 1,000,000,000 = 1000 TRX), which you can ask the AI to raise for a large deployment

### "Account not found" or "Account not activated"

New TRON addresses must be "activated" before they can be used. An address is automatically activated when it receives its first TRX transfer.

**How to resolve:**
- Send a small amount of TRX to the address (0.1 TRX is enough)
- Or use the `create_account` tool to explicitly activate it

### Transaction shows "REVERT" status

The transaction was included in a block but execution failed, meaning a `require()` condition in the smart contract code was not met.

**How to diagnose:**
1. Have the AI diagnose: "Diagnose why transaction [hash] reverted"
2. Common causes include: insufficient token balance or approval amount, calling a function without the required permission, passing invalid parameters, or a contract-specific business logic condition not met
3. Use `read_contract` to query the contract state and understand what preconditions need to be met

---

## AI Behavior Issues

These issues relate to the behavior of the AI model itself, not bugs in TRON MCP Server.

### AI constructs an invalid address

AI models sometimes "hallucinate" TRON addresses that are correctly formatted but don't actually exist. TRON MCP Server has built-in address validation — most tools that accept addresses will automatically reject invalid ones.

**Prevention:**
- Always provide exact addresses by copy-pasting; don't describe addresses and let the AI guess
- When uncertain, use `validate_address` to verify: "Validate this address TXyz..."

### AI tries to call a tool that doesn't exist

The AI may confuse TRON MCP Server capabilities with other blockchain tools. If it tries to call a nonexistent tool, it will receive an error and automatically try using the correct one.

If this keeps happening, remind the AI: "Please only use tools provided by TRON MCP Server", or consult the [Full Capability List](./ToolList.md) to confirm available tools.

### Responses are slow

Several common causes and solutions:

- **No TronGrid API Key**: Without `TRONGRID_API_KEY`, Mainnet requests go to the BANK OF AI fallback endpoint `https://hptg.bankofai.io` on a source checkout from `v1.1.8`, and to `https://api.trongrid.io` without a key on npm `1.1.7` (what `npx` runs). Setting a free API Key sends them to `https://api.trongrid.io` under your own quota in both versions
- **Complex multi-tool workflows**: Some operations (like full wallet analysis) require multiple sequential calls — waiting is normal
- **Use testnet for development**: Nile and Shasta testnets are usually faster
- **Be more specific in prompts**: Reduce the AI's exploratory calls — tell it directly which tool to use and which network to query

---

## General Questions

### What's the difference between Mainnet, Nile, and Shasta?

| Network | Purpose | Real Value | How to Get Tokens |
| :--- | :--- | :--- | :--- |
| **Mainnet** | Production environment | Yes (real TRX) | Buy on exchanges |
| **Nile** | Development testing (recommended) | No (test tokens) | Free from faucet |
| **Shasta** | Development testing | No (test tokens) | Free from faucet |

Always develop and test on Nile first, then execute on Mainnet after confirming everything works.

### Can I use multiple TRON MCP Servers simultaneously?

Yes. Define multiple MCP Server entries in your MCP client configuration — for example, one connecting to the mainnet cloud service (read-only) and another connecting to a local testnet deployment (with wallet). Configure both servers with different names in your client's MCP configuration.

### How do I update to the latest version?

If you're using the `npx` method, `npx -y @bankofai/mcp-server-tron` does not always fetch the latest release: it can run a copy that is already installed — globally, in the current project, or, on older npm versions, in the npx cache. To always get the latest published version, ask for it explicitly, for example in your MCP client configuration:

```bash
npx -y @bankofai/mcp-server-tron@latest
```

To clear the npx cache instead, delete `~/.npm/_npx` (and, if needed, run `npm cache clean --force`). The third-party `clear-npx-cache` package does the same:

```bash
npx clear-npx-cache
```

If you cloned from source:

```bash
cd mcp-server-tron
git pull
npm install
npm run build
```

### What MCP protocol version is supported?

The protocol version is negotiated by `@modelcontextprotocol/sdk`, which the server depends on as `^1.22.0`; a source checkout's `package-lock.json` pins 1.27.1. MCP protocol version **2025-11-25** requires SDK 1.24.1 or later — SDK 1.22.0–1.24.0 top out at 2025-06-18. Older protocol versions requested by the client are also accepted.

