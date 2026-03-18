# 简介

AI 代理正在越来越多地参与链上操作：支付 API 费用、签署授权、执行转账。但这件事有一个绕不开的问题——私钥。

把私钥硬编码在代码里不安全，托管给云端服务意味着失去控制权，每次操作都弹出人工确认又失去了"自主"的意义。

AI 代理需要一种方式：**让密钥安全地留在本地，让签名在本地完成，同时对外只暴露一个干净的接口**。

这就是 **Agent-wallet** 要解决的问题。

---

## Agent-wallet 是什么

**Agent-wallet** 是一个**仅用于签名的 SDK**，让 AI 代理（MCP 服务器、自主工作流等）能安全地管理和使用区块链密钥。

:::tip 它做两件事

- **密钥存储** — 用 Keystore V3 加密方式将私钥安全保存在本地
- **本地签名** — 对消息、交易、EIP-712 结构化数据进行签名，全程无网络调用

:::

:::caution 它不做的事

- 不连接 RPC，不查链上数据
- 不构建交易（调用者负责构建）
- 不广播交易（调用者负责广播）
- 不自主发起转账或支付

:::

这种职责分离让 Agent-wallet 保持轻量，且不依赖任何特定的 RPC 服务商。

---

## 为什么选择 Agent-wallet

### 专为 AI 代理设计

传统钱包是给人用的——有界面、需要手动确认。Agent-wallet 的接口设计面向程序，通过环境变量配置，通过 SDK 调用，天然适合在 MCP Server 或自动化工作流中内嵌。

### 私钥永不离开本地

所有签名都在本地完成，没有任何网络请求。私钥不会被发送到任何服务器，不依赖任何云端 HSM 或托管服务，你对密钥有完全的控制权。

### 银行级密钥加密

私钥以 **Keystore V3** 格式加密存储，使用 scrypt（计算成本是普通 bcrypt 的数十倍）+ AES-128-CTR + keccak256 MAC 的组合。即使密钥文件被盗，没有主密码也无法解出私钥。主密码本身也从不以任何形式存储在磁盘上。

### 不绑定任何 RPC 服务商

因为 Agent-wallet 不做任何链上操作，你可以自由选择任意 RPC——TronGrid、自建节点——完全不影响签名逻辑。迁移或切换服务商时，签名代码不需要任何修改。

### 多链、双语言、一套接口

EVM 和 TRON 使用同一套 `BaseWallet` 接口，Python 和 TypeScript 两个实现行为完全一致、密钥文件格式互通。同一套密钥，换一门语言，签出来的结果完全相同。

---

## 两种使用方式

### CLI（命令行工具）

适合需要管理密钥、手动测试签名的场景。

```bash
npm install -g @bankofai/agent-wallet
agent-wallet start           # 初始化并创建默认钱包
agent-wallet sign msg "Hello"  # 签名消息
```

→ 详见 [CLI 快速开始](./QuickStart.md)

### SDK（编程接口）

适合在代码中集成签名能力，比如在 MCP Server 内部使用。

```typescript
import { resolveWalletProvider } from "@bankofai/agent-wallet";

const provider = resolveWalletProvider({ network: "tron:nile" });
const wallet = await provider.getActiveWallet();
const sig = await wallet.signMessage(new TextEncoder().encode("Hello"));
```

提供 **Python** 和 **TypeScript** 两个版本，接口相同，输出完全兼容。

→ 详见 [SDK 快速开始](./SDKQuickStart.md)

---

## 支持哪些链

| 链类型 | 网络标识符 | 支持的网络 |
| :--- | :--- | :--- |
| **EVM** | `eip155:*` | Ethereum、BSC、Polygon、Base、Arbitrum，以及任何 EVM 兼容链 |
| **TRON** | `tron:*` | TRON 主网、Nile 测试网、Shasta 测试网 |

---

## 在 BANK OF AI 体系中的位置

Agent-wallet 是整个生态的签名层。其他组件（如 MCP Server、x402 SDK）在需要签名时，依赖 Agent-wallet 提供私钥操作：

```
AI 代理
  └── Skills / x402 SDK          ← 决定"做什么"
        └── MCP Server           ← 构建交易，查询链上数据
              └── Agent-wallet   ← 签名（仅此一件事）
```

Agent-wallet 本身不知道业务逻辑，只负责安全地持有密钥、按需签名。

---

## 从哪里开始

| 你的目标 | 从这里开始 |
| :--- | :--- |
| 初始化钱包、用命令行管理密钥和签名 | [CLI 快速开始](./QuickStart.md) |
| 在 Python 或 TypeScript 代码中集成签名能力 | [SDK 快速开始](./SDKQuickStart.md) |
| 查看常见问题 | [常见问题](./FAQ.md) |
