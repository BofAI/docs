import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 用户快速入门

## 本指南面向谁？

本指南面向希望**通过代码调用 x402 保护的 API 并自动完成付款**的开发者。完成后，您将拥有一个可工作的 TypeScript 脚本：它能检测 402 响应、为访问付费、并获取受保护的内容——全程无需手动操作。

> **测试网优先：** 本指南默认使用测试网，您可以安全地完成每一步而不花费真实资金。

:::info SDK（仅 TypeScript）
x402 是**仅 TypeScript** 的 SDK，以颗粒化的 `@bankofai/x402-*` 包发布。本指南展示如何直接集成已发布的 npm 包。
:::

---

## 前置准备

### 首先：私钥安全

> 🔴 **私钥安全警告——开始前请阅读：**
>
> - 您的**私钥**是控制钱包的唯一凭据。任何拥有它的人都可以完全访问您的资金。
> - 本指南要求您配置私钥。请严格遵守以下规则：
>   1. **切勿**将私钥直接写在代码文件中
>   2. **切勿**将含私钥的文件提交到 Git 或推送到 GitHub
>   3. **切勿**通过消息应用、邮件或聊天发送私钥
>   4. 仅将其保存在本地 `.env` 文件或系统环境变量中
>   5. 测试时请创建一个**专用测试钱包**，仅持有少量测试代币——切勿使用持有真实资产的钱包

### 开始前清单

- [ ] 已安装 **Node.js 22+** 和 **pnpm 11.1+**
- [ ] 已创建专用**测试钱包**（见下文）
- [ ] 已领取测试代币（免费）
- [ ] 有一个目标 x402 保护的 API URL（例如按[卖家快速入门](./quickstart-for-sellers.md)启动的 `/credit` 接口）

### 创建测试钱包并领取测试代币

<Tabs>
<TabItem value="TRON" label="TRON">

**创建测试钱包：**

1. 安装 [TronLink 浏览器扩展](https://www.tronlink.org/) 或手机 App
2. 点击"创建钱包"，设置密码，并**将助记词抄写在纸上并妥善保管**
3. 创建后，复制您的钱包地址（以 `T` 开头）

**领取免费测试代币：**

1. 前往 [Nile 测试网水龙头](https://nileex.io/join/getJoinPage)
2. 粘贴您的 TRON 测试钱包地址，领取测试 TRX 和 USDT/USDD
3. 在 TronLink 切换到"Nile 测试网"并确认余额

**导出私钥：**

1. 在 TronLink 中，前往 设置 → 账户管理 → 导出私钥
2. 输入密码确认
3. 复制 64 位十六进制字符串——下一步将用到

> ✅ **成功检查：** 您拥有 TRON 测试钱包地址、其私钥，以及测试 TRX 和 USDT（或 USDD）余额

</TabItem>
<TabItem value="BSC" label="BSC">

**创建测试钱包：**

1. 安装 [MetaMask 浏览器扩展](https://metamask.io/)
2. 点击"创建新钱包"，设置密码，并**将助记词抄写在纸上并妥善保管**
3. 创建后，复制您的钱包地址（以 `0x` 开头）

**领取免费测试代币：**

1. 前往 [BSC 测试网水龙头](https://www.bnbchain.org/en/testnet-faucet)
2. 粘贴您的 BSC 测试钱包地址，领取测试 BNB 和 USDT
3. 在 MetaMask 切换到 BSC 测试网并确认余额

**导出私钥：**

1. 在 MetaMask 中，点击 账户详情 → 导出私钥
2. 输入 MetaMask 密码确认
3. 复制 64 位十六进制字符串——下一步将用到

> ✅ **成功检查：** 您拥有 BSC 测试钱包地址、其私钥，以及测试 BNB 和 USDT 余额

</TabItem>
</Tabs>

---

## 第一步：安装 SDK 包

在您的 TypeScript 应用中安装已发布的 npm 包：

```bash
pnpm add @bankofai/agent-wallet @bankofai/x402-fetch @bankofai/x402-tron
pnpm add -D tsx   # 运行下面的 TypeScript 入口文件
```

如果您的项目不使用 pnpm，也可以用 `npm install` 或 `yarn add` 安装同名包。

:::info 钱包管理
x402 使用 [Agent Wallet](../../Agent-Wallet/QuickStart.md) 解析和管理钱包凭据。Agent Wallet 会随上面的包一起安装。私钥解析优先级：
1. 加密钱包文件（通过 Agent Wallet CLI 导入）
2. 环境变量 `AGENT_WALLET_PRIVATE_KEY`

本指南使用环境变量方式。
:::

---

## 第二步：配置私钥

**切勿将私钥写在代码中。** 将其设为环境变量以使其远离源文件：

```bash
export AGENT_WALLET_PRIVATE_KEY=your_private_key_here
```

> 💡 **提示：** 本快速入门使用 `TRON_NILE`（`tron:0xcd8690dc`）付款。client 会从 server 返回的 `accepts` 中选择 `network === TRON_NILE` 的付款选项。

生产 TRON 负载建议使用 TronGrid API Key，以获得更可靠的 RPC。SDK 不会读取任何环境变量，因此必须显式传给 signer：

```bash
export TRON_GRID_API_KEY="your_trongrid_api_key_here"
```

```typescript
const signer = await createClientTronSigner(wallet, {
  network: TRON_NILE,
  apiKey: process.env.TRON_GRID_API_KEY,
});
```

不传 `apiKey` 时，signer 会继续使用无密钥的公共节点。

> ⚠️ **安全提醒：** 私钥仅保存在环境变量或安全的密钥管理系统中。**切勿将含私钥的文件提交到 Git 或分享给任何人。**

---

## 第三步：编写并运行客户端代码

客户端会包装 `fetch`，使 HTTP `402 Payment Required` 挑战自动支付。下面是一个最小 TRON client：

```typescript
import { resolveWallet, type Wallet, type Eip712Capable } from "@bankofai/agent-wallet";
import { x402Client, wrapFetchWithPayment } from "@bankofai/x402-fetch";
import { createClientTronSigner, TRON_NILE } from "@bankofai/x402-tron";
import { ExactTronScheme } from "@bankofai/x402-tron/exact/client";

// resolveWallet 的返回类型是基础的 Wallet，不声明 signTypedData；
// 但在 tron 上它返回的是 TronSigner，该类同时实现了 Wallet 与 Eip712Capable。
// 直接组合 SDK 自身导出的这两个类型，即可满足 createClientTronSigner 的入参要求。
type SignerWallet = Wallet & Eip712Capable;

const wallet = (await resolveWallet({
  network: TRON_NILE,
})) as SignerWallet;

const signer = await createClientTronSigner(wallet, {
  network: TRON_NILE,
});

const client = new x402Client((_version, accepts) =>
  accepts.find((a) => a.network === TRON_NILE)!
);

client.register(TRON_NILE, new ExactTronScheme(signer));

const fetchWithPay = wrapFetchWithPayment(fetch, client);

const res = await fetchWithPay("http://localhost:4021/credit");

console.log(await res.json());
```

### 运行 client

首先确保资源服务器 + facilitator 正在运行（参见[卖家快速入门](./quickstart-for-sellers.md)），然后用同一组环境变量运行您的客户端应用：

```bash
pnpm tsx src/index.ts   # 或您的应用 dev 脚本
```

**预期输出：**

```
{ "status": "success", "credit": 1000000 }
```

> ✅ **成功：** SDK 检测到 `402` 并签署了付款；随后由资源服务端交给 facilitator 在链上结算，并返回受保护的内容。

> 💡 要改为支付其他网络或代币，请调整 selector 中的 `accepts.find(...)` 条件，并注册对应网络的 scheme。

:::caution 默认消费管控把每笔支付限制在 $1
自 SDK 1.1.0 起，客户端会在你的 selector 运行之前就拒绝超过 `$1` 的支付、以及默认资产注册表之外的资产。本快速入门能跑通，是因为卖家指南把价格正好设为 `1 USDT`。金额更大时需要提高上限：

```typescript
client.setSpendControls({ maxAmountPerPayment: "$5" });
```

完整选项（含 `allowedAssets`）见 [SDK 功能矩阵](../sdk-features.md)。
:::

---

## 第四步：错误排查

| 问题 | 原因 | 解决方案 |
|---------|-------|----------|
| `WalletNotFoundError` / 解析不到钱包 | agent-wallet 里没有钱包，或当前 shell 未设置 `AGENT_WALLET_PRIVATE_KEY` | 执行 `agent-wallet start`，或确保在**运行脚本的同一终端窗口**中执行 `export` |
| `WalletNotFoundError: No active wallet set` | agent-wallet 未配置钱包 | 运行 `agent-wallet start` 并按提示导入私钥 |
| `Insufficient balance` / 余额错误 | 测试钱包 USDT/USDD 不足 | 返回前置准备，从水龙头领取测试代币 |
| `No network/scheme registered for x402 version: 2 …` | server 公布的网络里没有任何一个注册了 scheme——该错误在 selector 运行之前就会抛出 | 检查 server 的 `accepts` 是否包含 `network: TRON_NILE`，以及是否调用了 `client.register(TRON_NILE, …)` |
| `permit2_allowance_required` | Permit2 授权额度缺失或过低 | 在 TRON 上 SDK 会在首次付款时自动广播一次性 `approve`；若仍存在，检查钱包是否有足够 TRX 支付这笔授权 |
| `approval_reset_required`（TRON） | 该代币的 Permit2 授权额度非零但不足，默认的 `zero-first` 策略不会直接覆写 | 先把该代币的 Permit2 授权额度重置为 `0` 再重试——SDK 不会自动插入 `approve(0)` |
| `approval_asset_unsupported`（TRON） | 该代币不属于已知 Permit2 资产，也没有为它配置授权策略 | 用 `createTrc20ApprovalPolicy` 为其配置策略，或改用受支持的代币付款 |
| `Connection timeout` | 网络或请求超时 | 检查 API 服务、facilitator 和 TRON RPC 连接 |
| `ERR_PACKAGE_PATH_NOT_EXPORTED` | 项目未声明为 ESM | 在 `package.json` 中添加 `"type": "module"` |

如需更细粒度的错误处理：

```typescript
try {
  const res = await fetchWithPay("http://localhost:4021/credit");
  if (res.status === 200) {
    console.log("Success:", await res.json());
  } else {
    console.error(`Request failed: ${res.status}`);
    console.error(await res.text());
  }
} catch (error) {
  if (error instanceof Error && error.message.includes("no payment option")) {
    console.error("No matching payment option — check TRON_NILE vs the server's accepts");
  } else if (error instanceof Error && error.message.includes("allowance")) {
    console.error("Insufficient token allowance — check wallet balance");
  } else {
    console.error("Payment error:", error);
  }
}
```

---

## 完成总结

通过本指南，您：

- **创建了测试钱包**并领取了测试代币，理解了私钥安全的重要性
- **安装了 SDK** 并将私钥配置为环境变量（而非写在代码中）
- **编写并运行了**自动付款客户端代码
- **理解了完整流程**：SDK 检测 402 → 签署授权 → 付款 → 获取内容

---

## 下一步

- 阅读[核心概念](../core-concepts/http-402.md)深入了解 x402 协议
- 查看[网络与代币支持](../core-concepts/network-and-token-support.md)了解支持的代币与网络
- 想构建自己的付费 API？参见[卖家快速入门](./quickstart-for-sellers.md)

---

## 参考资料

- [x402 npm 包](https://www.npmjs.com/package/@bankofai/x402-tron) —— 应用开发应优先安装的发布包
- [fetch client example](https://github.com/BofAI/x402/tree/main/examples/typescript/clients/fetch) —— 如果开发者想要一个更完整的 client 例子，可以参考 examples
- [Agent Wallet](https://github.com/BofAI/agent-wallet) —— SDK 使用的密钥托管
