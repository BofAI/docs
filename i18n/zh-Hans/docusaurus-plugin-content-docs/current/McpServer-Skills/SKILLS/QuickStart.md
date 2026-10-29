---
title: "Skills 快速入门"
sidebar_label: "快速入门"
description: "按需安装 Skills，并使用 wallet-cli 配置官方钱包入口。"
---

# Skills 快速入门

需要 Node.js 22.23.4+（22.x）、24.22.1+（24.x）或 26.12.1+。选择所需 Skill，不再默认安装所有旧钱包和入门助手。

## 安装 wallet-cli

```bash
npm install -g @tron-walletcli/wallet-cli@4.14.0
wallet-cli --version
```

:::tip 安装时报权限错误？
在 macOS 或 Linux 上，如果 `npm install -g` 报权限错误（如 `EACCES`），请参考 npm 官方文档：[Resolving EACCES permissions errors when installing packages globally](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)。
:::

## 选择 Skill

```bash
npx skills add https://github.com/BofAI/skills/tree/main --skill wallet-cli -g
```

`npx skills add` 只安装 Skill 定义，不安装外部 CLI。自 Skills 3.0.0 起，`wallet-cli` Skill 固定依赖 `@tron-walletcli/wallet-cli@4.14.0`，与上面安装的版本一致。请保留 `/tree/main` 后缀：仓库默认分支是 `develop`，其中可能包含尚未发布、且固定到其他 CLI 版本的 Skill。

需要 DeFi 与数据业务（SunSwap、SunPump、SunPerp、TronScan、USDD）时，使用交互式选择安装：

```bash
npx skills add https://github.com/BofAI/skills/tree/main -g
```

只选择所需 Skills，并查看各自的依赖和凭据要求。SunSwap、SunPump、SunPerp、USDD 的现有实现不应被假定已经全部迁移到 wallet-cli。

`npx skills add` 不会做的两步，需要自己完成：

- **sun-cli**：SunSwap 和 SunPump Skill 要求版本恰好为 1.2.2（用 `sun --version` 检查）：`npm install -g @sun-protocol/sun-cli@1.2.2`。
- **Node 依赖**：SunPerp、TronScan、USDD Skill 需要在各自安装目录里执行 `npm install`，例如 `cd ~/.agents/skills/tronscan-data-lookup && npm install`。

## 配置及调用

按 [Wallet CLI 快速入门](/zh-Hans/wallet-cli/quickstart/)在本地配置和选择账户。不要把密码、助记词、私钥粘贴到聊天中。

- 基础钱包与 TRON 操作：使用 `wallet-cli` Skill。该 Skill 本身只覆盖 TRON 钱包流程；`x402`、`bai`、`8004` 是 wallet-cli 的命令组，不在 Skill 范围内，请按下面各自的参考文档使用。
- x402 支付：使用 [wallet-cli x402](/zh-Hans/wallet-cli/command-reference/)。
- B.AI 充值与记录：用 `wallet-cli bai --help` 查看 `bai` 下的命令（单个命令的输入 schema 用 `wallet-cli bai recharge --json-schema`；`wallet-cli bai --json-schema` 返回的是完整命令目录，而不只是 `bai`），并配置 B.AI API Key。
- DeFi 与数据业务：按对应 Skill 的说明配置。

Skills 3.0.0 已删除 `bankofai-guide`、`agent-wallet`、`x402-payment` 和 `recharge-skill`，当前技能列表见[技能大全](/zh-Hans/McpServer-Skills/SKILLS/BANKOFAISkill/)。OpenClaw 一键安装器处于暂停维护状态，不作为新用户推荐入口。

[Skill 列表](/zh-Hans/McpServer-Skills/SKILLS/BANKOFAISkill/) · [常见问题](/zh-Hans/McpServer-Skills/SKILLS/Faq/)
