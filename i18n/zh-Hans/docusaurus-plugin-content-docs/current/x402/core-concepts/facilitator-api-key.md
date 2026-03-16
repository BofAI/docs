# Facilitator API Key

## 什么是 Facilitator API Key？

当你使用**官方托管的 Facilitator 服务**时，需要申请一个 API Key 来标识你的身份并解锁更高的调用频率。

每笔 x402 支付都需要调用 Facilitator 的 `/settle` 接口一次。没有 API Key 时，每分钟最多只能处理 1 笔支付；配置后上限提升至 1000 次/分钟，足以支撑正常的生产流量。

| 状态 | 调用频率上限 |
|------|-------------|
| 未配置 API Key | 1 次 / 分钟 |
| 已配置 API Key | 1000 次 / 分钟 |

对于生产环境，**强烈建议配置 API Key**，否则极低的频率限制会直接影响你的服务可用性。

---

:::warning
## 安全注意事项

- **API Key 泄露等同于身份泄露**：任何持有你的 API Key 的人都可以以你的名义调用 Facilitator 服务，请像保护密码一样保护它。
- **不要提交到代码仓库**：确保 `.env` 文件已添加到 `.gitignore`，避免将密钥上传到 GitHub 等公共平台。
- **每个账户限 1 个 Key**：如果你认为 Key 已泄露，请登录管理后台删除旧 Key 并重新创建，旧 Key 将立即失效。
- **签名授权不等于转账**：登录时的钱包签名仅用于身份验证，不会触发任何资产转移。
:::

---

## 官方服务地址说明

官方 Facilitator 涉及两个地址，用途完全不同，请注意区分：

| 地址 | 用途 |
|------|------|
| [https://admin-facilitator.bankofai.io](https://admin-facilitator.bankofai.io) | **管理后台** — 用于注册账号、申请和管理 Facilitator API Key（浏览器访问） |
| [https://facilitator.bankofai.io](https://facilitator.bankofai.io) | **服务端点** — 在项目代码的 `FACILITATOR_URL` 中配置，用于实际处理付款验证和结算请求（API 调用，非浏览器访问） |

> 💡 只有管理后台地址需要用浏览器打开；服务端点地址填入 `.env` 文件即可，不需要用浏览器访问。

---

## 创建 API Key

### 前提条件

你需要一个支持的区块链钱包（推荐使用 **TronLink** 钱包）用于登录验证。API Key 与你的链上身份绑定，每个账户最多创建 **1 个** API Key。

### 操作步骤

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

> **安全提示**：请勿将你的 API Key 泄露给任何人，以免造成资产损失。

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

## 在项目中配置 API Key

拿到 API Key 后，在你的 x402 项目根目录下找到 `.env` 文件，加入以下一行即可：

```bash
FACILITATOR_API_KEY=<your_api_key>
```

> 如果还没有 `.env` 文件，可以先从模板复制：`cp .env.sample .env`。其他配置项（钱包地址、私钥等）请参考 [卖家快速入门](../getting-started/quickstart-for-sellers.md)。


---

## 常见问题

**Q：不配置 API Key 能正常运行吗？**

可以运行，但每分钟只能处理 1 次支付请求，实际生产场景中这个频率完全不够用。强烈建议配置。

**Q：API Key 会过期吗？**

目前 API Key 不会主动过期，但如果你主动删除并重新创建，旧 Key 将失效。

**Q：我可以在多个项目中使用同一个 API Key 吗？**

可以，同一个 API Key 可以在多个服务实例中复用。每个项目独立享有 1000 次/分钟的频率上限，各项目之间互不影响。

**Q：我想更换 API Key，怎么操作？**

登录管理后台后，在 Dashboard 点击 **Delete** 删除当前 Key，然后重新点击 **"创建 API Key"** 即可生成新的 Key。删除后旧 Key 立即失效，请确保在删除前已将新 Key 更新到所有使用中的项目里。

**Q：Facilitator 会持有我的资金吗？**

不会。Facilitator 只执行验证和链上操作，资金直接从买家流向你的收款地址，不经过任何托管账户。

---

## 下一步

- [卖家快速入门](../getting-started/quickstart-for-sellers.md) — 完整的服务端接入流程
- [Facilitator 原理](./facilitator.md) — 深入了解 Facilitator 的工作机制
- [支持的网络与代币](./network-and-token-support.md) — 查看当前支持的区块链网络
