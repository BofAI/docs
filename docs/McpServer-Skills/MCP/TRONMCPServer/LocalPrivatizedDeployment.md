# Local Privatized Deployment

If you need to perform write operations such as transfers and contract calls, you must deploy the server locally. Local deployment allows you to securely configure private keys, thereby enabling full transaction functions.

## Environment Requirements
*   **Node.js**: v20.0.0 or higher.
*   Optional: **TronGrid API Key**: It is recommended to apply ([trongrid.io](https://www.trongrid.io/)) to avoid mainnet frequency limits.


## Key Configuration (Environment Variables)
**Important Security Note**: For your safety, **NEVER** save your private keys or mnemonics directly in MCP configuration files (such as `claude_desktop_config.json` or `mcp.json`). Instead, please set them as environment variables in your operating system or shell configuration.

To enable write operations (transfers, contract calls) and ensure reliable API access, you should configure the following variables.

### 1. Network Configuration

*   `TRONGRID_API_KEY`: (Optional) Your TronGrid API key.
    *   **Reason**: TRON mainnet RPC has strict rate limits. Using an API key from [TronGrid](https://www.trongrid.io/) ensures reliable performance and higher throughput.
    *   **Usage**:
        
        ```shell
        export TRONGRID_API_KEY="<YOUR_TRONGRID_API_KEY_HERE>"
        ```
* Server Configuration

  *   The server runs in HTTP mode on port **3001** by default.   

### 2. Wallet Configuration (Using Environment Variables)

**Option 1: Private Key**

```shell
# Recommended: Add this to your ~/.zshrc or ~/.bashrc
export TRON_PRIVATE_KEY="<YOUR_PRIVATE_KEY_HERE>"
```

**Option 2: Mnemonic**

```shell
# Recommended: Add this to your ~/.zshrc or ~/.bashrc
export TRON_MNEMONIC="<WORD1> <WORD2> ... <WORD12>"
export TRON_ACCOUNT_INDEX="0" # Optional, default: 0
```

## Installation
1.  **Clone and enter the directory**:
    ```shell
    git clone https://github.com/BofAI/mcp-server-tron.git
    cd mcp-server-tron
    ```
2.  **Install and Build**:
    ```shell
    npm install && npm run build
    ```


## Local Run

```shell
# Start in stdio mode (suitable for MCP clients such as Claude Desktop/Cursor)
npm start

# Start in HTTP mode (Streamable HTTP)
npm run start:http

# Start in read-only mode (disable write tools)
npm start -- --readonly
```

## Testing

The project includes a comprehensive test suite, including unit tests and integration tests (using the Nile network).

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

## Production Deployment

```shell
# Compile and start with PM2 (read-only mode)
bash start.sh
```


## Client Integration

To use this server with MCP clients such as Claude Desktop, Cursor, or Google Antigravity, you need to add it to your configuration file.

### 1. Find Your Configuration File

| Application | Operating System | Configuration Path |
| :-- | :-- | :-- |
| **Claude Desktop** | macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| | Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Cursor** | All | Project root: `.cursor/mcp.json` |
| **Google Antigravity** | All | `~/.config/antigravity/mcp.json` |
| **Opencode** | All | `~/.config/opencode/mcp.json` |



### 2. Add Server Definition

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

**Important Note**: If you have already set these variables in your system environment, we recommend omitting the `env` section. If your MCP client does not inherit system variables, please use placeholders or ensure the configuration file is not shared or committed to version control.

