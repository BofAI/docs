# Frequently Asked Questions (FAQ)

## 1. What is the difference between B.AI Chat and the API?

Chat lets you converse directly through the website or app. The API lets developers integrate models into their applications or tools. Available models, features, and billing rules may differ; see the relevant documentation for each service.

## 2. How do I obtain and use an API Key?

Create an API Key in the [B.AI console](https://chat.b.ai/key), then configure it in your application or client. Authenticate requests using `Authorization: Bearer <API Key>` or `x-api-key`. Keep your key private and avoid exposing it in screenshots, logs, or source repositories. See the [API Reference](./api/API.md).

## 3. Which API Base URL should I use?

The production Base URL is `https://api.b.ai/v1`. Choose the request endpoint according to your client's protocol; supported endpoints may vary by model. See the [API Reference](./api/API.md).

## 4. What can I do if I cannot access B.AI from mainland China?

Open **B.AI Service Availability** in the B.AI Android app to find currently available web addresses and API Base URLs. Copy the displayed address in full. See [App and Service Availability](./app-and-service-availability.md).

## 5. Where can I download the B.AI app?

Install it through [Google Play](https://play.google.com/store/apps/details?id=com.bai.chat), or scan the Android download QR code in the upper-right corner of the [B.AI website](https://b.ai/) to download the APK. Android 8.0 or later is supported. See [App and Service Availability](./app-and-service-availability.md).

## 6. What if I do not know which model to choose?

Select Auto in Chat to let B.AI choose an available model for each task. You can select a model manually when you need a fixed model or want to test its capabilities. Auto has no additional selection fee; billing follows the model actually used and its usage. See [Auto Mode](./auto-mode.md).

## 7. How do I fill in the model name in an API request?

Open the [API Key page](https://chat.b.ai/key), find the model you want to use, and select the copy button to the right of its name. Paste the copied model ID into the request's `model` field.

You can also use `GET /v1/models` to retrieve the models available to your current API Key. Confirm that the selected model supports the endpoint you are using. See the [API Reference](./api/API.md).

## 8. How are input, output, cache writes, and cache reads billed?

Input is the content sent to the model, and output is the content it generates. Cache writes create reusable cached content, while cache reads reuse it in later requests. Rates, cache durations, and billing behavior vary by model. Some models also count reasoning tokens as output usage. See the relevant model details.

## 9. How do explicit and implicit caching differ? Are there extra charges?

Explicit caching typically involves caches created or specified by the caller. Implicit caching automatically identifies reusable content. Both may incur cache write or read charges, and some models also charge for explicit cache storage based on its duration. See the model details for supported caching options and rates.

## 10. Does web search incur an additional charge?

Web search is billed separately per use, with rates varying by model. Search results included in the model's context may also incur token charges. Check the model's web search pricing and your usage records.

## 11. Why might my actual charge differ from the documented price?

Model prices in the documentation are based on the model providers' official list prices and serve as B.AI standard reference prices. B.AI may offer discounts or limited-time promotions on this basis; offer details are shown in [Promotions and Pricing Updates](./promotions-and-pricing-notices.md) and the website's discount groups. Applicable prices, offer terms, and final charges are subject to the platform display and actual billing records.

Actual charges may also depend on cache hits, context tiers, time-based pricing, and tool usage. See [Pricing and Usage](./pricing-and-usage.md).

## 12. How long do discounted prices last? {#discount-duration}

Discount promotions may start, change, or end in line with suppliers' promotional arrangements, without further notice. The validity period is subject to the promotion details. Before running large batch jobs, check the current prices displayed on **B.AI platform pages and discount groups**.

## 13. How do long-context rates and DeepSeek Peak and Off-Peak pricing work? {#12-how-do-long-context-rates-and-deepseek-peak-and-off-peak-pricing-work}

Some models apply different rates when input exceeds a specified length. See the model details for the threshold and which parts of the request those rates cover.

For DeepSeek models with time-based pricing, Peak periods are Monday through Friday, excluding Chinese statutory public holidays, from 09:00-12:00 and 14:00-18:00 Beijing Time (UTC+8). All other periods, including weekends and Chinese statutory public holidays, are Off-Peak. Off-Peak prices are half the Peak prices. B.AI Chat always uses Off-Peak pricing for these models. See [Pricing and Usage](./pricing-and-usage.md).

## 14. How do I check my balance and actual charges? {#13-how-do-i-check-my-balance-and-actual-charges}

Use the platform's Usage page to view your balance, the model actually used, token usage, and Credits consumed. Developers can also use the [Balance API](./api/balance.md) to query the balance or quota available to the current API Key.

## 15. Why were Credits deducted when the model did not provide an answer? {#14-why-were-credits-deducted-when-the-model-did-not-provide-an-answer}

Model charges are based on actual billable usage, including input, output, cache writes, and cache reads. Having no visible answer does not necessarily mean there was no usage: the request may already have processed input tokens, and some reasoning models may generate reasoning tokens that are not displayed to the user. Such usage may still be billable.

Check the usage records on the Usage page for the actual charge. If you have a question about a charge, keep the request time and relevant records to help investigate it.

## 16. How should I troubleshoot API errors? {#15-how-should-i-troubleshoot-api-errors}

Read the error message in the response, then check the following based on its status code:

| Status code | What to check |
| :--- | :--- |
| `400` | Parameters, request format, and model compatibility with the endpoint |
| `401` | API Key and authentication headers |
| `403` | Account status, subscription, or model permissions |
| `404` | Request path and model ID |
| `429` | Request rate and concurrency; reduce concurrency and retry with exponential backoff |
| `500 / 502 / 503` | Retry later and retain the request ID for investigation |

See the [API Reference](./api/API.md).

## 17. Why can a request fail even when the input is below the model's stated context limit? {#16-why-can-a-request-fail-even-when-the-input-is-below-the-models-stated-context-limit}

**B.AI does not impose an additional context-length limit.** Requests must still follow the rules of the model and its upstream API.

The stated context capacity is not necessarily available entirely for the main input text. System prompts, conversation history, and tool-related content also consume space, and some APIs reserve capacity for output. Client-side token estimates may also differ from server-side counts, so the length of the main text alone cannot determine whether a request exceeds the limit.

Trim conversation history, set the maximum output length according to your needs, and leave some context capacity available. If length-related errors persist, split oversized content into smaller parts or extract the key information before submitting it.

## 18. Why does the Responses API report cache read usage but no cache write usage? {#17-why-does-the-responses-api-report-cache-read-usage-but-no-cache-write-usage}

Some models use **implicit caching**, which is managed automatically by the upstream service without explicit client configuration. Usage fields may also vary between upstream services, and some responses include only cache read usage without a separate cache write field.

**A missing write field does not mean caching was ineffective.** Cache read usage greater than 0 indicates that the request hit the cache, but the response alone cannot determine how much new content was written to the cache.

## 19. Why does my bill show models I did not actively select or do not remember calling? {#18-why-does-my-bill-show-models-i-did-not-actively-select-or-do-not-remember-calling}

Not actively selecting a model does not necessarily mean your client did not call it. Some clients or tools may call other models for automatic model selection, conversation history compression, subtasks, or background workflows. Multiple applications sharing the same API Key may also generate usage across different models.

These are possible causes, not confirmed explanations for a particular charge. To identify the source, compare the call time, model, and API Key in your billing records with your client configuration, past conversations, and background tasks.

## 20. Why did I not receive bonus Credits after topping up? {#19-why-did-i-not-receive-bonus-credits-after-topping-up}

The top-up bonus promotion has ended. No payment method provides additional bonus Credits on top-ups. Bonus Credits received through previous top-up promotions are valid for **30 days**. We recommend using them within their validity period.

Registration through any channel does not grant bonus Credits. Inviting someone to register does not grant bonus Credits either.

## 21. Why can Credits consumption differ severalfold for the same model and seemingly identical context? {#20-why-can-credits-consumption-differ-severalfold-for-the-same-model-and-seemingly-identical-context}

Credits consumption depends on the actual billable usage and applicable rates for each request. Seemingly identical context does not necessarily mean that the content sent or the usage is exactly the same. Common reasons include:

1. **Different actual input usage:** The client may include conversation history, system prompts, and tool results. Input is not limited to the text you just sent.
2. **Different cache hit proportions:** Reported cache read usage does not mean that all input was cached. Ordinary input and cache reads may have different rates, so charges can differ significantly even when total input usage is similar. Cache hits are not guaranteed on every request.
3. **Different output usage:** Output is still billed based on actual usage after a cache hit. Some models also include undisplayed reasoning tokens in billable output usage, so visible answer length alone cannot determine the charge.

**A difference in Credits consumption alone cannot establish that you were overcharged.** Compare the billable usage for ordinary input, cache writes and reads, and output, along with the context tier, time-based rates, and promotional discounts applicable when each request was made.

## 22. Why do consecutive calls to the same model sometimes hit the cache and sometimes miss it? Is my configuration wrong? {#21-why-do-consecutive-calls-to-the-same-model-sometimes-hit-the-cache-and-sometimes-miss-it-is-my-configuration-wrong}

**Not necessarily.** Cache hits typically depend on reusable input content and the applicable caching conditions. Calling the same model repeatedly does not guarantee a cache hit. Common factors include:

- **Changes to the input prefix:** The content or order of system prompts, conversation history, or tool definitions changes.
- **Insufficient cacheable length:** The identical input prefix does not meet the model's minimum cache length.
- **Cache expiration:** The cache has expired or been cleared by the system.
- **Explicit caching conditions are not met:** The initial cache creation has not finished, or the position of the cache marker does not satisfy the matching rules.

**To improve the cache hit rate:** Place fixed system prompts, reference material, and tool definitions at the beginning of the request, followed by the changing user question. Keep fixed content and tool order consistent, and avoid inserting changing timestamps or random values into the fixed prefix.

**Qwen example:** For models and endpoints that support the corresponding caching mechanism, implicit caching requires no extra configuration but does not guarantee a hit on every request. Explicit caching requires parameters such as `cache_control` to be configured according to the endpoint, along with the cache creation and matching conditions. Configuration may differ between endpoints. See the [Qwen official caching documentation](https://www.alibabacloud.com/help/en/model-studio/context-cache).

Caching mechanisms, validity periods, and supported parameters vary by model.
