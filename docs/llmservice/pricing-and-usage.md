# Pricing and Usage

## Credits & Pricing

The platform uses a unified Credits system to measure and settle usage across all AI services.

> **Platform-wide Credits conversion:** `1 USD = 1,000,000 Credits` (`1M` / `1000K` Credits)

**How Credits are calculated:** The number of tokens consumed in each interaction is converted into Credits based on the pricing of the selected model and deducted from your account balance.

**Token usage details:** The response details panel shows a breakdown of token usage, helping you understand where Credits are spent and optimize future usage.

**Model pricing:** Different AI models have different pricing based on their capabilities and compute cost. In general, more capable models consume more Credits. Cache-enabled requests may incur separate cache write and cache read usage. Web search incurs an additional per-use charge. Some models do not support web search and are marked with `-`. See the table below for detailed pricing:

| Model             | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) |
| :---------------- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: |
| MiniMax M3        |                  0.30 |                        0.30 |                       0.06 |                   1.20 |                        - |
| MiniMax M2.7      |                  0.30 |                       0.375 |                       0.06 |                   1.20 |                        - |
| Kimi K2.5         |                  0.59 |                        0.59 |                      0.177 |                   3.00 |                        - |
| Qwen3.6-27B       |                  0.19 |                        0.19 |                      0.019 |                   2.99 |                        - |
| GLM-5.2           |                  1.40 |                        1.40 |                       0.28 |                   4.40 |                        - |
| GLM-5.1           |                  1.40 |                        1.40 |                       0.26 |                   4.40 |                        - |
| DeepSeek V3.2     |                  0.29 |                        0.29 |                      0.145 |                   0.44 |                        - |
| DeepSeek V4 Flash |                  0.28 |                        0.28 |                     0.0056 |                   0.56 |                        - |
| DeepSeek V4 Pro   |                  0.87 |                        0.87 |                     0.0087 |                   1.74 |                        - |
| GPT-5.4           |                  2.50 |                        2.50 |                       0.25 |                  15.00 |                   10,000 |
| GPT-5.5           |                  5.00 |                        5.00 |                       0.50 |                  30.00 |                   10,000 |
| GPT-5.5 Instant   |                  5.00 |                        5.00 |                       0.50 |                  30.00 |                   10,000 |
| GPT-5.4 Pro       |                 30.00 |                       30.00 |                       3.00 |                 180.00 |                        - |
| GPT-5.2           |                  1.75 |                        1.75 |                      0.175 |                  14.00 |                   10,000 |
| GPT-5.4 Mini      |                  0.75 |                        0.75 |                      0.075 |                   4.50 |                   10,000 |
| GPT-5 Mini        |                  0.25 |                        0.25 |                      0.025 |                   2.00 |                   10,000 |
| GPT-5.4 Nano      |                  0.20 |                        0.20 |                       0.02 |                   1.25 |                   10,000 |
| GPT-5 Nano        |                  0.05 |                        0.05 |                      0.005 |                   0.40 |                        - |
| Claude Fable 5    |                 10.00 |                       12.50 |                       1.00 |                  50.00 |                   10,000 |
| Claude Opus 4.8   |                  5.00 |                        6.25 |                       0.50 |                  25.00 |                   10,000 |
| Claude Opus 4.7   |                  5.00 |                        6.25 |                       0.50 |                  25.00 |                   10,000 |
| Claude Opus 4.6   |                  5.00 |                        6.25 |                       0.50 |                  25.00 |                   10,000 |
| Claude Opus 4.5   |                  5.00 |                        6.25 |                       0.50 |                  25.00 |                   10,000 |
| Claude Sonnet 5   |                  2.00 |                        2.50 |                       0.20 |                  10.00 |                   10,000 |
| Claude Sonnet 4.6 |                  3.00 |                        3.75 |                       0.30 |                  15.00 |                   10,000 |
| Claude Sonnet 4.5 |                  3.00 |                        3.75 |                       0.30 |                  15.00 |                   10,000 |
| Claude Haiku 4.5  |                  1.00 |                        1.25 |                       0.10 |                   5.00 |                   10,000 |
| Gemini 3.1 Pro    |                  2.00 |                        2.00 |                       0.20 |                  12.00 |                   14,000 |
| Gemini 3.5 Flash  |                  1.50 |                        1.50 |                       0.15 |                   9.00 |                   14,000 |
| Gemini 3 Flash    |                  0.50 |                        0.50 |                       0.05 |                   3.00 |                   14,000 |

:::caution Main table scope
The main pricing table shows the currently effective standard reference price for each model. The `Cache Write` column represents the billing rate when cache writing occurs; it does not imply a unified cache TTL across all models. Cache behavior, retention time, and extended caching options may vary by model provider. If a model has special caching rules, 1-hour cache write pricing, or time-based pricing, please refer to the corresponding model detail page.
:::

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, and account benefits are subject to the platform display and final billing records.
:::

### Cache Pricing Notes

- **Cache Write:** The cost when tokens are first written into the prompt cache. Most providers charge no premium and use the same rate as standard input pricing. Claude models apply a 25% premium on cache writes.
- **Cache Read:** The discounted cost when cached tokens are reused in subsequent requests.
- **Example with Caching:** If you use Claude Sonnet 4.6 with 1000 tokens cached:
  - First request (cache write): `1000 × 3.75 = 3,750 credits`
  - Subsequent requests (cache read): `1000 × 0.30 = 300 credits` — a 90% savings compared to standard input pricing
- **Example without caching:** If you use GPT-5.2 to ask a question (10 input tokens) and the AI responds with an answer (50 output tokens), the entire dialogue consumes 717.5 credits (calculated as: `10 × 1.75 + 50 × 14`). You can check the specific Credits usage by hovering over the model name in the bottom right corner.

## Subscriptions & Charges

The platform supports two usage models: topping up Credits and subscription plans.

Top-up Credits are suitable for flexible, on-demand usage. Subscription plans are better suited for frequent users and include a fixed allowance within each billing period. When your subscription allowance is exhausted, the system will continue consuming Credits from your account balance.

:::caution Free bonus Credits validity
Free bonus Credits are valid for 30 days from the date they are issued, including Credits granted for new-user registration and Credits granted through top-up promotions. Any unused portion automatically expires after the validity period.
:::

### Subscription Plans

Two subscription plans are currently available:

#### Plan Pro

- Price: $200/month
- Designed for individual developers and frequent AI users
- Approximately 50-500 messages per 12 hours
- Full-series model access
- Includes curated BAIclaw skills such as Justin Sun Perspective Skill, HTX/Binance, Web3, and more
- A valid invite code is required for purchase

#### Plan Max

- Price: $2,000/month
- Designed for ambassadors and heavy users
- Approximately 500-5,000 messages per 12 hours
- Higher subscription allowance and priority access to beta models
- Dedicated support
- Includes curated BAIclaw skills such as Justin Sun Perspective Skill, HTX/Binance, Web3, and more
- Promotions can earn Credits rewards

### Subscription Usage & Charge Order

Subscription usage is measured within a rolling 12-hour window, and capacity is gradually released over time. Under lower system load, more subscription capacity remains available.

When subscription capacity is fully used, the system automatically begins consuming top-up Credits from your account balance. If both your subscription allowance and Credits are insufficient, the related features will no longer be available until capacity or balance is restored.

### Invite Codes & Upgrades

You must verify a valid invite code before purchasing Plan Pro. If the invite code is invalid or expired, the purchase cannot proceed.

Plan Pro can be upgraded to Plan Max. When an upgrade occurs, the remaining Plan Pro time is converted into Plan Max time according to the platform's upgrade rules.

You can also view your subscription history on the related pages, including plan type, payment method, amount, validity period, and current status.

## Usage Information

You can use the **Usage** page in the left navigation to review detailed consumption data, so every charge remains transparent and traceable.

**Usage overview:** The top of the page shows your Credits balance and total monthly usage, giving you a clear view of your current account status.

**Monthly usage chart:** The chart helps you quickly track usage trends over the past year for cost analysis and budget planning.

**Usage details:** Each record in the **Usage Detail** table corresponds to a specific AI interaction. The table includes creation time, type, model, token usage, Credits consumed, and response time for detailed cost visibility.

## Top Up

The platform uses a prepaid model, so you need to top up your account to obtain Credits. The platform offers a secure and convenient top-up experience across fiat payment channels and supported blockchain networks.

The platform now supports both fiat and on-chain top-up flows end to end. You can follow the on-screen instructions to top up with Stripe-supported card payments, WeChat Pay, Alipay, UnionPay, and other available fiat payment methods, or use supported blockchain networks and tokens for on-chain payment.

:::caution Security reminder
Before topping up, make sure the address bar shows an official B.AI access URL, such as `https://chat.b.ai/chat`, `https://chat.ainft.com/chat`, or `https://chat.bankofai.io/chat`. Do not continue from unfamiliar links, search ads, or pages with a different domain.

Complete fund-related operations only in a trusted network environment. Avoid topping up on public or shared Wi-Fi, and always review the payment details shown by your wallet before confirming.
:::

**Top-up process:** On the **Top up** page, the platform guides you through the selected payment method. You can use fiat payment methods such as Stripe-supported card payments, WeChat Pay, Alipay, and UnionPay, or choose supported blockchain networks and tokens for on-chain payment. Follow the on-screen instructions to confirm the payment, and the system will automatically process the top-up after payment succeeds.

**Supported payment methods:** The platform supports multiple fiat payment channels and mainstream tokens across supported blockchain networks. Available payment channels, networks, and token types may vary by region and availability, so please refer to the real-time options shown on the **Top up** page.

**Arrival time:** After payment is completed and confirmed, the system automatically credits the corresponding value to your account. Fiat payments are usually processed quickly; on-chain payments need to wait for confirmation on the selected network and usually take a few minutes. Actual arrival time may vary depending on network congestion and payment channel processing speed.

## Billing Records

You can view your complete top-up history under the **History** tab on the **Top up** page.

**Top-up records:** The history list clearly shows the creation time, type, transaction hash, token type, and other details for each top-up.

**Transaction hash lookup:** You can click the transaction hash to verify transaction details and keep the entire process transparent and auditable.
