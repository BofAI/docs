import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# AI 代理快速入门

x402 专为 Agentic Web 设计。AI Agent 可以使用 `x402_payment` 技能自主协商并支付资源费用。

该技能使 Agent 能够：

- 检测 `402 Payment Required` 响应
- 自动签署支付授权
- 管理钱包余额并处理支付流程

## 配置

通过环境变量配置您的 Agent 钱包凭据：
<Tabs>
<TabItem value="TRON" label="TRON">

```bash
export TRON_PRIVATE_KEY="your_private_key_here"
export TRON_GRID_API_KEY="your_trongrid_api_key_here"  # Recommended to avoid RPC rate limits
```

</TabItem>
<TabItem value="BSC" label="BSC">

```bash
export BSC_PRIVATE_KEY="your_private_key_here"
```

</TabItem>
</Tabs>

## 安装

将 [x402-payment](https://github.com/bankofai/skills/tree/main/x402-payment) 技能添加到您的智能体 (Agent) 工具库中：

| 工具平台     | 安装方法                                   |
| ------------ | ------------------------------------------ |
| **OpenClaw** | `npx clawhub install x402-payment`    |
| **opencode** | 将技能文件复制到 `.opencode/skill/` 目录中 |

## 快速体验

指示您的 Agent 访问 `https://x402-demo.bankofai.io/protected-nile`。Agent 将自动识别支付请求，完成签名授权，并获取受保护的资源。

## 安全最佳实践

- **控制资金余额** — 仅向 Agent 钱包充值日常运营所需的金额
- **优先在 Nile 测试** — 在部署到主网之前，务必先在测试网验证集成
- **监控交易记录** — 通过 [TronScan](https://tronscan.org)/[BscScan](https://bscscan.com) 随时追踪 Agent 的支出情况
- **妥善保管凭证** — 使用安全的环境变量管理私钥，切勿明文存储

## 下一步

- [搭建付费 API](./quickstart-for-sellers.md) 供智能体调用
- [了解 HTTP 402](../core-concepts/http-402.md) 支付协议

## 参考资料

- [OpenClaw 扩展库](https://github.com/bankofai/openclaw-extension)
- [ClawHub 上的 x402-payment](https://github.com/bankofai/skills/tree/main/x402-payment)
- [x402 演示项目](https://github.com/bankofai/x402-demo)
