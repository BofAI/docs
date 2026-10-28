---
title: 'MCP Server'
description: 'MCP Server 的版本发布记录。'
---

# MCP Server

MCP Server 的版本发布记录。

<div className="changelog-entry">
<div className="changelog-date">2026-10-27</div>
<div className="changelog-body">

### 包内容、Docker 模式与 HTTP 细节

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">修复</span></div>

- npm 包包含 `build/`、`bin/`、`package.json`、`README.md` 与 `LICENSE`；Docker 镜像始终以只读模式运行（`--readonly` 写死）；`/mcp` 的 `GET` / `DELETE` 返回 405、不支持 SSE；`GET /` 返回服务信息；`tron` / `trx` / `testnet` 是可用的网络别名。

👉 [本地部署](/zh-Hans/McpServer-Skills/MCP/TRONMCPServer/LocalPrivatizedDeployment/) · [工具列表](/zh-Hans/McpServer-Skills/MCP/TRONMCPServer/ToolList/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-10-23</div>
<div className="changelog-body">

### TRON MCP Server 文档按代码更正

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">修复</span></div>

- **未配置 API Key 时的 RPC**——`main`（tag `v1.1.8`）中，未设置 `TRONGRID_API_KEY` 时主网请求走 `https://hptg.bankofai.io`，设置后走 `api.trongrid.io`。Nile 与 Shasta 始终使用 TronGrid 测试网节点。npm 上的 `1.1.7` 在未配置 Key 时仍使用 `api.trongrid.io`。
- **工具与提示词**——`write_contract` 没有 `feeLimit` 参数（只有 `deploy_contract` 有）；`tron://networks` 返回 `{"supportedNetworks":[...]}`；只读模式下注册 4 个提示词，而非 6 个。
- **钱包报错**——常见问题改为引用 agent-wallet 2.x 的真实报错文本（`resolve_wallet could not find a wallet source in config or env`、`Password required for local_secure wallets`、`No active wallet set.`、`MAC mismatch — wrong password or corrupted file`）。agent-wallet 2.3.x 和 2.4.0 都接受别名 `TRON_PRIVATE_KEY` 和 `TRON_MNEMONIC`，但只有在解析不到密码且钱包目录里没有钱包时才会读取这些环境变量，否则会静默忽略。在这条路径上同时设置了私钥和助记词时，agent-wallet 2.3.x 报 `Wallet not configured.`，2.4.0 报 `Provide only one of AGENT_WALLET_PRIVATE_KEY or AGENT_WALLET_MNEMONIC`。
- **Node.js**——源码检出的 `v1.1.8` 要求 22.23.4+（22.x）或 24.22.1+（24.x）；`npx` 运行的 npm `1.1.7` 声明的是 `>=20`。无论哪种方式，页面都推荐 2026 年 10 月的安全更新版本。云服务快速开始页把硬性要求「Node.js v20.0.0 或更高版本」改为「需要 Node.js 以执行 `npx`」，并推荐 22.23.4+ 或 24.22.1+。
- **Agent Wallet 安装固定到 2.x**——服务端依赖 `@bankofai/agent-wallet ^2.3.0`，但不带版本号的 `npm install -g @bankofai/agent-wallet` 现在会装上 3.0.0，它没有 `local_secure` 钱包、主密码和 `--save-runtime-secrets`。页面现改用 `npm install -g @bankofai/agent-wallet@2`，并注明 Agent-Wallet 文档描述的是 3.x。

👉 [快速开始](/zh-Hans/McpServer-Skills/MCP/TRONMCPServer/QuickStart/) · [常见问题与排查](/zh-Hans/McpServer-Skills/MCP/TRONMCPServer/FAQ/) · [本地私有化部署](/zh-Hans/McpServer-Skills/MCP/TRONMCPServer/LocalPrivatizedDeployment/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-09-09</div>
<div className="changelog-body">

### TRON 与 BSC 服务文档校正

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">修复</span></div>

- **TronGrid API Key**——FAQ 里描述的 `--header TRONGRID-API-KEY:...` 写法没有任何代码实现。服务端从自身进程环境读取 `TRONGRID_API_KEY`，再以 `TRON-PRO-API-KEY` 转发给上游，完全不解析进入的请求头，因此无法按请求给托管服务传 Key；需要自己的配额请用本地或自建实例。
- **钱包配置**——私有化部署页此前称执行 `agent-wallet start` 后"无需额外环境变量"。该命令并不会持久化主密码，之后签名会失败；现已说明需使用 `--save-runtime-secrets` 或 export `AGENT_WALLET_PASSWORD`，并注明只要能解析到密码、或密钥库里已有钱包，`AGENT_WALLET_PRIVATE_KEY` 就会被忽略。
- **HTTP 模式与 Docker**——发布包启动 HTTP 模式的方式是 `npx -y @bankofai/mcp-server-tron --http`；`npm run start:http` 与 Dockerfile 都需要先检出源码，二者都不包含在 npm 包内。
- **短参数**——启动器把 `-h` 当作 `--http` 的简写、`-r` 当作 `--readonly` 的简写；它没有帮助参数，所以输入 `-h` 会直接启动 HTTP 服务器而不是打印用法。私有化部署页现已就此给出提示，并补充说明了 Docker 与源码启动脚本会读取的 `MCP_LOG_DIR` 变量。
- **BSC 页面**——补充说明其默认端口 3001 与 TRON 服务冲突，并把 Node.js 版本下限与工具链其余部分对齐。

👉 [TRON MCP Server](/zh-Hans/McpServer-Skills/MCP/TRONMCPServer/LocalPrivatizedDeployment/) · [常见问题](/zh-Hans/McpServer-Skills/MCP/TRONMCPServer/FAQ/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-03-17</div>
<div className="changelog-body">

### TRON MCP Server 完整工具清单

<div className="changelog-tags"><span className="changelog-tag">文档</span><span className="changelog-tag">TRON</span></div>

- 新增**工具列表**页，逐个列出 TRON MCP Server 暴露的所有工具及其参数——接入前就能看清 AI 客户端到底能调用什么。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-03-10</div>
<div className="changelog-body">

### 两种接入方式

<div className="changelog-tags"><span className="changelog-tag">新增</span><span className="changelog-tag">TRON</span></div>

- **官方服务接入**——客户端直接指向托管地址，不用自己维护任何服务。
- **本地私有化部署**——密钥和流量需要留在自己环境里时，可以自行部署。

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">2026-02-11</div>
<div className="changelog-body">

### TRON 与 BSC MCP Server 上线

<div className="changelog-tags"><span className="changelog-tag">新增</span></div>

- **TRON MCP Server** 与 **BSC MCP Server** 首批文档发布，覆盖安装、功能与接口说明。

</div>
</div>
