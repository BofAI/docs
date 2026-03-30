# Quick Start

Our goal: **Spend a few minutes following the wizard, clicking a few buttons, and get your AI to successfully fetch its first piece of on-chain data.**

---

## 🕹️ Prerequisites

Before you begin, make sure the following basic software is installed on your computer (if not, download and install them from their official websites just like any regular software):

1. **OpenClaw**: Your AI assistant software.
2. **Node.js** (must be v20 or above): The runtime environment for skill packs. *(Extremely important — older versions will definitely cause errors!)*
3. **Git**: A small tool used to download skill packs.
4. **Python 3**: A helper used by the installation wizard to process configuration files.

---

## 🚀 Step 1: One-Click Installation

Open the "Terminal" on your computer (that black window).

- **Mac:** Press `Command + Space`, type `Terminal` in the search box, and hit Enter.

**Copy the entire line below**, paste it into the terminal, and press Enter:

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

🚑 **First Aid: Got an error right after pressing Enter?** If the screen says `command not found: node` or `python3`, it means your computer is missing the prerequisites mentioned above. 👉 [Click here to see how to fix it](./FAQ.md#error-says-command-not-found-node-or-npm-install-failed)

If there are no errors, an English wizard will appear on screen. Think of it as a text-based mini-game with 4 levels:

### 🟢 Level 1: Choose Installation Mode

The screen will ask you which mode to use. Type `1` (normal installation) on your keyboard, then press Enter. This is the most hassle-free option and preserves your previous settings.

### 🟢 Level 2: Configure "AI's Personal Vault" (AgentWallet)

The wizard will automatically install a tool called AgentWallet, which securely stores your AI's wallet keys.

If you're a beginner, just close your eyes and press Enter all the way through — the default values are perfectly fine.

(🚑 Got stuck with an error? 👉 [Click here to see how to fix AgentWallet installation failures](./FAQ.md#agentwallet-ai-vault-installation-failed))

### 🟢 Level 3: Pick Your Toolbox (Give AI "Hands")

The screen will list options like TRON (mcp-server-tron). Use the `↑` `↓` arrow keys to move, press **Space** to check, and press **Enter** to confirm.

⚠️ **Heads up**: The wizard might suddenly ask you for an API Key!

- **What's that?** It's a VIP pass — having one means data queries won't be throttled.
- **I don't have one right now?** Just press Enter to skip! Leaving it blank is totally fine and won't affect your installation at all.

### 🟢 Level 4: Pick Your Skill Packs (Give AI a "Brain")

The screen will list skills like sunswap (token swapping), tronscan (data lookup), etc. Use **Space** to check and **Enter** to confirm.

If you see any prompts asking for keys that you don't understand, just press Enter to skip them all.

When `Installation Complete!` lights up at the bottom of the screen — congratulations, you've passed all levels!

---

## 🎉 Step 2: Restart and Witness the Magic

After installation, there's one step you absolutely cannot skip: **Completely close your OpenClaw software, then reopen it.**

🚑 **First Aid: AI acting clueless?** If it says "I don't know what SunSwap is," 99% of the time it's because you didn't restart. 👉 [Click here to see how to properly restart](./FAQ.md#ai-says-i-dont-have-blockchain-tools-or-i-dont-know-what-sunswap-is)

Open the chat window and send your AI its first command:

```
Check the current block height on the TRON mainnet.
```

If it thinks for a few seconds and then reports back a number — awesome! Your AI has successfully connected to the blockchain!

Try another one:

```
How much TRX can I get for 100 USDT on SunSwap right now?
```

---

*(That covers the beginner essentials. If you've got the hang of it, keep reading below 👇)*

---

## 🛠️ How to Add API Keys (VIP Pass) After Installation?

Totally get it! You were just browsing during installation and pressed Enter to skip everything. Now that you're comfortable, here's how to fill in your API Keys for the "VIP express lane":

### Step 1: Figure Out Which "Key" You Need

| Key Name | What's It For? | Where to Get It for Free? |
| :--- | :--- | :--- |
| `TRONGRID_API_KEY` | Express lane for the TRON toolbox — without it you'll be throttled | Register for free at [trongrid.io](https://www.trongrid.io/) |
| `TRONSCAN_API_KEY` | Required for the TronScan data lookup skill | Apply for free at [tronscan.org](https://tronscan.org/#/myaccount/apiKeys) |
| `BANKOFAI_API_KEY` | Used for topping up or checking balance on BANK OF AI | Get it after logging in at [chat.bankofai.io/key](https://chat.bankofai.io/key) |

### Step 2: Enter Your Keys into the System

Once you have the corresponding key, choose the simple method below based on its type. **Don't forget to restart OpenClaw after filling it in!**

#### 🔧 Type A Keys: Add to "Hidden Notepad" (For TRONGRID and TRONSCAN)

1. Type `open -e ~/.zshrc` in the terminal and press Enter.
2. At the bottom of the text editor that opens, paste these lines (keep the double quotes `""`):
   ```
   export TRONGRID_API_KEY="paste_your_TronGrid_Key_here"
   export TRONSCAN_API_KEY="paste_your_TronScan_Key_here"
   ```
3. Press `Command + S` to save and close, then reopen the terminal or restart OpenClaw for changes to take effect.

#### 🔧 Type B Keys: One-Click Config File (For BANK OF AI)

If you have this key, simply copy and run the following command in the terminal (remember to replace the placeholder with your actual key):

**Configure BANK OF AI:**

```bash
mkdir -p ~/.mcporter && echo '{"api_key": "paste_your_BANKOFAI_API_KEY_here", "base_url": "https://api.bankofai.io/v1/"}' > ~/.mcporter/bankofai-config.json
```

---

## Still Stuck Somewhere?

That's totally normal! Everyone's computer environment is different.

Check out 👉 **[FAQ (Troubleshooting Guide)](./FAQ.md)** — we've already encountered and documented solutions for 99% of the weird issues out there.
