# 快速开始

这一页的目标很简单：**安装 SUN CLI，在 1 分钟内完成第一次 DeFi 查询。**

只读命令不需要钱包——安装即用。

---

## 准备工作

开始之前，确保你已安装：

1. **Node.js** >= 20.0.0（[下载链接](https://nodejs.org/)）
2. **npm**（随 Node.js 一起安装）

---

## 第一步：安装

运行一行命令全局安装 SUN CLI：

```bash
npm install -g @bankofai/sun-cli
```

安装完成后，终端里就能使用 `sun` 命令了。

---

## 第二步：你的第一次查询

查一下 TRX 当前的实时价格。运行：

```bash
sun price TRX
```

你会看到类似这样的输出：

```text
✔ Fetching prices...
┌───────┬────────────────┐
│ Token │ Price (USD)    │
├───────┼────────────────┤
│ TRX   │ 0.301739439813 │
└───────┴────────────────┘
```

就这么简单——你已经连上 SunSwap 了。

---

## 第三步：探索更多数据

再试几个只读命令，看看还能查什么：

**查看 APY 最高的池子：**

```bash
sun pool top-apy --page-size 5
```

**获取「用 1 个 TRX 兑换 USDT」的报价**（不需要钱包）：

```bash
sun swap:quote TRX USDT 1000000
```

这会显示最佳路径和预期输出——不会执行任何交易。（TRX 精度为 6，所以 `1000000` = 1 TRX。）

**获取 JSON 格式输出（适合脚本）：**

```bash
sun --json price USDT
```

---

## 配置钱包（用于写入操作）

只读命令开箱即用。要执行兑换、管理流动性或发送合约交易，需要配置钱包。

SUN CLI 使用 [`agent-wallet`](../../../Agent-Wallet/Intro.md) 进行钱包管理。先安装：

```bash
npm install -g @bankofai/agent-wallet
```

然后按照 [agent-wallet 快速开始指南](../../../Agent-Wallet/QuickStart.md) 配置你的钱包。

:::caution 保管好你的密钥
切勿将私钥或助记词硬编码在配置文件或 Shell 历史记录中。使用环境变量或 agent-wallet 的加密存储。测试时请始终使用 Nile 测试网。
:::

钱包配置完成后，验证一下：

```bash
sun wallet address
```

你会看到你的钱包地址和当前网络：

```json
{ "address": "TNmoJ...xxxxx", "network": "mainnet" }
```

---

## 在测试网执行第一笔兑换

钱包配置好后，在 Nile 测试网上试一笔**用 1 个 TRX 兑换 USDT** 的交易：

```bash
sun swap TRX USDT 1000000 --network nile --yes
```

`--yes` 标志跳过确认提示。输出包含交易 ID 和 Tronscan 链接，可以在链上查证。

:::tip 先在 Nile 测试网验证
在主网执行任何写操作前，先在 Nile 测试网上跑通。主网操作涉及真实资产，错误无法撤回。
:::

---

## 网络与 API 配置

可选的环境变量自定义：

```bash
export TRON_NETWORK=mainnet
```

```bash
export TRON_GRID_API_KEY="<YOUR_KEY>"
```

```bash
export TRON_RPC_URL=https://your-rpc
```

---

## 下一步

- **[完整能力清单](./CommandGuide.md)** — 所有命令的完整参考：钱包、价格、兑换、流动性、协议、合约操作
- **[常见问题与排查](./FAQ.md)** — 常见问题与故障排查
- **[SUN MCP Server](../SUNMCPServer/Intro.md)** — 更喜欢 AI 驱动的 DeFi？用 SUN MCP Server 实现自然语言交互
