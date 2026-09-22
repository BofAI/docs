---
title: "Skills 快速入门"
description: "按需安装 Skills，并使用 wallet-cli 配置官方钱包入口。"
---

# Skills 快速入门

需要 Node.js 20 或更新版本。选择所需 Skill，不再默认安装所有旧钱包和入门助手。

## 安装 wallet-cli

```bash
npm install -g @tron-walletcli/wallet-cli@4.14.0
wallet-cli --version
```

## 选择 Skill

```bash
npx skills add https://github.com/BofAI/skills/tree/main --skill wallet-cli -g
```

`npx skills add` 只安装 Skill 定义，不安装外部 CLI。安装后检查 `wallet-cli/SKILL.md` 的依赖版本。4.14.0 的 Skill 更新正在 [Skills PR #81](https://github.com/BofAI/skills/pull/81) 中推进；如果稳定分支仍要求 4.13.0，不要忽略版本检查或自动降级，可先按 [CLI 快速入门](/zh-Hans/x402/cli/quickstart/)直接使用 4.14.0，待对应 Skill 发布后再安装。

需要社区业务时，使用交互式选择安装：

```bash
npx skills add https://github.com/BofAI/skills/tree/main -g
```

只选择所需 Skills，并查看各自的依赖和凭据要求。SunSwap、SunPump、SunPerp、USDD 的现有实现不应被假定已经全部迁移到 wallet-cli。

## 配置及调用

按 [Wallet CLI 快速入门](/zh-Hans/x402/cli/quickstart/)在本地配置和选择账户。不要把密码、助记词、私钥粘贴到聊天中。

- 基础钱包与 TRON 操作：使用 `wallet-cli` Skill。
- x402 支付：使用 [wallet-cli x402](/zh-Hans/x402/cli/command-reference/)。
- B.AI 充值与记录：查看 `wallet-cli bai --json-schema -o json`，并配置 B.AI API Key。
- 社区业务：按对应 Skill 的实际说明配置，不能统一强制创建 agent-wallet 钱包。

旧 `bankofai-guide` 不再作为安装后的默认步骤。OpenClaw 一键安装器处于暂停维护状态，不作为新用户推荐入口。

[Skill 列表](/zh-Hans/McpServer-Skills/SKILLS/BANKOFAISkill/) · [常见问题](/zh-Hans/McpServer-Skills/SKILLS/Faq/)

{/* Preserve bookmarks to sections replaced by the wallet-cli migration guidance. */}
<span id="第-1-步安装技能库"></span>
<span id="方式一对话式安装最简单"></span>
<span id="方式二一键自动安装命令行"></span>
<span id="方式三交互式安装最精细控制"></span>
<span id="交互式安装步骤详解"></span>
<span id="验证安装"></span>
<span id="第-2-步对-ai-说出你的第一句话"></span>
<span id="-想让-ai-帮你交易"></span>
<span id="方案一给-ai-开个专用支付宝强烈推荐最安全"></span>
<span id="方案二直接把私钥贴给-ai适合老手或快速测试"></span>
<span id="-钥匙配好了怎么让它去交易"></span>
<span id="下一步"></span>
