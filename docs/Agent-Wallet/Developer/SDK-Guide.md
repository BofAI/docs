import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# SDK Guide

You've tried the CLI and can sign from the command line. Now you want signing inside your own code — an MCP Server, an automation script, an AI agent workflow.

This page shows you how. By the end, you'll be able to initialize a wallet provider, retrieve the active wallet, and sign messages, transactions, and EIP-712 typed data — all in a few lines of TypeScript or Python.

:::tip New here?
If you haven't created a wallet yet, start with the [Quick Start](../QuickStart.md) first (Steps 1–3 take under a minute). The SDK reads from the same wallet the CLI creates — no need to set up anything twice.
:::

Both installation instructions and code examples are provided for TypeScript and Python — use the tabs to switch.

---

## Step 1: Install

<Tabs>
<TabItem value="ts" label="TypeScript">

**Check Your Node.js Version**

Requires Node.js ≥ 18. Check your current version:

```bash
node -v
```

If the output is `v18.0.0` or higher, you can proceed directly to installation. Otherwise, follow the instructions below.

:::tip Install / Upgrade Node.js

We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions:

```bash
# Install nvm (skip if already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell config
source ~/.bashrc   # or source ~/.zshrc

# Install and switch to Node.js 18 LTS
nvm install 18
nvm use 18
```

You can also download the **LTS** installer directly from [nodejs.org](https://nodejs.org).

:::

**Install the SDK**

```bash
npm install @bankofai/agent-wallet
```

</TabItem>
<TabItem value="python" label="Python">

**Check Your Python Version**

Requires Python ≥ 3.11 (the SDK uses `StrEnum` and other 3.11+ features). Check your current version:

```bash
python3 --version
```

If the output is `3.11.x` or higher, you can proceed directly to installation. Otherwise, follow the instructions below.

:::tip Install / Upgrade Python

We recommend using [pyenv](https://github.com/pyenv/pyenv) to manage Python versions:

```bash
# Step 1: Install pyenv
curl https://pyenv.run | bash
```

After installation, you need to add pyenv to your shell config manually — otherwise the terminal won't find the `pyenv` command:

```bash
# Append these three lines to ~/.bashrc (or ~/.zshrc for zsh users)
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc

# Reload config to apply changes in the current terminal
source ~/.bashrc
```

Once pyenv is available, install the required system dependencies first. **Skipping this step will cause modules like `_ctypes` and `ssl` to be missing, which can break standard library imports including `asyncio`.**

```bash
# CentOS / RHEL / Amazon Linux / Fedora
sudo yum install -y libffi-devel bzip2-devel openssl-devel readline-devel sqlite-devel xz-devel

# Ubuntu / Debian
sudo apt-get install -y libffi-dev libbz2-dev libssl-dev libreadline-dev libsqlite3-dev liblzma-dev
```

Then build Python:

```bash
pyenv install 3.11
pyenv global 3.11
```

You can also download an installer from [python.org](https://www.python.org/downloads/), selecting **3.11 or higher**.

:::

**Install the SDK**

```bash
pip install 'bankofai-agent-wallet[evm,tron]'
```

If you only need one chain, install the corresponding extra:

```bash
pip install 'bankofai-agent-wallet[tron]'   # TRON only
pip install 'bankofai-agent-wallet[evm]'    # EVM only
```

Verify the installation:

```bash
python3 -c "import agent_wallet; print('Installation successful')"
```

</TabItem>
</Tabs>

---

## Step 2: Configure a Mode

Before calling the SDK, you need to tell Agent-wallet where to find your keys via environment variables.

Don't be intimidated by the concepts — `resolveWalletProvider()` is extremely smart. It automatically detects which environment variables you've set and decides the mode for you. No `if/else` logic needed in your code.

It supports two modes:

### 🛡️ Core Usage: Local Vault Mode (Strongly Recommended)

If you've already followed the [Quick Start](../QuickStart.md), your private key is already safely locked inside a hidden file on your machine.

**In this mode, you never need to (and shouldn't) touch your plaintext private key.** Just tell the SDK your "unlock password" and you're good to go.

```bash
export AGENT_WALLET_PASSWORD='Abc12345!'
# Optional: if you changed the wallet storage directory, tell the SDK where to look
export AGENT_WALLET_DIR="$HOME/.agent-wallet"
```

:::caution Always use single quotes when the password contains special characters
Auto-generated strong passwords may contain `$`, `!`, or other shell-special characters. Always use single quotes to prevent the shell from expanding and corrupting the password:

```bash
# ✅ Correct: single quotes, password passed as-is
export AGENT_WALLET_PASSWORD='P@ss$w0rd!'

# ❌ Wrong: double quotes, $ gets expanded by the shell
export AGENT_WALLET_PASSWORD="P@ss$w0rd!"
```
:::

### ⚠️ Fallback: Static Injection Mode (Test Environments Only)

If you're working in a disposable environment (e.g., a GitHub Actions CI pipeline), or you only have someone else's temporary test key, you can skip the local vault and feed the private key directly to the SDK.

```bash
export AGENT_WALLET_PRIVATE_KEY='your-private-key-in-hex'
# or
export AGENT_WALLET_MNEMONIC='word1 word2 word3 ...'
```

:::danger Extremely Dangerous: Violates Core Security Principles!
Static mode reads your private key in plaintext, which means you forfeit Agent-wallet's encryption protection and fall back to the "single point of failure" approach described in the introduction. Only use this mode in fully isolated test environments or one-off CI/CD scripts! For mainnet operations with real funds, always use local vault mode.
:::

:::tip What if environment variables conflict?
If both a password and a private key exist in your environment variables, the SDK prioritizes security: it forces `AGENT_WALLET_PASSWORD` to enter local vault mode and ignores the plaintext private key.
:::

### Environment Variable Reference

| Variable | Purpose | Mode | Required |
| :--- | :--- | :--- | :--- |
| `AGENT_WALLET_PASSWORD` | Master password, unlocks the local hidden file | 🛡️ Local Vault | Core required |
| `AGENT_WALLET_DIR` | Key directory (default `~/.agent-wallet`) | 🛡️ Local Vault | Optional |
| `AGENT_WALLET_PRIVATE_KEY` | Plaintext private key (hex) | ⚠️ Static Injection | Choose one (with mnemonic) |
| `AGENT_WALLET_MNEMONIC` | Plaintext mnemonic phrase | ⚠️ Static Injection | Choose one (with private key) |
| `AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX` | BIP-44 derivation index (default `0`) | ⚠️ Static Injection | Optional |

---

## Usage Examples

### Initialize the Wallet Provider

The starting point for all operations is `resolveWalletProvider()`. It reads the environment variables, selects the appropriate mode, and returns a wallet provider. Call `getActiveWallet()` to get the active wallet.

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";

const provider = resolveWalletProvider({ network: "tron:nile" });
const wallet = await provider.getActiveWallet();

// Check the current wallet address
const address = await wallet.getAddress();
console.log("Address:", address);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import asyncio
from agent_wallet import resolve_wallet_provider

provider = resolve_wallet_provider(network="tron:nile")

async def main():
    wallet = await provider.get_active_wallet()

    # Check the current wallet address
    address = await wallet.get_address()
    print("Address:", address)

asyncio.run(main())
```

</TabItem>
</Tabs>

Once you have `wallet`, you can call any of the three signing methods below. All signing methods return a hex-encoded signature string (without the `0x` prefix).

### Sign a Message

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
const sig = await wallet.signMessage(new TextEncoder().encode("Hello"));
console.log("Signature:", sig);
```

</TabItem>
<TabItem value="python" label="Python">

```python
sig = await wallet.sign_message(b"Hello")
print("Signature:", sig)
```

</TabItem>
</Tabs>

### Sign a Transaction

Agent-wallet only handles signing — not building or broadcasting. You need to construct the unsigned transaction via RPC (e.g. TronGrid, Infura) first, then pass it to the SDK for signing.

#### TRON Transaction

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
// 1. Caller builds the unsigned transaction via TronGrid
const unsignedTx = {
  txID: "abc123...",
  raw_data_hex: "0a02...",
  raw_data: { /* raw data returned by TronGrid */ },
};

// 2. SDK signs locally (no network call)
const signedTxJson = await wallet.signTransaction(unsignedTx);
console.log("Signed transaction:", signedTxJson);

// 3. Caller is responsible for broadcasting
```

</TabItem>
<TabItem value="python" label="Python">

```python
# 1. Caller builds the unsigned transaction via TronGrid
unsigned_tx = {
    "txID": "abc123...",
    "raw_data_hex": "0a02...",
    "raw_data": {},  # raw data returned by TronGrid
}

# 2. SDK signs locally (no network call)
signed_tx_json = await wallet.sign_transaction(unsigned_tx)
print("Signed transaction:", signed_tx_json)

# 3. Caller is responsible for broadcasting
```

</TabItem>
</Tabs>

#### EVM Transaction (BSC, Ethereum, etc.)

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
const sig = await wallet.signTransaction({
  to: "0xRecipient...",
  value: 0n,
  gas: 21000n,
  maxFeePerGas: 20000000000n,
  nonce: 0,
  chainId: 56,
});
console.log("Signature:", sig);
```

</TabItem>
<TabItem value="python" label="Python">

```python
sig = await wallet.sign_transaction({
    "to": "0xRecipient...",
    "value": 0,
    "gas": 21000,
    "maxFeePerGas": 20000000000,
    "nonce": 0,
    "chainId": 56,
})
print("Signature:", sig)
```

</TabItem>
</Tabs>

### Sign EIP-712 Typed Data

Used for x402 protocol PaymentPermit signatures, Permit2, and similar scenarios:

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
const sig = await wallet.signTypedData({
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "chainId", type: "uint256" },
    ],
    Transfer: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },
  primaryType: "Transfer",
  domain: { name: "MyDApp", chainId: 1 },
  message: { to: "0x...", amount: 1000000 },
});
console.log("Signature:", sig);
```

</TabItem>
<TabItem value="python" label="Python">

```python
sig = await wallet.sign_typed_data({
    "types": {
        "EIP712Domain": [
            {"name": "name", "type": "string"},
            {"name": "chainId", "type": "uint256"},
        ],
        "Transfer": [
            {"name": "to", "type": "address"},
            {"name": "amount", "type": "uint256"},
        ],
    },
    "primaryType": "Transfer",
    "domain": {"name": "MyDApp", "chainId": 1},
    "message": {"to": "0x...", "amount": 1000000},
})
print("Signature:", sig)
```

</TabItem>
</Tabs>

---

### Manage Multiple Wallets

If you need to manage multiple wallets in code, use `resolveWalletProvider()` in local mode. The provider reads the wallet configuration and lets you switch the active wallet:

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
import { resolveWalletProvider, ConfigWalletProvider } from "@bankofai/agent-wallet";

// Local mode: AGENT_WALLET_PASSWORD must be set
const provider = resolveWalletProvider({ network: "tron:nile" });

if (provider instanceof ConfigWalletProvider) {
  // List all wallets — returns [walletId, config, isActive] tuples
  const wallets = provider.listWallets();
  for (const [id, config, isActive] of wallets) {
    console.log(`${id} (${config.type})${isActive ? " ← active" : ""}`);
  }

  // Switch the active wallet
  provider.setActive("my-evm-wallet");
}

// Get and use
const wallet = await provider.getActiveWallet();
const sig = await wallet.signMessage(new TextEncoder().encode("Hello"));
```

</TabItem>
<TabItem value="python" label="Python">

```python
import asyncio
from agent_wallet import resolve_wallet_provider, ConfigWalletProvider

# AGENT_WALLET_PASSWORD must be set
provider = resolve_wallet_provider(network="tron:nile")

async def main():
    if isinstance(provider, ConfigWalletProvider):
        # List all wallets — returns [(wallet_id, config, is_active)] tuples
        wallets = provider.list_wallets()
        for wallet_id, config, is_active in wallets:
            print(f"{wallet_id} ({config.type}){'  ← active' if is_active else ''}")

        # Switch the active wallet
        provider.set_active("my-evm-wallet")

    # Get and use
    wallet = await provider.get_active_wallet()
    sig = await wallet.sign_message(b"Hello")
    print("Signature:", sig)

asyncio.run(main())
```

</TabItem>
</Tabs>

---

### Error Handling

When a signing operation fails, the SDK throws specific error types. It's recommended to catch and handle them explicitly in your code to avoid runtime crashes.

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
import {
  WalletNotFoundError,
  SigningError,
  DecryptionError,
} from "@bankofai/agent-wallet";

try {
  const wallet = await provider.getActiveWallet();
  const sig = await wallet.signMessage(new TextEncoder().encode("Hello"));
  console.log("Signature:", sig);
} catch (e) {
  if (e instanceof WalletNotFoundError) {
    console.error("Wallet not found — check that an active wallet is set");
  } else if (e instanceof DecryptionError) {
    console.error("Decryption failed — check that the master password is correct");
  } else if (e instanceof SigningError) {
    console.error("Signing failed:", e.message);
  } else {
    throw e;
  }
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
from agent_wallet import WalletNotFoundError, SigningError, DecryptionError

try:
    wallet = await provider.get_active_wallet()
    sig = await wallet.sign_message(b"Hello")
    print("Signature:", sig)
except WalletNotFoundError:
    print("Wallet not found — check that an active wallet is set")
except DecryptionError:
    print("Decryption failed — check that the master password is correct")
except SigningError as e:
    print(f"Signing failed: {e}")
```

</TabItem>
</Tabs>

Error type hierarchy:

```
WalletError
├── WalletNotFoundError      # Specified wallet not found
├── DecryptionError          # Wrong password or corrupted key file
├── SigningError              # Signing operation failed
├── NetworkError             # Network identifier mismatch
├── InsufficientBalanceError # Insufficient balance (thrown by caller)
└── UnsupportedOperationError # Operation not supported by this wallet type
```

---

## Next Steps

- Prefer the command line? → [CLI Reference](./CLI-Reference.md)
- Looking for ready-made code? → [SDK Cookbook](./SDK-Cookbook.md)
- Understand Agent-wallet's design → [Introduction](../Intro.md)
- Common questions → [FAQ](../FAQ.md)
