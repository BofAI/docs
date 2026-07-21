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
| `--network <caip2>` | 要求特定网络（如 `tron:nile`） |
| `--token <symbol>` | 要求特定代币（如 `USDT`） |
| `--scheme <scheme>` | 要求特定 x402 scheme（如 `exact`） |
| `--max-amount <amount>` | 允许支付的最大人类可读金额 |
| `--max-raw-amount <amount>` | 允许支付的最大最小单位金额 |
| `--dry-run` | 只读取支付要求，不签名、不付款 |
| `--private-key <hex>` | 显式付款方私钥（或用下方环境变量） |
| `--rpc-url <url>` | 显式网络 RPC URL |
| `--timeout-ms <ms>` | 网络超时（毫秒，默认：`30000`） |
| `--json` | 打印结构化 JSON 输出 |

付款方私钥来自 `--private-key`，或环境变量：TRON 网络用 `TRON_PRIVATE_KEY`，EVM 网络用 `EVM_PRIVATE_KEY`，`PRIVATE_KEY` 作为两种网络通用的回退。

**示例：**

```bash
# 预览支付要求但不付款
x402-cli pay https://api.example.com/paid --dry-run --json
```

```bash
# 支付，但绝不超过 0.01 USDT
TRON_PRIVATE_KEY=<hex> x402-cli pay https://api.example.com/paid \
  --network tron:nile --token USDT --max-amount 0.01
```

```bash
# 带请求体和自定义请求头的 POST
x402-cli pay https://api.example.com/paid \
  --method POST --header "X-Client: demo" --body '{"q":"hello"}'
```

如果接口没有返回 `402`，CLI 会报告实际状态与响应，而不会付款。

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
| `--network <caip2>` | 支付网络（默认：`tron:nile`） |
| `--token <symbol>` | 代币符号（默认：`USDT`） |
| `--asset <address>` | 未注册代币的显式合约地址 |
| `--decimals <count>` | 代币精度，配合未注册的 `--asset` 时必填 |
| `--host <host>` | 绑定主机（默认：`127.0.0.1`） |
| `--port <port>` | 绑定端口（默认：`4020`） |
| `--resource-url <url>` | 在支付要求中对外宣告的 URL |
| `--facilitator-url <url>` | Facilitator 基础 URL（默认：`https://facilitator.bankofai.io`） |
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
x402-cli serve --pay-to T... --network tron:nile --token USDT
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
TRON_PRIVATE_KEY=<hex> x402-cli roundtrip \
  --pay-to T... --amount 0.0001 --network tron:nile --token USDT
```

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
