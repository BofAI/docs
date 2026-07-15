---
title: Data Format & API Reference
sidebar_label: Data Format & API
description: Field definitions for catalog.json / pay.md, allowed categories and chain IDs, and the response structures of the Catalog static API (/api/*).
---

# Data Format & API Reference

This page is the API Catalog's data contract: the `catalog.json` fields providers submit to the [catalog repository](https://github.com/BofAI/x402-catalog), the allowed values, and the structures of the `/api/*` endpoints the catalog exposes after build.

## provider catalog.json fields

Each service is described in `providers/<fqn>/catalog.json`. Top-level fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `version` | number | Yes | Always `1` |
| `fqn` | string | Yes | Globally unique ID, regex `^[a-z0-9][a-z0-9-]{1,62}$`, must match the directory name |
| `title` | string | Yes | Service name (typically a clean brand name, e.g. `DefiLlama`) |
| `subtitle` | string | Yes | One-line subtitle |
| `mainTitle` | string | No | Display tagline for the card/header (e.g. `Aggregated DeFi data — TVL, fees, prices & yields`); falls back to `title` |
| `subTitle` | string | No | Secondary display line; falls back to `subtitle` |
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

`i18n.zh-CN` is required and must contain Chinese translations for `title`, `subtitle`, `description`, and `useCase`. It may also include `mainTitle` (Chinese display tagline). Every endpoint needs its own `i18n.zh-CN` as well.

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
| `x402Routes` | object[] | No | Per-network payment routes (see below) |

### x402Routes — multi-network routing

An endpoint may serve the same capability across several chains, each settling through its own gateway provider and payment scheme. List those alternatives in `x402Routes`; each route describes one network:

| Field | Type | Description |
|---|---|---|
| `network` | string | CAIP-2 chain ID this route settles on (e.g. `tron:0x2b6653dc`, `eip155:56`) |
| `provider` | string | The gateway provider `fqn` that handles this network |
| `scheme` | string | x402 payment scheme for this route, e.g. `exact` — each route declares its own |
| `url` | string | Full gateway URL for this network's route |

The build passes this through to outputs as `x402_routes`. When present, callers/agents pick the route matching their intended payment chain; the top-level `url` remains the default route.

For example, a token-launch endpoint might expose one route per supported chain — TRON Mainnet and BSC Mainnet — each with its own `provider` and `scheme`. To call one, point `x402-cli pay` at the chosen route's `url` and pass the matching `--network` / `--scheme`:

```bash
x402-cli pay 'https://x402-gateway.bankofai.io/providers/<provider>/<path>' \
  --method POST \
  --network tron:0x2b6653dc \
  --token USDT \
  --scheme exact \
  --max-amount 0.000001 \
  --header 'Content-Type: application/json' \
  --body '{ ... }'
```

The other routes reuse the same request body, swapping only the route `url`, `--network`, and the route's declared `--scheme`.

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

`chains` uses CAIP-2 style chain identifiers. Mainnets and testnets are both recognized:

| Chain | ID |
|---|---|
| TRON mainnet | `tron:0x2b6653dc` |
| TRON Nile testnet | `tron:0xcd8690dc` |
| TRON Shasta testnet | `tron:0x94a9059e` |
| BNB Chain (BSC) | `eip155:56` |
| BNB Smart Chain testnet | `eip155:97` |

The build resolves each chain ID into display metadata (`kind` / `label` / `label_zh`) so the frontend doesn't have to parse CAIP-2 itself — see [Frontend display fields](#frontend-display-fields).

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
| `frontend.categories` | Categories in use — each `{ id, label, label_zh, count }` |
| `frontend.chains` | Chains in use — each `{ id, kind, label, label_zh, count }` |

The `providers` array is pre-sorted at build time by **featured first → category → fqn**; frontends can render it as-is. Use `frontend.categories` / `frontend.chains` to drive filter UIs — including their `label` / `label_zh` display names — rather than hard-coding category or chain lists.

### Derived fields

Build outputs add derived fields on top of the raw data and convert everything to snake_case (e.g. `useCase` → `use_case`):

| Field | Description |
|---|---|
| `endpoint_count` | Number of endpoints |
| `has_metering` | Whether any endpoint is metered |
| `has_free_tier` | Whether any endpoint has `minPriceUsd` of 0 |
| `min_price_usd` / `max_price_usd` | The service's price range across all endpoints |
| `sha` | Content hash of `catalog.json` + `pay.md`, for change detection |

### Frontend display fields

To save the frontend from parsing raw IDs and picking translations, the build also emits ready-to-render fields on each provider summary and detail:

| Field | Description |
|---|---|
| `title_zh` | Chinese service name (from `i18n.zh-CN.title`, falls back to `title`) |
| `main_title` | Display tagline (from `mainTitle`, falls back to `title`) |
| `main_title_zh` | Chinese display tagline (from `i18n.zh-CN.mainTitle` / `mainTitle`, falls back to `title`) |
| `sub_title` | Secondary display line (from `subTitle`, falls back to `subtitle`) |
| `sub_title_zh` | Chinese secondary display line (from `i18n.zh-CN.subtitle` / `subTitle`, falls back to `subtitle`) |
| `category_meta` | `{ id, label, label_zh }` for the category |
| `chain_kinds` | De-duplicated friendly chain kinds, e.g. `["tron"]`, `["bnb"]` |
| `chains_meta` | Per-chain `{ id, kind, label, label_zh }`, so the frontend never parses CAIP-2 |

These are additive — the raw `title`, `subtitle`, `category`, `chains`, and `i18n.zh-CN` are still present.

### Other output structures

- **`/api/pay/<fqn>.json`**: payment summary for Agents / CLI. Top level includes `version`, `fqn`, `title`, `title_zh`, `main_title`, `main_title_zh`, `sub_title`, `sub_title_zh`, `subtitle`, `description`, `use_case`, `i18n`, `service_url`, `chains`, `chain_kinds`, `chains_meta`, `sha`; `endpoints[]` keeps the call-relevant fields `method`, `path`, `url`, `description`, `metered`, `min_price_usd`, `max_price_usd`, plus `x402_routes` when the endpoint defines multi-network routes.
- **`/api/search-index.json`**: `{ version, generated_at, documents[] }`, each document being a service summary (with `category_meta` / `chain_kinds` / `chains_meta`) plus each endpoint's `method` / `path` / `title` / `description` (and `x402_routes` when present).
- **`/api/categories.json`**: array of categories in use, each `{ id, label, label_zh, count }` — a direct export of `frontend.categories`.
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
