# Integrating OpenClaw with an LLM Gateway

## Table of Contents

- [Overview](#overview)
- [Step 1: Obtain an API Key](#step-1-obtain-an-api-key)
- [Step 2: Prepare Your System](#step-2-prepare-your-system)
- [Step 3: Install OpenClaw](#step-3-install-openclaw)
- [Step 4: Run the Initialization Wizard](#step-4-run-the-initialization-wizard)
- [Step 5: Configure the LLM Gateway](#step-5-configure-the-llm-gateway)
- [Step 6: Gateway Commands](#step-6-gateway-commands)
- [Step 7: Launch OpenClaw](#step-7-launch-openclaw)
- [Step 8: Useful CLI Commands](#step-8-useful-cli-commands)
- [Next Steps](#next-steps)

---

# Overview

OpenClaw (formerly ClawdBot or Moltbot) is an open-source personal AI assistant that runs locally on your machine.

Unlike cloud-only AI assistants, OpenClaw gives you control over:

- Local memory
- Filesystem access
- External tools
- Automation workflows

It can connect to messaging platforms such as:

- Telegram
- WhatsApp
- Lark
- DingTalk

This guide explains how to install OpenClaw and connect it to an **LLM Gateway** that exposes an **OpenAI-compatible API**.

Once connected, OpenClaw can use external large language models through the gateway.

---

# Step 1: Obtain an API Key

Before integrating OpenClaw with the **LLM Gateway**, you need an API key.

Visit the API key management page:

https://chat.bankofai.io/key

Steps:

1. Sign in to your account.
2. Generate or copy your **API Key**.
3. Store it securely.

You will use this key when configuring the gateway provider inside OpenClaw.

---

# Step 2: Prepare Your System

Make sure your environment meets the following requirements.

| Requirement | Details |
|---|---|
| Node.js | Version **20 LTS or higher** |
| Operating System | macOS / Linux / Windows (WSL2 recommended) |
| Package Manager | npm |

Check Node.js version:

```bash
node -v
```

![Check Node.js version](https://files.readme.io/ac27744855c7066d117a856e7005166662e707462312b1925c4e368f5c9c7427-1.png)

If your version is below 20, install or upgrade Node.js.

---

# Step 3: Install OpenClaw

Install OpenClaw globally:

```bash
npm install -g openclaw
```

Verify installation:

```bash
openclaw --version
```

![Verify OpenClaw installation](https://files.readme.io/6f39989ed49f307a5168bd934c4ffaf2a79db8a2268c6959c3bb731f43138598-2.png)

---

## Troubleshooting Installation

### Sharp module error

Run:

```bash
npm install -g openclaw --force
```

### openclaw command not found

Find npm global path:

```bash
npm config get prefix
```

Ensure the path is included in your shell `PATH`.

---

# Step 4: Run the Initialization Wizard

Start the onboarding wizard:

```bash
openclaw onboard
```

The wizard will guide you through several setup steps.

---

## 4.1 Model Provider

When asked to choose a model provider, select:

**Skip for now**

We skip this step because the **LLM Gateway will be configured manually in the configuration file**.

![Skip model provider](https://files.readme.io/458a23b58f79ec97f4fee7ed6668a6a799cb37f95be57ddfe96830ad77bb2bb5-4.png)

---

## 4.2 Communication Channels

Choose messaging channels if desired.

You can skip this step and add them later.

![Skip channels](https://files.readme.io/178a9aded9bb4934dcaf7445c0c4edf4569836183ac6019b8c8d08e2917b4549-5.png)

---

## 4.3 Skills

For beginners, select:

**No**

You can enable skills later.

![Skip skills](https://files.readme.io/d4155d69eb1dd69c1586fa5ab844c602914b0b5a1934265bd97e1f8444b40b5a-6.png)

---

# Step 5: Configure the LLM Gateway

Open the configuration file:

```bash
~/.openclaw/openclaw.json
```

Add the gateway provider configuration.

Example:

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "llm-gateway": {
        "base_url": "https://api.example.com/v1",
        "api_key": "{YOUR_API_KEY}",
        "api": "openai-completions",
        "models": [
          { "id": "gpt-5.2", "name": "gpt-5.2" },
          { "id": "gpt-5-mini", "name": "gpt-5-mini" },
          { "id": "gpt-5-nano", "name": "gpt-5-nano" },
          { "id": "claude-opus-4.6", "name": "claude-opus-4.6" },
          { "id": "claude-sonnet-4.6", "name": "claude-sonnet-4.6" },
          { "id": "claude-haiku-4.5", "name": "claude-haiku-4.5" }
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

## Set Default Model

In the same configuration file:

```json
{
  "agents": {
    "default": {
      "model": "llm-gateway/gpt-5-nano"
    }
  }
}
```

---

## Restart Gateway

```bash
openclaw gateway restart
```

---

## Test the Connection

```bash
openclaw agent --agent main --message "How are you doing today?"
```

If the gateway is configured correctly, the agent will respond.

![Successful response](https://files.readme.io/312c6feb51ea9f4071b75efd3182ef0507a6981baebd3bf7e8d57dec33978efd-7.png)

---

# Step 6: Gateway Commands

| Action | Command |
|---|---|
| Install Gateway | `openclaw gateway install` |
| Start Gateway | `openclaw gateway start` |
| Stop Gateway | `openclaw gateway stop` |
| Restart Gateway | `openclaw gateway restart` |
| Check Status | `openclaw gateway status` |

---

# Step 7: Launch OpenClaw

## Web Dashboard

Start the web interface:

```bash
openclaw ui
```

OpenClaw will display the **local access URL** in the terminal.

---

## Terminal UI

Launch the terminal interface:

```bash
openclaw tui
```

![OpenClaw TUI](https://files.readme.io/9ca9be0db1c21be12488934030c8ef3076c17fbb4fc26cfdb0e71425e46d121d-8.png)

Useful commands:

| Command | Description |
|---|---|
| `/status` | View system status |
| `/session` | Switch session |
| `/model` | Change model |
| `/help` | Show command list |

---

# Step 8: Useful CLI Commands

Check model status:

```bash
openclaw models status
```

List channels:

```bash
openclaw channels list
```

Search memory:

```bash
openclaw memory search "keyword"
```

Open documentation:

```bash
openclaw docs
```

---

# Next Steps

You can now extend your OpenClaw setup by:

- Adding messaging channels (e.g. Telegram)
- Enabling skills
- Connecting external APIs
- Customizing model routing
- Building automated AI workflows
