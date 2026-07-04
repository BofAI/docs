---
title: 快速开始
sidebar_label: 快速开始
description: 3 分钟把你的 Agent 接入 API 目录 —— 安装 Agent Wallet，再安装 x402 CLI 即可发现并调用目录内的全部服务。
---

# 快速开始

只需两步、不到 3 分钟，你的 Agent 就能接入整个目录：装好钱包，再装上 x402 CLI。完成后，Agent 就能发现并调用目录里的任意服务，按次在链上付费。

**前提**：Node.js（用于钱包）和带 `pip` 的 Python（用于 CLI）。

## 第 1 步：安装 Agent Wallet

运行下面这行命令，你会装上一个在 TRON 与 BNB Chain 上管理稳定币的本地钱包。之后 Agent 发起的每一次付费调用，都由它在本地签名。

```bash
npm i @bankofai/agent-wallet
agent-wallet --help
```

## 第 2 步：安装 x402 CLI

一次安装，就把 Agent 接入了目录 —— 它通过 x402 发现并调用全部服务、按次付费。无需账号，也无需管理任何 API Key。

```bash
pip install bankofai-x402-cli
x402-cli --version
```

看到版本号即安装完成。两步到此结束 —— 你的 Agent 已经接入目录，可以开始调用了。

## 用 CLI 调用服务

装好后，Agent 就能通过 CLI 发现并调用服务。先按服务名或关键字搜索，看看目录里有什么：

```bash
x402-cli catalog search <keyword> --catalog https://x402-catelog.bankofai.io/api/catalog.json --json
```

查看某个服务的详情与可用端点：

```bash
x402-cli catalog show <fqn> --catalog https://x402-catelog.bankofai.io/api/catalog.json --json
x402-cli catalog endpoints <fqn> --catalog https://x402-catelog.bankofai.io/api/catalog.json --json
```

确认后，直接对目标端点发起一次付费调用——报价、付款、取回结果一步完成。简单的 GET 端点只需给出 URL：

```bash
x402-cli pay 'https://x402-gateway.bankofai.io/providers/<fqn>/...'
```

如果是 POST 端点，或想指定支付链、代币与方案，显式传入对应参数：

```bash
x402-cli pay 'https://x402-gateway.bankofai.io/providers/<fqn>/<path>' \
  --method POST \
  --network tron:mainnet \
  --token USDT \
  --scheme exact \
  --max-amount 0.000001 \
  --header 'Content-Type: application/json' \
  --body '{ ... }'
```

| 参数 | 作用 |
|---|---|
| `--method` | HTTP 方法（默认 `GET`） |
| `--network` | CAIP-2 支付链，如 `tron:mainnet`、`eip155:56` |
| `--token` | 结算代币，如 `USDT` |
| `--scheme` | 路由声明的 x402 支付方案，如 `exact` 或 `exact_gasfree` |
| `--max-amount` | 美元支出上限；报价超出即中止调用 |
| `--header` / `--body` | 转发到上游的请求头与请求体 |

跨多条链结算的服务会为每个网络提供一条路由（`x402Routes`）；按你想付款的链选择对应路由，以及匹配的 `--network` / `--scheme`。

:::tip
`--catalog` 既可以指向上面的线上地址，也可以指向你本地构建出来的 `dist/catalog.json`，方便离线调试。
:::

## 一次付费调用发生了什么

每一笔调用都通过 x402 在链上清算，报价即为实付，始终一致：

1. **Agent 发起调用** —— 请求目标端点。
2. **网关报价** —— 返回价格（HTTP `402`）。
3. **钱包付款** —— Agent 在链上完成支付。
4. **验款并结算** —— 网关验款，款项结算至服务方钱包。
5. **返回结果** —— 网关把上游结果返回给 Agent。

上游凭证始终保留在网关侧，调用方 Agent 全程接触不到任何密钥。

:::tip 几点提示
- **免费端点**：不是每次调用都要付钱。服务方设为免费的端点不会向你收费——没有报价环节，直接返回结果，钱包不会发生任何扣款。
- **还没创建钱包？** 先按 [Agent Wallet 快速开始](../../Agent-Wallet/QuickStart.md) 创建并充值钱包（不到一分钟）。Catalog 复用同一个钱包，无需重复配置。
- **风险隔离**：钱包里只放少量稳定币用于按次付费，主资产请勿放在 Agent 钱包中。
:::

## 下一步

- 浏览目录里的全部服务，或了解响应结构 → [数据格式与 API 参考](./reference.md)
- 你也有 API 想上架变现？→ [上架你的服务](./list-your-service.md)
