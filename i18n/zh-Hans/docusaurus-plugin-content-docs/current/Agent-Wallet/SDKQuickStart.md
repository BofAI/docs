import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# SDK 快速开始

这个页面面向开发者，介绍如何在 Python 或 TypeScript 代码中直接调用 Agent-wallet 的签名接口。

与 CLI 不同，SDK 的使用场景是将签名能力嵌入你自己的程序——比如在 MCP Server 里为 AI 代理提供签名支持，或在自动化脚本中对链上操作进行授权。你的代码负责构建交易和广播，Agent-wallet 负责在本地完成签名并返回结果。

完成本指南后，你将能够通过代码初始化钱包提供者、获取活跃钱包，并对消息、交易和 EIP-712 结构化数据进行签名。如果你还没有初始化过本地钱包，建议先完成 [CLI 快速开始](./QuickStart.md) 中的第一步到第三步。

安装和代码示例均提供 TypeScript 和 Python 两个版本，通过标签切换查看。

---

## 第一步：安装

<Tabs>
<TabItem value="ts" label="TypeScript">

**确认 Node.js 版本**

需要 Node.js ≥ 18，先检查当前版本：

```bash
node -v
```

如果输出 `v18.0.0` 或更高，可以直接安装。如果版本不足或提示命令不存在，按下方说明安装或升级。

:::tip 安装 / 升级 Node.js

推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js 版本：

```bash
# 安装 nvm（已安装可跳过）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载 shell 配置
source ~/.bashrc   # 或 source ~/.zshrc

# 安装并切换到 Node.js 18 LTS
nvm install 18
nvm use 18
```

也可以直接从 [nodejs.org](https://nodejs.org) 下载 **LTS** 安装包。

:::

**安装 SDK**

```bash
npm install @bankofai/agent-wallet
```

</TabItem>
<TabItem value="python" label="Python">

**确认 Python 版本**

需要 Python ≥ 3.10，先检查当前版本：

```bash
python3 --version
```

如果输出 `3.10.x` 或更高，可以直接安装。如果版本不足或提示命令不存在，按下方说明安装或升级。

:::tip 安装 / 升级 Python

推荐使用 [pyenv](https://github.com/pyenv/pyenv) 管理 Python 版本：

```bash
# 安装 pyenv（已安装可跳过）
curl https://pyenv.run | bash

# 重新加载 shell 配置
source ~/.bashrc   # 或 source ~/.zshrc

# 安装 Python 3.10
pyenv install 3.10
pyenv global 3.10
```

也可以直接从 [python.org](https://www.python.org/downloads/) 下载安装包，选择 **3.10 或更高版本**。

:::

**安装 SDK**

Python 包目前未发布到 PyPI，需从源码安装：

```bash
git clone https://github.com/BofAI/agent-wallet.git
cd agent-wallet/packages/python
pip install -e ".[all]"
```

验证安装：

```bash
python -c "import agent_wallet; print('安装成功')"
```

</TabItem>
</Tabs>

---

## 第二步：配置模式

在调用 SDK 之前，需要先通过环境变量告诉 Agent-wallet 如何找到你的密钥。SDK 提供两种模式——本地模式适合长期管理多个钱包，静态模式适合直接注入私钥。`resolveWalletProvider()` 会自动识别当前设置的环境变量，选择对应的模式，无需在代码里做任何额外判断。

### 本地模式

私钥加密存储在本地，适合需要管理多个钱包或长期持久化密钥的场景。使用前需要先通过 CLI 完成初始化（`agent-wallet start`），然后设置主密码：

```bash
export AGENT_WALLET_PASSWORD="Abc12345!"
# 可选：自定义目录，默认 ~/.agent-wallet
export AGENT_WALLET_DIR="$HOME/.agent-wallet"
```

### 静态模式

直接通过环境变量提供私钥或助记词，无需本地密钥文件，适合 CI/CD 或一次性脚本场景。静态模式下必须同时指定 `network` 参数：

```bash
export AGENT_WALLET_PRIVATE_KEY="你的私钥（十六进制）"
# 或
export AGENT_WALLET_MNEMONIC="word1 word2 word3 ..."
```

:::caution 注意事项
- `AGENT_WALLET_PASSWORD` 优先级高于 `AGENT_WALLET_PRIVATE_KEY` / `AGENT_WALLET_MNEMONIC`，两者同时设置时走本地模式
- `AGENT_WALLET_PRIVATE_KEY` 和 `AGENT_WALLET_MNEMONIC` 不能同时设置
- 不要将私钥或密码硬编码在代码里，始终通过环境变量或 `.env` 文件传入，并将 `.env` 加入 `.gitignore`
:::

### 环境变量速查

| 变量名 | 用途 | 模式 | 是否必选 |
| :--- | :--- | :--- | :--- |
| `AGENT_WALLET_PASSWORD` | 主密码，启用本地模式 | 本地模式 | 必选 |
| `AGENT_WALLET_DIR` | 密钥目录（默认 `~/.agent-wallet`） | 本地模式 | 可选 |
| `AGENT_WALLET_PRIVATE_KEY` | 私钥（十六进制） | 静态模式 | 必选（与助记词二选一） |
| `AGENT_WALLET_MNEMONIC` | 助记词 | 静态模式 | 必选（与私钥二选一） |
| `AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX` | 助记词派生地址索引（默认 `0`） | 静态模式 | 可选 |

---

## 用法示例

### 初始化钱包提供者

所有操作的起点是 `resolveWalletProvider()`，它根据环境变量自动选择工作模式并返回一个钱包提供者，再通过 `getActiveWallet()` 拿到活跃钱包。

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";

const provider = resolveWalletProvider({ network: "tron:nile" });
const wallet = await provider.getActiveWallet();

// 查看当前钱包地址
const address = await wallet.getAddress();
console.log("地址:", address);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import asyncio
from agent_wallet import resolve_wallet_provider

provider = resolve_wallet_provider(network="tron:nile")

async def main():
    wallet = await provider.get_active_wallet()

    # 查看当前钱包地址
    address = await wallet.get_address()
    print("地址:", address)

asyncio.run(main())
```

</TabItem>
</Tabs>

拿到 `wallet` 后，可以调用以下三种签名方法。所有签名方法均返回十六进制编码的签名字符串（无 `0x` 前缀）。

### 签名消息

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
const sig = await wallet.signMessage(new TextEncoder().encode("Hello"));
console.log("签名:", sig);
```

</TabItem>
<TabItem value="python" label="Python">

```python
sig = await wallet.sign_message(b"Hello")
print("签名:", sig)
```

</TabItem>
</Tabs>

### 签名交易

Agent-wallet 只负责签名，不负责构建或广播交易。你需要先通过 RPC（如 TronGrid、Infura）构建未签名的交易，再传给 SDK 签名。

#### TRON 交易

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
// 1. 调用者通过 TronGrid 构建未签名交易
const unsignedTx = {
  txID: "abc123...",
  raw_data_hex: "0a02...",
  raw_data: { /* TronGrid 返回的原始数据 */ },
};

// 2. SDK 本地签名（无网络调用）
const signedTxJson = await wallet.signTransaction(unsignedTx);
console.log("已签名交易:", signedTxJson);

// 3. 调用者负责广播
```

</TabItem>
<TabItem value="python" label="Python">

```python
# 1. 调用者通过 TronGrid 构建未签名交易
unsigned_tx = {
    "txID": "abc123...",
    "raw_data_hex": "0a02...",
    "raw_data": {},  # TronGrid 返回的原始数据
}

# 2. SDK 本地签名（无网络调用）
signed_tx_json = await wallet.sign_transaction(unsigned_tx)
print("已签名交易:", signed_tx_json)

# 3. 调用者负责广播
```

</TabItem>
</Tabs>

#### EVM 交易（BSC、Ethereum 等）

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
console.log("签名:", sig);
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
print("签名:", sig)
```

</TabItem>
</Tabs>

### 签名 EIP-712 结构化数据

用于 x402 协议的 PaymentPermit 签名、Permit2 等场景：

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
console.log("签名:", sig);
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
print("签名:", sig)
```

</TabItem>
</Tabs>

---

### 管理多个钱包

如果你需要在代码中管理多个钱包，可以直接使用 `LocalWalletProvider`：

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
import { LocalWalletProvider } from "@bankofai/agent-wallet";

const provider = new LocalWalletProvider("~/.agent-wallet", "Abc12345!");

// 列出所有钱包
const wallets = await provider.listWallets();
for (const w of wallets) {
  console.log(`${w.id} (${w.type}): ${w.address}`);
}

// 切换活跃钱包
provider.setActive("my-evm-wallet");

// 获取并使用
const wallet = await provider.getActiveWallet();
const sig = await wallet.signMessage(new TextEncoder().encode("Hello"));
```

</TabItem>
<TabItem value="python" label="Python">

```python
# 设置环境变量后，resolve_wallet_provider 自动进入本地模式
import os
os.environ["AGENT_WALLET_PASSWORD"] = "Abc12345!"

from agent_wallet import resolve_wallet_provider

provider = resolve_wallet_provider()

async def main():
    wallet = await provider.get_active_wallet()
    sig = await wallet.sign_message(b"Hello")
    print("签名:", sig)

asyncio.run(main())
```

</TabItem>
</Tabs>

---

### 错误处理

签名操作失败时，SDK 会抛出具体的错误类型，建议在代码中显式捕获并处理，避免运行时崩溃。

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
  console.log("签名:", sig);
} catch (e) {
  if (e instanceof WalletNotFoundError) {
    console.error("找不到钱包，检查活跃钱包是否已设置");
  } else if (e instanceof DecryptionError) {
    console.error("解密失败，检查主密码是否正确");
  } else if (e instanceof SigningError) {
    console.error("签名失败:", e.message);
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
    print("签名:", sig)
except WalletNotFoundError:
    print("找不到钱包，检查活跃钱包是否已设置")
except DecryptionError:
    print("解密失败，检查主密码是否正确")
except SigningError as e:
    print(f"签名失败: {e}")
```

</TabItem>
</Tabs>

错误类型层级：

```
WalletError
├── WalletNotFoundError      # 找不到指定钱包
├── DecryptionError          # 密码错误或密钥文件损坏
├── SigningError              # 签名操作失败
├── NetworkError             # 网络标识符不匹配
├── InsufficientBalanceError # 余额不足（由调用方抛出）
└── UnsupportedOperationError # 当前钱包类型不支持该操作
```

---

## 下一步

- 用命令行管理钱包 → [CLI 快速开始](./QuickStart.md)
- 了解 agent-wallet 的设计 → [简介](./Intro.md)
- 查看常见问题 → [常见问题](./FAQ.md)
