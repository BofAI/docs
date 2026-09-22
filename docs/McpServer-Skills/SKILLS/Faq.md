# FAQ

:::note
For new setup, follow the [Skills quick start](/McpServer-Skills/SKILLS/QuickStart/). Legacy wallet and installer references below are for existing integrations, not wallet-cli 4.14 setup instructions.
:::

Questions are ordered by urgency — the ones you're most likely to hit first are at the top, concepts at the bottom.

---

## Something Went Wrong

### The AI says "skill not found" or gives a completely wrong answer

Tell the AI exactly where to find the skill file:

```
Please read ~/.agents/skills/sunswap-dex-trading/SKILL.md and check the current price of TRX.
```

If that works, the issue was just the AI's auto-matching. Add clearer keywords next time, like "use the sunswap skill."

If that doesn't work either, check these in order:

1. Does the skill directory exist? Run `ls ~/.agents/skills` in your terminal.
2. Are dependencies installed? Go to the skill folder and run `npm install` (e.g., `cd ~/.agents/skills/tronscan-data-lookup && npm install`).
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
ls ~/.agents/skills
```

The installed set depends on your release and selection. Check for the requested Skill and its `SKILL.md`; do not use a fixed directory count to determine success.

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
Use [wallet-cli](/x402/cli/quickstart/) from the start instead of plaintext private keys. Agent Wallet locks your key in an encrypted local vault — even if someone sees your environment variables, they can't open the vault without the encryption password. Two locks broken at once? Extremely unlikely.
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

Use the [wallet-cli setup flow](/x402/cli/quickstart/) for the official wallet and payment entry. Community projects retain their own API-key and signing requirements; these settings are not automatically shared with wallet-cli. Never paste a private key or master password into chat, or store the wallet-cli master password in an environment variable.

### Which AI tools support Skills?

The installer targets a broad set of coding agents and assistants — Claude Code, Cursor, Codex, Cline, Gemini CLI, Amp, Zed and many more — either by symlinking into the tool's own skill directory or by copying the files where the tool has no such directory. **OpenClaw** remains the most seamless. Any AI assistant that can read local skill files works too: point it at `~/.agents/skills/<skill>/SKILL.md`.

---

## Customization

### Can I modify a skill's rules?

Absolutely. Skills are just regular folders on your computer. Edit anything you want.

For example, if you think 20x leverage is still too risky for perpetual trading, open `~/.agents/skills/sunperp-perpetual-futures-trading/resources/sunperp_config.json` and lower the number. Your AI, your rules.

### How do I uninstall or update?

**Uninstall:** Delete the folder.

```bash
rm -rf ~/.agents/skills/sunswap-dex-trading
```

**Update:** Re-run the install command (keep `-g` so it refreshes the global copy). It will update all skills to the latest version.

```bash
npx skills add https://github.com/BofAI/skills/tree/main -y -g
```

---

## Concepts (for the Curious)

### What's the relationship between "skills" and the "toolbox"?

In one sentence: **The toolbox gives the AI abilities. Skills teach it how to use them.**

The toolbox (MCP Server) provides individual capabilities — "check balance," "send transfer." A skill teaches the AI how to string these capabilities together into a complete workflow — "swap tokens" requires checking balance, getting a quote, confirming price, then executing. The skill defines that sequence.

Analogy: Toolbox = knives, pots, and a stove. Skill = the recipe.

### Will installing lots of skills slow things down?

No. The AI only loads a "table of contents" at startup (like glancing at shelf labels). It reads the full skill content only when you actually use it. Hundreds of skills? Still lightning fast.
