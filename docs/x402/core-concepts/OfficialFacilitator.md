# Official Facilitator

## What is an Official Facilitator?

An official **Facilitator** is a hosted settlement service provided by **BANK OF AI** for handling **verification and on-chain settlement in x402 payment processes**. In traditional architectures, if developers want to support on-chain payments, they typically need to complete the following tasks themselves:

- Deploy or maintain blockchain nodes
- Implement payment verification logic
- Build on-chain settlement processes
- Manage Energy / Gas fees
- Handle transaction status and retry failures

These tasks are not only complex but also significantly increase system operation and maintenance costs.

**The core role of the Official Facilitator is to uniformly host these complex on-chain processing flows.** Developers only need to call the Facilitator API to complete payment verification and settlement, without directly operating the blockchain infrastructure.

### Key Advantages of Using the Official Facilitator

**1️⃣ No need to deploy blockchain infrastructure**

Developers do not need to run nodes, synchronize chain data, or maintain blockchain services. All on-chain interactions are handled by the Official Facilitator, greatly reducing development and operation complexity.

**2️⃣ Official bears on-chain Energy costs**

All on-chain settlements completed through the Official Facilitator will have their **Energy fees borne by the official**. This means that developers do not need to separately prepare energy or transaction fee accounts for on-chain resource consumption when integrating x402 payments.

**3️⃣ Extremely simple integration architecture**

Developers only need to configure the Facilitator address on the server-side to integrate the payment settlement process. There is no need to write complex on-chain interaction code, significantly reducing development time.

**4️⃣ Official maintenance and continuous upgrades**

Facilitator is continuously maintained and upgraded by the official, including:

- Network upgrade adaptation
- Security policy updates
- Transaction processing optimization

Developers do not need to worry about system maintenance issues caused by underlying blockchain changes.

**5️⃣ Stable and reliable payment processing capabilities**

Official Facilitator can stably handle payment requests in a production environment, avoiding security or performance issues that developers might encounter when implementing it themselves.

> In short: **Facilitator is like an "on-chain payment settlement gateway"**. Developers only need to call the API to complete the entire on-chain payment process.

---

## How to Call the Official Facilitator?

To call the Official Facilitator, you only need to configure the official **Facilitator service address** `https://facilitator.bankofai.io` on the server-side.

> ⚠️ **Note**: This address is a server-side endpoint for API calls, not a webpage for browser access. Opening it directly in a browser will not display any content.

Official Facilitator supports **two calling modes**.

| Mode | Rate Limit | Description |
|-----|-----|-----|
| **Anonymous Mode** | Official service: 10 requests per IP per minute, counted separately for `/verify` and `/settle`. This is also the self-hosted default when `rate_limit.anonymous` is omitted (configurable). | No API Key required, suitable for local development and functional testing |
| **API Key Mode** | Official service: 1000 requests per API Key per minute, counted separately for `/verify` and `/settle`. Self-hosted deployments use the same default when `rate_limit.authenticated` is omitted (configurable). | API Key required, suitable for production environments and high-frequency payment requests |

The calling methods for both modes are exactly the same, but they differ in **identity recognition and interface rate limiting strategies**.

> **Counters are per instance.** The official production config uses `rate_limit.store: memory`, so each facilitator instance keeps its own counters; requests that land on different instances are not counted against one shared total. Self-hosted deployments default to the same in-memory store — set `rate_limit.store: redis` (with `redis_url`) to share counters across replicas.

---

### Anonymous Calling Mode

If the request **does not carry an API Key**, the Facilitator will treat the request as an **anonymous request**.

In anonymous mode:

- The `/verify` and `/settle` interfaces are **rate-limited**, each with its own counter
- The **official service allows 10 requests per IP per minute** on each of them — the same as the self-hosted default when `rate_limit.anonymous` is omitted; this limit is configurable.

This mode is mainly used for:

- Local development
- SDK debugging
- Feature verification
- Low-frequency testing

Anonymous call example:

```bash
curl -X POST https://facilitator.bankofai.io/settle \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

Although anonymous mode can call all core interfaces normally, due to the low per-IP limit on `/verify` and `/settle`, it is **not suitable for production environments**.

If your application needs to handle real user payments or higher frequency requests, it is recommended to use **API Key calling mode**.

---

### API Key Calling Mode

In API Key mode, the request needs to carry `X-API-KEY` in the HTTP Header:

```http
X-API-KEY: your_api_key_here
```

Call example:

```bash
curl -X POST https://facilitator.bankofai.io/settle \
  -H "X-API-KEY: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

When the Facilitator recognizes the API Key:

- On the official service, the `/verify` and `/settle` limits each increase to **1000 requests per API Key per minute**

This means your service can support **production-level payment throughput**.

Therefore, it is **strongly recommended to apply for and configure an API Key** in a real business environment.

---

## Apply for an API Key

To unlock production-level throughput, please apply for a free API Key in the admin backend: [https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io)

This is an admin panel accessible via a browser, where you can register an account (via TronLink wallet), create and manage API Keys. The admin backend is unrelated to payment processing and is only used for API Key management.

---

:::warning
## Security Considerations

- **API Key leakage is equivalent to identity leakage**: Anyone holding your API Key can consume your rate limit quota in your name. Please protect it like a password.
- **Do not commit to code repositories**: Ensure that the `.env` file has been added to `.gitignore` to avoid uploading keys to public platforms like GitHub.
- **1 Key per account limit**: If you believe your Key has been leaked, please log in to the admin backend to delete the old Key and recreate a new one. The old Key will become invalid immediately.
- **Signature authorization does not equal transfer**: The wallet signature during login is only used for identity verification and will not trigger any asset transfers.
:::

---

### Steps to Apply for an API Key

#### Prerequisites

You need a supported blockchain wallet (TronLink wallet is recommended) for login verification. The API Key is bound to your on-chain identity, and each account can create a maximum of **1** API Key.

#### Operating Steps

**Step 1: Enter the login page**

Open your browser and visit [https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io) to enter the Facilitator admin backend login page.

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_1.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>

**Step 2: Click TronLink to connect wallet**

The page will prompt you to select a wallet, click **TronLink**. Depending on your wallet status, the subsequent process will vary slightly:

- **Wallet not logged in**: TronLink will first pop up a password input box. After entering the password to unlock, the wallet selection pop-up will appear again. Continue to click **TronLink**, and then an authorization confirmation window will pop up.

    <div style={{ textAlign: 'left' }}>
    <img
        src={require('./images/facilitator_2.jpg').default}
        alt="RangeOrder1"
        width="40%"
        height="30%"
    />
    </div>

- **Wallet logged in**: After clicking TronLink, the authorization confirmation window will pop up directly.

**Step 3: Confirm authorization**

In the pop-up authorization window, confirm to authorize the wallet to the Facilitator service.

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_3.jpg').default}
    alt="RangeOrder1"
    width="40%"
    height="30%"
  />
</div>

> **Note**: This authorization is only for identity verification and will not deduct funds from your wallet or transfer any assets.

**Step 4: Enter Dashboard**

After successful authorization, you will automatically jump to the Dashboard interface. Here you can see the account overview and API Key management entry.

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_4.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>

**Step 5: Create API Key**

Click the **"Create API Key"** button on the page. The system will pop up a confirmation dialog for successful creation. Click **"Confirm"** in the dialog to continue.

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_5.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>

> **Security Tip**: Do not disclose your API Key to anyone.

**Step 6: View, Copy and Manage API Key**

After clicking **"Confirm"**, you will return to the Dashboard page, and the API Key will be displayed in a hidden state by default. You can manage it in the following ways:

- **View / Hide**: Click the **View** button to the right of the API Key to switch between plain text display and hidden state. You can copy the Key directly whether it is currently displayed or hidden.
- **Delete**: Click the **Delete** button on the far right to delete the current API Key. After deletion, the old Key will become invalid immediately, and you can recreate a new Key.

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_6.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>

> **Security Tip**: It is recommended to keep the Key hidden when not in use to avoid unintentional exposure in front of others.

---

## API Endpoints

| Method | Path | Description |
|------|------|------|
| GET | `/health` | Service health check |
| GET | `/supported` | Query supported payment capabilities and configurations |
| POST | `/verify` | Verify payment payload validity (**rate-limited**) |
| POST | `/settle` | Perform on-chain settlement (**rate-limited**)|
| GET | `/payments/tx/{tx_hash}` | Query payment records by settlement transaction hash |
| GET | `/payments?network=&nonce=[&asset=&payer=]` | Query payment records by the on-chain authorization identity |
| GET | `/payments` | Authenticated seller's settlement feed (`?limit=&offset=`; `limit` defaults to `50` and is capped at `200` — a larger value is silently reduced to `200`, not rejected; `offset` defaults to `0`) |
| GET | `/sponsoring/ready` | TRON approval resource sponsoring readiness (`?network=` checks one network); HTTP `200` when ready, `503` otherwise (booting, recovering, degraded, or sponsoring disabled) |

> There is **no** `/fee/quote` endpoint, and the schemes carry no facilitator fee. Rate limiting applies to `/verify` and `/settle` (separate counters); other interfaces are not rate-limited. A request over the limit receives HTTP `429` with `{"error":"rate_limit_exceeded"}` and a `Retry-After` header.

### Networks and schemes the official service settles

| Network | Environment |
|---|---|
| `tron:728126428` (TRON Mainnet) · `tron:3448148188` (Nile) | mainnet · testnet |
| `eip155:56` (BSC) · `eip155:97` (BSC testnet) | mainnet · testnet |
| `eip155:8453` (Base) · `eip155:84532` (Base Sepolia) | mainnet · testnet |

Each of these networks registers `exact`, `upto`, and `batch-settlement`; TRON additionally registers `exact_gasfree` where the service holds GasFree relayer credentials (TRON Mainnet and Nile). Query `/supported` for the authoritative list of the deployment you are pointing at. TRON networks are reported with decimal CAIP-2 identifiers; the older hex forms (`tron:0x2b6653dc`, `tron:0xcd8690dc`) are still accepted as input aliases.

`/supported` lists two extensions:

- `erc20ApprovalGasSponsoring` — registered for every EVM network the service serves (BSC and Base).
- `trc20ApprovalResourceSponsoring` — TRON approval resource sponsoring is enabled **on Nile only**, for the configured asset (Nile USDT), and **requires an API Key**. An anonymous request that carries the extension is rejected with `sponsor_auth_required`; an authenticated request for TRON Mainnet is rejected with `sponsor_network_disabled`. `GET /sponsoring/ready` reports whether the sponsoring runtime is ready.

Either sponsorship only kicks in when the resource server declares the extension on the route.

### Payment Record Query

The `/payments/tx/{tx_hash}` and `/payments?network=&nonce=[&asset=&payer=]` interfaces return a JSON array sorted in reverse chronological order. Records are keyed on the on-chain authorization identity rather than a client-supplied payment ID. Each record contains:

- `network` — CAIP-2 network identifier
- `scheme` — Payment scheme (e.g. `exact`)
- `asset` — Token contract address
- `payer` — Payer address
- `nonce` — Authorization nonce
- `amount` — Settled amount (atomic units)
- `txHash` — On-chain transaction hash
- `status` — `"success"` or `"failed"`
- `errorReason` — Failure reason (when applicable)
- `createdAt` — Timestamp

> When an API Key is provided, these interfaces only return payment records associated with your account; you will not see data from other sellers.

:::danger Without an API Key
The `tx_hash` and `network` + `nonce` lookups add **no seller filter** when the request is anonymous, so the response may include records bound to a seller — anyone holding an exact identifier can resolve the corresponding record. The `/payments` list endpoint still requires authentication, so there is no unauthenticated listing endpoint; but these lookups are not rate-limited either (the official service's 10-requests-per-IP-per-minute anonymous limit covers `/verify` and `/settle` only), and settlement tx hashes are public on-chain data. Treat settlement metadata as effectively public rather than seller-private.

**This describes the current implementation, not a recommended access-control policy.** Send your API Key to keep queries scoped to your own account, and never treat a settlement tx hash or its nonce as a secret.
:::

---

## Frequently Asked Questions

**Q: Can it run normally without configuring an API Key?**

Yes, it can run, but the official service limits `/verify` and `/settle` to 10 requests per IP per minute each — the same as the self-hosted default when `rate_limit.anonymous` is omitted, which is configurable. Anonymous access is only suitable for testing; any real traffic must be configured with an API Key.

**Q: Does the API Key expire?**

Currently, API Keys do not actively expire, but if you actively delete and recreate one, the old Key will become invalid immediately.

**Q: Can I use the same API Key for multiple projects?**

Yes, the same API Key can be reused across multiple service instances. On the official service the limit is keyed by API Key, not by calling server: your instances draw on the same 1000 `/settle` requests per minute (and a separate 1000 for `/verify`) rather than each getting its own quota. Those counters are kept per facilitator instance (`rate_limit.store: memory`), so the limit applies within each facilitator instance, not as one global total.

**Q: I want to change my API Key, how do I do it?**

After logging in to the admin backend, click **Delete** on the Dashboard to delete the current Key, then click **"Create API Key"** again to generate a new Key. The old Key will become invalid immediately after deletion. Please ensure that you have updated the new Key in all active projects before deleting to avoid service interruption.

**Q: Will Facilitator hold my funds?**

No. Facilitator only performs verification and on-chain operations. Funds flow directly from the buyer to your receiving address, without passing through any escrow accounts.

---

## Next Steps

- [Seller Quick Start](../getting-started/quickstart-for-sellers.md) — Complete server-side integration process
- [Facilitator Overview](./facilitator.md) — In-depth understanding of Facilitator's working mechanism
- [Supported Networks and Tokens](./network-and-token-support.md) — View currently supported blockchain networks
