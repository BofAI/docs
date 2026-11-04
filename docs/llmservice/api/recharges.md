# Recharge API

Use the Recharge API to discover supported networks and tokens, create recharge orders, query payment status, and report on-chain transactions. The API currently supports cryptocurrency payments only. Orders can credit the calling account, another personal account, or a team.

To use these endpoints through an Agent, see the adjacent [Recharge Skill Guide](./recharge-skill-guide.md). The Skill uses this API; it is not a separate payment system.

## Service Address and Authentication

| Setting | Value |
| --- | --- |
| Service origin | `https://chat.b.ai`; for other environments, use the supplied service origin without `/v1` |
| Path prefix | `/v1/recharges` |
| Authentication | `Authorization: Bearer <API_KEY>` |
| JSON request header | `Content-Type: application/json` |
| Troubleshooting identifier | Response header `X-Request-Id` |

**Recharge and model requests use different service addresses.** Do not append recharge paths to the model API address `https://api.b.ai/v1`. Use the recharge service origin, not the documentation site's hostname.

The API Key represents the initiating account. Keys belonging to the same account share the order-number namespace and can access that account's orders. Paying for another person or team does not grant access to the recipient's account.

Response fields are returned directly, without a shared `data` wrapper. Protect your Key. A `checkout_url` contains a checkout session credential and should be shared only with the payer for that order, never publicly.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/v1/recharges/options` | Discover available recharge options |
| `POST` | `/v1/recharges` | Create a recharge order |
| `GET` | `/v1/recharges/{out_trade_no}` | Query an existing order and payment status |
| `POST` | `/v1/recharges/{out_trade_no}/payment-submit` | Report a transaction after a direct transfer |

Subsequent request paths use the caller-generated **`out_trade_no`**, not the platform's `order_id`.

## Quick Start: Pay Through Checkout

The examples read the Key from `BAI_API_KEY`. Do not put a real Key in source code or shared logs. Networks, tokens, and amounts below are examples; query current options before creating an order.

### 1. Query Recharge Options

```bash
curl 'https://chat.b.ai/v1/recharges/options' \
  -H "Authorization: Bearer ${BAI_API_KEY}"
```

The optional `chain` query parameter filters the result, for example `?chain=base`. It is lowercased. Omit it to retrieve all available options.

Response `200`:

```json
{
  "channel": "crypto",
  "min_usd_amount": 1,
  "options": [
    {
      "chain": "base",
      "token_name": "USDC",
      "contract_address": "0x...",
      "min_amount": 1
    }
  ]
}
```

`min_usd_amount` is the minimum USD value. `min_amount` is the minimum token quantity and may be omitted. Native tokens may have an empty-string `contract_address`. Do not hardcode supported networks, tokens, contracts, or receiver addresses. Stop if no matching option is available.

### 2. Create an Order

If no payer wallet is supplied, omit `wallet_address`, `signature`, `expires_at`, and `nonce`. Do not send empty strings or placeholder values for these fields.

```bash
curl 'https://chat.b.ai/v1/recharges' \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -H 'Content-Type: application/json' \
  -d '{
    "channel": "crypto",
    "crypto_recharge_params": {
      "chain": "base",
      "token_name": "USDC",
      "amount": 10
    },
    "out_trade_no": "topup-unique-business-id",
    "recipient": { "type": "self" }
  }'
```

Generate and save a unique `out_trade_no` before the first creation attempt. Do not reuse the example order number across separate recharge tasks.

Response `200`:

```json
{
  "checkout_url": "/pay?checkout=<SESSION_TOKEN>",
  "crypto_recharge_params": {
    "amount": 10,
    "chain": "base",
    "token_name": "USDC",
    "receiver_address": "0x...",
    "wallet_address": null
  },
  "next_action": "cashier",
  "order_id": "123456",
  "out_trade_no": "topup-unique-business-id",
  "status": "pending"
}
```

### 3. Open Checkout

Resolve `checkout_url` against the recharge service origin, for example `https://chat.b.ai/pay?checkout=<SESSION_TOKEN>`. Preserve the query string. The payer completes wallet binding, payment, and transaction reporting in checkout.

Save the creation response, especially `checkout_url`. Order queries do not reissue this link. If the creation response is lost, do not switch to a new order number and pay again.

### 4. Query Payment Status

```bash
curl 'https://chat.b.ai/v1/recharges/topup-unique-business-id' \
  -H "Authorization: Bearer ${BAI_API_KEY}"
```

Example response structure; timestamps, addresses, and identifiers are illustrative:

```json
{
  "amount": 10,
  "chain": "base",
  "channel": "crypto",
  "confirmed_at": null,
  "created_at": "2026-10-21T08:00:00.000Z",
  "expires_at": 1792656000,
  "next_action": "cashier",
  "order_id": "123456",
  "out_trade_no": "topup-unique-business-id",
  "receiver_address": "0x...",
  "recipient": {
    "type": "self",
    "target_id": "user_123",
    "display_label": "p***@example.com"
  },
  "status": "pending",
  "timestamp": 1792569600,
  "token_name": "USDC",
  "tx_hash": "",
  "wallet_address": ""
}
```

Payment fields are nested under `crypto_recharge_params` in creation responses, but appear at the top level in order queries. An unbound wallet can be `null` in a creation response and an empty string in a query response.

| Status | Meaning and Action |
| --- | --- |
| `pending` | Payment is not confirmed. Keep the order and query later; do not pay again. |
| `paid` | Payment is confirmed and `confirmed_at` is populated. Stop payments and payment-status polling. |
| `expired` | An unpaid order is shown as expired after 24 hours. Do not pay into it. |

**`paid` does not mean Credits have been credited.** Crediting is asynchronous. This API does not return credited-Credits details or guarantee that the balance page has refreshed.

## Creation Parameters and Recipients

| Field | Rule |
| --- | --- |
| `channel` | Required; currently `crypto` only. |
| `out_trade_no` | Required and unique per initiating account; 1–64 ASCII letters, digits, `_`, or `-`. |
| `recipient` | Identifies the recharge recipient; see below. |
| `crypto_recharge_params.chain` | Required; a currently supported network. |
| `crypto_recharge_params.token_name` | Required; a currently supported token on that network. |
| `crypto_recharge_params.amount` | Required JSON number in token units, not USD or Credits. Positive, at most 6 decimal places, exactly representable as safe integer micro-units, and within quantity and USD-value limits. |
| `crypto_recharge_params.wallet_address` | Optional; requires valid `signature`, `expires_at`, and `nonce` when provided. |
| `crypto_recharge_params.signature` | Required with a payer wallet; proves wallet ownership. |
| `crypto_recharge_params.expires_at` | Required with a payer wallet; signature expiry as Unix seconds, in the future and no more than 10 minutes from now. |
| `crypto_recharge_params.nonce` | Required with a payer wallet; 32 cryptographically random bytes encoded as 43 base64url characters without padding. |

One token is stored as `1,000,000` micro-units. The converted integer must not exceed the JavaScript safe integer limit. Use current options for minimum USD value and token quantity. Maximum USD value and other constraints are checked at creation time. Do not automatically increase the payer's authorized amount to pass validation.

| Scenario | Example `recipient` |
| --- | --- |
| Recharge the calling account | `{"type":"self"}` |
| Recharge another personal account | `{"type":"personal","identifier":"person@example.com"}`; a personal email or wallet identifier |
| Recharge a team | `{"type":"team","team_slug":"your-team-slug"}` |

The recipient does not determine caller permissions. Query and report payment using a Key belonging to the original initiating account.

## Advanced: Bind a Wallet and Transfer Directly

### Wallet Ownership Signature

Add the payer address and all three signature fields inside `crypto_recharge_params`. Sign the following UTF-8 text in exactly this order, with LF line breaks and no trailing newline:

```text
B.AI Recharge v1
Order: <out_trade_no>
Wallet: <normalized wallet address>
Params: <chain>|<token_name>|<amount>
Nonce: <nonce>
ExpiresAt: <expires_at>
```

Trim and lowercase `chain`; trim and uppercase `token_name`. Lowercase EVM addresses, but preserve TRON and Solana addresses. Format the amount as plain decimal text without exponents or unnecessary trailing zeros, for example `10`, not `10.00`.

Generate a fresh `nonce` and an actually valid Unix-seconds `expires_at` for each signature. A signature proves wallet ownership; it does not send payment. An API Key cannot replace wallet signing. Never request or transmit private keys.

| Network Type | Message Signing |
| --- | --- |
| EVM | `personal_sign`, with EIP-191 semantics. |
| TRON | The message signature corresponding to `signMessageV2`. |
| Solana | Ed25519 over the entire UTF-8 message; submit as 128 hex characters, optionally prefixed with `0x`, not the base58 format used for transaction hashes. |

### Verify the Order and Pay

Follow the returned `next_action`. `direct-transfer` allows payment from the verified wallet. `cashier` requires the payer to complete the flow in checkout.

Before payment, query the original order. Confirm that it is still `pending`, not expired, and has no previously broadcast or unresolved payment. Transfer the exact token quantity using the order's network, token, receiver address, and bound payer wallet. Get the contract address from current recharge options. Network fees are additional.

Save the actual `tx_hash` immediately after broadcast. If broadcast times out, check the on-chain result before doing anything else. A query or reporting failure must not trigger another transfer.

### Report the On-Chain Transaction

Call this endpoint only after a direct transfer has occurred and a real transaction hash is available. Checkout handles reporting for the cashier branch.

```bash
curl 'https://chat.b.ai/v1/recharges/topup-unique-business-id/payment-submit' \
  -H "Authorization: Bearer ${BAI_API_KEY}" \
  -H 'Content-Type: application/json' \
  -d '{"tx_hash":"<TRANSACTION_HASH>"}'
```

Response `200`:

```json
{
  "confirmed_at": null,
  "order_id": "123456",
  "status": "pending",
  "tx_hash": "<TRANSACTION_HASH>"
}
```

The server checks the payer wallet, receiver, network, token, exact quantity, and transaction time. A transaction must not predate order creation. Reporting after the 10-minute transaction window returns `TX_EXPIRED`; wait for scanning and query the existing order instead of paying again.

`tx_hash` is 1–128 characters. EVM/TRON use 64 hex digits, optionally prefixed with `0x`. Solana uses a base58 transaction signature that decodes to 64 bytes.

`pending` means confirmation is outstanding. A saved hash does not prove successful verification. Reporting the same hash for the same order is idempotent. Do not substitute a different hash on retry. Keep the original records if a hash belongs to another order, the order already has a different hash, or payment is no longer allowed.

## Errors, Rate Limits, and Retries

Typical error format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters"
  }
}
```

| HTTP | Common Codes | Action |
| --- | --- | --- |
| `400` | `INVALID_REQUEST`, `INVALID_AMOUNT`, `UNSUPPORTED_TOKEN`, `RECIPIENT_UNAVAILABLE` | Check parameters, amount, current options, and recipient. |
| `400` | `INVALID_TX_HASH`, `WALLET_NOT_BOUND`, `PAYMENT_MISMATCHED`, `PAYMENT_INFO_MISMATCHED` | Check the existing order and actual transaction; do not pay again. |
| `400` | `TX_EXPIRED` | Stop reporting the old transaction; wait for scanning and query the original order. |
| `401` | `INVALID_API_KEY`, `UNAUTHORIZED` | Check the initiating account's Key and service origin. |
| `403` | `INVALID_WALLET_SIGNATURE`, `PAYER_MISMATCH` | Check wallet ownership and actual payer; stop further payments. |
| `404` | `ORDER_NOT_FOUND` | Check the service, account, and `out_trade_no`; do not substitute `order_id`. |
| `409` | `OUT_TRADE_NO DUPLICATE` | Query the original order; duplicate creation does not return it. Concurrent conflicts may also return `400 RECHARGE_CONFLICT`. |
| `409` | `INVALID_TX_HASH`, `ORDER_ALREADY_REPORTED_TX_HASH`, `ORDER_ALREADY_PAID` | Keep the order and transaction evidence. Do not replace the hash or pay again. |
| `429` | `TOO_MANY_REQUESTS` | Wait for `Retry-After`; if processing is already underway, query the original order first. |
| `503` | `CHECKOUT_UNAVAILABLE`, `PRICE_UNAVAILABLE`, `RECEIVER_UNAVAILABLE`, `RECIPIENT_SERVICE_UNAVAILABLE`, `AUTH_UNAVAILABLE` | Save the request ID, query the existing order, then use bounded backoff. |
| `503` | `PAYMENT_INFO_MISMATCHED` | May indicate a transaction predating the order. Keep evidence; do not infer that payment never occurred or retry indefinitely. |

The current limit is 60 requests per minute per initiating account. Back off between order queries and use a stopping condition instead of continuous high-frequency polling.

**Uncertain creation outcome:** After a timeout, disconnect, `5xx`, or duplicate-number conflict, query the original `out_trade_no` first. Continue the existing order when found. For `404`, verify environment and account and briefly back off. Retry creation a limited number of times with the original order number and business parameters only after confirming no order exists. An expired ownership signature can be regenerated; do not change recipient or amount.

**Lost checkout link:** Order queries do not return `checkout_url`. Keep the order and have the integrating application handle recovery; creating a new order and paying again does not restore the original flow.

**Uncertain reporting outcome:** Query the original order first. If needed, report the same hash again within the reporting window. Do not change the order number, payment amount, or transaction hash to work around a conflict.

## Related Documentation

- [Recharge Skill Guide](./recharge-skill-guide.md)
- [Balance API](./balance.md)
- [Pricing and Usage](../pricing-and-usage.md#top-up)
