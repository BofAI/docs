# 安装

## 环境要求

- **Node.js** 20.0.0 或更高。
- **npm**（或兼容的包管理器）。
- 可选：**TronGrid API Key**，用于主网更高限流与稳定性。

## 安装步骤

```bash
# 克隆仓库
git clone <your-repo-url>
cd sun-mcp-server

# 安装依赖
npm install

# 构建
npm run build
```

## 验证

```bash
# 运行测试
npm test

# 启动服务（stdio）
npm start
```

使用 HTTP（streamable-http）模式时：

```bash
npm start -- --transport streamable-http --host 127.0.0.1 --port 8080 --mcpPath /mcp
```
