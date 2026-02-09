# x402-tron 文档维护指引

## 1. 项目定位与核心

- 本仓库包含 x402-tron 项目基于 Docusaurus 构建的文档源代码。
- 主要由 MDX / Markdown 文件构成，并通过 `sidebars.js` 进行侧边栏导航配置。

## 2. 目录结构说明

- `docs/core-concepts/` — 协议详解（含 HTTP 402、客户端-服务器模型、促进者、钱包管理及网络支持）。
- `docs/getting-started/` — 面向买方与卖方的上手指南（使用 Tabs 展示多语言代码）。
- `docs/index.md` — 欢迎页 / 落地页 (Landing Page)。
- `docs/faq.md` — 常见问题解答。
- `sidebars.js` — Docusaurus 侧边栏配置文件。
- `docusaurus.config.js` — Docusaurus 主配置文件。
- `docs/sdk-features.md` — Python 与 TypeScript SDK 的功能特性对比表。

## 3. 代码与文档的同步机制

文档维护需遵循以下依赖关系，确保代码变更即时反映在文档中：

- `typescript/packages/` 目录下的变更 $\rightarrow$ 需同步更新 TypeScript 相关文档。
- `python/x402/` 目录下的变更 $\rightarrow$ 需同步更新 Python 相关文档。
- 端点逻辑的变更 $\rightarrow$ 需更新“快速入门”指南。
- 底层机制的变更 $\rightarrow$ 需更新 `core-concepts` 文档。

## 4. 风格与规范 
- 以 **Python** 作为主要代码示例（鉴于其 SDK 功能最为完备）。
- 在功能支持的情况下，务必补充 **TypeScript** 示例。
- 所有 API 调用示例必须包含完整的错误处理逻辑。
- 内容撰写面向具有 **2–5 年经验** 的开发者。
- 必须使用 Docusaurus MDX 组件（`<Tabs>`、`<TabItem>`）来展示多语言代码。
- 凡使用 Tabs 的文件，必须在文件顶部显式引入：
  ```js
  import Tabs from '@theme/Tabs';
  import TabItem from '@theme/TabItem';
  ```
- 所有 API 端点必须同时提供 **成功** 与 **失败** 的响应示例。
- 示例代码必须使用符合真实业务场景的参数值（严禁使用 `foo`/`bar` 等无意义占位符）。


## 5. 开发约定 

- **必须**：新增页面时，**必须**同步更新 `sidebars.js` 导航配置。
- **必须**：代码示例必须引用真实的 SDK 源文件，而非伪代码。
- **必须**：使用 `<Tabs>` / `<TabItem>` 组件来展示多语言代码对比。
- **必须**：所有页面必须包含完整的 Frontmatter 元数据（`title` 和 `description`）。
- **禁止**：严禁添加了新页面文件却遗漏更新 `sidebars.js`（会导致死链或无法导航）。
- **Git 规范**：所有变更必须通过 Pull Request (PR) 提交并经过评审；**严禁**直接推送到 `main` 分支。

## 6. TRON 平台规范 

- **网络标识**：必须遵循 `tron:<network>` 格式（支持 `mainnet`, `nile`, `shasta`）。
- **签名标准**：TRON 签名必须引用 **TIP-712** 标准（请勿混淆为 EIP-712）。
- **地址格式**：Token 地址必须使用 Base58 编码格式（即以 `T` 开头的地址）。
- **节点接入**：节点访问需指向 TronGrid 端点。
- **测试示例**：Nile 测试网 USDT 地址为 `TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf`。

## 7. 关键文件与触点 

- `docs/index.md` — **着陆页 (Landing Page)**
- `docs/faq.md` — **常见问题 (FAQ)**
- `sidebars.js` — **导航配置**（新增页面时**必须**更新此文件）
- `docusaurus.config.js` — **站点主配置**
- `docs/core-concepts/*.md` — **概念性文档**
- `docs/getting-started/*.md` — **快速上手指南**（使用 Tabs 的 MDX 文件）
- `docs/sdk-features.md` — **功能矩阵**（SDK 能力发生变更时需同步更新）


## 8. 文件扩展名

- 所有文档源文件统一使用 `.md` 扩展名（Docusaurus 支持解析 `.md` 文件中的 MDX 语法）。
- 为确保最佳的编辑器兼容性，请**避免**使用 `.mdx` 扩展名。

## 9. 常见误区 

- `sidebars.js` 决定了 Docusaurus 的侧边栏结构；未在此文件中配置的页面**将不会显示**在侧边栏中。
- 页面间的内部链接引用应当**省略文件扩展名**（例如使用 `[Link](./page)` 而非 `[Link](./page.md)`）。
- TRON 地址采用 Base58 编码，**严格区分大小写**。
- 凡使用 `<Tabs>` 组件的文件，**必须**在文件顶部显式引入该组件。

## 10.提交前检查清单 

- 确保所有链接有效（无死链）。
- 确认新页面已加入 `sidebars.js` 导航配置。
- 代码示例可成功编译并运行。
- 所有页面均包含完整的 Frontmatter（`title`, `description`）。
- MDX 语法合法且无误。
- 本地执行 `yarn build` 并通过，确认无构建错误。

## 11.SDK 功能同步 

当 SDK 代码发生以下变更时，**必须**同步更新 `docs/sdk-features.md` 以反映最新状态：

- `*/mechanisms/` 目录中新增了机制。
- `*/signers/` 目录中新增了签名器。
- 客户端 (Client) 或服务端 (Server) 新增了功能特性。

**注意**：更新文档时，需同时交叉检查 **Python** 与 **TypeScript** 两个 SDK 的实现进度。


## 12.开发常用命令 

```bash
# 安装项目依赖
yarn install

# 启动本地开发服务器
yarn start

# 构建生产版本
yarn build

# 本地服务生产构建
yarn serve
```

