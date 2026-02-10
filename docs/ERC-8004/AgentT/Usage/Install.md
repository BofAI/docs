# 安装指南 

## 通过 Python 安装

### 前置要求 

* **Python**: 3.8 或更高版本
* **pip**: 包管理器
* **私钥**: 用于签署交易（若仅运行只读模式则不需要）
* **RPC 节点**: 可访问的 Ethereum RPC 端点（例如 Alchemy, Infura）
* **IPFS 提供商（可选）**: Pinata、Filecoin 账号或本地 IPFS 节点
* **Subgraph**: 自动配置默认 URL（支持通过覆盖设置使用自定义 Subgraph 端点）

### 安装步骤
#### 1. 使用 pip 安装 
在终端窗口执行：
```bash
pip install agent0-sdk
```
#### 2. 源码安装 
在终端窗口执行：
```bash
git clone [https://github.com/agent0lab/agent0-py.git](https://github.com/agent0lab/agent0-py.git)
cd agent0-py
pip install -e .
```
### 核心依赖 
Agent0 SDK 依赖以下组件：

* **web3** - 以太坊区块链交互
* **eth-account** - 账户管理与签名
* **requests** - HTTP 请求处理
* **ipfshttpclient** - IPFS 集成
* **pydantic** - 数据验证与设置管理
* **python-dotenv** - 环境变量管理
* **aiohttp** - 异步 HTTP 客户端

> **注意**：所有依赖项都会在通过 pip 安装时自动安装。


## 通过 TypeScript 安装
### 前置要求
* **Node.js**: 22 或更高版本
* **npm 或 yarn**: 包管理器
* **写入操作配置**: 需配置服务器端私钥 (`privateKey`) 或浏览器钱包 (`walletProvider`, EIP-1193)
* **RPC 节点**: 可访问的 Ethereum RPC 端点（例如 Alchemy, Infura）
* **IPFS 提供商（可选）**: Pinata、Filecoin 账号或本地 IPFS 节点
* **Subgraph**: 自动配置默认 URL（支持通过覆盖设置使用自定义 Subgraph 端点）



### 安装步骤 
#### 1. 使用 pip 安装 
在终端窗口执行：
```bash
npm install agent0-sdk
```
#### 2. 源码安装
在终端窗口执行：
```bash
git clone https://github.com/agent0lab/agent0-ts.git
cd agent0-ts
npm install
npm run build
```


### 核心依赖 

Agent0 SDK 依赖以下组件：

* **viem** / EVM 客户端技术栈（已通过 npm 依赖项打包）
* **graphql-request** / 用于 Subgraph 查询的 GraphQL 工具（已通过 npm 依赖项打包）

> **注意**：所有依赖项都会在使用 npm 或 yarn 安装时自动安装。

## 可选依赖 

为了实现更强大的功能：

* **Subgraph**: 自动配置了默认 URL，用于实现快速搜索查询（可通过 `subgraphOverrides` 参数覆盖并指向自定义端点）。
* **IPFS 提供商 (IPFS Providers)**: 支持使用 Pinata JWT 或 Filecoin 私钥进行去中心化文件存储。
