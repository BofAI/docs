import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 快速开始

从零到在 AI 代理对话框里唤醒你的 Agent-wallet。我们提供了两种创建钱包的方式——**对话式创建最简单**，全程在 AI 对话框里完成；**命令行创建**则给你最精细的控制。

:::tip 前置依赖 & CLI 命令细节
- 你的 AI Agent 支持 shell 命令执行（OpenClaw、Telegram Bot、Web 聊天页面、Claude Code、Cursor 等）
- 本页只带你跑通最短路径。免密配置、管理多个钱包、签名类型等进阶内容，请看 [CLI 命令行手册](./Developer/CLI-Reference.md)。
:::

---

## 方式一：对话式创建（最简单）

如果你已经安装了 [BANK OF AI 全部技能](../McpServer-Skills/SKILLS/QuickStart.md)（包含 `agent-wallet` 和 `bankofai-guide`），那么创建钱包只需要在 AI 对话框里发一句话就行——AI 会自动帮你生成密码、创建钱包、保存配置，全程无需手动改文件。

**操作步骤：**

1. 打开你的 AI Agent 对话框
2. 复制下面这段 prompt 发送给 AI：

   ```
   创建 AgentWallet 钱包
   ```

3. AI 会自动完成以下流程：
   - **检查当前钱包状态**——告诉你是否已有配置
   - **询问创建方式**——给出两个选项：
     - **A. 快速设置（强烈推荐）**：全自动，约 10 秒完成；自动生成安全密码；钱包加密存储在本地
     - **B. 详细设置**：手动选择钱包类型；自定义密码；更多配置选项
4. 回复 `A` 即可，AI 会自动跑完三个步骤：
   - **步骤 1**：生成安全密码
   - **步骤 2**：创建钱包
   - **步骤 3**：获取钱包地址


:::caution 主密码非常重要，请立即备份
主密码仅展示一次。虽然会自动保存到本地的 `~/.agent-wallet/runtime_secrets.json`，但强烈建议你同时手动保存到密码管理器（1Password / Bitwarden 等）——一旦本地文件丢失或损坏，且没有外部备份，你的钱包将永久无法解锁（没有备份找回机制，没有客服，没有后门）。

⚠️ 切勿把这个密码发到聊天工具、邮件、截图或公开仓库中。
:::

:::tip 完成即可用，无需配置环境变量
对话式创建会自动把密码保存到 `~/.agent-wallet/runtime_secrets.json`，AI Agent 后续调用钱包时会自动读取，**无需手动配置 `AGENT_WALLET_PASSWORD` 环境变量**。如果你想了解环境变量配置方式，请看下面的"方式二"。
:::

---

## 方式二：命令行手动创建（最精细控制）

如果你想自己掌控每个步骤，或者你的环境不支持对话式安装，可以按下面的命令行流程手动完成。

### 第一步：安装并初始化钱包

#### 1.1 准备环境：安装 Node.js

Agent-wallet 需要你的电脑里有 Node.js（这是一个运行环境，版本需 >= 20）。

打开终端（Mac 用户按 `Command + 空格` 搜索"终端"），输入：

```bash
node -v
```

- **如果输出 `v20.x.x` 或更高数字：** 太棒了，直接跳到 1.2！
- **如果没有输出或报错：** 别慌，去 **[Node.js 官方网站](https://nodejs.org)** 下载最新的 **LTS** 安装包，像装普通软件一样双击安装，一路"下一步"即可。装完后关掉终端重新打开，再输入 `node -v` 确认。

<details>
<summary>开发者首选：使用 nvm 安装（小白请跳过）</summary>

```bash
# 1. 安装 nvm（已有可跳过）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. 重新加载终端配置
source ~/.bashrc   # zsh 用户改成 source ~/.zshrc

# 3. 安装并切换到 Node.js 20
nvm install 20 && nvm use 20
```

</details>

#### 1.2 安装 Agent-wallet

```bash
npm install -g @bankofai/agent-wallet
```

验证安装成功：
```bash
agent-wallet --help
```

看到帮助信息就说明安装好了。

#### 1.3 创建你的 Agent-wallet 钱包

运行：
```bash
agent-wallet start
```

系统会引导你初始化 **Agent-wallet 钱包**。整个过程是交互式的——跟着提示走就行：

```
? Quick start type: local_secure  — Encrypted key stored locally (recommended)
Wallet ID (e.g. my_wallet_1) (default_secure):

Wallet initialized!
? Import source: generate  — Generate a new random private key

Wallets:
┌────────────────┬──────────────┐
│ Wallet ID      │ Type         │
├────────────────┼──────────────┤
│ default_secure │ local_secure │
└────────────────┴──────────────┘

Your master password: <此处会显示你的专属密码>
   Save this password! You'll need it for signing and other operations.

Active wallet: default_secure
```

:::caution 主密码 = 你所有资产的唯一钥匙
这个密码是解开所有私钥的唯一凭证。**忘了就找不回来——我们也没有备份，没有后门，神仙难救。**

请现在就做这件事：
1. 打开你的密码管理器（1Password、Bitwarden 等）
2. 新建一条记录，把主密码存进去
3. 不要截图，不要记在桌面便签上，不要发给自己的微信
:::

---

### 第二步：把密码"喂"给 AI 代理（极其重要！）

为了让你的 AI 代理能自动使用你的钱包，你必须把密码配置到它的运行环境中。请根据你的电脑系统，选择对应的标签页，**无脑复制执行**即可。

#### 2.1 保存并使密码生效

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

#### 2.2 重启你的 AI 代理后台服务

:::danger 这一步很多人忘了，结果 AI 代理死活读不到密码！
因为你刚才新存了密码，而正在后台运行的 AI 助手还没刷新——它还是个"瞎子"！只有关掉它重新启动，它才能"看"到你的新密码。
:::

不管你现在是否正开着 AI 代理的后台服务，请务必将它**关闭**，然后在刚才执行过命令的终端窗口里，**重新启动**它。

---

## 你已经跑通了全流程

| 我想… | 去这里 |
| :--- | :--- |
| 喜欢敲命令？ | [CLI 命令行手册](./Developer/CLI-Reference.md) |
| 要开发应用？ | [SDK 接入指南](./Developer/SDK-Guide.md) |
| 找现成代码？ | [完整代码示例](./Developer/SDK-Cookbook.md) |
| 了解安全设计原理 | [简介](./Intro.md) |
| 查看常见问题 | [FAQ](./FAQ.md) |
