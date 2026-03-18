# CLI 快速开始

本指南帮你通过命令行完成 Agent-wallet 的安装、钱包初始化和签名操作。完成四个步骤后，你将拥有一个加密保存在本地的钱包，并能通过命令行对消息和交易进行签名。

页面后半段是完整的命令参考，日常使用时按需查阅即可。

如果你是开发者，想在 Python 或 TypeScript 代码中直接调用签名接口，参阅 [SDK 快速开始](./SDKQuickStart.md)。

---

## 第一步：安装

### 确认 Node.js 版本

需要 Node.js ≥ 18，先检查当前版本：

```bash
node -v
```

如果输出 `v18.0.0` 或更高，可以直接跳到安装步骤。如果版本不足或提示命令不存在，按下方说明安装或升级。

:::tip 安装 / 升级 Node.js

推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js 版本，方便随时切换：

```bash
# 安装 nvm（已安装可跳过）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载 shell 配置
source ~/.bashrc   # 或 source ~/.zshrc

# 安装 Node.js 18 LTS
nvm install 18

# 切换到 Node.js 18
nvm use 18
```

也可以直接从 [nodejs.org](https://nodejs.org) 下载安装包，选择 **LTS** 版本即可。

:::

### 安装 Agent-wallet CLI

```bash
npm install -g @bankofai/agent-wallet
```

验证安装：

```bash
agent-wallet --help
```

---

## 第二步：初始化钱包

`start` 命令一步完成初始化并创建默认钱包，有三种方式可选：

### 方式 A：全自动（推荐新手）

```bash
agent-wallet start
```

系统会自动生成强密码，同时创建一个 TRON 钱包和一个 EVM 钱包：

```
🔐 Wallet initialized!

🪙 Wallets:
┌──────────────────────┬─────────────────┬──────────────────────────────────────────────┐
│ Wallet ID            │ Type            │ Address                                      │
├──────────────────────┼─────────────────┼──────────────────────────────────────────────┤
│ default_tron         │ tron_local      │ TB37CfKbRacD6TUBNPK7GirUheUJwbAGH5           │
│ default_evm          │ evm_local       │ 0xd679B660f6b331e1fdA877cee0aAd361A7f3b628   │
└──────────────────────┴─────────────────┴──────────────────────────────────────────────┘

⭐ Active wallet: default_tron

🔑 Your master password: E&LCi*KL1Sp4mg4!
   ⚠️  Save this password! You'll need it for signing and other operations.
```

:::caution 安全提示
- **保管好主密码** — 主密码是解密所有私钥的唯一凭据，丢失后无法恢复。建议使用密码管理器保存。
- **不要明文写在代码里** — 如果需要非交互式使用，通过环境变量 `AGENT_WALLET_PASSWORD` 传入，而不是硬编码在脚本中。
- **不要提交 `.env` 文件** — 将 `.env` 加入 `.gitignore`，避免密码或私钥泄露到版本库。
- **为代理使用专用钱包** — 不要把个人主钱包的私钥交给 AI 代理，而是创建独立钱包并只充入所需的小额资金。
:::


### 方式 B：自定义密码

```bash
agent-wallet start -p Abc12345!
```

密码要求：至少 8 个字符，包含大写字母、小写字母、数字和特殊符号。

### 方式 C：导入已有私钥

如果你已有一个私钥希望直接导入：

```bash
agent-wallet start -p Abc12345! -i tron
```

运行后会提示你粘贴私钥（输入内容不会显示在屏幕上）：

```
🔐 Wallet initialized!
✔ Paste private key (hex)

🪙 Imported wallet:
┌──────────────────────┬─────────────────┬──────────────────────────────────────────────┐
│ Wallet ID            │ Type            │ Address                                      │
├──────────────────────┼─────────────────┼──────────────────────────────────────────────┤
│ default_tron         │ tron_local      │ TNmoJ3Be59WFEq5dsW6eCkZjveiL3G8HVB           │
└──────────────────────┴─────────────────┴──────────────────────────────────────────────┘

⭐ Active wallet: default_tron
```

`-i` 参数支持 `tron`、`evm`、`tron_local`、`evm_local`。


---

## 第三步：查看钱包

列出所有钱包：

```bash
agent-wallet list
```

```
Wallets:
┌──────────────────────┬─────────────────┬──────────────────────────────────────────────┐
│ Wallet ID            │ Type            │ Address                                      │
├──────────────────────┼─────────────────┼──────────────────────────────────────────────┤
│* default_tron        │ tron_local      │ TB37CfKbRacD6TUBNPK7GirUheUJwbAGH5           │
│  default_evm         │ evm_local       │ 0xd679B660f6b331e1fdA877cee0aAd361A7f3b628   │
└──────────────────────┴─────────────────┴──────────────────────────────────────────────┘
```

`*` 标记当前活跃钱包，签名时默认使用活跃钱包。

---

## 第四步：签名

### 签名消息

```bash title="输入"
agent-wallet sign msg "Hello"
```

```text title="输出"
Master password: ********
Signature: 4a9c8f...e71b
```

### 签名交易

交易内容以 JSON 字符串形式传入（你需要先通过 RPC 构建好未签名的交易）：

```bash title="输入"
agent-wallet sign tx '{"txID":"abc123...","raw_data_hex":"0a02...","raw_data":{...}}'
```

```text title="输出"
Master password: ********
Signed tx:
{
  "txID": "abc123...",
  "signature": ["..."]
}
```

### 签名 EIP-712 结构化数据

```bash title="输入"
agent-wallet sign typed-data '{
  "types": {
    "EIP712Domain": [{"name":"name","type":"string"},{"name":"chainId","type":"uint256"}],
    "Transfer": [{"name":"to","type":"address"},{"name":"amount","type":"uint256"}]
  },
  "primaryType": "Transfer",
  "domain": {"name":"MyDApp","chainId":1},
  "message": {"to":"0x7099...","amount":1000000}
}'
```

```text title="输出"
Master password: ********
Signature: 22008ffd...0e1c
```

---

## 命令参考

完成快速开始后，可以按需查阅以下内容。

### 跳过密码提示

每次签名都输入密码很麻烦。通过环境变量可以跳过交互式提示：

```bash
export AGENT_WALLET_PASSWORD="Abc12345!"
```

设置后，所有签名命令不再提示输入密码，直接输出结果：

```bash
agent-wallet sign msg "Hello"
agent-wallet sign tx '{"txID":"..."}'
```

也可以在单条命令中通过 `-p` 参数传入：

```bash
agent-wallet sign msg "Hello" -p "Abc12345!"
```

### 管理多个钱包

#### 1. 添加新钱包

交互式提示中选择钱包类型（`tron_local` 或 `evm_local`）、生成或导入私钥：

```bash title="输入"
agent-wallet add
```

```text title="输出"
Master password: ********
Wallet name: my-bsc-wallet
> Wallet type: evm_local
> Private key: generate
Generated new private key.
  Address: 0x8c714fe3...
  Saved: id_my-bsc-wallet.json
Wallet 'my-bsc-wallet' added.
```

#### 2. 切换活跃钱包

```bash title="输入"
agent-wallet use my-bsc-wallet
```

```text title="输出"
Active wallet: my-bsc-wallet (evm_local)
```

#### 3. 指定钱包签名

签名时可以用 `-w` 显式指定钱包，不受活跃钱包影响：

```bash
agent-wallet sign msg "Hello" -w my-bsc-wallet -p "Abc12345!"
```

#### 4. 查看钱包详情

```bash title="输入"
agent-wallet inspect my-bsc-wallet
```

```text title="输出"
Wallet      my-bsc-wallet
Type        evm_local
Address     0x8c714fe3...
Identity    id_my-bsc-wallet.json ✓
Credential  —
```

#### 5. 删除钱包

```bash title="输入"
agent-wallet remove my-bsc-wallet
```

```text title="输出"
Remove wallet 'my-bsc-wallet'? (y/N): y
  Deleted: id_my-bsc-wallet.json
Wallet 'my-bsc-wallet' removed.
```

### 其他操作

#### 1. 修改主密码

主密码是加密所有本地私钥的唯一凭据。Agent-wallet 不存储主密码本身，而是用它对每个私钥文件进行加密——修改主密码时，所有密钥文件会用新密码重新加密。

```bash title="输入"
agent-wallet change-password
```

```text title="输出"
Current password: ********
New password: ********
Confirm new password: ********
Password changed. Re-encrypted 3 files.
```

会重新加密所有密钥文件。

#### 2. 重置所有数据

```bash title="输入"
agent-wallet reset
```

```text title="输出"
⚠️  This will delete ALL wallet data in: /home/you/.agent-wallet
Are you sure you want to reset? This cannot be undone. (y/N): y
Really delete everything? Last chance! (y/N): y
✅ Wallet data reset complete.
```

删除 `~/.agent-wallet/` 目录下的全部数据，操作不可逆，会要求二次确认。

#### 3. 自定义存储目录

所有命令都支持 `--dir` 参数指定自定义密钥目录（默认 `~/.agent-wallet`）：

```bash
agent-wallet start --dir ./my-secrets
agent-wallet sign msg "Hello" --dir ./my-secrets
```

---

## 下一步

- 在代码中使用签名能力 → [SDK 快速开始](./SDKQuickStart.md)
- 了解整体设计 → [简介](./Intro.md)
- 查看常见问题 → [常见问题](./FAQ.md)
