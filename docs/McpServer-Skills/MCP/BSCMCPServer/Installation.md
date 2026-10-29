# Installation

### Prerequisites

* **bun** v1.2.10 or higher  
* **Node.js** v17 or higher (the upstream README's requirement; `package.json` declares no `engines`, and the project's release workflow uses Node.js 20)

### Quick Start

1. **Clone the repository:**
    ```bash
    git clone https://github.com/bnb-chain/bnbchain-mcp.git
    cd bnbchain-mcp
    ```

2. **Set up environment variables:**
    ```bash
    cp .env.example .env
    ```

3. **Edit the `.env` file and configure your information:**
    * `PRIVATE_KEY`: Your wallet private key (required for executing transactions)
    * `LOG_LEVEL`: Set the log level (`DEBUG`, `INFO`, `WARN`, `ERROR`)
    * `PORT`: Server port number (default: `3001` — the TRON MCP server also defaults to 3001, so change one of them if you run both locally)
    * `BNBCHAIN_MCP_SKIP_TRANSFER_CONFIRMATION` (optional, default `false`): by default, transfer and payment tools only return a preview and a `confirmToken` (valid for 5 minutes) without sending anything; call `confirm_transfer` with that token to execute. Set it to `true` to execute immediately

4. **Install dependencies and start the development server:**
    ```bash
    # Install project dependencies
    bun install
    
    # Start the development server
    bun dev:sse
    ```

### Test with an MCP Client

Use the following template to configure the local server in your MCP client:

```json
{
  "mcpServers": {
    "bnbchain-mcp": {
      "url": "http://localhost:3001/sse",
      "env": {
        "PRIVATE_KEY": "your_private_key_here"
      }
    }
  }
}
```

> The template follows the upstream README. With a `url` entry the client connects to the already running server, so the `env` block is not passed to it: the server reads `PRIVATE_KEY` from its own `.env`.

### Test with the Web UI

Use @modelcontextprotocol/inspector for testing. Run the following command to launch the test UI (the script runs the latest inspector through `npx`, which currently requires Node.js 22.19 or later):

```bash
bun run test
```