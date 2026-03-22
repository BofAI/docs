# FAQ & Troubleshooting

When you encounter problems, check here first. Organized by the order you're most likely to encounter them: connection issues (most common), then authentication and keys, on-chain errors, AI behavior issues, and finally some general questions.

---

## Connection Issues

Connection issues usually occur during the initial configuration phase. If your AI client can't recognize the TRON tools, this is likely where the problem is.

### "Failed to connect to MCP server" in Claude Desktop

This is the most common issue. Troubleshoot in the following order:

1. **Check Node.js version**. TRON MCP Server requires v20.0.0 or higher:
   ```bash
   node --version  # Should output v20.x.x or higher
   ```
   If your version is too low, upgrade Node.js first.

2. **Check that npx is available**. Run `npx --version` in your terminal. If the command is not found, your Node.js installation is incomplete — reinstall it.

3. **Verify config file format**. `claude_desktop_config.json` must be valid JSON. Common mistakes include trailing commas, missing quotes, or mismatched brackets. Quickly validate with:
   ```bash
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | python3 -m json.tool
   ```
   If formatted JSON is printed, the format is fine. If there's an error, fix it according to the message.

4. **Fully quit and restart**. Closing the window is not the same as quitting — you need to fully exit Claude Desktop from the menu bar/system tray, then reopen it. On macOS, right-click the Dock icon and choose "Quit".

5. **Check logs**. If none of the above resolves the issue, check Claude Desktop's log files. On macOS they're in `~/Library/Logs/Claude/` — search for entries containing "mcp" or "tron".

### "Connection refused" in HTTP mode

When using HTTP mode (`npm run start:http`) and clients cannot connect, the usual causes are:

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

### Only read tools in the tool list, no write tools

This is not an error — it's by design. Write tools (transfers, staking, etc.) are only registered into the AI's tool list after a wallet is configured. If you haven't set any wallet environment variables, the server automatically runs in read-only mode.

To unlock write tools, configure one of the three wallet modes:

- Set `AGENT_WALLET_PASSWORD` ([Agent Wallet](../../../Agent-Wallet/Intro) mode, recommended)
- Set `TRON_PRIVATE_KEY` (Private Key mode)
- Set `TRON_MNEMONIC` (Mnemonic mode)

After configuring, restart your AI client. For detailed instructions, see [Local Private Deployment](./LocalPrivatizedDeployment.md).

---

## Authentication & Key Issues

### "Invalid private key" error

If the server reports an invalid private key at startup, it's usually a format issue:

1. **Check key format**. The private key should be a 64-character hex string, with or without the `0x` prefix:
   ```
   # Valid formats:
   abc123def456...       (64 hex characters)
   0xabc123def456...    (0x + 64 hex characters)
   ```

2. **Avoid extra spaces or quotes**. Environment variable values must not contain extra spaces, nested quotes, or newline characters:
   ```bash
   # Correct
   export TRON_PRIVATE_KEY=abc123def456...

   # Wrong (quotes become part of the value)
   export TRON_PRIVATE_KEY="'abc123def456...'"
   ```

3. **Verify the key is valid**. Import the same private key into a TRON wallet (like TronLink) to confirm it works.

### "Agent wallet password incorrect" error

`AGENT_WALLET_PASSWORD` must exactly match the master password set during wallet initialization. Verify that the wallet directory exists (`ls ~/.agent-wallet/`) and that `AGENT_WALLET_DIR` points to the correct path if you used a custom directory.

If the password is lost, you'll need to re-initialize. Run `agent-wallet reset` to wipe and start over — see [CLI Reference → Reset](../../../Agent-Wallet/Developer/CLI-Reference#agent-wallet-reset-reset-all-data) and [Agent-Wallet FAQ](../../../Agent-Wallet/FAQ) for details.

### TronGrid API Key not working

The API Key is configured but requests are still rate-limited — check the following:

1. **Is the variable name correct?** The correct name is `TRONGRID_API_KEY` (not `TRON_API_KEY` or other variants).

2. **Is the Key still active?** Log into [trongrid.io](https://www.trongrid.io/) to confirm your API Key is active.

3. **Header format for cloud service**. When using the official cloud service with an API Key, the `--header` parameter format must be `TRONGRID-API-KEY:your-key` with no spaces around the colon.

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
- If using `write_contract`, have the AI increase the `feeLimit` parameter

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

- **No TronGrid API Key**: Public RPC has rate limits; adding a free API Key can significantly improve performance
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

Yes. Define multiple MCP Server entries in your config — for example, one connecting to the mainnet cloud service (read-only) and another connecting to a local testnet deployment (with wallet). Just use different names:

```json
{
  "mcpServers": {
    "tron-mainnet": {
      "command": "npx",
      "args": ["mcp-remote", "https://tron-mcp-server.bankofai.io/mcp"]
    },
    "tron-local": {
      "command": "npx",
      "args": ["-y", "@bankofai/mcp-server-tron"],
      "env": {
        "AGENT_WALLET_PASSWORD": "your-password"
      }
    }
  }
}
```

### How do I update to the latest version?

If you're using the `npx` method, you always get the latest published version. To force clearing the cache:

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

TRON MCP Server supports MCP protocol version **2025-11-25**, using `@modelcontextprotocol/sdk` 1.22.0 or higher.
