## 快速开始

**在运行脚本前，请确保：**

1. 已安装 Node.js 22 或以上版本  
2. 已安装并初始化 OpenClaw（已执行 `openclaw onboard`）  
3. 网络正常，可访问 Bank of AI API  

---

## 脚本命令

### Linux & macOS

Mac 用户：打开「终端」，输入：

```bash
curl https://chat.bankofai.io/scripts/openclaw-install-bankofai-provider.sh | bash
```

---

### Windows PowerShell

Windows 用户：打开「PowerShell」（不支持 CMD），输入：

```powershell
iwr https://chat.bankofai.io/scripts/openclaw-install-bankofai-provider.ps1 | iex
```

---

## 详细步骤

### 1 获取 API Key

1. 登录 Bank of AI 平台  
   https://chat.bankofai.io/  

2. 进入 API Key 页面  
   https://chat.bankofai.io/key  

3. 创建新的 API Key  

---

### 2 运行安装脚本

根据系统执行对应命令，脚本会自动：

- 检查环境（Node.js、OpenClaw 等）
- 提示输入 API Key  

---

### 3 选择默认模型

验证 API Key 后，脚本会获取模型列表并提示选择默认模型。

> 注意：Gemini 系列模型在 OpenClaw 中存在兼容性问题（函数调用限制），建议谨慎选择。

---

### 4 完成配置

脚本会自动执行：

- 备份原配置  
- 更新 OpenClaw 配置文件  
- 重启 Gateway  

---

### 5 切换模型

#### 方法一：命令行

```bash
openclaw models set bankofai/<model_name>
```

---

#### 方法二：Web 界面

打开：

```
http://127.0.0.1:18789/
```

操作：

- 左侧点击 Agent  
- 在 Primary model 中选择模型  

> 注意：如果通过 Dashboard 修改模型，配置文件会新增 `list` 字段，此时命令行切换将失效。

---

## 兼容性测试

| 系统 | 状态 |
|---|---|
| Ubuntu 24.04 | ✅ 通过 |
| Windows 11 | ✅ 通过 |
| macOS | ✅ 通过 |

---

## 常见问题

### Q：脚本执行失败怎么办？

请确认：

1. Node.js ≥ 22  
2. 已执行 `openclaw onboard`  
3. 网络正常，可访问 Bank of AI  

---

### Q：如何切换模型？

参考上方「步骤 5 切换模型」。
