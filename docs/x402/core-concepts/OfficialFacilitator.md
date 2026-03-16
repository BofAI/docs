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

To call the Official Facilitator, you only need to configure the official **Facilitator service address** https://facilitator.bankofai.io on the server-side.

> ⚠️ **Note**: This address is a server-side endpoint for API calls, not a webpage for browser access. Opening it directly in a browser will not display any content.

Official Facilitator supports **two calling modes**.

| Mode | Rate Limit | Description |
|-----|-----|-----|
| **Anonymous Mode** | 1 time / minute | No API Key required, suitable for local development and functional testing |
| **API Key Mode** | 1000 times / minute | API Key required, suitable for production environments and high-frequency payment requests |

The calling methods for both modes are exactly the same, but they differ in **identity recognition and interface rate limiting strategies**.

---

### Anonymous Calling Mode

If the request **does not carry an API Key**, the Facilitator will treat the request as an **anonymous request**.

In anonymous mode:

- The `/settle` interface will enable **strict rate limiting**
- **Maximum 1 call per minute**

This mode is mainly used for:

- Local development
- SDK debugging
- Feature verification
- Low-frequency testing

Anonymous call example:

```bash
curl -X POST https://facilitator.bankofai.io/settle \
  -H "Content-Type: application/json" \
  -d \'{ ... }\'
```

Although anonymous mode can call all core interfaces normally, due to the very low call frequency of `/settle`, it is **not suitable for production environments**.

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
  -d \'{ ... }\'
```

When the Facilitator recognizes the API Key:

- The call rate limit for the `/settle` interface will be increased to **1000 times / minute**

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
| POST | `/fee/quote` | Get estimated fees for payment requirements |
| POST | `/verify` | Verify payment payload validity |
| POST | `/settle` | Perform on-chain settlement (**rate-limited**)|
| GET | `/payments/{payment_id}` | Query payment records by payment ID |
| GET | `/payments/tx/{tx_hash}` | Query payment records by transaction hash |

> Rate limiting only applies to the `/settle` interface; other interfaces are not affected by rate limiting.

### Payment Record Query

Both `/payments/{payment_id}` and `/payments/tx/{tx_hash}` interfaces return a JSON array sorted in reverse chronological order. Each record contains:

- `paymentId` — Unique payment identifier (may be empty)
- `txHash` — On-chain transaction hash
- `status` — `"success"` or `"failed"`
- `createdAt` — Timestamp

> When an API Key is provided, these two interfaces only return payment records associated with your account; you will not see data from other sellers.

---

## Frequently Asked Questions

**Q: Can it run normally without configuring an API Key?**

Yes, it can run, but the `/settle` interface can only be called once per IP per minute. This is only suitable for testing; any real traffic must be configured with an API Key.

**Q: Does the API Key expire?**

Currently, API Keys do not actively expire, but if you actively delete and recreate one, the old Key will become invalid immediately.

**Q: Can I use the same API Key for multiple projects?**

Yes, the same API Key can be reused across multiple service instances. Each Key independently enjoys a frequency limit of 1000 times/minute, regardless of how many servers are using it.

**Q: I want to change my API Key, how do I do it?**

After logging in to the admin backend, click **Delete** on the Dashboard to delete the current Key, then click **"Create API Key"** again to generate a new Key. The old Key will become invalid immediately after deletion. Please ensure that you have updated the new Key in all active projects before deleting to avoid service interruption.

**Q: Will Facilitator hold my funds?**

No. Facilitator only performs verification and on-chain operations. Funds flow directly from the buyer to your receiving address, without passing through any escrow accounts.

---

## Next Steps

- [Seller Quick Start](../getting-started/quickstart-for-sellers.md) — Complete server-side integration process
- [Facilitator Overview](./facilitator.md) — In-depth understanding of Facilitator's working mechanism
- [Supported Networks and Tokens](./network-and-token-support.md) — View currently supported blockchain networks
