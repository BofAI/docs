---
title: "Catalog Quick Start"
description: "Discover catalog services and preview payments with wallet-cli."
---

# Catalog Quick Start

Install `@tron-walletcli/wallet-cli@4.14.0` using the [Wallet CLI quick start](/x402/cli/quickstart/). Catalog reads need no wallet or password; payment previews and payments require a configured account.

## Browse providers

```bash
wallet-cli x402 provider-list -o json
wallet-cli x402 provider-show dia -o json
wallet-cli x402 endpoint-list dia -o json
wallet-cli x402 update-catalog -o json
```

`provider-list` supports network, category, and capability filters. Do not reuse old keyword-search arguments or `--catalog`. `update-catalog` refreshes the local cache.

## Choose an endpoint and network

Read the network-specific URL from the CLI JSON's `x402Routes[].url` and fill in path placeholders. Gateway provider IDs differ from catalog FQNs, so do not construct URLs yourself. For example, preview DIA's TRON BTC quotation endpoint:

```bash
wallet-cli x402 pay https://x402-gateway.bankofai.io/providers/dia-price-tron/v1/quotation/BTC \
  --network tron:728126428 --token USDT --max-amount 0.01 --dry-run -o json
```

This only previews the payment. For an actual payment, review the network and amount, obtain authorization, and use `--password-stdin` from a secure source. Cap GasFree fees separately; reconcile uncertain transactions before considering another payment.

For direct API access, read the [Catalog JSON](https://x402-catalog.bankofai.io/api/catalog.json). The static API uses snake_case fields such as `x402_routes`; use the CLI's schema and documentation for its output shape rather than mixing the two.

- [Catalog data and API reference](/x402/api-catalog/reference/)
- [List your service](/x402/api-catalog/list-your-service/)
- [Payment command reference](/x402/cli/command-reference/)

{/* Preserve bookmarks to sections replaced by the wallet-cli migration guidance. */}
<span id="step-1-install-the-agent-wallet"></span>
<span id="step-2-install-the-x402-cli"></span>
<span id="calling-services-with-the-cli"></span>
<span id="what-happens-during-a-paid-call"></span>
<span id="next-steps"></span>
