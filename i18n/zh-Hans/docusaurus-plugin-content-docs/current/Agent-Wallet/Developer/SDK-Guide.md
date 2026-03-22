import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# SDK 接入指南

CLI 已经跑通了，能从命令行签名。现在你想把签名能力放进代码里——MCP Server、自动化脚本、AI 代理工作流。

本页教你怎么做。完成后，你就能用几行 TypeScript 或 Python 初始化钱包 Provider、获取活跃钱包，并对消息、交易、EIP-712 结构化数据进行签名。

:::tip 刚刚入门？
如果还没创建过钱包，先去 [快速上手](../QuickStart.md) 走一遍（不到一分钟）。SDK 读取的就是 CLI 创建的那个钱包——不需要重复配置任何东西。
:::

文档提供 TypeScript 和 Python 两个版本的安装说明和代码示例，点击标签页切换。

---

## 第一步：安装

<Tabs>
<TabItem value="ts" label="TypeScript">

**检查 Node.js 版本**

需要 Node.js ≥ 18，查看当前版本：

```bash
node -v
```

输出 `v18.0.0` 或更高，可以直接安装；否则按下面的方法升级。

:::tip 安装 / 升级 Node.js

推荐用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js 版本：

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

**检查 Python 版本**

需要 Python ≥ 3.11（SDK 使用了 3.11+ 的特性）：

```bash
python3 --version
```

输出 `3.11.x` 或更高，可以直接安装；否则按下面的方法升级。

:::tip 安装 / 升级 Python

推荐用 [pyenv](https://github.com/pyenv/pyenv) 管理 Python 版本：

```bash
# 第一步：安装 pyenv
curl https://pyenv.run | bash
```

安装后需要手动添加到 shell 配置：

```bash
# 将以下三行追加到 ~/.bashrc（zsh 用户改为 ~/.zshrc）
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc

# 重新加载配置，使当前终端立即生效
source ~/.bashrc
```

使用 pyenv 之前，先安装系统依赖，**跳过这步会导致 `_ctypes`、`ssl` 等模块缺失，进而影响 `asyncio` 等标准库的导入**：

```bash
# CentOS / RHEL / Amazon Linux / Fedora
sudo yum install -y libffi-devel bzip2-devel openssl-devel readline-devel sqlite-devel xz-devel

# Ubuntu / Debian
sudo apt-get install -y libffi-dev libbz2-dev libssl-dev libreadline-dev libsqlite3-dev liblzma-dev
```

然后编译 Python：

```bash
pyenv install 3.11
pyenv global 3.11
```

也可以从 [python.org](https://www.python.org/downloads/) 下载安装包，选择 **3.11 或更高版本**。

:::

**安装 SDK**

```bash
pip install 'bankofai-agent-wallet[evm,tron]'
```

如果只需要其中一条链，单独安装对应的 extra：

```bash
pip install 'bankofai-agent-wallet[tron]'   # 仅 TRON
pip install 'bankofai-agent-wallet[evm]'    # 仅 EVM
```

验证安装：

```bash
python3 -c "import agent_wallet; print('Installation successful')"
```

</TabItem>
</Tabs>

---

## 第二步：配置模式

调用 SDK 之前，需要通过环境变量告诉 Agent-wallet 去哪里找密钥。

不要被复杂的概念吓到，`resolveWalletProvider()` 极其聪明，它会自动检测你配置了什么环境变量，并决定工作模式，代码里不需要写任何 `if/else` 判断逻辑。

它支持以下两种模式：

### 🛡️ 核心用法：本地加密保险箱模式（强烈推荐）

如果你刚才已经跟着 [快速上手](../QuickStart.md) 走过一遍，那你的私钥早就安全地躺在本地的隐藏文件里了。

**在这个模式下，你根本不需要（也不应该）接触明文私钥。** 你只需要告诉 SDK 你的"开箱密码"即可。

```bash
export AGENT_WALLET_PASSWORD='Abc12345!'
# 可选：如果你之前改过钱包存储目录，告诉 SDK 在哪找
export AGENT_WALLET_DIR="$HOME/.agent-wallet"
```

:::caution 密码含特殊字符时，务必用单引号
自动生成的强密码可能含有 `$`、`!` 等 shell 特殊字符，务必用单引号，避免 shell 展开导致密码被破坏：

```bash
# ✅ 正确：单引号，密码原样传入
export AGENT_WALLET_PASSWORD='P@ss$w0rd!'

# ❌ 错误：双引号，$ 被 shell 展开
export AGENT_WALLET_PASSWORD="P@ss$w0rd!"
```
:::

### ⚠️ 备用方案：静态注入模式（仅限测试环境）

如果你是在一个"用完即毁"的临时环境（比如 GitHub Actions 的自动化测试流水线），或者你手里只有别人的一个临时测试私钥，你可以跳过本地加密保险箱，直接把私钥喂给 SDK。

```bash
export AGENT_WALLET_PRIVATE_KEY='你的私钥十六进制'
# 或
export AGENT_WALLET_MNEMONIC='word1 word2 word3 ...'
```

:::danger 极度危险：违背核心安全原则！
静态模式直接读取明文私钥，这意味着你放弃了 Agent-wallet 引以为傲的加密保护，退回了简介中所说的"单点白给"的老路。请仅在完全隔离的测试环境、或一次性 CI/CD 脚本中使用此模式！主网真金白银操作，请永远使用本地加密保险箱模式。
:::

:::tip 环境变量冲突怎么办？
如果环境变量里同时存在密码和私钥，SDK 会优先保护安全：强制使用 `AGENT_WALLET_PASSWORD` 进入本地加密保险箱模式，忽略明文私钥。
:::

### 环境变量速查

| 变量名 | 用途 | 模式 | 是否必填 |
| :--- | :--- | :--- | :--- |
| `AGENT_WALLET_PASSWORD` | 主密码，解锁本地隐藏文件 | 🛡️ 本地加密保险箱 | 核心必填 |
| `AGENT_WALLET_DIR` | 密钥目录（默认 `~/.agent-wallet`） | 🛡️ 本地加密保险箱 | 可选 |
| `AGENT_WALLET_PRIVATE_KEY` | 明文私钥（十六进制） | ⚠️ 静态注入 | 二选一（与助记词） |
| `AGENT_WALLET_MNEMONIC` | 明文助记词短语 | ⚠️ 静态注入 | 二选一（与私钥） |
| `AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX` | BIP-44 派生索引（默认 `0`） | ⚠️ 静态注入 | 可选 |

---

## 使用示例

### 初始化钱包 Provider

所有操作的起点是 `resolveWalletProvider()`。它读取环境变量，选择对应模式，返回钱包 Provider。调用 `getActiveWallet()` 获取活跃钱包。

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";

const provider = resolveWalletProvider({ network: "tron:nile" });
const wallet = await provider.getActiveWallet();

// 查看当前钱包地址
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

    # 查看当前钱包地址
    address = await wallet.get_address()
    print("Address:", address)

asyncio.run(main())
```

</TabItem>
</Tabs>

拿到 `wallet` 之后，就可以调用下面三种签名方法。所有签名方法返回十六进制编码的签名字符串（不带 `0x` 前缀）。

### 签名消息

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

### 签名交易

Agent-wallet 只负责签名，不构建也不广播。你需要先通过 RPC（比如 TronGrid、Infura）构建未签名的交易，再传给 SDK 签名。

#### TRON 交易

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
// 1. 调用方通过 TronGrid 构建未签名交易
const unsignedTx = {
  txID: "abc123...",
  raw_data_hex: "0a02...",
  raw_data: { /* TronGrid 返回的原始数据 */ },
};

// 2. SDK 本地签名（无网络调用）
const signedTxJson = await wallet.signTransaction(unsignedTx);
console.log("Signed transaction:", signedTxJson);

// 3. 调用方负责广播
```

</TabItem>
<TabItem value="python" label="Python">

```python
# 1. 调用方通过 TronGrid 构建未签名交易
unsigned_tx = {
    "txID": "abc123...",
    "raw_data_hex": "0a02...",
    "raw_data": {},  # TronGrid 返回的原始数据
}

# 2. SDK 本地签名（无网络调用）
signed_tx_json = await wallet.sign_transaction(unsigned_tx)
print("Signed transaction:", signed_tx_json)

# 3. 调用方负责广播
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

### 签名 EIP-712 结构化数据

用于 x402 协议 PaymentPermit 签名、Permit2 等场景：

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

### 管理多个钱包

需要在代码中管理多个钱包时，使用本地模式的 `resolveWalletProvider()`，Provider 会读取钱包配置并支持切换活跃钱包：

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
import { resolveWalletProvider, ConfigWalletProvider } from "@bankofai/agent-wallet";

// 本地模式：需要设置 AGENT_WALLET_PASSWORD
const provider = resolveWalletProvider({ network: "tron:nile" });

if (provider instanceof ConfigWalletProvider) {
  // 列出所有钱包 — 返回 [walletId, config, isActive] 元组数组
  const wallets = provider.listWallets();
  for (const [id, config, isActive] of wallets) {
    console.log(`${id} (${config.type})${isActive ? " ← 活跃" : ""}`);
  }

  // 切换活跃钱包
  provider.setActive("my-evm-wallet");
}

// 获取并使用
const wallet = await provider.getActiveWallet();
const sig = await wallet.signMessage(new TextEncoder().encode("Hello"));
```

</TabItem>
<TabItem value="python" label="Python">

```python
import asyncio
from agent_wallet import resolve_wallet_provider, ConfigWalletProvider

# 需要设置 AGENT_WALLET_PASSWORD
provider = resolve_wallet_provider(network="tron:nile")

async def main():
    if isinstance(provider, ConfigWalletProvider):
        # 列出所有钱包 — 返回 [(wallet_id, config, is_active)] 元组列表
        wallets = provider.list_wallets()
        for wallet_id, config, is_active in wallets:
            print(f"{wallet_id} ({config.type}){'  ← 活跃' if is_active else ''}")

        # 切换活跃钱包
        provider.set_active("my-evm-wallet")

    # 获取并使用
    wallet = await provider.get_active_wallet()
    sig = await wallet.sign_message(b"Hello")
    print("Signature:", sig)

asyncio.run(main())
```

</TabItem>
</Tabs>

---

### 错误处理

签名操作失败时，SDK 会抛出特定的错误类型，建议在代码中显式捕获，避免运行时崩溃。

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
    console.error("钱包不存在——检查是否设置了活跃钱包");
  } else if (e instanceof DecryptionError) {
    console.error("解密失败——检查主密码是否正确");
  } else if (e instanceof SigningError) {
    console.error("签名失败：", e.message);
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
    print("钱包不存在——检查是否设置了活跃钱包")
except DecryptionError:
    print("解密失败——检查主密码是否正确")
except SigningError as e:
    print(f"签名失败：{e}")
```

</TabItem>
</Tabs>

错误类型层级：

```
WalletError
├── WalletNotFoundError      # 指定钱包不存在
├── DecryptionError          # 密码错误或密钥文件损坏
├── SigningError              # 签名操作失败
├── NetworkError             # 网络标识符不匹配
├── InsufficientBalanceError # 余额不足（由调用方抛出）
└── UnsupportedOperationError # 该钱包类型不支持此操作
```

---

## 下一步

- 喜欢敲命令？ → [CLI 命令行手册](./CLI-Reference.md)
- 找现成代码？ → [完整代码示例](./SDK-Cookbook.md)
- 了解 Agent-wallet 的设计思路 → [简介](../Intro.md)
- 查看常见问题 → [FAQ](../FAQ.md)
