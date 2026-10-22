---
title: 'x402 Payments on TRON: First-Time Approval and Resource Sponsoring'
description: 'How a Facilitator can sponsor the Energy and Bandwidth for the first Permit2 approve of a USDT-only agent wallet, and how to implement the extension in your own Facilitator.'
---

# x402 Payments on TRON: First-Time Approval and Resource Sponsoring

When you pay in USDT on TRON, the first step may be an on-chain approval for Permit2. That transaction needs Energy and Bandwidth. For an agent wallet that holds only USDT, payment often gets stuck right here.

TRC-20 approval resource sponsoring lets the service side cover the resources this approval needs, so the paying wallet does not have to hold TRX in advance. This works only when the account is already activated, the token and payment scheme are supported, the resource server and Facilitator have sponsoring enabled, and the sponsor has enough resources and quota. Account activation still has to be done separately.

This article starts with the first payment, then looks at how the Facilitator implements resource sponsoring. It does not cover production deployment or security assessment. For those, see [Security considerations](https://github.com/BofAI/x402/blob/v1.2.0/specs/extensions/trc20_approval_resource_sponsoring.md#security-considerations).

## 1. Preparing resources before the first payment

Suppose a research agent wants to buy a dataset priced at 0.05 USDT. Its wallet is activated, holds 10 USDT and 0 TRX, and has never approved Permit2. The quote is within budget, but the wallet lacks the Energy and Bandwidth needed to run `approve`, so it cannot pay yet.

There are two different costs here. Buying the data costs USDT. Running the on-chain approval consumes Energy and Bandwidth. Having enough USDT does not solve the resource problem of the approval transaction.

If the user has to prepare TRX or top up resources by hand, the agent has to stop and wait. With resource sponsoring enabled, the Facilitator can arrange the resources during the payment flow, while the wallet still signs the approval transaction and the payment credential.

## 2. From Permit2 approval to actual payment

To pay through Permit2, the wallet first calls the token contract's `approve` to set a spending allowance for the designated Permit2 contract. For every payment after that, the wallet also signs a separate payment credential that fixes the amount, recipient, and other terms.

When reading the flow, keep these concepts apart:

| Concept | Meaning in the flow |
| --- | --- |
| TRC-20 approval `approve` | An on-chain transaction that sets a token spending allowance for the designated Permit2 contract |
| Allowance `allowance` | The approved amount recorded by the token contract, used to decide whether another approve is needed |
| Payment credential | The wallet's signature over the terms of this payment, such as amount, recipient, and validity window |
| Settlement | Executing the on-chain payment or channel deposit based on a valid payment credential |

A successful approve does not move any tokens yet. The payment succeeds only once settlement completes. For later calls to the service, as long as the allowance is sufficient, there is no need to approve again.

## 3. Sponsoring and reclaiming approval resources

In the SDK this extension is called `trc20ApprovalResourceSponsoring`. The resource server uses the x402 payment requirements to tell the client that this approval can be sponsored. When the client finds that an approve is needed, it signs the approval transaction and hands it to the Facilitator together with the payment credential, instead of broadcasting it itself.

The Facilitator checks the approval transaction and the payment credential, then coordinates the **Resource Owner** (the resource account) to temporarily delegate Energy to the paying account, adding Bandwidth when needed. Once the resources are available, it broadcasts the raw approve signed by the wallet. Only after confirming the allowance has taken effect does it continue to settlement.

![First Permit2 payment compared: preparing approval resources yourself vs. the Facilitator coordinating resource sponsoring](/img/devnotes/trc20-sponsoring-before-after-en.svg)

*Figure 1: The Facilitator coordinates resources; the paying wallet signs the approval transaction and the payment credential.*

The Resource Owner's resources come from Stake 2.0 staking. It delegates the right to use those resources to the paying account, while the staked principal stays in its own name. Here, Resource Owner means the account that provides on-chain resources. The business server that provides data or model services is called the Resource Server.

After the approval completes, the Facilitator starts reclaiming the resources. Any unfinished reclaim and recovery work continues in the background, and payment settlement does not wait for it. Because the sponsor bears the resource cost, it sets its own conditions, such as which assets it supports and how much it will sponsor.

## 4. A complete 0.05 USDT payment

Back to the data purchase example. With an `exact` fixed-amount payment, the flow from the agent's request to receiving the data looks like this:

![Five steps of a first payment: get a quote, wallet signs, verify and provide resources, settle after approval, return the service result](/img/devnotes/trc20-sponsoring-payment-flow-en.svg)

*Figure 2: The client keeps the standard x402 request flow and does not need to call a separate resource-preparation API.*

The agent accepts the 0.05 USDT quote, and the service side sponsors the resources for the first approval as agreed. Assuming no extra token fees and no other concurrent transactions, after a successful payment the wallet and request state change as follows:

| Item | Before payment | After approval and settlement succeed |
| --- | --- | --- |
| Paying account USDT | 10 USDT | 9.95 USDT |
| Paying account TRX | 0 TRX | 0 TRX; approval resources provided by the sponsor |
| Permit2 allowance | 0; approve required | Established; later payments only check the remaining allowance |
| Payment credential | Not yet signed for this call | Signed and used for this 0.05 USDT settlement |
| Data result | Not yet received | Returned; the agent continues its task |

*The table above illustrates the flow and has not been measured in practice. Actual costs are as stated by the service provider.*

## 5. Scope and integration requirements

This extension applies to the approve step in the following three TRON Permit2 payment schemes:

| Payment scheme | Where resource sponsoring applies |
| --- | --- |
| `exact` | When a fixed-amount payment needs an approve |
| `upto` | When the path that authorizes a payment cap and later settles the actual amount needs an approve |
| `batch-settlement` | When a Permit2 channel deposit or top-up needs an approve; later operations such as Voucher and Claim do not use this extension again |

Currently the supported paying account is an activated, single-signature regular account using the default owner permission. To integrate, the client must be able to sign the transactions the extension requires, and the resource server and Facilitator must support the same set of networks, assets, and payment schemes. `exact_gasfree` uses a separate GasFree account and relay flow and is out of scope here.

In SDK v1.2.0, approve grants a `MaxUint256` allowance to the designated canonical Permit2, and every payment or deposit still needs its own signature. The default `zero-first` strategy applies to accounts whose allowance is zero. If an account already has some allowance but not enough to pay, it must be handled separately according to the token's approval rules. See the [extension specification](https://github.com/BofAI/x402/blob/v1.2.0/specs/extensions/trc20_approval_resource_sponsoring.md) for details.

## 6. Implementing and extending the Facilitator

Inside the Facilitator, the protocol layer checks the approval transaction and the payment credential, and hands the actual sponsoring work to the runtime. The runtime arranges resources, broadcasts the approve, and tracks the outcome. The Resource Owner provides resources and signs the delegate and undelegate transactions. Once the approval is complete, the corresponding payment scheme performs settlement.

![Runtime architecture inside the Facilitator: verify, sponsor, reconcile, and how they relate to the Resource Owner and background jobs](/img/devnotes/trc20-sponsoring-runtime-architecture-en.svg)

*Figure 3: The runtime connects the payment flow, the resource account, and background recovery jobs.*

| Runtime entry point | Responsibility |
| --- | --- |
| `verify()` | Read-only checks of the account, allowance, resource needs, and sponsoring conditions; does not delegate resources or broadcast transactions |
| `sponsor()` | Reserves and delegates resources, broadcasts the raw approve, confirms the approval took effect, then records and starts the reclaim |
| `reconcile()` | Called by a background job to handle transactions with unknown outcomes and unfinished resource reclaims and recoveries |

The **integration example** below shows how the runtime is registered with the Facilitator. Before it can run, you still need to fill in `network`, the signers, the coordinator, the asset address, and the permission configuration:

```typescript
import { x402Facilitator } from "@bankofai/x402-core/facilitator";
import { createTrc20ApprovalResourceSponsoringExtension } from "@bankofai/x402-extensions";
import { createTrc20ResourceSponsoringRuntime } from "@bankofai/x402-tron";
import { ExactTronScheme } from "@bankofai/x402-tron/exact/facilitator";

const runtime = await createTrc20ResourceSponsoringRuntime({
  network, resourceOwnerSigner, coordinator,
  allowedAssets: [usdtAddress], permissionId,
});
const facilitator = new x402Facilitator()
  .register(network, new ExactTronScheme(settlementSigner))
  .registerExtension(
    createTrc20ApprovalResourceSponsoringExtension(runtime),
  );
// A separate background job keeps calling runtime.reconcile().
```

Here `permissionId` is the Resource Owner's non-zero Active Permission ID, and it must authorize resource delegate and undelegate operations. It is unrelated to the default owner permission used by the paying account.

When self-hosting, you can replace the sponsoring policy `policy`, the resource coordinator `coordinator`, the chain interaction layer `chain`, and the resource account signer `resourceOwnerSigner` as needed. The high-level factory above accepts a custom `coordinator` and `resourceOwnerSigner`. To provide a custom `policy` or `chain`, use the lower-level `createTrc20ApprovalResourceSponsoringRuntime()`. For persistence, recovery, remote signing, and HSM integration, see the [SDK Facilitator integration guide](https://github.com/BofAI/x402/blob/v1.2.0/typescript/packages/extensions/src/trc20-approval-resource-sponsoring/README.md#facilitator) and the [module interfaces](https://github.com/BofAI/x402/blob/v1.2.0/typescript/packages/mechanisms/tron/src/resource-sponsoring/types.ts). Multi-pool scheduling and third-party Energy provider integration must be implemented yourself.

## 7. Trying it on Nile and self-hosted development

BANK OF AI will later support first-time Permit2 approval resource sponsoring on TRON Nile in the Official Facilitator it operates. Once available, you can connect directly to the official service and try a complete payment. The Official Facilitator provides the approval resources, so you do not need your own resource account or runtime deployment.

### Connecting to the official Nile service

See the [Official Facilitator documentation](/x402/core-concepts/OfficialFacilitator/) for how to connect. Once Nile sponsoring is available, you can try it with these steps:

1. Prepare an activated Nile wallet that has not yet approved Permit2, and transfer in a test token supported by the official service.
2. Connect your resource server to the Official Facilitator, declare the resource sponsoring extension on a supported TRON Permit2 route, and use an SDK on the client that supports the extension.
3. Send a request and sign it, then watch the approve take effect, the payment settle, and the service return its result.

When the sponsoring conditions are met, the paying wallet does not need to hold TRX in advance. The launch date, supported test tokens, and sponsoring quota are as stated by the official service.

### Running your own Facilitator

If you want to manage the resource account and sponsoring policy yourself, follow the [SDK Facilitator integration guide](https://github.com/BofAI/x402/blob/v1.2.0/typescript/packages/extensions/src/trc20-approval-resource-sponsoring/README.md#facilitator) to configure the Resource Owner and runtime on Nile.

For how to verify the first approval, the payment, and the resource reclaim, refer to the [public Nile integration test source](https://github.com/BofAI/x402/blob/v1.2.0/typescript/packages/mechanisms/tron/test/integrations/trc20-approval-resource-sponsoring.nile.test.ts) and run the checks in your own environment.

## 8. References

This article is based on BANK OF AI x402 SDK **v1.2.0**, corresponding to `@bankofai/x402-tron@1.2.0` and `@bankofai/x402-extensions@1.2.0`. For interfaces and supported scope, see the [v1.2.0 release notes](https://github.com/BofAI/x402/releases/tag/v1.2.0).

- [BANK OF AI x402: Stablecoin Payments for AI Agents](./x402-stablecoin-payments-for-agents.md): protocol background and payment schemes.
- [TRC-20 Approval Resource Sponsoring specification](https://github.com/BofAI/x402/blob/v1.2.0/specs/extensions/trc20_approval_resource_sponsoring.md): supported scope and approval constraints.
- [SDK integration guide](https://github.com/BofAI/x402/blob/v1.2.0/typescript/packages/extensions/src/trc20-approval-resource-sponsoring/README.md): client, resource server, and Facilitator integration.
- [Security considerations](https://github.com/BofAI/x402/blob/v1.2.0/specs/extensions/trc20_approval_resource_sponsoring.md#security-considerations): protocol boundaries to consider in a production security assessment.
