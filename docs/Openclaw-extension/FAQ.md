# FAQ

Don't panic when you see an error — it's usually just a small setting that's not configured properly. We've listed the most common issues in order of frequency:

---

## Errors During Installation

### Error Says "command not found: node" or "npm install Failed"

**In short**: Your computer doesn't have Node.js installed, or the version is too old.

**How to fix**: Go to the [Node.js official website](https://nodejs.org/) and download the latest stable version (LTS, v18 or higher recommended). Install it like any regular software by clicking "Next" all the way through. Then close the terminal window and run the installation command again.

### Error Says "command not found: git"

**In short**: Your computer is missing Git, a tool used to download skill packs.

**How to fix**: Go to the [Git official website](https://git-scm.com/downloads) and download and install it.

### AgentWallet Installation Failed

**How to fix**:

1. Double-check that your Node.js version is new enough.
2. Sometimes it's simply a network timeout — wait a couple of minutes and run the installation command again.
3. If it keeps getting stuck, try manually deleting the `~/.agent-wallet` (Mac/Linux) or `%USERPROFILE%\.agent-wallet` (Windows) folder and starting over from scratch.

### Error Says "Running Scripts Is Disabled on This System" (Windows)

**Reason**: Your PowerShell execution policy is too strict to run scripts.

**How to fix**: Don't double-click `install.ps1` directly. Use one of these two methods instead:

1. **Recommended**: Double-click `install.bat` — it automatically bypasses the execution policy.
2. Or manually run in PowerShell: `powershell -ExecutionPolicy Bypass -File install.ps1`

### Terminal Shows Garbled Characters or Boxes (Windows)

**Reason**: Your terminal doesn't support ANSI color escape codes.

**How to fix**: The installer automatically tries to enable virtual terminal processing. If you still see garbled output:

1. Make sure your system is **Windows 10 build 1511** or later.
2. We recommend using **Windows Terminal** (free from the Microsoft Store) instead of the default cmd.exe or legacy PowerShell window.

---

## Installation Finished, But AI Acts Clueless

### AI Says "I Don't Have Blockchain Tools" or "I Don't Know What SunSwap Is"

**Most likely cause**: You were too eager after installation and **didn't restart the OpenClaw software**.

**How to fix**: Completely quit OpenClaw (on Mac press `Command+Q`, on Windows right-click the taskbar icon and quit or press `Alt+F4`), then reopen it so the AI can reload its new brain.

### AI Can Fetch Data, But Answers Are Messy and Often Wrong?

**Most likely cause**: The underlying AI model version you're using is too weak. It's like asking a grade-schooler to do high school math — it's not that they're not trying, they just don't have the capacity.

**How to fix**: Open OpenClaw settings and upgrade to a more powerful model version. The stronger the model, the more accurately AI understands your commands and the fewer mistakes it makes when calling tools.

### Why Can Others Send Transfers While My AI Can Only Read Data?

**Reason**: Your AI is currently in ultra-safe "read-only mode." This is because you skipped the AgentWallet configuration during installation and didn't provide it with wallet keys.

**How to fix**: Run the installation script again. At the AgentWallet setup level, follow the prompts carefully to properly configure your wallet. After configuring and restarting, transfer and trading functions will be activated.

---

## Passwords and Security Concerns

### Private Key Was Entered Wrong or Error Says "Invalid Private Key"

**Reason**: The current installer uses AgentWallet to manage wallets, so you generally don't need to manually enter private keys anymore. However, if you're using the BNB Chain toolbox (bnbchain-mcp) and manually configuring a private key, you might have accidentally copied an extra space or line break.

**How to fix**: Carefully copy it again. EVM (BNB/Ethereum) private keys should start with `0x` — if you're manually editing the file, make sure you don't miss that prefix.

### AI Reports "Rate Limited" or "429 Error"

**In short**: You're making AI query data too fast, and the free network channel thinks you're a bot and temporarily blocked you.

**How to fix**:

1. **Quick fix**: Wait a few minutes before asking again.
2. **Permanent fix**: Go to [TronGrid](https://www.trongrid.io/) and apply for a free dedicated API Key. Enter this key during installation, and AI will be able to use the VIP express lane.

---

## Tinkering Freely (Uninstall & Reinstall)

### Can I Install Just One Skill Without the Others?

Absolutely! When the installation wizard reaches Level 4, it will list all skills. Just use the Space key to check only the ones you want, leave the rest unchecked, and press Enter to confirm.

### I'm Done With It — How Do I Uninstall?

The simplest brute-force method: Open your file manager, find the `~/.openclaw/skills/` (Mac/Linux) or `%USERPROFILE%\.openclaw\skills\` (Windows) directory, delete the skill folder(s) you no longer want, then restart the AI software — they'll be completely gone.

### I Messed Everything Up — Can I Reinstall?

Reinstall anytime! Don't worry about breaking your computer.

- **Option 1 (Normal installation)**: Run the script again and it will automatically patch whatever's missing.
- **Option 2 (Clean install)**: If you want to start completely from scratch, choose this one. It will wipe all your old toolboxes, skills, and configurations clean, giving you a fresh new environment. To prevent accidental triggers, it will ask you to manually type `CLEAN` to confirm.

---

## Windows-Specific Questions

### Does the Installer Need Admin Privileges?

Nope. The installer only writes to config files under your user directory. It doesn't modify system files, the registry, or Program Files.

### Is the Windows Experience the Same as Mac/Linux?

Identical. The Windows installer (`install.ps1`) is a full port of the Linux/macOS version (`install.sh`) — same installation flow, same multi-select menus, same config file structure. The only differences are file paths (`~/` becomes `%USERPROFILE%\`) and file permissions (`chmod 600` becomes `icacls` ACL).

### Can I Use WSL (Windows Subsystem for Linux)?

Yes, but not recommended. If you install inside WSL, config files are written to the WSL Linux filesystem, not Windows `%USERPROFILE%`. This means a native Windows OpenClaw won't be able to read those configs. If your OpenClaw is the native Windows version, use `install.bat` or the `irm | iex` command instead.

---

## Still Can't Figure It Out?

👉 Go back to **[Quick Start](./QuickStart.md)** and follow along from step one again — that usually solves 99% of the problems.
