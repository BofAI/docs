# CLI 快速开始

四步，从零到完成第一次签名。整个过程不到一分钟——复制粘贴就行。

:::tip 已经是开发者了？
如果你想直接在 TypeScript 或 Python 代码里调用签名，跳到 [SDK 快速开始](./SDKQuickStart.md)。
:::

---

## 🧰 第一步：准备环境

Agent-wallet CLI 需要 Node.js ≥ 18。先看看你有没有：

```bash
node -v
```

输出 `v18.x.x` 或更高？直接跳到第二步。没有或者版本太低？按下面的步骤安装：

:::tip 安装 / 升级 Node.js

推荐用 [nvm](https://github.com/nvm-sh/nvm)，一条命令搞定：

**1 — 安装 nvm**（已有可跳过）：
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

**2 — 重新加载终端配置：**
```bash
source ~/.bashrc   # zsh 用户改成 source ~/.zshrc
```

**3 — 安装 Node.js 18：**
```bash
nvm install 18
```

**4 — 切换到 Node.js 18：**
```bash
nvm use 18
```

也可以直接去 [nodejs.org](https://nodejs.org) 下载 LTS 安装包。
:::

---

## 📦 第二步：安装 Agent-wallet

```bash
npm install -g @bankofai/agent-wallet
```

Python 用户也可以用 pip：
```bash
pip install bankofai-agent-wallet
```

验证安装成功：
```bash
agent-wallet --help
```

看到帮助信息就说明安装好了。

---

## 🔐 第三步：打造你的专属保险箱

运行：
```bash
agent-wallet start
```

系统会引导你初始化 **Agent-wallet 加密保险箱**。整个过程是交互式的——跟着提示走就行。

如果你没有手动指定密码（`-p` 参数），系统会自动生成一个强密码并显示一次：

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

Your master password: WiJxcI#t6@73K#OE
   Save this password! You'll need it for signing and other operations.

Active wallet: default
```

:::caution ⚠️ 主密码 = 你所有资产的唯一钥匙
这个密码是解开所有私钥的唯一凭证。**忘了就找不回来——我们也没有备份，没有后门，神仙难救。**

请现在就做这件事：
1. 打开你的密码管理器（1Password、Bitwarden 等）
2. 新建一条记录，把主密码存进去
3. 不要截图，不要记在桌面便签上，不要发给自己的微信
:::

**想自己设密码？**
```bash
agent-wallet start -p Abc12345!
```
密码要求：至少 8 位，包含大写、小写、数字和特殊字符。

**已经有私钥，想导入？**
```bash
agent-wallet start -p Abc12345! -k 你的私钥十六进制
```

**有助记词？**
```bash
agent-wallet start -p Abc12345! -m "word1 word2 word3 ..."
```

---

## ✨ 第四步：第一次测试签名

激动人心的时刻——运行：

```bash
agent-wallet sign msg "Hello from my AI agent" -n tron
```

系统会让你输入主密码，然后输出：

```text
Master password: ********
Signature: 4a9c8f...e71b
```

**当屏幕上吐出那串哈希字符时——恭喜你，保险箱配置成功了！** 🎉

你的私钥已经加密存储在磁盘上，刚才的签名完全在本地完成，没有任何数据发送到网络。

---

## 🚀 快速开始完成！接下来做什么？

| 我想… | 做这个 |
| :--- | :--- |
| 让 AI 工具用上我的钱包 | 设置环境变量 `export AGENT_WALLET_PASSWORD='你的密码'`，详见 [简介](./Intro.md) |
| 在自己的代码里签名 | 去 [SDK 快速开始](./SDKQuickStart.md) |
| 看完整的转账示例 | 去 [完整示例](./FullExample.md) |
| 继续看下面的命令手册 | ↓ 往下翻 |

---

## 命令手册

快速开始之后，下面是你日常会用到的所有命令。按需查阅。

### 免密码签名

每次签名都要交互输密码？自动化流程里完全行不通。三种方式跳过：

**方式 A — 环境变量**（推荐用于 CI / 代理流水线）：
```bash
export AGENT_WALLET_PASSWORD='Abc12345!'
```
设置后，所有签名命令静默运行：
```bash
agent-wallet sign msg "Hello" -n tron
agent-wallet sign tx '{"txID":"..."}' -n tron
```

:::caution 密码有特殊字符？务必用单引号
```bash
# ✅ 正确 — shell 按字面意思处理
export AGENT_WALLET_PASSWORD='P@ss$w0rd!'

# ❌ 错误 — $ 被 shell 展开，密码静默出错
export AGENT_WALLET_PASSWORD="P@ss$w0rd!"
```
:::

**方式 B — 内联 `-p`**（临时用一次）：
```bash
agent-wallet sign msg "Hello" -n tron -p "Abc12345!"
```

**方式 C — `--save-runtime-secrets`**（密码存入 `~/.agent-wallet/runtime_secrets.json`，下次自动读取）：
```bash
agent-wallet sign msg "Hello" -n tron -p "Abc12345!" --save-runtime-secrets
```

### 签名类型

每条 `sign` 子命令都需要 `--network` / `-n` 来指定链：

**签名消息：**
```bash
agent-wallet sign msg "Hello" -n tron
```

**签名交易**（需要先通过 RPC 构建未签名交易）：
```bash
agent-wallet sign tx '{"txID":"abc123...","raw_data_hex":"0a02...","raw_data":{...}}' -n tron
```

**签名 EIP-712 结构化数据：**
```bash
agent-wallet sign typed-data '{
  "types": {
    "EIP712Domain": [{"name":"name","type":"string"},{"name":"chainId","type":"uint256"}],
    "Transfer": [{"name":"to","type":"address"},{"name":"amount","type":"uint256"}]
  },
  "primaryType": "Transfer",
  "domain": {"name":"MyDApp","chainId":1},
  "message": {"to":"0x7099...","amount":1000000}
}' -n eip155:1
```

### 管理多个钱包

**添加新钱包：**
```bash
agent-wallet add
```

**切换活跃钱包：**
```bash
agent-wallet use my-bsc-wallet
```

**用指定钱包签名**（不切换活跃钱包）：
```bash
agent-wallet sign msg "Hello" -n eip155:56 -w my-bsc-wallet -p "Abc12345!"
```

**查看钱包详情：**
```bash
agent-wallet inspect my-bsc-wallet
```

**查看所有钱包：**
```bash
agent-wallet list
```

**删除钱包：**
```bash
agent-wallet remove my-bsc-wallet
```

### 修改主密码

修改后，所有密钥文件会用新密码重新加密：

```bash
agent-wallet change-password
```

### 重置所有数据

删除 `~/.agent-wallet/` 下的所有内容，**不可撤销**，需要二次确认：

```bash
agent-wallet reset
```

### 自定义存储目录

所有命令支持 `--dir` 指定密钥存储路径（默认 `~/.agent-wallet`）：

```bash
agent-wallet start --dir ./my-secrets
agent-wallet sign msg "Hello" --dir ./my-secrets
```

---

## 下一步

- 让 AI 工具用上你的钱包 → [简介 — 普通玩家路径](./Intro.md)
- 在代码里集成签名 → [SDK 快速开始](./SDKQuickStart.md)
- 查看常见问题 → [常见问题](./FAQ.md)
