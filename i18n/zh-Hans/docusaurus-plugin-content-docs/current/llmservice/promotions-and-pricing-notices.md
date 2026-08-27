import ActivityCard from '@site/src/components/ActivityCard';

# 活动与调整公告

本页汇总当前限时活动和定价调整公告。[定价与用量](./pricing-and-usage.md)页面的价格总表继续展示标准参考价。活动适用规则、活动周期、实际结算价格及最终账单以平台页面展示为准。

## 活动

:::info 活动展示规则
本栏目仅展示当前生效的活动：免费活动优先，折扣活动按优惠力度由高至低排列。
:::

<ActivityCard
  variant="free"
  title="DeepSeek-V4-Flash"
  status="免费活动"
  detail="0 Credits"
>
活动开始时间：2026 年 8 月 17 日。

本活动覆盖 B.AI Chat 和 API：

* **Chat：** 活动期间使用 DeepSeek-V4-Flash，按 `0 Credits` 结算。
* **API：** 活动期间使用按 `0 Credits` 结算，不收取单次请求、输入、缓存写入、缓存读取或输出的费用。

活动结束后，DeepSeek-V4-Flash 将恢复标准价格。详见[模型详情](./models/deepseek-v4-flash.md)。
</ActivityCard>

<ActivityCard
  variant="free"
  title="DeepSeek-V4-Flash-Vision-Exp"
  status="API 免费"
  detail="0 Credits"
>
本活动当前生效，仅适用于通过 B.AI API 发起的 `deepseek-v4-flash-vision-exp` 调用。

活动期间，API 调用按 `0 Credits` 结算，不收取单次请求、输入、缓存写入、缓存读取或输出费用。

活动结束后，该模型将恢复标准价格；标准参考价请查看[定价与用量](./pricing-and-usage.md)。
</ActivityCard>

<ActivityCard
  variant="free"
  title="Hy3"
  status="免费活动"
  detail="0 Credits"
>
活动开始时间：2026 年 8 月 21 日。

本活动覆盖 B.AI Chat 和 API：

* **Chat：** 活动期间使用 Hy3，按 `0 Credits` 结算。
* **API：** 活动期间使用按 `0 Credits` 结算，不收取单次请求、输入、缓存写入、缓存读取或输出的费用。

活动结束后，Hy3 将恢复标准价格。详见[模型详情](./models/hy3.md)。
</ActivityCard>

<ActivityCard
  variant="free"
  title="MiMo-V2.5"
  status="免费活动"
  detail="API 已免费 · Chat 8 月 25 日开放"
>
MiMo-V2.5 免费分阶段开放：

* **API：** 自 2026 年 8 月 24 日起，MiMo-V2.5 API 调用按 `0 Credits` 结算。
* **Chat：** 免费开放日期为 2026 年 8 月 25 日，具体开放时间以实际生效为准。开放后，使用 MiMo-V2.5 按 `0 Credits` 结算。

活动结束后，MiMo-V2.5 将恢复标准价格。详见[模型详情](./models/mimo-v2.5.md)。
</ActivityCard>

<ActivityCard
  variant="free"
  title="GLM-5.3-Flash"
  status="免费活动"
  detail="API 已免费 · Chat 上架后免费"
>
本活动覆盖 B.AI API 和 Chat：

* **API：** GLM-5.3-Flash API 调用目前按 `0 Credits` 结算，不收取输入、缓存写入、缓存读取或输出 Token 费用。
* **Chat：** GLM-5.3-Flash 在 B.AI Chat 上架后免费开放，具体开放时间以模型实际上架为准；开放后，Chat 使用按 `0 Credits` 结算。

活动结束后，GLM-5.3-Flash 将恢复[模型详情](./models/glm-5-3-flash.md)中展示的价格。
</ActivityCard>

<ActivityCard
  variant="free"
  title="Qwen3.8-Flash"
  status="免费活动"
  detail="API 已免费 · Chat 上架后免费"
>
B.AI API 和 Chat 分阶段开放免费使用：

* **API：** Qwen3.8-Flash API 调用目前按 `0 Credits` 结算，不收取输入、缓存写入、缓存读取或输出 Token 费用。
* **Chat：** Qwen3.8-Flash 在 B.AI Chat 上架后免费开放，具体免费开放日期以模型实际上架为准；开放后，Chat 使用按 `0 Credits` 结算。

活动结束后，Qwen3.8-Flash 将恢复[模型详情](./models/qwen3-8-flash.md)中展示的价格。
</ActivityCard>

<ActivityCard
  variant="discount"
  title="GLM-5.2"
  status="限时折扣"
  detail="标准价 6 折"
>
活动开始时间：2026 年 8 月 12 日。

**适用范围：** 本活动适用于通过 B.AI API 和 B.AI 网页端发起的 GLM-5.2 调用。

限时活动期间，符合条件的调用按标准参考价的 60% 结算：输入 `0.84`、缓存写入 `0.84`、缓存读取 `0.168`、输出 `2.64` Credits/Token。详见[模型详情](./models/glm-5-2.md)。
</ActivityCard>

<ActivityCard
  variant="discount"
  title="GLM-5.3"
  status="限时折扣"
  detail="标准价 9 折"
>
活动开始时间：2026 年 8 月 14 日。

**适用范围：** 本活动适用于通过 B.AI API 和 B.AI 网页端发起的 GLM-5.3 调用。

限时活动期间，符合条件的调用按标准参考价的 90% 结算：输入 `1.26`、缓存写入 `1.26`、缓存读取 `0.252`、输出 `3.96` Credits/Token。详见[模型详情](./models/glm-5-3.md)。
</ActivityCard>

## 定价调整公告

<ActivityCard
  variant="adjustment"
  title="DeepSeek API 定价"
  status="分时计费"
  detail="闲时 / 忙时价格"
>
DeepSeek-V4-Pro 支持闲时与忙时分时计费，具体适用时段及最终账单以平台页面展示为准。

DeepSeek-V4-Flash 同样支持闲时与忙时分时计费，但当前处于限时免费活动，B.AI Chat 和 API 使用均免费。标准价格请查看 [DeepSeek-V4-Pro](./models/deepseek-v4-pro.md) 和 [DeepSeek-V4-Flash](./models/deepseek-v4-flash.md) 模型详情。最终账单以平台页面展示为准。
</ActivityCard>
