import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# x402 Documentation Maintenance Guidelines

## 1. Project Positioning & Core Structure

- This repository contains the documentation source code for the x402 project, built with Docusaurus.
- Documentation is primarily written in MDX / Markdown and organized via `sidebars.js`.

---

## 2. Directory Structure

- `docs/core-concepts/` — Protocol deep dives (HTTP 402, client-server model, Facilitator, wallet management, network support).
- `docs/getting-started/` — Step-by-step guides for buyers and sellers (uses `<Tabs>` for multi-language examples).
- `docs/index.md` — Landing page.
- `docs/faq.md` — Frequently Asked Questions.
- `sidebars.js` — Docusaurus sidebar configuration.
- `docusaurus.config.js` — Main Docusaurus configuration file.
- `docs/sdk-features.md` — Feature comparison matrix for Python and TypeScript SDKs.

---

## 3. Code–Documentation Synchronization Rules

Documentation must reflect code changes immediately. Follow these dependency mappings:

- Changes in `typescript/packages/` → Update TypeScript documentation.
- Changes in `python/x402/` → Update Python documentation.
- Endpoint logic changes → Update “Getting Started” guides.
- Core mechanism changes → Update `core-concepts` documentation.

---

## 4. Style & Writing Standards

- Use **Python** as the primary example language (most feature-complete SDK).
- Provide **TypeScript** examples whenever supported.
- All API examples **must include complete error handling**.
- Target audience: developers with **2–5 years of experience**.
- Use Docusaurus MDX components (`<Tabs>`, `<TabItem>`) for multi-language examples.
- Any file using Tabs **must explicitly import**:

  ```js
  import Tabs from '@theme/Tabs';
  import TabItem from '@theme/TabItem';
  ```

 - All API endpoints must provide both **success** and **error** response examples.
- Example code must use realistic, production-style parameter values (strictly no meaningless placeholders such as `foo` / `bar`).

---

## 5. Development Conventions

- **Required**: When adding a new page, you **must** update the `sidebars.js` navigation configuration.
- **Required**: Code examples must reference actual SDK source files, not pseudocode.
- **Required**: Use `<Tabs>` / `<TabItem>` components to present multi-language comparisons.
- **Required**: All pages must include complete Frontmatter metadata (`title` and `description`).
- **Prohibited**: Adding new page files without updating `sidebars.js` (this will result in dead links or inaccessible pages).
- **Git Policy**: All changes must be submitted via Pull Request (PR) and reviewed; direct pushes to the `main` branch are **strictly prohibited**.

---

## 6. Platform Standards

<Tabs>
  <TabItem value="TRON" label="TRON">

- **Network Identifier**: Must follow the `tron:<network>` format (supports `mainnet`, `nile`, `shasta`).
- **Signature Standard**: TRON signatures must reference the **TIP-712** standard (do not confuse with EIP-712).
- **Address Format**: Token addresses must use Base58 encoding (must start with `T`).
- **Node Access**: Must connect to TronGrid endpoints.
- **Test Example**: Nile testnet USDT address — `TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf`.

</TabItem>
<TabItem value="BSC" label="BSC">

- **Network Identifier**: Must follow the `eip155:<chainId>` format.
- **Signature Standard**: BSC signatures are fully compatible with Ethereum **EIP-712** (no special adaptation required; use standard EVM signing libraries).
- **Address Format**: Token addresses must use hexadecimal (Hex) format (must start with `0x`).
- **Node Access**: Must connect to EVM-compatible JSON-RPC endpoints.
- **Test Example**: BSC Testnet mock USDT address — `0x337610d27c682E347C9cD60BD4b3b107C9d34dDd`.

</TabItem>
</Tabs>

---

## 7. Key Files & Integration Points

- `docs/index.md` — **Landing Page**
- `docs/faq.md` — **FAQ**
- `sidebars.js` — **Navigation Configuration** (must be updated when adding new pages)
- `docusaurus.config.js` — **Main Site Configuration**
- `docs/core-concepts/*.md` — **Conceptual Documentation**
- `docs/getting-started/*.md` — **Quickstart Guides** (MDX files using Tabs)
- `docs/sdk-features.md` — **Feature Matrix** (must be updated when SDK capabilities change)

---

## 8. File Extensions

- All documentation source files must use the `.md` extension (Docusaurus supports MDX syntax within `.md` files).
- To ensure maximum editor compatibility, **avoid** using the `.mdx` extension.

---

## 9. Common Pitfalls

- `sidebars.js` determines the Docusaurus sidebar structure. Pages not registered in this file **will not appear** in the sidebar.
- Internal page links must **omit file extensions** (e.g., use `[Link](./page)` instead of `[Link](./page.md)`).
- TRON Base58 addresses are **case-sensitive**.
- Any file using `<Tabs>` must explicitly import the component at the top of the file.

---

## 10. Pre-Submission Checklist

- Ensure all links are valid (no broken links).
- Confirm that any new page is added to `sidebars.js`.
- Verify that code examples compile and execute successfully.
- Ensure all pages contain complete Frontmatter (`title`, `description`).
- Validate MDX syntax correctness.
- Run `yarn build` locally and confirm there are no build errors.

---

## 11. SDK Feature Synchronization

When SDK code changes in any of the following areas, you **must** update `docs/sdk-features.md` accordingly:

- New mechanisms added under the `*/mechanisms/` directory.
- New signers added under the `*/signers/` directory.
- New features introduced in the Client or Server components.

> **Note**: Always cross-check implementation progress between the **Python** and **TypeScript** SDKs when updating documentation.

---

## 12. Common Development Commands

```bash
# Install project dependencies
yarn install

# Start local development server
yarn start

# Build production version
yarn build

# Serve production build locally
yarn serve
```