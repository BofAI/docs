# Installation

## Prerequisites

- **Node.js** 20.0.0 or higher.
- **npm** (or compatible package manager).
- Optional: **TronGrid API key** for higher rate limits and stability on mainnet.

## Run Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd sun-mcp-server

# Install dependencies
npm install

# Build
npm run build
```

## Verify

```bash
# Run tests
npm run test

# Start server (stdio)
npm run start
```

For HTTP (streamable-http) mode:

```bash
npm run start -- --transport streamable-http --host 127.0.0.1 --port 8080 --mcpPath /mcp
```
