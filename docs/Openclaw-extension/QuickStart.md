# Quick Start

The goal of this page is: **Get you up and running with a complete installation and your first blockchain query in just a few minutes.**

The installer is interactive, guiding you to select which MCP Servers and Skills to install, then automatically completing all configuration. You just need to follow the prompts.

---

## Prerequisites

Before running the installer, ensure the following tools are ready:

| Requirement | Description | Verification Command | Download |
| :--- | :--- | :--- | :--- |
| **OpenClaw** | Your open-source AI assistant | Check if `~/.openclaw` directory exists | [OpenClaw official repository](https://github.com/openclaw) |
| **Node.js v18+** | Required to run MCP Servers | `node --version` | [Node.js official site](https://nodejs.org/) |
| **Python 3** | Used by installer to handle JSON configuration | `python3 --version` | [Python official site](https://www.python.org/downloads/) |
| **Git** | Clone Skills repository | `git --version` | [Git official site](https://git-scm.com/) |

---

## Running the Installer

### Method 1: One-Click Install (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

### Method 2: Install from Source

```bash
git clone https://github.com/BofAI/openclaw-extension.git
cd openclaw-extension
./install.sh
```

Once started, the installer automatically checks environment dependencies (Node.js, npx, Git, Python). If any are missing, it will alert you immediately.

---

## Installation Process Details

The installer consists of two main phases, each with interactive selection at every step.

### Phase 1: Select and Configure MCP Servers

The installer displays all available MCP Servers and asks which ones you want to install:

```
📦 Available MCP Servers:
  1) mcp-server-tron    - TRON blockchain interaction
  2) bnbchain-mcp       - BNB Chain (BSC, opBNB, Ethereum) interaction
  3) bankofai-recharge  - Remote BANK OF AI recharge MCP

Select servers to install (e.g., 1,2,3 or 'all'):
```

> **Note on bankofai-recharge**: This is a remote MCP that connects directly to `https://recharge.bankofai.io/mcp`. No local credentials are needed — the installer configures the endpoint automatically.

For each selected server, the installer continues by asking how you want to store credentials:

- **Option 1: Save to Configuration File** — Keys stored in plaintext in `~/.mcporter/mcporter.json`. Convenient but lower security.
- **Option 2: Use Environment Variables (Recommended)** — Keys read from system environment variables, not written to any files.

If you choose to save to a configuration file, the installer will ask for specific key values (private keys, API Keys, etc.). If you choose environment variables, the installer will tell you which variables need to be set.

> **Tip**: If you just want to quickly experience the features, you can skip key configuration for now (just press Enter to leave it empty). Without a private key, the MCP Server will run in read-only mode, and you can still query on-chain data.

### Phase 2: Select and Install Skills

The installer clones the [Skills repository](https://github.com/BofAI/skills) from GitHub, automatically discovers all available Skills, and asks you to select:

```
🔧 Available Skills:
  1) recharge-skill   - BANK OF AI account query and recharge
  2) sunperp-skill    - SunPerp perpetual futures trading (TRON)
  3) sunswap          - SunSwap DEX trading skill
  4) tronscan-skill   - TRON blockchain data lookup
  5) x402-payment     - Agent payment protocol (x402)

Select skills to install (e.g., 1,2,3 or 'all'):
```

Then choose the installation location:

| Option | Path | Use Case |
| :--- | :--- | :--- |
| **User-level (Recommended)** | `~/.openclaw/skills/` | Shared across all projects |
| **Workspace-level** | `.openclaw/skills/` | Used only by current project |
| **Custom Path** | Directory you specify | Special requirements |

Some Skills have additional credential requirements, which the installer will prompt you for during installation:

- **recharge-skill** — Requires BANK OF AI API Key (`BANKOFAI_API_KEY`)
- **sunperp-skill** — Requires SunPerp API keys (`SUNPERP_ACCESS_KEY` + `SUNPERP_SECRET_KEY`)
- **tronscan-skill** — Prompts you to set `TRONSCAN_API_KEY` environment variable in your shell
- **sunswap** — Prompts to configure TRON private key (if not configured earlier)

---

## Verifying the Installation

After installation completes, **restart OpenClaw**, then in your conversation, enter:

```
Check the current block height on TRON mainnet
```

If you receive a normal response showing the current block height, it means mcp-server-tron has been successfully connected.

You can also try:

```
Check the TRX balance of TRON address TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

```
What are the current energy and bandwidth prices on TRON mainnet?
```

If all these queries return results normally, you're all set.

:::info About Read-Only Mode
If you didn't configure a private key during installation, the MCP Server will run in read-only mode — all query operations (check balance, check transactions, check contract state, etc.) work normally, but transfer and contract write operations are unavailable. To unlock write capabilities, see [Configuration Reference](./Configuration.md).
:::

---

## Having Problems?

If your AI assistant can't recognize blockchain tools after installation, common causes include:

- **OpenClaw not restarted** — Configuration changes require a full restart
- **Node.js version too old** — Ensure v18.0.0 or higher
- **mcporter.json format error** — You can check with `python3 -m json.tool ~/.mcporter/mcporter.json`

For more troubleshooting, see [FAQ & Troubleshooting](./FAQ.md).

---

## Next Steps

- Want to understand the detailed features of each MCP Server and Skill? → [Component Details](./Components.md)
- Want to configure private keys, API Keys, or security options? → [Configuration Reference](./Configuration.md)
- Having issues? → [FAQ & Troubleshooting](./FAQ.md)
