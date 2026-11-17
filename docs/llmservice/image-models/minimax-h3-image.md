# MiniMax-H3-Image / MiniMax-H3-Image-Highspeed

## Overview

[MiniMax-H3-Image](https://www.minimax.io/blog/minimax-h3-image) is MiniMax's open-weight H3-family model for image generation and editing, released on November 11, 2026. It combines detailed instruction following, multi-reference composition, and native 4K generation for creative and product design workflows.

## Model Variants

| Model | Description |
| :--- | :--- |
| **MiniMax-H3-Image** | Standard variant with lower image-input and image-output token prices. |
| **MiniMax-H3-Image-Highspeed** | Faster generation with the same supported inputs, output sizes, and reference-image limits. |

## Key Features

- **Generation and Editing:** Creates images from text or transforms existing images through reference-based instructions.
- **Multi-Reference Composition:** Combines up to 16 references to guide subjects, visual styles, layouts, and product arrangements.
- **Native 4K Detail:** Generates 4096 x 4096 square images directly, with detailed textures and lighting; custom output sizes extend to 20 megapixels.
- **Creative Control:** Follows detailed briefs for scene composition, object placement, viewpoints, and visual relationships.
- **Prompt Enhancement:** Expands short prompts into more detailed descriptions, with optional disabling for text-to-image generation.

## Best Use Cases

- **Game and Concept Art:** Explore environments, character sheets, creatures, and cinematic key art from written briefs and visual references.
- **Product and E-commerce Visuals:** Combine product references into lifestyle scenes and compare arrangements or backgrounds.
- **Campaign and Packaging Concepts:** Develop promotional artwork and packaging directions with coordinated colors, graphics, and short labels.
- **Creative Iteration:** Compare visual styles, refine viewpoints, and revise existing compositions; Highspeed suits workflows that prioritize faster turnaround.

## Capabilities and Limitations

The following [specifications](https://platform.minimax.io/docs/guides/image-generation) apply to both variants.

| Capability | Description |
| :--- | :--- |
| **Input and Output** | Text input for generation; text plus reference images for editing; image output. |
| **Reference Images** | Editing accepts 1-16 images, each up to 64 MiB, with 128-8192 pixels per side and a maximum 4:1 aspect ratio. |
| **Output Size** | 1K, 2K, and 4K area presets; custom dimensions from 655,360 to 20,000,000 total pixels. |
| **Aspect Ratios** | Output ratios from 1:3 to 3:1; presets describe target image area rather than a fixed edge length. |
| **Images per Request** | 1-10 images, with 1 as the default. |
| **Output Formats** | JPEG, PNG, and WebP. |
| **Prompt Length** | Up to 32,000 characters; with prompt enhancement disabled, only approximately the first 4,096 tokens take effect. |
| **Prompt Enhancement** | Enabled by default for text-to-image and always enabled for image editing. |

### Known Limitations

- Masked editing, transparent backgrounds, and preview images are not supported.
- Long paragraphs and dense text are less reliable than [titles, labels, and short annotations](https://design.minimax.io/tools/h3-image).
- The total request body is limited to 64 MiB; use image URLs or uploaded-file references when combined uploads would exceed it.
- Generated image URLs have no guaranteed retention period; save the returned images for continued use.

## Standard Pricing

Prices are shown in USD per 1 million tokens. Both models are billed by actual text input, reference-image input, and image output token usage, rather than a fixed price per image.

| Model | Text Input | Image Input | Image Output |
| :--- | ---: | ---: | ---: |
| MiniMax-H3-Image | `$2.30` | `$1.50` | `$3.80` |
| MiniMax-H3-Image-Highspeed | `$2.30` | `$3.00` | `$7.60` |

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

:::info Pricing note
Model prices in the documentation are based on the model providers' official list prices and serve as B.AI standard reference prices. B.AI may offer discounts or limited-time promotions on this basis; offer details are shown in [Promotions and Pricing Updates](../promotions-and-pricing-notices.md) and the website's discount groups. Applicable prices, offer terms, and final charges are subject to the platform display and actual billing records.
:::
