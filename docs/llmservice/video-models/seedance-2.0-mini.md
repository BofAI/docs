# Seedance 2.0 Mini

## Overview

Seedance 2.0 Mini is ByteDance's cost-focused video generation variant in the Seedance 2.0 family. It offers multimodal reference-guided creation, joint audio-video generation, editing, and extension at lower published token rates than the ordinary and Fast variants, with 4–15-second output at 480p or 720p.

:::info Platform availability
The specifications below describe the model provider's capabilities. Features, resolutions, reference-material routes, and limits available through B.AI are subject to the platform's actual support. Use the model ID shown by the platform rather than assuming the display name is an API model ID.
:::

## Key Features

- **Lower-Cost Generation**: Has lower published list-price token rates than Seedance 2.0 and Seedance 2.0 Fast for the same 480p/720p input scenario, making repeated creative exploration more affordable.
- **Multimodal Reference Control**: Combines up to nine images, three video clips, and three audio clips to guide subjects, composition, motion, camera movement, and sound.
- **Joint Audio-Video Generation**: Generates video with audio in the same task, including dialogue, music, or sound effects directed by the prompt and references.
- **Video Editing and Extension**: Supports prompt-guided changes to existing footage and continuation forward or backward; multiple video references can guide transitions.
- **Image Animation and Endpoints**: Supports first-frame image-to-video and first-and-last-frame generation for animating an image or connecting specified visual endpoints.

## Best Use Cases

- **Budget-Conscious Creative Exploration**: Test concepts and compare multiple prompt or reference combinations at the family's lower published token rates.
- **Social and Product Media**: Animate product or scene images into short landscape, square, or portrait videos, with generated audio and reference-guided camera work.
- **Storyboards and Narrative Prototypes**: Combine character, setting, and motion references to test a short sequence before committing to a production approach.
- **Footage Revision and Continuation**: Replace subjects or objects, adjust visual content, or generate connecting and continuation shots from existing references.

## Generation Specifications

| Capability | Description |
| :--------- | :---------- |
| **Input Modalities** | Text, images, video, and audio. Audio references require an image or video. |
| **Generation Modes** | Text-to-video, image-to-video, first-and-last-frame generation, reference-guided generation, editing, and extension. |
| **Reference Limits** | 9 images, 3 videos, and 3 audio clips; video and audio each have a 15-second total limit. |
| **Output Duration** | 4–15 seconds or automatic. |
| **Output Resolution** | 480p / 720p (8-bit). |
| **Aspect Ratios** | 16:9, 4:3, 1:1, 3:4, 9:16, 21:9, or adaptive. |
| **Frame Rate** | 24 FPS output. |
| **Output Format** | MP4. |
| **Draft Mode** | Not supported. |
| **Delivery** | Asynchronous generation; offline inference not supported. |

## Standard Pricing

**Price unit: `USD / 1M Video Tokens` (USD per 1 million video tokens).** Choose the rate for the output resolution and whether the request includes video. These are task-scenario rates, not separate input and output prices.

| Output Resolution | Without Video Input<br/>(USD / 1M Video Tokens) | With Video Input<br/>(USD / 1M Video Tokens) |
| :--- | ---: | ---: |
| 480p / 720p | `$3.50` | `$2.10` |

### Billing Notes

- Without video input can still include image or audio references. Video tokens are not text tokens, and prices are not per second or per video.
- Reference video contributes to billable usage alongside generated output. Minimum token charges apply to video-input tasks and depend on resolution, aspect ratio, and duration.
- The model provider bills only successfully generated videos, not failed generation tasks. B.AI task status, usage, and final settlement are subject to the platform display and billing records.

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

[View all video model prices](./pricing.md)

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, account benefits, and final settlement are subject to the platform display and billing records.
:::

## Usage and Limitations

The following limits and result-retention rules describe the model provider's service. B.AI availability and task handling are subject to the platform's actual support.

- Single-request generation is limited to 15 seconds. Reference-based control does not guarantee exact subject identity, motion, or frame continuity; review generated footage before use.
- Individual reference videos and audio clips must be 2–15 seconds long, subject to the separate 15-second aggregate limits for each modality. Per-file limits are under 30 MB for images, up to 200 MB for video, and up to 15 MB for audio; the request body must not exceed 64 MB.
- Direct uploads of reference images or videos containing real human faces are restricted. Portrait workflows require supported provider asset routes, such as trusted model outputs, preset digital characters, or authorized real-person assets.
- Input/output dimension mismatches in first-frame and first-and-last-frame workflows can cause abrupt stretching or compression between frames. Match input dimensions to the intended output or use adaptive aspect ratio.
- Output is limited to 480p and 720p. Mini is positioned around cost performance; shared feature support does not establish equal visual quality across the family.
- Task records are retained for seven days. Result video URLs expire after 24 hours and allow at most 100 downloads, so completed files should be saved promptly.

### Asynchronous Generation

Generation is task-based: submit a request, check its status, and retrieve the result after completion. It is not a streamed text reply. Use B.AI's supported video-generation interface; do not substitute a chat endpoint or the provider's endpoint without confirming compatibility.

See the [Video Generation API](../api/videos.md) for task creation, status queries, video downloads, and billing behavior.
