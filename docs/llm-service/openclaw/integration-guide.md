# Integrating OpenClaw with Bank of AI

> **From Zero to Private Agent: Deploy OpenClaw with Bank of AI in 15 Minutes**

OpenClaw (formerly ClawdBot or Moltbot) is an open-source personal AI assistant that runs locally on your machine. Unlike cloud-based SaaS tools, it gives you full control over your data and workflows.

You can interact with OpenClaw through familiar platforms such as WhatsApp, Telegram, Lark, and DingTalk to handle emails, manage calendars, write code, or automate tasks.

OpenClaw is more than a chatbot — it is a fully functional AI agent with:

- Persistent memory  
- Access to your local files and the internet  
- Extensible capabilities through "skills"  

Thanks to its open-source and self-hosted nature, OpenClaw has built a strong developer community with use cases ranging from business automation to personal productivity.

This guide walks you through installing OpenClaw, configuring it, and connecting it to the **Bank of AI API**. By the end, you will have your own private AI agent running locally.

---

## Step 1: Get Your Bank of AI API Key

1. Log in to [Bank of AI Chat](https://chat.bankofai.io/chat)  
2. Go to the **API Key Management** page  
3. Generate your **API Key** `api_key`  
4. Save it securely — you will need it later  

---

## Step 2: Prepare Your System

Before installing OpenClaw, make sure your system meets the following requirements.

OpenClaw is designed for Unix-like systems, but also works on Windows via **WSL2 (Windows Subsystem for Linux 2)**.

### Requirements

| Requirement | Details |
|------------|--------|
| Node.js | Version 22 or higher |
| Operating System | macOS, Linux, or Windows (WSL2) |
| Package Manager | npm (recommended) or pnpm |

### Check Your Environment

Run:

```bash
node -v
```

If the version is below **v22.0.0**, or the command is not found, install or upgrade Node.js.

---

## Step 3: Install OpenClaw

The easiest way to install OpenClaw is via npm:

```bash
npm install -g openclaw
```

This will:

- Install OpenClaw globally  
- Set up required dependencies  
- Enable the `openclaw` command  

---

### Troubleshooting

#### Sharp Module Error

On some systems (especially macOS with Homebrew), you may encounter issues with the `sharp` module.

Fix it by forcing prebuilt binaries:

```bash
npm install -g openclaw --force
```

---

#### `openclaw: command not found`

This means your system cannot find global npm binaries.

1. Check npm global path:

```bash
npm config get prefix
```

2. Example output:

```text
/usr/local
```

3. Add it to PATH:

```bash
export PATH="/usr/local/bin:$PATH"
```

4. Apply changes:

```bash
source ~/.zshrc
```

(or `~/.bashrc` depending on your shell)

---

## Step 4: Complete the Initialization Wizard

After installation, OpenClaw should start an onboarding wizard automatically.

If not, run:

```bash
openclaw onboard
```

---

### Wizard Steps

#### 1. AI Model Configuration

You will be asked to provide an API key for model providers.

👉 Select:

```text
Skip for now
```

We will configure **Bank of AI** in the next step.

---

#### 2. Communication Channels

Select the platforms you want to use:

- Telegram  
- WhatsApp  
- Lark  

---

#### 3. Skills

Recommended:

```text
No
```

Use **Space** to select and **Enter** to confirm.

---

### After Setup

Once the wizard completes and the UI launches, you are ready to connect OpenClaw to the **Bank of AI API**.
