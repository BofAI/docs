---
title: '命令参考'
description: >-
  x402 CLI 每条命令与参数的完整参考——pay、serve、roundtrip、gateway、catalog。
---

# 命令参考

本页是 x402 CLI 所有命令的完整参考。

> 图例：`<arg>` = 必填参数，`[arg]` = 可选参数。除非标注 **（必填）**，选项均为可选。

---

## 全局选项

以下参数对每条命令都生效。

| 参数 | 说明 |
| :--- | :--- |
| `-h, --help` | 显示该命令的帮助 |
| `-V, --version` | 打印 CLI 版本 |
| `--json` | 打印机器可读的结构化 JSON 输出 |
| `--human` | 打印人类可读的输出（默认） |

`--json` 与 `--human` 互斥。该结构化输出始终包含 `ok` 和 `command`，以及一个 `result` 对象或一个结构化的 `error`（`code`、`message`、`hint`）。

```bash
x402-cli --help
x402-cli --version
x402-cli pay --help
```

---

## `pay`

支付一个受 x402 保护的 URL。CLI 发出请求，若服务器回应 `402 Payment Required`，它会读取 `PAYMENT-REQUIRED` 应答头、选出匹配的支付要求、签名，并携带签名载荷重试请求。

```bash
x402-cli pay <url> [options]
```

| 选项 | 说明 |
| :--- | :--- |
| `--method <method>` | HTTP 方法（默认：`GET`） |
| `--header "Name: Value"` | 请求头，可重复 |
| `--body <body>` | 非 `GET`/`HEAD` 方法的请求体 |
| `--network <caip2>` | 要求特定网络（如 `tron:0xcd8690dc`、`base-mainnet`） |
| `--token <symbol>` | 要求特定代币（如 `USDT`、`USDC`） |
| `--asset <address>` | 要求特定资产合约地址 |
| `--decimals <count>` | 未注册资产的精度 |
| `--scheme <scheme>` | 要求特定 x402 scheme：`exact` 或 `exact_gasfree` |
| `--gasfree-api-url <url>` | 覆盖 TRON GasFree relayer API 地址（环境变量 `X402_GASFREE_API_URL`） |
| `--max-gasfree-fee <amount>` | GasFree relayer 手续费上限（代币单位） |
| `--max-gasfree-fee-raw <n>` | GasFree relayer 手续费上限（最小单位） |
| `--max-amount <amount>` | 允许支付的最大人类可读金额 |
| `--max-raw-amount <amount>` | 允许支付的最大最小单位金额 |
| `--dry-run` | 只读取支付要求，不签名、不付款 |
| `--wallet-id <id>` | 显式指定已配置的 Agent Wallet（环境变量 `AGENT_WALLET_ID`） |
| `--private-key <hex>` | 覆盖 Agent Wallet——仅限开发与 CI |
| `--rpc-url <url>` | 显式网络 RPC URL |
| `--timeout-ms <ms>` | 网络超时（毫秒，默认：`30000`） |
| `--json` | 打印结构化 JSON 输出 |

已注册代币的精度以注册表为准，不能用 `--decimals` 覆盖。只有未注册的非 Base 资产，才需要同时传 `--asset` 和 `--decimals`。

### 用 Agent Wallet 付款 {#paying-with-agent-wallet}

默认情况下，`pay` 会为所选网络解析出**当前激活的 [Agent Wallet](../../Agent-Wallet/Intro.md)** 并交由它签名——不需要把私钥放进配置文件或环境变量。

- 如果配置了钱包但没有激活项，CLI 会**在签名前停下**，而不是默认选第一个。请设置激活钱包，或用 `--wallet-id` / `AGENT_WALLET_ID` 显式指定。
- 用 `AGENT_WALLET_DIR` 指向非默认的 Agent Wallet 目录。
- CLI 不会从 `wallets_config.json` 里读取私钥。
- 在 EVM 网络上，它会在签名前检查付款方的代币余额，并在结果中返回解析出的钱包 ID、地址与原始余额。EIP-712 的付款方必须与该地址一致。

**仅在开发与 CI 场景下**，可以用 `--private-key` 或 `EVM_PRIVATE_KEY` / `TRON_PRIVATE_KEY` / `PRIVATE_KEY` 环境变量覆盖 Agent Wallet。共享环境中优先用环境变量而非命令行参数——命令行参数可能被本机其他进程看到。

**示例：**

```bash
# 预览支付要求但不付款
x402-cli pay https://api.example.com/paid --dry-run --json
```

```bash
# 支付，但绝不超过 0.01 USDT
x402-cli pay https://api.example.com/paid \
  --network tron:0xcd8690dc --token USDT --max-amount 0.01
```

```bash
# 带请求体和自定义请求头的 POST
x402-cli pay https://api.example.com/paid \
  --method POST --header "X-Client: demo" --body '{"q":"hello"}'
```

如果接口没有返回 `402`，CLI 会报告实际状态与响应，而不会付款。

### GasFree 支付（TRON） {#gasfree-payments-tron}

在 TRON 上，`scheme=exact_gasfree` 让一个 relayer 代付网络能量、并从支付代币里扣除手续费，付款方无需持有 TRX。当服务端的 `402` 支付要求宣告了该 scheme 时，CLI 通常会自动选用；也可以用 `--scheme exact_gasfree` 显式要求。

GasFree 手续费与宣告的支付金额是**分开**的。设一个手续费上限，CLI 会先估算 relayer 手续费，若估值过高则在签名前拒绝：

```bash
x402-cli pay https://api.example.com/pay \
  --network tron:0xcd8690dc --token USDT \
  --scheme exact_gasfree \
  --max-amount 0.01 \
  --max-gasfree-fee 0.5 \
  --json
```

`--max-gasfree-fee` 与 `--max-gasfree-fee-raw` 互斥，且仅对 `exact_gasfree` 支付要求生效。用 `--gasfree-api-url <url>` 或 `X402_GASFREE_API_URL` 覆盖 relayer 地址。

已付款的响应会区分 `settled`（支付已在链上结算）与 `delivered`（上游 HTTP 业务响应成功）。一次"结算成功但上游失败"的情况会返回 `paid=true`、`settled=true`、`delivered=false`，并仍带上交易信息——重试前请先核查交易与 provider 行为。

### 在 Base 上付款 {#paying-on-base}

Base 通过标准的 `exact` EVM 流程结算 USDC，使用的是 **EIP-3009**（`transferWithAuthorization`）而非 Permit2。这一点不需要你选择——CLI 会按网络自动采用正确的授权方式。

```bash
x402-cli pay https://api.example.com/pay \
  --network base-mainnet \
  --token USDC \
  --max-amount 0.01 \
  --rpc-url <生产环境-RPC-地址>
```

内置的公共 RPC 仅供开发使用。生产环境请通过 `--rpc-url`，或 `EVM_RPC_URL_8453` / `EVM_RPC_URL` 提供 RPC 端点。

:::caution 不跟随重定向
探测请求与带签名的重试都**不会**自动跟随 HTTP 重定向，以确保 `PAYMENT-SIGNATURE` 不被转发到其他源。如果接口发生重定向，请先确认目标地址，再显式请求最终可信的 URL。
:::

### 环境变量 {#pay-environment-variables}

有些配置没有对应的命令行参数，只能通过环境变量设置：

| 变量 | 用途 |
| :--- | :--- |
| `AGENT_WALLET_DIR` | 使用非默认的 Agent Wallet 目录 |
| `AGENT_WALLET_ID` | 指定已配置的钱包（等同 `--wallet-id`） |
| `TRON_RPC_URL` | TRON RPC 地址（`--rpc-url` 未传时使用） |
| `TRON_GRID_API_KEY` | TronGrid API Key——设置后可避免公共节点限流 |
| `X402_TRON_ALLOWANCE_MODE` | TRON 授权额度处理方式，默认 `auto` |
| `EVM_RPC_URL` | 默认 EVM RPC 地址 |
| `EVM_RPC_URL_8453` | Base 主网的专用 RPC |
| `X402_GASFREE_API_URL` | 覆盖 TRON GasFree relayer 接口地址 |
| `EVM_PRIVATE_KEY` / `TRON_PRIVATE_KEY` / `PRIVATE_KEY` | 覆盖 Agent Wallet——仅限开发与 CI |

---

## `serve`

启动一个本地 x402 付费端点。它对外宣告一条支付要求，随后通过 Facilitator 校验并结算收到的支付。

```bash
x402-cli serve --pay-to <address> [options]
```

| 选项 | 说明 |
| :--- | :--- |
| `--pay-to <address>` | **（必填）** 收款钱包地址 |
| `--amount <amount>` | 人类可读的代币金额（默认：`0.0001`） |
| `--raw-amount <amount>` | 最小单位金额（与 `--amount` 互斥） |
| `--network <caip2>` | 支付网络（默认：`tron:0xcd8690dc`） |
| `--scheme <scheme>` | 支付 scheme：`exact` 或 `exact_gasfree`（默认：`exact`） |
| `--token <symbol>` | 代币符号（默认：`USDT`） |
| `--asset <address>` | 未注册代币的显式合约地址 |
| `--decimals <count>` | 代币精度，配合未注册的 `--asset` 时必填 |
| `--host <host>` | 绑定主机（默认：`127.0.0.1`） |
| `--port <port>` | 绑定端口（默认：`4020`） |
| `--resource-url <url>` | 在支付要求中对外宣告的 URL |
| `--facilitator-url <url>` | Facilitator 基础 URL（默认：`https://facilitator.bankofai.io`） |
| `--valid-for-seconds <n>` | 支付要求的有效时长（默认：`300`） |
| `--timeout-ms <ms>` | Facilitator 超时（毫秒，默认：`30000`） |
| `-d, --daemon` | 在后台运行并打印子进程 pid |
| `--json` | 打印结构化 JSON 输出 |

服务暴露四个路由：

| 路由 | 用途 |
| :--- | :--- |
| `GET /health` | 返回 `{ "ok": true }` |
| `GET /.well-known/x402` | 机器可读的支付元数据（网络、scheme、资产、金额、`payTo`） |
| `GET /pay` | 返回带 `PAYMENT-REQUIRED` 头的 `402 Payment Required` |
| `POST /pay` | 校验支付、结算，并返回交易 |

**示例：**

```bash
x402-cli serve --pay-to T... --network tron:0xcd8690dc --token USDT
```

```bash
x402-cli serve --pay-to 0x... --network eip155:97 --token USDT --amount 0.0001 --daemon
```

---

## `roundtrip`

启动一个临时本地服务、立即支付它、然后退出。这是最快的完整端到端测试。它接受 `serve` 与 `pay` 的全部选项之和。

```bash
x402-cli roundtrip --pay-to <address> [serve/pay 选项]
```

**示例：**

```bash
x402-cli roundtrip \
  --pay-to T... --amount 0.0001 --network tron:0xcd8690dc --token USDT
```

加上 `--json` 时，`roundtrip` 会输出单个 JSON 文档，其中分别包含 `serve` 与 `pay` 的结果。

---

## `gateway`

管理本地网关的 provider 文件——校验、脚手架、启动网关进程，以及从 `provider.yml` 文件构建目录资产。

```bash
x402-cli gateway <search|start|check|scaffold|catalog> [options]
```

| 子命令 | 说明 |
| :--- | :--- |
| `search <query>` | 搜索目录资产（见 [`catalog search`](#catalog)） |
| `start` | 启动本地 x402 网关进程 |
| `check <providers>` | 校验一个或多个 `provider.yml` 文件 |
| `scaffold <name>` | 生成一个起步用的 `provider.yml` |
| `catalog <command>` | 构建/校验/搜索网关目录资产 |

`start` 与 `gateway catalog` 需要 `@bankofai/x402-gateway` 运行时。请安装它（`npm install -g @bankofai/x402-gateway`）、从含有 `../x402-gateway/dist/cli.js` 的代码检出中运行，或通过 `--gateway-bin <path>` 指定。

**校验 provider 文件：**

```bash
x402-cli gateway check ./providers
```

**生成一个新的 provider：**

```bash
x402-cli gateway scaffold my-service --forward-url https://api.myservice.com
```

这会写出 `providers/my-service/provider.yml`，其中包含可直接编辑的模板（网络、收款地址、货币，以及一个示例计费接口）。

**启动网关：**

```bash
x402-cli gateway start --providers ./providers --host 127.0.0.1 --port 4020
```

### `gateway catalog`

```bash
x402-cli gateway catalog <build|check|pay-assets|search> [options]
```

| 子命令 | 说明 |
| :--- | :--- |
| `build <providers>` | 从 `provider.yml` 文件构建本地目录 |
| `check <providers>` | 校验本地 `provider.yml` 文件 |
| `pay-assets <providers>` | 列出可付费的接口资产（方法、路径、网络、价格） |
| `search <query>` | 搜索目录资产 |

```bash
x402-cli gateway catalog pay-assets ./providers --json
```

---

## `catalog`

搜索、缓存、查看并导出托管的服务目录。

```bash
x402-cli catalog <update|search|show|endpoints|pay-json|export-gateway|build> [options]
```

| 子命令 | 说明 |
| :--- | :--- |
| `update` | 将托管/本地目录资产缓存到 `~/.cache/x402-cli/catalog` |
| `search <query>` | 按名称、标签、链、类别、接口搜索服务 |
| `show <provider>` | 显示服务详情 JSON |
| `endpoints <provider>` | 列出某服务的接口 |
| `pay-json <provider>` | 打印某服务的付费 JSON（可付费路由详情） |
| `export-gateway <url>` | 从一个运行中的网关导出 `catalog.json` 和 `pay.md` |
| `build <providers>` | 从本地 `provider.yml` 文件构建目录 |

**常用选项：**

| 选项 | 说明 |
| :--- | :--- |
| `--catalog <source>` | `catalog.json` 路径或 URL |
| `--provider <fqn>` | 服务 FQN（用于 `export-gateway`） |
| `--output-dir <dir>` | 生成文件的输出目录 |
| `-n, --limit <count>` | 搜索结果数量上限（默认：`10`） |
| `--include-blocked` | 在搜索结果中包含被屏蔽的服务 |
| `--timeout-ms <ms>` | 网络超时（毫秒，默认：`30000`） |
| `--force` | 覆盖已存在的文件（用于 `export-gateway`） |
| `--raw` | 打印原始付费载荷（用于 `pay-json`） |
| `--json` | 打印结构化 JSON 输出 |

**目录来源解析。** 省略 `--catalog` 时，CLI 按以下顺序解析来源：环境变量 `X402_CATALOG` 或 `X402_GATEWAY_CATALOG`，然后是本地缓存 `~/.cache/x402-cli/catalog/catalog.json`，最后是托管默认值 `https://x402-catalog.bankofai.io/api/catalog.json`。

**示例：**

```bash
# 将托管目录缓存到本地，实现快速、离线搜索
x402-cli catalog update
```

```bash
# 搜索服务，限制 5 条结果
x402-cli catalog search "weather forecast" -n 5
```

```bash
# 查看某个服务
x402-cli catalog show acme.weather
x402-cli catalog endpoints acme.weather --json
```

```bash
# 获取某服务的可付费路由 JSON
x402-cli catalog pay-json acme.weather --raw
```

```bash
# 从运行中的网关导出 catalog.json + pay.md
x402-cli catalog export-gateway https://gateway.example.com \
  --provider acme.weather --output-dir ./out --force
```

---

## 退出码

| 退出码 | 含义 |
| :--- | :--- |
| `0` | 成功 |
| `1` | 运行时错误（网络、钱包、结算等） |
| `2` | 用法错误（缺少/非法参数、未知命令） |

完整的错误码列表及修复方法，见 [FAQ 与故障排查](./faq.md)。
