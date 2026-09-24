---
title: List Your Service
sidebar_label: List Your Service
description: List your API in the API Catalog — apply via the form or open a PR directly; two public files; official or self-hosted gateway both work. Once live, every AI Agent can discover it and pay per call.
---

# List Your Service

List once — every AI Agent call after that is revenue in.

Put your API behind the Gateway and it appears in the catalog: any Agent can discover it, call it, and pay for it. Payments settle to the wallet you specify in real time — **no platform escrow, no payout cycle**; settle on TRON, BNB Chain, or Base Mainnet; your existing API stays exactly as it is, **not one line of code changes**, and you set the prices.

## The big picture: what listing actually means

Listing comes down to one action: opening a PR against the [catalog repository](https://github.com/BofAI/x402-catalog) with just two **public** files:

| File | Purpose |
|---|---|
| `providers/<fqn>/catalog.json` | Public service info used by the frontend, CLI, and Agents |
| `providers/<fqn>/pay.md` | Human- and Agent-readable call & payment instructions |

`<fqn>` is your service's globally unique identifier (lowercase letters, digits, hyphens) and must match the directory name.

The catalog repository **stores public discovery data only**: it keeps no database and never accepts upstream API keys, tokens, passwords, `provider.yml`, or `.env`. With a self-hosted gateway your secrets stay on your machine; with the official gateway your credentials are held on the gateway side — either way, secrets **never enter the catalog repository**.

Before you start, make two decisions.

## Decision 1: whose gateway?

This determines what goes into the call addresses (`serviceUrl` and each endpoint's `url`) in your two files:

| | Official gateway (hosted) | Self-hosted gateway |
|---|---|---|
| Call address in your files | Official domain (`x402-gateway.bankofai.io/...`) | Your own gateway domain |
| Who runs the gateway | BANK OF AI | You |
| Funds & traffic | Proxied through the official gateway, settled to your wallet | Straight to your gateway and wallet, never passing through BANK OF AI |
| Where upstream credentials live | Held by the official gateway | Your machine only |
| Best for | Fastest launch, nothing to deploy | Full control over credentials and infrastructure |

Either way, the catalog handles **discovery** only: what Agents actually call is always the gateway address registered in your files.

## Decision 2: pick a submission route

Two routes, one destination — that PR.

**Route 1: apply first, we'll contact you** (recommended for first-time providers)

1. **Submit the application form** — via the **Apply to list your service** entry at the bottom of the [catalog page](https://bankofai.io/catalog): service name, short description, API URL, preferred settlement network(s), and contact info. If you've registered an ERC-8004 identity address, include it — verified applicants are **prioritized**.
2. **We get in touch** — within **1–2 business days** by email or Telegram, to confirm endpoints, pricing, payout wallet, and whether you'll use the official or a self-hosted gateway.
3. **Open the PR** — once everything is confirmed, follow the steps below; your service goes live when it merges.

**Route 2: open a PR directly** (for providers familiar with the flow)

Skip the form and follow the steps below to prepare the files and open the PR.

## Step 1: Prepare the two public files

**Self-hosted gateway**: run and validate your Gateway, then prepare `catalog.json` and `pay.md` using the formats below. Include public endpoints, prices, and payment details only.

**Official gateway**: once onboarding is confirmed, fill in the two files using the official address assigned to you (like `https://x402-gateway.bankofai.io/providers/<fqn>`), following the examples below.

### What catalog.json looks like

An example based on the **SunPump** service (abridged from `providers/sunpump-token-launch/` — the real `description` and `i18n` strings are longer):

```json
{
  "version": 1,
  "fqn": "sunpump-token-launch",
  "title": "SunPump",
  "mainTitle": "One-call agent token launch, paid via x402",
  "subtitle": "Create a meme or agent token from structured metadata.",
  "description": "## What it does\n\nSunPump Agent Token Launch API lets agents, scripts, and applications pay with x402 and submit token launch metadata to SunPump. The gateway forwards the caller's JSON payload to the SunPump launch endpoint after payment settlement.\n\n## Best for\n\n- Agent workflows that need to create a meme or agent token from structured metadata.\n- Operator tools that want one paid API call for token creation.\n- Mainnet payment flows across TRON Mainnet, BNB Smart Chain and Base Mainnet while using the same SunPump launch request shape.\n\n## Request shape\n\nPOST a JSON body with `name`, `symbol`, `description`, `imageBase64`, `twitterUrl`, `telegramUrl`, `websiteUrl`, and `tweetUsername`. Keep `name` within 1-20 characters and use a unique symbol. `imageBase64` may include a base64-encoded token image; if it is empty or omitted, SunPump generates an image automatically.\n\n## Code usage\n\nUse `wallet-cli x402 pay` against the route for the mainnet payment chain you want. TRON Mainnet example:\n\n```bash\nwallet-cli x402 pay --dry-run -o json 'https://x402-gateway.bankofai.io/providers/sunpump-token-launch-tron/pump-api/ai/agentTokenLaunch' \\\n  --method POST \\\n  --network tron:728126428 \\\n  --token USDT \\\n  --scheme exact \\\n  --max-amount 0.000001 \\\n  --header 'Content-Type: application/json' \\\n  --body '{\"name\":\"X402MainA\",\"symbol\":\"X4M17\",\"description\":\"x402 launch\",\"imageBase64\":\"\",\"twitterUrl\":\"\",\"telegramUrl\":\"\",\"websiteUrl\":\"\",\"tweetUsername\":\"\"}'\n```\n\nBNB Smart Chain uses `sunpump-token-launch-bsc` with `eip155:56`, and Base Mainnet uses `sunpump-token-launch-base` with `eip155:8453` and USDC \u2014 all with the same JSON body.",
  "useCase": "Use this provider when an app, agent, or CLI workflow needs to launch a SunPump token after a successful x402 payment. Choose a TRON Mainnet, BNB Smart Chain, or Base Mainnet payment route; every successful launch creates the token on TRON Mainnet.",
  "i18n": {
    "zh-CN": {
      "title": "SunPump",
      "subtitle": "用结构化元数据一次付费发币(meme/Agent 代币)。",
      "description": "## 能做什么\n\nSunPump Agent 发币 API 允许 Agent、脚本和应用先完成 x402 支付，再把发币元数据提交给 SunPump。Gateway 在支付结算后把调用方的 JSON 请求体转发到 SunPump 发币接口。\n\n## 适合场景\n\n- 需要基于结构化元数据创建 meme token 或 agent token 的 Agent 工作流。\n- 希望用一次付费 API 调用完成发币的运营工具。\n- 在 TRON 主网、BNB Smart Chain 主网和 Base 主网使用同一套 SunPump 发币请求格式。\n\n## 请求格式\n\nPOST JSON 请求体包含 `name`、`symbol`、`description`、`imageBase64`、`twitterUrl`、`telegramUrl`、`websiteUrl` 和 `tweetUsername`。`name` 需要保持在 1-20 个字符内，并使用唯一 symbol。`imageBase64` 可以传入 base64 编码的 token 图片；如果为空或不传，SunPump 会自动生成图片。\n\n## 代码用法\n\n使用 `wallet-cli x402 pay` 调用目标主网支付链对应的路由。TRON 主网示例：\n\n```bash\nwallet-cli x402 pay --dry-run -o json 'https://x402-gateway.bankofai.io/providers/sunpump-token-launch-tron/pump-api/ai/agentTokenLaunch' \\\n  --method POST \\\n  --network tron:728126428 \\\n  --token USDT \\\n  --scheme exact \\\n  --max-amount 0.000001 \\\n  --header 'Content-Type: application/json' \\\n  --body '{\"name\":\"X402MainA\",\"symbol\":\"X4M17\",\"description\":\"x402 launch\",\"imageBase64\":\"\",\"twitterUrl\":\"\",\"telegramUrl\":\"\",\"websiteUrl\":\"\",\"tweetUsername\":\"\"}'\n```\n\nBNB Smart Chain 使用 `sunpump-token-launch-bsc` 和 `eip155:56`，Base 主网使用 `sunpump-token-launch-base`、`eip155:8453` 与 USDC，请求体均相同。",
      "useCase": "适合应用、Agent 或 CLI 流程在 x402 支付成功后调用 SunPump 发币接口。可选择 TRON 主网、BNB Smart Chain 或 Base 主网支付路由；成功后均在 TRON 主网创建 Token。",
      "mainTitle": "一次付费完成 Agent 代币发行(x402)"
    }
  },
  "logo": "https://sunpump.meme/favicon.ico",
  "category": "finance",
  "chains": [
    "tron:0x2b6653dc",
    "eip155:56",
    "eip155:8453"
  ],
  "isFirstParty": true,
  "isFeatured": true,
  "featuredTags": [
    "sunpump",
    "token-launch",
    "agent-token",
    "tron",
    "bsc",
    "base"
  ],
  "serviceUrl": "https://sunpump.meme",
  "endpoints": [
    {
      "method": "POST",
      "path": "/pump-api/ai/agentTokenLaunch",
      "url": "https://x402-gateway.bankofai.io/providers/sunpump-token-launch-tron/pump-api/ai/agentTokenLaunch",
      "x402Routes": [
        {
          "network": "tron:0x2b6653dc",
          "provider": "sunpump-token-launch-tron",
          "scheme": "exact",
          "assetTransferMethod": "permit2",
          "url": "https://x402-gateway.bankofai.io/providers/sunpump-token-launch-tron/pump-api/ai/agentTokenLaunch"
        },
        {
          "network": "tron:0x2b6653dc",
          "provider": "sunpump-token-launch-tron",
          "scheme": "exact_gasfree",
          "url": "https://x402-gateway.bankofai.io/providers/sunpump-token-launch-tron/pump-api/ai/agentTokenLaunch"
        },
        {
          "network": "eip155:56",
          "provider": "sunpump-token-launch-bsc",
          "scheme": "exact",
          "assetTransferMethod": "permit2",
          "url": "https://x402-gateway.bankofai.io/providers/sunpump-token-launch-bsc/pump-api/ai/agentTokenLaunch"
        },
        {
          "network": "eip155:8453",
          "provider": "sunpump-token-launch-base",
          "scheme": "exact",
          "assetTransferMethod": "eip3009",
          "url": "https://x402-gateway.bankofai.io/providers/sunpump-token-launch-base/pump-api/ai/agentTokenLaunch"
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

Full field definitions: [Data Format & API Reference](./reference.md).

### How to write pay.md

`pay.md` is read by humans and Agents alike. Three parts are recommended: basic service info, endpoint addresses and prices, and one copy-paste call example:

````markdown
# SunPump Agent Token Launch API

SunPump Agent Token Launch API is an x402-paid gateway provider for launching a SunPump token from structured metadata. It exposes the same launch request shape across TRON Mainnet, BNB Smart Chain and Base Mainnet payment routes.

Use it when an agent, backend workflow, or CLI script has already validated the launch metadata and is ready to create the token.

## Service

- FQN: `sunpump-token-launch`
- Service URL: `https://sunpump.meme`
- Category: `finance`
- Payment chains: `tron:0x2b6653dc`, `eip155:56`, `eip155:8453`
- TRON schemes: `exact` + `permit2` (default), `exact_gasfree`
- BNB Smart Chain scheme: `exact` + `permit2`
- Base Mainnet scheme: `exact` + official USDC EIP-3009
- TRON Mainnet gateway base: `https://x402-gateway.bankofai.io/providers/sunpump-token-launch-tron`
- BNB Smart Chain gateway base: `https://x402-gateway.bankofai.io/providers/sunpump-token-launch-bsc`
- Base Mainnet gateway base: `https://x402-gateway.bankofai.io/providers/sunpump-token-launch-base`

## CLI Quick Start

Install wallet-cli 4.14.0 using the [quick start](/wallet-cli/quickstart/), configure an account, and preview the route for your payment network. The examples below do not pay. Authorize any real payment separately and supply the password securely.

TRON Mainnet:

```bash
wallet-cli x402 pay --dry-run -o json 'https://x402-gateway.bankofai.io/providers/sunpump-token-launch-tron/pump-api/ai/agentTokenLaunch' \
  --method POST \
  --network tron:728126428 \
  --token USDT \
  --scheme exact \
  --max-amount 0.000001 \
  --header 'Content-Type: application/json' \
  --body '{"name":"X402MainA","symbol":"X4M17","description":"x402 launch","imageBase64":"","twitterUrl":"","telegramUrl":"","websiteUrl":"","tweetUsername":""}'
```

BNB Smart Chain:

```bash
wallet-cli x402 pay --dry-run -o json 'https://x402-gateway.bankofai.io/providers/sunpump-token-launch-bsc/pump-api/ai/agentTokenLaunch' \
  --method POST \
  --network eip155:56 \
  --token USDT \
  --scheme exact \
  --max-amount 0.000001 \
  --header 'Content-Type: application/json' \
  --body '{"name":"X402BscA","symbol":"X4B17","description":"x402 launch","imageBase64":"","twitterUrl":"","telegramUrl":"","websiteUrl":"","tweetUsername":""}'
```

Base Mainnet:

```bash
wallet-cli x402 pay --dry-run -o json 'https://x402-gateway.bankofai.io/providers/sunpump-token-launch-base/pump-api/ai/agentTokenLaunch' \
  --method POST \
  --network eip155:8453 \
  --token USDC \
  --scheme exact \
  --max-amount 0.000001 \
  --header 'Content-Type: application/json' \
  --body '{"name":"X402BaseA","symbol":"X4BA17","description":"x402 launch","imageBase64":"","twitterUrl":"","telegramUrl":"","websiteUrl":"","tweetUsername":""}'
```

The Base Mainnet route changes only the payment network. A successful call still creates a token on TRON Mainnet.

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
- Current listed prices are fixed per request across all listed payment routes.
- The public catalog does not contain gateway runtime secrets or wallet keys.
````

### Pre-submission checklist

CI enforces the following rules — go through them before submitting:

- `version` must be `1`.
- `fqn` is lowercase letters/digits/hyphens and must match the directory name.
- `category` must be one of the allowed values (see [reference](./reference.md#allowed-categories)).
- `chains` needs at least one entry, using CAIP-2 style chain IDs. The public catalog publishes mainnet routes such as `tron:0x2b6653dc`, `eip155:56`, and Base Mainnet `eip155:8453`.
- `isFirstParty`, `isFeatured` (booleans) and `featuredTags` (string array, may be empty `[]`) are **required** — missing any of them fails validation.
- For every endpoint: `method` must be uppercase, `path` must start with `/`, and `maxPriceUsd` must not be less than `minPriceUsd`.
- _(Optional)_ An endpoint that settles across multiple chains can add `x402Routes`. Every route needs `network`, `provider`, `scheme`, and `url`; an `exact` route must also carry `assetTransferMethod` (`permit2` or `eip3009`), and an `exact_gasfree` route must **omit** it. A network may appear more than once — TRON typically publishes both an `exact` and an `exact_gasfree` route — as long as each `(provider, network, scheme, url)` combination is unique. Legacy `fee` / `feeConfig` fields are rejected. See the [reference](./reference.md#x402routes--multi-network-routing).
- The service and every endpoint must provide `i18n.zh-CN` translations for `title`, `subtitle`, `description`, and `useCase`.
- `pay.md` must be submitted together with `catalog.json`; both files are scanned for sensitive data.
- No keys, private keys, or private network addresses anywhere.

## Step 2: Validate locally

Before submitting, run validation and build locally to make sure all fields are valid and nothing sensitive slipped in:

```bash
python3 scripts/validate.py
python3 scripts/build.py
```

Expected output:

```text
validated 1 provider(s)
built 1 provider(s) into dist
```

## Step 3: Open the Pull Request

Add the two files to the [catalog repository](https://github.com/BofAI/x402-catalog) under the matching directory:

```text
providers/<fqn>/catalog.json
providers/<fqn>/pay.md
```

:::caution Security red line: these two files are public
**Never** include upstream API keys, bearer tokens, wallet private keys, passwords, `provider.yml`, `.env`, or any internal/local addresses (such as `localhost`, `127.0.0.1`, `10.x`, `192.168.x`). CI scans for these patterns and rejects the merge on any hit.
:::

## Step 4: Merge = go live

After your PR merges, the release process refreshes the freshly built `dist/` to the Catalog Server / CDN. Your service is live in the catalog and starts taking Agent calls.

## Next steps

- All fields, categories, and API structures → [Data Format & API Reference](./reference.md)
- Want to try the caller side first? → [Get Started](./get-started.md)
