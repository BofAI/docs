import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# SDK Quick Start

This page is for developers who want to call Agent-wallet's signing interface directly from Python or TypeScript code.

Unlike the CLI, the SDK is designed for embedding signing capabilities into your own program — such as providing signing support for an AI agent inside an MCP Server, or authorizing on-chain operations from an automation script. Your code is responsible for building and broadcasting transactions; Agent-wallet handles local signing and returns the result.

By the end of this guide, you'll be able to initialize a wallet provider in code, retrieve the active wallet, and sign messages, transactions, and EIP-712 typed data. If you haven't initialized a local wallet yet, it's recommended to complete Steps 1 through 3 of the [CLI Quick Start](./QuickStart.md) first.

Both installation instructions and code examples are provided for TypeScript and Python — use the tabs to switch between them.

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

The Python package is not yet published to PyPI and must be installed from source:

```bash
git clone https://github.com/BofAI/agent-wallet.git
cd agent-wallet/packages/python
pip3.11 install -e ".[all]"
```

The SDK depends on `tronpy` and `eth_account` for TRON and EVM signing. If you encounter import errors for either package after installation, install them manually:

```bash
pip3.11 install tronpy eth_account
```

Verify the installation:

```bash
python3.11 -c "import agent_wallet; print('Installation successful')"
```

</TabItem>
</Tabs>

---

## Step 2: Configure a Mode

Before calling the SDK, you need to tell Agent-wallet where to find your keys via environment variables. The SDK provides two modes — local mode is best for long-term management of multiple wallets, while static mode is best for directly injecting a private key. `resolveWalletProvider()` automatically detects the environment variables that are set and selects the corresponding mode, with no additional logic needed in your code.

### Local Mode

Private keys are stored encrypted on disk. Best for managing multiple wallets or persisting keys long-term. You must initialize first via the CLI (`agent-wallet start`), then set the master password:

```bash
export AGENT_WALLET_PASSWORD='Abc12345!'
# Optional: custom directory, defaults to ~/.agent-wallet
export AGENT_WALLET_DIR="$HOME/.agent-wallet"
```

:::caution Always use single quotes when the password contains special characters
Master passwords — especially auto-generated strong ones — may contain `$`, `!`, or other shell-special characters. **Always use single quotes** to prevent the shell from expanding them, which would silently corrupt the password:

```bash
# ✅ Correct: single quotes, password passed as-is
export AGENT_WALLET_PASSWORD='P@ss$w0rd!'

# ❌ Wrong: double quotes, $ gets expanded by the shell
export AGENT_WALLET_PASSWORD="P@ss$w0rd!"
```
:::


### Static Mode

Provide a private key or mnemonic directly via environment variable — no local key file required. Best for CI/CD or one-off scripts. The `network` parameter must be specified when using static mode:

```bash
export AGENT_WALLET_PRIVATE_KEY="your-private-key-in-hex"
# or
export AGENT_WALLET_MNEMONIC="word1 word2 word3 ..."
```

:::caution Notes
- `AGENT_WALLET_PASSWORD` takes precedence over `AGENT_WALLET_PRIVATE_KEY` / `AGENT_WALLET_MNEMONIC` — if both are set, local mode is used
- `AGENT_WALLET_PRIVATE_KEY` and `AGENT_WALLET_MNEMONIC` cannot be set at the same time
- Never hardcode private keys or passwords in source code — always pass them via environment variables or a `.env` file, and add `.env` to `.gitignore`
:::

### Environment Variable Reference

| Variable | Purpose | Mode | Required |
| :--- | :--- | :--- | :--- |
| `AGENT_WALLET_PASSWORD` | Master password, enables local mode | Local mode | Required |
| `AGENT_WALLET_DIR` | Key directory (default `~/.agent-wallet`) | Local mode | Optional |
| `AGENT_WALLET_PRIVATE_KEY` | Private key (hex) | Static mode | Required (choose one with mnemonic) |
| `AGENT_WALLET_MNEMONIC` | Mnemonic phrase | Static mode | Required (choose one with private key) |
| `AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX` | Derivation index for mnemonic (default `0`) | Static mode | Optional |

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

If you need to manage multiple wallets in code, use `LocalWalletProvider` directly:

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
import { LocalWalletProvider } from "@bankofai/agent-wallet";

const provider = new LocalWalletProvider("~/.agent-wallet", "Abc12345!");

// List all wallets
const wallets = await provider.listWallets();
for (const w of wallets) {
  console.log(`${w.id} (${w.type}): ${w.address}`);
}

// Switch the active wallet
provider.setActive("my-evm-wallet");

// Get and use
const wallet = await provider.getActiveWallet();
const sig = await wallet.signMessage(new TextEncoder().encode("Hello"));
```

</TabItem>
<TabItem value="python" label="Python">

```python
# Set the env var — resolve_wallet_provider automatically enters local mode
import os
os.environ["AGENT_WALLET_PASSWORD"] = "Abc12345!"

from agent_wallet import resolve_wallet_provider

provider = resolve_wallet_provider()

async def main():
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

- Manage wallets from the command line → [CLI Quick Start](./QuickStart.md)
- Understand Agent-wallet's design → [Introduction](./Intro.md)
- Browse common questions → [FAQ](./FAQ.md)
