# 快速开始

这个页面的目标很简单：**让你在 1 分钟内完成接入，发起第一次 DeFi 查询。**

我们会使用[官方云服务](./OfficialServerAccess.md)来完成这次快速体验。云服务是只读的，无需钱包，立即可用。

---

## 准备工作

在开始之前，请确保你已经有：

1. **Node.js** >= 20.0.0（[下载链接](https://nodejs.org/)）
2. **MCP 客户端**：所有支持 MCP 的 AI 客户端。

---

## 安装

只需告诉你的 AI Agent 执行以下命令：

```bash
npx add-mcp https://sun-mcp-server.bankofai.io/mcp
```

命令完成后，重启你的 MCP 客户端。

---

## 重启并测试

完成配置后，重启你的 MCP 客户端。然后在对话中尝试以下查询：

```
查一下 SunSwap 上 USDT 和 TRX 的当前价格
```

:::info 关于云服务
我们提供的官方云服务是**只读的**，适合查询数据和分析。如果你需要执行链上交易、部署合约等写操作，请查看[本地私有化部署](./LocalPrivatizedDeployment.md)。
:::

---

## 继续探索

以下是一些常见的 DeFi 查询示例：

| 操作 | 示例提示 |
|------|--------|
| **价格查询** | 查询 USDT/TRX 的实时价格 |
| **流动性池数据** | 获取 SunSwap 中 TRX-USDC 交易对的池信息 |
| **头寸查询** | 查看地址 TR... 在 SunSwap 中的所有流动性头寸 |
| **交易报价** | 获取交换 1000 USDT 为 TRX 的报价 |
| **协议统计** | 获取 SunSwap 的 TVL、24 小时交易量等统计数据 |

---

## 下一步

- **[本地私有化部署](./LocalPrivatizedDeployment.md)** - 学习如何在本地运行 SUN MCP Server 并进行写操作
- **[官方服务器访问](./OfficialServerAccess.md)** - 了解官方云服务的详细信息
- **[完成能力清单](./ToolList.md)** - 查看所有可用的工具和功能

---

祝你使用愉快！如有问题，欢迎反馈。
