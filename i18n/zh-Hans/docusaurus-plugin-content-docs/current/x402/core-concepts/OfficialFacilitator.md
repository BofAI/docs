
# 官方 Facilitator

## 什么是官方 Facilitator？

官方 **Facilitator** 是由 **BANK OF AI** 提供的托管结算服务，用于处理 **x402 支付流程中的验证与链上结算**。  
在传统架构中，如果开发者希望支持链上支付，通常需要自己完成以下工作：

- 部署或维护区块链节点
- 实现支付验证逻辑
- 构建链上结算流程
- 管理 Energy / Gas 费用
- 处理交易状态与失败重试

这些工作不仅复杂，而且会显著增加系统运维成本。

**官方 Facilitator 的核心作用，就是将这些复杂的链上处理流程统一托管。**  
开发者只需要调用 Facilitator API，即可完成支付验证和结算，无需直接操作区块链基础设施。

### 使用官方 Facilitator 的主要优点

**1️⃣ 无需部署区块链基础设施**

开发者不需要运行节点、同步链数据或维护区块链服务。所有链上交互都由官方 Facilitator 完成，大幅降低开发和运维复杂度。

**2️⃣ 官方承担链上 Energy 成本**

所有通过官方 Facilitator 完成的链上结算，其 **Energy 费用由官方承担**。  
这意味着开发者在接入 x402 支付时，不需要为链上资源消耗单独准备能量或手续费账户。

**3️⃣ 极简接入架构**

开发者只需要在服务端配置 Facilitator 地址，即可接入支付结算流程。  
无需编写复杂的链上交互代码，大幅减少开发时间。

**4️⃣ 官方维护与持续升级**

Facilitator 由官方持续维护和升级，包括：

- 网络升级适配
- 安全策略更新
- 交易处理优化

开发者无需担心底层区块链变化带来的系统维护问题。

**5️⃣ 稳定可靠的支付处理能力**

官方 Facilitator 能够稳定处理生产环境中的支付请求，避免开发者自行实现时可能出现的安全或性能问题。

> 简单来说：**Facilitator 就像一个“链上支付结算网关”**，开发者只需要调用 API，就可以完成完整的链上支付流程。


---

## 如何调用官方 Facilitator？

要调用官方 Facilitator，只需要在服务端配置官方提供的 **Facilitator 服务地址** https://facilitator.bankofai.io。 

> ⚠️ **注意**：该地址是用于 API 调用的服务端点，并不是用于浏览器访问的网页。在浏览器直接打开不会显示任何内容。

官方 Facilitator 支持 **两种调用模式**。

| 模式 |限速 |说明 |
|-----|-----|-----|
| **匿名调用（Anonymous Mode）** | 1 次 / 分钟 | 不需要 API Key，适用于本地开发和功能测试 |
| **API Key 调用（API Key Mode）** | 1000 次 / 分钟 | 需要 API Key，适用于生产环境和高频支付请求 |

两种模式的调用方式完全相同，但在 **身份识别与接口限速策略** 上有所不同。 




---

### 匿名调用模式（Anonymous Mode）

如果请求中 **没有携带 API Key**，Facilitator 会将该请求视为 **匿名请求**。

在匿名模式下：

- `/settle` 接口会启用 **严格限速**
- **每分钟最多 1 次调用**

该模式主要用于：

- 本地开发
- SDK 调试
- 功能验证
- 低频测试

匿名调用示例：

```bash
curl -X POST https://facilitator.bankofai.io/settle \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

虽然匿名模式可以正常调用所有核心接口，但由于 `/settle` 的调用频率非常低，因此 **不适合生产环境使用**。

如果你的应用需要处理真实用户支付或较高频率的请求，建议使用 **API Key 调用模式**。

---

### API Key 调用模式（API Key Mode）

在 API Key 模式下，请求需要在 HTTP Header 中携带 `X-API-KEY`：

```http
X-API-KEY: your_api_key_here
```

调用示例：

```bash
curl -X POST https://facilitator.bankofai.io/settle \
  -H "X-API-KEY: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

当 Facilitator 识别到 API Key 后：

- `/settle` 接口的调用限速将提升至 **1000 次 / 分钟**

这意味着你的服务可以支持 **生产级别的支付吞吐量**。

因此，在真实业务环境中 **强烈建议申请并配置 API Key**。

---

## 申请 API Key

要解锁生产级别的吞吐量，请在管理后台免费申请 API Key：[https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io)


这是一个可以用浏览器访问的管理面板，你在这里完成账号注册（通过 TronLink 钱包）、创建 API Key 并进行管理。管理后台与支付处理无关，只用于 API Key 的管理。

---

:::warning
## 安全注意事项

- **API Key 泄露等同于身份泄露**：任何持有你的 API Key 的人都可以以你的名义消耗你的限速配额，请像保护密码一样保护它。
- **不要提交到代码仓库**：确保 `.env` 文件已添加到 `.gitignore`，避免将密钥上传到 GitHub 等公共平台。
- **每个账户限 1 个 Key**：如果你认为 Key 已泄露，请登录管理后台删除旧 Key 并重新创建，旧 Key 将立即失效。
- **签名授权不等于转账**：登录时的钱包签名仅用于身份验证，不会触发任何资产转移。
:::

---

### 申请 API Key 的步骤

#### 前提条件

你需要一个支持的区块链钱包（推荐使用 **TronLink** 钱包）用于登录验证。API Key 与你的链上身份绑定，每个账户最多创建 **1 个** API Key。

#### 操作步骤

**第一步：进入登录页**

打开浏览器，访问 [https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io)，进入 Facilitator 管理后台登录页。

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_1.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>

**第二步：点击 TronLink 连接钱包**

页面会提示你选择钱包，点击 **TronLink**。根据你的钱包状态，后续流程略有不同：

- **钱包未登录**：TronLink 会先弹出密码输入框，输入密码解锁后，页面再次出现钱包选择弹窗，继续点击 **TronLink**，随后弹出授权确认窗口。

    <div style={{ textAlign: 'left' }}>
    <img
        src={require('./images/facilitator_2.jpg').default}
        alt="RangeOrder1"
        width="40%"
        height="30%"
    />
    </div>

- **钱包已登录**：点击 TronLink 后直接弹出授权确认窗口。

**第三步：确认授权**

在弹出的授权窗口中，确认将钱包授权给 Facilitator 服务。

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_3.jpg').default}
    alt="RangeOrder1"
    width="40%"
    height="30%"
  />
</div>

> **注意**：此授权仅用于身份验证，不会从你的钱包扣款或转移任何资产。

**第四步：进入 Dashboard**

授权成功后，你将自动跳转到 Dashboard 界面。在这里你可以看到账户概览和 API Key 管理入口。

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_4.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>

**第五步：创建 API Key**

点击页面上的 **"创建 API Key"** 按钮，系统会弹出创建成功的确认弹窗，点击弹窗中的 **"确认"** 继续。

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_5.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>

> **安全提示**：请勿将你的 API Key 泄露给任何人。

**第六步：查看、复制与管理 API Key**

点击 **"确认"** 后，你将回到 Dashboard 页面，API Key 默认以隐藏状态显示。你可以通过以下方式管理：

- **查看 / 隐藏**：点击 API Key 右侧的 **View** 按钮，即可在明文显示与隐藏之间切换。无论当前是显示还是隐藏状态，都可以直接复制 Key。
- **删除**：点击最右侧的 **Delete** 按钮，可以删除当前 API Key。删除后旧 Key 立即失效，你可以重新创建一个新的 Key。

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./images/facilitator_6.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>

> **安全提示**：不使用时建议保持 Key 隐藏状态，避免在他人面前无意暴露。

---

## API 端点

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/health` | 服务健康检查 |
| GET | `/supported` | 查询支持的支付能力和配置 |
| POST | `/fee/quote` | 获取支付要求的费用预估 |
| POST | `/verify` | 验证支付载荷有效性 |
| POST | `/settle` | 执行链上结算（**受限速保护**） |
| GET | `/payments/{payment_id}` | 按支付 ID 查询支付记录 |
| GET | `/payments/tx/{tx_hash}` | 按交易哈希查询支付记录 |

> 限速仅作用于 `/settle` 接口，其他接口不受限速影响。

### 支付记录查询

`/payments/{payment_id}` 和 `/payments/tx/{tx_hash}` 两个接口均返回按时间倒序排列的 JSON 数组。每条记录包含：

- `paymentId` — 支付唯一标识符（可能为空）
- `txHash` — 链上交易哈希
- `status` — `"success"` 或 `"failed"`
- `createdAt` — 时间戳

> 提供 API Key 时，这两个接口只返回与你的账户关联的支付记录，不会看到其他卖家的数据。

---

## 常见问题

**Q：不配置 API Key 能正常运行吗？**

可以运行，但 `/settle` 接口每 IP 每分钟只能调用 1 次。这只适合测试，任何真实流量都必须配置 API Key。

**Q：API Key 会过期吗？**

目前 API Key 不会主动过期，但如果你主动删除并重新创建，旧 Key 将立即失效。

**Q：我可以在多个项目中使用同一个 API Key 吗？**

可以，同一个 API Key 可以在多个服务实例中复用。每个 Key 独立享有 1000 次/分钟的频率上限，不论有多少台服务器在用。

**Q：我想更换 API Key，怎么操作？**

登录管理后台后，在 Dashboard 点击 **Delete** 删除当前 Key，然后重新点击 **"创建 API Key"** 即可生成新的 Key。删除后旧 Key 立即失效，请确保在删除前已将新 Key 更新到所有使用中的项目里，避免服务中断。

**Q：Facilitator 会持有我的资金吗？**

不会。Facilitator 只执行验证和链上操作，资金直接从买家流向你的收款地址，不经过任何托管账户。

---

## 下一步

- [卖家快速入门](../getting-started/quickstart-for-sellers.md) — 完整的服务端接入流程
- [Facilitator 概述](./facilitator.md) — 深入了解 Facilitator 的工作机制
- [支持的网络与代币](./network-and-token-support.md) — 查看当前支持的区块链网络
