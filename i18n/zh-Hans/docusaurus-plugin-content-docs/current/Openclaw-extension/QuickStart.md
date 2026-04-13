# 快速开始

我们的目标是：**花几分钟跟着向导点几下，让你的 AI 成功查到第一笔链上数据。**

---

## 🕹️ 准备工作

在开始之前，请确保你的电脑上已经装好了以下几种基础软件（如果没有，请像装普通软件一样去官网下载安装）：

1. **OpenClaw**：你的 AI 助手软件。
2. **Node.js**（请务必安装 v18 或以上版本）：这是技能包和配置工具运行的基础环境。*（极其重要，版本太低一定会报错！）*
3. **Git**：用来下载技能包的小工具。

**Windows 用户额外注意：**
- 需要 **Windows 10**（1511 以上版本）或 **Windows 11**
- **PowerShell 5.1+**（Win10/11 自带，无需额外安装）
- 在 PowerShell 中输入 `$PSVersionTable.PSVersion` 可确认版本

---

## 🚀 第一步：运行智能安装向导

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

- **普通安装（1）**：保留你以前的设置，适合首次安装或升级。
- **全新安装（2）**：彻底推倒重来，删除所有 MCP 配置、已装技能、API 凭证和钱包数据。

:::tip 第一次安装选哪个？
第一次安装选 `1` 或 `2` 效果一样。如果你之前装过想重新来过，选 `2`。
:::

如果你选了 `2`（全新安装），安装器会先列出将被删除的内容，然后要求你两次确认：

```
The following data will be permanently deleted:
  • ALL MCP entries in: ~/.mcporter/mcporter.json
  • ALL installed skills (global and workspace)
  • x402 config file: ~/.x402-config.json
  • BANK OF AI local config: ~/.mcporter/bankofai-config.json
  • AgentWallet config will be overwritten by: agent-wallet start --override --save-runtime-secrets

? Continue with CLEAN install? (y/N): y
? Type CLEAN to confirm permanent deletion: CLEAN
```

确认后，安装器会自动清理旧技能：

```
Running cleanup...

◇  Found 11 unique installed skill(s)
◇  Removal process complete
◆  Successfully removed 11 skill(s)

✓ Clean install cleanup completed.

Clean complete — proceeding with fresh setup...
```

然后运行 `agent-wallet reset` 彻底删除旧的钱包数据：

```
Step 0: AgentWallet Setup

Launching: agent-wallet reset
This will delete ALL wallet data in: ~/.agent-wallet

✔ Are you sure you want to reset? This cannot be undone. Yes
✔ Really delete everything? Last chance! Yes
  Deleted: master.json
  Deleted: wallets_config.json
  Deleted: runtime_secrets.json
  ...

Wallet data reset complete.
```

清理完成后，自动进入下一步——钱包初始化。

如果你选了 `1`（普通安装），则直接跳到下一步。

### 🟢 第 2 关：配置 AgentWallet（AI 的专属钱包保险柜）

向导会自动给你装一个叫 AgentWallet 的工具，用来安全存放 AI 的钱包钥匙——相当于一个本地加密的保险箱，私钥永远不会发送到任何服务器。

```
Step 0: AgentWallet Setup

Launching: agent-wallet start --override --save-runtime-secrets
Please complete initialization in the CLI prompts.
```

**① 选钱包类型** —— 直接按回车用默认值就好：

```
✔ Quick start type: local_secure — Encrypted key stored locally (recommended)
```

**② 设置主密码** —— 你可以自己输一个（需要大写+小写+数字+特殊字符，至少 8 位），也可以直接按回车自动生成：

```
✔ New Master Password (press Enter to auto-generate a strong password)

Wallet initialized!
```

**③ 给钱包起个名字** —— 输入一个 Wallet ID（比如 `my_wallet_1`），或者直接按回车使用默认名称 `default_secure`：

```
Wallet ID (e.g. my_wallet_1) (default_secure): my_wallet_1
```

**④ 生成钱包** —— 按回车创建一个全新钱包：

```
✔ Import source: generate — Generate a new random private key
```

当你看到钱包列表——保险柜就配好了！

```
Wallets:
┌─────────────┬──────────────┐
│ Wallet ID   │ Type         │
├─────────────┼──────────────┤
│ my_wallet_1 │ local_secure │
└─────────────┴──────────────┘

🔑 Your master password: 7#KQoc&%m4S7$Dhk
⚠️ Keep this password safe. You'll need it for signing and other operations.

Active wallet: my_wallet_1

✓ AgentWallet setup completed
```

如果你在第 ② 步选了自动生成密码，这里会显示系统为你生成的主密码。

:::caution 务必记下这个密码！
主密码是打开你 AI 钱包的唯一钥匙。**丢了密码 = 丢了钱包的访问权限。** 拿笔写下来、存到密码管理器里——随便什么方式，千万别忘了。
:::

:::tip 升级安装时看到 "Wallet already initialized."？
如果你之前已经装过 AgentWallet，选普通安装后向导会跳过密码设置，直接让你输入 Wallet ID 并生成钱包。之前的主密码和已有钱包都会保留。
:::

（🚑 报错卡住了？👉 [点这里看 AgentWallet 安装失败怎么解决](./FAQ.md#agentwallet-安装失败了)）

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

按键盘 `↑` `↓` 方向键移动，按**空格键**选中（显示 X）或取消，选完后按**回车**确认。三个默认全选——建议保持全选。

确认后，安装器会逐个配置每台服务器。下面是你会看到的具体画面：

#### mcp-server-tron（波场工具箱）

这个全自动，不需要输入任何信息！安装器会直接添加 TRON MCP 服务器：

```
Configuring mcp-server-tron...
Adding MCP server...
✓ Configuration saved for mcp-server-tron.
```

:::tip 想要更快的查询速度？
安装后你可以自行配置 `TRONGRID_API_KEY` 来获取 TronGrid 专属访问通道——没有它的话，高频查询可能会被限速。配置方法见下方「[事后怎么补填 API Key](#-事后怎么补填-api-keyvip-通行证)」。
:::

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
◇  Found 8 skills
│
◇  Select skills to install (space to toggle)
│  agent-wallet, Multi-Sig & Account Permissions, recharge-skill, SunPerp Perpetual Futures Trading,
│  SunSwap DEX Trading, TRC20 Token Toolkit, TronScan Data Lookup, x402-payment
```

每个技能是干啥的：

| 技能 | 功能 |
| :--- | :--- |
| **agent-wallet** | AgentWallet 钱包管理操作（查看钱包、签署交易） |
| **SunSwap DEX Trading** | 在 SunSwap（波场最大的去中心化交易所）上换币 |
| **SunPerp Perpetual Futures** | 在 SunPerp 上做永续合约交易 |
| **TronScan Data Lookup** | 通过 TronScan 查链上数据 |
| **Multi-Sig & Account Permissions** | 多签钱包与账户权限管理 |
| **TRC20 Token Toolkit** | TRC20 代币发送等常用操作 |
| **x402-payment** | x402 协议支付（Agent 间付款） |
| **recharge-skill** | 查询和充值 BANK OF AI 余额 |

选完后，安装器会显示安全风险评估：

```
◇  Security Risk Assessments
│                                     Gen               Socket            Snyk
│  agent-wallet                       Med Risk          1 alert           High Risk
│  Multi-Sig & Account Permissions    --                --                --
│  recharge-skill                     Safe              1 alert           Med Risk
│  SunPerp Perpetual Futures Trading  --                --                --
│  SunSwap DEX Trading                --                --                --
│  TRC20 Token Toolkit                --                --                --
│  TronScan Data Lookup               --                --                --
│  x402-payment                       Safe              1 alert           Med Risk
```

查看报告后确认继续。安装完成时：

```
◇  Installed 8 skills
│
│  ✓ agent-wallet → ~/.openclaw/skills/agent-wallet
│  ✓ Multi-Sig & Account Permissions → ~/.openclaw/skills/multi-sig-account-permissions
│  ✓ recharge-skill → ~/.openclaw/skills/recharge-skill
│  ✓ SunPerp Perpetual Futures Trading → ~/.openclaw/skills/sunperp-perpetual-futures-trading
│  ✓ SunSwap DEX Trading → ~/.openclaw/skills/sunswap-dex-trading
│  ✓ TRC20 Token Toolkit → ~/.openclaw/skills/trc20-token-toolkit
│  ✓ TronScan Data Lookup → ~/.openclaw/skills/tronscan-data-lookup
│  ✓ x402-payment → ~/.openclaw/skills/x402-payment
```

技能装完后，安装器会自动进入配置环节：

#### recharge-skill API Key 配置

```
recharge-skill API Key Configuration
recharge-skill uses your local BANK OF AI API key for balance and order queries.
Recharge requests use the remote BANK OF AI recharge MCP endpoint.

? Enter BANKOFAI_API_KEY (optional, hidden):
```

**现在没有？直接按回车跳过。** 以后拿到了 Key 可以手动创建配置文件，详见下方「[事后怎么补填 API Key](#-事后怎么补填-api-keyvip-通行证)」。

当屏幕底部亮起 `Installation Complete!` 时——恭喜，通关成功！

```
═══════════════════════════════════════
  Installation Complete!
═══════════════════════════════════════

✓ MCP Server configured
  Config file: ~/.mcporter/mcporter.json
    File permissions: 600 (owner read/write only)

✓ Installed skills:
  • agent-wallet
  • Multi-Sig & Account Permissions
  • recharge-skill
  • TRC20 Token Toolkit
  • x402-payment
  Verify with: npx skills list -g

Next steps:
  1. Restart OpenClaw and start a new session to load new skills
  2. Test the skills:
     "Read the recharge-skill and recharge my BANK OF AI account with 1 USDT"
     "Read the x402-payment skill and explain how it works"

Repository: https://github.com/BofAI/openclaw-extension
Skills: https://github.com/BofAI/skills
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
| `~/.mcporter/bankofai-config.json` | BANK OF AI 的 API Key |
| `~/.openclaw/skills/` | 全局安装的技能包 |
| `.openclaw/skills/` | 工作区级别的技能包（选了选项 2 才有） |
| `~/.agent-wallet/` | AgentWallet 加密钱包数据 |

</TabItem>
<TabItem value="win" label="Windows">

| 文件 | 存了什么 |
| :--- | :--- |
| `%USERPROFILE%\.mcporter\mcporter.json` | MCP 服务器配置（包括 BNB Chain 私钥，如果你填了的话） |
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
