# Installation and Usage
OpenClaw Extension provides a CLI installer to help you quickly set up your environment.

## Installation

### Prerequisites

*   **OpenClaw** (Your personal open-source AI assistant) - [Install from here](https://docs.openclaw.ai/install)
*   **Node.js** (v18+)
*   **Python 3** (for configuring auxiliary tools)
*   **Git** (for cloning skill repositories)
*   **Wallet** (private keys and API keys for blockchain network interaction)

**Note**: This installer uses OpenClaw's configuration system. Please ensure OpenClaw is installed before running this installer.

### Quick Start

**One-click installation:**

```shell
curl -fsSL https://raw.githubusercontent.com/bankofai/openclaw-extension/refs/heads/main/install.sh | bash
```

Or install from source:

```shell
git clone https://github.com/bankofai/openclaw-extension.git
cd openclaw-extension
./install.sh
```

### Installed Content

*   **MCP Server Configuration** - `~/.mcporter/mcporter.json`
*   **Skills** - Installed to your chosen location
*   **Available Skills**: sunswap, x402_payment, x402_payment_demo

**Note**: This installer uses `mcporter` (OpenClaw's official MCP manager) for configuration. Please ensure OpenClaw is installed first.

## Security

### Credential Storage Options

The installer provides two methods for storing credentials:

**Option 1: Configuration File Storage**

*   Keys are stored in `~/.mcporter/mcporter.json`.
*   Convenient but insecure (stored in plain text).
*   **Important**: Protect the file with `chmod 600 ~/.mcporter/mcporter.json`.
*   Never share or commit this file to version control.

**Option 2: Environment Variables (Recommended)**

*   Keys are read from the shell environment.
*   More secure, not stored in configuration files.
*   Add to your shell profile (`~/.zshrc`, `~/.bashrc`, etc.):

    ```shell
    export PRIVATE_KEY="your_private_key_here"
    export API_KEY="your_api_key_here"
    ```

*   Restart your shell or run `source ~/.zshrc` after adding.

### Best Practices

*   Use a dedicated agent wallet with limited funds.
*   Never use your main personal wallet.
*   Test on testnet before using on mainnet.
*   Do not allow AI agents to scan files containing private keys.

## Use at Your Own Risk

Allowing AI agents to directly handle private keys involves significant security risks. We recommend using only small amounts of cryptocurrency and proceeding with caution. Despite built-in security measures, there is no guarantee against loss of your assets. This extension is currently experimental and has not been rigorously tested. It provides no warranties or assumes any liability. Always verify your setup on a testnet before interacting with the mainnet.
