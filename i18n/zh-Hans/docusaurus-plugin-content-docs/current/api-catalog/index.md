---
title: API 目录介绍
sidebar_label: 介绍
description: BANK OF AI 的钱包原生服务目录 —— AI Agent 在这里发现、调用并为任意 API 按次付费，通过 x402 在链上结算。
---

# API 目录

传统 API 的门槛是为人设计的：注册账号、申请 API Key、绑定信用卡、按月订阅。可一个 AI Agent 想自主调用一个接口时，光是「开户」这一步就走不通——它没有邮箱、没有信用卡，也不该替你保管一长串密钥。

**API 目录**（API Catalog）是 BANK OF AI 的钱包原生服务目录。AI Agent 在这里发现服务、按名称调用、按次付费，每一笔调用都通过 x402 在链上结算。没有账号，没有 API Key，**钱包即身份**。目录同时覆盖 TRON 与 BNB Chain。

## 它解决什么

- **对 Agent / 开发者**：在一个目录里发现所有可调用的服务，按次付费，无需为每个服务单独注册和管理密钥。
- **对服务方**：把已有 API 上架为可被 Agent 直接发现、调用、付费的服务，款项直接结算到自己的钱包，且无需改动一行代码。

## 它怎么运作

目录本身只是一份公开的服务清单：不保存数据库，也不接收任何上游密钥——它负责让服务被发现，不经手调用和资金。

服务方向目录仓库提交两份**公开**文件即可上架（可先填表申请，由我们联系协助）；文件里的调用地址指向所选网关——BANK OF AI 官方托管或自建均可。平台自动校验、扫描敏感信息后对外发布：

```text
服务方                         目录仓库 (CI)                 分发
─────────                     ─────────────                ────────
catalog.json   ──提交 PR──►   字段校验 + 密钥扫描   ──►   /api/catalog.json
pay.md                        构建静态快照 dist/          /api/providers/<fqn>.json
                                                          /api/pay/<fqn>.json · .md
                                                                    │
                                            ┌───────────────────────┼───────────────────────┐
                                            ▼                       ▼                        ▼
                                       前端目录站              x402-cli                 MCP（Agent 接入）
```

三个消费入口共用同一份数据：

- **[前端目录站](https://bankofai.io/catalog)**：给人浏览、比较服务。
- **x402-cli**：在命令行里搜索、查看、直接付费调用。
- **MCP**：一次安装，让 Agent 直接「看到」并按名称调用目录内的全部服务。

## 目录里有什么

目录覆盖 AI 模型、数据、计算、网页工具、消息、DeFi 等多个类目。当前在架的典型服务：

| 服务 | 类目 | 它能做什么 | 计费 |
|---|---|---|---|
| LLM Aggregator | AI | 兼容 OpenAI 的 API，覆盖 Anthropic、OpenAI、Google、DeepSeek 等多个前沿模型 | 按 token |
| SunPump · Create Token | DeFi | 在 SunPump 上发行 Meme 代币（名称、符号、描述、图片） | 按次（敬请期待） |
| SUN Swap | DeFi | 通过 SUN 协议在 TRON 上完成兑换、做市与挖矿 | 按次 |
| Wolfram\|Alpha | Compute | 数学、科学与事实查询的计算引擎 | 按次 |
| ScreenshotOne | Web Tools | 把任意网页截成高清图片 | 按张 |
| Textbelt SMS | Messaging | 向任意手机号发送短信，无需 A2P 注册 | 按条 |
| 2Captcha | Web Tools | 程序化识别图形验证码、reCAPTCHA、hCaptcha | 按次 |

:::note
在架服务清单与统计数字（服务数、链数等）均由目录数据**动态生成**，以 `/api/catalog.json` 的实时内容为准，本文不写死具体数量。
:::

## 下一步

- 想让你的 Agent 用上这些服务 → [快速开始](./get-started.md)
- 想把自己的 API 上架变现 → [上架你的服务](./list-your-service.md)
- 想了解数据结构与接口细节 → [数据格式与 API 参考](./reference.md)
