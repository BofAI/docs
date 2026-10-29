---
title: 网关
sidebar_label: 网关
description: 网关把任意 API 变成面向 AI Agent 的按次计费服务 —— Agent 自主发现、调用、付费，每一笔在链上结算到你的钱包。
---

import ThemedImage from '@theme/ThemedImage';

# 网关

将任意 API 转化为面向 AI Agent 的按次计费服务。

网关接在你的 API 前面，负责处理收款：AI Agent 自主发现、调用并完成付费，每一笔调用都在链上结算，款项直接进入你指定的钱包。现有 API 保持原样，无需改动任何代码。

:::tip
想直接上手？跳到 [上架你的 API](../api-catalog/list-your-service.md)；想先看看有哪些服务，去 [浏览 API 目录](../api-catalog/index.md)。
:::

## 它是怎么工作的

可以把网关理解为站在你 API 前面的**收银台 + 中转站**（技术上是一层反向代理）：

- **Agent 只访问网关地址**（如 `https://x402-gateway.bankofai.io/providers/<gateway-provider-id>/v1/...`，其中的 id 来自目录条目的 `url`，并不是目录 FQN），不会直接触达你的上游 API。
- **网关负责转发**。验款通过（或端点免费）后，网关把请求代理到上游，再把上游响应体原样返回给 Agent——会剥离固定的一批响应头——逐跳头，外加 `set-cookie`、`authorization`、`content-encoding`、`content-length` 以及全部 x402 支付相关头（因此上游的 `PAYMENT-RESPONSE` 绝不会透传出去）——并加上 `PAYMENT-RESPONSE` 头；运营方还可以配置响应契约，把上游返回 `200` 但业务失败的情况转成网关错误。
- **永远不需要钱包私钥**。收款只用一个钱包**地址**；调用方用自己的钱包在链上付费。网关两侧都不碰任何私钥。
- **上游密钥不外泄**。如果你的上游接口需要鉴权，那个 API Key 只待在运行网关的那一侧——自建网关时留在你本地的 yaml 或环境变量，用官方网关时由我们托管。无论哪种，调用方全程接触不到，密钥也不会进入公开目录。
- **收不收费由你按端点决定**。在配置中为端点定价即走付费流程；不定价（价格为 0）的端点直接转发，免费接口依然免费。

<ThemedImage
  alt="Gateway 拓扑：Agent → 网关 → 你的上游 API"
  sources={{
    light: '/img/diagrams/x402-gateway-topology.zh.light.svg',
    dark: '/img/diagrams/x402-gateway-topology.zh.svg',
  }}
/>

## 一次调用的完整流程

### 付费端点：HTTP 402 流程

每一笔付费调用都通过 x402 在链上清算——响应中返回的报价始终是唯一真实价格。

1. **Agent 发起调用** —— 请求目标接口。
2. **网关报价** —— 返回价格（HTTP `402`）。
3. **钱包授权** —— 客户端签署所选支付要求，并携带 `PAYMENT-SIGNATURE` 请求头重试。
4. **验款并结算** —— facilitator 验证签名载荷，并在链上把款项结算至你的收款钱包。
5. **返回结果** —— 网关把请求转发到上游 API，将结果返回给 Agent。

### 免费端点：直接转发

未定价的端点没有报价环节，也不发生任何链上交易：

1. **Agent 发起调用** —— 请求目标接口。
2. **网关直接转发** —— 代理到上游 API，把结果返回给 Agent。

也就是说，同一个服务可以付费端点与免费端点并存——比如 `/v1/current` 按次收费，而 `/v1/ping` 保持免费。Agent 通过目录输出里该端点的 `metered` 标志与 `min_price_usd` 来区分（并没有单独的「免费端点」标记）。目前目录里已发布的端点全部是计费的，因此这属于网关具备的能力，而非当前上架服务已经在用的特性。

:::note
无论付费与否，调用方靠链上付费获得访问权，不需要任何 API Key；上游凭证（如有）始终保留在网关侧，调用方 Agent 全程无法接触。
:::

## 为供需双方而建

提供方将每一次调用转化为现金流，Agent 将每一次调用转化为能力，网关连接供需两端。

### 面向 API 提供方：上架 API，让每一次调用都产生收入

- **资金直接入账** —— 款项实时结算至收款钱包，无平台托管，无结算周期。
- **原生多链** —— 可根据服务商发布的路由在 TRON、BNB Chain 或 Base 主网结算。
- **零改动接入** —— 现有 API 保持原样，无需改动任何代码。
- **定价自主** —— 可按接口、按档位灵活定价，免费接口依然免费。

→ [上架你的 API](../api-catalog/list-your-service.md)

### 面向 AI Agent：一个目录，汇聚海量 API，按需付费

- **当前用 CLI 发现** —— `wallet-cli x402 provider-list` / `provider-show` / `endpoint-list` 可定位所需 API 及其路由。通过 MCP 付款由 `@x402/mcp` 支持；支持目录发现的 MCP 尚未发布。
- **按次计费** —— 无需订阅，无最低消费。
- **实时价格透明** —— 网关在 `402` 响应中返回实时计算的价格，客户端授权会绑定所选支付要求；报价本身并不是网关的密码学签名。
- **无账号、无密钥** —— 钱包即身份，无需注册或管理任何 API Key。

→ [浏览 API 目录](../api-catalog/index.md)

## 怎么把你的 API 接进来

三步即可上线，现有 API 无需任何改动：

1. **选网关** —— 用 BANK OF AI 官方托管的网关，或自己部署一个（两种方式的区别见下）。
2. **定好价目表** —— 确定接口、各端点定价与收款钱包；无需集成 SDK，无需重写任何代码。
3. **上架目录** —— 向目录仓库提交两份公开文件（可先填表申请，由我们联系协助）。服务出现在 [API 目录](../api-catalog/index.md) 后，任意 Agent 都能发现、调用并自动付费。

完整步骤见 [上架你的服务](../api-catalog/list-your-service.md)。

### 官方网关，还是自己运行？

- **官方网关（托管）**：由 BANK OF AI 运行网关，代理你的 API 并处理收款，你无需部署任何东西；上架文件里的调用地址填官方域名（形如 `x402-gateway.bankofai.io/providers/<gateway-provider-id>`）。
- **自己运行网关**：在自己的机器上部署网关，上游凭证与收款配置只留在本地；上架文件里的调用地址填你自己的域名。适合希望完全自主掌控凭证与基础设施的服务方。部署步骤见[自建网关](#run-your-own-gateway)。

无论哪种方式，调用方 Agent 的体验完全一致：发现、报价、付款、调用走的都是同一套 x402 流程。

:::note 自建网关了，为什么还要上架目录？
网关和目录解决的是两件事：**网关负责收钱，目录负责让你被发现**。目录只是一份公开的服务清单，不经手任何调用与资金——Agent 调用的永远是目录里登记的网关地址。自建网关时，登记的就是你自己的域名，流量与款项直接到你；上架的意义在于：所有接入 BANK OF AI 目录的 Agent、CLI 用户与目录站访客都能发现并调用你的服务，而不只是知道你域名的人。
:::

## 自建网关 {#run-your-own-gateway}

以下步骤基于网关 **v1.0.4** 版本，该版本以 Docker 镜像 `bankofai/x402-gateway:v1.0.4` 发布。npm 包 `@bankofai/x402-gateway` 目前仍是 1.0.2，早于本文档使用的十进制 TRON 网络 ID，因此请使用镜像，不要安装 npm 包。完整说明见 [x402-gateway v1.0.4 README](https://github.com/BofAI/x402-gateway/blob/v1.0.4/README.md)。

### 1. 编写 provider 文件

每个 provider 单独一个目录，文件名为 `provider.yml`（或 `provider.yaml`），例如 `providers/example/provider.yml`：

```yaml
name: example-provider
forward_url: ${X402_PROVIDER_FORWARD_URL}

operator:
  network: tron:3448148188        # TRON Nile；主网为 tron:728126428
  currencies:
    usd: ["USDT"]
  recipient: ${X402_PROVIDER_RECIPIENT}
  scheme: exact
  protocol: exact
  facilitator_url: ${X402_FACILITATOR_URL}
  facilitator_api_key_env: X402_FACILITATOR_API_KEY
  valid_for_seconds: 300

endpoints:
  - method: GET
    path: /v1/ping
    metering:
      dimensions:
        - tiers:
            - price_usd: 0.002
```

- `network` 必须是十进制 CAIP-2 ID，`tron:nile` 之类的别名会被拒绝。
- `recipient` 填收款**地址**，网关不需要任何私钥。
- 没有 `metering` 的端点免费转发。
- 上游需要 API Key 时，添加 `routing.auth` 配置，从环境变量读取。详见 README 的 *Provider Config* 一节。

### 2. 配置环境变量

在 `providers/` 目录旁创建 `.env`，写入 YAML 引用的变量：

```bash
X402_PROVIDER_FORWARD_URL=https://api.example.com
X402_PROVIDER_RECIPIENT=<你的收款地址>
X402_FACILITATOR_URL=https://facilitator.bankofai.io
X402_FACILITATOR_API_KEY=<facilitator-api-key>
X402_GATEWAY_ADMIN_TOKEN=<admin-token>
X402_GATEWAY_PUBLIC_BASE_URL=https://gateway.example.com
```

`X402_GATEWAY_PUBLIC_BASE_URL` 是 Agent 调用的公网地址，也是你在目录中登记地址的前缀。由于配置了 `facilitator_api_key_env`，缺少 `X402_FACILITATOR_API_KEY` 时网关会拒绝启动。Facilitator API Key 的获取方式见[官方 Facilitator](./OfficialFacilitator.md)。

### 3. 校验配置

```bash
docker run --rm --env-file .env \
  -v "$PWD/providers:/app/providers:ro" \
  bankofai/x402-gateway:v1.0.4 \
  x402-gateway check --providers /app/providers
```

`check` 校验 YAML 语法、必填字段、环境变量展开、网络 ID 和端点格式，不会调用上游、Facilitator 或链。

### 4. 启动网关

```bash
docker run -d --name x402-gateway --env-file .env \
  -p 4020:8080 \
  -v "$PWD/providers:/app/providers:ro" \
  bankofai/x402-gateway:v1.0.4
```

镜像在容器内监听 `0.0.0.0:8080`。生产环境请按 README 建议，用镜像 digest 而不是 tag 固定版本。

### 5. 检查健康状态和付款挑战

```bash
curl http://127.0.0.1:4020/__402/health
curl -i http://127.0.0.1:4020/providers/example-provider/v1/ping
```

`curl -i` 请求的是计费端点，应返回 `402 Payment Required`，并带有 `PAYMENT-REQUIRED` 响应头。路径中的 provider 段即 YAML 里的 `name`。两项检查都通过、公网地址可访问后，继续阅读[上架你的服务](../api-catalog/list-your-service.md)。

## 下一步

- [上架你的 API](../api-catalog/list-your-service.md) —— 提交流程、所需信息与安全红线
- [浏览 API 目录](../api-catalog/index.md) —— 看看已经在架的服务
- [API 目录·快速开始](../api-catalog/get-started.md) —— 从调用方视角接入
