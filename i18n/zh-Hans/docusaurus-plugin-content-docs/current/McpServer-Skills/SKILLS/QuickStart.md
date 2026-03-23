# 快速开始

只需 **2 步**，不到 **1 分钟**，你的 AI 就能开始帮你查链上数据、看行情报价。不需要密码，不需要配置任何东西——装完就能用。

---

## 第 1 步：安装技能库

**如果你正在使用 OpenClaw（我们最推荐的 AI 客户端），请直接使用下面这种最简单的傻瓜式安装：通过 OpenClaw Extension 安装**

打开你电脑上的"终端"（就是那个黑框框）。

:::tip 找不到终端？别慌
**苹果电脑：** 按 `Command + 空格`，在弹出的搜索框里输入 `Terminal`，按回车，黑框框就出来了。
**Windows 电脑：** 按 `Win + R`，在弹出的小窗口里输入 `cmd`，按回车。
:::

把下面这串长长的代码**整行复制**，粘贴到黑框框里，按回车：

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

屏幕上会跳出一堆英文字母——**不用管它们**，等它停下来就行。安装器会一步步问你要装哪些组件，跟着提示按回车确认即可。

装完后，黑框框里输入这行来验证：

```bash
ls ~/.openclaw/skills
```

如果看到 `sunswap`、`tronscan-skill` 等目录名出现——恭喜，安装成功！

<details>
<summary>用的不是 OpenClaw？点这里看其他安装方式</summary>

**Claude Code：**

```bash
git clone https://github.com/BofAI/skills.git /tmp/bofai-skills
mkdir -p ~/.config/claude-code/skills
cp -r /tmp/bofai-skills/* ~/.config/claude-code/skills/
```

**Cursor：**

```bash
git clone https://github.com/BofAI/skills.git .cursor/skills
```

在 Cursor Chat 中用 `@` 引用具体的 `SKILL.md` 文件即可。

**任何 AI 工具（通用方式）：**

```bash
git clone https://github.com/BofAI/skills.git ~/bofai-skills
```

然后在对话中直接告诉 AI：`请读取 ~/bofai-skills/sunswap/SKILL.md，帮我查一下 TRX 当前的价格。`

</details>

---

## 第 2 步：对 AI 说出你的第一句话

打开你的 AI 对话框，把下面这句话复制进去，回车：

> 给我一份 TRON 全网概览：当前 TPS、超级代表数量、账户总数。

几秒后，AI 会自动调用 tronscan-skill，为你呈现一份完整的链上数据报告。

**这个操作绝对安全——它只是帮你"看"数据，不碰你的钱包，不花一分钱。**

再试几句：

> 100 USDT 在 SunSwap 上能换多少 TRX？

> 显示市值排名前 10 的 TRC20 代币。

> BTC-USDT 永续合约的当前价格、24h 涨跌幅和资金费率是多少？

如果 AI 返回了真实数据——恭喜，你的 AI 已经"开窍"了！

---

## 💰 想让 AI 帮你交易？

上面所有的操作都是"只看不动"的——AI 能帮你查数据、比价格，但它现在还没有权限动你的一分钱。这是故意的：控制权始终在你手里。

当你准备好让 AI 帮你换币、开仓、管理流动性时，你需要给它配一把"钱包钥匙"。

我们为你准备了两种给钥匙的方法，任选其一即可：

### 方案一：给 AI 开个专用"支付宝"（强烈推荐，最安全）

我们推荐使用 **Agent Wallet**。你可以把它理解成给 AI 开了一个专属的支付账户。你不需要把银行卡密码（明文私钥）直接暴露在电脑文件里，而是给它设置一个支付密码。每次花钱前，它都会把账单摊开给你看，你说"好"它才会操作。

👉 前往 [Agent Wallet 快速开始](../../Agent-Wallet/QuickStart.md) 设置（有可视化界面，大约 2 分钟搞定）。

### 方案二：直接把私钥贴给 AI（适合老手或快速测试）

如果你嫌麻烦，不想装新工具，只想马上体验交易，你也可以像改普通记事本一样，直接把你的私钥贴在电脑的"隐形便签"里：

**🍎 苹果电脑 (Mac) 用户：**

1. 在终端（黑框框）输入 `open -e ~/.zshrc` 并按回车。
2. 电脑会弹出一个记事本窗口。滑到最底下，新起一行，把你的波场私钥粘贴进去：
   ```bash
   export TRON_PRIVATE_KEY="你的真实或测试网私钥"
   ```
   ⚠️ 注意：两边的英文双引号千万别漏掉！
3. 按 `Command + S` 保存，关掉记事本。

**🪟 Windows 电脑 (WSL) 用户：**

1. 在 WSL 终端输入 `notepad.exe ~/.bashrc` 并按回车。
2. 在弹出的记事本最底下，粘贴同样的代码：
   ```bash
   export TRON_PRIVATE_KEY="你的真实或测试网私钥"
   ```
3. 按 `Ctrl + S` 保存，关掉记事本。

:::danger 极其重要的一步
无论你用哪种方案配好了钥匙，都必须**彻底关闭并重新打开你的 AI 软件**，它才能拿到这把新钥匙！
:::

---

## 🎮 钥匙配好了，怎么让它去交易？

配好钥匙并重启 AI 后，你就可以直接对它下达交易指令了！

:::caution 新手铁律：先用假钱练手
在执行任何真实交易之前，**务必先在 Nile 测试网上跑一遍**。测试网用的是没有真实价值的"游戏币"，怎么折腾都不会亏钱。
:::

打开对话框，对 AI 喊出你的第一句交易指令：

> 在 Nile 测试网上，帮我把 100 TRX 兑换成 USDT。

此时，AI 会迅速帮你计算价格、预估手续费，然后停下来问你："确定要执行吗？" 你只需要回复"确定"，这笔链上交易就自动完成了！

等你在测试网上玩熟了，确认 AI 的表现完全符合预期，以后只要把指令里的"测试网"三个字去掉，它就会帮你操作主网的真金白银了。

---

## 下一步

- 看看每个技能都能帮你干什么 → [技能大全](./BANKOFAISkill.md)
- 遇到问题了？ → [常见问题](./Faq.md)
