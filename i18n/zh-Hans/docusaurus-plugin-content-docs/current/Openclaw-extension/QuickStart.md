# 快速开始

我们的目标是：**花几分钟跟着向导点几下，让你的 AI 成功查到第一笔链上数据。**

---

## 🕹️ 准备工作

在开始之前，请确保你的电脑上已经装好了这几样基础软件（如果没有，请像装普通软件一样去官网下载安装）：

1. **OpenClaw**：你的 AI 助手软件。
2. **Node.js**（请务必安装 v20 或以上版本）：这是技能包运行的基础环境。*（极其重要，版本太低一定会报错！）*
3. **Git**：用来下载技能包的小工具。
4. **Python 3**：安装向导用来处理配置文件的小帮手。

---

## 🚀 第一步：一键通关安装

打开你电脑上的"终端"（也就是那个黑框框）。

- **苹果电脑：** 按 `Command + 空格`，在弹出的搜索框里输入 `Terminal`，按回车。

把下面这行神奇的代码**完整复制**，粘贴进去，按回车：

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

🚑 **急救包：敲完回车就报错了？** 如果屏幕提示 `command not found: node` 或 `python3`，说明你的电脑缺少上面说的基础环境。👉 [点这里看怎么解决](./FAQ.md#报错里写着-command-not-found-node-或-npm-install-失败)

如果没有报错，屏幕上会跳出英文向导。请把它当成一个文字小游戏，整个流程分 4 关：

### 🟢 第 1 关：选安装模式

屏幕会问你选哪种方式。键盘输入 `1`（普通安装），然后按回车。 这种方式最省心，能保留你以前的设置。

### 🟢 第 2 关：配置"AI 的专属保险柜"（AgentWallet）

向导会自动给你装一个叫 AgentWallet 的工具，用来安全存放 AI 的钱包钥匙。

如果你是新手，面对屏幕上的问题，闭着眼睛一路按回车，用默认值就足够了。

（🚑 报错卡住了？👉 [点这里看 AgentWallet 安装失败怎么救](./FAQ.md#agentwallet-ai-保险柜安装失败了)）

### 🟢 第 3 关：挑选工具箱（给 AI 装"手"）

屏幕会列出波场 (mcp-server-tron) 等选项。按键盘 `↑` `↓` 方向键移动，按**空格键**打勾，选完后按**回车**确认。

⚠️ **前方高能**：向导可能会突然问你要 API Key！

- **这是啥？** 它是 VIP 通行证，有了它查数据就不卡。
- **我现在没有怎么办？** 直接按回车跳过！留空完全没关系！ 绝不影响你现在的安装。

### 🟢 第 4 关：挑选技能包（给 AI 装"脑子"）

屏幕会列出 sunswap（换币）、tronscan（查数据）等技能。同样按**空格键**打勾，按**回车**确认。

遇到看不懂的密钥索要提示，统统直接按回车跳过。

当屏幕底部亮起 `Installation Complete!` 时——恭喜，通关成功！

---

## 🎉 第二步：重启并见证奇迹

安装完成后，有一步绝对不能漏：**彻底关掉你的 OpenClaw 软件，然后重新打开它。**

🚑 **急救包：AI 像个傻子？** 如果它回答"我不知道什么是 SunSwap"，99% 是因为你刚才没重启。👉 [点这里看怎么彻底重启](./FAQ.md#ai-委屈地说我没有查区块链的工具-或-我不知道什么是-sunswap)

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

1. 在终端输入 `open -e ~/.zshrc` 并回车。
2. 在弹出的记事本最下方，粘贴这行代码（注意保留双引号 `""`）：
   ```
   export TRONGRID_API_KEY="你的TronGrid_Key填在这里"
   export TRONSCAN_API_KEY="你的TronScan_Key填在这里"
   ```
3. 按 `Command + S` 保存关闭，然后重新打开终端或重启 OpenClaw 即可生效。

#### 🔧 B 类钥匙：一键生成配置文件（适用于 BANK OF AI）

如果你拿到了这把钥匙，直接在终端（黑框框）里复制并运行下面的整段代码即可（记得把中文部分替换成你的真实 Key）：

**配置 BANK OF AI：**

```bash
mkdir -p ~/.mcporter && echo '{"api_key": "你的BANKOFAI_API_KEY填在这里", "base_url": "https://api.bankofai.io/v1/"}' > ~/.mcporter/bankofai-config.json
```

---

## 还有其他卡壳的地方？

这很正常！每个人的电脑环境都不一样。

去看看 👉 **[常见问题（救火指南）](./FAQ.md)**，99% 的奇葩坑我们都已经帮你踩过，并写好解法了。
