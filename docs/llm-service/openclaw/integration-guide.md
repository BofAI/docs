# Integrating OpenClaw with an LLM Gateway

## Overview

From zero to a private AI agent in about 15 minutes.

OpenClaw (formerly ClawdBot or Moltbot) is an open-source personal AI assistant that runs locally on your own machine. Instead of relying on a cloud-only SaaS workflow, it gives you more control over your data, memory, files, and automations.

You can connect it to messaging platforms such as WhatsApp, Telegram, Lark, and DingTalk, and use it to handle email, manage calendars, write code, or automate everyday tasks.

OpenClaw is more than a chatbot. It acts like a real agent with persistent memory, local file system access, internet access, and expandable skills.

This guide walks through downloading, installing, and configuring OpenClaw, then connecting it to an **LLM Gateway** through a compatible API.

---

# Step 1: Obtain an API Key

Before integrating OpenClaw with the **LLM Gateway**, you need to generate an API key.

1. Visit the API key management page  
   https://chat.bankofai.io/key

2. Sign in to your account.

3. Create or copy your **API Key**.

You will use this key later when configuring the model provider inside OpenClaw.

Keep your API key secure and do not share it publicly.

---

# Step 2: Prepare Your System

Before installing OpenClaw, make sure your system meets these requirements.

| Requirement | Details |
|---|---|
| Node.js | Version 22 or higher |
| Operating System | macOS, Linux, or Windows via WSL2 |
| Package Manager | npm recommended |

Check your Node.js version:

```bash
node -v
```

![Check Node.js version](https://files.readme.io/ac27744855c7066d117a856e7005166662e707462312b1925c4e368f5c9c7427-1.png)

If your version is lower than **v22.0.0**, install or upgrade Node.js first.

---

# Step 3: Install OpenClaw

For beginners, the easiest installation method is:

```bash
npm install -g openclaw
```

Verify the installation:

```bash
openclaw --version
```

![Verify OpenClaw installation](https://files.readme.io/6f39989ed49f307a5168bd934c4ffaf2a79db8a2268c6959c3bb731f43138598-2.png)

### Troubleshooting

#### Sharp module error

Run:

```bash
npm install -g openclaw --force
```

#### openclaw command not found

Find npm global path:

```bash
npm config get prefix
```

Add it to your PATH if necessary.

---

# Step 4: Complete the Initialization Wizard

Run:

```bash
openclaw onboard
```

The wizard includes three parts.

---

## 4.1 Model Configuration

When asked to choose a model provider, select:

**Skip for now**

We will configure the LLM Gateway manually.

![Skip model provider](https://files.readme.io/458a23b58f79ec97f4fee7ed6668a6a799cb37f95be57ddfe96830ad77bb2bb5-4.png)

---

## 4.2 Communication Channels

Choose messaging platforms.

You may skip for now.

![Skip channels](https://files.readme.io/178a9aded9bb4934dcaf7445c0c4edf4569836183ac6019b8c8d08e2917b4549-5.png)

---

## 4.3 Skills

For beginners select:

**No**

![Skip skills](https://files.readme.io/d4155d69eb1dd69c1586fa5ab844c602914b0b5a1934265bd97e1f8444b40b5a-6.png)

---

# Step 5: Configure the LLM Gateway

Open the configuration file:

```bash
~/.openclaw/openclaw.json
```

Add a provider configuration.

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "llm-gateway": {
        "baseUrl": "https://api.example.com/v1/",
        "apiKey": "{YOUR_API_KEY}",
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

- `baseUrl`
- `apiKey`

with your real values.

---

## Set Default Model

In the same file:

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

If successful, the agent will respond.

![Successful response](https://files.readme.io/312c6feb51ea9f4071b75efd3182ef0507a6981baebd3bf7e8d57dec33978efd-7.png)

---

# Step 6: Gateway Commands

| Action | Command |
|---|---|
| Install | `openclaw gateway install` |
| Start | `openclaw gateway start` |
| Stop | `openclaw gateway stop` |
| Restart | `openclaw gateway restart` |
| Status | `openclaw gateway status` |

---

# Diagnostic Commands

```bash
openclaw doctor
```

Runs a health check.

---

# Step 7: Launch OpenClaw

## Web Dashboard

```bash
openclaw ui
```

Default:

```
http://127.0.0.1:18789
```

---

## Terminal UI

```bash
openclaw tui
```

![OpenClaw TUI](https://files.readme.io/9ca9be0db1c21be12488934030c8ef3076c17fbb4fc26cfdb0e71425e46d121d-8.png)

Useful commands:

| Command | Description |
|---|---|
| `/status` | system status |
| `/session` | switch session |
| `/model` | change model |
| `/help` | command list |

---

# Step 8: Useful CLI Commands

Check models:

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

You can now:

- Add Telegram or other messaging channels
- Enable skills
- Connect additional APIs
- Customize models
- Build automated AI workflows
