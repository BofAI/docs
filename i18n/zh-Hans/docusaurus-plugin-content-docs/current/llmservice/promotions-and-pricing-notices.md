import ActivityCard from '@site/src/components/ActivityCard';

# 活动与调整公告

本页汇总当前生效及已公布的近期活动和定价调整公告。[定价与用量](./pricing-and-usage.md)页面的价格总表以模型提供方官方原价为基准，展示 B.AI 标准参考价。相关折扣或限时活动将在本页及网站的折扣分组中展示。具体适用价格、优惠规则及最终费用，以平台页面展示和实际账单为准。

:::info 活动有效期
折扣活动可能调整或结束，恕不另行通知。运行大型批量作业前，请查看 B.AI 平台展示的当前价格及活动有效期。详见[官网模型价格](https://chat.b.ai/key)。
:::

## 活动

:::info 活动展示规则
本栏目展示当前生效及已公布的近期活动：免费活动优先，折扣活动按优惠力度由高至低排列。
:::

<ActivityCard
  variant="discount"
  title="Hy4 Flash"
  status="限时折扣"
  detail="5 折"
>

**优惠截止时间：2026 年 11 月 30 日 12:00（北京时间，UTC+8）。**

活动期间，Hy4 Flash 的 Token 计费项按标准参考价的 50% 结算，包括输入、输出、缓存写入和缓存读取。本次活动仅适用于 `hy4-flash`。

| 计费项 | 活动价格（USD / 1M Tokens） |
| :--- | ---: |
| 输入 | `$0.035` |
| 缓存写入 | `$0.035` |
| 缓存读取 | `$0.0015` |
| 输出 | `$0.1405` |

优惠结束后恢复按标准参考价结算。[定价与用量](./pricing-and-usage.md)价格总表和[模型详情](./models/hy4-flash.md)继续展示原价。具体适用规则及最终费用，以平台页面展示和实际账单为准。
</ActivityCard>

<ActivityCard
  variant="discount"
  title="Hy4"
  status="限时折扣"
  detail="5 折"
>
Hy4 的 Token 计费项按标准参考价的 50% 结算，包括输入、输出、缓存写入和缓存读取。本次活动仅适用于 `hy4`，不包含 `hy4-preview`。

| 计费项 | 活动价格（USD / 1M Tokens） |
| :--- | ---: |
| 输入 | `$0.4170` |
| 缓存写入 | `$0.4170` |
| 缓存读取 | `$0.0210` |
| 输出 | `$1.2505` |

活动价格按对应官方原价的 50% 计算，统一保留四位小数。

[定价与用量](./pricing-and-usage.md)价格总表和[模型详情](./models/hy4.md)中的标准价格表继续展示原价。活动周期、实际结算价格及最终账单以平台页面展示为准。
</ActivityCard>

<ActivityCard
  variant="discount"
  title="DeepSeek-V4.1-Flash"
  status="限时折扣"
  detail="5 折"
>

活动期间，输入、输出、缓存写入和缓存读取均按对应空闲时段或高峰时段标准参考价的 50% 结算，活动价格随 DeepSeek 峰谷计价同步变化。

以下活动价格均以美元计价，单位为每 100 万 Token。

| <span style={{whiteSpace: 'nowrap'}}>计费时段</span> | 输入 | 缓存写入 | 缓存读取 | 输出 |
| :--- | ---: | ---: | ---: | ---: |
| 空闲时段 | `$0.075` | `$0.075` | `$0.0015` | `$0.30` |
| 高峰时段 | `$0.15` | `$0.15` | `$0.003` | `$0.60` |

[定价与用量](./pricing-and-usage.md)价格总表和[模型详情](./models/deepseek-v4-1-flash.md)继续展示标准参考价，实际结算价格及最终账单以平台页面展示为准。
</ActivityCard>

<ActivityCard
  variant="discount"
  title="GLM-5.3-Flash"
  status="限时折扣"
  detail="6 折"
>
符合条件的 GLM-5.3-Flash API 和 Chat 使用按标准参考价的 60% 结算。

标准价格详见[模型详情](./models/glm-5-3-flash.md)。
</ActivityCard>

<ActivityCard
  variant="discount"
  title="Qwen3.8-Flash"
  status="限时折扣"
  detail="10 月 22 日 17:00 起 8 折"
>
活动于 2026 年 10 月 22 日 17:00（北京时间，UTC+8）起生效。

自生效时间起，Qwen3.8-Flash 在 B.AI API 和 Chat 中的使用按标准参考价的 80% 结算；生效前仍按现行活动规则结算。

[定价与用量](./pricing-and-usage.md)价格总表和[模型详情](./models/qwen3-8-flash.md)继续展示标准参考价。
</ActivityCard>

<ActivityCard
  variant="discount"
  title="Qwen4-Max"
  status="限时折扣"
  detail="9 折"
>
Qwen4-Max 的 Token 计费项按标准参考价的 90% 结算，包括输入、输出、两种时长的显式缓存写入和缓存读取。

| 计费项 | 活动价格（USD / 1M Tokens） |
| :--- | ---: |
| 普通输入 | `$1.35` |
| 输出 | `$4.05` |
| 显式缓存写入（5 分钟） | `$1.6875` |
| 显式缓存写入（1 小时） | `$2.70` |
| 缓存读取（隐式或显式） | `$0.0675` |

[定价与用量](./pricing-and-usage.md)价格总表及[模型详情](./models/qwen4-max.md)中的标准价格表继续展示原价。活动周期、具体适用规则及最终账单以平台页面展示为准。
</ActivityCard>
