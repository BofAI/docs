# Seedance 2.5

## Overview

Seedance 2.5 is ByteDance Seed's video creation model, [released on July 31, 2026](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5), built on a unified multimodal audio-video generation architecture. It combines up to 30 seconds of generation per request with multimodal references, video extension, and targeted editing for more complete, controllable storytelling.

:::info Platform availability
The specifications below describe the model provider's capabilities. Features, resolutions, reference-material routes, and limits available through B.AI are subject to the platform's actual support. Use the model ID shown by the platform rather than assuming the display name is an API model ID.
:::

## Key Features

- **Longer Storytelling**: Generates sequences up to 30 seconds long, with connected shots and scene transitions; video extension supports continuing a story across additional generations.
- **Multimodal Reference Control**: Combines image, video, and audio references to guide subjects, composition, motion, camera work, and sound. Supports up to 50 reference assets per request, including audio-only references.
- **Joint Audio-Video Generation**: Creates video with audio, with native multilingual prompt and audio-generation support for localized creative work.
- **Targeted Editing**: Uses timestamp-based instructions to refine visual or audio content. Supports reference-based changes, camera-perspective edits, and green-screen workflows.
- **Production Planning**: Clay-render references can guide spatial layout, blocking, and camera movement; first-frame and first-and-last-frame inputs guide animation endpoints.
- **Draft-to-Final Workflow**: Generates a 480p preview to evaluate composition and motion before producing a 1080p final video from the Draft task.

## Best Use Cases

- **Product Advertising and Social Video**: Combine product images, motion references, and audio direction to create short campaign sequences in landscape, square, or portrait formats.
- **Narrative Shorts and Previsualization**: Develop connected shots and character scenes, using clay renders or reference footage to guide staging and camera movement.
- **Video Revision and Continuation**: Modify subjects, objects, backgrounds, or sound in existing footage, or generate preceding and subsequent story segments.
- **Localized Educational and Explainer Content**: Turn concepts or story outlines into audiovisual demonstrations, with multilingual prompts and generated audio. Review factual accuracy before publication.

## Generation Specifications

| Capability | Description |
| :--------- | :---------- |
| **Input Modalities** | Text, images, video, and audio. Audio-only references supported. |
| **Generation Modes** | Text-to-video, image-to-video, first-and-last-frame generation, reference-guided generation, editing, and extension. |
| **Reference Limits** | 30 images, 10 videos, and 10 audio clips; video and audio each have a 30-second total limit. |
| **Output Duration** | 4–30 seconds or automatic; editing preserves input duration approximately. |
| **Output Resolution** | 480p / 720p (8-bit); 1080p (10-bit). |
| **Aspect Ratios** | 16:9, 4:3, 1:1, 3:4, 9:16, 21:9, or adaptive. |
| **Frame Rate** | 24 FPS output. |
| **Output Format** | MP4 or MOV. |
| **Languages** | 11 languages, including English, Chinese, Japanese, Korean, Spanish, and Arabic. |
| **Draft Mode** | 480p preview → 1080p final video; billed separately. |
| **Delivery** | Asynchronous generation; offline inference not supported. |

## Standard Pricing

**Price unit: `USD / 1M Video Tokens` (USD per 1 million video tokens).** Choose the rate for the output resolution and whether the request includes video. These are task-scenario rates, not separate input and output prices.

| Output Resolution | Without Video Input<br/>(USD / 1M Video Tokens) | With Video Input<br/>(USD / 1M Video Tokens) |
| :--- | ---: | ---: |
| 480p / 720p | `$10.70` | `$6.40` |
| 1080p | `$11.70` | `$7.00` |

### Billing Notes

- Without video input can still include image or audio references. Video tokens are not text tokens, and prices are not per second or per video.
- Reference video contributes to billable usage alongside generated output. Minimum token charges apply to video-input tasks and depend on resolution, aspect ratio, and duration.
- Draft previews and final videos are billed separately at the applicable 480p and 1080p rates. Final-generation billing uses the original request's input video; the Draft clip is not counted as additional input.
- The model provider bills only successfully generated videos, not failed generation tasks. B.AI task status, usage, and final settlement are subject to the platform display and billing records.

**Credits settlement:** B.AI converts charges at `1 USD = 1,000,000 Credits` and deducts Credits from the account balance.

[View all video model prices](./pricing.md)

:::info Pricing note
Prices shown in the documentation are B.AI standard reference prices for base billing purposes. B.AI may provide lower actual usage costs through top-up bonuses and account benefits. Specific prices, bonus Credits, account benefits, and final settlement are subject to the platform display and billing records.
:::

## Usage and Limitations

The following limits and result-retention rules describe the model provider's service. B.AI availability and task handling are subject to the platform's actual support.

- Complex motion can remain physically implausible, and interactions among multiple subjects can be unstable; the developer identifies both as areas for improvement.
- Video editing requires adaptive aspect ratio and automatic duration (`ratio=adaptive`, `duration=-1`), with reference videos of 4–30 seconds. Extension and first-frame/first-and-last-frame generation also require adaptive aspect ratio. Prompt intent must match the task configuration; mismatches can fail after submission.
- Outside editing, individual reference videos must be 2–30 seconds long; individual audio clips must be 2–30 seconds. Per-file limits are under 30 MB for images, up to 200 MB for video, and up to 15 MB for audio; the request body must not exceed 64 MB.
- Direct uploads of reference images or videos containing real human faces are restricted. Portrait workflows require the provider's supported asset routes, such as trusted model outputs, preset digital characters, or authorized real-person assets.
- 1080p output and professional MOV files have additional playback requirements. The provider describes HEVC/10-bit encoding for 1080p and separately specifies H.264/yuv444p/PCM for MOV, without fully clarifying their combination. Verify the returned file and target player before relying on a specific codec/color-depth combination.
- Task records are retained for seven days. Result video URLs expire after 24 hours and allow at most 100 downloads, so completed files should be saved promptly.

### Asynchronous Generation

Generation is task-based: submit a request, check its status, and retrieve the result after completion. It is not a streamed text reply. Use B.AI's supported video-generation interface; do not substitute a chat endpoint or the provider's endpoint without confirming compatibility.
