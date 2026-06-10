---
title: 快速开始
sidebar_label: 快速开始
description: 3 分钟把你的 Agent 接入 API 目录 —— 安装 Agent Wallet，一次 MCP 安装即可发现并调用目录内的全部服务。
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 快速开始

只需两步、不到 3 分钟，你的 Agent 就能接入整个目录：装好钱包，再做一次 MCP 安装。完成后，Agent 就能按名称发现并调用目录里的任意服务，按次在链上付费。

**前提**：一个支持 MCP 的 Agent（Claude Code、OpenAI Codex、Cursor、Continue 等均可）。

## 第 1 步：安装 Agent Wallet

运行下面这行命令，你会装上一个在 TRON 与 BNB Chain 上管理稳定币的本地钱包。之后 Agent 发起的每一次付费调用，都由它在本地签名。

```bash
npm i @bankofai/agent-wallet
```

:::tip 还没创建钱包？
先按 [Agent Wallet 快速开始](../Agent-Wallet/QuickStart.md) 创建并充值钱包（不到一分钟）。Catalog 复用同一个钱包，无需重复配置。
:::

:::caution 风险隔离
钱包里只放少量稳定币用于按次付费，主资产请勿放在 Agent 钱包中。
:::

## 第 2 步：把 Catalog 接入你的 Agent

一次 MCP 安装，Agent 立刻就能看到目录里的全部服务，并能按名称调用——无需账号，也无需管理任何 API Key。

<Tabs>
  <TabItem value="claude" label="Claude Code" default>

```bash
claude mcp add bankofai -s user -- npx @bankofai/mcp-catalog
```

  </TabItem>
  <TabItem value="other" label="其它 MCP Agent">

同样适用于 OpenAI Codex、Cursor、Continue 等任何兼容 MCP 的 Agent：在其 MCP 配置中加入一个名为 `bankofai` 的 server，启动命令为：

```bash
npx @bankofai/mcp-catalog
```

  </TabItem>
</Tabs>

装好后，直接对你的 Agent 说一句自然语言即可，例如「搜索一个天气 API 并查询上海的实时天气」。Agent 会在目录里找到对应服务、获取报价、用钱包完成链上支付，再把结果返回给你——这一整套发现、付费、调用，全程自动完成。

## 命令行调用（可选）

如果你更习惯命令行，`x402-cli` 提供同一套能力：搜索、查看、直接付费调用。

先按服务名或关键字搜索，看看目录里有什么：

```bash
x402-cli catalog search weather --catalog https://catalog.bankofai.io/api/catalog.json --json
```

查看某个服务的详情与可用端点：

```bash
x402-cli catalog show acme-weather --catalog https://catalog.bankofai.io/api/catalog.json --json
x402-cli catalog endpoints acme-weather --catalog https://catalog.bankofai.io/api/catalog.json --json
```

确认后，直接对目标端点发起一次付费调用——报价、付款、取回结果一步完成：

```bash
x402-cli pay 'https://gateway.bankofai.io/providers/acme-weather/v1/current?city=Shanghai'
```

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

:::tip 免费端点
不是每次调用都要付钱：服务方设为免费的端点不会向你收费——没有报价环节，直接返回结果，钱包不会发生任何扣款。
:::

## 下一步

- 浏览目录里的全部服务，或了解响应结构 → [数据格式与 API 参考](./reference.md)
- 你也有 API 想上架变现？→ [上架你的服务](./list-your-service.md)
