---
title: 'BANK OF AI x402: Stablecoin Payments for AI Agents'
description: 'From the HTTP 402 challenge–response flow to choosing between exact, exact_gasfree, upto, and batch-settlement — plus an end-to-end paid-inference case study on TRON.'
---

# BANK OF AI x402: Stablecoin Payments for AI Agents

## 1. When AI agents need to pay

AI agents do more than read public information. They retrieve data, call models, buy specialized tools, and hand tasks off to other agents. In these scenarios the consumer of a service is no longer always a person sitting in front of a browser — it is software deciding, on its own, what to call based on the task, the price, and the budget.

Traditional billing was designed for humans: register an account, store an API key, buy a plan or pre-load credit. That still fits long-term customer relationships, but it handles one-off, cross-service, very small machine calls badly. The caller has to open an account and get credit approved in advance, while the provider maintains accounts, quotas, and invoices — and a capability needed just once may end up being something the agent simply cannot buy on its own.

x402 moves payment negotiation back into the HTTP request itself. The service states what payment this resource requires; the client, having understood the terms, signs a payment credential and retries. Pay-per-call then lives in the same interaction loop as the API call: no account relationship established up front, and no checkout page wedged into the agent's execution path.

## 2. BANK OF AI x402 and TRON

### 2.1 What x402 is

HTTP `402 Payment Required` has long been reserved for "payment is needed." x402 turns it into a machine-processable challenge–response flow:

1. The client requests a protected resource.
2. The Resource Server returns `402` and offers one or more acceptable Payment Requirements in the `PAYMENT-REQUIRED` header — network, asset, amount, recipient, validity window, and payment scheme.
3. The client picks a requirement it can satisfy, signs a Payment Payload with its wallet, and carries it in the `PAYMENT-SIGNATURE` header on the retried request.
4. The server verifies the payment; where needed a Facilitator validates the signature and on-chain settleability, then returns the resource along with `PAYMENT-RESPONSE` once settled.

Payment Requirements are the server's quote and constraints; the Payment Payload is the client's signed response to one of them. The two must be verified together: it is not enough to confirm "a transfer happened" — the network, token, amount, recipient address, validity window, and chosen scheme must all match the original quote.

### 2.2 Why TRON first

TRON gives x402 a settlement environment built around stablecoins. For dollar-denominated APIs, model inference, and data services, TRC-20 stablecoins make the quote line up directly with what users expect to pay; the network also suits applications that need frequent, small payments. The SDK currently supports TRON Nile and Shasta testnets plus mainnet — validate the full path on a testnet before going further.

But "low cost" is not "no cost." An ordinary TRON transaction still involves bandwidth, energy, or TRX; confirmation time, RPC availability, token contract support, and the Facilitator's liquidity and risk policies all shape the real experience. The value of BANK OF AI x402 is in reaching these stablecoin capabilities through one unified HTTP payment protocol — not in guaranteeing that payment will go through automatically under any token, wallet, or network condition.

### 2.3 BANK OF AI x402

BANK OF AI x402 is fully compatible with the core HTTP payment protocol and interaction model of Coinbase x402: the server publishes payment requirements via `402 Payment Required`, the client signs a credential and retries, and delivery completes through a standardized verify-and-settle flow. Agents, Resource Servers, and Facilitators that support x402 can therefore reuse the same protocol model. BANK OF AI's extensions sit at the multi-network, stablecoin-asset, and corresponding signing/settlement implementation layers — with TRON being the settlement network this article focuses on.

Within the TRON ecosystem, [BANK OF AI](/BANK-OF-AI/Intro/) positions itself as "your Web3 AI gateway," giving agents the ability to pay, prove identity, act, and reason. The product matrix uses a three-layer architecture. The **application layer** is where agents run and get used — agent harnesses, agent applications, and marketplaces. The **middle layer** is what BANK OF AI provides — agent integration and Skills, Agent Wallet, x402 payment services, and MCP services, plus the x402 SDK, 8004 SDK, and the CLI tooling. The **infrastructure and standards layer** holds the protocol standards and the chain and model foundations they depend on — MCP / x402 / 8004, on-chain contracts and assets, and LLM services and foundation models.

![BANK OF AI product matrix](/img/devnotes/bankofai-product-matrix-en.svg)

In this layering, x402 is the open payment protocol in the infrastructure and standards layer, sitting alongside 8004 which handles agent identity and reputation; MCP defines how agents and tools exchange context. The x402 Gateway, x402 Facilitator, x402 Recharge Server, Agent Wallet, Skills, and the various MCP Servers live in the middle layer, turning those protocols into directly callable capabilities. Each layer can be used on its own or combined as the scenario requires: x402 when you need to pay, 8004 when you need to verify identity or reputation, MCP when you need to connect to tools or on-chain services.

## 3. Architecture and payment flow

### 3.1 The participants

- **AI agent and Agent Wallet**: the agent decides whether to buy a resource; the wallet holds keys, checks budget and policy, and produces a TIP-712 signature for the payment requirement. Private keys should never be handed to the Resource Server or Facilitator.
- **Resource Server**: serves the protected resource, generates Payment Requirements, and delivers content or performs the service once verification and settlement succeed.
- **Facilitator**: verifies payment credentials per network and scheme, simulates or submits on-chain settlement, and returns an auditable result. It can be deployed independently, or the server can take on the same logical responsibility.
- **Blockchain network and payment contracts**: carry the assets, authorizations, and settlement transactions; different schemes may rely on different contracts or proxies. The payment flow diagram here uses TRON and TRC-20 assets as the example.

### 3.2 One complete x402 payment

![One complete BANK OF AI x402 payment](/img/devnotes/tron-x402-payment-flow-en.svg)

1. The agent sends an ordinary HTTP request to a paid endpoint.
2. The Resource Server returns `402 Payment Required`, publishing the acceptable payment options.
3. The agent's selector picks a supported network, asset, and scheme; the wallet simultaneously checks balance, limits, recipient, and validity window.
4. The wallet signs a Payment Payload for the chosen requirement, and the agent retries the original request carrying `PAYMENT-SIGNATURE`.
5. The Resource Server passes the requirements and payload to the Facilitator for verification, settling either before or after delivery depending on the service's own value and failure-handling policy.
6. The Facilitator returns the verification/settlement result and a transaction identifier; the Resource Server delivers the resource and returns the outcome to the client in `PAYMENT-RESPONSE`.

### 3.3 The core protocol data

- **`PAYMENT-REQUIRED`**: the payment challenge in the 402 response, typically containing an `accepts` list. Each entry describes one payable combination rather than a vague "please send money."
- **`PAYMENT-SIGNATURE`**: the encoded payment response on the retried request, containing the requirement the client accepted plus the scheme-specific signed payload.
- **`PAYMENT-RESPONSE`**: settlement information on a successful response — final settled amount, transaction hash, or the scheme's follow-up state.
- **Payment Requirements / Payload**: the former is the quote, the latter a verifiable commitment to it. A secure implementation must check the binding between them and reject credentials that are expired, tampered with, replayed, or over-settled.

## 4. The payment schemes

### 4.1 Exact: fixed-amount payment

`exact` is for services whose price is known before the call. The server quotes 0.01 USDT, the client signs that exact amount, and the Facilitator settles it once after verification. It has the simplest mental model and suits single reports, fixed-price data queries, file downloads, or one-off tool calls.

Its limits are equally clear: when the real cost is only known after execution, the server cannot treat `exact` as a blank cheque it may mark up at will. For inference, bandwidth, or compute tasks with uncertain pricing, use `upto` instead — or split the price into stages that can each be quoted up front.

### 4.2 Exact Gasfree: paying on TRON without TRX

`exact_gasfree` is a TRON-only fixed-amount scheme. The payer can pay in USDT or USDD without holding TRX in their ordinary wallet; the official GasFree Proxy/relayer path submits the transaction and pays the corresponding on-chain resource cost.

This is not universally "free" payment. The scheme requires the wallet, token, GasFree service, and Facilitator to all support the flow, and the cost surfaces as the GasFree **relayer fee**, which the client estimates and which is deducted from the payment token on top of the payment amount — the payment requirement itself carries no fee object. Production deployments should explicitly check available assets, GasFree account status, fee configuration, and the failure fallback path — you cannot decide whether payment is possible from the main wallet's TRX balance alone.

### 4.3 Upto: paying for actual usage

`upto` lets the client authorize a maximum amount rather than fixing the final one in advance. After completing the work, the Resource Server submits an actual settlement amount — no greater than the cap — based on auditable metering. An agent might authorize "up to 0.10 USDT," and the model service charges 0.063 USDT based on actual input/output tokens, inference duration, or bandwidth used.

The cap protects the payer; it is not a suggested value for the server. Final settlement must be less than or equal to the authorized cap. Providers should also publish their metering units, prices, rounding rules, and charging policy on failure — otherwise "usage-based" becomes an unexplainable bill.

### 4.4 Batch Settlement: a channel scheme for high-frequency micropayments

`batch-settlement` targets continuous, high-frequency service calls with small per-call amounts. The payer first creates a channel and deposits into it; each subsequent charge is represented by an off-chain signed cumulative voucher. The server verifies the voucher and can deliver immediately, then claims/settles in batches by request count, cumulative amount, or time window. No individual agent tool call has to wait for an on-chain transaction.

It is not a drop-in replacement for single payments. Channel funds are locked up in advance, and both client and server must manage voucher state, validity, replay protection, retries, and final reconciliation. It therefore suits continuous retrieval, market-data subscriptions, multi-turn inference, and agent workflows; for occasional one-off calls, `exact` or `upto` is usually more direct.

### 4.5 Choosing a scheme

| Business condition | Preferred scheme | Why, and what it assumes |
| --- | --- | --- |
| Fixed-price API, download, one-off result | `exact` | Terms and amount can be determined before execution. |
| Payer wallet holds no TRX, but uses supported assets and services | `exact_gasfree` | Depends on joint support from GasFree Proxy, relayer, and Facilitator. |
| Price depends on actual tokens, duration, or bandwidth | `upto` | Authorize a cap first, settle on actual usage after. |
| High-frequency, small-amount, continuous calls | `batch-settlement` | Channels and off-chain vouchers remove the need to go on-chain every call. |

## 5. Batch Settlement in depth

### 5.1 Why it exists

`exact` and `upto` both fit "one request, one settlement": once payment terms are clear, the server verifies and submits the corresponding on-chain settlement. That premise becomes a bottleneck in high-frequency micropayments — per-transaction network cost can exceed the price of the service itself, on-chain confirmation stretches out the HTTP response, and continuous retrieval, market-data subscriptions, or multi-turn agent orchestration generate far too many transactions.

The core idea of `batch-settlement` is to decouple *access authorization* from *final value transfer*. The agent submits a verifiable payment commitment with each request; the server verifies it and delivers immediately, while the actual collection of funds happens later, in batches. The settlement result the client receives can be channel state or a credential identifier rather than a transaction hash per call.

In BANK OF AI x402, Batch Settlement can use the appropriate channel implementation per network. On TRON it takes the form of a unidirectional payment channel: funds are locked in the channel first, off-chain vouchers cover many charges, and the Facilitator ultimately submits batched on-chain claims on the provider's behalf. It reduces how often each call touches the chain — it does not eliminate the engineering cost of locked capital, state storage, reconciliation, and dispute handling.

### 5.2 The mechanics

- **Deposit**: the payer creates or identifies a channel with an immutable `ChannelConfig` and deposits payable assets. The config binds payer, recipient, token, authorizer, withdrawal delay, and a random salt; the channel ID derives deterministically from that config, the network, and the contract address.
- **Voucher**: each call is signed by the agent as a cumulative credential whose key field is `maxClaimableAmount`. It means "as of this call, the provider may claim at most this much" — not an isolated small transfer.
- **Claim**: the provider submits one or more latest vouchers, registering the claimable amount on-chain as `totalClaimed`. This step confirms the debt but does not necessarily transfer tokens yet.
- **Settle**: consolidates registered amounts for the same recipient and token into an actual transfer out. A single `settle` can cover multiple channels and a large number of requests — this is where the batch cost advantage really comes from.
- **Refund / Withdraw**: a cooperative refund returns unused balance immediately; if the provider does not cooperate, the payer can initiate a unilateral withdrawal with a waiting period, ensuring funds are never locked permanently.

Cumulative vouchers are also the key to replay protection. The cap on call N equals "cumulative amount already charged + the cap acceptable for this call," so a new credential naturally supersedes the previous, lower cap; the server only needs to keep the latest state, and an old credential replayed cannot increase the claimable amount. Before signing again, the client should check `chargedAmount`, the cumulative amount, channel balance, and `channelId` — and on any mismatch, stop signing and move to recovery or withdrawal.

### 5.3 The full flow

![Batch Settlement payment channel and cumulative vouchers](/img/devnotes/batch-settlement-channel-en.svg)

The flow in the diagram splits into three phases. The first two solve "how to establish a payable balance" and "how to call continuously without waiting for on-chain confirmation"; only the third formally settles the accumulated charges.

#### Phase 1: Open the channel (the one on-chain transaction)

1. **The client submits the deposit payload**: on first use, or when the channel balance runs out, the Agent Wallet sends the `ChannelConfig`, the first voucher, and a token deposit authorization. `ChannelConfig` fixes payer, recipient, token, authorizer, withdrawal delay, and salt, and derives a deterministic `channelId`.
2. **The Resource Server requests verification and deposit**: the server hands the payload to the Facilitator, which runs `/verify` and `/settle(deposit)`; after validating the signature and deposit authorization, it places the assets into the channel escrow contract.
3. **The channel is ready**: the on-chain channel holds the funds and initial state. From here on the payer submits no on-chain transaction per call, and the Facilitator covers the resource cost of that one on-chain operation.

#### Phase 2: High-frequency requests (local signing, off-chain execution)

1. **The client signs a new cumulative voucher**: for each request, the Agent Wallet updates `maxClaimableAmount` to "historical cumulative charged + the maximum fee acceptable this time," signing entirely locally.
2. **The server verifies locally and does the work**: the Resource Server validates the voucher, channel config, cumulative cap, and balance without touching the chain for this request; once valid, it immediately runs the inference, retrieval, or other paid service.
3. **The server returns a billing snapshot**: the server returns `200 OK`, the actual `chargedAmount`, and `channelState`. The actual fee must not exceed the voucher cap; the client checks amount, cumulative value, balance, and `channelId` before signing again.
4. **New credentials supersede old ones**: after N repetitions on the same channel, the server only needs to persist the latest cumulative voucher and `chargedCumulativeAmount`. Older, lower-amount credentials cannot increase the claimable amount, so there is no need to manage a nonce per call.

#### Phase 3: Batch settlement (on-chain, by policy)

1. **Choose when to settle**: the server can trigger settlement on a fixed interval, a cumulative-amount threshold, or a payer-initiated withdrawal, then pull the latest vouchers from multiple channels.
2. **Claim — confirm claimable amounts in bulk**: the server asks the Facilitator to call `/settle(claim)`, which bundles the latest credentials across channels and submits `claimWithSignature`, registering the cumulative amount as `totalClaimed`. The funds are still in the channel contract at this point.
3. **Settle — consolidate and transfer to the recipient**: the Facilitator then uses `/settle(settle)` to consolidate the accounted funds for the same recipient and token, executing one actual token transfer.
4. **Exit and refund**: once the service is done, unused balance can be returned via a cooperative `refund`; if the payer calls `initiateWithdraw`, the provider must complete its claim within `withdrawDelay`, after which the payer can `finalizeWithdraw` to recover whatever was not claimed.

### 5.4 Settlement strategy

Settlement can be triggered three ways: periodic settlement makes network cost and accounting rhythm predictable; an amount threshold caps the provider's unclaimed risk exposure; settling only when the payer withdraws is the most gas-efficient but leaves the provider with the greatest "failed to claim in time" risk. Production systems usually combine a threshold with a maximum wait rather than relying on a single strategy.

You must distinguish four states: "request succeeded," "voucher accepted," "claim is on-chain," and "tokens settled." The server should store the latest state atomically, indexed by `channelId` and cumulative amount; on-chain retries should be judged by transaction hash, events, and idempotency keys. For the payer, the risk ceiling is the `maxClaimableAmount` of signed vouchers; for the provider, the key risk is failing to claim within `withdrawDelay` after the payer starts withdrawing.

### 5.5 Benefits and costs

The benefits are fewer on-chain transactions, lower average settlement overhead, and a shorter service path that never waits for per-call confirmation. It suits cases where per-call value is close to or below network cost, low latency matters, and the same payer keeps calling the same provider.

The costs are just as concrete: the payer's funds are locked up front; the server must persist and correctly recover channel state; the client must check every billing snapshot; and both sides must handle offline credentials, retries, channel closure, and exit windows. For occasional one-off calls, `exact` or `upto` is often simpler; for high-value transactions needing protocol-level refund guarantees, evaluate a more suitable escrow/capture model. Use the channel management and recovery logic the SDK provides rather than assembling vouchers and a settlement state machine yourself.

## 6. End-to-end case study: an agent calling a paid inference service

This chapter uses the **TRON Nile testnet** to show how an agent uses TRC-20 stablecoins to call a paid inference service through BANK OF AI x402's `batch-settlement` scheme. Production can switch the same flow to TRON mainnet; the protocol interaction, channel state, and voucher mechanics stay the same.

### 6.1 The scenario

Picture a research agent working through a cross-source analysis task. It needs to call the same inference service repeatedly: summarize a batch of documents, ask multiple rounds of follow-up questions, extract structured conclusions, and finally generate a report. Each call costs very little, but the whole task may produce dozens to hundreds of requests within tens of minutes.

If every inference settled separately on TRON, the service response would be dragged out by on-chain interaction and network cost would eat the economics of micropayments. So we use `batch-settlement`: on the first call the agent opens and funds a payment channel on **TRON Nile** with TRC-20 USDT or USDD; each subsequent inference only signs an incrementing voucher; the inference service returns results immediately and consolidates the charges for collection in the background.

### 6.2 The inference service's billing model

Unlike a fixed-price weather lookup, inference cost depends on the model, context length, and generation length. In the 402 requirement the server should state `network=TRON_NILE`, the acceptable TRC-20 assets (USDT or USDD, say), and the **maximum fee** for this call, spelling out input token price, output token price, model tier, and minimum billing unit. The agent's budget policy decides from that whether to sign the voucher; once the service completes, the actual fee must not exceed that call's cap.

Beyond the model result, a successful inference response should return the following auditable information:

| Response field | What it means for inference | What the agent checks |
| --- | --- | --- |
| `chargedAmount` | The actual fee for this call | Must not exceed the maximum fee signed for this call. |
| `channelState.chargedCumulativeAmount` | Cumulative spend for this task on the channel | Must equal the previous cumulative value plus this call's actual fee. |
| `channelState.balance` | Basis for remaining usable funds in the channel | Stop calling or fund a new channel when the balance runs low. |
| Usage breakdown | Input/output tokens, model version, billing rule version | Used for bill explanation, cost analysis, and anomaly auditing. |

Batch Settlement is only responsible for aggregating multiple authorized charges into one settlement; *why this particular inference cost what it did* remains the job of the inference service's metering system, and should be disclosed to the payer along with the result.

### 6.3 A worked billing example

Suppose the agent has a 5 USDT research budget on TRON Nile and needs to summarize, cross-question, and report on 40 source materials. The service sets the per-inference cap at 0.10 USDT, with the actual price computed from input/output tokens. The payment process reads like this:

1. **Task starts**: the agent uses its TRON wallet to open a channel and deposit 5 USDT on the first call. It does not need to know the exact cost of each inference in advance — only that each is capped at 0.10 USDT and the whole task at 5 USDT.
2. **First summary**: the agent signs a voucher capped at 0.10 USDT; the service actually uses 12,000 input tokens and 800 output tokens, charging 0.042 USDT. The response returns the summary, `chargedAmount=0.042`, and cumulative spend `0.042`.
3. **Subsequent inference**: before the second call, the agent signs a new cumulative cap built on the confirmed `0.042`. As retrieval, comparison, and rewriting proceed, the service keeps returning token usage and a new cumulative value; the agent stops signing the moment any amount, channel, or metering rule fails to line up.
4. **Threshold reached**: at, say, 1 USDT cumulative or 10 minutes elapsed, the server has the TRON Facilitator batch-claim the latest vouchers for this channel and other users' channels, then settles collectively by recipient and TRC-20 token. The model calls themselves never wait for this on-chain operation.
5. **Task ends**: when the report is finished, suppose 80 calls consumed 3.16 USDT. The signed vouchers let the provider claim that amount; the unspent 1.84 USDT returns to the agent through a cooperative refund or the withdrawal flow.

In this case the inference metering, the agent's budget, and the payment channel each have clear boundaries: the metering system determines the actual fee, the agent decides whether to accept the next cap, and Batch Settlement consolidates charges that have already occurred.

### 6.4 A minimal reference implementation

The repository's [examples/typescript](https://github.com/BofAI/x402/tree/main/examples/typescript) provides a runnable reference with the same **TRON Nile** structure described above: it substitutes `GET /weather` for the inference endpoint, but the path through the first TRC-20 deposit, subsequent vouchers, and background claim/settle is identical. To use it for an inference service, replace the route's business logic with a model call and keep the `batch-settlement` TRON payment registration and channel management.

The Facilitator is an indispensable settlement service on this TRON path. For a minimal integration, prefer the official BANK OF AI hosted Facilitator: on the Nile testnet set `FACILITATOR_URL` to `https://tn-facilitator.bankofai.io`, and switch to `https://facilitator.bankofai.io` for production. It handles the on-chain execution of verification, deposit, claim, settle, and refund.

```ts
const facilitator = new HTTPFacilitatorClient({
  url: "https://tn-facilitator.bankofai.io", // TRON Nile
  // In production use facilitator.bankofai.io and attach X-API-KEY to requests.
});
```

On the client, the key steps are registering `BatchSettlementTronScheme` and wrapping a plain `fetch` into a payment-capable request function:

```ts
import { resolveWallet } from "@bankofai/agent-wallet";
import { x402Client, wrapFetchWithPayment } from "@bankofai/x402-fetch";
import { createClientTronSigner, TRON_NILE } from "@bankofai/x402-tron";
import { BatchSettlementTronScheme } from "@bankofai/x402-tron/batch-settlement/client";

const wallet = (await resolveWallet({ network: TRON_NILE })) as
  Parameters<typeof createClientTronSigner>[0];
const signer = await createClientTronSigner(wallet, { network: TRON_NILE });
const client = new x402Client((_version, accepts) =>
  accepts.find((item) =>
    item.scheme === "batch-settlement" && item.network === TRON_NILE,
  )!,
);

client.register(
  TRON_NILE,
  new BatchSettlementTronScheme(signer, {
    depositPolicy: { depositMultiplier: 5 },
  }),
);

const paidFetch = wrapFetchWithPayment(fetch, client);
const response = await paidFetch("https://inference.example.com/v1/generate");
```

The server registers the same TRON scheme and runs the channel manager in the background:

```ts
const scheme = new BatchSettlementTronScheme(process.env.TRON_ADDRESS!);
resourceServer.register(TRON_NILE, scheme);

scheme.createChannelManager(facilitator, TRON_NILE).start({
  claimIntervalSecs: 60,
  settleIntervalSecs: 120,
  maxClaimsPerBatch: 100,
});
```

## 7. Summary

BANK OF AI x402 lets APIs quote and collect payment through an HTTP-native challenge–response, so agents can buy digital services on demand within a controlled budget. TRON provides first-class support for TRC-20 stablecoin settlement here: `exact` fits fixed quotes, `exact_gasfree` serves TRX-free wallets that meet the GasFree conditions, `upto` bounds actual usage within a pre-authorized cap, and `batch-settlement` reduces on-chain settlement frequency for high-frequency micropayments.

A genuinely reliable agent payment system still has to implement protocol capability alongside product rules: least-privilege wallets, explicit asset and service allowlists, amount caps, short validity windows with replay protection, recoverable idempotent flows, auditable metering, and step-by-step validation from testnet to mainnet. That is what makes payment a capability agents can safely compose — rather than a new source of uncontrolled risk.

---

## Related docs

- [x402 Payment Protocol](/) — protocol overview and core concepts
- [x402 CLI](/x402/cli/) — pay and run paywalls from your terminal
- [SDK Features](/x402/sdk-features/) — which schemes the SDK supports
