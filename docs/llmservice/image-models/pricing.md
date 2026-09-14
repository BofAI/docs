# Image Generation Model Pricing

Image generation models may use different billing methods. Some models are billed by text, image input, and image output tokens, while others are billed by each generated image. Check the billing unit shown for each model before estimating cost.

Token-based prices are shown in USD per 1 million tokens, while per-image prices are shown in USD per image. B.AI converts usage to Credits at `1 USD = 1,000,000 Credits`.

## GPT-Image-2

**Billing method:** Token-based

GPT-Image-2 is billed by actual text input, cached text input, image input, cached image input, and image output token usage. It does not have a single fixed price per generated image. Resolution, quality, aspect ratio, reference images, and output count can affect final usage.

| Billing item | Standard price (USD/1M Tokens) |
| :--- | ---: |
| Text input | `5.00` |
| Cached text input | `1.25` |
| Image input | `8.00` |
| Cached image input | `2.00` |
| Image output | `30.00` |

[View GPT-Image-2 model details](./gpt-image-2.md)

## Grok Imagine Image 2.0

**Billing method:** Per generated image

Grok Imagine Image 2.0 is billed by the actual number of generated images. The output rate depends on resolution and quality.

| Resolution | Quality | Output price (USD/Image) |
| :--- | :--- | ---: |
| 1K | low | `$0.04` |
| 2K | low | `$0.06` |
| 1K | medium | `$0.06` |
| 2K | medium | `$0.08` |

Reference-image input is billed at `$0.01` per image. For batch generation, charges accumulate based on the actual number of generated images.

[View Grok Imagine Image 2.0 model details](./grok-imagine-image-2-0.md)

**Pricing note:** Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, account benefits, and final settlement are subject to the platform display and billing records.
