# 本地私有化部署

## 什么是本地私有化部署？

本地私有化部署是指在您自己的计算机上运行 SUN MCP Server 的完整实例。与依赖第三方服务不同，本地部署让您完全控制您的钱包、网络连接和数据隐私。

这种模式特别适合需要执行 DeFi 操作的场景。通过配置钱包私钥或助记词，您可以解锁以下写入操作：

- **Swap**：使用 Universal Router 进行自动路由交换
- **流动性管理**：SunSwap V2/V3/V4 添加和移除流动性
- **头寸管理**：SunSwap V3/V4 铸造、增加、减少头寸和收集费用
- **合约交互**：通过 `sunswap_send_contract` 调用任意合约

:::info
无钱包配置下，SUN MCP Server 将以**只读模式**运行，允许查询链上数据但无法执行写入操作。
:::

---

## 开始之前

### 环境要求

| 项目 | 要求 | 说明 |
|------|------|------|
| Node.js | >= 20.0.0 | v20.0.0 或更高版本（[下载](https://nodejs.org/)） |
| npm | >= 10.0 | 通常与 Node.js 一起安装 |
| 操作系统 | Linux / macOS / Windows | 跨平台支持 |
| 磁盘空间 | >= 100 MB | 用于安装依赖 |
| 网络 | 互联网连接 | 与 TRON 网络通信 |

### 安全原则

:::danger 重要安全提示
1. **私钥保护**：永远不要将私钥提交到版本控制系统。使用 `.env` 文件并将其添加到 `.gitignore`。
2. **权限管理**：确保 `.env` 文件的权限为 `600`（仅所有者可读）。
3. **多钱包模式禁止**：同时配置多个钱包方式将触发错误。只能同时使用一种方式。
4. **助记词用语**：在本文档中，"助记词"指的是 BIP-39 标准的 12 词或 24 词恢复短语。
5. **主网谨慎**：在主网中使用实际资金前，请务必在测试网（Nile、Shasta）上充分测试。
:::

---

## 安装步骤
### 第一步：配置钱包

钱包决定了 AI 助手以哪个身份执行链上操作。SUN MCP Server 支持三种钱包模式，若未配置任何钱包，服务器会自动以只读模式运行。

#### 有三种创建钱包的方式，请根据需要选择

| 特性 | Agent Wallet | 私钥 | 助记词 |
| :--- | :--- | :--- | :--- |
| 安全等级 | 高（加密存储） | 低（明文） | 低（明文） |
| 多钱包支持 | 是 | 否 | 否 |
| 运行时切换钱包 | 是 | 否 | 否 |
| 配置复杂度 | 中等 | 简单 | 简单 |
| 推荐场景 | 生产环境、较多资金 | 开发测试、少量资金 | 开发测试、少量资金 |

#### 方式一：通过 Agent Wallet（推荐）创建钱包

这是最安全的方式。私钥加密存储在本地磁盘，不会以明文形式暴露在环境变量中。即使环境变量被泄露，攻击者仍需要加密的密钥库文件才能访问资金。Agent Wallet 还支持**多钱包管理**和运行时通过 `select_wallet` 工具切换钱包。

> Agent Wallet 的安装、初始化及详细用法请参阅 [Agent-Wallet 文档](../../../Agent-Wallet/Intro)。

**初始化 Agent Wallet 后设置环境变量：**

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export AGENT_WALLET_PASSWORD='<你的主密码>'

# 可选：指定自定义钱包目录（默认：~/.agent-wallet）
export AGENT_WALLET_DIR="$HOME/.agent-wallet"
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

### 第二步：本地私有化部署

#### 方式 A：npx 直接运行（推荐）

最简单快捷的方式，无需安装或克隆。

**命令：**

```bash
npx -y @bankofai/sun-mcp-server
```

**说明：**
- `npx` 会自动下载最新版本的 `@bankofai/sun-mcp-server`
- `-y` 标志自动确认提示
- 首次运行可能需要几秒钟下载

**带环境变量运行：**

```bash
TRON_NETWORK=nile npx -y @bankofai/sun-mcp-server
```

#### 方式 B：从源码克隆

适合开发和自定义修改。

**步骤：**

```bash
# 1. 克隆仓库
git clone https://github.com/BofAI/sun-mcp-server.git
cd sun-mcp-server

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 运行服务器
npx tsx src/index.ts
```

**或者全局安装：**

```bash
npm install -g @bankofai/sun-mcp-server
sun-mcp-server
```


#### 方式 C：HTTP 模式

以 HTTP 服务器模式运行 SUN MCP Server，允许远程连接。

**启动 HTTP 服务器：**

```bash
sun-mcp-server --transport streamable-http --host 127.0.0.1 --port 8080 --mcpPath /mcp
```

:::warning
HTTP 模式适用于本地开发和测试。对于远程部署，请使用 HTTPS 和适当的身份验证。
:::

:::tip 关于环境变量
- **npx 运行**：在运行命令前直接在终端导出环境变量。
- **HTTP 模式**：启动 HTTP 服务器时，环境变量应在启动命令前导出：

```bash
export TRON_NETWORK=nile
sun-mcp-server --transport streamable-http --host 127.0.0.1 --port 8080 --mcpPath /mcp
```

- **客户端配置**：服务器运行后，配置你的 MCP 客户端以连接到它。
:::

---

### 第三步：客户端配置

服务器运行后，需要配置你的 MCP 客户端与其连接。请参考你的 MCP 客户端文档获取配置说明。服务器可通过以下方式访问：

- **npx/本地构建**：通常作为客户端管理的子进程运行
- **HTTP 模式**：`http://127.0.0.1:8080/mcp`（或你指定的主机/端口）

---

### 第四步：验证接入是否成功

启动 AI 客户端后，应该能看到 SUN MCP Server 的工具列表。进行以下测试以确认配置正确：

#### 查询测试

在聊天中尝试以下命令：

```
查一下 SunSwap 上 USDT 和 TRX 的当前价格
```

期望返回当前区块号。

#### 如果在测试网中

如果您配置为使用 Nile 测试网：

```bash
TRON_NETWORK=nile
```

可以在 [TRON Nile 水龙头](https://nile.trongrid.io/join) 获取测试 TRX，然后尝试以下操作：

- 查询测试账户余额
- 执行一次测试交换（如果已配置钱包）
- 检查交易历史

:::info 诊断步骤
如果遇到连接问题：

1. **检查网络连接**：确保能访问 TRON 网络端点
2. **查看日志**：运行服务器时查看控制台输出，寻找错误信息
3. **测试网络**：尝试切换到测试网（Nile）排除网络问题
:::

---

## 下一步

现在您已成功部署 SUN MCP Server！接下来可以：

1. **查看完整能力清单**：浏览 [完整能力清单](./ToolList.md) 了解所有可用操作
2. **解决常见问题**：查阅 [常见问题解答](./FAQ.md) 获取帮助

:::success
恭喜！您现在可以通过 AI 客户端与 TRON 区块链进行交互。开始探索 DeFi 的无限可能吧！
:::
