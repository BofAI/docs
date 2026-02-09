# 卖家快速入门

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**注意：** 本快速入门指南将首先使用测试网配置（TRON Nile）以确保测试过程的安全。当您准备好上线生产环境时，请参阅 [在主网运行](#在主网运行)，了解如何在 TRON 主网上接收真实支付所需的简单配置变更。

## 概览

作为卖家，只需 **3 步** 即可开始接收支付：

1. **安装 x402-tron SDK** — 安装 Python SDK
2. **开发服务器** — 为您的 API 端点添加支付保护
3. **启动促进者 (Facilitator)** — 运行支付验证服务

### 先决条件

在开始之前，请确保您已准备好：

- **Python 3.10+** 和 pip（[下载 Python](https://www.python.org/downloads/)）
- 一个用于接收款项的 **TRON 钱包地址**（例如，来自 [TronLink](https://www.tronlink.org/)）
- Python Web 开发的基础知识（本教程将使用 FastAPI）

**预配置示例：** 我们提供了开箱即用的示例代码：[服务器示例](https://github.com/open-aibank/x402-tron-demo/tree/main/server) 和 [促进者示例](https://github.com/open-aibank/x402-tron-demo/tree/main/facilitator)。您可以克隆仓库并直接运行它们！

### 配置参考

以下是您所需的关键配置项：

| 配置项            | 描述                                | 获取方式                                                            |
| ----------------- | ----------------------------------- | ------------------------------------------------------------------- |
| **TRON 钱包地址** | 您用于接收支付的地址（以 `T` 开头） | 通过 [TronLink](https://www.tronlink.org/) 钱包创建                 |
| **测试 TRX**      | 用于支付测试网交易的 Gas 费         | [Nile 水龙头](https://nileex.io/join/getJoinPage)                   |
| **测试 USDT**     | 用于支付流程测试的测试代币          | [Nile USDT 水龙头](https://nileex.io/join/getJoinPage) 或在社区索取 |

**测试网 vs 主网：**

- **测试网 (Nile)**：使用免费的测试代币，不涉及真实资金。网络标识符请使用 `tron:nile`。
- **主网**：涉及真实的 USDT 支付。需要 TronGrid API Key。网络标识符请使用 `tron:mainnet`。

## 第一步：安装 x402-tron SDK

x402-tron SDK 提供了为 API 添加支付保护所需的一切功能。

**选项 A：从 GitHub 安装（推荐）**

```bash
pip install "git+https://github.com/open-aibank/x402-tron.git@v0.1.6#subdirectory=python/x402[fastapi]"
```

**选项 B：从源码安装（用于开发）**

```bash
# Clone the repository
git clone https://github.com/open-aibank/x402-tron.git
cd x402-tron/python/x402

# Install with FastAPI support
pip install -e ".[fastapi]"
```

**验证安装：** 运行 `python -c "import x402_tron; print('SDK installed successfully!')"` 来验证。

## 第二步：开发您的服务器

现在，让我们创建一个带有支付保护的简单 API 服务器。SDK 提供了一个装饰器，可以自动处理支付验证。

创建一个名为 `server.py` 的新文件：

```python
from fastapi import FastAPI
from x402_tron.server import X402Server
from x402_tron.fastapi import x402_protected
from x402_tron.facilitator import FacilitatorClient

app = FastAPI()

# ========== Configuration ==========
# Replace with YOUR TRON wallet address (this is where you receive payments)
PAY_TO_ADDRESS = "YourTronWalletAddressHere"

# Facilitator URL (we'll start this in Step 3)
FACILITATOR_URL = "http://localhost:8001"
# ====================================

# Initialize x402 server
server = X402Server()
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

# This endpoint requires payment to access
@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],    # Price per request (supports multiple tokens)
    network="tron:nile",       # Use testnet for testing
    pay_to=PAY_TO_ADDRESS,     # Your wallet address
)
async def protected_endpoint():
    return {"data": "This is premium content!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**关键配置选项：**

| 参数      | 描述                   | 示例                   |
| --------- | ---------------------- | ---------------------- |
| `prices` | 单次请求的支付金额（列表） | `["0.0001 USDT"]` |
| `network` | TRON 网络标识符        | `"tron:nile"` (测试网) |
| `pay_to`  | 您的 TRON 钱包收款地址 | `"TYour...Address"`    |

**工作原理：** 当收到未附带支付的请求时，您的服务器会自动返回 HTTP 402 (Payment Required) 状态码及支付说明。剩余的流程将由客户端 SDK 自动处理！

## 第三步：启动促进者 (Facilitator)

促进者 (Facilitator) 是一项用于在链上验证并结算支付的服务。在启动您的 API 服务器之前，您需要先运行该服务。

**选项：**

- **运行您自己的促进者**（推荐用于测试）
- **使用官方促进者** — _即将推出_

### 运行您自己的促进者

打开一个 **新的终端窗口** 并运行以下命令：

```bash
# Clone the demo repository
git clone https://github.com/open-aibank/x402-tron-demo.git
cd x402-tron-demo

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.sample .env
```

**配置 `.env` 文件：**

```bash
# Facilitator wallet private key (for settling payments on-chain)
TRON_PRIVATE_KEY=your_facilitator_private_key_here

# TronGrid API Key (required for mainnet, optional for testnet)
TRON_GRID_API_KEY=your_trongrid_api_key_here
```

**促进者钱包：** 促进者需要一个持有 TRX 的钱包来支付能量和带宽费用。对于测试网，请从 [Nile 水龙头](https://nileex.io/join/getJoinPage) 获取免费 TRX。

**启动促进者：**

```bash
./start.sh facilitator
```

**促进者端点：** 运行后，促进者在 `http://localhost:8001` 提供以下端点：

- `GET /supported` - 支持的功能
- `POST /verify` - 验证支付载荷
- `POST /settle` - 链上结算支付
- `POST /fee/quote` - 获取费用报价

## 第四步：测试您的集成

现在，让我们验证一切是否正常运行！

### 4.1 启动您的服务器

在**新的终端窗口**中（保持促进者运行）：

```bash
python server.py
```

您的服务器现已在 `http://localhost:8000` 上运行。

### 4.2 测试支付流程

**测试 1：未付款访问**

```bash
curl http://localhost:8000/protected
```

预期结果：HTTP 402 响应，并在 `PAYMENT-REQUIRED` 标头中包含支付说明。

**测试 2：完整支付流程**

要测试完整的支付流程，您需要一个能够对支付进行签名的客户端。请参阅：

- [用户快速入门](./quickstart-for-human.md) - 适用于基于浏览器的支付
- [Agent 快速入门](./quickstart-for-agent.md) - 适用于 AI Agent 支付

## 故障排除

| 问题                              | 解决方案                                                                                                       |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 连接促进者时 `Connection refused` | 确保促进者运行在端口 8001 上                                                                                   |
| `ModuleNotFoundError: x402_tron`  | 运行 `pip install "git+https://github.com/open-aibank/x402-tron.git@v0.1.6#subdirectory=python/x402[fastapi]"` |
| 无效钱包地址错误                  | 确保您的 TRON 地址以 `T` 开头且长度为 34 个字符                                                                |

**需要帮助？** 查看完整示例：

- [服务器示例](https://github.com/open-aibank/x402-tron-demo/tree/main/server)
- [促进者示例](https://github.com/open-aibank/x402-tron-demo/tree/main/facilitator)

## 在主网运行

一旦您在测试网 (Nile) 上测试了集成，就可以准备在 TRON 主网上接受真实支付了。

### 1. 更新服务器配置

在您的 `server.py` 中，更改 `@x402_protected` 装饰器中的 `network` 参数：

```python
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    network="tron:mainnet",  # Change from "tron:nile" to "tron:mainnet"
    pay_to=PAY_TO_ADDRESS,
)
```

### 2. 更新您的促进者 (Facilitator)

如果您在主网上运行自己的促进者服务，请执行以下操作：

1.  **申请 TronGrid API Key**：前往 [TronGrid](https://www.trongrid.io/) 注册并创建 API Key。为了确保主网 RPC 访问的稳定性，这一步是必需的。
2.  **更新环境变量**：配置主网凭证（包括 `TRON_GRID_API_KEY`）。
3.  **准备 Gas 费**：确保促进者钱包中持有足够的 TRX，用于支付能量（Energy）和带宽（Bandwidth）费用。
4.  **切换网络配置**：将促进者的网络配置更新为 `mainnet`。

### 3. 更新您的收款钱包

请务必确认您的接收地址是**真实的主网地址**，以确保能正常接收 USDT 支付。

### 4. 进行真实支付测试

在正式上线前，请按以下步骤操作：

1.  先尝试**极小额**支付进行测试。
2.  验证资金是否成功到达您的钱包。
3.  监控促进者服务，观察是否有任何异常报错。

**警告：** 主网交易涉及真实资金。请务必先在测试网（Testnet）进行充分的测试，切换到主网后也请务必从小额开始验证。

## 网络标识符

x402-tron 使用简明的网络标识符：

| 网络名称            | 标识符         |
| ------------------- | -------------- |
| TRON 主网 (Mainnet) | `tron:mainnet` |
| TRON Nile 测试网    | `tron:nile`    |
| TRON Shasta 测试网  | `tron:shasta`  |

完整列表请参阅 [网络支持](../core-concepts/network-and-token-support.md)。

### 下一步

- 查看 [演示示例](https://github.com/open-aibank/x402-tron-demo/tree/main/server)，了解更复杂的支付流程。
- 深入了解 [核心概念](../core-concepts/http-402.md)，掌握 x402-tron 的运作机制。
- 作为 [用户买家](./quickstart-for-human.md) 开始体验，或配置一个 [AI Agent](./quickstart-for-agent.md)。

### 总结

恭喜！您已完成卖家快速入门指南。回顾一下您的成果：

| 步骤       | 完成事项                       |
| ---------- | ------------------------------ |
| **第一步** | 安装了 x402-tron SDK           |
| **第二步** | 创建了受支付保护的服务器端点   |
| **第三步** | 启动了用于验证支付的促进者服务 |
| **第四步** | 完成了集成测试                 |

恭喜 🎉！您的 API 现已准备就绪，可以通过 x402-tron 接收基于 TRON 网络的支付了！
