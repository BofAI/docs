---
title: 'x402 CLI'
description: >-
  x402 CLI（@bankofai/x402-cli）是一个 TypeScript 命令行客户端——在终端里直接支付受保护的 URL、启动本地付费端点、管理服务目录。
---

# x402 CLI

## 什么是 x402 CLI？

x402 CLI（`@bankofai/x402-cli`）把 [x402 支付协议](../index.md)搬进了你的终端。它是一条命令，让人工操作者、Shell 脚本，或者一个 AI Agent 都能**支付一个受 x402 保护的 URL、启动本地付费端点、浏览服务目录**——不用写任何集成代码。

可以这样理解：[x402 SDK](../sdk-features.md) 是你嵌进应用里、用来收费或付费的那层能力；而 CLI 是同一套能力，被包装成一条你现在就能敲的命令：

```bash
# 支付任意受 x402 保护的接口
x402-cli pay https://api.example.com/paid --network tron:0xcd8690dc --token USDT
```

它完全构建在已发布的 TypeScript SDK 包之上，且是锁定版本打包、并不跟随 SDK 最新版：CLI 1.0.2 内含 1.0.1 的 `@bankofai/x402-core`、`-evm`、`-fetch`、`-tron`，以及 `@bankofai/x402-gateway` 1.0.2 和 `@bankofai/agent-wallet` 2.4.0。稳定币支付使用 `scheme=exact`：TRON 与 BSC 走 Permit2 授权，Base USDC 走 EIP-3009。TRON 上还支持 `scheme=exact_gasfree`——由 relayer 代付网络能量、并从支付代币里扣除手续费，付款方无需持有 TRX。详见 [GasFree 支付](./command-reference.md#gasfree-payments-tron)。

默认情况下，`pay` 使用你当前激活的 [Agent Wallet](../../Agent-Wallet/Intro.md) 签名——不需要把私钥放进环境变量。详见 [用 Agent Wallet 付款](./command-reference.md#paying-with-agent-wallet)。

---

## 它能做什么？

CLI 把能力归为五条命令。

| 命令 | 作用 | 示例 |
| :--- | :--- | :--- |
| **`pay`** | 支付一个受 x402 保护的 URL：探测接口、读取 `402` 支付要求、签名并重试。 | `x402-cli pay <url> --network tron:0xcd8690dc --token USDT` |
| **`serve`** | 启动本地 x402 付费端点，返回 `402 Payment Required` 并通过 Facilitator 结算。 | `x402-cli serve --pay-to <address> --amount 0.0001` |
| **`roundtrip`** | 启动临时服务、立即支付、随后退出——端到端冒烟测试的最快方式。 | `x402-cli roundtrip --pay-to <address>` |
| **`gateway`** | 管理本地网关的 provider 文件：校验、脚手架、启动、构建目录资产。 | `x402-cli gateway check ./providers` |
| **`catalog`** | 搜索、缓存、查看、导出托管的服务目录。 | `x402-cli catalog search "weather"` |

只读命令（`pay --dry-run`、`catalog search`、`gateway check`）无需钱包。真正发起支付时需要配置可签名的钱包；原始私钥仅作为开发和 CI 的覆盖手段。

---

## 默认给人看，需要时给机器看

输出默认是人类友好的文本。给任意会返回结果的命令加上 `--json`，就能得到一份稳定的、机器可读的结构化 JSON 输出——非常适合脚本和 AI Agent。（`gateway start` 直接透传网关自身的输出，不产生 JSON 封装；`catalog pay-json --raw` 打印裸载荷。）

```bash
x402-cli pay 'https://x402-gateway.bankofai.io/providers/defillama-tvl-tron/protocols' \
  --network tron:0x2b6653dc \
  --token USDT \
  --dry-run \
  --json
```

```json
{
  "ok": true,
  "command": "pay",
  "component": "client",
  "network": "tron:0x2b6653dc",
  "scheme": "exact",
  "result": {
    "url": "https://x402-gateway.bankofai.io/providers/defillama-tvl-tron/protocols",
    "resource": "https://x402-gateway.bankofai.io/providers/defillama-tvl-tron/protocols",
    "selected": {
      "scheme": "exact",
      "network": "tron:0x2b6653dc",
      "amount": "1",
      "asset": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      "payTo": "TLXPgJVJFgL97gc49j8w8kC22mDTpH9EGa",
      "maxTimeoutSeconds": 300,
      "extra": {
        "assetTransferMethod": "permit2"
      }
    },
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
| **TRON 主网** | `tron:0x2b6653dc` | USDT、USDD |
| **TRON Nile 测试网** | `tron:0xcd8690dc` | USDT、USDD |
| **TRON Shasta 测试网** | `tron:0x94a9059e` | USDT（仅能签名，见下方说明） |
| **BSC 主网** | `eip155:56` | USDT |
| **BSC 测试网** | `eip155:97` | USDT、USDC |
| **Base 主网** | `eip155:8453` | USDC |
| **Base Sepolia 测试网** | `eip155:84532` | USDC |

TRON 网络必须使用标准的 CAIP-2 标识符（`tron:0x…`）。旧的别名如 `tron-mainnet`、`tron:nile`、`mainnet` 等**已不再被接受**——CLI 会直接拒绝，并提示应改用的标准标识符。只有 EVM 别名仍会被自动接受并归一化：

| 别名 | 标准标识符 |
| :--- | :--- |
| `bsc-mainnet` | `eip155:56` |
| `bsc-testnet` | `eip155:97` |
| `base-mainnet` | `eip155:8453` |
| `base-sepolia` | `eip155:84532` |

:::caution 官方 facilitator 不结算 Shasta
CLI 接受 `tron:0x94a9059e`，但官方 facilitator（`https://facilitator.bankofai.io`）只启用了 TRON 主网/Nile、BSC 主网/测试网、Base 主网/Sepolia。因此 Shasta 上的支付无法在那里校验与结算——TRON 测试请用 `tron:0xcd8690dc`（Nile），或自建注册了 Shasta 的 facilitator。
:::

已注册代币的精度以注册表为准，不可覆盖。只有未注册的非 Base 资产，才需要用 `--asset <address>` 搭配 `--decimals <count>` 传入。

:::note 不同链的授权方式不同
TRON 与 BSC 的稳定币支付走 **Permit2** 授权，Base USDC 走 **EIP-3009**（`transferWithAuthorization`）。两者都在同一个 `exact` 方案下——CLI 会按网络自动选用，你不需要自己配置。
:::

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

- **让 Agent Wallet 保管私钥。** 它是默认付款方，并把签名交给配置的钱包后端完成；该后端可以是本地或远程。你不需要把私钥写进 CLI 配置或环境变量。`--private-key` 与 `*_PRIVATE_KEY` 变量仅用于开发和 CI。
- **先在测试网上验证。** 上主网前，先用 `tron:0xcd8690dc`、`eip155:97` 或 `eip155:84532` 跑通。
- **付款前先预览。** 用 `pay --dry-run` 在签名前看清确切的支付要求。
- **给金额设上限。** 用 `--max-amount` 或 `--max-raw-amount`，让定价异常的接口无法超额扣款。
- **不要盲目跟随重定向。** CLI 有意不自动跟随付费请求的 HTTP 重定向，以确保 `PAYMENT-SIGNATURE` 不会被转发到其他源。遇到重定向时，先确认目标地址，再显式请求最终 URL。
- **只放最小额度。** 付款方地址里只保留当前任务所需的资金。
:::

---

## 下一步

- 想快速跑通第一笔支付？→ [快速开始](./quickstart.md)
- 需要完整的命令与参数？→ [命令参考](./command-reference.md)
- 遇到问题或有疑问？→ [FAQ 与故障排查](./faq.md)
