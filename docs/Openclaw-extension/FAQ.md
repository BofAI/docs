# FAQ & Troubleshooting

When you encounter problems, check here first. Organized by the most likely issues you'll encounter: installation problems, connection issues, credential problems, runtime problems, and finally some general questions.

---

## Installation Problems

### Installer reports error "command not found: node"

The installer requires Node.js v18.0.0 or higher. Check if it's installed:

```bash
node --version
```

If not installed or version is too old, download and install the latest LTS version from [nodejs.org](https://nodejs.org/). After installing Node.js, the `npx` command will also be available.

### Installer reports error "command not found: python3"

The installer uses Python to process JSON configuration files. macOS typically comes with Python 3; on Linux, install via package manager:

```bash
# Ubuntu/Debian
sudo apt install python3

# macOS (via Homebrew)
brew install python3
```

### Installer warning "OpenClaw not found"

The installer detected that `~/.openclaw` directory doesn't exist. This means OpenClaw might not be installed or was installed in a non-standard location.

The installer will ask if you want to continue — you can choose to proceed (MCP Servers and Skills will still be configured), but OpenClaw may not auto-load them on startup. Recommend first completing installation from the [OpenClaw official repository](https://github.com/openclaw).

### Skills clone failed

If `git clone` fails, common causes include:

- **Network issues**: Check if you can access GitHub. Try `git clone https://github.com/BofAI/skills.git` to test manually.
- **Git not installed**: Run `git --version` to confirm.
- **Specified branch/tag doesn't exist**: If you set the `GITHUB_BRANCH` environment variable, confirm the branch or tag actually exists.

Skills clone failure won't interrupt the entire installation — MCP Server configuration remains intact. You can install Skills manually later.

### npm install failed

When installing Skills, some Skills (like sunswap, x402-payment) need to run `npm install` to install dependencies. If it fails:

- Check network connectivity (npm needs to access registry.npmjs.org)
- Confirm Node.js version >= 18
- Try running manually:
  ```bash
  cd ~/.openclaw/skills/sunswap   # or other Skill directory
  npm install
  ```

npm install failure won't interrupt the installer — it will issue a warning but continue. That Skill's functionality may be limited until dependencies are successfully installed.

---

## Connection Issues

### Can't see blockchain tools in OpenClaw after startup

**Most common cause**: OpenClaw wasn't restarted. After modifying mcporter.json, you must completely exit and restart OpenClaw.

If you still can't see them after restarting:

1. **Check mcporter.json format**:
   ```bash
   python3 -m json.tool ~/.mcporter/mcporter.json
   ```
   If there's a JSON syntax error, fix the format issues and restart.

2. **Check mcporter.json contents**: Confirm there are Server entries under `mcpServers` for what you installed.

3. **Manually test MCP Server**:
   ```bash
   npx -y @bankofai/mcp-server-tron
   ```
   If this command starts normally (shows logging output), the MCP Server itself is fine; the issue is in OpenClaw's configuration reading.

### Only query tools available, no write tools like transfers

This is by design. Write tools only appear after wallet credentials are configured. Check if any of these are set:

- Environment variable `TRON_PRIVATE_KEY` (mcp-server-tron)
- Environment variable `PRIVATE_KEY` (bnbchain-mcp)
- `env.TRON_PRIVATE_KEY` or `env.PRIVATE_KEY` for corresponding Server in mcporter.json


### MCP Server startup timeout

If OpenClaw times out starting an MCP Server, it may be that npx is downloading packages too slowly. The first run downloads packages from npm, which can take tens of seconds.

Speed this up by pre-downloading:

```bash
npx -y @bankofai/mcp-server-tron --help
npx -y @bnb-chain/mcp@latest --help
```

After downloading completes, subsequent startups will use cache and be much faster.

---

## Credential Issues

### "Invalid private key" error

**TRON private key** should be a 64-character hexadecimal string, with or without `0x` prefix.

**EVM private key** should have `0x` prefix. The installer automatically adds `0x` to private keys without it, but if you manually edit config files, ensure the format is correct.

Common mistakes:
- Extra spaces, newlines, or quote nesting
- Invisible characters when copying from elsewhere

Validation: Import the private key into the appropriate wallet (TronLink or MetaMask) to confirm validity.

### TronGrid API Key not working

1. **Is variable name correct?**: Must be `TRONGRID_API_KEY` (not `TRON_API_KEY`)
2. **Is Key still valid?**: Log in to [trongrid.io](https://www.trongrid.io/) to check status
3. **Is it properly loaded?**: If set in environment variables, confirm you ran `source ~/.zshrc`


### BANK OF AI API Key invalid

Check contents of `~/.mcporter/bankofai-config.json` (or `~/.bankofai/config.json`):

```bash
cat ~/.mcporter/bankofai-config.json
```

Confirm the `api_key` field contains a valid Key. Note that recharge-skill has a credential priority order (CLI arguments > environment variables > `bankofai-config.json` in working directory > `~/.bankofai/config.json` > `~/.mcporter/bankofai-config.json`); if you set different values in multiple places, you might read the unexpected one.

---

## Runtime Problems

### Rate limiting (429 errors)

Mainnet's public RPC has strict rate limits. Solutions:

- **Configure TronGrid API Key**: After free registration, set `TRONGRID_API_KEY`, significantly increasing quota
- **Use testnet**: Nile and Shasta testnets have fewer restrictions
- **Reduce concurrent queries**: In prompts, avoid having the AI execute large numbers of queries simultaneously

### Skill execution failed

If a Skill errors, troubleshoot in this order:

1. **Check if dependencies are installed**:
   ```bash
   cd ~/.openclaw/skills/<skill-name>
   npm install  # if there's package.json
   ```

2. **Check Node.js version**: Some Skills require >= 18.0.0.

### Transaction failed

Common reasons for on-chain transaction failures:

- **Insufficient balance**: TRX balance doesn't cover gas fees (bandwidth/energy)
- **Insufficient energy**: Smart contract calls (including TRC20 transfers) consume energy
- **Account not activated**: New TRON addresses need to receive one TRX first to activate
- **Insufficient approval**: TRC20 token transfers may require prior approval

Use mcp-server-tron's `get_transaction_info` tool to see the specific reason for transaction failure.

---

## General Questions

### Can I install only some components?

Yes. The installer lets you selectively install at each stage. For example, you can install only mcp-server-tron without other MCP Servers, or only sunswap Skill while skipping others.

### Can I run the installer multiple times?

Yes. The installer uses deep merge strategy for mcporter.json and won't overwrite existing configurations. For Skills, if a Skill with the same name already exists at the target location, it will ask if you want to overwrite.

### How do I completely uninstall?

OpenClaw Extension has no automatic uninstaller. Manual uninstall steps:

1. **Remove MCP Server configuration**: Edit `~/.mcporter/mcporter.json`, remove corresponding Server entries
2. **Delete Skills**: Delete Skill folders in installation directory (default `~/.openclaw/skills/`)
3. **Delete credential files**:
   ```bash
   rm -f ~/.x402-config.json
   rm -f ~/.mcporter/bankofai-config.json
   rm -f ~/.bankofai/config.json
   rm -f ~/.clawdbot/wallets/.deployer_pk
   ```
4. **Clean environment variables**: Remove related export statements from `~/.zshrc` or `~/.bashrc`

### Which operating systems are supported?

The installer is a Bash script supporting:
- **macOS** (Intel and Apple Silicon)
- **Linux** (Ubuntu, Debian, CentOS, etc.)
- **Windows**: Requires WSL (Windows Subsystem for Linux) to run

### What's the difference from TRON MCP Server's official cloud service?

The [official cloud service](../McpServer-Skills/MCP/TRONMCPServer/OfficialServerAccess.md) is a remote-hosted read-only MCP Server, requiring no local installation. OpenClaw Extension runs the MCP Server locally, and with private keys configured, unlocks full read-write capabilities.

If you only need to query on-chain data, cloud service is simpler. If you need transfers, contract writes, or want to use Skills (like SunSwap trading), you need OpenClaw Extension.

---

## Next Steps

- Start fresh → [Quick Start](./QuickStart.md)
