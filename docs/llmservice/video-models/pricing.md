# Video Generation Model Pricing

Seedance models generate video, including audio-video content, from text and supported image, video, or audio references. Video generation pricing is separate from the text-output and image generation pricing tables.

## Standard Pricing

**Price unit: `USD / 1M Video Tokens` (USD per 1 million video tokens).** Prices are not per second or per generated video. Actual cost depends on billable video token usage.

| Model | Output Resolution | Without Video Input<br/>(USD / 1M Video Tokens) | With Video Input<br/>(USD / 1M Video Tokens) |
| :--- | :--- | ---: | ---: |
| [Seedance 2.0 Mini](./seedance-2.0-mini.md) | 480p / 720p | `$3.50` | `$2.10` |
| [Seedance 2.0 Fast](./seedance-2.0-fast.md) | 480p / 720p | `$5.60` | `$3.30` |
| [Seedance 2.0](./seedance-2.0.md) | 480p / 720p | `$7.00` | `$4.30` |
| [Seedance 2.0](./seedance-2.0.md) | 1080p | `$7.70` | `$4.70` |
| [Seedance 2.0](./seedance-2.0.md) | 4K | `$4.00` | `$2.40` |
| [Seedance 2.5](./seedance-2.5.md) | 480p / 720p | `$10.70` | `$6.40` |
| [Seedance 2.5](./seedance-2.5.md) | 1080p | `$11.70` | `$7.00` |

:::info How to read this table
- **Without video input** can still include image or audio references; it does not mean text-only input.
- **With video input** identifies a task scenario, not a separate input-token price. Reference video contributes to billable usage alongside generated output.
- Video tokens are a video billing unit, not a count of words in the prompt. Resolution, aspect ratio, duration, and reference video can affect usage. Video-input tasks may have minimum token charges.
- A lower per-token rate at 4K does not establish a lower total cost for a video of the same duration; compare total billable usage, not the unit rate alone.
:::

## Seedance 2.5 Draft Billing

Draft previews and final videos are billed separately at the applicable 480p and 1080p rates. Final-generation billing uses the original request's input video; the Draft clip is not counted as additional input. See [Seedance 2.5](./seedance-2.5.md) for specifications and limitations.

## Credits Settlement

B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

The model provider's billing rules charge only successfully generated videos, not failed generation tasks. B.AI task status, billable usage, and final settlement are subject to the platform display and billing records.

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, account benefits, and final settlement are subject to the platform display and billing records.
:::
