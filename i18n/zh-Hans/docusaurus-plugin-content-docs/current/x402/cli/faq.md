---
title: 'FAQ 与故障排查'
description: >-
  x402 CLI 的常见问题、错误码与修复方法。
---

# FAQ 与故障排查

x402 CLI 的常见问题与排查建议。

---

## 安装与配置

### 系统要求是什么？

- **Node.js** 20 或更高
- **npm**（随 Node.js 一起安装）
- macOS、Linux 或 Windows（推荐 WSL）上的终端

### 如何更新 CLI？

```bash
npm update -g @bankofai/x402-cli
```

### 不全局安装能用吗？

可以。在已安装它的项目里运行 `node dist/cli.js <command>`，或使用 `npx @bankofai/x402-cli <command>`。

---

## 钱包与支付

### 使用 CLI 一定要钱包吗？

只有真正付款时才需要。只读命令——`pay --dry-run`、`catalog search`、`catalog show`、`gateway check`——都无需钱包。真正的 `pay` 或 `roundtrip` 会用你当前激活的 [Agent Wallet](../../Agent-Wallet/Intro.md) 签名。

### CLI 怎么决定用哪个钱包签名？

它会为支付网络解析出**当前激活的 Agent Wallet**。如果配置了钱包但没有标记激活项，CLI 会在签名前停下、而不是替你猜——请设置激活钱包，或显式指定：

- `--wallet-id <id>` 或 `AGENT_WALLET_ID` —— 指定某个已配置的钱包
- `AGENT_WALLET_DIR` —— 使用非默认的 Agent Wallet 目录

CLI 不会从 `wallets_config.json` 里读取私钥。在 EVM 网络上，它还会在签名前检查付款方的代币余额，并在结果中返回解析出的钱包 ID、地址与原始余额。

### 还能用裸私钥吗？

可以，但仅限开发与 CI：`--private-key <hex>`，或 `EVM_PRIVATE_KEY` / `TRON_PRIVATE_KEY` / `PRIVATE_KEY` 环境变量。共享环境中请优先用环境变量而非命令行参数——后者会被记录到 Shell 历史和进程列表中。

:::caution
任何超出一次性测试范围的场景，请使用 Agent Wallet 而不是裸私钥；并且付款方地址里只保留当前任务所需的最小额度。
:::

### 支付会超出我的预期金额吗？

只要你封顶就不会。用 `--max-amount <人类可读金额>` 或 `--max-raw-amount <最小单位>`；如果接口价格超过上限，CLI 会在签名**之前**中止。拿不准时，先 `pay --dry-run` 看清确切的支付要求。

### 支持哪些网络和代币？

TRON（`tron:0x2b6653dc`、`tron:0xcd8690dc`、`tron:0x94a9059e`）、BSC（`eip155:56`、`eip155:97`）与 Base（`eip155:8453`），并按网络内置 USDT、USDD、USDC 的注册表。完整表格见 [x402 CLI 概览](./index.md#支持的网络与代币)。已注册代币的精度以注册表为准；只有未注册的非 Base 资产，才需要用 `--asset <address>` 搭配 `--decimals <count>`。

TRON 网络必须传标准的 CAIP-2 标识符（`tron:0x…`）。旧标识如 `tron:nile`、`tron:mainnet`、`mainnet` 等已不再被接受——CLI 会拒绝并提示应改用的标准标识符。EVM 别名（`bsc-mainnet`、`bsc-testnet`、`base-mainnet`）仍可使用。

### 在 Base 上付款有什么不同？

Base 结算 USDC 用的是 **EIP-3009**（`transferWithAuthorization`）而非 Permit2，但仍属于 `exact` 方案。这一点不需要你配置——CLI 会按网络自动采用正确的授权方式。唯一需要你自己设置的是 RPC：内置的公共端点仅供开发使用，生产环境请传 `--rpc-url`，或设置 `EVM_RPC_URL_8453` / `EVM_RPC_URL`。详见 [在 Base 上付款](./command-reference.md#paying-on-base)。

### 可以在不持有 TRX 的情况下付款吗？

可以，在 TRON 上通过 GasFree 实现。使用 `scheme=exact_gasfree` 时，由一个 relayer 代付网络能量、并从支付代币里扣除手续费，所以付款钱包只需要稳定币、无需 TRX。当接口宣告了该 scheme 时 CLI 会自动选用，也可以用 `--scheme exact_gasfree` 显式要求。由于 relayer 手续费与支付金额分开，用 `--max-gasfree-fee <amount>` 给它封顶。详见 [GasFree 支付](./command-reference.md#gasfree-payments-tron)。

---

## 读懂错误

每次失败都会打印一个稳定的错误 `code`、一条 message 和一个 `hint`。加上 `--json` 可得到承载同样信息的结构化 JSON 输出。最常见的错误码：

| 错误码 | 发生了什么 | 如何修复 |
| :--- | :--- | :--- |
| `WALLET_NOT_CONFIGURED` | 该网络没有激活的 Agent Wallet | 设置激活钱包，或用 `--wallet-id` / `AGENT_WALLET_ID` 指定。开发/CI 场景可用 `--private-key` 或 `*_PRIVATE_KEY` 变量 |
| `WALLET_PASSWORD_REQUIRED` | Agent Wallet 需要解锁密码 | 通过 Agent Wallet 支持的安全配置方式提供密码 |
| `WALLET_DECRYPTION_FAILED` | Agent Wallet 密码错误 | 用正确的密码解锁后重试 |
| `WALLET_CONFIG_CORRUPT` | Agent Wallet 配置无法读取 | 检查 `~/.agent-wallet/wallets_config.json`，或重建本地配置 |
| `WALLET_NETWORK_ERROR` | 连不上 Agent Wallet 后端 | 检查到所配置钱包后端的网络连通性 |
| `WALLET_SIGNING_FAILED` | 钱包未能生成签名 | 确认激活钱包支持该网络与本次 typed-data 签名请求 |
| `WALLET_UNSUPPORTED_OPERATION` | 钱包后端不支持该网络的 typed-data 签名 | 换用支持该网络 typed-data 签名的钱包后端 |
| `WALLET_AUTH_FAILED` | 远程钱包认证被拒绝 | 检查远程钱包的认证配置 |
| `WALLET_ERROR` | 其他 Agent Wallet 故障 | 检查激活钱包的配置与后端状态 |
| `TOKEN_TRANSFER_FAILED` | 代币 `transferFrom` 回滚 | 检查代币余额、代币合约，以及付款方的授权额度 |
| `TRON_ACCOUNT_NOT_ACTIVATED` | 该 TRON 地址从未在链上使用过 | 先给它转一小笔 TRX 激活，再签名 |
| `INSUFFICIENT_TOKEN_BALANCE` | 付款方缺少被收取的代币 | 用服务方宣告的确切代币和网络给付款方充值 |
| `INSUFFICIENT_GAS` | 原生 gas / 能量不足 | 给付款方充值该网络的原生 gas 代币（TRX / BNB） |
| `NO_MATCHING_PAYMENT_REQUIREMENT` | 没有符合你筛选条件的支付要求 | 放宽 `--network`、`--token` 或 `--scheme`，或使用服务方提供的值 |
| `PAYMENT_AMOUNT_TOO_HIGH` | 价格超过了你的 `--max-amount` | 确认价格符合预期后再提高上限 |
| `INVALID_X402_RESPONSE` | 接口返回 `402` 但缺少 `PAYMENT-REQUIRED` 头 | 接口配置有误，请联系服务方 |
| `PERMIT_REVERTED` | 代币/Permit2 拒绝了签名 | 用一份全新的支付要求重试；核实代币/网络支持情况 |
| `DEADLINE_OR_CLOCK_SKEW` | 支付要求过期或本地时钟偏差 | 校准本地时钟，用全新支付要求重试 |
| `RATE_LIMITED` | 上游服务或 RPC 在限流 | 稍候再重试 |
| `NETWORK_ERROR` | 无法访问 URL/RPC | 检查 URL、本地服务、代理和网络连通性 |
| `SDK_API_DRIFT` | 已安装的 SDK 包与 CLI 不匹配 | 重装 `@bankofai/x402-cli` 及其 SDK 依赖 |

### "402 response missing PAYMENT-REQUIRED header"

接口返回了 `402` 却没有附带机器可读的 `PAYMENT-REQUIRED` 支付要求头。这是服务端配置问题——CLI 无法从中推导出支付要求。

### "no matching payment requirement"

接口提供了支付选项，但没有一个符合你的 `--network`、`--token` 或 `--scheme` 筛选。去掉这些筛选、运行 `pay --dry-run --json`，看看服务方实际接受什么，再据此收窄条件。

---

## 网关

### `gateway start` 提示找不到运行时

`gateway start` 与 `gateway catalog` 需要独立的 `@bankofai/x402-gateway` 包。请安装它（`npm install -g @bankofai/x402-gateway`）、从含有 `../x402-gateway/dist/cli.js` 的检出中运行，或用 `--gateway-bin <path>` 指向可执行文件。

### 部署前如何校验我的 provider 文件？

```bash
x402-cli gateway check ./providers
```

它会解析每个 `provider.yml`，检查必填字段（`name`、`forward_url`、`operator.network`、`operator.recipient`），校验每个接口，并报告重复项。

---

## 服务目录

### `catalog` 默认从哪里读取？

省略 `--catalog` 时，来源按此顺序解析：环境变量 `X402_CATALOG` / `X402_GATEWAY_CATALOG`，然后是本地缓存（`~/.cache/x402-cli/catalog/catalog.json`），最后是托管默认值 `https://x402-catalog.bankofai.io/api/catalog.json`。

### 如何让搜索更快或离线可用？

运行一次 `x402-cli catalog update`，把托管目录和服务详情缓存到本地，之后的搜索都从缓存读取。

---

## 输出与脚本

### 如何获取机器可读的输出？

给任意命令加 `--json`，即可得到含 `ok`、`command`，以及 `result` 或结构化 `error` 的 JSON 输出。这是脚本和 AI Agent 推荐使用的模式。

### 退出码分别代表什么？

`0` 成功，`1` 运行时错误（网络、钱包、结算），`2` 用法错误（缺少/非法参数或未知命令）。

---

## 还是卡住了？

- 用 `x402-cli <command> --help` 重新查看某命令的确切用法。
- 在 [命令参考](./command-reference.md) 里查阅每个参数。
- 在 [核心概念](../core-concepts/http-402.md) 中了解底层握手的运作方式。
