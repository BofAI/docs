# Installation

### Prerequisites

* **bun** v1.2.10 or higher  
* **Node.js** v17 or higher  

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
    * `PORT`: Server port number (default: `3001`)

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

### Test with the Web UI

Use @modelcontextprotocol/inspector for testing. Run the following command to launch the test UI:

```bash
bun run test
```