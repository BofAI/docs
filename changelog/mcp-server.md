---
title: 'MCP Server'
description: 'Release notes for MCP Server.'
---

# MCP Server

Release notes for MCP Server.

<div className="changelog-entry">
<div className="changelog-date">Oct 27, 2026</div>
<div className="changelog-body">

### Package contents, Docker mode and HTTP details

<div className="changelog-tags"><span className="changelog-tag">Docs</span><span className="changelog-tag">Fix</span></div>

- The npm package ships `build/`, `bin/`, `package.json`, `README.md` and `LICENSE`; the Docker image always runs read-only (`--readonly` is hard-coded); `GET` / `DELETE /mcp` return 405 and SSE is not supported; `GET /` returns server information; `tron` / `trx` / `testnet` are accepted network aliases.

👉 [Local Deployment](/McpServer-Skills/MCP/TRONMCPServer/LocalPrivatizedDeployment/) · [Tool List](/McpServer-Skills/MCP/TRONMCPServer/ToolList/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Oct 23, 2026</div>
<div className="changelog-body">

### TRON MCP Server docs matched to the code

<div className="changelog-tags"><span className="changelog-tag">Docs</span><span className="changelog-tag">Fix</span></div>

- **RPC without an API key** — on `main` (tag `v1.1.8`), Mainnet requests without `TRONGRID_API_KEY` go to `https://hptg.bankofai.io`; with a key they go to `api.trongrid.io`. Nile and Shasta always use the TronGrid testnet nodes. npm `1.1.7` still uses `api.trongrid.io` without a key.
- **Tools and prompts** — `write_contract` takes no `feeLimit` (only `deploy_contract` does); `tron://networks` returns `{"supportedNetworks":[...]}`; read-only mode registers 4 prompts, not 6.
- **Wallet errors** — the FAQ now quotes the real agent-wallet 2.x error texts (`resolve_wallet could not find a wallet source in config or env`, `Password required for local_secure wallets`, `No active wallet set.`, `MAC mismatch — wrong password or corrupted file`). agent-wallet 2.3.x and 2.4.0 also accept the aliases `TRON_PRIVATE_KEY` and `TRON_MNEMONIC`, but read these env vars only when no password resolves and the wallet directory holds no wallets; otherwise they are silently ignored. On that path, with both a private key and a mnemonic set, agent-wallet 2.3.x gives `Wallet not configured.` and 2.4.0 gives `Provide only one of AGENT_WALLET_PRIVATE_KEY or AGENT_WALLET_MNEMONIC`.
- **Node.js** — a source checkout of `v1.1.8` requires 22.23.4+ (22.x) or 24.22.1+ (24.x); npm `1.1.7`, which `npx` runs, declares `>=20`. The pages recommend the October 2026 security releases either way. The cloud-service Quick Start replaced its hard requirement "Node.js v20.0.0 or higher" with "Node.js, needed to run `npx`", recommending 22.23.4+ or 24.22.1+.
- **Agent Wallet install pinned to 2.x** — the server depends on `@bankofai/agent-wallet ^2.3.0`, but an unpinned `npm install -g @bankofai/agent-wallet` now installs 3.0.0, which has no `local_secure` wallets, master password, or `--save-runtime-secrets`. The pages now use `npm install -g @bankofai/agent-wallet@2` and note that the Agent-Wallet docs describe 3.x.

👉 [Quick Start](/McpServer-Skills/MCP/TRONMCPServer/QuickStart/) · [FAQ](/McpServer-Skills/MCP/TRONMCPServer/FAQ/) · [Local Private Deployment](/McpServer-Skills/MCP/TRONMCPServer/LocalPrivatizedDeployment/)

</div>
</div>

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
