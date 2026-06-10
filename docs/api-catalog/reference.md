---
title: Data Format & API Reference
sidebar_label: Data Format & API
description: Field definitions for catalog.json / pay.md, allowed categories and chain IDs, and the response structures of the Catalog static API (/api/*).
---

# Data Format & API Reference

This page is the API Catalog's data contract: the `catalog.json` fields providers submit to the [catalog repository](https://github.com/BofAI/x402-catelog), the allowed values, and the structures of the `/api/*` endpoints the catalog exposes after build.

## provider catalog.json fields

Each service is described in `providers/<fqn>/catalog.json`. Top-level fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `version` | number | Yes | Always `1` |
| `fqn` | string | Yes | Globally unique ID, regex `^[a-z0-9][a-z0-9-]{1,62}$`, must match the directory name |
| `title` | string | Yes | Service name |
| `subtitle` | string | Yes | One-line subtitle |
| `description` | string | Yes | Service description |
| `useCase` | string | Yes | When to use it — helps Agents decide when to call |
| `i18n` | object | Yes | Translations, must include `zh-CN` (see below) |
| `logo` | string | Yes | Logo image URL |
| `category` | string | Yes | Must be an allowed value (see [allowed categories](#allowed-categories)) |
| `chains` | string[] | Yes | Settlement chains, at least one, CAIP-2 style |
| `serviceUrl` | string | Yes | The service's entry address on the gateway |
| `endpoints` | object[] | Yes | Endpoint list, at least one (see below) |
| `isFirstParty` | boolean | Yes | First-party service or not |
| `isFeatured` | boolean | Yes | Featured or not (affects catalog ordering, see [aggregate fields and ordering](#catalogjson-aggregate-fields-and-ordering)) |
| `featuredTags` | string[] | Yes | Featured tags, may be an empty array `[]` |
| `status` | object | No | Status block (see [status block](#status-block)) |

### i18n translations

`i18n.zh-CN` is required and must contain Chinese translations for `title`, `subtitle`, `description`, and `useCase`. Every endpoint needs its own `i18n.zh-CN` as well.

### endpoint fields

| Field | Type | Required | Description |
|---|---|---|---|
| `method` | string | Yes | HTTP method, must be uppercase (e.g. `GET`) |
| `path` | string | Yes | Path, must start with `/` |
| `url` | string | Yes | Full endpoint URL |
| `title` | string | Yes | Endpoint name |
| `subtitle` | string | Yes | Subtitle |
| `description` | string | Yes | Description |
| `useCase` | string | Yes | When to use it |
| `i18n` | object | Yes | Endpoint-level Chinese translations (same four fields) |
| `metered` | boolean | Yes | Metered billing or not |
| `minPriceUsd` | number | Yes | Minimum price (USD) |
| `maxPriceUsd` | number | Yes | Maximum price (USD), must not be less than `minPriceUsd` |

### status block

`status` is optional and describes the state of each stage of the service, with four keys: `catalog` / `gateway` / `payment` / `upstream`. When omitted, the build output (service detail) fills in defaults automatically:

```json
{ "catalog": "listed", "gateway": "unknown", "payment": "unknown", "upstream": "unknown" }
```

## pay.md

Submitted alongside `catalog.json` in the same directory — a human- and Agent-readable call guide, and a **required** file. Recommended contents: basic service info (FQN, entry address, category, settlement chains), each endpoint's address and price, plus one copy-paste `x402-cli pay` example. Like `catalog.json`, this file goes through the sensitive-data scan (see below).

## Allowed categories

`category` must be one of:

```text
ai_ml      cloud       compute     data
devtools   finance     identity    media
messaging  other       productivity search
security   shopping    storage     translation
```

## Chain IDs

`chains` uses CAIP-2 style chain identifiers:

| Chain | ID |
|---|---|
| TRON mainnet | `tron:mainnet` |
| BNB Chain (BSC) | `eip155:56` |

## Validation and secret scanning

Every submission goes through field validation and a sensitive-data scan; any hit rejects the submission. The scan covers:

- **Secret field names**: `api_key`, `secret`, `password`, `token`, `authorization`, `bearer`, `private_key`, `provider.yml`, `.env`, etc.
- **Secret values**: tokens shaped like `sk-...` or `Bearer ...`, and 64-character hex strings starting with `0x` (private-key signature).
- **Private network addresses**: `localhost`, `127.0.0.1`, `0.0.0.0`, `10.x`, `192.168.x`, `172.16-31.x`, etc.

Both `catalog.json` and `pay.md` are scanned.

## Build outputs and API

CI builds the static snapshot `dist/`, which the Catalog Server serves under the `/api/` path (CORS enabled):

| Endpoint | Contents |
|---|---|
| `GET /api/catalog.json` | List-page data: service summaries + aggregate stats + frontend config |
| `GET /api/categories.json` | Categories in use and their counts |
| `GET /api/search-index.json` | Lightweight search index |
| `GET /api/providers/<fqn>.json` | Single service detail (full endpoints + status) |
| `GET /api/pay/<fqn>.json` | Payment & call summary for Agents / CLI |
| `GET /api/pay/<fqn>.md` | Human-readable call guide |
| `GET /api/status.json` | Build status and service count |

### catalog.json aggregate fields and ordering

Besides the `providers` array, the list endpoint carries dynamic stats — frontends should read them directly, never hard-code:

| Field | Description |
|---|---|
| `version` | Always `1` |
| `base_url` | Base URL of the static API |
| `provider_count` | Total services live |
| `first_party_count` | First-party service count |
| `chain_count` | Chains covered |
| `generated_at` | Build time (UTC) |
| `frontend.featured_fqns` | `fqn` list of featured services |
| `frontend.categories` | Categories and counts |
| `frontend.chains` | Chains and counts |

The `providers` array is pre-sorted at build time by **featured first → category → fqn**; frontends can render it as-is.

### Derived fields

Build outputs add derived fields on top of the raw data and convert everything to snake_case (e.g. `useCase` → `use_case`):

| Field | Description |
|---|---|
| `endpoint_count` | Number of endpoints |
| `has_metering` | Whether any endpoint is metered |
| `has_free_tier` | Whether any endpoint has `minPriceUsd` of 0 |
| `min_price_usd` / `max_price_usd` | The service's price range across all endpoints |
| `sha` | Content hash of `catalog.json` + `pay.md`, for change detection |

### Other output structures

- **`/api/pay/<fqn>.json`**: payment summary for Agents / CLI. Top level: `version`, `fqn`, `title`, `subtitle`, `description`, `use_case`, `i18n`, `service_url`, `chains`, `sha`; `endpoints[]` keeps only call-relevant fields: `method`, `path`, `url`, `description`, `metered`, `min_price_usd`, `max_price_usd`.
- **`/api/search-index.json`**: `{ version, generated_at, documents[] }`, each document being a service summary plus each endpoint's `method` / `path` / `title` / `description`.
- **`/api/categories.json`**: array of categories in use, each `{ id, count }`.
- **`/api/status.json`**: `{ version, generated_at, provider_count, status }`; `status` of `ok` means the build is healthy.

## Local build and run

```bash
# validate all providers
python3 scripts/validate.py

# build the static snapshot into dist/
python3 scripts/build.py
```

Container mode (validates and builds `dist/` at image build time, then serves from `/api/`):

```bash
docker compose build catalog
docker compose up -d catalog
curl http://127.0.0.1:8088/api/status.json
```

The port can be overridden with the `X402_CATALOG_PORT` environment variable (default `8088`; the container listens on `8080` internally).

:::note CI scheduling
The catalog repository's CI (GitHub Actions) runs the same validation and build automatically on PRs, on merges to `main`, and on a recurring schedule — no manual trigger needed.
:::

## Related pages

- [List Your Service](./list-your-service.md) — submission flow and security red lines
- [Get Started](./get-started.md) — onboarding from the caller's side
