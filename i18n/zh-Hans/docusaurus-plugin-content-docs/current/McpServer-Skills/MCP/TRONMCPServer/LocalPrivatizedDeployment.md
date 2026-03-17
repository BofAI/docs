import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 本地私有化部署

## 什么是本地私有化部署？

本地私有化部署是指在你自己的机器上运行 TRON MCP Server，让 AI 助手获得对 TRON 区块链的 **完整读写能力**。

通过[官方云服务](./OfficialServerAccess.md)，你可以查询链上所有公开数据。但一旦涉及实际的资产操作——向某个地址转一笔 TRX、调用智能合约的状态变更函数、质押 TRX 获取能量、为超级代表投票——这些操作都需要用你的私钥对交易进行签名。出于安全考虑，私钥只能在你本地管理，不会上传到任何远程服务。

**本地部署的核心作用，就是在你的机器上运行一个完整的 MCP Server，安全地持有钱包凭证，让 AI 助手可以代你签名并广播交易。**

### 本地部署能做什么？

相比云服务的只读模式，本地部署解锁了全部写操作能力：

- **转账**：发送 TRX 和 TRC20 代币
- **智能合约**：部署新合约、调用状态变更函数、管理合约设置
- **质押与委托**：冻结 TRX 获取能量/带宽、将资源委托给其他地址
- **治理**：为超级代表投票、创建和审批提案
- **钱包管理**：多钱包切换、消息签名、账户权限更新
- **交易构建**：创建未签名交易、广播已签名交易

当然，所有只读查询能力同样完整保留。

---

## 开始之前

### 环境要求

| 要求 | 说明 |
| :--- | :--- |
| **Node.js** | v20.0.0 或更高版本（[下载](https://nodejs.org/)） |
| **TronGrid API Key** | 可选但推荐（[申请地址](https://www.trongrid.io/)） |

验证 Node.js 版本：

```bash
node --version  # 应输出 v20.x.x 或更高
```

### 安全原则

在配置钱包之前，请务必理解以下安全原则：

:::danger 安全警告
**切勿**将私钥或助记词直接保存在 MCP 配置文件（如 `claude_desktop_config.json` 或 `mcp.json`）中。这些文件通常未加密，可能被意外分享或提交到 Git。请务必使用系统环境变量或加密钱包。
:::

---
## 安装步骤
### 第一步：配置钱包

钱包决定了 AI 助手以哪个身份执行链上操作。TRON MCP Server 支持三种钱包模式，若未配置任何钱包，服务器会自动以只读模式运行。

#### 有三种创建钱包的方式，请根据需要选择

| 特性 | Agent Wallet | 私钥 | 助记词 |
| :--- | :--- | :--- | :--- |
| 安全等级 | 高（加密存储） | 低（明文） | 低（明文） |
| 多钱包支持 | 是 | 否 | 否 |
| 运行时切换钱包 | 是 | 否 | 否 |
| 配置复杂度 | 中等 | 简单 | 简单 |
| 推荐场景 | 生产环境、较多资金 | 开发测试、少量资金 | 开发测试、少量资金 |

#### 方式一：通过 Agent Wallet（推荐）创建钱包

这是最安全的方式。私钥加密存储在本地磁盘，不会以明文形式暴露在环境变量中。即使环境变量被泄露，攻击者仍需要加密的密钥库文件才能访问资金。

**安装并初始化 Agent Wallet：**

```bash
# 安装
npm install -g @bankofai/agent-wallet

# 创建加密钱包
agent-wallet start
```
Agent Wallet 还支持**多钱包管理**——你可以创建多个钱包，在运行时通过 `select_wallet` 工具随时切换，非常适合需要在不同账户间操作的场景。

> 了解详细的安装和使用说明请参阅 [agent-wallet 文档](https://github.com/BofAI/agent-wallet/blob/main/doc/getting-started.md)。

**设置环境变量：**

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export AGENT_WALLET_PASSWORD="<你的主密码>"

# 可选：指定自定义钱包目录（默认：~/.agent-wallet）
export AGENT_WALLET_DIR="~/.agent-wallet"
```



#### 方式二：通过私钥导入钱包

通过环境变量直接提供私钥。配置最简单，但安全性较低。

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export TRON_PRIVATE_KEY="<你的私钥十六进制值>"
```

私钥可以是带 `0x` 前缀或不带前缀的十六进制格式。

:::warning
在环境变量中使用明文私钥存在**真实的资金被盗风险**——环境变量可能通过 shell 历史记录、进程列表（`ps aux`）或日志文件泄露。**这类钱包只应存放少量资金**。
:::

#### 方式三：通过助记词导入钱包

通过 BIP-39 助记词进行 HD 钱包派生。

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export TRON_MNEMONIC="单词1 单词2 单词3 ... 单词12"

# 可选：指定 HD 钱包派生索引（默认：0）
# 派生路径：m/44'/195'/0'/0/{index}
export TRON_ACCOUNT_INDEX="0"
```

:::warning
与私钥方式的安全风险相同。明文存储的助记词容易泄露，请只用于存放少量资金的开发/测试钱包。
:::



---

### 第二步：配置网络（可选）

#### TronGrid API Key

TRON 主网公共 RPC 有严格的频率限制。如果你的使用场景涉及频繁的链上查询，强烈建议配置一个免费的 TronGrid API Key：

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export TRONGRID_API_KEY="<你的 TronGrid API Key>"
```

在 [trongrid.io](https://www.trongrid.io/) 注册即可免费获取。不配置时服务器仍然可以运行，但高频操作下可能出现限速错误。测试网（Nile、Shasta）受频率限制的影响较小。


---

### 第三步：本地私有化部署

提供两种方式。对于大多数用户，方式 A 就够了。

#### 方式 A：npx 直接运行（推荐）

无需克隆仓库，通过 `npx` 直接运行最新版本。这也是下方 MCP 客户端配置示例中默认采用的方式。

```bash
npx -y @bankofai/mcp-server-tron
```

#### 方式 B：从源码克隆

适用于需要修改源码或参与贡献的开发者：

```bash
git clone https://github.com/BofAI/mcp-server-tron.git
cd mcp-server-tron
npm install
npm run build
```

---

### 第四步：客户端配置

环境变量和安装都准备好了，现在把 AI 客户端指向本地服务器。

#### 找到配置文件

| 应用程序 | 操作系统 | 配置路径 |
| :--- | :--- | :--- |
| **Claude Desktop** | macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| | Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Cursor** | 所有 | 项目根目录：`.cursor/mcp.json` |
| **Google Antigravity** | 所有 | `~/.config/antigravity/mcp.json` |
| **Opencode** | 所有 | `~/.config/opencode/mcp.json` |

#### 添加服务器定义

<Tabs>
<TabItem value="npx" label="方式 A：npx 运行（推荐）">

直接从 npm 运行最新版本，无需克隆仓库。

**Claude Desktop**（`claude_desktop_config.json`）：

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": ["-y", "@bankofai/mcp-server-tron"],
      "env": {
        "AGENT_WALLET_PASSWORD": "YOUR_PASSWORD（或在系统环境变量中设置）",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE（或在系统环境变量中设置）"
      }
    }
  }
}
```

**Claude Code**：

```bash
# 基础配置
claude mcp add mcp-server-tron -- npx -y @bankofai/mcp-server-tron

# 携带环境变量
claude mcp add -e AGENT_WALLET_PASSWORD=xxx -e TRONGRID_API_KEY=xxx mcp-server-tron -- npx -y @bankofai/mcp-server-tron
```

**Cursor**（`.cursor/mcp.json`）：

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": ["-y", "@bankofai/mcp-server-tron"],
      "env": {
        "AGENT_WALLET_PASSWORD": "YOUR_PASSWORD（或在系统环境变量中设置）",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE（或在系统环境变量中设置）"
      }
    }
  }
}
```

</TabItem>
<TabItem value="local" label="方式 B：本地源码">

适用于从克隆仓库运行的开发者。

**Claude Desktop**（`claude_desktop_config.json`）：

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": ["tsx", "/mcp-server-tron 的绝对路径/src/index.ts"],
      "env": {
        "AGENT_WALLET_PASSWORD": "YOUR_PASSWORD（或在系统环境变量中设置）",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE（或在系统环境变量中设置）"
      }
    }
  }
}
```

将路径替换为你实际克隆的仓库路径。

**Cursor**（`.cursor/mcp.json`）：

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "command": "npx",
      "args": ["tsx", "/mcp-server-tron 的绝对路径/src/index.ts"],
      "env": {
        "AGENT_WALLET_PASSWORD": "YOUR_PASSWORD（或在系统环境变量中设置）",
        "TRONGRID_API_KEY": "YOUR_KEY_HERE（或在系统环境变量中设置）"
      }
    }
  }
}
```

</TabItem>
<TabItem value="http" label="方式 C：连接本地 HTTP">

如果你以 HTTP 模式启动了服务器（`npm run start:http`），通过 HTTP URL 连接：

**Claude Code**：

```bash
claude mcp add --transport http mcp-server-tron http://localhost:3001/mcp
```

**Cursor**（`.cursor/mcp.json`）：

```json
{
  "mcpServers": {
    "mcp-server-tron": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

</TabItem>
</Tabs>

:::tip 关于配置中的 `env` 部分
如果你已经在系统中设置了环境变量（通过 `~/.zshrc` 或 `~/.bashrc`），可以完全省略配置中的 `env` 部分，服务器会自动读取系统环境变量。

如果你的 MCP 客户端不继承系统环境变量，则需要在 `env` 部分中设置。此时**请确保该配置文件不会被分享或提交到版本控制系统**。
:::

---

### 第五步：验证接入是否成功

完成配置后，**完全退出并重启** AI 客户端，然后尝试：

```
我配置的钱包地址是什么？
```

如果一切正常，AI 会调用 `get_wallet_address` 工具，返回你钱包的 Base58 和 Hex 地址。

你也可以在测试网上尝试转账（确保 Nile 测试网上有测试 TRX）：

```
在 Nile 测试网上向地址 TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL 转 1 TRX
```

:::info 获取测试 TRX
可以从 TRON 水龙头免费获取 Nile 测试网的测试 TRX。访问 [nile.tronscan.org](https://nile.tronscan.org) 查找水龙头入口，或在网上搜索"TRON Nile 水龙头"。
:::

---

## 下一步

- 想了解每个工具的详细参数和用法？ → [完整能力清单](./ToolList.md)
- 遇到问题？ → [常见问题](./FAQ.md)
