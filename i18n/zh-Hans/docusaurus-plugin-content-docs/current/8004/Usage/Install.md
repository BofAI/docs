# 安装指南 

## 通过 Python 安装

### 前置要求 

* **Python**: 3.11 或更高版本
* **pip**: 包管理器
* **私钥**: 用于签署交易（若仅运行只读模式则不需要）
* **RPC 节点**: 可访问的 Ethereum RPC 端点（例如 Alchemy, Infura）
* **IPFS 提供商（可选）**: Pinata、Filecoin 账号或本地 IPFS 节点
* **Subgraph（可选）**: 当你的部署提供 subgraph 端点时使用

### 安装步骤
#### 1. 通过 GitHub 安装（当前推荐） 
在终端窗口执行：
```bash
pip install "git+https://github.com/bankofai/8004-sdk.git#subdirectory=python"
```
> 当前 Python 包尚未发布到 PyPI。
#### 2. 源码安装 
在终端窗口执行：
```bash
git clone https://github.com/bankofai/8004-sdk.git
cd 8004-sdk/python
pip install -e .
```
### 核心依赖 
`bankofai.sdk_8004` 依赖以下组件：

* **web3** - EVM 链交互
* **eth-account** - 账户管理与签名
* **tronpy** - TRON 区块链交互
* **requests** - HTTP 请求处理
* **aiohttp** - 异步 HTTP 客户端
* **eth-hash** - 哈希工具（如 keccak）

> **注意**：所有依赖项都会在通过 pip 安装时自动安装。


## 通过 TypeScript 安装
### 前置要求
* **Node.js**: 20 或更高版本
* **npm 或 yarn**: 包管理器
* **写入操作配置**: 写入操作需配置 `signer`（私钥字符串）
* **RPC 节点**: 可访问的 Ethereum RPC 端点（例如 Alchemy, Infura）
* **IPFS 提供商（可选）**: Pinata、Filecoin 账号或本地 IPFS 节点
* **Subgraph（可选）**: 可按需传入 `subgraphUrl` 或 `subgraphOverrides`



### 安装步骤 
#### 1. 使用 npm 安装 
在终端窗口执行：
```bash
npm install @bankofai/8004-sdk
```
#### 2. 源码安装
在终端窗口执行：
```bash
git clone https://github.com/bankofai/8004-sdk.git
cd 8004-sdk/ts
npm install
npm run build
```


### 核心依赖 

`@bankofai/8004-sdk` 依赖以下组件：

* **viem** / EVM 客户端技术栈（已通过 npm 依赖项打包）
* **tronweb** / TRON 客户端技术栈（已通过 npm 依赖项打包）
* **graphql-request** / 用于 Subgraph 查询的 GraphQL 工具（已通过 npm 依赖项打包）

> **注意**：所有依赖项都会在使用 npm 或 yarn 安装时自动安装。

## 可选依赖 

为了实现更强大的功能：

* **Subgraph**: 可选配置；当你的部署提供端点时，可通过 `subgraphUrl` 或 `subgraphOverrides` 指定。
* **IPFS 提供商 (IPFS Providers)**: 支持使用 Pinata JWT 或 Filecoin 私钥进行去中心化文件存储。
