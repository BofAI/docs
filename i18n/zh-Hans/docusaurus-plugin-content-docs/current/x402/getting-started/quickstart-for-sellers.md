import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 卖家快速入门

> **测试网优先：** 本指南默认使用测试网，所有操作均使用免费测试代币，**不会涉及任何真实资金**。待测试通过后，再参考文末的[切换到主网](#在主网运行)章节进行上线。

## 您将实现什么

完成本指南后，您将拥有一个**可对 API 调用收费的服务**：

- 当用户或 AI 代理调用您的 API 时，系统自动要求对方支付指定代币 
- 支持按请求收费、计量使用、动态定价等多种收费模式
- 付款验证和区块链结算全程自动完成，收款直接到您的钱包

整个流程分为 **4 步**，预计耗时 **15–20 分钟**。

---

## 前置准备

### 确认运行环境

请在终端（macOS/Linux 的 Terminal，或 Windows 的 PowerShell/命令提示符）中依次运行以下命令，确认相关工具已安装：

```bash
python --version   # 需要 3.10 或以上版本
pip --version      # 随 Python 一起安装
git --version      # 版本控制工具
```

如果任何一个命令提示"找不到命令"，请先安装：
- Python：前往 [python.org](https://www.python.org/downloads/) 下载安装包
- Git：前往 [git-scm.com](https://git-scm.com/) 下载

---

### 创建收款钱包

您需要一个区块链钱包地址，用于接收用户支付的代币。请根据您选择的网络按照以下步骤操作：


<Tabs>
<TabItem value="TRON" label="TRON（推荐）">

**创建 TronLink 钱包（约 3 分钟）：**

1. 在浏览器中安装 [TronLink 插件](https://www.tronlink.org/)（支持 Chrome/Firefox），或在手机上下载 TronLink App
2. 打开插件，点击"创建钱包"
3. 设置登录密码（用于解锁钱包，只存在本地）
4. **重要：** 系统会显示一串助记词（12个英文单词）——将它们**抄写在纸上**并妥善保管，这是找回钱包的唯一方式
5. 按提示验证助记词后，钱包创建完成
6. 在首页复制您的钱包地址（以字母 **`T`** 开头，如 `TXyz1234...`）

**领取免费测试代币（约 2 分钟）：**

1. 前往 [Nile 测试网水龙头](https://nileex.io/join/getJoinPage)
2. 将您的 TRON 钱包地址粘贴到输入框
3. 点击领取，等待约 1–2 分钟
4. 在 TronLink 中切换到"Nile 测试网"，刷新后确认 TRX 和 USDT/USDD 余额已到账

> ✅ **成功标志：** 钱包显示测试 TRX 和测试 USDT（或 USDD）余额大于 0

</TabItem>
<TabItem value="BSC" label="BSC">

**创建 MetaMask 钱包（约 3 分钟）：**

1. 在浏览器中安装 [MetaMask 插件](https://metamask.io/)（支持 Chrome/Firefox/Edge）
2. 打开插件，点击"创建新钱包"
3. 设置密码，然后**将助记词（12个英文单词）抄写到纸上保管好**
4. 按提示验证助记词，完成创建
5. 在首页复制您的钱包地址（以 **`0x`** 开头，如 `0xAbc123...`）

**领取免费测试代币（约 2 分钟）：**

1. 前往 [BSC 测试网水龙头](https://www.bnbchain.org/en/testnet-faucet)
2. 粘贴您的钱包地址，领取测试 BNB 和测试 USDT
3. 在 MetaMask 中切换到 BSC 测试网，确认余额到账

> ✅ **成功标志：** 钱包显示测试 BNB 和测试 USDT 余额大于 0

</TabItem>
</Tabs>

> ⚠️ **钱包安全提示：**
> - 助记词和私钥是您钱包的"万能钥匙"，**任何人（包括平台客服）都不应该要求您提供**
> - 请将助记词抄在纸上，存放在安全的物理位置，不要存在手机相册或云盘
> - 本教程使用测试钱包，建议专门创建一个新钱包用于测试，不要使用存有真实资产的钱包

---

### 配置参数速查

| 配置项 | 说明 | 获取方式 |
|--------|------|----------|
| **TRON 收款地址** | 以 `T` 开头的钱包地址 | 从 TronLink 复制 |
| **BSC 收款地址** | 以 `0x` 开头的钱包地址 | 从 MetaMask 复制 |
| **测试 TRX** | TRON 测试网手续费代币 | [Nile 水龙头](https://nileex.io/join/getJoinPage) |
| **测试 USDT/USDD（TRON）** | TRON 测试付款代币（USDT 和 USDD 均支持） | [Nile 水龙头](https://nileex.io/join/getJoinPage) |
| **测试 BNB** | BSC 测试网手续费代币 | [BSC Testnet 水龙头](https://www.bnbchain.org/en/testnet-faucet) |
| **测试 USDT（BSC）** | BSC 测试付款代币 | [BSC Testnet 水龙头](https://www.bnbchain.org/en/testnet-faucet) |

**测试网 vs. 主网的区别：**

- **测试网**：使用免费的测试代币，不涉及真实资金，适合开发和调试。网络标识符：`tron:nile` / `eip155:97`
- **主网**：涉及真实支付，正式上线时使用。网络标识符：`tron:mainnet` / `eip155:56`

---

## 第一步：安装 x402 SDK

打开终端，执行以下安装命令：

**推荐方式（直接从 GitHub 安装，适合快速上手）：**

```bash
pip install "bankofai-x402[tron,fastapi] @ git+https://github.com/BofAI/x402.git#subdirectory=python/x402"
```

安装完成后，运行以下命令验证是否成功：

```bash
python -c "import bankofai.x402; print('SDK 安装成功！')"
```

> ✅ **成功标志：** 终端输出 `SDK 安装成功！`

**另一种方式（从源码安装，适合需要修改源码的开发者）：**

```bash
# 克隆代码仓库
git clone https://github.com/BofAI/x402.git
cd x402/python/x402

# 安装（含 FastAPI 支持）
pip install -e ".[fastapi]"
```

> 💡 **遇到权限错误？** 在命令前加 `sudo`（macOS/Linux），或以管理员身份运行 PowerShell（Windows）。

---

## 第二步：创建付费 API 服务器

现在，我们来创建一个带有付款保护的 API 服务器。x402 SDK 提供了 `@x402_protected` 装饰器，只需加在您想要收费的接口上，SDK 就会自动处理所有付款验证逻辑。

在您的项目目录下，新建一个名为 `server.py` 的文件，将以下代码复制进去：

<Tabs>
<TabItem value="TRON" label="TRON">

```python
from fastapi import FastAPI, Request
from bankofai.x402.server import X402Server
from bankofai.x402.fastapi import x402_protected
from bankofai.x402.facilitator import FacilitatorClient
from bankofai.x402.config import NetworkConfig

app = FastAPI()

# ========== 请修改以下两项配置 ==========
# 将下方地址替换为您在"前置准备"中创建的 TRON 钱包地址（用于接收付款）
PAY_TO_ADDRESS = "在此填入您的TRON钱包地址"

# 结算服务地址（第三步中会启动，地址默认不用改）
FACILITATOR_URL = "http://localhost:8001"
# ========================================

# 初始化 x402 服务器
server = X402Server()
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

# 为这个 API 接口添加付款保护
@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],          # 每次请求收费金额（可根据需要调整）
    schemes=["exact_permit"],         # 付款方式
    network=NetworkConfig.TRON_NILE, # 当前使用测试网（上线时改为 TRON_MAINNET）
    pay_to=PAY_TO_ADDRESS,           # 您的收款钱包地址
)
async def protected_endpoint(request: Request):
    return {"data": "这是需要付款才能获取的内容！"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

</TabItem>
<TabItem value="BSC" label="BSC">

```python
from fastapi import FastAPI, Request
from bankofai.x402.server import X402Server
from bankofai.x402.fastapi import x402_protected
from bankofai.x402.facilitator import FacilitatorClient
from bankofai.x402.config import NetworkConfig
from bankofai.x402.mechanisms.evm.exact_permit import ExactPermitEvmServerMechanism
from bankofai.x402.mechanisms.evm.exact import ExactEvmServerMechanism

app = FastAPI()

# ========== 请修改以下两项配置 ==========
# 将下方地址替换为您在"前置准备"中创建的 BSC 钱包地址（用于接收付款）
PAY_TO_ADDRESS = "在此填入您的BSC钱包地址（0x开头）"

# 结算服务地址（第三步中会启动，地址默认不用改）
FACILITATOR_URL = "http://localhost:8001"
# ========================================

# 初始化 x402 服务器，并注册 BSC 付款机制
server = X402Server()
server.register(NetworkConfig.BSC_TESTNET, ExactPermitEvmServerMechanism())
server.register(NetworkConfig.BSC_TESTNET, ExactEvmServerMechanism())
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))

# 为这个 API 接口添加付款保护
@app.get("/protected")
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],            # 每次请求收费金额
    network=NetworkConfig.BSC_TESTNET, # 当前使用测试网（上线时改为 BSC_MAINNET）
    pay_to=PAY_TO_ADDRESS,             # 您的收款钱包地址
    schemes=["exact_permit"],
)
async def protected_endpoint(request: Request):
    return {"data": "这是需要付款才能获取的内容！"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

</TabItem>
</Tabs>

**主要配置说明：**

| 参数 | 说明 | 示例值 |
|------|------|--------|
| `PAY_TO_ADDRESS` | 您的收款钱包地址 | `TXyz...`（TRON）或 `0xAbc...`（BSC） |
| `prices` | 每次请求的价格 | `["0.0001 USDT"]` |
| `network` | 使用的网络 | 测试：`TRON_NILE` / `BSC_TESTNET` |
| `schemes` | 付款方式 | `["exact_permit"]` |

**工作原理：** 当未付款的请求到达您的 API 时，服务器自动返回 HTTP 402（需要付款）响应，并在响应头中附上付款指引。客户端 SDK 会自动完成付款并重新发起请求，整个过程用户几乎无感知。

---

## 第三步：接入结算服务（Facilitator）

### 什么是 Facilitator？

简单来说，Facilitator 是一个**自动公证服务**：当有人向您的 API 付款时，Facilitator 负责核实这笔付款是否真实，并在区块链上完成结算，确保资金记录到链上。

**您需要先完成 Facilitator 配置，再启动您的 API 服务器。**

### 两种接入方式，如何选择？

| | 官方 Facilitator（推荐）| 自托管 Facilitator |
|---|---|---|
| **是否需要维护服务** | 不需要，官方托管 | 需要自行运行 |
| **是否需要钱包私钥** | 不需要 | 需要（用于支付手续费）|
| **上手难度** | 低（申请 API Key 即可）| 中（需部署配置）|
| **适合场景** | 快速上线、大多数用户 | 需要完全自定义费率策略 |

<Tabs>
<TabItem value="official" label="✅ 官方 Facilitator（推荐）">

官方托管的 Facilitator 服务，**无需维护任何基础设施**。 详细信息也可参考 [官方 Facilitator](../core-concepts/OfficialFacilitator.md)

#### 3.1 配置服务端点

将您的 `FACILITATOR_URL` 设置为官方 Facilitator 服务地址：

```
https://facilitator.bankofai.io
```

这是您的 x402 服务端用来验证和结算支付的地址，**仅供 API 调用**，无需用浏览器访问。

> ⚠️ **未配置 API Key 时，此端点按 IP 地址限速为每分钟 1 次请求。** 测试够用，但生产环境中会直接卡住您的 API。请继续第 3.2 步申请 API Key。

#### 3.2 申请 API Key

在管理后台免费申请 API Key：

[https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io)

1. 在浏览器中打开上方链接
2. 点击 **TronLink**，使用钱包登录（仅用于身份验证，**不会扣款**）
3. 登录后进入 Dashboard，点击**"创建 API Key"**
4. 点击确认，然后在 Dashboard 中点击 **View** 查看并复制您的 API Key

配置 API Key 后，限速提升至 **1000 次/分钟**，足以支撑生产环境。

> 📖 **详细图文步骤**请参见：[官方 Facilitator](../core-concepts/OfficialFacilitator.md)

> ⚠️ **安全提示：** API Key 是您的服务凭证，**请像对待密码一样保护它，绝不提交到 Git**

#### 3.3 配置 `.env` 文件

在您的项目目录（存放 `server.py` 的目录）中，创建或编辑 `.env` 文件，添加以下内容：

```bash
# 官方 Facilitator 服务地址
FACILITATOR_URL=https://facilitator.bankofai.io

# API Key（在 admin-facilitator.bankofai.io 申请）— SDK 自动通过 X-API-KEY 请求头传递
FACILITATOR_API_KEY=在此填入您的API Key
```

#### 3.4 更新 server.py 连接官方 Facilitator

将 `server.py` 中的 Facilitator 初始化部分修改为从环境变量读取配置（在文件顶部添加 `import os`）：

<Tabs>
<TabItem value="TRON" label="TRON">

```python
import os
# ... 其他 import 保持不变 ...

# 官方 Facilitator 服务地址（从环境变量读取）
# SDK 会自动从环境变量读取 FACILITATOR_API_KEY，无需显式传参
FACILITATOR_URL = os.getenv("FACILITATOR_URL", "https://facilitator.bankofai.io")

# 初始化 x402 服务器，连接官方 Facilitator
server = X402Server()
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))
```

</TabItem>
<TabItem value="BSC" label="BSC">

```python
import os
# ... 其他 import 保持不变 ...

# 官方 Facilitator 服务地址（从环境变量读取）
# SDK 会自动从环境变量读取 FACILITATOR_API_KEY，无需显式传参
FACILITATOR_URL = os.getenv("FACILITATOR_URL", "https://facilitator.bankofai.io")

# 初始化 x402 服务器，注册 BSC 机制，连接官方 Facilitator
server = X402Server()
server.register(NetworkConfig.BSC_TESTNET, ExactPermitEvmServerMechanism())
server.register(NetworkConfig.BSC_TESTNET, ExactEvmServerMechanism())
server.set_facilitator(FacilitatorClient(FACILITATOR_URL))
```

</TabItem>
</Tabs>

> ✅ **完成！** 官方 Facilitator 已配置好，**不需要启动任何本地服务**，直接进入第四步测试即可。

</TabItem>
<TabItem value="selfhost" label="自托管 Facilitator">

自托管方式让您完全掌控费用策略和网络配置，适合有特定定制需求的高级用户。

> ⚠️ **安全提示——请先阅读：**
> - 需要一个**专用钱包**的私钥用于支付区块链手续费，**该钱包应与收款钱包分开**
> - Facilitator 钱包只需少量代币（用于手续费），不要存入大量资金
> - 私钥通过环境变量设置，**绝不要提交到 Git 或分享给他人**

#### 3.1 准备前置依赖

启动前，请确认以下条件已就绪：

- **Python 3.10+** 和 **Git**（前置准备中已确认）
- **PostgreSQL** — Facilitator 使用数据库持久化支付记录。根据您的环境选择最方便的方式：

  **方式 A — 直接安装（无需额外工具）：**

  <Tabs>
  <TabItem value="mac" label="macOS">

  ```bash
  brew install postgresql@16
  brew services start postgresql@16
  createdb x402
  ```

  </TabItem>
  <TabItem value="linux" label="Linux">

  **Ubuntu / Debian：**
  ```bash
  sudo apt install -y postgresql
  sudo systemctl start postgresql
  sudo -u postgres createdb x402
  ```

  **Amazon Linux / CentOS / RHEL / Fedora：**
  ```bash
  sudo dnf install -y postgresql15 postgresql15-server   # Amazon Linux 2023；其他发行版使用 postgresql-server
  sudo postgresql-setup --initdb
  sudo systemctl start postgresql
  sudo systemctl enable postgresql
  sudo -u postgres createdb x402
  ```

  **Arch Linux：**
  ```bash
  sudo pacman -S postgresql
  sudo -u postgres initdb -D /var/lib/postgres/data
  sudo systemctl start postgresql
  sudo -u postgres createdb x402
  ```

  </TabItem>
  <TabItem value="windows" label="Windows">

  从 [postgresql.org/download/windows](https://www.postgresql.org/download/windows/) 下载并运行安装程序，然后通过 pgAdmin 或 psql 创建名为 `x402` 的数据库。

  </TabItem>
  </Tabs>

  **为 `postgres` 用户设置密码**（连接字符串中需要用到）：

  ```bash
  sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'yourpassword';"
  ```

  > 将 `yourpassword` 替换为您自定义的密码，后续配置文件中会用到。

  **开启密码认证**（仅 Linux — 大多数发行版需要此步骤）：

  Linux 上 PostgreSQL 默认使用 `ident` 认证，要求操作系统用户名与数据库用户名一致，否则连接会被拒绝。需要将认证方式改为 `md5`（密码认证），Facilitator 才能正常连接：

  ```bash
  # 查找 pg_hba.conf 文件位置
  sudo find / -name pg_hba.conf 2>/dev/null
  # 常见路径：/var/lib/pgsql/data/pg_hba.conf（Amazon Linux / CentOS）
  #           /etc/postgresql/*/main/pg_hba.conf（Ubuntu / Debian）
  ```

  打开文件，将 IPv4 和 IPv6 本地连接的 `ident` 改为 `md5`：

  ```
  # IPv4 local connections:
  host    all             all             127.0.0.1/32            md5
  # IPv6 local connections:
  host    all             all             ::1/128                 md5
  ```

  修改后重启 PostgreSQL 使配置生效：

  ```bash
  sudo systemctl restart postgresql
  ```

  连接字符串：`postgresql+asyncpg://postgres:yourpassword@localhost:5432/x402`

  **方式 B — 使用免费云数据库（本地零安装）：**

  在 [Railway](https://railway.app/) 注册并创建一个 PostgreSQL 实例，复制它提供的连接字符串，将前缀 `postgresql://` 替换为 `postgresql+asyncpg://` 即可直接使用。

  记录好连接字符串，后面配置会用到。

- **Facilitator 专用钱包** — 单独创建一个新钱包（与收款钱包隔离，步骤与前置准备相同），并从水龙头领取测试代币用于支付手续费。

#### 3.2 克隆并安装

打开一个**新的终端窗口**，执行：

```bash
# 克隆 Facilitator 服务仓库
git clone https://github.com/BofAI/x402-facilitator.git
cd x402-facilitator

# 安装依赖
pip install -r requirements.txt
```

#### 3.3 配置服务

复制示例配置文件并用文本编辑器打开：

```bash
cp config/facilitator.config.example.yaml config/facilitator.config.yaml
```

填写必填字段：

<Tabs>
<TabItem value="TRON" label="TRON">

```yaml
database:
  url: "postgresql+asyncpg://postgres:yourpassword@localhost:5432/x402"

facilitator:
  networks:
    tron:nile:                   # 上线时改为 tron:mainnet
      base_fee:
        USDT: 100                # 每笔结算收 0.0001 USDT（可按需调整）
        USDD: 100000000000000
```

</TabItem>
<TabItem value="BSC" label="BSC">

```yaml
database:
  url: "postgresql+asyncpg://postgres:yourpassword@localhost:5432/x402"

facilitator:
  networks:
    bsc:testnet:                 # 上线时改为 bsc:mainnet
      base_fee:
        USDT: 100                # 每笔结算收 0.0001 USDT（可按需调整）
```

</TabItem>
</Tabs>

然后通过环境变量设置 Facilitator 专用钱包的私钥：

<Tabs>
<TabItem value="TRON" label="TRON">

```bash
# 获取方式：TronLink → 设置 → 账户管理 → 导出私钥
export AGENT_WALLET_PRIVATE_KEY=在此填入Facilitator专用钱包的私钥

# TronGrid API Key（推荐配置，确保 RPC 稳定访问）
# 申请地址：https://www.trongrid.io/
export TRON_GRID_API_KEY=在此填入TronGrid API Key
```

</TabItem>
<TabItem value="BSC" label="BSC">

```bash
# 获取方式：MetaMask → 账户详情 → 导出私钥
export AGENT_WALLET_PRIVATE_KEY=在此填入Facilitator专用钱包的私钥
```

</TabItem>
</Tabs>

#### 3.4 启动 Facilitator 服务

```bash
python src/main.py
```

**成功启动后，您应该看到类似以下输出：**

```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
```

> ✅ **成功标志：** Uvicorn 已在 8001 端口运行，**保持此终端窗口开启，不要关闭**

#### 3.5 注册 API Key（可选）

如需按卖家维度追踪支付记录，可用内置脚本生成 API Key：

```bash
python scripts/register_seller.py
# 会自动生成并打印一个随机 API Key，请妥善保存
```

将此 Key 配置到您的服务端：
```bash
export FACILITATOR_API_KEY=生成的API Key
```

`server.py` 中的 `FACILITATOR_URL = "http://localhost:8001"` 已是自托管配置，**无需修改**，直接进入第四步。

</TabItem>
</Tabs>

---

## 第四步：启动并测试您的 API

### 4.1 启动 API 服务器

打开**第三个终端窗口**（前两个不要关），进入存放 `server.py` 的目录，执行：

```bash
python server.py
```

**成功启动后，您应该看到：**

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

> ✅ **成功标志：** 终端显示 `Uvicorn running on http://0.0.0.0:8000`

### 4.2 测试未付款访问（应被拒绝）

打开任意终端，执行：

```bash
curl http://localhost:8000/protected
```

**预期结果：** 服务器返回 HTTP 402 响应，内容类似：

```json
{"error": "Payment required", "x402Version": 1}
```

> ✅ **这正是我们想要的！** 说明付款保护正常工作——未付款的请求被成功拦截了。

### 4.3 测试完整付款流程

要测试完整的付款→获取内容流程，您需要一个能够签名付款的客户端：

- [人类用户快速入门](./quickstart-for-human.md) — 使用代码方式调用您的付费 API
- [AI 代理快速入门](./quickstart-for-agent.md) — 配置 AI 代理自动付款调用

---

## 故障排查

| 问题 | 解决方案 |
|------|----------|
| `Connection refused` 连接 Facilitator 失败 | 使用**自托管**方式时，确认第三步的 Facilitator 终端仍在运行（`python src/main.py`），监听 8001 端口；使用**官方**方式时，检查 `FACILITATOR_URL` 是否正确配置为 `https://facilitator.bankofai.io` |
| `ModuleNotFoundError: bankofai` | 重新执行第一步的安装命令 |
| 钱包地址格式错误 | TRON 地址以 `T` 开头；BSC 地址以 `0x` 开头，检查是否完整复制 |
| Facilitator 启动失败——数据库报错（自托管）| 确认 `config/facilitator.config.yaml` 中 `database.url` 填写正确，且 PostgreSQL 实例正在运行 |
| Facilitator 启动失败——钱包报错（自托管）| 确认 `AGENT_WALLET_PRIVATE_KEY` 已在当前终端 `export`，且无多余空格或换行 |
| API Key 无效或频率受限（官方）| 确认 `FACILITATOR_API_KEY` 已正确设置，前往 [admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io) 检查 Key 状态 |
| `server.py` 启动报错 | 确认 `PAY_TO_ADDRESS` 已替换为真实钱包地址（不要保留占位文字） |

**需要更多示例和参考？**

- [完整服务器示例代码](https://github.com/BofAI/x402-demo/tree/main/server)
- [Facilitator 示例代码](https://github.com/BofAI/x402-demo/tree/main/facilitator)
- [Facilitator 详细说明](../core-concepts/facilitator.md) — 两种方式的完整安装步骤对比
- [官方 Facilitator](../core-concepts/OfficialFacilitator.md) — 官方服务 API Key 图文教程

---

## 在主网运行

在测试网完整验证后，只需以下几步即可上线接收真实付款：

### 1. 更新服务器配置

修改 `server.py` 中 `@x402_protected` 装饰器的 `network` 参数：

<Tabs>
<TabItem value="TRON" label="TRON">

```python
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    schemes=["exact_permit"],
    network=NetworkConfig.TRON_MAINNET,  # 从 TRON_NILE 改为 TRON_MAINNET
    pay_to=PAY_TO_ADDRESS,
)
```

</TabItem>
<TabItem value="BSC" label="BSC">

```python
@x402_protected(
    server=server,
    prices=["0.0001 USDT"],
    schemes=["exact_permit"],
    network=NetworkConfig.BSC_MAINNET,  # 从 BSC_TESTNET 改为 BSC_MAINNET
    pay_to=PAY_TO_ADDRESS,
)
```

</TabItem>
</Tabs>

### 2. 更新 Facilitator 配置

<Tabs>
<TabItem value="TRON" label="TRON">

1. **申请 TronGrid API Key**：前往 [TronGrid](https://www.trongrid.io/) 注册并创建 API Key，然后通过环境变量设置：

   ```bash
   export TRON_GRID_API_KEY=your_trongrid_api_key
   ```

   :::note 备用 RPC 端点
   未配置 `TRON_GRID_API_KEY` 时，主网 RPC 调用会自动通过 BANK OF AI 运营的公共端点
   （`https://api.trongrid.io` 经由 BANK OF AI 代理）路由。该端点无保证的 SLA，
   在高负载下可能会被限速。生产环境请配置您自己的 `TRON_GRID_API_KEY`，
   以确保可靠性并独立于 BANK OF AI 基础设施。
   :::

2. **替换私钥**：将环境变量更新为主网 Facilitator 钱包的私钥：

   ```bash
   export AGENT_WALLET_PRIVATE_KEY=your_mainnet_facilitator_private_key
   ```

3. **充值手续费**：向 Facilitator 主网钱包转入足够的真实 TRX（用于支付 Energy 和 Bandwidth 费用）。

4. **更新网络配置**：打开 `config/facilitator.config.yaml`，将网络键从 `tron:nile` 改为 `tron:mainnet`：

   ```yaml
   facilitator:
     networks:
       tron:mainnet:              # 从 tron:nile 改为 tron:mainnet
         base_fee:
           USDT: 100
           USDD: 100000000000000
   ```

5. **重启服务**：`python src/main.py`

</TabItem>
<TabItem value="BSC" label="BSC">

1. **充值手续费**：向 Facilitator 主网钱包转入足够的真实 BNB（用于支付 Gas 费用）。

2. **替换私钥**：将环境变量更新为主网 Facilitator 钱包的私钥：

   ```bash
   export AGENT_WALLET_PRIVATE_KEY=your_mainnet_facilitator_private_key
   ```

3. **更新网络配置**：打开 `config/facilitator.config.yaml`，将网络键从 `bsc:testnet` 改为 `bsc:mainnet`：

   ```yaml
   facilitator:
     networks:
       bsc:mainnet:               # 从 bsc:testnet 改为 bsc:mainnet
         base_fee:
           USDT: 100
   ```

4. **重启服务**：`python src/main.py`

</TabItem>
</Tabs>

### 3. 确认您的收款钱包地址

确保 `PAY_TO_ADDRESS` 填写的是您控制的**真实主网钱包地址**，并确认您持有该钱包的助记词或私钥备份。

### 4. 上线前进行小额真实测试

> ⚠️ **主网上线警告——涉及真实资金，请严格执行以下步骤：**
>
> 1. 确保已在测试网完整验证所有功能（付款、收款、错误处理）
> 2. 主网上线后，**先发起一笔最小金额（如 0.0001 USDT）的真实测试**
> 3. 在区块链浏览器（[TronScan](https://tronscan.org) 或 [BscScan](https://bscscan.com)）上确认交易成功
> 4. 打开您的收款钱包，确认资金已到账
> 5. 确认无误后，再正式对外开放 API

---

## 下一步

- 查看[演示示例](https://github.com/BofAI/x402-demo/tree/main/server)了解更多复杂的付款流程
- 深入阅读[核心概念](../core-concepts/http-402.md)，理解 x402 协议的工作原理
- 想深入了解 Facilitator 两种接入方式的详细配置？参见 [Facilitator 说明文档](../core-concepts/facilitator.md)
- 以[用户视角](./quickstart-for-human.md)体验调用付费 API，或配置 [AI 代理](./quickstart-for-agent.md)自动调用您的服务

---

## 完成总结

恭喜 🎉！您已完成卖家快速入门。以下是您完成的所有步骤：

| 步骤 | 完成内容 |
|------|----------|
| **前置准备** | 创建收款钱包，获取测试代币，熟悉配置参数 |
| **第一步** | 安装 x402 SDK |
| **第二步** | 创建带付款保护的 API 服务器 |
| **第三步** | 配置并启动 Facilitator 结算服务 |
| **第四步** | 验证付款保护和完整付款流程 |

您的 API 现在已经可以通过 x402 协议接收区块链支付了！
