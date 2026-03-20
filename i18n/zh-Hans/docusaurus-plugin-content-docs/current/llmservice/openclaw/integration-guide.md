# Integrating OpenClaw with Bank of AI
## 从零到私有 AI Agent：15 分钟部署 OpenClaw 与 Bank of AI

OpenClaw（原名 ClawdBot 或 Moltbot）是一个开源的个人 AI 助手。不同于云端 SaaS 工具，OpenClaw 运行在本地机器上，使你能够完全掌控数据和工作流。你可以通过 WhatsApp、Telegram、Lark、钉钉等熟悉的通讯平台与其交互，用于处理邮件、管理日历、编写代码，甚至自动化你的智能家居。

OpenClaw 不仅仅是一个聊天机器人，它是一个真正可执行任务的“Agent”。它具备持久化记忆、访问本地文件系统和互联网的能力，并且可以通过扩展“技能（Skills）”不断增强能力。

由于其开源和自托管特性，OpenClaw 吸引了大量开发者和技术爱好者社区。社区已经探索出许多创新用例，从自动化业务流程到管理个人生活，展示了个人 AI 的巨大潜力。

本指南将从零开始带你完成：下载、安装、配置 OpenClaw，并连接 Bank of AI API。最终，你将拥有属于自己的 AI 助手。

---

## **Step 1: 获取 Bank of AI API Key**

1. 登录 https://chat.bankofai.io/chat  
2. 进入 API Key 管理页面并申请你的 api_key  

---

## **Step 2: 准备系统环境**

在安装之前，请确保你的系统满足以下基本要求。OpenClaw 适用于类 Unix 系统，同时也可以通过 WSL2 在 Windows 上运行。

| 要求 | 说明 |
|------|------|
| Node.js | 版本 22 或以上 |
| 操作系统 | macOS、Linux、Windows（WSL2） |
| 包管理器 | pnpm（源码编译需要）；标准安装推荐 npm |

检查环境：

```bash
node -v
```

如果版本低于 v22.0.0 或提示“command not found”，请前往官网安装或升级 Node.js：  
https://nodejs.org/

---

## **Step 3: 安装 OpenClaw**

OpenClaw 支持多种安装方式。对于初学者，推荐使用官方一行命令安装方式，它会自动完成大部分配置。

该方法会自动检测操作系统、安装依赖，并将 openclaw 命令全局可用。

macOS / Linux：

```bash
npm install -g openclaw
```

Windows PowerShell：

```bash
npm install -g openclaw
```

---

### **常见问题排查**

#### **问题 1：Sharp 模块错误**

在部分系统（尤其是 macOS + Homebrew 安装 libvips）中，可能遇到 sharp 模块报错。可以通过强制安装预编译版本解决：

```bash
npm install -g openclaw --force
```

---

#### **问题 2：“Command Not Found”**

```bash
openclaw: command not found
```

运行：

```bash
npm config get prefix
```

如果输出为 `/usr/local`，则说明可执行文件位于 `/usr/local/bin`，需要将其加入 PATH：

```bash
export PATH="/usr/local/bin:$PATH"
```

然后执行：

```bash
source ~/.zshrc
```

---

## **Step 4: 完成初始化向导**

安装完成后，初始化向导通常会自动启动。

如果没有启动，可以手动执行：

```bash
openclaw onboard
```

向导包括三个部分：

- **AI Model Configuration（模型配置）**  
  会要求填写 API Key  
  → 暂时选择 **Skip for now**

- **Communication Channels（通信渠道）**  
  选择你要使用的通讯工具（如 Telegram、WhatsApp）

- **Skills（技能）**  
  建议选择 **No**（后续可添加）

完成后进入 OpenClaw UI。

---

## **Step 5: 配置 Bank of AI 模型**

完成初始化后，你需要手动将 Bank of AI 配置添加到 OpenClaw，并设置为默认模型。

有两种方式可以完成配置：

- **One-Click Script（自动脚本方式）**  
  https://docs.bankofai.io/zh-Hans/llmservice/openclaw/one-click-script-tutorial/

- **Manual Configuration（手动配置）**  
  按照下面步骤操作

---

### **5.1 编辑配置文件**

打开配置文件：

```bash
vim ~/.openclaw/openclaw.json
```

OpenClaw 启动时会读取该文件加载模型配置。

找到 `"models"` 部分，并合并以下 JSON（记得替换 API Key）：

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
          {
            "id": "gpt-5.2",
            "name": "gpt-5.2"
          },
          {
            "id": "gpt-5-mini",
            "name": "gpt-5-mini"
          },
          {
            "id": "gpt-5-nano",
            "name": "gpt-5-nano"
          },
          {
            "id": "claude-opus-4.6",
            "name": "claude-opus-4.6"
          },
          {
            "id": "claude-sonnet-4.6",
            "name": "claude-sonnet-4.6"
          },
          {
            "id": "claude-haiku-4.5",
            "name": "claude-haiku-4.5"
          }
        ]
      }
    }
  }
}
```

---

### **5.2 设置默认模型**

在同一个 `openclaw.json` 文件中，找到 `agents`：

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

### **5.3 重启 Gateway**

```bash
openclaw gateway restart
```

---

### **5.4 测试连接**

```bash
openclaw agent --agent main --message "How are you doing today?"
```

如果返回正常内容，说明连接成功。

---

## **Step 6: Gateway 与诊断命令**

### **什么是 Gateway？**

Gateway 是 OpenClaw 的核心服务组件。

| 操作 | 命令 |
|------|------|
| 安装 | openclaw gateway install |
| 启动 | openclaw gateway start |
| 停止 | openclaw gateway stop |
| 重启 | openclaw gateway restart |
| 卸载 | openclaw gateway uninstall |
| 状态 | openclaw gateway status |

---

### **诊断命令**

```bash
openclaw doctor
```

```bash
openclaw gateway status
```

如果显示 **Healthy**，说明运行正常。

---

## **Step 7: 启动 OpenClaw**

你可以通过 Web 界面或终端使用 OpenClaw。

---

### **方式 1：Web Dashboard**

```bash
openclaw dashboard
```

打开浏览器访问：

```
http://127.0.0.1:18789
```

功能包括：

- 聊天  
- 查看历史  
- 配置模型  
- 查看系统状态  

---

### **方式 2：终端 UI（TUI）**

```bash
openclaw tui
```

常用命令：

| 命令 | 说明 |
|------|------|
| /status | 查看系统状态 |
| /session `<key>` | 切换会话 |
| /model `<name>` | 切换模型 |
| /help | 查看帮助 |

---

## **Step 8: 常用命令**

### 1. 查看模型状态

```bash
openclaw models status
```

---

### 2. 管理渠道

```bash
openclaw channels list
```

---

### 3. 搜索记忆

```bash
openclaw memory search "keyword"
```

---

### 4. 查看文档

```bash
openclaw docs
```

---

# ✅ 完成

你已经成功部署了：

**OpenClaw + Bank of AI 私有 AI Agent**

现在你可以：

- 构建自动化工作流  
- 接入 Telegram Bot  
- 执行链上操作  
- 构建 AI Agent 产品  

🚀 欢迎进入你的个人 AI 基础设施时代
