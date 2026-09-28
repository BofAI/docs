---
title: "买家快速入门"
description: "使用 wallet-cli 4.14.0 配置钱包并完成 x402 支付。"
---

# 买家快速入门

使用 **wallet-cli 4.14.0** 管理账户、签署支付并调用 x402 API。本指南使用本地 Nile 测试网服务；公开目录中的服务可能只支持主网。

## 安装 wallet-cli

需要 Node.js 20 或更新版本。全局安装并查看命令说明：

```bash
npm install -g @tron-walletcli/wallet-cli@4.14.0
wallet-cli --version
wallet-cli x402 pay --help
wallet-cli x402 pay --json-schema -o json
```

CLI 版本应为 `4.14.0`。帮助和 schema 查询不访问钱包数据。其他命令首次运行可能返回 `command: "migration"`；检查迁移结果后，再执行原命令。

## 在本地配置账户

在自己的终端中，通过 `wallet-cli create --help` 或 `wallet-cli import --help` 选择账户配置流程，并按说明操作。不要将钱包密码、私钥或助记词放入聊天、命令参数或日志。本流程不需要将私钥导出为环境变量。

```bash
wallet-cli list -o json
wallet-cli current -o json
```

核对选中账户的公开地址。需要切换时查看 `wallet-cli use --help`，也可以在支付命令中用 `--account` 指定账户 ID 或标签。使用专用 Nile 测试账户，准备支付手续费的测试 TRX 和付款所需的测试 USDT。参见 [Nile 水龙头](https://nileex.io/join/getJoinPage)。

## 预览支付

先启动[卖家快速入门](/zh-Hans/x402/getting-started/quickstart-for-sellers/)中的 Nile 服务。本地 `GET /credit` 接口收取 1 USDT。预览也需要已配置账户。

```bash
wallet-cli x402 pay http://localhost:4021/credit \
  --method GET \
  --network tron:3448148188 \
  --token USDT \
  --scheme exact \
  --max-amount 1 \
  --dry-run -o json
```

`--dry-run` 只检查支付要求，不签名、不付款。核对 URL、选中账户、网络、资产、收款地址、金额和手续费。上面的十进制网络 ID 是 wallet-cli 的 Nile 规范标识。`--max-amount 1` 表示最多支付一个完整代币，不是一个最小单位；保留 USDT 筛选条件。链上手续费还需要单独准备 TRX。

调用目录服务时，通过 `wallet-cli x402 provider-list` 和 `wallet-cli x402 endpoint-list --help` 查找服务，使用其实际路由 URL 和支持的网络。只修改网络参数不会将主网服务变成测试网服务。参见 [API 服务发现](/zh-Hans/x402/api-catalog/get-started/)。

## 核对后付款

确认授权这笔具体付款后，在同一命令中移除 `--dry-run` 并加上 `--password-stdin`。通过安全的本地密码来源将钱包密码直接传入 stdin。不要把密码写在命令里、通过 `echo` 打印，或发送给 AI。保持账户、网络、代币、scheme 和金额上限与已核对的预览一致。

钱包和支付签名均由 CLI 处理。检查 JSON 结果和 HTTP 响应后再判断是否成功。示例服务返回类似以下业务数据：

```json
{ "status": "success", "credit": 1000000 }
```

这是服务响应内容，不是完整的 wallet-cli 结果对象。进程退出成功本身不能证明支付和服务交付都已完成。

## 错误处理与避免重复付款

| 结果 | 处理方式 |
|---|---|
| 返回钱包迁移结果 | 完成本地迁移并检查结果，再执行原命令。 |
| 没有可用账户 | 检查 `list` 和 `current`，在本地选择预期账户。 |
| 没有匹配的支付选项或价格超过上限 | 核对服务端网络、代币、scheme 和价格，不要自动提高已授权金额上限。 |
| 余额不足或授权失败 | 检查代币余额、TRX 手续费及返回的授权详情后再决定是否重试。 |
| 超时、`paymentStatus: "unknown"` 或 `retryPayment: false` | 核实原付款和服务结果，不要自动再次付款。 |

检查进程退出码和结构化错误字段，保存返回的交易哈希以核实状态。支付结果和重试规则参见[命令与结果参考](/zh-Hans/wallet-cli/command-reference/)。

## 下一步

- [Wallet CLI 指南](/zh-Hans/wallet-cli/quickstart/)
- [Agent 快速入门](/zh-Hans/x402/getting-started/quickstart-for-agent/)
- [SDK 集成参考](/zh-Hans/x402/sdk-features/)

<span id="本指南面向谁"></span>
<span id="前置准备"></span>
<span id="首先私钥安全"></span>
<span id="开始前清单"></span>
<span id="创建测试钱包并领取测试代币"></span>
<span id="第一步安装-sdk-包"></span>
<span id="第二步配置私钥"></span>
<span id="第三步编写并运行客户端代码"></span>
<span id="运行-client"></span>
<span id="第四步错误排查"></span>
<span id="完成总结"></span>
<span id="参考资料"></span>
