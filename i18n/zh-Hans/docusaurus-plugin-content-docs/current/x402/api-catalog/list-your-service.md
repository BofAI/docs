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
| 文件里的调用地址 | 官方域名（`x402-gateway.bankofai.io/...`） | 你自己的网关域名 |
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

**官方网关**：接入沟通确认后，按分配给你的官方地址（形如 `https://x402-gateway.bankofai.io/providers/<fqn>`）填写两份文件即可，格式参考下面的示例。

### catalog.json 长什么样

一个基于 **SunPump** 服务的示例（原样取自 `providers/sunpump-token-launch/`）：

```json
{
  "version": 1,
  "fqn": "sunpump-token-launch",
  "title": "SunPump",
  "mainTitle": "One-call agent token launch, paid via x402",
  "subtitle": "Create a meme or agent token from structured metadata.",
  "description": "## What it does\n\nSunPump Agent Token Launch API lets agents, scripts, and applications pay with x402 and submit token launch metadata to SunPump. The gateway forwards the caller's JSON payload to the SunPump launch endpoint after payment settlement.\n\n## Best for\n\n- Agent workflows that need to create a meme or agent token from structured metadata.\n- Operator tools that want one paid API call for token creation.\n- Mainnet payment flows across TRON and BSC while using the same SunPump launch request shape.\n\n## Request shape\n\nPOST a JSON body with `name`, `symbol`, `description`, `imageBase64`, `twitterUrl`, `telegramUrl`, `websiteUrl`, and `tweetUsername`. Keep `name` within 1-20 characters and use a unique symbol. `imageBase64` may include a base64-encoded token image; if it is empty or omitted, SunPump generates an image automatically.\n\n## Code usage\n\nUse `x402-cli pay` against the route for the mainnet payment chain you want. TRON Mainnet example:\n\n```bash\nx402-cli pay 'https://x402-gateway.bankofai.io/providers/sunpump-token-launch-tron/pump-api/ai/agentTokenLaunch' \\\n  --method POST \\\n  --network tron:mainnet \\\n  --token USDT \\\n  --scheme exact \\\n  --max-amount 0.000001 \\\n  --header 'Content-Type: application/json' \\\n  --body '{\"name\":\"X402MainA\",\"symbol\":\"X4M17\",\"description\":\"x402 launch\",\"imageBase64\":\"\",\"twitterUrl\":\"\",\"telegramUrl\":\"\",\"websiteUrl\":\"\",\"tweetUsername\":\"\"}'\n```\n\nBSC Mainnet uses `sunpump-token-launch-bsc` with `eip155:56` and the same JSON body.",
  "useCase": "Use this provider when an app, agent, or CLI workflow needs to launch a SunPump token after a successful x402 payment. Choose the route matching the intended mainnet payment chain: TRON Mainnet or BSC Mainnet.",
  "i18n": {
    "zh-CN": {
      "title": "SunPump",
      "subtitle": "用结构化元数据一次付费发币(meme/Agent 代币)。",
      "description": "## 能做什么\n\nSunPump Agent 发币 API 允许 Agent、脚本和应用先完成 x402 支付，再把发币元数据提交给 SunPump。Gateway 在支付结算后把调用方的 JSON 请求体转发到 SunPump 发币接口。\n\n## 适合场景\n\n- 需要基于结构化元数据创建 meme token 或 agent token 的 Agent 工作流。\n- 希望用一次付费 API 调用完成发币的运营工具。\n- 在 TRON 和 BSC 主网上使用同一套 SunPump 发币请求格式验证支付流程。\n\n## 请求格式\n\nPOST JSON 请求体包含 `name`、`symbol`、`description`、`imageBase64`、`twitterUrl`、`telegramUrl`、`websiteUrl` 和 `tweetUsername`。`name` 需要保持在 1-20 个字符内，并使用唯一 symbol。`imageBase64` 可以传入 base64 编码的 token 图片；如果为空或不传，SunPump 会自动生成图片。\n\n## 代码用法\n\n使用 `x402-cli pay` 调用目标主网支付链对应的路由。TRON 主网示例：\n\n```bash\nx402-cli pay 'https://x402-gateway.bankofai.io/providers/sunpump-token-launch-tron/pump-api/ai/agentTokenLaunch' \\\n  --method POST \\\n  --network tron:mainnet \\\n  --token USDT \\\n  --scheme exact \\\n  --max-amount 0.000001 \\\n  --header 'Content-Type: application/json' \\\n  --body '{\"name\":\"X402MainA\",\"symbol\":\"X4M17\",\"description\":\"x402 launch\",\"imageBase64\":\"\",\"twitterUrl\":\"\",\"telegramUrl\":\"\",\"websiteUrl\":\"\",\"tweetUsername\":\"\"}'\n```\n\nBSC 主网使用 `sunpump-token-launch-bsc` 和 `eip155:56`，请求体相同。",
      "useCase": "适合应用、Agent 或 CLI 流程在 x402 支付成功后调用 SunPump 发币接口。根据主网支付链选择 TRON 主网或 BSC 主网路由。",
      "mainTitle": "一次付费完成 Agent 代币发行(x402)"
    }
  },
  "logo": "https://sunpump.meme/favicon.ico",
  "category": "finance",
  "chains": [
    "tron:mainnet",
    "eip155:56"
  ],
  "isFirstParty": true,
  "isFeatured": true,
  "featuredTags": [
    "sunpump",
    "token-launch",
    "agent-token",
    "tron",
    "bsc"
  ],
  "serviceUrl": "https://sunpump.meme",
  "endpoints": [
    {
      "method": "POST",
      "path": "/pump-api/ai/agentTokenLaunch",
      "url": "https://x402-gateway.bankofai.io/providers/sunpump-token-launch-tron/pump-api/ai/agentTokenLaunch",
      "x402Routes": [
        {
          "network": "tron:mainnet",
          "provider": "sunpump-token-launch-tron",
          "scheme": "exact",
          "url": "https://x402-gateway.bankofai.io/providers/sunpump-token-launch-tron/pump-api/ai/agentTokenLaunch"
        },
        {
          "network": "eip155:56",
          "provider": "sunpump-token-launch-bsc",
          "scheme": "exact",
          "url": "https://x402-gateway.bankofai.io/providers/sunpump-token-launch-bsc/pump-api/ai/agentTokenLaunch"
        }
      ],
      "title": "Launch Agent Token",
      "subtitle": "Create a SunPump token from metadata",
      "description": "Submit token metadata to SunPump after x402 payment settlement. `imageBase64` can carry a base64-encoded token image; when it is empty or omitted, SunPump generates an image automatically. The response includes SunPump status and token data such as token id, owner address, contract address, logo URL, create transaction hash, reserves, and market data when available.",
      "useCase": "Use this endpoint when an agent or backend has already validated launch metadata and is ready to create the token.",
      "i18n": {
        "zh-CN": {
          "title": "Agent 发币",
          "subtitle": "根据元数据创建 SunPump token",
          "description": "在 x402 支付结算后向 SunPump 提交发币元数据。`imageBase64` 可以携带 base64 编码的 token 图片；为空或不传时，SunPump 会自动生成图片。响应包含 SunPump 状态和 token 数据，例如 token id、owner address、contract address、logo URL、create transaction hash、储备和市场数据等。",
          "useCase": "适合 Agent 或后端已经校验好发币元数据，准备正式创建 token 的场景。"
        }
      },
      "metered": true,
      "minPriceUsd": 0.000001,
      "maxPriceUsd": 0.000001
    }
  ],
  "status": {
    "catalog": "listed",
    "gateway": "configured",
    "payment": "mainnet",
    "upstream": "public"
  }
}
```

各字段的完整定义见 [数据格式与 API 参考](./reference.md)。

### pay.md 怎么写

`pay.md` 是人和 Agent 都会读的调用说明，建议包含三部分：服务基本信息、各端点的地址与价格、一条可直接复制的调用示例：

````markdown
# SunPump Agent Token Launch API

SunPump Agent Token Launch API is an x402-paid gateway provider for launching a SunPump token from structured metadata. It exposes the same launch request shape across TRON and BSC payment routes.

Use it when an agent, backend workflow, or CLI script has already validated the launch metadata and is ready to create the token.

## Service

- FQN: `sunpump-token-launch`
- Service URL: `https://sunpump.meme`
- Category: `finance`
- Chains: `tron:mainnet`, `eip155:56`
- TRON Mainnet gateway base: `https://x402-gateway.bankofai.io/providers/sunpump-token-launch-tron`
- BSC Mainnet gateway base: `https://x402-gateway.bankofai.io/providers/sunpump-token-launch-bsc`

## CLI Quick Start

Install or update the x402 CLI, then call the route matching the payment chain you want to use.

TRON Mainnet:

```bash
x402-cli pay 'https://x402-gateway.bankofai.io/providers/sunpump-token-launch-tron/pump-api/ai/agentTokenLaunch' \
  --method POST \
  --network tron:mainnet \
  --token USDT \
  --scheme exact \
  --max-amount 0.000001 \
  --header 'Content-Type: application/json' \
  --body '{"name":"X402MainA","symbol":"X4M17","description":"x402 launch","imageBase64":"","twitterUrl":"","telegramUrl":"","websiteUrl":"","tweetUsername":""}'
```

BSC Mainnet:

```bash
x402-cli pay 'https://x402-gateway.bankofai.io/providers/sunpump-token-launch-bsc/pump-api/ai/agentTokenLaunch' \
  --method POST \
  --network eip155:56 \
  --token USDT \
  --scheme exact \
  --max-amount 0.000001 \
  --header 'Content-Type: application/json' \
  --body '{"name":"X402BscA","symbol":"X4B17","description":"x402 launch","imageBase64":"","twitterUrl":"","telegramUrl":"","websiteUrl":"","tweetUsername":""}'
```

## Endpoint

### POST /pump-api/ai/agentTokenLaunch

Create a SunPump token from JSON metadata after x402 payment settlement.

Required request fields:

- `name`: token name, 1-20 characters.
- `symbol`: token symbol. Use a unique value.
- `description`: token description.
- `imageBase64`: optional base64-encoded token image. Leave it empty or omit it to let SunPump generate an image automatically.
- `twitterUrl`, `telegramUrl`, `websiteUrl`: optional social links, or empty strings.
- `tweetUsername`: optional tweet username, or an empty string.

The upstream response returns SunPump status and token launch data such as token id, owner address, contract address, create transaction hash, logo URL, reserves, and market data when available.

## Integration Notes

- The endpoint has side effects: a successful paid call can create a token.
- Validate metadata before paying. In particular, keep `name` within 1-20 characters.
- You can provide your own token image with `imageBase64`; otherwise the launch service generates one.
- Current listed prices are fixed per request across both mainnet payment routes.
- The public catalog does not contain gateway runtime secrets or wallet keys.
````

### 提交前的校验清单

CI 会强制以下规则，建议提交前逐条对照：

- `version` 必须为 `1`。
- `fqn` 为小写字母/数字/连字符，且与目录名一致。
- `category` 必须是合法类目之一（见[参考](./reference.md#合法类目)）。
- `chains` 至少一条，使用 CAIP-2 风格的链 ID —— 主网或测试网均可（如 `tron:mainnet`、`tron:nile`、`eip155:56`、`eip155:97`）。
- `isFirstParty`、`isFeatured`（布尔值）与 `featuredTags`（字符串数组，可为空 `[]`）为**必填**，缺一即校验失败。
- 每个 endpoint 的 `method` 必须大写、`path` 以 `/` 开头、`maxPriceUsd` 不小于 `minPriceUsd`。
- _（选填）_ 跨多条链结算的端点可加 `x402Routes`，每个网络一条（`network`、`provider`、`scheme`、`url`）。详见[参考](./reference.md#x402routes--多网络路由)。
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
