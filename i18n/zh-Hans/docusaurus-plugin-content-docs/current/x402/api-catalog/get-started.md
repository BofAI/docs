---
title: "Catalog 快速入门"
description: "用 wallet-cli 查询目录和预览付费接口。"
---

# Catalog 快速入门

先按 [Wallet CLI 快速入门](/zh-Hans/wallet-cli/quickstart/)安装 `@tron-walletcli/wallet-cli@4.14.0`。目录查询不需要钱包或密码，支付预览和付款需要已配置账户。

## 浏览目录

```bash
wallet-cli x402 provider-list -o json
wallet-cli x402 provider-show dia -o json
wallet-cli x402 endpoint-list dia -o json
wallet-cli x402 update-catalog -o json
```

`provider-list` 可按支持的网络、类别和 capability 过滤，不沿用旧 CLI 的关键词搜索或 `--catalog` 参数。`update-catalog` 会更新本地缓存。

## 选择接口和网络

从 CLI JSON 的 `x402Routes[].url` 读取网络对应的 URL，并填入接口路径中的占位符。Gateway provider id 与目录 FQN 不同，不能自行拼接。例如 DIA 的 TRON BTC 报价接口：

```bash
wallet-cli x402 pay https://x402-gateway.bankofai.io/providers/dia-price-tron/v1/quotation/BTC \
  --network tron:728126428 --token USDT --max-amount 0.01 --dry-run -o json
```

该命令只预览。实际支付需核对金额及网络、取得授权并通过安全来源提供 `--password-stdin`。GasFree 另设手续费上限；结果不确定时先核对交易，不能重复付款。

需要直接读取目录数据时，可访问 [Catalog JSON](https://x402-catalog.bankofai.io/api/catalog.json)。静态 API 使用 `x402_routes` 等 snake_case 字段；CLI 的输出字段以其 schema 和文档为准，不要混用。

- [目录数据与接口参考](/zh-Hans/x402/api-catalog/reference/)
- [提交服务](/zh-Hans/x402/api-catalog/list-your-service/)
- [支付命令参考](/zh-Hans/wallet-cli/command-reference/)

{/* Preserve bookmarks to sections replaced by the wallet-cli migration guidance. */}
<span id="第-1-步安装-agent-wallet"></span>
<span id="第-2-步安装-x402-cli"></span>
<span id="用-cli-调用服务"></span>
<span id="一次付费调用发生了什么"></span>
<span id="下一步"></span>
