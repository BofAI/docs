## Quick Start

**Before running this script, please ensure:**

1. Node.js 22 or higher is installed
2. OpenClaw is installed and initialized (you have run `openclaw onboard`)
3. Network connection is normal, and the BANK OF AI API is accessible

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

![](https://files.readme.io/354a3d414f37e7df28f2cbf92dd055db9b67a20cab8738f6d5ac007226b6931b-image.png)

<br />

***

### 2. Run the Installation Script

Depending on your operating system, execute the corresponding command above. The script will automatically:

- Check the environment (Node.js, OpenClaw, etc.)
- Prompt you to enter your API Key

![](https://files.readme.io/ef091efb8911db673af8a5eade7b281a52f641c93d41fbd57cb898ee91893e76-Image_16-3-2026_at_7.00PM.png)

***

### 3. Select a Default Model

After validating the API Key, the script will fetch the list of available models and prompt you to select a default model:

![](https://files.readme.io/be3b9162405e38988898261db3effa8adcf92b6d9e37181d36b32c1cf8bcd1e3-Image_16-3-2026_at_7.01PM.png)

>**Note:** Gemini series models are currently largely unusable in OpenClaw due to client fingerprinting strictness for function calls. Please choose with caution.

***

### 4. Complete Configuration

Once the selection is complete, the script will automatically:

- Back up the original configuration
- Update the OpenClaw configuration file
- Restart the Gateway

![](https://files.readme.io/a08c7fcee0cbe906042ef52fefa15348750ad5cd2db8c4f555f92ecabba72761-Image_16-3-2026_at_7.03PM.png)

<br />

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

> **Note:** Once you change the model via the Dashboard, command-line model switching will no longer work because the Dashboard automatically adds a `list` field to the config file.

![](https://files.readme.io/3668289b53d185d158dd8393f46c0e171c0d301b5bdc624792c8cf8e6f9c4936-16-3-26_6.56.png)

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
3. Network connection is normal, and the BANK OF AI API is accessible

**Q: How do I switch models?**

See point 5 in the **Detailed Steps** above.
