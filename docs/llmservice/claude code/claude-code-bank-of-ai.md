# Claude Code with BANK OF AI API

## Table of Contents

- [Getting Started](#getting-started)
- [Option 1: settings.json (Recommended)](#option-1-settingsjson-recommended)
- [Option 2: Environment Variables](#option-2-environment-variables)
- [Switching Models](#switching-models)
- [Available Models](#available-models)
- [FAQ](#faq)

***

## Getting Started

Complete the following two prerequisites before proceeding with configuration.

### Step 1: Install Claude Code

Choose the installation method for your operating system:

**macOS / Linux / WSL:**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell:**

```powershell
irm https://claude.ai/install.ps1 | iex
```

**npm (requires Node.js 18+):**

```bash
npm install -g @anthropic-ai/claude-code
```

### Step 2: Obtain a BANK OF AI API Key

1. Log in to the [BANK OF AI Chat Platform](https://chat.bankofai.io/chat)
2. Navigate to the [API Key Management Page](https://chat.bankofai.io/key)
3. Click to create a new API Key

> **Note:** Keep your API Key secure — you will need it in the configuration steps below.

Once both prerequisites are complete, choose either option below to configure the BANK OF AI API.

***

## Option 1: settings.json (Recommended)

This approach configures Claude Code via its own settings file, without modifying system environment variables.

### Steps

1. Locate the `settings.json` file in the Claude Code installation directory. If it does not exist, create a new one.
2. Add the following content:

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "Your-BANK-OF-AI-API-Key",
    "ANTHROPIC_BASE_URL": "https://api.bankofai.io/",
    "ANTHROPIC_MODEL": "claude-sonnet-4.6",
    "API_TIMEOUT_MS": "3000000"
  }
}
```

> **Tip:** You can replace the `ANTHROPIC_MODEL` value with any model from the [Available Models](#available-models) list.

3. Save the file and restart your terminal.
4. Verify the configuration:

```bash
claude --version
claude
```

If Claude Code starts successfully and responds using the BANK OF AI model, the configuration is complete.

***

## Option 2: Environment Variables

This approach is suitable when you need the configuration to take effect globally.

### Set Environment Variables

Add the following lines to the appropriate shell configuration file:

#### Bash (Linux / macOS)

Edit `~/.bashrc` (or `~/.bash_profile` on macOS):

```bash
# Claude Code - BANK OF AI Provider Configuration
export ANTHROPIC_BASE_URL="https://api.bankofai.io/"
export ANTHROPIC_AUTH_TOKEN="your-api-key-here"
export ANTHROPIC_MODEL="claude-sonnet-4.6"
# End of BANK OF AI Provider Configuration
```

Apply the changes:

```bash
source ~/.bashrc
```

#### Zsh (Linux / macOS)

Edit `~/.zshrc`:

```bash
# Claude Code - BANK OF AI Provider Configuration
export ANTHROPIC_BASE_URL="https://api.bankofai.io/"
export ANTHROPIC_AUTH_TOKEN="your-api-key-here"
export ANTHROPIC_MODEL="claude-sonnet-4.6"
# End of BANK OF AI Provider Configuration
```

Apply the changes:

```bash
source ~/.zshrc
```

#### PowerShell (Windows)

Edit your `$PROFILE` file:

```powershell
# Claude Code - BANK OF AI Provider Configuration
$env:ANTHROPIC_BASE_URL = "https://api.bankofai.io/"
$env:ANTHROPIC_AUTH_TOKEN = "your-api-key-here"
$env:ANTHROPIC_MODEL = "claude-sonnet-4.6"
# End of BANK OF AI Provider Configuration
```

Apply the changes:

```powershell
. $PROFILE
```

#### Configuration File Path Reference

|    OS   |    Shell   | Configuration File               |
| :-----: | :--------: | :------------------------------- |
|  Linux  |    Bash    | `~/.bashrc`                      |
|  Linux  |     Zsh    | `~/.zshrc`                       |
|  macOS  |    Bash    | `~/.bashrc` or `~/.bash_profile` |
|  macOS  |     Zsh    | `~/.zshrc`                       |
| Windows | PowerShell | `$PROFILE`                       |

### Verify the Configuration

```bash
claude --version
claude
```

If Claude Code starts successfully and responds using the BANK OF AI model, the configuration is complete.

***

## Switching Models

### Temporary Switch (Current Session Only)

**Linux / macOS:**

```bash
ANTHROPIC_MODEL=claude-opus-4.6 claude
```

**Windows PowerShell:**

```powershell
$env:ANTHROPIC_MODEL="claude-opus-4.6"; claude
```

### Permanent Switch

Update the `ANTHROPIC_MODEL` value in your `settings.json` or shell configuration file, then restart the terminal or reload the configuration.

***

## Available Models

| Model Name          | Provider  |
| :------------------ | :-------- |
| `claude-opus-4.6`   | Anthropic |
| `claude-opus-4.5`   | Anthropic |
| `claude-sonnet-4.6` | Anthropic |
| `claude-sonnet-4.5` | Anthropic |
| `claude-haiku-4.5`  | Anthropic |
| `gpt-5.2`           | OpenAI    |
| `gpt-5-mini`        | OpenAI    |
| `gpt-5-nano`        | OpenAI    |
| `gemini-3.1-pro`    | Google    |
| `gemini-3-flash`    | Google    |
| `kimi-k2.5`         | Moonshot  |
| `glm-5`             | Zhipu AI  |
| `minimax-m2.5`      | MiniMax   |

> For the full and up-to-date model list, query the Models API provided by BANK OF AI.

***

## FAQ

<details>
<summary><strong>Q: I get "claude command not found" — what should I do?</strong></summary>

Install Claude Code first:

- **Linux / macOS:** `curl -fsSL https://claude.ai/install.sh | bash`
- **Windows:** `irm https://claude.ai/install.ps1 | iex`

Restart your terminal after installation.

</details>

<details>
<summary><strong>Q: The setup script fails — what should I check?</strong></summary>

Verify the following:

1. Claude Code is installed (`claude --version` outputs a version number)
2. `curl` is available (Linux / macOS)
3. Your network can reach `https://api.bankofai.io/`

If the issue persists, try [Option 2: Environment Variables](#option-2-environment-variables) for manual configuration.

</details>

<details>
<summary><strong>Q: How do I verify the configuration is working?</strong></summary>

Check that the environment variables are set:

**Linux / macOS:**

```bash
echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_MODEL
```

**Windows PowerShell:**

```powershell
$env:ANTHROPIC_BASE_URL
$env:ANTHROPIC_MODEL
```

</details>

<details>
<summary><strong>Q: How do I check which model is currently in use?</strong></summary>

After launching Claude Code, type:

```text
/status
```

</details>

<details>
<summary><strong>Q: Why do I get 403 access_denied when calling some models?</strong></summary>

Models with a **Premium** tag may return `403 access_denied` if your BANK OF AI account has not been recharged before.

A valid API key alone is not sufficient for Premium models. Please recharge your account first, then try again.

</details>

<details>
<summary><strong>Q: How do I remove the BANK OF AI provider configuration?</strong></summary>

Edit your shell configuration file and delete everything between the following comment blocks:

```bash
# Claude Code - BANK OF AI Provider Configuration
...
# End of BANK OF AI Provider Configuration
```

Then reload the configuration file (e.g., `source ~/.zshrc`).

</details>

***

> **Version:** v1.0 | **Last Updated:** 2026-03-27
