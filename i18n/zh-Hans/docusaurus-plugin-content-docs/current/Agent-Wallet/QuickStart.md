import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 快速开始

三步，从零到在 OpenClaw 聊天框里唤醒你的 Agent-wallet。不用写代码，不花一分钱 Gas 费——复制粘贴就行。

:::tip 想看 CLI 命令细节？
本页只带你跑通最短路径。免密配置、管理多个钱包、签名类型等进阶内容，请看 [CLI 命令行手册](./Developer/CLI-Reference.md)。
:::

---

## 第一步：安装并初始化钱包

### 1.1 准备环境：安装 Node.js

Agent-wallet 需要你的电脑里有 Node.js（这是一个运行环境，版本需 >= 18）。

打开终端（Mac 用户按 `Command + 空格` 搜索"终端"），输入：

```bash
node -v
```

- **如果输出 `v18.x.x` 或更高数字：** 太棒了，直接跳到 1.2！
- **如果没有输出或报错：** 别慌，去 **[Node.js 官方网站](https://nodejs.org)** 下载最新的 **LTS** 安装包，像装普通软件一样双击安装，一路"下一步"即可。装完后关掉终端重新打开，再输入 `node -v` 确认。

<details>
<summary>开发者首选：使用 nvm 安装（小白请跳过）</summary>

```bash
# 1. 安装 nvm（已有可跳过）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. 重新加载终端配置
source ~/.bashrc   # zsh 用户改成 source ~/.zshrc

# 3. 安装并切换到 Node.js 18
nvm install 18 && nvm use 18
```

</details>

### 1.2 安装 Agent-wallet

```bash
npm install -g @bankofai/agent-wallet
```

验证安装成功：
```bash
agent-wallet --help
```

看到帮助信息就说明安装好了。

### 1.3 创建你的 Agent-wallet 钱包

运行：
```bash
agent-wallet start
```

系统会引导你初始化 **Agent-wallet 钱包**。整个过程是交互式的——跟着提示走就行：

```
? Quick start type: local_secure  — Encrypted key stored locally (recommended)
Wallet ID (e.g. my_wallet_1) (default):

Wallet initialized!
? Import source: generate  — Generate a new random private key

Wallets:
┌───────────┬──────────────┐
│ Wallet ID │ Type         │
├───────────┼──────────────┤
│ default   │ local_secure │
└───────────┴──────────────┘

Your master password: <此处会显示你的专属密码>
   Save this password! You'll need it for signing and other operations.

Active wallet: default
```

:::caution 主密码 = 你所有资产的唯一钥匙
这个密码是解开所有私钥的唯一凭证。**忘了就找不回来——我们也没有备份，没有后门，神仙难救。**

请现在就做这件事：
1. 打开你的密码管理器（1Password、Bitwarden 等）
2. 新建一条记录，把主密码存进去
3. 不要截图，不要记在桌面便签上，不要发给自己的微信
:::

---

## 第二步：把密码"喂"给 AI 代理（极其重要！）

为了让 OpenClaw 能自动使用你的钱包，你必须把密码配置到它的运行环境中。请根据你的电脑系统，选择对应的标签页，**无脑复制执行**即可。

### 2.1 永久保存并使密码生效

<Tabs>
<TabItem value="mac" label="Mac 用户 (Zsh)" default>

**第 1 步：** 用编辑器打开 `~/.zshrc` 文件，在末尾添加以下内容（把单引号里的内容换成你的真实密码）：

```bash
open -e ~/.zshrc
```

在文件末尾添加这一行，保存并关闭：

```bash
export AGENT_WALLET_PASSWORD='你的主密码'
```

**第 2 步：** 回到终端，复制这条命令，粘贴回车，让配置立即生效：

```bash
source ~/.zshrc
```

:::tip 为什么不用 echo 命令？
`echo "export ..." >> ~/.zshrc` 虽然更快捷，但你的真实密码会被逐字记录在 Shell 的历史文件（`.zsh_history` / `.bash_history`）中。这些历史文件常常会被安全扫描器、备份工具、AI 编程助手抓取——恰恰是 Agent-wallet 要防范的风险。用编辑器直接编辑配置文件，密码不会出现在任何命令历史中。
:::

</TabItem>
<TabItem value="linux" label="Linux 用户 ">

**第 1 步：** 用编辑器打开 `~/.bashrc` 文件，在末尾添加以下内容（把单引号里的内容换成你的真实密码）：

```bash
nano ~/.bashrc
```

在文件末尾添加这一行，保存并关闭（nano 中按 `Ctrl + O` 保存，`Ctrl + X` 退出）：

```bash
export AGENT_WALLET_PASSWORD='你的主密码'
```

**第 2 步：** 回到终端，复制这条命令，粘贴回车，让配置立即生效：

```bash
source ~/.bashrc
```


</TabItem>
</Tabs>





:::caution 密码有特殊字符？千万不要动单引号！
自动生成的密码经常含有 `$`、`!` 等特殊字符。上面的命令已经用了单引号包裹密码，**直接替换引号内的文字就好，千万不要改成双引号**，否则 shell 会把密码"消化"掉：

```bash
# ✅ 正确 — 单引号，密码原样保存
export AGENT_WALLET_PASSWORD='P@ss$w0rd!'

# ❌ 错误 — 双引号，$w0rd 被 shell 展开为空字符串，密码静默出错
export AGENT_WALLET_PASSWORD="P@ss$w0rd!"  # 实际值变为 "P@ss!"
```
:::

### 2.2 重启你的 AI 代理后台服务

:::danger 这一步很多人忘了，结果 AI 代理死活读不到密码！
因为你刚才新存了密码，而正在后台运行的 AI 助手还没刷新——它还是个"瞎子"！只有关掉它重新启动，它才能"看"到你的新密码。
:::

不管你现在是否正开着 OpenClaw 的后台服务，请务必将它**关闭**，然后在刚才执行过命令的终端窗口里，**重新启动**它。

---

## 第三步：在 OpenClaw 里唤醒你的 Agent-wallet

Agent-wallet 建好了，密码也配好了。现在打开 **OpenClaw**，就像和真人聊天一样，测试一下它能不能成功调用你的本地 Agent-wallet。

:::info 还没装 OpenClaw Extension？
先去 [OpenClaw Extension 快速开始](../Openclaw-extension/QuickStart.md) 安装好，再回来继续。
:::

### 零风险测试 1：查地址

在聊天框里输入：

> 帮我查一下我当前绑定的本地钱包地址（TRON 网络）。

AI 代理会自动读取你的 Agent-wallet，并准确报出你刚才创建的钱包地址。**这证明密码配置完全正确！**

### 零风险测试 2：让 AI 代理替你签名

接着对它说：

> 用我的钱包签名这段话："Hello Agent-wallet!"

AI 代理会在本地离线完成签名，并返回一串哈希字符。

**恭喜！** 全程没花一分钱 Gas 费，你也完全没接触私钥，但你已经成功让 AI 代理拥有了安全的密码学签名能力。

---

## 你已经跑通了全流程

| 我想… | 去这里 |
| :--- | :--- |
| 喜欢敲命令？ | [CLI 命令行手册](./Developer/CLI-Reference.md) |
| 要开发应用？ | [SDK 接入指南](./Developer/SDK-Guide.md) |
| 找现成代码？ | [完整代码示例](./Developer/SDK-Cookbook.md) |
| 了解安全设计原理 | [简介](./Intro.md) |
| 查看常见问题 | [FAQ](./FAQ.md) |
