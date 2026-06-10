---
title: 数据格式与 API 参考
sidebar_label: 数据格式与 API
description: catalog.json / pay.md 的字段定义、合法类目与链 ID，以及 Catalog 静态 API（/api/*）的响应结构。
---

# 数据格式与 API 参考

本页是 API 目录 的数据契约：服务方向[目录仓库](https://github.com/BofAI/x402-catelog)提交的 `catalog.json` 字段、合法取值，以及目录构建后对外暴露的 `/api/*` 接口结构。

## provider catalog.json 字段

每个服务在 `providers/<fqn>/catalog.json` 中描述。顶层字段：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `version` | number | 是 | 固定为 `1` |
| `fqn` | string | 是 | 全局唯一标识，正则 `^[a-z0-9][a-z0-9-]{1,62}$`，须与目录名一致 |
| `title` | string | 是 | 服务名称 |
| `subtitle` | string | 是 | 一句话副标题 |
| `description` | string | 是 | 服务简介 |
| `useCase` | string | 是 | 适用场景，帮助 Agent 判断何时调用 |
| `i18n` | object | 是 | 多语言翻译，至少包含 `zh-CN`（见下） |
| `logo` | string | 是 | Logo 图片 URL |
| `category` | string | 是 | 类目，须为合法取值之一（见[合法类目](#合法类目)） |
| `chains` | string[] | 是 | 结算链，至少一条，CAIP-2 风格 |
| `serviceUrl` | string | 是 | 服务在网关上的入口地址 |
| `endpoints` | object[] | 是 | 端点列表，至少一个（见下） |
| `isFirstParty` | boolean | 是 | 是否自营 |
| `isFeatured` | boolean | 是 | 是否精选（影响目录排序，见[聚合字段与排序](#catalogjson-的聚合字段与排序)） |
| `featuredTags` | string[] | 是 | 精选标签，可为空数组 `[]` |
| `status` | object | 否 | 状态块（见 [status 块](#status-块)） |

### i18n 翻译

`i18n.zh-CN` 为必填，需包含 `title`、`subtitle`、`description`、`useCase` 四项中文翻译。每个 endpoint 同样需要各自的 `i18n.zh-CN`。

### endpoint 字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `method` | string | 是 | HTTP 方法，必须大写（如 `GET`） |
| `path` | string | 是 | 路径，必须以 `/` 开头 |
| `url` | string | 是 | 端点完整地址 |
| `title` | string | 是 | 端点名称 |
| `subtitle` | string | 是 | 副标题 |
| `description` | string | 是 | 说明 |
| `useCase` | string | 是 | 适用场景 |
| `i18n` | object | 是 | 端点级中文翻译（同上四项） |
| `metered` | boolean | 是 | 是否按量计费 |
| `minPriceUsd` | number | 是 | 最低价格（美元） |
| `maxPriceUsd` | number | 是 | 最高价格（美元），不小于 `minPriceUsd` |

### status 块

`status` 为选填，描述服务各环节的状态，包含 `catalog` / `gateway` / `payment` / `upstream` 四个键。未提供时，构建产物（服务详情）会自动填充默认值：

```json
{ "catalog": "listed", "gateway": "unknown", "payment": "unknown", "upstream": "unknown" }
```

## pay.md

与 `catalog.json` 同目录提交、面向人和 Agent 的可读调用说明，为**必交**文件。建议包含：服务基本信息（FQN、入口地址、类目、结算链）、各端点的地址与价格，以及一条可直接复制的 `x402-cli pay` 调用示例。该文件与 `catalog.json` 一样会经过敏感信息扫描（见下）。

## 合法类目

`category` 必须是以下之一：

```text
ai_ml      cloud       compute     data
devtools   finance     identity    media
messaging  other       productivity search
security   shopping    storage     translation
```

## 链 ID

`chains` 采用 CAIP-2 风格的链标识：

| 链 | ID |
|---|---|
| TRON 主网 | `tron:mainnet` |
| BNB Chain (BSC) | `eip155:56` |

## 校验与安全扫描

提交会经过字段校验与敏感信息扫描，命中任意一项即被拒绝。扫描覆盖：

- **密钥字段名**：`api_key`、`secret`、`password`、`token`、`authorization`、`bearer`、`private_key`、`provider.yml`、`.env` 等。
- **密钥值**：形如 `sk-...`、`Bearer ...` 的令牌，以及 `0x` 开头的 64 位十六进制（私钥特征）。
- **私网地址**：`localhost`、`127.0.0.1`、`0.0.0.0`、`10.x`、`192.168.x`、`172.16-31.x` 等。

`catalog.json` 与 `pay.md` 都会被扫描。

## 生成产物与 API

CI 构建后生成静态快照 `dist/`，由 Catalog Server 通过 `/api/` 路径对外提供（支持 CORS）：

| 接口 | 内容 |
|---|---|
| `GET /api/catalog.json` | 列表页数据：服务摘要数组 + 聚合统计 + 前端配置 |
| `GET /api/categories.json` | 出现过的类目及其计数 |
| `GET /api/search-index.json` | 轻量搜索索引 |
| `GET /api/providers/<fqn>.json` | 单个服务详情（完整 endpoints + status） |
| `GET /api/pay/<fqn>.json` | 供 Agent / CLI 读取的支付与调用摘要 |
| `GET /api/pay/<fqn>.md` | 可读版调用说明 |
| `GET /api/status.json` | 构建状态与服务数 |

### catalog.json 的聚合字段与排序

列表接口除 `providers` 数组外，还包含动态统计，前端应直接读取，不要写死：

| 字段 | 说明 |
|---|---|
| `version` | 固定为 `1` |
| `base_url` | 静态 API 基地址 |
| `provider_count` | 在架服务总数 |
| `first_party_count` | 自营服务数 |
| `chain_count` | 覆盖链数 |
| `generated_at` | 构建时间（UTC） |
| `frontend.featured_fqns` | 精选服务的 `fqn` 列表 |
| `frontend.categories` | 各类目及计数 |
| `frontend.chains` | 各链及计数 |

`providers` 数组在构建时已按 **精选优先 → 类目 → fqn** 排序，前端按原顺序渲染即可。

### 派生字段

构建产物在原始字段基础上会补充派生字段，并统一转为 snake_case（如 `useCase` → `use_case`）：

| 字段 | 说明 |
|---|---|
| `endpoint_count` | 端点数量 |
| `has_metering` | 是否存在按量计费端点 |
| `has_free_tier` | 是否存在 `minPriceUsd` 为 0 的端点 |
| `min_price_usd` / `max_price_usd` | 该服务所有端点的价格区间 |
| `sha` | `catalog.json` + `pay.md` 的内容哈希，用于变更检测 |

### 其它产物结构

- **`/api/pay/<fqn>.json`**：供 Agent / CLI 读取的支付摘要。顶层为 `version`、`fqn`、`title`、`subtitle`、`description`、`use_case`、`i18n`、`service_url`、`chains`、`sha`；`endpoints[]` 仅保留调用所需字段：`method`、`path`、`url`、`description`、`metered`、`min_price_usd`、`max_price_usd`。
- **`/api/search-index.json`**：`{ version, generated_at, documents[] }`，每个 document 为服务摘要加上端点的 `method` / `path` / `title` / `description`。
- **`/api/categories.json`**：出现过的类目数组，每项为 `{ id, count }`。
- **`/api/status.json`**：`{ version, generated_at, provider_count, status }`，`status` 为 `ok` 时表示构建正常。

## 本地构建与运行

```bash
# 校验所有 provider
python3 scripts/validate.py

# 构建静态快照到 dist/
python3 scripts/build.py
```

容器方式（构建时先校验并生成 `dist/`，再从 `/api/` 提供）：

```bash
docker compose build catalog
docker compose up -d catalog
curl http://127.0.0.1:8088/api/status.json
```

端口可用环境变量 `X402_CATALOG_PORT` 覆盖（默认 `8088`，容器内部监听 `8080`）。

:::note CI 调度
目录仓库的 CI（GitHub Actions）会在 PR、合入 `main` 以及定时任务上自动执行同样的校验与构建，无需手动触发。
:::

## 相关页面

- [上架你的服务](./list-your-service.md) —— 提交流程与安全红线
- [快速开始](./get-started.md) —— 调用方接入方式
