import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# AI 代理快速入门

x402 专为 Agentic Web 设计。通过安装 `x402-payment` 技能，AI 代理可以**自主完成"检测付款要求 → 授权签名 → 结算 → 获取内容"的完整流程**，无需人工干预。

本指南将引导您完成：为 AI 代理配置钱包凭据、安装 x402-payment 技能、并验证代理能够自主完成付款。

---

## 前置准备

### 1. 创建代理专用钱包

> ⚠️ **重要：请为 AI 代理创建一个专用的独立钱包，不要使用您个人的主钱包。**
>
> 原因：代理钱包的私钥需要配置到系统环境变量中，独立钱包可以限制代理的可支配资金，降低潜在风险。

<Tabs>
<TabItem value="TRON" label="TRON">

1. 安装 [TronLink 钱包](https://www.tronlink.org/)（浏览器插件或手机 App）
2. 创建一个新钱包（选择"创建新账户"），**将助记词抄写在纸上保管好**
3. 复制钱包地址（以 `T` 开头）
4. 前往 [Nile 测试网水龙头](https://nileex.io/join/getJoinPage) 领取免费的测试 TRX 和测试 USDT/USDD
5. 在 TronLink 中导出私钥：**设置 → 账户管理 → 导出私钥**，输入密码确认，复制这串字符

</TabItem>
<TabItem value="BSC" label="BSC">

1. 安装 [MetaMask 钱包](https://metamask.io/)（浏览器插件）
2. 创建一个新账户，**将助记词抄写在纸上保管好**
3. 复制钱包地址（以 `0x` 开头）
4. 前往 [BSC 测试网水龙头](https://www.bnbchain.org/en/testnet-faucet) 领取免费的测试 BNB 和测试 USDT
5. 在 MetaMask 中导出私钥：**账户详情 → 导出私钥**，输入密码确认，复制这串字符

</TabItem>
</Tabs>

---

:::info 钱包管理
x402 SDK 通过 [Agent Wallet](../../Agent-Wallet/QuickStart.md) 来解析和管理钱包凭证，安装 x402 时会自动安装 agent-wallet 作为依赖。私钥解析优先级为：
1. 加密钱包文件（通过 Agent Wallet CLI 导入）
2. 环境变量 `AGENT_WALLET_PRIVATE_KEY`

本文使用环境变量方式。
:::

## 第一步：配置私钥

将私钥配置为环境变量，让 x402-payment 技能能够签署支付。将 `在此填入代理钱包私钥` 替换为前置准备中导出的私钥。

```bash
export AGENT_WALLET_PRIVATE_KEY="在此填入代理钱包私钥"
```

> 💡 **提示：** 如需在每次打开终端时自动生效，可将其写入 shell 配置文件：
> ```bash
> echo 'export AGENT_WALLET_PRIVATE_KEY=你的私钥' >> ~/.zshrc   # zsh（macOS 默认）
> echo 'export AGENT_WALLET_PRIVATE_KEY=你的私钥' >> ~/.bashrc  # bash（Linux 默认）
> source ~/.zshrc   # 或 source ~/.bashrc — 无需重启终端即可立即生效
> ```

验证环境变量已生效：

```bash
echo $AGENT_WALLET_PRIVATE_KEY
```

> ✅ **成功标志：** 终端输出您的私钥字符串（不是空白）

<Tabs>
<TabItem value="TRON" label="TRON">

**可选：** 生产环境的 TRON 项目建议配置 TronGrid API Key：

```bash
export TRON_GRID_API_KEY="在此填入TronGrid API Key"
```

> 💡 **如何获取 TronGrid API Key：** 前往 [TronGrid 官网](https://www.trongrid.io/) 免费注册，创建 API Key 后粘贴到上方。

:::note 备用 RPC 端点
未配置 `TRON_GRID_API_KEY` 时，主网 RPC 调用会自动通过 BANK OF AI 运营的公共端点
（`https://api.trongrid.io` 经由 BANK OF AI 代理）路由。该端点无保证的 SLA，
在高负载下可能会被限速。生产环境请配置您自己的 `TRON_GRID_API_KEY`，
以确保可靠性并独立于 BANK OF AI 基础设施。
:::

</TabItem>
<TabItem value="BSC" label="BSC">

BSC 无需额外配置。

</TabItem>
</Tabs>

> ⚠️ **安全提示：** 私钥只存放在本地环境变量或 `.env` 文件中。**绝对不要将含私钥的文件提交到 Git 或分享给任何人。**

---

## 第二步：安装 x402-payment 技能

### 一键自动安装（推荐）

运行以下命令一次性安装所有 BANK OF AI Skills（包括 x402-payment）：

```bash
npx skills add https://github.com/BofAI/skills -y -g
```

`-y` 参数会跳过所有交互选择，默认安装所有 Skills；`-g` 参数表示全局安装（所有项目都可使用）。安装器会自动检测你电脑上的 AI 工具（Cursor、Claude Code、Cline、OpenCode 等），并将技能复制到对应的目录中。

> ✅ **成功标志：** 终端显示 `✓ x402-payment (copied)` 以及其他已安装的技能

### 交互式安装

如果你想手动选择安装哪些 Skills 或选择安装范围：

```bash
npx skills add https://github.com/BofAI/skills
```

交互式安装的完整步骤说明，请参考 [Skills 快速开始](../../McpServer-Skills/SKILLS/QuickStart.md)。

---

## 第三步：测试代理自主付款

完成配置后，按以下步骤验证代理能够正常自主付款：

### 3.1 使用演示地址测试

指示您的 AI 代理访问以下演示地址（这是一个需要付款才能访问的测试接口）：

```
https://x402-demo.bankofai.io/protected-nile
```

**代理应自动完成以下流程（无需人工干预）：**

1. 向演示地址发起 GET 请求
2. 收到服务器返回的 HTTP 402（需要付款）响应
3. 读取响应头中的付款要求（金额、网络、收款地址）
4. 使用配置的私钥签名付款授权
5. 携带付款凭证重新发起请求
6. 成功获取内容并返回给您

### 3.2 验证付款是否成功

在区块链浏览器上确认交易记录：

<Tabs>
<TabItem value="TRON" label="TRON（Nile 测试网）">

前往 [Nile 测试网浏览器](https://nile.tronscan.org/)，搜索您的代理钱包地址，查看最近的交易记录。如果看到一笔 USDT 或 USDD 转账，说明付款成功。

</TabItem>
<TabItem value="BSC" label="BSC（测试网）">

前往 [BSC 测试网浏览器](https://testnet.bscscan.com/)，搜索您的代理钱包地址，查看最近的交易记录。

</TabItem>
</Tabs>

> ✅ **成功标志：** 代理返回了 `{"data": "..."}` 格式的内容，且区块链浏览器上出现了对应的交易记录

---

## 安全最佳实践

在将代理部署到生产环境前，请务必检查以下事项：

- **限制代理钱包余额** — 代理钱包只存入足够日常使用的金额，设定一个上限，避免因意外或恶意调用导致大量资金损失
- **先在测试网验证** — 每次更新代理配置后，先在 Nile 测试网（TRON）或 BSC 测试网完整测试，确认无误后再切换到主网
- **监控交易记录** — 定期在区块链浏览器（[TronScan](https://tronscan.org) / [BscScan](https://bscscan.com)）上检查代理的支出情况，发现异常及时处理
- **妥善保管私钥** — 使用环境变量或密钥管理服务（如 AWS Secrets Manager、HashiCorp Vault）存储私钥，切勿明文写入代码或配置文件
- **限制代理权限** — 代理只应访问它需要的 API，避免配置过高的代币授权额度

---

## 故障排查

| 问题 | 可能原因 | 解决方法 |
|------|----------|----------|
| 代理未发起付款，直接报错 | 技能未正确安装 | 重新执行第二步的安装命令 |
| `私钥未找到` 或签名失败 | 环境变量未配置或配置错误 | 重新执行第一步，在**同一终端**中运行代理 |
| 余额不足错误 | 测试钱包中没有测试代币 | 回到前置准备，从水龙头领取测试代币 |
| 请求超时 | 网络问题或 RPC 限速 | 配置 `TRON_GRID_API_KEY` 以获得更好的性能（未配置时会自动使用备用 RPC 端点） |
| 代理访问成功但余额没有变化 | 可能访问的是免费接口 | 确认 URL 是 `/protected-nile` 而非其他路径 |

---

## 下一步

- [搭建付费 API](./quickstart-for-sellers.md) — 让您的 AI 代理能调用自己搭建的付费服务
- [了解 HTTP 402 协议](../core-concepts/http-402.md) — 深入理解 x402 的工作原理
- [查看网络支持](../core-concepts/network-and-token-support.md) — 了解支持的链和代币

---

## 参考资料

- [OpenClaw 扩展库](https://github.com/BofAI/openclaw-extension)
- [ClawHub 上的 x402-payment 技能](https://github.com/BofAI/skills/tree/main/x402-payment)
- [x402 演示项目](https://github.com/BofAI/x402-demo)
