---
title: "AI Agent 支付快速入门"
description: "使用 wallet-cli 4.14 配置 Agent 的支付入口。"
---

# AI Agent 支付快速入门

新的支付入口使用 **wallet-cli 4.14.0**，无需安装独立 x402-cli。钱包配置与签名由 wallet-cli 管理，Agent 负责选择命令、预览支付并解释结果。

1. 按 [Wallet CLI 快速入门](/zh-Hans/wallet-cli/quickstart/)安装 CLI，在本地配置账户并核对地址。
2. 如需 Skill，按 [Skills 快速入门](/zh-Hans/McpServer-Skills/SKILLS/QuickStart/)选择安装；核对 Skill 的依赖版本与 CLI 一致。
3. 从 [API Catalog](/zh-Hans/x402/api-catalog/get-started/)查询接口，先运行 `wallet-cli x402 pay` 的 `--dry-run` 预览。
4. 向用户展示网络、收款地址、币种、金额和费用；得到相应授权后，使用已批准的安全密码来源进行签名。
5. 检查结构化结果，保留交易哈希；不要把“已提交”或“入账未确认”报告为全部完成。

可以这样要求 Agent：

> 使用 wallet-cli 4.14 查看 DIA 的 BTC 报价接口。先预览 TRON 主网 USDT 支付要求，上限 0.01，不要付款。

不要把私钥或主密码输出到聊天、日志或命令参数中。无需为了验证配置而执行 `echo` 打印私钥。测试支付应使用你控制的测试网收费接口；目录中的生产服务可能只支持主网。

出现 `paymentStatus: "unknown"` 或 `retryPayment: false` 时，先核对原交易；不要让 Agent 自动重新支付。

- [命令参考](/zh-Hans/wallet-cli/command-reference/)
- [为服务端接入 x402](/zh-Hans/x402/getting-started/quickstart-for-sellers/)
- [x402 SDK](/zh-Hans/x402/sdk-features/)

{/* Preserve bookmarks to sections replaced by the wallet-cli migration guidance. */}
<span id="前置准备"></span>
<span id="1-创建代理专用钱包"></span>
<span id="第一步配置私钥"></span>
<span id="第二步安装-x402-payment-技能"></span>
<span id="一键自动安装推荐"></span>
<span id="交互式安装"></span>
<span id="第三步测试代理自主付款"></span>
<span id="31-使用付费接口测试"></span>
<span id="32-验证付款是否成功"></span>
<span id="安全最佳实践"></span>
<span id="故障排查"></span>
<span id="下一步"></span>
<span id="参考资料"></span>
