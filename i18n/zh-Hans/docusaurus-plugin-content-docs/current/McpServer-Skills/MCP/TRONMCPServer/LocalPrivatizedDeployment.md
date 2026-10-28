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
| **Node.js** | 推荐 22.23.4+（22.x）或 24.22.1+（24.x），即 2026 年 10 月的安全更新版本（[下载](https://nodejs.org/)）。源码检出的 `main`（tag `v1.1.8`，即下文方式 B）要求这一范围（其 `package.json` 里的版本号仍是 `1.1.7`，因此服务端上报的版本也是 `1.1.7`）；`npx` 运行的 npm 包 `1.1.7`（方式 A）声明的是 `>=20`。 |
| **TronGrid API Key** | 可选但推荐（[申请地址](https://www.trongrid.io/)） |

验证 Node.js 版本：

```bash
node --version  # 推荐：v22.23.4+ 或 v24.22.1+
```

这一要求写在 `package.json` 的 `engines` 字段里：在源码检出中用其他 Node.js 版本执行 `npm install`，会打印 `EBADENGINE` 警告但仍会完成安装；服务端运行时也不会检查 Node.js 版本。

### 安全原则

在配置钱包之前，请务必理解以下安全原则：

:::danger 安全警告
**切勿**将私钥或助记词直接保存在 MCP 配置文件中。这些文件通常未加密，可能被意外分享或提交到 Git。请务必使用系统环境变量或加密钱包。
:::

---
## 安装步骤
### 第一步：配置钱包

钱包决定了 AI 助手以哪个身份执行链上操作。TRON MCP Server 使用 [Agent Wallet](../../../Agent-Wallet/Intro.md) 进行安全的钱包管理。如果没有配置钱包，调用写入工具时会返回钱包错误（见[常见问题](./FAQ.md#write-tools-wallet-error)）。

#### Agent Wallet

TRON MCP Server 使用 [Agent Wallet](../../../Agent-Wallet/Intro.md) 管理钱包。私钥加密存储在本地磁盘，不会以明文形式暴露在环境变量中。即使环境变量被泄露，攻击者仍需要加密的密钥库文件才能访问资金。Agent Wallet 还支持**多钱包管理**和运行时通过 `select_wallet` 工具切换钱包。

| 特性 | 说明 |
| :--- | :--- |
| 安全等级 | 高（加密存储） |
| 多钱包支持 | 是 |
| 运行时切换钱包 | 是 |
| 推荐场景 | 所有使用场景 |

> TRON MCP Server 依赖 Agent Wallet **2.x**（`@bankofai/agent-wallet ^2.3.0`）。[Agent-Wallet 文档](../../../Agent-Wallet/Intro.md)描述的是 3.x，本服务端尚未使用该版本——请按本页的 2.x 命令操作。

首先，安装 Agent Wallet 2.x CLI：

```bash
npm install -g @bankofai/agent-wallet@2
```

`@2` 会安装最新的 2.x 版本（撰写时为 2.4.0）。不加版本号时 npm 会安装 3.x，它没有 `local_secure` 钱包、主密码和 `--save-runtime-secrets`，下面的步骤将无法使用。

然后，根据你的情况选择以下两种路径之一：

#### 路径 1：生成新钱包（推荐新用户使用）

如果你没有现成的私钥，使用 `agent-wallet start local_secure` 生成新钱包，包含加密密钥库和主密码：

```bash
agent-wallet start local_secure --save-runtime-secrets
```

按照交互式提示设置主密码并生成钱包。Agent Wallet 会自动管理加密密钥库，但服务端在签名时仍然需要这个密码。`--save-runtime-secrets` 会把它写入 `~/.agent-wallet/runtime_secrets.json`；不加这个参数时密码不会被持久化，你需要改为在 MCP 服务端运行的环境里 export `AGENT_WALLET_PASSWORD`。

如果你已经不带这个参数执行过 `agent-wallet start`，不要为此重新执行它：已有钱包时它只提供 `add`（创建一个新钱包并把它设为当前钱包）和 `exit`（不保存任何内容）两个选项。请 export `AGENT_WALLET_PASSWORD`，或用下面任一命令保存密码：

- `agent-wallet sign msg hello -n tron --save-runtime-secrets`——询问密码并保存，然后用当前钱包签一条测试消息。它在校验密码之前就会保存，所以如果输出 `Wrong password`，请删除 `~/.agent-wallet/runtime_secrets.json` 后重试。
- `agent-wallet add local_secure --save-runtime-secrets`——先校验密码再保存，但同时会多创建一个钱包（当前钱包不变）。

既没有保存也没有导出密码时，调用写操作工具会因为无法解锁 `local_secure` 钱包而失败。密钥库不在 `~/.agent-wallet` 时请用 `AGENT_WALLET_DIR` 指定。

#### 路径 2：导入已有私钥

如果你已经有想使用的私钥，通过 `AGENT_WALLET_PRIVATE_KEY` 环境变量设置（Agent Wallet 也接受别名 `TRON_PRIVATE_KEY`，以及通过 `AGENT_WALLET_MNEMONIC` 或 `TRON_MNEMONIC` 设置助记词）。注意优先级：只有在**解析不到任何密码**（既没有 `runtime_secrets.json`，也没有 `AGENT_WALLET_PASSWORD`）**且**钱包目录里一个钱包都没有时，才会走到这条环境变量路径。如果你已经执行过「路径 1」、保存过运行时密码，或跑过 Openclaw 安装器，密钥库路径会优先生效，这些变量会被静默忽略。

```bash
export AGENT_WALLET_PRIVATE_KEY=你的私钥
```

:::tip
如需在每次打开终端时自动生效，可将其写入 shell 配置文件：

```bash
echo 'export AGENT_WALLET_PRIVATE_KEY=你的私钥' >> ~/.zshrc   # zsh（macOS 默认）
echo 'export AGENT_WALLET_PRIVATE_KEY=你的私钥' >> ~/.bashrc  # bash（Linux 默认）
source ~/.zshrc   # 或 source ~/.bashrc — 无需重启终端即可立即生效
```

验证环境变量已生效：

```bash
echo $AGENT_WALLET_PRIVATE_KEY
```
:::



---

### 第二步：配置网络（可选）

#### TronGrid API Key

在 `v1.1.8` 起的源码检出中，API Key 还决定了服务端访问哪个主网节点。对于频繁的链上查询，建议配置一个免费的 TronGrid API Key：

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export TRONGRID_API_KEY="<你的-TronGrid-API-Key>"
```

在 [trongrid.io](https://www.trongrid.io/) 免费注册即可获取。该变量对各网络的影响（各版本唯一的差别在于未配置 Key 时的主网）：

| 网络 | 已设置 `TRONGRID_API_KEY` | 未设置 `TRONGRID_API_KEY` |
| :--- | :--- | :--- |
| **Mainnet** | `https://api.trongrid.io`，并以 `TRON-PRO-API-KEY` 请求头携带你的 Key（使用你自己的配额） | `v1.1.8` 起的源码检出：回退到 BANK OF AI 节点 `https://hptg.bankofai.io`。npm `1.1.7`（`npx` 运行的版本）：不带 Key 访问 `https://api.trongrid.io` |
| **Nile** | `https://nile.trongrid.io`（同样携带 Key 请求头） | `https://nile.trongrid.io` |
| **Shasta** | `https://api.shasta.trongrid.io`（同样携带 Key 请求头） | `https://api.shasta.trongrid.io` |

不配置 Key 也能正常使用，但不带 Key 发往 TronGrid 的请求（npm `1.1.7` 的主网，以及 Nile / Shasta）共用 TronGrid 的公共限流，高频使用时可能遇到限流错误。如果希望主网请求走 TronGrid 并使用你自己的配额，再配置即可。

---

### 第三步：本地私有化部署

提供多种部署方式。对于大多数用户，方式 A 就够了。

#### 方式 A：npx 直接运行（推荐）

无需克隆仓库，通过 `npx` 直接运行最新版本。这也是下文[配置说明](#配置说明)中使用的命令。

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

启动服务器的 HTTP 模式，然后通过 HTTP 端点连接你的 MCP 客户端。用已发布的包时传 `--http` 即可，无需克隆源码：

```bash
npx -y @bankofai/mcp-server-tron --http
```

:::caution `-h`是启动 HTTP 模式，不是显示帮助
启动器把 `-h` 当作 `--http` 的简写，把 `-r` 当作 `--readonly` 的简写。它没有帮助参数——输入 `-h` 会直接启动 HTTP 服务器。
:::

如果已经按「方式 B」检出了源码，也可以用脚本：

```bash
npm run start:http
```

这会启动一个本地无状态 Streamable HTTP 服务器（默认：`http://localhost:3001/mcp`），对 `/mcp` 的 `GET` 和 `DELETE` 返回 `405`（不支持 SSE），`GET /` 返回服务信息。每个请求独立处理，不维护会话状态。

你可以通过环境变量自定义端口和主机：

```bash
export MCP_PORT=3001      # 默认：3001
export MCP_HOST=0.0.0.0   # 默认：0.0.0.0
```

Docker 与源码检出的启动脚本还会读取 `MCP_LOG_DIR`（容器内默认 `/app/logs`，源码检出默认 `./logs`）。已发布的 npm 包只包含 `build/`、`bin/`、`package.json`、`README.md` 与 `LICENSE`，因此该变量不适用于上面的 `npx` 方式。

#### 方式 D：Docker 部署

在 Docker 容器中运行 TRON MCP Server，适合隔离、可重现的环境。Docker 镜像始终以**只读 HTTP 模式**运行：`docker-start.sh` 固定传入 `--readonly`，没有关闭它的开关。

```bash
# 1. 创建 .env 文件存放敏感变量（切勿将此文件提交到版本控制）
cat > .env.docker << 'EOF'
TRONGRID_API_KEY=你的key
EOF

# 2. 构建镜像
docker build -t mcp-server-tron .   # 需要「方式 B」的源码检出——Dockerfile 不包含在已发布的 npm 包里

# 3. 使用 --env-file 运行容器
docker run -d \
  -p 3001:3001 \
  -v $(pwd)/logs:/app/logs \
  --env-file .env.docker \
  mcp-server-tron
```

:::warning
切勿在命令行中通过 `-e KEY=value` 传递 API 密钥——该值会出现在 shell 历史记录和 `docker inspect` 输出中。请始终使用 `--env-file` 配合一个排除在版本控制之外的文件（将 `.env.docker` 添加到 `.gitignore`）。
:::

容器暴露 3001 端口，日志按日期写入挂载的 `logs/` 目录。健康检查端点：`http://localhost:3001/health`。

:::tip
Docker 镜像适用于只读云部署。如需本地写入操作（转账、质押等），请使用方式 A、B 或 C 并配置 Agent Wallet。
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
