# OpenClaw 浏览器扩展插件安装与使用说明

## 1. 引言

OpenClaw 是一个强大的开源 AI 助手，旨在通过与各种通信渠道和工具集成，帮助用户自动化日常任务。OpenClaw 浏览器扩展插件允许 AI 代理直接控制您现有的 Chrome 浏览器标签页，而非启动一个独立的 OpenClaw 管理的 Chrome 配置文件，从而实现更无缝的自动化操作。、

## 2. OpenClaw 浏览器扩展插件概述

### 2.1 核心概念

OpenClaw 浏览器扩展插件的工作机制涉及三个主要部分 [1]：

*   **浏览器控制服务 (Browser control service)**：这是 AI 代理或工具通过 Gateway 调用的 API。
*   **本地中继服务器 (Local relay server)**：它在控制服务器和扩展插件之间建立桥梁，默认通过 `http://127.0.0.1:18792` 进行通信。
*   **Chrome MV3 扩展插件 (Chrome MV3 extension)**：它使用 `chrome.debugger` 附加到活动标签页，并将 CDP (Chrome DevTools Protocol) 消息传输到中继服务器。

通过这种方式，OpenClaw 能够通过其标准的 `browser` 工具界面控制已附加的标签页。

### 2.2 主要功能

OpenClaw 浏览器扩展插件的主要功能是让 AI 代理能够：

*   在现有 Chrome 标签页中进行点击、输入、导航等操作。
*   读取页面内容。
*   访问标签页已登录会话可访问的任何内容。

## 3. 安装与加载

OpenClaw 浏览器扩展插件的安装过程需要手动加载“未打包的扩展程序”。

### 3.1 安装扩展插件文件

首先，您需要通过 OpenClaw CLI 安装扩展插件文件到本地稳定路径：

```bash
openclaw browser extension install
```

接着，打印已安装的扩展插件目录路径，以便后续在 Chrome 中加载：

```bash
openclaw browser extension path
```

### 3.2 在 Chrome 中加载扩展插件

1.  打开 Chrome 浏览器，并在地址栏输入 `chrome://extensions`。
2.  在扩展程序页面，启用右上角的“**开发者模式 (Developer mode)**”。
3.  点击“**加载已解压的扩展程序 (Load unpacked)**”按钮。
4.  选择上一步中打印出的扩展插件目录路径。
5.  （可选）将 OpenClaw 扩展插件固定到 Chrome 工具栏，方便快速访问和操作。

## 4. 使用方法

### 4.1 默认配置

OpenClaw 默认提供了一个名为 `chrome` 的内置浏览器配置文件，它指向默认端口上的扩展插件中继。您可以通过以下方式使用它：

*   **CLI (命令行界面)**：

    ```bash
    openclaw browser --browser-profile chrome tabs
    ```

*   **AI 代理工具**：在代理配置中使用 `browser` 工具，并设置 `profile="chrome"`。

### 4.2 自定义配置文件

如果您需要使用不同的名称或中继端口，可以创建自己的配置文件：

```bash
openclaw browser create-profile \
  --name my-chrome \
  --driver extension \
  --cdp-url http://127.0.0.1:18792 \
  --color "#00AA00"
```

### 4.3 附加与分离标签页

*   打开您希望 OpenClaw 控制的标签页。
*   点击 Chrome 工具栏上的 OpenClaw 扩展插件图标。
    *   当扩展插件图标显示 `ON` 时，表示已附加成功，OpenClaw 可以驱动该标签页。
*   再次点击图标即可分离标签页。

**重要提示**：扩展插件不会自动控制“您正在查看的任何标签页”。它只控制您通过点击工具栏按钮明确附加的标签页。要切换控制的标签页，请打开另一个标签页并点击扩展插件图标。

### 4.4 扩展插件图标状态

*   `ON`：已附加，OpenClaw 可以驱动该标签页。
*   `…`：正在连接到本地中继服务器。
*   `!`：中继服务器无法访问（最常见的原因是浏览器中继服务器未在该机器上运行）。

如果显示 `!`，请确保 Gateway 在本地运行，或者如果 Gateway 在其他机器上运行，则在该机器上运行一个节点主机。

## 5. 远程 Gateway 配置

### 5.1 本地 Gateway (Chrome 与 Gateway 在同一机器)

如果 Gateway 与 Chrome 在同一机器上运行，它会自动启动浏览器控制服务和中继服务器。扩展插件与本地中继通信，CLI/工具调用则发送到 Gateway。

### 5.2 远程 Gateway (Gateway 在其他机器)

如果您的 Gateway 在其他机器上运行，则需要在运行 Chrome 的机器上启动一个节点主机。Gateway 会将浏览器操作代理到该节点，而扩展插件和中继服务器则保持在浏览器机器本地。

## 6. 安全注意事项

OpenClaw 浏览器扩展插件功能强大，但也伴随着一定的安全风险。将其视为赋予模型“控制您浏览器”的能力。

*   扩展插件使用 Chrome 的调试器 API (`chrome.debugger`)。当附加时，模型可以：
    *   在标签页中进行点击/输入/导航。
    *   读取页面内容。
    *   访问标签页已登录会话可访问的任何账户状态。
*   **这并非隔离环境**。如果您附加到日常使用的配置文件/标签页，您将授予 AI 代理访问该账户状态的权限。

**建议**：

*   推荐为扩展插件的使用创建一个**专用 Chrome 配置文件**，与您的个人浏览分开。
*   确保 Gateway 和任何节点主机仅通过 Tailnet 访问，避免将中继端口暴露到局域网或公共互联网。

