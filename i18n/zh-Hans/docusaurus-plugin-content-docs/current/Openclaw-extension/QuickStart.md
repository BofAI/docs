# 快速开始

这个页面的目标是：**让你在几分钟内完成安装，并发起第一次区块链查询。**

安装程序是交互式的，会引导你选择要安装哪些 MCP Server 和 Skills，然后自动完成所有配置。你只需要按提示操作即可。

---

## 准备工作

在运行安装程序之前，确保以下工具已就绪：

| 要求 | 说明 | 验证命令 | 下载安装 |
| :--- | :--- | :--- | :--- |
| **OpenClaw** | 你的开源 AI 助手 | 检查 `~/.openclaw` 目录是否存在 |[OpenClaw 官方仓库](https://github.com/openclaw)  |
| **Node.js v18+** | 运行 MCP Server 所需 | `node --version` | [Node.js 官方网站](https://nodejs.org/) |
| **Python 3** | 安装程序用于处理 JSON 配置 | `python3 --version` | [Python 官方网站](https://www.python.org/downloads/)|
| **Git** | 克隆 Skills 仓库 | `git --version` | [Git 官方网站](https://git-scm.com/) |


---

## 运行安装程序

### 方式一：一键安装（推荐）

```bash
curl -fsSL https://raw.githubusercontent.com/BofAI/openclaw-extension/refs/heads/main/install.sh | bash
```

### 方式二：从源码安装

```bash
git clone https://github.com/BofAI/openclaw-extension.git
cd openclaw-extension
./install.sh
```

安装程序启动后，会自动检查环境依赖（Node.js、npx、Git、Python），如果发现缺失会立即提示。

如无依赖缺失，进入安装过程，安装过程分为两个主要阶段，每一步都会让你交互式选择。

---

## 安装过程详解

### 第一阶段：选择并配置 MCP Server

安装程序会列出所有可用的 MCP Server，让你选择要安装哪些：

```
📦 Available MCP Servers:
  1) mcp-server-tron    - TRON blockchain interaction
  2) bnbchain-mcp       - BNB Chain (BSC, opBNB, Ethereum) interaction
  3) ainft-merchant     - Remote AINFT recharge MCP

Select servers to install (e.g., 1,2,3 or 'all'):
```

对于每个选中的服务器，安装程序会继续询问凭证存储方式：

- **选项 1：保存到配置文件** — 密钥以明文存储在 `~/.mcporter/mcporter.json` 中。方便但安全性较低。
- **选项 2：使用环境变量（推荐）** — 密钥从系统环境变量读取，不写入任何文件。

如果你选择保存到配置文件，安装程序会接着询问具体的密钥值（私钥、API Key 等）。如果选择环境变量，安装程序会告诉你需要设置哪些变量。

> **建议**：如果你只是想快速体验，可以先跳过密钥配置（直接回车留空）。没有私钥时 MCP Server 会以只读模式运行，你仍然可以查询链上数据。

### 第二阶段：选择并安装 Skills

安装程序会从 GitHub 克隆 [Skills 仓库](https://github.com/BofAI/skills)，自动发现所有可用的 Skill，并让你选择：

```
🔧 Available Skills:
  1) sunswap          - SunSwap DEX trading skill
  2) tronscan-skill   - TRON blockchain data lookup
  3) x402-payment     - Agent payment protocol (x402)
  4) ainft-skill       - AINFT balance/order queries

Select skills to install (e.g., 1,2,3 or 'all'):
```

然后选择安装位置：

| 选项 | 路径 | 适用场景 |
| :--- | :--- | :--- |
| **用户级别**（推荐） | `~/.openclaw/skills/` | 所有项目共享 |
| **工作区级别** | `.openclaw/skills/` | 仅当前项目使用 |
| **自定义路径** | 你指定的目录 | 特殊需求 |

部分 Skill 有额外的凭证需求，安装程序会在安装时逐一提示：

- **x402-payment** — 可选配置 Gasfree API 凭证（用于免 Gas 交易）
- **ainft-skill** — 需要 AINFT API Key
- **tronscan-skill** — 提示你在 shell 中设置 `TRONSCAN_API_KEY` 环境变量
- **sunswap** — 提示配置 TRON 私钥（如果前面没有配置）

---

## 验证安装是否成功

安装完成后，**重启 OpenClaw**，然后在对话中输入：

```
查一下 TRON 主网当前的区块高度
```

如果收到正常响应（显示当前区块高度），说明 mcp-server-tron 已成功接入。

你还可以试试：

```
查一下 TRON 地址 TXyz... 的 TRX 余额
```

```
TRON 主网当前的能量和带宽价格是多少？
```

如果这些查询都能正常返回结果，说明一切就绪。

:::info 关于只读模式
如果你在安装时没有配置私钥，MCP Server 会以只读模式运行——所有查询类操作（查余额、查交易、查合约状态等）都可以正常使用，但转账、合约写入等操作不可用。要解锁写入能力，请参阅 [配置参考](./Configuration.md)。
:::

---

## 遇到问题？

如果安装后 AI 助手无法识别区块链工具，常见原因包括：

- **没有重启 OpenClaw** — 修改配置后必须完全重启
- **Node.js 版本太低** — 确保 v18.0.0 或更高
- **mcporter.json 格式错误** — 可以用 `python3 -m json.tool ~/.mcporter/mcporter.json` 检查

更多排查方法请参阅 [常见问题](./FAQ.md)。

---

## 下一步

- 遇到问题？ → [常见问题](./FAQ.md)
