---
title: "Quickstart for Buyers"
description: "Configure a wallet and make an x402 payment with wallet-cli 4.14.0."
---

# Quickstart for Buyers

Use **wallet-cli 4.14.0** to manage your account, sign payments, and call x402 APIs. This guide uses a local Nile testnet service; public catalog routes may support mainnet only.

## Install wallet-cli

Requires Node.js 20 or newer. Install globally and inspect the command interface:

```bash
npm install -g @tron-walletcli/wallet-cli@4.14.0
wallet-cli --version
wallet-cli x402 pay --help
wallet-cli x402 pay --json-schema -o json
```

The CLI must report `4.14.0`. Help and schema discovery do not access wallet data. Operational commands may first return `command: "migration"`; inspect that result before invoking the original command again.

## Configure your account locally

In your own terminal, use `wallet-cli create --help` or `wallet-cli import --help` to choose the account setup flow, then follow its instructions. Keep wallet passwords, private keys, and mnemonics out of chat, command arguments, and logs. Do not export a private key to an environment variable for this workflow.

```bash
wallet-cli list -o json
wallet-cli current -o json
```

Verify the selected account's public address. Use `wallet-cli use --help` to select another account, or pass `--account` with its account ID or label in payment commands. Use a dedicated Nile test account funded with test TRX for fees and test USDT for payment. See the [Nile faucet](https://nileex.io/join/getJoinPage).

## Preview the payment

Start the Nile service described in the [seller quick start](/x402/getting-started/quickstart-for-sellers/). Its local `GET /credit` route charges 1 USDT. A configured account is required even for the preview.

```bash
wallet-cli x402 pay http://localhost:4021/credit \
  --method GET \
  --network tron:3448148188 \
  --token USDT \
  --scheme exact \
  --max-amount 1 \
  --dry-run -o json
```

`--dry-run` inspects the payment challenge without signing or paying. Check the URL, selected account, network, asset, recipient, payment amount, and fees. The decimal network ID above is wallet-cli's canonical Nile identifier. `--max-amount 1` caps the payment at one whole token, not one smallest unit; keep the USDT filter. Chain fees require a separate TRX balance.

For a catalog service, discover its route with `wallet-cli x402 provider-list` and `wallet-cli x402 endpoint-list --help`; use the route's actual URL and supported network. Changing a mainnet route's network flag does not make it a testnet service. See [API discovery](/x402/api-catalog/get-started/).

## Pay after checking the preview

Once you authorize the exact payment, rerun the same command with `--dry-run` removed and `--password-stdin` added. Supply the wallet password directly through stdin from your secure local password source. Never put it in the command, print it with `echo`, or send it to an AI. Keep the account, network, token, scheme, and amount cap unchanged from the reviewed preview.

The CLI manages the wallet and payment signing. Inspect the JSON result and HTTP response before reporting success. The sample service returns a payload like:

```json
{ "status": "success", "credit": 1000000 }
```

This is the service response payload, not the full wallet-cli result envelope. A successful process exit alone does not prove that payment and delivery both completed.

## Handle errors without paying twice

| Result | Action |
|---|---|
| Wallet migration result | Complete the local migration and inspect its outcome before rerunning the intended command. |
| No usable account | Check `list` and `current`; select the intended account locally. |
| No matching payment option or payment over the cap | Check the server's network, token, scheme, and price; do not silently change the approved payment limit. |
| Insufficient funds or approval failure | Check token balance, TRX fees, and the returned approval details before retrying. |
| Timeout, `paymentStatus: "unknown"`, or `retryPayment: false` | Reconcile the original payment and service result. Do not automatically submit another payment. |

Check the process exit code and structured error fields. Keep any returned transaction hash for reconciliation. See the [command and result reference](/wallet-cli/command-reference/) for payment results and retry handling.

## Next steps

- [Wallet CLI guide](/wallet-cli/quickstart/)
- [Agent quick start](/x402/getting-started/quickstart-for-agent/)
- [SDK integration reference](/x402/sdk-features/)

<span id="who-is-this-guide-for"></span>
<span id="prerequisites"></span>
<span id="first-private-key-security"></span>
<span id="checklist-before-you-start"></span>
<span id="create-a-test-wallet-and-get-test-tokens"></span>
<span id="step-one-install-the-sdk-packages"></span>
<span id="step-two-configure-your-private-key"></span>
<span id="step-three-write-and-run-the-client-code"></span>
<span id="run-the-client"></span>
<span id="step-four-error-troubleshooting"></span>
<span id="summary"></span>
<span id="references"></span>
