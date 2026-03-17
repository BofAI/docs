# 集成 OpenClaw 与 Bank of AI
## 从零到私人 AI Agent：15 分钟部署 OpenClaw + Bank of AI

OpenClaw（原名 ClawdBot / Moltbot）是一个开源的个人 AI 助手。与云端 SaaS 工具不同，OpenClaw 运行在本地设备上，让你完全掌控数据与工作流程。

你可以通过 WhatsApp、Telegram、Lark、钉钉等消息平台与其交互，用于处理邮件、管理日历、编写代码，甚至自动化智能家居。

OpenClaw 不只是聊天工具，而是具备实际执行能力的 **AI Agent**，支持：

- 持久化记忆  
- 本地文件访问  
- 互联网访问  
- 技能扩展  

本指南将带你完成安装、配置，并连接 Bank of AI API，快速搭建属于你的 AI Agent。

---

# Step 1 获取 Bank of AI API Key

1. 打开：https://chat.bankofai.io/chat  
2. 登录账户  
3. 进入 API Key 管理页面  
4. 创建并复制 API Key  

---

# Step 2 准备系统环境

| 要求 | 说明 |
|---|---|
| Node.js | ≥ v22 |
| 系统 | macOS / Linux / Windows（WSL2） |
| 包管理 | npm |

检查版本：

```bash
node -v
```

若版本过低，请前往：https://nodejs.org/

---

# Step 3 安装 OpenClaw

```bash
npm install -g openclaw
```

---

## 常见问题

### Sharp 报错

```bash
npm install -g openclaw --force
```

### 命令找不到

```bash
npm config get prefix
```

例如输出：

```
/usr/local
```

加入环境变量：

```bash
export PATH="/usr/local/bin:$PATH"
source ~/.zshrc
```

---

# Step 4 初始化

```bash
openclaw onboard
```

操作建议：

- 模型配置：选择 **Skip for now**
- 渠道：可跳过
- Skills：选择 No

---

# Step 5 配置 Bank of AI

## 5.1 编辑配置文件

```bash
vim ~/.openclaw/openclaw.json
```

加入：

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "bankofai": {
        "baseUrl": "https://api.bankofai.io/v1/",
        "apiKey": "{BANKOFAI_API_KEY}",
        "api": "openai-completions",
        "models": [
          { "id": "gpt-5.2", "name": "gpt-5.2" },
          { "id": "gpt-5-mini", "name": "gpt-5-mini" },
          { "id": "gpt-5-nano", "name": "gpt-5-nano" },
          { "id": "claude-opus-4.6", "name": "claude-opus-4.6" },
          { "id": "claude-sonnet-4.6", "name": "claude-sonnet-4.6" },
          { "id": "claude-haiku-4.5", "name": "claude-haiku-4.5" }
        ]
      }
    }
  }
}
```

---

## 5.2 设置默认模型

```json
{
  "agents": {
    "default": {
      "model": "bankofai/gpt-5-nano"
    }
  }
}
```

---

## 5.3 重启服务

```bash
openclaw gateway restart
```

---

## 5.4 测试

```bash
openclaw agent --agent main --message "Hello"
```

---

# Step 6 Gateway 与诊断

常用命令：

| 操作 | 命令 |
|---|---|
| 启动 | openclaw gateway start |
| 停止 | openclaw gateway stop |
| 重启 | openclaw gateway restart |
| 状态 | openclaw gateway status |

诊断：

```bash
openclaw doctor
```

---

# Step 7 启动

## Web UI

```bash
openclaw ui
```

打开：

```
http://127.0.0.1:18789
```

---

## 终端 UI

```bash
openclaw tui
```

---

# Step 8 常用命令

```bash
openclaw models status
openclaw channels list
openclaw memory search "keyword"
openclaw docs
```

---

# 完成

你已经成功部署：

**OpenClaw + Bank of AI AI Agent**

你可以：

- 自动化流程  
- 接入 Telegram  
- 构建 AI 产品  

🚀
