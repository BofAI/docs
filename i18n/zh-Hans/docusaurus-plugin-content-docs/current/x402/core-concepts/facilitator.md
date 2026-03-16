import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Facilitator

Facilitator 是一项**可选但强烈推荐**的服务，旨在简化客户端（买家）与服务端（卖家）在区块链网络上的支付验证与结算流程。

## 什么是 Facilitator？

Facilitator 是一种中间件服务，主要负责：

- **验证载荷**：校验客户端提交的支付载荷的有效性。
- **执行结算**：代表服务端将交易提交至区块链进行结算。
- **代币转移**：通过调用 `PaymentPermit` 合约的 `permitTransferFrom` 方法来执行代币转移。

通过引入 Facilitator，服务端无需维护与区块链节点的直连，也无需自行实现复杂的签名验证逻辑。这不仅降低了运维复杂度，还能确保交易验证的准确性与实时性。

## Facilitator 的职责

- **支付验证**：确认客户端提交的签名载荷严格符合服务端声明的支付要求。
- **支付结算**：将验证通过的交易提交至区块链网络，并监控上链状态。
- **费率管理**：支持配置服务费（可选），即对促成的支付收取费用。
- **结果反馈**：将验证与结算结果返回给服务端，作为服务端决定是否交付资源的依据。

> **注意**：Facilitator **不持有资金**，也不充当托管方——它仅根据客户端签名的指令执行验证与链上操作。

## 为什么要使用 Facilitator？

集成 Facilitator 服务能带来显著优势：

- **降低运维门槛**：服务端无需直接处理区块链节点交互或 RPC 管理。
- **协议标准化**：确保跨服务的支付验证与结算流程保持一致。
- **快速集成**：服务端仅需极少的区块链开发工作即可开始接收支付。
- **资源费管理**：Facilitator 负责支付交易执行所需的 TRX（能量 Energy 和带宽 Bandwidth）/BNB，降低了服务端的持有成本。

虽然开发者可以选择在本地自行实现验证与结算逻辑，但使用 Facilitator 能显著加速开发周期并确保协议实现的规范性。

---

## Facilitator 选项：该用哪种？

要使用 x402，您需要接入 Facilitator 服务。目前有两种方案：

| | 官方 Facilitator | 自托管 Facilitator |
|---|---|---|
| **适合人群** | 大多数卖家，特别是刚开始使用 x402 的用户 | 需要完全掌控费用策略、能量管理的高级用户 |
| **是否需要维护服务器** | 不需要 | 需要 |
| **是否需要钱包私钥** | 不需要 | 需要（用于支付手续费）|
| **上手难度** | 低（申请 API Key 即可）| 中（需部署和配置服务）|
| **费用控制** | 固定策略 | 完全自定义 |
| **推荐场景** | 测试、快速上线、中小规模应用 | 大规模生产、需要自定义费率 |

---

## 方案一：使用官方 Facilitator（推荐）

官方托管的 Facilitator 服务已上线，您无需自行维护任何基础设施。

**工作流程：** 申请 API Key → 配置到项目中 → 将 `FACILITATOR_URL` 指向官方服务即可。

**官方服务涉及两个地址，用途不同，请注意区分：**

| 地址 | 用途 |
|------|------|
| [https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io) | **管理后台** — 用于注册账号、申请和管理 Facilitator API Key |
| [https://facilitator.bankofai.io](https://facilitator.bankofai.io) |  **服务端点** — 在项目代码的 `FACILITATOR_URL` 中配置，用于实际处理付款验证和结算请求（API 调用，非浏览器访问） |

### 第一步：申请 Facilitator API Key

1. 打开浏览器，访问 [https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io)
2. 使用 TronLink 钱包登录（仅用于身份验证，**不会扣款**）
3. 在 Dashboard 点击"创建 API Key"
4. 复制生成的 API Key，妥善保管

> 📖 **详细图文操作步骤**请参见：[官方 Facilitator](./OfficialFacilitator.md)

> ⚠️ **API Key 安全提示：** API Key 相当于您访问官方服务的凭证，**请勿提交到 Git 或分享给他人**。未配置 API Key 时限速为 1 次/分钟；配置后提升至 1000 次/分钟，足以支撑生产环境。

### 第二步：在项目中配置 API Key

在您的 x402 项目根目录，找到（或创建）`.env` 文件，添加以下内容：

```bash
# 官方 Facilitator 服务配置
FACILITATOR_API_KEY=在此填入您的API Key

# 官方 Facilitator 服务地址
FACILITATOR_URL=https://facilitator.bankofai.io
```

> 💡 **还没有 `.env` 文件？** 在项目目录执行 `cp .env.sample .env` 根据模板创建，或手动新建。

### 第三步：在 server.py 中使用官方 Facilitator

<Tabs>
<TabItem value="TRON" label="TRON">

```python
from fastapi import FastAPI
from bankofai.x402.server import X402Server
from bankofai.x402.fastapi import x402_protected
from bankofai.x402.facilitator import FacilitatorClient
from bankofai.x402.config import NetworkConfig
import os

app = FastAPI()

# 您的收款钱包地址
PAY_TO_ADDRESS = "在此填入您的TRON收款地址"

# 官方 Facilitator 服务地址（从环境变量读取）
# SDK 会自动从环境变量读取 FACILITATOR_API_KEY，无需显式传参
FACILITATOR_URL = os.getenv("FACILITATOR_URL", "https://facilitator.bankofai.io")

# 初始化 x402 服务器，连接官方 Facilitator
server = X402Server()
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    schemes=["exact_permit"],
    network=NetworkConfig.TRON_NILE,  # 测试网；上线改为 TRON_MAINNET
    pay_to=PAY_TO_ADDRESS,
)
async def protected_endpoint():
    return {"data": "这是需要付款才能获取的内容！"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

</TabItem>
<TabItem value="BSC" label="BSC">

```python
from fastapi import FastAPI
from bankofai.x402.server import X402Server
from bankofai.x402.fastapi import x402_protected
from bankofai.x402.facilitator import FacilitatorClient
from bankofai.x402.config import NetworkConfig
from bankofai.x402.mechanisms.evm.exact_permit import ExactPermitEvmServerMechanism
from bankofai.x402.mechanisms.evm.exact import ExactEvmServerMechanism
import os

app = FastAPI()

# 您的收款钱包地址
PAY_TO_ADDRESS = "在此填入您的BSC收款地址（0x开头）"

# 官方 Facilitator 服务地址（从环境变量读取）
# SDK 会自动从环境变量读取 FACILITATOR_API_KEY，无需显式传参
FACILITATOR_URL = os.getenv("FACILITATOR_URL", "https://facilitator.bankofai.io")

# 初始化 x402 服务器，注册 BSC 机制，连接官方 Facilitator
server = X402Server()
server.register(NetworkConfig.BSC_TESTNET, ExactPermitEvmServerMechanism())
server.register(NetworkConfig.BSC_TESTNET, ExactEvmServerMechanism())
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    network=NetworkConfig.BSC_TESTNET,  # 测试网；上线改为 BSC_MAINNET
    pay_to=PAY_TO_ADDRESS,
    schemes=["exact_permit"],
)
async def protected_endpoint():
    return {"data": "这是需要付款才能获取的内容！"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

</TabItem>
</Tabs>

> ✅ **完成！** 您的服务器现在已连接到官方 Facilitator，无需自行维护任何结算基础设施。

---

## 方案二：自托管 Facilitator

如果您希望完全掌控费用策略、能量管理，或有特定的隐私/合规要求，可以选择自己部署 Facilitator 服务。

> ⚠️ **自托管安全提示：**
> - 自托管 Facilitator 需要使用一个**专用钱包**的私钥来支付区块链手续费
> - **这个 Facilitator 钱包应与您的收款钱包分开**，请专门创建一个新钱包
> - Facilitator 钱包只需存入少量代币（用于手续费），不要存入大量资金
> - 私钥只存放在 `.env` 文件中，**绝对不要上传到 GitHub 或分享给任何人**

### 第一步：准备 Facilitator 专用钱包

为 Facilitator 创建一个独立的钱包（与您的收款钱包分开），并从水龙头获取手续费代币：

<Tabs>
<TabItem value="TRON" label="TRON">

1. 在 TronLink 中新建一个账户（点击头像 → "添加账户" → "创建"）
2. 前往 [Nile 测试网水龙头](https://nileex.io/join/getJoinPage) 为新账户领取测试 TRX（用于支付手续费）
3. 导出这个新账户的私钥：**设置 → 账户管理 → 导出私钥**

</TabItem>
<TabItem value="BSC" label="BSC">

1. 在 MetaMask 中新建一个账户（点击账户图标 → "添加账户" → "创建账户"）
2. 前往 [BSC 测试网水龙头](https://www.bnbchain.org/en/testnet-faucet) 为新账户领取测试 BNB（用于支付手续费）
3. 导出这个新账户的私钥：**账户详情 → 导出私钥**

</TabItem>
</Tabs>

### 第二步：克隆并配置 Facilitator

打开**新的终端窗口**，执行以下命令：

```bash
# 下载示例项目（包含 Facilitator 实现）
git clone https://github.com/BofAI/x402-demo.git
cd x402-demo

# 安装依赖
pip install -r requirements.txt

# 根据模板创建配置文件
cp .env.sample .env
```

用文本编辑器打开 `x402-demo` 目录下的 `.env` 文件，填入以下内容：

<Tabs>
<TabItem value="TRON" label="TRON">

```bash
# Facilitator 专用钱包的私钥（用于支付区块链手续费）
# 注意：这是第一步中创建的专用钱包，不是您的收款钱包
TRON_PRIVATE_KEY=在此填入Facilitator专用钱包的私钥

# TronGrid API Key（主网必填，测试网可暂时留空）
# 申请地址：https://www.trongrid.io/
TRON_GRID_API_KEY=
```

</TabItem>
<TabItem value="BSC" label="BSC">

```bash
# Facilitator 专用钱包的私钥（用于支付区块链手续费）
# 注意：这是第一步中创建的专用钱包，不是您的收款钱包
BSC_PRIVATE_KEY=在此填入Facilitator专用钱包的私钥
```

</TabItem>
</Tabs>

### 第三步：启动 Facilitator 服务

```bash
./start.sh facilitator
```

**成功启动后，您应该看到：**

```
Facilitator running on http://localhost:8001
Supported endpoints:
  GET  /supported
  POST /verify
  POST /settle
  POST /fee/quote
```

> ✅ **成功标志：** 终端显示 `Facilitator running on http://localhost:8001`，保持此终端窗口开启

### 第四步：在 server.py 中使用自托管 Facilitator

<Tabs>
<TabItem value="TRON" label="TRON">

```python
from fastapi import FastAPI
from bankofai.x402.server import X402Server
from bankofai.x402.fastapi import x402_protected
from bankofai.x402.facilitator import FacilitatorClient
from bankofai.x402.config import NetworkConfig

app = FastAPI()

# 您的收款钱包地址
PAY_TO_ADDRESS = "在此填入您的TRON收款地址"

# 自托管 Facilitator 地址（默认本地，可部署到服务器后改为对应地址）
FACILITATOR_URL = "http://localhost:8001"

# 初始化 x402 服务器，连接自托管 Facilitator
server = X402Server()
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    schemes=["exact_permit"],
    network=NetworkConfig.TRON_NILE,  # 测试网；上线改为 TRON_MAINNET
    pay_to=PAY_TO_ADDRESS,
)
async def protected_endpoint():
    return {"data": "这是需要付款才能获取的内容！"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

</TabItem>
<TabItem value="BSC" label="BSC">

```python
from fastapi import FastAPI
from bankofai.x402.server import X402Server
from bankofai.x402.fastapi import x402_protected
from bankofai.x402.facilitator import FacilitatorClient
from bankofai.x402.config import NetworkConfig
from bankofai.x402.mechanisms.evm.exact_permit import ExactPermitEvmServerMechanism
from bankofai.x402.mechanisms.evm.exact import ExactEvmServerMechanism

app = FastAPI()

# 您的收款钱包地址
PAY_TO_ADDRESS = "在此填入您的BSC收款地址（0x开头）"

# 自托管 Facilitator 地址（默认本地，可部署到服务器后改为对应地址）
FACILITATOR_URL = "http://localhost:8001"

# 初始化 x402 服务器，注册 BSC 机制，连接自托管 Facilitator
server = X402Server()
server.register(NetworkConfig.BSC_TESTNET, ExactPermitEvmServerMechanism())
server.register(NetworkConfig.BSC_TESTNET, ExactEvmServerMechanism())
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    network=NetworkConfig.BSC_TESTNET,  # 测试网；上线改为 BSC_MAINNET
    pay_to=PAY_TO_ADDRESS,
    schemes=["exact_permit"],
)
async def protected_endpoint():
    return {"data": "这是需要付款才能获取的内容！"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

</TabItem>
</Tabs>

> ✅ **完成！** 您的服务器现在通过本地 Facilitator（8001 端口）处理所有付款验证和结算。

### 将自托管 Facilitator 部署到服务器（可选）

如需在生产环境中运行自托管 Facilitator（而非仅本地测试），请将 `x402-demo` 部署到您的服务器，并将 `FACILITATOR_URL` 修改为您服务器的公网地址，例如：

```python
FACILITATOR_URL = "https://your-server.com"
```

详见 [x402-facilitator 仓库](https://github.com/BofAI/x402-facilitator) 中的部署文档。

---

## Facilitator API 端点

无论使用官方还是自托管，Facilitator 均提供以下标准 API 端点：

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/health` | 服务健康检查 |
| GET | `/supported` | 查询支持的支付能力和配置 |
| POST | `/fee/quote` | 获取支付要求的费用预估 |
| POST | `/verify` | 验证支付载荷有效性 |
| POST | `/settle` | 执行链上结算（官方 Facilitator 下**受限速保护**） |
| GET | `/payments/{payment_id}` | 按支付 ID 查询支付记录 |
| GET | `/payments/tx/{tx_hash}` | 按交易哈希查询支付记录 |

---

## 费用结构

Facilitator 支持灵活配置服务费用：

- **固定费用 (Base Fee)**：每笔交易收取固定的服务费（例如 `1 USDT`）。
- **按比例收费 (Percentage Fee)**：按交易金额的一定百分比收取费用。
- **免费模式 (No Fee)**：支持零费率运营模式。

具体的费用明细将通过 `/fee/quote` 端点返回，并包含在服务端下发给客户端的支付要求（Payment Requirements）中。

---

## 信任模型

x402 协议的设计核心在于**最小化信任假设**：

- **授权签名**：Facilitator 仅能划转客户端签名授权范围内的资金。
- **资金直达**：资金从客户端直接流向卖家（若有服务费，则部分流向 Facilitator），中间不经过资金池。
- **链上验证**：所有交易记录均在区块链上公开可查。

即使是**恶意的 Facilitator** 也无法执行以下操作：

- 划转超过客户端授权限额的资金。
- 将资金转移给非签名指定的接收方。
- 篡改任何已签名的支付条款。

---

## 总结

在 x402 协议体系中，**Facilitator** 充当了区块链链上的独立验证与结算层。它赋能服务端在无需部署完整区块链基础设施的情况下，安全地确认支付并完成链上结算。

---

## 下一步

- [官方 Facilitator](./OfficialFacilitator.md) — 如何申请和配置官方 Facilitator 的 API Key（详细图文步骤）
- [卖家快速入门](../getting-started/quickstart-for-sellers.md) — 完整的服务端接入流程
- [钱包](./wallet.md) — 了解如何管理用于支付的钱包
- [网络与代币支持](./network-and-token-support.md) — 了解支持的网络和代币
