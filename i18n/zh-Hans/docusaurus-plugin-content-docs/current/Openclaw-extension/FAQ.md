# 常见问题与排查

遇到问题时，先来这里找找答案。按照你最可能遇到的顺序组织：安装问题、连接问题、凭证问题、运行时问题，最后是一些通用问题。

---

## 安装问题

### 安装程序报错"command not found: node"

安装程序需要 Node.js v18.0.0 或更高版本。检查是否已安装：

```bash
node --version
```

如果未安装或版本太低，请到 [nodejs.org](https://nodejs.org/) 下载安装最新 LTS 版本。安装 Node.js 后，`npx` 命令会同时可用。

### 安装程序报错"command not found: python3"

安装程序使用 Python 处理 JSON 配置文件。macOS 通常自带 Python 3，Linux 可以通过包管理器安装：

```bash
# Ubuntu/Debian
sudo apt install python3

# macOS (通过 Homebrew)
brew install python3
```

### 安装程序警告"OpenClaw not found"

安装程序检测到 `~/.openclaw` 目录不存在。这意味着 OpenClaw 可能未安装，或者安装在了非标准路径。

安装程序会询问你是否继续——你可以选择继续安装（MCP Server 和 Skills 仍然会被配置），但 OpenClaw 启动后可能无法自动加载它们。建议先到 [OpenClaw 官方仓库](https://github.com/openclaw) 完成安装。

### Skills 克隆失败

如果 `git clone` 失败，常见原因包括：

- **网络问题**：检查是否能访问 GitHub。可以尝试 `git clone https://github.com/BofAI/skills.git` 手动测试。
- **Git 未安装**：运行 `git --version` 确认。
- **指定的分支/标签不存在**：如果你设置了 `GITHUB_BRANCH` 环境变量，确认对应的分支或标签确实存在。

Skills 克隆失败不会中断整个安装——MCP Server 的配置仍然完好。你可以之后手动安装 Skills。

### npm install 失败

安装 Skills 时，部分 Skill（如 sunswap、x402-payment）需要运行 `npm install` 安装依赖。如果失败：

- 检查网络连接（npm 需要访问 registry.npmjs.org）
- 确认 Node.js 版本 >= 18
- 尝试手动运行：
  ```bash
  cd ~/.openclaw/skills/sunswap   # 或其他 Skill 目录
  npm install
  ```

npm install 失败不会中断安装程序——它会发出警告但继续。该 Skill 的部分功能可能受限，直到依赖安装成功。

---

## 连接问题

### OpenClaw 启动后看不到区块链工具

**最常见的原因**：没有重启 OpenClaw。修改 mcporter.json 后，必须完全退出并重新启动 OpenClaw。

如果重启后仍然看不到：

1. **检查 mcporter.json 格式**：
   ```bash
   python3 -m json.tool ~/.mcporter/mcporter.json
   ```
   如果报 JSON 语法错误，修复格式问题后重启。

2. **检查 mcporter.json 内容**：确认 `mcpServers` 下有你安装的 Server 条目。

3. **手动测试 MCP Server**：
   ```bash
   npx -y @bankofai/mcp-server-tron
   ```
   如果这条命令能正常启动（显示日志输出），说明 MCP Server 本身没问题，问题在 OpenClaw 的配置读取。

### 只有查询工具可用，没有转账等写入工具

这是设计如此。写入工具只在配置了钱包凭证后才会出现。检查以下之一是否已配置：

- 环境变量 `TRON_PRIVATE_KEY`（mcp-server-tron）
- 环境变量 `PRIVATE_KEY`（bnbchain-mcp）
- mcporter.json 中对应 Server 的 `env.TRON_PRIVATE_KEY` 或 `env.PRIVATE_KEY`

配置凭证后重启 OpenClaw。详细说明请参阅 [配置参考](./Configuration.md)。

### MCP Server 启动超时

如果 OpenClaw 在启动 MCP Server 时超时，可能是 npx 下载包太慢。首次运行时需要从 npm 下载包，可能需要几十秒。

可以提前手动下载来加速：

```bash
npx -y @bankofai/mcp-server-tron --help
npx -y @bnb-chain/mcp@latest --help
```

下载完成后，后续启动会使用缓存，速度会快很多。

---

## 凭证问题

### "私钥无效"错误

**TRON 私钥**应为 64 个字符的十六进制字符串，可以带或不带 `0x` 前缀。

**EVM 私钥**应带 `0x` 前缀。安装程序会自动为不带前缀的私钥添加 `0x`，但如果你手动编辑配置文件，请确保格式正确。

常见错误：
- 多余的空格、换行或引号嵌套
- 从其他地方复制时带入了不可见字符

验证方法：将私钥导入对应的钱包（TronLink 或 MetaMask）确认有效。

### TronGrid API Key 不生效

1. **变量名是否正确**：必须是 `TRONGRID_API_KEY`（不是 `TRON_API_KEY`）
2. **Key 是否仍然有效**：登录 [trongrid.io](https://www.trongrid.io/) 确认状态
3. **是否正确加载**：如果在环境变量中设置，确认已运行 `source ~/.zshrc`

### Gasfree 凭证不起作用

检查 `~/.x402-config.json` 的格式和内容：

```bash
cat ~/.x402-config.json
```

确认包含有效的 `gasfree_api_key` 和 `gasfree_api_secret`。如果需要重新配置，可以直接编辑文件或重新运行安装程序。

### BANK OF AI API Key 无效

检查 `~/.bankofai/config.json` 或 `~/.mcporter/bankofai-config.json` 的内容：

```bash
cat ~/.bankofai/config.json
```

确认 `api_key` 字段包含有效的 Key。注意 recharge-skill 的凭证读取有优先级顺序（CLI 参数 > 环境变量 > 工作目录 `bankofai-config.json` > `~/.bankofai/config.json` > `~/.mcporter/bankofai-config.json`），如果你在多个地方设置了不同的值，可能会读到意外的那个。

---

## 运行时问题

### 请求限速（429 错误）

主网的公共 RPC 有严格的频率限制。解决方法：

- **配置 TronGrid API Key**：免费申请后设置 `TRONGRID_API_KEY`，显著提升限额
- **使用测试网**：Nile 和 Shasta 测试网受限更少
- **减少并发查询**：在提示词中避免让 AI 同时执行大量查询

### Skill 执行失败

如果某个 Skill 报错，按以下顺序排查：

1. **检查依赖是否安装**：
   ```bash
   cd ~/.openclaw/skills/<skill-name>
   npm install  # 如果有 package.json
   ```


2. **检查 Node.js 版本**：部分 Skill 需要 >= 18.0.0。

### 交易失败

链上交易失败的常见原因：

- **余额不足**：TRX 余额不够支付 Gas 费（带宽/能量）
- **能量不足**：智能合约调用（包括 TRC20 转账）需要消耗能量
- **账户未激活**：新的 TRON 地址需要先收到一笔 TRX 才能激活
- **授权额度不足**：TRC20 代币转账前可能需要先 approve

使用 mcp-server-tron 的 `get_transaction_info` 工具查看交易失败的具体原因。

---

## 通用问题

### 能否只安装部分组件？

可以。安装程序在每个阶段都允许你选择性安装。比如你可以只安装 mcp-server-tron 而不装其他 MCP Server，或者只安装 sunswap Skill 而跳过其他 Skill。

### 能否多次运行安装程序？

可以。安装程序对 mcporter.json 采用深度合并策略，不会覆盖已有配置。对于 Skills，如果目标位置已存在同名 Skill，会提示你是否覆盖。

### 如何完全卸载？

OpenClaw Extension 没有自动卸载程序。手动卸载步骤：

1. **删除 MCP Server 配置**：编辑 `~/.mcporter/mcporter.json`，移除对应的 Server 条目
2. **删除 Skills**：删除安装目录下的 Skill 文件夹（默认 `~/.openclaw/skills/`）
3. **删除凭证文件**：
   ```bash
   rm -f ~/.x402-config.json
   rm -f ~/.bankofai/config.json
   rm -f ~/.mcporter/bankofai-config.json
   rm -f ~/.clawdbot/wallets/.deployer_pk
   ```
4. **清理环境变量**：从 `~/.zshrc` 或 `~/.bashrc` 中移除相关 export 语句

### 支持哪些操作系统？

安装程序是 Bash 脚本，支持：
- **macOS**（Intel 和 Apple Silicon）
- **Linux**（Ubuntu、Debian、CentOS 等）
- **Windows**：需要通过 WSL（Windows Subsystem for Linux）运行

### 和 TRON MCP Server 的官方云服务有什么区别？

[官方云服务](../McpServer-Skills/MCP/TRONMCPServer/OfficialServerAccess.md)是远程托管的只读 MCP Server，不需要本地安装。OpenClaw Extension 则在你本地运行 MCP Server，配合私钥可以解锁完整的读写能力。

如果你只需要查询链上数据，云服务更简单。如果你需要转账、合约写入等操作，或者需要使用 Skills（如 SunSwap 交易），就需要 OpenClaw Extension。

---

## 下一步

- 从头开始 → [快速开始](./QuickStart.md)
