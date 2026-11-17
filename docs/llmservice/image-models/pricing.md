# Image Generation Model Pricing

Image generation models may use different billing methods. Some models are billed by text, image input, and image output tokens, while others are billed by each generated image. Check the billing unit shown for each model before estimating cost.

Token-based prices are shown in USD per 1 million tokens, while per-image prices are shown in USD per image. B.AI converts usage to Credits at `1 USD = 1,000,000 Credits`.

## GPT-Image-2

**Billing method:** Token-based

GPT-Image-2 is billed by actual text input, image input, and image output token usage. It does not have a single fixed price per generated image. Resolution, quality, aspect ratio, reference images, and output count can affect final usage.

| Billing item | Standard price (USD/1M Tokens) |
| :--- | ---: |
| Text input | `5.00` |
| Image input | `8.00` |
| Image output | `30.00` |

[View GPT-Image-2 model details](./gpt-image-2.md)

## MiniMax-H3-Image / MiniMax-H3-Image-Highspeed

**Billing method:** Token-based

Both models are billed by actual text input, reference-image input, and image output token usage, rather than a fixed price per image. Prices below are in USD per 1 million tokens.

| Model | Text Input | Image Input | Image Output |
| :--- | ---: | ---: | ---: |
| MiniMax-H3-Image | `$2.30` | `$1.50` | `$3.80` |
| MiniMax-H3-Image-Highspeed | `$2.30` | `$3.00` | `$7.60` |

[View MiniMax-H3-Image and Highspeed model details](./minimax-h3-image.md)

:::info Pricing note
Model prices in the documentation are based on the model providers' official list prices and serve as B.AI standard reference prices. B.AI may offer discounts or limited-time promotions on this basis; offer details are shown in [Promotions and Pricing Updates](../promotions-and-pricing-notices.md) and the website's discount groups. Applicable prices, offer terms, and final charges are subject to the platform display and actual billing records.
:::
