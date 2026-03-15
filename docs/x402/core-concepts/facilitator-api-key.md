# Facilitator API Key

## What Is a Facilitator API Key?

When using the **official hosted Facilitator service**, you need to apply for an API Key to identify your account and unlock higher request rate limits.

Each x402 payment requires one call to the Facilitator's `/settle` endpoint. Without an API Key, your service can process at most 1 payment per minute; with an API Key, the limit rises to 1,000 per minute — more than enough for normal production traffic.

| Status | Rate Limit |
|--------|-----------|
| No API Key configured | 1 request / minute |
| API Key configured | 1,000 requests / minute |

For production environments, **configuring an API Key is strongly recommended**. Without it, the extremely low rate limit will directly impact your service availability.

---

:::warning
## Security Notice

- **Treat your API Key like a password** — anyone who has it can use the Facilitator on your behalf.
- **Never commit it to version control** — make sure `.env` is listed in your `.gitignore` to avoid pushing secrets to public platforms like GitHub.
- **One key per account** — if you suspect your key is compromised, log in to the admin portal, delete the old key, and create a new one. The old key is invalidated immediately.
- **Wallet authorization is not a transfer** — the wallet signature during login is for identity verification only and does not move any funds.
:::

---

## Creating an API Key

### Prerequisites

You need a supported blockchain wallet (we recommend **TronLink**) to authenticate. Your API Key is bound to your on-chain identity, and each account can create a maximum of **1** API Key.

### Steps

**Step 1: Open the Login Page**

Visit [https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io) in your browser to access the Facilitator admin portal.

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_1.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>


**Step 2: Click TronLink to Connect Your Wallet**

The page will prompt you to select a wallet. Click **TronLink**. What happens next depends on your wallet state:

- **Wallet is locked**: TronLink will ask for your password first. After unlocking, the wallet selection dialog appears again — click **TronLink** once more, and the authorization window will pop up.

    <div style={{ textAlign: 'left' }}>
    <img
        src={require('./images/facilitator_2.jpg').default}
        alt="RangeOrder1"
        width="40%"
        height="30%"
    />
    </div>


- **Wallet is already unlocked**: The authorization window pops up directly after clicking TronLink.

**Step 3: Confirm Authorization**

In the authorization window, confirm that you want to authorize your wallet for the Facilitator service.

> **Note**: This authorization is for identity verification only — no funds will be deducted or transferred from your wallet.

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_3.jpg').default}
    alt="RangeOrder1"
    width="40%"
    height="30%"
  />
</div>


**Step 4: Access the Dashboard**

After successful authorization, you will be automatically redirected to the Dashboard where you can see your account overview and API Key management.

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_4.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>



**Step 5: Create an API Key**

Click the **"Create API Key"** button. A confirmation dialog will appear indicating the key was created successfully. Click **"Confirm"** in the dialog to proceed.

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_5.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>


> **Security Tip**: Never share your API Key with anyone to avoid potential asset loss.

**Step 6: View, Copy, and Manage Your API Key**

After clicking **"Confirm"**, you will return to the Dashboard. Your API Key is hidden by default. You can manage it as follows:

- **Show / Hide**: Click the **View** button next to your API Key to toggle between showing and hiding the full key value. You can copy the key in either state — it does not need to be visible to copy.
- **Delete**: Click the **Delete** button on the far right to remove the current API Key. Once deleted, the old key is immediately invalidated and you can create a new one.

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_6.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>


> **Tip**: Keep your key hidden when not in use to avoid accidental exposure.

---

## Configuring Your API Key

Once you have your API Key, find the `.env` file in your x402 project root directory and add the following line:

```bash
FACILITATOR_API_KEY=<your_api_key>
```

> If you don't have a `.env` file yet, create one from the template: `cp .env.sample .env`. For other configuration items (wallet address, private key, etc.), refer to the [Quickstart for Sellers](../getting-started/quickstart-for-sellers.md).

---

## FAQ

**Can I use the service without an API Key?**

Yes, but your service will only be able to process 1 payment per minute — not viable for production. We strongly recommend configuring one.

**Does the API Key expire?**

API Keys do not expire automatically. However, if you delete and recreate one, the old key is immediately invalidated.

**Can I use the same API Key across multiple projects?**

Yes. The same key can be reused across multiple service instances. Each project independently gets up to 1,000 requests per minute — they do not affect each other.

**How do I replace my API Key?**

Log in to the admin portal and click **Delete** on the Dashboard to remove your current key, then click **"Create API Key"** to generate a new one. The old key is invalidated immediately upon deletion — make sure to update the new key in all your active projects before deleting the old one to avoid any service interruption.

**Does the Facilitator hold my funds?**

No. The Facilitator only handles verification and on-chain operations. Funds flow directly from the buyer to your receiving address without passing through any custodial account.

---

## Next Steps

- [Quickstart for Sellers](../getting-started/quickstart-for-sellers.md) — Complete server-side integration walkthrough
- [Facilitator Overview](./facilitator.md) — How the Facilitator works under the hood
- [Network and Token Support](./network-and-token-support.md) — Supported blockchain networks and tokens
