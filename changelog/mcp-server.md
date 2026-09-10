---
title: 'MCP Server'
description: 'Release notes for MCP Server.'
---

# MCP Server

Release notes for MCP Server.

<div className="changelog-entry">
<div className="changelog-date">Sep 9, 2026</div>
<div className="changelog-body">

### TRON and BSC server documentation corrected

<div className="changelog-tags"><span className="changelog-tag">Docs</span><span className="changelog-tag">Fix</span></div>

- **TronGrid API key** — the FAQ described a `--header TRONGRID-API-KEY:...` form that nothing implements. The server reads `TRONGRID_API_KEY` from its own environment and forwards it upstream as `TRON-PRO-API-KEY`; it inspects no request headers, so a per-request key against the hosted service is not possible. Run a local or self-hosted instance if you need your own quota.
- **Wallet setup** — the private deployment guide said no extra environment variables were needed after `agent-wallet start`. That command does not persist the master password, so signing later fails; the page now tells you to use `--save-runtime-secrets` or export `AGENT_WALLET_PASSWORD`, and documents that `AGENT_WALLET_PRIVATE_KEY` is ignored once a password resolves or a keystore wallet exists.
- **HTTP mode and Docker** — `npx -y @bankofai/mcp-server-tron --http` is the packaged way to start HTTP mode; `npm run start:http` and the Dockerfile require a source checkout, since neither ships in the npm package.
- **Short flags** — the launcher treats `-h` as the alias for `--http` and `-r` as the alias for `--readonly`; there is no help flag, so `-h` starts the HTTP server rather than printing usage. The private deployment page now warns about this, and documents the `MCP_LOG_DIR` variable read by the Docker and source start scripts.
- **BSC page** — noted that its default port 3001 collides with the TRON server's, and aligned the Node.js floor with the rest of the toolchain.

👉 [TRON MCP Server](/McpServer-Skills/MCP/TRONMCPServer/LocalPrivatizedDeployment/) · [FAQ](/McpServer-Skills/MCP/TRONMCPServer/FAQ/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Mar 17, 2026</div>
<div className="changelog-body">

### Full tool list for TRON MCP Server

<div className="changelog-tags"><span className="changelog-tag">Docs</span><span className="changelog-tag">TRON</span></div>

- Added a **Tool List** page — every tool the TRON MCP Server exposes, with parameters, so you can see up front what your AI client will be able to call.

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Mar 10, 2026</div>
<div className="changelog-body">

### Two ways to connect

<div className="changelog-tags"><span className="changelog-tag">New</span><span className="changelog-tag">TRON</span></div>

- **Official Server Access** — point your client at the hosted endpoint, no infrastructure required.
- **Local Private Deployment** — run the server yourself when keys and traffic need to stay in your own environment.

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Feb 11, 2026</div>
<div className="changelog-body">

### TRON and BSC MCP Servers

<div className="changelog-tags"><span className="changelog-tag">New</span></div>

- First documentation for the **TRON MCP Server** and the **BSC MCP Server**, covering installation, features, and the API surface.

</div>
</div>
