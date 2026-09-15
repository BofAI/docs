---
title: 'MCP Server'
description: 'MCP Server 的版本发布记录。'
---

# MCP Server

MCP Server 的版本发布记录。

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
