# Integrating OpenClaw with BankOfAI
## From Zero to Private Agent: Deploying OpenClaw with BankOfAI in 15 Minutes

OpenClaw (formerly ClawdBot or Moltbot) is an open-source personal AI assistant that runs locally on your machine. Unlike cloud-based SaaS tools, it gives you full control over your data, workflows, and integrations.

With OpenClaw, you can interact through Telegram, WhatsApp, Lark, or directly via a web dashboard to:

- Automate tasks
- Manage files and memory
- Execute real-world actions
- Build powerful AI agents with persistent memory

This guide walks you from **zero to a fully working private AI agent powered by BankOfAI**.

---

# Step 1: Get Your BankOfAI API Key

1. Visit: https://chat.bankofai.io/chat  
2. Log in to your account  
3. Navigate to the API Key page  
4. Generate and copy your API key  

---

# Step 2: Prepare Your System

Make sure your system meets the following requirements:

| Requirement | Details |
|---|---|
| Node.js | **Recommended: v24** |
| | Supported: v22 LTS (>=22.16) |
| OS | macOS / Linux / Windows (WSL2) |
| Package Manager | npm (default) |

Check your Node version:

```bash
node -v
```

---

# Step 3: Install OpenClaw

### Recommended (Official Script)

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### Alternative (npm global install)

```bash
npm install -g openclaw
```

---

## Fix: Command Not Found

If `openclaw` is not recognized:

```bash
npm config get prefix
```

Then add to PATH:

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

Apply changes:

```bash
source ~/.zshrc
```

---

## Fix: Sharp Module Error (macOS)

```bash
npm install -g openclaw --force
```

---

# Step 4: Run Onboarding

```bash
openclaw onboard --install-daemon
```

During setup:

### AI Model
→ Select **Skip for now**

### Channels
→ Optional (you can skip)

### Skills
→ Select **No**

---

# Step 5: Configure BankOfAI

Open config file:

```bash
~/.openclaw/openclaw.json
```

---

## 5.1 Add BankOfAI Provider

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "bankofai": {
        "baseUrl": "https://api.bankofai.io/v1/",
        "apiKey": "{BANKOFAI_API_KEY}",
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

---

## 5.2 Set Default Model

```json
{
  "agents": {
    "default": {
      "model": "bankofai/gpt-5-nano"
    }
  }
}
```

---

## 5.3 Apply Changes

OpenClaw usually hot-reloads config automatically.

If not:

```bash
openclaw gateway restart
```

---

## 5.4 Test Your Setup

```bash
openclaw agent --message "Hello, are you working?"
```

---

# Step 6: Diagnostics

## Health Check

```bash
openclaw doctor
```

## Gateway Status

```bash
openclaw gateway status
```

---

## Gateway Commands

| Action | Command |
|---|---|
| Install | `openclaw gateway install` |
| Start | `openclaw gateway start` |
| Stop | `openclaw gateway stop` |
| Restart | `openclaw gateway restart` |
| Status | `openclaw gateway status` |

---

# Step 7: Start Using OpenClaw

## Option 1: Dashboard (Recommended)

```bash
openclaw dashboard
```

Open in browser:

```
http://127.0.0.1:18789
```

You can:

- Chat with your AI
- View memory
- Configure models
- Monitor system status

---

## Option 2: Terminal UI

```bash
openclaw tui
```

### Commands

| Command | Description |
|---|---|
| /status | Check system status |
| /session | Switch session |
| /model | Change model |
| /help | Help |

---

# Step 8: Useful Commands

## Model Status

```bash
openclaw models status
```

## Channels

```bash
openclaw channels list
```

## Memory Search

```bash
openclaw memory search "keyword"
```

## Docs

```bash
openclaw docs
```

---

# ✅ Done

You now have a fully working **OpenClaw + BankOfAI private AI agent**.

You can now:

- Build automation workflows  
- Connect Telegram bots  
- Execute on-chain operations  
- Create your own AI agent product  

---

🚀 Welcome to your personal AI infrastructure.
