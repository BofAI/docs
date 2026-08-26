# GPT-Image-2

## Overview

GPT-Image-2 is an OpenAI image generation and editing model. It accepts text prompts and reference images, and is designed for creative production, marketing assets, and high-quality visual content.

### Billing Method

GPT-Image-2 is billed by usage across text input, cached text input, image input, cached image input, and image output tokens. It does not have a single fixed price per generated image. Resolution, quality, aspect ratio, reference images, and output count can affect the final token usage.

## Key Features

- **Flexible aspect ratios:** Supports auto, 16:9, 3:2, 1:1, 2:3, and 9:16.
- **Multiple output specifications:** Supports 1K, 2K, and 4K resolutions with Auto, low, medium, and high quality levels.
- **Batch generation:** Generates 1 to 8 images in a single request.
- **Reference-image editing:** Accepts up to 16 reference images for high-fidelity editing.
- **Cost control:** Resolution, quality, and output count can be adjusted for different production requirements.

## Best Use Cases

- Marketing graphics, posters, banners, covers, and social media assets
- Product concepts, character designs, and visual style exploration
- High-resolution creative assets that require detailed rendering
- Image editing based on one or more reference images
- Batch generation of multiple candidates for comparison

## Capabilities and Limits

| Capability | Description |
| :--- | :--- |
| **Aspect ratio** | auto / 16:9 / 3:2 / 1:1 / 2:3 / 9:16 |
| **Resolution** | 1K / 2K / 4K |
| **Quality** | Auto / low / medium / high |
| **Images per request** | 1-8 |
| **Reference images** | Up to 16 |
| **Reference-image requirements** | Up to 10 MB per image; jpg, jpeg, and png; URL input |
| **Transparent background** | Not supported by the current B.AI interface for this model |

## Pricing

Prices are based on token usage. Under the platform-wide conversion of `1 USD = 1,000,000 Credits`, a provider reference price of `USD X / 1M Tokens` corresponds numerically to `X Credits/Token`.

| Billing item | Reference price (USD/1M Tokens) | B.AI rate (Credits/Token) | How it is billed |
| :--- | ---: | ---: | :--- |
| **Text input** | `5.00` | `5.00` | Based on text input tokens |
| **Cached text input** | `1.25` | `1.25` | Applied when cached text input is reused |
| **Reference-image input** | `8.00` | `8.00` | Based on image input tokens; multiple images accumulate usage |
| **Cached image input** | `2.00` | `2.00` | Applied when cached image input is reused |
| **Image output** | `30.00` | `30.00` | Based on generated image output tokens |

**Pricing note:** Documented prices are B.AI standard reference prices for basic billing guidance. B.AI may provide a lower effective usage cost through top-up rewards or account benefits. Prices, bonus Credits, account benefits, and final settlement are subject to the platform display and billing records.
