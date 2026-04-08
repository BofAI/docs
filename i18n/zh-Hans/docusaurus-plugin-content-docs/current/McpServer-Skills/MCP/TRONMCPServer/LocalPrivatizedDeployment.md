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
**切勿**将私钥或助记词直接保存在 MCP 配置文件中。这些文件通常未加密，可能被意外分享或提交到 Git。请务必使用系统环境变量或加密钱包。
:::

---
## 安装步骤
### 第一步：配置钱包

钱包决定了 AI 助手以哪个身份执行链上操作。TRON MCP Server 使用 [Agent Wallet](../../../Agent-Wallet/Intro) 进行安全的钱包管理。如果没有配置钱包，写入工具会在执行时返回错误提示你设置钱包。

#### Agent Wallet

TRON MCP Server 使用 [Agent Wallet](../../../Agent-Wallet/Intro) 管理钱包。私钥加密存储在本地磁盘，不会以明文形式暴露在环境变量中。即使环境变量被泄露，攻击者仍需要加密的密钥库文件才能访问资金。Agent Wallet 还支持**多钱包管理**和运行时通过 `select_wallet` 工具切换钱包。

| 特性 | 说明 |
| :--- | :--- |
| 安全等级 | 高（加密存储） |
| 多钱包支持 | 是 |
| 运行时切换钱包 | 是 |
| 推荐场景 | 所有使用场景 |

> Agent Wallet 的安装、初始化及详细用法请参阅 [Agent-Wallet 文档](../../../Agent-Wallet/Intro)。

**初始化 Agent Wallet 后设置环境变量：**

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export AGENT_WALLET_PASSWORD='<你的主密码>'

# 可选：指定自定义钱包目录（默认：~/.agent-wallet）
export AGENT_WALLET_DIR="$HOME/.agent-wallet"
```

:::caution 旧版钱包方式已移除
从 v1.1.7 起，旧版的 `TRON_PRIVATE_KEY` 和 `TRON_MNEMONIC` 环境变量不再受支持。所有钱包管理现在统一通过 Agent Wallet 进行。如果你之前使用明文私钥或助记词，请迁移到 Agent Wallet 以获得更好的安全性。
:::



---

### 第二步：配置网络（可选）

#### TronGrid API Key

TRON 主网公共 RPC 有严格的频率限制。对于频繁的链上查询，强烈建议配置一个免费的 TronGrid API Key：

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export TRONGRID_API_KEY="<你的-TronGrid-API-Key>"
```

在 [trongrid.io](https://www.trongrid.io/) 免费注册即可获取。不配置也能使用，但高频操作时可能会遇到限速错误。测试网（Nile、Shasta）受限速影响较小。

---

### 第三步：本地私有化部署

提供多种部署方式。对于大多数用户，方式 A 就够了。

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

#### 方式 C：以 HTTP 模式运行

启动服务器的 HTTP 模式，然后通过 HTTP 端点连接你的 MCP 客户端：

```bash
npm run start:http
```

这会启动一个本地无状态 Streamable HTTP 服务器（默认：`http://localhost:3001/mcp`），每个请求独立处理，不维护会话状态。

你可以通过环境变量自定义端口和主机：

```bash
export MCP_PORT=3001      # 默认：3001
export MCP_HOST=0.0.0.0   # 默认：0.0.0.0
```

#### 方式 D：Docker 部署

在 Docker 容器中运行 TRON MCP Server，适合隔离、可重现的环境。Docker 镜像默认以**只读 HTTP 模式**运行。

```bash
# 构建镜像
docker build -t mcp-server-tron .

# 运行容器
docker run -d \
  -p 3001:3001 \
  -v $(pwd)/logs:/app/logs \
  -e TRONGRID_API_KEY="<你的-key>" \
  mcp-server-tron
```

容器暴露 3001 端口，日志按日期写入挂载的 `logs/` 目录。健康检查端点：`http://localhost:3001/health`。

:::tip
Docker 镜像适用于只读云部署。如需本地写入操作（转账、质押等），请使用方式 A 或 B 并配置 Agent Wallet。
:::

#### 配置说明

如果你要配置 MCP 客户端指向本地服务器：

- **如果通过 npx 或源码运行**：在 MCP 客户端配置中使用相应的命令（例如 `command: npx` 加上 `args: ["-y", "@bankofai/mcp-server-tron"]`）
- **如果以 HTTP 模式或 Docker 运行**：通过 HTTP URL 配置选项将客户端指向 `http://localhost:3001/mcp`

如果你的 MCP 客户端不继承系统环境变量，则需要在客户端设置中显式配置它们。**请确保任何存储凭证的配置文件不会被分享或提交到版本控制系统**。

---

### 第四步：验证接入是否成功

完成配置后，**完全退出并重启** AI 客户端，然后尝试：

```
我配置的钱包地址是什么？
```

如果一切正常，AI 会调用 `get_wallet_address` 工具，返回你钱包的 Base58 和 Hex 地址。

你也可以在测试网上尝试转账（确保 Nile 测试网上有测试 TRX）：

```
在 Nile 测试网上向地址 TNPee...xxxxx 转 1 TRX
```

:::info 获取测试 TRX
可以从 TRON 水龙头免费获取 Nile 测试网的测试 TRX。访问 [nile.tronscan.org](https://nile.tronscan.org) 查找水龙头入口，或在网上搜索"TRON Nile 水龙头"。
:::

---

## 下一步

- 想了解每个工具的详细参数和用法？ → [完整能力清单](./ToolList.md)
- 遇到问题？ → [常见问题](./FAQ.md)
