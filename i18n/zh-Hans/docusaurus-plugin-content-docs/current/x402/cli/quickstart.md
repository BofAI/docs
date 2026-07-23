---
title: '快速开始'
description: >-
  安装 x402 CLI，在 TRON Nile 测试网上几分钟内跑通一次完整的"支付—结算"回路。
---

# 快速开始

这一页的目标很简单：**安装 CLI，在测试网上几分钟内跑通一次完整的支付回路。** 所有测试网操作都使用免费测试代币——不涉及任何真实资金。

---

## 准备工作

开始前，请确认你已具备：

1. **Node.js** >= 20（[下载](https://nodejs.org/)）
2. **npm**（随 Node.js 一起安装）
3. 用于支付步骤的一个有余额的测试网地址——一个 TRON **Nile** 地址，持有少量测试 **USDT** 和 **TRX**（用于能量）。参见 [钱包](../core-concepts/wallet.md)。

验证你的环境：

```bash
node --version   # v20.x 或更高
npm --version
```

---

## 第 1 步：安装

全局安装 CLI，让 `x402-cli` 命令在任何地方都可用：

```bash
npm install -g @bankofai/x402-cli
```

确认它已就绪：

```bash
x402-cli --version
x402-cli --help
```

你应当看到版本号，以及命令列表（`pay`、`serve`、`roundtrip`、`gateway`、`catalog`）。

---

## 第 2 步：先不花钱试一试

看到接口真实返回的 `402` 支付要求的最快方式是**空跑（dry run）**。它会探测接口、读取支付要求，并原样打印出你将被要求支付的内容——但不签名、不花钱：

```bash
x402-cli pay https://api.example.com/paid \
  --network tron:nile \
  --token USDT \
  --dry-run \
  --json
```

`--dry-run` 的输出包含被选中的支付要求（网络、资产、金额、收款地址）。这就是你的安全网：支付一个陌生接口前，永远先空跑一次。

---

## 第 3 步：在测试网跑一次完整回路

`roundtrip` 会启动一个临时的本地付费端点、支付它、然后退出——一次完整的端到端测试。你需要一个 Nile 测试网的付款方私钥。

```bash
TRON_PRIVATE_KEY=<你的-nile-十六进制私钥> \
x402-cli roundtrip \
  --pay-to <你的-nile-收款地址> \
  --amount 0.0001 \
  --network tron:nile \
  --token USDT
```

成功时，CLI 会打印出已结算的交易。那串交易哈希，就是这笔支付已在链上清算的凭证——恭喜，你的环境端到端跑通了。

:::caution 保管好你的私钥
私钥请通过环境变量传入（TRON 用 `TRON_PRIVATE_KEY`，EVM 用 `EVM_PRIVATE_KEY`，`PRIVATE_KEY` 是两种网络通用的回退），绝不要在共享 Shell 或提交到版本库的脚本里以明文命令行参数传递——命令行参数可能被本机其它进程看到。任何超出一次性测试范围的场景，请使用 [agent-wallet](../../Agent-Wallet/QuickStart.md) 付款钱包。
:::

---

## 第 4 步：支付真实的 x402 接口

回路跑通后，支付任意受 x402 保护的 URL，就是同一条 `pay` 命令指向真实资源：

```bash
TRON_PRIVATE_KEY=<你的十六进制私钥> \
x402-cli pay https://api.example.com/paid \
  --network tron:nile \
  --token USDT \
  --max-amount 0.01
```

`--max-amount` 给你愿意支付的金额封顶：如果接口价格超过它，CLI 会在签名前中止。EVM 网络请使用 `EVM_PRIVATE_KEY`（或通用回退 `PRIVATE_KEY`）以及像 `eip155:97` 这样的 EVM 网络。

---

## 可选：运行你自己的付费端点

想收费而不是付费？启动一个本地 x402 服务：

```bash
x402-cli serve \
  --pay-to <你的收款地址> \
  --amount 0.0001 \
  --network tron:nile \
  --token USDT \
  --port 4020
```

它会暴露以下路由：

- `GET /health` —— 存活检查
- `GET /.well-known/x402` —— 机器可读的支付元数据
- `GET /pay` —— 返回 `402 Payment Required`
- `POST /pay` —— 通过 Facilitator 校验并结算已提交的支付

在另一个终端里支付它：

```bash
TRON_PRIVATE_KEY=<hex> x402-cli pay http://127.0.0.1:4020/pay --network tron:nile --token USDT
```

用 `--facilitator-url` 指向特定的 Facilitator（默认 `https://facilitator.bankofai.io`），加上 `--daemon` 可让服务在后台运行并打印子进程 id。

---

## 下一步

- **[命令参考](./command-reference.md)** —— 每条命令与参数：`pay`、`serve`、`roundtrip`、`gateway`、`catalog`。
- **[FAQ 与故障排查](./faq.md)** —— 修复常见错误、读懂错误码。
- **[核心概念](../core-concepts/http-402.md)** —— `402` 握手与 Facilitator 结算到底是怎么运作的。
