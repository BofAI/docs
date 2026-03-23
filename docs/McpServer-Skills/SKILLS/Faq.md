# FAQ

Questions are ordered by urgency — the ones you're most likely to hit first are at the top, concepts at the bottom.

---

## Something Went Wrong

### The AI says "skill not found" or gives a completely wrong answer

Tell the AI exactly where to find the skill file:

```
Please read ~/.openclaw/skills/sunswap/SKILL.md and check the current price of TRX.
```

If that works, the issue was just the AI's auto-matching. Add clearer keywords next time, like "use the sunswap skill."

If that doesn't work either, check these in order:

1. Does the skill directory exist? Run `ls ~/.openclaw/skills` in your terminal.
2. Are dependencies installed? Go to the skill folder and run `npm install` (e.g., `cd ~/.openclaw/skills/tronscan-skill && npm install`).
3. Are credentials configured? See [How do I configure credentials?](#how-do-i-configure-credentials) below.

### Installation failed

Skills require a program called "Node.js" on your computer (similar to how some apps need Java). If installation fails, it's most likely missing or outdated.

**Simplest fix:** Go to [nodejs.org](https://nodejs.org/), download the latest LTS version (install it like any normal app — just click "Next" through the wizard), then try again.

:::tip Already have Node.js but still getting errors?
Run `node --version` in your terminal. Skills require **v20 or higher**. If your version is too old, download the latest from the official site and install over the old one.
:::

### How do I know the skills installed successfully?

Run this in your terminal:

```bash
ls ~/.openclaw/skills
```

You should see directory names like `sunswap`, `sunperp-skill`, `tronscan-skill`, `x402-payment`, `recharge-skill`.

Then verify in your AI chat:

```
Read the sunswap skill and tell me what it can do.
```

If the AI accurately describes the skill's capabilities, you're good to go.

---

## Is My Money Safe?

### Will the AI secretly transfer my funds?

**No.** Every operation that involves spending money will pause first and show you the full "bill" — what it's doing, how much, where to, which chain, estimated fees. **Nothing happens until you explicitly say "yes."**

That said, we recommend using a dedicated wallet with only the funds you intend to trade. Don't load your life savings — just like you wouldn't carry all your cash to the grocery store.

### What if my private key is compromised?

**First — don't panic. Check which network you were using.**

If you've been using the **Nile testnet** (which we strongly recommend for beginners), then congratulations — testnet tokens are free play money. Losing them means nothing. Just create a new wallet and move on.

If it's a **mainnet** private key, act immediately:

1. Stop using your current AI tool.
2. Create a new wallet.
3. Transfer all assets from the old wallet to the new one.
4. Update all your configurations to point to the new key.
5. Revoke token approvals on all protocols (SunSwap, SunPerp, etc.) connected to the old wallet.

:::tip Prevention is better than cure
Use [Agent Wallet](../../Agent-Wallet/Intro.md) from the start instead of plaintext private keys. Agent Wallet locks your key in an encrypted local vault — even if someone sees your environment variables, they can't open the vault without the encryption password. Two locks broken at once? Extremely unlikely.
:::

### Why does the AI ask for confirmation before every transaction?

By design. Every time the AI wants to spend your money, it shows you the full details first: what operation, which tokens and amounts, which chain, estimated fees.

**This is your last safety checkpoint before real money moves. Don't skip it.**

### How do I switch between testnet and mainnet?

Just tell the AI:

```
Swap 100 TRX for USDT on the Nile testnet.
```

The AI switches to testnet automatically. **We strongly recommend testing every new operation on testnet first** — testnet tokens are free, so there's nothing to lose.

### Why is there a difference between the quoted and actual price?

Because the blockchain doesn't pause while you're reading the quote. Between seeing the quote and confirming the transaction, a few seconds to a few minutes may pass, and the price can shift.

The AI handles this with a two-step approach: it shows you a quote first, then right before submitting, it fetches the latest price and uses slippage protection to ensure you don't get a drastically worse deal.

If extreme volatility causes a transaction to fail, try increasing the tolerance: "Swap 100 TRX for USDT with 1% slippage."

---

## Configuration

### How do I configure credentials?

**The simplest and safest method (strongly recommended): use [Agent Wallet](../../Agent-Wallet/QuickStart.md).** Think of it as a password-protected vault with a simple visual interface — just follow the prompts to enter your keys. Set it up once, and you'll never have to wrestle with config files again.

<details>
<summary>Backup method for power users: environment variables</summary>

If you're comfortable with the command line, you can store credentials in your shell config file.

**Mac:**

1. Open Terminal (press `Command + Space`, search for `Terminal`)
2. Type `nano ~/.zshrc` and press Enter — you'll see a basic text editor
3. Use arrow keys to scroll to the bottom, paste the lines you need from below (important: do NOT delete the double quotes `"` around each value, and make sure they're straight quotes, not curly quotes)
4. Press `Ctrl + X`, then `Y`, then Enter to save
5. Close the terminal, reopen it, and restart your AI tool

**Windows:** We don't recommend Windows beginners manually configure system environment variables. Please use the Agent Wallet method above. If you're using WSL, the steps are the same as Mac (but edit `~/.bashrc` instead).

Add the variables for the skills you need:

```bash
# SunSwap trading (needed for swap operations)
export TRON_PRIVATE_KEY="your_private_key"
export TRONGRID_API_KEY="your_TronGrid_API_key"

# SunPerp perpetual contracts
export SUNPERP_ACCESS_KEY="your_SunPerp_Access_Key"
export SUNPERP_SECRET_KEY="your_SunPerp_Secret_Key"

# TronScan data queries
export TRONSCAN_API_KEY="your_TronScan_API_Key"

# BANK OF AI account
export BANKOFAI_API_KEY="your_BANKOFAI_API_Key"
```

</details>

### Which AI tools support Skills?

Currently: **OpenClaw** (most seamless), **Claude Code**, **Cursor**, and any AI assistant that can read local files.

---

## Customization

### Can I modify a skill's rules?

Absolutely. Skills are just regular folders on your computer. Edit anything you want.

For example, if you think 20x leverage is still too risky for perpetual trading, open `~/.openclaw/skills/sunperp-skill/resources/sunperp_config.json` and lower the number. Your AI, your rules.

### How do I uninstall or update?

**Uninstall:** Delete the folder.

```bash
rm -rf ~/.openclaw/skills/sunswap
```

**Update:** Re-run the installer. It will ask if you want to overwrite existing skills.

```bash
cd openclaw-extension
./install.sh
```

---

## Concepts (for the Curious)

### What's the relationship between "skills" and the "toolbox"?

In one sentence: **The toolbox gives the AI abilities. Skills teach it how to use them.**

The toolbox (MCP Server) provides individual capabilities — "check balance," "send transfer." A skill teaches the AI how to string these capabilities together into a complete workflow — "swap tokens" requires checking balance, getting a quote, confirming price, then executing. The skill defines that sequence.

Analogy: Toolbox = knives, pots, and a stove. Skill = the recipe.

### Will installing lots of skills slow things down?

No. The AI only loads a "table of contents" at startup (like glancing at shelf labels). It reads the full skill content only when you actually use it. Hundreds of skills? Still lightning fast.
