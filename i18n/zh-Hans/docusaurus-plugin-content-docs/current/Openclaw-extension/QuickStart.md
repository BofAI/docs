# 快速开始

我们的目标是：**花几分钟跟着向导点几下，让你的 AI 成功查到第一笔链上数据。**

---

## 🕹️ 准备工作

在开始之前，请确保你的电脑上已经装好了这几样基础软件（如果没有，请像装普通软件一样去官网下载安装）：

1. **OpenClaw**：你的 AI 助手软件。
2. **Node.js**（请务必安装 v18 或以上版本）：这是技能包和配置工具运行的基础环境。*（极其重要，版本太低一定会报错！）*
3. **Git**：用来下载技能包的小工具。

**Windows 用户额外注意：**
- 需要 **Windows 10**（1511 以上版本）或 **Windows 11**
- **PowerShell 5.1+**（Win10/11 自带，无需额外安装）
- 在 PowerShell 中输入 `$PSVersionTable.PSVersion` 可确认版本

---

## 🚀 第一步：一键通关安装

打开你电脑上的"终端"（也就是那个黑框框）。

- **苹果电脑 / Linux：** 按 `Command + 空格`（Mac）或在应用菜单中搜索 `Terminal`，按回车打开。
- **Windows：** 按 `Win + X`，选择 **Windows PowerShell** 或 **终端**；或者在开始菜单搜索 `PowerShell`。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="mac" label="Linux / macOS" default>

把下面这行代码**完整复制**，粘贴进终端，按回车：

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

或者从源码安装：

```bash
git clone https://github.com/BofAI/openclaw-extension.git
cd openclaw-extension
./install.sh
```

</TabItem>
<TabItem value="win" label="Windows">

把下面这行代码**完整复制**，粘贴进 PowerShell，按回车：

```powershell
irm https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.ps1 | iex
```

或者从源码安装：

```cmd
git clone https://github.com/BofAI/openclaw-extension.git
cd openclaw-extension
install.bat
```

> `install.bat` 是一个 6 行的启动器，会自动以正确的执行策略调用 `install.ps1`——你不需要手动配置任何 PowerShell 策略。

</TabItem>
</Tabs>

🚑 **急救包：敲完回车就报错了？** 如果屏幕提示 `command not found: node`（Mac/Linux）或 `node 不是内部命令`（Windows），说明你的电脑缺少上面说的基础环境。👉 [点这里看怎么解决](./FAQ.md#报错里写着-command-not-found-node-或-npm-install-失败)

如果没有报错，屏幕上会跳出安装向导。请把它当成一个文字小游戏，整个流程分 4 关：

```
🦞 OpenClaw Extension Installer (by BANK OF AI)
Smart contracts, smarter agent. No more manual ABI guessing.
```

### 🟢 第 1 关：选安装模式

屏幕会问你选哪种方式：

```
Installation Mode
  1) Normal install [Recommended]
  2) Clean install (full cleanup: MCP/skills/local config files)

? Enter choice (1-2, default: 1):
```

键盘输入 `1`（普通安装），然后按回车。这种方式最省心，能保留你以前的设置。

:::caution 什么时候选全新安装？
只有当你想**彻底推倒重来**的时候才选 `2`。全新安装会永久删除所有 MCP 配置、已装技能、API 凭证和钱包数据。安装器会让你输入 `CLEAN` 来确认——这是"你真的真的确定吗？"安全关卡：

```
? Continue with CLEAN install? (y/N): y
? Type CLEAN to confirm permanent deletion: CLEAN
```

如果你是第一次安装或只是升级——**永远选 1**。
:::

### 🟢 第 2 关：配置"AI 的专属保险柜 AgentWallet"

向导会自动给你装一个叫 AgentWallet 的工具，用来安全存放 AI 的钱包钥匙——相当于一个本地加密的保险箱，私钥永远不会发送到任何服务器。

```
Step 0: AgentWallet Setup

Launching: agent-wallet start --save-runtime-secrets
Please complete initialization in the CLI prompts.
```

你需要做 3 个简单的选择：

**① 选钱包类型** —— 直接按回车用默认值就好：

```
✔ Quick start type: local_secure — Encrypted key stored locally (recommended)
```

**② 设置主密码** —— 你可以自己输一个（需要大写+小写+数字+特殊字符，至少 8 位），也可以直接按回车自动生成：

```
✔ New Master Password (press Enter to auto-generate a strong password)
```

如果你选了自动生成，屏幕会显示类似这样的密码：

```
🔑 Your master password: GS%kE^^n3MVu03*i
⚠️ Keep this password safe. You'll need it for signing and other operations.
```

:::caution 务必记下这个密码！
主密码是打开你 AI 钱包的唯一钥匙。**丢了密码 = 丢了钱包的访问权限。** 拿笔写下来、存到密码管理器里——随便什么方式，千万别忘了。
:::

**③ 生成钱包** —— 按回车创建一个全新钱包：

```
Wallet ID (e.g. my_wallet_1) (default_secure):
✔ Import source: generate — Generate a new random private key
```

当你看到钱包列表——保险柜就配好了！

```
Wallets:
┌────────────────┬──────────────┐
│ Wallet ID      │ Type         │
├────────────────┼──────────────┤
│ default_secure │ local_secure │
└────────────────┴──────────────┘

Active wallet: default_secure

✓ AgentWallet setup completed
```

（🚑 报错卡住了？👉 [点这里看 AgentWallet 安装失败怎么救](./FAQ.md#agentwallet-安装失败了)）

### 🟢 第 3 关：挑选工具箱（给 AI 装"手"）

屏幕会显示一个多选列表，列出可安装的 MCP 服务器。它们是连接 AI 和区块链的"数据线"：

```
? Select MCP Servers to install: (Space:toggle, Enter:confirm)
❯ [x] mcp-server-tron
      Interact with TRON blockchain (wallets, transactions, smart contracts).
  [x] bnbchain-mcp
      BNB Chain official MCP (BSC, opBNB, Ethereum, Greenfield).
  [x] bankofai-recharge
      BANK OF AI recharge MCP (remote recharge tools).
```

按键盘 `↑` `↓` 方向键移动，按**空格键**打勾或取消，选完后按**回车**确认。三个默认全选——建议保持全选。

确认后，安装器会逐个配置每台服务器。下面是你会看到的具体画面：

#### mcp-server-tron（波场工具箱）

```
Configuring mcp-server-tron...
This step configures network access for TRON MCP.
? Enter TRONGRID_API_KEY (optional):
```

⚠️ **这里安装器会问你要 `TRONGRID_API_KEY`。** 这是 TronGrid 的专属访问密钥，有了它查数据就不会被限速。**现在没有？直接按回车跳过！** 完全不影响安装，以后随时补填。

配置成功后你会看到 `add-mcp` 的安装横幅和：

```
✓ Configuration saved for mcp-server-tron.
```

#### bnbchain-mcp（BNB Chain 工具箱）

```
Configuring bnbchain-mcp...
bnbchain-mcp currently does not support AgentWallet.
This server still uses PRIVATE_KEY configuration.

⚠ Your PRIVATE_KEY will be stored in plaintext in: ~/.mcporter/mcporter.json

? Enter BNB Chain PRIVATE_KEY (optional):
? Enter LOG_LEVEL (optional):
```

:::caution BNB Chain 私钥说明
跟 TRON 不同（TRON 通过 AgentWallet 加密保护），BNB Chain 目前需要把私钥以**明文**存在配置文件里。虽然文件权限已设为 600（只有你自己能读），但我们强烈建议使用一个**专用钱包，只放小额资金**。

**没有 BNB Chain 私钥？没事——两个问题都直接按回车跳过。** 以后需要时再配。
:::

```
✓ Configuration saved for bnbchain-mcp.
```

#### bankofai-recharge（充值助手）

这个全自动，不用输入任何东西！它会自动连接 BANK OF AI 的远程充值服务。

```
✓ Configuration saved for bankofai-recharge.
```

### 🟢 第 4 关：挑选技能包（给 AI 装"脑子"）

先选安装范围：

```
Select skills installation scope:
  1) User-level (global) [Recommended]
     Available to all OpenClaw workspaces
  2) Workspace-level (project)
     Only available in current workspace

? Enter choice (1-2, default: 1):
```

直接按回车（或输入 `1`）选全局安装——这样你所有 OpenClaw 工作区都能用这些技能。

然后技能选择器启动：

```
◇  Found 5 skills
│
◇  Select skills to install (space to toggle)
│  recharge-skill, SunPerp Perpetual Futures Trading, SunSwap DEX Trading,
│  TronScan Data Lookup, x402-payment
```

每个技能是干啥的：

| 技能 | 功能 |
| :--- | :--- |
| **SunSwap DEX Trading** | 在 SunSwap（波场最大的去中心化交易所）上换币 |
| **SunPerp Perpetual Futures** | 在 SunPerp 上做永续合约交易 |
| **TronScan Data Lookup** | 通过 TronScan 查链上数据 |
| **x402-payment** | x402 协议支付（Agent 间付款） |
| **recharge-skill** | 查询和充值 BANK OF AI 余额 |

选完后，安装器会显示安全风险评估：

```
◇  Security Risk Assessments
│                                     Gen        Socket        Snyk
│  recharge-skill                     Safe       1 alert       Med Risk
│  SunPerp Perpetual Futures Trading  --         --            --
│  SunSwap DEX Trading                --         --            --
│  TronScan Data Lookup               --         --            --
│  x402-payment                       Med Risk   1 alert       Med Risk
```

查看报告后确认继续。安装完成时：

```
◇  Installed 5 skills
│
│  ✓ recharge-skill → ~/.openclaw/skills/recharge-skill
│  ✓ SunPerp Perpetual Futures Trading → ~/.openclaw/skills/sunperp-perpetual-futures-trading
│  ✓ SunSwap DEX Trading → ~/.openclaw/skills/sunswap-dex-trading
│  ✓ TronScan Data Lookup → ~/.openclaw/skills/tronscan-data-lookup
│  ✓ x402-payment → ~/.openclaw/skills/x402-payment
```

技能装完后，安装器会自动进入配置环节。如果你安装了 recharge-skill，会看到：

```
recharge-skill API Key Configuration
recharge-skill uses your local BANK OF AI API key for balance and order queries.

? Enter BANKOFAI_API_KEY (optional, hidden):
```

**现在没有这个 Key？直接按回车跳过就好。** 不影响其他功能。以后拿到了 Key，可以随时通过下面「[事后怎么补填 API Key](#-事后怎么补填-api-keyvip-通行证)」章节的方式手动配置。

当屏幕底部亮起 `Installation Complete!` 时——恭喜，通关成功！

```
═══════════════════════════════════════
  Installation Complete!
═══════════════════════════════════════

✓ MCP Server configured
  Config file: ~/.mcporter/mcporter.json
    File permissions: 600 (owner read/write only)
```

---

## 🎉 第二步：重启并见证奇迹

安装完成后，有一步绝对不能漏：**彻底关掉你的 OpenClaw 软件，然后重新打开它。**

🚑 **急救包：AI 像个傻子？** 如果它回答"我不知道什么是 SunSwap"，99% 是因为你刚才没重启。Mac 按 `Command+Q`，Windows 在任务栏右键退出或按 `Alt+F4`。👉 [点这里看怎么彻底重启](./FAQ.md#ai-委屈地说我没有查区块链的工具-或-我不知道什么是-sunswap)

打开对话框，对你的 AI 发出第一个指令：

```
查一下 TRON 主网当前的区块高度。
```

如果它思考了几秒钟，然后乖乖给你报出了一串数字——太棒了！你的 AI 已经成功连上了区块链！

再试一句：

```
100 USDT 在 SunSwap 上现在能换多少 TRX？
```

---

*（以上是新手必修课。如果你已经玩转了，可以继续往下看👇）*

---

## 🛠️ 事后怎么补填 API Key（VIP 通行证）？

太懂你了！一开始安装只想随便看看，全都按回车跳过了。现在玩熟练了，想填入 API Key 享受"VIP 不限速通道"该怎么做？

### 第一步：弄清楚你需要哪把"钥匙"

| Key 名称 | 它是干嘛的？ | 去哪免费领？ |
| :--- | :--- | :--- |
| `TRONGRID_API_KEY` | 波场工具箱的高速通道，不填会被限速 | [trongrid.io](https://www.trongrid.io/) 免费注册获取 |
| `TRONSCAN_API_KEY` | TronScan 查数据技能必须用到 | [tronscan.org](https://tronscan.org/#/myaccount/apiKeys) 免费申请 |
| `BANKOFAI_API_KEY` | 给 BANK OF AI 充值或查余额用 | [chat.bankofai.io/key](https://chat.bankofai.io/key) 登录后获取 |

### 第二步：把钥匙填进系统里

拿到对应的 Key 后，根据它的类型，选择下面简单的方法填进去。**填完后千万记得重启 OpenClaw！**

#### 🔧 A 类钥匙：填入"隐形便签"（适用于 TRONGRID 和 TRONSCAN）

<Tabs>
<TabItem value="mac" label="Linux / macOS" default>

1. 在终端输入 `open -e ~/.zshrc` 并回车。
2. 在弹出的记事本最下方，粘贴这行代码（注意保留双引号 `""`）：
   ```
   export TRONGRID_API_KEY="你的TronGrid_Key填在这里"
   export TRONSCAN_API_KEY="你的TronScan_Key填在这里"
   ```
3. 按 `Command + S` 保存关闭，然后重新打开终端或重启 OpenClaw 即可生效。

</TabItem>
<TabItem value="win" label="Windows">

1. 按 `Win + R`，输入 `sysdm.cpl`，回车打开系统属性。
2. 点 **高级** 选项卡 → **环境变量**。
3. 在"用户变量"中点 **新建**，分别添加：
   - 变量名：`TRONGRID_API_KEY`，变量值：你的 TronGrid Key
   - 变量名：`TRONSCAN_API_KEY`，变量值：你的 TronScan Key
4. 确定保存，然后重启 OpenClaw 即可生效。

或者直接在 PowerShell 中运行（永久写入用户环境变量）：

```powershell
[Environment]::SetEnvironmentVariable("TRONGRID_API_KEY", "你的TronGrid_Key填在这里", "User")
[Environment]::SetEnvironmentVariable("TRONSCAN_API_KEY", "你的TronScan_Key填在这里", "User")
```

</TabItem>
</Tabs>

#### 🔧 B 类钥匙：一键生成配置文件（适用于 BANK OF AI）

如果你拿到了这把钥匙，直接在终端里复制并运行下面的代码即可（记得把中文部分替换成你的真实 Key）：

**配置 BANK OF AI：**

<Tabs>
<TabItem value="mac" label="Linux / macOS" default>

```bash
mkdir -p ~/.mcporter && echo '{"api_key": "你的BANKOFAI_API_KEY填在这里", "base_url": "https://chat.bankofai.io/"}' > ~/.mcporter/bankofai-config.json
```

</TabItem>
<TabItem value="win" label="Windows">

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.mcporter" | Out-Null
'{"api_key": "你的BANKOFAI_API_KEY填在这里", "base_url": "https://chat.bankofai.io/"}' | Out-File -Encoding utf8 "$env:USERPROFILE\.mcporter\bankofai-config.json"
```

</TabItem>
</Tabs>

---

## 📋 配置文件速查表

安装完成后，以下文件会被写入你的电脑。所有敏感文件的权限都设为 `600`（Mac/Linux）或仅限当前用户访问的 ACL（Windows）：

<Tabs>
<TabItem value="mac" label="Linux / macOS" default>

| 文件 | 存了什么 |
| :--- | :--- |
| `~/.mcporter/mcporter.json` | MCP 服务器配置（包括 BNB Chain 私钥，如果你填了的话） |
| `~/.x402-config.json` | x402-payment 的 API 凭证 |
| `~/.mcporter/bankofai-config.json` | BANK OF AI 的 API Key |
| `~/.openclaw/skills/` | 全局安装的技能包 |
| `.openclaw/skills/` | 工作区级别的技能包（选了选项 2 才有） |
| `~/.agent-wallet/` | AgentWallet 加密钱包数据 |

</TabItem>
<TabItem value="win" label="Windows">

| 文件 | 存了什么 |
| :--- | :--- |
| `%USERPROFILE%\.mcporter\mcporter.json` | MCP 服务器配置（包括 BNB Chain 私钥，如果你填了的话） |
| `%USERPROFILE%\.x402-config.json` | x402-payment 的 API 凭证 |
| `%USERPROFILE%\.mcporter\bankofai-config.json` | BANK OF AI 的 API Key |
| `%USERPROFILE%\.openclaw\skills\` | 全局安装的技能包 |
| `.openclaw\skills\` | 工作区级别的技能包（选了选项 2 才有） |
| `%USERPROFILE%\.agent-wallet\` | AgentWallet 加密钱包数据 |

</TabItem>
</Tabs>

---

## 🔒 安全小贴士

- **使用专用代理钱包**，只放小额 Gas 费——绝对不要用你的个人主钱包。
- **BNB Chain 私钥是明文存储的**，放在 `mcporter.json` 里。请用只存少量资金的钱包。
- **先在测试网试跑**（TRON 用 Nile 测试网，BNB Chain 用 BSC Testnet），确认没问题再上真钱。
- **主密码就是一切**——丢了就等于丢了钱包访问权限。找个安全的地方记下来。
- **Windows 用户**：安装器会自动通过 `icacls` 将敏感配置文件设为仅当前用户可读写（等同于 Mac/Linux 的 `chmod 600`）。不需要管理员权限，也不会修改系统文件。

---

## 还有其他卡壳的地方？

这很正常！每个人的电脑环境都不一样。

去看看 👉 **[常见问题](./FAQ.md)**，99% 令人头疼的问题我们都已经遇到过，并写好解法了。
