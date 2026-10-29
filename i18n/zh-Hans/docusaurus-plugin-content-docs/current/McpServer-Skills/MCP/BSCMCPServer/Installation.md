# 安装

### 前置要求

* **bun** v1.2.10 或更高版本
* **Node.js** v17 或更高版本（上游 README 的要求；`package.json` 未声明 `engines`，项目的发布流程使用 Node.js 20）

### 快速开始

1.  **克隆仓库：**
    ```bash
    git clone https://github.com/bnb-chain/bnbchain-mcp.git
    cd bnbchain-mcp
    ```

2.  **设置环境变量：**
    ```bash
    cp .env.example .env
    ```

3.  **编辑 `.env` 文件并配置你的信息：**
    * `PRIVATE_KEY`：你的钱包私钥（执行交易操作时必填）
    * `LOG_LEVEL`：设置日志级别（`DEBUG`, `INFO`, `WARN`, `ERROR`）
    * `PORT`：服务器端口号（默认：`3001` —— TRON MCP 服务的默认端口同样是 3001，本地同时运行两者时需要改掉其中一个）
    * `BNBCHAIN_MCP_SKIP_TRANSFER_CONFIRMATION`（可选，默认 `false`）：默认情况下，转账和支付类工具只返回预览和 `confirmToken`（5 分钟内有效），不会发送交易；需再用该 token 调用 `confirm_transfer` 才会执行。设为 `true` 则立即执行

4.  **安装依赖并启动开发服务器：**
    ```bash
    # 安装项目依赖
    bun install
    
    # 启动开发服务器
    bun dev:sse
    ```


### 使用 MCP 客户端测试

使用以下模板在你的 MCP 客户端中配置本地服务器：

```json
{
  "mcpServers": {
    "bnbchain-mcp": {
      "url": "http://localhost:3001/sse",
      "env": {
        "PRIVATE_KEY": "your_private_key_here"
      }
    }
  }
}
```

> 该模板沿用上游 README。使用 `url` 配置时，客户端连接的是已在运行的服务，`env` 块不会传给服务进程：服务从自己的 `.env` 读取 `PRIVATE_KEY`。

### 使用 Web UI 测试
使用 @modelcontextprotocol/inspector 进行测试。运行以下命令启动测试 UI（该脚本通过 `npx` 运行最新版 inspector，目前要求 Node.js 22.19 及以上）：

```bash
bun run test
```