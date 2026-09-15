# 安装

### 前置要求

* **bun** v1.2.10 或更高版本
* **Node.js** v18 或更高版本（该项目自身的下限是 v17，但 BANK OF AI 工具链的其余部分要求 18+，TRON MCP 服务更要求 20+）

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

### 使用 Web UI 测试
使用 @modelcontextprotocol/inspector 进行测试。运行以下命令启动测试 UI：

```bash
bun run test
```