# 安装及使用
OpenClaw 扩展插件提供了一个 CLI 安装程序，可帮助您快速设置环境。

##  安装

### 先决条件

*   **OpenClaw** (您的个人开源 AI 助手) - [从此处安装](https://docs.openclaw.ai/install)
*   **Node.js** (v18+)
*   **Python 3** (用于配置辅助工具)
*   **Git** (用于克隆技能仓库)
*   **钱包** (用于区块链网络交互的私钥和 API 密钥)

**注意**：此安装程序使用 OpenClaw 的配置系统。请确保在运行此安装程序之前已安装 OpenClaw。

### 快速开始

**一键安装：**

```shell
curl -fsSL https://raw.githubusercontent.com/bankofai/openclaw-extension/refs/heads/main/install.sh | bash
```

或者从源代码安装：

```shell
git clone https://github.com/bankofai/openclaw-extension.git
cd openclaw-extension
./install.sh
```

### 安装内容

*   **MCP 服务器配置** - `~/.mcporter/mcporter.json`
*   **技能** - 安装到您选择的位置
*   **可用技能**：sunswap, x402-payment, x402-payment-demo

**注意**：此安装程序使用 `mcporter` (OpenClaw 的官方 MCP 管理器) 进行配置。请务必先安装 OpenClaw。

## 安全

### 凭证存储选项

安装程序提供了两种存储凭证的方法：

**选项 1：配置文件存储**

*   密钥存储在 `~/.mcporter/mcporter.json` 中。
*   方便但不安全（明文存储）。
*   **重要提示**：使用 `chmod 600 ~/.mcporter/mcporter.json` 保护文件。
*   切勿共享或将此文件提交到版本控制。

**选项 2：环境变量 (推荐)**

*   密钥从 shell 环境中读取。
*   更安全，不存储在配置文件中。
*   添加到您的 shell 配置文件 (`~/.zshrc`, `~/.bashrc` 等)：
    
    ```shell
    # For TRON
    export TRON_PRIVATE_KEY="your_private_key_here"
    export TRONGRID_API_KEY="your_api_key_here"

    # For BSC/EVM chains
    export PRIVATE_KEY="0x_your_private_key_here"
    ```


    
*   添加后重启 shell 或运行 `source ~/.zshrc`。

### 最佳实践

*   使用资金有限的专用代理钱包。
*   切勿使用您的主个人钱包。
*   在主网使用前，请在测试网上进行测试。
*   不要允许 AI 代理扫描包含私钥的文件。

## 使用风险自负

允许 AI 代理直接处理私钥涉及重大的安全风险。我们建议仅使用少量加密货币并谨慎行事。尽管有内置的安全措施，但不能保证您的资产不会丢失。此扩展插件目前处于实验阶段，尚未经过严格测试。它不提供任何保证或承担任何责任。在与主网交互之前，请务必在测试网上验证您的设置。



