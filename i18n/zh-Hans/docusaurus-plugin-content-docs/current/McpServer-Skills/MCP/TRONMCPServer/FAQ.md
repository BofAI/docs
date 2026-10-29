# 常见问题与排查

遇到问题时，先来这里找找答案。本页按照你最可能遇到的顺序组织：先是连接问题（最常见），然后是认证与密钥、链上错误、AI 行为异常，最后是一些通用的常见问题。

---

## 连接问题

连接问题通常发生在首次配置阶段。如果 AI 客户端无法识别 TRON 工具，多半是这里出了问题。

### 你的 MCP 客户端提示"无法连接到 MCP 服务器"

这是最常见的问题。按以下顺序逐一排查：

1. **检查 Node.js 版本**。声明的版本要求取决于你运行服务端的方式：
   - **`npx -y @bankofai/mcp-server-tron`** 运行的是 npm 包 `1.1.7`，它声明的是 Node.js `>=20`。
   - **源码检出**的 `main`（tag `v1.1.8`）要求 22.23.4+（22.x）或 24.22.1+（24.x）。其 `package.json` 里的版本号仍是 `1.1.7`，因此服务端上报的版本也是 `1.1.7`。

   无论哪种方式，都推荐使用 2026 年 10 月的安全更新版本 22.23.4+ 或 24.22.1+：
   ```bash
   node --version  # 推荐：v22.23.4+ 或 v24.22.1+
   ```
   如果版本低于你所用方式声明的要求，请先升级 Node.js。

2. **检查 npx 是否可用**。在终端运行 `npx --version`。如果找不到命令，说明 Node.js 安装不完整，需要重新安装。

3. **验证配置文件格式**。你的 MCP 客户端配置文件必须是合法的 JSON。常见错误包括多余的逗号、缺少引号或括号不匹配。使用 JSON 校验工具验证你的配置文件。

4. **完全重启**。关闭窗口不等于退出——你需要彻底退出你的 MCP 客户端，然后重新打开。

5. **查看日志**。如果以上都没解决问题，查看你的 MCP 客户端的日志文件，搜索包含 "mcp" 或 "tron" 的条目。

### HTTP 模式下"连接被拒绝"

使用 HTTP 模式（`npx -y @bankofai/mcp-server-tron --http`，或源码检出后的 `npm run start:http`）时客户端无法连接，通常是以下原因：

1. **服务器没有在运行**。先确认一下：
   ```bash
   curl http://localhost:3001/health
   ```
   如果返回"Connection refused"，说明服务器进程没有启动或已经退出。

2. **端口被占用**。可能有其他程序占用了 3001 端口：
   ```bash
   lsof -i :3001
   ```
   如果端口冲突，通过环境变量换一个端口：
   ```bash
   export MCP_PORT=3002
   ```

3. **防火墙拦截**。如果你从另一台机器访问本地 HTTP 服务，检查防火墙是否允许该端口的入站连接。

### 写入工具出现但返回钱包错误 {#write-tools-wallet-error}

从 v1.1.7 起，写入工具（转账、质押等）始终出现在 AI 的工具列表中，但会在执行时检查钱包是否已配置。如果没有可用钱包就调用写入工具，会返回类似 `Error transferring TRX: <原因>` 的错误，其中 `<原因>` 来自 Agent Wallet——各条错误的含义见下方[钱包错误信息](#wallet-error-messages)。

要启用写入操作，请配置本服务端所依赖的 Agent Wallet **2.x**：

```bash
npm install -g @bankofai/agent-wallet@2
agent-wallet start local_secure --save-runtime-secrets
```

- `--save-runtime-secrets` 会把主密码写入 `~/.agent-wallet/runtime_secrets.json`；也可以改为把 `AGENT_WALLET_PASSWORD` 环境变量设为主密码
- 可选设置 `AGENT_WALLET_DIR`（如使用自定义钱包目录）

[Agent-Wallet 文档](../../../Agent-Wallet/Intro.md)描述的是 Agent Wallet 3.x，本服务端尚未使用该版本——请使用上面的 2.x 命令。

配置完成后重启 AI 客户端即可。详细说明请参阅[本地私有化部署](./LocalPrivatizedDeployment.md)。

:::info
如果你通过官方云服务连接或使用 `--readonly` 模式，写入工具根本不会出现——这是预期行为。
:::

---

## 认证与密钥问题

### 钱包错误信息 {#wallet-error-messages}

TRON MCP Server 使用 [Agent Wallet](../../../Agent-Wallet/Intro.md) 进行所有钱包管理。当写入工具（或 `get_wallet_address` / `sign_message`）拿不到钱包时，错误文本会告诉你属于哪种情况：

| 错误文本 | 含义 |
| :--- | :--- |
| `resolve_wallet could not find a wallet source in config or env` | 完全没有钱包：解析不到密码，钱包目录中没有任何钱包，且 `AGENT_WALLET_PRIVATE_KEY`、`TRON_PRIVATE_KEY`、`AGENT_WALLET_MNEMONIC`、`TRON_MNEMONIC` 都未设置。 |
| `Password required for local_secure wallets` | 钱包目录中有钱包，但没有解析到密码——既没有 `runtime_secrets.json`，也没有 `AGENT_WALLET_PASSWORD`。 |
| `No active wallet set.` | 解析到了密码，但钱包目录中没有任何钱包。此时私钥和助记词环境变量都会被忽略——请用 Agent Wallet 创建或导入钱包，或去掉密码以走环境变量私钥路径。 |
| `MAC mismatch — wrong password or corrupted file` | 找到了密码，但与 keystore 不匹配（见下一节）。 |
| `Wallet not configured.` | Agent Wallet 连配置都无法加载——例如 `runtime_secrets.json` 或 `wallets_config.json` 格式错误。使用 agent-wallet 2.3.x（源码检出按 `package-lock.json` 安装的版本）时，在走到环境变量路径时（见表格下方说明）同时设置了私钥和助记词，也会得到这条错误。 |
| `Provide only one of AGENT_WALLET_PRIVATE_KEY or AGENT_WALLET_MNEMONIC` | 使用 agent-wallet 2.4.0（`npx -y @bankofai/mcp-server-tron`，即 npm `1.1.7`、依赖 `^2.3.0`，当前安装的版本）时，走到了环境变量路径，且同时设置了私钥（`AGENT_WALLET_PRIVATE_KEY` 或 `TRON_PRIVATE_KEY`）和助记词（`AGENT_WALLET_MNEMONIC` 或 `TRON_MNEMONIC`）。服务端会原样透传这段文本，例如 `Error transferring TRX: Provide only one of …`，或 `get_wallet_address` 返回的 `Error: Provide only one of …`。去掉其中一个即可。 |

两个 agent-wallet 版本都从 `AGENT_WALLET_PRIVATE_KEY` 或其别名 `TRON_PRIVATE_KEY` 读取私钥，从 `AGENT_WALLET_MNEMONIC` 或其别名 `TRON_MNEMONIC` 读取助记词。只有走到环境变量路径——解析不到任何密码**且**钱包目录里一个钱包都没有——时才会读取这些变量；否则它们会被静默忽略，上面两种「同时设置」引起的错误也都不会出现。

前两种情况的解决方法：

1. **还没有钱包：安装并初始化 Agent Wallet 2.x**：执行 `npm install -g @bankofai/agent-wallet@2`，再执行 `agent-wallet start local_secure --save-runtime-secrets`，同时把主密码保存到 `runtime_secrets.json`。（[Agent-Wallet 文档](../../../Agent-Wallet/Intro.md)描述的是 3.x，本服务端尚未使用该版本。）
2. **已经有钱包：让服务端能拿到密码**——导出环境变量：
   ```bash
   export AGENT_WALLET_PASSWORD='<你的主密码>'
   ```
   或按[本地私有化部署](./LocalPrivatizedDeployment.md)（路径 1）的方法保存到 `runtime_secrets.json`。重新执行 `agent-wallet start` 没有用：已有钱包时它只提供 `add`（创建一个新钱包并把它设为当前钱包）和 `exit`（不保存任何内容）两个选项。
3. **重启 AI 客户端**使配置生效。服务端只解析一次钱包来源并缓存，修改钱包设置后必须重启。

### "MAC mismatch — wrong password or corrupted file" 错误

服务端解析到的密码（来自 `runtime_secrets.json` 或 `AGENT_WALLET_PASSWORD`）必须与运行 `agent-wallet start` 时设置的主密码完全一致。请确认钱包目录存在（`ls ~/.agent-wallet/`），如果使用了自定义目录，确保 `AGENT_WALLET_DIR` 指向正确路径。

如果密码丢失，需要重新初始化钱包。**警告：此操作会清除所有钱包和密钥——请务必提前转移资金或备份助记词。** 运行 `agent-wallet reset` 清除并重新开始。在 agent-wallet 2.x（本服务使用的版本）中，`reset` 会删除 `~/.agent-wallet` 里的所有文件——`master.json`、`wallets_config.json`、`runtime_secrets.json` 以及 `secret_*.json` 密钥库。Agent-Wallet 文档描述的是 3.x，其 `reset` 只删除 `wallets_config.json`。

### TronGrid API Key 不生效

已配置了 API Key 但请求仍然受到限速，检查以下几点：

1. **变量名是否正确**。正确的变量名是 `TRONGRID_API_KEY`（不是 `TRON_API_KEY` 或其他变体）。

2. **Key 是否仍然有效**。登录 [trongrid.io](https://www.trongrid.io/) 确认 API Key 处于激活状态。

3. **密钥从环境变量读取，不走请求头。** 服务端从自身进程环境读取 `TRONGRID_API_KEY`，再以 `TRON-PRO-API-KEY` 转发给上游；它完全不解析进入的请求头。因此无法按请求给托管的云服务传 API Key——需要自己的配额，请在本地或自建实例上设置 `TRONGRID_API_KEY`。

---

## 链上错误

这些错误发生在交易执行阶段，通常与链上资源或合约逻辑有关。

### "带宽不足"

每笔 TRON 交易都会消耗带宽。如果账户既没有足够的质押带宽，TRX 余额也不够燃烧换取带宽，交易就会失败。

**怎么解决：**
- 先让 AI 查看你的带宽情况："查看我的地址的带宽资源"
- 质押一些 TRX 换取带宽："质押 100 TRX 获取带宽"
- 或者确保账户有足够的 TRX 余额——即使没有质押带宽，系统也会自动燃烧 TRX 来支付

### "能量不足"

与智能合约交互（包括 TRC20 代币转账）需要消耗能量。如果质押的能量不够用，系统会燃烧 TRX 来弥补；如果 TRX 也不够，交易就会失败。

**怎么解决：**
- 先预估费用："预估调用这个合约的 transfer 函数需要多少能量"
- 质押 TRX 换取能量："质押 500 TRX 获取能量"
- `write_contract` 没有手续费上限参数，请确保钱包有足够 TRX 燃烧以补足能量缺口。只有 `deploy_contract` 接受 `feeLimit`（单位 Sun，默认 1,000,000,000 = 1000 TRX），部署大合约时可以让 AI 调高它

### "账户不存在"或"账户未激活"

TRON 上的新地址必须"激活"后才能使用。地址首次收到 TRX 转账时会自动激活。

**怎么解决：**
- 向该地址发送少量 TRX（0.1 TRX 就够）
- 或使用 `create_account` 工具显式激活

### 交易显示"REVERT"状态

交易已被打包但执行失败，说明智能合约代码中某个 `require()` 条件不满足。

**怎么排查：**
1. 让 AI 诊断："诊断一下交易 [哈希] 为什么会 revert"
2. 常见原因包括：代币余额或授权额度不足、调用了没有权限的函数、传入了无效参数、合约特定的业务逻辑条件不满足
3. 使用 `read_contract` 查询合约状态，了解需要满足什么前置条件

---

## AI 行为问题

这些问题与 AI 模型本身的行为有关，而不是 TRON MCP Server 的 bug。

### AI 构造了无效地址

AI 模型有时会"编造"格式正确但实际不存在的 TRON 地址。TRON MCP Server 内置了地址验证，大多数接受地址的工具会自动拒绝无效地址。

**预防措施：**
- 始终通过复制粘贴提供精确地址，不要口头描述让 AI 猜测
- 不确定时用 `validate_address` 验证："验证一下这个地址 TXyz..."

### AI 尝试调用不存在的工具

AI 可能将 TRON MCP Server 的能力与其他区块链工具混淆。如果它尝试调用一个不存在的工具，会收到错误并自动尝试使用正确的工具。

如果反复出现这个问题，可以提醒 AI："请只使用 TRON MCP Server 提供的工具"，或查阅 [完整能力清单](./ToolList.md) 确认可用的工具列表。

### 响应速度较慢

几种常见原因和对策：

- **没有 TronGrid API Key**：未设置 `TRONGRID_API_KEY` 时，`v1.1.8` 起的源码检出中主网请求走 BANK OF AI 回退节点 `https://hptg.bankofai.io`，npm `1.1.7`（`npx` 运行的版本）则不带 Key 访问 `https://api.trongrid.io`。配置免费的 API Key 后，两个版本都会以你自己的配额访问 `https://api.trongrid.io`
- **复杂的多工具工作流**：某些操作（如钱包全貌分析）需要多个串行调用，等待是正常的
- **使用测试网开发**：Nile 和 Shasta 测试网通常响应更快
- **提示词更明确**：减少 AI 的探索性调用——直接告诉它用哪个工具、查哪个网络

---

## 通用问题

### 主网、Nile 和 Shasta 有什么区别？

| 网络 | 用途 | 是否有真实价值 | 如何获取代币 |
| :--- | :--- | :--- | :--- |
| **主网** | 生产环境 | 是（真实 TRX） | 交易所购买 |
| **Nile** | 开发测试（推荐） | 否（测试代币） | 水龙头免费领取 |
| **Shasta** | 开发测试 | 否（测试代币） | 水龙头免费领取 |

建议始终先在 Nile 上开发和测试，确认无误后再在主网执行。

### 能否同时使用多个 TRON MCP Server 实例？

可以。在 MCP 客户端配置中定义多个 MCP Server 条目即可——比如一个连接主网云服务（只读），另一个连接本地测试网部署（带钱包）。在客户端的 MCP 配置中使用不同的名称配置这两个服务。

### 如何更新到最新版本？

如果你使用的是 `npx` 方式运行，`npx -y @bankofai/mcp-server-tron` 并不一定会拉取最新版本：它可能直接运行已安装的副本——全局安装的、当前项目里的，或者在较旧的 npm 版本上 npx 缓存里的。要始终获取最新发布版本，请显式指定，例如在 MCP 客户端配置中使用：

```bash
npx -y @bankofai/mcp-server-tron@latest
```

也可以清除 npx 缓存：删除 `~/.npm/_npx`（必要时再执行 `npm cache clean --force`）。第三方包 `clear-npx-cache` 的作用相同：

```bash
npx clear-npx-cache
```

如果你是从源码克隆的：

```bash
cd mcp-server-tron
git pull
npm install
npm run build
```

### 支持哪个 MCP 协议版本？

协议版本由 `@modelcontextprotocol/sdk` 协商决定，服务端对它的依赖是 `^1.22.0`；源码检出的 `package-lock.json` 锁定为 1.27.1。MCP 协议版本 **2025-11-25** 需要 SDK 1.24.1 或更高版本——SDK 1.22.0–1.24.0 最高只支持 2025-06-18。客户端请求的更早协议版本同样可以使用。


