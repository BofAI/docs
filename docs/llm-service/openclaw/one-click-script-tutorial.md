## Quick Start

**Before running this script, please ensure:**

1. Node.js 22 or higher is installed
2. OpenClaw is installed and initialized (you have run `openclaw onboard`)
3. Network connection is normal, and the AINFT API is accessible

### Script Commands

**Linux & macOS:**

Mac users: search for "Terminal" in Applications, open it, and enter the command below:

```bash
curl https://chat.bankofai.io/scripts/openclaw-install-bankofai-provider.sh | bash
```

**Windows PowerShell:**

Windows users: search for "PowerShell" in the Start menu, open it, and enter the command below (CMD is not supported)

```powershell
iwr https://chat.bankofai.io/scripts/openclaw-install-bankofai-provider.ps1 | iex
```

***

## Detailed Steps

### 1. Apply for an API Key

1. Log in to the [BANK OF AI Platform](https://chat.bankofai.io/)
2. Go to the [API Key Management Page](https://chat.bankofai.io/key)
3. Click to apply for a new API Key


![](https://files.readme.io/9011e70e9009bd0e6bcf318f8100e23e7b483a783fc7786b03e03107437d05d6-image.png)

<br />

***

### 2. Run the Installation Script

Depending on your operating system, execute the corresponding command above. The script will automatically:

- Check the environment (Node.js, OpenClaw, etc.)
- Prompt you to enter your API Key

![](https://files.readme.io/1ab2f1ab9d444b570d435296f06270b541186c9d487bc795b2106b873baf7a23-image.png)

***

### 3. Select a Default Model

After validating the API Key, the script will fetch the list of available models and prompt you to select a default model:

![](https://files.readme.io/f420e5e6e6214f0e02c56c546a3625f5793bb1dc6e5cb8ef4aed6e547a054308-image.png)

**:exclamation: Note:exclamation: **Gemini series models are currently largely unusable in OpenClaw due to client fingerprinting strictness for function calls. Please choose with caution.

***

### 4. Complete Configuration

Once the selection is complete, the script will automatically:

- Back up the original configuration
- Update the OpenClaw configuration file
- Restart the Gateway

![](https://files.readme.io/7772254ccf61a1147f9aa87f036ce1045b1077f824dede9a93781a5738c542ba-image.png)

***

### 5. Switch Models

You can switch the currently used model in two ways:

- Command Line

```bash
openclaw models set bankofai/<model_name>
```

Or manually edit the `~/.openclaw/openclaw.json` configuration file.

- Web UI - Dashboard

Visit <http://127.0.0.1:18789/> (18789 is the default port for OpenClaw) in your browser to access the OpenClaw Dashboard. Click "Agent" in the left navigation menu, and select the desired model in the Primary model dropdown:
> **Please note:** Once you change the model via the Dashboard, command-line model switching will no longer work because the Dashboard automatically adds a `list` field to the config file.

![](https://files.readme.io/0e5b17eef08531b83f513a737522772e52a50602c02ec62d0ef147611f95ac24-image.png)

<br />

***

## Compatibility Testing

| Operating System | Status   |
| :--------------- | :------- |
| Ubuntu 24.04     | ✅ Passed |
| Windows 11 25H2  | ✅ Passed |
| macOS 24.6.0     | ✅ Passed |

***

## FAQ

**Q: What should I do if the script execution fails?**

A: Please ensure that:

1. Node.js 22 or higher is installed
2. OpenClaw is installed and initialized (you have run `openclaw onboard`)
3. Network connection is normal, and the AINFT API is accessible

**Q: How do I switch models?**

See point 5 in the **Detailed Steps** above.
