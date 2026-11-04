# 使用 B.AI API Key 接入 Codex

本文介绍如何将 B.AI API Key 配置到 Codex。完成配置后，Codex 将通过 B.AI 的 Responses API 调用模型。

生产环境 Base URL：

```text
https://api.b.ai/v1
```

B.AI Responses API 支持 GPT 与 DeepSeek 模型系列。请点击 **Fetch Models（获取模型）**，并从返回结果中选择当前可用模型；本文不维护固定的模型 ID 清单。

推荐使用 CC Switch 管理配置；熟悉 Codex 配置文件的用户也可以手动接入。

## 准备工作

开始前，请确认已经：

- 安装并可正常启动 Codex；
- 在 B.AI 控制台创建有效的 API Key；
- 确认账户具有目标模型的访问权限和可用额度；
- 如使用 CC Switch，安装 v3.16.1 或更高版本。

建议首次连接时点击 **Fetch Models（获取模型）**，从返回结果中选择一个 GPT 模型，确认调用成功后再切换到其他模型。

## 方式一：通过 CC Switch 配置（推荐）

[CC Switch](https://github.com/farion1231/cc-switch) 是第三方开源配置管理工具，可在多个模型供应商之间切换。请从其[官方发布页](https://github.com/farion1231/cc-switch/releases)下载安装。

### 1. 添加 B.AI 供应商

打开 CC Switch，进入 **Codex** 页面并新增自定义供应商。不同版本的字段名称可能略有差异，请填写以下内容：

| 配置项 | 配置值 |
| --- | --- |
| 供应商名称 | `B.AI` |
| Base URL | `https://api.b.ai/v1` |
| API Key | 你的 B.AI API Key |
| 模型 | 从 **Fetch Models** 结果中选择一个 GPT 模型 |
| API 协议 | `Responses` |
| Wire API | `responses` |
| Needs Local Routing | 关闭 |

B.AI 原生支持 Responses API，因此不需要启用 CC Switch 本地路由。如果当前版本未显示 `Wire API` 或 `Needs Local Routing`，只需选择 Responses 协议并确保没有开启 Codex 路由接管。

### 2. 切换并重启 Codex

保存配置，将当前 Codex 供应商切换为 **B.AI**，然后完全退出并重新启动 Codex，使配置和模型列表重新加载。

### 3. 保留 Codex 官方登录状态（可选）

如需在 Codex 桌面端继续使用依赖官方账号的功能，可先完成一次官方账号登录，然后在 CC Switch 中开启：

```text
Settings → General → Codex App Enhancements
→ Keep official login when switching third-party providers
```

开启后，Codex 仍可能显示官方账号，这是正常现象。实际模型请求由 CC Switch 当前供应商和 `~/.codex/config.toml` 决定；使用 B.AI 产生的模型用量和费用计入 B.AI 账户。

不要复制、共享或手动修改 `~/.codex/auth.json`，其中包含敏感的官方登录信息。

## 方式二：手动配置 Codex

手动配置更适合 Codex CLI。Codex 桌面端建议优先使用 CC Switch。

### 1. 设置环境变量

macOS 或 Linux：

```bash
export BAI_API_KEY="<YOUR_BAI_API_KEY>"
```

Windows PowerShell：

```powershell
$env:BAI_API_KEY = "<YOUR_BAI_API_KEY>"
```

以上命令仅对当前终端会话生效。需要长期使用时，请通过操作系统或终端的安全方式持久化环境变量，不要将 API Key 写入项目代码或提交到版本控制系统。

### 2. 编辑 Codex 配置文件

用户级配置文件位置：

- macOS / Linux：`~/.codex/config.toml`
- Windows：`C:\Users\<用户名>\.codex\config.toml`

添加以下配置：

```toml
model = "your-model-id"
model_provider = "bai"

[model_providers.bai]
name = "B.AI"
base_url = "https://api.b.ai/v1"
env_key = "BAI_API_KEY"
wire_api = "responses"
requires_openai_auth = false
```

如果文件中已有 `model`、`model_provider` 或同名 `[model_providers.bai]` 配置，请修改原有配置，不要重复声明。

保存后，请从设置了 `BAI_API_KEY` 的同一终端启动或重启 Codex。

## 验证连接

启动 Codex 并输入：

```text
请只回复：B.AI Codex 连接成功
```

如果 Codex 正常返回结果，即表示接入成功。还可以在 B.AI 控制台查看对应的模型用量，确认请求已通过 B.AI 处理。

## 切换模型

通过 CC Switch 修改模型字段，或手动修改 `config.toml` 中的 `model`：

```toml
model = "目标模型 ID"
```

B.AI Responses API 支持 GPT 与 DeepSeek 模型系列。模型是否可用取决于当前账户权限、额度以及 Codex 版本；请通过 B.AI `GET /v1/models` 获取当前可用的模型 ID，本文不维护固定清单。

### 在 Codex 中使用 DeepSeek 模型

:::caution 使用 DeepSeek 前必须关闭 Codex 联网搜索
Codex 默认可能启用内置联网搜索工具，但 DeepSeek 模型不支持该工具。如果没有关闭，请求可能返回“不支持 Web Search 工具”的错误。

选择 DeepSeek 模型后，打开 `~/.codex/config.toml`，增加以下顶层配置：

```toml
web_search = "disabled"
```

请将该配置放在 `[model_providers.bai]` 配置块上方和配置块之外。保存文件后，完全退出并重新启动 Codex。该设置是使用 DeepSeek 时的必要配置；切换到需要联网搜索的模型配置时，应删除或调整此项。
:::

修改模型后，请重启 Codex。

## 常见问题

| 现象 | 可能原因 | 处理方法 |
| --- | --- | --- |
| `401 Unauthorized` | API Key 缺失、无效或已失效 | 检查 Key 和环境变量，必要时重新创建 Key |
| `403 Forbidden` | 账户额度不足、无模型权限或账号受限 | 检查 B.AI 余额、账户状态和模型权限 |
| 提示找不到模型 | 模型 ID 错误或当前账户不可用 | 查询 `GET /v1/models`，使用返回的准确模型 ID |
| CC Switch 切换后未生效 | Codex 尚未重新加载配置 | 确认当前供应商为 B.AI，并完全重启 Codex |
| 请求返回 `404` 或流式输出异常 | Base URL、协议或本地路由配置错误 | 使用生产地址，选择 Responses，并关闭 B.AI 的本地路由 |
| DeepSeek 请求提示不支持联网搜索工具 | Codex 向不支持该能力的模型提供了联网搜索工具 | 增加顶层配置 `web_search = "disabled"`，然后重启 Codex |
| Codex 仍显示官方账号 | 已启用“保留官方登录”功能 | 属于正常现象；实际请求供应商以 CC Switch 和 `config.toml` 为准 |
| 提示未设置 `BAI_API_KEY` | Codex 进程未读取环境变量 | 从设置该变量的同一终端重新启动 Codex |

## 安全建议

- 不要在聊天、截图、公开文档或代码仓库中暴露 API Key；
- 手动配置时，不要将 API Key 直接写入 `config.toml`；推荐通过环境变量传入，使用 CC Switch 时仅在其官方界面中录入；
- 不同项目建议使用不同的 API Key，并定期轮换；
- 如果怀疑 Key 已泄露，请立即在 B.AI 控制台删除旧 Key 并创建新 Key；
- 仅从 CC Switch 官方仓库下载应用。

## 相关文档

- [B.AI API 参考](../api/API.md)
- [Codex 配置参考](https://developers.openai.com/codex/config-reference/)
- [CC Switch 官方仓库](https://github.com/farion1231/cc-switch)
- [CC Switch：保留 Codex 官方登录配置指南](https://github.com/farion1231/cc-switch/blob/main/docs/guides/codex-official-auth-preservation-guide-en.md)
