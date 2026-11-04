# Recharge Skill Guide

`bai-recharge` instructs an Agent how to use the [Recharge API](./recharges.md). Describe your recharge request in natural language and let the Agent discover options, create an order, provide checkout, and track payment status without writing API requests yourself.

**The Skill does not supply a wallet, API Key, or payment capability.** Available actions depend on your Agent, network permissions, and configured tools. It is not a separate payment system or a claim that every B.AI client includes the Skill.

## Before You Begin

| Requirement | Details |
| --- | --- |
| Skill-capable Agent | Must be able to read `SKILL.md` and send HTTP requests using an available tool. |
| B.AI API Key | Get one from the [API Key page](https://chat.b.ai/key) and provide it through your client's secure configuration or secrets mechanism. |
| Recharge service origin | `https://chat.b.ai`; for other environments, use the supplied origin without `/v1`. This is not the model API address `https://api.b.ai`. |
| Recharge details | Specify recipient, network, token, and quantity. Another person requires an email or wallet identifier; a team requires its team slug. |
| Wallet tools, optional | Direct transfer requires message signing and payment tools for the selected network. Without them, the user can pay through checkout. |

Amounts are token quantities, not USD or Credits. Supported networks, tokens, minimum quantities, and minimum USD value come from current options.

## 1. Download and Load the Skill

Download <a href="pathname:///downloads/recharge/bai-recharge/SKILL.md" autoAddBaseUrl={false} download="SKILL.md" target="_self">SKILL.md for bai-recharge</a> and load it using your Agent's Skill installation or import mechanism. For clients that use Skill folders, preserve this structure:

```text
bai-recharge/
└── SKILL.md
```

Installation directories and loading mechanisms vary by client. Follow that client's documentation. `SKILL.md` is an instruction file, not an executable script, and must be read by an Agent with the required tools. The downloadable instructions are in Chinese; you can ask the Agent to respond in your preferred language.

First, you can request a check that does not create an order or send payment:

```text
Use bai-recharge to check whether you can access the B.AI API Key from secure
configuration and query supported recharge networks, tokens, and minimum amounts.
Do not display the Key, create an order, sign anything, or make payment.
Tell me if a network tool, configuration, or permission is missing.
```

## 2. Configure the Connection

Provide the recharge service origin and make the API Key available through your client's secure configuration. The Skill does not require a specific environment variable name; use the configuration supported by your integration.

```text
Recharge service origin: https://chat.b.ai
API Key: Already provided through this client's secure configuration.
Do not display it or save it in generated code.
```

Never paste a real Key, private key, or recovery phrase into chat, sample code, screenshots, or shared configuration. The Skill does not need a wallet's private key; existing wallet tools perform message signing.

## 3. Describe Your Request

### Recharge the Calling Account

```text
Use bai-recharge to recharge the account belonging to my current B.AI API Key
with 10 USDC on Base. Use checkout so I can complete payment myself.
Query current options and confirm the details first. Tell me if anything is
missing; do not switch network or token or increase the amount automatically.
```

### Recharge Another Person or a Team

```text
Recharge the B.AI personal account identified by person@example.com with
10 USDC on Base. Provide checkout so I can pay myself.
```

```text
Recharge the B.AI team with team slug your-team-slug using 10 USDC on Base.
Provide checkout so I can pay myself.
```

Replace the example email, team slug, network, token, and quantity with your actual request. Do not substitute a team's display name for its slug. An unclear recipient must be confirmed, not silently replaced with the calling account.

## 4. Confirm the Order and Complete Payment

The Agent queries current options, creates an order, and follows the returned `next_action`:

| Flow | Agent and User Responsibilities |
| --- | --- |
| Checkout: `cashier` | The Agent provides the complete checkout link. The user binds a wallet and pays on that page, which handles transaction reporting. The Agent subsequently queries the original order. |
| Direct transfer: `direct-transfer` | Requires a valid wallet-ownership signature, appropriate wallet tools, and payment authorization. Verify the original order, pay the exact quantity from its bound wallet, save the actual transaction hash, then report and query it. |

If a payer address is provided but signing is unavailable, the Agent should explain the missing capability, not silently remove the address and change flows. Explicitly request checkout if you want to change approach; first investigate any existing or unresolved order.

**Approval to query or create an order is not authorization to pay automatically.** Signing and transfers remain subject to the Agent's and wallet tools' safety and confirmation requirements. Before payment, check recipient, network, token, exact quantity, and receiver address. Network fees are additional.

## 5. Read the Result or Resume an Existing Task

| Result | Meaning |
| --- | --- |
| Awaiting checkout | An order exists, but you still need to open checkout and pay. |
| `pending` | Payment is not yet confirmed. Keep the original order and any existing transaction hash, then query later. |
| `paid` | Payment is confirmed, but this does not confirm Credits were credited; crediting is asynchronous. |
| `expired` / outcome uncertain | Stop payment, preserve the records, and investigate. Do not automatically pay again. |

To resume after an interruption, provide the original business order number:

```text
Query the recharge with out_trade_no <original-business-order-number>.
Keep the original order and any existing transaction. Do not create another
order, pay again, or replace the transaction hash.
Tell me the actual status and what I still need to do.
```

The Agent should return `out_trade_no`, `order_id` if available, actual payment status, network/token/quantity, and the real transaction hash if available. Checkout links contain session credentials; share them only with the payer, never publicly.

## Troubleshooting

| Issue | Action |
| --- | --- |
| Downloading the Skill did not enable recharge | Check whether the Agent loaded it and has an HTTP tool, network access, and a Key in secure configuration. The file does not add these capabilities. |
| No wallet tools | Use user-operated checkout. Do not claim automatic signing or transfers are available. |
| Order creation timed out or returned a duplicate number | Query the original `out_trade_no` and continue that order after confirming the outcome. Do not bypass it with a new number. |
| Checkout link was lost | The query endpoint does not reissue it. Preserve the order for the integrating application to handle; do not pay again. |
| Payment sent but status is still `pending` | Check the original transaction and order, then query later. Do not send another transaction. |
| Status is `paid` but the Credits page is unchanged | `paid` confirms payment only. It does not prove that Credits have been credited. |

## Related Documentation

- [Recharge API](./recharges.md): Parameters, signatures, statuses, and errors.
- [Balance API](./balance.md): Available balance and quota for the calling Key.
- [Pricing and Usage](../pricing-and-usage.md#top-up): Platform recharge and Credits rules.
