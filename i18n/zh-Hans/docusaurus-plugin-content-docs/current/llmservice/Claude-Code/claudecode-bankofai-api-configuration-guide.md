# 使用 BANK OF AI API 配置 Claude Code

## 目录

- [开始之前](#开始之前)
- [方案一：使用 settings.json（推荐）](#方案一使用-settingsjson推荐)
- [方案二：使用环境变量](#方案二使用环境变量)
- [切换模型](#切换模型)
- [可用模型](#可用模型)
- [常见问题](#常见问题)

***

## 开始之前

在继续配置之前，请先完成以下两个前置步骤。

### 第一步：安装 Claude Code

根据你的操作系统选择对应的安装方式：

**macOS / Linux / WSL：**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell：**

```powershell
irm https://claude.ai/install.ps1 | iex
```

**npm（需要 Node.js 18+）：**

```bash
npm install -g @anthropic-ai/claude-code
```

### 第二步：获取 BANK OF AI API Key

1. 登录 [BANK OF AI Chat 平台](https://chat.bankofai.io/chat)
2. 进入 [API Key 管理页面](https://chat.bankofai.io/key)
3. 点击创建新的 API Key

> **注意：** 请妥善保管你的 API Key。你将在下面的配置步骤中使用它。

完成以上两个前置步骤后，即可选择下面任意一种方式来配置 BANK OF AI API。

***

## 方案一：使用 settings.json（推荐）

这种方式通过 Claude Code 自身的配置文件完成设置，无需修改系统环境变量。

### 操作步骤

1. 找到 Claude Code 安装目录中的 `settings.json` 文件。如果文件不存在，请手动创建一个新的。
2. 添加以下内容：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的-BANK-OF-AI-API-Key",
    "ANTHROPIC_BASE_URL": "https://api.bankofai.io/",
    "ANTHROPIC_MODEL": "claude-sonnet-4.6",
    "API_TIMEOUT_MS": "3000000"
  }
}
```

> **提示：** 你可以将 `ANTHROPIC_MODEL` 替换为[可用模型](#可用模型)列表中的任意模型。

3. 保存文件并重启终端。
4. 执行以下命令验证配置：

```bash
claude --version
claude
```

如果 Claude Code 可以正常启动，并且能够使用 BANK OF AI 模型返回结果，则说明配置完成。

***

## 方案二：使用环境变量

这种方式适用于需要全局生效配置的场景。

### 设置环境变量

将以下内容添加到对应 shell 的配置文件中：

#### Bash（Linux / macOS）

编辑 `~/.bashrc`（macOS 也可能是 `~/.bash_profile`）：

```bash
# Claude Code - BANK OF AI Provider Configuration
export ANTHROPIC_BASE_URL="https://api.bankofai.io/"
export ANTHROPIC_AUTH_TOKEN="your-api-key-here"
export ANTHROPIC_MODEL="claude-sonnet-4.6"
# End of BANK OF AI Provider Configuration
```

应用修改：

```bash
source ~/.bashrc
```

#### Zsh（Linux / macOS）

编辑 `~/.zshrc`：

```bash
# Claude Code - BANK OF AI Provider Configuration
export ANTHROPIC_BASE_URL="https://api.bankofai.io/"
export ANTHROPIC_AUTH_TOKEN="your-api-key-here"
export ANTHROPIC_MODEL="claude-sonnet-4.6"
# End of BANK OF AI Provider Configuration
```

应用修改：

```bash
source ~/.zshrc
```

#### PowerShell（Windows）

编辑你的 `$PROFILE` 文件：

```powershell
# Claude Code - BANK OF AI Provider Configuration
$env:ANTHROPIC_BASE_URL = "https://api.bankofai.io/"
$env:ANTHROPIC_AUTH_TOKEN = "your-api-key-here"
$env:ANTHROPIC_MODEL = "claude-sonnet-4.6"
# End of BANK OF AI Provider Configuration
```

应用修改：

```powershell
. $PROFILE
```

#### 配置文件路径参考

|   操作系统   |   Shell    | 配置文件路径                      |
| :----------: | :--------: | :-------------------------------- |
|    Linux     |    Bash    | `~/.bashrc`                       |
|    Linux     |    Zsh     | `~/.zshrc`                        |
|    macOS     |    Bash    | `~/.bashrc` 或 `~/.bash_profile`  |
|    macOS     |    Zsh     | `~/.zshrc`                        |
|   Windows    | PowerShell | `$PROFILE`                        |

### 验证配置

```bash
claude --version
claude
```

如果 Claude Code 可以正常启动，并且能够使用 BANK OF AI 模型返回结果，则说明配置完成。

***

## 切换模型

### 临时切换（仅当前会话生效）

**Linux / macOS：**

```bash
ANTHROPIC_MODEL=claude-opus-4.6 claude
```

**Windows PowerShell：**

```powershell
$env:ANTHROPIC_MODEL="claude-opus-4.6"; claude
```

### 永久切换

修改 `settings.json` 或 shell 配置文件中的 `ANTHROPIC_MODEL` 值，然后重启终端或重新加载配置。

***

## 可用模型

| 模型名称            | 提供方     |
| :------------------ | :--------- |
| `claude-opus-4.6`   | Anthropic  |
| `claude-opus-4.5`   | Anthropic  |
| `claude-sonnet-4.6` | Anthropic  |
| `claude-sonnet-4.5` | Anthropic  |
| `claude-haiku-4.5`  | Anthropic  |
| `gpt-5.2`           | OpenAI     |
| `gpt-5-mini`        | OpenAI     |
| `gpt-5-nano`        | OpenAI     |
| `gemini-3.1-pro`    | Google     |
| `gemini-3-flash`    | Google     |
| `kimi-k2.5`         | Moonshot   |
| `glm-5`             | Zhipu AI   |
| `minimax-m2.5`      | MiniMax    |

> 完整且最新的模型列表，请查询 BANK OF AI 提供的 Models API。

***

## 常见问题

<details>
<summary><strong>Q：出现 “claude command not found” 怎么办？</strong></summary>

请先安装 Claude Code：

- **Linux / macOS：** `curl -fsSL https://claude.ai/install.sh | bash`
- **Windows：** `irm https://claude.ai/install.ps1 | iex`

安装完成后请重启终端。

</details>

<details>
<summary><strong>Q：安装脚本执行失败，我应该检查什么？</strong></summary>

请确认以下几点：

1. Claude Code 已正确安装（执行 `claude --version` 可以看到版本号）
2. 已安装 `curl`（Linux / macOS）
3. 网络可以访问 `https://api.bankofai.io/`

如果问题仍然存在，可以尝试使用[方案二：使用环境变量](#方案二使用环境变量)进行手动配置。

</details>

<details>
<summary><strong>Q：如何验证配置是否生效？</strong></summary>

可以检查环境变量是否已正确设置：

**Linux / macOS：**

```bash
echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_MODEL
```

**Windows PowerShell：**

```powershell
$env:ANTHROPIC_BASE_URL
$env:ANTHROPIC_MODEL
```

</details>

<details>
<summary><strong>Q：如何查看当前正在使用的模型？</strong></summary>

启动 Claude Code 后，输入：

```text
/status
```

</details>

<details>
<summary><strong>Q：为什么调用某些模型时会返回 403 access_denied？</strong></summary>

带有 **Premium** 标签的模型，如果你的 BANK OF AI 账户此前从未充值，可能会返回 `403 access_denied`。

仅有有效的 API Key 并不足以调用 Premium 模型。请先完成账户充值，然后再重试。

</details>

<details>
<summary><strong>Q：如何移除 BANK OF AI provider 配置？</strong></summary>

编辑你的 shell 配置文件，删除以下注释块之间的内容：

```bash
# Claude Code - BANK OF AI Provider Configuration
...
# End of BANK OF AI Provider Configuration
```

然后重新加载配置文件，例如：

```bash
source ~/.zshrc
```

</details>

***

> **版本：** v1.0 | **最后更新：** 2026-03-27
