# Configuration

### Environment Variables

**Important Security Note**: For your security, **NEVER** save your private keys or mnemonic phrases directly in MCP configuration files (e.g., `claude_desktop_config.json` or `mcp.json`). Instead, set them as environment variables in your operating system or shell configuration.

To enable write operations (transfers, contract calls) and ensure reliable API access, you should configure the following variables.

#### Network Configuration

*   `TRONGRID_API_KEY`: (Optional) Your TronGrid API key.
    *   **Reason**: TRON mainnet RPC has strict rate limits. Using an API key from [TronGrid](https://www.trongrid.io/) ensures reliable performance and higher throughput.
    *   **Usage**:

        ```shell
        export TRONGRID_API_KEY="<YOUR_TRONGRID_API_KEY_HERE>"
        ```

#### Wallet Configuration (using Environment Variables)

**Option 1: Private Key**

```shell
# Recommended: Add this to your ~/.zshrc or ~/.bashrc
export TRON_PRIVATE_KEY="<YOUR_PRIVATE_KEY_HERE>"
```

**Option 2: Mnemonic Phrase**

```shell
# Recommended: Add this to your ~/.zshrc or ~/.bashrc
export TRON_MNEMONIC="<WORD1> <WORD2> ... <WORD12>"
export TRON_ACCOUNT_INDEX="0" # Optional, default: 0
```

### Server Configuration

The server runs in HTTP mode on port **3001** by default.

## Usage

### Local Run

```shell
# Start in stdio mode (for MCP clients like Claude Desktop/Cursor)
npm start

# Start in HTTP mode (Streamable HTTP)
npm run start:http

# Start in read-only mode (write tools disabled)
npm start -- --readonly
```

### Testing

The project includes a comprehensive test suite, including unit and integration tests (using Nile network).

```shell
# Lint check
npm run lint

# Run all tests
npm test

# Run specific test suites
npx vitest tests/core/tools.test.ts              # Unit tests for tools
npx vitest tests/core/services/services.test.ts   # Service integration (Nile)
npx vitest tests/core/services/agent-wallet.test.ts # Agent-wallet unit tests
```

### Production Deployment

```shell
# Build and start with PM2 (read-only mode)
bash start.sh
```

### Client Configuration

To use this server with MCP clients like Claude Desktop, Cursor, or Google Antigravity, you need to add it to your configuration file.

#### 1. Locate Your Configuration File

| Application | OS | Configuration Path |
| :-- | :-- | :-- |
| **Claude Desktop** | macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| | Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Cursor** | All | Project root: `.cursor/mcp.json` |
| **Google Antigravity** | All | `~/.config/antigravity/mcp.json` |
| **Opencode** | All | `~/.config/opencode/mcp.json` |

#### 2. Add Server Definition

Choose one of the following methods to add it to your `mcpServers` object.

**Option A: Quick Start (Recommended)** Run the latest version directly from npm.

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": ["-y", "@bankofai/mcp-server-tron"],
      "env": {
        "TRON_PRIVATE_KEY": "YOUR_KEY_HERE (Or set in system env)",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE (Or set in system env)"
      }
    }
  }
}
```

**Option B: Local Development** For developers running from a cloned repository.

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": ["tsx", "/ABSOLUTE/PATH/TO/mcp-server-tron/src/index.ts"],
      "env": {
        "TRON_PRIVATE_KEY": "YOUR_KEY_HERE (Or set in system env)",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE (Or set in system env)"
      }
    }
  }
}
```

**Important**: If you have already set these variables in your system environment, we recommend omitting the `env` section. If your MCP client does not inherit system variables, use placeholders or ensure the configuration file is not shared or committed to version control.
