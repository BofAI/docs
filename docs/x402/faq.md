import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# FAQ

### General

#### What is x402 in one sentence?

x402 revives the long-unused HTTP `402 Payment Required` status code and transforms it into a fully functional on-chain payment layer designed for APIs, websites, and autonomous AI agents. It is currently supported on TRON and BSC, with plans to expand to additional blockchain networks in the future.

#### Is x402 a commercial product?

**No.** x402 is an open-source blockchain implementation of the x402 protocol, released under the MIT license. You are free to use it without purchasing any commercial product.

#### Why replace traditional payment channels or API keys?

Traditional payment systems rely on credit card networks, user accounts, and complex UI flows. x402 removes these dependencies and leverages the speed and low cost of blockchain networks to enable programmatic, HTTP-native payments—particularly well-suited for AI agents.

#### Is x402 only for crypto-native projects?

Not at all. Any Web API or content provider—whether Web3-native or traditional Web2—can integrate x402 to enable low-cost, frictionless blockchain-based payments.

---

### Language & Framework Support

#### What languages and frameworks are supported?

x402 currently provides the following SDKs:

- **Python**: Integrated with FastAPI and Flask  
- **TypeScript**: Supports standard `fetch` clients  

Both SDKs fully implement Client, Server, and Facilitator functionality.

---

### Facilitator

#### Who runs the Facilitator?

Typically, you run your own Facilitator service. x402 is designed for self-hosting, and the built-in Facilitator in the repository is production-ready.

An [officially hosted Facilitator](https://github.com/BofAI/x402-facilitator) service is also available, allowing you to use x402 without deploying infrastructure yourself.

#### How do you prevent a malicious Facilitator from stealing funds or forging settlements?

All payment payloads are **signed by the buyer**, and settlement is executed **directly on-chain**. Any attempt to tamper with transaction data will fail signature verification.

A Facilitator can only:

- Transfer the exact amount authorized by the buyer  
- Send funds to the specific recipient address defined in the signed payload  

---

### Pricing Strategies & Plans

#### How should I price an endpoint?

Common pricing models include:

- **Flat rate per call**: e.g., `1 USDT` per request  
- **Tiered pricing**: Different prices for endpoints like `/basic` and `/pro`  
- **`exact_permit` / `exact` scheme**: Pay the exact amount determined by the service  

#### What payment schemes does x402 support?

x402 supports three payment schemes:

- **`exact_permit`** and **`exact`**: Both allow the client to authorize a **maximum payment amount**, and the server to settle the **actual cost incurred** (up to the authorized limit). This is ideal for **metered billing**, **LLM token usage**, and similar use cases. Since v0.5.9, the wire `payload` of the `exact` scheme conforms to the v2 specification published by the **x402 Foundation (formerly Coinbase)**.
- **`exact_gasfree`** (TRON only): Allows buyers to pay with USDT/USDD without holding TRX for gas. All GasFree API calls are routed through the BANK OF AI proxy — no API keys required on the client side.

#### Can this SDK interoperate with the x402 Foundation (formerly Coinbase) v2 reference implementation?

**Yes.** Since v0.5.9, the `exact` payment scheme (EVM and TRON) conforms to the v2 specification published by the **x402 Foundation (formerly Coinbase)**:

- A stock v2 client can directly access this SDK's `exact` protected endpoints with no project-specific adapter layer.
- This SDK's client can pay v2-compatible servers directly.
- In the V2 structure, transfer authorization data is carried in the `payload.authorization` field (a structured object). As a migration fallback, the client also populates `extensions.transferAuthorization` so that servers still running older versions can parse the payload.
- When using the `exact` scheme on BSC, the advertised asset **must** natively implement ERC-3009 `transferWithAuthorization` — for example, **DHLU** on BSC testnet. BSC USDT is a plain ERC-20 and natively supports neither ERC-3009 nor EIP-2612 permit — if you need to accept USDT, use the `exact_permit` scheme instead (which is backed by this project's `PaymentPermit` proxy contract and works with any ERC-20).
- The `examples/bsc-testnet-smoke/` directory contains smoke tests for bidirectional interoperability (Coinbase official client → BANK OF AI server, BANK OF AI client → Coinbase official server) that you can use as a debugging and integration reference.

---

### Assets, Networks & Fees

#### What assets and networks are supported?

| Network                     | Token         | Status      |
| --------------------------- | ------------- | ----------- |
| TRON Mainnet (`tron:mainnet`) | USDT (TRC-20) | **Mainnet** |
| TRON Nile (`tron:nile`)       | USDT (TRC-20) | **Testnet** |
| TRON Shasta (`tron:shasta`)   | USDT (TRC-20) | **Testnet** |
| TRON Mainnet (`tron:mainnet`) | USDD (TRC-20) | **Mainnet** |
| TRON Nile (`tron:nile`)       | USDD (TRC-20) | **Testnet** |
| BSC Mainnet (`eip155:56`)     | USDT (BEP-20) | **Mainnet** |
| BSC Mainnet (`eip155:56`)     | USDC (BEP-20) | **Mainnet** |
| BSC Mainnet (`eip155:56`)     | EPS (BEP-20)  | **Mainnet** |
| BSC Testnet (`eip155:97`)     | USDT (BEP-20) | **Testnet** |
| BSC Testnet (`eip155:97`)     | USDC (BEP-20) | **Testnet** |
| BSC Testnet (`eip155:97`)     | DHLU (BEP-20, for `exact` interop tests) | **Testnet** |

Custom TRC-20 and BEP-20 tokens can also be added via the TokenRegistry.

#### What fees are involved?

- **Network Fees**:
  - TRON: TRX for Energy and Bandwidth (paid by the Facilitator)
  - BSC: BNB for gas (paid by the Facilitator)
- **Facilitator Service Fee**: Configurable by each Facilitator (can be set to zero)

---

### Security

#### Do I need to expose my private key to the backend?

**No.** Recommended security model:

1. **Buyer (client/agent)** signs locally (browser, serverless function, or agent VM).  
2. **Seller** verifies signatures without accessing private keys.  
3. **Facilitator** uses its own key to submit transactions on-chain.  

#### How does refunds work?

The `exact_permit` / `exact` scheme uses a **push payment** model—once executed on-chain, it is irreversible.

Refund options:

1. **Business-layer refund**: Seller manually sends a new USDT transfer back to the buyer.  
2. **Preventative settlement**: Server settles only the actual usage amount under the payment scheme.  

---

### AI Agent Integration

#### How does an agent know how much to pay?

The flow mirrors a human user:

1. Send initial request.  
2. Parse `PAYMENT-REQUIRED` header in the response.  
3. Sign the payment payload using the x402 client SDK.  
4. Retry request with `PAYMENT-SIGNATURE` header attached.  

#### Does an agent need a wallet?

**Yes.** A programmatic wallet (via x402 signer classes) enables signing payment payloads without exposing mnemonic phrases.

---

### Development Guide

#### How do I run x402 locally?

1. **Clone the repository:** Download the [x402-demo repository](https://github.com/BofAI/x402-demo).  
2. **Install dependencies:** Run `pip install -r requirements.txt`.  
3. **Configure environment:** Copy `.env.example` to `.env` and configure your private keys.  
4. **Start Facilitator:** `python facilitator/main.py`  
5. **Start Server:** `python server/main.py`  
6. **Run Client:** `python client/main.py`  

#### Which testnet is recommended?

**TRON Nile** is recommended for TRON testing:

- Faucet: https://nileex.io/join/getJoinPage  
- Explorer: https://nile.tronscan.org  

**BSC Testnet** is recommended for BSC testing:

- Faucet: https://www.bnbchain.org/en/testnet-faucet  
- Explorer: https://testnet.bscscan.com  

---

### Troubleshooting

#### Why do I still receive `402 Payment Required` even after sending `PAYMENT-SIGNATURE`?

Common causes:

1. Invalid signature (incorrect domain or payload).  
2. Insufficient payment amount.  
3. Insufficient token allowance granted to Facilitator.  
4. Insufficient wallet balance.  

Check the `error` field in the server’s JSON response for detailed diagnostics.

#### It works on Nile but fails on Mainnet — why?

- Network configuration not updated  
- Using testnet tokens instead of real mainnet tokens  
- Facilitator lacks sufficient gas tokens  
- Token contract address differs between networks  

### Still Have Questions?

• Submit a GitHub Issue in the [x402 repository](https://github.com/BofAI/x402)  
• Refer to [x402-demo](https://github.com/BofAI/x402-demo) for a complete, runnable example  
