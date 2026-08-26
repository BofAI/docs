# Grok Imagine Image 2.0

## Overview

Grok Imagine Image 2.0 is a SpaceXAI image generation and editing model. It supports text-to-image generation and multi-image editing, with multiple aspect ratios, 1K and 2K output, and low and medium quality levels.

### Billing Method

Grok Imagine Image 2.0 is billed by the number of images generated. The output price depends on resolution and quality, and each reference image used for editing is billed separately. This model does not use the Input / Cache Write / Cache Read / Output token structure of the text-output model table.

## Key Features

- **Flexible aspect ratios:** Supports auto, 21:9, 16:9, 3:2, 4:3, 1:1, 3:4, 2:3, and 9:16.
- **Multiple output specifications:** Supports 1K and 2K resolutions with low and medium quality levels. The default quality is medium.
- **Batch generation:** Generates multiple images from the same prompt.
- **Multi-image editing:** Accepts up to 3 reference images.
- **Predictable per-image pricing:** Charges by the actual number of generated images, resolution, and quality.

## Best Use Cases

- Posters, banners, covers, thumbnails, and social media assets
- Character, environment, product, and visual-style concepts
- Assets adapted for widescreen, mobile, portrait, and photography layouts
- Style transfer, content editing, and composition using reference images
- Batch generation of multiple creative candidates

## Capabilities and Limits

| Capability | Description |
| :--- | :--- |
| **Aspect ratio** | auto / 21:9 / 16:9 / 3:2 / 4:3 / 1:1 / 3:4 / 2:3 / 9:16 |
| **Resolution** | 1K / 2K |
| **Quality** | low / medium; medium by default |
| **Batch generation** | Supports multiple outputs from one prompt |
| **Reference images** | Up to 3 |
| **Reference-image requirements** | Up to 10 MB per image; jpg, jpeg, and png; URL input |
| **Output format** | Temporary URL by default; base64 can also be requested |

## Pricing

| Resolution | Quality | Reference price per image | B.AI rate per generated image |
| :--- | :--- | ---: | ---: |
| **1K** | low | `$0.04` | **40,000 Credits** |
| **2K** | low | `$0.06` | **60,000 Credits** |
| **1K** | medium | `$0.06` | **60,000 Credits** |
| **2K** | medium | `$0.08` | **80,000 Credits** |

Reference-image input is billed at `$0.01` or **10,000 Credits per image**. For batch generation, output Credits accumulate based on the actual number of generated images.

**Pricing note:** Documented prices are B.AI standard reference prices for basic billing guidance. B.AI may provide a lower effective usage cost through top-up rewards or account benefits. Prices, bonus Credits, account benefits, and final settlement are subject to the platform display and billing records.
