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

`provider-list` 可按支持的网络、类别和 capability 过滤。`update-catalog` 会更新本地缓存。

## 选择接口和网络

从 CLI JSON 的 `x402Routes[].url` 读取网络对应的 URL，并填入接口路径中的占位符。Gateway provider id 与目录 FQN 不同，不能自行拼接。例如 DIA 的 TRON BTC 报价接口：

```bash
wallet-cli x402 pay https://x402-gateway.bankofai.io/providers/dia-price-tron/v1/quotation/BTC \
  --method GET \
  --network tron:728126428 \
  --token USDT \
  --scheme exact \
  --max-amount 0.01 \
  --dry-run -o json
```

该命令只预览。实际支付需核对金额及网络、取得授权并通过安全来源提供 `--password-stdin`。GasFree 另设手续费上限；结果不确定时先核对交易，不能重复付款。

需要直接读取目录数据时，服务列表见 [Catalog JSON](https://x402-catalog.bankofai.io/api/catalog.json)，端点及其 `x402_routes` 见 `/api/providers/<fqn>.json`。静态 API 的字段名为 snake_case，但 `i18n` 和路由对象里的字段保持原样（如 `assetTransferMethod`）；CLI 的输出字段以其 schema 和文档为准，不要混用。

- [目录数据与接口参考](/zh-Hans/x402/api-catalog/reference/)
- [提交服务](/zh-Hans/x402/api-catalog/list-your-service/)
- [支付命令参考](/zh-Hans/wallet-cli/command-reference/)
