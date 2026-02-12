# 安装

### 前置要求

* **bun** v1.2.10 或更高版本
* **Node.js** v17 或更高版本

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
    * `PORT`：服务器端口号（默认：`3001`）

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
        "PRIVATE_KEY": "你的私钥填在这里"
      }
    }
  }
}
```

### 使用 Web UI 测试
使用 @modelcontextprotocol/inspector 进行测试。运行以下命令启动测试 UI：

```Bash
bun run test
```