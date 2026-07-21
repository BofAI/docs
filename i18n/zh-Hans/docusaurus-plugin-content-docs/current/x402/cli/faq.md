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

只有真正付款时才需要。只读命令——`pay --dry-run`、`catalog search`、`catalog show`、`gateway check`——都无需钱包。真正的 `pay` 或 `roundtrip` 才需要付款方私钥。

### 如何提供私钥？

设置以下环境变量之一：

- **TRON 网络** → `TRON_PRIVATE_KEY`
- **EVM 网络**（BSC） → `EVM_PRIVATE_KEY`
- **两种网络通用** → `PRIVATE_KEY`，当没有设置对应网络的专用变量时作为回退

你也可以用 `--private-key <hex>` 为单条命令传入，但请避免在共享 Shell 或提交到版本库的脚本里这样做——命令行参数会被记录到 Shell 历史和进程列表中。

:::caution
任何超出一次性测试范围的场景，请使用 [agent-wallet](../../Agent-Wallet/Intro.md) 付款钱包，而不是裸露的环境变量私钥；并且付款方地址里只保留当前任务所需的最小额度。
:::

### 支付会超出我的预期金额吗？

只要你封顶就不会。用 `--max-amount <人类可读金额>` 或 `--max-raw-amount <最小单位>`；如果接口价格超过上限，CLI 会在签名**之前**中止。拿不准时，先 `pay --dry-run` 看清确切的支付要求。

### 支持哪些网络和代币？

TRON（`tron:mainnet`、`tron:nile`、`tron:shasta`）与 BSC（`eip155:56`、`eip155:97`），并按网络内置 USDT、USDD、USDC 的注册表。完整表格见 [x402 CLI 概览](./index.md#支持的网络与代币)。若代币未注册，用 `--asset <address>` 搭配 `--decimals <count>`。

---

## 读懂错误

每次失败都会打印一个稳定的错误 `code`、一条 message 和一个 `hint`。加上 `--json` 可得到承载同样信息的结构化 JSON 输出。最常见的错误码：

| 错误码 | 发生了什么 | 如何修复 |
| :--- | :--- | :--- |
| `WALLET_NOT_CONFIGURED` | 找不到付款方私钥 | 设置 `TRON_PRIVATE_KEY` / `EVM_PRIVATE_KEY` / `PRIVATE_KEY`，或配置 agent-wallet 付款钱包 |
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
