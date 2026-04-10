---
title: FAQ & Troubleshooting
description: SUN MCP Server FAQ covering connection, authentication, DeFi operations and troubleshooting.
---

# FAQ & Troubleshooting

This page collects frequently asked questions when using SUN MCP Server and their solutions.

## Connection Issues

### MCP client "Cannot Connect to MCP Server"

**Symptom:** MCP client shows server unresponsive or connection refused.

**Resolution Steps:**

1. **Check Node.js Installation**
   ```bash
   node --version  # Should return v18+
   npm --version
   ```

2. **Verify Server Running**
   ```bash
   # If using official server
   npx -y @bankofai/sun-mcp-server
   
   # If using local deployment
   npm start
   ```

3. **Check JSON Format**
   - Verify JSON format of `stdio.json` in MCP client configuration
   - Common errors: trailing commas, unmatched brackets

4. **Restart MCP client**
   - Completely close application
   - Clear client cache (method depends on your specific MCP client)
   - Restart application

5. **Check Server Logs**
   ```bash
   # If using official server, enable verbose logging
   DEBUG=* npx -y @bankofai/sun-mcp-server
   ```

**If issue persists:** See [Official Server Access Guide](OfficialServerAccess.md) for latest configuration examples.

### "Connection Refused" in HTTP Mode

**Symptom:** Getting connection refused error when trying to connect via HTTP.

**Common Causes and Solutions:**

1. **Server Not Running**
   ```bash
   # Start server in HTTP mode
   sun-mcp-server --http --port 8080
   ```

2. **Port 8080 Already in Use**
   ```bash
   # Check port usage
   lsof -i :8080
   
   # Use different port
   sun-mcp-server --http --port 8081
   ```

3. **Firewall Blocking Connection**
   - Check local firewall rules
   - Ensure localhost:8080 connection is allowed
   - On macOS: System Settings > Security & Privacy > Firewall

4. **Confirm Server Address**
   - Use `http://localhost:8080` rather than `127.0.0.1:8080`
   - Ensure no typos

### Only Read Tools in Tool List

**Symptom:** Cannot see `sunswap_swap`, `sunswap_add_liquidity` and other write tools.

**Cause:** No wallet configured.

**Solution:**

1. **Configure [Agent Wallet](../../../Agent-Wallet/Intro.md)** — set `AGENT_WALLET_PASSWORD`
   ```bash
   export AGENT_WALLET_PASSWORD='your_password'
   ```

2. **Restart server** and reconnect MCP client

Verify successful configuration by checking [Full Capability List](ToolList.md) for Full Capability List.

## Authentication and Key Issues

### "Invalid Private Key" Error

**Symptom:** Server rejects provided private key.

**Private Key Format Requirements:**
- Must be 64 hexadecimal characters (excluding `0x` prefix)
- Valid range: `0x0000000000000000000000000000000000000000000000000000000000000001` to `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140`

**Verification Steps:**
```bash
# Check private key length
echo -n "your_private_key" | wc -c
# Should output 64

# Check if valid hexadecimal
echo "your_private_key" | grep -E '^[0-9a-fA-F]{64}$'
# If output exists, format is correct
```

**Common Errors:**
- Contains `0x` prefix (remove it)
- Length less than 64 characters (get complete key from export tool)
- Contains spaces or special characters

### "Agent Wallet Password Incorrect"

**Symptom:** Server cannot decrypt Agent Wallet.

**Resolution Steps:**

1. **Verify password is set**: Run `[[ -n "$AGENT_WALLET_PASSWORD" ]] && echo "Password is set" || echo "Password NOT set"` to confirm the variable is set without revealing the value.
2. **Check wallet directory**: Verify `~/.agent-wallet/` exists and contains wallet files. If you used a custom directory, ensure `AGENT_WALLET_DIR` points to the correct path.
3. **If password is lost**: You'll need to re-initialize the wallet. **Warning: this wipes all wallets and keys — ensure funds are moved or mnemonics backed up before proceeding.** Run `agent-wallet reset` to wipe and start over — see [CLI Reference → Reset](../../../Agent-Wallet/Developer/CLI-Reference.md#agent-wallet-reset-reset-all-data) and [Agent-Wallet FAQ](../../../Agent-Wallet/FAQ.md) for details. Passwords with special characters are supported — use single quotes when setting the environment variable.


### "Wallet Not Found" or Initialization Error

**Symptom:** Server cannot find or initialize wallet.

**Cause:** Agent Wallet not properly configured.

**Solution:** Ensure Agent Wallet is installed and configured:

```bash
# Set Agent Wallet password
export AGENT_WALLET_PASSWORD='your_password'

# Optional: specify custom wallet directory
export AGENT_WALLET_DIR="$HOME/.agent-wallet"

# Restart server
sun-mcp-server
```

If you haven't initialized Agent Wallet yet, see the [Agent-Wallet documentation](../../../Agent-Wallet/Intro.md) for setup instructions.

## DeFi Operation Errors

### "Swap Failed"

**Symptom:** `sunswap_swap` call returns error.

**Common Causes and Solutions:**

1. **Insufficient Balance**
   ```bash
   # Check source token balance
   sunswap_get_balances  # List all balances
   ```
   - Confirm sufficient source tokens
   - Account amount should include Gas fees

2. **Slippage Tolerance Too Low**
   ```
   # Example: 2% slippage tolerance may not be enough
   Increase to 3-5%
   ```
   - May need higher tolerance in volatile markets
   - But higher tolerance increases frontrunning risk

3. **Token Not Tradeable**
   - Check if token listed on SunSwap
   - Some new tokens may not support trading
   - Verify token contract address is correct

4. **Insufficient Liquidity**
   ```
   Use sunswap_quote_exact_input to check available liquidity
   ```
   - Small trades may fail
   - Try smaller amount or use multi-hop routes

**Diagnostic Steps:**
```
1. Check balance
2. Use sunswap_quote_exact_input to estimate output
3. Try higher slippage tolerance
4. Check network status
```

### "Add Liquidity Failed"

**Symptom:** `sunswap_add_liquidity` returns error.

**Common Causes and Solutions:**

1. **Tokens Not Authorized**
   ```
   Need to authorize both tokens for SunSwap contract
   ```
   - Call `sunswap_approve_token` or `permit2_approve`
   - Grant sufficient amount
   - Both tokens need authorization

2. **Amount Ratio Not Reasonable**
   ```
   Current price may have changed
   Reduce slippage tolerance to allow wider ratio range
   ```
   - Check current pool price
   - Adjust token amounts to match pool ratio
   - Or increase tolerance percentage

3. **Amount Too Small**
   ```
   Minimum liquidity requirement may not be met
   ```
   - Try increasing amount
   - Check SunSwap's minimum position requirement

4. **Pool Doesn't Exist**
   - Verify trading pair exists on SunSwap
   - Check fee tier is correct (V2: 0.3%, V3: 0.01%-1%)

**Diagnostic Tip:** Always verify balance and authorization first, before calling add liquidity.

### "Permit2 Signature Failed"

**Symptom:** Permit2 authorization returns signature error.

**Resolution Steps:**

1. **Check Wallet Support**
   ```bash
   # Agent Wallet must support signTypedData
   [[ -n "$AGENT_WALLET_PASSWORD" ]] && echo "Password is set" || echo "Password NOT set"
   ```

2. **Verify Signature Data**
   - Check Permit2 request structured data
   - Confirm chain ID, token address, deadline correct

3. **Reinitialize Wallet** — run `agent-wallet reset` to wipe and start over. See [CLI Reference → Reset](../../../Agent-Wallet/Developer/CLI-Reference.md#agent-wallet-reset-reset-all-data) for details.

4. **Use Alternate Authorization Method**
   ```
   If Permit2 continues to fail, use sunswap_approve_token instead
   ```

### Transaction Shows "REVERT" Status

**Symptom:** Transaction submitted but reverted on-chain.

**Common Causes:**

1. **Balance Decreased After Transaction Signed**
   - Wallet may be participating in other transactions simultaneously
   - Space sufficient time between submissions

2. **Slippage Price Changed**
   - Price changed while transaction queued
   - Increase slippage tolerance and retry

3. **Contract State Changed**
   - Pool or token contract updated
   - Retry after one block

4. **Insufficient Authorization**
   - Permit2 authorization expired or used up
   - Re-authorize and retry

5. **Insufficient Gas**
   - Uncommon on TRON, but check account balance
   - Ensure account has sufficient TRX as Gas

**Debug Tip:**
```
Check transaction hash details on https://tronscan.org for error message
```

## AI Behavior Issues

### AI Constructed Invalid Token Address

**Symptom:** AI used non-existent token address, causing operation failure.

**Solution:**

1. **Provide Accurate Address in Prompt**
   ```
   Please use USDT (TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t)
   ```

2. **Use Official Token List**
   - Get address from SunSwap or TronScan
   - Always verify address format (case and length)

3. **Have AI Verify Address**
   ```
   Before executing any operation, use sunswap_get_token_price
   to verify token exists
   ```

### AI Tried to Call Non-existent Tool

**Symptom:** AI called `invalid_tool_name` or other non-existent tool.

**Solution:**

1. **Reference Official Tool List**
   - Check [SUN MCP Server Tool List](ToolList.md)
   - Provide correct tool names to AI

2. **Explicitly List Tools in Prompt**
   ```
   Available swap tools include:
   - sunswap_swap
   - sunswap_quote_exact_input
   - sunswap_quote_exact_output
   ```

3. **Simplify Request**
   - Request single operation rather than complex multi-step workflow
   - AI will call correct tool more reliably

### Slow Response Speed

**Symptom:** Querying data or executing operations takes long time.

**Optimization Steps:**

1. **Simplify Workflow**
   - Reduce multi-tool coordination steps
   - Avoid large number of consecutive queries

2. **Use Local Server**
   - See [Local Privatized Deployment](LocalPrivatizedDeployment.md)
   - May be faster than official server (depends on network)

3. **Batch Operations**
   ```
   Merge related queries to reduce round trips
   ```

## General Questions

### What's the Difference Between Mainnet, Nile and Shasta?

| Feature | Mainnet | Nile Testnet | Shasta Testnet |
|------|---|---|---|
| **Purpose** | Production | Official testing | Community testing |
| **Network Parameter** | `mainnet` | `nile` | `shasta` |
| **Real Value** | Yes | No (test TRX) | No (test TRX) |
| **Transaction Finality** | Immediate | Immediate | Immediate |
| **Recommended Use** | Production DeFi | Development and testing | Experimentation |
| **Stability** | Highest | High | Medium |
| **Get Test TRX** | N/A | [Nile Faucet](https://nile.trongrid.io/join/getjoined) | [Shasta Faucet](https://shasta.trongrid.io/join/getjoined) |

**Best Practice:**
- Always use Nile during development
- Final testing on Shasta
- Only migrate to mainnet after sufficient verification

### Can I Use Multiple MCP Server Instances Simultaneously?

**Yes.** For example, can run official mainnet server and local Nile instance simultaneously.

**Configuration Example (MCP client):**

```json
{
  "mcpServers": {
    "sun-mainnet": {
      "command": "npx",
      "args": ["-y", "@bankofai/sun-mcp-server"],
      "env": {
        "TRON_NETWORK": "mainnet",
        "AGENT_WALLET_PASSWORD": "your_mainnet_password"
      }
    },
    "sun-nile": {
      "command": "sun-mcp-server",
      "args": ["--port", "8081"],
      "env": {
        "TRON_NETWORK": "nile",
        "AGENT_WALLET_PASSWORD": "your_testnet_password"
      }
    }
  }
}
```

**Note:** Use different wallet credentials for each instance to avoid confusion.

### How to Update to Latest Version?

**Using npx (Recommended):**
```bash
# npx automatically gets latest version
npx -y @bankofai/sun-mcp-server

# Force clear cache and get latest version
npx --clear-cache -y @bankofai/sun-mcp-server
```

**Using Local Installation:**
```bash
# Update global installation
npm install -g @bankofai/sun-mcp-server

# Or update in project
npm update @bankofai/sun-mcp-server
```

**Using Git Repository:**
```bash
# Clone or update repository
git clone https://github.com/BofAI/sun-mcp-server.git
cd sun-mcp-server

# Pull latest code
git pull

# Install dependencies and start
npm install
npm start
```

### Too Many Tools Cause LLM Context Overflow?

**Symptom:** Claude reports token limit exceeded or tool list too long.

**Solution: Use Tool Filtering:**

```bash
# Enable only specific tools (whitelist)
sun-mcp-server --whitelist sunswap_swap,sunswap_get_balances,sunswap_quote_exact_input

# Exclude certain tools (blacklist)
sun-mcp-server --blacklist getUserPositions,getPoolVolHistory
```

**Optimization Tips:**
- Create multiple server instances for different tasks
- Use whitelist to load only necessary tools
- Regularly clean up unused tool configurations

### Which MCP Protocol Version is Supported?

**SUN MCP Server supports MCP 1.10.2 and higher.**

**Verify Version:**
```bash
# Check version in dependencies
npm list @modelcontextprotocol/sdk

# Should output similar to:
# @modelcontextprotocol/sdk@1.10.2
```

**Upgrade MCP SDK:**
```bash
npm update @modelcontextprotocol/sdk
```

---

## Get More Help

- **GitHub Issues:** https://github.com/BofAI/sun-mcp-server/issues
- **Full Capability List:** Check [Full Capability List](ToolList.md) 
- **Local Deployment:** See [Local Privatized Deployment](LocalPrivatizedDeployment.md)
- **Official Server:** See [Official Server Access](OfficialServerAccess.md)
