import ActivityCard from '@site/src/components/ActivityCard';

# Promotions and Pricing Updates

This page summarizes active and announced upcoming limited-time offers and pricing updates. The [Pricing and Usage](./pricing-and-usage.md) table shows B.AI standard reference prices based on the model providers' official list prices. Discounts and limited-time promotions are shown on this page and in the website's discount groups. Applicable prices, offer terms, and final charges are subject to the platform display and actual billing records.

:::info Promotion validity
Discounts may change or end without further notice. Before running large batch jobs, check the current prices and promotion validity periods displayed on B.AI. See [Model pricing on the B.AI website](https://chat.b.ai/key).
:::

## Promotions

:::info Promotion display order
This section shows active and announced upcoming promotions: free offers appear first, followed by discounts from highest to lowest.
:::

<ActivityCard
  variant="discount"
  title="Hy4 Flash"
  status="Limited-Time Discount"
  detail="50% OFF"
>

**Offer ends at 12:00 noon on November 30, 2026 (Beijing Time, UTC+8).**

During the promotion, Hy4 Flash token charges are billed at 50% of the standard reference price, including input, output, cache writes, and cache reads. This offer applies only to `hy4-flash`.

| Billing Item | Promotional Price (USD / 1M Tokens) |
| :--- | ---: |
| Input | `$0.035` |
| Cache Write | `$0.035` |
| Cache Read | `$0.0015` |
| Output | `$0.1405` |

After the offer ends, usage is billed at the standard reference prices. The [Pricing and Usage](./pricing-and-usage.md) table and [model details](./models/hy4-flash.md) continue to show original prices. Applicable terms and final charges are subject to the platform display and actual billing records.
</ActivityCard>

<ActivityCard
  variant="discount"
  title="Hy4"
  status="Limited-Time Discount"
  detail="50% OFF"
>
Hy4 token charges are billed at 50% of the standard reference price, including input, output, cache writes, and cache reads. This offer applies only to `hy4`, not `hy4-preview`.

| Billing Item | Promotional Price (USD / 1M Tokens) |
| :--- | ---: |
| Input | `$0.4170` |
| Cache Write | `$0.4170` |
| Cache Read | `$0.0210` |
| Output | `$1.2505` |

Each promotional price is 50% of its official list price, shown to four decimal places.

The [Pricing and Usage](./pricing-and-usage.md) table and [model details](./models/hy4.md) continue to show standard reference prices. The promotion period, actual settlement prices, and final billing are subject to the platform display.
</ActivityCard>

<ActivityCard
  variant="discount"
  title="DeepSeek-V4.1-Flash"
  status="Limited-Time Discount"
  detail="50% OFF"
>

During the promotion, input, output, cache writes, and cache reads are billed at 50% of the applicable Off-Peak or Peak standard reference price. Promotional prices change in step with DeepSeek's time-based pricing.

The promotional prices below are in USD per 1 million tokens.

| Billing Period | Input | Cache Write | Cache Read | Output |
| :--- | ---: | ---: | ---: | ---: |
| Off-Peak | `$0.075` | `$0.075` | `$0.0015` | `$0.30` |
| Peak | `$0.15` | `$0.15` | `$0.003` | `$0.60` |

The [Pricing and Usage](./pricing-and-usage.md) table and [model details](./models/deepseek-v4-1-flash.md) continue to show standard reference prices. Actual settlement and final billing are subject to the platform display.
</ActivityCard>

<ActivityCard
  variant="discount"
  title="GLM-5.3-Flash"
  status="Limited-Time Discount"
  detail="40% OFF"
>
Eligible GLM-5.3-Flash usage through B.AI API and Chat is billed at 60% of the standard reference price.

See the [model details](./models/glm-5-3-flash.md) for standard pricing.
</ActivityCard>

<ActivityCard
  variant="discount"
  title="Qwen3.8-Flash"
  status="Limited-Time Discount"
  detail="80% of standard price from Oct 22, 17:00 UTC+8"
>
The offer takes effect at 17:00 on October 22, 2026 (Beijing Time, UTC+8).

From that time, Qwen3.8-Flash usage through B.AI API and Chat is billed at 80% of the standard reference price. Until then, current promotion rules continue to apply.

The [Pricing and Usage](./pricing-and-usage.md) table and [model details](./models/qwen3-8-flash.md) continue to show standard reference prices.
</ActivityCard>

<ActivityCard
  variant="discount"
  title="Qwen4-Max"
  status="Limited-Time Discount"
  detail="10% OFF"
>
Qwen4-Max token charges are billed at 90% of the standard reference price, including input, output, explicit cache writes for both lifetimes, and cache reads.

| Billing Item | Promotional Price (USD / 1M Tokens) |
| :--- | ---: |
| Ordinary Input | `$1.35` |
| Output | `$4.05` |
| Explicit Cache Write (5 min) | `$1.6875` |
| Explicit Cache Write (1 hour) | `$2.70` |
| Cache Read (Implicit or Explicit) | `$0.0675` |

The [Pricing and Usage](./pricing-and-usage.md) table and the standard pricing table in [model details](./models/qwen4-max.md) continue to show original prices. The promotion period, applicable terms, and final billing are subject to the platform display.
</ActivityCard>
