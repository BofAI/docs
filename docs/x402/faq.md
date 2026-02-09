---
title: "FAQ"
---

### General

#### What _is_ x402-tron in a single sentence?

x402-tron is a TRON implementation of the x402 open payment protocol that turns the dormant HTTP `402 Payment Required` status code into a fully-featured, on-chain payment layer for APIs, websites, and autonomous agents on TRON blockchain.

#### Is x402-tron a commercial product?

_No._ x402-tron is an open-source implementation of the x402 protocol for TRON blockchain, released under the MIT license. You don't need any commercial products to use it.

#### Why not use traditional payment rails or API keys?

Traditional rails require credit-card networks, user accounts, and multi-step UI flows. x402-tron removes those dependencies, enabling programmatic, HTTP-native payments (perfect for AI agents) while leveraging TRON's fast and low-cost transactions.

#### Is x402-tron only for crypto-native projects?

No. Any web API or content provider—crypto or web2—can integrate x402-tron if it wants a lower-cost, friction-free payment path using TRON blockchain.

### Language & Framework Support

#### What languages and frameworks are supported?

x402-tron provides SDKs for:

* **Python**: With FastAPI and Flask integration
* **TypeScript**: With fetch client support

Both languages support client, server, and facilitator implementations.

### Facilitators

#### Who runs facilitators?

You typically run your own facilitator. x402-tron is designed to be self-hosted. The facilitator included in the repository is ready to run.

An official hosted facilitator service is also **coming soon**, which will allow you to use x402-tron without deploying your own facilitator infrastructure.

#### What stops a malicious facilitator from stealing funds or lying about settlement?

Every payment payload is **signed by the buyer using TIP-712** and settles **directly on TRON blockchain**. A facilitator that tampers with the transaction will fail signature checks. The facilitator can only transfer:
* The exact amount authorized by the buyer
* To the exact recipient specified in the signed payload

### Pricing & Schemes

#### How should I price my endpoint?

Common patterns include:

* **Flat per-call** (e.g., `1 USDT` per request)
* **Tiered** (`/basic` vs `/pro` endpoints with different prices)
* **Exact scheme**: Pay the exact amount specified for the service

#### What payment schemes does x402-tron support?

Currently x402-tron supports the `exact` scheme, which allows:
* Client authorizes up to a maximum amount
* Server settles the actual amount used (up to the maximum)
* Useful for metered billing, LLM token usage, etc.

### Assets, Networks & Fees

#### Which assets and networks are supported?

| Network | Token | Status |
|---------|-------|--------|
| TRON Mainnet (`tron:mainnet`) | USDT (TRC-20) | **Mainnet** |
| TRON Nile (`tron:nile`) | USDT (TRC-20) | **Testnet** |
| TRON Shasta (`tron:shasta`) | USDT (TRC-20) | **Testnet** |
| TRON Mainnet (`tron:mainnet`) | USDD (TRC-20) | **Mainnet** |
| TRON Nile (`tron:nile`) | USDD (TRC-20) | **Testnet** |

Custom TRC-20 tokens can be added via the TokenRegistry.

#### What are the fees?

* **TRON network fees**: TRX for energy/bandwidth (paid by facilitator)
* **Facilitator fees**: Configurable per facilitator (can be zero)

### Security

#### Do I have to expose my private key to my backend?

No. The recommended pattern is:

1. **Buyers (clients/agents)** sign locally in their runtime (browser, serverless, agent VM).
2. **Sellers** never hold the buyer's key; they only verify signatures.
3. **Facilitators** use their own keys for transaction submission only.

#### How do refunds work?

The `exact` scheme is a _push payment_—irreversible once executed. Refund options:

1. **Business-logic refunds:** Seller sends a new USDT transfer back to the buyer.
2. **Partial settlement:** Server only settles the amount actually used (exact scheme).

### Usage by AI Agents

#### How does an agent know what to pay?

Agents follow the same flow as humans:

1. Make a request.
2. Parse the `PAYMENT-REQUIRED` header.
3. Sign a TIP-712 payment payload via the x402-tron client SDKs.
4. Retry with the `PAYMENT-SIGNATURE` header.

#### Do agents need wallets?

Yes. Programmatic TRON wallets (via TronWeb or the x402-tron signer classes) let agents sign TIP-712 payloads without exposing seed phrases.

### Development

#### How do I run x402-tron locally?

1. Clone the [x402-tron-demo repository](https://github.com/open-aibank/x402-tron-demo)
2. Install dependencies (`pip install -r requirements.txt` for Python)
3. Configure `.env` file with your TRON private keys (see `.env.example`)
4. Start the facilitator: `python facilitator/main.py`
5. Start the server: `python server/main.py`
6. Run the client: `python client/main.py`

#### What testnet should I use?

**TRON Nile** is recommended for testing. It's stable and has good faucet support.

* Nile Faucet: https://nileex.io/join/getJoinPage
* Nile Explorer: https://nile.tronscan.org

### Troubleshooting

#### I keep getting `402 Payment Required`, even after attaching `PAYMENT-SIGNATURE`. Why?

1. TIP-712 signature is invalid (wrong domain or payload fields).
2. Payment amount is less than the required amount.
3. Token allowance is insufficient for the facilitator.
4. Client address has insufficient USDT balance.

Check the `error` field in the server's JSON response for details.

#### My test works on Nile but fails on mainnet—what changed?

* Ensure you set `network: "tron:mainnet"` instead of `"tron:nile"`.
* Confirm your wallet has _mainnet_ USDT.
* Ensure the facilitator wallet has TRX for energy costs.
* Token contract addresses differ between networks.

#### How do I check token allowance?

```python
allowance = await signer.check_allowance(
    token_address="TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
    required_amount=1000000,
    network="tron:nile"
)
print(f"Current allowance: {allowance}")
```

### Still have questions?

• Open a GitHub Issue in the [x402-tron repo](https://github.com/open-aibank/x402-tron)
• Check the [x402-tron-demo](https://github.com/open-aibank/x402-tron-demo) for working examples
