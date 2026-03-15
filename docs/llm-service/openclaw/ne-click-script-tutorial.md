# OpenClaw Integration with LLM Gateway (One-Click Script Tutorial)

## Overview

This tutorial shows how to quickly integrate **OpenClaw** with an **LLM Gateway** using a one-click setup script.

OpenClaw is a local AI agent framework that runs on your machine and connects to external large language models through APIs. With a gateway that exposes an **OpenAI-compatible API**, OpenClaw can easily interact with various LLM providers.

The one-click script simplifies the setup process by automatically installing dependencies, configuring the model provider, and initializing OpenClaw.

---

# Step 1: Obtain an API Key

Before running the integration script, you need an API key for the **LLM Gateway**.

Visit the API key management page:

https://chat.bankofai.io/key

Steps:

1. Sign in to your account  
2. Generate an **API Key**  
3. Copy and store the key securely

You will use this key during the setup process.

---

# Step 2: Run the One-Click Setup Script

Run the following command in your terminal:

```bash
curl -fsSL https://example.com/openclaw-install.sh | bash
```

This script will automatically:

- Install OpenClaw
- Configure the LLM Gateway provider
- Install required dependencies
- Initialize OpenClaw configuration

After the script finishes, OpenClaw will be ready to use.

---

# Step 3: Verify the Installation

Check the OpenClaw version:

```bash
openclaw --version
```

If OpenClaw was installed correctly, the command will display the current version.

![OpenClaw version check](https://files.readme.io/6f39989ed49f307a5168bd934c4ffaf2a79db8a2268c6959c3bb731f43138598-2.png)

---

# Step 4: Configure the LLM Gateway

Open the configuration file:

```bash
~/.openclaw/openclaw.json
```

Add your gateway configuration.

Example:

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "llm-gateway": {
        "base_url": "https://api.example.com/v1",
        "api_key": "YOUR_API_KEY",
        "api": "openai-completions",
        "models": [
          { "id": "gpt-5-mini", "name": "gpt-5-mini" },
          { "id": "gpt-5-nano", "name": "gpt-5-nano" },
          { "id": "claude-sonnet", "name": "claude-sonnet" }
        ]
      }
    }
  }
}
```

Replace:

- `base_url`
- `api_key`

with your real gateway endpoint and API key.

---

# Step 5: Restart the Gateway

Restart OpenClaw after editing the configuration:

```bash
openclaw gateway restart
```

---

# Step 6: Test the Integration

Run a test command:

```bash
openclaw agent --agent main --message "Hello OpenClaw"
```

If the integration is successful, the agent will respond using the configured LLM.

![Successful test response](https://files.readme.io/312c6feb51ea9f4071b75efd3182ef0507a6981baebd3bf7e8d57dec33978efd-7.png)

---

# Step 7: Launch the Web Interface

Start the OpenClaw dashboard:

```bash
openclaw ui
```

OpenClaw will print a local access URL in the terminal.

Example:

```
http://127.0.0.1:18789
```

---

# Step 8: Launch the Terminal Interface

You can also use the terminal UI:

```bash
openclaw tui
```

![OpenClaw TUI](https://files.readme.io/9ca9be0db1c21be12488934030c8ef3076c17fbb4fc26cfdb0e71425e46d121d-8.png)

Useful commands:

| Command | Description |
|---|---|
| `/status` | view system status |
| `/session` | switch chat session |
| `/model` | change model |
| `/help` | show available commands |

---

# Troubleshooting

### Gateway Not Responding

Run a health check:

```bash
openclaw doctor
```

Check gateway status:

```bash
openclaw gateway status
```

---

# Next Steps

After completing the integration, you can:

- Add messaging channels (Telegram, Slack, etc.)
- Enable agent skills
- Connect external APIs
- Build automated AI workflows
