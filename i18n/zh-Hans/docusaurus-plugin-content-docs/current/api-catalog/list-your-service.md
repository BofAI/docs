---
title: 上架你的服务
sidebar_label: 上架你的服务
description: 把你的 API 上架到 API 目录 —— 填表申请或直接提交 PR，两份公开文件，官方网关与自建网关均可，上线后即可被全网 AI Agent 发现并按次付费。
---

# 上架你的服务

上架一次，此后每一次 AI Agent 调用都是一笔入账。

把你的 API 接到网关之后，它就会出现在目录里：任意 Agent 都能发现它、调用它、为它付费。款项实时结算到你指定的钱包，**无平台托管、无结算周期**；可在 TRON 或 BNB Chain 上结算；现有 API 保持原样，**无需改动任何代码**，定价也由你自己说了算。

## 先看懂全景：上架到底是在做什么

上架的全部动作，就是向[目录仓库](https://github.com/BofAI/x402-catelog)提交一个 PR，里面只有两份**公开**文件：

| 文件 | 作用 |
|---|---|
| `providers/<fqn>/catalog.json` | 供前端、CLI、Agent 使用的公开服务信息 |
| `providers/<fqn>/pay.md` | 人和 Agent 可读的调用与支付说明 |

其中 `<fqn>` 是你的服务全局唯一标识（小写字母、数字、连字符），且必须与目录名一致。

目录仓库**只保存公开的发现数据**：不保存数据库，也不接收任何上游 API key、token、password、`provider.yml` 或 `.env`。自建网关时，密钥只留在你本地；用官方网关时，凭证托管在网关侧——两种情况下，密钥都**不会进入目录仓库**。

动手之前，先做两个决定。

## 决定一：用谁的网关

这决定两份文件里的调用地址（`serviceUrl` 与各端点的 `url`）填谁：

| | 官方网关（托管） | 自建网关 |
|---|---|---|
| 文件里的调用地址 | 官方域名（`gateway.bankofai.io/...`） | 你自己的网关域名 |
| 谁运行网关 | BANK OF AI | 你自己 |
| 资金与流量 | 经官方网关转发，结算到你的钱包 | 直达你的网关与钱包，不经过 BANK OF AI |
| 上游凭证放在哪 | 托管给官方网关 | 只留在你本地 |
| 适合谁 | 想最快上线、不想自己部署 | 希望凭证与基础设施完全自主 |

无论哪种，目录都只负责**发现**：Agent 实际调用的，永远是文件里登记的那个网关地址。

## 决定二：选一条提交途径

两条途径，终点相同——都是提交那个 PR。

**途径一：先填表，我们联系你**（推荐第一次接入）

1. **提交申请表单** —— 通过[目录页](https://bankofai.io/catalog)底部的 **Apply to list your service** 入口，填写服务名称、简介、API 地址、期望结算网络与联系方式；已注册 ERC-8004 身份地址的可一并填写，会被**优先处理**。
2. **等待联系** —— 我们会在 **1–2 个工作日**内通过邮箱或 Telegram 联系你，一起确认接口、定价、收款钱包，以及用官方网关还是自建网关。
3. **提交 PR** —— 沟通确认后，按下文步骤提交两份文件，合入即上线。

**途径二：直接提 PR**（熟悉流程的服务方）

跳过表单，直接按下文步骤准备文件、提交 PR。

## 第 1 步：准备两份公开文件

**自建网关**：先在自己的机器上把网关跑起来，再用 CLI 导出。下面的命令只会产出 `catalog.json` 与 `pay.md` 两份公开文件，不会带出任何密钥：

```bash
x402-cli catalog export-gateway https://gateway.example.com \
  --provider <fqn> \
  --output-dir providers/<fqn>
```

**官方网关**：接入沟通确认后，按分配给你的官方地址（形如 `https://gateway.bankofai.io/providers/<fqn>`）填写两份文件即可，格式参考下面的示例。

### catalog.json 长什么样

一个最小可用的示例（节选自示例服务 `acme-weather`）：

```json
{
  "version": 1,
  "fqn": "acme-weather",
  "title": "Acme Weather API",
  "subtitle": "City-level weather lookup",
  "description": "Current weather data for city-level applications.",
  "useCase": "Use for current weather lookup by city.",
  "i18n": {
    "zh-CN": {
      "title": "Acme 天气 API",
      "subtitle": "城市级实时天气查询",
      "description": "为城市级应用提供实时天气数据。",
      "useCase": "适合按城市查询当前天气。"
    }
  },
  "logo": "https://catalog.bankofai.io/assets/providers/acme-weather/logo.png",
  "category": "data",
  "chains": ["tron:mainnet", "eip155:56"],
  "isFirstParty": false,
  "isFeatured": false,
  "featuredTags": [],
  "serviceUrl": "https://gateway.bankofai.io/providers/acme-weather",
  "endpoints": [
    {
      "method": "GET",
      "path": "/v1/current",
      "url": "https://gateway.bankofai.io/providers/acme-weather/v1/current",
      "title": "Current Weather",
      "subtitle": "Lookup by city",
      "description": "Current weather for a city.",
      "useCase": "Use when an app needs real-time city weather.",
      "i18n": { "zh-CN": { "title": "实时天气", "subtitle": "按城市查询", "description": "查询指定城市的实时天气。", "useCase": "适合应用需要实时城市天气时使用。" } },
      "metered": true,
      "minPriceUsd": 0.002,
      "maxPriceUsd": 0.002
    }
  ]
}
```

各字段的完整定义见 [数据格式与 API 参考](./reference.md)。

### pay.md 怎么写

`pay.md` 是人和 Agent 都会读的调用说明，建议包含三部分：服务基本信息、各端点的地址与价格、一条可直接复制的调用示例：

````markdown
# Acme Weather API

## Service

- FQN: `acme-weather`
- Service URL: `https://gateway.bankofai.io/providers/acme-weather`
- Category: `data`
- Chains: `tron:mainnet`, `eip155:56`

## Endpoints

### GET /v1/current

Current weather for a city.

- URL: `https://gateway.bankofai.io/providers/acme-weather/v1/current`
- Price: `$0.002`

```bash
x402-cli pay 'https://gateway.bankofai.io/providers/acme-weather/v1/current?city=Shanghai'
```
````

### 提交前的校验清单

CI 会强制以下规则，建议提交前逐条对照：

- `version` 必须为 `1`。
- `fqn` 为小写字母/数字/连字符，且与目录名一致。
- `category` 必须是合法类目之一（见[参考](./reference.md#合法类目)）。
- `chains` 至少一条，使用 CAIP-2 风格的链 ID（如 `tron:mainnet`、`eip155:56`）。
- `isFirstParty`、`isFeatured`（布尔值）与 `featuredTags`（字符串数组，可为空 `[]`）为**必填**，缺一即校验失败。
- 每个 endpoint 的 `method` 必须大写、`path` 以 `/` 开头、`maxPriceUsd` 不小于 `minPriceUsd`。
- 服务与每个 endpoint 都必须提供 `i18n.zh-CN` 的 `title`、`subtitle`、`description`、`useCase`。
- `pay.md` 必须与 `catalog.json` 一同提交，两份文件都会被敏感信息扫描。
- 不得包含任何密钥、私钥或内网地址。

## 第 2 步：本地自检

提交前先在本地跑一遍校验和构建，确保字段合法、没有夹带敏感信息：

```bash
python3 scripts/validate.py
python3 scripts/build.py
```

期望看到：

```text
validated 1 provider(s)
built 1 provider(s) into dist
```

## 第 3 步：提交 Pull Request

把这两份文件加入[目录仓库](https://github.com/BofAI/x402-catelog)对应目录：

```text
providers/<fqn>/catalog.json
providers/<fqn>/pay.md
```

:::caution 安全红线：这两份文件是公开的
**绝不要**在其中包含上游 API key、bearer token、钱包私钥、密码、`provider.yml`、`.env`，或任何内网/本地地址（如 `localhost`、`127.0.0.1`、`10.x`、`192.168.x`）。CI 会自动扫描这些模式，命中即拒绝合并。
:::

## 第 4 步：合入即上线

PR 合入后，发布流程会把最新构建的 `dist/` 刷新到 Catalog Server / CDN，你的服务即在目录中上线，开始接受 Agent 调用。

## 下一步

- 查看全部字段、类目与接口结构 → [数据格式与 API 参考](./reference.md)
- 想先体验调用方视角？→ [快速开始](./get-started.md)
