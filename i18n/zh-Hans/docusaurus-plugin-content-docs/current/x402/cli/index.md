---
title: 'x402 CLI'
description: >-
  x402 CLI（@bankofai/x402-cli）是一个 TypeScript 命令行客户端——在终端里直接支付受保护的 URL、启动本地付费端点、管理服务目录。
---

# x402 CLI

## 什么是 x402 CLI？

x402 CLI（`@bankofai/x402-cli`）把 [x402 支付协议](../index.md)搬进了你的终端。它是一个依赖极简的命令，让人工操作者、Shell 脚本，或者一个 AI Agent 都能**支付一个受 x402 保护的 URL、启动本地付费端点、浏览服务目录**——不用写任何集成代码。

可以这样理解：[x402 SDK](../sdk-features.md) 是你嵌进应用里、用来收费或付费的那层能力；而 CLI 是同一套能力，被包装成一条你现在就能敲的命令：

```bash
# 支付任意受 x402 保护的接口
x402-cli pay https://api.example.com/paid --network tron:nile --token USDT
```

它完全构建在已发布的 TypeScript SDK 包之上——`@bankofai/x402-core`、`@bankofai/x402-evm`、`@bankofai/x402-tron`——每一笔稳定币支付都使用 `scheme=exact` 配合 Permit2 授权（`extra.assetTransferMethod=permit2`）。

---

## 它能做什么？

CLI 把能力归为五条命令。

| 命令 | 作用 | 示例 |
| :--- | :--- | :--- |
| **`pay`** | 支付一个受 x402 保护的 URL：探测接口、读取 `402` 支付要求、签名并重试。 | `x402-cli pay <url> --network tron:nile --token USDT` |
| **`serve`** | 启动本地 x402 付费端点，返回 `402 Payment Required` 并通过 Facilitator 结算。 | `x402-cli serve --pay-to <address> --amount 0.0001` |
| **`roundtrip`** | 启动临时服务、立即支付、随后退出——端到端冒烟测试的最快方式。 | `x402-cli roundtrip --pay-to <address>` |
| **`gateway`** | 管理本地网关的 provider 文件：校验、脚手架、启动、构建目录资产。 | `x402-cli gateway check ./providers` |
| **`catalog`** | 搜索、缓存、查看、导出托管的服务目录。 | `x402-cli catalog search "weather"` |

只读命令（`pay --dry-run`、`catalog search`、`gateway check`）无需钱包，只有真正发起支付时才需要付款方私钥。

---

## 默认给人看，需要时给机器看

输出默认是人类友好的文本。给任意命令加上 `--json`，就能得到一份稳定的、机器可读的结构化 JSON 输出——非常适合脚本和 AI Agent：

```bash
x402-cli pay https://api.example.com/paid --dry-run --json
```

```json
{
  "ok": true,
  "command": "client",
  "network": "tron:nile",
  "scheme": "exact",
  "result": {
    "url": "https://api.example.com/paid",
    "message": "Dry run - no payment submitted"
  }
}
```

每一份 JSON 输出都带有 `ok`、`command`，以及一个 `result` 对象或一个结构化的 `error`（含 `code`、`message`、`hint`）。成功时还会在相关场景返回 `network` 和 `scheme`。

---

## 支持的网络与代币

CLI 内置了代币注册表。用 `--network` 指定网络，用 `--token` 指定代币。

| 网络 | 标识符 | 内置代币 |
| :--- | :--- | :--- |
| **TRON 主网** | `tron:mainnet` | USDT、USDD |
| **TRON Nile 测试网** | `tron:nile` | USDT、USDD |
| **TRON Shasta 测试网** | `tron:shasta` | USDT |
| **BSC 主网** | `eip155:56` | USDT |
| **BSC 测试网** | `eip155:97` | USDT、USDC |

以下简写别名会被自动接受并归一化：

| 别名 | 标准标识符 |
| :--- | :--- |
| `tron-mainnet` | `tron:mainnet` |
| `tron-nile` | `tron:nile` |
| `tron-shasta` | `tron:shasta` |
| `bsc-mainnet` | `eip155:56` |
| `bsc-testnet` | `eip155:97` |

如果代币不在注册表里，用 `--asset <address>` 搭配 `--decimals <count>` 传入。

---

## CLI vs SDK

两条路径说的是同一套协议，区别只在集成方式。

| 对比 | x402 CLI | x402 SDK |
| :--- | :--- | :--- |
| **集成方式** | 命令行（Shell 调用） | 引入到你的 TypeScript 应用中 |
| **最适合** | 手动测试、脚本、CI/CD、通过 Shell 调用的 AI Agent | 生产级服务与客户端 |
| **安装** | `npm install -g @bankofai/x402-cli` | `npm install @bankofai/x402-*` |
| **输出** | 人类文本或 `--json` 结构化输出 | 原生 SDK 对象 |

:::tip 该选哪个？
用 CLI 去探索、测试、编写脚本对接 x402 接口，或者通过 Shell 给 AI Agent 赋予支付能力。当你要把支付嵌进真实产品时，直接基于 [SDK](../sdk-features.md) 构建。
:::

---

## 安全须知

:::warning
支付会转移真实的链上资产，且不可撤销。请牢记以下原则：

- **绝不硬编码私钥。** 在共享环境中，优先用环境变量（`TRON_PRIVATE_KEY`、`EVM_PRIVATE_KEY`、`PRIVATE_KEY`）或一个 [agent-wallet](../../Agent-Wallet/Intro.md) 付款钱包，而不是 `--private-key` 参数。
- **先在测试网上验证。** 上主网前，先用 `tron:nile` 或 `eip155:97` 跑通。
- **付款前先预览。** 用 `pay --dry-run` 在签名前看清确切的支付要求。
- **给金额设上限。** 用 `--max-amount` 或 `--max-raw-amount`，让定价异常的接口无法超额扣款。
- **只放最小额度。** 付款方地址里只保留当前任务所需的资金。
:::

---

## 下一步

- 想快速跑通第一笔支付？→ [快速开始](./quickstart.md)
- 需要完整的命令与参数？→ [命令参考](./command-reference.md)
- 遇到问题或有疑问？→ [FAQ 与故障排查](./faq.md)
