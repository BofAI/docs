# 🚀 BANK OF AI

**Building a Decentralized Financial Sovereignty and Commercial Interconnection Layer for AI Agents**

[![Standard](https://img.shields.io/badge/Protocol-bankofai-blue.svg)](https://github.com/BofAI)

BANK OF AI is designed to empower AI Agents with **financial sovereignty, identity authentication, skill extensibility, and automated payment capabilities**. Through standardized protocols, we enable AI to autonomously earn income, pay for resources, and build credit on the blockchain—just like humans.

Currently supports **TRON** and **BSC**, with more blockchain networks coming in the future.

---

## 🏛️ Core Components

### 1. 💳 x402 Payment Protocol: A Programmatic Payment Standard

x402 is an open blockchain payment protocol based on the HTTP `402 Payment Required` status code. It removes payment friction in M2M (machine-to-machine) interactions for AI agents.

- **Payment-as-Response**: Enables a “pay-before-response” mechanism without complex account registration or session management.
- **Multi-Chain Support**: Currently supports **TRON** (Mainnet/Shasta/Nile) and **BSC** (Mainnet/Testnet); More blockchain networks will be supported in the future.
- **AI-Friendly**: Supports signed payloads, allowing agents to complete settlements automatically.
- **Use Cases**: Pay-per-request APIs, paywalls, and automated settlement between agents.

---

### 2. 🛠️ MCP Server & Skills: The “Hands and Brain” of Agents

Built on the Model Context Protocol (MCP) architecture, providing full on-chain execution capabilities for agents.

- **Infrastructure Layer (MCP Server)**: The agent’s **“hands and eyes.”** Provides a unified interface to read blocks, manage wallets, execute transfers, and interact with any contract.
- **Application Logic Layer (Skills)**: The agent’s **“brain.”** Uses structured instructions (`SKILL.md`) to guide AI in orchestrating underlying tools.
  - **sunswap**: Enables automated DEX swaps.
  - **wallet-cli**: Guides agents through wallet-cli for TRON accounts, transfers, signing, and on-chain operations.

---

### 3. 🧩 OpenClaw Extension: Financial Assistant for AI Agents

> For new setups, start with Skills and wallet-cli (see [Quick Start](#-quick-start)). OpenClaw remains documented for existing integrations.

OpenClaw is a financial extension plugin developed by BANK OF AI for AI agents, aiming to become the “central bank” of the agent economy.

- **Wallet Ownership**: Enables agents to truly control and manage on-chain assets.
- **Autonomous Spending**: Agents can independently pay for computation, storage, and data resources.
- **Seamless Integration**: Built-in MCP server and automatic skill installer for plug-and-play setup.

---

## 📊 Why Choose BANK OF AI?

| Feature | Traditional AI Agents | **BANK OF AI–Empowered Agents** |
| :--- | :--- | :--- |
| **Payment System** | Credit card / centralized API keys | **x402 native on-chain instant settlement** |
| **Financial Capability** | Limited, requires human pre-authorization | **Autonomous DeFi interaction (Swap/Lending)** |
| **Interaction Model** | Primarily human–machine | **A2A (Agent-to-Agent) direct settlement** |
| **Trust Mechanism** | Vendor-backed (black box) | **Public reputation & cryptographic verification (transparent)** |

---

## 🚦 Quick Start

### 🚀 For Sellers
*Want to monetize your API, content, or services?*

1. **Integrate x402**: Deploy server-side logic to detect payment requirements and return a `402` status code with payment instructions.
2. **Publish Skills**: Write a `SKILL.md` for your service so other AI agents can understand how to interact with it.

---

### 🤖 For Agents/Buyers
*Want your agent to have autonomous payment and on-chain interaction capabilities?*

1. **Install Skills**: Add the Skills your agent needs, such as `wallet-cli` or `sunswap`, from the [skills](https://github.com/BofAI/skills) repository. See the [Skills quick start](https://docs.bankofai.io/McpServer-Skills/SKILLS/QuickStart/).
2. **Set up wallet-cli**: Install wallet-cli and configure an account on your own machine. See the [wallet-cli quick start](https://docs.bankofai.io/wallet-cli/quickstart/). Never send a private key, mnemonic, or password to an AI.
3. **Start Transacting**: Your agent can now pay x402 endpoints with `wallet-cli x402 pay` and run on-chain workflows through Skills.

Already using OpenClaw or the TRON MCP Server? Their docs remain available: [OpenClaw](https://docs.bankofai.io/Openclaw-extension/Intro/) and [TRON MCP Server](https://docs.bankofai.io/McpServer-Skills/MCP/TRONMCPServer/Intro/).

---

## 🏗️ Developer Resources

- **Documentation Center**: [docs.bankofai.io](https://docs.bankofai.io)
- **Reference Examples**: [x402-examples](https://github.com/BofAI/x402/tree/main/examples/typescript)
- **Technical Support**: Submit issues or join discussions on GitHub.

---

**BANK OF AI** — *Empowering AI Agents with Financial Sovereignty.*

## Documentation site development

Use Node.js **22.23.4** (`.nvmrc`, matching CI and the Docker build) and Yarn Classic **1.22.x**. Install dependencies on the machine that runs the build; copying `node_modules` between Intel and Apple Silicon machines can break the native Chinese search tokenizer.

```bash
nvm install
nvm use
yarn install --frozen-lockfile
yarn lint
yarn typecheck
yarn test # math rendering, KaTeX and CSP security regressions
yarn build # builds English and Simplified Chinese, including search indexes
yarn serve
```

Use `yarn start` for English development or `yarn start-zh` for Chinese. OpenSSL legacy mode is no longer required.

If a build reports `Failed to load native binding` from `@node-rs/jieba`, check `node -p "process.version + ' ' + process.arch"`. An Intel (`x64`) Node cannot use an Apple Silicon (`arm64`) tokenizer package, or vice versa. Run `nvm install`, `nvm use`, then `yarn install --frozen-lockfile --force` in this directory before rebuilding. Install and build in the same terminal session, and keep optional dependencies enabled. The build now checks this binding before compiling either locale and prints these recovery steps if it cannot load.

Keep all official `@docusaurus/*` packages on **3.10.2** together. The site uses React 18, MDX 3, TypeScript 5.9 and `@easyops-cn/docusaurus-search-local` 0.55.3. When changing the framework or search theme, check both locales, all three documentation sections, sidebar navigation, search results and legacy redirects. Markdown links remain strict build errors.

KaTeX is pinned to **0.19.1**, including the transitive copy used by `rehype-katex`. The latter still declares KaTeX 0.16.x, which is affected by [GHSA-238p-pmpm-9mq7](https://github.com/KaTeX/KaTeX/security/advisories/GHSA-238p-pmpm-9mq7). Keep this override until the upstream plugin supports a patched release, and verify inline/display equations and untrusted commands when updating it. CSS and fonts are bundled from the same installed KaTeX package.

The other Yarn `resolutions` apply security fixes beyond upstream dependency ranges: Tinypool 2.2.0 (worker options), serialize-javascript 7.1.4 (serialization), UUID 11.1.1 **only under SockJS** (buffer bounds), and minimatch 11.0.7 **only under typescript-estree** (glob amplification). Keep their scopes narrow and recheck a build with `DOCUSAURUS_SSG_WORKER_THREAD_COUNT=2`, lint, type checking and the development server when changing them. Yarn's range warnings for these reviewed overrides are expected.

The site explicitly loads the official docs, pages, debug and sitemap plugins and the classic theme instead of `@docusaurus/preset-classic`. This removes the unused SVGR dependency chain containing `deepmerge` ([GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4), no patched release as of November 11, 2026). SVG files remain supported as ordinary images; SVG-to-React component imports are not used by this site. Do not reintroduce the preset or SVGR without checking this dependency. Verify with `yarn audit` after updating dependencies.

### Production security checks

`yarn build` also generates `.site-security/nginx-headers.conf` from the emitted HTML. Docker copies this policy outside the public document root and runs `nginx -t`. The CSP allows the exact inline script hashes needed for theme initialization and legacy redirects, while blocking other inline scripts, event handlers, external scripts, embedding and plugins. React/KaTeX inline styles remain allowed. Fonts and KaTeX assets are served locally; existing ReadMe-hosted screenshots are allowed only from `files.readme.io`.

Nginx applies the security headers to all responses, including localized 404 pages, disables version disclosure and directory listings, and returns relative redirects. HTML responses use `Cache-Control: no-store`. When serving the build outside this Docker image, apply the generated policy and equivalent response headers at the actual host. Security settings in this repository take effect on the live site only after deployment.

Both image-publishing workflows require the same dependency audit (all severities), lint, type checks and security regression tests. Actions are pinned to verified commit SHAs, checkout credentials are not persisted, and build jobs pull current base images. Each workflow builds and loads one image, scans its runtime packages with pinned Grype (including findings without fixes), and runs `scripts/check-http-security.mjs` against the running container before authenticating to Docker Hub and pushing that same image. Any reported vulnerability at negligible severity or above, scanner failure, or failed HTTP check blocks publishing. Production CDN/TLS settings still require verification after deployment.
