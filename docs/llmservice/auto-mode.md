# Auto Mode: Start Without Choosing a Model

When working with different AI models, you may wonder which one is best for writing, coding, or a simple question. Auto Mode is designed to reduce that choice: describe what you want to accomplish, and B.AI selects an appropriate available model for the request.

## What Is Auto Mode?

Auto is an intelligent option in the B.AI Chat model selector.

After selecting Auto, you can send messages, ask follow-up questions, and use conversation context as usual. The difference is that you do not need to select a specific model before each request. B.AI chooses from the models available to your account for each request.

Each request is handled by one model and returns one complete response. The chat interface displays Auto rather than the routing process or selection rules. You can review the actual model, token usage, and cost in the request usage details and on the **Usage** page.

:::info Choosing for the task

Auto Mode aims to select a suitable model for the current task. It does not always select the largest model, the fastest model, or the lowest-priced model.

:::

## When to Use Auto Mode

Auto Mode is a good choice when:

* You are not sure which model to select and care more about the result than model comparison.
* Your tasks vary, such as researching, writing, and analyzing code in the same conversation.
* You want to start quickly with fewer setup steps.
* You are handling everyday tasks such as summarizing, polishing text, explaining concepts, organizing ideas, or drafting content.

If you need to evaluate a particular model, reproduce results, or follow a workflow that requires a fixed model, select that model manually instead.

## How to Use Auto Mode

1. Open a new chat or enter an existing chat.
2. Click the model selector.
3. Select **Auto** from the model list.
4. Enter your question or task, then send it.
5. Continue the conversation as needed.

Auto remains selected for later messages, but each request can independently use a different actual model. You do not need to ask B.AI to choose a model in your prompt. Instead, clearly describe your goal, context, constraints, and expected output.

For example, instead of writing "Write an introduction," you could write:

> Write a Chinese product introduction of no more than 150 characters for an AI image-organizing tool for designers. Keep the tone professional and concise, without exaggerated claims.

## Auto Mode and Manual Model Selection

| Item | Auto Mode | Manual Model Selection |
| :--- | :--- | :--- |
| Model selection | B.AI selects a model for each request | You select a specific model |
| Best for | Everyday tasks, varying work, or uncertain model choice | Model evaluation, reproducible results, or fixed workflows |
| Chat display | Displays Auto | Displays the selected model |
| Actual usage | Available in request usage details and on the Usage page | Available in request usage details and on the Usage page |
| Billing | Based on the actual model and usage | Based on the selected model and usage |

If you do not have a specific model preference, start with Auto Mode. Switch to a manually selected model when your task requires a specific one.

## Reviewing the Actual Model, Tokens, and Cost

Auto does not show the actual model in the chat message itself, but every request has an execution record. Review the request usage details in the chat or open the **Usage** page to see:

* The actual model used
* Input and output tokens
* Tools used
* The actual cost of the request

Auto Mode does not add a separate model-selection charge. The final cost is determined by the model actually used, token usage, and any tool usage. Different requests may use different models and therefore have different costs. Refer to the usage record for the final amount.

## Search and Tools

When Web Search or read-only tools are enabled in a chat, Auto Mode can use the available tools when they are needed for the task. Availability depends on the current feature configuration and the capabilities of the model selected for the request.

Tool calls and their related usage are also recorded on the **Usage** page.

## Frequently Asked Questions

### Will the same question always use the same model?

Not necessarily. Available models, task context, and service configuration can change, so similar questions at different times may use different models.

### Does Auto Mode call multiple models at the same time?

No. Each Auto request selects one model and returns one complete response.

### Can I see which model Auto Mode selected?

Yes. The chat interface displays Auto to keep the conversation simple, while the actual model is available in the request usage details and on the **Usage** page.

### Is Auto Mode always better than selecting a model manually?

No. Auto Mode is useful when you do not have a specific model preference and want to reduce selection effort. Selecting a model manually gives you more control when you already know which model you need.

### Is Auto Mode more expensive?

Auto Mode has no additional charge. However, model pricing and token usage can differ by request. Review the actual cost in the **Usage** page.
