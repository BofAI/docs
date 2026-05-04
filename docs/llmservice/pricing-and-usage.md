# Pricing and Usage

## Credits & Pricing

The platform uses a unified Credits system to measure and settle usage across all AI services.

> **Platform-wide Credits conversion:** `1 USD = 1,000,000 Credits` (`1M` / `1000K` Credits)

**How Credits are calculated:** The number of tokens consumed in each interaction is converted into Credits based on the pricing of the selected model and deducted from your account balance.

**Token usage details:** The response details panel shows a breakdown of token usage, helping you understand where Credits are spent and optimize future usage.

**Model pricing:** Different AI models have different pricing based on their capabilities and compute cost. In general, more capable models consume more Credits. Cache-enabled requests may incur separate cache write and cache read usage. Web search incurs an additional per-use charge. Some models do not support web search and are marked with `-`. See the table below for detailed pricing:

| Model             | Input (Credits/Token) | Cache Write (Credits/Token) | Cache Read (Credits/Token) | Output (Credits/Token) | Web Search (Credits/Use) |
| :---------------- | --------------------: | --------------------------: | -------------------------: | ---------------------: | -----------------------: |
| MiniMax M2.5      |                  0.30 |                        0.30 |                       0.03 |                   1.20 |                        - |
| Kimi K2.5         |                  0.23 |                        0.23 |                       0.07 |                   3.00 |                        - |
| GLM-5             |                  0.30 |                        0.30 |                       0.06 |                   2.55 |                        - |
| DeepSeek V4 Flash |                  0.14 |                        0.14 |                      0.003 |                   0.28 |                        - |
| DeepSeek V4 Pro   |                 0.435 |                       0.435 |                      0.004 |                   0.87 |                        - |
| GPT-5.4           |                  2.50 |                        2.50 |                       0.25 |                  15.00 |                   10,000 |
| GPT-5.5           |                  5.00 |                        5.00 |                       0.50 |                  30.00 |                        - |
| GPT-5.4 Pro       |                 30.00 |                       30.00 |                       3.00 |                 180.00 |                        - |
| GPT-5.2           |                  1.75 |                        1.75 |                      0.175 |                  14.00 |                   10,000 |
| GPT-5.4 Mini      |                  0.75 |                        0.75 |                      0.075 |                   4.50 |                   10,000 |
| GPT-5 Mini        |                  0.25 |                        0.25 |                      0.025 |                   2.00 |                   10,000 |
| GPT-5.4 Nano      |                  0.20 |                        0.20 |                       0.02 |                   1.25 |                   10,000 |
| GPT-5 Nano        |                  0.05 |                        0.05 |                      0.005 |                   0.40 |                        - |
| Claude Opus 4.7   |                  5.00 |                        6.25 |                       0.50 |                  25.00 |                   10,000 |
| Claude Opus 4.6   |                  5.00 |                        6.25 |                       0.50 |                  25.00 |                   10,000 |
| Claude Opus 4.5   |                  5.00 |                        6.25 |                       0.50 |                  25.00 |                   10,000 |
| Claude Sonnet 4.6 |                  3.00 |                        3.75 |                       0.30 |                  15.00 |                   10,000 |
| Claude Sonnet 4.5 |                  3.00 |                        3.75 |                       0.30 |                  15.00 |                   10,000 |
| Claude Haiku 4.5  |                  1.00 |                        1.25 |                       0.10 |                   5.00 |                   10,000 |
| Gemini 3.1 Pro    |                  2.00 |                        2.00 |                       0.20 |                  12.00 |                   14,000 |
| Gemini 3 Flash    |                  0.50 |                        0.50 |                       0.05 |                   3.00 |                   14,000 |

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

The platform uses a prepaid model, so you need to top up your account to obtain Credits. Leveraging the advantages of the TRON network, the platform offers a secure and convenient top-up experience.

Fiat payment is now supported. You can also follow the on-screen instructions to complete a top-up using a credit card or other supported payment methods.

**Top-up process:** On the **Top up** page, the platform guides you through payment using your connected TronLink wallet. You do not need to enter an address manually. Just confirm the transaction in the wallet popup to finish the top-up.

**Supported tokens:** The platform supports several major tokens in the TRON ecosystem, including TRX, USDT, USDD, and USD1.

**Arrival time:** Once the transfer is confirmed on the TRON chain, the system automatically credits the equivalent value to your account. This usually takes a few minutes.

## Billing Records

You can view your complete top-up history under the **History** tab on the **Top up** page.

**Top-up records:** The history list clearly shows the creation time, type, transaction hash, token type, and other details for each top-up.

**Transaction hash lookup:** You can click the transaction hash to verify transaction details and keep the entire process transparent and auditable.
