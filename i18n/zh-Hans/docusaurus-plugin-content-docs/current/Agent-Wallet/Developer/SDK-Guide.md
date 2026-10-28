# SDK 接入指南

你已经用 CLI 在命令行里签过名了。现在你想在自己的代码里调用签名——比如 MCP Server、自动化脚本、AI 代理工作流。

这一页就教你怎么做。读完后，你就能用 `@bankofai/agent-wallet` 3.x TypeScript SDK 解析钱包、读取地址，并签名交易和 EIP-712 / TIP-712 结构化数据。

:::tip 第一次来？
如果还没有创建钱包，先去 [快速开始](../QuickStart.md)。SDK 读取的就是 CLI 写入的同一份 `wallets_config.json`——不用重复配置。
:::

:::note Python SDK
Agent-wallet 3.x 只提供 TypeScript。PyPI 上的 Python 包 `bankofai-agent-wallet` 停留在 2.4.0，沿用 2.x 模型（`local_secure`、主密码、`sign_message`），不支持 `wallet_cli` 类型，也不返回本文介绍的 3.x 签名结果。
:::

---

## 第一步：安装

**检查 Node.js 版本**

请使用 Node.js `^22.23.4 || ^24.22.1 || >=26.12.1`，即 2026 年 10 月的安全更新版本。这是源码 `main` 分支声明的 `engines` 范围；npm 上已发布的 `3.0.0` 仍声明 `>=18.0.0`，但 wallet-cli `4.15.1` 本身就声明了同一范围。在 `main` 上，当 `wallet_cli` 钱包类型用当前 Node 通过 JavaScript 入口启动 wallet-cli 时（本地安装的包，或指向 `.js` 文件的 `AGENT_WALLET_WALLET_CLI_PATH`），会先检查同一范围；从 `PATH` 找到的 `wallet-cli` 可执行文件则不做此检查。（已发布的 `3.0.0` 中，该入口检查只要求 Node.js 20+。）检查当前版本：

```bash
node -v
```

:::tip 安装 / 升级 Node.js

推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js 版本：

```bash
# 安装 nvm（已安装可跳过）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载 shell 配置
source ~/.bashrc   # 或 source ~/.zshrc

# 安装并切换到当前的 Node.js LTS
nvm install --lts
nvm use --lts
```

也可以直接从 [nodejs.org](https://nodejs.org) 下载 **LTS** 安装包。

:::

**安装 SDK**

```bash
npm install @bankofai/agent-wallet
```

该包同时提供 ESM 和 CommonJS 构建。只有使用 `wallet_cli` 钱包时，才需要额外安装可选的 peer 依赖：

```bash
npm install '@tron-walletcli/wallet-cli@^4.13.0'
```

---

## 第二步：选择私钥来源

`resolveWalletProvider()` / `resolveWallet()` 会替你决定来源——代码里不需要写 `if/else`：

1. **钱包配置（推荐）。** 如果钱包目录（`dir` 参数 → `AGENT_WALLET_DIR` → `~/.agent-wallet`）中的 `wallets_config.json` 至少包含一个钱包，就使用 `ConfigWalletProvider`。它支持 CLI 能创建的所有钱包类型：`wallet_cli`、`privy` 和 `raw_secret`。
2. **环境变量回退。** 否则使用 `EnvWalletProvider`，从环境变量读取私钥。

不需要导出任何密码：`wallet_cli` 的凭据来自钱包配置中保存的 exec 脚本或值，`privy` 的凭据同样保存在那里。

### 环境变量回退 {#environment-variable-fallback}

在一次性环境中（例如使用一次性测试私钥的 CI 流水线），你可以跳过钱包配置，直接把私钥交给 SDK：

```bash
export AGENT_WALLET_PRIVATE_KEY='你的十六进制私钥'
# 或者
export AGENT_WALLET_MNEMONIC='word1 word2 word3 ...'
```

:::danger 明文私钥
这种方式以明文从环境变量读取私钥。只能在完全隔离的测试环境中配合一次性私钥使用。同时设置两个变量会报错。
:::

### 环境变量一览

| 变量 | 用途 | 使用方 |
| :--- | :--- | :--- |
| `AGENT_WALLET_DIR` | 钱包目录（默认 `~/.agent-wallet`） | 钱包配置 |
| `AGENT_WALLET_WALLET_CLI_PATH` | wallet-cli 不在 `PATH` 中时，指定其可执行文件或 JavaScript 入口 | `wallet_cli` 钱包 |
| `AGENT_WALLET_PRIVATE_KEY` | 明文私钥（hex） | 环境变量回退——二选一 |
| `AGENT_WALLET_MNEMONIC` | 明文助记词 | 环境变量回退——二选一 |
| `AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX` | 助记词账户索引（默认 `0`） | 环境变量回退 |

只有当钱包配置中没有任何钱包时，才会读取环境变量回退。2.x 的 `TRON_PRIVATE_KEY`、`TRON_MNEMONIC`、`TRON_ACCOUNT_INDEX` 和 `AGENT_WALLET_PASSWORD` 已不再读取。

---

## 使用示例

### 网络

所有 `network` 参数都只接受精确的规范 CAIP-2 字符串：`eip155:<chainId>`（如 `eip155:1`、`eip155:56`、`eip155:97`）或 `tron:<chainId>`（`tron:728126428` 主网、`tron:3448148188` Nile、`tron:2494104990` Shasta）。`tron:nile`、`tron:mainnet` 等别名、裸 `tron` / `eip155`、十六进制 TRON id，以及大小写或空白变体都会抛出 `NetworkError`。

`raw_secret`、环境变量回退和 `wallet_cli` 钱包**必须**提供网络——它决定使用 EVM 还是 TRON 签名器（对于助记词，还决定派生路径 `m/44'/60'/0'/0/{index}` 或 `m/44'/195'/0'/0/{index}`）。`privy` 钱包可以省略。

`wallet_cli` 钱包还要求该网络是 wallet-cli 自身认识的网络——即它的内置网络（`eip155:1`、`eip155:11155111`、`eip155:56`、`eip155:97`、`eip155:8453`、`eip155:84532`（Base 自 wallet-cli 4.14.0 起才内置）及三个 TRON 网络），或在 wallet-cli 自己的配置中添加的网络——否则签名会以 `network_mismatch` 失败。`raw_secret` 和 `privy` 钱包没有这一限制。

### 解析钱包

最短的路径是 `resolveWallet()`。它接受 `network`、`dir`，以及可选的 `walletId`，用于指定某个已配置的钱包而不是激活钱包（在环境变量回退模式下会被忽略）：

```typescript
import { resolveWallet } from "@bankofai/agent-wallet";

const wallet = await resolveWallet({ network: "tron:3448148188" });
console.log("Address:", await wallet.getAddress());

// 或者指定某个钱包，而不是激活钱包
const other = await resolveWallet({ network: "eip155:56", walletId: "trading" });
```

需要 provider 本身时，使用 `resolveWalletProvider()`：

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";

const provider = resolveWalletProvider({ network: "tron:3448148188" });
const wallet = await provider.getActiveWallet();     // 或 getActiveWallet("eip155:56")
```

两个函数都接受 `dir`，它相当于在代码里设置 `AGENT_WALLET_DIR`。

### `Wallet` 接口

```typescript
interface Wallet {
  getAddress(): Promise<string>;
  signTransaction(payload: TransactionPayload, options?: SignOptions): Promise<SignedTransactionArtifact>;
}

interface Eip712Capable {
  signTypedData(data: Record<string, unknown>, options?: SignOptions): Promise<string>;
}

type SignOptions = {
  authorizationSignature?: string; // 作为 privy-authorization-signature 转发给 Privy
  signal?: AbortSignal;            // 取消 wallet-cli 签名子进程
};
```

- `signTransaction` 返回带类型的结果：`{ family: "evm", rawTransaction }`（hex，**不带** `0x`）或 `{ family: "tron", transaction }`（附带 `txID` 和 `signature` 的交易对象）。请根据 `family` 分支处理，不要去解析字符串。
- `signTypedData` 返回**不带** `0x` 前缀的 hex 签名。它定义在单独的 `Eip712Capable` 接口上；调用前先检查（三种内置钱包类型都实现了它）。
- 3.x 中没有 `signMessage` 或 `signRaw`。

### 签名交易

Agent-wallet 只负责签名，不负责构建和广播交易。你需要先通过 RPC（如 TronGrid、EVM 节点）构建未签名交易，再交给 SDK 签名。

#### TRON 交易

payload 必须包含 `raw_data_hex`（TronGrid 会返回）。对 `raw_secret`、`privy` 和环境变量钱包，缺少 `txID` 时会根据 `raw_data_hex` 计算。`wallet_cli` 钱包则需要完整交易——`raw_data`、`raw_data_hex`，以及等于 `raw_data_hex` 的 SHA-256 的 `txID`——否则 wallet-cli 会拒绝签名。

```typescript
// 1. 调用方通过 TronGrid 构建未签名交易
const unsignedTx = {
  txID: "abc123...",
  raw_data_hex: "0a02...",
  raw_data: { /* TronGrid 返回的原始数据 */ },
};

// 2. SDK 签名（raw_secret 在进程内签名；wallet_cli 委托给 wallet-cli）
const signed = await wallet.signTransaction(unsignedTx);
if (signed.family !== "tron") throw new Error("expected a TRON wallet");
console.log("Signed transaction:", signed.transaction);

// 3. 调用方广播 signed.transaction
```

#### EVM 交易（BSC、Ethereum 等）

```typescript
const signed = await wallet.signTransaction({
  type: "eip1559",
  to: "0xRecipient...",
  value: 0n,
  gas: 21000n,
  maxFeePerGas: 20000000000n,
  maxPriorityFeePerGas: 1000000000n,
  nonce: 0,
  chainId: 56,
});
if (signed.family !== "evm") throw new Error("expected an EVM wallet");
console.log("Signed tx:", "0x" + signed.rawTransaction);
```

`wallet_cli` 钱包还会拒绝与钱包网络不一致的 `chainId`、已签名的 payload，以及 EIP-4844 / EIP-7702 交易。

### 签名 EIP-712 结构化数据

用于 x402 支付授权、Permit2 等场景：

```typescript
import type { Eip712Capable, Wallet } from "@bankofai/agent-wallet";

function supportsTypedData(wallet: Wallet): wallet is Wallet & Eip712Capable {
  return "signTypedData" in wallet && typeof wallet.signTypedData === "function";
}

if (!supportsTypedData(wallet)) throw new Error("wallet cannot sign typed data");

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

---

### 管理多个钱包

`ConfigWalletProvider` 用于读取和修改钱包配置。你可以从 `resolveWalletProvider()` 获得它（已配置钱包时），也可以直接用 `new ConfigWalletProvider(dir, { network })` 构造：

```typescript
import { resolveWalletProvider, ConfigWalletProvider } from "@bankofai/agent-wallet";

const provider = resolveWalletProvider({ network: "tron:3448148188" });

if (provider instanceof ConfigWalletProvider) {
  // 列出所有钱包——返回 [walletId, config, isActive] 元组
  for (const [id, config, isActive] of provider.listWallets()) {
    console.log(`${id} (${config.type})${isActive ? " ← active" : ""}`);
  }

  // 切换激活钱包（写入 wallets_config.json）
  provider.setActive("my-evm-wallet");

  // 或者不切换，直接在指定网络上使用某个钱包
  const bsc = await provider.getWallet("my-evm-wallet", "eip155:56");
}

// 未设置激活钱包时，会回退到第一个已配置的钱包
const wallet = await provider.getActiveWallet();
```

---

### 错误处理

SDK 的类型化错误继承自 `WalletError`。少数配置和输入错误会直接抛出普通 `Error`：找不到钱包来源（既没有已配置的钱包，也没有 `AGENT_WALLET_PRIVATE_KEY` / `AGENT_WALLET_MNEMONIC`）、这两个环境变量同时设置、私钥格式错误，或 `AGENT_WALLET_MNEMONIC_ACCOUNT_INDEX` 无效。捕获你能处理的具体类型：

```typescript
import {
  WalletNotFoundError,
  NetworkError,
  SigningError,
  WalletCliNotFoundError,
  WalletCliExecutionError,
} from "@bankofai/agent-wallet";

try {
  const wallet = await provider.getActiveWallet();
  const signed = await wallet.signTransaction(unsignedTx);
} catch (e) {
  if (e instanceof WalletNotFoundError) {
    console.error("找不到钱包——请检查钱包 ID");
  } else if (e instanceof NetworkError) {
    console.error("网络无效或不匹配——请使用规范 CAIP-2，例如 tron:3448148188");
  } else if (e instanceof WalletCliNotFoundError) {
    console.error("未安装 wallet-cli，或不在 PATH 中");
  } else if (e instanceof WalletCliExecutionError || e instanceof SigningError) {
    console.error("签名失败：", e.message);
  } else {
    throw e;
  }
}
```

错误类型层级（均从包根导出）：

```
WalletError
├── WalletNotFoundError              # 找不到指定的钱包 ID（或没有任何已配置钱包）
├── DecryptionError                  # 为兼容保留；3.x 钱包类型不会抛出
├── InsufficientBalanceError         # SDK 不会抛出；供你自己的代码使用
├── SigningError                     # 签名失败或 payload 被拒绝
├── NetworkError                     # 网络标识不规范或不匹配
├── UnsupportedOperationError        # 该钱包不支持此操作
└── ExternalSignerError
    ├── ExternalSignerConfigError
    │   ├── PrivyConfigError
    │   └── WalletCliConfigError
    ├── ExternalSignerExecutionError
    │   ├── PrivyRequestError
    │   ├── PrivyRateLimitError
    │   ├── PrivyAuthError
    │   └── WalletCliExecutionError
    │       └── WalletCliSubmittedTransactionError
    ├── ExternalSignerUsageError
    │   └── WalletCliUsageError
    └── ExternalSignerNotFoundError
        └── WalletCliNotFoundError
```

`WalletCliExecutionError` 与 `WalletCliUsageError` 都带有 `code`。agent-wallet 自身产生的 code 有：`capability_missing`（该 wallet-cli 可执行文件不能签这一类交易；账户没有该链族地址时报的是 `contract_mismatch`）、`network_mismatch`（wallet-cli 不认识该网络；在能力检查之后才检查）、`contract_mismatch`、`unsupported_version`、`unsupported_runtime`、`migration_required` / `migration_completed` / `migration_cancelled`、`timeout`、`aborted`、`spawn_error`、`stdin_write`、`output_limit`、`status_query_failed`，以及 wallet-cli 失败信封里 `code` 为空字符串时补上的 `internal_error`（信封里完全没有 `code` 时报 `contract_mismatch`）。wallet-cli 返回失败信封时，它自己的 code 会原样透传（例如 `account_not_found`、`auth_failed`）：退出码 `2` 对应 `WalletCliUsageError`，退出码 `1` 对应 `WalletCliExecutionError`。`wallet_cli` 交易的 `chainId` 与 `-n` 不一致时抛出的是 `SigningError`，不是 `NetworkError`。

:::tip 不要自动重试 wallet-cli 超时
`@bankofai/agent-wallet/integrations/wallet-cli` 的 `signAndBroadcast()` 超时后，不要自动重发——先核实结果。有两种超时不是异常：广播超时但已知 `txId`，或 `wait: true` 的轮询期限到了，调用都会返回 `{ txId, stage: 'timeout' }`。构建或签名阶段超时，或广播在拿到 `txId` 之前就超时，会抛 code 为 `timeout` 的 `WalletCliExecutionError`。`WalletCliSubmittedTransactionError` 只在 `wait: true` 且交易已广播、之后查询状态失败时抛出（包括状态查询本身超时，此时其 `code` 为 `timeout`），并带上该 `txId`。普通的 `signTransaction()` 不广播，也不会抛这个错误。
:::

### 进阶入口

| 导入路径 | 内容 |
| :--- | :--- |
| `@bankofai/agent-wallet` | `resolveWallet`、`resolveWalletProvider`、`ConfigWalletProvider`、`EnvWalletProvider`、`Network`、`WalletType`、`loadConfig` / `saveConfig`、类型与错误 |
| `@bankofai/agent-wallet/advanced` | 底层适配器和客户端（`EvmSigner`、`TronSigner`、`RawSecretSigner`、`PrivyAdapter`、`WalletCliAdapter`、`PrivyClient`、`WalletCliClient`）、凭据提供器（`ExecSecretProvider`、`StaticSecretProvider`） |
| `@bankofai/agent-wallet/advanced`（续） | 另有 `LocalSigner`、配置解析器（`ExternalSignerConfigResolver`、`PrivyConfigResolver`、`WalletCliConfigResolver`）、`resolveSecret` / `isSecretRef` / `DEFAULT_EXEC_TIMEOUT_MS` / `DEFAULT_SECRET_STDOUT_LIMIT` / `DEFAULT_SECRET_STDERR_LIMIT`、`defaultSecretProviderFactory`，以及 `parseWalletCliNetwork` / `assertTronWalletCliNetwork` |
| `@bankofai/agent-wallet/integrations/wallet-cli` | 借助 wallet-cli 完成构建 / 广播 / 查询的 TRON 专用工具：`signAndBroadcast`、`buildTransfer`、`broadcast`、`getTxStatus`、`getBalance`、`getTxInfo` |

---

## 下一步

- 更喜欢命令行？ → [CLI 命令行手册](./CLI-Reference.md)
- 想找现成代码？ → [完整代码示例](./SDK-Cookbook.md)
- 了解 Agent-wallet 的设计 → [简介](../Intro.md)
- 常见问题 → [常见问题](../FAQ.md)
