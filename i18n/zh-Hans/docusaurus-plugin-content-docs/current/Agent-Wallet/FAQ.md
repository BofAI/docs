# 常见问题

---

## 关于 Agent-wallet 的定位

### Agent-wallet 是什么？它能做什么？

Agent-wallet 是一个**仅用于签名的 SDK**。它做两件事：将私钥加密存储在本地，以及对消息、交易、EIP-712 结构化数据进行本地签名。

它不做：连接 RPC、查链上数据、构建交易、广播交易、自主发起转账或支付。

这种职责划分是有意为之的——签名是一个高度敏感的操作，应该尽量简单、可审计、无外部依赖。SDK 越专注，攻击面就越小。

### 它和普通区块链钱包有什么区别？

普通钱包（如 MetaMask、TronLink）是面向人类用户的，通常包含余额显示、转账界面、DApp 连接等完整功能，每次操作都需要人工确认。

Agent-wallet 是面向程序的。它只暴露一个签名接口，没有界面，没有网络功能，也不需要人工介入。调用者（MCP Server、工作流代码等）负责构建交易，Agent-wallet 只负责签名，然后把签名结果返回给调用者去广播。

### 那转账和支付怎么实现？

Agent-wallet 本身不实现转账。完整的转账流程需要三个步骤：

1. **构建交易** — 调用者通过 TronGrid、Infura 等 RPC 接口构建未签名的交易对象
2. **签名** — 调用者把未签名交易传给 Agent-wallet，SDK 在本地签名并返回签名结果
3. **广播** — 调用者把签名后的交易提交给 RPC 广播到链上

Agent-wallet 只参与第 2 步。

### CLI 和 SDK 有什么区别，我该用哪个？

两者底层能力相同，使用场景不同：

- **CLI** 适合人工操作——初始化钱包、管理密钥、手动测试签名。日常的密钥管理工作都通过 CLI 完成。
- **SDK** 适合程序集成——在你自己的代码里调用签名接口，比如在 MCP Server 内部、或自动化脚本中使用。

大多数用户会同时用到两者：用 CLI 初始化和管理钱包，用 SDK 在代码里调用签名。

---

## 本地模式和静态模式

### 什么时候用本地模式，什么时候用静态模式？

**本地模式**（设置 `AGENT_WALLET_PASSWORD`）适合：
- 需要管理多个钱包
- 希望密钥长期加密存储在本地
- 需要通过 CLI 交互式操作钱包

**静态模式**（设置 `AGENT_WALLET_PRIVATE_KEY` 或 `AGENT_WALLET_MNEMONIC`）适合：
- 只需要一个钱包
- CI/CD 或临时脚本场景
- 私钥已由外部系统管理，不想再加一层本地存储

### 两种模式可以混用吗？

不可以同时用，但可以随时切换。`AGENT_WALLET_PASSWORD` 的优先级高于私钥/助记词。`AGENT_WALLET_PRIVATE_KEY` 和 `AGENT_WALLET_MNEMONIC` 不能同时设置。

### network 参数怎么填？

`network` 参数决定使用哪种链的适配器：

| 值 | 说明 |
| :--- | :--- |
| `eip155:1` | Ethereum 主网 |
| `eip155:56` | BSC 主网 |
| `eip155:137` | Polygon 主网 |
| `eip155:8453` | Base 主网 |
| `eip155:42161` | Arbitrum 主网 |
| `tron:mainnet` | TRON 主网 |
| `tron:nile` | TRON Nile 测试网 |
| `tron:shasta` | TRON Shasta 测试网 |

只要前缀是 `eip155:` 就走 EVM 适配器，前缀是 `tron:` 就走 TRON 适配器。链 ID 本身不影响签名逻辑，只是用于路由到正确的适配器。

---

## 安全性

### 私钥以什么方式存储？

本地模式下，私钥以 **Keystore V3** 格式加密存储，使用 scrypt（N=262144, r=8, p=1）+ AES-128-CTR + keccak256 MAC 组合。这是与 Ethereum 生态广泛兼容的加密标准，scrypt 的计算成本极高，有效抵抗暴力破解。

主密码本身从不存储。`master.json` 只保存一个加密的哨兵值，用于验证密码是否正确，而不是密码本身。

### 密钥会发送到网络吗？

不会。所有签名操作都是纯本地计算，Agent-wallet 没有任何网络调用。私钥永远不离开你的机器。

### 我应该怎么保护主密码？

- 通过环境变量（`AGENT_WALLET_PASSWORD`）传入，而不是写在代码里
- 不要把包含密码的 `.env` 文件提交到 Git，将其加入 `.gitignore`
- 建议使用密码管理器（如 1Password、Bitwarden）保存主密码

### 忘记主密码了怎么办？

主密码无法找回。Agent-wallet 不存储主密码，也没有任何找回机制。

如果你忘记了主密码：
- 如果你有私钥的其他备份（如助记词），可以运行 `agent-wallet reset` 清空本地数据，然后重新初始化并导入私钥
- 如果没有其他备份，加密的私钥文件将无法解密，对应的钱包访问权限会永久丢失

这也是为什么强烈建议在创建钱包时**单独备份私钥或助记词**，不要只依赖 Agent-wallet 的本地存储。

### 给 AI 代理使用的密钥安全吗？

取决于如何配置。推荐做法：

- 为代理创建一个专用钱包，不要使用你的个人主钱包
- 只向该钱包充入代理运行所需的小额资金
- 通过环境变量传入私钥或密码，不要硬编码在代码里

这样即使代理行为异常，损失也被限制在预充的范围内。

---

## 跨语言兼容性

### Python 和 TypeScript 的密钥文件可以互换吗？

可以。两个实现使用完全相同的 Keystore V3 格式。Python 创建的密钥文件可以直接被 TypeScript 读取，反之亦然。这意味着你可以用 CLI（TypeScript 版）初始化钱包，然后在 Python 代码里直接使用同一套密钥。

### 两个语言版本签名结果一样吗？

是的。同一个私钥对同一段数据签名，Python 和 TypeScript 产生的签名结果完全一致。地址派生规则、EIP-712 编码逻辑也完全相同。

### 两个语言版本的 API 有什么差异？

接口设计完全对应，主要差异是命名风格：TypeScript 使用驼峰命名（`signMessage`、`getActiveWallet`），Python 使用下划线命名（`sign_message`、`get_active_wallet`）。除此之外行为一致。

---

## 与其他组件的关系

### Agent-wallet 和 MCP Server 是什么关系？

MCP Server（如 TRON MCP Server、BSC MCP Server）为 AI 代理提供链上操作工具，比如查询余额、构建交易。当 MCP Server 需要签名时，它调用 Agent-wallet 来完成签名，然后自己负责广播。

Agent-wallet 是 MCP Server 的签名后端，MCP Server 不直接接触私钥。

### Agent-wallet 和 x402 协议是什么关系？

x402 是一个 HTTP 支付协议，当代理需要完成一笔 x402 支付时，需要对 PaymentPermit 结构化数据（EIP-712 格式）进行签名。这个签名由 Agent-wallet 提供。

x402 SDK 负责构建支付请求和处理协议流程，Agent-wallet 负责签名。两者分工明确，Agent-wallet 本身不了解也不关心 x402 的业务逻辑。

---

## 支持哪些链

| 链类型 | 网络标识符 | 具体网络 |
| :--- | :--- | :--- |
| EVM | `eip155:*` | Ethereum、BSC、Polygon、Base、Arbitrum 以及任何 EVM 兼容链 |
| TRON | `tron:*` | TRON 主网、Nile 测试网、Shasta 测试网 |

---

## 下一步

- 初始化钱包并开始签名 → [CLI 快速开始](./QuickStart.md)
- 在代码中集成签名能力 → [SDK 快速开始](./SDKQuickStart.md)
- 了解整体设计 → [简介](./Intro.md)
