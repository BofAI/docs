# 技能大全

你不需要写代码，不需要懂技术。只要把下面的"参考话术"复制到 AI 对话框里，回车，AI 就会自动帮你干活。

:::warning 三条铁律
BANK OF AI SKILLS 可以操作**真实的链上资产**。区块链交易一旦上链**不可撤销**——没有"撤回"按钮，没有客服回滚。

1. **永远不要把私钥粘贴到聊天窗口里。** 请使用 [wallet-cli](/zh-Hans/x402/cli/quickstart/)（相当于给 AI 开了一个专用"支付宝"，你不需要把银行卡密码直接给它）。
2. **先用假钱练手。** 每个新操作都先在 Nile 测试网上试——测试网用的是免费"游戏币"，怎么折腾都不亏。
3. **仔细看确认弹窗。** 任何花钱操作执行前，AI 都会把账单摊开给你看，你不点头它绝不动手。
:::

---

## 技能一览表

| 技能 | 能干什么 | 需要什么钥匙/密码？ |
| :--- | :--- | :--- |
| **wallet-cli** | 通过锁定版 `@tron-walletcli/wallet-cli@4.14.0` 直接完成 TRON 钱包操作——转账、质押、投票、合约、签名、链上查询（机器可读 JSON） | wallet-cli 本地管理的钱包；Agent 执行时密码仅经 stdin 传入 |
| **sunswap**<br/>安装后目录名 `sunswap-dex-trading` | 查价、报价、换币，管理 V2/V3/V4 流动性池 | 查询不需要；交易需要钱包凭证 |
| **sunpump-agent-skill**<br/>安装后目录名 `sunpump-meme-token-toolkit` | SunPump meme 币：一句话发币（服务端创建，无需钱包），查行情/排行/持有人/钱包持仓，买卖 meme 币（根据代币是否已发射自动选择兑换路线，仅 TRON 主网） | 只读查询与发币免配置；链上买卖需钱包凭证 |
| **sunperp-skill**<br/>安装后目录名 `sunperp-perpetual-futures-trading` | 看行情、开仓、平仓、提现 | 看行情不需要；交易需要 SunPerp 密钥；提现还需要 `TRON_PRIVATE_KEY` 用于签署确认 |
| **tronscan-skill**<br/>安装后目录名 `tronscan-data-lookup` | 查账户、交易、代币、区块、全网数据 | 可选 TronScan API 密钥——不配时请求走无密钥的 BofAI 代理，可能被限流 |
| **usdd-skill**<br/>安装后目录名 `usdd-just-protocol` | USDD 稳定币——PSM 1:1 USDT ↔ USDD 兑换、金库查询、余额查看 | 查询不需要；PSM 兑换需要钱包凭证 |

其中 5 个技能安装后的目录名与仓库目录名不同——**安装后的那个名字**才是你在 `~/.agents/skills` 里看到的名字，也是让助手读取技能文件时要引用的名字。

### 凭据配置

官方钱包配置见 [wallet-cli 快速入门](/zh-Hans/x402/cli/quickstart/)。不要把私钥或密码交给聊天窗口。社区项目按各自 Skill 配置：TronScan API Key、SunPerp API Key/Secret，以及 USDD 或提现所需签名参数不会自动转换成 wallet-cli 配置。

B.AI 的 API Key 在 [控制台](https://chat.bankofai.io/key)获取，通过 wallet-cli 支持的配置方式保存；不要打印或提交凭据。

## 还没安装？

去 **[快速开始](./QuickStart.md)** 花 1 分钟装一下，装完再回来挑你想用的技能。

---

## agent-wallet {#agent-wallet}

旧钱包 Skill 不再作为官方默认配置入口。新用户从 [wallet-cli 快速入门](/zh-Hans/x402/cli/quickstart/)开始。仍使用 agent-wallet 的 SDK、服务端和社区项目可查阅 [Agent Wallet 参考文档](/zh-Hans/Agent-Wallet/Intro/)。

## wallet-cli {#wallet-cli}

一个独立的 TRON 钱包工具箱。它教你的 AI 通过锁定版 `@tron-walletcli/wallet-cli@4.14.0` npm 包完成 TRON 钱包操作：账户、质押与代理状态查询，TRX/代币转账、质押与资源代理、SR 投票与治理、合约调用、消息签名、交易状态跟踪。所有命令都走 CLI 的机器可读接口（`-o json`）——AI 先看退出码、再看结构化字段，从不靠猜文本。

**绝对安全，只看不花钱：**

> 用 wallet-cli 查一下我在 Nile 上的账户余额和质押状态。

> 这笔交易上链了吗？用 wallet-cli 查下状态：`<你的-tx-id>`

> 把 wallet-cli `tx send` 命令的参数 schema 列给我看（`--json-schema`）。

**需要你确认才会执行：**

> 用 wallet-cli 在主网给 T... 转 10 TRX。

> 帮我质押 100 TRX 换能量——主网操作会先给你预览、等你明确确认。

:::tip
wallet-cli 是官方钱包与 CLI 接入入口；社区 Skill 和服务端可能仍使用各自的签名实现。按实际依赖配置，不要求所有项目同时迁移。
:::

:::caution 密码与钱包管理的硬性边界
Agent 执行时，钱包密码只能通过 `--password-stdin` 从受信来源传入——AI 不会把密码放进命令行参数、环境变量或对话里，也永远不会让你在聊天中粘贴密码、助记词或私钥。`import` / `backup` / `delete` / `change-password` 这几类根钱包管理命令**按技能策略仅限你本人执行**：即使你给出确认，AI 也不会代跑。这是技能层面的拒绝，而非 CLI 的强制锁——CLI 自身只对 `import` 与 `change-password` 强制要求 TTY，`backup` 甚至公开提供了 `--password-stdin` 的用法。主网上任何动钱的操作都会先预览、再等你明确确认。
:::

注意：wallet-cli 的规范网络标识是十进制 CAIP-2 ID——`tron:728126428`（主网）、`tron:3448148188`（Nile）、`tron:2494104990`（Shasta）；`tron:mainnet` / `tron:nile` / `tron:shasta` 仅作为输入别名被接受。这与 x402 协议元数据中的十六进制标识符（`tron:0x…`）不同；`wallet-cli x402` 仍使用 wallet-cli 的网络标识。

自 Skills 2.0.0 起，已下线的 `trc20-toolkit-skill`、`trx-staking-skill`、`multisig-permissions` 三个技能覆盖的通用 TRON 操作——TRC20/TRC10 转账与代币查询、质押与 SR 投票、账户权限管理（`permission show|update`）——均由本技能承接。

---

## sunswap {#sunswap}

想在 SunSwap 上换币、查行情、管理流动性？对 AI 说下面的话就行。本技能基于 `@sun-protocol/sun-cli`（固定 1.2.2 版），同时支持换币、V2 AMM、V3 集中流动性以及带 hooks 的 V4 池子。

**绝对安全，只看不花钱：**

> TRX 现在值多少钱？

> 100 USDT 在 SunSwap 上能换多少 TRX？

> 帮我查看 SunSwap 上收益最高的 10 个池子。

> 帮我查看我当前所有的 SunSwap V3 流动性仓位。

**需要你确认才会执行（AI 会先把账单给你看）：**

> 在 Nile 测试网上帮我把 100 TRX 兑换成 USDT。

> 在 SunSwap V2 的 TRX/USDT 池中添加 100 TRX 和 15 USDT 的流动性。

> 铸造一个 V3 仓位：TRX/USDT，0.3% 费率，全价格区间。

> 铸造 V4 仓位，如果池子不存在就用 `--create-pool` 一并创建。

> 帮我收取 V3 仓位 #12345 的手续费奖励。

**实战场景：**

> 想搬砖？ "帮我算算 100 U 在 SunSwap 换成 TRX 划不划算？"

> 想挖矿？ "SunSwap 上哪个 V3 池子年化收益最高？帮我分析一下。"

> 想抄底？ "TRX 现在什么价？再帮我看看这个池子最近 7 天的成交量变化。"

:::tip V3 费率档位与 tick 对齐
V3 仅支持 `100`、`500`、`3000`、`10000` 四档费率（对应 0.01% / 0.05% / 0.3% / 1%）。`--tick-lower` 与 `--tick-upper` 必须是对应费率的 tick 间距（1 / 10 / 60 / 200）的整数倍。AI 会在铸造前帮你校验，未对齐的 tick 会在链上直接失败。
:::

---

## sunpump-agent-skill {#sunpump-agent-skill}

想玩 SunPump 上的 meme 币？这个技能基于 `@sun-protocol/sun-cli`（固定 1.2.2 版），帮你发币、查行情、做研究、买卖 meme 币。发币（`sun sunpump launch`）在**服务端完成、无需钱包**：给出名称、符号、描述和 logo，由平台签名并广播创建交易。交易时它会**自动判断交易路径**：还没在 SunSwap V2 上创建交易对的「发射前」代币走 `sun sunpump buy/sell`，已在 SunSwap V2 建好交易对的「发射后」代币走普通 `sun swap`——下单前 AI 会先用 `sunpump state` 帮你确认走哪条路。**sunpump-agent-skill 的所有功能（查询和交易）都只支持 TRON 主网，不支持测试网。**

**绝对安全，只看不花钱：**

> SunPump 上 24 小时涨幅前 10 的 meme 币有哪些？

> 帮我查一下代币 TXYZ... 的详情：价格、市值、24h 成交量、持有人数。

> 帮我看看 TXYZ... 的持有人分布，有没有被少数地址控盘？

> 查一下钱包 T... 在 SunPump 上的持仓和最近 20 笔交易。

**需要你确认才会执行（AI 会先把账单给你看）：**

> 在 SunPump 上发一个 meme 币：名称〈你的代币名〉、符号〈SYMBOL〉、描述〈一句话介绍〉、logo 用〈你的图片路径〉。

> 帮我在 SunPump 上用 10 TRX 买入 TXYZ...（还没发射到 SunSwap 的代币）。

> 帮我卖掉 1000 个 TXYZ...，滑点放到 5%。

> 帮我买点已经发射到 SunSwap 的 TXYZ...，用 100 TRX，滑点 1%。

**实战场景：**

> 想找热门新币？ "帮我列出 SunPump 上 24h 成交量前 10 的代币，再挑第一名看看持有人集中度。"

> 想趁发射前买入？ "TXYZ... 现在是什么状态？如果还在发射前，帮我用 10 TRX 买入。"——AI 会先查 `state`，再报价，确认后才下单。

> 想盘点战绩？ "帮我看看钱包 T... 的 SunPump 持仓和买入历史。"

:::tip 发射前 vs 发射后
SunPump 代币有两种状态：**发射前**（还没在 SunSwap V2 上创建交易对，`state` = 1 TRADING 或 2 READY_TO_LAUNCH）和**发射后**（已在 SunSwap V2 建好交易对，`state` = 3 LAUNCHED）。这里的关键是 **Bonding Curve（发射进度条）**：随着社区买入，meme 币市值逐步增长，进度涨到 100% 后会自动在 SunSwap V2 上创建交易对，代币就「发射」了。AI 会自动选对命令——你不用关心细节，但理解这点能帮你看懂它的操作。
:::

:::caution meme 币风险高
meme 币波动剧烈、容易被庄家控盘。AI 在给你看代币信息时会顺带提示持有人集中度——如果前 5 名地址合计持仓超过总量的 40%，会明确警告你有 rug pull 风险。绑定曲线路径（`sunpump buy` / `sell`）默认滑点 5%；代币发射后改走 `sun swap`，默认滑点是 0.5%，买卖前请务必看清报价再确认。
:::

:::tip 关于发币（launch）
发币走 SunPump agent 端点，由平台签名并广播创建交易，**无需钱包**。名称、符号、描述必填；强烈建议提供 logo（不带 logo 的发币请求可能被 API 拒绝）。成功后 AI 会报告新代币的合约地址和创建交易哈希。与其它 SunPump 操作一样，发币**仅支持主网**——传入任何非主网 `--network` 都会在执行前被直接拒绝，连 `--dry-run` 也不例外。
:::

---

## sunperp-skill {#sunperp-skill}

想做合约？这个技能帮你看行情、开仓、平仓、设止损。脚本层硬编码的安全锁：最高 20 倍杠杆（可在 `resources/sunperp_config.json` 里调整）、**每次开仓都必须带止损**——你没指定时默认设在距开仓价 5% 的位置，超过 25% 的止损距离会被直接拒绝。平仓单（`reduce_only`）本身就是在降低风险，所以免除强制止损。

**绝对安全，只看不花钱：**

> BTC-USDT 永续合约现在什么价格？24h 涨跌和资金费率呢？

> 我的 SunPerp 账户余额和可用保证金是多少？

> 我当前有哪些未平仓位？显示开仓均价、未实现盈亏和强平价。

**需要你确认才会执行：**

> 以市价在 SunPerp 开 1 张 BTC-USDT 多单，10 倍杠杆，设置 5% 止损。

> 平掉我所有的 BTC-USDT 仓位。

> 从 SunPerp 提现 10 USDT 到我的链上地址。

**实战场景：**

> 被套牢了？ "帮我看看 BTC 现在的资金费率，建议做多还是做空？"

> 想控制风险？ "帮我把 BTC-USDT 的杠杆降到 5 倍，止损调到 3%。"

> 想了解全局？ "帮我列出所有可交易的永续合约，按 24h 成交量排序。"

---

## tronscan-skill {#tronscan-skill}

想查链上发生了什么？这个技能帮你查账户、交易、代币、区块和全网统计。**纯查询，绝对安全，不花一分钱，不需要任何密码。** 非常适合作为你的第一个技能来上手。

> 帮我查询地址 TDqSq...xxxxx 的完整账户信息和持仓。

> 查询这笔交易的详情：abc123...

> 显示市值排名前 10 的 TRC20 代币。

> 给我一份 TRON 全网概览：当前 TPS、超级代表数量、账户总数。

> 查询地址 TXX... 最近 20 笔 USDT 转账记录。

**实战场景：**

> 发现了一个新币，想看靠不靠谱？ "帮我查一下代币 TXX... 的持仓分布和合约验证状态。"

> 追踪鲸鱼动向？ "查一下地址 TXX... 最近 24 小时内超过 10 万 USDT 的所有交易。"

> 核实一笔转账？ "帮我查一下这笔交易到底成功了没有：abc123..."

---

## usdd-skill {#usdd-skill}

想玩转 TRON 生态的超额抵押稳定币 **USDD**？这个技能基于 JUST Protocol，支持通过 PSM（Peg Stability Module）进行 1:1 USDT ↔ USDD 兑换，查询金库（CDP）仓位和协议参数，查看 USDD/USDT/USDC/TRX/JST 余额。

**绝对安全，只看不花钱：**

> 帮我看看 PSM 当前状态：费率、USDT 储备金、USDD 总供应量。

> 查一下我的 USDD、USDT 和 JST 余额。

> 列出所有 USDD 金库类型（TRX-A、TRX-B、sTRX-A、USDT-A 等），以及它们的债务上限和稳定费率。

> 查一下 CDP 仓位 #42 的抵押品、债务和抵押率。

**需要你确认才会执行（AI 会先把账单给你看）：**

> 通过 PSM 用 1000 USDT 兑换 1000 USDD（零手续费）。

> 通过 PSM 把 500 USDD 赎回成 500 USDT。

**实战场景：**

> 第一次接触 USDD？ "帮我通过 PSM 用 1000 USDT 换成 USDD"——1:1 兑换，目前零手续费，自动处理 TRC20 授权。

> 查看金库健康度？ "帮我列出所有金库类型和它们的稳定费率。"（TRX-A/B/C = 5%，sTRX-A = 1%，USDT-A = 0%）

> 关注某个具体 CDP？ "查一下 CDP #42 的抵押率。"

:::tip PSM vs. 金库
PSM 支持 **USDT ↔ USDD 即时 1:1 兑换**——是获取 USDD 最简单的方式。金库/CDP 仓位（通过抵押 TRX 等资产铸造 USDD）在本技能中为只读——你可以查询，但不能直接开仓、抵押、还款。
:::

:::caution PSM 储备可能枯竭
用 USDD 赎回 USDT 前，先用 `psm-info` 查一下——如果 USDT 储备不足，`buyGem` 会失败。USDD（18 位精度）和 USDT（6 位精度）的差异，技能会自动处理。
:::

---

## x402-payment {#x402-payment}

独立支付 Skill 正在退出默认接入路径。使用 [wallet-cli 4.14 的支付流程](/zh-Hans/x402/cli/quickstart/)，先预览再授权付款；本节保留旧锚点供已有链接访问，不再要求安装独立 x402-cli。

## recharge-skill {#recharge-skill}

充值与记录查询使用 `wallet-cli bai`，通过 `--json-schema` 查询具体命令，参见 [B.AI 充值说明](/zh-Hans/x402/cli/command-reference/)。需要 wallet-cli 账户和 B.AI API Key。旧充值服务的 MCP 接口仍是独立服务能力，不因 Skill 调整而自动关闭。

## bankofai-guide {#bankofai-guide}

不再作为默认安装或首次钱包配置流程。请使用 [Skills 快速入门](/zh-Hans/McpServer-Skills/SKILLS/QuickStart/)和 [wallet-cli 配置指引](/zh-Hans/x402/cli/quickstart/)。本节保留旧锚点，避免已有链接失效。

## 推荐学习路径

**从这里开始——零风险，零配置：** 用 tronscan-skill 查账户、看交易，用 sunswap 查价格和报价。纯查询，不花钱，不需要密码。

**接下来——用假钱练手：** 配置好钱包（见 [wallet-cli 快速入门](/zh-Hans/x402/cli/quickstart/)），然后在 Nile 测试网上试试换币和流动性操作。确认 AI 的表现完全符合预期。

**然后——主网小额试水：** 用少量真实资金跑一遍完整流程，确保没有意外。

**最后——放心使用：** 日常操作，根据需要调整参数和技能组合。

---

## 下一步

- 想了解技能背后的工作原理？ → [什么是 Skills？](./Intro.md)
- 遇到问题了？ → [常见问题](./Faq.md)
- 在用 OpenClaw Extension？ → [OpenClaw Extension 文档](../../Openclaw-extension/Intro.md)

{/* Preserve bookmarks to sections replaced by the wallet-cli migration guidance. */}
<span id="-这些钥匙去哪领怎么配"></span>
