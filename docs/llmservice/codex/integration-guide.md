# Connect Codex with a B.AI API Key

This guide explains how to configure a B.AI API Key in Codex. After setup, Codex sends model requests through the B.AI Responses API.

Production Base URL:

```text
https://api.b.ai/v1
```

B.AI Responses API supports GPT and DeepSeek model families. Click **Fetch Models** and select a currently available model instead of relying on a fixed list in this guide.

CC Switch is recommended for managing the configuration. Advanced users can also configure Codex manually with `config.toml`.

## Before you begin

Make sure that you have:

- Installed Codex and can start it normally.
- Created a valid API Key in the B.AI console.
- Access to the target model and sufficient account balance.
- Installed CC Switch v3.16.1 or later when using CC Switch.

For the first connection, click **Fetch Models** and select a GPT model from the results. Switch models after you confirm that requests work.

## Option 1: Configure with CC Switch (recommended)

[CC Switch](https://github.com/farion1231/cc-switch) is a third-party open-source configuration manager for switching between model providers. Download it from the [official releases page](https://github.com/farion1231/cc-switch/releases).

### 1. Add B.AI as a provider

Open CC Switch, select **Codex**, and add a custom provider. Field names may vary by version; enter the following values:

| Setting | Value |
| --- | --- |
| Provider name | `B.AI` |
| Base URL | `https://api.b.ai/v1` |
| API Key | Your B.AI API Key |
| Model | Select a GPT model from **Fetch Models** |
| API protocol | `Responses` |
| Wire API | `responses` |
| Needs Local Routing | Off |

B.AI natively supports the Responses API, so local routing is not required. If your CC Switch version does not show `Wire API` or `Needs Local Routing`, select the Responses protocol and make sure that Codex routing takeover is not enabled.

### 2. Switch and restart Codex

Save the configuration, select **B.AI** as the active Codex provider, then fully quit and restart Codex so it reloads the configuration and model list.

### 3. Keep the Codex official sign-in (optional)

To continue using Codex desktop features that depend on an official account, sign in once and then enable:

```text
Settings → General → Codex App Enhancements
→ Keep official login when switching third-party providers
```

Codex may still show the official account after this setting is enabled. This is expected. The active provider is determined by CC Switch and `~/.codex/config.toml`; B.AI usage and charges are applied to your B.AI account.

Never copy, share, or edit `~/.codex/auth.json` manually, as it contains sensitive official sign-in information.

## Option 2: Configure Codex manually

Manual configuration is best suited to Codex CLI. CC Switch is recommended for Codex desktop.

### 1. Set an environment variable

macOS or Linux:

```bash
export BAI_API_KEY="<YOUR_BAI_API_KEY>"
```

Windows PowerShell:

```powershell
$env:BAI_API_KEY = "<YOUR_BAI_API_KEY>"
```

These commands apply only to the current terminal session. For long-term use, persist the variable through your operating system or terminal's secure mechanism. Do not put your API Key in project source code or version control.

### 2. Edit the Codex configuration file

User-level configuration file locations:

- macOS / Linux: `~/.codex/config.toml`
- Windows: `C:\\Users\\<username>\\.codex\\config.toml`

Add the following configuration:

```toml
model = "your-model-id"
model_provider = "bai"

[model_providers.bai]
name = "B.AI"
base_url = "https://api.b.ai/v1"
env_key = "BAI_API_KEY"
wire_api = "responses"
requires_openai_auth = false
```

If the file already contains `model`, `model_provider`, or `[model_providers.bai]`, update the existing entry instead of declaring it twice. Start or restart Codex from the same terminal session where `BAI_API_KEY` is set.

## Verify the connection

Start Codex and enter:

```text
Reply only with: B.AI Codex connection successful
```

If Codex returns a response, the integration is complete. You can also check the related model usage in the B.AI console to confirm that the request was processed by B.AI.

## Switch models

Change the model in CC Switch, or update the `model` field in `config.toml`:

```toml
model = "target-model-id"
```

The B.AI Responses API supports GPT and DeepSeek model families. Model availability depends on your account permissions, balance, and Codex version. Use the model list returned by B.AI `GET /v1/models` instead of relying on a fixed model list.

### Use a DeepSeek model

:::caution Disable Codex web search before using DeepSeek
Codex may expose its built-in web search tool by default, but DeepSeek models do not support that tool. Without this setting, the request may return an unsupported Web Search tool error.

After selecting a DeepSeek model, open `~/.codex/config.toml` and add this top-level option:

```toml
web_search = "disabled"
```

Keep the option above and outside the `[model_providers.bai]` block. Save the file, fully quit Codex, and restart it. This setting is required when using DeepSeek; remove or change it when switching to a model configuration that uses web search.
:::

Restart Codex after changing the model.

## Troubleshooting

| Issue | Possible cause | Resolution |
| --- | --- | --- |
| `401 Unauthorized` | API Key is missing, invalid, or expired | Check the Key and environment variable; create a new Key when necessary |
| `403 Forbidden` | Insufficient balance, unavailable model access, or account restriction | Check B.AI balance, account status, and model permissions |
| Model not found | Incorrect model ID or unavailable to the account | Query `GET /v1/models` and use an exact returned model ID |
| CC Switch change does not apply | Codex has not reloaded its configuration | Confirm B.AI is the active provider and fully restart Codex |
| `404` or streaming errors | Incorrect Base URL, protocol, or local routing configuration | Use the production URL, select Responses, and turn off local routing for B.AI |
| DeepSeek request reports an unsupported web search tool | Codex is exposing web search to a model that does not support it | Add the top-level `web_search = "disabled"` setting and restart Codex |
| Codex still shows an official account | Official sign-in preservation is enabled | This is expected; CC Switch and `config.toml` determine the actual provider |
| `BAI_API_KEY` is not set | The Codex process cannot read the variable | Restart Codex from the terminal session where the variable was set |

## Security recommendations

- Do not expose your API Key in chat, screenshots, public documentation, or code repositories.
- Do not write the API Key directly in `config.toml`; use an environment variable. When using CC Switch, enter it only through its official interface.
- Use separate API Keys for different projects and rotate them regularly.
- If you suspect a Key has been exposed, delete it in the B.AI console immediately and create a replacement.
- Download CC Switch only from its official repository.

## Related documentation

- [B.AI API reference](../api/API.md)
- [Codex configuration reference](https://developers.openai.com/codex/config-reference/)
- [CC Switch repository](https://github.com/farion1231/cc-switch)
- [CC Switch guide: preserve Codex official sign-in](https://github.com/farion1231/cc-switch/blob/main/docs/guides/codex-official-auth-preservation-guide-en.md)
